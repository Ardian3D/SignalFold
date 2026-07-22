import React from 'react';
import { Info, CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react';

export type AlertVariant = 'info' | 'success' | 'warning' | 'critical';

export interface InlineAlertProps {
  variant?: AlertVariant;
  title: string;
  description?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

const variantConfig: Record<
  AlertVariant,
  { bg: string; border: string; text: string; icon: React.ReactNode; role: 'status' | 'alert' }
> = {
  info: {
    bg: 'bg-[#4B78FF]/10',
    border: 'border-[#4B78FF]/30',
    text: 'text-[#4B78FF]',
    icon: <Info className="w-4 h-4 shrink-0 text-[#4B78FF]" aria-hidden="true" />,
    role: 'status',
  },
  success: {
    bg: 'bg-[#28A66A]/10',
    border: 'border-[#28A66A]/30',
    text: 'text-[#28A66A]',
    icon: <CheckCircle2 className="w-4 h-4 shrink-0 text-[#28A66A]" aria-hidden="true" />,
    role: 'status',
  },
  warning: {
    bg: 'bg-[#F2B84B]/10',
    border: 'border-[#F2B84B]/30',
    text: 'text-[#D98E04] dark:text-[#F2B84B]',
    icon: <AlertTriangle className="w-4 h-4 shrink-0 text-[#D98E04] dark:text-[#F2B84B]" aria-hidden="true" />,
    role: 'alert',
  },
  critical: {
    bg: 'bg-[#FF4D3D]/10',
    border: 'border-[#FF4D3D]/30',
    text: 'text-[#FF4D3D]',
    icon: <ShieldAlert className="w-4 h-4 shrink-0 text-[#FF4D3D]" aria-hidden="true" />,
    role: 'alert',
  },
};

export const InlineAlert: React.FC<InlineAlertProps> = ({
  variant = 'info',
  title,
  description,
  action,
  className = '',
}) => {
  const config = variantConfig[variant];

  return (
    <div
      role={config.role}
      className={`flex items-start gap-3 p-3.5 rounded-[4px] border ${config.bg} ${config.border} text-left ${className}`}
    >
      {config.icon}
      <div className="flex-1 space-y-0.5">
        <h4 className={`text-xs font-mono font-bold uppercase tracking-wider ${config.text}`}>
          {title}
        </h4>
        {description && (
          <div className="text-xs text-[var(--color-text-primary,#0A0A0A)] dark:text-[#F3F1EA] leading-relaxed">
            {description}
          </div>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};
