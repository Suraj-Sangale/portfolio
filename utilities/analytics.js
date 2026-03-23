import ReactGA from "react-ga4";

const GA_MEASUREMENT_ID = "G-RD6GBTESJ6";

function isBrowser() {
  return typeof window !== "undefined";
}

/**
 * Push any object to `window.dataLayer` (Google Tag Manager / GA4).
 * Safe on the server (no-op).
 */
export function pushDataLayer(payload) {
  if (!isBrowser()) return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);
}

export const initGA = () => {
  if (!isBrowser()) return;
  window.dataLayer = window.dataLayer || [];
  ReactGA.initialize(GA_MEASUREMENT_ID);
};

export const trackPageView = (url) => {
  const path =
    typeof url === "string" && url.length > 0
      ? url
      : isBrowser()
        ? `${window.location.pathname}${window.location.search}`
        : "";
  const fullUrl = isBrowser() ? window.location.href : undefined;

  pushDataLayer({
    event: "page_view",
    page_path: path,
    page_location: fullUrl,
    page_url: fullUrl,
  });

  ReactGA.send({
    hitType: "pageview",
    page: path,
  });
};

export const trackEvent = (category, action, label) => {
  pushDataLayer({
    event: "user_interaction",
    event_category: category,
    event_action: action,
    event_label: label ?? "",
  });

  ReactGA.event({
    category,
    action,
    label,
  });
};

/**
 * Generic activity for GTM tags: always includes an `event` key.
 *
 * @param {string} eventName — trigger name in GTM (e.g. `cta_click`, `tool_open`).
 * @param {Record<string, unknown>} [details] — flat custom dimensions (avoid deep nesting for GTM).
 */
export function trackUserActivity(eventName, details = {}) {
  pushDataLayer({
    event: eventName,
    ...details,
  });
}

/**
 * One-shot “page section” signal when a page component mounts (pairs with route `page_view` from _app).
 */
export function trackPageActivity(pageKey, details = {}) {
  trackUserActivity("portfolio_page_activity", {
    page_key: pageKey,
    ...details,
    ...(isBrowser() && {
      page_path: window.location.pathname,
      page_url: window.location.href,
    }),
  });
}
