import Image from "next/image";
import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const pages = [
    { id: 1, label: "Home", path: "home" },
    { id: 2, label: "About", path: "about" },
    { id: 3, label: "Work", path: "work" },
    { id: 4, label: "Contact", path: "contact" },
  ];

  return (
    <nav className="fixed top-0 inset-x-0 z-20 backdrop-blur-md">
      <div className="container mx-auto flex items-center justify-between px-6 py-3">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center"
        >
          <Image
            src="/logo.png"
            className="w-12 h-12 animate-spin-slow"
            alt="Logo"
            width={48}
            height={48}
            loading="lazy"
          />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6">
          {pages.map((item) => (
            <Link
              key={item.id}
              href={"#" + item.path}
              smooth={true}
              duration={500}
              className="text-white text-lg font-medium hover:text-blue-400 cursor-pointer transition"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div ref={menuRef}>
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-white focus:outline-none"
            aria-label="Toggle menu"
          >
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={
                  menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"
                }
              />
            </svg>
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {menuOpen && (
          <div className="md:hidden absolute top-14 right-4 bg-gray-800 text-white w-32 rounded-lg shadow-lg py-1">
            {pages.map((item) => (
              <Link
                key={item.id}
                href={"#" + item.path}
                smooth={true}
                duration={500}
                className="block px-6 py-2 text-lg text-white hover:text-orange-400 transition"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Header;
