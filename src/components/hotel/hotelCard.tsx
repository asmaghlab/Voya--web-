import { useState, useEffect } from "react";
import { IHotel } from "@/features/hotels/types";
import { ArrowBigRight, Star } from "lucide-react";
import { FaStar, FaHeart, FaRegHeart } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/routes/hooks";
import { addToWishlist, removeFromWishlist } from "@/pages/Wishlist/wishlistSlice";
import { useToast } from "@/components/UI/use-toast2";

interface IHotelCardProps {
  hotel: IHotel;
}

export default function HotelCard({ hotel }: IHotelCardProps) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const { user } = useAppSelector((state) => state.auth);
  const { items } = useAppSelector((state) => state.wishlist);
  
  const [currentImg, setCurrentImg] = useState(0);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistItemId, setWishlistItemId] = useState<string | null>(null);

  const images = hotel.images?.length
    ? hotel.images
    : [
        "https://images.unsplash.com/photo-1747133608846-ac16fb165862?w=600&auto=format&fit=crop&q=60",
        "https://plus.unsplash.com/premium_photo-1663126637580-ff22a73f9bfc?w=600&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1630999295881-e00725e1de45?w=600&auto=format&fit=crop&q=60",
      ];

  // Check if hotel is in wishlist
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
          description: `${hotel.name} has been removed from your wishlist`,
        });
      } else {
        await dispatch(addToWishlist({
          userId: user.id.toString(),
          itemId: hotel.id.toString(),
          itemType: "hotel",
          name: hotel.name,
          image: hotel.images[0],
          price: hotel.pricePerNight,
          location: hotel.neighborhood || hotel.cityId,
          rating: hotel.rating,
        })).unwrap();
        toast({
          title: "Added to wishlist",
          description: `${hotel.name} has been added to your wishlist`,
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
    <div
      id={`hotel-${hotel.id}`}
      className="border mb-4 rounded-xl shadow-sm p-4 md:p-6 bg-white flex flex-col md:flex-row gap-6 hover:shadow-md transition"
    >
      {/* Image Slider */}
      <div className="w-full md:w-1/3 h-56 md:h-auto relative rounded-lg overflow-hidden">
        <img
          src={images[currentImg]}
          className="w-full h-full object-cover rounded-lg"
          alt={hotel.name}
        />

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

        {/* Dots */}
        <div className="absolute bottom-2 inset-x-0 flex justify-center gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImg(index)}
              className={`w-3 h-3 rounded-full transition ${
                currentImg === index ? "bg-white" : "bg-gray-400"
              }`}
            ></button>
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 flex flex-col md:flex-row justify-between">
        <div className="flex-1 flex flex-col gap-2">
          {/* Name & Rating */}
          <h2 className="text-xl font-bold text-blue-700">{hotel.name}</h2>
          <div className="flex items-center gap-4">
            {/* <div className="flex gap-1">
              {Array(hotel.stars)
                .fill(0)
                .map((_, i) => (
                  <FaStar key={i} className="text-yellow-400" />
                ))}
            </div> */}
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(hotel.rating)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-muted"
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-gray-500">{hotel.reviewCount} reviews</p>
          </div>

          {/* City & Distance */}
          <div className="flex gap-4 text-sm text-blue-600 mt-1">
            <span>{hotel.cityId.toUpperCase()}</span>
            <span>• {hotel.distanceFromCenter} from downtown</span>
          </div>

          {/* Description */}
          <p className="mt-3 text-sm text-gray-700 text-justify">
            {hotel.description}
          </p>
        </div>

        {/* Price & Link */}
        <div className="flex flex-col justify-between items-end mt-4 md:mt-0">
          <span className="text-xl font-bold text-green-700">
            ${hotel.pricePerNight} / night
          </span>
          <Link
            to={`/hotels/${hotel.id}`}
            className="inline-flex ml-5 items-center gap-2 text-blue-600 text-lg font-semibold underline hover:text-blue-700 transition"
          >
            Hotel Details
          </Link>
        </div>
      </div>
    </div>
  );
}