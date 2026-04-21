import { useState } from 'react';
import type React from 'react';
import { useNavigate } from 'react-router-dom';
import { FormField } from '../../molecules/FormField/FormField';
import { Button } from '../../atoms/Button/Button';
import { validateCredentials } from '../../../mocks/users';
import type { UserCredentials } from '../../../types';
import './PreLoginInterimForm.css';

export function PreLoginInterimForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState<UserCredentials>({ corpId: '', loginId: '' });
  const [error, setError] = useState('');

  function handleChange(field: keyof UserCredentials) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      setError('');
    };
  }

  function handleProceed() {
    if (!form.corpId.trim() || !form.loginId.trim()) {
      setError('Please enter both Corporate ID and Login ID.');
      return;
    }
    if (!validateCredentials(form.corpId.trim(), form.loginId.trim())) {
      setError('Invalid Credentials. Please check your Corporate ID and Login ID.');
      return;
    }
    navigate('/pre-login', {
      state: {
        corpId: form.corpId.trim().toUpperCase(),
        loginId: form.loginId.trim().toUpperCase(),
      },
    });
  }

  return (
    <div className="pre-login-interim-form">
      <div className="pre-login-interim-form__fields">
        <FormField
          label="Corporate ID"
          id="corpId"
          value={form.corpId}
          onChange={handleChange('corpId')}
          placeholder="e.g. SITCORP16"
          autoComplete="off"
        />
        <FormField
          label="Login ID"
          id="loginId"
          value={form.loginId}
          onChange={handleChange('loginId')}
          placeholder="e.g. MAKER1"
          autoComplete="off"
        />
      </div>

      {error && (
        <span style={{ fontSize: '0.8rem', color: 'var(--color-error)' }}>
          {error}
        </span>
      )}

      <div className="pre-login-interim-form__submit">
        <Button label="Proceed" onClick={handleProceed} />
      </div>
    </div>
  );
}
