import { useSyncExternalStore } from "react";
import { fallbackState } from "../../dev/fallbackState.js";

/** Visible only while the development-only sample data is being used. */
export default function DevFallbackBanner() {
  const active = useSyncExternalStore(
    fallbackState.subscribe,
    fallbackState.isActive,
    () => false
  );
  if (!active) return null;
  return (
    <div className="dev-banner" role="status">
      Development mode: the API is unreachable, so the catalogue is showing
      bundled sample data. Enquiries cannot be submitted until the backend is
      running.
    </div>
  );
}
