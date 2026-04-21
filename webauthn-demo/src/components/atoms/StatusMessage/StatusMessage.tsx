import './StatusMessage.css';

type Variant = 'success' | 'error' | 'info';

const ICONS: Record<Variant, string> = {
  success: '✅',
  error: '❌',
  info: 'ℹ️',
};

interface StatusMessageProps {
  message: string;
  variant: Variant;
}

export function StatusMessage({ message, variant }: Readonly<StatusMessageProps>) {
  return (
    <div className={`status-message status-message--${variant}`}>
      <span className="status-message__icon">{ICONS[variant]}</span>
      <span className="status-message__text">{message}</span>
    </div>
  );
}
