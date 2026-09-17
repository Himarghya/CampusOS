import React from 'react';
import { LucideIcon } from 'lucide-react';
import clsx from 'clsx';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  variant?: 'purple' | 'green' | 'amber' | 'rose' | 'blue';
  className?: string;
}

const variantStyles = {
  purple: {
    bg: 'bg-[#F5F3FF]',
    border: 'border-[#DDD6FE]',
    text: 'text-[#6D28D9]',
    iconBg: 'bg-[#EDE9FE]',
    iconColor: 'text-[#7C3AED]',
  },
  green: {
    bg: 'bg-[#ECFDF5]',
    border: 'border-[#A7F3D0]',
    text: 'text-[#047857]',
    iconBg: 'bg-[#D1FAE5]',
    iconColor: 'text-[#059669]',
  },
  amber: {
    bg: 'bg-[#FFFBEB]',
    border: 'border-[#FDE68A]',
    text: 'text-[#B45309]',
    iconBg: 'bg-[#FEF3C7]',
    iconColor: 'text-[#D97706]',
  },
  rose: {
    bg: 'bg-[#FFF1F2]',
    border: 'border-[#FECDD3]',
    text: 'text-[#BE123C]',
    iconBg: 'bg-[#FFE4E6]',
    iconColor: 'text-[#E11D48]',
  },
  blue: {
    bg: 'bg-[#EFF6FF]',
    border: 'border-[#BFDBFE]',
    text: 'text-[#1D4ED8]',
    iconBg: 'bg-[#DBEAFE]',
    iconColor: 'text-[#2563EB]',
  },
};

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = 'purple',
  className,
}) => {
  const styles = variantStyles[variant];

  return (
    <div
      className={clsx(
        'rounded-2xl border p-5 transition-all duration-200 hover:shadow-card-hover flex items-start justify-between relative overflow-hidden',
        styles.bg,
        styles.border,
        className
      )}
    >
      <div className="flex flex-col z-10">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
          {title}
        </span>
        <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
          {value}
        </div>
        {subtitle && (
          <span className="text-xs text-slate-500 mt-1 font-medium">
            {subtitle}
          </span>
        )}
      </div>
      <div
        className={clsx(
          'p-3 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110',
          styles.iconBg,
          styles.iconColor
        )}
      >
        <Icon className="w-6 h-6" />
      </div>
    </div>
  );
};
