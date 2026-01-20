'use client';

import React from 'react';

/**
 * Reusable animation classes and components for micro-interactions
 */

export const AnimationClasses = {
  // Fade animations
  fadeIn: 'animate-in fade-in duration-300',
  fadeOut: 'animate-out fade-out duration-300',
  
  // Slide animations
  slideInFromLeft: 'animate-in slide-in-from-left duration-300',
  slideInFromRight: 'animate-in slide-in-from-right duration-300',
  slideInFromTop: 'animate-in slide-in-from-top duration-300',
  slideInFromBottom: 'animate-in slide-in-from-bottom duration-300',
  
  // Scale animations
  scaleIn: 'animate-in zoom-in duration-300',
  scaleOut: 'animate-out zoom-out duration-300',
  
  // Bounce animations
  bounce: 'animate-bounce',
  pulse: 'animate-pulse',
  
  // Spin animations
  spin: 'animate-spin',
  
  // Transition utilities
  smoothTransition: 'transition-all duration-300 ease-in-out',
  hoverScale: 'hover:scale-105 transition-transform duration-200',
  hoverShadow: 'hover:shadow-lg transition-shadow duration-200',
  hoverBrighten: 'hover:brightness-110 transition-all duration-200',
};

interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  loading?: boolean;
}

export function AnimatedButton({
  children,
  variant = 'primary',
  loading = false,
  className = '',
  disabled,
  ...props
}: AnimatedButtonProps) {
  const baseClasses = 'inline-flex items-center gap-2 rounded-lg font-medium transition-all duration-200 active:scale-95';
  
  const variantClasses = {
    primary: 'bg-sky-500 text-slate-950 hover:bg-sky-400 disabled:opacity-50',
    secondary: 'bg-slate-800 text-slate-200 hover:bg-slate-700 disabled:opacity-50',
    danger: 'bg-red-500 text-white hover:bg-red-600 disabled:opacity-50',
  };

  return (
    <button
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {loading && (
        <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {children}
    </button>
  );
}

interface AnimatedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hover?: boolean;
}

export function AnimatedCard({
  children,
  hover = true,
  className = '',
  ...props
}: AnimatedCardProps) {
  return (
    <div
      className={`
        rounded-xl border border-slate-800 bg-slate-900/40 p-5
        transition-all duration-300
        ${hover ? 'hover:border-slate-700 hover:bg-slate-900/60 hover:shadow-lg' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}

interface AnimatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function AnimatedInput({
  label,
  error,
  className = '',
  ...props
}: AnimatedInputProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-slate-300">
          {label}
        </label>
      )}
      <input
        className={`
          w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3
          text-sm text-slate-50 placeholder-slate-500
          transition-all duration-200
          focus:border-sky-500 focus:ring-1 focus:ring-sky-500/20
          ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="animate-in fade-in text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export function LoadingSpinner({ size = 'md', text }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <svg className={`${sizeClasses[size]} animate-spin text-sky-500`} fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
      {text && <p className="text-sm text-slate-400">{text}</p>}
    </div>
  );
}

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
}

export function FadeIn({ children, delay = 0, duration = 300 }: FadeInProps) {
  return (
    <div
      className="animate-in fade-in"
      style={{
        animationDelay: `${delay}ms`,
        animationDuration: `${duration}ms`,
      }}
    >
      {children}
    </div>
  );
}

interface SlideInProps {
  children: React.ReactNode;
  direction?: 'left' | 'right' | 'up' | 'down';
  delay?: number;
  duration?: number;
}

export function SlideIn({
  children,
  direction = 'up',
  delay = 0,
  duration = 300,
}: SlideInProps) {
  const directionMap = {
    left: 'slide-in-from-left',
    right: 'slide-in-from-right',
    up: 'slide-in-from-bottom',
    down: 'slide-in-from-top',
  };

  return (
    <div
      className={`animate-in ${directionMap[direction]}`}
      style={{
        animationDelay: `${delay}ms`,
        animationDuration: `${duration}ms`,
      }}
    >
      {children}
    </div>
  );
}

/**
 * CSS animations to add to global styles
 */
export const globalAnimationStyles = `
  @keyframes shimmer {
    0% {
      background-position: -1000px 0;
    }
    100% {
      background-position: 1000px 0;
    }
  }

  .animate-shimmer {
    animation: shimmer 2s infinite;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.1) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    background-size: 1000px 100%;
  }

  @keyframes float {
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-10px);
    }
  }

  .animate-float {
    animation: float 3s ease-in-out infinite;
  }

  @keyframes glow {
    0%, 100% {
      box-shadow: 0 0 5px rgba(14, 165, 233, 0.5);
    }
    50% {
      box-shadow: 0 0 20px rgba(14, 165, 233, 0.8);
    }
  }

  .animate-glow {
    animation: glow 2s ease-in-out infinite;
  }
`;
