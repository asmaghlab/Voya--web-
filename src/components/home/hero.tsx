import { useState, useMemo } from "react";
import { HeroSection } from "@/components/home/HeroSection";
import { SearchResults } from "@/components/home/SearchResults";
import { useCountries, useHotels } from "@/routes/useTravelData";
import { SearchParams, Hotel, Flight, Country, City } from "@/types/travel";


const Index = () => {
  const { data: countries } = useCountries();
  const { data: hotels } = useHotels();
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null);
  const [isSearched, setIsSearched] = useState(false);

  const handleSearch = (params: SearchParams) => {
    setSearchParams(params);
    setIsSearched(true);
  };

  const filteredData = useMemo(() => {
    if (!searchParams || !countries || !hotels) {
      return { hotels: [], flights: [], country: undefined, city: undefined };
    }

    const selectedCountry = countries.find((c) => c.id === searchParams.country);
    const selectedCity = selectedCountry?.city.find(
      (c) => c.id === searchParams.destination
    );

    // Filter hotels by country and duration
    const filteredHotels = hotels.filter((hotel) => {
      const matchesCountry = hotel.countryId === searchParams.country;
      const matchesCity = searchParams.destination
        ? hotel.cityId === searchParams.destination
        : true;
      const matchesDuration =
        hotel.stayDuration >= searchParams.durationFrom &&
        hotel.stayDuration <= searchParams.durationTo;

      return matchesCountry && matchesCity && matchesDuration;
    });

    // Get flights from the selected city
    const filteredFlights = selectedCity?.flights || [];

    return {
      hotels: filteredHotels,
      flights: filteredFlights,
      country: selectedCountry,
      city: selectedCity,
    };
  }, [searchParams, countries, hotels]);

  return (
    <>
     

      <main className="min-h-screen bg-background">
        <HeroSection onSearch={handleSearch} />
        <SearchResults
          hotels={filteredData.hotels}
          flights={filteredData.flights}
          country={filteredData.country}
          city={filteredData.city}
          isSearched={isSearched}
        />
      </main>
    </>
  );
};

export default Index;
