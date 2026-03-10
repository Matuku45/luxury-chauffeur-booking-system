import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaPhone,
  FaTimes,
  FaUsers,
  FaSnowflake,
  FaSuitcase,
  FaCogs,
} from "react-icons/fa";
import axios from "axios";

/* ================= GLOBAL CONSTANTS ================= */
export const BOOKING_REASONS = ["Matric", "Event", "Wedding", "Other"];
const OZOW_API = "https://python-script-ozzowtesting-1.onrender.com/api/pay";
const FIREBASE_DB = "https://roomap-aa517-default-rtdb.firebaseio.com";

/* ================= STATIC CAR IMAGES ================= */
import picture1 from "../assets/picture1.webp.jpg";
import pic from "../assets/pic.webp";
import pic3 from "../assets/pic3.webp";
import uber from "../assets/uber.webp";
import uber2 from "../assets/uber2.webp";

const staticCars = [
  { name: "Family Car SUV", reg: "ABC123", seats: 4, pricePerDay: 2500, image: picture1 },
  { name: "Mercedes S-Class Family Car", reg: "XYZ789", seats: 4, pricePerDay: 2300, image: pic },
  { name: "Avanza", reg: "DEF456", seats: 4, pricePerDay: 2200, image: pic3 },
  { name: "Polo", reg: "UBR001", seats: 4, pricePerDay: 1800, image: uber },
  { name: "Luxury Uber Black", reg: "UBR002", seats: 6, pricePerDay: 2000, image: uber2 },
];

// Convert imported images to Base64
const toBase64 = (imgUrl) =>
  fetch(imgUrl)
    .then((res) => res.blob())
    .then(
      (blob) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        })
    );

