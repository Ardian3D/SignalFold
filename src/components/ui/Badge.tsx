import React from 'react';

export type BadgeVariant =
  | 'sev1'
  | 'sev2'
  | 'sev3'
  | 'sev4'
  | 'signal'
  | 'neutral'
  | 'success'
  | 'warning'
  | 'critical'
  | 'info'
  | 'outline';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
  showDot?: boolean;
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  size = 'md',
  icon,
  showDot = false,
  children,
  className = '',
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center font-mono font-semibold tracking-tight uppercase rounded-[2px] border transition-colors select-none';

  const variantMap: Record<BadgeVariant, { bg: string; text: string; border: string; dot: string }> = {
    sev1: {
      bg: 'bg-[#FF4D3D]/10 dark:bg-[#FF4D3D]/20',
      text: 'text-[#FF4D3D]',
      border: 'border-[#FF4D3D]/40',
      dot: 'bg-[#FF4D3D]',
    },
    sev2: {
      bg: 'bg-[#F2B84B]/10 dark:bg-[#F2B84B]/20',
      text: 'text-[#D98E04] dark:text-[#F2B84B]',
      border: 'border-[#F2B84B]/40',
      dot: 'bg-[#F2B84B]',
    },
    sev3: {
      bg: 'bg-[#4B78FF]/10 dark:bg-[#4B78FF]/20',
      text: 'text-[#2B57E5] dark:text-[#4B78FF]',
      border: 'border-[#4B78FF]/40',
      dot: 'bg-[#4B78FF]',
    },
    sev4: {
      bg: 'bg-[#28A66A]/10 dark:bg-[#28A66A]/20',
      text: 'text-[#1E7E50] dark:text-[#28A66A]',
      border: 'border-[#28A66A]/40',
      dot: 'bg-[#28A66A]',
    },
    signal: {
      bg: 'bg-[#D6FF3F]/20 dark:bg-[#D6FF3F]/25',
      text: 'text-[#0A0A0A] dark:text-[#D6FF3F]',
      border: 'border-[#bceb1a]/60',
      dot: 'bg-[#D6FF3F]',
    },
    neutral: {
      bg: 'bg-[#E8E5DC] dark:bg-[#242522]',
      text: 'text-[#242522] dark:text-[#F3F1EA]',
      border: 'border-[#D8D4C8] dark:border-[#2A2C28]',
      dot: 'bg-[#5C5E58]',
    },
    success: {
      bg: 'bg-[#28A66A]/10 dark:bg-[#28A66A]/20',
      text: 'text-[#1E7E50] dark:text-[#28A66A]',
      border: 'border-[#28A66A]/40',
      dot: 'bg-[#28A66A]',
    },
    warning: {
      bg: 'bg-[#F2B84B]/10 dark:bg-[#F2B84B]/20',
      text: 'text-[#D98E04] dark:text-[#F2B84B]',
      border: 'border-[#F2B84B]/40',
      dot: 'bg-[#F2B84B]',
    },
    critical: {
      bg: 'bg-[#FF4D3D]/10 dark:bg-[#FF4D3D]/20',
      text: 'text-[#FF4D3D]',
      border: 'border-[#FF4D3D]/40',
      dot: 'bg-[#FF4D3D]',
    },
    info: {
      bg: 'bg-[#4B78FF]/10 dark:bg-[#4B78FF]/20',
      text: 'text-[#2B57E5] dark:text-[#4B78FF]',
      border: 'border-[#4B78FF]/40',
      dot: 'bg-[#4B78FF]',
    },
    outline: {
      bg: 'bg-transparent',
      text: 'text-[var(--color-text-primary)]',
      border: 'border-[var(--color-border-dark,#242522)]',
      dot: 'bg-current',
    },
  };

  const sizeMap = {
    sm: 'px-1.5 py-0.5 text-[10px] gap-1 leading-none',
    md: 'px-2 py-1 text-xs gap-1.5 leading-none',
  };

  const style = variantMap[variant];

  return (
    <span
      className={`${baseStyles} ${style.bg} ${style.text} ${style.border} ${sizeMap[size]} ${className}`}
      {...props}
    >
      {showDot && (
        <span
          className={`shrink-0 rounded-full ${style.dot} ${
            size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2'
          }`}
          aria-hidden="true"
        />
      )}
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
