import React, { useState, useRef, useEffect } from 'react';
import { clsx } from 'clsx';
import { X, ChevronDown, Check } from 'lucide-react';

interface MultiSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface MultiSelectProps {
  label?: string;
  error?: string;
  helpText?: string;
  required?: boolean;
  options: MultiSelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  label,
  error,
  helpText,
  required,
  options,
  value,
  onChange,
  placeholder = 'Seleccionar opciones...',
  className,
  disabled
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggleOption = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter(v => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  const handleRemoveOption = (optionValue: string) => {
    onChange(value.filter(v => v !== optionValue));
  };

  const selectedOptions = options.filter(option => value.includes(option.value));

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative" ref={containerRef}>
        <div
          className={clsx(
            'relative w-full cursor-default rounded-md border bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 sm:text-sm',
            error ? 'border-red-300' : 'border-gray-300',
            disabled && 'cursor-not-allowed opacity-50',
            className
          )}
          onClick={() => !disabled && setIsOpen(!isOpen)}
        >
          <div className="flex flex-wrap gap-1 min-h-[20px]">
            {selectedOptions.length === 0 ? (
              <span className="text-gray-500">{placeholder}</span>
            ) : (
              selectedOptions.map((option) => (
                <span
                  key={option.value}
                  className="inline-flex items-center gap-1 rounded bg-primary-100 px-2 py-1 text-xs text-primary-800"
                >
                  {option.label}
                  {!disabled && (
                    <button
                      type="button"
                      className="hover:text-primary-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveOption(option.value);
                      }}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </span>
              ))
            )}
          </div>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronDown
              className={clsx(
                'h-5 w-5 text-gray-400 transition-transform',
                isOpen && 'transform rotate-180'
              )}
            />
          </span>
        </div>

        {isOpen && !disabled && (
          <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {options.map((option) => {
              const isSelected = value.includes(option.value);
              return (
                <div
                  key={option.value}
                  className={clsx(
                    'relative cursor-default select-none py-2 pl-10 pr-4',
                    option.disabled
                      ? 'text-gray-400'
                      : 'text-gray-900 hover:bg-primary-600 hover:text-white cursor-pointer'
                  )}
                  onClick={() => !option.disabled && handleToggleOption(option.value)}
                >
                  <span
                    className={clsx(
                      'block truncate',
                      isSelected ? 'font-medium' : 'font-normal'
                    )}
                  >
                    {option.label}
                  </span>
                  {isSelected && (
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary-600">
                      <Check className="h-5 w-5" />
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {helpText && !error && (
        <p className="text-sm text-gray-500">{helpText}</p>
      )}
    </div>
  );
};

export default MultiSelect;