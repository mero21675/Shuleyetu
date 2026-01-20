# Quick Start Implementation Guide
## Copy-Paste Ready Code & Step-by-Step Instructions

---

## PHASE 1: Day 1 - Rate Limiting

### Step 1: Install Dependencies
```bash
npm install express-rate-limit redis
npm install --save-dev @types/express-rate-limit
```

### Step 2: Create Rate Limiting Middleware
**File**: `src/middleware/rateLimit.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

interface RateLimitConfig {
  windowMs: number; // Time window in ms
  maxRequests: number; // Max requests per window
  keyPrefix: string;
}

async function checkRateLimit(
  key: string,
  config: RateLimitConfig
): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
  try {
    const fullKey = `${config.keyPrefix}:${key}`;
    const current = await redis.incr(fullKey);
    
    if (current === 1) {
      await redis.expire(fullKey, Math.ceil(config.windowMs / 1000));
    }

    const remaining = Math.max(0, config.maxRequests - current);
    const resetTime = await redis.ttl(fullKey);

    return {
      allowed: current <= config.maxRequests,
      remaining,
      resetTime: resetTime * 1000,
    };
  } catch (error) {
    console.error('Rate limit check failed:', error);
    return { allowed: true, remaining: config.maxRequests, resetTime: 0 };
  }
}

export async function withRateLimit(
  request: NextRequest,
  config: RateLimitConfig
) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  const result = await checkRateLimit(ip, config);

  const headers = new Headers();
  headers.set('X-RateLimit-Limit', config.maxRequests.toString());
  headers.set('X-RateLimit-Remaining', result.remaining.toString());
  headers.set('X-RateLimit-Reset', Math.ceil(result.resetTime / 1000).toString());

  if (!result.allowed) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429, headers }
    );
  }

  return null;
}

export const rateLimitConfigs = {
  general: { windowMs: 15 * 60 * 1000, maxRequests: 100, keyPrefix: 'rl:general' },
  auth: { windowMs: 15 * 60 * 1000, maxRequests: 5, keyPrefix: 'rl:auth' },
  payment: { windowMs: 15 * 60 * 1000, maxRequests: 10, keyPrefix: 'rl:payment' },
};
```

### Step 3: Apply to API Routes
**File**: `src/app/api/orders/route.ts` (example)

```typescript
import { NextRequest } from 'next/server';
import { withRateLimit, rateLimitConfigs } from '@/middleware/rateLimit';

export async function POST(request: NextRequest) {
  const rateLimitError = await withRateLimit(request, rateLimitConfigs.general);
  if (rateLimitError) return rateLimitError;

  // Your existing code here
}
```

### Step 4: Test Rate Limiting
```bash
# Test endpoint 101 times - should fail on 101st
for i in {1..101}; do curl http://localhost:3000/api/orders; done
```

---

## PHASE 1: Day 2 - Error Tracking with Sentry

### Step 1: Install Sentry
```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

### Step 2: Configure Sentry
**File**: `sentry.config.ts`

```typescript
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  integrations: [
    new Sentry.Replay({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});
```

### Step 3: Update next.config.js
```javascript
const { withSentryConfig } = require('@sentry/nextjs');

const nextConfig = {
  // your existing config
};

module.exports = withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
});
```

### Step 4: Add Error Boundary
**File**: `src/app/error.tsx`

```typescript
'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h2 className="text-2xl font-bold">Something went wrong!</h2>
      <button
        onClick={() => reset()}
        className="px-4 py-2 bg-sky-500 text-white rounded"
      >
        Try again
      </button>
    </div>
  );
}
```

### Step 5: Set Environment Variables
```bash
# .env.local
SENTRY_DSN=https://your-key@sentry.io/your-project
SENTRY_ORG=your-org
SENTRY_PROJECT=your-project
SENTRY_AUTH_TOKEN=your-token
```

---

## PHASE 1: Day 3 - Health Check Endpoint

### Step 1: Create Health Check Route
**File**: `src/app/api/health/route.ts`

```typescript
import { NextResponse } from 'next/server';
import { supabaseServerClient } from '@/lib/supabaseServer';