/* ================= SAVE BOOKING ================= */
const saveBookingToFirebase = async (booking) => {
  try {
    const res = await fetch(`${FIREBASE_DB}/bookings.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(booking),
    });
    const data = await res.json();
    console.log("✅ Booking saved to Firebase:", data);
  } catch (error) {
    console.error("❌ Firebase save error:", error);
  }
};

/* ================= COMPONENT ================= */
const Booking = () => {
  const [carsFromDB, setCarsFromDB] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    carRegNumber: "",
    pickUpDate: "",
    pickUpLocation: "",
    finalLocation: "",
    bookingReason: "",
    clientPhone: "",
    days: 1,
  });

  /* ================= FETCH CARS AND BOOKINGS FROM DB ================= */
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const res = await fetch(`${FIREBASE_DB}/cars.json`);
        const data = await res.json();
        if (data) {
          const mappedCars = Object.values(data).map((c) => ({
            ...c,
            pricePerDay: Number(c.price),
          }));
          setCarsFromDB(mappedCars);
        }
      } catch (err) {
        console.error("Failed to fetch cars:", err);
      }
    };

    const fetchBookings = async () => {
      try {
        const res = await fetch(`${FIREBASE_DB}/bookings.json`);
        const data = await res.json();
        if (data) {
          const mappedBookings = Object.values(data);
          setBookings(mappedBookings);
        }
      } catch (err) {
        console.error("Failed to fetch bookings:", err);
      }
    };

    fetchCars();
    fetchBookings();
  }, []);

  const cars = [...staticCars, ...carsFromDB];

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCar) return;

    const totalAmount = selectedCar.pricePerDay * (formData.days || 1);

    // Convert image to Base64 if not already
    const carImageBase64 =
      selectedCar.image.startsWith("data:") ? selectedCar.image : await toBase64(selectedCar.image);

    const bookingPayload = {
      id: crypto.randomUUID(),
      ...formData,
      carName: selectedCar.name,
      carImage: carImageBase64,
      pricePerDay: selectedCar.pricePerDay,
      totalAmount,
      createdAt: new Date().toISOString(),
    };

    await saveBookingToFirebase(bookingPayload);
    setBookings((p) => [...p, bookingPayload]);

    // PAYMENT (Ozow)
    try {
      const paymentPayload = {
        booking_id: bookingPayload.id,
        amount: totalAmount,
        name: `${formData.firstName} ${formData.lastName}`,
        phone: formData.clientPhone,
      };
      const res = await axios.post(OZOW_API, paymentPayload);
      if (res.data?.url) window.location.href = res.data.url;
      else alert("⚠ Payment initiation failed.");
    } catch (err) {
      console.error("Payment error:", err);
      alert("⚠ Payment failed. Please try again.");
    }

    setSelectedCar(null);
  };

  /* ================= UI ================= */
  return (
    <section className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/5 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-extrabold">🚘 Luxury Chauffeur</h1>
        </div>
      </header>

      {/* CARS */}
      <div className="px-4 sm:px-6 lg:px-8 py-12 max-w-7xl mx-auto">
        <h2 className="text-xl font-bold mb-4">Available Cars</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cars.map((car) => (
            <motion.div
              key={car.reg}
              whileHover={{ y: -8 }}
              className="rounded-3xl overflow-hidden bg-white/10 border border-white/10 flex flex-col"
            >
              <img
                src={car.image}
                alt={car.name}
                className="h-48 sm:h-56 w-full object-cover"
              />
              <div className="p-4 sm:p-6 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold">{car.name}</h3>
                  <div className="grid grid-cols-2 gap-2 sm:gap-3 text-sm text-gray-300 mt-2">
                    <Feature icon={<FaUsers />} label={`${car.seats} Seats`} />
                    <Feature icon={<FaSnowflake />} label="Air-Conditioned" />
                    <Feature icon={<FaCogs />} label="Automatic" />
                    <Feature icon={<FaSuitcase />} label="Luxury Luggage" />
                  </div>
                </div>
                <div className="flex justify-between items-center mt-3">
                  <p className="text-lg sm:text-xl font-bold text-amber-400">
                    R{car.pricePerDay.toLocaleString()} / day
                  </p>
                  <button
                    onClick={() => {
                      setSelectedCar(car);
                      setFormData((p) => ({ ...p, carRegNumber: car.reg }));
                    }}
                    className="px-3 sm:px-5 py-2 bg-amber-400 text-black rounded-xl font-bold text-sm sm:text-base"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* BOOKING MODAL */}
      <AnimatePresence>
        {selectedCar && (
          <motion.div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 sm:p-6 overflow-auto">
            <motion.form
              onSubmit={handleSubmit}
              className="bg-white text-black w-full max-w-md sm:max-w-lg md:max-w-xl p-4 sm:p-6 rounded-3xl space-y-4 relative"
            >
              <button
                type="button"
                onClick={() => setSelectedCar(null)}
                className="absolute top-3 right-3 text-gray-400 sm:top-4 sm:right-4"
              >
                <FaTimes size={20} />
              </button>

              <h2 className="text-xl sm:text-2xl font-bold mb-2">
                Book {selectedCar.name}
              </h2>

              {/* FORM FIELDS */}
              <Input label="First Name" icon={<FaUsers />}>
                <input name="firstName" required onChange={handleChange} className="form-input w-full text-sm sm:text-base" />
              </Input>
              <Input label="Last Name" icon={<FaUsers />}>
                <input name="lastName" required onChange={handleChange} className="form-input w-full text-sm sm:text-base" />
              </Input>
              <Input label="Car Registration" icon={<FaCogs />}>
                <input value={formData.carRegNumber} readOnly className="form-input w-full bg-gray-100 text-sm sm:text-base" />
              </Input>
              <Input label="Pick-up Date" icon={<FaCalendarAlt />}>
                <input type="date" name="pickUpDate" required onChange={handleChange} className="form-input w-full text-sm sm:text-base" />
              </Input>
              <Input label="Pick-up Location" icon={<FaMapMarkerAlt />}>
                <input name="pickUpLocation" required onChange={handleChange} className="form-input w-full text-sm sm:text-base" />
              </Input>
              <Input label="Final Location" icon={<FaMapMarkerAlt />}>
                <input name="finalLocation" required onChange={handleChange} className="form-input w-full text-sm sm:text-base" />
              </Input>
              <Input label="Reason" icon={<FaSuitcase />}>
                <select name="bookingReason" required onChange={handleChange} className="form-input w-full text-sm sm:text-base">
                  <option value="">Select</option>
                  {BOOKING_REASONS.map((r) => (<option key={r}>{r}</option>))}
                </select>
              </Input>
              <Input label="Phone Number" icon={<FaPhone />}>
                <input name="clientPhone" required onChange={handleChange} className="form-input w-full text-sm sm:text-base" />
              </Input>
              <Input label="Number of Days" icon={<FaCalendarAlt />}>
                <input type="number" name="days" min={1} value={formData.days} onChange={handleChange} className="form-input w-full text-sm sm:text-base" />
              </Input>

              <p className="text-base sm:text-lg font-bold text-amber-500">
                Total: R{(selectedCar.pricePerDay * (formData.days || 1)).toLocaleString()}
              </p>

              <button type="submit" className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-sm sm:text-base">
                Confirm Booking & Pay
              </button>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

/* ================= SMALL COMPONENTS ================= */
const Feature = ({ icon, label }) => (
  <div className="flex items-center gap-2 text-xs sm:text-sm">
    <span className="text-amber-400">{icon}</span>
    <span>{label}</span>
  </div>
);

const Input = ({ label, icon, children }) => (
  <div className="mb-2">
    <label className="flex items-center gap-2 font-semibold text-sm sm:text-base mb-1">
      {icon} {label}
    </label>
    {children}
  </div>
);

export default Booking;