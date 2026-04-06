import "../../index.css";
import { useCallback, useMemo, useState } from "react";
import { IHotel } from "@/features/hotels/types";
import Filter from "@/components/Filter/Filter";
import HotelList from "@/components/hotel/hotelList";
import HotelMap from "@/components/hotel/hotelMap";
import { FaSearch } from "react-icons/fa";
import Spinner from "../Flights/FlightsComponents/spinner";
import HeroSection from "@/components/travel/HeroSection";

interface IHotelPageProps {
  hotel?: IHotel[];
  loading?: boolean;
  error?: string;
  countryId?: string;
}

interface FilterState {
  distanceFromCenter: string[];
  cityId: string[];
  stars: number[];
  pricePerNight: number;
}

export default function HotelPage({
  hotel,
  loading,
  error,
  countryId,
}: IHotelPageProps) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 6;
  const [searchTerm, setSearchTerm] = useState("");

  const [filters, setFilters] = useState({
    distanceFromCenter: [] as string[],
    cityId: [] as string[],
    stars: [] as number[],
    pricePerNight: 0,
  });

  const handleFilterChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
  }, []);

  const minPrice = useMemo(() => {
    return hotel?.length
      ? Math.min(
          ...hotel.map((p: IHotel) => +p.pricePerNight).filter((n) => !isNaN(n))
        )
      : 0;
  }, [hotel]);

  const maxPrice = useMemo(() => {
    return hotel?.length
      ? Math.max(
          ...hotel.map((p: IHotel) => +p.pricePerNight).filter((n) => !isNaN(n))
        )
      : 0;
  }, [hotel]);

  // ⭐ Distance Groups
  const distanceGroups = useMemo(
    () => [
      { label: "0.5 - 1 km", value: "0.5-1", min: 0.5, max: 1 },
      { label: "1 - 3 km", value: "1-3", min: 1, max: 3 },
      { label: "3 - 5 km", value: "3-5", min: 3, max: 5 },
      { label: "5 - 10 km", value: "5-10", min: 5, max: 10 },
      { label: "10+ km", value: "10+", min: 10, max: Infinity },
    ],
    []
  );

  // ⭐ Filtering + Search
  const filteredHotels = useMemo(() => {
    if (!hotel || hotel.length === 0) return [];

    return hotel.filter((item: IHotel) => {
      // 🔍 Search
      const matchSearch = item.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      // 📌 Distance Filter
      let matchDistance = true;
      if (filters.distanceFromCenter.length > 0) {
        const distanceValue = parseFloat(item.distanceFromCenter); // "3.5 km" => 3.5

        const selectedRanges = distanceGroups.filter((g) =>
          filters.distanceFromCenter.includes(g.value)
        );

        matchDistance = selectedRanges.some(
          (r) => distanceValue >= r.min && distanceValue <= r.max
        );
      }

      // 📌 City Filter
      const matchCity =
        filters.cityId.length > 0 ? filters.cityId.includes(item.cityId) : true;

      // 📌 Stars Filter
      const matchStars =
        filters.stars.length > 0 ? filters.stars.includes(item.stars) : true;

      // 📌 Price Filter
      const matchPrice =
        filters.pricePerNight > 0
          ? item.pricePerNight <= filters.pricePerNight
          : true;

      return (
        matchSearch && matchDistance && matchCity && matchStars && matchPrice
      );
    });
  }, [hotel, searchTerm, filters, distanceGroups]);

  const totalPages = Math.ceil(filteredHotels.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedHotels = filteredHotels.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  if (loading) return <Spinner />;

  if (error)
    return (
      <h2 className="text-center mt-10 text-red-600 text-lg">
        Failed to load hotels, please try again later.
      </h2>
    );

  return (
    <div>
      <HeroSection
        header="Book Your Hotel"
        title={countryId ? countryId.toUpperCase() : "Hotels"}
        dis="Discover breathtaking places around the globe.
             From ancient wonders to modern marvels,"
      />

      {/* Search */}
      <section className="py-16">
        <div className="mb-8 flex justify-center">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search countries..."
              className="w-full rounded-full border border-gray-300 bg-white px-12 py-3 shadow-md placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition outline-none"
            />
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        <div className="px-4 md:px-10 py-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            {/* Sidebar Filter */}
            <div className="col-span-2">
              <Filter
                onFilterChange={handleFilterChange}
                minPrice={minPrice}
                maxPrice={maxPrice}
                allHotels={hotel}
              />
            </div>

            {/* Hotels List */}
            <div className="col-span-4 md:col-span-6">
              <HotelList
                hotels={paginatedHotels}
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
              />
            </div>

            {/* Hotels Map */}
            <div className="col-span-4 md:col-span-4">
              <HotelMap hotel={paginatedHotels} loading={loading} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
