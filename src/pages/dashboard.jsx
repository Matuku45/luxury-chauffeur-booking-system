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
  FaSuitcase
} from "react-icons/fa";

/* ================= GLOBAL STORAGE KEYS ================= */
const CAR_STORAGE_KEY = "cars";
const BOOKINGS_KEY = "luxury_chauffeur_bookings";

/* ================= DASHBOARD ================= */
const Dashboard = () => {
  /* ================= CARS ================= */
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

  /* ================= BOOKINGS ================= */
  const [bookings, setBookings] = useState([]);

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    setCars(JSON.parse(localStorage.getItem(CAR_STORAGE_KEY)) || []);
    setBookings(JSON.parse(localStorage.getItem(BOOKINGS_KEY)) || []);
  }, []);

  /* ================= SAVE CARS ================= */
  useEffect(() => {
    localStorage.setItem(CAR_STORAGE_KEY, JSON.stringify(cars));
  }, [cars]);

  /* ================= CAR HANDLERS ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCar((p) => ({ ...p, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () =>
      setNewCar((p) => ({ ...p, image: reader.result }));
    reader.readAsDataURL(file);
  };

  const handleSaveCar = (e) => {
    e.preventDefault();
    if (isEditing) {
      setCars((p) => p.map((c) => (c.id === newCar.id ? newCar : c)));
    } else {
      setCars((p) => [...p, { ...newCar, id: Date.now() }]);
    }
    resetForm();
  };

  const handleDeleteCar = (id) =>
    setCars((p) => p.filter((c) => c.id !== id));

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

  /* ================= BOOKING DELETE ================= */
  const deleteBooking = (id) => {
    const updated = bookings.filter((b) => b.id !== id);
    setBookings(updated);
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(updated));
  };

  /* ================= STATS ================= */
  const avgPrice =
    cars.length > 0
      ? Math.round(
          cars.reduce((s, c) => s + Number(c.price || 0), 0) / cars.length
        )
      : 0;

  /* ================= UI ================= */
  return (
    <section className="min-h-screen p-6 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">

      {/* ===== HEADER ===== */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-extrabold">Admin Dashboard</h1>
          <p className="text-gray-600">Fleet & Booking Management</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-3 rounded-2xl shadow-lg hover:scale-105 transition"
        >
          <FaPlus /> Add Car
        </button>
      </div>

      {/* ===== STATS ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
        <StatCard icon={<FaCar />} title="Total Vehicles" value={cars.length} />
        <StatCard icon={<FaMoneyBillWave />} title="Avg Price / Day" value={`R${avgPrice}`} />
        <StatCard icon={<FaLayerGroup />} title="Total Bookings" value={bookings.length} />
      </div>

      {/* ================= FLEET TABLE ================= */}
      <TableCard title="Fleet Overview">
        <FleetTable cars={cars} onEdit={handleEdit} onDelete={handleDeleteCar} />
      </TableCard>

      {/* ================= BOOKINGS TABLE ================= */}
      <TableCard title="Bookings Overview">
        <BookingsTable bookings={bookings} onDelete={deleteBooking} />
      </TableCard>

      {/* ================= MODAL ================= */}
      <AnimatePresence>
        {showModal && (
          <Modal
            onClose={resetForm}
            onSubmit={handleSaveCar}
            newCar={newCar}
            handleChange={handleChange}
            handleImageUpload={handleImageUpload}
            isEditing={isEditing}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

/* ================= SUB COMPONENTS ================= */

const TableCard = ({ title, children }) => (
  <div className="bg-white rounded-3xl shadow-2xl p-6 mb-12">
    <h2 className="text-2xl font-bold mb-4">{title}</h2>
    {children}
  </div>
);

const FleetTable = ({ cars, onEdit, onDelete }) => (
  <table className="w-full">
    <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
      <tr>
        <th className="p-3">Car</th>
        <th className="p-3">Reg</th>
        <th className="p-3">Seats</th>
        <th className="p-3">Price</th>
        <th className="p-3">Image</th>
        <th className="p-3">Actions</th>
      </tr>
    </thead>
    <tbody>
      {cars.map((c) => (
        <tr key={c.id} className="border-b hover:bg-indigo-50">
          <td className="p-3 font-semibold">{c.name}</td>
          <td className="p-3">{c.reg}</td>
          <td className="p-3">{c.seats}</td>
          <td className="p-3 text-green-600 font-bold">R{c.price}</td>
          <td className="p-3">
            {c.image && <img src={c.image} className="w-24 h-14 rounded-xl object-cover" />}
          </td>
          <td className="p-3 flex gap-3">
            <FaEdit className="cursor-pointer text-indigo-600" onClick={() => onEdit(c)} />
            <FaTrash className="cursor-pointer text-red-600" onClick={() => onDelete(c.id)} />
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

const BookingsTable = ({ bookings, onDelete }) => (
  <table className="w-full">
    <thead className="bg-gradient-to-r from-pink-600 to-purple-600 text-white">
      <tr>
        <th className="p-3">Car</th>
        <th className="p-3">Date</th>
        <th className="p-3">Route</th>
        <th className="p-3">Reason</th>
        <th className="p-3">Phone</th>
        <th className="p-3">Price</th>
        <th className="p-3">Action</th>
      </tr>
    </thead>
    <tbody>
      {bookings.map((b) => (
        <tr key={b.id} className="border-b hover:bg-pink-50">
          <td className="p-3 font-semibold">{b.carName}</td>
          <td className="p-3 flex items-center gap-2"><FaCalendarAlt />{b.pickUpDate}</td>
          <td className="p-3">
            <FaMapMarkerAlt className="inline text-green-500" /> {b.pickUpLocation}<br/>
            <FaMapMarkerAlt className="inline text-red-500" /> {b.finalLocation}
          </td>
          <td className="p-3 flex items-center gap-2"><FaSuitcase />{b.bookingReason}</td>
          <td className="p-3 flex items-center gap-2"><FaPhone />{b.clientPhone}</td>
          <td className="p-3 text-amber-600 font-bold">R{b.pricePerDay}</td>
          <td className="p-3">
            <FaTrash onClick={() => onDelete(b.id)} className="text-red-600 cursor-pointer" />
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

const Modal = ({ onClose, onSubmit, newCar, handleChange, handleImageUpload, isEditing }) => (
  <motion.div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <motion.form
      onSubmit={onSubmit}
      className="bg-white p-6 rounded-3xl w-full max-w-lg"
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
    >
      <div className="flex justify-between mb-4">
        <h3 className="text-xl font-bold">{isEditing ? "Edit Car" : "Add Car"}</h3>
        <FaTimes className="cursor-pointer" onClick={onClose} />
      </div>

      <input className="input" name="name" value={newCar.name} onChange={handleChange} placeholder="Car Name" />
      <input className="input" name="reg" value={newCar.reg} onChange={handleChange} placeholder="Registration" />
      <input className="input" type="number" name="seats" value={newCar.seats} onChange={handleChange} />
      <input className="input" type="number" name="price" value={newCar.price} onChange={handleChange} placeholder="Price" />
      <input type="file" onChange={handleImageUpload} />

      {newCar.image && <img src={newCar.image} className="mt-3 rounded-xl h-32 object-cover" />}

      <button className="w-full mt-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl">
        {isEditing ? "Update Car" : "Save Car"}
      </button>
    </motion.form>
  </motion.div>
);

const StatCard = ({ icon, title, value }) => (
  <motion.div whileHover={{ scale: 1.05 }} className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 rounded-3xl shadow-xl">
    <div className="text-2xl">{icon}</div>
    <p className="mt-3 text-sm uppercase opacity-80">{title}</p>
    <p className="text-3xl font-bold">{value}</p>
  </motion.div>
);

export default Dashboard;
