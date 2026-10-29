// Tiny external store so a banner can tell the developer the bundled sample data is in use.
let active = false;
const listeners = new Set();

export const fallbackState = {
  activate() {
    if (!active) {
      active = true;
      listeners.forEach((listener) => listener());
    }
  },
  isActive: () => active,
  subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};
