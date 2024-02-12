
import React, { useState } from "react";
import { Link } from "react-scroll";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  return (
    <nav className="flex items-center justify-between  fixed  inset-x-0 z-10 navbar">
      <div>
        <a href="#"><img src="https://i.ibb.co/Ss4z8Z0/reactpng.png" class="rotate" width="50" />
        </a>
      </div>
      <div className="hidden md:flex space-x-4">
        <a href="#" duration={500} className="text-white">
          Home
        </a>
        <a href="#about" duration={400} className="text-white">
          About
        </a>
        <a href="#work" duration={500} className="text-white">
          Work
        </a>
        <a href="#contact" duration={500} className="text-white">
          Contact
        </a>
      </div>
      {/* Menu icon for mobile view */}
      <div className="md:hidden">
        <button onClick={toggleMenu} className="text-white">
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
        <div className="md:hidden absolute top-16 right-0 bg-gray-800 w-40 p-2 space-y-2">
          <a href="#" className="text-white block" onClick={toggleMenu}>Home</a>
          <a href="#about" className="text-white block" onClick={toggleMenu}>About</a>
          <a href="#work" className="text-white block" onClick={toggleMenu}>Work</a>
          <a href="#contact" className="text-white block" onClick={toggleMenu}>Contact</a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