export async function GET() {
  const startTime = Date.now();

  try {
    // Check database connectivity
    const { data, error } = await supabaseServerClient
      .from('vendors')
      .select('id')
      .limit(1);

    if (error) throw error;

    const responseTime = Date.now() - startTime;

    return NextResponse.json(
      {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        responseTime: `${responseTime}ms`,
        version: process.env.APP_VERSION || '1.0.0',
        environment: process.env.NODE_ENV,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Health check failed:', error);
    return NextResponse.json(
      {
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}
```

### Step 2: Create Status Page
**File**: `src/app/status/page.tsx`

```typescript
'use client';

import { useEffect, useState } from 'react';

export default function StatusPage() {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await fetch('/api/health');
        const data = await response.json();
        setStatus(data);
      } catch (error) {
        setStatus({ status: 'error', error: String(error) });
      } finally {
        setLoading(false);
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Shuleyetu Status</h1>
      <div className="bg-slate-900 p-4 rounded">
        <p className="text-lg">
          Status:{' '}
          <span
            className={
              status?.status === 'healthy' ? 'text-green-400' : 'text-red-400'
            }
          >
            {status?.status}
          </span>
        </p>
        <pre className="mt-4 text-sm">{JSON.stringify(status, null, 2)}</pre>
      </div>
    </div>
  );
}
```

---

## PHASE 2: Days 4-5 - E2E Tests with Playwright

### Step 1: Install Playwright
```bash
npm install --save-dev @playwright/test
npx playwright install
```

### Step 2: Create Playwright Config
**File**: `playwright.config.ts`

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

### Step 3: Create Test Fixtures
**File**: `tests/e2e/fixtures.ts`

```typescript
import { test as base } from '@playwright/test';

export const test = base.extend({
  authenticatedPage: async ({ page }, use) => {
    // Login before test
    await page.goto('/auth/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForNavigation();
    
    await use(page);
  },
});

export { expect } from '@playwright/test';
```

### Step 4: Create Critical Flow Tests
**File**: `tests/e2e/customer-order.spec.ts`

```typescript
import { test, expect } from './fixtures';

test.describe('Customer Order Flow', () => {
  test('should create order successfully', async ({ page }) => {
    // Navigate to vendors
    await page.goto('/vendors');
    expect(await page.locator('text=Browse Vendors').isVisible()).toBeTruthy();

    // Select vendor
    await page.click('text=First Vendor');
    await page.waitForNavigation();

    // Add item to order
    await page.click('button:has-text("Order from this vendor")');
    await page.waitForNavigation();

    // Fill customer info
    await page.fill('input[name="customerName"]', 'John Doe');
    await page.fill('input[name="customerPhone"]', '0712345678');
    await page.click('button:has-text("Next")');

    // Review and submit
    await page.click('button:has-text("Submit Order")');
    
    // Verify success
    expect(await page.locator('text=Order created successfully').isVisible()).toBeTruthy();
  });
});
```

### Step 5: Run Tests
```bash
# Run all tests
npx playwright test

# Run specific test
npx playwright test customer-order

# Run with UI
npx playwright test --ui

# Debug mode
npx playwright test --debug
```

---

## PHASE 2: Days 6-7 - CI/CD Pipeline

### Step 1: Create Test Workflow
**File**: `.github/workflows/test.yml`

```yaml
name: Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm ci
      
      - run: npm run lint
      
      - run: npm run test
      
      - run: npm run test:e2e
      
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

### Step 2: Create Deploy Workflow
**File**: `.github/workflows/deploy.yml`

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm ci
      
      - run: npm run build
      
      - name: Deploy to Production
        run: |
          npm run deploy
        env:
          DEPLOYMENT_KEY: ${{ secrets.DEPLOYMENT_KEY }}
```

### Step 3: Add npm Scripts
**File**: `package.json`

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint src --max-warnings 0",
    "test": "vitest",
    "test:e2e": "playwright test",
    "test:coverage": "vitest --coverage",
    "deploy": "vercel --prod"
  }
}
```

---

## PHASE 3: Day 8 - CSRF Protection

### Step 1: Install CSRF Package
```bash
npm install csrf
npm install --save-dev @types/csrf
```

### Step 2: Create CSRF Middleware
**File**: `src/middleware/csrf.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { CSRF } from 'csrf';

const csrf = new CSRF();

export async function generateCSRFToken(): Promise<string> {
  const secret = process.env.CSRF_SECRET || 'your-secret-key';
  return csrf.create(secret);
}

export async function verifyCSRFToken(
  token: string,
  request: NextRequest
): Promise<boolean> {
  const secret = process.env.CSRF_SECRET || 'your-secret-key';
  return csrf.verify(secret, token);
}
```

### Step 3: Add CSRF to Forms
**File**: `src/components/ui/FormField.tsx` (update)

```typescript
'use client';

import { useEffect, useState } from 'react';

interface FormFieldProps {
  // ... existing props
  csrfToken?: string;
}

export function FormField({ csrfToken, ...props }: FormFieldProps) {
  return (
    <>
      {csrfToken && (
        <input type="hidden" name="_csrf" value={csrfToken} />
      )}
      {/* ... existing form field code */}
    </>
  );
}
```

### Step 4: Verify CSRF on API Routes
**File**: `src/app/api/orders/route.ts` (update)

```typescript
import { verifyCSRFToken } from '@/middleware/csrf';

export async function POST(request: NextRequest) {
  const body = await request.json();
  
  // Verify CSRF token
  const csrfToken = body._csrf;
  if (!csrfToken || !(await verifyCSRFToken(csrfToken, request))) {
    return NextResponse.json(
      { error: 'Invalid CSRF token' },
      { status: 403 }
    );
  }

  // Your existing code here
}
```

---

## PHASE 3: Day 9 - Database Optimization

### Step 1: Create Migration File
**File**: `supabase/migrations/add_indexes.sql`

```sql
-- Add indexes for frequently queried columns
CREATE INDEX IF NOT EXISTS idx_orders_vendor_id ON orders(vendor_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer_phone ON orders(customer_phone);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_inventory_vendor_id ON inventory(vendor_id);
CREATE INDEX IF NOT EXISTS idx_inventory_category ON inventory(category);

-- Add composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_orders_vendor_created ON orders(vendor_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inventory_vendor_category ON inventory(vendor_id, category);
```

### Step 2: Apply Migration
```bash
# Using Supabase CLI
supabase migration up

# Or manually in Supabase dashboard
# Copy and paste the SQL above
```

### Step 3: Optimize N+1 Queries
**File**: `src/app/dashboard/page.tsx` (example)

```typescript
// Before: N+1 query
const orders = await supabaseClient.from('orders').select('*');
for (const order of orders) {
  const vendor = await supabaseClient
    .from('vendors')
    .select('name')
    .eq('id', order.vendor_id)
    .single();
}

// After: Single query with join
const ordersWithVendors = await supabaseClient
  .from('orders')
  .select('*, vendors(name)')
  .order('created_at', { ascending: false });
```

---

## PHASE 4: Days 10-14 - Documentation & Testing

### Step 1: Privacy Policy Template
**File**: `src/app/privacy/page.tsx`

```typescript
export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Data Collection</h2>
        <p>We collect the following information:</p>
        <ul className="list-disc ml-6">
          <li>Name and contact information</li>
          <li>Order history</li>
          <li>Payment information</li>
          <li>Device and usage data</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Data Usage</h2>
        <p>We use your data to:</p>
        <ul className="list-disc ml-6">
          <li>Process orders</li>
          <li>Improve our service</li>
          <li>Send notifications</li>
          <li>Prevent fraud</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Your Rights</h2>
        <p>You have the right to:</p>
        <ul className="list-disc ml-6">
          <li>Access your data</li>
          <li>Delete your data</li>
          <li>Opt-out of communications</li>
          <li>Data portability</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2">Contact</h2>
        <p>Email: privacy@shuleyetu.com</p>
      </section>
    </div>
  );
}
```

### Step 2: Load Testing Script
**File**: `tests/load/order-creation.js`

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 100 },
    { duration: '5m', target: 100 },
    { duration: '2m', target: 200 },
    { duration: '5m', target: 200 },
    { duration: '2m', target: 0 },
  ],
};

export default function () {
  const url = 'http://localhost:3000/api/orders';
  const payload = JSON.stringify({
    vendor_id: 'vendor-1',
    customer_name: 'Test Customer',
    customer_phone: '0712345678',
    items: [{ id: 'item-1', quantity: 2 }],
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const res = http.post(url, payload, params);

  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });

  sleep(1);
}
```

### Step 3: Run Load Test
```bash
# Install k6
brew install k6

# Run load test
k6 run tests/load/order-creation.js

# With output
k6 run tests/load/order-creation.js --out json=results.json
```

---

## Daily Execution Checklist

### Day 1 Checklist
- [ ] Rate limiting installed and configured
- [ ] Rate limiting applied to all API routes
- [ ] Rate limiting tested
- [ ] Redis connection verified

### Day 2 Checklist
- [ ] Sentry installed and configured
- [ ] Error boundary added
- [ ] Sentry alerts configured
- [ ] Test error capture

### Day 3 Checklist
- [ ] Health check endpoint created
- [ ] Status page created
- [ ] Health check tested
- [ ] Monitoring tools configured

### Days 4-5 Checklist
- [ ] Playwright installed
- [ ] Test fixtures created
- [ ] Critical flow tests written
- [ ] All tests passing
- [ ] Test reports generated

### Days 6-7 Checklist
- [ ] GitHub Actions workflows created
- [ ] CI pipeline working
- [ ] CD pipeline working
- [ ] Deployments automated

### Day 8 Checklist
- [ ] CSRF middleware created
- [ ] CSRF tokens added to forms
- [ ] CSRF verification on API routes
- [ ] CSRF protection tested

### Day 9 Checklist
- [ ] Database indexes created
- [ ] N+1 queries optimized
- [ ] Query performance improved
- [ ] Cache layer configured

### Days 10-14 Checklist
- [ ] Privacy policy published
- [ ] Terms of service published
- [ ] Deployment guide written
- [ ] Monitoring dashboard active
- [ ] Load testing completed
- [ ] Security audit passed
- [ ] Team trained
- [ ] Launch checklist completed

---

## Quick Commands Reference

```bash
# Install all dependencies
npm install

# Run development server
npm run dev

# Run tests
npm run test
npm run test:e2e
npm run test:coverage

# Build for production
npm run build

# Deploy
npm run deploy

# Check rate limiting
curl -H "X-Forwarded-For: 127.0.0.1" http://localhost:3000/api/health

# Check health
curl http://localhost:3000/api/health

# Run load test
k6 run tests/load/order-creation.js

# View Playwright report
npx playwright show-report
```

---

## Troubleshooting

### Rate Limiting Not Working
- Check Redis connection
- Verify environment variables
- Check rate limit headers in response

### E2E Tests Failing
- Check if dev server is running
- Clear browser cache
- Run with `--debug` flag
- Check Playwright reports

### CI/CD Not Deploying
- Check GitHub Actions logs
- Verify secrets are set
- Check deployment credentials
- Review workflow file syntax

### Database Queries Slow
- Check if indexes are created
- Review query plans in Supabase
- Check for N+1 queries
- Monitor database load

---

## Success Indicators

✅ **By Day 3**: Rate limiting, error tracking, health checks working
✅ **By Day 7**: E2E tests passing, CI/CD automated
✅ **By Day 9**: CSRF protection, database optimized
✅ **By Day 14**: All critical issues fixed, ready for launch

---

**You're ready to execute! Start with Day 1 and follow the checklist. Good luck! 🚀**
