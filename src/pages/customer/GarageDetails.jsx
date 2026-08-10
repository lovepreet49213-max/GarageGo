import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  Car,
  Clock,
  Warehouse,
  Zap,
  X,
  Lock,
  Wrench,
  Fan,
  MapPin,
} from "lucide-react";
import { api, formatPrice } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";

function amenityIcon(label) {
  const text = (label || "").toLowerCase();
  if (text.includes("cctv") || text.includes("secur")) return ShieldCheck;
  if (text.includes("wash") || text.includes("clean")) return Car;
  if (text.includes("24/7") || text.includes("24x7") || text.includes("access"))
    return Clock;
  if (text.includes("cover")) return Warehouse;
  if (text.includes("ev") || text.includes("charge") || text.includes("electric"))
    return Zap;
  if (text.includes("lock")) return Lock;
  if (text.includes("repair") || text.includes("mechanic")) return Wrench;
  if (text.includes("vent")) return Fan;
  return MapPin;
}

/* ---------------- Booking Modal ---------------- */
function BookingModal({ onClose, garage }) {
  const { user, isAuthenticated } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    email: user?.email || "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await api.post("/bookings", {
        garageId: garage.id,
        customerName: form.name,
        customerPhone: form.phone,
        customerEmail: form.email,
        message: form.message,
      });

      alert(isAuthenticated
        ? "Booking request sent! View it under My Bookings."
        : "Booking request sent successfully!");
      onClose();
    } catch (err) {
      alert(err.message || "Failed to send booking request");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
        >
          <X />
        </button>

        <h2 className="text-2xl font-bold mb-1">
          Book {garage.name}
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Send a booking request to the garage owner
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            required
            placeholder="Your Name"
            value={form.name}
            className="w-full border rounded-lg px-4 py-3"
            onChange={handleChange}
          />
          <input
            name="phone"
            required
            placeholder="Phone Number"
            value={form.phone}
            className="w-full border rounded-lg px-4 py-3"
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            required
            placeholder="Email Address"
            value={form.email}
            className="w-full border rounded-lg px-4 py-3"
            onChange={handleChange}
          />
          <textarea
            name="message"
            rows="4"
            placeholder="Message (optional)"
            value={form.message}
            className="w-full border rounded-lg px-4 py-3"
            onChange={handleChange}
          />

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition font-medium disabled:opacity-60"
          >
            {submitting ? "Sending..." : "Send Booking Request"}
          </button>
          {!isAuthenticated && (
            <p className="text-xs text-gray-400 text-center">
              You'll receive confirmation by email.{" "}
              <span
                className="text-indigo-600 cursor-pointer hover:underline"
                onClick={onClose}
              >
                Log in
              </span>{" "}
              to track your booking.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

/* ---------------- Garage Details Page ---------------- */
export default function GarageDetails() {
  const { id } = useParams();
  return <GarageDetailsInner key={id} id={id} />;
}

function GarageDetailsInner({ id }) {
  const navigate = useNavigate();
  const [openBooking, setOpenBooking] = useState(false);
  const [garage, setGarage] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;

    api
      .get(`/garages/${id}`)
      .then((data) => {
        if (!cancelled) setGarage(data.garage);
      })
      .catch(() => {
        if (!cancelled) setNotFound(true);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  const loading = !garage && !notFound;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading garage...
      </div>
    );
  }

  if (notFound || !garage) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-500">
        <p className="mb-4">Garage not found.</p>
        <button
          onClick={() => navigate("/garages")}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg"
        >
          Back to Garages
        </button>
      </div>
    );
  }

  const amenities = (garage.amenities || []).map((label) => ({
    label,
    icon: amenityIcon(label),
  }));

  const images =
    garage.images && garage.images.length
      ? garage.images
      : [garage.image || "/garage1.jpg"];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <button
          onClick={() => navigate(-1)}
          className="text-indigo-600 hover:underline"
        >
          ← Back to Garages
        </button>
      </div>

      {/* Main Card */}
      <div className="max-w-7xl mx-auto px-6 py-8 bg-white rounded-xl shadow-lg">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Images */}
          <div className="grid gap-4">
            {images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={garage.name}
                onError={(e) => (e.currentTarget.src = "/garage1.jpg")}
                className="w-full h-64 object-cover rounded-lg"
              />
            ))}
          </div>

          {/* Details */}
          <div className="flex flex-col justify-between">
            <div>
              <h1 className="text-3xl font-bold">{garage.name}</h1>
              <p className="text-gray-600 mt-1">
                {garage.address || garage.location}
              </p>
              {garage.distance !== undefined && (
                <p className="text-sm text-gray-500 mt-1">
                  {garage.distance} km away
                </p>
              )}

              <span
                className={`inline-block mt-3 px-3 py-1 rounded-full text-sm font-semibold ${
                  garage.type === "Rent"
                    ? "bg-green-100 text-green-800"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                {garage.type}
              </span>

              <p className="mt-4 text-gray-700">
                {garage.description ||
                  "Secure garage space available for " + garage.type.toLowerCase() + "."}
              </p>

              <p className="mt-4 text-2xl font-bold text-indigo-600">
                {formatPrice(garage.price, garage.currency)}
                {garage.type === "Rent" ? " / month" : ""}
              </p>

              {/* Amenities */}
              {amenities.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-xl font-semibold mb-4">
                    Amenities
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {amenities.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 bg-gray-50 border rounded-lg px-4 py-3 hover:shadow-md transition"
                      >
                        <item.icon className="w-5 h-5 text-indigo-600" />
                        <span className="text-sm font-medium text-gray-700">
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="mt-8 flex gap-4">
              <button
                onClick={() => setOpenBooking(true)}
                className="flex-1 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition font-medium"
              >
                Book Garage
              </button>
              <button
                onClick={() => navigate("/contact")}
                className="flex-1 border border-indigo-600 text-indigo-600 py-3 rounded-lg hover:bg-indigo-50 transition font-medium"
              >
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Map */}
      {garage.latitude && garage.longitude && (
        <div className="max-w-7xl mx-auto px-6 py-12">
          <h2 className="text-2xl font-bold mb-4">Location</h2>
          <div className="w-full h-96 rounded-lg overflow-hidden shadow-lg">
            <iframe
              title="Garage Location"
              width="100%"
              height="100%"
              loading="lazy"
              allowFullScreen
              src={`https://www.google.com/maps?q=${garage.latitude},${garage.longitude}&z=15&output=embed`}
            ></iframe>
          </div>
        </div>
      )}

      {/* Booking Popup */}
      {openBooking && (
        <BookingModal
          onClose={() => setOpenBooking(false)}
          garage={garage}
        />
      )}
    </div>
  );
}
