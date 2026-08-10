import SearchBar from "./SearchBar";

export default function Hero() {
  return (
    <section className="pt-32 pb-20 bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
      <div className="max-w-5xl mx-auto text-center px-6">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Find Garage Parking Near You
        </h1>

        <p className="text-lg mb-10 opacity-90">
          Rent or buy secure parking spaces nearby with live location and directions
        </p>

        <SearchBar />
      </div>
    </section>
  );
}
