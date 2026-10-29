import Button from "../components/Button.jsx";
import { useDocumentMeta } from "../hooks/useDocumentMeta.js";

export default function NotFoundPage() {
  useDocumentMeta({ title: "Page not found", noindex: true });
  return (
    <section className="section">
      <div className="container state-view">
        <p className="eyebrow">Error 404</p>
        <h1>We can't find that page</h1>
        <p>The link may be broken or the page may have moved.</p>
        <div className="thank-you__actions">
          <Button to="/">Go to home</Button>
          <Button to="/catalogue" variant="secondary">
            Browse the catalogue
          </Button>
        </div>
      </div>
    </section>
  );
}
