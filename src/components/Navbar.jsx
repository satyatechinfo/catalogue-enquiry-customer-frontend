import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import Logo from './Logo.jsx';
import Button from './Button.jsx';
import Icon from './Icon.jsx';
import { useEnquiryBasket } from '../context/EnquiryBasketContext.jsx';

const LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/catalogue', label: 'Catalogue' },
  { to: '/occasions', label: 'Occasions' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const { count } = useEnquiryBasket();

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Logo />
        <button
          type="button"
          className="nav-toggle"
          aria-expanded={open}
          aria-controls="primary-navigation"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          <Icon name={open ? 'close' : 'menu'} size={24} />
        </button>
        <nav id="primary-navigation" className={`site-nav${open ? ' is-open' : ''}`} aria-label="Primary">
          <ul>
            {LINKS.map((link) => (
              <li key={link.to}>
                <NavLink to={link.to} end={link.end}>{link.label}</NavLink>
              </li>
            ))}
          </ul>
          <Button to="/enquiry" size="sm" className="site-nav__cta">
            Request a Quote{count > 0 && <span className="badge" aria-label={`${count} products selected`}>{count}</span>}
          </Button>
        </nav>
      </div>
    </header>
  );
}
