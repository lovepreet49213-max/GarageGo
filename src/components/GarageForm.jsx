export default function GarageForm() {
  return (
    <form className="bg-white p-6 rounded-xl shadow space-y-4">
      <h3 className="text-lg font-semibold">Add Garage</h3>

      <input
        className="w-full border px-4 py-2 rounded"
        placeholder="Garage Title"
      />

      <input
        className="w-full border px-4 py-2 rounded"
        placeholder="Location"
      />

      <input
        type="number"
        className="w-full border px-4 py-2 rounded"
        placeholder="Price"
      />

      <select className="w-full border px-4 py-2 rounded">
        <option>For Rent</option>
        <option>For Sale</option>
      </select>

      <button className="bg-indigo-600 text-white px-6 py-2 rounded">
        Save Garage
      </button>
    </form>
  );
}
