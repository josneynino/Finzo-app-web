import React from 'react';

interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'date' | 'tel';
  label?: string;
  placeholder?: string;
  value: string | number;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export function Input({
  type = 'text',
  label,
  placeholder,
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  className = '',
}: InputProps) {
  const inputClasses = `
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
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={inputClasses}
      />
      {error && <p className="mt-2 text-sm text-red-600 font-medium">{error}</p>}
    </div>
  );
}