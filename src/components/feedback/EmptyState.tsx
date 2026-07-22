import React from 'react';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 text-center rounded-[6px] bg-[var(--surface,#FFFFFF)] dark:bg-[#141513] border border-dashed border-[#D8D4C8] dark:border-[#2A2C28] space-y-3 ${className}`}
    >
      {icon && (
        <div className="p-3 bg-[#F3F1EA] dark:bg-[#242522] rounded-full text-[#0A0A0A] dark:text-[#F3F1EA]" aria-hidden="true">
          {icon}
        </div>
      )}
      <div className="space-y-1 max-w-sm">
        <h3 className="font-['Sora'] text-sm font-bold text-[var(--color-text-primary,#0A0A0A)] dark:text-[#F3F1EA]">
          {title}
        </h3>
        {description && (
          <p className="text-xs text-[#5C5E58] dark:text-[#A8AAA3] leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {action && <div className="pt-2">{action}</div>}
    </div>
  );
};
