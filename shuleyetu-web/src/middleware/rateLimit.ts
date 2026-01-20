import { NextRequest, NextResponse } from 'next/server';

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  keyPrefix: string;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
  retryAfter?: number;
}

// In-memory store for rate limiting (for development)
// In production, use Redis
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function cleanupExpiredEntries() {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (value.resetTime < now) {
      rateLimitStore.delete(key);
    }
  }
}

async function checkRateLimit(
  key: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  try {
    cleanupExpiredEntries();
    
    const fullKey = `${config.keyPrefix}:${key}`;
    const now = Date.now();
    const entry = rateLimitStore.get(fullKey);

    if (!entry || entry.resetTime < now) {
      // New window
      rateLimitStore.set(fullKey, {
        count: 1,
        resetTime: now + config.windowMs,
      });
      return {
        allowed: true,
        remaining: config.maxRequests - 1,
        resetTime: now + config.windowMs,
      };
    }

    // Existing window
    const current = entry.count + 1;
    entry.count = current;

    const remaining = Math.max(0, config.maxRequests - current);
    const allowed = current <= config.maxRequests;

    return {
      allowed,
      remaining,
      resetTime: entry.resetTime,
      retryAfter: allowed ? undefined : Math.ceil((entry.resetTime - now) / 1000),
    };
  } catch (error) {
    console.error('Rate limit check failed:', error);
    return {
      allowed: true,
      remaining: config.maxRequests,
      resetTime: Date.now() + config.windowMs,
    };
  }
}

export async function withRateLimit(
  request: NextRequest,
  config: RateLimitConfig
): Promise<NextResponse | null> {
  const ip = request.headers.get('x-forwarded-for') || 
             request.headers.get('x-real-ip') || 
             'unknown';
  
  const result = await checkRateLimit(ip, config);

  const headers = new Headers();
  headers.set('X-RateLimit-Limit', config.maxRequests.toString());
  headers.set('X-RateLimit-Remaining', result.remaining.toString());
  headers.set('X-RateLimit-Reset', Math.ceil(result.resetTime / 1000).toString());

  if (!result.allowed) {
    if (result.retryAfter) {
      headers.set('Retry-After', result.retryAfter.toString());
    }
    return NextResponse.json(
      { 
        error: 'Too many requests',
        retryAfter: result.retryAfter,
      },
      { status: 429, headers }
    );
  }

  return null;
}

export const rateLimitConfigs = {
  general: { 
    windowMs: 15 * 60 * 1000, 
    maxRequests: 100, 
    keyPrefix: 'rl:general' 
  },
  auth: { 
    windowMs: 15 * 60 * 1000, 
    maxRequests: 5, 
    keyPrefix: 'rl:auth' 
  },
  payment: { 
    windowMs: 15 * 60 * 1000, 
    maxRequests: 10, 
    keyPrefix: 'rl:payment' 
  },
  health: {
    windowMs: 60 * 1000,
    maxRequests: 1000,
    keyPrefix: 'rl:health'
  },
};
