export interface Destination {
  id: string;
  city: string;
  country: string;
  iata: string;
  tagline: string;
  from: number;
  gradient: string;
  tag?: string;
}

export const DESTINATIONS: Destination[] = [
  {
    id: "gc",
    city: "Goa",
    country: "India",
    iata: "GOI",
    tagline: "Sunset beaches and slow days",
    from: 3499,
    gradient: "from-amber-400 via-orange-500 to-rose-500",
    tag: "Beach break",
  },
  {
    id: "mle",
    city: "Maldives",
    country: "Maldives",
    iata: "MLE",
    tagline: "Turquoise water, overwater villas",
    from: 18999,
    gradient: "from-cyan-400 via-sky-500 to-blue-600",
    tag: "Island escape",
  },
  {
    id: "sxr",
    city: "Srinagar",
    country: "India",
    iata: "SXR",
    tagline: "Alpine lakes and houseboats",
    from: 5799,
    gradient: "from-emerald-400 via-teal-500 to-cyan-600",
    tag: "Mountains",
  },
  {
    id: "dxb",
    city: "Dubai",
    country: "UAE",
    iata: "DXB",
    tagline: "Skylines, souks, and desert dunes",
    from: 12499,
    gradient: "from-yellow-400 via-amber-500 to-orange-600",
    tag: "City lights",
  },
  {
    id: "bkk",
    city: "Bangkok",
    country: "Thailand",
    iata: "BKK",
    tagline: "Street food capital of Asia",
    from: 9899,
    gradient: "from-fuchsia-500 via-purple-500 to-indigo-600",
    tag: "Food trip",
  },
  {
    id: "cdg",
    city: "Paris",
    country: "France",
    iata: "CDG",
    tagline: "Golden hour on every corner",
    from: 38999,
    gradient: "from-indigo-400 via-violet-500 to-purple-700",
    tag: "Classic",
  },
  {
    id: "nrt",
    city: "Tokyo",
    country: "Japan",
    iata: "NRT",
    tagline: "Neon nights and quiet shrines",
    from: 41999,
    gradient: "from-rose-400 via-pink-500 to-red-600",
    tag: "Culture",
  },
];
