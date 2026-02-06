import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  // ADMIN credentials from .env
  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
  const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;

  // USER credentials from .env
  const userEmail = import.meta.env.VITE_USER_EMAIL;
  const userPassword = import.meta.env.VITE_USER_PASSWORD;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let loggedUser = null;

    // Admin login
    if (formData.email === adminEmail && formData.password === adminPassword) {
      loggedUser = {
        name: "Admin",
        email: adminEmail,
        role: "admin",
      };
    }

    // User login
    else if (formData.email === userEmail && formData.password === userPassword) {
      loggedUser = {
        name: "User",
        email: userEmail,
        role: "user",
      };
    }

    // Invalid login
    if (!loggedUser) {
      return alert("Invalid email or password!");
    }

    // Save user to localStorage
    localStorage.setItem("user", JSON.stringify(loggedUser));

    alert(`Login successful! Welcome ${loggedUser.name}`);

    // Redirect based on role
    if (loggedUser.role === "admin") {
      navigate("/dashboard");
    } else {
      navigate("/booking");
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