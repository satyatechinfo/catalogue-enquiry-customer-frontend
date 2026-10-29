import { describe, expect, it } from 'vitest';
import { normaliseServerFieldErrors, validateEnquiry } from './validation.js';
import { tomorrowInputDate } from './format.js';

const now = new Date(2026, 9, 27);
const valid = {
  customerName: 'Asha Rao',
  companyName: 'Greenfield Pvt Ltd',
  phone: '9876543210',
  email: 'asha@greenfield.example',
  occasion: 'Diwali',
  units: '100',
  budgetPerUnit: '1500',
  expectedDeliveryDate: '2026-11-20',
  customisationRequired: '',
  additionalMessage: '',
};

describe('validateEnquiry', () => {
  it('accepts a complete valid enquiry', () => {
    expect(validateEnquiry(valid, [{ productId: 1, quantity: 50 }], now)).toEqual({});
  });

  it('flags every required field when empty', () => {
    const errors = validateEnquiry({}, [], now);
    ['customerName', 'companyName', 'phone', 'email', 'occasion', 'units', 'budgetPerUnit', 'expectedDeliveryDate'].forEach(
      (field) => expect(errors[field]).toBeTruthy(),
    );
  });

  it('validates phone and email formats', () => {
    expect(validateEnquiry({ ...valid, phone: '12345' }, [], now).phone).toBeTruthy();
    expect(validateEnquiry({ ...valid, phone: '+91 98765 43210' }, [], now).phone).toBeTruthy(); // spaces inside number
    expect(validateEnquiry({ ...valid, phone: '+91-9876543210' }, [], now).phone).toBeUndefined();
    expect(validateEnquiry({ ...valid, email: 'not-an-email' }, [], now).email).toBeTruthy();
  });

  it('validates quantity and budget', () => {
    expect(validateEnquiry({ ...valid, units: '0' }, [], now).units).toBeTruthy();
    expect(validateEnquiry({ ...valid, units: '2.5' }, [], now).units).toBeTruthy();
    expect(validateEnquiry({ ...valid, budgetPerUnit: '-5' }, [], now).budgetPerUnit).toBeTruthy();
  });

  it('requires a delivery date from tomorrow onwards', () => {
    expect(validateEnquiry({ ...valid, expectedDeliveryDate: '2026-10-27' }, [], now).expectedDeliveryDate).toBeTruthy();
    expect(validateEnquiry({ ...valid, expectedDeliveryDate: tomorrowInputDate(now) }, [], now).expectedDeliveryDate).toBeUndefined();
  });

  it('rejects invalid product quantities', () => {
    expect(validateEnquiry(valid, [{ productId: 1, quantity: 0 }], now).items).toBeTruthy();
  });
});

describe('normaliseServerFieldErrors', () => {
  it('collapses nested item errors into one field', () => {
    expect(normaliseServerFieldErrors({ 'items[0].quantity': 'bad', email: 'x' })).toEqual({ items: 'bad', email: 'x' });
  });
});
