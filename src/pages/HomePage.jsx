import { Link } from "react-router-dom";
import Button from "../components/Button.jsx";
import Icon from "../components/Icon.jsx";
import SmartImage from "../components/SmartImage.jsx";
import SectionHeading from "../components/SectionHeading.jsx";
import ProductCard from "../components/ProductCard.jsx";
import {
  ErrorState,
  ProductGridSkeleton,
  Spinner,
} from "../components/StateViews.jsx";
import {
  CustomisationServices,
  EnquiryCTA,
  OccasionGrid,
  ProcessSteps,
} from "../components/home/HomeSections.jsx";
import { useAsync } from "../hooks/useAsync.js";
import { useDocumentMeta } from "../hooks/useDocumentMeta.js";
import { fetchOccasions, fetchProducts } from "../services/catalogueService.js";

export default function HomePage() {
  useDocumentMeta({ path: "/" });
  const featured = useAsync(
    ({ signal }) =>
      fetchProducts({ featured: true, size: 4, sort: "featured" }, { signal }),
    []
  );
  const occasions = useAsync(({ signal }) => fetchOccasions({ signal }), []);

  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <div className="container hero__inner">
          <div className="hero__copy">
            <p className="eyebrow eyebrow--light">
              Corporate gifting & personalised merchandise
            </p>
            <h1 id="hero-title">Thoughtful Gifts. Lasting Impressions.</h1>
            <p className="hero__text">
              From curated hampers to branded drinkware, apparel and work
              essentials, Tribe Green helps you thank clients, welcome new
              joiners and celebrate your people with gifts that are personal,
              premium and delivered on time.
            </p>
            <div className="hero__actions">
              <Button to="/catalogue" size="lg" variant="light">
                Explore Collection <Icon name="arrowRight" size={18} />
              </Button>
              <Button to="/enquiry" size="lg" variant="ghost-light">
                Request a Quote
              </Button>
            </div>
            <ul className="hero__points">
              <li>
                <Icon name="check" size={16} /> Logo & message personalisation
              </li>
              <li>
                <Icon name="check" size={16} /> Bulk and multi-address delivery
              </li>
              <li>
                <Icon name="check" size={16} /> Mock-up approval before
                production
              </li>
            </ul>
          </div>
          <div className="hero__media">
            <SmartImage
              src="/images/hero-hamper.svg"
              alt="Corporate gift hamper in a woven basket with a steel bottle, candle and notebook tied with a cream ribbon"
              width={1200}
              height={900}
              eager
            />
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="featured-title">
        <div className="container">
          <SectionHeading
            id="featured-title"
            eyebrow="Featured products"
            title="Gifts our clients love"
            text="A hand-picked selection across drinkware, apparel, work essentials and wellness."
          />
          {featured.loading && <ProductGridSkeleton count={4} />}
          {featured.error && (
            <ErrorState
              message={featured.error.message}
              onRetry={featured.reload}
            />
          )}
          {featured.data && (
            <div className="product-grid product-grid--four">
              {featured.data.content.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
          <p className="section__more">
            <Button to="/catalogue" variant="secondary">
              View full catalogue
            </Button>
          </p>
        </div>
      </section>

      <section
        className="section section--beige"
        aria-labelledby="occasions-title"
      >
        <div className="container">
          <SectionHeading
            id="occasions-title"
            eyebrow="Shop by occasion"
            title="A gift for every moment that matters"
          />
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
          {occasions.data && <OccasionGrid occasions={occasions.data} />}
          <p className="section__more">
            <Link to="/occasions" className="text-link">
              Explore all occasions <Icon name="arrowRight" size={16} />
            </Link>
          </p>
        </div>
      </section>

      <CustomisationServices />
      <ProcessSteps />
      <EnquiryCTA />
    </>
  );
}
