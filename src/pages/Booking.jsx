import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaPhone,
  FaTimes,
} from "react-icons/fa";
import axios from "axios";

/* 🔹 ASSET IMPORTS */
import pic from "../assets/pic.webp";
import pic3 from "../assets/pic3.webp";
import picture1 from "../assets/picture1.webp.jpg";
import uber from "../assets/uber.webp";
import uber2 from "../assets/uber2.webp";

const Booking = () => {
  const [selectedCar, setSelectedCar] = useState(null);

  const [formData, setFormData] = useState({
    pickUpDate: "",
    pickUpLocation: "",
    clientPhone: "",
  });

  /* 🚘 CARS */
  const cars = [
    { name: "Mercedes S-Class", reg: "ABC123", seats: 4, pricePerDay: 2500, image: picture1 },
    { name: "BMW 7 Series", reg: "XYZ789", seats: 4, pricePerDay: 2300, image: pic },
    { name: "Audi A8", reg: "DEF456", seats: 4, pricePerDay: 2200, image: pic3 },
    { name: "Executive Uber Black", reg: "UBR001", seats: 4, pricePerDay: 1800, image: uber },
    { name: "Luxury Uber XL", reg: "UBR002", seats: 6, pricePerDay: 2000, image: uber2 },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCar) return;

    try {
      await axios.post("http://localhost:5000/api/bookings", {
        ...formData,
        carName: selectedCar.name,
        carRegNumber: selectedCar.reg,
        pricePerDay: selectedCar.pricePerDay,
      });
      alert("✅ Booking confirmed!");
      setSelectedCar(null);
    } catch {
      alert("❌ Booking failed");
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-400 to-yellow-300 p-8">
      {/* ================= HEADER ================= */}
      <h1 className="text-4xl font-extrabold text-white mb-10 text-center">
        Select Your Luxury Ride
      </h1>

      {/* ================= PRODUCTS GRID ================= */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
        {cars.map((car) => (
          <motion.div
            key={car.reg}
            whileHover={{ scale: 1.05 }}
            onClick={() => setSelectedCar(car)}
            className="cursor-pointer rounded-3xl overflow-hidden shadow-xl bg-white"
          >
            <img
              src={car.image}
              alt={car.name}
              className="h-48 w-full object-cover"
            />
            <div className="p-5">
              <h3 className="text-xl font-bold">{car.name}</h3>
              <p className="text-gray-600">Seats: {car.seats}</p>
              <p className="mt-2 text-lg font-extrabold text-purple-600">
                R{car.pricePerDay.toLocaleString()} / day
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ================= BOOKING MODAL ================= */}
      <AnimatePresence>
        {selectedCar && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          >
            <motion.form
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              onSubmit={handleSubmit}
              className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl relative space-y-4"
            >
              <button
                type="button"
                onClick={() => setSelectedCar(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
              >
                <FaTimes />
              </button>

              <h2 className="text-2xl font-extrabold text-purple-700">
                Book {selectedCar.name}
              </h2>

              <Input label="Pick-up Date" icon={<FaCalendarAlt />}>
                <input
                  type="date"
                  name="pickUpDate"
                  required
                  onChange={handleChange}
                  className="form-input w-full"
                />
              </Input>

              <Input label="Pick-up Location" icon={<FaMapMarkerAlt />}>
                <input
                  name="pickUpLocation"
                  required
                  onChange={handleChange}
                  className="form-input w-full"
                />
              </Input>

              <Input label="Cell Phone Number" icon={<FaPhone />}>
                <input
                  type="tel"
                  name="clientPhone"
                  required
                  onChange={handleChange}
                  className="form-input w-full"
                />
              </Input>

              <button className="w-full py-3 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-500 transition">
                Confirm Booking
              </button>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

/* ================= INPUT COMPONENT ================= */

const Input = ({ label, icon, children }) => (
  <div>
    <label className="flex items-center gap-2 font-semibold text-gray-700 mb-1">
      <span className="text-purple-600">{icon}</span>
      {label}
    </label>
    {children}
  </div>
);

export default Booking;
