import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import aboutStyles from "../styles/about.module.css";
import { getNavigation, getPersonalInfo } from "@/utilities/getPortfolioData";

const Header = () => {
  const router = useRouter();
  const pages = getNavigation().pages;
  const personalInfo = getPersonalInfo();
  const [menuOpen, setMenuOpen] = useState(false);

  const getRoute = (path) => {
    if (path === "home") return "/";
    return `/${path}`;
  };

  const isActive = (path) => {
    const route = getRoute(path);
    if (route === "/") return router.pathname === "/";
    return router.pathname === route;
  };

  return (
    <>
      <nav className="fixed top-0 inset-x-0 z-20 backdrop-blur-md">
        <div className="relative container mx-auto px-6 py-5 flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <Image
              src={personalInfo.logo || "/logo.png"}
              alt="Logo"
              width={48}
              height={48}
              className="w-10 h-10 animate-spin-slow"
              loading="lazy"
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-6">
            {pages.map((item) => {
              const route = getRoute(item.path);
              return (
                <Link
                  key={item.id}
                  href={route}
                  className={`text-white text-sm sm:text-base font-medium hover:text-[#007bff] transition cursor-pointer ${aboutStyles.strokeme} ${
                    isActive(item.path) ? "text-[#007bff]" : ""
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Hamburger Button */}
          <button
            className="md:hidden flex flex-col justify-center items-center gap-[5px] w-8 h-8 z-30"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            <span
              className="block h-0.5 w-6 bg-white rounded origin-center"
              style={{
                transition:
                  "transform 0.35s cubic-bezier(0.23, 1, 0.32, 1), opacity 0.35s ease",
                transform: menuOpen ? "translateY(7px) rotate(45deg)" : "none",
              }}
            />
            <span
              className="block h-0.5 w-6 bg-white rounded"
              style={{
                transition:
                  "transform 0.35s cubic-bezier(0.23, 1, 0.32, 1), opacity 0.35s ease",
                opacity: menuOpen ? 0 : 1,
                transform: menuOpen ? "scaleX(0)" : "scaleX(1)",
              }}
            />
            <span
              className="block h-0.5 w-6 bg-white rounded origin-center"
              style={{
                transition:
                  "transform 0.35s cubic-bezier(0.23, 1, 0.32, 1), opacity 0.35s ease",
                transform: menuOpen
                  ? "translateY(-7px) rotate(-45deg)"
                  : "none",
              }}
            />
          </button>
        </div>
      </nav>

      {/* Mobile Overlay Menu — rendered outside nav so it can cover full screen */}
      <div
        className="fixed inset-0 z-10 md:hidden flex flex-col items-center justify-center gap-8 backdrop-blur-lg bg-black/60"
        style={{
          transition:
            "opacity 0.4s cubic-bezier(0.23, 1, 0.32, 1), transform 0.4s cubic-bezier(0.23, 1, 0.32, 1)",
          opacity: menuOpen ? 1 : 0,
          transform: menuOpen ? "translateY(0)" : "translateY(-12px)",
          pointerEvents: menuOpen ? "auto" : "none",
        }}
      >
        {pages.map((item, index) => {
          const route = getRoute(item.path);
          return (
            <Link
              key={item.id}
              href={route}
              onClick={() => setMenuOpen(false)}
              className={`text-white text-2xl font-semibold hover:text-[#007bff] transition-colors cursor-pointer ${aboutStyles.strokeme} ${
                isActive(item.path) ? "text-[#007bff]" : ""
              }`}
              style={{
                transition: `opacity 0.4s cubic-bezier(0.23, 1, 0.32, 1) ${index * 60}ms, transform 0.4s cubic-bezier(0.23, 1, 0.32, 1) ${index * 60}ms`,
                opacity: menuOpen ? 1 : 0,
                transform: menuOpen ? "translateY(0)" : "translateY(10px)",
              }}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </>
  );
};

export default Header;
