import React from "react";
import { Hotel, Globe as GlobeIcon, Users, Calendar } from "lucide-react";
import Globe from "@/components/UI/Globe";
import StatCard from "@/components/UI/StatCard";
import {
  useHotels,
  useCountries,
  useUsers,
  useBookingshotels,
  useBookingsflights,
} from "@/routes/useApiData";
import { motion } from "framer-motion";
import FlightsBookingsChart from "@/components/charts/Flightsbooking";
import UsersChart from "@/components/charts/UsersChart";
import CountriesChart from "@/components/charts/CountriesChart";
import HotelsBooking from "@/components/charts/Hotelsbooking";

const Charts: React.FC = () => {
  const { data: hotels, isLoading: hotelsLoading } = useHotels();
  const { data: countries, isLoading: countriesLoading } = useCountries();
  const { data: users, isLoading: usersLoading } = useUsers();
  const { data: bookings, isLoading: bookingsLoading } = useBookingshotels();
  const { data: flightbookings, isLoading: flightbookingsLoading } =useBookingsflights();

  const isLoading =
    hotelsLoading ||
    countriesLoading ||
    usersLoading ||
    bookingsLoading ||
    flightbookingsLoading;

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Stats + Globe */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-12">
          {/* Left Stats */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-6 lg:mb-8">
              General <span className="text-blue-400">Statistics</span>
            </h1>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {[
                {
                  title: "Total Hotels",
                  value: hotels?.length || 0,
                  icon: Hotel,
                  load: hotelsLoading,
                },
                {
                  title: "Total Countries",
                  value: countries?.length || 0,
                  icon: GlobeIcon,
                  load: countriesLoading,
                },
                {
                  title: "Total Users",
                  value: users?.length || 0,
                  icon: Users,
                  load: usersLoading,
                },
                {
                  title: "Total Bookings Per Hotels ",
                  value: bookings?.length || 0,
                  icon: Calendar,
                  load: bookingsLoading,
                },
                {
                  title: "Total Bookings Per Flights ",
                  value: flightbookings?.length || 0,
                  icon: Calendar,
                  load: flightbookingsLoading,
                },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: idx * 0.15,
                    duration: 0.6,
                    ease: "easeOut",
                  }}
                >
                  <StatCard
                    title={item.title}
                    value={item.value}
                    icon={item.icon}
                    isLoading={item.load}
                    variant={idx % 2 === 0 ? "primary" : "accent"}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Globe */}
          <motion.div
            className="relative h-[300px] sm:h-[350px] lg:h-[400px] order-first lg:order-last"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          >
            <Globe />
          </motion.div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[
            {
              title: "Booking Per Flights",
              component: <FlightsBookingsChart />,
            },
            { title: "Users per Month", component: <UsersChart /> },
            { title: "Users per Country", component: <CountriesChart /> },
            { title: "Bookings per Hotels", component: <HotelsBooking /> },
          ].map((chart, idx) => (
            <motion.div
              key={idx}
              className="bg-white p-5 rounded-2xl shadow transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.2, duration: 0.6, ease: "easeOut" }}
              whileHover={{ scale: 1.03 }} 
            >
              <h2 className="font-semibold mb-4 text-lg text-foreground">
                {chart.title}
              </h2>
              {chart.component}
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Charts;
