import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const FIREBASE_URL = import.meta.env.VITE_DATABASE_URL || "https://roomap-aa517-default-rtdb.firebaseio.com/";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    setLoading(true);

    try {
      // Fetch existing users
      const res = await fetch(`${FIREBASE_URL}users.json`);
      const users = await res.json() || {};

      // Check for duplicate email
      if (Object.values(users).some(u => u.email === formData.email)) {
        alert("Email already registered!");
        setLoading(false);
        return;
      }

      // Save new user
      const newUser = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password, // NOTE: hash in production
        role: "user",
        createdAt: new Date().toISOString(),
      };

      await fetch(`${FIREBASE_URL}users.json`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      alert("✅ Signup successful!");
      navigate("/login");

    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Seed admin if not exists
  useEffect(() => {
    const seedAdmin = async () => {
      const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
      const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;

      if (!adminEmail || !adminPassword) return;

      try {
        const res = await fetch(`${FIREBASE_URL}users.json`);
        const users = await res.json() || {};

        if (!Object.values(users).some(u => u.email === adminEmail)) {
          await fetch(`${FIREBASE_URL}users.json`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: "Admin",
              email: adminEmail,
              phone: "0000000000",
              password: adminPassword,
              role: "admin",
              createdAt: new Date().toISOString(),
            }),
          });
          console.log("✅ Admin seeded");
        }
      } catch (err) {
        console.error("Failed to seed admin:", err);
      }
    };

    seedAdmin();
  }, []);

  return (
    <section className="flex justify-center items-center min-h-screen bg-slate-900 px-6">
      <div className="bg-slate-800 shadow-lg rounded-xl p-8 w-full max-w-md text-white">
        <h1 className="text-3xl font-bold mb-6 text-center text-yellow-400">Sign Up</h1>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block mb-1 font-semibold">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-slate-600 rounded-lg p-2 bg-slate-700 text-white"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-slate-600 rounded-lg p-2 bg-slate-700 text-white"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border border-slate-600 rounded-lg p-2 bg-slate-700 text-white"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-slate-600 rounded-lg p-2 bg-slate-700 text-white"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full border border-slate-600 rounded-lg p-2 bg-slate-700 text-white"
              required
            />
          </div>

          <button
            type="submit"
            className="luxury-button w-full mt-4 bg-yellow-400 text-slate-900 font-bold hover:bg-yellow-300 transition"
            disabled={loading}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-300">
          Already have an account?{" "}
          <Link to="/login" className="text-yellow-400 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Signup;