import { Dialog } from '../../molecules/Dialog/Dialog';
import { Button } from '../../atoms/Button/Button';

interface DeviceStatusDialogProps {
  onRegisterDevice: () => void;
  onContinueWithOTP: () => void;
}

export function DeviceStatusDialog({
  onRegisterDevice,
  onContinueWithOTP,
}: Readonly<DeviceStatusDialogProps>) {
  return (
    <Dialog
      title="Device Not Registered"
      subtitle="This device is not registered to use local authentication for the current user. Would you like to register this device or continue with OTP?"
    >
      <div className="dialog__actions">
        <Button label="Register Device" onClick={onRegisterDevice} />
        <Button label="Continue with OTP" variant="secondary" onClick={onContinueWithOTP} />
      </div>
    </Dialog>
  );
}
