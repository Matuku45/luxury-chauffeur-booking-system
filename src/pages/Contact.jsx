import React, { useState } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Contact Submitted:", formData);
    alert("Thank you for reaching out! We will get back to you shortly.");
    // TODO: send formData to backend or email API
  };

  return (
    <section className="max-w-3xl mx-auto px-6 pt-32 pb-20">
      <h1 className="text-4xl font-bold mb-6">Contact Us</h1>

      <p className="mb-6">
        Have a question or special request? Fill out the form below and our team
        will respond as soon as possible.
      </p>

      <form
        className="bg-white shadow-md rounded-xl p-6 space-y-4"
        onSubmit={handleSubmit}
      >
        {/* Name */}
        <div>
          <label className="block mb-1 font-semibold">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
            required
          />
        </div>

        {/* Email */}
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

        {/* Phone */}
        <div>
          <label className="block mb-1 font-semibold">Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          />
        </div>

        {/* Message */}
        <div>
          <label className="block mb-1 font-semibold">Message</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
            rows={5}
            placeholder="Write your message here..."
            required
          ></textarea>
        </div>

        {/* Submit Button */}
        <button type="submit" className="luxury-button w-full mt-4">
          Send Message
        </button>
      </form>

      {/* Optional Contact Info */}
      <div className="mt-10 text-center text-slate-700">
        <p>📧 Email: info@luxurychauffeur.com</p>
        <p>📞 Phone: +27 123 456 789</p>
      </div>
    </section>
  );
};

export default Contact;
