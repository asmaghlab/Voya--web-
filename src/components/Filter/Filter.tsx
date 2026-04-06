
import { IHotel } from "@/features/hotels/types";
import { useEffect, useMemo, useRef, useState } from "react";
import { FaStar } from "react-icons/fa";

interface FilterProps {
  onFilterChange: (filters: {
    distanceFromCenter: string[];
    cityId: string[];
    stars: number[];
    pricePerNight: number;
  }) => void;
  minPrice: number;
  maxPrice: number;
  allHotels: IHotel[];
}

export default function Filter({
  onFilterChange,
  minPrice,
  maxPrice,
  allHotels,
}: FilterProps) {
  const stars = [1, 2, 3, 4, 5];

  const cityId = useMemo(() => {
    return Array.from(new Set(allHotels.map((p) => p.cityId))).filter(Boolean);
  }, [allHotels]);

  const distanceFromCenter = useMemo(() => {
    return Array.from(
      new Set(allHotels.map((p) => p.distanceFromCenter))
    ).filter(Boolean);
  }, [allHotels]);

  // Filters
  const [selectedStars, setSelectedStars] = useState<number[]>([]);
  const [selectedCityId, setSelectedCityId] = useState<string[]>([]);
  const [selectedDistance, setSelectedDistance] = useState<string[]>([]);
  const [pricePerNight, setPricePerNight] = useState(maxPrice);

  // Mobile Offcanvas
  const [showFilter, setShowFilter] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const distanceGroups = [
  { label: "0.5 - 1 km", value: "0.5-1", min: 0.5, max: 1 },
  { label: "1 - 3 km", value: "1-3", min: 1, max: 3 },
  { label: "3 - 5 km", value: "3-5", min: 3, max: 5 },
  { label: "5 - 10 km", value: "5-10", min: 5, max: 10 },
  { label: "10+ km", value: "10+", min: 10, max: Infinity },
];

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    onFilterChange({
      distanceFromCenter: selectedDistance,
      cityId: selectedCityId,
      stars: selectedStars,
      pricePerNight,
    });
  }, [selectedDistance, selectedCityId, selectedStars, pricePerNight, onFilterChange]);

  const toggleValue = <T,>(arr: T[], value: T): T[] => {
    return arr.includes(value)
      ? arr.filter((v) => v !== value)
      : [...arr, value];
  };

  const handleClear = () => {
    setSelectedCityId([]);
    setSelectedDistance([]);
    setSelectedStars([]);
    setPricePerNight(maxPrice);
  };

  const FilterBody = (
    <div className="bg-white rounded-xl shadow p-3 w-full md:w-70">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-blue-600">Filters</h2>
        <button
          onClick={handleClear}
          className="px-3 py-1 text-sm rounded-full bg-gray-300 hover:bg-gray-400"
        >
          Clear
        </button>
      </div>

      {/* Price */}
      <div className="mb-6">
        <label className="block font-medium mb-1">Price Per Night</label>

        <input
          type="range"
          min={minPrice}
          max={maxPrice}
          value={pricePerNight}
          onChange={(e) => setPricePerNight(Number(e.target.value))}
          className="w-full"
        />

        <div className="flex justify-between text-sm text-gray-600 mt-2">
          <span>{minPrice} $</span>
          <span className="font-bold text-blue-600">{pricePerNight} $</span>
          <span>{maxPrice} $</span>
        </div>
      </div>

      {/* Stars */}
      <div className="mb-6">
        <label className="block font-medium mb-2">Stars</label>

        <div className="space-y-2">
          {stars.map((star) => (
            <label
              key={star}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedStars.includes(star)}
                onChange={() =>
                  setSelectedStars(toggleValue(selectedStars, star))
                }
                className="w-4 h-4"
              />
              {Array(star)
                .fill(0)
                .map((_, i) => (
                  <FaStar key={i} className="text-yellow-400" />
                ))}
            </label>
          ))}
        </div>
      </div>

      {/* CityId */}
      <div className="mb-6">
        <label className="block font-medium mb-2">City</label>

        <div className="space-y-2">
          {cityId.map((city) => (
            <label
              key={city}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedCityId.includes(city)}
                onChange={() =>
                  setSelectedCityId(toggleValue(selectedCityId, city))
                }
                className="w-4 h-4"
              />
              <span className="text-gray-700">{city}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Distance */}
      <div className="mb-6">
        <label className="block font-medium mb-2">Distance From Center</label>

        <div className="space-y-2">
          {distanceGroups.map((group) => (
            <label
              key={group.value}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedDistance.includes(group.value)}
                onChange={() =>
                  setSelectedDistance(
                    toggleValue(selectedDistance, group.value)
                  )
                }
                className="w-4 h-4"
              />
              <span className="text-gray-700">{group.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Button */}
      {isMobile && (
        <button
          className="md:hidden mb-3 px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2"
          onClick={() => setShowFilter(true)}
        >
          <i className="fa-solid fa-filter"></i> Filters
        </button>
      )}

      {/* Desktop Filter */}
      {!isMobile && (
        <div className="bg-white rounded-xl shadow ">{FilterBody}</div>
      )}

      {/* Mobile Offcanvas */}
      {isMobile && showFilter && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50">
          <div className="fixed left-0 top-0 h-full w-80 bg-white shadow-xl z-50 p-4 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-blue-600">Filters</h2>
              <button
                onClick={() => setShowFilter(false)}
                className="text-xl font-bold"
              >
                ✕
              </button>
            </div>
            {FilterBody}
          </div>
        </div>
      )}
    </>
  );
}
