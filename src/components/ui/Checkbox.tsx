import React, { forwardRef, useId } from 'react';
import { Check } from 'lucide-react';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: React.ReactNode;
  description?: React.ReactNode;
  errorMessage?: React.ReactNode;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      description,
      errorMessage,
      id,
      checked,
      defaultChecked,
      disabled,
      className = '',
      onChange,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const checkboxId = id || generatedId;
    const descId = `${checkboxId}-desc`;
    const errorId = `${checkboxId}-error`;

    return (
      <div className={`flex flex-col gap-1 text-left ${className}`}>
        <label
          htmlFor={checkboxId}
          className={`inline-flex items-start gap-2.5 select-none cursor-pointer ${
            disabled ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <div className="relative flex items-center justify-center shrink-0 mt-0.5">
            <input
              ref={ref}
              type="checkbox"
              id={checkboxId}
              checked={checked}
              defaultChecked={defaultChecked}
              disabled={disabled}
              onChange={onChange}
              aria-invalid={Boolean(errorMessage)}
              aria-describedby={
                errorMessage ? errorId : description ? descId : undefined
              }
              className="peer appearance-none w-4 h-4 rounded-[2px] border border-[#D8D4C8] dark:border-[#2A2C28] bg-white dark:bg-[#141513] checked:bg-[#0A0A0A] dark:checked:bg-[#F3F1EA] checked:border-[#0A0A0A] dark:checked:border-[#F3F1EA] focus-visible:outline-2 focus-visible:outline-[#4B78FF] focus-visible:outline-offset-2 disabled:cursor-not-allowed transition-colors"
              {...props}
            />
            {/* Visible check mark icon so state is not color-only */}
            <Check
              className="w-3 h-3 text-white dark:text-[#0A0A0A] absolute pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity"
              strokeWidth={3}
              aria-hidden="true"
            />
          </div>

          {label && (
            <span className="text-sm font-medium text-[var(--color-text-primary,#0A0A0A)] dark:text-[#F3F1EA] leading-tight">
              {label}
            </span>
          )}
        </label>

        {errorMessage ? (
          <p id={errorId} className="text-xs font-medium text-[#FF4D3D] pl-6">
            • {errorMessage}
          </p>
        ) : description ? (
          <p id={descId} className="text-xs text-[#5C5E58] dark:text-[#A8AAA3] pl-6">
            {description}
          </p>
        ) : null}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
