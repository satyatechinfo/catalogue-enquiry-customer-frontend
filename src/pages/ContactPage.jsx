import Button from "../components/Button.jsx";
import Icon from "../components/Icon.jsx";
import SectionHeading from "../components/SectionHeading.jsx";
import WhatsAppButton from "../components/WhatsAppButton.jsx";
import { config } from "../config.js";
import { useDocumentMeta } from "../hooks/useDocumentMeta.js";
import { generalEnquiryMessage } from "../utils/whatsapp.js";

export default function ContactPage() {
  useDocumentMeta({
    title: "Contact Us",
    description:
      "Contact the Tribe Green gifting team for quotes, samples and customisation advice.",
    path: "/contact",
  });
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <SectionHeading
            as="h1"
            align="left"
            eyebrow="Contact"
            title="Let's plan your next gift"
            text="The quickest way to reach us is to send an enquiry. We will take it from there."
          />
        </div>
      </section>
      <section className="section section--tight">
        <div className="container contact-grid">
          <div className="contact-options">
            <article className="contact-card contact-card--primary">
              <span className="service-card__icon">
                <Icon name="clipboard" size={24} />
              </span>
              <h2>Send an enquiry</h2>
              <p>
                Tell us about the occasion, quantity, budget and delivery date.
                Your enquiry goes straight to our team.
              </p>
              <Button to="/enquiry">Request a Quote</Button>
            </article>
            <article className="contact-card">
              <span className="service-card__icon">
                <Icon name="chat" size={24} />
              </span>
              <h2>WhatsApp</h2>
              <p>
                Prefer a quick conversation? Start a chat with your requirement
                pre-filled.
              </p>
              <WhatsAppButton
                variant="secondary"
                message={generalEnquiryMessage()}
              >
                Chat on WhatsApp
              </WhatsAppButton>
            </article>
            {config.contactEmail && (
              <article className="contact-card">
                <span className="service-card__icon">
                  <Icon name="mail" size={24} />
                </span>
                <h2>Email</h2>
                <p>
                  <a href={`mailto:${config.contactEmail}`}>
                    {config.contactEmail}
                  </a>
                </p>
              </article>
            )}
            {config.contactPhone && (
              <article className="contact-card">
                <span className="service-card__icon">
                  <Icon name="phone" size={24} />
                </span>
                <h2>Phone</h2>
                <p>
                  <a href={`tel:${config.contactPhone.replace(/\s/g, "")}`}>
                    {config.contactPhone}
                  </a>
                </p>
              </article>
            )}
          </div>

          <aside className="side-card">
            <h2>Helpful to include</h2>
            <ul className="checklist">
              <li>
                <Icon name="check" size={16} /> The occasion and who the gifts
                are for
              </li>
              <li>
                <Icon name="check" size={16} /> Approximate quantity and budget
                per gift
              </li>
              <li>
                <Icon name="check" size={16} /> Your delivery date and locations
              </li>
              <li>
                <Icon name="check" size={16} /> Branding: logo files and any
                colour guidelines
              </li>
              <li>
                <Icon name="check" size={16} /> Products you already have in
                mind
              </li>
            </ul>
          </aside>
        </div>
      </section>
    </>
  );
}
