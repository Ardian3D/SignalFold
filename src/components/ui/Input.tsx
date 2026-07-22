import React, { forwardRef } from 'react';
import { Field } from './Field';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: React.ReactNode;
  helperText?: React.ReactNode;
  errorMessage?: React.ReactNode;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isMono?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      errorMessage,
      leftIcon,
      rightIcon,
      isMono = false,
      id,
      className = '',
      required,
      disabled,
      type = 'text',
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
          <div className="relative flex items-center w-full">
            {leftIcon && (
              <div className="absolute left-3 text-[#A8AAA3] pointer-events-none flex items-center shrink-0" aria-hidden="true">
                {leftIcon}
              </div>
            )}

            <input
              ref={ref}
              id={fieldId}
              type={type}
              disabled={disabled}
              required={required}
              aria-invalid={ariaInvalid}
              aria-describedby={ariaDescribedBy}
              className={`
                w-full h-10 px-3 py-2 text-sm transition-colors rounded-[4px]
                bg-[var(--surface,#FFFFFF)] dark:bg-[#141513]
                text-[var(--ink,#0A0A0A)] dark:text-[#F3F1EA]
                border ${
                  ariaInvalid
                    ? 'border-[#FF4D3D] focus:border-[#FF4D3D] focus:ring-1 focus:ring-[#FF4D3D]'
                    : 'border-[#D8D4C8] dark:border-[#2A2C28] hover:border-[#242522] dark:hover:border-[#A8AAA3] focus:border-[#0A0A0A] dark:focus:border-[#F3F1EA]'
                }
                placeholder:text-[#A8AAA3] dark:placeholder:text-[#5C5E58]
                focus-visible:outline-2 focus-visible:outline-[#4B78FF] focus-visible:outline-offset-1
                disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[#E8E5DC] dark:disabled:bg-[#242522]
                ${leftIcon ? 'pl-9' : ''}
                ${rightIcon ? 'pr-9' : ''}
                ${isMono ? 'font-mono text-xs' : 'font-sans'}
                ${className}
              `}
              {...props}
            />

            {rightIcon && (
              <div className="absolute right-3 text-[#A8AAA3] pointer-events-none flex items-center shrink-0" aria-hidden="true">
                {rightIcon}
              </div>
            )}
          </div>
        )}
      </Field>
    );
  }
);

Input.displayName = 'Input';
