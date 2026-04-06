import { useState, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Button } from "@/components/UI/button";

export const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch("https://6934ceba4090fe3bf020c412.mockapi.io/api/v1/hotels");
        if (!response.ok) throw new Error("Failed to fetch testimonials");
        const data = await response.json();
        setTestimonials(data.slice(0, 10));
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const currentTestimonial = testimonials[currentIndex];

  if (loading) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-muted-foreground">Loading testimonials...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-red-500">Error loading testimonials: {error}</p>
          </div>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-muted-foreground">No testimonials available.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
           Top Rated <span className="text-primary">Hotels</span>
          </h2>
        </div>

        {/* Testimonial Carousel */}
        <div className="max-w-3xl mx-auto">
          <div className="relative bg-card rounded-3xl shadow-xl p-8 md:p-12">
            {/* Quote Icon */}
            <div className="absolute top-6 right-8 text-primary/20">
              <Quote className="h-16 w-16" />
            </div>

            {/* Content */}
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <img
                  src={
                    (Array.isArray(currentTestimonial.images) && currentTestimonial.images[0]) ||
                    currentTestimonial.avatar || 
                    currentTestimonial.image || 
                    currentTestimonial.photo ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(currentTestimonial.name || 'User')}&size=150&background=0ea5e9&color=fff`
                  }
                  alt={currentTestimonial.name || "Customer"}
                  onError={(e) => {
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentTestimonial.name || 'User')}&size=150&background=0ea5e9&color=fff`;
                  }}
                  className="w-24 h-24 rounded-full object-cover border-4 border-primary/20"
                />
              </div>

              {/* Text Content */}
              <div className="flex-1 text-center md:text-left">
                {/* Rating */}
                <div className="flex items-center justify-center md:justify-start gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < (currentTestimonial.rating || 5)
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-muted"
                      }`}
                    />
                  ))}
                </div>

                {/* Testimonial Text */}
               

                {/* Author Info */}
                <div>
                  <h4 className="font-bold text-foreground">
                    {currentTestimonial.name || 'Anonymous'}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {typeof currentTestimonial.location === 'string'
                      ? currentTestimonial.location
                      : currentTestimonial.location?.formattedAddress || 
                        currentTestimonial.role || 
                        'Traveler'}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <Button
                variant="outline"
                size="icon"
                onClick={prevTestimonial}
                className="rounded-full"
                disabled={testimonials.length <= 1}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>

              {/* Page Indicator */}
              <div className="flex items-center gap-2 min-w-[100px] justify-center">
                <span className="text-sm font-medium text-foreground">
                  {currentIndex + 1} / {testimonials.length}
                </span>
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={nextTestimonial}
                className="rounded-full"
                disabled={testimonials.length <= 1}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};