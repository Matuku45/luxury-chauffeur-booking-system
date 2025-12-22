import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FaCar, FaDollarSign, FaClipboardList, FaCheckCircle, FaTimesCircle, FaHourglassHalf } from "react-icons/fa";

const Dashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    // Fetch bookings from backend
    const fetchBookings = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/bookings");
        setBookings(res.data);
      } catch (err) {
        console.error("Error fetching bookings:", err);
      }
    };

    // Fetch payments from backend (dummy for now)
    const fetchPayments = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/payments"); // Create /api/payments route or use dummy
        setPayments(res.data);
      } catch (err) {
        console.error("Error fetching payments:", err);
      }
    };

    fetchBookings();
    fetchPayments();
  }, []);

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
