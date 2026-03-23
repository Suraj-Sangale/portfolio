import { useEffect } from "react";

/**
 * Fires once on page mount.
 * Only calls the API if the user grants location permission and coords are available.
 * If permission is denied or GPS is unavailable — does nothing.
 */
export function useTrackLocation() {
  useEffect(() => {
    let cancelled = false;

    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      // ✅ Only fires when coords are successfully retrieved
      (position) => {
        if (cancelled) return;

        const { latitude, longitude, accuracy } = position.coords;

        // Guard: skip if coords are somehow null/zero
        if (!latitude || !longitude) return;

        fetch("/api/track-location", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            latitude,
            longitude,
            accuracy,
            page_path: window.location.pathname + window.location.search,
            referrer: document.referrer || null,
          }),
        }).catch((err) => {
          console.warn("[useTrackLocation] failed to send:", err);
        });
      },
      // ❌ User denied or error — do nothing
      () => {},
      { timeout: 8000, maximumAge: 60_000 },
    );

    return () => {
      cancelled = true;
    };
  }, []);
}
