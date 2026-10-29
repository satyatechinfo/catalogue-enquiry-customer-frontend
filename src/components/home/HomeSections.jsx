import { Link } from 'react-router-dom';
import Icon from '../Icon.jsx';
import Button from '../Button.jsx';
import OccasionIcon from '../OccasionIcon.jsx';
import SectionHeading from '../SectionHeading.jsx';
import WhatsAppButton from '../WhatsAppButton.jsx';
import { generalEnquiryMessage } from '../../utils/whatsapp.js';

export function OccasionGrid({ occasions }) {
  return (
    <ul className="occasion-grid">
      {occasions.map((o) => (
        <li key={o.id}>
          <Link to={`/catalogue?occasion=${o.slug}`} className="occasion-card">
            <span className="occasion-card__icon"><OccasionIcon slug={o.slug} /></span>
            <h3>{o.name}</h3>
            <p>{o.description}</p>
            <span className="occasion-card__cta">Shop gifts <Icon name="arrowRight" size={16} /></span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

const SERVICES = [
  { icon: 'engrave', title: 'Laser engraving', text: 'Permanent, premium marking for metal, wood and leather products.' },
  { icon: 'layers', title: 'Logo printing', text: 'Crisp screen and digital printing on apparel, drinkware and stationery.' },
  { icon: 'thread', title: 'Embroidery', text: 'Durable stitched logos and names on caps, polos and jackets.' },
  { icon: 'box', title: 'Custom packaging', text: 'Branded gift boxes, message cards and wrapping that complete the unboxing.' },
];

export function CustomisationServices() {
  return (
    <section className="section section--beige" aria-labelledby="customisation-title">
      <div className="container">
        <SectionHeading
          id="customisation-title"
          eyebrow="Customisation services"
          title="Make every gift unmistakably yours"
          text="From a single logo to fully bespoke hampers, our team handles artwork, production and finishing."
        />
        <ul className="service-grid">
          {SERVICES.map((s) => (
            <li className="service-card" key={s.title}>
              <span className="service-card__icon"><Icon name={s.icon} size={26} /></span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

const STEPS = [
  { icon: 'clipboard', title: 'Share your brief', text: 'Tell us the occasion, quantity, budget and delivery date through a quick enquiry.' },
  { icon: 'gift', title: 'Choose & customise', text: 'We recommend products and branding options that fit your audience and budget.' },
  { icon: 'eye', title: 'Approve the mock-up', text: 'Review artwork and samples before anything goes into production.' },
  { icon: 'truck', title: 'Production & delivery', text: 'We produce, quality-check and deliver to one address or many.' },
];

export function ProcessSteps() {
  return (
    <section className="section" aria-labelledby="process-title">
      <div className="container">
        <SectionHeading id="process-title" eyebrow="How it works" title="Corporate gifting, made simple" />
        <ol className="process">
          {STEPS.map((s, i) => (
            <li className="process__step" key={s.title}>
              <span className="process__num" aria-hidden="true">{i + 1}</span>
              <span className="process__icon"><Icon name={s.icon} size={24} /></span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function EnquiryCTA() {
  return (
    <section className="cta" aria-labelledby="cta-title">
      <div className="container cta__inner">
        <div>
          <h2 id="cta-title">Planning a corporate gifting programme?</h2>
          <p>Tell us what you need and we will come back with recommendations, pricing and timelines.</p>
        </div>
        <div className="cta__actions">
          <Button to="/enquiry" variant="light" size="lg">Request a Quote</Button>
          <WhatsAppButton size="lg" variant="ghost-light" message={generalEnquiryMessage()}>WhatsApp us</WhatsAppButton>
        </div>
      </div>
    </section>
  );
}
