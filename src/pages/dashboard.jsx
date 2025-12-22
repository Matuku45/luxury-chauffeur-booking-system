import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaCar, FaDollarSign, FaClipboardList, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const Dashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);

  // Example data - in real app, fetch from backend API
  useEffect(() => {
    setBookings([
      { id: 1, user: "John Doe", car: "Mercedes S-Class", date: "2025-12-25", status: "Confirmed" },
      { id: 2, user: "Jane Smith", car: "BMW 7 Series", date: "2025-12-28", status: "Pending" },
      { id: 3, user: "Alice Johnson", car: "Audi A8", date: "2026-01-05", status: "Cancelled" },
    ]);

    setPayments([
      { id: 1, user: "John Doe", bookingId: 1, amount: 500, status: "Paid" },
      { id: 2, user: "Jane Smith", bookingId: 2, amount: 400, status: "Pending" },
      { id: 3, user: "Alice Johnson", bookingId: 3, amount: 450, status: "Refunded" },
    ]);
  }, []);

  const totalRevenue = payments.reduce((sum, p) => (p.status === "Paid" ? sum + p.amount : sum), 0);
  const totalBookings = bookings.length;
  const pendingPayments = payments.filter(p => p.status === "Pending").length;

  return (
    <section className="min-h-screen p-6 bg-gradient-to-br from-purple-300 via-pink-200 to-yellow-100">
      <h1 className="text-3xl md:text-4xl font-extrabold text-purple-700 mb-6">Admin Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-r from-purple-400 to-pink-400 text-white p-6 rounded-3xl shadow-lg flex flex-col items-center"
        >
          <FaClipboardList size={36} className="mb-2" />
          <p className="text-lg font-semibold">Total Bookings</p>
          <p className="text-2xl font-bold">{totalBookings}</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-r from-green-400 to-teal-400 text-white p-6 rounded-3xl shadow-lg flex flex-col items-center"
        >
          <FaDollarSign size={36} className="mb-2" />
          <p className="text-lg font-semibold">Total Revenue</p>
          <p className="text-2xl font-bold">${totalRevenue}</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white p-6 rounded-3xl shadow-lg flex flex-col items-center"
        >
          <FaTimesCircle size={36} className="mb-2" />
          <p className="text-lg font-semibold">Pending Payments</p>
          <p className="text-2xl font-bold">{pendingPayments}</p>
        </motion.div>
      </div>

      {/* Bookings Table */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-purple-700 mb-4">All Bookings</h2>
        <div className="overflow-x-auto bg-white rounded-3xl shadow-lg p-4">
          <table className="min-w-full text-left">
            <thead>
              <tr className="border-b-2 border-purple-300">
                <th className="py-2 px-4">User</th>
                <th className="py-2 px-4">Car</th>
                <th className="py-2 px-4">Date</th>
                <th className="py-2 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(booking => (
                <tr key={booking.id} className="border-b hover:bg-purple-50 transition">
                  <td className="py-2 px-4">{booking.user}</td>
                  <td className="py-2 px-4">{booking.car}</td>
                  <td className="py-2 px-4">{booking.date}</td>
                  <td className="py-2 px-4">
                    {booking.status === "Confirmed" && <span className="text-green-600 font-semibold"><FaCheckCircle className="inline mr-1"/> Confirmed</span>}
                    {booking.status === "Pending" && <span className="text-yellow-600 font-semibold">{booking.status}</span>}
                    {booking.status === "Cancelled" && <span className="text-red-600 font-semibold">{booking.status}</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payments Table */}
      <div>
        <h2 className="text-2xl font-bold text-purple-700 mb-4">All Payments</h2>
        <div className="overflow-x-auto bg-white rounded-3xl shadow-lg p-4">
          <table className="min-w-full text-left">
            <thead>
              <tr className="border-b-2 border-purple-300">
                <th className="py-2 px-4">User</th>
                <th className="py-2 px-4">Booking ID</th>
                <th className="py-2 px-4">Amount</th>
                <th className="py-2 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map(payment => (
                <tr key={payment.id} className="border-b hover:bg-green-50 transition">
                  <td className="py-2 px-4">{payment.user}</td>
                  <td className="py-2 px-4">{payment.bookingId}</td>
                  <td className="py-2 px-4">${payment.amount}</td>
                  <td className="py-2 px-4">
                    {payment.status === "Paid" && <span className="text-green-600 font-semibold">{payment.status}</span>}
                    {payment.status === "Pending" && <span className="text-yellow-600 font-semibold">{payment.status}</span>}
                    {payment.status === "Refunded" && <span className="text-red-600 font-semibold">{payment.status}</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
