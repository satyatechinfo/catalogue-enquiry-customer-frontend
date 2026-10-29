import { Link } from 'react-router-dom';
import Logo from './Logo.jsx';
import Icon from './Icon.jsx';
import WhatsAppButton from './WhatsAppButton.jsx';
import { config } from '../config.js';
import { generalEnquiryMessage } from '../utils/whatsapp.js';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__grid">
        <div className="site-footer__brand">
          <Logo light />
          <p>Thoughtful corporate gifts and personalised merchandise that make teams, clients and partners feel valued.</p>
          <WhatsAppButton size="sm" variant="ghost-light" message={generalEnquiryMessage()}>WhatsApp us</WhatsAppButton>
        </div>
        <nav aria-label="Explore">
          <h2>Explore</h2>
          <ul>
            <li><Link to="/catalogue">Catalogue</Link></li>
            <li><Link to="/occasions">Occasions</Link></li>
            <li><Link to="/about">About us</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </nav>
        <nav aria-label="Categories">
          <h2>Collections</h2>
          <ul>
            <li><Link to="/catalogue?category=drinkware">Drinkware</Link></li>
            <li><Link to="/catalogue?category=apparel">Apparel</Link></li>
            <li><Link to="/catalogue?category=work-essentials">Work Essentials</Link></li>
            <li><Link to="/catalogue?category=wellness">Wellness</Link></li>
          </ul>
        </nav>
        <div>
          <h2>Get in touch</h2>
          <ul>
            <li><Link to="/enquiry">Request a quote</Link></li>
            {config.contactEmail && (
              <li><a href={`mailto:${config.contactEmail}`}><Icon name="mail" size={16} /> {config.contactEmail}</a></li>
            )}
            {config.contactPhone && (
              <li><a href={`tel:${config.contactPhone.replace(/\s/g, '')}`}><Icon name="phone" size={16} /> {config.contactPhone}</a></li>
            )}
          </ul>
        </div>
      </div>
      <div className="container site-footer__bottom">
        <p>© {new Date().getFullYear()} Tribe Green. Sample corporate gifting brand created for the V Green Media assignment.</p>
      </div>
    </footer>
  );
}
