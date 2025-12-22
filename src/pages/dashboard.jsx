import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FaCar, FaDollarSign, FaClipboardList, FaCheckCircle, FaTimesCircle, FaHourglassHalf, FaPlus, FaTimes } from "react-icons/fa";

const Dashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [cars, setCars] = useState([]);
  const [showAddCar, setShowAddCar] = useState(false);
  const [newCar, setNewCar] = useState({ name: "", reg: "", seats: 4, image: "" });

  useEffect(() => {
    fetchBookings();
    fetchPayments();
    fetchCars();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/bookings");
      setBookings(res.data);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    }
  };

  const fetchPayments = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/payments");
      setPayments(res.data);
    } catch (err) {
      console.error("Error fetching payments:", err);
    }
  };

  const fetchCars = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/cars");
      setCars(res.data);
    } catch (err) {
      console.error("Error fetching cars:", err);
    }
  };

  const handleAddCarChange = (e) => {
    const { name, value } = e.target;
    setNewCar(prev => ({ ...prev, [name]: value }));
  };

  const handleAddCarSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/cars", newCar);
      setCars(prev => [...prev, res.data.car]);
      setNewCar({ name: "", reg: "", seats: 4, image: "" });
      setShowAddCar(false);
      alert("Car added successfully!");
    } catch (err) {
      console.error("Error adding car:", err);
      alert("Failed to add car. Try again.");
    }
  };

  const totalRevenue = payments.reduce((sum, p) => (p.status === "Paid" ? sum + p.amount : sum), 0);
  const totalBookings = bookings.length;
  const pendingPayments = payments.filter(p => p.status === "Pending").length;

  const getStatusBadge = (status) => {
    switch (status) {
      case "Confirmed":
      case "Paid":
        return <span className="text-green-600 font-semibold flex items-center"><FaCheckCircle className="mr-1"/> {status}</span>;
      case "Pending":
        return <span className="text-yellow-600 font-semibold flex items-center"><FaHourglassHalf className="mr-1"/> {status}</span>;
      case "Cancelled":
      case "Declined":
      case "Refunded":
        return <span className="text-red-600 font-semibold flex items-center"><FaTimesCircle className="mr-1"/> {status}</span>;
      default:
        return status;
    }
  };

  return (
    <section className="min-h-screen p-4 md:p-8 bg-gray-50">
      <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-6 text-center md:text-left">Admin Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
        <motion.div whileHover={{ scale: 1.05 }} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-3xl shadow-lg flex flex-col items-center">
          <FaClipboardList size={36} className="mb-2" />
          <p className="text-lg font-semibold">Total Bookings</p>
          <p className="text-2xl font-bold">{totalBookings}</p>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} className="bg-gradient-to-r from-green-500 to-teal-500 text-white p-6 rounded-3xl shadow-lg flex flex-col items-center">
          <FaDollarSign size={36} className="mb-2" />
          <p className="text-lg font-semibold">Total Revenue</p>
          <p className="text-2xl font-bold">${totalRevenue}</p>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white p-6 rounded-3xl shadow-lg flex flex-col items-center">
          <FaHourglassHalf size={36} className="mb-2" />
          <p className="text-lg font-semibold">Pending Payments</p>
          <p className="text-2xl font-bold">{pendingPayments}</p>
        </motion.div>
      </div>

      {/* Add Car Button */}
      <div className="mb-6 flex justify-end">
        <button
          onClick={() => setShowAddCar(prev => !prev)}
          className="flex items-center gap-2 bg-purple-500 text-white px-4 py-2 rounded-xl hover:bg-purple-400 transition"
        >
          {showAddCar ? <FaTimes /> : <FaPlus />}
          {showAddCar ? "Cancel" : "Add Car"}
        </button>
      </div>

      {/* Add Car Form */}
      {showAddCar && (
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          onSubmit={handleAddCarSubmit}
          className="bg-white p-6 rounded-3xl shadow-lg mb-8 grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div>
            <label className="block font-semibold mb-1">Car Name</label>
            <input type="text" name="name" value={newCar.name} onChange={handleAddCarChange} className="form-input w-full"/>
          </div>
          <div>
            <label className="block font-semibold mb-1">Registration Number</label>
            <input type="text" name="reg" value={newCar.reg} onChange={handleAddCarChange} className="form-input w-full"/>
          </div>
          <div>
            <label className="block font-semibold mb-1">Seats</label>
            <input type="number" name="seats" min={1} value={newCar.seats} onChange={handleAddCarChange} className="form-input w-full"/>
          </div>
          <div>
            <label className="block font-semibold mb-1">Image URL</label>
            <input type="text" name="image" value={newCar.image} onChange={handleAddCarChange} className="form-input w-full"/>
          </div>
          <div className="md:col-span-2 flex justify-end">
            <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600 transition">Add Car</button>
          </div>
        </motion.form>
      )}

      {/* Cars Table */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Cars Overview</h2>
        <div className="overflow-x-auto bg-white rounded-3xl shadow-lg p-4">
          <table className="min-w-full text-left text-sm md:text-base">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="py-2 px-4">Name</th>
                <th className="py-2 px-4">Reg Number</th>
                <th className="py-2 px-4">Seats</th>
                <th className="py-2 px-4">Image</th>
              </tr>
            </thead>
            <tbody>
              {cars.map(car => (
                <motion.tr key={car.id} whileHover={{ scale: 1.02 }} className="border-b hover:bg-gray-50 transition">
                  <td className="py-2 px-4">{car.name}</td>
                  <td className="py-2 px-4">{car.reg}</td>
                  <td className="py-2 px-4">{car.seats}</td>
                  <td className="py-2 px-4">
                    {car.image && <img src={car.image} alt={car.name} className="w-20 h-12 object-cover rounded" />}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Bookings Overview</h2>
        <div className="overflow-x-auto bg-white rounded-3xl shadow-lg p-4">
          <table className="min-w-full text-left text-sm md:text-base">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="py-2 px-4">Client Name</th>
                <th className="py-2 px-4">Car</th>
                <th className="py-2 px-4">Reg Number</th>
                <th className="py-2 px-4">Purpose</th>
                <th className="py-2 px-4">Pick-Up Date</th>
                <th className="py-2 px-4">Status</th>
                <th className="py-2 px-4">Confirmed</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(booking => (
                <motion.tr key={booking.id} whileHover={{ scale: 1.02 }} className="border-b hover:bg-gray-50 transition cursor-pointer">
                  <td className="py-2 px-4">{booking.clientName}</td>
                  <td className="py-2 px-4">{booking.carName}</td>
                  <td className="py-2 px-4">{booking.carRegNumber}</td>
                  <td className="py-2 px-4">{booking.purpose}</td>
                  <td className="py-2 px-4">{booking.pickUpDate}</td>
                  <td className="py-2 px-4">{getStatusBadge(booking.status)}</td>
                  <td className="py-2 px-4">{booking.confirmed ? "✅" : "❌"}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payments Table */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Payments Overview</h2>
        <div className="overflow-x-auto bg-white rounded-3xl shadow-lg p-4">
          <table className="min-w-full text-left text-sm md:text-base">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="py-2 px-4">User</th>
                <th className="py-2 px-4">Booking ID</th>
                <th className="py-2 px-4">Amount</th>
                <th className="py-2 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map(payment => (
                <motion.tr key={payment.id} whileHover={{ scale: 1.02 }} className="border-b hover:bg-green-50 transition cursor-pointer">
                  <td className="py-2 px-4">{payment.user}</td>
                  <td className="py-2 px-4">{payment.bookingId}</td>
                  <td className="py-2 px-4">${payment.amount}</td>
                  <td className="py-2 px-4">{getStatusBadge(payment.status)}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
