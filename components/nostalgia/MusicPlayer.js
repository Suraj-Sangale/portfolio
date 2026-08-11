"use client";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  ListMusic,
} from "lucide-react";
import { useRef, useCallback } from "react";

function formatTime(s) {
  if (!s || isNaN(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

export default function MusicPlayer({
  currentTrack,
  isPlaying,
  currentTime,
  duration,
  volume,
  isLoading,
  onTogglePlay,
  onNext,
  onPrev,
  onSeek,
  onVolumeChange,
  onPlaylistToggle,
  isPlaylistOpen,
}) {
  const progressRef = useRef(null);

  const handleProgressClick = useCallback(
    (e) => {
      if (!progressRef.current || !duration) return;
      const rect = progressRef.current.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      onSeek(ratio * duration);
    },
    [duration, onSeek]
  );

  const handleProgressKeyDown = useCallback(
    (e) => {
      if (e.key === "ArrowRight") onSeek(Math.min(duration, currentTime + 5));
      if (e.key === "ArrowLeft") onSeek(Math.max(0, currentTime - 5));
    },
    [currentTime, duration, onSeek]
  );

  const progress = duration > 0 ? currentTime / duration : 0;

  return (
    <motion.div
      className="glass-player nostalgia-player"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      role="region"
      aria-label="Music player"
    >
      {/* Glass reflection pseudo-element is handled in CSS */}

      <div className="nostalgia-player__inner">
        {/* Album Art */}
        <div className={`nostalgia-player__art${isPlaying ? " spinning" : ""}`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTrack?.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
              className="nostalgia-player__art-inner"
            >
              <Image
                src={currentTrack?.cover || "/scenes/album_default.png"}
                alt={currentTrack?.title || "Album art"}
                fill
                sizes="100px"
                style={{ objectFit: "cover" }}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Center: Track info + progress */}
        <div className="nostalgia-player__center">
          {/* Track Meta */}
          <div className="nostalgia-player__meta">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTrack?.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35 }}
              >
                <p className="nostalgia-player__title">
                  {currentTrack?.title || "Select a track"}
                </p>
                <p className="nostalgia-player__artist">
                  {currentTrack?.artist || ""}
                  {/* {currentTrack?.language === "marathi" && (
                    <span className="nostalgia-player__lang-badge">मराठी</span>
                  )} */}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Progress bar */}
          <div className="nostalgia-player__progress-wrap">
            <span className="nostalgia-player__time">{formatTime(currentTime)}</span>
            <div
              className="nostalgia-player__progress"
              ref={progressRef}
              onClick={handleProgressClick}
              onKeyDown={handleProgressKeyDown}
              role="slider"
              aria-label="Seek"
              aria-valuemin={0}
              aria-valuemax={duration || 100}
              aria-valuenow={Math.round(currentTime)}
              tabIndex={0}
            >
              <div className="nostalgia-player__track">
                <motion.div
                  className="nostalgia-player__fill"
                  style={{ width: `${progress * 100}%` }}
                />
                <motion.div
                  className="nostalgia-player__thumb"
                  style={{ left: `${progress * 100}%` }}
                />
              </div>
            </div>
            <span className="nostalgia-player__time nostalgia-player__time--right">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Right: Controls */}
        <div className="nostalgia-player__controls">
          {/* Volume */}
          {/* <div className="nostalgia-player__volume">
            <button
              className="nostalgia-player__ctrl-btn"
              onClick={() => onVolumeChange(volume > 0 ? 0 : 0.8)}
              aria-label={volume > 0 ? "Mute" : "Unmute"}
            >
              {volume > 0 ? <Volume2 size={15} /> : <VolumeX size={15} />}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
              className="nostalgia-player__volume-slider"
              aria-label="Volume"
            />
          </div> */}

          {/* Transport */}
          <div className="nostalgia-player__transport">
            <motion.button
              className="nostalgia-player__ctrl-btn"
              onClick={onPrev}
              aria-label="Previous track"
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
            >
              <SkipBack size={18} />
            </motion.button>

            <motion.button
              className="nostalgia-player__play-btn"
              onClick={onTogglePlay}
              aria-label={isPlaying ? "Pause" : "Play"}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
            >
              {isLoading ? (
                <span className="nostalgia-player__loading-ring" aria-label="Loading" />
              ) : isPlaying ? (
                <Pause size={20} />
              ) : (
                <Play size={20} style={{ marginLeft: 2 }} />
              )}
            </motion.button>

            <motion.button
              className="nostalgia-player__ctrl-btn"
              onClick={onNext}
              aria-label="Next track"
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
            >
              <SkipForward size={18} />
            </motion.button>
          </div>

          {/* Playlist toggle */}
          <motion.button
            className={`nostalgia-player__ctrl-btn nostalgia-player__playlist-btn ${isPlaylistOpen ? "nostalgia-player__playlist-btn--active" : ""}`}
            onClick={onPlaylistToggle}
            aria-label="Toggle playlist"
            aria-expanded={isPlaylistOpen}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
          >
            <ListMusic size={16} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
