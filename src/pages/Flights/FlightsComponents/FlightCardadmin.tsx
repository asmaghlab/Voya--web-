import React, { useState, useEffect } from "react";
import {
  Edit2,
  Trash2,
  Eye,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";

export default function FlightCards({ flights, onEdit, onDelete, onView }) {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const filtered = flights.filter(
    (f) =>
      f.airline.toLowerCase().includes(search.toLowerCase()) ||
      f.from.toLowerCase().includes(search.toLowerCase()) ||
      f.to.toLowerCase().includes(search.toLowerCase()) ||
      f.country.toLowerCase().includes(search.toLowerCase()) ||
      f.city.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;

  const displayedFlights =
    search === ""
      ? flights.slice(0, 3)
      : filtered.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  return (
    <div className="w-full space-y-6 p-4">
      <div className="flex justify-center mb-6">
        <div className="flex items-center gap-3 w-full max-w-md">
          <Search className="w-5 h-5 text-gray-600" />
          <input
            type="text"
            placeholder="Search flights..."
            className="px-3 py-2 rounded border text-gray-700 w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      {search && (
        <div className="text-center text-gray-600 mb-4">
          Found {filtered.length} flights
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedFlights.map((flight) => (
          <motion.div
            key={flight.id}
            whileHover="hover"
            initial="initial"
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
          >
            <div className="relative h-80 overflow-hidden">
              <motion.img
                variants={{
                  initial: { y: 0 },
                  hover: { y: -70 },
                }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                src={flight.image}
                alt={flight.title}
                className="w-full h-full object-cover"
              />

              <motion.div
                variants={{
                  initial: { opacity: 0 },
                  hover: { opacity: 1 },
                }}
                transition={{ duration: 0.2 }}
                className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-4 py-4"
              >
                <button
                  onClick={() => onView(flight)}
                  className="p-1 rounded-full hover:scale-110 transition-transform"
                >
                  <Eye className="w-4 h-4 text-blue-600" />
                </button>
                <button
                  onClick={() => onEdit(flight)}
                  className="p-1 rounded-full hover:scale-110 transition-transform"
                >
                  <Edit2 className="w-4 h-4 text-green-600" />
                </button>
                <button
                  onClick={() => onDelete(flight)}
                  className="p-1 rounded-full hover:scale-110 transition-transform"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </motion.div>
            </div>

            <div className="p-6 bg-white">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                {flight.airline}
              </h2>
              <p className="text-base text-gray-600 mb-1">
                {flight.from} → {flight.to}
              </p>
              <p className="text-base text-gray-600 mb-1">
                Price: ${flight.price}/night
              </p>
              <p className="text-sm text-gray-400 mt-2">
                {flight.city}, {flight.country}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
      {search !== "" && totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-10">
          {/* Prev Button */}
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="w-10 h-10 flex items-center justify-center rounded-md bg-blue-600 text-white disabled:bg-gray-300 hover:bg-blue-700 transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex gap-2">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-10 h-10 rounded-md font-semibold transition ${
                  currentPage === i + 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="w-10 h-10 flex items-center justify-center rounded-md bg-blue-600 text-white disabled:bg-gray-300 hover:bg-blue-700 transition"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {displayedFlights.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No flights found matching your search.
        </div>
      )}
    </div>
  );
}
