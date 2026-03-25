import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCar, FaLayerGroup, FaPlus, FaTimes, FaTrash,
  FaEdit, FaCalendarAlt, FaMapMarkerAlt, FaPhone, FaSearch, 
  FaExpand, FaCheckCircle, FaChevronLeft, FaChevronRight, FaChartLine, 
  FaClipboardCheck, FaSpinner, FaThLarge, FaHistory
} from "react-icons/fa";

const FIREBASE_URL = "https://roomap-aa517-default-rtdb.firebaseio.com/";

const Dashboard = () => {
  const [cars, setCars] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [attendingId, setAttendingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [zoomData, setZoomData] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("overview"); 
  const [newCar, setNewCar] = useState({ id: null, name: "", reg: "", seats: 4, price: "", images: [] });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (retries = 3) => {
    setLoading(true);
    try {
      const [cRes, bRes] = await Promise.all([
        fetch(`${FIREBASE_URL}cars.json`),
        fetch(`${FIREBASE_URL}bookings.json`)
      ]);

      if (!cRes.ok || !bRes.ok) throw new Error("Network response was not ok");

      const cData = await cRes.json() || {};
      const bData = await bRes.json() || {};

      const rawCars = Object.entries(cData).map(([id, car]) => ({ id, ...car }));
      const groupedCars = rawCars.reduce((acc, current) => {
        const existingCar = acc.find(item => item.reg === current.reg);
        if (existingCar) {
          const currentImages = Array.isArray(current.images) ? current.images : [current.images].filter(Boolean);
          existingCar.images = [...new Set([...(existingCar.images || []), ...currentImages])];
        } else {
          acc.push({ ...current, images: Array.isArray(current.images) ? current.images : (current.images ? [current.images] : []) });
        }
        return acc;
      }, []);

      setCars(groupedCars);
      setBookings(Object.entries(bData).map(([id, b]) => ({ id, ...b })));
      setLoading(false);
    } catch (err) { 
      if (retries > 0) {
        setTimeout(() => fetchData(retries - 1), 1500);
      } else {
        setLoading(false);
      }
    }
  };

  const stats = useMemo(() => {
    const attended = bookings.filter(b => b.attended);
    const pending = bookings.filter(b => !b.attended);
    const totalRevenue = attended.reduce((sum, b) => {
        const carPrice = b.price || cars.find(c => c.reg === b.carRegNumber)?.price || 0;
        return sum + Number(carPrice);
    }, 0); 

    return { 
      fleet: cars.length, 
      activeBookings: pending.length, 
      attendedBookings: attended.length, 
      revenue: totalRevenue 
    };
  }, [cars, bookings]);

  const filteredBookings = useMemo(() => {
    const base = bookings.filter(b => 
      b.carName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.carRegNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.firstName?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return {
      pending: base.filter(b => !b.attended).sort((a, b) => new Date(a.pickUpDate) - new Date(b.pickUpDate)),
      attended: base.filter(b => b.attended).sort((a, b) => new Date(b.pickUpDate) - new Date(a.pickUpDate))
    };
  }, [bookings, searchQuery]);

  const groupedPending = filteredBookings.pending.reduce((acc, curr) => {
    const key = `${curr.carName || "Unknown Car"} — ${curr.carRegNumber || "No Reg"}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(curr);
    return acc;
  }, {});

  const attendBooking = async (id) => {
    setAttendingId(id);
    try {
      const response = await fetch(`${FIREBASE_URL}bookings/${id}.json`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ attended: true })
      });
      if (!response.ok) throw new Error("Failed update");
      setBookings(prev => prev.map(b => b.id === id ? { ...b, attended: true } : b));
    } catch (err) { 
      alert("Could not update booking."); 
    } finally {
      setAttendingId(null);
    }
  };

  const saveCar = async (e) => {
    e.preventDefault();
    const method = isEditing ? "PUT" : "POST";
    const url = isEditing ? `${FIREBASE_URL}cars/${newCar.id}.json` : `${FIREBASE_URL}cars.json`;
    try {
      const response = await fetch(url, { method, body: JSON.stringify(newCar) });
      const data = await response.json();
      
      // Update local state instead of re-fetching everything to avoid "removing content"
      if (isEditing) {
        setCars(prev => prev.map(c => c.id === newCar.id ? newCar : c));
      } else {
        setCars(prev => [...prev, { ...newCar, id: data.name }]);
      }

      setShowModal(false);
      setNewCar({ id: null, name: "", reg: "", seats: 4, price: "", images: [] });
    } catch (err) {
      alert("Error saving vehicle data.");
    }
  };

  const deleteItem = async (type, id) => {
    if (!window.confirm(`Permanently delete this ${type}?`)) return;
    try {
      await fetch(`${FIREBASE_URL}${type}s/${id}.json`, { method: "DELETE" });
      if (type === 'car') setCars(prev => prev.filter(c => c.id !== id));
      if (type === 'booking') setBookings(prev => prev.filter(b => b.id !== id));
    } catch (err) {
      alert("Deletion failed.");
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-white">
        <FaSpinner className="animate-spin text-indigo-600 mb-4" size={40} />
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Syncing Cloud...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F1F5F9] flex text-slate-900 font-sans">
      
      {/* SIDEBAR */}
      <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-slate-200 sticky top-0 h-screen p-8">
        <div className="flex items-center gap-3 mb-12">
          <div className="bg-indigo-600 p-2 rounded-xl text-white"><FaCar size={20}/></div>
          <h1 className="text-xl font-black tracking-tighter uppercase italic">Fleet<span className="text-indigo-600">Core</span></h1>
        </div>

        <nav className="space-y-2 flex-1">
          <SidebarLink active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<FaThLarge />} label="Overview" />
          <SidebarLink active={activeTab === 'inventory'} onClick={() => setActiveTab('inventory')} icon={<FaCar />} label="Inventory" />
          <SidebarLink active={activeTab === 'bookings'} onClick={() => setActiveTab('bookings')} icon={<FaLayerGroup />} label="Live Bookings" />
          <SidebarLink active={activeTab === 'history'} onClick={() => setActiveTab('history')} icon={<FaHistory />} label="History" />
        </nav>

        <button 
          onClick={() => { setIsEditing(false); setShowModal(true); }}
          className="mt-auto w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase flex items-center justify-center gap-2 hover:bg-indigo-600 transition-all shadow-lg"
        >
          <FaPlus /> New Vehicle
        </button>
      </aside>

      <main className="flex-1 p-6 lg:p-12 pb-32 lg:pb-12 max-w-[1600px]">
        {/* HEADER AREA */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
                <h2 className="text-3xl font-black uppercase tracking-tighter text-slate-800">
                    {activeTab === 'overview' ? 'Command Center' : activeTab.toUpperCase()}
                </h2>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Status: Operational</p>
            </div>
            <div className="relative w-full md:w-96">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                    type="text" 
                    placeholder="Search..." 
                    className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
        </div>

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <StatCard label="Fleet Size" value={stats.fleet} icon={<FaCar/>} color="text-blue-600" bg="bg-blue-50" />
            <StatCard label="Pending" value={stats.activeBookings} icon={<FaLayerGroup/>} color="text-orange-600" bg="bg-orange-50" />
            <StatCard label="Attended" value={stats.attendedBookings} icon={<FaClipboardCheck/>} color="text-indigo-600" bg="bg-indigo-50" />
            <StatCard label="Total Revenue" value={`R${stats.revenue.toLocaleString()}`} icon={<FaChartLine/>} color="text-emerald-600" bg="bg-emerald-50" />
          </div>
        )}

        {(activeTab === 'overview' || activeTab === 'inventory') && (
          <div className="mb-16">
            <SectionHeader title="Vehicle Inventory" />
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
              {cars.map((car) => (
                <VehicleCard key={car.id} car={car} onEdit={() => { setNewCar(car); setIsEditing(true); setShowModal(true); }} onDelete={() => deleteItem('car', car.id)} onZoom={(idx) => setZoomData({ images: car.images, index: idx })} />
              ))}
            </div>
          </div>
        )}

        {/* Other Tabs... */}
      </main>

      <AnimatePresence>
        {showModal && <CarModal onClose={() => setShowModal(false)} onSubmit={saveCar} car={newCar} setCar={setNewCar} isEditing={isEditing} />}
        {zoomData && <ImageGalleryOverlay data={zoomData} onClose={() => setZoomData(null)} />}
      </AnimatePresence>
    </div>
  );
};

/* ================= REFINED SUB-COMPONENTS ================= */

const SidebarLink = ({ icon, label, active, onClick }) => (
    <button onClick={onClick} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-sm transition-all ${active ? 'bg-indigo-50 text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}>
        <span className={active ? 'text-indigo-600' : 'text-slate-400'}>{icon}</span> {label}
    </button>
);

const StatCard = ({ label, value, icon, color, bg }) => (
  <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between group hover:border-indigo-200 transition-all">
    <div>
      <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.15em] mb-1">{label}</p>
      <p className="text-2xl font-black text-slate-800 tracking-tighter">{value}</p>
    </div>
    <div className={`${bg} ${color} p-4 rounded-2xl text-xl transition-transform group-hover:scale-110`}>{icon}</div>
  </div>
);

const VehicleCard = ({ car, onEdit, onDelete, onZoom }) => {
  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden hover:shadow-xl transition-all group flex flex-col">
      <div className="relative h-56 overflow-hidden bg-slate-100">
        {car.images?.length > 0 ? (
          <>
            <img src={car.images[0]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Car" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <button onClick={() => onZoom(0)} className="p-4 bg-white text-slate-900 rounded-full shadow-xl hover:bg-indigo-600 hover:text-white transition-all transform hover:scale-110"><FaExpand size={16}/></button>
            </div>
            {car.images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-black text-white uppercase tracking-widest">
                +{car.images.length - 1} More Photos
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-slate-200"><FaCar size={40} /></div>
        )}
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="font-black text-lg text-slate-800 leading-tight uppercase tracking-tighter">{car.name}</h3>
          <span className="text-indigo-600 font-black text-sm">R{car.price}</span>
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-slate-50">
          <span className="font-mono text-xs font-bold text-slate-400 uppercase tracking-widest">{car.reg}</span>
          <div className="flex gap-1">
            <button onClick={onEdit} className="p-2 text-slate-300 hover:text-indigo-600 transition-all"><FaEdit size={14}/></button>
            <button onClick={onDelete} className="p-2 text-slate-300 hover:text-red-600 transition-all"><FaTrash size={14}/></button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SectionHeader = ({ title }) => (
  <div className="mb-6">
    <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">{title}</h2>
    <div className="h-1 w-12 bg-indigo-600 mt-1 rounded-full"></div>
  </div>
);

// PROFESSIONAL MULTI-IMAGE OVERLAY
const ImageGalleryOverlay = ({ data, onClose }) => {
  const [idx, setIdx] = useState(data.index);
  const next = (e) => { e.stopPropagation(); setIdx((idx + 1) % data.images.length); };
  const prev = (e) => { e.stopPropagation(); setIdx((idx - 1 + data.images.length) % data.images.length); };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-slate-950/95 z-[100] flex items-center justify-center p-4 lg:p-12 backdrop-blur-2xl">
      <button onClick={onClose} className="absolute top-8 right-8 text-white/40 hover:text-white transition-all z-[110]"><FaTimes size={32}/></button>
      
      <div className="relative w-full max-w-6xl h-full flex items-center justify-center">
        {data.images.length > 1 && (
          <button onClick={prev} className="absolute left-0 lg:-left-20 p-5 bg-white/5 hover:bg-white/10 text-white rounded-full transition-all border border-white/10"><FaChevronLeft size={24}/></button>
        )}
        
        <motion.img 
          key={idx}
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }}
          src={data.images[idx]} 
          className="max-w-full max-h-[80vh] rounded-[2.5rem] shadow-2xl object-contain" 
          alt="Full size vehicle" 
        />

        {data.images.length > 1 && (
          <button onClick={next} className="absolute right-0 lg:-right-20 p-5 bg-white/5 hover:bg-white/10 text-white rounded-full transition-all border border-white/10"><FaChevronRight size={24}/></button>
        )}
      </div>

      <div className="absolute bottom-10 flex gap-3">
        {data.images.map((_, i) => (
          <div key={i} className={`h-1.5 transition-all rounded-full ${i === idx ? 'w-8 bg-indigo-500' : 'w-2 bg-white/20'}`} />
        ))}
      </div>
    </motion.div>
  );
};

const CarModal = ({ onClose, onSubmit, car, setCar, isEditing }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <motion.form initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} onSubmit={onSubmit} className="bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl">
      <div className="p-10 space-y-8">
        <h3 className="text-2xl font-black uppercase tracking-tighter italic">{isEditing ? "Update" : "New"} Vehicle</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <InputGroup label="Model Name" value={car.name} onChange={(v) => setCar({...car, name: v})} placeholder="e.g. BMW M4" />
          <InputGroup label="Plate Number" value={car.reg} onChange={(v) => setCar({...car, reg: v})} placeholder="ND 1234" />
          <InputGroup label="Passenger Capacity" type="number" value={car.seats} onChange={(v) => setCar({...car, seats: v})} />
          <InputGroup label="Price Per Day (R)" type="number" value={car.price} onChange={(v) => setCar({...car, price: v})} />
        </div>
        <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Vehicle Media</label>
            <input type="file" multiple className="w-full text-xs font-bold text-slate-400 file:mr-4 file:py-3 file:px-8 file:rounded-2xl file:border-0 file:bg-slate-100 file:text-indigo-600 hover:file:bg-indigo-50 cursor-pointer" 
              onChange={(e) => {
                const files = Array.from(e.target.files);
                Promise.all(files.map(f => new Promise(res => {
                  const r = new FileReader(); r.onload = () => res(r.result); r.readAsDataURL(f);
                }))).then(imgs => setCar({...car, images: imgs}));
              }} 
            />
        </div>
      </div>
      <div className="bg-slate-50 px-10 py-8 flex gap-4">
        <button type="button" onClick={onClose} className="flex-1 font-black text-slate-400 uppercase text-[10px]">Cancel</button>
        <button className="flex-[2] bg-indigo-600 text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-indigo-200">Save Vehicle</button>
      </div>
    </motion.form>
  </motion.div>
);

const InputGroup = ({ label, type="text", value, onChange, placeholder }) => (
  <div className="flex flex-col gap-2">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">{label}</label>
    <input required type={type} className="bg-slate-100 border-none rounded-2xl px-5 py-4 font-bold text-sm focus:ring-2 focus:ring-indigo-500 transition-all" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
  </div>
);

export default Dashboard;