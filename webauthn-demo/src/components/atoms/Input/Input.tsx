import React from 'react';
import './Input.css';

interface InputProps {
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  type?: string;
  error?: boolean;
  id?: string;
  autoComplete?: string;
}

export function Input({
  value,
  onChange,
  placeholder,
  disabled = false,
  readOnly = false,
  type = 'text',
  error = false,
  id,
  autoComplete,
}: Readonly<InputProps>) {
  const cls = [
    'input',
    disabled || readOnly ? 'input--disabled' : '',
    error ? 'input--error' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <input
      id={id}
      type={type}
      className={cls}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      readOnly={readOnly}
      autoComplete={autoComplete}
    />
  );
}
