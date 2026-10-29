import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Button from "../components/Button.jsx";
import Field from "../components/Field.jsx";
import Icon from "../components/Icon.jsx";
import QuantityInput from "../components/QuantityInput.jsx";
import SmartImage from "../components/SmartImage.jsx";
import SectionHeading from "../components/SectionHeading.jsx";
import WhatsAppButton from "../components/WhatsAppButton.jsx";
import { Spinner } from "../components/StateViews.jsx";
import { useEnquiryBasket } from "../context/EnquiryBasketContext.jsx";
import { useAsync } from "../hooks/useAsync.js";
import { useDocumentMeta } from "../hooks/useDocumentMeta.js";
import { fetchOccasions, fetchProducts } from "../services/catalogueService.js";
import { submitEnquiry } from "../services/enquiryService.js";
import { tomorrowInputDate } from "../utils/format.js";
import { newRequestId } from "../utils/ids.js";
import {
  EMPTY_ENQUIRY,
  normaliseServerFieldErrors,
  validateEnquiry,
} from "../utils/validation.js";
import { generalEnquiryMessage } from "../utils/whatsapp.js";

export const LAST_ENQUIRY_KEY = "tg:last-enquiry";
const FIELD_ORDER = [
  "customerName",
  "companyName",
  "phone",
  "email",
  "occasion",
  "units",
  "budgetPerUnit",
  "expectedDeliveryDate",
  "items",
  "customisationRequired",
  "additionalMessage",
];

