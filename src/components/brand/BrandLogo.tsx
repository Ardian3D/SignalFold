import React from 'react';
import signalFoldLogo from '../../assets/brand/SignalFold-logo.png';

// Brand image files are binary assets. Never read or rewrite them as UTF-8 strings.

export interface BrandLogoProps {
  /**
   * Logo size scale:
   * - 'sm': 24px height
   * - 'md': 32px height (default)
   * - 'lg': 48px height
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Alt text for the official logo asset
   */
  alt?: string;

  /**
   * Optional custom CSS class name for wrapper
   */
  className?: string;

  /**
   * Loading strategy for the logo image
   */
  loading?: 'eager' | 'lazy';

  /**
   * Optional click handler
   */
  onClick?: () => void;
}

const heightConfig = {
  sm: 'h-6', // 24px
  md: 'h-8', // 32px
  lg: 'h-12', // 48px
};

/**
 * SignalFold Official BrandLogo Component
 * Uses canonical PNG lockup from src/assets/brand/SignalFold-logo.png
 */
export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  alt = 'SignalFold',
  className = '',
  loading = 'eager',
  onClick,
}) => {
  return (
    <div
      className={`inline-flex items-center shrink-0 select-none ${
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
        src={signalFoldLogo}
        alt={alt}
        loading={loading}
        className={`${heightConfig[size]} w-auto object-contain shrink-0`}
      />
    </div>
  );
};
