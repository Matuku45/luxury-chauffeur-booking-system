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
    <section className="min-h-screen p-6 md:p-10 bg-gray-50">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-10">
        Admin Dashboard
      </h1>

      {/* Header Card */}
      <motion.div
        whileHover={{ scale: 1.03 }}
        className="bg-gradient-to-r from-purple-600 to-pink-500 text-white p-8 rounded-3xl shadow-lg mb-10 flex items-center gap-6"
      >
        <FaCar size={40} />
        <div>
          <p className="text-xl font-semibold">Fleet Overview</p>
          <p className="text-3xl font-bold">{cars.length} Vehicles</p>
        </div>
      </motion.div>

      {/* Cars Table */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Cars Overview
        </h2>

        <div className="overflow-x-auto bg-white rounded-3xl shadow-lg p-5">
          <table className="min-w-full text-sm md:text-base">
            <thead>
              <tr className="border-b-2 border-gray-200 text-gray-600">
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Registration</th>
                <th className="py-3 px-4">Seats</th>
                <th className="py-3 px-4">Image</th>
              </tr>
            </thead>
            <tbody>
              {cars.map(car => (
                <motion.tr
                  key={car.id}
                  whileHover={{ scale: 1.01 }}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="py-3 px-4 font-medium">{car.name}</td>
                  <td className="py-3 px-4">{car.reg}</td>
                  <td className="py-3 px-4">{car.seats}</td>
                  <td className="py-3 px-4">
                    {car.image ? (
                      <img
                        src={car.image}
                        alt={car.name}
                        className="w-24 h-14 object-cover rounded-xl shadow"
                      />
                    ) : (
                      <span className="text-gray-400 italic">No image</span>
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
