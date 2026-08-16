"use client";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import PlaylistItem from "./PlaylistItem";

const popupVariants = {
  hidden: { opacity: 0, scale: 0.94, y: 14, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    scale: 0.94,
    y: 10,
    filter: "blur(4px)",
    transition: { duration: 0.25, ease: "easeIn" },
  },
};

export default function PlaylistPopup({
  isOpen,
  currentTrack,
  isPlaying,
  onSelectTrack,
  onClose,
  onStreamSpotify,
  onStreamYoutube,
  tracks = [],
}) {
  const hindiTracks = tracks.filter((t) => t.language === "hindi");
  const marathiTracks = tracks.filter((t) => t.language === "marathi");

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Mobile backdrop */}
          <motion.div
            className="nostalgia-playlist-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.div
            className="glass-popup nostalgia-playlist"
            variants={popupVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="dialog"
            aria-label="Playlist"
            aria-modal="true"
          >
            {/* Header */}
            <div className="nostalgia-playlist__header">
              <div>
                <h2 className="nostalgia-playlist__heading">YOUR MEMORIES</h2>
                <p className="nostalgia-playlist__count">{tracks.length} songs</p>
              </div>
              <button
                className="nostalgia-playlist__close"
                onClick={onClose}
                aria-label="Close playlist"
              >
                <X size={16} />
              </button>
            </div>

            {/* Track list */}
            <div className="nostalgia-playlist__scroll" role="list">
              {/* Hindi Section */}
              <div className="nostalgia-playlist__section-label">हिंदी • Hindi</div>
              <ul className="nostalgia-playlist__list">
                {hindiTracks.map((track) => (
                  <PlaylistItem
                    key={track.id}
                    track={track}
                    isActive={currentTrack?.id === track.id}
                    isPlaying={isPlaying && currentTrack?.id === track.id}
                    onSelect={onSelectTrack}
                    onStreamSpotify={onStreamSpotify}
                    onStreamYoutube={onStreamYoutube}
                  />
                ))}
              </ul>

              {/* Marathi Section */}
              <div className="nostalgia-playlist__section-label">मराठी • Marathi</div>
              <ul className="nostalgia-playlist__list">
                {marathiTracks.map((track) => (
                  <PlaylistItem
                    key={track.id}
                    track={track}
                    isActive={currentTrack?.id === track.id}
                    isPlaying={isPlaying && currentTrack?.id === track.id}
                    onSelect={onSelectTrack}
                    onStreamSpotify={onStreamSpotify}
                    onStreamYoutube={onStreamYoutube}
                  />
                ))}
              </ul>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
