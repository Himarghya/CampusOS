import React from 'react';
import clsx from 'clsx';

export const LoadingSkeleton: React.FC<{ rows?: number; className?: string }> = ({
  rows = 4,
  className,
}) => {
  return (
    <div className={clsx('space-y-3 animate-pulse', className)}>
      <div className="h-8 bg-slate-200 rounded-xl w-1/3 mb-4" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-16 bg-slate-100 rounded-2xl w-full" />
      ))}
    </div>
  );
};
