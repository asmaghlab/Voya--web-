// src/types/country.ts
export interface Flight {
  id: number;
  airline: string;
  from: string;
  to: string;
  price: number;
  offer: string;
  passanger: number; 
  duratuion: string; 
  type: string;
}

export interface City {
  id: string;
  name: string;
  des: string; 
  flights?: Flight[];
}

export interface Country {
  id: string;
  name: string;
  image: string;
  cun_des: string;
  rating?: number;
  city?: City[];
}