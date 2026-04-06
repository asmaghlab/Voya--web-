import { motion } from "framer-motion";
import { MapPin, ExternalLink } from "lucide-react";

const Map = () => {
  const googleMapsKey = import.meta.env.VITE_GOOGLE_MAPS_KEY;
  const officeLocation = "123 Travel Street, San Francisco, CA 94102";
  const encodedAddress = encodeURIComponent(officeLocation);

  return (
    <section className="py-20 px-4">
      <div className="container max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 font-serif">
            Find Us
          </h2>
          <p className="text-gray-500">
            Visit our office or get directions to plan your trip consultation
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/50 backdrop-blur-md rounded-xl overflow-hidden shadow"
        >
          <div className="relative aspect-[16/9] w-full">
            {googleMapsKey ? (
              <iframe
                title="Office Location"
                src={`https://www.google.com/maps/embed/v1/place?key=${googleMapsKey}&q=${encodedAddress}&zoom=15`}
                className="w-full h-full border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <div className="w-full h-full bg-gray-100 flex flex-col items-center justify-center p-8">
                <div className="bg-white p-8 rounded-xl text-center max-w-md shadow">
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4 text-primary"
                  >
                    <MapPin className="h-8 w-8" />
                  </motion.div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Map Integration</h3>
                  <p className="text-gray-500 text-sm mb-4">
                    To display an interactive map, add your Google Maps API key to the environment variables.
                  </p>
                  <code className="text-xs bg-gray-100 px-3 py-2 rounded-lg block overflow-x-auto">
                    VITE_GOOGLE_MAPS_KEY=your_api_key
                  </code>
                  <div className="mt-6 pt-4 border-t border-gray-200 text-center">
                    <p className="text-gray-800 font-medium mb-2">{officeLocation}</p>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg shadow hover:bg-blue-500 transition-colors font-medium"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View on Google Maps
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Map;
