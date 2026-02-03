const express = require("express");
const router = express.Router();
const mysql = require("mysql2/promise"); // Make sure mysql2 is installed

// ------------------- MySQL Connection -------------------
const dbConfig = {
  host: "localhost",           // If Node.js runs on Afrihost, use "localhost"
  user: "matrici3g0q5_Kgabo", // Your DB username
  password: "YourPasswordHere",// Your DB password
  database: "matrici3g0q5_My-Shutle",
  port: 3306
};

// Helper function to get a connection
async function getConnection() {
  const connection = await mysql.createConnection(dbConfig);
  return connection;
}

// ------------------- ROUTES -------------------

// GET all bookings
router.get("/", async (req, res) => {
  try {
    const conn = await getConnection();
    const [rows] = await conn.query("SELECT * FROM bookings");
    await conn.end();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET single booking by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const conn = await getConnection();
    const [rows] = await conn.query("SELECT * FROM bookings WHERE id = ?", [id]);
    await conn.end();

    if (rows.length === 0) return res.status(404).json({ message: "Booking not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// CREATE a new booking
router.post("/", async (req, res) => {
  try {
    const {
      client_first_name,
      client_last_name,
      car_type,
      car_registration,
      pickup_date,
      pickup_location,
      final_location,
      reason,
      phone,
      price
    } = req.body;

    const conn = await getConnection();
    const [result] = await conn.query(
      `INSERT INTO bookings 
      (client_first_name, client_last_name, car_type, car_registration, pickup_date, pickup_location, final_location, reason, phone, price)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [client_first_name, client_last_name, car_type, car_registration, pickup_date, pickup_location, final_location, reason, phone, price]
    );
    await conn.end();

    res.status(201).json({ message: "Booking submitted", bookingId: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// APPROVE booking
router.patch("/:id/approve", async (req, res) => {
  try {
    const { id } = req.params;
    const conn = await getConnection();
    const [result] = await conn.query(
      "UPDATE bookings SET status = 'Confirmed' WHERE id = ?",
      [id]
    );
    await conn.end();

    if (result.affectedRows === 0) return res.status(404).json({ message: "Booking not found" });
    res.json({ message: `Booking ${id} approved`, redirectToPayment: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// DECLINE booking
router.patch("/:id/decline", async (req, res) => {
  try {
    const { id } = req.params;
    const conn = await getConnection();
    const [result] = await conn.query(
      "UPDATE bookings SET status = 'Declined' WHERE id = ?",
      [id]
    );
    await conn.end();

    if (result.affectedRows === 0) return res.status(404).json({ message: "Booking not found" });
    res.json({ message: `Booking ${id} declined` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// PAYMENT CONFIRMATION
router.patch("/:id/payment-confirmation", async (req, res) => {
  try {
    const { id } = req.params;
    const conn = await getConnection();
    const [result] = await conn.query(
      "UPDATE bookings SET status = 'Paid' WHERE id = ?",
      [id]
    );
    await conn.end();

    if (result.affectedRows === 0) return res.status(404).json({ message: "Booking not found" });
    res.json({ message: `Booking ${id} payment confirmed` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
