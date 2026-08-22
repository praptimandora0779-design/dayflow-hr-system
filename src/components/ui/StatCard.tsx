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
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
}) => {
  return (
    <div className="hr-panel p-4 flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium uppercase tracking-wider text-slate-500 font-mono">
          {title}
        </span>
        <Icon className="w-4 h-4 text-slate-400 stroke-[1.75]" />
      </div>

      <div className="mt-3 flex items-baseline justify-between">
        <h3 className="text-2xl font-semibold text-slate-900 tracking-tight tabular-nums font-mono">
          {value}
        </h3>
        {trend && (
          <span
            className={`text-[11px] font-medium px-2 py-0.5 rounded-md border ${
              trend.isPositive
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-rose-50 text-rose-800 border-rose-200'
            }`}
          >
            {trend.isPositive ? '↑' : '↓'} {trend.value}
          </span>
        )}
      </div>

      {subtitle && <p className="mt-1 text-xs text-slate-500 font-normal">{subtitle}</p>}
    </div>
  );
};
