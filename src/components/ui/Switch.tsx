import React, { forwardRef, useId } from 'react';

export interface SwitchProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  label: React.ReactNode;
  description?: React.ReactNode;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
  (
    {
      label,
      description,
      checked: customChecked,
      defaultChecked = false,
      onCheckedChange,
      disabled,
      id,
      className = '',
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const switchId = id || generatedId;
    const descId = `${switchId}-desc`;

    const [internalChecked, setInternalChecked] = React.useState(defaultChecked);
    const isChecked = customChecked !== undefined ? customChecked : internalChecked;

    const handleToggle = () => {
      if (disabled) return;
      const next = !isChecked;
      if (customChecked === undefined) {
        setInternalChecked(next);
      }
      onCheckedChange?.(next);
    };

    return (
      <div className={`flex flex-col gap-1 text-left ${className}`}>
        <label
          htmlFor={switchId}
          className={`inline-flex items-center justify-between gap-4 cursor-pointer select-none ${
            disabled ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <span className="text-sm font-medium text-[var(--color-text-primary,#0A0A0A)] dark:text-[#F3F1EA]">
            {label}
          </span>

          <button
            ref={ref}
            type="button"
            role="switch"
            id={switchId}
            aria-checked={isChecked}
            disabled={disabled}
            aria-describedby={description ? descId : undefined}
            onClick={handleToggle}
            className={`
              relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out
              focus-visible:outline-2 focus-visible:outline-[#4B78FF] focus-visible:outline-offset-2
              disabled:cursor-not-allowed
              ${isChecked ? 'bg-[#0A0A0A] dark:bg-[#D6FF3F]' : 'bg-[#D8D4C8] dark:bg-[#242522]'}
            `}
            {...props}
          >
            <span
              className={`
                pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out
                ${isChecked ? 'translate-x-5 bg-white dark:bg-[#0A0A0A]' : 'translate-x-0'}
              `}
            />
          </button>
        </label>

        {description && (
          <p id={descId} className="text-xs text-[#5C5E58] dark:text-[#A8AAA3]">
            {description}
          </p>
        )}
      </div>
    );
  }
);

Switch.displayName = 'Switch';
