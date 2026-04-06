export type FlightBookingRow = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  from: string;
  to: string;
  airline?: string;
  tickets: number;
  type: string;
  date: string;
  price?: number;
};

export type HotelBookingRow = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  guest: number;
  type: string;
  checkIn: string;
  checkOut: string;
  hotelName?: string;
  price?: number;
};

export type BookingStats = {
  totalFlights: number;
  totalHotels: number;
  totalRevenue: number;
  flightsByAirport: Record<string, number>;
  hotelsByName: Record<string, number>;
  flightsByAirline: Record<string, number>;
  bookingsByType: {
    flightTypes: Record<string, number>;
    hotelTypes: Record<string, number>;
  };
};

export const paginationTexts = {
  rowsPerPageText: "Rows per page",
  rangeSeparatorText: "of",
  selectAllRowsItem: true,
  selectAllRowsItemText: "All",
};
