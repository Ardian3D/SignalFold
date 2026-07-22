import React from 'react';

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  label?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  className = 'text-current',
  label = 'Loading...',
}) => {
  const sizeMap = {
    sm: 'w-3.5 h-3.5 border-2',
    md: 'w-5 h-5 border-2',
    lg: 'w-8 h-8 border-3',
  };

  return (
    <div
      role="status"
      aria-label={label}
      className={`inline-block animate-spin rounded-full border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite] ${sizeMap[size]} ${className}`}
    >
      <span className="sr-only">{label}</span>
    </div>
  );
};
