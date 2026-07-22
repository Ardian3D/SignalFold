import React, { forwardRef } from 'react';
import { Field } from './Field';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: React.ReactNode;
  helperText?: React.ReactNode;
  errorMessage?: React.ReactNode;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      helperText,
      errorMessage,
      options,
      placeholder,
      id,
      className = '',
      required,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <Field
        label={label}
        description={helperText}
        errorMessage={errorMessage}
        required={required}
        htmlFor={id}
      >
        {({ id: fieldId, 'aria-invalid': ariaInvalid, 'aria-describedby': ariaDescribedBy }) => (
          <select
            ref={ref}
            id={fieldId}
            disabled={disabled}
            required={required}
            aria-invalid={ariaInvalid}
            aria-describedby={ariaDescribedBy}
            className={`
              w-full h-10 px-3 py-2 text-sm transition-colors rounded-[4px] cursor-pointer
              bg-[var(--surface,#FFFFFF)] dark:bg-[#141513]
              text-[var(--ink,#0A0A0A)] dark:text-[#F3F1EA]
              border ${
                ariaInvalid
                  ? 'border-[#FF4D3D] focus:border-[#FF4D3D] focus:ring-1 focus:ring-[#FF4D3D]'
                  : 'border-[#D8D4C8] dark:border-[#2A2C28] hover:border-[#242522] dark:hover:border-[#A8AAA3] focus:border-[#0A0A0A] dark:focus:border-[#F3F1EA]'
              }
              focus-visible:outline-2 focus-visible:outline-[#4B78FF] focus-visible:outline-offset-1
              disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[#E8E5DC] dark:disabled:bg-[#242522]
              ${className}
            `}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))}
          </select>
        )}
      </Field>
    );
  }
);

Select.displayName = 'Select';
