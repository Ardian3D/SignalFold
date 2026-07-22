import React from 'react';

export type SurfaceVariant = 'default' | 'muted' | 'inverse' | 'outlined';

export interface SurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: SurfaceVariant;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  as?: React.ElementType;
}

const variantStyles: Record<SurfaceVariant, string> = {
  default:
    'bg-[var(--surface,#FFFFFF)] text-[var(--ink,#0A0A0A)] dark:bg-[#141513] dark:text-[#F3F1EA] border border-[#D8D4C8] dark:border-[#2A2C28]',
  muted:
    'bg-[#F3F1EA] text-[#0A0A0A] dark:bg-[#1C1D1A] dark:text-[#F3F1EA] border border-[#D8D4C8] dark:border-[#2A2C28]',
  inverse:
    'bg-[#0A0A0A] text-[#F3F1EA] dark:bg-[#F3F1EA] dark:text-[#0A0A0A] border border-[#242522]',
  outlined:
    'bg-transparent border border-[#242522] dark:border-[#D8D4C8] text-[var(--ink,#0A0A0A)] dark:text-[#F3F1EA]',
};

const paddingStyles = {
  none: 'p-0',
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-8',
};

export const Surface: React.FC<SurfaceProps> = ({
  variant = 'default',
  padding = 'md',
  as: Component = 'div',
  className = '',
  children,
  ...props
}) => {
  return (
    <Component
      className={`rounded-[6px] transition-colors duration-150 ${variantStyles[variant]} ${paddingStyles[padding]} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
};
