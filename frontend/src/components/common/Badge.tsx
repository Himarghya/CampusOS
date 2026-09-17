import React from 'react';
import clsx from 'clsx';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'neutral' | 'purple' | 'cyan';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  className,
}) => {
  const variantStyles = {
    cyan: 'bg-cyan-950/60 text-cyan-300 border-cyan-500/40 shadow-xs',
    primary: 'bg-indigo-950/60 text-indigo-300 border-indigo-500/40',
    success: 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40',
    warning: 'bg-amber-950/60 text-amber-300 border-amber-500/40',
    danger: 'bg-rose-950/60 text-rose-300 border-rose-500/40',
    neutral: 'bg-slate-800/80 text-slate-300 border-slate-700',
    purple: 'bg-purple-950/60 text-purple-300 border-purple-500/40',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider',
    md: 'px-2.5 py-1 text-xs font-bold',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-lg border backdrop-blur-xs',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {children}
    </span>
  );
};
