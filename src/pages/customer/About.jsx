import React from "react";

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-indigo-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold mb-4">About GarageGo</h1>
          <p className="text-lg max-w-2xl mx-auto">
            Making parking simple, smart, and accessible — wherever you are.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4">
              Who We Are
            </h2>
            <p className="text-gray-700 mb-4">
              GarageGo is a platform that connects garage owners with people
              looking for secure parking spaces — for rent or purchase.
            </p>
            <p className="text-gray-700 mb-4">
              Whether you’re searching for a nearby garage or want to monetize
              your unused space, GarageGo makes the process easy and reliable.
            </p>
            <p className="text-gray-700">
              Our mission is to simplify urban parking using technology,
              transparency, and trust.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-xl font-semibold mb-4">
              Why Choose GarageGo?
            </h3>
            <ul className="space-y-3 text-gray-700">
              <li>✔ Verified garage listings</li>
              <li>✔ Transparent pricing</li>
              <li>✔ Smart location-based search</li>
              <li>✔ Secure & trusted owners</li>
              <li>✔ Easy booking & communication</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
