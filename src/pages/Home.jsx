import React from "react";
import { motion } from "framer-motion";
import { FaCarSide, FaRing, FaUserTie, FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden pt-32 pb-24 bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white">

      {/* Decorative Gradient Glow (NON-CLICK BLOCKING) */}
      <div className="pointer-events-none absolute -top-40 -right-40 w-[500px] h-[500px] bg-yellow-500/20 rounded-full blur-3xl"></div>
      <div className="pointer-events-none absolute top-40 -left-40 w-[400px] h-[400px] bg-indigo-500/20 rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">

        {/* LEFT CONTENT */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
            Luxury Chauffeur <br />
            <span className="text-yellow-400">Booking Services</span>
          </h1>

          <p className="text-lg text-gray-300 max-w-xl mb-8">
            Premium owner-driven chauffeur services designed for{" "}
            <strong>Matric Dances</strong> and <strong>Weddings</strong>.
            Arrive in elegance, comfort, and unmatched style.
          </p>

          {/* ✅ FIXED BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate("/booking")}
              className="w-full sm:w-auto px-8 py-4 bg-yellow-400 text-black font-semibold rounded-xl hover:bg-yellow-300 transition active:scale-95"
            >
              User
            </button>

            <button
             
              className="w-full sm:w-auto px-8 py-4 border border-gray-400 rounded-xl hover:bg-white hover:text-black transition active:scale-95"
            >
              Admin
            </button>
          </div>
        </motion.div>

        {/* RIGHT FEATURES */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-6"
        >
          <Feature
            icon={<FaCarSide />}
            title="Luxury Vehicles"
            text="High-end, immaculately maintained vehicles for premium events."
          />
          <Feature
            icon={<FaRing />}
            title="Wedding Specialists"
            text="Perfectly timed, elegant transport for your special day."
          />
          <Feature
            icon={<FaUserTie />}
            title="Professional Chauffeurs"
            text="Owner-driven, punctual, and professionally presented."
          />
          <Feature
            icon={<FaCheckCircle />}
            title="Admin Approval System"
            text="Bookings approved before payment for peace of mind."
          />
        </motion.div>
      </div>
    </section>
  );
};

const Feature = ({ icon, title, text }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-lg"
  >
    <div className="text-yellow-400 text-3xl mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-300 text-sm">{text}</p>
  </motion.div>
);

export default Home;
