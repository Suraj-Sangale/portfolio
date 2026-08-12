"use client";
import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Music2 } from "lucide-react";

// SVG Icons for Spotify and YouTube
function SpotifyIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  );
}

function YouTubeIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

const PANEL_VARIANTS = {
  hidden: { opacity: 0, y: 30, scale: 0.97, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    y: 20,
    scale: 0.96,
    filter: "blur(6px)",
    transition: { duration: 0.3, ease: "easeIn" },
  },
};

/**
 * EmbedPlayer
 *
 * Props:
 *  - track         {Object}            current track object
 *  - platform      {'spotify'|'youtube'|null}
 *  - onClose       {Function}
 *  - onSwitch      {Function}          (platform) => void
 */
export default function EmbedPlayer({ track, platform, onClose, onSwitch }) {
  const isOpen = !!platform && !!track;

  // Build embed src
  const spotifyEmbedSrc = track?.spotifyId
    ? `https://open.spotify.com/embed/track/${track.spotifyId}?utm_source=generator&theme=0`
    : null;

  const youtubeEmbedSrc = track?.youtubeId
    ? `https://www.youtube.com/embed/${track.youtubeId}?autoplay=1&rel=0&modestbranding=1`
    : null;

  // Fallback search URLs when we don't have an ID
  const spotifySearchUrl = track
    ? `https://open.spotify.com/search/${encodeURIComponent(
        `${track.title} ${track.artist}`
      )}`
    : null;

  const youtubeSearchUrl = track
    ? `https://www.youtube.com/results?search_query=${encodeURIComponent(
        `${track.title} ${track.artist}`
      )}`
    : null;

  const currentEmbedSrc =
    platform === "spotify" ? spotifyEmbedSrc : youtubeEmbedSrc;

  const currentOpenUrl =
    platform === "spotify"
      ? track?.spotifyId
        ? `https://open.spotify.com/track/${track.spotifyId}`
        : spotifySearchUrl
      : track?.youtubeId
      ? `https://www.youtube.com/watch?v=${track.youtubeId}`
      : youtubeSearchUrl;

  const handleSwitch = useCallback(
    (p) => {
      if (p !== platform) onSwitch(p);
    },
    [platform, onSwitch]
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="embed-player"
          variants={PANEL_VARIANTS}
          initial="hidden"
          animate="visible"
          exit="exit"
          role="dialog"
          aria-label={`${platform === "spotify" ? "Spotify" : "YouTube"} embed player`}
          aria-modal="false"
        >
          {/* ── Header ── */}
          <div className="embed-player__header">
            {/* Platform tabs */}
            <div className="embed-player__tabs">
              <button
                className={`embed-player__tab embed-player__tab--spotify ${
                  platform === "spotify" ? "embed-player__tab--active" : ""
                }`}
                onClick={() => handleSwitch("spotify")}
                aria-pressed={platform === "spotify"}
                aria-label="Switch to Spotify"
              >
                <SpotifyIcon size={14} />
                <span>Spotify</span>
              </button>
              <button
                className={`embed-player__tab embed-player__tab--youtube ${
                  platform === "youtube" ? "embed-player__tab--active" : ""
                }`}
                onClick={() => handleSwitch("youtube")}
                aria-pressed={platform === "youtube"}
                aria-label="Switch to YouTube"
              >
                <YouTubeIcon size={14} />
                <span>YouTube</span>
              </button>
            </div>

            {/* Right: open + close */}
            <div className="embed-player__actions">
              <a
                href={currentOpenUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="embed-player__open-btn"
                aria-label={`Open on ${platform === "spotify" ? "Spotify" : "YouTube"}`}
                title="Open in app"
              >
                <ExternalLink size={13} />
              </a>
              <button
                className="embed-player__close-btn"
                onClick={onClose}
                aria-label="Close embed player"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {/* ── Embed body ── */}
          <div className="embed-player__body">
            {currentEmbedSrc ? (
              <iframe
                key={`${platform}-${track?.id}`}
                src={currentEmbedSrc}
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                className="embed-player__iframe"
                title={`${platform === "spotify" ? "Spotify" : "YouTube"} player for ${track?.title}`}
              />
            ) : (
              /* No embed ID — show friendly fallback */
              <div className="embed-player__fallback">
                <Music2 size={32} className="embed-player__fallback-icon" />
                <p className="embed-player__fallback-title">{track?.title}</p>
                <p className="embed-player__fallback-artist">{track?.artist}</p>
                <a
                  href={currentOpenUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="embed-player__fallback-link"
                >
                  Search on {platform === "spotify" ? "Spotify" : "YouTube"}
                  <ExternalLink size={12} style={{ marginLeft: 4 }} />
                </a>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
