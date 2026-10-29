import { useEffect } from 'react';
import { absoluteUrl, config } from '../config.js';

const DEFAULTS = {
  title: `${config.brand} | Corporate Gifting & Personalised Merchandise`,
  description:
    'Tribe Green designs thoughtful corporate gifts, hampers and personalised merchandise for teams, clients and events.',
  image: '/images/hero-hamper.svg',
};

function setMeta(attr, key, content) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setCanonical(href) {
  let el = document.head.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

/**
 * Sets the document title, description, canonical URL and Open Graph / Twitter tags for a page.
 * `jsonLd` (optional) is injected as schema.org structured data.
 * Note: crawlers that do not run JavaScript get product previews from /api/product-meta (see vercel.json).
 */
export function useDocumentMeta({ title, description, image, path, type = 'website', jsonLd, noindex = false } = {}) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${config.brand}` : DEFAULTS.title;
    const desc = description || DEFAULTS.description;
    const url = absoluteUrl(path ?? window.location.pathname);
    const img = absoluteUrl(image || DEFAULTS.image);

    document.title = fullTitle;
    setMeta('name', 'description', desc);
    setMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow');
    setCanonical(url);
    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:description', desc);
    setMeta('property', 'og:type', type);
    setMeta('property', 'og:url', url);
    setMeta('property', 'og:image', img);
    setMeta('property', 'og:site_name', config.brand);
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', fullTitle);
    setMeta('name', 'twitter:description', desc);
    setMeta('name', 'twitter:image', img);

    let script;
    if (jsonLd) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }
    return () => {
      if (script) script.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, description, image, path, type, noindex, JSON.stringify(jsonLd)]);
}
