import Image from "next/image";
import Link from "next/link";
import React from "react";

const Header = () => {
  const pages = [
    { id: 1, label: "Home", path: "home" },
    { id: 2, label: "About", path: "about" },
    { id: 3, label: "Work", path: "work" },
    { id: 4, label: "Contact", path: "contact" },
  ];

  return (
    <nav className="fixed top-0 inset-x-0 z-20 backdrop-blur-md">
      <div className="relative container mx-auto px-6 py-5 flex items-center justify-center">
        {/* Logo */}
        <Link href="/" className="absolute left-[10%] top-1/2 -translate-y-1/2 -translate-x-1/2 ">
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
        <div className="flex gap-6">
          {pages.map((item) => (
            <Link
              key={item.id}
              href={`#${item.path}`}
              className="text-white text-sm sm:text-base font-medium hover:text-orange-400 transition"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav >
  );
};

export default Header;
