import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import aboutStyles from "../styles/about.module.css";
import { getNavigation, getPersonalInfo } from "@/utilities/getPortfolioData";

const Header = () => {
  const router = useRouter();
  const pages = getNavigation().pages;
  const personalInfo = getPersonalInfo();

  // Map path to route
  const getRoute = (path) => {
    if (path === "home") return "/";
    return `/${path}`;
  };

  // Check if current route is active
  const isActive = (path) => {
    const route = getRoute(path);
    if (route === "/") {
      return router.pathname === "/";
    }
    return router.pathname === route;
  };

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
      </div>
    </nav>
  );
};

export default Header;
