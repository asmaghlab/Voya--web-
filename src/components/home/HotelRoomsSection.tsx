import { useEffect } from "react";
import { Star, Bed, ArrowRight, Heart } from "lucide-react";
import { Button } from "@/components/UI/Button";
import { Badge } from "@/components/UI/badge";
import { useAppSelector, useAppDispatch } from "@/routes/hooks";
import { useNavigate } from "react-router-dom";
import { fetchHotels } from "@/features/homeslices/roomsSlice";
import { useWishlist } from "@/routes/useWishlist";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/UI/carousel";

export const HotelRoomsSection = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {
    items: rooms,
    loading,
    error,
  } = useAppSelector((state) => state.rooms);
  const { isInWishlist, toggleWishlist } = useWishlist();

  useEffect(() => {
    dispatch(fetchHotels());
  }, [dispatch]);

  const handleHotelClick = (hotelId: string | number) => {
    navigate(`/hotels/${hotelId}`);
  };

  const handelsubmit = () => {
    navigate("/hotels");
  };

  if (loading) {
    return (
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">Loading hotels...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <p className="text-destructive">Error: {error}</p>
          <Button onClick={() => dispatch(fetchHotels())} className="mt-4">
            Try Again
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Hotel <span className="text-primary">Rooms</span>
          </h2>
          <Button
            onClick={handelsubmit}
            variant="link"
            className="mt-4 text-primary gap-2"
          >
            All Hotels <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        <Carousel opts={{ align: "start", loop: true }} className="w-full">
          <CarouselContent className="-ml-4">
            {rooms.map((room) => {
              const inWishlist = isInWishlist(room.id.toString(), "hotel");

              return (
                <CarouselItem
                  key={room.id}
                  className="pl-4 md:basis-1/2 lg:basis-1/3"
                >
                  <div
                    onClick={() => handleHotelClick(room.id)}
                    className="group bg-card rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 h-full cursor-pointer relative"
                  >
                    {/* Wishlist */}
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist({
                          itemId: room.id.toString(),
                          itemType: "hotel",
                          name: room.title,
                          image: room.image,
                          price: room.price,
                          location: room.bedType,
                          rating: room.rating,
                        });
                      }}
                      className="absolute top-3 right-3 z-10 bg-background/80 rounded-full hover:bg-background"
                    >
                      <Heart
                        className={`h-5 w-5 transition-all ${
                          inWishlist
                            ? "fill-primary text-primary"
                            : "text-muted-foreground"
                        }`}
                      />
                    </Button>

                    <div className="relative aspect-[7/5] overflow-hidden">
                      <img
                        src={room.image}
                        alt={room.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      {room.badge && (
                        <Badge className="absolute top-4 left-4 bg-destructive text-destructive-foreground">
                          {room.badge}
                        </Badge>
                      )}
                    </div>

                    <div className="p-5">
                      <h3 className="font-semibold text-lg mb-2 group-hover:text-primary">
                        {room.title}
                      </h3>

                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                        <Bed className="h-4 w-4" />
                        {room.bedType}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < room.rating
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-muted"
                              }`}
                            />
                          ))}
                          <span className="text-sm text-muted-foreground ml-1">
                            {room.reviews} Reviews
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            From
                          </span>
                          {room.originalPrice && (
                            <span className="text-sm text-muted-foreground line-through">
                              ${room.originalPrice}
                            </span>
                          )}
                          <span className="text-xl font-bold text-primary">
                            ${room.price}
                          </span>
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
