import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'paper' | 'dark' | 'highlight' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  padding = 'md',
  children,
  className = '',
  ...props
}) => {
  const baseStyles = 'rounded-[6px] transition-colors overflow-hidden text-left';

  const variantStyles = {
    default:
      'bg-[var(--surface,#FFFFFF)] dark:bg-[#141513] text-[var(--ink,#0A0A0A)] dark:text-[#F3F1EA] border border-[#D8D4C8] dark:border-[#2A2C28]',
    paper:
      'bg-[#F3F1EA] dark:bg-[#141513] text-[#0A0A0A] dark:text-[#F3F1EA] border border-[#D8D4C8] dark:border-[#2A2C28]',
    dark:
      'bg-[#0A0A0A] text-[#F3F1EA] border border-[#242522]',
    highlight:
      'bg-[var(--surface,#FFFFFF)] dark:bg-[#141513] text-[var(--ink,#0A0A0A)] dark:text-[#F3F1EA] border-2 border-[#D6FF3F]',
    outlined:
      'bg-transparent text-[var(--color-text-primary)] border border-[#242522] dark:border-[#A8AAA3]',
  };

  const paddingStyles = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-8',
  };

  return (
    <div
      className={`${baseStyles} ${variantStyles[variant]} ${paddingStyles[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <div
    className={`flex items-center justify-between pb-3 border-b border-[#D8D4C8] dark:border-[#2A2C28] mb-4 ${className}`}
    {...props}
  >
    {children}
  </div>
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <h3
    className={`font-['Sora'] text-base font-semibold tracking-tight text-[var(--color-text-primary)] ${className}`}
    {...props}
  >
    {children}
  </h3>
);

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <p className={`text-xs text-[#5C5E58] dark:text-[#A8AAA3] mt-0.5 ${className}`} {...props}>
    {children}
  </p>
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <div className={`space-y-4 ${className}`} {...props}>
    {children}
  </div>
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <div
    className={`pt-4 mt-4 border-t border-[#D8D4C8] dark:border-[#2A2C28] flex items-center justify-between ${className}`}
    {...props}
  >
    {children}
  </div>
);
