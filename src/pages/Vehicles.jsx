import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";

/* 🔹 LOCAL IMAGES (fallback/demo cars) */
import picture1 from "../assets/picture1.webp.jpg";
import pic from "../assets/pic.webp";
import pic3 from "../assets/pic3.webp";
import uber from "../assets/uber.webp";
import uber2 from "../assets/uber2.webp";

const Vehicles = () => {
  const [cars, setCars] = useState([]);

  // 🔹 Fallback cars (shown if backend has no data)
  const demoCars = [
    {
      id: 1,
      name: "Mercedes S-Class",
      reg: "ABC123",
      seats: 4,
      pricePerDay: 2500,
      image: picture1,
    },
    {
      id: 2,
      name: "BMW 7 Series",
      reg: "XYZ789",
      seats: 4,
      pricePerDay: 2300,
      image: pic,
    },
    {
      id: 3,
      name: "Audi A8",
      reg: "DEF456",
      seats: 4,
      pricePerDay: 2200,
      image: pic3,
    },
    {
      id: 4,
      name: "Executive Uber Black",
      reg: "UBR001",
      seats: 4,
      pricePerDay: 1800,
      image: uber,
    },
    {
      id: 5,
      name: "Luxury Uber XL",
      reg: "UBR002",
      seats: 6,
      pricePerDay: 2000,
      image: uber2,
    },
  ];

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/cars");

        // If backend returns data, use it
        if (res.data && res.data.length > 0) {
          setCars(res.data);
        } else {
          setCars(demoCars);
        }
      } catch (err) {
        console.warn("Backend not available, using demo cars");
        setCars(demoCars);
      }
    };

    fetchCars();
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-6 pt-32 pb-20">
      <h1 className="text-4xl font-extrabold mb-4 text-purple-700">
        Our Luxury Fleet
      </h1>

      <p className="max-w-3xl mb-12 text-gray-600">
        Explore our premium chauffeur-driven vehicles, perfect for matric
        dances, weddings, and executive travel. Each vehicle delivers comfort,
        elegance, and unforgettable style.
      </p>

      {/* 🚘 CAR GRID */}
      <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
        {cars.map((car) => (
          <motion.div
            key={car.id || car.reg}
            whileHover={{ scale: 1.05 }}
            className="bg-white rounded-3xl shadow-xl overflow-hidden"
          >
            <img
              src={car.image || picture1}
              alt={car.name}
              className="w-full h-48 object-cover"
            />

            <div className="p-6 space-y-2">
              <h2 className="text-xl font-bold text-purple-700">
                {car.name}
              </h2>

              <p className="text-gray-600">Registration: {car.reg}</p>
              <p className="text-gray-600">Seats: {car.seats}</p>

              {car.pricePerDay && (
                <p className="text-lg font-extrabold text-purple-600 mt-2">
                  R{car.pricePerDay.toLocaleString()} / day
                </p>
              )}

              <p className="text-sm text-gray-500 mt-3">
                A luxury chauffeur experience designed for special occasions.
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Vehicles;
