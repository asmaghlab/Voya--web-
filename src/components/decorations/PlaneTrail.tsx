import { motion } from "framer-motion";
import planeTrail from "@/assets/plane-trail.png";

export const PlaneTrail = () => {
  return (
    <motion.div 
      className="absolute top-2 right-2 opacity-40"
      initial={{ x: -200, opacity: 0 }}
      animate={{ 
        x: 0, 
        opacity: 1,
      }}
      transition={{
        duration: 2,
        ease: "easeOut",
        repeat: Infinity,
        repeatType: "loop",
        repeatDelay: 3
      }}
    >
      <img 
        src={planeTrail} 
        alt="Plane trail" 
        className="h-16 w-auto object-contain"
      />
    </motion.div>
  );
};
