import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../../lib/api";

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

const emptyForm = {
  name: "",
  location: "",
  address: "",
  city: "Bangalore",
  price: "",
  type: "rent",
  image: "",
  amenities: [],
  description: "",
  latitude: "",
  longitude: "",
  featured: false,
};

export default function AddGarage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const editingId = searchParams.get("id");

  const [garage, setGarage] = useState(emptyForm);
  const [loading, setLoading] = useState(Boolean(editingId));
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [isEdit, setIsEdit] = useState(Boolean(editingId));

  useEffect(() => {
    if (!editingId) return;
    let cancelled = false;
    api
      .get(`/garages/${editingId}`)
      .then((data) => {
        if (cancelled) return;
        const g = data.garage;
        setGarage({
          name: g.name || "",
          location: g.location || "",
          address: g.address || "",
          city: g.city || "Bangalore",
          price: g.price ?? "",
          type: g.type === "Buy" ? "buy" : "rent",
          image: g.image || "",
          amenities: g.amenities || [],
          description: g.description || "",
          latitude: g.latitude ?? "",
          longitude: g.longitude ?? "",
          featured: Boolean(g.featured),
        });
        setIsEdit(true);
      })
      .catch((err) => setError(err.message || "Failed to load garage"))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [editingId]);

  const handleChange = (e) => {
    const value = e.target.name === "featured" ? e.target.checked : e.target.value;
    setGarage({ ...garage, [e.target.name]: value });
  };

  const toggleAmenity = (amenity) => {
    setGarage((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("image", file);
      const data = await api.upload("/upload", formData);
      setGarage((prev) => ({ ...prev, image: data.url }));
    } catch (err) {
      setError(err.message || "Image upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      ...garage,
      price: Number(garage.price),
      latitude: garage.latitude ? Number(garage.latitude) : undefined,
      longitude: garage.longitude ? Number(garage.longitude) : undefined,
    };

    try {
      if (isEdit) {
        await api.put(`/garages/${editingId}`, payload);
      } else {
        await api.post("/garages", payload);
      }
      alert(isEdit ? "Garage updated successfully!" : "Garage added successfully!");
      navigate("/admin/garages");
    } catch (err) {
      setError(err.message || "Failed to save garage");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {isEdit ? "Edit Garage" : "Add New Garage"}
      </h2>

      {error && (
        <div className="bg-red-50 text-red-600 border border-red-200 rounded-lg px-4 py-3 mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-gray-500">Loading garage...</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Garage Name */}
          <input
            type="text"
            name="name"
            placeholder="Garage Name"
            value={garage.name}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
            required
          />

          {/* Location + City */}
          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              name="location"
              placeholder="Location / Area (e.g. Indiranagar)"
              value={garage.location}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg"
              required
            />
            <input
              type="text"
              name="city"
              placeholder="City"
              value={garage.city}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg"
            />
          </div>

          {/* Address */}
          <input
            type="text"
            name="address"
            placeholder="Full Address"
            value={garage.address}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
          />

          {/* Price + Type */}
          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="number"
              name="price"
              placeholder="Price (per month for rent / total for sale)"
              value={garage.price}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg"
              required
            />
            <select
              name="type"
              value={garage.type}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg"
            >
              <option value="rent">Rent</option>
              <option value="buy">Buy</option>
            </select>
          </div>

          {/* Latitude + Longitude */}
          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="number"
              step="any"
              name="latitude"
              placeholder="Latitude (e.g. 12.9716)"
              value={garage.latitude}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg"
            />
            <input
              type="number"
              step="any"
              name="longitude"
              placeholder="Longitude (e.g. 77.5946)"
              value={garage.longitude}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg"
            />
          </div>

          {/* Image */}
          <div>
            <p className="font-semibold mb-2">Garage Image</p>
            <div className="flex items-start gap-4">
              {garage.image ? (
                <div className="relative w-40 h-28">
                  <img
                    src={garage.image}
                    alt="Garage preview"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                    className="w-full h-full object-cover rounded-lg border"
                  />
                  <button
                    type="button"
                    onClick={() => setGarage({ ...garage, image: "" })}
                    className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full text-xs hover:bg-red-600"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-40 h-28 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 text-gray-500 text-sm text-center">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={uploading}
                    onChange={handleImageUpload}
                  />
                  {uploading ? "Uploading..." : "Click to upload"}
                </label>
              )}

              <div className="flex-1 space-y-2">
                <p className="text-xs text-gray-400">
                  Upload an image (saved to Cloudinary), or paste an image URL
                  below.
                </p>
                <input
                  type="text"
                  name="image"
                  placeholder="Image URL (e.g. /garage1.jpg)"
                  value={garage.image}
                  onChange={handleChange}
                  className="w-full border p-2 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Featured */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="featured"
              checked={garage.featured}
              onChange={handleChange}
              className="accent-indigo-600"
            />
            <span className="font-medium">Featured garage (shows on homepage)</span>
          </label>

          {/* Amenities */}
          <div>
            <p className="font-semibold mb-2">Amenities</p>
            <div className="grid grid-cols-2 gap-3">
              {amenitiesList.map((item) => (
                <label
                  key={item}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    className="accent-indigo-600"
                    checked={garage.amenities.includes(item)}
                    onChange={() => toggleAmenity(item)}
                  />
                  {item}
                </label>
              ))}
            </div>
          </div>

          {/* Description */}
          <textarea
            name="description"
            placeholder="Garage Description"
            value={garage.description}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
            rows="4"
          />

          {/* Submit */}
          <button
            type="submit"
            disabled={saving}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 font-semibold disabled:opacity-60"
          >
            {saving ? "Saving..." : isEdit ? "Update Garage" : "Add Garage"}
          </button>
        </form>
      )}
    </div>
  );
}
