import Image from "next/image";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";
import aboutStyles from "../styles/about.module.css";

const Header = () => {
  const headerHeight = 80; // keep in sync with --header-height in globals.css
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    if (typeof document === "undefined") return;
    const current = document.documentElement.getAttribute("data-theme") || "dark";
    setTheme(current);
  }, []);

  const toggleTheme = useCallback(() => {
    if (typeof document === "undefined") return;
    const next = theme === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", next);
    setTheme(next);
    try {
      localStorage.setItem("theme", next);
    } catch (_) {}
  }, [theme]);

  const handleNavClick = (event, targetId) => {
    event.preventDefault();
    if (typeof document === "undefined") return;
    const targetElement = document.getElementById(targetId);
    if (!targetElement) return;
    const y =
      targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;
    window.scrollTo({ top: y, behavior: "smooth" });
    // if (history && history.replaceState) {
    //   history.replaceState(null, "", `#${targetId}`);
    // }
  };

  const pages = [
    { id: 1, label: "Home", path: "home" },
    { id: 2, label: "About", path: "about" },
    { id: 5, label: "Projects", path: "projects" },
    { id: 3, label: "Work", path: "work" },
    { id: 4, label: "Contact", path: "contact" },
  ];

  return (
    <nav className="fixed top-0 inset-x-0 z-20 backdrop-blur-md">
      <div className="relative container mx-auto px-6 py-5 flex items-center justify-center">
        {/* Logo */}
        <Link
          href="/"
          className="absolute left-[10%] top-1/2 -translate-y-1/2 -translate-x-1/2 "
        >
          <Image
            src="/logo.png"
            alt="Logo"
            width={48}
            height={48}
            className="w-10 md:w h-10 md:h animate-spin-slow"
            loading="lazy"
          />
        </Link>

        {/* Menu Positioned at Center-Left (25%) */}
        <div className="flex gap-6 items-center">
          {pages.map((item) => (
            <div
              key={item.id}
              // href={`#${item.path}`}
              className={`text-white text-sm sm:text-base font-medium hover:text-[#007bff] transition cursor-pointer ${aboutStyles.strokeme}`}
              onClick={(e) => handleNavClick(e, item.path)}
            >
              {item.label}
            </div>
          ))}
          <button
            aria-label="Toggle theme"
            onClick={toggleTheme}
            className="ml-4 px-3 py-1 rounded-full border border-white/30 text-white text-xs hover:bg-white/10 transition"
          >
            {theme === "light" ? "Dark" : "Light"}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Header;
