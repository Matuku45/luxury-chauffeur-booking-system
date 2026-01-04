import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  FaCar,
  FaMoneyBillWave,
  FaLayerGroup
} from "react-icons/fa";

const Dashboard = () => {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/cars");
      setCars(res.data);
    } catch (err) {
      console.error("Error fetching cars:", err);
    }
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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Luxury Chauffeur Fleet Management
          </p>
        </div>
      </div>

      {/* DASHBOARD STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 rounded-3xl shadow-xl"
        >
          <FaCar size={30} />
          <p className="mt-3 text-sm uppercase tracking-wide opacity-90">
            Total Vehicles
          </p>
          <p className="text-4xl font-bold">{totalCars}</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-6 rounded-3xl shadow-xl"
        >
          <FaMoneyBillWave size={30} />
          <p className="mt-3 text-sm uppercase tracking-wide opacity-90">
            Avg Price / Day
          </p>
          <p className="text-4xl font-bold">R{avgPrice}</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-r from-pink-500 to-rose-500 text-white p-6 rounded-3xl shadow-xl"
        >
          <FaLayerGroup size={30} />
          <p className="mt-3 text-sm uppercase tracking-wide opacity-90">
            Fleet Type
          </p>
          <p className="text-xl font-semibold">
            Executive & Luxury
          </p>
        </motion.div>
      </div>

      {/* CARS TABLE */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Fleet Overview
        </h2>

        <div className="overflow-x-auto bg-white rounded-3xl shadow-2xl p-5">
          <table className="min-w-full text-sm md:text-base">
            <thead>
              <tr className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                <th className="py-3 px-4 text-left rounded-tl-2xl">Car</th>
                <th className="py-3 px-4 text-left">Registration</th>
                <th className="py-3 px-4 text-left">Seats</th>
                <th className="py-3 px-4 text-left">Price / Day</th>
                <th className="py-3 px-4 text-left rounded-tr-2xl">Image</th>
              </tr>
            </thead>

            <tbody>
              {cars.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center py-10 text-gray-400 italic"
                  >
                    No vehicles added yet
                  </td>
                </tr>
              ) : (
                cars.map(car => (
                  <motion.tr
                    key={car.id}
                    whileHover={{ scale: 1.02 }}
                    className="border-b hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition"
                  >
                    <td className="py-3 px-4 font-semibold">
                      {car.name}
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {car.reg}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 font-medium">
                        {car.seats} seats
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 font-semibold">
                        R{car.price}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {car.image ? (
                        <img
                          src={car.image}
                          alt={car.name}
                          className="w-24 h-14 object-cover rounded-xl shadow"
                        />
                      ) : (
                        <span className="text-gray-400 italic">
                          No image
                        </span>
                      )}
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
