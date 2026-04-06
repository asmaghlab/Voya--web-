import { motion } from "framer-motion";
import { FiMapPin } from "react-icons/fi";
import { FaPlane } from "react-icons/fa";
import { Input } from "@/components/UI/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/UI/select";

interface CustomFlightsSearchProps {
  fromSearch: string;
  toSearch: string;
  setFromSearch: (v: string) => void;
  setToSearch: (v: string) => void;
  cityFilter: string;
  airlineFilter: string;
  setCityFilter: (v: string) => void;
  setAirlineFilter: (v: string) => void;
  maxPrice: number | "";
  setMaxPrice: (v: number | "") => void;
  allCities: string[];
  allAirlines: string[];
}

export const FlightsSearch = ({
  fromSearch,
  toSearch,
  setFromSearch,
  setToSearch,
  cityFilter,
  airlineFilter,
  setCityFilter,
  setAirlineFilter,
  maxPrice,
  setMaxPrice,
  allCities,
  allAirlines,
}: CustomFlightsSearchProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
      className="bg-card rounded-2xl shadow-card p-4 mt-8 border border-border/30 max-w-6xl mx-auto"
    >
      <div className="flex flex-wrap gap-4 items-end">
        {/* City */}
        <div className="flex-1 min-w-[150px]">
          <label className="text-sm font-semibold flex gap-2 mb-1">
            <FiMapPin className="h-4 w-4 text-primary" />
            City
          </label>
          <Select value={cityFilter} onValueChange={setCityFilter}>
            <SelectTrigger className="h-10 px-2 border-b border-border/50">
              <SelectValue placeholder="Select City" />
            </SelectTrigger>
            <SelectContent>
              {allCities.map((city) => (
                <SelectItem key={city} value={city}>{city}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Airline */}
        <div className="flex-1 min-w-[150px]">
          <label className="text-sm font-semibold flex gap-2 mb-1">
            <FaPlane className="h-4 w-4 text-accent" />
            Airline
          </label>
          <Select value={airlineFilter} onValueChange={setAirlineFilter}>
            <SelectTrigger className="h-10 px-2 border-b border-border/50">
              <SelectValue placeholder="Select Airline" />
            </SelectTrigger>
            <SelectContent>
              {allAirlines.map((airline) => (
                <SelectItem key={airline} value={airline}>{airline}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* From */}
        <div className="flex-1 min-w-[120px]">
          <label className="text-sm font-semibold mb-1">From</label>
          <Input
            type="text"
            placeholder="From..."
            value={fromSearch}
            onChange={(e) => setFromSearch(e.target.value)}
            className="h-10 px-2 border-b border-border/50"
          />
        </div>

        {/* To */}
        <div className="flex-1 min-w-[120px]">
          <label className="text-sm font-semibold mb-1">To</label>
          <Input
            type="text"
            placeholder="To..."
            value={toSearch}
            onChange={(e) => setToSearch(e.target.value)}
            className="h-10 px-2 border-b border-border/50"
          />
        </div>

        {/* Max Price */}
        <div className="flex-1 min-w-[120px]">
          <label className="text-sm font-semibold mb-1">Max Price</label>
          <Input
            type="number"
            placeholder="Max Price..."
            value={maxPrice}
            onChange={(e) =>
              setMaxPrice(e.target.value === "" ? "" : parseFloat(e.target.value))
            }
            className="h-10 px-2 border-b border-border/50"
          />
        </div>
      </div>
    </motion.div>
  );
};
