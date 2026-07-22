import React from 'react';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', ...props }) => {
  return (
    <div
      className={`animate-pulse rounded-[4px] bg-[#242522]/10 dark:bg-[#A8AAA3]/20 ${className}`}
      {...props}
    />
  );
};
