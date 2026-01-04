import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCar,
  FaMoneyBillWave,
  FaLayerGroup,
  FaPlus,
  FaTimes
} from "react-icons/fa";

const Dashboard = () => {
  const [cars, setCars] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newCar, setNewCar] = useState({
    name: "",
    reg: "",
    seats: 4,
    price: "",
    image: ""
  });

  /* ---------------- LOAD FROM LOCAL STORAGE ---------------- */
  useEffect(() => {
    const storedCars = JSON.parse(localStorage.getItem("cars")) || [];
    setCars(storedCars);
  }, []);

  /* ---------------- SAVE TO LOCAL STORAGE ---------------- */
  useEffect(() => {
    localStorage.setItem("cars", JSON.stringify(cars));
  }, [cars]);

  /* ---------------- HANDLE INPUT ---------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCar(prev => ({ ...prev, [name]: value }));
  };

  /* ---------------- HANDLE IMAGE UPLOAD ---------------- */
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setNewCar(prev => ({ ...prev, image: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  /* ---------------- ADD CAR ---------------- */
  const handleAddCar = (e) => {
    e.preventDefault();

    const carToAdd = {
      id: Date.now(),
      ...newCar
    };

    setCars(prev => [...prev, carToAdd]);
    setShowModal(false);
    setNewCar({ name: "", reg: "", seats: 4, price: "", image: "" });
  };

  const totalCars = cars.length;
  const avgPrice =
    cars.length > 0
      ? Math.round(
          cars.reduce((sum, c) => sum + Number(c.price || 0), 0) / cars.length
        )
      : 0;

  return (
    <section className="min-h-screen p-6 md:p-10 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">Luxury Chauffeur Fleet Management</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-3 rounded-2xl shadow-lg hover:scale-105 transition"
        >
          <FaPlus /> Add Car
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
        <StatCard icon={<FaCar />} title="Total Vehicles" value={totalCars} />
        <StatCard icon={<FaMoneyBillWave />} title="Avg Price / Day" value={`R${avgPrice}`} />
        <StatCard icon={<FaLayerGroup />} title="Fleet Type" value="Luxury & Executive" />
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-3xl shadow-2xl p-6">
        <h2 className="text-2xl font-bold mb-4">Fleet Overview</h2>

        <table className="w-full">
          <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
            <tr>
              <th className="p-3 text-left">Car</th>
              <th className="p-3 text-left">Reg</th>
              <th className="p-3 text-left">Seats</th>
              <th className="p-3 text-left">Price</th>
              <th className="p-3 text-left">Image</th>
            </tr>
          </thead>
          <tbody>
            {cars.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-10 text-gray-400">
                  No vehicles added yet
                </td>
              </tr>
            ) : (
              cars.map(car => (
                <tr key={car.id} className="border-b hover:bg-indigo-50">
                  <td className="p-3 font-semibold">{car.name}</td>
                  <td className="p-3">{car.reg}</td>
                  <td className="p-3">{car.seats}</td>
                  <td className="p-3 font-semibold text-green-600">R{car.price}</td>
                  <td className="p-3">
                    {car.image && (
                      <img src={car.image} className="w-24 h-14 rounded-xl object-cover shadow" />
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ADD CAR MODAL */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.form
              onSubmit={handleAddCar}
              className="bg-white p-6 rounded-3xl shadow-2xl w-full max-w-lg"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Add New Car</h3>
                <FaTimes className="cursor-pointer" onClick={() => setShowModal(false)} />
              </div>

              <input className="input" placeholder="Car Name" name="name" onChange={handleChange} required />
              <input className="input" placeholder="Registration" name="reg" onChange={handleChange} required />
              <input className="input" type="number" placeholder="Seats" name="seats" onChange={handleChange} />
              <input className="input" type="number" placeholder="Price per day" name="price" onChange={handleChange} required />

              <input type="file" accept="image/*" onChange={handleImageUpload} />

              {newCar.image && (
                <img src={newCar.image} className="mt-3 rounded-xl h-32 object-cover" />
              )}

              <button className="w-full mt-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl">
                Save Car
              </button>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

/* ---------- SMALL COMPONENT ---------- */
const StatCard = ({ icon, title, value }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 rounded-3xl shadow-xl"
  >
    <div className="text-2xl">{icon}</div>
    <p className="mt-3 text-sm uppercase opacity-80">{title}</p>
    <p className="text-3xl font-bold">{value}</p>
  </motion.div>
);

export default Dashboard;
