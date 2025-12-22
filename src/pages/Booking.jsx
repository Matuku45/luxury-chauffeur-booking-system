import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaCalendarAlt, FaMapMarkerAlt, FaUser, FaEnvelope, FaPhone, FaCar, FaHome, FaHistory } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Booking = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: "", email: "" });
  const [showForm, setShowForm] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);

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

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      setFormData(prev => ({ ...prev, clientName: storedUser.name, clientEmail: storedUser.email }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Booking Submitted:", formData, "Car:", selectedCar);
    alert("Booking confirmed! Our team will contact you soon.");
    setShowForm(false);
    setSelectedCar(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/"); // Navigate to home page
  };

  const cars = [
    { name: "Mercedes S-Class", reg: "ABC123", seats: 4, image: "/images/mercedes.jpg" },
    { name: "BMW 7 Series", reg: "XYZ789", seats: 4, image: "/images/bmw.jpg" },
    { name: "Audi A8", reg: "DEF456", seats: 4, image: "/images/audi.jpg" },
  ];

  return (
    <section className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-purple-400 via-pink-300 to-yellow-300 text-gray-900">

      {/* Sidebar */}
      <motion.div
        initial={{ x: -200, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-white/90 p-6 w-full md:w-1/4 flex flex-col justify-between shadow-lg"
      >
        <div>
          <h2 className="text-2xl font-bold text-purple-700 mb-4">Dashboard</h2>
          <div className="mb-6">
            <p className="font-semibold">{user.name}</p>
            <p className="text-sm text-gray-600">{user.email}</p>
          </div>

          <nav className="flex flex-col gap-3">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 p-3 rounded-xl bg-purple-100 hover:bg-purple-200 transition"
            >
              <FaHome /> Home
            </button>
            <button className="flex items-center gap-2 p-3 rounded-xl bg-purple-100 hover:bg-purple-200 transition">
              <FaCar /> Cars
            </button>
            <button className="flex items-center gap-2 p-3 rounded-xl bg-purple-100 hover:bg-purple-200 transition">
              <FaHistory /> Booking History
            </button>
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="mt-6 w-full py-3 rounded-xl bg-red-500 text-white font-bold hover:bg-red-400 transition"
        >
          Logout
        </button>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-6 text-purple-700">
          Select a Car to Book
        </h1>

        {/* Car Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          {cars.map((car, index) => (
            <motion.div
              key={index}
              onClick={() => { setSelectedCar(car); setShowForm(true); }}
              whileHover={{ scale: 1.05 }}
              className="cursor-pointer bg-gradient-to-tr from-purple-200 to-pink-200 rounded-3xl shadow-xl overflow-hidden relative"
            >
              <img src={car.image} alt={car.name} className="w-full h-40 object-cover" />
              <div className="p-4 bg-white/80">
                <h3 className="font-bold text-lg">{car.name}</h3>
                <p className="text-sm text-gray-700">Reg: {car.reg}</p>
                <p className="text-sm text-gray-700">Seats: {car.seats}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Booking Form */}
        {showForm && selectedCar && (
          <motion.form
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            onSubmit={handleSubmit}
            className="bg-white/90 p-6 rounded-3xl shadow-lg max-w-3xl mx-auto space-y-5"
          >
            <h2 className="text-2xl font-bold text-purple-700 mb-4">
              Booking: {selectedCar.name}
            </h2>

            <p className="font-semibold text-gray-700">Registration Number: {selectedCar.reg}</p>
            <p className="font-semibold text-gray-700">Seats: {selectedCar.seats}</p>

            {/* Event Type */}
            <FormGroup label="Event Type">
              <select
                name="eventType"
                value={formData.eventType}
                onChange={handleChange}
                className="form-input"
              >
                <option>Matric Dance</option>
                <option>Wedding</option>
                <option>Birthday</option>
                <option>Corporate Event</option>
              </select>
            </FormGroup>

            {/* Date & Time */}
            <div className="grid md:grid-cols-2 gap-4">
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

            {/* Locations */}
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

            {/* Duration & Passengers */}
            <div className="grid md:grid-cols-2 gap-4">
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

            {/* Client Info */}
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

            {/* Special Requests */}
            <FormGroup label="Special Requests">
              <textarea
                name="specialRequests"
                rows="3"
                value={formData.specialRequests}
                onChange={handleChange}
                placeholder="Red carpet, ribbons, photo stops, etc."
                className="form-input"
              />
            </FormGroup>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-purple-500 text-white font-bold hover:bg-purple-400 transition shadow-lg"
            >
              Confirm Booking
            </button>
          </motion.form>
        )}
      </div>
    </section>
  );
};

// Reusable FormGroup
const FormGroup = ({ label, icon, children }) => (
  <div className="flex flex-col mb-3">
    <label className="block font-semibold text-gray-700 mb-1">
      {icon && <span className="inline-block mr-2 text-purple-500">{icon}</span>}
      {label}
    </label>
    {children}
  </div>
);

export default Booking;
