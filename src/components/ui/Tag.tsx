import React from 'react';
import { X } from 'lucide-react';

export interface TagProps {
  label: React.ReactNode;
  onRemove?: () => void;
  removeAccessibleLabel?: string;
  className?: string;
}

export const Tag: React.FC<TagProps> = ({
  label,
  onRemove,
  removeAccessibleLabel = 'Remove tag',
  className = '',
}) => {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[2px] font-mono text-xs bg-[#F3F1EA] text-[#0A0A0A] dark:bg-[#242522] dark:text-[#F3F1EA] border border-[#D8D4C8] dark:border-[#2A2C28] select-none ${className}`}
    >
      <span>{label}</span>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={removeAccessibleLabel}
          className="p-0.5 text-[#5C5E58] hover:text-[#0A0A0A] dark:text-[#A8AAA3] dark:hover:text-white rounded-[2px] focus-visible:outline-2 focus-visible:outline-[#4B78FF]"
        >
          <X className="w-3 h-3" aria-hidden="true" />
        </button>
      )}
    </span>
  );
};
