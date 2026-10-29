import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'tg:enquiry-selection';
const EnquiryBasketContext = createContext(null);

function load() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Holds the products a visitor has chosen to ask about. This is only a draft selection kept for the
 * current tab session; enquiries themselves are always stored by the backend, never in the browser.
 */
export function EnquiryBasketProvider({ children }) {
  const [items, setItems] = useState(load);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* storage unavailable: the selection simply lasts for this page view */
    }
  }, [items]);

  const addItem = useCallback((product, quantity) => {
    setItems((current) => {
      const entry = {
        productId: product.id,
        sku: product.sku,
        name: product.name,
        slug: product.slug,
        imageUrl: product.imageUrl,
        minOrderQuantity: product.minOrderQuantity,
        quantity: Number(quantity),
      };
      const exists = current.some((i) => i.productId === product.id);
      return exists ? current.map((i) => (i.productId === product.id ? entry : i)) : [...current, entry];
    });
  }, []);

  const updateQuantity = useCallback((productId, quantity) => {
    setItems((current) => current.map((i) => (i.productId === productId ? { ...i, quantity } : i)));
  }, []);

  const removeItem = useCallback((productId) => {
    setItems((current) => current.filter((i) => i.productId !== productId));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo(
    () => ({ items, addItem, updateQuantity, removeItem, clear, count: items.length }),
    [items, addItem, updateQuantity, removeItem, clear],
  );
  return <EnquiryBasketContext.Provider value={value}>{children}</EnquiryBasketContext.Provider>;
}

export function useEnquiryBasket() {
  const context = useContext(EnquiryBasketContext);
  if (!context) throw new Error('useEnquiryBasket must be used inside EnquiryBasketProvider');
  return context;
}
