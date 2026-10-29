const inr = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

export const formatPrice = (value) => inr.format(Number(value));

export const formatPriceRange = (min, max) =>
  Number(min) === Number(max) ? formatPrice(min) : `${formatPrice(min)} – ${formatPrice(max)}`;

export function formatDate(value) {
  if (!value) return '';
  // Plain yyyy-mm-dd strings are shown as-is in local calendar terms (no timezone shifting).
  const date = /^\d{4}-\d{2}-\d{2}$/.test(value) ? new Date(`${value}T00:00:00`) : new Date(value);
  return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
}

export function formatDateTime(value) {
  return new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
}

/** yyyy-mm-dd for the given date in local time. */
export function toInputDate(date) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function tomorrowInputDate(now = new Date()) {
  const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  return toInputDate(d);
}

export const slugify = (text = '') =>
  text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

export function productPath(product) {
  return `/product/${product.id}/${product.slug || slugify(product.name)}`;
}
