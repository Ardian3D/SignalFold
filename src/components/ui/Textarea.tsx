import React, { forwardRef } from 'react';
import { Field } from './Field';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: React.ReactNode;
  helperText?: React.ReactNode;
  errorMessage?: React.ReactNode;
  isMono?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      helperText,
      errorMessage,
      isMono = false,
      id,
      className = '',
      required,
      disabled,
      rows = 4,
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
          <textarea
            ref={ref}
            id={fieldId}
            rows={rows}
            disabled={disabled}
            required={required}
            aria-invalid={ariaInvalid}
            aria-describedby={ariaDescribedBy}
            className={`
              w-full px-3 py-2 text-sm transition-colors rounded-[4px] resize-y
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
              ${isMono ? 'font-mono text-xs leading-relaxed' : 'font-sans leading-relaxed'}
              ${className}
            `}
            {...props}
          />
        )}
      </Field>
    );
  }
);

Textarea.displayName = 'Textarea';
