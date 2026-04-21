import { AuthLayout } from '../../components/templates/AuthLayout/AuthLayout';
import { PreLoginInterimForm } from '../../components/organisms/PreLoginInterimForm/PreLoginInterimForm';

export function PreLoginInterimPage() {
  return (
    <AuthLayout
      title="Secured Login"
      subtitle="Please enter your Corporate ID and Login ID to proceed."
    >
      <PreLoginInterimForm />
    </AuthLayout>
  );
}
