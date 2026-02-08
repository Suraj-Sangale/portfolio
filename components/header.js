import Image from "next/image";
import Link from "next/link";
import React from "react";
import aboutStyles from "../styles/about.module.css";
import { getNavigation, getPersonalInfo } from "@/utilities/getPortfolioData";

const Header = () => {
  const headerHeight = 80; // keep in sync with --header-height in globals.css

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

  const pages = getNavigation().pages;
  const personalInfo = getPersonalInfo();

  return (
    <nav className="fixed top-0 inset-x-0 z-20 backdrop-blur-md">
      <div className="relative container mx-auto px-6 py-5 flex items-center justify-center">
        {/* Logo */}
        <Link
          href="/"
          className="absolute left-[10%] top-1/2 -translate-y-1/2 -translate-x-1/2 "
        >
          <Image
            src={personalInfo.logo || "/logo.png"}
            alt="Logo"
            width={48}
            height={48}
            className="w-10 md:w h-10 md:h animate-spin-slow"
            loading="lazy"
          />
        </Link>

        {/* Menu Positioned at Center-Left (25%) */}
        <div className="flex gap-6">
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
        </div>
      </div>
    </nav>
  );
};

export default Header;
