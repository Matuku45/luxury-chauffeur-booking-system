import React from "react";
import {
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaCarSide,
  FaHeart,
  FaGraduationCap,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-black via-gray-900 to-gray-800 text-gray-300 mt-32">

      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-12">

        {/* BRAND */}
        <div>
          <h2 className="text-2xl font-extrabold text-white mb-4">
            Luxury Chauffeur
          </h2>
          <p className="text-sm leading-relaxed">
            Premium owner-driven chauffeur services for
            <span className="text-yellow-400"> matric dances </span>
            and
            <span className="text-yellow-400"> weddings</span>.
            Designed for elegance, comfort, and unforgettable moments.
          </p>
        </div>

        {/* CONTACT */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Contact</h3>

          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-3">
              <FaEnvelope className="text-yellow-400" />
              info@luxurychauffeur.com
            </li>
            <li className="flex items-center gap-3">
              <FaPhoneAlt className="text-yellow-400" />
              +27 123 456 789
            </li>
            <li className="flex items-center gap-3">
              <FaMapMarkerAlt className="text-yellow-400" />
              Johannesburg, South Africa
            </li>
          </ul>
        </div>

        {/* LINKS */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>

          <ul className="space-y-3 text-sm">
        
            <li className="flex items-center gap-3 hover:text-yellow-400 transition">
              <FaGraduationCap className="text-yellow-400" />
              <Link to="/matric-dances">Matric Dances</Link>
            </li>
            <li className="flex items-center gap-3 hover:text-yellow-400 transition">
              <FaHeart className="text-yellow-400" />
              <Link to="/weddings">Weddings</Link>
            </li>
            <li className="flex items-center gap-3 hover:text-yellow-400 transition">
              <FaCarSide className="text-yellow-400" />
              <Link to="/vehicles">Vehicles</Link>
            </li>
        
            <li className="flex items-center gap-3 hover:text-yellow-400 transition">
              <FaEnvelope className="text-yellow-400" />
              <Link to="/contact">Contact</Link>
            </li>
          </ul>
        </div>
      </div>

      {/* COPYRIGHT */}
      <div className="border-t border-white/10 py-6 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} Luxury Chauffeur. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
