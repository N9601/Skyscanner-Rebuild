export interface Airport {
  iata: string;
  city: string;
  name: string;
  country: string;
  lat: number;
  lon: number;
  international: boolean;
}

export const AIRPORTS: Airport[] = [
  { iata: "DEL", city: "New Delhi", name: "Indira Gandhi International", country: "India", lat: 28.5562, lon: 77.1, international: true },
  { iata: "BOM", city: "Mumbai", name: "Chhatrapati Shivaji Maharaj International", country: "India", lat: 19.0896, lon: 72.8656, international: true },
  { iata: "BLR", city: "Bengaluru", name: "Kempegowda International", country: "India", lat: 13.1986, lon: 77.7066, international: true },
  { iata: "MAA", city: "Chennai", name: "Chennai International", country: "India", lat: 12.9941, lon: 80.1709, international: true },
  { iata: "HYD", city: "Hyderabad", name: "Rajiv Gandhi International", country: "India", lat: 17.2403, lon: 78.4294, international: true },
  { iata: "CCU", city: "Kolkata", name: "Netaji Subhas Chandra Bose International", country: "India", lat: 22.6547, lon: 88.4467, international: true },
  { iata: "GOI", city: "Goa", name: "Goa International (Dabolim)", country: "India", lat: 15.3808, lon: 73.8314, international: true },
  { iata: "COK", city: "Kochi", name: "Cochin International", country: "India", lat: 10.152, lon: 76.4019, international: true },
  { iata: "AMD", city: "Ahmedabad", name: "Sardar Vallabhbhai Patel International", country: "India", lat: 23.0772, lon: 72.6347, international: true },
  { iata: "PNQ", city: "Pune", name: "Pune Airport", country: "India", lat: 18.5821, lon: 73.9197, international: false },
  { iata: "JAI", city: "Jaipur", name: "Jaipur International", country: "India", lat: 26.8242, lon: 75.8122, international: true },
  { iata: "LKO", city: "Lucknow", name: "Chaudhary Charan Singh International", country: "India", lat: 26.7606, lon: 80.8893, international: true },
  { iata: "IXC", city: "Chandigarh", name: "Shaheed Bhagat Singh International", country: "India", lat: 30.6735, lon: 76.7885, international: false },
  { iata: "SXR", city: "Srinagar", name: "Sheikh ul-Alam International", country: "India", lat: 33.9871, lon: 74.7742, international: false },
  { iata: "DXB", city: "Dubai", name: "Dubai International", country: "UAE", lat: 25.2532, lon: 55.3657, international: true },
  { iata: "AUH", city: "Abu Dhabi", name: "Zayed International", country: "UAE", lat: 24.433, lon: 54.6511, international: true },
  { iata: "DOH", city: "Doha", name: "Hamad International", country: "Qatar", lat: 25.2731, lon: 51.6081, international: true },
  { iata: "SIN", city: "Singapore", name: "Changi", country: "Singapore", lat: 1.3644, lon: 103.9915, international: true },
  { iata: "BKK", city: "Bangkok", name: "Suvarnabhumi", country: "Thailand", lat: 13.69, lon: 100.7501, international: true },
  { iata: "KUL", city: "Kuala Lumpur", name: "Kuala Lumpur International", country: "Malaysia", lat: 2.7456, lon: 101.7099, international: true },
  { iata: "HKG", city: "Hong Kong", name: "Hong Kong International", country: "Hong Kong", lat: 22.308, lon: 113.9185, international: true },
  { iata: "NRT", city: "Tokyo", name: "Narita International", country: "Japan", lat: 35.7719, lon: 140.3928, international: true },
  { iata: "ICN", city: "Seoul", name: "Incheon International", country: "South Korea", lat: 37.4602, lon: 126.4407, international: true },
  { iata: "LHR", city: "London", name: "Heathrow", country: "United Kingdom", lat: 51.47, lon: -0.4543, international: true },
  { iata: "CDG", city: "Paris", name: "Charles de Gaulle", country: "France", lat: 49.0097, lon: 2.5479, international: true },
  { iata: "FRA", city: "Frankfurt", name: "Frankfurt am Main", country: "Germany", lat: 50.0379, lon: 8.5622, international: true },
  { iata: "AMS", city: "Amsterdam", name: "Schiphol", country: "Netherlands", lat: 52.3105, lon: 4.7683, international: true },
  { iata: "ZRH", city: "Zurich", name: "Zurich Airport", country: "Switzerland", lat: 47.4582, lon: 8.5555, international: true },
  { iata: "IST", city: "Istanbul", name: "Istanbul Airport", country: "Turkey", lat: 41.2753, lon: 28.7519, international: true },
  { iata: "JFK", city: "New York", name: "John F. Kennedy International", country: "USA", lat: 40.6413, lon: -73.7781, international: true },
  { iata: "SFO", city: "San Francisco", name: "San Francisco International", country: "USA", lat: 37.6213, lon: -122.379, international: true },
  { iata: "YYZ", city: "Toronto", name: "Toronto Pearson International", country: "Canada", lat: 43.6777, lon: -79.6248, international: true },
  { iata: "SYD", city: "Sydney", name: "Sydney Kingsford Smith", country: "Australia", lat: -33.9399, lon: 151.1753, international: true },
  { iata: "MLE", city: "Malé", name: "Velana International", country: "Maldives", lat: 4.1918, lon: 73.529, international: true },
  { iata: "CMB", city: "Colombo", name: "Bandaranaike International", country: "Sri Lanka", lat: 7.1808, lon: 79.8841, international: true },
  { iata: "KTM", city: "Kathmandu", name: "Tribhuvan International", country: "Nepal", lat: 27.6966, lon: 85.3591, international: true },
];

export function findAirport(input: string): Airport | undefined {
  const q = input.trim().toLowerCase();
  if (!q) return undefined;
  const code = q.match(/\(([a-z]{3})\)/)?.[1];
  if (code) {
    const byCode = AIRPORTS.find((a) => a.iata.toLowerCase() === code);
    if (byCode) return byCode;
  }
  const plain = q.replace(/\s*\([a-z]{3}\)\s*/g, "").trim();
  return (
    AIRPORTS.find((a) => a.iata.toLowerCase() === plain) ??
    AIRPORTS.find((a) => a.city.toLowerCase() === plain) ??
    AIRPORTS.find(
      (a) => a.city.toLowerCase().startsWith(plain) || a.name.toLowerCase().includes(plain),
    )
  );
}

export function suggestAirports(input: string, limit = 6): Airport[] {
  const q = input.trim().toLowerCase();
  if (!q) return AIRPORTS.slice(0, limit);
  return AIRPORTS.filter(
    (a) =>
      a.iata.toLowerCase().startsWith(q) ||
      a.city.toLowerCase().includes(q) ||
      a.country.toLowerCase().startsWith(q) ||
      a.name.toLowerCase().includes(q),
  ).slice(0, limit);
}
