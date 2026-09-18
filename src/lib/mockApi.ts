import type {
  CabinClass,
  CarOffer,
  DayPrice,
  FlightOffer,
  SearchQuery,
  StayOffer,
} from "@/types";
import { AIRPORTS, findAirport } from "@/data/airports";
import { airlinesForRoute } from "@/data/airlines";

function hashSeed(input: string): number {
  let h = 1779033703 ^ input.length;
  for (let i = 0; i < input.length; i++) {
    h = Math.imul(h ^ input.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

const DOMESTIC_HUBS = ["DEL", "BOM", "BLR", "HYD"];
const INTL_HUBS = ["DXB", "DOH", "IST", "SIN", "AUH"];

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

const CABIN_MULTIPLIER: Record<CabinClass, number> = {
  economy: 1,
  premium: 1.6,
  business: 2.8,
  first: 4.2,
};

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function minutesToTime(min: number) {
  const h = Math.floor(min / 60) % 24;
  const m = min % 60;
  return `${pad(h)}:${pad(m)}`;
}

function routeInfo(q: SearchQuery) {
  const from = findAirport(q.from) ?? AIRPORTS[2];
  const to = findAirport(q.to) ?? AIRPORTS[0];
  const distanceKm = Math.max(200, haversineKm(from.lat, from.lon, to.lat, to.lon));
  const domestic = from.country === "India" && to.country === "India";
  return { from, to, distanceKm, domestic };
}

export async function fetchFlights(q: SearchQuery): Promise<FlightOffer[]> {
  await delay(450 + Math.random() * 350);
  const rand = mulberry32(hashSeed(`${q.from}|${q.to}|${q.depart}|${q.cabin}`.toLowerCase()));
  const { from, to, distanceKm, domestic } = routeInfo(q);
  const longHaul = distanceKm > 4000;
  const pool = airlinesForRoute(domestic, longHaul);
  const count = 11 + Math.floor(rand() * 6);
  const perKm = domestic ? 2.9 : longHaul ? 6.4 : 4.8;
  const floor = domestic ? 2200 : longHaul ? 24000 : 9000;
  const cruiseKmh = longHaul ? 870 : 780;

  const offers: FlightOffer[] = Array.from({ length: count }, (_, i) => {
    const airline = pool[Math.floor(rand() * pool.length)];
    const nonstopBias = distanceKm < 1600 ? 0.75 : longHaul ? 0.3 : 0.55;
    const stops = (rand() < nonstopBias ? 0 : rand() < 0.85 ? 1 : 2) as 0 | 1 | 2;
    const departMin = 300 + Math.floor(rand() * 1080);
    const flightMin = Math.round((distanceKm / cruiseKmh) * 60) + 35;
    const durationMin = flightMin + stops * (70 + Math.floor(rand() * 150));
    const price = Math.round(
      Math.max(floor, distanceKm * perKm * (0.82 + rand() * 0.5) - stops * (domestic ? 380 : 2400)) *
        CABIN_MULTIPLIER[q.cabin] *
        (1 + (q.pax - 1) * 0.02),
    );
    const co2kg = Math.round(distanceKm * (longHaul ? 0.075 : 0.095) + stops * 32 + rand() * 24);
    const hubs = domestic ? DOMESTIC_HUBS : INTL_HUBS;
    const viable = hubs.filter((h) => h !== from.iata && h !== to.iata);
    return {
      id: `fl-${i}-${airline.code}`,
      airline: airline.name,
      airlineCode: airline.code,
      flightNo: `${airline.code} ${100 + Math.floor(rand() * 900)}`,
      from: from.iata,
      to: to.iata,
      departTime: minutesToTime(departMin),
      arriveTime: minutesToTime(departMin + durationMin),
      durationMin,
      stops,
      stopCity: stops > 0 ? viable[Math.floor(rand() * viable.length)] : undefined,
      price,
      co2kg,
      greener: false,
      cabin: q.cabin,
      distanceKm,
      domestic,
    };
  });

  const sortedCo2 = [...offers].sort((a, b) => a.co2kg - b.co2kg);
  const cutoff = sortedCo2[Math.floor(offers.length * 0.3)]?.co2kg ?? 0;
  offers.forEach((o) => (o.greener = o.co2kg <= cutoff));
  return offers;
}

export async function fetchPriceCalendar(q: SearchQuery): Promise<DayPrice[]> {
  await delay(300);
  const rand = mulberry32(hashSeed(`cal|${q.from}|${q.to}`.toLowerCase()));
  const { distanceKm, domestic } = routeInfo(q);
  const base = Math.max(domestic ? 2400 : 9500, distanceKm * (domestic ? 2.7 : 5.6));
  const anchor = q.depart ? new Date(q.depart) : new Date();
  const days: DayPrice[] = Array.from({ length: 9 }, (_, i) => {
    const d = new Date(anchor);
    d.setDate(d.getDate() + (i - 4));
    const wave = Math.sin(i * 1.2) * base * 0.14;
    const price = Math.round(base + wave + rand() * base * 0.2);
    return { date: d.toISOString().slice(0, 10), price, cheapest: false };
  });
  const min = Math.min(...days.map((d) => d.price));
  days.forEach((d) => (d.cheapest = d.price === min));
  return days;
}

export interface EverywherePrice {
  iata: string;
  city: string;
  country: string;
  price: number;
  domestic: boolean;
  distanceKm: number;
}

export async function fetchEverywhere(from: string): Promise<EverywherePrice[]> {
  await delay(520 + Math.random() * 280);
  const origin = findAirport(from) ?? AIRPORTS[2];
  return AIRPORTS.filter((a) => a.iata !== origin.iata)
    .map((a) => {
      const rand = mulberry32(hashSeed(`ev|${origin.iata}|${a.iata}`));
      const distanceKm = Math.max(200, haversineKm(origin.lat, origin.lon, a.lat, a.lon));
      const domestic = origin.country === "India" && a.country === "India";
      const longHaul = distanceKm > 4000;
      const perKm = domestic ? 2.9 : longHaul ? 6.4 : 4.8;
      const floor = domestic ? 2200 : longHaul ? 24000 : 9000;
      const price = Math.round(Math.max(floor, distanceKm * perKm * (0.82 + rand() * 0.3)));
      return { iata: a.iata, city: a.city, country: a.country, price, domestic, distanceKm };
    })
    .sort((x, y) => x.price - y.price);
}

export async function fetchMonthPrices(q: SearchQuery): Promise<DayPrice[]> {
  await delay(380);
  const anchor = q.depart ? new Date(q.depart) : new Date();
  const y = anchor.getFullYear();
  const m = anchor.getMonth();
  const rand = mulberry32(hashSeed(`month|${q.from}|${q.to}|${y}-${m}`.toLowerCase()));
  const { distanceKm, domestic } = routeInfo(q);
  const base = Math.max(domestic ? 2400 : 9500, distanceKm * (domestic ? 2.7 : 5.6));
  const count = new Date(y, m + 1, 0).getDate();
  const list: DayPrice[] = Array.from({ length: count }, (_, i) => {
    const day = new Date(y, m, i + 1);
    const weekend = day.getDay() === 5 || day.getDay() === 6 ? 1.12 : 1;
    const wave = Math.sin(i * 0.9) * base * 0.12;
    const price = Math.round((base + wave + rand() * base * 0.22) * weekend);
    return { date: `${y}-${pad(m + 1)}-${pad(i + 1)}`, price, cheapest: false };
  });
  const min = Math.min(...list.map((d) => d.price));
  list.forEach((d) => (d.cheapest = d.price === min));
  return list;
}

const STAY_NAMES = [
  "The Meridian",
  "Casa Azure",
  "Lotus Grand",
  "Harbourline Suites",
  "The Fern Court",
  "Skyline Residency",
  "Amber Palms",
  "The Cedar House",
  "Bluewater Inn",
  "Villa Seren",
];
const AREAS = ["Old Town", "City Centre", "Riverside", "Marina District", "Arts Quarter", "Hillview"];
const AMENITY_POOL = ["Free WiFi", "Pool", "Breakfast", "Gym", "Spa", "Parking", "Pet friendly", "Rooftop bar"];
const STAY_GRADIENTS = [
  "from-sky-400 to-indigo-500",
  "from-rose-400 to-orange-400",
  "from-emerald-400 to-teal-500",
  "from-violet-400 to-purple-600",
  "from-amber-300 to-rose-400",
  "from-cyan-400 to-blue-600",
];

const STAY_PHOTOS = [
  "1566073771259-6a8506099945",
  "1582719508461-905c673771fd",
  "1520250497591-112f2f40a3f4",
  "1551882547-ff40c63fe5fa",
  "1522708323590-d24dbb6b0267",
  "1560448204-e02f11c3d0e2",
  "1571003123894-1f0594d2b5d9",
  "1445019980597-93fa8acb246c",
  "1564501049412-61c2a3083791",
];

export async function fetchStays(city: string): Promise<StayOffer[]> {
  await delay(420 + Math.random() * 300);
  const rand = mulberry32(hashSeed(`stay|${city}`.toLowerCase()));
  const center = findAirport(city) ?? AIRPORTS.find((a) => a.iata === "GOI")!;
  return Array.from({ length: 9 }, (_, i) => {
    const amenities = AMENITY_POOL.filter(() => rand() > 0.55).slice(0, 4);
    return {
      lat: center.lat + (rand() - 0.5) * 0.14,
      lon: center.lon + (rand() - 0.5) * 0.14,
      id: `st-${i}`,
      name: STAY_NAMES[Math.floor(rand() * STAY_NAMES.length)],
      area: AREAS[Math.floor(rand() * AREAS.length)],
      city: city || "Anywhere",
      rating: Math.round((3.6 + rand() * 1.4) * 10) / 10,
      reviews: 120 + Math.floor(rand() * 2400),
      pricePerNight: Math.round(1800 + rand() * 9500),
      amenities: amenities.length ? amenities : ["Free WiFi"],
      ecoCertified: rand() > 0.65,
      gradient: STAY_GRADIENTS[i % STAY_GRADIENTS.length],
      photo: `https://images.unsplash.com/photo-${STAY_PHOTOS[i % STAY_PHOTOS.length]}?auto=format&fit=crop&w=700&q=75`,
    };
  });
}

const SUPPLIERS = ["DriveNow", "Zoomo", "RentSprint", "Carvia", "AutoLink"];
const MODELS: Record<CarOffer["carClass"], string[]> = {
  Economy: ["Swift Dzire", "Kwid Sprint", "Alto Neo"],
  Compact: ["i20 Verve", "Baleno Edge", "Polo Trend"],
  SUV: ["Creta Peak", "XUV Nova", "Seltos Ridge"],
  Premium: ["Camry Lumen", "Superb Elan", "A4 Motion"],
  Van: ["Innova Crysta", "Carens Flow", "Ertiga Plus"],
};

export async function fetchCars(city: string): Promise<CarOffer[]> {
  await delay(380 + Math.random() * 300);
  const rand = mulberry32(hashSeed(`car|${city}`.toLowerCase()));
  const classes = Object.keys(MODELS) as CarOffer["carClass"][];
  return Array.from({ length: 8 }, (_, i) => {
    const carClass = classes[Math.floor(rand() * classes.length)];
    const models = MODELS[carClass];
    const fuel: CarOffer["fuel"] = rand() < 0.2 ? "Electric" : rand() < 0.45 ? "Hybrid" : "Petrol";
    return {
      id: `car-${i}`,
      supplier: SUPPLIERS[Math.floor(rand() * SUPPLIERS.length)],
      model: models[Math.floor(rand() * models.length)],
      carClass,
      seats: carClass === "Van" ? 7 : carClass === "SUV" ? 5 : 4,
      transmission: rand() > 0.4 ? "Automatic" : "Manual",
      fuel,
      pricePerDay: Math.round(1400 + rand() * 5200 + (carClass === "Premium" ? 2600 : 0)),
      freeCancellation: rand() > 0.35,
      greener: fuel !== "Petrol",
    };
  });
}

export function formatINR(n: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

export function formatDuration(min: number): string {
  return `${Math.floor(min / 60)}h ${pad(min % 60)}m`;
}
