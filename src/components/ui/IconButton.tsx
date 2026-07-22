import React, { forwardRef } from 'react';
import { Spinner } from './Spinner';

export type IconButtonVariant = 'primary' | 'secondary' | 'quiet' | 'destructive';
export type IconButtonSize = 'sm' | 'md' | 'lg';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  'aria-label': string; // Mandatory accessible label
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  isLoading?: boolean;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      icon,
      'aria-label': ariaLabel,
      variant = 'quiet',
      size = 'md',
      isLoading = false,
      disabled,
      className = '',
      type = 'button',
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-150 select-none rounded-[4px] focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none active:scale-[0.95]';

    const variantStyles: Record<IconButtonVariant, string> = {
      primary:
        'bg-[#0A0A0A] text-[#F3F1EA] hover:bg-[#242522] border border-[#242522] focus-visible:outline-[#4B78FF]',
      secondary:
        'bg-[#F3F1EA] text-[#0A0A0A] hover:bg-[#E8E5DC] border border-[#D8D4C8] dark:bg-[#141513] dark:text-[#F3F1EA] dark:border-[#2A2C28] dark:hover:bg-[#242522] focus-visible:outline-[#0A0A0A]',
      quiet:
        'bg-transparent text-[var(--color-text-primary,#0A0A0A)] dark:text-[#F3F1EA] hover:bg-[#0A0A0A]/10 dark:hover:bg-white/10 focus-visible:outline-[#4B78FF]',
      destructive:
        'bg-[#FF4D3D] text-white hover:bg-[#e03b2c] border border-[#e03b2c] focus-visible:outline-[#FF4D3D]',
    };

    const sizeStyles: Record<IconButtonSize, string> = {
      sm: 'w-8 h-8 min-w-[32px] min-h-[32px] p-1 text-xs',
      md: 'w-10 h-10 min-w-[40px] min-h-[40px] p-2 text-sm',
      lg: 'w-12 h-12 min-w-[48px] min-h-[48px] p-2.5 text-base',
    };

    return (
      <button
        ref={ref}
        type={type}
        aria-label={ariaLabel}
        disabled={disabled || isLoading}
        aria-busy={isLoading || undefined}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      >
        {isLoading ? (
          <Spinner size={size === 'sm' ? 'sm' : 'md'} className="text-current" />
        ) : (
          <span className="shrink-0 flex items-center justify-center" aria-hidden="true">
            {icon}
          </span>
        )}
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';
