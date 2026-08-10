import { MapPin, Search, ShieldCheck ,Star,Facebook,
  Instagram,
  Twitter,
  Linkedin,
  } from "lucide-react";

import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { api, formatPrice } from "../../lib/api";



const testimonials = [
  {
    name: "Rahul Sharma",
    role: "Car Owner",
    location: "Bangalore",
    rating: 5,
    message:
      "GarageGo helped me find a secure garage near my office within minutes. The booking process was smooth and hassle-free.",
  },
  {
    name: "Priya Verma",
    role: "Garage Owner",
    location: "Delhi",
    rating: 5,
    message:
      "I listed my unused garage and started getting booking requests in the first week. GarageGo made everything simple.",
  },
  {
    name: "Amit Patel",
    role: "EV Owner",
    location: "Ahmedabad",
    rating: 4,
    message:
      "Finding a garage with EV charging was difficult earlier. GarageGo solved that problem perfectly.",
  },
];

export default function Index() {
  const navigate = useNavigate();
  const [garages, setGarages] = useState([]);

  useEffect(() => {
    api
      .get("/garages?featured=true&limit=6")
      .then((data) => setGarages(data.garages))
      .catch(() => setGarages([]));
  }, []);
  return (
    
    <div className="min-h-screen bg-gray-50 text-gray-900">

      {/* NAVBAR */}
   

      {/* HERO SECTION */}
     <section
  className="min-h-[80vh] md:h-[90vh] bg-cover bg-center relative flex items-center"
  style={{
    backgroundImage:
      "linear-gradient(rgba(17,24,39,0.7), rgba(17,24,39,0.7)), url('/hero.jpg')",
  }}
 >
  <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center w-full">

    <h1 className="text-indigo-100 text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
      Find & Rent Garages Near You
    </h1>

    <p className="text-indigo-100 max-w-2xl mx-auto mb-8 text-sm sm:text-base">
      Discover secure garage parking spaces to rent or buy — fast, reliable, and nearby.
    </p>

    {/* Search Box */}
    {/* <div className="bg-white rounded-lg p-2 flex flex-col sm:flex-row gap-2 max-w-xl mx-auto shadow-lg">
      <input
        type="text"
        placeholder="Enter your location"
        className="w-full px-4 py-3 text-gray-800 outline-none rounded-lg sm:rounded-l-lg"
      />

      <button className="bg-indigo-600 px-6 py-3 rounded-lg flex justify-center items-center gap-2 font-medium text-white hover:bg-indigo-700">
        <Search size={18} /> Search
      </button>
    </div> */}

    {/* Action Buttons */}
    <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
      <button
       onClick={() => navigate("/garages")}
      className="bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-indigo-700 transition font-semibold w-full sm:w-auto">
        Find Garage
      </button>
      <button
       onClick={() => navigate("/Admin/login")}
      className="bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-indigo-700 transition font-semibold w-full sm:w-auto">
        Add Garage
      </button>
    </div>

  </div>
</section>





 <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 text-center">
        {/* Section Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
          How GarageGo Works
        </h2>
        <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
          Find, rent, or list garages near you in just a few simple steps. Our platform is designed for both customers and garage owners.
        </p>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-10 text-center">
          {/* Step 1 */}
          <div className="bg-white p-8 rounded-xl shadow hover:shadow-lg transition">
            <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600 font-bold text-xl">
              1
            </div>
            <h3 className="font-semibold text-lg mb-2">Find a Garage</h3>
            <p className="text-gray-600 text-sm">
              Search garages near your location using our interactive map and filters.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-8 rounded-xl shadow hover:shadow-lg transition">
            <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600 font-bold text-xl">
              2
            </div>
            <h3 className="font-semibold text-lg mb-2">Book or Rent</h3>
            <p className="text-gray-600 text-sm">
              Select the garage you like, check availability, and book it instantly.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-8 rounded-xl shadow hover:shadow-lg transition">
            <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600 font-bold text-xl">
              3
            </div>
            <h3 className="font-semibold text-lg mb-2">Add Your Garage</h3>
            <p className="text-gray-600 text-sm">
              Own a garage? List it easily for rent or sale and reach nearby customers.
            </p>
          </div>
        </div>
      </div>
    </section>


      {/* LISTINGS PREVIEW */}
 <section className="py-16 bg-gray-100">
  <div className="max-w-7xl mx-auto px-6">
    <h2 className="text-3xl font-bold text-center mb-12">
      Popular Garage Listings
    </h2>

    <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
      {garages.length === 0 &&
        Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl overflow-hidden shadow-md animate-pulse"
          >
            <div className="h-44 bg-gray-200" />
            <div className="p-5 space-y-3">
              <div className="h-5 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
        ))}
      {garages.map((garage) => (
        <NavLink
          key={garage.id}
          to={`/garage/${garage.id}`}
          className="group block"
        >
          <div className="relative bg-white rounded-2xl overflow-hidden shadow-md transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 cursor-pointer">

            {/* Image */}
            <div className="relative h-44 overflow-hidden bg-gray-200">
              <img
                src={garage.image || "/garage1.jpg"}
                alt={garage.name}
                onError={(e) => (e.currentTarget.src = "/garage1.jpg")}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />

              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="text-white text-lg font-semibold bg-indigo-600 px-4 py-2 rounded-full shadow-lg">
                  View Details
                </span>
              </div>
            </div>

            {/* Content */}
               <div className="p-5">
              <div className="flex justify-between items-start">
                
                {/* Left side: Title & Price */}
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {garage.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {garage.location || garage.address}
                  </p>
                  <p className="text-lg font-bold text-indigo-600">
                    {formatPrice(garage.price, garage.currency)}
                    {garage.type === "Rent" ? " / month" : ""}
                  </p>
                </div>

              
              </div>
            </div>
          </div>
        </NavLink>
      ))}
    </div>
  </div>

  {/* CTA */}
  <button
    onClick={() => navigate("/garages")}
    className="mt-14 mx-auto block bg-indigo-600 text-white px-8 py-3 rounded-xl shadow-lg hover:bg-indigo-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 font-semibold"
  >
    View All Garages
  </button>
</section>



      {/* TESTIMONIALS */}

       <section className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">
            What Our Users Say
          </h2>
          <p className="text-gray-600 mt-2">
            Trusted by drivers and garage owners across India
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition"
            >
              {/* Stars */}
              <div className="flex mb-3">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    className={`w-5 h-5 ${
                      index < t.rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>

              <p className="text-gray-700 mb-4">
                “{t.message}”
              </p>

              <div className="border-t pt-4">
                <p className="font-semibold">{t.name}</p>
                <p className="text-sm text-gray-500">
                  {t.role} · {t.location}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
      {/* FEATURES */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-10 text-center">

            <div className="bg-white p-8 rounded-xl shadow-sm">
              <MapPin className="mx-auto text-indigo-600 mb-4" size={40} />
              <h3 className="font-semibold text-lg mb-2">
                Nearby Garages
              </h3>
              <p className="text-sm text-gray-600">
                Find garages close to your home or workplace with live maps.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm">
              <ShieldCheck className="mx-auto text-indigo-600 mb-4" size={40} />
              <h3 className="font-semibold text-lg mb-2">
                Secure & Trusted
              </h3>
              <p className="text-sm text-gray-600">
                Verified owners and safe parking spaces you can rely on.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm">
              <Search className="mx-auto text-indigo-600 mb-4" size={40} />
              <h3 className="font-semibold text-lg mb-2">
                Easy Booking
              </h3>
              <p className="text-sm text-gray-600">
                Book garages instantly with transparent pricing.
              </p>
            </div>

          </div>
        </div>
      </section>
              


     
    </div>
  );
}
