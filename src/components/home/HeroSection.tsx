import { useState, useEffect } from "react";
import { Search, MapPin, Calendar, Plane } from "lucide-react";
import { Button } from "@/components/UI/Button";
import { Input } from "@/components/UI/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/UI/select";
import { useCountries } from "@/routes/useTravelData";
import { Country, City } from "@/types/travel";
import heroImage from "@/assets/hero.jpeg";

import { motion } from "framer-motion";

interface HeroSectionProps {
  onSearch: (params: {
    country: string;
    destination: string;
    durationFrom: number;
    durationTo: number;
  }) => void;
}

export const HeroSection = ({ onSearch }: HeroSectionProps) => {
  const { data: countries, isLoading } = useCountries();
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedDestination, setSelectedDestination] = useState("");
  const [durationFrom, setDurationFrom] = useState("");
  const [durationTo, setDurationTo] = useState("");
  const [cities, setCities] = useState<City[]>([]);

  useEffect(() => {
    if (selectedCountry && countries) {
      const country = countries.find((c) => c.id === selectedCountry);
      setCities(country?.city || []);
      setSelectedDestination("");
    }
  }, [selectedCountry, countries]);

  const handleSearch = () => {
    onSearch({
      country: selectedCountry,
      destination: selectedDestination,
      durationFrom: parseInt(durationFrom) || 1,
      durationTo: parseInt(durationTo) || 30,
    });
  };

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-background">
      
      {/* Background decorative */}
      <motion.div
        initial={{ opacity: 0, x: 80 }}
        animate={{ opacity: 0.3, x: 0 }}
        transition={{ duration: 1.2 }}
        className="absolute bottom-0 right-0 w-[60%] h-[80%]"
        style={{
          background: "linear-gradient(135deg, hsl(var(--primary)/0.1) 0%, hsl(220 70% 85% / 0.3) 50%, hsl(280 60% 90% / 0.2) 100%)",
          borderRadius: "50% 0 0 50%",
          transform: "translateX(20%)"
        }}
      />

      <div className="container mx-auto px-4 relative z-10 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* LEFT TEXT */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="space-y-8"
          >
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full border-2 border-primary text-primary text-sm font-semibold"
            >
              Book With Us!
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold"
            >
              Find Next Place
              <br />
              To <span className="text-primary">Visit</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-lg text-muted-foreground max-w-md"
            >
              Discover amazing places at exclusive deals.
              <br />
              Eat, Shop, Visit interesting places around the world.
            </motion.p>

            {/* FORM */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-card rounded-2xl shadow-card p-6 mt-8 border border-border/30 max-w-2xl"
            >
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  className="space-y-2"
                >
                  <label className="text-sm font-semibold flex gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    Country
                  </label>
                  <Select
                    value={selectedCountry}
                    onValueChange={setSelectedCountry}
                    disabled={isLoading}
                  >
                    <SelectTrigger className="bg-background border-0 border-b-2 px-0 h-12">
                      <SelectValue placeholder="Select Country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries?.map((country) => (
                        <SelectItem key={country.id} value={country.id}>
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1 }}
                  className="space-y-2"
                >
                  <label className="text-sm font-semibold flex gap-2">
                    <MapPin className="h-4 w-4 text-accent" />
                    Destination
                  </label>

                  <Select
                    value={selectedDestination}
                    onValueChange={setSelectedDestination}
                    disabled={!selectedCountry || cities.length === 0}
                  >
                    <SelectTrigger className="bg-background border-0 border-b-2 px-0 h-12">
                      <SelectValue placeholder="Select City" />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((city) => (
                        <SelectItem key={city.id} value={city.id}>
                          {city.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.3 }}
                >
                  <label className="text-sm font-semibold flex gap-2 mb-1">
                    <Calendar className="h-4 w-4 text-primary" />
                    Duration
                  </label>

                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="From"
                      value={durationFrom}
                      onChange={(e) => setDurationFrom(e.target.value)}
                      min={1}
                      className="bg-background border-0 border-b-2 px-0 h-12 w-full"
                    />

                    <Input
                      type="number"
                      placeholder="To"
                      value={durationTo}
                      onChange={(e) => setDurationTo(e.target.value)}
                      min={1}
                      className="bg-background border-0 border-b-2 px-0 h-12 w-full"
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5 }}
                >
                  <Button onClick={handleSearch} size="lg" className="w-full">
                    <Search className="h-5 w-5" />
                    Search
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>

          {/* RIGHT IMAGE */}
          <motion.div
            className="hidden lg:block relative"
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.3 }}
              className="relative rounded-3xl overflow-hidden shadow-2xl"
            >
              <img
                src={heroImage}
                alt="travel"
                className="w-full h-[600px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent" />
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};





