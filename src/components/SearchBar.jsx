export default function SearchBar() {
  return (
    <div className="bg-white rounded-xl p-4 shadow-lg flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
      <input
        type="text"
        placeholder="Enter location"
        className="flex-1 px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700"
      />

      <select className="px-4 py-3 rounded-lg border text-gray-700">
        <option>Rent</option>
        <option>Buy</option>
      </select>

      <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700">
        Search
      </button>
    </div>
  );
}
