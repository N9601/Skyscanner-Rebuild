export interface Airline {
  name: string;
  code: string;
  domestic: boolean;
  longHaul: boolean;
}

export const AIRLINES: Airline[] = [
  { name: "IndiGo", code: "6E", domestic: true, longHaul: false },
  { name: "Air India", code: "AI", domestic: true, longHaul: true },
  { name: "Vistara", code: "UK", domestic: true, longHaul: true },
  { name: "SpiceJet", code: "SG", domestic: true, longHaul: false },
  { name: "Akasa Air", code: "QP", domestic: true, longHaul: false },
  { name: "Air India Express", code: "IX", domestic: true, longHaul: false },
  { name: "Emirates", code: "EK", domestic: false, longHaul: true },
  { name: "Qatar Airways", code: "QR", domestic: false, longHaul: true },
  { name: "Etihad Airways", code: "EY", domestic: false, longHaul: true },
  { name: "Singapore Airlines", code: "SQ", domestic: false, longHaul: true },
  { name: "Thai Airways", code: "TG", domestic: false, longHaul: true },
  { name: "Malaysia Airlines", code: "MH", domestic: false, longHaul: true },
  { name: "Cathay Pacific", code: "CX", domestic: false, longHaul: true },
  { name: "British Airways", code: "BA", domestic: false, longHaul: true },
  { name: "Lufthansa", code: "LH", domestic: false, longHaul: true },
  { name: "Air France", code: "AF", domestic: false, longHaul: true },
  { name: "KLM", code: "KL", domestic: false, longHaul: true },
  { name: "Turkish Airlines", code: "TK", domestic: false, longHaul: true },
  { name: "United Airlines", code: "UA", domestic: false, longHaul: true },
  { name: "Qantas", code: "QF", domestic: false, longHaul: true },
  { name: "SriLankan Airlines", code: "UL", domestic: false, longHaul: false },
];

export function airlinesForRoute(domesticRoute: boolean, longHaul: boolean): Airline[] {
  if (domesticRoute) return AIRLINES.filter((a) => a.domestic);
  if (longHaul) return AIRLINES.filter((a) => a.longHaul);
  return AIRLINES.filter((a) => a.longHaul || a.domestic);
}
