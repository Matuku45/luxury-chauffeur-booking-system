import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaPhone,
  FaCar,
  FaHome,
  FaHistory,
  FaSignOutAlt,
  FaTimes,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

/* 🔹 ASSET IMPORTS */
import pic from "../assets/pic.webp";
import pic3 from "../assets/pic3.webp";
import picture1 from "../assets/picture1.webp.jpg";
import uber from "../assets/uber.webp";
import uber2 from "../assets/uber2.webp";

const Booking = () => {
  const navigate = useNavigate();

  const [selectedCar, setSelectedCar] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState({ name: "", email: "" });

  const [formData, setFormData] = useState({
    pickUpDate: "",
    pickUpLocation: "",
    clientPhone: "",
  });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);
  }, []);

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

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <section className="min-h-screen flex bg-gradient-to-br from-purple-500 via-pink-400 to-yellow-300">

      {/* ================= MOBILE TOP BAR ================= */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white shadow flex items-center justify-between px-4 py-3">
        <h2 className="font-extrabold text-purple-700">Luxury Dashboard</h2>
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="text-2xl font-bold text-purple-700"
        >
          ☰
        </button>
      </div>

      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside className="hidden md:flex w-72 bg-white/95 shadow-xl flex-col justify-between p-6">
        <div>
          <h2 className="text-2xl font-extrabold text-purple-700 mb-6">
            Luxury Dashboard
          </h2>

          <div className="mb-6">
            <p className="font-bold">{user.name}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>

          <nav className="space-y-3">
            <SidebarButton icon={<FaHome />} onClick={() => navigate("/")}>
              Home
            </SidebarButton>
            <SidebarButton icon={<FaCar />} active>
              Book a Car
            </SidebarButton>
            <SidebarButton icon={<FaHistory />}>
              Booking History
            </SidebarButton>
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 py-3 rounded-xl bg-red-500 text-white font-bold hover:bg-red-400"
        >
          <FaSignOutAlt /> Logout
        </button>
      </aside>

      {/* ================= MOBILE SIDEBAR ================= */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ y: -300, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -300, opacity: 0 }}
            className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white shadow-2xl p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-extrabold text-purple-700">
                Luxury Dashboard
              </h2>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-500 hover:text-red-500"
              >
                <FaTimes />
              </button>
            </div>

            <div className="mb-4">
              <p className="font-bold">{user.name}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>

            <nav className="space-y-3">
              <SidebarButton
                icon={<FaHome />}
                onClick={() => {
                  navigate("/");
                  setMobileMenuOpen(false);
                }}
              >
                Home
              </SidebarButton>
              <SidebarButton icon={<FaCar />} active>
                Book a Car
              </SidebarButton>
              <SidebarButton icon={<FaHistory />}>
                Booking History
              </SidebarButton>
            </nav>

            <button
              onClick={handleLogout}
              className="mt-6 w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-red-500 text-white font-bold hover:bg-red-400"
            >
              <FaSignOutAlt /> Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1 p-8 pt-24 md:pt-8 overflow-y-auto">
        <h1 className="text-4xl font-extrabold text-white mb-8">
          Select Your Luxury Ride
        </h1>

        <div className="grid md:grid-cols-3 gap-8">
          {cars.map((car) => (
            <motion.div
              key={car.reg}
              whileHover={{ scale: 1.05 }}
              onClick={() => setSelectedCar(car)}
              className="cursor-pointer rounded-3xl overflow-hidden shadow-xl bg-white"
            >
              <img src={car.image} alt={car.name} className="h-48 w-full object-cover" />
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
      </main>

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
                <input type="date" name="pickUpDate" required onChange={handleChange} className="form-input" />
              </Input>

              <Input label="Pick-up Location" icon={<FaMapMarkerAlt />}>
                <input name="pickUpLocation" required onChange={handleChange} className="form-input" />
              </Input>

              <Input label="Cell Phone Number" icon={<FaPhone />}>
                <input type="tel" name="clientPhone" required onChange={handleChange} className="form-input" />
              </Input>

              <button className="w-full py-3 rounded-xl bg-purple-600 text-white font-bold">
                Confirm Booking
              </button>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

/* ================= COMPONENTS ================= */

const SidebarButton = ({ icon, children, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-3 p-3 rounded-xl w-full transition ${
      active ? "bg-purple-200 font-bold" : "hover:bg-purple-100"
    }`}
  >
    {icon} {children}
  </button>
);

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
