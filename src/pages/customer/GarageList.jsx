import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, formatPrice } from "../../lib/api";

const amenitiesList = [
  "CCTV",
  "Car Wash",
  "EV Charging",
  "Covered Parking",
  "24/7 Access",
  "Secure Lock",
  "On-site Repair",
  "Ventilated",
];

function toRad(deg) {
  return (deg * Math.PI) / 180;
}

function distanceKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/* ------------------ Component ------------------ */
export default function AllGarages() {
  const navigate = useNavigate();

  const [garages, setGarages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userCoords, setUserCoords] = useState(null);

  const [filter, setFilter] = useState("All");
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [page, setPage] = useState(1);

  const itemsPerPage = 6;

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

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {}
    );
  }, []);

  const withDistance = garages.map((g) => ({
    ...g,
    distance: userCoords
      ? Number(distanceKm(userCoords.lat, userCoords.lng, g.latitude, g.longitude).toFixed(2))
      : null,
  }));

  /* ---------- Filtering Logic ---------- */
  const filteredGarages = withDistance.filter((g) => {
    if (filter === "Nearby") {
      if (g.distance === null || g.distance > 2) return false;
    } else if (filter !== "All" && g.type !== filter) {
      return false;
    }

    if (selectedAmenities.length > 0) {
      return selectedAmenities.every((a) => g.amenities?.includes(a));
    }

    return true;
  });

  /* ---------- Pagination ---------- */
  const totalPages = Math.ceil(filteredGarages.length / itemsPerPage);
  const paginatedGarages = filteredGarages.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const visibleAmenities = amenitiesList.slice(0, 4);
  const hiddenAmenities = amenitiesList.slice(4);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-indigo-600 text-white py-10">
        <h1 className="text-3xl md:text-4xl font-bold text-center">
          All Garages
        </h1>
        <p className="text-center mt-2 text-gray-200">
          Browse garages available for rent or sale near you
        </p>
      </div>

      {/* Type Filters */}
      <div className="flex justify-center gap-4 mb-8 mt-10 flex-wrap">
        {["All", "Rent", "Buy", "Nearby"].map((f) => (
          <button
            key={f}
            onClick={() => {
              setFilter(f);
              setPage(1);
            }}
            className={`px-6 py-2 rounded-full font-medium transition ${
              filter === f
                ? "bg-indigo-600 text-white"
                : "bg-white border hover:bg-gray-100"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Amenities Filter */}
      <div className="max-w-6xl mx-auto px-6 mb-10">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold">
            Filter by Amenities
            {selectedAmenities.length > 0 && (
              <span className="ml-2 text-sm text-indigo-600">
                ({selectedAmenities.length})
              </span>
            )}
          </h3>

          <button
            onClick={() => setShowMoreFilters(!showMoreFilters)}
            className="text-sm text-indigo-600 font-medium hover:underline"
          >
            {showMoreFilters ? "Hide Filters" : "More Filters"}
          </button>
        </div>

        {/* Visible Amenities */}
        <div className="flex flex-wrap gap-3">
          {visibleAmenities.map((amenity) => (
            <label
              key={amenity}
              className="flex items-center gap-2 bg-white border px-4 py-2 rounded-lg cursor-pointer hover:border-indigo-500"
            >
              <input
                type="checkbox"
                className="accent-indigo-600"
                checked={selectedAmenities.includes(amenity)}
                onChange={() =>
                  setSelectedAmenities((prev) =>
                    prev.includes(amenity)
                      ? prev.filter((a) => a !== amenity)
                      : [...prev, amenity]
                  )
                }
              />
              <span className="text-sm">{amenity}</span>
            </label>
          ))}
        </div>

        {/* Hidden Amenities */}
        <div
          className={`overflow-hidden transition-all duration-300 ${
            showMoreFilters ? "max-h-40 opacity-100 mt-4" : "max-h-0 opacity-0"
          }`}
        >
          <div className="flex flex-wrap gap-3">
            {hiddenAmenities.map((amenity) => (
              <label
                key={amenity}
                className="flex items-center gap-2 bg-white border px-4 py-2 rounded-lg cursor-pointer hover:border-indigo-500"
              >
                <input
                  type="checkbox"
                  className="accent-indigo-600"
                  checked={selectedAmenities.includes(amenity)}
                  onChange={() =>
                    setSelectedAmenities((prev) =>
                      prev.includes(amenity)
                        ? prev.filter((a) => a !== amenity)
                        : [...prev, amenity]
                    )
                  }
                />
                <span className="text-sm">{amenity}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Garage Cards */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading &&
          Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse"
            >
              <div className="h-48 bg-gray-200" />
              <div className="p-6 space-y-3">
                <div className="h-5 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}

        {!loading && error && (
          <div className="col-span-full bg-red-50 text-red-600 border border-red-200 rounded-lg px-4 py-3 text-center">
            {error}
          </div>
        )}

        {!loading && !error && paginatedGarages.length === 0 && (
          <div className="col-span-full text-center text-gray-500 py-16">
            No garages found. Try adjusting your filters.
          </div>
        )}

        {paginatedGarages.map((garage) => (
          <div
            key={garage.id}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition cursor-pointer"
          >
            <img
              src={garage.image || "/garage1.jpg"}
              alt={garage.name}
              onError={(e) => (e.currentTarget.src = "/garage1.jpg")}
              className="h-48 w-full object-cover"
            />
            <div className="p-6">
              <h2 className="text-xl font-bold">{garage.name}</h2>
              <p className="text-gray-600">{garage.location || garage.address}</p>

              <div className="flex flex-wrap gap-2 mt-3">
                {(garage.amenities || []).slice(0, 3).map((a, i) => (
                  <span
                    key={i}
                    className="text-xs bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full"
                  >
                    {a}
                  </span>
                ))}
                {(garage.amenities || []).length > 3 && (
                  <span className="text-xs bg-gray-100 text-gray-500 px-3 py-1 rounded-full">
                    +{(garage.amenities || []).length - 3}
                  </span>
                )}
              </div>

              <p className="text-gray-500 text-sm mt-2">
                {garage.distance !== null && garage.distance !== undefined
                  ? `Distance: ${garage.distance} km`
                  : garage.address}
              </p>

              <div className="flex items-center justify-between mt-3">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                    garage.type === "Rent"
                      ? "bg-green-100 text-green-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {garage.type}
                </span>
                <span className="font-bold text-indigo-600">
                  {formatPrice(garage.price, garage.currency)}
                  {garage.type === "Rent" ? "/mo" : ""}
                </span>
              </div>

              <button
                onClick={() => navigate(`/garage/${garage.id}`)}
                className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition font-medium"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-3 mb-12">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-4 py-2 rounded-lg font-medium ${
                page === i + 1
                  ? "bg-indigo-600 text-white"
                  : "bg-white hover:bg-indigo-100"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
