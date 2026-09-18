export interface Destination {
  id: string;
  city: string;
  country: string;
  iata: string;
  tagline: string;
  from: number;
  gradient: string;
  photo: string;
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
    photo: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=900&q=80",
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
    photo: "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=900&q=80",
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
    photo: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=900&q=80",
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
    photo: "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=900&q=80",
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
    photo: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=900&q=80",
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
    photo: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=900&q=80",
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
    photo: "https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?auto=format&fit=crop&w=900&q=80",
    tag: "Culture",
  },
];
