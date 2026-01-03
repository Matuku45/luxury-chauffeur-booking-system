import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaCarSide, FaBars, FaTimes } from "react-icons/fa";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full z-50 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">

        {/* LOGO */}
        <Link
          to="/"
          className="flex items-center gap-3 text-white text-2xl font-bold tracking-wide"
        >
          <FaCarSide className="text-yellow-400" />
          <span className="hover:text-yellow-400 transition">
            Luxury Chauffeur
          </span>
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex space-x-8 text-slate-300 font-medium">
          {["Home", "Matric Dances", "Weddings", "Vehicles", "Booking", "Contact"].map(
            (item) => (
              <Link
                key={item}
                to={`/${item.toLowerCase().replace(" ", "-")}`}
                className="relative group hover:text-yellow-400 transition"
              >
                {item}
                <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-yellow-400 transition-all group-hover:w-full"></span>
              </Link>
            )
          )}
        </nav>

        {/* MOBILE BUTTON */}
        <button
          className="md:hidden text-2xl text-slate-300 hover:text-yellow-400 transition"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="md:hidden bg-slate-900 px-6 py-6 space-y-4 text-center border-t border-slate-700">
          {[
            { label: "Home", path: "/booking" },
            { label: "Matric Dances", path: "/matric-dances" },
            { label: "Weddings", path: "/weddings" },
            { label: "Contact", path: "/contact" },
            { label: "Login", path: "/login" },
            { label: "Sign Up", path: "/signup"},
          ].map((link) => (
            <Link
              key={link.label}
              to={link.path}
              onClick={() => setMenuOpen(false)}
              className="block text-slate-300 text-lg font-medium hover:text-yellow-400 transition"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};

export default Header;
