
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { adminLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      await adminLogin(email, password);
      navigate("/admin");
    } catch (err) {
      setError(err.message || "Login failed");
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
          backgroundImage: "url('/garage-login-bg.jpg')",
        }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/75" />

      {/* Background Glow */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />

      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />

      {/* Content */}
      <div className="relative mb-20 z-10 w-full max-w-md">
        {/* Login Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-white/20">
          {/* Logo */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold tracking-tight text-indigo-600">
              Garage<span className="text-gray-900">Go</span>
            </h1>

            {/* Admin Badge */}
            <div className="inline-flex items-center mt-4 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-semibold">
              ADMIN PORTAL
            </div>

            <p className="text-gray-500 mt-3">
              Login to manage garages and bookings
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
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Admin Email
              </label>

              <input
                type="email"
                name="email"
                autoComplete="username"
                className="w-full border border-gray-200 rounded-xl px-4 py-3.5 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                placeholder="admin@garagego.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Password
              </label>

              <input
                type="password"
                name="password"
                autoComplete="current-password"
                className="w-full border border-gray-200 rounded-xl px-4 py-3.5 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-semibold hover:bg-indigo-700 active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Authenticating..." : "Admin Login"}
            </button>
          </form>

          {/* Back to Customer Login */}
          <div className="mt-6 text-center text-sm text-gray-500">
            Not an admin?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-indigo-600 font-semibold hover:text-indigo-700 hover:underline"
            >
              Customer Login
            </button>
          </div>


        </div>

        {/* Copyright */}
        <p className="text-center text-xs text-white/50 mt-5">
          © {new Date().getFullYear()} GarageGo. All rights reserved.
        </p>
      </div>
    </div>
  );
}

