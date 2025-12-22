import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaEnvelope, FaPhoneAlt, FaUser, FaCommentDots } from "react-icons/fa";

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
      <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-yellow-400/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 -left-40 w-[400px] h-[400px] bg-indigo-500/20 rounded-full blur-3xl"></div>

      <div className="relative max-w-3xl mx-auto px-6">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            Get in
            <span className="block bg-gradient-to-r from-yellow-400 to-white bg-clip-text text-transparent">
              Touch With Us
            </span>
          </h1>

          <p className="text-gray-300">
            Questions, special requests, or custom arrangements?
            Our team is here to assist you.
          </p>
        </motion.div>

        {/* FORM */}
        <motion.form
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          onSubmit={handleSubmit}
          className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 space-y-6 shadow-2xl"
        >

          {/* NAME */}
          <FormGroup label="Full Name" icon={<FaUser />}>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-input"
              required
            />
          </FormGroup>

          {/* EMAIL */}
          <FormGroup label="Email Address" icon={<FaEnvelope />}>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              required
            />
          </FormGroup>

          {/* PHONE */}
          <FormGroup label="Phone Number" icon={<FaPhoneAlt />}>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="form-input"
            />
          </FormGroup>

          {/* MESSAGE */}
          <FormGroup label="Your Message" icon={<FaCommentDots />}>
            <textarea
              name="message"
              rows="5"
              value={formData.message}
              onChange={handleChange}
              placeholder="Tell us how we can help you..."
              className="form-input"
              required
            />
          </FormGroup>

          {/* SUBMIT */}
          <button
            type="submit"
            className="w-full mt-6 py-4 rounded-2xl bg-yellow-400 text-black font-semibold hover:bg-yellow-300 transition shadow-lg"
          >
            Send Message
          </button>
        </motion.form>

        {/* CONTACT INFO */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center text-gray-300 space-y-2"
        >
          <p>📧 Email: <span className="text-white">info@luxurychauffeur.com</span></p>
          <p>📞 Phone: <span className="text-white">+27 123 456 789</span></p>
        </motion.div>
      </div>
    </section>
  );
};

/* ---------- Reusable Field ---------- */

const FormGroup = ({ label, icon, children }) => (
  <div>
    <label className="block mb-2 font-semibold text-sm text-gray-200">
      {icon && <span className="inline-block mr-2 text-yellow-400">{icon}</span>}
      {label}
    </label>
    {children}
  </div>
);

export default Contact;
