import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { LayoutDashboard } from "lucide-react";

const navLinkClass = ({ isActive }) =>
  `block text-lg font-medium px-3 py-3 rounded-xl transition ${
    isActive ? "after:w-full text-indigo-300" : "after:w-0"
  }`;

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 bg-gray-900 bg-opacity-95 shadow-md">
      <div className="header-top py-2 bg-indigo-600 text-white text-center text-sm">
        <div className="template-ad flex items-center justify-center gap-2">
          <img src="/badge-icon.svg" alt="icon" />
          <h5>No 1, Website to Buy / Sell </h5>
          <img src="/car-1.png" alt="icon" />
          <h5>
            <span>First Listing Free!!!</span>
          </h5>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center text-white">
        {/* Logo */}
        <NavLink to="/" className="text-2xl font-bold flex items-center">
          <img src="/logo.png" className="h-10 w-10" alt="GarageGo" />
          Garage<span className="text-indigo-300">Go</span>
        </NavLink>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6 text-sm items-center">
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>

          <NavLink to="/about" className={navLinkClass}>
            About Us
          </NavLink>

          <NavLink to="/garages" className={navLinkClass}>
            Listing
          </NavLink>

          <NavLink to="/contact" className={navLinkClass}>
            Contact
          </NavLink>

          {user ? (
            <>
              <NavLink to="/my-bookings" className={navLinkClass}>
                My Bookings
              </NavLink>
              {isAdmin && (
                <NavLink to="/admin" className={navLinkClass}>
                  <span className="flex items-center gap-1">
                    <LayoutDashboard size={16} /> Admin
                  </span>
                </NavLink>
              )}
              <button
                onClick={handleLogout}
                className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate("/login")}
                className="px-4 py-2 rounded-lg hover:bg-gray-800 transition"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/admin/login")}
                className="bg-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-700"
              >
                Admin Login
              </button>
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setOpen((prev) => !prev)}>
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <>
          <div
            className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="md:hidden fixed inset-x-0 top-[72px] z-40">
            <div className="mx-4 rounded-2xl bg-gray-900 text-white shadow-2xl px-6 py-6 space-y-6 animate-slideDown">
              <div className="space-y-4">
                <NavLink to="/" className={navLinkClass} onClick={() => setOpen(false)}>
                  Home
                </NavLink>
                <NavLink to="/about" className={navLinkClass} onClick={() => setOpen(false)}>
                  About Us
                </NavLink>
                <NavLink to="/garages" className={navLinkClass} onClick={() => setOpen(false)}>
                  Listing
                </NavLink>
                <NavLink to="/contact" className={navLinkClass} onClick={() => setOpen(false)}>
                  Contact
                </NavLink>
                {user && (
                  <NavLink to="/my-bookings" className={navLinkClass} onClick={() => setOpen(false)}>
                    My Bookings
                  </NavLink>
                )}
              </div>

              <div className="h-px bg-gray-700" />

              {user ? (
                <div className="space-y-3">
                  {isAdmin && (
                    <button
                      onClick={() => {
                        setOpen(false);
                        navigate("/admin");
                      }}
                      className="w-full bg-indigo-600 py-3 rounded-xl text-lg font-semibold hover:bg-indigo-700 transition shadow-md"
                    >
                      Admin Dashboard
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setOpen(false);
                      handleLogout();
                    }}
                    className="w-full bg-red-500 py-3 rounded-xl text-lg font-semibold hover:bg-red-600 transition shadow-md"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      setOpen(false);
                      navigate("/login");
                    }}
                    className="w-full bg-gray-800 border border-gray-700 py-3 rounded-xl text-lg font-semibold hover:bg-gray-700 transition"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      setOpen(false);
                      navigate("/admin/login");
                    }}
                    className="w-full bg-indigo-600 py-3 rounded-xl text-lg font-semibold hover:bg-indigo-700 transition shadow-md"
                  >
                    Admin Login
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </header>
  );
}
