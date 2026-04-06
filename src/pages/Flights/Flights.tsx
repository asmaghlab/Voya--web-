import axios from "axios";
import React, { useEffect, useState } from "react";
import { Flight, Country, FlightBooking } from "./FlightsTypes/Flightstypes";
import { FlightHeroSection } from "./FlightsComponents/Herosection";
import { FlightsSearch} from "./FlightsComponents/FlightsSearch"
import { FlightCard } from "./FlightsComponents/FlightCard";
import { Pagination } from "./FlightsComponents/Pagination";
import Spinner from "./FlightsComponents/spinner";
import { Helmet } from "react-helmet";

export default function Flights() {
  const [groupedFlights, setGroupedFlights] = useState<{ [key: string]: Flight[] }>({});
  const [fromSearch, setFromSearch] = useState("");
  const [toSearch, setToSearch] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [airlineFilter, setAirlineFilter] = useState("");
  const [maxPrice, setMaxPrice] = useState<number | "">("");
  const [sortPriceAsc, setSortPriceAsc] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [bookings, setBookings] = useState<FlightBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 12;

  // Fetch data
  useEffect(() => {
    setLoading(true);
    axios
      .get<Country[]>("https://6927461426e7e41498fdb2c5.mockapi.io/countries")
      .then(({ data }) => {
        const flightsByCountry: { [key: string]: Flight[] } = {};

        data.forEach((country) => {
          const countryFlights: Flight[] = [];
          country.city.forEach((city) => {
            city.flights.forEach((flight) => {
              countryFlights.push({
                ...flight,
                country: country.name,
                city: city.name,
                image: country.image,
              });
            });
          });
          flightsByCountry[country.name] = countryFlights;
        });
        setGroupedFlights(flightsByCountry);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // Filters
  const filterFlight = (flight: Flight) => {
    const fromMatch = !fromSearch || flight.from.toLowerCase().includes(fromSearch.toLowerCase());
    const toMatch = !toSearch || flight.to.toLowerCase().includes(toSearch.toLowerCase());
    const cityMatch = !cityFilter || flight.city.toLowerCase() === cityFilter.toLowerCase();
    const airlineMatch = !airlineFilter || flight.airline.toLowerCase() === airlineFilter.toLowerCase();
    const priceMatch = maxPrice === "" || flight.price <= maxPrice;

    return fromMatch && toMatch && cityMatch && airlineMatch && priceMatch;
  };

  // // Sorting
  // const handleSortToggle = () => setSortPriceAsc(!sortPriceAsc);

  // // Booking
  // const handleBooking = (flight: Flight) => {
  //   const existing = bookings.find((b) => b.flightId === flight.id);
  //   if (existing) return alert("You already booked this flight!");

  //   const booking: FlightBooking = {
  //     flightId: flight.id,
  //     flightName: flight.airline,
  //     passengers: flight.passanger,
  //     totalPrice: flight.price * flight.passanger,
  //   };

  //   setBookings([...bookings, booking]);
  // };

  // const handleRemoveBooking = (flightId: number) => {
  //   setBookings(bookings.filter((b) => b.flightId !== flightId));
  // };

  // const handleUpdatePassengers = (flightId: number, newCount: number) => {
  //   setBookings(
  //     bookings.map((b) =>
  //       b.flightId === flightId
  //         ? { ...b, passengers: newCount, totalPrice: newCount * (b.totalPrice / b.passengers) }
  //         : b
  //     )
  //   );
  // };

  // Dropdown values
  const allCities = [...new Set(Object.values(groupedFlights).flat().map((f) => f.city))];
  const allAirlines = [...new Set(Object.values(groupedFlights).flat().map((f) => f.airline))];

  // Final list
  const allFlights = Object.values(groupedFlights).flat().filter(filterFlight);

  const sortedFlights = allFlights;

  // Pagination
  const totalPages = Math.ceil(sortedFlights.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentFlights = sortedFlights.slice(startIndex, startIndex + itemsPerPage);

  // Spinner while loading
 if (loading) return <Spinner />;


  return (
    <main>
        <Helmet>
                    <meta charSet="utf-8" />
                    <title>Voya | Flights</title>
        </Helmet>
      <FlightHeroSection />
      <section className="container py-16">
        {/* Search Bar */}
<FlightsSearch
  fromSearch={fromSearch}
  toSearch={toSearch}
  setFromSearch={setFromSearch}
  setToSearch={setToSearch}
  cityFilter={cityFilter}
  airlineFilter={airlineFilter}
  maxPrice={maxPrice}
  setMaxPrice={setMaxPrice}
  setCityFilter={setCityFilter}
  setAirlineFilter={setAirlineFilter}
  allCities={allCities}
  allAirlines={allAirlines}
/>

        {/* Cards Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-8">
          {currentFlights.map((flight, index) => (
            <FlightCard key={flight.id} flight={flight} index={index} />
          ))}
        </div>

        {/* Pagination */}
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </section>
    </main>
  );
}
