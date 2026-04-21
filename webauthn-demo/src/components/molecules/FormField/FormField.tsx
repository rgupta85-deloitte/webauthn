import React from 'react';
import { Input } from '../../atoms/Input/Input';
import './FormField.css';

interface FormFieldProps {
  label: string;
  id: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  type?: string;
  error?: string;
  autoComplete?: string;
}

export function FormField({
  label,
  id,
  value,
  onChange,
  placeholder,
  disabled,
  readOnly,
  type,
  error,
  autoComplete,
}: Readonly<FormFieldProps>) {
  return (
    <div className="form-field">
      <label className="form-field__label" htmlFor={id}>
        {label}
      </label>
      <Input
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        type={type}
        error={!!error}
        autoComplete={autoComplete}
      />
      {error && <span className="form-field__error">{error}</span>}
    </div>
  );
}
