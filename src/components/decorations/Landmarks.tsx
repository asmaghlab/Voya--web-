import { motion } from "framer-motion";
import landmarks1 from "@/assets/landmarks-1.png";
import landmarks2 from "@/assets/landmarks-2.png";

export const Landmarks = () => {
  return (
    <div className="absolute bottom-0 left-0 right-0 w-full h-32 
                    flex items-end justify-between px-19 pointer-events-none">

      {/* Left Image */}
      <motion.img 
        src={landmarks2} 
        alt="Taj Mahal" 
        className="h-24 w-auto object-contain"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
      />

      {/* Right Image */}
      <motion.img 
        src={landmarks1} 
        alt="Famous landmarks" 
        className="h-24 w-auto object-contain"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.4 }}
      />
    </div>
  );
};
