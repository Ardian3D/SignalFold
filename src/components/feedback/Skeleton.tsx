import React from 'react';

export interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => {
  return (
    <div
      aria-hidden="true"
      className={`bg-[#D8D4C8] dark:bg-[#2A2C28] rounded-[2px] animate-pulse motion-reduce:animate-none ${className}`}
    />
  );
};
