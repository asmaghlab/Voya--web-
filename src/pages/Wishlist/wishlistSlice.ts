import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "https://69383b354618a71d77cf75d1.mockapi.io/wishlist/wishlist";

//Types 
export interface WishlistItem {
  id: string;
  userId: string;
  itemId: string;
  itemType: "hotel" | "flight";
  name: string;
  image: string;
  price: number;
  location?: string;
  rating?: number;
  createdAt: string;
}

interface WishlistState {
  items: WishlistItem[];
  loading: boolean;
  error: string | null;
}

// Initial State 
const initialState: WishlistState = {
  items: [],
  loading: false,
  error: null,
};

// ---------------- Helper: Load all pages from MockAPI --------------------
const fetchAllPages = async () => {
  let allItems: any[] = [];
  let page = 1;
  let done = false;

  while (!done) {
    const { data } = await axios.get(`${API_URL}?page=${page}&limit=100`);
    if (data.length === 0) {
      done = true;
    } else {
      allItems = [...allItems, ...data];
      page++;
    }
  }

  return allItems;
};


//Async Thunks

// Fetch wishlist of specific user
export const fetchWishlist = createAsyncThunk(
  "wishlist/fetchWishlist",
  async (userId: string) => {
    const allItems = await fetchAllPages();
    return allItems.filter((item) => item.userId === userId);
  }
);

// Add item to wishlist
export const addToWishlist = createAsyncThunk(
  "wishlist/addToWishlist",
  async (item: Omit<WishlistItem, "id" | "createdAt">) => {
    const newItem = {
      ...item,
      createdAt: new Date().toISOString(),
    };
    const response = await axios.post(API_URL, newItem);
    return response.data;
  }
);

// Remove wishlist item
export const removeFromWishlist = createAsyncThunk(
  "wishlist/removeFromWishlist",
  async (id: string) => {
    await axios.delete(`${API_URL}/${id}`);
    return id;
  }
);

// Clear full wishlist for user - FIXED VERSION
export const clearWishlist = createAsyncThunk(
  "wishlist/clearWishlist",
  async (userId: string) => {
    const allItems = await fetchAllPages();
    const userItems = allItems.filter((item) => item.userId === userId);

    // Delete all user items from API sequentially to avoid issues
    for (const item of userItems) {
      try {
        await axios.delete(`${API_URL}/${item.id}`);
      } catch (error) {
        console.error(`Failed to delete item ${item.id}:`, error);
      }
    }

    // Verify deletion by fetching again
    const remainingItems = await fetchAllPages();
    const stillExists = remainingItems.filter((item) => item.userId === userId);
    
    if (stillExists.length > 0) {
      console.warn("Some items were not deleted:", stillExists);
    }

    // Return the IDs of deleted items
    return userItems.map(item => item.id);
  }
);


// Slice 
const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    // Reset wishlist when needed
    resetWishlist: (state) => {
      state.items = [];
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action: PayloadAction<WishlistItem[]>) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch wishlist";
      })

      // Add
      .addCase(addToWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToWishlist.fulfilled, (state, action: PayloadAction<WishlistItem>) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to add to wishlist";
      })

      // Remove
      .addCase(removeFromWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.items = state.items.filter((item) => item.id !== action.payload);
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to remove from wishlist";
      })

      // Clear - FIXED VERSION
      .addCase(clearWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearWishlist.fulfilled, (state, action: PayloadAction<string[]>) => {
        state.loading = false;
        // Remove all items whose IDs are in the deleted list
        state.items = state.items.filter(
          (item) => !action.payload.includes(item.id)
        );
      })
      .addCase(clearWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to clear wishlist";
      });
  },
});

export const { resetWishlist } = wishlistSlice.actions;

export default wishlistSlice.reducer;