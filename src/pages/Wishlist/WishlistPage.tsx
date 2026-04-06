import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useAppDispatch, useAppSelector } from "@/routes/hooks";
import {
  fetchWishlist,
  removeFromWishlist,
  clearWishlist,
} from "@/pages/Wishlist/wishlistSlice";

import {
  Heart,
  Trash2,
  MapPin,
  Star,
  Plane,
  Hotel as HotelIcon,
} from "lucide-react";

import { Button } from "@/components/UI/button";
import { Card, CardContent } from "@/components/UI/Card";
import { Badge } from "@/components/UI/badge";
import { useToast } from "@/components/UI/use-toast2";
import Spinner from "../Flights/FlightsComponents/spinner";

const WishlistPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAppSelector((state) => state.auth);
  const { items, loading } = useAppSelector((state) => state.wishlist);

  //Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(items.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
  // ---------------------------------------------

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchWishlist(user.id.toString()));
    }
  }, [dispatch, user]);

  //FIX pagination AFTER deletion of items
  useEffect(() => {
    const updatedTotalPages = Math.ceil(items.length / itemsPerPage);

    if (currentPage > updatedTotalPages) {
      setCurrentPage(updatedTotalPages === 0 ? 1 : updatedTotalPages);
    }
  }, [items]);
  // ---------------------------------------------

  const handleRemove = async (id: string) => {
    try {
      await dispatch(removeFromWishlist(id)).unwrap();

      toast({
        title: "Removed from wishlist",
        description: "Item has been removed from your wishlist",
      });

      // Refresh wishlist to ensure sync with API
      if (user?.id) {
        await dispatch(fetchWishlist(user.id.toString()));
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove item",
        variant: "destructive",
      });
    }
  };

  //FIXED VERSION – CLEAN & WORKING
  const handleClearAll = async () => {
    if (!user?.id) return;

    try {
      // Show loading state
      toast({
        title: "Clearing wishlist...",
        description: "Please wait",
      });

      await dispatch(clearWishlist(user.id.toString())).unwrap();

      // Force refresh the wishlist from API
      await dispatch(fetchWishlist(user.id.toString()));

      toast({
        title: "Wishlist cleared",
        description: "All items have been removed",
      });

      // Reset to first page
      setCurrentPage(1);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to clear wishlist",
        variant: "destructive",
      });

      // Refresh anyway to sync with API
      if (user?.id) {
        await dispatch(fetchWishlist(user.id.toString()));
      }
    }
  };

  const handleViewDetails = (item: any) => {
    if (item.itemType === "hotel") {
      navigate(`/hotels/${item.itemId}`);
    } else {
      navigate(`/flight/${item.itemId}`);
    }
  };

  //Loading 
  if (loading) {
    return (
      <div className="min-h-screen bg-background py-20">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground"><Spinner/></p>
        </div>
      </div>
    );
  }

  //Empty State 
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background py-20">
        <Helmet>
                  <title>Voya |  Wishlist </title>
                </Helmet>
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center py-20">
            <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
              <Heart className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Your Wishlist is Empty
            </h2>
            <p className="text-muted-foreground mb-8">
              Start adding your favorite hotels and flights to keep track of them!
            </p>

            <div className="flex gap-4 justify-center">
              <Button onClick={() => navigate("/hotels")}>
                <HotelIcon className="h-4 w-4 mr-2" /> Browse Hotels
              </Button>

              <Button variant="outline" onClick={() => navigate("/flights")}>
                <Plane className="h-4 w-4 mr-2" /> Browse Flights
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-background py-20">
      <div className="container mx-auto px-4">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              My Wishlist
            </h1>
            <p className="text-muted-foreground">
              {items.length} {items.length === 1 ? "item" : "items"} saved
            </p>
          </div>

          {items.length > 0 && (
            <Button 
              variant="outline" 
              onClick={handleClearAll}
              disabled={loading}
            >
              <Trash2 className="h-4 w-4 mr-2" /> 
              {loading ? "Clearing..." : "Clear All"}
            </Button>
          )}
        </div>

        {/* Wishlist Items */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentItems.map((item) => (
            <Card
              key={item.id}
              className="overflow-hidden group hover:shadow-xl transition-all duration-300"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />

                {/* Type Badge */}
                <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
                  {item.itemType === "hotel" ? (
                    <>
                      <HotelIcon className="h-3 w-3 mr-1" /> Hotel
                    </>
                  ) : (
                    <>
                      <Plane className="h-3 w-3 mr-1" /> Flight
                    </>
                  )}
                </Badge>

                {/* Remove Button */}
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute top-3 right-3 bg-background/80 hover:bg-destructive hover:text-destructive-foreground"
                  onClick={() => handleRemove(item.id)}
                  disabled={loading}
                >
                  <Heart className="h-5 w-5 fill-current" />
                </Button>
              </div>

              <CardContent className="p-5">
                <h3 className="font-bold text-lg text-foreground mb-2 line-clamp-1">
                  {item.name}
                </h3>

                {item.location && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <MapPin className="h-4 w-4" />
                    <span className="line-clamp-1">{item.location}</span>
                  </div>
                )}

                {item.rating && (
                  <div className="flex items-center gap-2 mb-3">
                    <Star className="h-4 w-4 fill-accent text-accent" />
                    <span className="font-semibold">{item.rating}</span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t">
                  <div>
                    <p className="text-2xl font-bold text-primary">
                      ${item.price}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.itemType === "hotel" ? "per night" : "total"}
                    </p>
                  </div>

                  <Button size="sm" onClick={() => handleViewDetails(item)}>
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center mt-10 gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || loading}
            >
              Previous
            </Button>

            {[...Array(totalPages)].map((_, index) => (
              <Button
                key={index}
                size="sm"
                variant={currentPage === index + 1 ? "default" : "outline"}
                onClick={() => handlePageChange(index + 1)}
                disabled={loading}
              >
                {index + 1}
              </Button>
            ))}

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || loading}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;