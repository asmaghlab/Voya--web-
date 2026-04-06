import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/UI/button";

const CTA = () => {
  return (
    <section className="py-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto text-center"
      >
        <div className="relative overflow-hidden rounded-3xl bg-muted/50 p-12">
          {/* Decorative Blur Circle */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-primary-foreground blur-3xl" />
          </div>

          <div className="relative z-10">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className=" mb-8 max-w-xl mx-auto text-muted-foreground font-sans">
              Contact us today and let our experts craft your perfect adventure.
            </p>

            <Button
              asChild
              size="lg"
              className="  hover:bg-primary/70 font-semibold px-8"
            >
              <Link to="/contact">
                Contact Us Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default CTA;
