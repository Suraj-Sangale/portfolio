import React, { useState } from "react";
import { Link } from "react-scroll";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const pages = [
    { id: 1, label: "Home", path: "#" },
    { id: 2, label: "About", path: "#about" },
    { id: 3, label: "Work", path: "#work" },
    { id: 4, label: "Contact", path: "#contact" },
  ];

  return (
    <nav className="flex items-center justify-between  fixed  inset-x-0 z-10 navbar">
      <div>
        <a href="#">
          <img
            src="https://i.ibb.co/Ss4z8Z0/reactpng.png"
            className="rotate"
            width="50"
          />
        </a>
      </div>
      <div className="hidden md:flex space-x-4">
        {pages.map((item, index) => (
          <a
            key={index}
            href={item.path}
            duration={500}
            className="text-white"
          >
            {item.label}
          </a>
        ))}
      </div>
      {/* Menu icon for mobile view */}
      <div className="md:hidden">
        <button
          onClick={toggleMenu}
          className="text-white"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>
      </div>
      {menuOpen && (
        <div className="md:hidden absolute top-16 right-0 -gray-800 w-40 p-2 space-y-2">
          {pages.map((item, index) => (
            <a
              key={index}
              href={item.path}
              className="text-white block"
              onClick={toggleMenu}
            >
              {item.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
