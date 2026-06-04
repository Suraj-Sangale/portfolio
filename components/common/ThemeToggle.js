import React from "react";
import { useTheme } from "@/context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`theme-toggle-btn ${theme === "light" ? "is-light" : "is-dark"}`}
      aria-label="Toggle Theme"
      id="theme-toggle"
    >
      <svg
        className="theme-toggle-svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <mask id="moon-mask">
          <rect x="0" y="0" width="24" height="24" fill="white" />
          <circle cx="24" cy="0" r="8" fill="black" className="mask-circle" />
        </mask>
        
        {/* Sun center / moon body */}
        <circle
          cx="12"
          cy="12"
          r="5"
          fill="currentColor"
          mask="url(#moon-mask)"
          className="sun-center"
        />
        
        {/* Sun rays that expand/spread */}
        <g className="sun-rays" stroke="currentColor">
          <line x1="12" y1="1" x2="12" y2="3.5" className="ray ray-1" />
          <line x1="18.36" y1="5.64" x2="16.6" y2="7.4" className="ray ray-2" />
          <line x1="21" y1="12" x2="18.5" y2="12" className="ray ray-3" />
          <line x1="18.36" y1="18.36" x2="16.6" y2="16.6" className="ray ray-4" />
          <line x1="12" y1="21" x2="12" y2="18.5" className="ray ray-5" />
          <line x1="5.64" y1="18.36" x2="7.4" y2="16.6" className="ray ray-6" />
          <line x1="1" y1="12" x2="3.5" y2="12" className="ray ray-7" />
          <line x1="5.64" y1="5.64" x2="7.4" y2="7.4" className="ray ray-8" />
        </g>
      </svg>
    </button>
  );
}
