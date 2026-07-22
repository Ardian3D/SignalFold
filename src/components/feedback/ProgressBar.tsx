import React from 'react';

export interface ProgressBarProps {
  value?: number; // 0 to 100, undefined for indeterminate
  max?: number;
  label?: string;
  showValueLabel?: boolean;
  className?: string;
  tone?: 'signal' | 'critical' | 'warning' | 'info' | 'success';
}

const toneMap = {
  signal: 'bg-[#D6FF3F]',
  critical: 'bg-[#FF4D3D]',
  warning: 'bg-[#F2B84B]',
  info: 'bg-[#4B78FF]',
  success: 'bg-[#28A66A]',
};

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label = 'Progress',
  showValueLabel = false,
  className = '',
  tone = 'signal',
}) => {
  const isDeterminate = typeof value === 'number';
  const percentage = isDeterminate ? Math.min(Math.max((value / max) * 100, 0), 100) : 0;

  return (
    <div className={`w-full flex flex-col gap-1 text-left ${className}`}>
      {(label || showValueLabel) && (
        <div className="flex items-center justify-between text-xs font-mono">
          {label && <span className="font-semibold text-[#5C5E58] dark:text-[#A8AAA3]">{label}</span>}
          {showValueLabel && isDeterminate && (
            <span className="font-bold text-[var(--color-text-primary,#0A0A0A)] dark:text-[#F3F1EA]">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}

      <div
        role="progressbar"
        aria-label={label}
        aria-valuenow={isDeterminate ? Math.round(percentage) : undefined}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuetext={isDeterminate ? `${Math.round(percentage)}%` : 'In progress'}
        className="w-full h-2 rounded-full bg-[#D8D4C8] dark:bg-[#2A2C28] overflow-hidden relative"
      >
        {isDeterminate ? (
          <div
            className={`h-full transition-all duration-300 ease-out rounded-full ${toneMap[tone]}`}
            style={{ width: `${percentage}%` }}
          />
        ) : (
          <div
            className={`h-full w-1/3 rounded-full animate-[indeterminate_1.5s_infinite_linear] motion-reduce:animate-none ${toneMap[tone]}`}
          />
        )}
      </div>
    </div>
  );
};
