import { useState } from 'react';
import { FormField } from '../../molecules/FormField/FormField';
import { Button } from '../../atoms/Button/Button';
import { Spinner } from '../../atoms/Spinner/Spinner';
import { StatusMessage } from '../../atoms/StatusMessage/StatusMessage';
import { DeviceStatusDialog } from '../DeviceStatusDialog/DeviceStatusDialog';
import { OTPDialog } from '../OTPDialog/OTPDialog';
import { checkWebAuthnStatus } from '../../../services/api';
import { registerDevice, authenticateDevice } from '../../../services/webauthn';
import type { PreLoginStep } from '../../../types';
import './PreLoginForm.css';

interface PreLoginFormProps {
  corpId: string;
  loginId: string;
}

export function PreLoginForm({ corpId, loginId }: Readonly<PreLoginFormProps>) {
  const [password, setPassword] = useState('');
  const [step, setStep] = useState<PreLoginStep>('IDLE');
  const [errorMsg, setErrorMsg] = useState('');

  const isBusy = step === 'CHECKING_STATUS' || step === 'REGISTERING' || step === 'AUTHENTICATING';

  function setError(msg: string) {
    setErrorMsg(msg);
    setStep('ERROR');
  }

  async function handleLogin() {
    if (!password.trim()) {
      setError('Please enter your password.');
      return;
    }
    setStep('CHECKING_STATUS');
    try {
      const status = await checkWebAuthnStatus(loginId);
      if (status.registered && status.hasCredential) {
        setStep('AUTHENTICATING');
        try {
          await authenticateDevice(loginId);
          setStep('SUCCESS_LOGIN');
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Biometric authentication failed.');
        }
      } else {
        setStep('DEVICE_NOT_REGISTERED');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to reach server.');
    }
  }

  function handleRegisterDevice() {
    setStep('REGISTER_OTP_ENTRY');
  }

  function handleContinueWithOTP() {
    setStep('OTP_ENTRY');
  }

  async function handleOTPVerifiedForRegister() {
    setStep('REGISTERING');
    try {
      await registerDevice(loginId);
      setStep('SUCCESS_REGISTERED');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Device registration failed.');
    }
  }

  function handleOTPVerifiedForLogin() {
    setStep('SUCCESS_OTP');
  }

  function handleDialogCancel() {
    setStep('IDLE');
  }

  const showDialog =
    step === 'DEVICE_NOT_REGISTERED' ||
    step === 'REGISTER_OTP_ENTRY' ||
    step === 'OTP_ENTRY';

  return (
    <>
      {showDialog && (
        <>
          {step === 'DEVICE_NOT_REGISTERED' && (
            <DeviceStatusDialog
              onRegisterDevice={handleRegisterDevice}
              onContinueWithOTP={handleContinueWithOTP}
            />
          )}
          {step === 'REGISTER_OTP_ENTRY' && (
            <OTPDialog
              title="Register Device"
              subtitle="Please enter the OTP sent to your registered mobile number to proceed with device registration."
              onVerified={handleOTPVerifiedForRegister}
              onCancel={handleDialogCancel}
            />
          )}
          {step === 'OTP_ENTRY' && (
            <OTPDialog
              title="OTP Verification"
              subtitle="Please enter the OTP sent to your registered mobile number to login."
              onVerified={handleOTPVerifiedForLogin}
              onCancel={handleDialogCancel}
            />
          )}
        </>
      )}

      <div className="pre-login-form">
        <div className="pre-login-form__readonly-fields">
          <div className="pre-login-form__readonly-item">
            <span className="pre-login-form__readonly-label">Corporate ID</span>
            <span className="pre-login-form__readonly-value">{corpId}</span>
          </div>
          <div className="pre-login-form__readonly-item">
            <span className="pre-login-form__readonly-label">Login ID</span>
            <span className="pre-login-form__readonly-value">{loginId}</span>
          </div>
        </div>

        <FormField
          label="Password"
          id="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (step === 'ERROR') setStep('IDLE');
          }}
          placeholder="Enter your password"
          type="password"
          disabled={isBusy}
          autoComplete="current-password"
        />

        <div className="pre-login-form__submit">
          <Button
            label={
              isBusy ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                  <Spinner white />
                  {step === 'CHECKING_STATUS' && 'Checking…'}
                  {step === 'REGISTERING' && 'Registering…'}
                  {step === 'AUTHENTICATING' && 'Authenticating…'}
                </span>
              ) : (
                'Login'
              )
            }
            onClick={handleLogin}
            disabled={isBusy}
          />
        </div>

        <div className="pre-login-form__result">
          {step === 'SUCCESS_LOGIN' && (
            <StatusMessage message="Biometric Login Successful" variant="success" />
          )}
          {step === 'SUCCESS_REGISTERED' && (
            <StatusMessage message="Device registered successfully!" variant="success" />
          )}
          {step === 'SUCCESS_OTP' && (
            <StatusMessage message="OTP verified successfully!" variant="success" />
          )}
          {step === 'ERROR' && (
            <StatusMessage message={errorMsg} variant="error" />
          )}
        </div>
      </div>
    </>
  );
}
