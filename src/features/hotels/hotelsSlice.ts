import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { IHotel } from "./types";

// const baseUrl = "https://voya-site.free.beeceptor.com/api/";
// const baseUrl = "https://6927461426e7e41498fdb2c5.mockapi.io/";
const baseUrl = "https://6934ceba4090fe3bf020c412.mockapi.io/api/v1/";

interface HotelState {
  hotel: IHotel[];
  loading: boolean;
  error: string | null;
}

const initialState: HotelState = {
  hotel: [],
  loading: false,
  error: null,
};

export const fetchHotel = createAsyncThunk("hotel/fetchHotel", async () => {
  const res = await axios.get(baseUrl + "hotels");
  console.log("API RESPONSE:", res.data);
  return res.data as IHotel[];
});

export const fetchHotelByCountryId = createAsyncThunk(
  "hotel/fetchHotelByCountryId",
  async (countryId: string) => {
    const res = await axios.get(baseUrl + "hotels?countryId=" + countryId);
    console.log("API RESPONSE:", res.data);
    return res.data as IHotel[];
  }
);

export const fetchHotelById = createAsyncThunk(
  "hotel/fetchHotelById",
  async (id: string) => {
    try {
      const res = await axios.get(`${baseUrl}hotels/${id}`);

      return [res.data];
    } catch (error) {
      console.error("Error fetching hotel by ID:", error);
      return [];
    }
  }
);

export const AddHotel = createAsyncThunk(
  "hotel/addHotel",
  async ({ hotel }: { hotel: Omit<IHotel, "id"> }) => {
    const res = await axios.post(baseUrl + "hotels", hotel);
    return res.data as IHotel;
  }
);

export const deleteHotel = createAsyncThunk(
  "hotel/deleteHotel",
  async (id: string) => {
    await axios.delete(`${baseUrl}hotels/${id}`);
    return id;
  }
);

export const editHotel = createAsyncThunk(
  "hotel/editHotel",
  async ({ id, hotel }: { id: string; hotel: Omit<IHotel, "id"> }) => {
    const res = await axios.put(`${baseUrl}hotels/${id}`, hotel);
    console.log(res);
    return res.data;
  }
);
// Slice
const hotelSlice = createSlice({
  name: "hotel",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // fetch
    builder
      .addCase(fetchHotel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHotel.fulfilled, (state, action) => {
        state.loading = false;
        state.hotel = action.payload;
      })
      .addCase(fetchHotel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch hotels";
      })

      // fetch by country
      .addCase(fetchHotelByCountryId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHotelByCountryId.fulfilled, (state, action) => {
        state.loading = false;
        state.hotel = action.payload;
      })
      .addCase(fetchHotelByCountryId.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to fetch hotels by country";
      })

      // fetch by country
      .addCase(fetchHotelById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHotelById.fulfilled, (state, action) => {
        state.loading = false;
        state.hotel = action.payload;
      })
      .addCase(fetchHotelById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch hotels by ID";
      });
    // add
    builder.addCase(AddHotel.fulfilled, (state, action) => {
      state.hotel.push(action.payload);
    });

    // delete
    builder.addCase(deleteHotel.fulfilled, (state, action) => {
      state.hotel = state.hotel.filter((cat) => cat.id !== action.payload);
    });

    // edit
    builder.addCase(editHotel.fulfilled, (state, action) => {
      const index = state.hotel.findIndex((h) => h.id === action.payload.id);
      if (index !== -1) state.hotel[index] = action.payload;
    });
    builder.addCase(editHotel.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to edit hotels";
    });
  },
});

export default hotelSlice.reducer;
