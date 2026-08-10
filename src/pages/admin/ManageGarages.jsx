import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, formatPrice } from "../../lib/api";

export default function ManageGarages() {
  const navigate = useNavigate();
  const [garages, setGarages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    api
      .get("/garages?limit=100")
      .then((data) => {
        if (!cancelled) setGarages(data.garages);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Failed to load garages");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const toggleStatus = async (garage) => {
    const next = garage.status === "Active" ? "Inactive" : "Active";
    try {
      await api.put(`/garages/${garage.id}`, { status: next });
      setGarages((prev) =>
        prev.map((g) => (g.id === garage.id ? { ...g, status: next } : g))
      );
    } catch (err) {
      alert(err.message || "Failed to update garage");
    }
  };

  const deleteGarage = async (garage) => {
    if (!window.confirm(`Delete "${garage.name}"? This cannot be undone.`)) return;
    try {
      await api.del(`/garages/${garage.id}`);
      setGarages((prev) => prev.filter((g) => g.id !== garage.id));
    } catch (err) {
      alert(err.message || "Failed to delete garage");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Garages</h1>
        <button
          onClick={() => navigate("/admin/add-garage")}
          className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700"
        >
          + Add Garage
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 border border-red-200 rounded-lg px-4 py-3 mb-6">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4">Garage</th>
              <th className="p-4">Type</th>
              <th className="p-4">Price</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading &&
              [1, 2, 3].map((i) => (
                <tr key={i} className="border-t">
                  <td className="p-4 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-40" />
                  </td>
                  <td className="p-4 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-12" />
                  </td>
                  <td className="p-4 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-20" />
                  </td>
                  <td className="p-4 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-14" />
                  </td>
                  <td className="p-4" />
                </tr>
              ))}

            {!loading &&
              garages.map((garage) => (
                <tr key={garage.id} className="border-t hover:bg-gray-50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={garage.image || "/garage1.jpg"}
                        alt={garage.name}
                        className="h-10 w-14 object-cover rounded"
                      />
                      <div>
                        <p className="font-medium">{garage.name}</p>
                        <p className="text-sm text-gray-500">
                          {garage.location || garage.address}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        garage.type === "Rent"
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {garage.type}
                    </span>
                  </td>
                  <td className="p-4">
                    {formatPrice(garage.price, garage.currency)}
                    {garage.type === "Rent" ? "/mo" : ""}
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => toggleStatus(garage)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        garage.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {garage.status}
                    </button>
                  </td>
                  <td className="p-4 flex gap-2">
                    <button
                      onClick={() => navigate(`/admin/add-garage?id=${garage.id}`)}
                      className="bg-indigo-500 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-indigo-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteGarage(garage)}
                      className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

            {!loading && garages.length === 0 && (
              <tr className="border-t">
                <td colSpan={5} className="p-10 text-center text-gray-500">
                  No garages yet. Click "+ Add Garage" to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
