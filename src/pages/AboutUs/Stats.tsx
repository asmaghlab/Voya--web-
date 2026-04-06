import { motion } from "framer-motion";
import { MapPin, Users, Compass, Award } from "lucide-react";

const stats = [
  { icon: Compass, value: "500+", label: "Trips Organized" },
  { icon: Users, value: "10,000+", label: "Happy Customers" },
  { icon: MapPin, value: "80+", label: "Destinations" },
  { icon: Award, value: "15+", label: "Years Experience" },
];

const Stats = () => {
  return (
    <section className="py-16 px-4 bg-blue-100">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full  mb-4 bg-gradient-to-br from-primary/10 to-primary/10 text-primary-foreground ">
              <stat.icon className="w-7 h-7 text-primary" />
            </div>
            <div className="font-playfair text-3xl md:text-4xl font-bold text-gray-600 ">
              {stat.value}
            </div>
            <div className=" text-gray-400 mt-1">{stat.label}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Stats;
