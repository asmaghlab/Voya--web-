import { IHotel } from "@/features/hotels/types";
import HotelCard from "./hotelCard";
import { Link } from "react-router-dom";
import HotelGrid from "./hotelGrid";

interface HotelListProps {
  hotels: IHotel[];
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
}
export default function HotelList({
  hotels,
  currentPage,
  totalPages,
  setCurrentPage,
}: HotelListProps) {
  return (
    // <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div>
      {hotels.map(
        (hotel: IHotel) => (
          console.log("Rendering hotel:", hotel.name),
          (
            // <HotelGrid key={hotel.id} hotel={hotel} />
            <HotelCard key={hotel.id} hotel={hotel} />
          )
        )
      )}

      {/* Pagination */}
      <div className="flex justify-center gap-3 mt-6">
        <button
          onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
          className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
        >
          Prev
        </button>

        <span className="px-4 py-2 bg-blue-100 rounded-md text-blue-700 font-semibold">
          {currentPage} / {totalPages}
        </span>

        <button
          onClick={() =>
            currentPage < totalPages && setCurrentPage(currentPage + 1)
          }
          className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
        >
          Next
        </button>
      </div>
    </div>
  );
}
