import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import countriesReducer from "@/features/countries/countriesSlice";
import destinationsReducer from "@/features/homeslices/destinationsSlice";
import toursReducer from "@/features/homeslices/toursSlice";
import roomsReducer from "@/features/homeslices/roomsSlice";
import hotelBookingReducer from '../features/booking/hotelBookingSlice';
import flightBookingReducer from '../features/booking/flightBookingSlice';
import hotelSlice from './../features/hotels/hotelsSlice';
import wishlistReducer from '@/pages/Wishlist/wishlistSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  countries: countriesReducer,
  destinations: destinationsReducer,
  tours: toursReducer,
  rooms: roomsReducer,
  hotelBooking: hotelBookingReducer,
  flightBooking: flightBookingReducer,
  hotel: hotelSlice,
  wishlist: wishlistReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;