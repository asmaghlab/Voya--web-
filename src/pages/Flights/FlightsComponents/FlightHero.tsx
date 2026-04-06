// src/components/FlightHero.tsx
import { motion } from "framer-motion";
import { Star } from "lucide-react";

interface FlightHeroProps {
  flight: any;
  onBookClick: () => void;
  heroY: any;
  imageScale: any;
  imageX: any;
}

export default function FlightHero({ flight, onBookClick, heroY, imageScale, imageX }: FlightHeroProps) {
  return (
    <motion.div style={{ y: heroY }} className="flex flex-col lg:flex-row items-center justify-between gap-8">
      <motion.div initial={{ opacity: 0, x: -60 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1 }} className="space-y-6 max-w-2xl">
        <h1 className="text-6xl font-extrabold">{flight.airline}</h1>
        <div className="flex items-center gap-3 text-yellow-400">
          <Star className="fill-yellow-400" />
          <span className="font-bold text-xl">5.0</span>
        </div>
        <p className="text-lg text-white/90">
          Experience luxury travel with {flight.airline}. Direct flight from {flight.from} to {flight.to} with premium service and comfort.
        </p>
        <div className="space-y-2">
          <div className="text-4xl font-extrabold text-blue-300">${flight.price}</div>
          {flight.offer && <div className="text-lg text-green-300 font-semibold">{flight.offer}</div>}
        </div>
        <motion.button
          onClick={onBookClick}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-2xl font-bold text-lg shadow-2xl transition-all"
        >
          Book Now
        </motion.button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 80, scale: 0.95 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        style={{ scale: imageScale, x: imageX }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="w-[27rem] h-[27rem] rounded-3xl overflow-hidden shadow-2xl border border-white/20 flex-shrink-0"
      >
        <img src={flight.image} alt={flight.airline} className="w-full h-full object-cover" />
      </motion.div>
    </motion.div>
  );
}
