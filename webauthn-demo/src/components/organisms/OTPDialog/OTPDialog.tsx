import { useState } from 'react';
import { Dialog } from '../../molecules/Dialog/Dialog';
import { Button } from '../../atoms/Button/Button';
import { Input } from '../../atoms/Input/Input';
import './OTPDialog.css';

const DEMO_OTP = '123456';

interface OTPDialogProps {
  title: string;
  subtitle: string;
  onVerified: () => void;
  onCancel: () => void;
}

export function OTPDialog({ title, subtitle, onVerified, onCancel }: Readonly<OTPDialogProps>) {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  function handleSubmit() {
    if (otp.trim() === DEMO_OTP) {
      setError('');
      onVerified();
    } else {
      setError('Invalid OTP. Please try again.');
    }
  }

  return (
    <Dialog title={title} subtitle={subtitle}>
      <div className="otp-dialog__input-row">
        <div style={{ flex: 1 }}>
          <Input
            value={otp}
            onChange={(e) => { setOtp(e.target.value); setError(''); }}
            placeholder="Enter OTP"
            type="text"
            error={!!error}
            autoComplete="one-time-code"
          />
          {error && (
            <span style={{ fontSize: '0.8125rem', color: 'var(--color-error)', marginTop: '0.3rem', display: 'block' }}>
              {error}
            </span>
          )}
          <p className="otp-dialog__hint">An OTP has been sent to your registered mobile number.</p>
        </div>
      </div>
      <div className="dialog__actions">
        <Button label="Submit OTP" onClick={handleSubmit} />
        <Button label="Cancel" variant="secondary" onClick={onCancel} />
      </div>
    </Dialog>
  );
}
