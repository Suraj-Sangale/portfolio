import { useEffect } from 'react';

/**
 * Fires once on page mount.
 * 1. Asks browser for GPS coords (user must accept permission prompt).
 * 2. POSTs coords + page context to /api/track-location.
 * 3. Server resolves IP geo + UA info and stores everything in Supabase.
 *
 * @param {object}  [options]
 * @param {boolean} [options.requireGps=false]  If true, skips the API call when
 *                                               the user denies location permission.
 */
export function useTrackLocation({ requireGps = false } = {}) {
  useEffect(() => {
    let cancelled = false;

    async function track(coords = {}) {
      if (cancelled) return;
      try {
        await fetch('/api/track-location', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...coords,
            page_path: window.location.pathname + window.location.search,
            referrer:  document.referrer || null,
          }),
        });
      } catch (err) {
        // Silently fail — tracking should never break the page
        console.warn('[useTrackLocation] failed to send:', err);
      }
    }

    if (!navigator.geolocation) {
      // Browser doesn't support GPS — still track IP + UA
      if (!requireGps) track();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      // ✅ User accepted
      (position) => {
        track({
          latitude:  position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy:  position.coords.accuracy,
        });
      },
      // ❌ User denied or error
      () => {
        if (!requireGps) track(); // Still capture IP + UA without coords
      },
      { timeout: 8000, maximumAge: 60_000 }
    );

    return () => { cancelled = true; };
  }, []); // Intentionally empty — fires once per page mount
}