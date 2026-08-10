import React, { useState } from "react";
import { api } from "../../lib/api";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [sending, setSending] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);

    try {
      await api.post("/send-email", form);

      alert("Message sent successfully!");
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (err) {
      alert(err.message || "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-indigo-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold">Contact Us</h1>
          <p className="mt-2 text-lg">
            We’d love to hear from you
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6">
            Send us a message
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="name"
              required
              placeholder="Your Name"
              className="w-full border rounded-lg px-4 py-3"
              value={form.name}
              onChange={handleChange}
            />

            <input
              type="email"
              name="email"
              required
              placeholder="Your Email"
              className="w-full border rounded-lg px-4 py-3"
              value={form.email}
              onChange={handleChange}
            />

            <input
              name="phone"
              placeholder="Phone Number (optional)"
              className="w-full border rounded-lg px-4 py-3"
              value={form.phone}
              onChange={handleChange}
            />

            <input
              name="subject"
              placeholder="Subject (optional)"
              className="w-full border rounded-lg px-4 py-3"
              value={form.subject}
              onChange={handleChange}
            />

            <textarea
              name="message"
              required
              rows="5"
              placeholder="Your Message"
              className="w-full border rounded-lg px-4 py-3"
              value={form.message}
              onChange={handleChange}
            />

            <button
              type="submit"
              disabled={sending}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition font-medium disabled:opacity-60"
            >
              {sending ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
