import React from 'react';

interface SkeletonLoaderProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'card' | 'table-row' | 'vendor-card';
  width?: string | number;
  height?: string | number;
  lines?: number;
}

export function SkeletonLoader({ 
  className = '', 
  variant = 'rectangular',
  width,
  height,
  lines = 1 
}: SkeletonLoaderProps) {
  const baseClasses = 'animate-pulse bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800';

  if (variant === 'text') {
    return (
      <div className={`${baseClasses} ${className} h-4 w-full rounded`} />
    );
  }

  if (variant === 'circular') {
    const size = width || height || 40;
    return (
      <div 
        className={`${baseClasses} ${className} rounded-full`}
        style={{ width: typeof size === 'number' ? `${size}px` : size, height: typeof size === 'number' ? `${size}px` : height }}
      />
    );
  }

  if (variant === 'card') {
    return (
      <div className={`${baseClasses} ${className} rounded-xl`} style={{ width: width || '100%', height: height || '120px' }} />
    );
  }

  if (variant === 'table-row') {
    return (
      <div className={`${baseClasses} ${className} w-full`}>
        <div className="flex gap-4">
          <div className="h-4 w-16 rounded" />
          <div className="h-4 w-24 rounded" />
          <div className="h-4 w-20 rounded" />
          <div className="h-4 w-16 rounded" />
          <div className="h-4 w-24 rounded" />
        </div>
      </div>
    );
  }

  if (variant === 'vendor-card') {
    return (
      <div className={`${baseClasses} ${className} rounded-xl`} style={{ height: height || '180px' }}>
        <div className="flex gap-3 p-5">
          <div className="h-12 w-12 rounded-lg bg-slate-700" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-3/4 rounded" />
            <div className="h-3 w-1/2 rounded" />
          </div>
        </div>
      </div>
    );
  }

  // Default rectangular skeleton with multiple lines
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={`${baseClasses} rounded`}
          style={{
            width: width || (index === 0 ? '100%' : `${Math.random() * 60 + 40}%`),
            height: height || '16px'
          }}
        />
      ))}
    </div>
  );
}

// Pre-configured skeleton components
export function TextSkeleton({ className = '' }: { className?: string }) {
  return <SkeletonLoader variant="text" className={className} />;
}

export function CardSkeleton({ className = '', width, height }: { className?: string; width?: string | number; height?: string | number }) {
  return <SkeletonLoader variant="card" className={className} width={width} height={height} />;
}

export function VendorCardSkeleton({ className = '' }: { className?: string }) {
  return <SkeletonLoader variant="vendor-card" className={className} />;
}

export function TableRowSkeleton({ className = '' }: { className?: string }) {
  return <SkeletonLoader variant="table-row" className={className} />;
}

export function CircularSkeleton({ className = '', size = 40 }: { className?: string; size?: number }) {
  return <SkeletonLoader variant="circular" className={className} width={size} height={size} />;
}
