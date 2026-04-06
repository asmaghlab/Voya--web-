
import { IHotel } from "@/features/hotels/types";
import { MapPin, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface IHotelGridProps {
  hotel: IHotel;
}

export default function HotelGrid({ hotel }: IHotelGridProps) {
  const [currentImg, setCurrentImg] = useState(0);
  const [favorite, setFavorite] = useState(false);

  const images = hotel.images?.length
    ? hotel.images
    : [
        "https://images.unsplash.com/photo-1747133608846-ac16fb165862?w=600&auto=format&fit=crop&q=60",
        "https://plus.unsplash.com/premium_photo-1663126637580-ff22a73f9bfc?w=600&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1630999295881-e00725e1de45?w=600&auto=format&fit=crop&q=60",
      ];

  const prevImage = () => {
    setCurrentImg((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setCurrentImg((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    // <div className="col-span-12 md:col-span-6">
    <div>
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Image Carousel */}
          <div className="relative h-64 bg-gray-200">
            <img
              src={images[currentImg]}
              alt={hotel.name}
              className="w-full h-full object-cover"
            />
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg"
            >
              <ChevronRight size={20} />
            </button>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
              {images.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-2 h-2 rounded-full ${
                    idx === currentImg ? "bg-white" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Hotel Info */}
          <div className="p-6">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-2xl font-semibold">{hotel.name}</h3>
              <div className="flex items-center gap-1">
                {Array.from({ length: hotel.stars }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className="text-yellow-400 fill-yellow-400"
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4 mb-3">
              <div className="flex items-center gap-1">
                <div className="bg-blue-600 text-white px-2 py-1 rounded font-semibold text-sm">
                  {hotel.rating}
                </div>
                <span className="text-sm text-gray-600">
                  ({hotel.reviewCount} reviews)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-gray-600 mb-4">
              <MapPin size={16} />
              {/* <span className="text-sm">{hotel.location}</span> */}
            </div>

            <p className="text-gray-700 mb-6">
              {hotel.description.slice(0, 100) + "..."}
            </p>

            <div className="flex justify-between items-center">
              <div>
                <span className="text-3xl font-bold text-gray-900">
                  ${hotel.pricePerNight}
                </span>
                <span className="text-gray-600 ml-2">/ night</span>
              </div>
              <a
                href="#"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition"
              >
                Hotel Details
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
