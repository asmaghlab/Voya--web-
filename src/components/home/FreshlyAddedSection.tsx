import { useEffect } from "react";
import { Star, ArrowRight, Heart } from "lucide-react";
import { Button } from "@/components/UI/button";
import { Badge } from "@/components/UI/badge";
import { useAppSelector, useAppDispatch } from "@/routes/hooks";
import { useNavigate } from "react-router-dom";
import { fetchFreshlyAddedTours } from "@/features/homeslices/toursSlice";
import { useWishlist } from "@/routes/useWishlist";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/UI/carousel";

export const FreshlyAddedSection = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { freshlyAdded: tours, loading, error } = useAppSelector((state) => state.tours);

  const { isInWishlist, toggleWishlist } = useWishlist();

  useEffect(() => {
    dispatch(fetchFreshlyAddedTours());
  }, [dispatch]);

  const handleFlightClick = (flightId: number) => {
    navigate(`/flight/${flightId}`);
  };

  const handelsubmit = () => navigate("/flights");

  if (loading) {
    return (
      <section className="py-20 text-center">
        <p className="text-muted-foreground">Loading tours...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 text-center">
        <p className="text-destructive">{error}</p>
        <Button onClick={() => dispatch(fetchFreshlyAddedTours())}>Try Again</Button>
      </section>
    );
  }

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">

        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">
            Available <span className="text-primary">Flights</span>
          </h2>
          <Button onClick={handelsubmit} variant="link" className="mt-4 text-primary gap-2">
            All Flights <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        <Carousel opts={{ align: "start", loop: true }}>
          <CarouselContent className="-ml-4">
            {tours.map((tour) => {
              const inWishlist = isInWishlist(tour.id.toString(), "flight");

              return (
                <CarouselItem key={tour.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <div
                    onClick={() => handleFlightClick(tour.id)}
                    className="group bg-card rounded-2xl overflow-hidden hover:shadow-xl transition cursor-pointer relative"
                  >
                    
                    {/* Wishlist */}
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist({
                          itemId: tour.id.toString(),
                          itemType: "flight",
                          name: tour.title,
                          image: tour.image,
                          price: tour.price,
                          location: tour.title,
                          rating: tour.rating,
                        });
                      }}
                      className="absolute top-3 right-3 z-10 bg-background/80 rounded-full hover:bg-background"
                    >
                      <Heart
                        className={`h-5 w-5 transition ${
                          inWishlist ? "fill-primary text-primary" : "text-muted-foreground"
                        }`}
                      />
                    </Button>

                    <div className="relative aspect-[7/5] overflow-hidden">
                      <img
                        src={tour.image}
                        alt={tour.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />

                      {tour.badge && (
                        <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
                          {tour.badge}
                        </Badge>
                      )}
                    </div>

                    <div className="p-5">
                      <h3 className="font-semibold text-lg mb-3 group-hover:text-primary line-clamp-2">
                        {tour.title}
                      </h3>

                      {tour.duration && (
                        <p className="text-sm text-muted-foreground mb-3">
                          Duration: {tour.duration}
                        </p>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">From</span>
                          {tour.originalPrice && (
                            <span className="text-sm text-muted-foreground line-through">
                              ${tour.originalPrice.toLocaleString()}
                            </span>
                          )}
                          <span className="text-xl font-bold text-primary">
                            ${tour.price.toLocaleString()}
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < Math.floor(tour.rating)
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-muted"
                              }`}
                            />
                          ))}
                          {tour.reviews && (
                            <span className="text-sm text-muted-foreground ml-1">
                              ({tour.reviews})
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>

          <CarouselPrevious className="left-0 -translate-x-1/2" />
          <CarouselNext className="right-0 translate-x-1/2" />
        </Carousel>

      </div>
    </section>
  );
};
