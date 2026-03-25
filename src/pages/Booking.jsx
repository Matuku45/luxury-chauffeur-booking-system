import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCalendarAlt, FaMapMarkerAlt, FaPhone, FaTimes, FaUsers,
  FaSnowflake, FaSuitcase, FaCogs, FaChevronLeft, FaChevronRight, FaExpand, FaCar
} from "react-icons/fa";
import axios from "axios";

/* ================= GLOBAL CONSTANTS ================= */
export const BOOKING_REASONS = ["Matric", "Event", "Wedding", "Other"];
const OZOW_API = "https://python-script-ozzowtesting-1.onrender.com/api/pay";
const FIREBASE_DB = "https://roomap-aa517-default-rtdb.firebaseio.com";

/* ================= STATIC CAR IMAGES ================= */
const staticCars = [];

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

const saveBookingToFirebase = async (booking) => {
  try {
    const res = await fetch(`${FIREBASE_DB}/bookings.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(booking),
    });
    return await res.json();
  } catch (error) {
    console.error("❌ Firebase save error:", error);
  }
};

const Booking = () => {
  const [carsFromDB, setCarsFromDB] = useState([]);
  const [loading, setLoading] = useState(true); // Fetching progress
  const [submitting, setSubmitting] = useState(false); // Payment progress
  const [selectedCar, setSelectedCar] = useState(null);
  const [zoomData, setZoomData] = useState(null); // Lightbox
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", carRegNumber: "",
    pickUpDate: "", pickUpLocation: "", finalLocation: "",
    bookingReason: "", clientPhone: "", days: 1,
  });

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const res = await fetch(`${FIREBASE_DB}/cars.json`);
        const data = await res.json();
        if (data) {
          const mappedCars = Object.values(data).map((c) => ({
            ...c,
            pricePerDay: Number(c.price),
            // Standardize image array for carousel
            displayImages: Array.isArray(c.images) ? c.images : (c.image ? [c.image] : [])
          }));
          setCarsFromDB(mappedCars);
        }
      } catch (err) {
        console.error("Failed to fetch cars:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  const cars = [...staticCars, ...carsFromDB];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCar || submitting) return;

    setSubmitting(true);
    const totalAmount = selectedCar.pricePerDay * (formData.days || 1);

    try {
      // Logic for base64 conversion remains from your code
      const firstImg = selectedCar.displayImages[0] || "";
      const carImageBase64 = firstImg.startsWith("data:") ? firstImg : await toBase64(firstImg);

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

      const paymentPayload = {
        booking_id: bookingPayload.id,
        amount: totalAmount,
        name: `${formData.firstName} ${formData.lastName}`,
        phone: formData.clientPhone,
      };

      const res = await axios.post(OZOW_API, paymentPayload);
      if (res.data?.url) {
        window.location.href = res.data.url;
      } else {
        alert("⚠ Payment initiation failed.");
        setSubmitting(false);
      }
    } catch (err) {
      console.error(err);
      alert("⚠ Something went wrong.");
      setSubmitting(false);
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white relative">
      
      {/* GLOBAL PROGRESS LOADER */}
      <AnimatePresence>
        {submitting && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center"
          >
            <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-amber-400 font-bold tracking-widest animate-pulse">PROCESSING PAYMENT...</p>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/5 border-b border-white/10 px-4 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-extrabold">🚘 Luxury Chauffeur</h1>
        </div>
      </header>

      <div className="px-4 py-12 max-w-7xl mx-auto">
        <h2 className="text-xl font-bold mb-8 uppercase tracking-widest text-gray-400">Available Fleet</h2>
        
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map(i => <div key={i} className="h-80 bg-white/5 rounded-3xl animate-pulse" />)}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cars.map((car) => (
              <motion.div key={car.reg} whileHover={{ y: -8 }} className="rounded-3xl overflow-hidden bg-white/10 border border-white/10 flex flex-col">
                <div className="h-48 sm:h-56 relative group">
                  <CarCarousel 
                    images={car.displayImages} 
                    onZoom={(idx) => setZoomData({ images: car.displayImages, index: idx })} 
                  />
                </div>
                <div className="p-4 sm:p-6 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold">{car.name}</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-300 mt-2">
                      <Feature icon={<FaUsers />} label={`${car.seats} Seats`} />
                      <Feature icon={<FaSnowflake />} label="Air-Conditioned" />
                      <Feature icon={<FaCogs />} label="Automatic" />
                      <Feature icon={<FaSuitcase />} label="Luxury" />
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <p className="text-lg font-bold text-amber-400">R{car.pricePerDay.toLocaleString()} / day</p>
                    <button
                      onClick={() => {
                        setSelectedCar(car);
                        setFormData((p) => ({ ...p, carRegNumber: car.reg }));
                      }}
                      className="px-5 py-2 bg-amber-400 text-black rounded-xl font-bold hover:bg-amber-300 transition-colors"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* LIGHTBOX / ZOOM */}
      <AnimatePresence>
        {zoomData && <Lightbox data={zoomData} onClose={() => setZoomData(null)} />}
      </AnimatePresence>

      {/* BOOKING MODAL - FORM IS UNTOUCHED */}
      <AnimatePresence>
        {selectedCar && (
          <motion.div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 sm:p-6 overflow-auto">
            <motion.form
              onSubmit={handleSubmit}
              className="bg-white text-black w-full max-w-md sm:max-w-lg md:max-w-xl p-4 sm:p-6 rounded-3xl space-y-4 relative"
            >
              <button type="button" onClick={() => setSelectedCar(null)} className="absolute top-3 right-3 text-gray-400 sm:top-4 sm:right-4">
                <FaTimes size={20} />
              </button>
              <h2 className="text-xl sm:text-2xl font-bold mb-2">Book {selectedCar.name}</h2>
              <Input label="First Name" icon={<FaUsers />}><input name="firstName" required onChange={handleChange} className="form-input w-full p-2 border rounded-lg" /></Input>
              <Input label="Last Name" icon={<FaUsers />}><input name="lastName" required onChange={handleChange} className="form-input w-full p-2 border rounded-lg" /></Input>
              <Input label="Car Registration" icon={<FaCogs />}><input value={formData.carRegNumber} readOnly className="form-input w-full bg-gray-100 p-2 border rounded-lg" /></Input>
              <Input label="Pick-up Date" icon={<FaCalendarAlt />}><input type="date" name="pickUpDate" required onChange={handleChange} className="form-input w-full p-2 border rounded-lg" /></Input>
              <Input label="Pick-up Location" icon={<FaMapMarkerAlt />}><input name="pickUpLocation" required onChange={handleChange} className="form-input w-full p-2 border rounded-lg" /></Input>
              <Input label="Final Location" icon={<FaMapMarkerAlt />}><input name="finalLocation" required onChange={handleChange} className="form-input w-full p-2 border rounded-lg" /></Input>
              <Input label="Reason" icon={<FaSuitcase />}>
                <select name="bookingReason" required onChange={handleChange} className="form-input w-full p-2 border rounded-lg">
                  <option value="">Select</option>
                  {BOOKING_REASONS.map(r => <option key={r}>{r}</option>)}
                </select>
              </Input>
              <Input label="Phone Number" icon={<FaPhone />}><input name="clientPhone" required onChange={handleChange} className="form-input w-full p-2 border rounded-lg" /></Input>
              <Input label="Number of Days" icon={<FaCalendarAlt />}><input type="number" name="days" min={1} value={formData.days} onChange={handleChange} className="form-input w-full p-2 border rounded-lg" /></Input>
              <p className="text-base sm:text-lg font-bold text-amber-500">Total: R{(selectedCar.pricePerDay * (formData.days || 1)).toLocaleString()}</p>
              <button disabled={submitting} type="submit" className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:opacity-90 disabled:opacity-50 transition-opacity">
                {submitting ? "Processing..." : "Confirm Booking & Pay"}
              </button>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

/* ================= UTILITY COMPONENTS ================= */

const CarCarousel = ({ images, onZoom }) => {
  const [idx, setIdx] = useState(0);
  if (!images?.length) return <div className="h-full w-full flex items-center justify-center bg-slate-800"><FaCar size={40} className="text-slate-600"/></div>;

  return (
    <div className="relative h-full w-full group cursor-pointer" onClick={() => onZoom(idx)}>
      <img src={images[idx]} alt="Car" className="h-full w-full object-cover transition-transform group-hover:scale-105 duration-700" />
      {images.length > 1 && (
        <div className="absolute inset-0 flex items-center justify-between px-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={(e) => { e.stopPropagation(); setIdx(p => (p - 1 + images.length) % images.length); }} className="p-2 bg-black/40 rounded-full"><FaChevronLeft size={12}/></button>
          <button onClick={(e) => { e.stopPropagation(); setIdx(p => (p + 1) % images.length); }} className="p-2 bg-black/40 rounded-full"><FaChevronRight size={12}/></button>
        </div>
      )}
      <div className="absolute top-3 right-3 p-2 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><FaExpand size={12}/></div>
      {images.length > 1 && <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/50 px-2 py-0.5 rounded text-[10px]">{idx + 1} / {images.length}</div>}
    </div>
  );
};

const Lightbox = ({ data, onClose }) => {
  const [idx, setIdx] = useState(data.index);
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4">
      <button onClick={onClose} className="absolute top-6 right-6 text-white/70"><FaTimes size={30}/></button>
      <div className="relative max-w-5xl w-full h-full flex items-center justify-center">
        {data.images.length > 1 && (
          <button onClick={(e) => { e.stopPropagation(); setIdx(p => (p - 1 + data.images.length) % data.images.length); }} className="absolute left-0 p-4 text-white/50 hover:text-white"><FaChevronLeft size={30}/></button>
        )}
        <motion.img key={idx} initial={{ scale: 0.9 }} animate={{ scale: 1 }} src={data.images[idx]} className="max-h-[85vh] max-w-full rounded-lg object-contain" />
        {data.images.length > 1 && (
          <button onClick={(e) => { e.stopPropagation(); setIdx(p => (p + 1) % data.images.length); }} className="absolute right-0 p-4 text-white/50 hover:text-white"><FaChevronRight size={30}/></button>
        )}
      </div>
    </motion.div>
  );
};

const Feature = ({ icon, label }) => (
  <div className="flex items-center gap-2 text-xs sm:text-sm">
    <span className="text-amber-400">{icon}</span>
    <span>{label}</span>
  </div>
);

const Input = ({ label, icon, children }) => (
  <div className="mb-2 text-black">
    <label className="flex items-center gap-2 font-semibold text-sm sm:text-base mb-1">
      <span className="text-amber-600">{icon}</span> {label}
    </label>
    {children}
  </div>
);

export default Booking;