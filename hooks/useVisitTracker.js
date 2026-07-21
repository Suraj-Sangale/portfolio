import { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { pushDataLayer } from "@/utilities/analytics";

/* ─── Session ID ──────────────────────────────────────────────────────── */
function getOrCreateSessionId() {
  if (typeof window === "undefined") return null;
  const key = "portfolio_session_id";
  let sid = sessionStorage.getItem(key);
  if (!sid) {
    sid = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    sessionStorage.setItem(key, sid);
    return { sid, isNew: true };
  }
  return { sid, isNew: false };
}

/* ─── Server-side visit record ────────────────────────────────────────── */
async function recordVisit(pagePath, referrer, sid) {
  try {
    await fetch("/api/track-visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ page_path: pagePath, referrer, session_id: sid }),
    });
  } catch {
    // Never crash the app
  }
}

/* ─── dataLayer helpers ───────────────────────────────────────────────── */

/**
 * Push a rich `portfolio_page_view` event to dataLayer.
 * Called on initial load and every client-side navigation.
 */
function pushPageView(pagePath, referrer, sid) {
  pushDataLayer({
    event: "portfolio_page_view",
    page_path: pagePath,
    page_title: typeof document !== "undefined" ? document.title : "",
    page_url: typeof window !== "undefined" ? window.location.href : "",
    referrer: referrer || "",
    session_id: sid,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Push `portfolio_session_start` — fires only on the very first page of a session.
 */
function pushSessionStart(pagePath, referrer, sid) {
  pushDataLayer({
    event: "portfolio_session_start",
    landing_page: pagePath,
    referrer: referrer || "",
    session_id: sid,
    timestamp: new Date().toISOString(),
  });
}

/* ─── Hook ────────────────────────────────────────────────────────────── */
/**
 * Central visit-tracking hook. Call once in _app.js.
 *
 * On every page view it:
 *  1. Posts to /api/track-visit  (Supabase storage)
 *  2. Pushes `portfolio_page_view` to window.dataLayer (GTM / GA4)
 *  3. Pushes `portfolio_session_start` on the first page of a new session
 */
export default function useVisitTracker() {
  const router = useRouter();
  const initialTracked = useRef(false);

  useEffect(() => {
    // ── First page load ──────────────────────────────────────────────────
    if (!initialTracked.current) {
      initialTracked.current = true;

      const { sid, isNew } = getOrCreateSessionId();
      const path = window.location.pathname;
      const referrer = document.referrer || null;

      // GTM / dataLayer
      if (isNew) {
        pushSessionStart(path, referrer, sid);
      }
      pushPageView(path, referrer, sid);

      // Supabase
      recordVisit(path, referrer, sid);
    }

    // ── Subsequent SPA navigations ───────────────────────────────────────
    const handleRouteChange = (url) => {
      const path = url.split("?")[0];
      const { sid } = getOrCreateSessionId();

      pushPageView(path, null, sid);
      recordVisit(path, null, sid);
    };

    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);
}
