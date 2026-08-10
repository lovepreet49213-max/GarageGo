
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      await register(form);
      navigate("/my-bookings");
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-8  overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/garage-login-bg.jpg')",
        }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/65" />

      {/* Background Glow */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />

      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />

      {/* Content */}
      <div className="relative mb-20 z-10 w-full max-w-md">
        {/* Register Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-4 border border-white/20">
          {/* Logo */}
          <div className="text-center mb-7">
            <h1 className="text-4xl font-extrabold tracking-tight text-indigo-600">
              Garage<span className="text-gray-900">Go</span>
            </h1>

            <p className="text-gray-500 mt-2">
              Create your GarageGo account
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 text-red-600 border border-red-200 rounded-lg px-4 py-3 mb-5 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>

              <input
                type="text"
                name="name"
                required
                autoComplete="name"
                placeholder="Enter your full name"
                value={form.name}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-1 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>

              <input
                type="tel"
                name="phone"
                autoComplete="tel"
                placeholder="Enter your phone number"
                value={form.phone}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-1 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>

              <input
                type="email"
                name="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-1 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>

              <input
                type="password"
                name="password"
                required
                autoComplete="new-password"
                placeholder="Create a password"
                value={form.password}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-1 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
            </div>

            {/* Create Account */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-1 rounded-xl font-semibold hover:bg-indigo-700 active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          {/* Login */}
          <div className="mt-7 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-indigo-600 font-semibold hover:text-indigo-700 hover:underline"
            >
              Login
            </Link>
          </div>

       

         
        </div>

       

      
      </div>
    </div>
  );
}

