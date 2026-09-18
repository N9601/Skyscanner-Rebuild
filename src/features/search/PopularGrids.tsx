import { Link } from "react-router-dom";
import { ArrowRight, Plane } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { formatINR } from "@/lib/mockApi";
import { cn } from "@/lib/cn";

export const ROUTES = [
  { from: ["Bengaluru", "BLR"], to: ["Goa", "GOI"], price: 3499 },
  { from: ["New Delhi", "DEL"], to: ["Mumbai", "BOM"], price: 2899 },
  { from: ["Mumbai", "BOM"], to: ["Dubai", "DXB"], price: 11499 },
  { from: ["New Delhi", "DEL"], to: ["London", "LHR"], price: 38999 },
  { from: ["Bengaluru", "BLR"], to: ["Singapore", "SIN"], price: 15799 },
  { from: ["Chennai", "MAA"], to: ["Colombo", "CMB"], price: 8899 },
  { from: ["Hyderabad", "HYD"], to: ["Bangkok", "BKK"], price: 13299 },
  { from: ["Mumbai", "BOM"], to: ["Maldives", "MLE"], price: 15999 },
];

export function PopularRoutes() {
  return (
    <div className="mt-12">
      <Reveal>
        <p className="section-label">Popular right now</p>
        <h2 className="mt-1.5 font-display text-2xl font-extrabold tracking-tight">
          Routes travelers are watching
        </h2>
      </Reveal>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {ROUTES.map((r, i) => (
          <Reveal key={`${r.from[1]}-${r.to[1]}`} delay={i * 60}>
            <Link
              to={`/flights?from=${encodeURIComponent(`${r.from[0]} (${r.from[1]})`)}&to=${encodeURIComponent(`${r.to[0]} (${r.to[1]})`)}&pax=1&cabin=economy`}
              className="card card-hover group flex items-center justify-between gap-3 p-5"
            >
              <div>
                <p className="flex items-center gap-2 font-display font-bold">
                  {r.from[1]}
                  <Plane size={13} className="text-ink-soft" aria-hidden />
                  {r.to[1]}
                </p>
                <p className="mt-0.5 text-xs text-ink-soft">
                  {r.from[0]} to {r.to[0]}
                </p>
                <p className="tnum mt-2 text-sm font-bold text-brand">
                  from {formatINR(r.price)}
                </p>
              </div>
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-black/[0.08] text-ink-soft transition-all group-hover:border-brand group-hover:bg-brand group-hover:text-white dark:border-white/[0.1]">
                <ArrowRight size={15} aria-hidden />
              </span>
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

const CITIES: { city: string; gradient: string; photo: string }[] = [
  { city: "Goa", gradient: "from-amber-400 to-rose-500", photo: "1512343879784-a960bf40e7f2" },
  { city: "Mumbai", gradient: "from-sky-500 to-indigo-600", photo: "1567157577867-05ccb1388e66" },
  { city: "Jaipur", gradient: "from-rose-400 to-pink-600", photo: "1477587458883-47145ed94245" },
  { city: "New Delhi", gradient: "from-violet-500 to-purple-700", photo: "1587474260584-136574528ed5" },
  { city: "Bengaluru", gradient: "from-emerald-400 to-teal-600", photo: "1596176530529-78163a4f7af2" },
  { city: "Kochi", gradient: "from-cyan-400 to-blue-600", photo: "1602216056096-3b40cc0c9944" },
];

export function PopularCities({ kind, label }: { kind: "stays" | "cars"; label: string }) {
  return (
    <div className="mt-12">
      <Reveal>
        <p className="section-label">Popular right now</p>
        <h2 className="mt-1.5 font-display text-2xl font-extrabold tracking-tight">{label}</h2>
      </Reveal>
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {CITIES.map(({ city, gradient, photo }, i) => (
          <Reveal key={city} delay={i * 60}>
            <Link
              to={`/${kind}?city=${encodeURIComponent(city)}`}
              className={cn(
                "group relative flex h-32 items-end overflow-hidden rounded-2xl bg-gradient-to-br p-4 text-white transition-transform hover:-translate-y-1",
                gradient,
              )}
            >
              <img
                src={`https://images.unsplash.com/photo-${photo}?auto=format&fit=crop&w=500&q=75`}
                alt=""
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" aria-hidden />
              <span className="relative font-display font-bold drop-shadow">{city}</span>
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
