import { useQuery } from '@tanstack/react-query';
import { fetchHotels, fetchCountries, fetchUsers, fetchhotelsBookings,fetchflightsBookings } from '@/services/api';

export const useHotels = () => {
  return useQuery({
    queryKey: ['hotels'],
    queryFn: fetchHotels,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

export const useCountries = () => {
  return useQuery({
    queryKey: ['countries'],
    queryFn: fetchCountries,
    refetchInterval: 30000,
  });
};

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
    refetchInterval: 30000,
  });
};

export const useBookingshotels = () => {
  return useQuery({
    queryKey: ['hotelsbookings'],
    queryFn: fetchhotelsBookings,
    refetchInterval: 30000,
  });
};

export const useBookingsflights = () => {
  return useQuery({
    queryKey: ['flightsbookings'],
    queryFn: fetchflightsBookings,
    refetchInterval: 30000,
  });
};