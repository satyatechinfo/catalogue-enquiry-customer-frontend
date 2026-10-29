import { useState } from "react";
import { useLocation } from "react-router-dom";
import Button from "../components/Button.jsx";
import Icon from "../components/Icon.jsx";
import { EmptyState } from "../components/StateViews.jsx";
import { useDocumentMeta } from "../hooks/useDocumentMeta.js";
import { formatDate, formatDateTime, formatPrice } from "../utils/format.js";
import { LAST_ENQUIRY_KEY } from "./EnquiryPage.jsx";

function readStored() {
  try {
    const raw = sessionStorage.getItem(LAST_ENQUIRY_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function ThankYouPage() {
  useDocumentMeta({ title: "Thank you", path: "/thank-you", noindex: true });
  const { state } = useLocation();
  // Router state is used right after submission; session storage lets a refresh keep showing the same confirmation.
  const enquiry = state?.enquiry || readStored();
  const [copied, setCopied] = useState(false);

  if (!enquiry?.referenceNumber) {
    return (
      <div className="container section">
        <EmptyState
          title="No recent enquiry to show"
          message="Once you submit an enquiry, your confirmation and reference number will appear here."
          actionLabel="Send an enquiry"
          actionTo="/enquiry"
        />
      </div>
    );
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(enquiry.referenceNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  const rows = [
    ["Name", enquiry.customerName],
    ["Company", enquiry.companyName],
    ["Email", enquiry.email],
    ["Phone", enquiry.phone],
    ["Occasion", enquiry.occasion],
    ["Number of units", enquiry.units],
    ["Budget per unit", formatPrice(enquiry.budgetPerUnit)],
    ["Expected delivery", formatDate(enquiry.expectedDeliveryDate)],
    ["Submitted", enquiry.createdAt ? formatDateTime(enquiry.createdAt) : null],
  ].filter(
    ([, value]) => value !== null && value !== undefined && value !== ""
  );

  return (
    <section className="section">
      <div className="container thank-you">
        <div className="thank-you__header">
          <span className="thank-you__tick">
            <Icon name="check" size={32} />
          </span>
          <h1>Thank you, {enquiry.customerName.split(" ")[0]}!</h1>
          <p>
            Your enquiry has been received and saved. Our gifting team will get
            in touch with you soon.
          </p>
          <div
            className="reference"
            role="group"
            aria-label="Enquiry reference number"
          >
            <span>Your reference number</span>
            <strong>{enquiry.referenceNumber}</strong>
            <button type="button" className="text-button" onClick={copy}>
              {copied ? "Copied ✓" : "Copy"}
            </button>
          </div>
        </div>

        <div className="summary-card">
          <h2>Enquiry summary</h2>
          <dl className="summary-list">
            {rows.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>

          {enquiry.items?.length > 0 && (
            <>
              <h3>Products selected</h3>
              <ul className="summary-items">
                {enquiry.items.map((item) => (
                  <li key={item.productId}>
                    <span>
                      {item.productName} <small>({item.sku})</small>
                    </span>
                    <strong>{item.quantity} units</strong>
                  </li>
                ))}
              </ul>
            </>
          )}
          {enquiry.customisationRequired && (
            <>
              <h3>Customisation required</h3>
              <p>{enquiry.customisationRequired}</p>
            </>
          )}
          {enquiry.additionalMessage && (
            <>
              <h3>Additional message</h3>
              <p>{enquiry.additionalMessage}</p>
            </>
          )}
        </div>

        <div className="thank-you__actions">
          <Button to="/catalogue" size="lg">
            Back to Catalogue
          </Button>
          <Button to="/" size="lg" variant="secondary">
            Continue Browsing
          </Button>
        </div>
      </div>
    </section>
  );
}
