const express = require("express");
const router = express.Router();

// ------------------- Dummy Bookings Data -------------------
let bookings = [
  {
    id: 1,
    clientName: "John Doe",
    clientEmail: "john@example.com",
    clientPhone: "1234567890",
    carName: "Mercedes S-Class",
    carRegNumber: "ABC123XYZ",
    price: 500,
    purpose: "Wedding",
    pickUpDate: "2025-12-25",
    pickUpTime: "10:00",
    duration: "4 hours",
    passengers: 4,
    pickUpLocation: "Johannesburg",
    destination: "Pretoria",
    specialRequests: "Red carpet, ribbons",
    status: "Pending",
    confirmed: false,
  },
  {
    id: 2,
    clientName: "Jane Smith",
    clientEmail: "jane@example.com",
    clientPhone: "0987654321",
    carName: "BMW 7 Series",
    carRegNumber: "XYZ987ABC",
    price: 450,
    purpose: "Corporate Event",
    pickUpDate: "2025-12-28",
    pickUpTime: "14:00",
    duration: "2 hours",
    passengers: 2,
    pickUpLocation: "Sandton",
    destination: "Midrand",
    specialRequests: "Water bottles and snacks",
    status: "Pending",
    confirmed: false,
  },
];

// ------------------- ROUTES -------------------

// GET all bookings
router.get("/", (req, res) => {
  res.json(bookings);
});

// GET single booking by ID
router.get("/:id", (req, res) => {
  const { id } = req.params;
  const booking = bookings.find(b => b.id == id);
  if (!booking) return res.status(404).json({ message: "Booking not found" });
  res.json(booking);
});

// CREATE a new booking
router.post("/", (req, res) => {
  const newBooking = {
    id: bookings.length + 1,
    ...req.body,
    status: "Pending",
    confirmed: false,
  };
  bookings.push(newBooking);
  res.status(201).json({ message: "Booking submitted", booking: newBooking });
});

// APPROVE booking
router.patch("/:id/approve", (req, res) => {
  const { id } = req.params;
  const booking = bookings.find(b => b.id == id);
  if (!booking) return res.status(404).json({ message: "Booking not found" });

  booking.status = "Confirmed";
  booking.confirmed = true;
  res.json({ message: `Booking ${id} approved`, booking, redirectToPayment: true });
});

// DECLINE booking
router.patch("/:id/decline", (req, res) => {
  const { id } = req.params;
  const booking = bookings.find(b => b.id == id);
  if (!booking) return res.status(404).json({ message: "Booking not found" });

  booking.status = "Declined";
  booking.confirmed = false;
  res.json({ message: `Booking ${id} declined`, booking });
});

// PAYMENT CONFIRMATION
router.patch("/:id/payment-confirmation", (req, res) => {
  const { id } = req.params;
  const booking = bookings.find(b => b.id == id);
  if (!booking) return res.status(404).json({ message: "Booking not found" });

  booking.status = "Paid";
  res.json({ message: `Booking ${id} payment confirmed`, booking });
});

module.exports = router;
