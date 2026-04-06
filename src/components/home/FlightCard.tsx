import { useState, useEffect } from "react";
import { Plane, Clock, Users, Tag, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/UI/Card";
import { Badge } from "@/components/UI/badge";
import { Button } from "@/components/UI/Button";
import { Flight } from "@/types/travel";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/routes/hooks";
import { addToWishlist, removeFromWishlist } from "@/pages/Wishlist/wishlistSlice";
import { useToast } from "@/components/UI/use-toast2";

interface FlightCardProps {
  flight: Flight;
}

export const FlightCard = ({ flight }: FlightCardProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const { user } = useAppSelector((state) => state.auth);
  const { items } = useAppSelector((state) => state.wishlist);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistItemId, setWishlistItemId] = useState<string | null>(null);
  const hasOffer = flight.offer && flight.offer !== "No offer";

  useEffect(() => {
    const wishlistItem = items.find(
      (item) => 
        item.itemId === flight.id.toString() && 
        item.itemType === "flight" &&
        item.userId === user?.id.toString()
    );
    setIsInWishlist(!!wishlistItem);
    setWishlistItemId(wishlistItem?.id || null);
  }, [items, flight.id, user?.id]);

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
          description: `Flight ${flight.from} → ${flight.to} has been removed`,
        });
      } else {
        await dispatch(addToWishlist({
          userId: user.id.toString(),
          itemId: flight.id.toString(),
          itemType: "flight",
          name: `${flight.airline} - ${flight.from} to ${flight.to}`,
          image: flight.image || "https://images.unsplash.com/photo-1436491865332-7a61a109cc05",
          price: flight.price,
          location: `${flight.from} → ${flight.to}`,
        })).unwrap();
        toast({
          title: "Added to wishlist",
          description: `Flight ${flight.from} → ${flight.to} has been added`,
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
    navigate(`/flight/${flight.id}`, { state: { flight } });
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
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Plane className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground">{flight.airline}</p>
                <Badge
                  variant={flight.type === "firstclass" ? "default" : "secondary"}
                  className="text-xs capitalize"
                >
                  {flight.type === "firstclass" ? "First Class" : flight.type}
                </Badge>
              </div>
            </div>
            {hasOffer && (
              <Badge className="bg-accent text-accent-foreground">
                <Tag className="h-3 w-3 mr-1" />
                {flight.offer}
              </Badge>
            )}
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">From</p>
              <p className="font-semibold text-foreground">{flight.from}</p>
            </div>
            <div className="flex-shrink-0 px-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <div className="w-16 h-0.5 bg-border relative">
                  <Plane className="h-4 w-4 text-primary absolute -top-1.5 left-1/2 -translate-x-1/2" />
                </div>
                <div className="w-2 h-2 rounded-full bg-accent" />
              </div>
            </div>
            <div className="flex-1 text-right">
              <p className="text-sm text-muted-foreground">To</p>
              <p className="font-semibold text-foreground">{flight.to}</p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{flight.duratuion}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{flight.passanger} passengers</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">${flight.price}</p>
              <p className="text-xs text-muted-foreground">total price</p>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}