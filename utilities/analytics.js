import ReactGA from "react-ga4";

const GA_MEASUREMENT_ID = "G-RD6GBTESJ6";

function isBrowser() {
  return typeof window !== "undefined";
}

/* ═══════════════════════════════════════════════════════════════════════
   CORE — dataLayer push + GA4 init
═══════════════════════════════════════════════════════════════════════ */

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

/* ═══════════════════════════════════════════════════════════════════════
   PAGE TRACKING
═══════════════════════════════════════════════════════════════════════ */

/**
 * Standard GA4 page view (used by _app.js route listener).
 * Also pushed to dataLayer so GTM can trigger on it.
 */
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

/* ═══════════════════════════════════════════════════════════════════════
   GENERIC HELPERS
═══════════════════════════════════════════════════════════════════════ */

export const trackEvent = (category, action, label) => {
  pushDataLayer({
    event: "user_interaction",
    event_category: category,
    event_action: action,
    event_label: label ?? "",
  });

  ReactGA.event({ category, action, label });
};

/**
 * Generic activity for GTM tags: always includes an `event` key.
 * @param {string} eventName — trigger name in GTM (e.g. `cta_click`, `tool_open`).
 * @param {Record<string, unknown>} [details] — flat custom dimensions.
 */
export function trackUserActivity(eventName, details = {}) {
  pushDataLayer({ event: eventName, ...details });
}

/**
 * One-shot "page section" signal when a page component mounts.
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

/* ═══════════════════════════════════════════════════════════════════════
   CONTACT FORM EVENTS
═══════════════════════════════════════════════════════════════════════ */

/**
 * Fire when the user submits the contact form (email or WhatsApp).
 *
 * @param {'email'|'whatsapp'} method
 * @param {'success'|'error'} status
 * @param {string} [subject]
 */
export function trackContactSubmit(method, status, subject = "") {
  pushDataLayer({
    event: "contact_form_submit",
    contact_method: method,         // 'email' | 'whatsapp'
    contact_status: status,         // 'success' | 'error'
    contact_subject: subject,
    page_path: isBrowser() ? window.location.pathname : "",
    timestamp: new Date().toISOString(),
  });

  ReactGA.event({
    category: "Contact",
    action: `${method}_submit`,
    label: status,
  });
}

/**
 * Fire when the user starts typing in the contact form (engagement signal).
 */
export function trackContactFormEngagement() {
  pushDataLayer({
    event: "contact_form_engage",
    page_path: isBrowser() ? window.location.pathname : "",
    timestamp: new Date().toISOString(),
  });
}

/* ═══════════════════════════════════════════════════════════════════════
   PROJECT EVENTS
═══════════════════════════════════════════════════════════════════════ */

/**
 * Fire when a project card is opened.
 * @param {string} projectName
 * @param {string} [projectSlug]
 * @param {string} [projectType]  'personal' | 'professional'
 */
export function trackProjectView(projectName, projectSlug = "", projectType = "") {
  pushDataLayer({
    event: "project_view",
    project_name: projectName,
    project_slug: projectSlug,
    project_type: projectType,
    page_path: isBrowser() ? window.location.pathname : "",
    timestamp: new Date().toISOString(),
  });

  ReactGA.event({
    category: "Projects",
    action: "project_open",
    label: projectName,
  });
}

/**
 * Fire when the user clicks a project's live/demo link.
 * @param {string} projectName
 * @param {string} linkUrl
 */
export function trackProjectLinkClick(projectName, linkUrl) {
  pushDataLayer({
    event: "project_link_click",
    project_name: projectName,
    link_url: linkUrl,
    page_path: isBrowser() ? window.location.pathname : "",
    timestamp: new Date().toISOString(),
  });

  ReactGA.event({
    category: "Projects",
    action: "link_click",
    label: projectName,
  });
}

/* ═══════════════════════════════════════════════════════════════════════
   RESUME EVENTS
═══════════════════════════════════════════════════════════════════════ */

/**
 * Fire when the user opens or downloads the resume.
 * @param {'view'|'download'} action
 */
export function trackResumeAction(action) {
  pushDataLayer({
    event: "resume_action",
    resume_action: action,          // 'view' | 'download'
    page_path: isBrowser() ? window.location.pathname : "",
    timestamp: new Date().toISOString(),
  });

  ReactGA.event({
    category: "Resume",
    action,
    label: "resume",
  });
}

/* ═══════════════════════════════════════════════════════════════════════
   SOCIAL / CTA EVENTS
═══════════════════════════════════════════════════════════════════════ */

/**
 * Fire when user clicks a social link (GitHub, LinkedIn, etc.).
 * @param {string} platform  e.g. 'github', 'linkedin', 'twitter'
 * @param {string} [url]
 */
export function trackSocialClick(platform, url = "") {
  pushDataLayer({
    event: "social_link_click",
    social_platform: platform,
    link_url: url,
    page_path: isBrowser() ? window.location.pathname : "",
    timestamp: new Date().toISOString(),
  });

  ReactGA.event({
    category: "Social",
    action: "click",
    label: platform,
  });
}
