import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { Flight } from "../FlightsTypes/Flightstypes";
import { useAppDispatch, useAppSelector } from "@/routes/hooks";
import { addToWishlist, removeFromWishlist } from "@/pages/Wishlist/wishlistSlice";
import { useToast } from "@/components/UI/use-toast2";

export const FlightCard = ({ flight, index }: { flight: Flight; index: number }) => {
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
        item.itemId === flight.id.toString() && 
        item.itemType === "flight" &&
        item.userId === user?.id.toString()
    );
    setIsInWishlist(!!wishlistItem);
    setWishlistItemId(wishlistItem?.id || null);
  }, [items, flight.id, user?.id]);

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
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

  return (
    <Link to={`/flight/${flight.id}`} className="group block animate-fade-up relative">
      {/* Wishlist Button */}
      <button
        onClick={handleWishlistToggle}
        className="absolute top-3 right-3 text-2xl z-10 transition-transform hover:scale-110"
      >
        {isInWishlist ? (
          <FaHeart className="text-blue-400 drop-shadow-lg" />
        ) : (
          <FaRegHeart className="text-white drop-shadow-lg" />
        )}
      </button>

      <article className="relative overflow-hidden rounded-lg shadow-card hover:-translate-y-2 transition-transform duration-300">
        <div className="aspect-[4/5] relative">
          <img 
            src={flight.image} 
            alt={flight.airline}
            className="h-full w-full object-cover group-hover:scale-110 duration-700" 
          />
        </div>

        <div className="absolute bottom-0 p-6 text-white">
          <h3 className="font-serif text-2xl">{flight.airline}</h3>
          <p>{flight.city} | {flight.from} → {flight.to}</p>
          <p className="text-blue-400 font-bold">${flight.price}</p>
        </div>
      </article>
    </Link>
  );
};