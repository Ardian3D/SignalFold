import React from 'react';
import { Loader2 } from 'lucide-react';

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  className?: string;
}

const sizeMap = {
  sm: 'w-3.5 h-3.5',
  md: 'w-5 h-5',
  lg: 'w-8 h-8',
};

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  label = 'Loading...',
  className = '',
}) => {
  return (
    <span
      role="status"
      aria-label={label}
      className={`inline-flex items-center justify-center shrink-0 ${className}`}
    >
      <Loader2
        className={`${sizeMap[size]} animate-spin motion-reduce:animate-none text-current`}
        aria-hidden="true"
      />
      <span className="sr-only">{label}</span>
    </span>
  );
};
