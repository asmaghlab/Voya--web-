import { useQuery } from "@tanstack/react-query";
import { Country, Hotel } from "@/types/travel";

const COUNTRIES_API = "https://6927461426e7e41498fdb2c5.mockapi.io/countries";
const HOTELS_API = "https://6927461426e7e41498fdb2c5.mockapi.io/hotels";

export const useCountries = () => {
  return useQuery<Country[]>({
    queryKey: ["countries"],
    queryFn: async () => {
      const response = await fetch(COUNTRIES_API);
      if (!response.ok) throw new Error("Failed to fetch countries");
      return response.json();
    },
  });
};

export const useHotels = () => {
  return useQuery<Hotel[]>({
    queryKey: ["hotels"],
    queryFn: async () => {
      const response = await fetch(HOTELS_API);
      if (!response.ok) throw new Error("Failed to fetch hotels");
      return response.json();
    },
  });
};
