import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaEnvelope,
  FaPhoneAlt,
  FaUser,
  FaCommentDots,
  FaWhatsapp,
  FaBuilding,
} from "react-icons/fa";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Contact Submitted:", formData);
    alert("Thank you for reaching out! We’ll respond shortly.");
  };

  return (
    <section className="relative overflow-hidden pt-32 pb-28 bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white">
      {/* Background Glow */}
      <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-yellow-400/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 -left-40 w-[400px] h-[400px] bg-indigo-500/30 rounded-full blur-3xl"></div>

      <div className="relative max-w-4xl mx-auto px-6">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            Get in{" "}
            <span className="block bg-gradient-to-r from-yellow-400 to-white bg-clip-text text-transparent">
              Touch With Us
            </span>
          </h1>
          <p className="text-gray-300">
            Fast support, instant calls & WhatsApp chat available.
          </p>
        </motion.div>

        {/* CONTACT QUICK ACTIONS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-3 gap-6 mb-12"
        >
          {/* WHATSAPP */}
          <a
            href="https://wa.me/0813186838"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-6 rounded-2xl bg-green-500 hover:bg-green-400 transition shadow-xl"
          >
            <FaWhatsapp className="text-3xl" />
            <div>
              <p className="font-bold">WhatsApp</p>
              <p className="text-sm">0813186838</p>
            </div>
          </a>

          {/* OFFICE PHONE */}
          <a
            href="tel:+27111222333"
            className="flex items-center gap-4 p-6 rounded-2xl bg-yellow-400 text-black hover:bg-yellow-300 transition shadow-xl"
          >
            <FaPhoneAlt className="text-2xl" />
            <div>
              <p className="font-bold">Office Call</p>
              <p className="text-sm">0813186838</p>
            </div>
          </a>

          {/* EMAIL */}
          <a
            href="mailto:info@luxurychauffeur.com"
            className="flex items-center gap-4 p-6 rounded-2xl bg-indigo-500 hover:bg-indigo-400 transition shadow-xl"
          >
            <FaEnvelope className="text-2xl" />
            <div>
              <p className="font-bold">Email Us</p>
              <p className="text-sm">info@luxurychauffeur.com</p>
            </div>
          </a>
        </motion.div>

        {/* FORM */}
        <motion.form
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          onSubmit={handleSubmit}
          className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 space-y-6 shadow-2xl"
        >
          <FormGroup label="Full Name" icon={<FaUser />}>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-gray-300 focus:bg-white/30 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
              placeholder="Your Full Name"
              required
            />
          </FormGroup>

          <FormGroup label="Email Address" icon={<FaEnvelope />}>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-gray-300 focus:bg-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
              placeholder="you@example.com"
              required
            />
          </FormGroup>

          <FormGroup label="Phone Number" icon={<FaPhoneAlt />}>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-gray-300 focus:bg-white/30 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
              placeholder="+27 12 345 6789"
            />
          </FormGroup>

          <FormGroup label="Your Message" icon={<FaCommentDots />}>
            <textarea
              name="message"
              rows="5"
              value={formData.message}
              onChange={handleChange}
              placeholder="Tell us how we can help you..."
              className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-gray-300 focus:bg-white/30 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition resize-none"
              required
            />
          </FormGroup>

          <button
            type="submit"
            className="w-full mt-6 py-4 rounded-2xl bg-yellow-400 text-black font-semibold hover:bg-yellow-300 transition shadow-lg"
          >
            Send Message
          </button>
        </motion.form>

        {/* OFFICE INFO */}
        <div className="mt-10 text-center text-gray-300 space-y-2">
          <p className="flex justify-center items-center gap-2 text-white font-medium">
            <FaBuilding className="text-yellow-400" />
            Office Hours: Mon – Fri | 08:00 – 18:00
          </p>
          <p className="text-white font-medium">
            Address: 123 Luxury Ave, Johannesburg, South Africa
          </p>
        </div>
      </div>
    </section>
  );
};

/* ---------- Reusable Field ---------- */
const FormGroup = ({ label, icon, children }) => (
  <div>
    <label className="block mb-2 font-semibold text-sm text-gray-200 flex items-center gap-2">
      {icon && <span className="text-yellow-400">{icon}</span>}
      {label}
    </label>
    {children}
  </div>
);

export default Contact;
