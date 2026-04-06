import { useState, useEffect } from "react";
import { Star, MapPin, Clock, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/UI/Card";
import { Badge } from "@/components/UI/badge";
import { Button } from "@/components/UI/button";
import { Hotel } from "@/types/travel";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/routes/hooks";
import { addToWishlist, removeFromWishlist } from "@/pages/Wishlist/wishlistSlice";
import { useToast } from "@/components/UI/use-toast2";

interface HotelCardProps {
  hotel: Hotel;
}

export const HotelCard = ({ hotel }: HotelCardProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const { user } = useAppSelector((state) => state.auth);
  const { items } = useAppSelector((state) => state.wishlist);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistItemId, setWishlistItemId] = useState<string | null>(null);

  useEffect(() => {
    const wishlistItem = items.find(
      (item) => 
        item.itemId === hotel.id.toString() && 
        item.itemType === "hotel" &&
        item.userId === user?.id.toString()
    );
    setIsInWishlist(!!wishlistItem);
    setWishlistItemId(wishlistItem?.id || null);
  }, [items, hotel.id, user?.id]);

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to add items to wishlist",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    try {
      if (isInWishlist && wishlistItemId) {
        await dispatch(removeFromWishlist(wishlistItemId)).unwrap();
        toast({
          title: "Removed from wishlist",
          description: `${hotel.name} has been removed`,
        });
      } else {
        await dispatch(addToWishlist({
          userId: user.id.toString(),
          itemId: hotel.id.toString(),
          itemType: "hotel",
          name: hotel.name,
          image: hotel.images[0],
          price: hotel.pricePerNight,
          location: hotel.neighborhood,
          rating: hotel.rating,
        })).unwrap();
        toast({
          title: "Added to wishlist",
          description: `${hotel.name} has been added`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    }
  };

  const handleClick = () => {
    navigate(`/hotels/${hotel.id}`);
  };

  return (
    <Card className="overflow-hidden group cursor-pointer relative">
      {/* Wishlist Button */}
      <Button
        size="icon"
        variant="ghost"
        onClick={handleWishlistToggle}
        className="absolute top-3 right-3 z-10 bg-background/80 hover:bg-background rounded-full"
      >
        <Heart 
          className={`h-5 w-5 transition-all ${
            isInWishlist ? "fill-primary text-primary" : "text-muted-foreground"
          }`}
        />
      </Button>

      <div onClick={handleClick}>
        <div className="relative h-48 overflow-hidden">
          <img
            src={hotel.images[0]}
            alt={hotel.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute top-3 left-3">
            <Badge className="bg-primary text-primary-foreground">
              {hotel.stars} Stars
            </Badge>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
          <div className="absolute bottom-3 left-3 right-3">
            <p className="text-primary-foreground font-semibold text-lg truncate">
              {hotel.name}
            </p>
          </div>
        </div>

        <CardContent className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-accent text-accent" />
              <span className="font-semibold text-foreground">{hotel.rating}</span>
              <span className="text-sm text-muted-foreground">
                ({hotel.reviewCount} reviews)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span className="truncate">{hotel.neighborhood}</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {hotel.amenities.slice(0, 3).map((amenity, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {amenity}
              </Badge>
            ))}
            {hotel.amenities.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{hotel.amenities.length - 3}
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Stay: {hotel.stayDuration} days</span>
          </div>

          <div className="pt-3 border-t border-border flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-primary">
                ${hotel.pricePerNight}
              </p>
              <p className="text-xs text-muted-foreground">per night</p>
            </div>
            {hotel.offers.length > 0 && (
              <Badge className="bg-accent text-accent-foreground text-xs">
                {hotel.offers[0]}
              </Badge>
            )}
          </div>
        </CardContent>
      </div>
    </Card>
  );
}