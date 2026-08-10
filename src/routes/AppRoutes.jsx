
import { BrowserRouter, Routes, Route } from "react-router-dom";

import CustomerRoutes from "../routes/CustomerRoutes";
import AdminRoutes from "../routes/AdminRoutes";

import CustomerLayout from "../layouts/CustomerLayout";
import AdminLayout from "../layouts/AdminLayout";

import Login from "../pages/admin/Login";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Admin Login - Customer Layout */}
        <Route
          path="/admin/login"
          element={
            <CustomerLayout>
              <Login />
            </CustomerLayout>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/*"
          element={
            <AdminLayout>
              <AdminRoutes />
            </AdminLayout>
          }
        />

        {/* Customer Routes */}
        <Route
          path="/*"
          element={
            <CustomerLayout>
              <CustomerRoutes />
            </CustomerLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

