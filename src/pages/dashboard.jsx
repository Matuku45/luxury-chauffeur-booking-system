import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCar,
  FaMoneyBillWave,
  FaLayerGroup,
  FaPlus,
  FaTimes,
  FaTrash,
  FaEdit,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaPhone,
  FaSuitcase,
} from "react-icons/fa";

/* ================= STORAGE KEYS ================= */
const CAR_STORAGE_KEY = "cars";
const BOOKINGS_KEY = "luxury_chauffeur_bookings";

/* ================= DASHBOARD PAGE ================= */
const Dashboard = () => {
  const [cars, setCars] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [newCar, setNewCar] = useState({
    id: null,
    name: "",
    reg: "",
    seats: 4,
    price: "",
    image: "",
  });

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    setCars(JSON.parse(localStorage.getItem(CAR_STORAGE_KEY)) || []);
    setBookings(JSON.parse(localStorage.getItem(BOOKINGS_KEY)) || []);
  }, []);

  /* ================= SAVE CARS ================= */
  useEffect(() => {
    localStorage.setItem(CAR_STORAGE_KEY, JSON.stringify(cars));
  }, [cars]);

  /* ================= CAR LOGIC ================= */
  const handleChange = (e) =>
    setNewCar((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () =>
      setNewCar((p) => ({ ...p, image: reader.result }));
    reader.readAsDataURL(file);
  };

  const saveCar = (e) => {
    e.preventDefault();
    setCars((p) =>
      isEditing
        ? p.map((c) => (c.id === newCar.id ? newCar : c))
        : [...p, { ...newCar, id: Date.now() }]
    );
    closeModal();
  };

  const editCar = (car) => {
    setNewCar(car);
    setIsEditing(true);
    setShowModal(true);
  };

  const deleteCar = (id) =>
    setCars((p) => p.filter((c) => c.id !== id));

  const deleteBooking = (id) => {
    const updated = bookings.filter((b) => b.id !== id);
    setBookings(updated);
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(updated));
  };

  const closeModal = () => {
    setShowModal(false);
    setIsEditing(false);
    setNewCar({
      id: null,
      name: "",
      reg: "",
      seats: 4,
      price: "",
      image: "",
    });
  };

  const avgPrice =
    cars.length > 0
      ? Math.round(
          cars.reduce((s, c) => s + Number(c.price || 0), 0) / cars.length
        )
      : 0;

  /* ================= UI ================= */
  return (
    <section className="min-h-screen p-8 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">Fleet & Booking Management</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-2xl shadow-lg hover:scale-105 transition"
        >
          <FaPlus /> Add Car
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <StatCard icon={<FaCar />} title="Vehicles" value={cars.length} />
        <StatCard
          icon={<FaMoneyBillWave />}
          title="Avg Price / Day"
          value={`R${avgPrice}`}
        />
        <StatCard
          icon={<FaLayerGroup />}
          title="Bookings"
          value={bookings.length}
        />
      </div>

      {/* FLEET */}
      <Card title="Fleet Overview">
        <FleetTable cars={cars} onEdit={editCar} onDelete={deleteCar} />
      </Card>

      {/* BOOKINGS */}
      <Card title="Bookings Overview">
        <BookingsTable bookings={bookings} onDelete={deleteBooking} />
      </Card>

      {/* MODAL */}
      <AnimatePresence>
        {showModal && (
          <Modal
            onClose={closeModal}
            onSubmit={saveCar}
            car={newCar}
            onChange={handleChange}
            onImage={handleImageUpload}
            isEditing={isEditing}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

/* ================= COMPONENTS ================= */

const Card = ({ title, children }) => (
  <div className="bg-white rounded-3xl shadow-2xl p-6 mb-12">
    <h2 className="text-2xl font-bold mb-6">{title}</h2>
    {children}
  </div>
);

/* ---------- FLEET TABLE ---------- */
const FleetTable = ({ cars, onEdit, onDelete }) => (
  <table className="w-full text-sm">
    <thead className="bg-indigo-600 text-white">
      <tr>
        <th className="p-4 text-left">Car</th>
        <th className="p-4 text-left">Reg</th>
        <th className="p-4 text-left">Seats</th>
        <th className="p-4 text-left">Price</th>
        <th className="p-4 text-left">Image</th>
        <th className="p-4 text-center">Actions</th>
      </tr>
    </thead>
    <tbody>
      {cars.map((c) => (
        <tr key={c.id} className="border-b hover:bg-indigo-50">
          <td className="p-4 font-semibold">{c.name}</td>
          <td className="p-4">{c.reg}</td>
          <td className="p-4">{c.seats}</td>
          <td className="p-4 font-bold text-green-600">R{c.price}</td>
          <td className="p-4">
            {c.image && (
              <img
                src={c.image}
                className="w-24 h-14 rounded-xl object-cover"
              />
            )}
          </td>
          <td className="p-4 flex justify-center gap-4">
            <FaEdit
              onClick={() => onEdit(c)}
              className="cursor-pointer text-indigo-600"
            />
            <FaTrash
              onClick={() => onDelete(c.id)}
              className="cursor-pointer text-red-600"
            />
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

/* ---------- BOOKINGS TABLE (ALIGNED) ---------- */
const BookingsTable = ({ bookings, onDelete }) => (
  <table className="w-full text-sm">
    <thead className="bg-pink-600 text-white">
      <tr>
        <th className="p-4 text-left">Car</th>
        <th className="p-4 text-left">Date</th>
        <th className="p-4 text-left">Route</th>
        <th className="p-4 text-left">Reason</th>
        <th className="p-4 text-left">Phone</th>
        <th className="p-4 text-left">Price</th>
        <th className="p-4 text-center">Action</th>
      </tr>
    </thead>
    <tbody>
      {bookings.map((b) => (
        <tr key={b.id} className="border-b hover:bg-pink-50">
          <td className="p-4 font-semibold">{b.carName}</td>

          <td className="p-4">
            <div className="flex items-center gap-2">
              <FaCalendarAlt />
              {b.pickUpDate}
            </div>
          </td>

          <td className="p-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-green-600">
                <FaMapMarkerAlt />
                {b.pickUpLocation}
              </div>
              <div className="flex items-center gap-2 text-red-600">
                <FaMapMarkerAlt />
                {b.finalLocation}
              </div>
            </div>
          </td>

          <td className="p-4">
            <div className="flex items-center gap-2">
              <FaSuitcase />
              {b.bookingReason}
            </div>
          </td>

          <td className="p-4">
            <div className="flex items-center gap-2">
              <FaPhone />
              {b.clientPhone}
            </div>
          </td>

          <td className="p-4 font-bold text-amber-600">
            R{Number(b.pricePerDay).toLocaleString()}
          </td>

          <td className="p-4 text-center">
            <FaTrash
              onClick={() => onDelete(b.id)}
              className="inline cursor-pointer text-red-600 hover:scale-110"
            />
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

/* ---------- MODAL ---------- */
const Modal = ({ onClose, onSubmit, car, onChange, onImage, isEditing }) => (
  <motion.div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <motion.form
      onSubmit={onSubmit}
      className="bg-white p-6 rounded-3xl w-full max-w-lg"
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
    >
      <div className="flex justify-between mb-4">
        <h3 className="text-xl font-bold">
          {isEditing ? "Edit Car" : "Add Car"}
        </h3>
        <FaTimes onClick={onClose} className="cursor-pointer" />
      </div>

      <input className="input" name="name" value={car.name} onChange={onChange} placeholder="Car Name" />
      <input className="input" name="reg" value={car.reg} onChange={onChange} placeholder="Registration" />
      <input className="input" type="number" name="seats" value={car.seats} onChange={onChange} />
      <input className="input" type="number" name="price" value={car.price} onChange={onChange} placeholder="Price" />
      <input type="file" onChange={onImage} />

      {car.image && <img src={car.image} className="mt-3 rounded-xl h-32 object-cover" />}

      <button className="w-full mt-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl">
        {isEditing ? "Update Car" : "Save Car"}
      </button>
    </motion.form>
  </motion.div>
);

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
