import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FaCar } from "react-icons/fa";

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

  return (
    <section className="min-h-screen p-6 md:p-10 bg-gradient-to-br from-gray-50 via-purple-50 to-pink-50">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-10">
        Admin Dashboard
      </h1>

      {/* Header Card */}
      <motion.div
        whileHover={{ scale: 1.04 }}
        className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white p-8 rounded-3xl shadow-2xl mb-10 flex items-center gap-6"
      >
        <div className="bg-white/20 p-4 rounded-2xl">
          <FaCar size={42} />
        </div>
        <div>
          <p className="text-lg uppercase tracking-wide opacity-90">
            Fleet Overview
          </p>
          <p className="text-4xl font-extrabold">
            {cars.length} Vehicles
          </p>
        </div>
      </motion.div>

      {/* Cars Table */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Cars Overview
        </h2>

        <div className="overflow-x-auto bg-white rounded-3xl shadow-xl p-5">
          <table className="min-w-full text-sm md:text-base">
            <thead>
              <tr className="bg-gradient-to-r from-purple-600 to-pink-500 text-white">
                <th className="py-3 px-4 text-left rounded-tl-2xl">Name</th>
                <th className="py-3 px-4 text-left">Registration</th>
                <th className="py-3 px-4 text-left">Seats</th>
                <th className="py-3 px-4 text-left rounded-tr-2xl">Image</th>
              </tr>
            </thead>
            <tbody>
              {cars.map(car => (
                <motion.tr
                  key={car.id}
                  whileHover={{ scale: 1.015 }}
                  className="border-b hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition"
                >
                  <td className="py-3 px-4 font-semibold text-gray-800">
                    {car.name}
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {car.reg}
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-block px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 font-medium">
                      {car.seats} seats
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {car.image ? (
                      <img
                        src={car.image}
                        alt={car.name}
                        className="w-24 h-14 object-cover rounded-xl shadow-md"
                      />
                    ) : (
                      <span className="text-gray-400 italic">
                        No image
                      </span>
                    )}
                  </td>
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
