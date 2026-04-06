// src/components/Spinner.tsx
import { motion, useMotionValue, useTransform } from "framer-motion";
import { Plane } from "lucide-react";

export default function Spinner() {
  return (
    <div className="w-full flex justify-center items-center py-20 relative">
      <motion.div
        style={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
        className="absolute w-28 h-28"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2">
          <Plane size={24} className="text-blue-600" />
        </div>
      </motion.div>
    </div>
  );
}
