import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";

// Pages
import Home from "./pages/Home";
import MatricDances from "./pages/MatricDances";
import Weddings from "./pages/Weddings";
import Vehicles from "./pages/Vehicles";
import Booking from "./pages/Booking";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />

        <main className="flex-grow pt-24">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/matric-dances" element={<MatricDances />} />
            <Route path="/weddings" element={<Weddings />} />
            <Route path="/vehicles" element={<Vehicles />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
