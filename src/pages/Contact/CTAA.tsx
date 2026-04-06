import { motion } from "framer-motion";
import { ArrowRight, Plane } from "lucide-react";
import { Button } from "@/components/UI/Button";
import { Link } from 'react-router-dom';

const CTA = () => {
  return (
    <section className="py-16 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="container max-w-5xl mx-auto"
      >
        <div className="relative rounded-3xl p-8 md:p-12 bg-blue-400 text-white overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/10 blur-3xl transform translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white/10 blur-3xl transform -translate-x-1/2 translate-y-1/2" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="hidden md:flex w-16 h-16 rounded-2xl bg-white/20 items-center justify-center backdrop-blur-sm"
              >
                <Plane className="h-8 w-8 text-white" />
              </motion.div>

              <div className="text-center md:text-left">
                <h2 className="text-2xl md:text-3xl font-bold mb-2 font-serif">
                  Ready for Your Next Adventure?
                </h2>
                <p className="text-white/80 max-w-md">
                  Let us help you create unforgettable memories around the world.
                </p>
              </div>
            </div>

             <Link to="/flights">
      <Button
        size="lg"
        className="
          bg-white text-primary hover:bg-white/90
          font-semibold px-8 py-6 text-base
          transition-all duration-300
          hover:shadow-xl
          flex items-center gap-2
        "
      >
        Book Your Trip Now
        <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
      </Button>
    </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default CTA;
