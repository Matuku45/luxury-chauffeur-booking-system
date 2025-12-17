import React from "react";

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Company Info */}
        <div>
          <h2 className="text-xl font-bold mb-2">Luxury Chauffeur</h2>
          <p className="text-slate-400 text-sm">
            Premium chauffeur services for matric dances and weddings.
          </p>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Contact</h3>
          <p className="text-slate-400 text-sm">📧 Email: info@luxurychauffeur.com</p>
          <p className="text-slate-400 text-sm">📞 Phone: +27 123 456 789</p>
          <p className="text-slate-400 text-sm">📍 Location: Johannesburg, South Africa</p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
          <ul className="text-slate-400 text-sm space-y-1">
            <li>Home</li>
            <li>Matric Dances</li>
            <li>Weddings</li>
            <li>Vehicles</li>
            <li>Booking</li>
            <li>Contact</li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-700 mt-6 pt-4 text-center text-slate-500 text-xs">
        © {new Date().getFullYear()} Luxury Chauffeur. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
