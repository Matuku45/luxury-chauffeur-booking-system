// app.js
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const session = require("express-session");

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// ---------------- SESSION SETUP ----------------
app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecretkey",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 2 }, // 2 hours
  })
);

// ---------------- IMPORT ROUTERS ----------------
const adminRoutes = require("./adminRoutes");
const bookingRoutes = require("./bookingRoutes");
const userRoutes = require("./userRoutes");
const paymentRoutes = require("./payment");

// ---------------- ROUTES ----------------
app.use("/api/admin", adminRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/users", userRoutes);
app.use("/api/payments", paymentRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("Luxury Chauffeur Backend is running!");
});

// ---------------- START SERVER ----------------
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
