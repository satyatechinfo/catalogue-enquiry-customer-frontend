const env = import.meta.env;

const trimSlash = (value = "") => value.replace(/\/+$/, "");

export const config = {
  brand: "Tribe Green",
  // Dev: "/api" is forwarded to the Render backend by the Vite proxy (no CORS).
  // Prod: set VITE_API_BASE_URL to the full backend URL at build time,
  // or configure a rewrite from /api to the backend on your hosting provider.
  apiBaseUrl: trimSlash(env.VITE_API_BASE_URL || "/api"),
  siteUrl: trimSlash(env.VITE_SITE_URL || ""),
  // Digits only, international format. Never hardcode an unverified number here.
  whatsappNumber: (env.VITE_WHATSAPP_NUMBER || "").replace(/\D/g, ""),
  contactEmail: env.VITE_CONTACT_EMAIL || "",
  contactPhone: env.VITE_CONTACT_PHONE || "",
  devFallback: Boolean(env.DEV) && env.VITE_ENABLE_DEV_FALLBACK === "true",
};

/** Absolute URL for canonical links and sharing images. */
export function absoluteUrl(path = "/") {
  if (/^https?:\/\//i.test(path)) return path;
  const origin =
    config.siteUrl ||
    (typeof window !== "undefined" ? window.location.origin : "");
  return `${origin}${path.startsWith("/") ? path : `/${path}`}`;
}
