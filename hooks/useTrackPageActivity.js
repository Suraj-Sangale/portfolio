import { trackPageActivity } from "@/utilities/analytics";
import { useEffect } from "react";

/**
 * Runs once when the page mounts to record a semantic portfolio section in the data layer.
 * Route-level views are already sent from _app via trackPageView.
 *
 * @param {string} pageKey Stable id for GTM (e.g. "home", "contact").
 * @param {Record<string, string | number | boolean | undefined>} [details] Extra flat fields for GTM variables.
 */
export function useTrackPageActivity(pageKey, details) {
  useEffect(() => {
    trackPageActivity(pageKey, details ?? {});
    // Intentionally only pageKey: details should be stable per page or passed as primitives
  }, [pageKey]);
}
