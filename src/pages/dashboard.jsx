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
  FaDownload,
  FaIdCard,
  FaUser,
} from "react-icons/fa";

const FIREBASE_URL = "https://roomap-aa517-default-rtdb.firebaseio.com/";

/* ================= DOWNLOAD BOOKINGS ================= */
const downloadBookings = (bookings) => {
  if (!bookings.length) return alert("No bookings available.");

  const headers = [
    "Booking ID",
    "First Name",
    "Last Name",
    "Car",
    "Car Reg",
    "Pickup Date",
    "Pickup Location",
    "Final Location",
    "Reason",
    "Phone",
    "Price",
    "Created",
  ];

  const rows = bookings.map((b) => [
    b.id,
    b.firstName,
    b.lastName,
    b.carName,
    b.carRegNumber,
    b.pickUpDate,
    b.pickUpLocation,
    b.finalLocation,
    b.bookingReason,
    b.clientPhone,
    `R${b.pricePerDay}`,
    new Date(b.createdAt).toLocaleString(),
  ]);

  const csv = [
    headers.join(","),
    ...rows.map((r) =>
      r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")
    ),
  ].join("\n");

  const blob = new Blob([csv], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `Bookings_${new Date().toISOString().split("T")[0]}.csv`;
  link.click();
};

/* ================= DASHBOARD ================= */
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

  /* ================= FETCH CARS & BOOKINGS ================= */
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const res = await fetch(`${FIREBASE_URL}cars.json`);
        const data = await res.json() || {};
        const carsArr = Object.entries(data).map(([id, car]) => ({ id, ...car }));
        setCars(carsArr);
      } catch (err) {
        console.error("Failed to fetch cars:", err);
      }
    };

    const fetchBookings = async () => {
      try {
        const res = await fetch(`${FIREBASE_URL}bookings.json`);
        const data = await res.json() || {};
        const bookingsArr = Object.entries(data).map(([id, b]) => ({ id, ...b }));
        setBookings(bookingsArr);
      } catch (err) {
        console.error("Failed to fetch bookings:", err);
      }
    };

    fetchCars();
    fetchBookings();
  }, []);

  /* ================= SAVE CAR ================= */
  const saveCar = async (e) => {
    e.preventDefault();

    try {
      if (isEditing) {
        // Update existing car
        await fetch(`${FIREBASE_URL}cars/${newCar.id}.json`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newCar),
        });
        setCars((p) => p.map((c) => (c.id === newCar.id ? newCar : c)));
      } else {
        // Add new car
        const res = await fetch(`${FIREBASE_URL}cars.json`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newCar),
        });
        const result = await res.json();
        setCars((p) => [...p, { ...newCar, id: result.name }]);
      }

      closeModal();
    } catch (err) {
      console.error("Failed to save car:", err);
      alert("Failed to save car.");
    }
  };

  const deleteCar = async (id) => {
    if (!window.confirm("Delete this car?")) return;
    try {
      await fetch(`${FIREBASE_URL}cars/${id}.json`, { method: "DELETE" });
      setCars((p) => p.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Failed to delete car:", err);
    }
  };

  const deleteBooking = async (id) => {
    if (!window.confirm("Delete this booking?")) return;
    try {
      await fetch(`${FIREBASE_URL}bookings/${id}.json`, { method: "DELETE" });
      setBookings((p) => p.filter((b) => b.id !== id));
    } catch (err) {
      console.error("Failed to delete booking:", err);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setIsEditing(false);
    setNewCar({ id: null, name: "", reg: "", seats: 4, price: "", image: "" });
  };

  const avgPrice =
    cars.length > 0
      ? Math.round(cars.reduce((s, c) => s + Number(c.price || 0), 0) / cars.length)
      : 0;

  return (
    <section className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold">Admin Dashboard</h1>
          <p className="text-gray-600">Fleet & Booking Management</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <button onClick={() => setShowModal(true)} className="btn-primary">
            <FaPlus /> Add Car
          </button>
          <button onClick={() => downloadBookings(bookings)} className="btn-success">
            <FaDownload /> Download bookings
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <StatCard icon={<FaCar />} title="Vehicles" value={cars.length} />
        <StatCard icon={<FaMoneyBillWave />} title="Avg Price / Day" value={`R${avgPrice}`} />
        <StatCard icon={<FaLayerGroup />} title="Bookings" value={bookings.length} />
      </div>

      {/* FLEET */}
      <Section title="Fleet Overview">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cars.map((c) => (
            <Card key={c.id}>
              <img src={c.image} className="h-40 w-full rounded-xl object-cover mb-4" />
              <Field label="Car Name" value={c.name} />
              <Field label="Registration" value={c.reg} />
              <Field label="Seats" value={c.seats} />
              <Field label="Price / Day" value={`R${c.price}`} />
              <div className="flex justify-end gap-4 mt-4">
                <FaEdit
                  className="text-indigo-600 cursor-pointer"
                  onClick={() => {
                    setNewCar(c);
                    setIsEditing(true);
                    setShowModal(true);
                  }}
                />
                <FaTrash className="text-red-600 cursor-pointer" onClick={() => deleteCar(c.id)} />
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* BOOKINGS */}
      <Section title="Bookings Overview">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {bookings.map((b) => (
            <Card key={b.id}>
              <Field label="Client Name" value={`${b.firstName} ${b.lastName}`} icon={<FaUser />} />
              <Field label="Car" value={b.carName} icon={<FaCar />} />
              <Field label="Car Registration" value={b.carRegNumber} icon={<FaIdCard />} />
              <Field label="Pickup Date" value={b.pickUpDate} icon={<FaCalendarAlt />} />
              <Field label="Pickup Location" value={b.pickUpLocation} icon={<FaMapMarkerAlt />} />
              <Field label="Final Location" value={b.finalLocation} icon={<FaMapMarkerAlt />} />
              <Field label="Reason" value={b.bookingReason} icon={<FaSuitcase />} />
              <Field label="Phone" value={b.clientPhone} icon={<FaPhone />} />
              <Field label="Price" value={`R${Number(b.pricePerDay).toLocaleString()}`} />
              <div className="flex justify-end mt-4">
                <FaTrash className="text-red-600 cursor-pointer" onClick={() => deleteBooking(b.id)} />
              </div>
            </Card>
          ))}
        </div>
      </Section>

      <AnimatePresence>
        {showModal && (
          <Modal
            onClose={closeModal}
            onSubmit={saveCar}
            car={newCar}
            onChange={(e) => setNewCar((p) => ({ ...p, [e.target.name]: e.target.value }))}
            onImage={(e) => {
              const f = e.target.files[0];
              const reader = new FileReader();
              reader.onload = () => setNewCar((p) => ({ ...p, image: reader.result }));
              reader.readAsDataURL(f);
            }}
            isEditing={isEditing}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

/* ================= SMALL COMPONENTS ================= */
const Section = ({ title, children }) => (
  <div className="bg-white rounded-3xl shadow-xl p-6 mb-12">
    <h2 className="text-2xl font-bold mb-6">{title}</h2>
    {children}
  </div>
);

const Card = ({ children }) => (
  <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl shadow-lg p-5 space-y-2">{children}</div>
);

const Field = ({ label, value, icon }) => (
  <div className="flex flex-col">
    <span className="text-xs uppercase text-gray-500 flex items-center gap-2">{icon} {label}</span>
    <span className="font-semibold text-gray-800">{value}</span>
  </div>
);

const Modal = ({ onClose, onSubmit, car, onChange, onImage, isEditing }) => (
  <motion.div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <motion.form
      onSubmit={onSubmit}
      className="bg-white p-6 rounded-3xl w-full max-w-md"
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
    >
      <div className="flex justify-between mb-4">
        <h3 className="font-bold">{isEditing ? "Edit Car" : "Add Car"}</h3>
        <FaTimes onClick={onClose} className="cursor-pointer" />
      </div>

      <input className="input" name="name" value={car.name} onChange={onChange} placeholder="Car Name" />
      <input className="input" name="reg" value={car.reg} onChange={onChange} placeholder="Registration" />
      <input className="input" type="number" name="seats" value={car.seats} onChange={onChange} />
      <input className="input" type="number" name="price" value={car.price} onChange={onChange} placeholder="Price" />
      <input type="file" onChange={onImage} />

      {car.image && <img src={car.image} className="mt-3 h-32 rounded-xl object-cover" />}
      <button className="btn-primary w-full mt-4">{isEditing ? "Update Car" : "Save Car"}</button>
    </motion.form>
  </motion.div>
);

const StatCard = ({ icon, title, value }) => (
  <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-3xl shadow-xl">
    <div className="text-2xl">{icon}</div>
    <p className="text-sm opacity-80 mt-2">{title}</p>
    <p className="text-3xl font-bold">{value}</p>
  </div>
);

export default Dashboard;