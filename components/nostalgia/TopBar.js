"use client";
import { useClock } from "@/hooks/useClock";
import { motion } from "framer-motion";
import GlassButton from "./GlassButton";
import { Music, User } from "lucide-react";

// Inline SVG — lucide-react doesn't ship a Youtube icon in this version
function YtIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.6 3.5 12 3.5 12 3.5s-7.6 0-9.38.55A3.02 3.02 0 0 0 .5 6.19C0 7.97 0 11.7 0 11.7s0 3.73.5 5.51a3.02 3.02 0 0 0 2.12 2.14C4.4 19.9 12 19.9 12 19.9s7.6 0 9.38-.55a3.02 3.02 0 0 0 2.12-2.14C24 15.43 24 11.7 24 11.7s0-3.73-.5-5.51zM9.6 15.2V8.2l6.4 3.5-6.4 3.5z"/>
    </svg>
  );
}

export default function TopBar() {
  const { time, onlineCount } = useClock();

  return (
    <header className="nostalgia-topbar" role="banner">
      {/* Left: Clock + Online indicator */}
      <div className="nostalgia-topbar__left" aria-label="Current time and online users">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="nostalgia-clock">{time}</div>
          <div className="nostalgia-online">
            <span className="nostalgia-online__dot" aria-hidden="true" />
            <span>{onlineCount} online</span>
          </div>
        </motion.div>
      </div>

      {/* Right: Navigation pills */}
      <nav className="nostalgia-topbar__right" aria-label="External links">
        <motion.div
          className="nostalgia-topbar__pills"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6, staggerChildren: 0.1 }}
        >
          <GlassButton
            as="a"
            href="https://open.spotify.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open Spotify"
            icon={<Music size={13} />}
            label="Spotify"
          />
          <GlassButton
            as="a"
            href="https://music.youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open YouTube Music"
            icon={<YtIcon />}
            label="YT Music"
          />
          <GlassButton
            as="a"
            href="#"
            aria-label="About this experience"
            icon={<User size={13} />}
            label="About"
          />
        </motion.div>
      </nav>
    </header>
  );
}
