import React from 'react';
import { LucideIcon } from 'lucide-react';
import clsx from 'clsx';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  variant?: 'purple' | 'green' | 'amber' | 'rose' | 'blue' | 'cyan';
  className?: string;
}

const variantStyles = {
  cyan: {
    bg: 'bg-[#111827]',
    border: 'border-cyan-500/30 hover:border-cyan-400/60',
    text: 'text-cyan-400',
    iconBg: 'bg-cyan-950/60 border border-cyan-500/30 text-cyan-300',
    glow: 'group-hover:shadow-[0_0_20px_rgba(0,242,254,0.15)]',
  },
  purple: {
    bg: 'bg-[#111827]',
    border: 'border-purple-500/30 hover:border-purple-400/60',
    text: 'text-purple-400',
    iconBg: 'bg-purple-950/60 border border-purple-500/30 text-purple-300',
    glow: 'group-hover:shadow-[0_0_20px_rgba(168,85,247,0.15)]',
  },
  green: {
    bg: 'bg-[#111827]',
    border: 'border-emerald-500/30 hover:border-emerald-400/60',
    text: 'text-emerald-400',
    iconBg: 'bg-emerald-950/60 border border-emerald-500/30 text-emerald-300',
    glow: 'group-hover:shadow-[0_0_20px_rgba(16,185,129,0.15)]',
  },
  amber: {
    bg: 'bg-[#111827]',
    border: 'border-amber-500/30 hover:border-amber-400/60',
    text: 'text-amber-400',
    iconBg: 'bg-amber-950/60 border border-amber-500/30 text-amber-300',
    glow: 'group-hover:shadow-[0_0_20px_rgba(245,158,11,0.15)]',
  },
  rose: {
    bg: 'bg-[#111827]',
    border: 'border-rose-500/30 hover:border-rose-400/60',
    text: 'text-rose-400',
    iconBg: 'bg-rose-950/60 border border-rose-500/30 text-rose-300',
    glow: 'group-hover:shadow-[0_0_20px_rgba(244,63,94,0.15)]',
  },
  blue: {
    bg: 'bg-[#111827]',
    border: 'border-sky-500/30 hover:border-sky-400/60',
    text: 'text-sky-400',
    iconBg: 'bg-sky-950/60 border border-sky-500/30 text-sky-300',
    glow: 'group-hover:shadow-[0_0_20px_rgba(56,189,248,0.15)]',
  },
};

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = 'cyan',
  className,
}) => {
  const styles = variantStyles[variant];

  return (
    <div
      className={clsx(
        'group rounded-2xl border p-5 transition-all duration-200 flex items-start justify-between relative overflow-hidden shadow-lg',
        styles.bg,
        styles.border,
        styles.glow,
        className
      )}
    >
      <div className="flex flex-col z-10">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
          {title}
        </span>
        <div className="text-2xl lg:text-3xl font-black text-white tracking-tight">
          {value}
        </div>
        {subtitle && (
          <span className="text-xs text-slate-400 mt-1 font-medium">
            {subtitle}
          </span>
        )}
      </div>
      <div
        className={clsx(
          'p-3 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-xs',
          styles.iconBg
        )}
      >
        <Icon className="w-5 h-5" />
      </div>
    </div>
  );
};
