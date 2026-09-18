import type {
  CabinClass,
  CarOffer,
  DayPrice,
  FlightOffer,
  SearchQuery,
  StayOffer,
} from "@/types";

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

const AIRLINES = [
  { name: "IndiSky", code: "IS" },
  { name: "Vistara Blue", code: "VB" },
  { name: "AirWave", code: "AW" },
  { name: "Horizon Air", code: "HA" },
  { name: "CloudNine", code: "CN" },
  { name: "JetStream", code: "JS" },
];

const STOP_CITIES = ["DEL", "BOM", "HYD", "MAA", "CCU", "DXB", "SIN"];

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

export async function fetchFlights(q: SearchQuery): Promise<FlightOffer[]> {
  await delay(450 + Math.random() * 350);
  const rand = mulberry32(hashSeed(`${q.from}|${q.to}|${q.depart}|${q.cabin}`.toLowerCase()));
  const count = 12 + Math.floor(rand() * 5);
  const basePrice = 2600 + Math.floor(rand() * 5200);

  const offers: FlightOffer[] = Array.from({ length: count }, (_, i) => {
    const airline = AIRLINES[Math.floor(rand() * AIRLINES.length)];
    const stops = (rand() < 0.45 ? 0 : rand() < 0.8 ? 1 : 2) as 0 | 1 | 2;
    const departMin = 300 + Math.floor(rand() * 1020);
    const durationMin = 95 + stops * (60 + Math.floor(rand() * 140)) + Math.floor(rand() * 90);
    const price = Math.round(
      (basePrice + rand() * 3800 + stops * -420 + durationMin * 1.4) *
        CABIN_MULTIPLIER[q.cabin] *
        (1 + (q.pax - 1) * 0.02),
    );
    const co2kg = Math.round(88 + durationMin * 0.62 + stops * 26 + rand() * 30);
    return {
      id: `fl-${i}-${airline.code}`,
      airline: airline.name,
      airlineCode: airline.code,
      flightNo: `${airline.code} ${100 + Math.floor(rand() * 900)}`,
      from: q.from.toUpperCase(),
      to: q.to.toUpperCase(),
      departTime: minutesToTime(departMin),
      arriveTime: minutesToTime(departMin + durationMin),
      durationMin,
      stops,
      stopCity: stops > 0 ? STOP_CITIES[Math.floor(rand() * STOP_CITIES.length)] : undefined,
      price,
      co2kg,
      greener: false,
      cabin: q.cabin,
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
  const base = 2800 + Math.floor(rand() * 4200);
  const anchor = q.depart ? new Date(q.depart) : new Date();
  const days: DayPrice[] = Array.from({ length: 9 }, (_, i) => {
    const d = new Date(anchor);
    d.setDate(d.getDate() + (i - 4));
    const wave = Math.sin(i * 1.2) * 620;
    const price = Math.round(base + wave + rand() * 900);
    return { date: d.toISOString().slice(0, 10), price, cheapest: false };
  });
  const min = Math.min(...days.map((d) => d.price));
  days.forEach((d) => (d.cheapest = d.price === min));
  return days;
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

export async function fetchStays(city: string): Promise<StayOffer[]> {
  await delay(420 + Math.random() * 300);
  const rand = mulberry32(hashSeed(`stay|${city}`.toLowerCase()));
  return Array.from({ length: 9 }, (_, i) => {
    const amenities = AMENITY_POOL.filter(() => rand() > 0.55).slice(0, 4);
    return {
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
