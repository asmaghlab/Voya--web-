import { IHotel } from "@/features/hotels/types";
import { Link } from "react-router-dom";

interface IHotelCardProps {
  hotel: IHotel;
}

export default function HotelMapCard({ hotel }: IHotelCardProps) {
  return (

    <div className="w-64 md:w-72 bg-white rounded-xl shadow-md overflow-hidden border">
      <div className="h-32 w-full relative">
        <img
          src={hotel.images?.[0]}
          alt={hotel.name}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="p-3 space-y-2">
        {/* Hotel Name */}
        <h2 className="text-lg font-semibold text-blue-700 leading-tight">
          {hotel.name}
        </h2>

        {/* Stars */}
        <div className="flex items-center">
          {Array(hotel.stars)
            .fill(0)
            .map((_, i) => (
              <span key={i} className="text-yellow-400 text-base">
                ★
              </span>
            ))}
        </div>

        {/* Price */}
        <p className="text-green-700 font-bold text-lg">
          ${hotel.pricePerNight}
          <span className="text-sm text-gray-500 font-medium"> / night</span>
        </p>

        {/* Rating */}
        <span className="inline-block bg-blue-700 text-white px-3 py-1 rounded-lg text-sm font-semibold">
          {hotel.rating}
        </span>
      </div>
    </div>
  );
}
