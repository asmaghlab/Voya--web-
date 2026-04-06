import { motion } from "framer-motion";
import { Plane, Globe, Heart, MapPin, Compass } from "lucide-react";

const CompanyStory = () => {
  const features = [
    { icon: Plane, title: "Expert Travel Planning", description: "Over 15 years of crafting unforgettable journeys across the globe." },
    { icon: Globe, title: "Global Destinations", description: "Access to exclusive destinations and local experiences worldwide." },
    { icon: Heart, title: "Personalized Service", description: "Every trip is tailored to your unique preferences and dreams." },
  ];

  const whyFeatures = [
    { icon: MapPin, title: "Curated Destinations", description: "Handpicked locations offering authentic experiences and breathtaking beauty." },
    { icon: Compass, title: "Expert Guides", description: "Local experts who bring destinations to life with insider knowledge." },
    { icon: Globe, title: "Seamless Planning", description: "From flights to accommodations, we handle every detail with care." },
  ];

  return (
    <>
      <section className="py-10 px-4 bg-background">
        <div className="container mx-auto max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden p-8 md:p-10"
          >
            <span className="text-primary font-medium text-sm uppercase tracking-wider">Our Story</span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mt-2 mb-6">
              Book With Confidence
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6 font-sans">
              Founded in 2008, we began with a simple mission: to make world-class travel accessible to everyone. What started as a small team of passionate travelers has grown into a trusted name in luxury travel experiences.
            </p>
            <p className="text-muted-foreground leading-relaxed font-sans">
              Leave your guidebooks at home and dive into the local cultures that make each destination so special. We'll connect you with our exclusive experiences. Each trip is carefully crafted to let you enjoy authentic moments and create memories that last a lifetime.
            </p>
          </motion.div>

          <div className="space-y-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex gap-4 items-start group"
              >
                <div className="flex-shrink-0 w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed font-sans">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-muted/30">
        <div className="container max-w-6xl mx-auto text-center mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-foreground mb-4">Why Choose Us</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto font-sans">
              With decades of experience crafting unforgettable journeys, we're your trusted partner in exploring the world.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mt-10">
            {whyFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative overflow-hidden rounded-2xl bg-white/85 backdrop-blur-md border border-gray-200 shadow-lg p-8 text-center transition-transform duration-300 hover:-translate-y-2"
              >
                <div className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary text-primary-foreground mx-auto mb-5">
                  {feature.icon && <feature.icon className="h-7 w-7" />}
                </div>
                <h3 className="font-serif text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground font-sans">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default CompanyStory;
