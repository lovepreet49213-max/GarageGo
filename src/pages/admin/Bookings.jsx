import React, { useEffect, useState } from "react";
import { api } from "../../lib/api";

export default function BookingManagement() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    let cancelled = false;
    api
      .get("/bookings")
      .then((data) => {
        if (!cancelled) setBookings(data.bookings);
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
  }, []);

  const changeStatus = async (id, status) => {
    try {
      await api.patch(`/bookings/${id}`, { status });
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status } : b))
      );
    } catch (err) {
      alert(err.message || "Failed to update status");
    }
  };

  const statusColor = (status) => {
    if (status === "Confirmed") return "bg-green-500 text-white";
    if (status === "Pending") return "bg-yellow-400 text-gray-900";
    return "bg-red-500 text-white"; // Cancelled
  };

  // Edit modal handlers
  const openEditModal = (booking) => {
    setSelectedBooking({ ...booking });
    setModalOpen(true);
  };
  const closeEditModal = () => {
    setModalOpen(false);
    setSelectedBooking(null);
  };
  const saveBooking = async () => {
    try {
      await api.patch(`/bookings/${selectedBooking.id}`, {
        customerName: selectedBooking.customerName,
        customerPhone: selectedBooking.customerPhone,
        customerEmail: selectedBooking.customerEmail,
        message: selectedBooking.message,
      });
      setBookings((prev) =>
        prev.map((b) => (b.id === selectedBooking.id ? selectedBooking : b))
      );
      closeEditModal();
    } catch (err) {
      alert(err.message || "Failed to save booking");
    }
  };

  // Delete modal handlers
  const openDeleteModal = (booking) => {
    setSelectedBooking(booking);
    setDeleteModalOpen(true);
  };
  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setSelectedBooking(null);
  };
  const confirmDelete = async () => {
    try {
      await api.del(`/bookings/${selectedBooking.id}`);
      setBookings((prev) => prev.filter((b) => b.id !== selectedBooking.id));
      closeDeleteModal();
    } catch (err) {
      alert(err.message || "Failed to delete booking");
    }
  };

  // Filter bookings based on search query
  const filteredBookings = bookings.filter((b) => {
    const q = searchQuery.toLowerCase();
    return (
      (b.customerName || "").toLowerCase().includes(q) ||
      (b.customerEmail || "").toLowerCase().includes(q) ||
      (b.garage?.name || "").toLowerCase().includes(q) ||
      (b.status || "").toLowerCase().includes(q)
    );
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <h1 className="text-2xl font-bold mb-6">Booking Management</h1>

      {error && (
        <div className="bg-red-50 text-red-600 border border-red-200 rounded-lg px-4 py-3 mb-4">
          {error}
        </div>
      )}

      {/* Search Input */}
      <div className="mb-4 flex flex-col md:flex-row md:items-center gap-4">
        <input
          type="text"
          placeholder="Search by user, garage, or status"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full md:w-1/3 p-2 border rounded shadow-sm"
        />
      </div>

      {/* Table for medium+ screens */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow">
          <thead className="bg-indigo-600 text-white">
            <tr>
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">User</th>
              <th className="px-4 py-2 text-left">Garage</th>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading &&
              [1, 2, 3].map((i) => (
                <tr key={i} className="border-b animate-pulse">
                  <td className="px-4 py-3">
                    <div className="h-4 bg-gray-200 rounded w-10" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-4 bg-gray-200 rounded w-28" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-4 bg-gray-200 rounded w-32" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-4 bg-gray-200 rounded w-20" />
                  </td>
                  <td className="px-4 py-3" />
                  <td className="px-4 py-3" />
                </tr>
              ))}

            {!loading &&
              paginatedBookings.map((booking) => (
                <tr key={booking.id} className="border-b hover:bg-gray-50 transition">
                  <td className="px-4 py-3">{booking.id.toString().slice(-4)}</td>
                  <td className="px-4 py-3">
                    {booking.customerName || booking.user?.name || "Guest"}
                    {booking.customerEmail && (
                      <p className="text-xs text-gray-400">{booking.customerEmail}</p>
                    )}
                  </td>
                  <td className="px-4 py-3">{booking.garage?.name || "Unknown"}</td>
                  <td className="px-4 py-3">
                    {new Date(booking.createdAt).toLocaleDateString("en-IN")}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={booking.status}
                      onChange={(e) => changeStatus(booking.id, e.target.value)}
                      className={`cursor-pointer px-3 py-1 rounded-full font-medium ${statusColor(
                        booking.status
                      )}`}
                    >
                      <option value="Pending" className="bg-white text-gray-800">Pending</option>
                      <option value="Confirmed" className="bg-white text-gray-800">Confirmed</option>
                      <option value="Cancelled" className="bg-white text-gray-800">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    <button
                      onClick={() => openEditModal(booking)}
                      className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white px-4 py-2 rounded-lg shadow-lg hover:scale-105 hover:shadow-xl transition transform font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => openDeleteModal(booking)}
                      className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg shadow-lg hover:scale-105 hover:shadow-xl transition transform font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

            {!loading && filteredBookings.length === 0 && (
              <tr className="border-b">
                <td colSpan={6} className="px-4 py-10 text-center text-gray-500">
                  No bookings found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-end items-center mt-4 gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            >
              Prev
            </button>
            <span className="px-2">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Card layout for small screens */}
      <div className="md:hidden space-y-4">
        {!loading &&
          paginatedBookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white p-4 rounded-lg shadow flex flex-col gap-3"
            >
              <div className="flex justify-between items-center">
                <span className="font-semibold">
                  {booking.customerName || booking.user?.name || "Guest"}
                </span>
                <select
                  value={booking.status}
                  onChange={(e) => changeStatus(booking.id, e.target.value)}
                  className={`cursor-pointer px-3 py-1 rounded-full font-medium ${statusColor(
                    booking.status
                  )}`}
                >
                  <option value="Pending" className="bg-white text-gray-800">Pending</option>
                  <option value="Confirmed" className="bg-white text-gray-800">Confirmed</option>
                  <option value="Cancelled" className="bg-white text-gray-800">Cancelled</option>
                </select>
              </div>
              <p>
                <span className="font-medium">Garage:</span>{" "}
                {booking.garage?.name || "Unknown"}
              </p>
              <p>
                <span className="font-medium">Date:</span>{" "}
                {new Date(booking.createdAt).toLocaleDateString("en-IN")}
              </p>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => openEditModal(booking)}
                  className="flex-1 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white py-2 rounded-lg shadow-lg hover:scale-105 hover:shadow-xl transition transform font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => openDeleteModal(booking)}
                  className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-2 rounded-lg shadow-lg hover:scale-105 hover:shadow-xl transition transform font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

        {!loading && filteredBookings.length === 0 && (
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
            No bookings found.
          </div>
        )}

        {/* Pagination Controls for mobile */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-4 gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            >
              Prev
            </button>
            <span className="px-2">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {modalOpen && selectedBooking && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Booking</h2>
            <label className="block mb-2 font-medium">Customer Name</label>
            <input
              type="text"
              value={selectedBooking.customerName || ""}
              onChange={(e) =>
                setSelectedBooking({ ...selectedBooking, customerName: e.target.value })
              }
              className="w-full p-2 border rounded mb-4"
            />
            <label className="block mb-2 font-medium">Email</label>
            <input
              type="email"
              value={selectedBooking.customerEmail || ""}
              onChange={(e) =>
                setSelectedBooking({ ...selectedBooking, customerEmail: e.target.value })
              }
              className="w-full p-2 border rounded mb-4"
            />
            <label className="block mb-2 font-medium">Phone</label>
            <input
              type="text"
              value={selectedBooking.customerPhone || ""}
              onChange={(e) =>
                setSelectedBooking({ ...selectedBooking, customerPhone: e.target.value })
              }
              className="w-full p-2 border rounded mb-4"
            />
            <label className="block mb-2 font-medium">Message</label>
            <textarea
              value={selectedBooking.message || ""}
              onChange={(e) =>
                setSelectedBooking({ ...selectedBooking, message: e.target.value })
              }
              className="w-full p-2 border rounded mb-4"
              rows="3"
            />
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={closeEditModal}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={saveBooking}
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModalOpen && selectedBooking && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm text-center">
            <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
            <p className="mb-6">
              Are you sure you want to delete this booking by{" "}
              <strong>
                {selectedBooking.customerName || selectedBooking.user?.name || "Guest"}
              </strong>
              ?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={closeDeleteModal}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
