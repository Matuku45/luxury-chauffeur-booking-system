import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCar, FaLayerGroup, FaPlus, FaTimes, FaTrash,
  FaEdit, FaCalendarAlt, FaMapMarkerAlt, FaPhone, FaSearch, 
  FaExpand, FaChevronLeft, FaChevronRight, FaChartLine, FaClipboardCheck
} from "react-icons/fa";

const FIREBASE_URL = "https://roomap-aa517-default-rtdb.firebaseio.com/";

const Dashboard = () => {
  const [cars, setCars] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [zoomData, setZoomData] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [newCar, setNewCar] = useState({ id: null, name: "", reg: "", seats: 4, price: "", images: [] });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [cRes, bRes] = await Promise.all([
        fetch(`${FIREBASE_URL}cars.json`),
        fetch(`${FIREBASE_URL}bookings.json`)
      ]);
      const cData = await cRes.json() || {};
      const bData = await bRes.json() || {};

      const rawCars = Object.entries(cData).map(([id, car]) => ({ id, ...car }));

      // GROUPING LOGIC: Merge cars with the same registration number
      const groupedCars = rawCars.reduce((acc, current) => {
        const existingCar = acc.find(item => item.reg === current.reg);
        if (existingCar) {
          const currentImages = Array.isArray(current.images) ? current.images : [current.images].filter(Boolean);
          existingCar.images = [...new Set([...(existingCar.images || []), ...currentImages])];
        } else {
          acc.push({
            ...current,
            images: Array.isArray(current.images) ? current.images : (current.images ? [current.images] : [])
          });
        }
        return acc;
      }, []);

      setCars(groupedCars);
      setBookings(Object.entries(bData).map(([id, b]) => ({ id, ...b })));
    } catch (err) { 
      console.error("Fetch error:", err); 
    }
  };

  const stats = useMemo(() => {
    const attended = bookings.filter(b => b.attended);
    const pending = bookings.filter(b => !b.attended);
    const totalRevenue = attended.reduce((sum, b) => sum + Number(b.price || 0), 0); 
    
    return {
      fleet: cars.length,
      activeBookings: pending.length,
      attendedBookings: attended.length,
      revenue: totalRevenue
    };
  }, [cars, bookings]);

  const pendingBookings = useMemo(() => {
    return bookings
      .filter(b => !b.attended)
      .filter(b => 
        b.carName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.carRegNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.firstName?.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => new Date(a.pickUpDate) - new Date(b.pickUpDate));
  }, [bookings, searchQuery]);

  const groupedBookings = pendingBookings.reduce((acc, curr) => {
    const key = `${curr.carName || "Unknown Car"} — ${curr.carRegNumber || "No Reg"}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(curr);
    return acc;
  }, {});

  const attendBooking = async (id) => {
    try {
      const response = await fetch(`${FIREBASE_URL}bookings/${id}.json`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ attended: true })
      });
      if (!response.ok) throw new Error("Failed to update database");
      setBookings(prev => prev.map(b => b.id === id ? { ...b, attended: true } : b));
    } catch (err) { 
      console.error("Attendance Error:", err);
      alert("Could not mark as attended."); 
    }
  };

  const saveCar = async (e) => {
    e.preventDefault();
    const method = isEditing ? "PUT" : "POST";
    const url = isEditing ? `${FIREBASE_URL}cars/${newCar.id}.json` : `${FIREBASE_URL}cars.json`;
    await fetch(url, { method, body: JSON.stringify(newCar) });
    setShowModal(false);
    setNewCar({ id: null, name: "", reg: "", seats: 4, price: "", images: [] });
    fetchData();
  };

  const deleteItem = async (type, id) => {
    if (!window.confirm(`Permanently delete this ${type}?`)) return;
    await fetch(`${FIREBASE_URL}${type}s/${id}.json`, { method: "DELETE" });
    fetchData();
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans">
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 lg:px-8 py-4 flex flex-col lg:flex-row justify-between items-center sticky top-0 z-40 gap-4">
        <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-start">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2.5 rounded-xl text-white shadow-lg shadow-indigo-200"><FaCar size={22}/></div>
            <h1 className="text-2xl font-black tracking-tighter uppercase">Fleet<span className="text-indigo-600">Core</span></h1>
          </div>
          <button onClick={() => { setIsEditing(false); setShowModal(true); }} className="lg:hidden p-3 bg-slate-900 text-white rounded-xl"><FaPlus /></button>
        </div>

        <div className="relative w-full max-w-xl">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search registrations or clients..." 
            className="w-full pl-12 pr-4 py-3 bg-slate-100 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <button onClick={() => { setIsEditing(false); setShowModal(true); }} className="hidden lg:flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold hover:bg-indigo-600 transition-all active:scale-95 shadow-xl shadow-slate-200">
          <FaPlus /> ADD VEHICLE
        </button>
      </nav>

      <main className="p-4 lg:p-10 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-12">
          <StatCard label="Fleet Size" value={stats.fleet} icon={<FaCar/>} color="text-blue-600" bg="bg-blue-50" />
          <StatCard label="Pending" value={stats.activeBookings} icon={<FaLayerGroup/>} color="text-orange-600" bg="bg-orange-50" />
          <StatCard label="Attended" value={stats.attendedBookings} icon={<FaClipboardCheck/>} color="text-indigo-600" bg="bg-indigo-50" />
          <StatCard label="Revenue" value={`R${stats.revenue}`} icon={<FaChartLine/>} color="text-emerald-600" bg="bg-emerald-50" />
        </div>

        <div className="mb-16">
          <SectionHeader title="Vehicle Inventory" subtitle="Manage your cars and pricing" />
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8">
            {cars.map((car) => (
              <VehicleCard 
                key={car.id} 
                car={car} 
                onEdit={() => { setNewCar(car); setIsEditing(true); setShowModal(true); }}
                onDelete={() => deleteItem('car', car.id)}
                onZoom={(idx) => setZoomData({ images: car.images, index: idx })}
              />
            ))}
          </div>
        </div>

        <SectionHeader title="Operational Logs" subtitle="Active bookings to be processed" />
        <div className="grid grid-cols-1 gap-10">
          {Object.entries(groupedBookings).length > 0 ? (
            Object.entries(groupedBookings).map(([groupTitle, items]) => (
              <BookingGroupCard 
                key={groupTitle} 
                title={groupTitle} 
                bookings={items} 
                onAttend={attendBooking}
                onDelete={(id) => deleteItem('booking', id)} 
              />
            ))
          ) : (
            <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-300">
              <p className="text-slate-400 font-bold uppercase tracking-widest">No active bookings found</p>
            </div>
          )}
        </div>
      </main>

      <AnimatePresence>
        {showModal && <CarModal onClose={() => setShowModal(false)} onSubmit={saveCar} car={newCar} setCar={setNewCar} isEditing={isEditing} />}
        {zoomData && <ImageGalleryOverlay data={zoomData} onClose={() => setZoomData(null)} />}
      </AnimatePresence>
    </div>
  );
};

/* ================= SUB-COMPONENTS ================= */

const StatCard = ({ label, value, icon, color, bg }) => (
  <div className="bg-white p-6 lg:p-8 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between">
    <div>
      <p className="text-slate-400 font-bold text-[10px] lg:text-xs uppercase tracking-widest mb-1">{label}</p>
      <p className="text-2xl lg:text-3xl font-black text-slate-800">{value}</p>
    </div>
    <div className={`${bg} ${color} p-4 lg:p-5 rounded-2xl text-xl lg:text-2xl`}>{icon}</div>
  </div>
);

const VehicleCard = ({ car, onEdit, onDelete, onZoom }) => {
  const [curr, setCurr] = useState(0);
  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden hover:shadow-2xl transition-all group flex flex-col">
      <div className="relative h-64 overflow-hidden bg-slate-100">
        {car.images?.length > 0 ? (
          <>
            <img src={car.images[curr]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Car" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button onClick={() => onZoom(curr)} className="p-4 bg-white text-slate-900 rounded-full shadow-xl hover:bg-indigo-600 hover:text-white transition-all"><FaExpand size={20}/></button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-slate-300"><FaCar size={60} /></div>
        )}
      </div>
      <div className="p-8">
        <div className="flex justify-between items-start mb-6">
          <h3 className="font-black text-xl text-slate-800 leading-tight uppercase tracking-tighter">{car.name}</h3>
          <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-lg font-black text-sm">R{car.price}</span>
        </div>
        <div className="flex items-center justify-between pt-6 border-t border-slate-100 mt-auto">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Plate Number</span>
            <span className="font-mono font-bold text-slate-700">{car.reg}</span>
          </div>
          <div className="flex gap-2">
            <button onClick={onEdit} className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"><FaEdit /></button>
            <button onClick={onDelete} className="p-3 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"><FaTrash /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

const BookingGroupCard = ({ title, bookings, onAttend, onDelete }) => (
  <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
    <div className="bg-slate-900 px-6 lg:px-8 py-5 flex justify-between items-center">
      <h4 className="text-white font-black text-sm lg:text-lg tracking-tight uppercase truncate mr-4">{title}</h4>
      <div className="bg-white/10 text-white/80 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap">{bookings.length} Active</div>
    </div>
    <div className="divide-y divide-slate-100">
      {bookings.map((b) => (
        <div key={b.id} className="p-6 lg:p-8 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8 transition-colors">
          <div className="flex-1 space-y-4 w-full">
            <p className="text-xl font-black text-slate-800">{b.firstName} {b.lastName}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Route</span>
                <div className="flex items-center gap-2 font-bold text-slate-700 text-sm">
                  <FaMapMarkerAlt className="text-indigo-500 shrink-0"/> <span className="truncate">{b.pickUpLocation}</span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Date</span>
                <div className="flex items-center gap-2 font-bold text-slate-700 text-sm"><FaCalendarAlt className="text-indigo-500 shrink-0"/> {b.pickUpDate}</div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Contact</span>
                <div className="flex items-center gap-2 font-bold text-slate-700 text-sm"><FaPhone className="text-indigo-500 shrink-0"/> {b.clientPhone}</div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 w-full xl:w-auto pt-4 lg:pt-0 border-t lg:border-none border-slate-100">
            <button 
              onClick={() => onAttend(b.id)}
              className="flex-1 xl:flex-none bg-indigo-600 text-white px-8 lg:px-10 py-4 rounded-2xl font-black text-xs hover:bg-emerald-600 transition-all shadow-lg shadow-indigo-100"
            >
              MARK ATTENDED
            </button>
            <button onClick={() => onDelete(b.id)} className="p-4 text-slate-300 hover:text-red-600 transition-all"><FaTrash/></button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const ImageGalleryOverlay = ({ data, onClose }) => {
  const [idx, setIdx] = useState(data.index);
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900/95 z-[100] flex items-center justify-center p-6 backdrop-blur-xl">
      <button onClick={onClose} className="absolute top-10 right-10 text-white/50 hover:text-white transition-all"><FaTimes size={40}/></button>
      {data.images.length > 1 && (
        <div className="absolute inset-x-10 flex justify-between items-center pointer-events-none">
          <button onClick={() => setIdx((idx - 1 + data.images.length) % data.images.length)} className="pointer-events-auto p-5 bg-white/5 text-white rounded-full hover:bg-white/20 transition-all"><FaChevronLeft size={30}/></button>
          <button onClick={() => setIdx((idx + 1) % data.images.length)} className="pointer-events-auto p-5 bg-white/5 text-white rounded-full hover:bg-white/20 transition-all"><FaChevronRight size={30}/></button>
        </div>
      )}
      <img src={data.images[idx]} className="max-w-full max-h-[80vh] rounded-[2rem] shadow-2xl object-contain border border-white/10" alt="Full size" />
    </motion.div>
  );
};

const SectionHeader = ({ title, subtitle }) => (
  <div className="mb-8 lg:mb-10">
    <h2 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tighter uppercase">{title}</h2>
    <p className="text-slate-400 font-bold uppercase text-xs tracking-[0.2em] mt-2">{subtitle}</p>
  </div>
);

const CarModal = ({ onClose, onSubmit, car, setCar, isEditing }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <motion.form 
      initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
      onSubmit={onSubmit} className="bg-white rounded-[3rem] w-full max-w-2xl overflow-hidden shadow-2xl"
    >
      <div className="p-8 lg:p-10 space-y-6 lg:space-y-8">
        <h3 className="text-2xl font-black uppercase tracking-tighter">{isEditing ? "Update Fleet" : "Add Vehicle"}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-8">
          <InputGroup label="Vehicle Name" value={car.name} onChange={(v) => setCar({...car, name: v})} placeholder="e.g. Mercedes C63" />
          <InputGroup label="Plate Number" value={car.reg} onChange={(v) => setCar({...car, reg: v})} placeholder="ND 8899" />
          <InputGroup label="Seat Capacity" type="number" value={car.seats} onChange={(v) => setCar({...car, seats: v})} />
          <InputGroup label="Daily Rental (R)" type="number" value={car.price} onChange={(v) => setCar({...car, price: v})} />
        </div>
        <input type="file" multiple className="w-full text-xs font-bold text-slate-400 file:mr-4 file:py-3 file:px-8 file:rounded-2xl file:border-0 file:bg-slate-900 file:text-white hover:file:bg-indigo-600 cursor-pointer transition-all" 
          onChange={(e) => {
            const files = Array.from(e.target.files);
            Promise.all(files.map(f => new Promise(res => {
              const r = new FileReader(); r.onload = () => res(r.result); r.readAsDataURL(f);
            }))).then(imgs => setCar({...car, images: imgs}));
          }} 
        />
      </div>
      <div className="bg-slate-50 p-8 lg:p-10 flex gap-4">
        <button type="button" onClick={onClose} className="flex-1 font-black text-slate-400 uppercase text-xs">Cancel</button>
        <button className="flex-[2] bg-indigo-600 text-white py-5 rounded-3xl font-black text-xs uppercase shadow-xl shadow-indigo-100">Confirm Fleet Entry</button>
      </div>
    </motion.form>
  </motion.div>
);

const InputGroup = ({ label, type="text", value, onChange, placeholder }) => (
  <div className="flex flex-col gap-2">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</label>
    <input required type={type} className="bg-slate-100 border-none rounded-2xl px-5 py-4 font-bold text-sm focus:ring-2 focus:ring-indigo-500 transition-all" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
  </div>
);

export default Dashboard;