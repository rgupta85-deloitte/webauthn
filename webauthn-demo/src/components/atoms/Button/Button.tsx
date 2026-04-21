import React from 'react';
import './Button.css';

interface ButtonProps {
  label: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export function Button({
  label,
  onClick,
  variant = 'primary',
  disabled = false,
  type = 'button',
}: Readonly<ButtonProps>) {
  return (
    <button
      type={type}
      className={`button button--${variant}${disabled ? ' button--disabled' : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
}
