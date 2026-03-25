import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCalendarAlt, FaMapMarkerAlt, FaPhone, FaTimes, FaUsers,
  FaSnowflake, FaSuitcase, FaCogs, FaChevronLeft, FaChevronRight, FaExpand
} from "react-icons/fa";
import axios from "axios";

/* ================= GLOBAL CONSTANTS ================= */
export const BOOKING_REASONS = ["Matric", "Event", "Wedding", "Other"];
const OZOW_API = "https://python-script-ozzowtesting-1.onrender.com/api/pay";
const FIREBASE_DB = "https://roomap-aa517-default-rtdb.firebaseio.com";

const saveBookingToFirebase = async (booking) => {
  try {
    await fetch(`${FIREBASE_DB}/bookings.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(booking),
    });
  } catch (error) {
    console.error("❌ Firebase save error:", error);
  }
};

const Booking = () => {
  const [carsFromDB, setCarsFromDB] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [zoomData, setZoomData] = useState(null); // For Lightbox
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
            // Ensure we always have an array of images for the UI logic
            displayImages: Array.isArray(c.images) ? c.images : (c.image ? [c.image] : [])
          }));
          setCarsFromDB(mappedCars);
        }
      } catch (err) { console.error(err); }
    };
    fetchCars();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCar) return;

    const totalAmount = selectedCar.pricePerDay * (formData.days || 1);
    const bookingPayload = {
      id: crypto.randomUUID(),
      ...formData,
      carName: selectedCar.name,
      carImage: selectedCar.displayImages[0] || "",
      pricePerDay: selectedCar.pricePerDay,
      totalAmount,
      createdAt: new Date().toISOString(),
    };

    await saveBookingToFirebase(bookingPayload);

    try {
      const res = await axios.post(OZOW_API, {
        booking_id: bookingPayload.id,
        amount: totalAmount,
        name: `${formData.firstName} ${formData.lastName}`,
        phone: formData.clientPhone,
      });
      if (res.data?.url) window.location.href = res.data.url;
    } catch (err) { alert("Payment failed."); }
    setSelectedCar(null);
  };

  return (
    <section className="min-h-screen bg-slate-900 text-white pb-20">
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/5 border-b border-white/10 px-6 py-4">
        <h1 className="text-2xl font-extrabold max-w-7xl mx-auto">🚘 Luxury Chauffeur</h1>
      </header>

      <div className="px-4 py-12 max-w-7xl mx-auto">
        <h2 className="text-xl font-bold mb-8 uppercase tracking-widest text-slate-400">Available Fleet</h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {carsFromDB.map((car) => (
            <div key={car.reg} className="rounded-3xl overflow-hidden bg-white/5 border border-white/10 flex flex-col group">
              {/* IMAGE SECTION WITH CAROUSEL */}
              <div className="relative h-64 overflow-hidden bg-slate-800">
                <CarImageCarousel 
                  images={car.displayImages} 
                  onZoom={(idx) => setZoomData({ images: car.displayImages, index: idx })} 
                />
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-4">{car.name}</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm text-gray-400">
                    <Feature icon={<FaUsers />} label={`${car.seats} Seats`} />
                    <Feature icon={<FaSnowflake />} label="AC" />
                    <Feature icon={<FaCogs />} label="Auto" />
                    <Feature icon={<FaSuitcase />} label="Luxury" />
                  </div>
                </div>
                
                <div className="flex justify-between items-center mt-6 pt-6 border-t border-white/5">
                  <p className="text-xl font-black text-amber-400">R{car.pricePerDay}/day</p>
                  <button
                    onClick={() => {
                      setSelectedCar(car);
                      setFormData(p => ({ ...p, carRegNumber: car.reg }));
                    }}
                    className="px-6 py-2 bg-amber-400 text-black rounded-xl font-bold hover:bg-amber-300 transition-colors"
                  >
                    Book
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* LIGHTBOX / ZOOM OVERLAY */}
      <AnimatePresence>
        {zoomData && (
          <ImageLightbox 
            images={zoomData.images} 
            startIndex={zoomData.index} 
            onClose={() => setZoomData(null)} 
          />
        )}
      </AnimatePresence>

      {/* BOOKING MODAL (Existing logic maintained) */}
      <AnimatePresence>
        {selectedCar && (
          <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 overflow-y-auto">
            <motion.form 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              onSubmit={handleSubmit} className="bg-white text-black w-full max-w-xl p-8 rounded-[2.5rem] relative my-auto"
            >
              <button type="button" onClick={() => setSelectedCar(null)} className="absolute top-6 right-6 text-gray-400"><FaTimes size={24}/></button>
              <h2 className="text-2xl font-black mb-6">Complete Your Booking</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="First Name"><input name="firstName" required onChange={handleChange} className="w-full p-3 bg-slate-100 rounded-xl" /></Input>
                <Input label="Last Name"><input name="lastName" required onChange={handleChange} className="w-full p-3 bg-slate-100 rounded-xl" /></Input>
                <Input label="Pick-up Date"><input type="date" name="pickUpDate" required onChange={handleChange} className="w-full p-3 bg-slate-100 rounded-xl" /></Input>
                <Input label="Phone"><input name="clientPhone" required onChange={handleChange} className="w-full p-3 bg-slate-100 rounded-xl" /></Input>
                <Input label="Days"><input type="number" name="days" min={1} value={formData.days} onChange={handleChange} className="w-full p-3 bg-slate-100 rounded-xl" /></Input>
                <Input label="Reason">
                  <select name="bookingReason" required onChange={handleChange} className="w-full p-3 bg-slate-100 rounded-xl">
                    <option value="">Select</option>
                    {BOOKING_REASONS.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </Input>
              </div>
              <div className="mt-6 space-y-2">
                <Input label="Pick-up Location"><input name="pickUpLocation" required onChange={handleChange} className="w-full p-3 bg-slate-100 rounded-xl" /></Input>
                <Input label="Final Destination"><input name="finalLocation" required onChange={handleChange} className="w-full p-3 bg-slate-100 rounded-xl" /></Input>
              </div>

              <div className="mt-8 flex items-center justify-between border-t pt-6">
                <div>
                  <p className="text-xs uppercase font-bold text-gray-400">Total Price</p>
                  <p className="text-2xl font-black text-slate-900">R{(selectedCar.pricePerDay * formData.days).toLocaleString()}</p>
                </div>
                <button type="submit" className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-bold hover:bg-indigo-600 transition-all">Pay with Ozow</button>
              </div>
            </motion.form>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

/* ================= SUB-COMPONENTS ================= */

const CarImageCarousel = ({ images, onZoom }) => {
  const [current, setCurrent] = useState(0);

  const next = (e) => { e.stopPropagation(); setCurrent(p => (p + 1) % images.length); };
  const prev = (e) => { e.stopPropagation(); setCurrent(p => (p - 1 + images.length) % images.length); };

  if (!images || images.length === 0) return <div className="h-full flex items-center justify-center"><FaCar size={40}/></div>;

  return (
    <div className="relative h-full w-full group/item cursor-pointer" onClick={() => onZoom(current)}>
      <img src={images[current]} className="h-full w-full object-cover transition-transform duration-500 group-hover/item:scale-105" alt="Car" />
      
      {images.length > 1 && (
        <>
          <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full opacity-0 group-hover/item:opacity-100 transition-opacity"><FaChevronLeft/></button>
          <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full opacity-0 group-hover/item:opacity-100 transition-opacity"><FaChevronRight/></button>
          <div className="absolute bottom-3 right-3 bg-black/60 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest">
            {current + 1} / {images.length}
          </div>
        </>
      )}
      <div className="absolute top-3 right-3 p-2 bg-white/10 backdrop-blur-md rounded-full opacity-0 group-hover/item:opacity-100 transition-opacity">
        <FaExpand size={12}/>
      </div>
    </div>
  );
};

const ImageLightbox = ({ images, startIndex, onClose }) => {
  const [idx, setIdx] = useState(startIndex);
  const next = (e) => { e.stopPropagation(); setIdx(p => (p + 1) % images.length); };
  const prev = (e) => { e.stopPropagation(); setIdx(p => (p - 1 + images.length) % images.length); };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 z-[100] bg-slate-950 flex items-center justify-center p-4">
      <button onClick={onClose} className="absolute top-10 right-10 text-white/50 hover:text-white"><FaTimes size={30}/></button>
      
      <div className="relative max-w-5xl w-full h-[70vh] flex items-center justify-center">
        {images.length > 1 && <button onClick={prev} className="absolute -left-4 lg:-left-20 p-4 bg-white/5 rounded-full border border-white/10 text-white"><FaChevronLeft size={24}/></button>}
        
        <motion.img key={idx} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} src={images[idx]} className="max-h-full max-w-full rounded-3xl shadow-2xl object-contain" />

        {images.length > 1 && <button onClick={next} className="absolute -right-4 lg:-right-20 p-4 bg-white/5 rounded-full border border-white/10 text-white"><FaChevronRight size={24}/></button>}
      </div>

      <div className="absolute bottom-10 flex gap-2">
        {images.map((_, i) => (
          <div key={i} className={`h-1.5 transition-all rounded-full ${i === idx ? 'w-8 bg-amber-400' : 'w-2 bg-white/20'}`} />
        ))}
      </div>
    </motion.div>
  );
};

const Feature = ({ icon, label }) => (
  <div className="flex items-center gap-2"><span className="text-amber-400">{icon}</span><span>{label}</span></div>
);

const Input = ({ label, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">{label}</label>
    {children}
  </div>
);

export default Booking;