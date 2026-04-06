// Hero Section Component
export const FlightHeroSection = () => (
    <section className="relative py-20 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 overflow-hidden rounded-b-[70px]">

      {/* Decorative blur circles  */}
      <div className="absolute top-10 left-10 h-36 w-36 bg-white/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 h-40 w-40 bg-blue-100/20 rounded-full blur-3xl"></div>

      {/* Content */}
      <div className="container relative">
        <div className="mx-auto max-w-3xl text-center">
          
          <p className="mb-4 animate-fade-up text-sm font-semibold uppercase tracking-widest text-primary" style={{ animationDelay: "0ms" }}>
           Book Your Flight
          </p>

          <h1
            className="animate-fade-up font-serif text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl text-gray-900"
            style={{ animationDelay: "100ms" }}
          >
            Discover Destinations
          </h1>

          <p
            className="mt-6 animate-fade-up text-sm text-gray-400"
            style={{ animationDelay: "200ms" }}
          >
          
          Find the best flights to your dream destinations around the world.
          Compare prices, airlines, and travel dates to plan your perfect trip.
          </p>

        </div>
      </div>
    </section>
);