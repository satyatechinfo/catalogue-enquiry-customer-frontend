import Icon from './Icon.jsx';
import { buildWhatsAppLink } from '../utils/whatsapp.js';

export default function WhatsAppButton({ message, children = 'Chat on WhatsApp', size = 'md', variant = 'whatsapp', className = '' }) {
  return (
    <a
      className={`btn btn--${variant} btn--${size} ${className}`.trim()}
      href={buildWhatsAppLink(message)}
      target="_blank"
      rel="noopener noreferrer"
    >
      <Icon name="chat" size={18} />
      {children}
      <span className="visually-hidden"> (opens WhatsApp in a new tab)</span>
    </a>
  );
}
