import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/routes/hooks";
import { fetchUserHotelBookings } from "@/features/booking/hotelBookingSlice";
import { fetchUserFlightBookings } from "@/features/booking/flightBookingSlice";
import HotelBookings from "./HotelBookings";
import FlightBookings from "./FlightBookings";


export default function UserBookings() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (user?.email) {
      dispatch(fetchUserHotelBookings(user.email));
      dispatch(fetchUserFlightBookings(user.email));
    }
  }, [dispatch, user?.email]);

  return (
    <div className="space-y-6">
      <HotelBookings />
      <FlightBookings />
    </div>
  );
}