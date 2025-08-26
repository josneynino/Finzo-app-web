import React from 'react';

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  label?: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export function Select({
  label,
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  error,
  required = false,
  disabled = false,
  className = '',
}: SelectProps) {
  const selectClasses = `
    block w-full px-4 py-3 bg-white/60 backdrop-blur-sm border rounded-xl text-sm font-medium
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white/80
    disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
    transition-all duration-300 hover:bg-white/70
    ${error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-white/30 hover:border-white/50'}
  `;

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        disabled={disabled}
        className={selectClasses}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-2 text-sm text-red-600 font-medium">{error}</p>}
    </div>
  );
}