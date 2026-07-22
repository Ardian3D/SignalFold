import React, { forwardRef } from 'react';
import { Spinner } from './Spinner';

export type ButtonVariant = 'primary' | 'secondary' | 'quiet' | 'destructive' | 'link';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  loadingText?: string;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      loadingText,
      leadingIcon,
      trailingIcon,
      fullWidth = false,
      disabled,
      className = '',
      type = 'button',
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-150 select-none rounded-[4px] focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none active:scale-[0.98]';

    const variantStyles: Record<ButtonVariant, string> = {
      primary:
        'bg-[#0A0A0A] text-[#F3F1EA] hover:bg-[#242522] border border-[#242522] focus-visible:outline-[#4B78FF]',
      secondary:
        'bg-[#F3F1EA] text-[#0A0A0A] hover:bg-[#E8E5DC] border border-[#D8D4C8] focus-visible:outline-[#0A0A0A] dark:bg-[#141513] dark:text-[#F3F1EA] dark:border-[#2A2C28] dark:hover:bg-[#242522]',
      quiet:
        'bg-transparent text-[var(--color-text-primary,#0A0A0A)] hover:bg-[#0A0A0A]/10 dark:hover:bg-white/10 focus-visible:outline-[#4B78FF]',
      destructive:
        'bg-[#FF4D3D] text-white hover:bg-[#e03b2c] border border-[#e03b2c] focus-visible:outline-[#FF4D3D]',
      link:
        'bg-transparent text-[#0A0A0A] dark:text-[#F3F1EA] underline hover:text-[#5C5E58] p-0 h-auto font-normal focus-visible:outline-[#4B78FF]',
    };

    const sizeStyles: Record<ButtonSize, string> = {
      sm: 'h-8 px-3 text-xs gap-1.5 font-mono tracking-tight',
      md: 'h-10 px-4 text-sm gap-2',
      lg: 'h-12 px-6 text-base gap-2.5',
    };

    const widthStyle = fullWidth ? 'w-full' : '';

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        aria-busy={isLoading || undefined}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${className}`}
        {...props}
      >
        {isLoading ? (
          <>
            <Spinner size={size === 'sm' ? 'sm' : 'md'} className="text-current" />
            <span>{loadingText || children}</span>
          </>
        ) : (
          <>
            {leadingIcon && <span className="shrink-0" aria-hidden="true">{leadingIcon}</span>}
            {children && <span>{children}</span>}
            {trailingIcon && <span className="shrink-0" aria-hidden="true">{trailingIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
