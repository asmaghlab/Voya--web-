import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, Plane, Clock, Users, MapPin } from "lucide-react";
import axios from "axios";

import FlightHero from "./FlightsComponents/FlightHero";
import FlightStatsCard from "./FlightsComponents/FlightStatsCard";
import Spinner from "./FlightsComponents/spinner";
import { FlightBookingForm } from "../booking/FlightBookingForm";

export default function FlightDetails() {
  const { flightId } = useParams<{ flightId: string }>();
  const [flight, setFlight] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showBooking, setShowBooking] = useState(false);
  const [bookingData, setBookingData] = useState({
    name: "",
    email: "",
    phone: "",
    passengers: 1,
    date: "",
  });
  const navigate = useNavigate();

  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 50], [0, 20]);

  useEffect(() => {
    axios
      .get("https://6927461426e7e41498fdb2c5.mockapi.io/countries")
      .then(({ data }) => {
        let foundFlight: any = null;
        data.forEach((country) => {
          country.city.forEach((city) => {
            city.flights.forEach((f) => {
              if (f.id === Number(flightId)) {
                foundFlight = {
                  ...f,
                  country: country.name,
                  city: city.name,
                  image: country.image,
                };
              }
            });
          });
        });
        setFlight(foundFlight);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, [flightId]);

  if (loading) return <Spinner />;
  if (!flight) return null;

  return (
    <main className="relative w-full min-h-screen overflow-x-hidden bg-black text-white">
      <img
        src={flight.image}
        alt={flight.airline}
        className="absolute inset-0 w-full h-full object-cover filter blur-sm brightness-70"
      />
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="relative z-10 container mx-auto py-10 space-y-12 bg-white/10 backdrop-blur-md p-6 max-w-full overflow-hidden rounded-none">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-white/90 hover:text-white"
        >
          <ArrowLeft size={20} /> Back
        </button>

        <FlightHero
          flight={flight}
          onBookClick={() => setShowBooking(true)}
          heroY={heroY}
          imageScale={1}
          imageX={0}
        />

        <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
          <FlightStatsCard
            title="Departure"
            value={flight.city}
            subValue={flight.from}
            icon={<Plane className="text-blue-400" size={20} />}
          />
          <FlightStatsCard
            title="Arrival"
            value={flight.country}
            subValue={flight.to}
            icon={<MapPin className="text-blue-400" size={20} />}
          />
          <FlightStatsCard
            title="Duration"
            value={flight.duratuion}
            subValue="Flight time"
            icon={<Clock className="text-blue-400" size={20} />}
          />
          <FlightStatsCard
            title="Capacity"
            value={flight.passanger}
            subValue="Passengers"
            icon={<Users className="text-blue-400" size={20} />}
          />
        </div>
        {showBooking && (
          <FlightBookingForm
            showBooking={showBooking}
            setShowBooking={setShowBooking}
            flight={flight}
          />
        )}
      </div>
    </main>
  );
}
