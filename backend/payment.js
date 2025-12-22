const express = require("express");
const router = express.Router();

// ------------------- Dummy Payments Data -------------------
let payments = [
  {
    id: 1,
    user: "John Doe",
    bookingId: 1,
    amount: 500,
    status: "Paid", // Paid, Pending, Refunded
  },
  {
    id: 2,
    user: "Jane Smith",
    bookingId: 2,
    amount: 450,
    status: "Pending",
  },
  {
    id: 3,
    user: "Alice Johnson",
    bookingId: 3,
    amount: 400,
    status: "Refunded",
  },
];

// ------------------- ROUTES -------------------

// GET all payments
router.get("/", (req, res) => {
  res.json(payments);
});

// GET single payment by ID
router.get("/:id", (req, res) => {
  const { id } = req.params;
  const payment = payments.find(p => p.id == id);
  if (!payment) return res.status(404).json({ message: "Payment not found" });
  res.json(payment);
});

// CREATE a new payment
router.post("/", (req, res) => {
  const newPayment = {
    id: payments.length + 1,
    ...req.body,
  };
  payments.push(newPayment);
  res.status(201).json({ message: "Payment created", payment: newPayment });
});

// UPDATE payment status
router.patch("/:id", (req, res) => {
  const { id } = req.params;
  const payment = payments.find(p => p.id == id);
  if (!payment) return res.status(404).json({ message: "Payment not found" });

  const { status, amount } = req.body;
  if (status) payment.status = status;
  if (amount) payment.amount = amount;

  res.json({ message: `Payment ${id} updated`, payment });
});

// DELETE payment
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const index = payments.findIndex(p => p.id == id);
  if (index === -1) return res.status(404).json({ message: "Payment not found" });

  payments.splice(index, 1);
  res.json({ message: `Payment ${id} deleted` });
});

module.exports = router;
