import React from 'react';
import { IncidentStatus, STATUS_CONFIG } from '@/domain/incident';
import { StatusDot } from './StatusDot';

export interface IncidentStatusBadgeProps {
  status: IncidentStatus;
  className?: string;
}

export const IncidentStatusBadge: React.FC<IncidentStatusBadgeProps> = ({
  status,
  className = '',
}) => {
  const config = STATUS_CONFIG[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[2px] font-sans text-xs font-semibold border transition-colors select-none ${config.bg} ${config.text} ${config.border} ${className}`}
    >
      <StatusDot tone={config.dotTone} label="" />
      <span>{config.label}</span>
    </span>
  );
};
