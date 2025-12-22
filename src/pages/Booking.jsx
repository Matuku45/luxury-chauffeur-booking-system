import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaCalendarAlt, FaMapMarkerAlt, FaUser, FaEnvelope, FaPhone } from "react-icons/fa";

const Booking = () => {
  const [formData, setFormData] = useState({
    eventType: "Matric Dance",
    pickUpDate: "",
    pickUpTime: "",
    pickUpLocation: "",
    destination: "",
    duration: "4 hours",
    passengers: 1,
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    specialRequests: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Booking Submitted:", formData);
    alert("Booking request submitted! Our team will review and confirm availability.");
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
            Request a
            <span className="block bg-gradient-to-r from-yellow-400 to-white bg-clip-text text-transparent">
              Luxury Chauffeur
            </span>
          </h1>

          <p className="text-gray-300">
            Submit your booking request below. All bookings are manually reviewed
            to ensure availability and premium service.
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

          {/* EVENT TYPE */}
          <FormGroup label="Event Type">
            <select
              name="eventType"
              value={formData.eventType}
              onChange={handleChange}
              className="form-input"
            >
              <option>Matric Dance</option>
              <option>Wedding</option>
            </select>
          </FormGroup>

          {/* DATE & TIME */}
          <div className="grid md:grid-cols-2 gap-6">
            <FormGroup label="Pick-up Date" icon={<FaCalendarAlt />}>
              <input
                type="date"
                name="pickUpDate"
                value={formData.pickUpDate}
                onChange={handleChange}
                className="form-input"
              />
            </FormGroup>

            <FormGroup label="Pick-up Time">
              <input
                type="time"
                name="pickUpTime"
                value={formData.pickUpTime}
                onChange={handleChange}
                className="form-input"
              />
            </FormGroup>
          </div>

          {/* LOCATIONS */}
          <FormGroup label="Pick-up Location" icon={<FaMapMarkerAlt />}>
            <input
              type="text"
              name="pickUpLocation"
              value={formData.pickUpLocation}
              onChange={handleChange}
              className="form-input"
            />
          </FormGroup>

          <FormGroup label="Destination" icon={<FaMapMarkerAlt />}>
            <input
              type="text"
              name="destination"
              value={formData.destination}
              onChange={handleChange}
              className="form-input"
            />
          </FormGroup>

          {/* DURATION & PASSENGERS */}
          <div className="grid md:grid-cols-2 gap-6">
            <FormGroup label="Duration">
              <select
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="form-input"
              >
                <option>2 hours</option>
                <option>4 hours</option>
                <option>Full Evening</option>
              </select>
            </FormGroup>

            <FormGroup label="Passengers">
              <input
                type="number"
                min={1}
                name="passengers"
                value={formData.passengers}
                onChange={handleChange}
                className="form-input"
              />
            </FormGroup>
          </div>

          {/* CLIENT INFO */}
          <FormGroup label="Your Name" icon={<FaUser />}>
            <input
              type="text"
              name="clientName"
              value={formData.clientName}
              onChange={handleChange}
              className="form-input"
            />
          </FormGroup>

          <FormGroup label="Email Address" icon={<FaEnvelope />}>
            <input
              type="email"
              name="clientEmail"
              value={formData.clientEmail}
              onChange={handleChange}
              className="form-input"
            />
          </FormGroup>

          <FormGroup label="Phone Number" icon={<FaPhone />}>
            <input
              type="tel"
              name="clientPhone"
              value={formData.clientPhone}
              onChange={handleChange}
              className="form-input"
            />
          </FormGroup>

          {/* SPECIAL REQUESTS */}
          <FormGroup label="Special Requests">
            <textarea
              name="specialRequests"
              rows="4"
              value={formData.specialRequests}
              onChange={handleChange}
              placeholder="Red carpet, ribbons, photo stops, etc."
              className="form-input"
            />
          </FormGroup>

          {/* SUBMIT */}
          <button
            type="submit"
            className="w-full mt-6 py-4 rounded-2xl bg-yellow-400 text-black font-semibold hover:bg-yellow-300 transition shadow-lg"
          >
            Submit Booking Request
          </button>
        </motion.form>
      </div>
    </section>
  );
};

/* ---------- Reusable Components ---------- */

const FormGroup = ({ label, icon, children }) => (
  <div>
    <label className="block mb-2 font-semibold text-sm text-gray-200">
      {icon && <span className="inline-block mr-2 text-yellow-400">{icon}</span>}
      {label}
    </label>
    {children}
  </div>
);

export default Booking;
