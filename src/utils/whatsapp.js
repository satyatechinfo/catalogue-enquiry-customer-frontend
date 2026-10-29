import { config } from '../config.js';

/**
 * Builds a wa.me link. When no business number is configured the link omits it, which makes
 * WhatsApp open with the message ready and lets the visitor pick who to send it to.
 */
export function buildWhatsAppLink(message, number = config.whatsappNumber) {
  const digits = (number || '').replace(/\D/g, '');
  const base = digits ? `https://wa.me/${digits}` : 'https://wa.me/';
  return `${base}?text=${encodeURIComponent(message)}`;
}

export function productEnquiryMessage({ product, quantity, url }) {
  const lines = [
    'Hello Tribe Green,',
    `I would like to enquire about "${product.name}" (${product.sku}).`,
    `Quantity: ${quantity} units`,
    'Please share a quote, customisation options and delivery timelines.',
  ];
  if (url) lines.push(`Product link: ${url}`);
  return lines.join('\n');
}

export function generalEnquiryMessage(context = '') {
  return [
    'Hello Tribe Green,',
    context || 'I would like to discuss a corporate gifting requirement.',
    'Please get in touch with me.',
  ].join('\n');
}
