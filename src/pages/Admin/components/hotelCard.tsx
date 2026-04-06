import React, { useState, useEffect } from "react";
import {
  Edit2,
  Trash2,
  Eye,
  Search,
  ChevronLeft,
  ChevronRight,
  LocateFixed,
  Star,
} from "lucide-react";
import { motion } from "framer-motion";
import EditHotelsDB from "./editHotel";
import DeleteHotels from "./deleteHotel";
import { FaDollarSign, FaMapMarkerAlt, FaStar } from "react-icons/fa";
import ViewHotelModal from "./viewHotel";
import { IHotel } from "@/features/hotels/types";

export default function HotelCards({ hotel }: { hotel: IHotel[] }) {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // -------- SEARCH ----------
  const filtered = hotel.filter(
    (f) =>
      f.name?.toLowerCase().includes(search.toLowerCase()) ||
      f.id?.toString().includes(search) ||
      f.cityId?.toLowerCase().includes(search.toLowerCase()) ||
      f.countryId?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;

  const displayedHotels =
    search === ""
      ? hotel.slice(0, 3)
      : filtered.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  return (
    <div className="w-full space-y-6 p-4">
      {/* ------- SEARCH BAR ------- */}
      <div className="flex justify-center mb-6">
        <div className="flex items-center gap-3 w-full max-w-md">
          <Search className="w-5 h-5 text-gray-600" />
          <input
            type="text"
            placeholder="Search hotel..."
            className="px-3 py-2 rounded border text-gray-700 w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {search && (
        <div className="text-center text-gray-600 mb-4">
          Found {filtered.length} hotel
        </div>
      )}

      {/* ------- GRID ------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedHotels.map((h) => (
          <motion.div
            key={h.id}
            whileHover="hover"
            initial="initial"
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
          >
            {/* IMAGE */}
            <div className="relative h-80 overflow-hidden">
              <motion.img
                variants={{
                  initial: { y: 0 },
                  hover: { y: -70 },
                }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                src={h.images?.[0]}
                alt={h.name}
                className="w-full h-full object-cover"
              />

              {/* ACTION BUTTONS */}
              <motion.div
                variants={{
                  initial: { opacity: 0 },
                  hover: { opacity: 1 },
                }}
                transition={{ duration: 0.2 }}
                className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-4 py-4"
              >
                <ViewHotelModal hotel={h} />
                <EditHotelsDB hotel={h} />
                <DeleteHotels id={h.id} name={h.name} />
              </motion.div>
            </div>

            {/* -------- INFO -------- */}
            <div className="p-6 bg-white">
              <div className="flex justify-between align-items-center">
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  {h.name}
                </h2>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(h.rating)
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-muted"
                      }`}
                    />
                  ))}
                </div>
                {/* <div className="flex gap-1 mt-2">
                  {Array(h.stars)
                    .fill(0)
                    .map((_, i) => (
                      <FaStar key={i} className="text-yellow-400" />
                    ))}
                </div> */}
              </div>

              <p className="text-gray-600">
                {h.cityId}, {h.countryId}
              </p>
              <span>{h.pricePerNight}/night</span>
              <p className="text-gray-700 font-semibold mt-2">
                {h.pricePerNight ? `$${h.pricePerNight}/night` : ""}
              </p>
              {h.rating && (
                <p className="text-gray-600 text-sm">
                  Rating: {h.rating} ({h.reviewCount} reviews)
                </p>
              )}

              {h.distanceFromCenter && (
                <p className="text-gray-500 text-sm mt-1 flex items-center gap-1">
                  <FaMapMarkerAlt className="text-red-500" />
                  {h.distanceFromCenter} from center
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* ------- PAGINATION ------- */}
      {search !== "" && totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-10">
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

      {displayedHotels.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No hotel found matching your search.
        </div>
      )}
    </div>
  );
}
