export interface Flight {
  id: number;
  airline: string;
  from: string;
  to: string;
  price: number;
  offer: string;
  image: string;
  passanger: number;
  duratuion: string;
  type: string;
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
  rating: number;
  city: City[];
  image: string;
}

export interface HotelLocation {
  lat: number;
  lng: number;
  formattedAddress: string;
}

export interface Hotel {
  id: number;
  name: string;
  countryId: string;
  cityId: string;
  pricePerNight: number;
  offers: string[];
  stayDuration: number;
  images: string[];
  lat: number;
  lng: number;
  address: string;
  phone: string;
  website: string;
  rating: number;
  reviewCount: number;
  currency: string;
  amenities: string[];
  location: HotelLocation;
  checkIn: string;
  checkOut: string;
  description: string;
  stars: number;
  neighborhood: string;
  propertyType: string;
  distanceFromCenter: string;
}

export interface SearchParams {
  country: string;
  destination: string;
  durationFrom: number;
  durationTo: number;
}
