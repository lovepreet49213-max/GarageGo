import { X } from "lucide-react";

export default function ContactModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      {/* Modal Box */}
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl relative p-6 animate-fadeIn">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          <X />
        </button>

        {/* Header */}
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Contact Us
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          We’ll get back to you shortly 🚗
        </p>

        {/* Form */}
        <form className="space-y-4">
          <input
            type="text"
            placeholder="Your Name"
            className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
          />

          <input
            type="email"
            placeholder="Email Address"
            className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
          />

          <input
            type="tel"
            placeholder="Phone Number"
            className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
          />

          <textarea
            rows="4"
            placeholder="Your Message"
            className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
          />

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold
            hover:bg-indigo-700 transition active:scale-95"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}
