import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCar,
  FaMoneyBillWave,
  FaLayerGroup,
  FaPlus,
  FaTimes,
  FaTrash,
  FaEdit
} from "react-icons/fa";

/* ---------------- GLOBAL STORAGE KEY ---------------- */
const STORAGE_KEY = "cars";

const Dashboard = () => {
  const [cars, setCars] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [newCar, setNewCar] = useState({
    id: null,
    name: "",
    reg: "",
    seats: 4,
    price: "",
    image: ""
  });

  /* ---------------- LOAD (GLOBAL) ---------------- */
  useEffect(() => {
    const storedCars = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    setCars(storedCars);
  }, []);

  /* ---------------- SAVE (GLOBAL) ---------------- */
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cars));
  }, [cars]);

  /* ---------------- INPUT ---------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCar(prev => ({ ...prev, [name]: value }));
  };

  /* ---------------- IMAGE ---------------- */
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setNewCar(prev => ({ ...prev, image: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  /* ---------------- CREATE / UPDATE ---------------- */
  const handleSaveCar = (e) => {
    e.preventDefault();

    if (isEditing) {
      setCars(prev =>
        prev.map(car => (car.id === newCar.id ? newCar : car))
      );
    } else {
      setCars(prev => [
        ...prev,
        { ...newCar, id: Date.now() }
      ]);
    }

    resetForm();
  };

  /* ---------------- DELETE ---------------- */
  const handleDelete = (id) => {
    setCars(prev => prev.filter(car => car.id !== id));
  };

  /* ---------------- EDIT ---------------- */
  const handleEdit = (car) => {
    setNewCar(car);
    setIsEditing(true);
    setShowModal(true);
  };

  const resetForm = () => {
    setShowModal(false);
    setIsEditing(false);
    setNewCar({
      id: null,
      name: "",
      reg: "",
      seats: 4,
      price: "",
      image: ""
    });
  };

  /* ---------------- STATS ---------------- */
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
          <p className="text-gray-600">
            Luxury Chauffeur Fleet Management
          </p>
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
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {cars.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-10 text-gray-400">
                  No vehicles added yet
                </td>
              </tr>
            ) : (
              cars.map(car => (
                <tr key={car.id} className="border-b hover:bg-indigo-50">
                  <td className="p-3 font-semibold">{car.name}</td>
                  <td className="p-3">{car.reg}</td>
                  <td className="p-3">{car.seats}</td>
                  <td className="p-3 font-semibold text-green-600">
                    R{car.price}
                  </td>
                  <td className="p-3">
                    {car.image && (
                      <img
                        src={car.image}
                        className="w-24 h-14 rounded-xl object-cover shadow"
                        alt=""
                      />
                    )}
                  </td>
                  <td className="p-3 flex gap-3">
                    <button
                      onClick={() => handleEdit(car)}
                      className="text-indigo-600 hover:scale-110"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(car.id)}
                      className="text-red-600 hover:scale-110"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.form
              onSubmit={handleSaveCar}
              className="bg-white p-6 rounded-3xl shadow-2xl w-full max-w-lg"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">
                  {isEditing ? "Edit Car" : "Add New Car"}
                </h3>
                <FaTimes className="cursor-pointer" onClick={resetForm} />
              </div>

              <input className="input" placeholder="Car Name" name="name" value={newCar.name} onChange={handleChange} required />
              <input className="input" placeholder="Registration" name="reg" value={newCar.reg} onChange={handleChange} required />
              <input className="input" type="number" placeholder="Seats" name="seats" value={newCar.seats} onChange={handleChange} />
              <input className="input" type="number" placeholder="Price per day" name="price" value={newCar.price} onChange={handleChange} required />

              <input type="file" accept="image/*" onChange={handleImageUpload} />

              {newCar.image && (
                <img src={newCar.image} className="mt-3 rounded-xl h-32 object-cover" alt="" />
              )}

              <button className="w-full mt-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl">
                {isEditing ? "Update Car" : "Save Car"}
              </button>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

/* ---------- STAT CARD ---------- */
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
