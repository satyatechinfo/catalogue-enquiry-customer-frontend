import { describe, expect, it } from 'vitest';
import { buildWhatsAppLink, productEnquiryMessage } from './whatsapp.js';
import { formatPriceRange, productPath } from './format.js';

describe('whatsapp helpers', () => {
  const product = { name: 'Insulated Steel Bottle', sku: 'TG-DRK-001' };

  it('includes product name and quantity in the message', () => {
    const message = productEnquiryMessage({ product, quantity: 75 });
    expect(message).toContain('Insulated Steel Bottle');
    expect(message).toContain('75 units');
  });

  it('uses the configured number when provided and omits it otherwise', () => {
    expect(buildWhatsAppLink('Hi there', '+91 90000 11111')).toBe('https://wa.me/919000011111?text=Hi%20there');
    expect(buildWhatsAppLink('Hi there', '')).toBe('https://wa.me/?text=Hi%20there');
  });
});

describe('format helpers', () => {
  it('formats price ranges in rupees', () => {
    expect(formatPriceRange(450, 850)).toContain('450');
    expect(formatPriceRange(450, 850)).toContain('850');
  });
  it('builds shareable product paths', () => {
    expect(productPath({ id: 3, slug: 'copper-bottle-gift-set' })).toBe('/product/3/copper-bottle-gift-set');
  });
});
