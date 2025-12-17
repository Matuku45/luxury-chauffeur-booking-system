import React, { useState } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full bg-blue-700 text-white z-50 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">

        {/* Logo */}
        <Link to="/" className="text-2xl font-bold">
          Luxury Chauffeur
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6 font-medium">
          <Link to="/" className="hover:text-yellow-400 transition">Home</Link>
          <Link to="/matric-dances" className="hover:text-yellow-400 transition">Matric Dances</Link>
          <Link to="/weddings" className="hover:text-yellow-400 transition">Weddings</Link>
          <Link to="/vehicles" className="hover:text-yellow-400 transition">Vehicles</Link>
          <Link to="/booking" className="hover:text-yellow-400 transition">Booking</Link>
          <Link to="/contact" className="hover:text-yellow-400 transition">Contact</Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-2xl font-bold"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-blue-800 px-6 py-4 space-y-4 text-center">
          <Link to="/" onClick={() => setMenuOpen(false)} className="block hover:text-yellow-400 transition">Home</Link>
          <Link to="/matric-dances" onClick={() => setMenuOpen(false)} className="block hover:text-yellow-400 transition">Matric Dances</Link>
          <Link to="/weddings" onClick={() => setMenuOpen(false)} className="block hover:text-yellow-400 transition">Weddings</Link>
          <Link to="/vehicles" onClick={() => setMenuOpen(false)} className="block hover:text-yellow-400 transition">Vehicles</Link>
          <Link to="/booking" onClick={() => setMenuOpen(false)} className="block hover:text-yellow-400 transition">Booking</Link>
          <Link to="/contact" onClick={() => setMenuOpen(false)} className="block hover:text-yellow-400 transition">Contact</Link>
      <Link to="/login" onClick={() => setMenuOpen(false)} className="block hover:text-yellow-400 transition">Login</Link>
      <Link to="/signup" onClick={() => setMenuOpen(false)} className="block hover:text-yellow-400 transition">Sign Up</Link>

        </div>
      )}
    </header>
  );
};

export default Header;
