import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  accentColor?: 'blue' | 'emerald' | 'amber' | 'purple' | 'slate';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  accentColor = 'slate',
}) => {
  const accentStyles = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
    slate: 'bg-slate-100 text-slate-600 border-slate-200',
  }[accentColor];

  return (
    <div className="bg-white border border-slate-200/90 rounded-xl p-4.5 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between group">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 font-mono">
          {title}
        </span>
        <div className={`p-2 rounded-lg border ${accentStyles} transition-transform group-hover:scale-105`}>
          <Icon className="w-4 h-4 stroke-[2]" />
        </div>
      </div>

      <div className="mt-3 flex items-baseline justify-between">
        <h3 className="text-2xl font-bold text-slate-900 tracking-tight font-mono tabular-nums">
          {value}
        </h3>
        {trend && (
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
              trend.isPositive
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-rose-50 text-rose-700 border-rose-200'
            }`}
          >
            {trend.isPositive ? '↑' : '↓'} {trend.value}
          </span>
        )}
      </div>

      {subtitle && <p className="mt-1.5 text-xs text-slate-500 font-normal leading-tight">{subtitle}</p>}
    </div>
  );
};
