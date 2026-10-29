import { Link } from "react-router-dom";
import Icon from "../components/Icon.jsx";
import OccasionIcon from "../components/OccasionIcon.jsx";
import SectionHeading from "../components/SectionHeading.jsx";
import { EnquiryCTA } from "../components/home/HomeSections.jsx";
import { ErrorState, Spinner } from "../components/StateViews.jsx";
import { useAsync } from "../hooks/useAsync.js";
import { useDocumentMeta } from "../hooks/useDocumentMeta.js";
import { fetchOccasions } from "../services/catalogueService.js";

export default function OccasionsPage() {
  useDocumentMeta({
    title: "Gifts by Occasion",
    description:
      "Find corporate gifts for Diwali, New Year, onboarding, work anniversaries, client appreciation and events.",
    path: "/occasions",
  });
  const occasions = useAsync(({ signal }) => fetchOccasions({ signal }), []);

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <SectionHeading
            as="h1"
            align="left"
            eyebrow="Occasions"
            title="Gifts for every moment that matters"
            text="Start with the occasion and we will show you the products that suit it best."
          />
        </div>
      </section>
      <section className="section section--tight">
        <div className="container">
          {occasions.loading && (
            <div className="center-block">
              <Spinner label="Loading occasions" />
            </div>
          )}
          {occasions.error && (
            <ErrorState
              message={occasions.error.message}
              onRetry={occasions.reload}
            />
          )}
          {occasions.data && (
            <ul className="occasion-list">
              {occasions.data.map((o) => (
                <li key={o.id} className="occasion-row">
                  <span className="occasion-card__icon">
                    <OccasionIcon slug={o.slug} size={32} />
                  </span>
                  <div>
                    <h2>{o.name}</h2>
                    <p>{o.description}</p>
                  </div>
                  <div className="occasion-row__actions">
                    <Link
                      to={`/catalogue?occasion=${o.slug}`}
                      className="btn btn--primary btn--sm"
                    >
                      Browse gifts <Icon name="arrowRight" size={16} />
                    </Link>
                    <Link
                      to={`/enquiry?occasion=${o.slug}`}
                      className="btn btn--secondary btn--sm"
                    >
                      Request a quote
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
      <EnquiryCTA />
    </>
  );
}
