import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";

const Vehicles = () => {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    // Fetch cars from your backend
    const fetchCars = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/cars");
        setCars(res.data);
      } catch (err) {
        console.error("Error fetching cars:", err);
      }
    };

    fetchCars();
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-6 pt-32 pb-20">
      <h1 className="text-4xl font-bold mb-4 text-purple-700">Our Luxury Fleet</h1>
      <p className="max-w-3xl mb-12 text-gray-700">
        Explore our selection of premium luxury vehicles available for matric
        dances, weddings, and special events. Each vehicle is carefully selected
        to provide comfort, style, and an unforgettable experience.
      </p>

      <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-8">
        {cars.map((car) => (
          <motion.div
            key={car.id}
            whileHover={{ scale: 1.05 }}
            className="bg-white rounded-3xl shadow-lg overflow-hidden cursor-pointer"
          >
            <img
              src={car.image || "/images/default-car.jpg"}
              alt={car.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h2 className="text-xl font-bold mb-2 text-purple-700">{car.name}</h2>
              <p className="text-gray-600 mb-1">Registration: {car.reg}</p>
              <p className="text-gray-600 mb-1">Seats: {car.seats}</p>
              <p className="text-gray-500 text-sm mt-2">
                Experience luxury and style with this premium vehicle for your
                special occasions.
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Vehicles;
