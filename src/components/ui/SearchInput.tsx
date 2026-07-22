import React, { forwardRef, useState } from 'react';
import { Search, X } from 'lucide-react';
import { Field } from './Field';

export interface SearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: React.ReactNode;
  helperText?: React.ReactNode;
  errorMessage?: React.ReactNode;
  onClear?: () => void;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      label,
      helperText,
      errorMessage,
      value: customValue,
      defaultValue = '',
      onChange,
      onClear,
      id,
      className = '',
      placeholder = 'Search signals, incidents, teams...',
      disabled,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState(defaultValue);
    const value = customValue !== undefined ? customValue : internalValue;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (customValue === undefined) {
        setInternalValue(e.target.value);
      }
      onChange?.(e);
    };

    const handleClear = () => {
      if (customValue === undefined) {
        setInternalValue('');
      }
      onClear?.();
    };

    const hasValue = String(value).length > 0;

    return (
      <Field label={label} description={helperText} errorMessage={errorMessage} htmlFor={id}>
        {({ id: fieldId, 'aria-invalid': ariaInvalid, 'aria-describedby': ariaDescribedBy }) => (
          <div className="relative flex items-center w-full">
            <Search
              className="absolute left-3 w-4 h-4 text-[#A8AAA3] pointer-events-none shrink-0"
              aria-hidden="true"
            />

            <input
              ref={ref}
              id={fieldId}
              type="search"
              value={value}
              onChange={handleChange}
              disabled={disabled}
              placeholder={placeholder}
              aria-invalid={ariaInvalid}
              aria-describedby={ariaDescribedBy}
              className={`
                w-full h-10 pl-9 pr-9 py-2 text-sm transition-colors rounded-[4px]
                bg-[var(--surface,#FFFFFF)] dark:bg-[#141513]
                text-[var(--ink,#0A0A0A)] dark:text-[#F3F1EA]
                border border-[#D8D4C8] dark:border-[#2A2C28] hover:border-[#242522] dark:hover:border-[#A8AAA3] focus:border-[#0A0A0A] dark:focus:border-[#F3F1EA]
                placeholder:text-[#A8AAA3] dark:placeholder:text-[#5C5E58]
                focus-visible:outline-2 focus-visible:outline-[#4B78FF] focus-visible:outline-offset-1
                disabled:opacity-50 disabled:cursor-not-allowed
                [::-webkit-search-cancel-button]:hidden
                ${className}
              `}
              {...props}
            />

            {hasValue && !disabled && (
              <button
                type="button"
                onClick={handleClear}
                aria-label="Clear search text"
                className="absolute right-2.5 p-1 text-[#A8AAA3] hover:text-[#0A0A0A] dark:hover:text-white rounded-[2px] focus-visible:outline-2 focus-visible:outline-[#4B78FF]"
              >
                <X className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            )}
          </div>
        )}
      </Field>
    );
  }
);

SearchInput.displayName = 'SearchInput';
