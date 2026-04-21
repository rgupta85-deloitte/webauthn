import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../../components/templates/AuthLayout/AuthLayout';
import { PreLoginForm } from '../../components/organisms/PreLoginForm/PreLoginForm';
import type { UserCredentials } from '../../types';

export function PreLoginPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as UserCredentials | null;

  useEffect(() => {
    if (!state?.corpId || !state?.loginId) {
      navigate('/pre-login-interim', { replace: true });
    }
  }, [state, navigate]);

  if (!state?.corpId || !state?.loginId) return null;

  return (
    <AuthLayout
      title="Login"
      subtitle="Enter your password to continue with secure authentication."
    >
      <PreLoginForm corpId={state.corpId} loginId={state.loginId} />
    </AuthLayout>
  );
}
