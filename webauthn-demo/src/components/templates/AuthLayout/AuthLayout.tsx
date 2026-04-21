import React from 'react';
import './AuthLayout.css';

interface AuthLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export function AuthLayout({ title, subtitle, children }: Readonly<AuthLayoutProps>) {
  return (
    <div className="auth-layout">
      <header className="auth-layout__header">
        <div className="auth-layout__logo">
          <div className="auth-layout__logo-icon">A</div>
          <div>
            <span className="auth-layout__logo-text">Internet Banking</span>
          </div>
        </div>
      </header>

      <main className="auth-layout__main">
        <div className="auth-layout__card">
          <div className="auth-layout__card-body">
            <div className="auth-layout__card-header">
              <h1 className="auth-layout__card-title">{title}</h1>
              {subtitle && <p className="auth-layout__card-subtitle">{subtitle}</p>}
            </div>
            {children}
          </div>
        </div>
      </main>

      <footer className="auth-layout__footer">
        © {new Date().getFullYear()} All rights reserved. | For demo purposes only.
      </footer>
    </div>
  );
}
