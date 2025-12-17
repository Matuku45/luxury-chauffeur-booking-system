import React, { useState } from "react";

const Booking = () => {
  const [formData, setFormData] = useState({
    eventType: "Matric Dance",
    pickUpDate: "",
    pickUpTime: "",
    pickUpLocation: "",
    destination: "",
    duration: "4 hours",
    passengers: 1,
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    specialRequests: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Booking Submitted:", formData);
    alert("Booking request submitted! Admin will review your request.");
    // TODO: Send formData to backend API
  };

  return (
    <section className="max-w-3xl mx-auto px-6 pt-32 pb-20">
      <h1 className="text-4xl font-bold mb-6">Request a Booking</h1>

      <p className="mb-6">
        Fill out the form below to request a luxury chauffeur for your event.
        Our team will review and confirm availability.
      </p>

      <form
        className="bg-white shadow-md rounded-xl p-6 space-y-4"
        onSubmit={handleSubmit}
      >
        {/* Event Type */}
        <div>
          <label className="block mb-1 font-semibold">Event Type</label>
          <select
            name="eventType"
            value={formData.eventType}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          >
            <option>Matric Dance</option>
            <option>Wedding</option>
          </select>
        </div>

        {/* Date & Time */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block mb-1 font-semibold">Pick-up Date</label>
            <input
              type="date"
              name="pickUpDate"
              value={formData.pickUpDate}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
            />
          </div>
          <div className="flex-1">
            <label className="block mb-1 font-semibold">Pick-up Time</label>
            <input
              type="time"
              name="pickUpTime"
              value={formData.pickUpTime}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
            />
          </div>
        </div>

        {/* Locations */}
        <div>
          <label className="block mb-1 font-semibold">Pick-up Location</label>
          <input
            type="text"
            name="pickUpLocation"
            value={formData.pickUpLocation}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Destination</label>
          <input
            type="text"
            name="destination"
            value={formData.destination}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          />
        </div>

        {/* Duration & Passengers */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block mb-1 font-semibold">Duration</label>
            <select
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
            >
              <option>2 hours</option>
              <option>4 hours</option>
              <option>Full Evening</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block mb-1 font-semibold">Number of Passengers</label>
            <input
              type="number"
              name="passengers"
              value={formData.passengers}
              min={1}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
            />
          </div>
        </div>

        {/* Client Info */}
        <div>
          <label className="block mb-1 font-semibold">Your Name</label>
          <input
            type="text"
            name="clientName"
            value={formData.clientName}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Email</label>
          <input
            type="email"
            name="clientEmail"
            value={formData.clientEmail}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Phone Number</label>
          <input
            type="tel"
            name="clientPhone"
            value={formData.clientPhone}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          />
        </div>

        {/* Special Requests */}
        <div>
          <label className="block mb-1 font-semibold">Special Requests</label>
          <textarea
            name="specialRequests"
            value={formData.specialRequests}
            onChange={handleChange}
            placeholder="e.g., red carpet, ribbons, photo stops"
            className="w-full border rounded-lg p-2"
            rows={4}
          ></textarea>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="luxury-button w-full mt-4"
        >
          Submit Booking Request
        </button>
      </form>
    </section>
  );
};

export default Booking;
