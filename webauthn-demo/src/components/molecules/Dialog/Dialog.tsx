import React from 'react';
import './Dialog.css';

interface DialogProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export function Dialog({ title, subtitle, children }: Readonly<DialogProps>) {
  return (
    <div className="dialog-overlay">
      <div className="dialog">
        <div className="dialog__header">
          <h2 className="dialog__title">{title}</h2>
        </div>
        <div className="dialog__body">
          {subtitle && <p className="dialog__subtitle">{subtitle}</p>}
          {children}
        </div>
      </div>
    </div>
  );
}
