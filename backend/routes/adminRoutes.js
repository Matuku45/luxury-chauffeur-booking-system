const express = require("express");
const router = express.Router();

// @route GET /api/admin/bookings
// @desc Admin dashboard: view all bookings
router.get("/bookings", (req, res) => {
  res.json({ message: "Admin: list all bookings" });
});

// @route PATCH /api/admin/bookings/:id/approve
// @desc Approve booking (similar to bookingRoutes)
router.patch("/bookings/:id/approve", (req, res) => {
  const { id } = req.params;
  res.json({ message: `Admin approved booking ${id}`, redirectToPayment: true });
});

// @route PATCH /api/admin/bookings/:id/decline
// @desc Decline booking
router.patch("/bookings/:id/decline", (req, res) => {
  const { id } = req.params;
  res.json({ message: `Admin declined booking ${id}` });
});

module.exports = router;
