export type CabinClass = "economy" | "premium" | "business" | "first";

export interface SearchQuery {
  from: string;
  to: string;
  depart: string;
  return?: string;
  pax: number;
  cabin: CabinClass;
}

export interface FlightOffer {
  id: string;
  airline: string;
  airlineCode: string;
  flightNo: string;
  from: string;
  to: string;
  departTime: string;
  arriveTime: string;
  durationMin: number;
  stops: 0 | 1 | 2;
  stopCity?: string;
  price: number;
  co2kg: number;
  greener: boolean;
  cabin: CabinClass;
  distanceKm: number;
  domestic: boolean;
}

export interface DayPrice {
  date: string;
  price: number;
  cheapest: boolean;
}

export interface StayOffer {
  id: string;
  name: string;
  area: string;
  city: string;
  rating: number;
  reviews: number;
  pricePerNight: number;
  amenities: string[];
  ecoCertified: boolean;
  gradient: string;
}

export interface CarOffer {
  id: string;
  supplier: string;
  model: string;
  carClass: "Economy" | "Compact" | "SUV" | "Premium" | "Van";
  seats: number;
  transmission: "Manual" | "Automatic";
  fuel: "Petrol" | "Hybrid" | "Electric";
  pricePerDay: number;
  freeCancellation: boolean;
  greener: boolean;
}

export interface TripItem {
  id: string;
  kind: "flight" | "stay" | "car";
  title: string;
  subtitle: string;
  price: number;
  meta?: string;
  addedAt: number;
}

export interface PriceAlert {
  id: string;
  route: string;
  from: string;
  to: string;
  targetPrice: number;
  currentPrice: number;
  createdAt: number;
}
