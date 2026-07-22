import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

export interface MetricProps {
  label: string;
  value: React.ReactNode;
  context?: string;
  trend?: {
    direction: 'up' | 'down' | 'neutral';
    value: string;
  };
  className?: string;
}

export const Metric: React.FC<MetricProps> = ({
  label,
  value,
  context,
  trend,
  className = '',
}) => {
  return (
    <div className={`flex flex-col gap-1 p-3 bg-[var(--surface,#FFFFFF)] dark:bg-[#141513] rounded-[4px] border border-[#D8D4C8] dark:border-[#2A2C28] text-left ${className}`}>
      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#5C5E58] dark:text-[#A8AAA3]">
        {label}
      </span>

      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-mono font-semibold tracking-tight text-[var(--color-text-primary,#0A0A0A)] dark:text-[#F3F1EA]">
          {value}
        </span>

        {trend && (
          <span
            className={`inline-flex items-center gap-0.5 text-xs font-mono font-medium ${
              trend.direction === 'up'
                ? 'text-[#28A66A]'
                : trend.direction === 'down'
                ? 'text-[#FF4D3D]'
                : 'text-[#A8AAA3]'
            }`}
          >
            {trend.direction === 'up' && <ArrowUpRight className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />}
            {trend.direction === 'down' && <ArrowDownRight className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />}
            {trend.direction === 'neutral' && <Minus className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />}
            {trend.value}
          </span>
        )}
      </div>

      {context && (
        <span className="text-xs text-[#5C5E58] dark:text-[#A8AAA3]">
          {context}
        </span>
      )}
    </div>
  );
};
