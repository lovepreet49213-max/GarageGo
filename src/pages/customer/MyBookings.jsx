import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, formatPrice } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";

const statusColor = (status) => {
  if (status === "Confirmed") return "bg-green-100 text-green-700";
  if (status === "Pending") return "bg-yellow-100 text-yellow-700";
  return "bg-red-100 text-red-700";
};

export default function MyBookings() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    let cancelled = false;
    api
      .get("/bookings")
      .then((data) => {
        if (!cancelled) setBookings(data.bookings);
        console.log("Fetched bookings:", data.bookings);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Failed to load bookings");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, navigate]);

  const cancelBooking = async (id) => {
    if (!window.confirm("Cancel this booking?")) return;
    try {
      await api.patch(`/bookings/${id}`, { status: "Cancelled" });
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: "Cancelled" } : b))
      );
    } catch (err) {
      alert(err.message || "Failed to cancel booking");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading your bookings...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-indigo-600 text-white py-10">
        <h1 className="text-3xl md:text-4xl font-bold text-center">My Bookings</h1>
        <p className="text-center mt-2 text-gray-200">
          Track and manage your garage booking requests
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12">
        {error && (
          <div className="bg-red-50 text-red-600 border border-red-200 rounded-lg px-4 py-3 mb-6">
            {error}
          </div>
        )}

        {bookings.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-12 text-center">
            <h2 className="text-xl font-bold text-gray-700 mb-2">No bookings yet</h2>
            <p className="text-gray-500 mb-6">
              You haven't requested any garage bookings yet.
            </p>
            <Link
              to="/garages"
              className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition font-medium"
            >
              Browse Garages
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white rounded-xl shadow-lg p-6 flex flex-col md:flex-row md:items-center gap-4"
              >
                <img
                  src={booking.garage?.image || "/garage1.jpg"}
                  alt={booking.garage?.name}
                  className="h-28 w-full md:w-40 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold">
                      {booking.garage?.name || "Garage"}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor(
                        booking.status
                      )}`}
                    >
                      {booking.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {booking.garage?.location || booking.garage?.address || ""}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Booked on{" "}
                    {new Date(booking.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="flex flex-col gap-2 md:items-end">
                  <span className="text-lg font-bold text-indigo-600">
                    {booking.garage
                      ? formatPrice(booking.garage?.price, booking.garage?.currency)
                      : ""}
                    {booking.garage?.type === "Rent" ? " / month" : ""}
                  </span>
                  <button
                    onClick={() => navigate(`/garage/${booking.garage?._id || booking.garage?.id}`)}
                    className="text-indigo-600 text-sm font-medium hover:underline"
                  >
                    View Garage
                  </button>
                  {booking.status === "Pending" && (
                    <button
                      onClick={() => cancelBooking(booking.id)}
                      className="text-red-600 text-sm font-medium hover:underline"
                    >
                      Cancel Booking
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
