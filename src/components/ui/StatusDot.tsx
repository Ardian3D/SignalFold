import React from 'react';

export type StatusDotTone = 'critical' | 'warning' | 'info' | 'success' | 'neutral' | 'signal';

export interface StatusDotProps {
  tone?: StatusDotTone;
  label?: string;
  showLabel?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const toneMap: Record<StatusDotTone, { bg: string; border: string }> = {
  critical: { bg: 'bg-[#FF4D3D]', border: 'border-[#FF4D3D]/30' },
  warning: { bg: 'bg-[#F2B84B]', border: 'border-[#F2B84B]/30' },
  info: { bg: 'bg-[#4B78FF]', border: 'border-[#4B78FF]/30' },
  success: { bg: 'bg-[#28A66A]', border: 'border-[#28A66A]/30' },
  neutral: { bg: 'bg-[#A8AAA3]', border: 'border-[#A8AAA3]/30' },
  signal: { bg: 'bg-[#D6FF3F]', border: 'border-[#D6FF3F]/40' },
};

const sizeMap = {
  sm: 'w-1.5 h-1.5',
  md: 'w-2 h-2',
  lg: 'w-2.5 h-2.5',
};

export const StatusDot: React.FC<StatusDotProps> = ({
  tone = 'neutral',
  label = 'Status indicator',
  showLabel = false,
  className = '',
  size = 'md',
}) => {
  const config = toneMap[tone];

  return (
    <span className={`inline-flex items-center gap-1.5 align-middle ${className}`}>
      <span
        className={`inline-block rounded-full shrink-0 ${sizeMap[size]} ${config.bg}`}
        aria-hidden="true"
      />
      {showLabel ? (
        <span className="text-xs font-mono font-medium text-[var(--color-text-primary,#0A0A0A)] dark:text-[#F3F1EA]">
          {label}
        </span>
      ) : (
        <span className="sr-only">{label}</span>
      )}
    </span>
  );
};
