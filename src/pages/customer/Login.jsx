
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
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
      await login(form.email, form.password);
      navigate("/my-bookings");
    } catch (err) {
      setError(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-8 overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('/garage-login-bg.jpg')",
        }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/65" />

      {/* Decorative Glow */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />

      {/* Content */}
      <div className="relative mb-20 z-10 w-full max-w-md">
        {/* Login Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-white/20">
          {/* Logo */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold tracking-tight text-indigo-600">
              Garage<span className="text-gray-900">Go</span>
            </h1>

            <p className="text-gray-500 mt-2">
              Welcome back, sign in to continue
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 text-red-600 border border-red-200 rounded-lg px-4 py-3 mb-5 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
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
                autoComplete="current-password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-1 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-semibold hover:bg-indigo-700 active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Signing you in..." : "Login"}
            </button>
          </form>

          {/* Register */}
          <div className="mt-7 text-center text-sm text-gray-500">
            New to GarageGo?{" "}
            <Link
              to="/register"
              className="text-indigo-600 font-semibold hover:text-indigo-700 hover:underline"
            >
              Create an account
            </Link>
          </div>

          {/* Admin Login */}
          <div className="mt-4 pt-4 border-t border-gray-100 text-center text-xs text-gray-400">
            Are you an admin?{" "}
            <Link
              to="/admin/login"
              className="text-indigo-600 font-medium hover:underline"
            >
              Admin login
            </Link>
          </div>
        </div>

        {/* Back to Home */}
        <button
          type="button"
          onClick={() => navigate("/")}
          className="mt-5 mx-auto flex items-center gap-2 text-sm text-white/80 hover:text-white transition"
        >
          ← Back to Home
        </button>

        {/* Copyright */}
        <p className="text-center text-xs text-white/50 mt-4">
          © {new Date().getFullYear()} GarageGo. All rights reserved.
        </p>
      </div>
    </div>
  );
}

