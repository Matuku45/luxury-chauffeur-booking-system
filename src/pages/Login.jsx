import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  // Dummy credentials for front-end simulation
  const dummyAdmin = {
    name: "Admin User",
    email: "admin@example.com",
    password: "admin123",
    role: "admin",
  };

  const dummyUser = {
    name: "Regular u User",
    email: "user@example.com",
    password: "user123",
    role: "user",
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if credentials match dummy admin/user
    let user = null;
    if (formData.email === dummyAdmin.email && formData.password === dummyAdmin.password) {
      user = dummyAdmin;
    } else if (formData.email === dummyUser.email && formData.password === dummyUser.password) {
      user = dummyUser;
    }

    if (!user) {
      return alert("Invalid credentials!");
    }

    // Send to backend
    try {
      const res = await axios.post("http://localhost:5000/api/users/login", {
        email: user.email,
        password: user.password
      });

      // Save user info
      localStorage.setItem("user", JSON.stringify(res.data.user));
      alert(`Login successful! Welcome ${res.data.user.name}`);

      // Redirect based on role
      if (res.data.user.role === "admin") {
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
