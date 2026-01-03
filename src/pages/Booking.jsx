import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaPhone,
  FaTimes,
  FaUsers,
  FaSnowflake,
  FaSuitcase,
  FaCogs,
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
    {
      name: "Family Car SUV",
      reg: "ABC123",
      seats: 4,
      pricePerDay: 2500,
      image: picture1,
    },
    {
      name: "Mercedes S-Class Family Car",
      reg: "XYZ789",
      seats: 4,
      pricePerDay: 2300,
      image: pic,
    },
    {
      name: "Audi A8",
      reg: "DEF456",
      seats: 4,
      pricePerDay: 2200,
      image: pic3,
    },
    {
      name: "Executive Uber Black",
      reg: "UBR001",
      seats: 4,
      pricePerDay: 1800,
      image: uber,
    },
    {
      name: "Luxury Uber XL",
      reg: "UBR002",
      seats: 6,
      pricePerDay: 2000,
      image: uber2,
    },
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
    <section className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white">

      {/* ================= TOP BAR ================= */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/5 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-extrabold tracking-wide">
            🚘 Luxury Chauffeur
          </h1>
          <span className="text-sm text-gray-300 hidden sm:block">
            Premium Vehicles • Professional Service
          </span>
        </div>
      </header>

      {/* ================= CONTENT ================= */}
      <div className="px-6 py-12 max-w-7xl mx-auto">
        <h2 className="text-4xl font-extrabold mb-12 text-center">
          Select Your Luxury Ride
        </h2>

        {/* ================= CAR GRID ================= */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {cars.map((car) => (
            <motion.div
              key={car.reg}
              whileHover={{ y: -8 }}
              className="rounded-3xl overflow-hidden bg-white/10 backdrop-blur-xl border border-white/10 shadow-xl"
            >
              <img
                src={car.image}
                alt={car.name}
                className="h-56 w-full object-cover"
              />

              <div className="p-6 space-y-4">
                <h3 className="text-xl font-bold">{car.name}</h3>

                {/* FEATURES */}
                <div className="grid grid-cols-2 gap-3 text-sm text-gray-300">
                  <Feature icon={<FaUsers />} label={`${car.seats} Seats`} />
                  <Feature icon={<FaSnowflake />} label="Air-Conditioned" />
                  <Feature icon={<FaCogs />} label="Automatic" />
                  <Feature icon={<FaSuitcase />} label="Luxury Luggage" />
                </div>

                <div className="flex justify-between items-center pt-4">
                  <p className="text-xl font-extrabold text-amber-400">
                    R{car.pricePerDay.toLocaleString()}
                    <span className="text-sm text-gray-300"> / day</span>
                  </p>

                  <button
                    onClick={() => setSelectedCar(car)}
                    className="px-5 py-2 rounded-xl bg-amber-400 text-black font-bold hover:bg-amber-300 transition"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ================= BOOKING MODAL ================= */}
      <AnimatePresence>
        {selectedCar && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          >
            <motion.form
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onSubmit={handleSubmit}
              className="bg-white text-black w-full max-w-lg rounded-3xl p-6 shadow-2xl relative space-y-4"
            >
              <button
                type="button"
                onClick={() => setSelectedCar(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
              >
                <FaTimes />
              </button>

              <h2 className="text-2xl font-extrabold text-slate-800">
                Book {selectedCar.name}
              </h2>

              <Input label="Pick-up Date" icon={<FaCalendarAlt />}>
                <input type="date" name="pickUpDate" required onChange={handleChange} className="form-input w-full" />
              </Input>

              <Input label="Pick-up Location" icon={<FaMapMarkerAlt />}>
                <input name="pickUpLocation" required onChange={handleChange} className="form-input w-full" />
              </Input>

              <Input label="Phone Number" icon={<FaPhone />}>
                <input type="tel" name="clientPhone" required onChange={handleChange} className="form-input w-full" />
              </Input>

              <button className="w-full py-3 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition">
                Confirm Booking
              </button>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

/* ================= SMALL COMPONENTS ================= */

const Feature = ({ icon, label }) => (
  <div className="flex items-center gap-2">
    <span className="text-amber-400">{icon}</span>
    <span>{label}</span>
  </div>
);

const Input = ({ label, icon, children }) => (
  <div>
    <label className="flex items-center gap-2 font-semibold mb-1">
      <span className="text-slate-700">{icon}</span>
      {label}
    </label>
    {children}
  </div>
);

export default Booking;
