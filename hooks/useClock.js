import { useState, useEffect } from "react";

/**
 * Returns the current local time (formatted) and a simulated online user count.
 */
export function useClock() {
  const [time, setTime] = useState("");
  const [onlineCount, setOnlineCount] = useState(36);

  useEffect(() => {
    const formatTime = () => {
      const now = new Date();
      return now.toLocaleTimeString("en-IN", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    };

    setTime(formatTime());

    const timeInterval = setInterval(() => setTime(formatTime()), 1000);

    // Simulate online user fluctuation
    const countInterval = setInterval(() => {
      setOnlineCount((prev) => {
        const delta = Math.floor(Math.random() * 5) - 2; // -2 to +2
        return Math.max(12, Math.min(80, prev + delta));
      });
    }, 7000);

    return () => {
      clearInterval(timeInterval);
      clearInterval(countInterval);
    };
  }, []);

  return { time, onlineCount };
}
