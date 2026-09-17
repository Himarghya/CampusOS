import React from 'react';
import clsx from 'clsx';
import { LucideIcon } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'cyan' | 'purple';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'cyan',
  size = 'md',
  icon: Icon,
  loading = false,
  className,
  disabled,
  ...props
}) => {
  const variantStyles = {
    cyan: 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold shadow-md shadow-cyan-500/25 border border-cyan-400/50',
    primary: 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 border border-indigo-400/30 font-bold',
    purple: 'bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-600/30 border border-purple-400/30 font-bold',
    secondary: 'bg-[#162032] hover:bg-[#1E2C44] text-slate-200 border border-slate-700/80 font-semibold',
    outline: 'border border-cyan-500/40 text-cyan-300 hover:bg-cyan-950/40 bg-transparent font-semibold',
    danger: 'bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/30 border border-rose-400/30 font-bold',
    ghost: 'text-slate-300 hover:text-white hover:bg-slate-800/60 border border-transparent font-semibold',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs font-semibold rounded-xl gap-1.5',
    md: 'px-4 py-2 text-xs font-bold rounded-xl gap-2',
    lg: 'px-5 py-2.5 text-sm font-bold rounded-xl gap-2.5',
  };

  return (
    <button
      disabled={disabled || loading}
      className={clsx(
        'inline-flex items-center justify-center transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer select-none',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        Icon && <Icon className="w-4 h-4" />
      )}
      {children}
    </button>
  );
};
