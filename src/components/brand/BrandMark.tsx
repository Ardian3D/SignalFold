import React from 'react';

export interface BrandMarkProps {
  /**
   * Icon size:
   * - 'sm': 16px
   * - 'md': 24px
   * - 'lg': 32px
   * Note: favicon.ico is a small raster icon format. It is intentionally constrained to max 32px
   * to avoid pixelation/blur. For larger display branding, use the canonical BrandLogo component.
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Alt text for accessible screen readers
   */
  alt?: string;

  /**
   * Optional custom CSS class name
   */
  className?: string;

  /**
   * Optional click handler
   */
  onClick?: () => void;
}

const sizeMap = {
  sm: 'w-4 h-4',   // 16px
  md: 'w-6 h-6',   // 24px
  lg: 'w-8 h-8',   // 32px
};

/**
 * SignalFold Official BrandMark Component
 * Uses official public/favicon.ico for small icon contexts.
 */
export const BrandMark: React.FC<BrandMarkProps> = ({
  size = 'md',
  alt = 'SignalFold Mark',
  className = '',
  onClick,
}) => {
  return (
    <div
      className={`inline-flex items-center justify-center shrink-0 select-none ${
        onClick ? 'cursor-pointer hover:opacity-90 transition-opacity' : ''
      } ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <img
        src="/favicon.ico"
        alt={alt}
        className={`${sizeMap[size]} object-contain shrink-0`}
        loading="eager"
      />
    </div>
  );
};
