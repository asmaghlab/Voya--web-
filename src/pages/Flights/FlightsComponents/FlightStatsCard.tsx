// src/components/FlightStatsCard.tsx
import { motion } from "framer-motion";

interface FlightStatsCardProps {
  title: string;
  value: string | number;
  subValue?: string;
  icon: JSX.Element;
}

export default function FlightStatsCard({ title, value, subValue, icon }: FlightStatsCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -2 }}
      transition={{ type: "spring", stiffness: 250 }}
      className="p-6 border-2 border-white/40 rounded-2xl shadow-lg hover:shadow-2xl text-white"
    >
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-lg font-bold">{title}</h4>
        {icon}
      </div>
      <p className="text-xl font-extrabold text-blue-300">{value}</p>
      {subValue && <p className="text-base text-white/70">{subValue}</p>}
    </motion.div>
  );
}