export default function EnquiryPage() {
  useDocumentMeta({
    title: "Request a Quote",
    description:
      "Tell us about your corporate gifting requirement and receive recommendations, pricing and timelines from Tribe Green.",
    path: "/enquiry",
    noindex: true,
  });

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const basket = useEnquiryBasket();

  const [values, setValues] = useState(EMPTY_ENQUIRY);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const submittingRef = useRef(false); // synchronous lock: blocks double clicks before React re-renders
  const requestIdRef = useRef(newRequestId()); // lets the server de-duplicate retries of this same enquiry
  const unitsTouched = useRef(false);
  const alertRef = useRef(null);

  const occasions = useAsync(({ signal }) => fetchOccasions({ signal }), []);
  const products = useAsync(
    ({ signal }) => fetchProducts({ size: 50, sort: "name-asc" }, { signal }),
    []
  );

  // Pre-select the occasion coming from ?occasion=slug once the list is known.
  useEffect(() => {
    const slug = searchParams.get("occasion");
    if (slug && occasions.data && !values.occasion) {
      const match = occasions.data.find((o) => o.slug === slug);
      if (match) setValues((v) => ({ ...v, occasion: match.name }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [occasions.data]);

  // Suggest the total unit count from the selected products until the visitor types their own.
  const totalSelected = useMemo(
    () => basket.items.reduce((sum, i) => sum + (Number(i.quantity) || 0), 0),
    [basket.items]
  );
  useEffect(() => {
    if (!unitsTouched.current && totalSelected > 0)
      setValues((v) => ({ ...v, units: String(totalSelected) }));
  }, [totalSelected]);

  const setField = (name) => (e) => {
    if (name === "units") unitsTouched.current = true;
    setValues((v) => ({ ...v, [name]: e.target.value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const available = (products.data?.content || []).filter(
    (p) => !basket.items.some((i) => i.productId === p.id)
  );

  const focusFirstError = (found) => {
    const first = FIELD_ORDER.find((f) => found[f]);
    if (!first) return;
    const el = document.getElementById(
      first === "items" ? "selected-products" : first
    );
    el?.focus?.();
    el?.scrollIntoView?.({ behavior: "smooth", block: "center" });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submittingRef.current) return; // duplicate click / Enter key while a request is in flight

    const found = validateEnquiry(values, basket.items);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      setServerError("");
      focusFirstError(found);
      return;
    }

    submittingRef.current = true;
    setSubmitting(true);
    setServerError("");
    try {
      const saved = await submitEnquiry({
        customerName: values.customerName.trim(),
        companyName: values.companyName.trim(),
        phone: values.phone.trim(),
        email: values.email.trim(),
        occasion: values.occasion,
        units: Number(values.units),
        budgetPerUnit: Number(values.budgetPerUnit),
        expectedDeliveryDate: values.expectedDeliveryDate,
        items: basket.items.map((i) => ({
          productId: i.productId,
          quantity: Number(i.quantity),
        })),
        customisationRequired: values.customisationRequired.trim(),
        additionalMessage: values.additionalMessage.trim(),
        clientRequestId: requestIdRef.current,
      });
      // Only reached once the backend has confirmed (HTTP 201 + reference) that the enquiry is stored.
      try {
        sessionStorage.setItem(LAST_ENQUIRY_KEY, JSON.stringify(saved));
      } catch {
        /* confirmation page still works through router state */
      }
      basket.clear();
      navigate("/thank-you", { replace: true, state: { enquiry: saved } });
    } catch (error) {
      const fieldErrors = normaliseServerFieldErrors(error.fieldErrors);
      if (Object.keys(fieldErrors).length > 0) {
        setErrors(fieldErrors);
        focusFirstError(fieldErrors);
      }
      setServerError(
        error.status >= 400 &&
          error.status < 500 &&
          Object.keys(fieldErrors).length === 0
          ? error.message
          : error.status === 400
          ? "Please correct the highlighted fields and try again."
          : `${error.message} Your details are still here, so you can try again.`
      );
      setTimeout(() => alertRef.current?.focus(), 0);
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  };

  const errorCount = Object.values(errors).filter(Boolean).length;
  const occasionNames = occasions.data?.map((o) => o.name) || [];

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <SectionHeading
            as="h1"
            align="left"
            eyebrow="Enquiry"
            title="Request a quote"
            text="Share a few details and our gifting team will respond with recommendations, pricing and timelines."
          />
        </div>
      </section>

      <section className="section section--tight">
        <div className="container enquiry-layout">
          <form
            className="form-card"
            onSubmit={handleSubmit}
            noValidate
            aria-busy={submitting}
          >
            {(serverError || errorCount > 0) && (
              <div
                className="alert alert--error"
                role="alert"
                tabIndex={-1}
                ref={alertRef}
              >
                <Icon name="alert" size={20} />
                <div>
                  <strong>
                    {serverError
                      ? "We could not send your enquiry"
                      : "Please check the form"}
                  </strong>
                  <p>
                    {serverError ||
                      `${errorCount} ${
                        errorCount === 1 ? "field needs" : "fields need"
                      } your attention.`}
                  </p>
                </div>
              </div>
            )}

            <fieldset className="form-section">
              <legend>Your details</legend>
              <div className="form-grid">
                <Field
                  id="customerName"
                  label="Full name"
                  required
                  autoComplete="name"
                  value={values.customerName}
                  onChange={setField("customerName")}
                  error={errors.customerName}
                />
                <Field
                  id="companyName"
                  label="Company name"
                  required
                  autoComplete="organization"
                  value={values.companyName}
                  onChange={setField("companyName")}
                  error={errors.companyName}
                />
                <Field
                  id="phone"
                  label="Phone number"
                  required
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="9876543210"
                  hint="10-digit Indian mobile number; +91 is optional"
                  value={values.phone}
                  onChange={setField("phone")}
                  error={errors.phone}
                />
                <Field
                  id="email"
                  label="Email address"
                  required
                  type="email"
                  autoComplete="email"
                  value={values.email}
                  onChange={setField("email")}
                  error={errors.email}
                />
              </div>
            </fieldset>

            <fieldset className="form-section">
              <legend>Your requirement</legend>
              <div className="form-grid">
                <Field
                  as="select"
                  id="occasion"
                  label="Occasion"
                  required
                  value={values.occasion}
                  onChange={setField("occasion")}
                  error={errors.occasion}
                  hint={
                    occasions.error
                      ? "Occasions could not be loaded; choose Other."
                      : undefined
                  }
                >
                  <option value="">Select an occasion</option>
                  {occasionNames.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                  <option value="Other">Other</option>
                </Field>
                <Field
                  id="units"
                  label="Number of units"
                  required
                  type="number"
                  min="1"
                  step="1"
                  inputMode="numeric"
                  hint="Total gifts you need"
                  value={values.units}
                  onChange={setField("units")}
                  error={errors.units}
                />
                <Field
                  id="budgetPerUnit"
                  label="Budget per unit (₹)"
                  required
                  type="number"
                  min="1"
                  step="1"
                  inputMode="numeric"
                  value={values.budgetPerUnit}
                  onChange={setField("budgetPerUnit")}
                  error={errors.budgetPerUnit}
                />
                <Field
                  id="expectedDeliveryDate"
                  label="Expected delivery date"
                  required
                  type="date"
                  min={tomorrowInputDate()}
                  value={values.expectedDeliveryDate}
                  onChange={setField("expectedDeliveryDate")}
                  error={errors.expectedDeliveryDate}
                />
              </div>
            </fieldset>

            <fieldset
              className="form-section"
              id="selected-products"
              tabIndex={-1}
            >
              <legend>Products selected</legend>
              {basket.items.length === 0 ? (
                <p className="muted">
                  No products selected yet. Add products below, or{" "}
                  <Link to="/catalogue">browse the catalogue</Link>. You can
                  also send the enquiry without choosing products.
                </p>
              ) : (
                <ul className="selected-list">
                  {basket.items.map((item) => (
                    <li key={item.productId} className="selected-item">
                      <SmartImage
                        src={item.imageUrl}
                        alt=""
                        width={64}
                        height={64}
                      />
                      <div className="selected-item__info">
                        <Link to={`/product/${item.productId}/${item.slug}`}>
                          {item.name}
                        </Link>
                        <span>
                          {item.sku} · MOQ {item.minOrderQuantity}
                        </span>
                      </div>
                      <QuantityInput
                        compact
                        id={`qty-${item.productId}`}
                        label={`Quantity for ${item.name}`}
                        value={item.quantity}
                        onChange={(v) =>
                          basket.updateQuantity(item.productId, v)
                        }
                      />
                      {Number(item.quantity) < item.minOrderQuantity && (
                        <p className="selected-item__warn">
                          Below the minimum order of {item.minOrderQuantity}. We
                          will confirm if a smaller run is possible.
                        </p>
                      )}
                      <button
                        type="button"
                        className="icon-button"
                        onClick={() => basket.removeItem(item.productId)}
                        aria-label={`Remove ${item.name}`}
                      >
                        <Icon name="trash" size={18} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {errors.items && (
                <p className="field__error" role="alert">
                  {errors.items}
                </p>
              )}

              <div className="add-product">
                {products.loading && <Spinner label="Loading products" />}
                {products.error && (
                  <p className="muted">
                    Products could not be loaded.{" "}
                    <button
                      type="button"
                      className="text-button"
                      onClick={products.reload}
                    >
                      Try again
                    </button>
                  </p>
                )}
                {products.data && available.length > 0 && (
                  <>
                    <label htmlFor="add-product" className="visually-hidden">
                      Add a product to your enquiry
                    </label>
                    <select
                      id="add-product"
                      value=""
                      onChange={(e) => {
                        const product = products.data.content.find(
                          (p) => p.id === Number(e.target.value)
                        );
                        if (product)
                          basket.addItem(product, product.minOrderQuantity);
                      }}
                    >
                      <option value="">+ Add a product…</option>
                      {available.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.sku})
                        </option>
                      ))}
                    </select>
                  </>
                )}
              </div>
            </fieldset>

            <fieldset className="form-section">
              <legend>Customisation & notes</legend>
              <Field
                as="textarea"
                id="customisationRequired"
                label="Customisation required"
                rows="3"
                maxLength={1000}
                placeholder="e.g. Laser-engrave our logo on the bottle, personalised message cards"
                value={values.customisationRequired}
                onChange={setField("customisationRequired")}
                error={errors.customisationRequired}
              />
              <Field
                as="textarea"
                id="additionalMessage"
                label="Additional message"
                rows="4"
                maxLength={2000}
                placeholder="Anything else we should know: delivery locations, packaging, timelines…"
                value={values.additionalMessage}
                onChange={setField("additionalMessage")}
                error={errors.additionalMessage}
              />
            </fieldset>

            <div className="form-actions">
              <Button
                type="submit"
                size="lg"
                disabled={submitting}
                aria-disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Spinner label="Sending enquiry" /> Sending…
                  </>
                ) : (
                  "Submit enquiry"
                )}
              </Button>
              <p className="muted">
                By submitting, you agree to be contacted about this enquiry.
                Fields marked * are required.
              </p>
            </div>
          </form>

          <aside className="side-card" aria-label="Need help">
            <h2>Prefer to talk?</h2>
            <p>
              Message us on WhatsApp and we will help you shortlist products and
              plan quantities.
            </p>
            <WhatsAppButton
              message={generalEnquiryMessage(
                "I would like help with a corporate gifting enquiry."
              )}
              className="btn--block"
            >
              Chat on WhatsApp
            </WhatsAppButton>
            <hr />
            <h3>What happens next</h3>
            <ol className="mini-steps">
              <li>
                Our gifting team reviews your requirement and gets in touch.
              </li>
              <li>You receive recommendations and a quote.</li>
              <li>Approve the mock-up and we begin production.</li>
            </ol>
          </aside>
        </div>
      </section>
    </>
  );
}
