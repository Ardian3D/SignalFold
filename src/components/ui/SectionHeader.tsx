import React from 'react';

export interface SectionHeaderProps {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  headingLevel?: 'h1' | 'h2' | 'h3' | 'h4';
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  eyebrow,
  title,
  description,
  action,
  headingLevel = 'h2',
  className = '',
}) => {
  const HeadingTag = headingLevel;

  return (
    <div className={`flex flex-col sm:flex-row sm:items-end justify-between pb-3 border-b border-[#D8D4C8] dark:border-[#2A2C28] gap-3 ${className}`}>
      <div className="space-y-1 text-left">
        {eyebrow && (
          <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#5C5E58] dark:text-[#A8AAA3]">
            {eyebrow}
          </p>
        )}
        <HeadingTag className="font-['Sora'] text-lg font-bold tracking-tight text-[var(--color-text-primary,#0A0A0A)] dark:text-[#F3F1EA]">
          {title}
        </HeadingTag>
        {description && (
          <p className="text-xs text-[#5C5E58] dark:text-[#A8AAA3]">
            {description}
          </p>
        )}
      </div>

      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};
