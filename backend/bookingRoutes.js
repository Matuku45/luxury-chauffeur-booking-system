const express = require("express");
const router = express.Router();

// @route GET /api/bookings
// @desc Get all bookings (for admin or client)
router.get("/", (req, res) => {
  res.json({ message: "Get all bookings (admin view)" });
});

// @route GET /api/bookings/:id
// @desc Get single booking by ID
router.get("/:id", (req, res) => {
  const { id } = req.params;
  res.json({ message: `Get booking with ID ${id}` });
});

// @route POST /api/bookings
// @desc Create a new booking (client request)
router.post("/", (req, res) => {
  const bookingData = req.body;
  console.log("Booking submitted:", bookingData);
  res.json({ message: "Booking submitted", bookingData, status: "Pending" });
});

// @route PATCH /api/bookings/:id/approve
// @desc Approve booking (admin)
router.patch("/:id/approve", (req, res) => {
  const { id } = req.params;
  res.json({ message: `Booking ${id} approved`, redirectToPayment: true });
});

// @route PATCH /api/bookings/:id/decline
// @desc Decline booking (admin)
router.patch("/:id/decline", (req, res) => {
  const { id } = req.params;
  res.json({ message: `Booking ${id} declined` });
});

// @route PATCH /api/bookings/:id/payment-confirmation
// @desc Update booking status after payment
router.patch("/:id/payment-confirmation", (req, res) => {
  const { id } = req.params;
  res.json({ message: `Booking ${id} payment confirmed`, status: "Paid" });
});

module.exports = router;
