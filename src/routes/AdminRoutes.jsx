import { Routes, Route, Navigate } from "react-router-dom";

import AdminDashboard from "../pages/admin/AdminDashboard";
import ManageGarages from "../pages/admin/ManageGarages";
import Bookings from "../pages/admin/Bookings";
import Users from "../pages/admin/Users";
import AddGarage from "../pages/admin/AddGarage";
import { useAuth } from "../context/AuthContext";

export default function AdminRoutes() {
  const { isAdmin } = useAuth();

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <Routes>
      <Route path="/" element={<AdminDashboard />} />
      <Route path="/garages" element={<ManageGarages />} />
      <Route path="/bookings" element={<Bookings />} />
      <Route path="/users" element={<Users />} />
      <Route path="/add-garage" element={<AddGarage />} />
    </Routes>
  );
}
