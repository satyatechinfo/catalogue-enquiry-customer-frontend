import { Link } from 'react-router-dom';

export function LogoMark({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <rect width="64" height="64" rx="16" fill="currentColor" />
      <path d="M18 40C18 24 28 16 46 14c0 16-8 28-24 28z" fill="#f6f1e7" />
      <path d="M20 46c6-8 12-14 20-20" stroke="#123524" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export default function Logo({ light = false }) {
  return (
    <Link to="/" className={`logo${light ? ' logo--light' : ''}`} aria-label="Tribe Green home">
      <LogoMark />
      <span className="logo__text">Tribe <span>Green</span></span>
    </Link>
  );
}
