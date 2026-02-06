import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  // ADMIN + USER credentials from .env
  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
  const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;

  const userEmail = import.meta.env.VITE_USER_EMAIL;
  const userPassword = import.meta.env.VITE_USER_PASSWORD;

  const API_URL = import.meta.env.VITE_API_URL;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let user = null;

    // Check admin
    if (formData.email === adminEmail && formData.password === adminPassword) {
      user = { email: adminEmail, password: adminPassword, role: "admin" };
    }
    // Check normal user
    else if (formData.email === userEmail && formData.password === userPassword) {
      user = { email: userEmail, password: userPassword, role: "user" };
    }

    if (!user) {
      return alert("Invalid credentials!");
    }

    try {
      const res = await axios.post(`${API_URL}/api/users/login`, {
        email: user.email,
        password: user.password,
      });

      localStorage.setItem("user", JSON.stringify(res.data.user));
      alert(`Login successful! Welcome ${res.data.user.name}`);

      if (user.role === "admin") {
        navigate("/dashboard");
      } else {
        navigate("/booking");
      }
    } catch (error) {
      alert("Something went wrong. Backend might not be running.");
    }
  };

  return (
    <section className="flex justify-center items-center min-h-screen bg-slate-100 px-6">
      <div className="bg-white shadow-md rounded-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Login</h1>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block mb-1 font-semibold">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
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
              className="w-full border rounded-lg p-2"
              required
            />
          </div>

          <button type="submit" className="luxury-button w-full mt-4">
            Login
          </button>
        </form>
      </div>
    </section>
  );
};

export default Login;