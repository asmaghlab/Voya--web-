import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

interface ContactCardProps {
  icon: React.ReactNode;
  title: string;
  lines: string[];
  delay?: number;
}

const ContactCard = ({ icon, title, lines, delay = 0 }: ContactCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className="bg-white/50 backdrop-blur-md rounded-xl p-8 text-center shadow-md hover:shadow-lg hover:scale-105 transition-all"
    >
      <div className="flex flex-col items-center">
        <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center mb-5 text-primary text-2xl">
          {icon}
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-3">{title}</h3>
        <div className="space-y-1 text-gray-500">
          {lines.map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const contactData = [
  { icon: <Phone />, title: "Phone", lines: ["+1 (234) 567-890", "+1 (555) 987-6543"] },
  { icon: <Mail />, title: "Email", lines: ["Voya@gmail.com", "support@Voya.com"] },
  { icon: <MapPin />, title: "Office Location", lines: ["123 Travel St., Wanderlust City, Country"] },
  { icon: <Clock />, title: "Opening Hours", lines: ["Mon - Fri: 9:00 AM - 6:00 PM", "Sat - Sun: 10:00 AM - 4:00 PM"] },
];

const ContactCards = () => {
  return (
    <section className="py-20 px-4">
      <div className="container max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 font-serif">
            Get in Touch
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Have questions about your next adventure? Our travel experts are here to help you plan the perfect trip.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactData.map((card, index) => (
            <ContactCard
              key={card.title}
              icon={card.icon}
              title={card.title}
              lines={card.lines}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ContactCards;
