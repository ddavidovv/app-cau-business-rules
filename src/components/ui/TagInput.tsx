import React, { useState, KeyboardEvent } from 'react';
import { X, Plus } from 'lucide-react';
import { clsx } from 'clsx';

interface TagInputProps {
  label?: string;
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  error?: string;
  helpText?: string;
  required?: boolean;
  disabled?: boolean;
  maxTags?: number;
  className?: string;
}

const TagInput: React.FC<TagInputProps> = ({
  label,
  value = [],
  onChange,
  placeholder = "Escribir y presionar Enter...",
  error,
  helpText,
  required,
  disabled = false,
  maxTags,
  className
}) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    } else if (e.key === 'Backspace' && inputValue === '' && value.length > 0) {
      // Si el input está vacío y hay tags, eliminar el último tag
      removeTag(value.length - 1);
    }
  };

  const addTag = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue && !value.includes(trimmedValue)) {
      if (!maxTags || value.length < maxTags) {
        onChange([...value, trimmedValue]);
        setInputValue('');
      }
    }
  };

  const removeTag = (indexToRemove: number) => {
    onChange(value.filter((_, index) => index !== indexToRemove));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const canAddMore = !maxTags || value.length < maxTags;

  return (
    <div className={clsx('space-y-2', className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div
        className={clsx(
          'min-h-[44px] w-full px-3 py-2.5 border rounded-md shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500',
          error ? 'border-red-300' : 'border-gray-300',
          disabled && 'bg-gray-50 cursor-not-allowed'
        )}
      >
        <div className="flex flex-wrap gap-2">
          {/* Tags existentes */}
          {value.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-2 py-1 text-sm bg-blue-100 text-blue-800 rounded-md border border-blue-200"
            >
              {tag}
              {!disabled && (
                <button
                  type="button"
                  onClick={() => removeTag(index)}
                  className="text-blue-600 hover:text-blue-800 focus:outline-none"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </span>
          ))}

          {/* Input para nuevos tags */}
          {canAddMore && !disabled && (
            <div className="flex items-center gap-1 flex-1 min-w-[120px]">
              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder={value.length === 0 ? placeholder : "Añadir otro..."}
                className="flex-1 border-none outline-none bg-transparent text-sm placeholder-gray-400"
                disabled={disabled}
              />
              {inputValue.trim() && (
                <button
                  type="button"
                  onClick={addTag}
                  className="text-blue-600 hover:text-blue-800 focus:outline-none"
                >
                  <Plus className="h-4 w-4" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Información adicional */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>
          {value.length} elemento{value.length !== 1 ? 's' : ''}
          {maxTags ? ` de ${maxTags} máximo` : ''}
        </span>
        {!disabled && (
          <span className="text-gray-400">
            Presiona Enter para añadir
          </span>
        )}
      </div>

      {/* Error message */}
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {/* Help text */}
      {helpText && !error && (
        <p className="text-sm text-gray-500">{helpText}</p>
      )}
    </div>
  );
};

export default TagInput;