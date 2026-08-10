import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Warehouse,
  Calendar,
  Users,
  LogOut,
  Home,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import Sidebar from "../components/Sidebar";

export default function AdminLayout({ children }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

 

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Mobile Overlay */}
      {open && <div className="fixed inset-0 bg-black/40 z-30 md:hidden" onClick={() => setOpen(false)} />}

      {/* Sidebar */}
      <aside
  className={`fixed md:static z-40 w-64 bg-black/80 shadow-lg h-screen flex flex-col
  transform transition-transform duration-300
  ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
>
  <Sidebar
    sidebarOpen={open}
    setSidebarOpen={setOpen}
  />

  {/* Logout */}
  <div className="px-4 py-4 mt-4 border-t">
    <button
      onClick={handleLogout}
      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition"
    >
      <LogOut size={18} />
      Logout
    </button>
  </div>
</aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <header className=" sticky top-0 z-20 md:hidden bg-white shadow px-4 py-3 flex items-center">
          <button onClick={() => setOpen(true)} className="text-gray-700">
            <Menu />
          </button>
         
          
    <div className="flex items-center justify-between w-full px-4 py-3 bg-white border-b border-gray-200">
  {/* Left */}
  <h2 className="text-base font-semibold text-gray-800">
    Menu
  </h2>

  {/* Right */}
  <img
    src="/logo.png"
    alt="Profile"
    className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-500/40"
  />
</div>

        </header>

        <main className="flex-1 p-4 md:p-8 overflow-y-auto">{children}</main>
      </div>


        
    </div>
  );
}
        