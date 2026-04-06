import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, Star, MapPin, Plane } from "lucide-react";
import { Country, City, Flight } from "@/types/country";
import { RootState, AppDispatch } from "@/routes/store";
import {
  fetchCountryById,
  clearSelectedCountry,
} from "@/features/countries/countriesSlice";

export default function CountryDetails() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { selectedCountry, loading } = useSelector(
    (s: RootState) => s.countries
  );

  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 300], [0, 40]);
  const imageScale = useTransform(scrollY, [0, 300], [1, 1.1]);
  const imageX = useTransform(scrollY, [0, 300], [0, -20]);

  useEffect(() => {
    if (id) dispatch(fetchCountryById(id));
    return () => {
      dispatch(clearSelectedCountry());
    };
  }, [dispatch, id]);

  if (loading)
    return <p className="text-center py-10 text-white">Loading...</p>;

  if (!selectedCountry) return null;

  const country: Country = selectedCountry;

  return (
    <main className="relative w-full min-h-screen overflow-x-hidden bg-black text-white">
      {/* Background */}
      <img
        src={country.image}
        alt={country.name}
        className="absolute inset-0 w-full h-full object-cover blur-sm brightness-70"
      />
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Glass container */}
      <div className="relative z-10 container mx-auto py-10 space-y-12 bg-white/10 backdrop-blur-md p-6 max-w-full overflow-hidden rounded-none">
        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-white/90 hover:text-white"
        >
          <ArrowLeft size={20} /> Back
        </Link>

        {/* Hero Section */}
        <motion.div
          style={{ y: heroY }}
          className="flex flex-col lg:flex-row items-center justify-between gap-8"
        >
          {/* Name & info */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="space-y-6 max-w-2xl"
          >
            <h1 className="text-6xl font-extrabold">{country.name}</h1>

            <div className="flex items-center gap-3 text-yellow-400">
              <Star className="fill-yellow-400" />
              <span className="font-bold text-xl">{country.rating}</span>
            </div>

            <p className="text-lg text-white/90">{country.cun_des}</p>

            <Link
              to={`/hotels?countryId=${country.id}`}
              className="inline-flex items-center gap-2 text-blue-600 text-lg font-semibold hover:text-blue-700 transition"
            >
              View Hotels
            </Link>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: 80, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            style={{ scale: imageScale, x: imageX }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="
              w-64 h-64 
              sm:w-80 sm:h-80 
              lg:w-[27rem] lg:h-[27rem] 
              mb-6 lg:mb-0
              rounded-3xl overflow-hidden shadow-2xl 
              border border-white/20 flex-shrink-0
            "
          >
            <img
              src={country.image}
              alt={country.name}
              className="w-full h-full object-cover"
            />
          </motion.div>
        </motion.div>

        {/* Cities Section */}
        <section className="space-y-8">
          <h2 className="text-3xl font-bold flex items-center gap-2">
            <MapPin /> Cities & Flights
          </h2>

          <div className="flex flex-col gap-6">
            {country.city?.map((c: City, index: number) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                transition={{
                  type: "spring",
                  stiffness: 80,
                  damping: 15,
                  duration: 0.4,
                  delay: index * 0.05,
                }}
                className="p-6 rounded-3xl space-y-4"
              >
                <h3 className="text-2xl font-bold">{c.name}</h3>
                <p className="text-white/90">{c.des}</p>

                {/* Flights */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                  {c.flights?.map((f: Flight) => (
                    <motion.div
                      key={f.id}
                      whileHover={{ scale: 1.03, y: -2 }}
                      transition={{
                        type: "spring",
                        stiffness: 120,
                        damping: 15,
                      }}
                      className="p-4 bg-white/19 backdrop-blur-md border border-white/20 shadow-lg rounded-2xl space-y-2"
                    >
                      <div className="flex justify-between items-center">
                        <h4 className="font-bold">{f.airline}</h4>
                        <Plane className="text-white/90" />
                      </div>

                      <p className="text-sm text-white/90">
                        {f.from} → {f.to}
                      </p>

                      <div className="text-lg font-extrabold text-white/90">
                        ${f.price}
                      </div>

                      <div className="text-sm text-green-400 font-semibold">
                        {f.offer}
                      </div>

                      <div className="text-sm text-white/70">
                        Duration: {f.duratuion}
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex gap-1 text-yellow-400">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              className="fill-yellow-400"
                            />
                          ))}
                        </div>
                        <Link
                          to={`/flight/${f.id}`}
                          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-semibold transition"
                        >
                          View Details{" "}
                          <ArrowLeft className="rotate-180" size={16} />
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
