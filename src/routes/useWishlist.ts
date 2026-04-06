import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/routes/hooks";
import {
  addToWishlist,
  removeFromWishlist,
  WishlistItem,
} from "@/pages/Wishlist/wishlistSlice";
import { useToast } from "@/components/UI/use-toast2";
import { useNavigate } from "react-router-dom";

export const useWishlist = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAppSelector((state) => state.auth);
  const { items, loading } = useAppSelector((state) => state.wishlist);

  // --- Check if item exists by ID + TYPE + USER ---
  const isInWishlist = useCallback(
    (itemId: string, itemType: "hotel" | "flight") => {
      return items.some(
        (item) =>
          item.itemId === itemId &&
          item.itemType === itemType &&
          item.userId === user?.id.toString()
      );
    },
    [items, user]
  );

  // --- Get wishlist ID for removal ---
  const getWishlistItemId = useCallback(
    (itemId: string, itemType: "hotel" | "flight") => {
      const item = items.find(
        (item) =>
          item.itemId === itemId &&
          item.itemType === itemType &&
          item.userId === user?.id.toString()
      );
      return item?.id || null;
    },
    [items, user]
  );

  // --- Add/Remove Wishlist item ---
  const toggleWishlist = useCallback(
    async (
      item: Omit<WishlistItem, "id" | "createdAt" | "userId">
    ) => {
      if (!user) {
        toast({
          title: "Login Required",
          description: "Please login to add items to wishlist",
          variant: "destructive",
        });
        navigate("/login");
        return false;
      }

      const wishlistItemId = getWishlistItemId(item.itemId, item.itemType);
      const exists = isInWishlist(item.itemId, item.itemType);

      try {
        // Remove
        if (exists && wishlistItemId) {
          await dispatch(removeFromWishlist(wishlistItemId)).unwrap();
          toast({
            title: "Removed from Wishlist",
            description: `${item.name} has been removed`,
          });
          return false;
        }

        // Add
        await dispatch(
          addToWishlist({
            ...item,
            userId: user.id.toString(),
          })
        ).unwrap();

        toast({
          title: "Added to Wishlist",
          description: `${item.name} has been added`,
        });

        return true;
      } catch (error) {
        toast({
          title: "Error",
          description: "Something went wrong",
          variant: "destructive",
        });
        return exists;
      }
    },
    [user, dispatch, toast, navigate, getWishlistItemId, isInWishlist]
  );

  return {
    items,
    loading,
    isInWishlist,
    getWishlistItemId,
    toggleWishlist,
    wishlistCount: items.length,
  };
};