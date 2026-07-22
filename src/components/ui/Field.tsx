import React, { useId } from 'react';

export interface FieldProps {
  label?: React.ReactNode;
  description?: React.ReactNode;
  errorMessage?: React.ReactNode;
  required?: boolean;
  htmlFor?: string;
  className?: string;
  children: (props: {
    id: string;
    'aria-invalid'?: boolean;
    'aria-describedby'?: string;
  }) => React.ReactNode;
}

export const Field: React.FC<FieldProps> = ({
  label,
  description,
  errorMessage,
  required,
  htmlFor: customHtmlFor,
  className = '',
  children,
}) => {
  const generatedId = useId();
  const fieldId = customHtmlFor || generatedId;
  const descId = `${fieldId}-description`;
  const errorId = `${fieldId}-error`;

  const hasError = Boolean(errorMessage);
  const hasDesc = Boolean(description);

  const describedBy = [hasError ? errorId : null, hasDesc ? descId : null]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={`flex flex-col gap-1.5 w-full text-left ${className}`}>
      {label && (
        <label
          htmlFor={fieldId}
          className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary,#242522)] dark:text-[#A8AAA3] flex items-center gap-1"
        >
          <span>{label}</span>
          {required && <span className="text-[#FF4D3D] aria-hidden">*</span>}
        </label>
      )}

      {children({
        id: fieldId,
        'aria-invalid': hasError ? true : undefined,
        'aria-describedby': describedBy || undefined,
      })}

      {hasError ? (
        <p id={errorId} className="text-xs font-medium text-[#FF4D3D] flex items-center gap-1 mt-0.5">
          <span aria-hidden="true">•</span> {errorMessage}
        </p>
      ) : hasDesc ? (
        <p id={descId} className="text-xs text-[#5C5E58] dark:text-[#A8AAA3] mt-0.5">
          {description}
        </p>
      ) : null}
    </div>
  );
};
