"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { Play, Pause } from "lucide-react";

export default function PlaylistItem({
  track,
  isActive,
  isPlaying,
  onSelect,
}) {
  return (
    <motion.li
      className={`nostalgia-playlist-item ${isActive ? "nostalgia-playlist-item--active" : ""}`}
      onClick={() => onSelect(track.id)}
      whileHover={{ x: 4 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      role="button"
      aria-label={`Play ${track.title} by ${track.artist}`}
      aria-pressed={isActive}
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onSelect(track.id)}
    >
      {/* Album thumb */}
      <div className="nostalgia-playlist-item__thumb">
        <Image
          src={track.cover || "/scenes/album_default.png"}
          alt=""
          aria-hidden="true"
          width={40}
          height={40}
          style={{ objectFit: "cover" }}
        />
        {isActive && (
          <div className="nostalgia-playlist-item__thumb-overlay">
            {isPlaying ? (
              <Pause size={14} />
            ) : (
              <Play size={14} style={{ marginLeft: 1 }} />
            )}
          </div>
        )}
      </div>

      {/* Track info */}
      <div className="nostalgia-playlist-item__info">
        <p className="nostalgia-playlist-item__title">{track.title}</p>
        <p className="nostalgia-playlist-item__artist">
          {track.artist}
          {track.language === "marathi" && (
            <span className="nostalgia-playlist-item__badge">मराठी</span>
          )}
        </p>
      </div>

      {/* Play indicator */}
      {!isActive && (
        <span className="nostalgia-playlist-item__play-hint" aria-hidden="true">
          <Play size={12} />
        </span>
      )}

      {/* Active equalizer bars */}
      {isActive && isPlaying && (
        <div className="nostalgia-eq" aria-hidden="true">
          <span className="nostalgia-eq__bar" />
          <span className="nostalgia-eq__bar" />
          <span className="nostalgia-eq__bar" />
        </div>
      )}
    </motion.li>
  );
}
