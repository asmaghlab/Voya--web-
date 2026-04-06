import {
  FaStar,
  FaDollarSign,
  FaMapMarkerAlt,
  FaGlobe,
  FaPhone,
} from "react-icons/fa";
import { Eye, X } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export default function ViewHotelModal({ hotel }) {
  const [imgIndex, setImgIndex] = useState(0);
  const [open, setOpen] = useState(false);
  if (!hotel) return null;

  const nextImg = () => {
    if (!hotel.images) return;
    setImgIndex((prev) => (prev + 1) % hotel.images.length);
  };

  const prevImg = () => {
    if (!hotel.images) return;
    setImgIndex((prev) => (prev === 0 ? hotel.images.length - 1 : prev - 1));
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="p-2 bg-blue-200 hover:bg-blue-300 text-blue-800 rounded-lg flex items-center justify-center"
        title="View"
      >
        <Eye size={14} />
      </button>
      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white text-black p-6 rounded-xl w-full max-w-2xl relative shadow-xl">
            {/* CLOSE BUTTON */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 p-2 rounded-full hover:bg-gray-100"
            >
              <X size={22} />
            </button>

            {/* HOTEL NAME */}
            <h2 className="text-2xl font-bold mb-4">{hotel.name}</h2>

            {/* IMAGE SLIDER */}
            {hotel.images?.length > 0 && (
              <div className="relative w-full h-64 mb-5">
                <img
                  src={hotel.images[imgIndex]}
                  alt={hotel.name}
                  className="w-full h-full rounded-lg object-cover"
                />

                {hotel.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImg}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 p-2 rounded-full"
                    >
                      ❮
                    </button>
                    <button
                      onClick={nextImg}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 p-2 rounded-full"
                    >
                      ❯
                    </button>
                  </>
                )}
              </div>
            )}

            {/* DETAILS */}
            <div className="space-y-3 text-gray-700">
              {/* LOCATION */}
              <p className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-red-500" />
                {hotel.cityId}, {hotel.countryId}
              </p>

              {/* PRICE */}
              {hotel.pricePerNight && (
                <p className="flex items-center gap-2 text-green-600 font-semibold">
                  ${hotel.pricePerNight} / night
                </p>
              )}

              {/* STARS &  RATING */}
              <div className="flex gap-1">
                {Array(hotel.stars)
                  .fill(0)
                  .map((_, i) => (
                    <FaStar key={i} className="text-yellow-400" />
                  ))}
                <span className="text-gray-600">
                  ({hotel.reviewCount} reviews)
                </span>
              </div>
              {/* DISTANCE */}
              {hotel.distanceFromCenter && (
                <p className="text-sm text-gray-600">
                  Distance: {hotel.distanceFromCenter} from center
                </p>
              )}

              {/* AMENITIES */}
              {/* {hotel.amenities?.length > 0 && (
                <div>
                  <strong className="block mb-1">Amenities:</strong>
                  <ul className="list-disc ml-6 text-sm">
                    {hotel.amenities.map((a, index) => (
                      <li key={index}>{a}</li>
                    ))}
                  </ul>
                </div>
              )} */}
              <div className="flex flex-wrap gap-4">
                {hotel.amenities.map((amenity, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    className="p-3 bg-black/20 backdrop-blur-md border border-white/20 rounded-2xl "
                  >
                    {amenity}
                  </motion.div>
                ))}
              </div>
              {/* CONTACT INFO */}
              {hotel.phone && (
                <p className="flex items-center gap-2">
                  <FaPhone className="text-blue-500" /> {hotel.phone}
                </p>
              )}

              {hotel.website && (
                <p className="flex items-center gap-2">
                  <FaGlobe className="text-blue-500" />
                  <a
                    href={hotel.website}
                    target="_blank"
                    className="text-blue-600 underline"
                  >
                    Visit Website
                  </a>
                </p>
              )}

              {/* DESCRIPTION */}
              {hotel.description && (
                <p className="text-sm mt-3 leading-6 mb-3">
                  {hotel.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
