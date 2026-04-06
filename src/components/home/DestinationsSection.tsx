import { useEffect } from "react";
import { ArrowRight, Hotel, Plane } from "lucide-react";
import { Button } from "@/components/UI/Button";
import { useAppSelector, useAppDispatch } from "@/routes/hooks";
import { fetchDestinations } from "@/features/homeslices/destinationsSlice";
import { useNavigate } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/UI/carousel";

export const DestinationsSection = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { items: destinations, loading, error } = useAppSelector((state) => state.destinations);

  useEffect(() => {
    // Fetch destinations when component mounts
    dispatch(fetchDestinations());
  }, [dispatch]);

  const handleHotelClick = (id: string) => {
    navigate(`/hotels?countryId=${encodeURIComponent(id)}`);
  };

  const handleFlightClick = (destinationName: string) => {
    navigate(`/flights?destination=${encodeURIComponent(destinationName)}`);
  };
  const handelsubmit = () => {
    navigate("/countries");
  };

  if (loading) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">Loading destinations...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 text-center">
          <p className="text-destructive">Error: {error}</p>
          <Button 
            onClick={() => dispatch(fetchDestinations())} 
            className="mt-4"
          >
            Try Again
          </Button>
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
            Top <span className="text-primary">Countries</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore our top destinations voted by more than 100,000+ customers around the world.
          </p>
          <Button onClick={handelsubmit}  variant="link" className="mt-4 text-primary gap-2">
            All Destinations <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Destinations Carousel */}
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {destinations.map((destination) => (
              <CarouselItem key={destination.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <div className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={destination.image}
                      alt={destination.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  
                  {/* Hover Buttons - appear on hover */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-3 z-10">
                    <Button
                      onClick={() => handleHotelClick(destination.id.toString())}
                      className="bg-white text-foreground hover:bg-primary hover:text-primary-foreground gap-2 shadow-lg"
                    >
                      <Hotel className="h-4 w-4" />
                      Hotels
                    </Button>
                    <Button
                      onClick={() => handleFlightClick(destination.name)}
                      className="bg-white text-foreground hover:bg-primary hover:text-primary-foreground gap-2 shadow-lg"
                    >
                      <Plane className="h-4 w-4" />
                      Flights
                    </Button>
                  </div>
                  
                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <span className="inline-block px-3 py-1 bg-primary/90 text-primary-foreground text-xs font-medium rounded-full mb-3">
                      {destination.tours} tours
                    </span>
                    <h3 className="text-xl font-bold text-white mb-2">
                      {destination.name}
                    </h3>
                    <p className="text-white/80 text-sm line-clamp-2">
                      {destination.description}
                    </p>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-0 -translate-x-1/2" />
          <CarouselNext className="right-0 translate-x-1/2" />
        </Carousel>
      </div>
    </section>
  );
};