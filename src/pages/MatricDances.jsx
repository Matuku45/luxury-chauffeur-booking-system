import React from "react";
import { motion } from "framer-motion";
import {
  FaCarSide,
  FaCameraRetro,
  FaClock,
  FaStar,
  FaShieldAlt,
  FaBolt,
} from "react-icons/fa";

const MatricDances = () => {
  return (
    <section className="relative overflow-hidden pt-32 pb-28 bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white">

      {/* Floating Gradient Orbs */}
      <div className="absolute -top-40 -right-40 w-[520px] h-[520px] bg-yellow-400/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 -left-40 w-[420px] h-[420px] bg-indigo-500/20 rounded-full blur-3xl"></div>

      <div className="relative max-w-7xl mx-auto px-6">

        {/* AI STYLE BADGE */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-block mb-6 px-6 py-2 rounded-full bg-white/10 backdrop-blur border border-white/20 text-sm tracking-wide"
        >
          ✨ Premium Matric Experience
        </motion.div>

        {/* MAIN HEADING WITH GRADIENT TEXT */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight"
        >
          Arrive Like a
          <span className="block bg-gradient-to-r from-yellow-400 via-yellow-300 to-white bg-clip-text text-transparent animate-pulse">
            Main Character
          </span>
        </motion.h1>

        {/* FLOWING / AI FEEL TEXT */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="max-w-3xl text-lg text-gray-300 mb-16"
        >
          Your matric dance is not just an event — it’s a moment.
          We deliver confidence, elegance, and unforgettable presence
          through carefully curated luxury chauffeur experiences.
        </motion.p>

        {/* FEATURE CARDS */}
        <div className="grid md:grid-cols-3 gap-8 mb-24">
          <Feature
            icon={<FaCarSide />}
            title="Luxury Vehicles"
            text="Premium vehicles polished to perfection for the ultimate entrance."
          />
          <Feature
            icon={<FaCameraRetro />}
            title="Photo-Perfect Moments"
            text="Planned scenic stops so every arrival is Instagram-worthy."
          />
          <Feature
            icon={<FaClock />}
            title="Precision Timing"
            text="Your moment arrives exactly on time — every time."
          />
        </div>

        {/* SPLIT EXPERIENCE */}
        <div className="grid md:grid-cols-2 gap-20 items-center">

          {/* LEFT TEXT */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Designed for Confidence.
              <span className="block text-yellow-400">
                Trusted by Parents.
              </span>
            </h2>

            <p className="text-gray-300 mb-8">
              We balance style and responsibility. Parents trust us for safety.
              Students love us for the vibe. It’s luxury with peace of mind.
            </p>

            <ul className="space-y-5">
              <AnimatedPoint icon={<FaShieldAlt />} text="Safe, insured, and professionally managed" />
              <AnimatedPoint icon={<FaBolt />} text="Smooth, stress-free experience from pickup to drop-off" />
              <AnimatedPoint icon={<FaStar />} text="Luxury feel without hidden costs" />
            </ul>

            <div className="mt-10 flex gap-4">
              <a
                href="/book"
                className="px-10 py-4 bg-yellow-400 text-black font-semibold rounded-2xl hover:bg-yellow-300 transition shadow-lg"
              >
                Secure Your Date
              </a>
              <a
                href="/packages"
                className="px-10 py-4 border border-gray-400 rounded-2xl hover:bg-white hover:text-black transition"
              >
                View Packages
              </a>
            </div>
          </motion.div>

          {/* RIGHT GLASS CARD */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-12 shadow-2xl"
          >
            <div className="absolute -top-6 right-6 bg-yellow-400 text-black px-6 py-2 rounded-full text-sm font-semibold">
              Limited Availability
            </div>

            <h3 className="text-2xl font-semibold mb-4">
              Why This Experience Matters
            </h3>

            <p className="text-gray-300 mb-8">
              The way you arrive sets the tone for the entire night.
              Confidence. Presence. Elegance. We deliver all three.
            </p>

            <div className="h-1 w-20 bg-gradient-to-r from-yellow-400 to-white rounded-full"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Feature = ({ icon, title, text }) => (
  <motion.div
    whileHover={{ scale: 1.07 }}
    className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 text-center shadow-xl"
  >
    <div className="text-yellow-400 text-4xl mb-5">{icon}</div>
    <h3 className="text-xl font-semibold mb-3">{title}</h3>
    <p className="text-gray-300 text-sm">{text}</p>
  </motion.div>
);

const AnimatedPoint = ({ icon, text }) => (
  <motion.li
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.6 }}
    className="flex items-center gap-4"
  >
    <span className="text-yellow-400 text-xl">{icon}</span>
    <span className="text-gray-300">{text}</span>
  </motion.li>
);

export default MatricDances;
