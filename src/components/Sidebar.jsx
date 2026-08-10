import {
  LayoutDashboard,
  Warehouse,
  CalendarCheck,
  Users,
  BadgeCheck,
  X,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const linkClass = ({ isActive }) =>
  `flex items-center justify-between px-3 py-2 rounded-lg transition
   ${
     isActive
       ? "bg-indigo-600 text-white"
       : "text-gray-300 hover:bg-gray-800 hover:text-white"
   }`;

export default function Sidebar({
  sidebarOpen,
  setSidebarOpen,
}) {
  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
        />
      )}

      {/* Sidebar */}
    
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-800 flex justify-between items-center">
        <div className="flex items-center gap-3">
  <NavLink to="/" className="flex items-center gap-3">
    {/* Logo */}
    <img src="/logo.png" className="h-10 w-10" alt="GarageGo" />

    {/* Text */}
    <div className="leading-tight">
      <h1 className="text-xl font-bold text-indigo-600">
        Garage<span className="text-gray-300">Go</span>
      </h1>
      <p className="text-xs text-gray-400">Admin Panel</p>
    </div>
  </NavLink>
</div>


          {/* Close (mobile) */}
        {/* <button
  onClick={() => setSidebarOpen(false)}
  className=" p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition"
  aria-label="Close sidebar"
>
  <X size={20} />
</button> */}

        </div>

        {/* Navigation */}
        <nav className="space-y-2 mt-6 px-3">
          <NavLink to="/admin" end className={linkClass}
            onClick={() => setSidebarOpen(false)}

          >
            <span className="flex items-center gap-3">
              <LayoutDashboard size={18} />
              Dashboard
            </span>
          </NavLink>

          <NavLink to="/admin/garages" className={linkClass} onClick={() => setSidebarOpen(false)}>
            <span className="flex items-center gap-3">
              <Warehouse size={18} />
              Garages
            </span>
          </NavLink>

          {/* Bookings with badge */}
          <NavLink to="/admin/bookings" className={linkClass} onClick={() => setSidebarOpen(false)}>
            <span className="flex items-center gap-3">
              <CalendarCheck size={18} />
              Bookings
            </span>
            <span className="bg-red-500 text-xs px-2 py-0.5 rounded-full">
              3
            </span>
          </NavLink>

          <NavLink to="/admin/users" className={linkClass} onClick={() => setSidebarOpen(false)}>
            <span className="flex items-center gap-3">
              <Users size={18} />
              Users
            </span>
          </NavLink>

        </nav>
      
    </>
  );
}
