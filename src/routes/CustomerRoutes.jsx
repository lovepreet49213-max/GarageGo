import { Routes, Route } from "react-router-dom";

import Home from "../pages/customer/Home";
import GarageList from "../pages/customer/GarageList";
import GarageDetails from "../pages/customer/GarageDetails";
import About from "../pages/customer/About";
import Contact from "../pages/customer/Contact";
import Auth from "../pages/customer/Auth";
import MyBookings from "../pages/customer/MyBookings";

export default function CustomerRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/garages" element={<GarageList />} />
      <Route path="/garage/:id" element={<GarageDetails />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Auth />} />
      <Route path="/register" element={<Auth initialMode="register" />} />
      <Route path="/my-bookings" element={<MyBookings />} />
    </Routes>
  );
}
