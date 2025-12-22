import React from "react";
import { motion } from "framer-motion";
import {
  FaRing,
  FaCarSide,
  FaHeart,
  FaClock,
  FaShieldAlt,
  FaStar,
} from "react-icons/fa";

const Weddings = () => {
  return (
    <section className="relative overflow-hidden pt-32 pb-28 bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white">

      {/* Soft Romantic Glow */}
      <div className="absolute -top-40 -right-40 w-[520px] h-[520px] bg-yellow-400/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 -left-40 w-[420px] h-[420px] bg-indigo-500/20 rounded-full blur-3xl"></div>

      <div className="relative max-w-7xl mx-auto px-6">

        {/* ELEGANT BADGE */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-block mb-6 px-6 py-2 rounded-full bg-white/10 backdrop-blur border border-white/20 text-sm tracking-wide"
        >
          💍 Wedding Chauffeur Experience
        </motion.div>

        {/* GRADIENT TITLE */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight"
        >
          A Grand Arrival for
          <span className="block bg-gradient-to-r from-yellow-400 via-yellow-300 to-white bg-clip-text text-transparent">
            Your Forever Moment
          </span>
        </motion.h1>

        {/* SUBTEXT */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="max-w-3xl text-lg text-gray-300 mb-20"
        >
          Your wedding day deserves perfection. We provide refined,
          professionally managed chauffeur services that ensure elegance,
          punctuality, and peace of mind from the first pickup to the final
          farewell.
        </motion.p>

        {/* FEATURE ROW */}
        <div className="grid md:grid-cols-3 gap-8 mb-24">
          <Feature
            icon={<FaRing />}
            title="Elegant Wedding Arrival"
            text="A timeless entrance that reflects love, sophistication, and style."
          />
          <Feature
            icon={<FaCarSide />}
            title="Luxury Vehicles"
            text="Immaculate vehicles prepared specifically for wedding ceremonies."
          />
          <Feature
            icon={<FaClock />}
            title="Perfect Timing"
            text="Seamless coordination so every moment flows beautifully."
          />
        </div>

        {/* SPLIT SECTION */}
        <div className="grid md:grid-cols-2 gap-20 items-center">

          {/* LEFT TEXT */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Elegance Without Stress.
              <span className="block text-yellow-400">
                Luxury You Can Trust.
              </span>
            </h2>

            <p className="text-gray-300 mb-8">
              We work closely with couples and planners to ensure every detail
              is executed flawlessly. Your focus stays on love — we handle the
              journey.
            </p>

            <ul className="space-y-5">
              <WeddingPoint icon={<FaShieldAlt />} text="Fully insured and professionally managed" />
              <WeddingPoint icon={<FaHeart />} text="Discreet, respectful, and well-presented chauffeurs" />
              <WeddingPoint icon={<FaStar />} text="Tailored packages for your special day" />
            </ul>

            <div className="mt-10 flex gap-4">
              <a
                href="/book"
                className="px-10 py-4 bg-yellow-400 text-black font-semibold rounded-2xl hover:bg-yellow-300 transition shadow-lg"
              >
                Reserve Your Date
              </a>
              <a
                href="/contact"
                className="px-10 py-4 border border-gray-400 rounded-2xl hover:bg-white hover:text-black transition"
              >
                Speak to Us
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
              Wedding Day Exclusive
            </div>

            <h3 className="text-2xl font-semibold mb-4">
              A Seamless Journey
            </h3>

            <p className="text-gray-300 mb-8">
              From ceremony to reception, every mile is handled with grace,
              discretion, and precision timing — so your day unfolds perfectly.
            </p>

            <div className="flex items-center gap-3 text-yellow-400">
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStar />
              <span className="ml-2 text-sm text-gray-300">
                Trusted for once-in-a-lifetime moments
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Feature = ({ icon, title, text }) => (
  <motion.div
    whileHover={{ scale: 1.06 }}
    className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 text-center shadow-xl"
  >
    <div className="text-yellow-400 text-4xl mb-5">{icon}</div>
    <h3 className="text-xl font-semibold mb-3">{title}</h3>
    <p className="text-gray-300 text-sm">{text}</p>
  </motion.div>
);

const WeddingPoint = ({ icon, text }) => (
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

export default Weddings;
