import React from 'react';

export interface DividerProps {
  label?: string;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export const Divider: React.FC<DividerProps> = ({
  label,
  orientation = 'horizontal',
  className = '',
}) => {
  if (orientation === 'vertical') {
    return (
      <div
        role="separator"
        aria-orientation="vertical"
        className={`w-[1px] self-stretch bg-[#D8D4C8] dark:bg-[#2A2C28] ${className}`}
      />
    );
  }

  if (label) {
    return (
      <div role="separator" aria-orientation="horizontal" className={`flex items-center my-4 ${className}`}>
        <div className="flex-1 border-t border-[#D8D4C8] dark:border-[#2A2C28]" />
        <span className="px-3 text-[10px] font-mono font-bold uppercase tracking-wider text-[#5C5E58] dark:text-[#A8AAA3]">
          {label}
        </span>
        <div className="flex-1 border-t border-[#D8D4C8] dark:border-[#2A2C28]" />
      </div>
    );
  }

  return (
    <hr
      className={`border-0 border-t border-[#D8D4C8] dark:border-[#2A2C28] my-4 w-full ${className}`}
    />
  );
};
