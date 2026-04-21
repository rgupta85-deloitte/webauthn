import './Spinner.css';

interface SpinnerProps {
  white?: boolean;
}

export function Spinner({ white = false }: Readonly<SpinnerProps>) {
  return <span className={`spinner${white ? ' spinner--white' : ''}`} />;
}
