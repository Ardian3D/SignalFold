import React from 'react';
import { SeverityLevel, SEVERITY_CONFIG } from '@/domain/incident';

export interface SeverityBadgeProps {
  level: SeverityLevel;
  compact?: boolean;
  className?: string;
}

export const SeverityBadge: React.FC<SeverityBadgeProps> = ({
  level,
  compact = false,
  className = '',
}) => {
  const config = SEVERITY_CONFIG[level];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[2px] font-mono text-xs font-bold border transition-colors select-none ${config.bg} ${config.text} ${config.border} ${className}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full shrink-0 ${config.indicator}`}
        aria-hidden="true"
      />
      <span>{compact ? config.label : config.fullLabel}</span>
    </span>
  );
};
