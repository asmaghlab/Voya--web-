export interface Flight {
  id: number;
  airline: string;
  from: string;
  to: string;
  price: number;
  offer?: string;
  passanger: number;
  duratuion: string;
  type: string;
  country: string;
  city: string;
  image: string;
}

export interface City {
  id: string;
  name: string;
  des: string;
  flights: Flight[];
}

export interface Country {
  id: string;
  name: string;
  cun_des: string;
  city: City[];
  image: string;
}

export interface FlightBooking {
  flightId: number;
  flightName: string;
  passengers: number;
  totalPrice: number;
}

export interface BookingModalProps {
  flight: any;
  bookingData: any;
  setBookingData: (data: any) => void;
  onClose: () => void;
}