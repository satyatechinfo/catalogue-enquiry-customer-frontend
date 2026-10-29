import { tomorrowInputDate } from './format.js';

// Mirrors the backend rules (EnquiryRequest) so users get instant feedback.
export const PHONE_PATTERN = /^(?:\+91[- ]?|0)?[6-9]\d{9}$/;
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const EMPTY_ENQUIRY = {
  customerName: '',
  companyName: '',
  phone: '',
  email: '',
  occasion: '',
  units: '',
  budgetPerUnit: '',
  expectedDeliveryDate: '',
  customisationRequired: '',
  additionalMessage: '',
};

/**
 * Returns an object of { fieldName: message }. An empty object means the form is valid.
 * `items` is the list of selected products: [{ productId, quantity }].
 */
export function validateEnquiry(values, items = [], now = new Date()) {
  const errors = {};
  const text = (v) => (v ?? '').toString().trim();

  if (!text(values.customerName)) errors.customerName = 'Please enter your name';
  else if (text(values.customerName).length > 120) errors.customerName = 'Name must be 120 characters or fewer';

  if (!text(values.companyName)) errors.companyName = 'Please enter your company name';
  else if (text(values.companyName).length > 160) errors.companyName = 'Company name must be 160 characters or fewer';

  if (!text(values.phone)) errors.phone = 'Please enter a phone number';
  else if (!PHONE_PATTERN.test(text(values.phone))) errors.phone = 'Enter a valid 10-digit Indian mobile number';

  if (!text(values.email)) errors.email = 'Please enter your email address';
  else if (!EMAIL_PATTERN.test(text(values.email))) errors.email = 'Enter a valid email address';

  if (!text(values.occasion)) errors.occasion = 'Please select an occasion';

  const units = Number(values.units);
  if (text(values.units) === '') errors.units = 'Please enter the number of units';
  else if (!Number.isInteger(units) || units < 1) errors.units = 'Number of units must be a whole number of at least 1';
  else if (units > 1000000) errors.units = 'Number of units is too large';

  const budget = Number(values.budgetPerUnit);
  if (text(values.budgetPerUnit) === '') errors.budgetPerUnit = 'Please enter your budget per unit';
  else if (!Number.isFinite(budget) || budget <= 0) errors.budgetPerUnit = 'Budget per unit must be greater than zero';

  if (!text(values.expectedDeliveryDate)) errors.expectedDeliveryDate = 'Please choose an expected delivery date';
  else if (!/^\d{4}-\d{2}-\d{2}$/.test(values.expectedDeliveryDate) || Number.isNaN(Date.parse(values.expectedDeliveryDate)))
    errors.expectedDeliveryDate = 'Enter a valid date';
  else if (values.expectedDeliveryDate < tomorrowInputDate(now)) errors.expectedDeliveryDate = 'Delivery date must be in the future';

  if (items.some((i) => !Number.isInteger(Number(i.quantity)) || Number(i.quantity) < 1))
    errors.items = 'Each selected product needs a quantity of at least 1';

  if (text(values.customisationRequired).length > 1000) errors.customisationRequired = 'Please keep this under 1000 characters';
  if (text(values.additionalMessage).length > 2000) errors.additionalMessage = 'Please keep your message under 2000 characters';

  return errors;
}

/** Backend reports nested names such as items[0].quantity - collapse them to the "items" field. */
export function normaliseServerFieldErrors(fieldErrors = {}) {
  const result = {};
  Object.entries(fieldErrors).forEach(([key, message]) => {
    const field = key.startsWith('items') ? 'items' : key;
    if (!result[field]) result[field] = message;
  });
  return result;
}
