import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import Button from "../components/Button.jsx";
import Icon from "../components/Icon.jsx";
import ProductCard from "../components/ProductCard.jsx";
import QuantityInput from "../components/QuantityInput.jsx";
import SmartImage from "../components/SmartImage.jsx";
import WhatsAppButton from "../components/WhatsAppButton.jsx";
import { EmptyState, ErrorState, Spinner } from "../components/StateViews.jsx";
import { useEnquiryBasket } from "../context/EnquiryBasketContext.jsx";
import { useAsync } from "../hooks/useAsync.js";
import { useDocumentMeta } from "../hooks/useDocumentMeta.js";
import { absoluteUrl } from "../config.js";
import { fetchProduct, fetchProducts } from "../services/catalogueService.js";
import { formatPrice, formatPriceRange, productPath } from "../utils/format.js";
import { productEnquiryMessage } from "../utils/whatsapp.js";

function ProductMeta({ product }) {
  const path = productPath(product);
  useDocumentMeta({
    title: product.name,
    description: product.shortDescription,
    image: product.imageUrl,
    path,
    type: "product",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.name,
      sku: product.sku,
      image: absoluteUrl(product.imageUrl),
      description: product.shortDescription,
      category: product.category.name,
      offers: {
        "@type": "AggregateOffer",
        priceCurrency: "INR",
        lowPrice: product.minPrice,
        highPrice: product.maxPrice,
      },
    },
  });
  return null;
}

function Related({ product }) {
  const related = useAsync(
    ({ signal }) =>
      fetchProducts({ category: product.category.slug, size: 5 }, { signal }),
    [product.id]
  );
  const items = (related.data?.content || [])
    .filter((p) => p.id !== product.id)
    .slice(0, 4);
  if (related.loading || related.error || items.length === 0) return null;
  return (
    <section className="section section--beige" aria-labelledby="related-title">
      <div className="container">
        <h2 id="related-title" className="related-title">
          More from {product.category.name}
        </h2>
        <div className="product-grid product-grid--four">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function ProductDetailsPage() {
  const { id, slug } = useParams();
  const navigate = useNavigate();
  const basket = useEnquiryBasket();
  const productState = useAsync(
    ({ signal }) => fetchProduct(id, { signal }),
    [id]
  );
  // Ignore data left over from the previously viewed product while the next one loads.
  const product =
    productState.data && String(productState.data.id) === String(id)
      ? productState.data
      : null;
  const [quantity, setQuantity] = useState("");
  const [quantityError, setQuantityError] = useState("");

  useEffect(() => {
    if (product) {
      const existing = basket.items.find((i) => i.productId === product.id);
      setQuantity(existing ? existing.quantity : product.minOrderQuantity);
      setQuantityError("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.id]);

  if (productState.error?.status === 404) {
    return (
      <div className="container section">
        <EmptyState
          title="Product not found"
          message="This product may have been removed or the link is incorrect."
          actionLabel="Browse the catalogue"
          actionTo="/catalogue"
        />
      </div>
    );
  }
  if (productState.error) {
    return (
      <div className="container section">
        <ErrorState
          title="We couldn't load this product"
          message={productState.error.message}
          onRetry={productState.reload}
        />
      </div>
    );
  }
  if (!product) {
    return (
      <div className="container section center-block">
        <Spinner label="Loading product" />
      </div>
    );
  }

  // Normalise the URL so every product has exactly one canonical, shareable address.
  if (slug !== product.slug)
    return <Navigate to={productPath(product)} replace />;

  const qty = Number(quantity);
  const validate = () => {
    if (!Number.isInteger(qty) || qty < 1)
      return "Enter a whole number of units";
    if (qty < product.minOrderQuantity)
      return `Minimum order quantity is ${product.minOrderQuantity} units`;
    return "";
  };

  const sendEnquiry = () => {
    const error = validate();
    setQuantityError(error);
    if (error) {
      document.getElementById("product-quantity")?.focus();
      return;
    }
    basket.addItem(product, qty);
    navigate("/enquiry");
  };

  const shareUrl = absoluteUrl(productPath(product));
  const validQty = Number.isInteger(qty) && qty > 0;

  return (
    <>
      <ProductMeta product={product} />
      <div className="container">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <ol>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/catalogue">Catalogue</Link>
            </li>
            <li>
              <Link to={`/catalogue?category=${product.category.slug}`}>
                {product.category.name}
              </Link>
            </li>
            <li aria-current="page">{product.name}</li>
          </ol>
        </nav>
      </div>

      <section className="container product-detail">
        <div className="product-detail__media">
          <SmartImage
            src={product.imageUrl}
            alt={`${product.name} - ${product.shortDescription}`}
            width={800}
            height={800}
            eager
          />
        </div>

        <div className="product-detail__info">
          <p className="product-card__category">
            {product.category.name} · {product.sku}
          </p>
          <h1>{product.name}</h1>
          <p className="product-detail__price">
            {formatPriceRange(product.minPrice, product.maxPrice)}
            <span> per unit</span>
          </p>
          <p className="product-detail__lead">{product.shortDescription}</p>
          {product.description && <p>{product.description}</p>}

          <dl className="facts">
            <div>
              <dt>Minimum order quantity</dt>
              <dd>{product.minOrderQuantity} units</dd>
            </div>
            <div>
              <dt>Product ID</dt>
              <dd>{product.sku}</dd>
            </div>
          </dl>

          <h2 className="subheading">Suitable occasions</h2>
          <ul className="chips">
            {product.occasions.map((o) => (
              <li key={o.id}>
                <Link to={`/catalogue?occasion=${o.slug}`} className="chip">
                  {o.name}
                </Link>
              </li>
            ))}
          </ul>

          <h2 className="subheading">Customisation options</h2>
          <ul className="checklist">
            {product.customisationOptions.map((opt) => (
              <li key={opt}>
                <Icon name="check" size={16} /> {opt}
              </li>
            ))}
          </ul>

          <div className="buy-box">
            <QuantityInput
              id="product-quantity"
              label="Quantity (units)"
              value={quantity}
              min={1}
              onChange={(v) => {
                setQuantity(v);
                setQuantityError("");
              }}
              error={quantityError}
            />
            {validQty && (
              <p className="buy-box__estimate">
                Indicative total:{" "}
                <strong>
                  {formatPrice(qty * product.minPrice)} –{" "}
                  {formatPrice(qty * product.maxPrice)}
                </strong>
                <span>
                  {" "}
                  Final pricing depends on quantity and customisation.
                </span>
              </p>
            )}
            <div className="buy-box__actions">
              <Button size="lg" onClick={sendEnquiry}>
                Send Enquiry
              </Button>
              <WhatsAppButton
                size="lg"
                variant="whatsapp"
                message={productEnquiryMessage({
                  product,
                  quantity: validQty ? qty : product.minOrderQuantity,
                  url: shareUrl,
                })}
              >
                Enquire on WhatsApp
              </WhatsAppButton>
            </div>
          </div>
        </div>
      </section>

      <Related product={product} />
    </>
  );
}
