import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowRight, Globe2 } from "lucide-react";
import { fetchEverywhere, formatINR } from "@/lib/mockApi";
import { findAirport } from "@/data/airports";
import { getCityPhoto } from "@/data/cityPhotos";
import { Chip } from "@/components/ui/Chip";
import { cn } from "@/lib/cn";

const FALLBACK_GRADIENTS = [
  "from-sky-500 to-indigo-600",
  "from-amber-400 to-rose-500",
  "from-emerald-400 to-teal-600",
  "from-violet-500 to-purple-700",
  "from-rose-400 to-pink-600",
  "from-cyan-400 to-blue-600",
];

type Scope = "all" | "domestic" | "international";

export function ExplorePage() {
  const [params] = useSearchParams();
  const from = params.get("from") || "Bengaluru (BLR)";
  const origin = findAirport(from);
  const { data, isLoading } = useQuery({
    queryKey: ["everywhere", origin?.iata ?? from],
    queryFn: () => fetchEverywhere(from),
  });
  const [scope, setScope] = useState<Scope>("all");
  const [budget, setBudget] = useState<number | null>(null);

  const visible = useMemo(() => {
    let list = data ?? [];
    if (scope === "domestic") list = list.filter((d) => d.domestic);
    if (scope === "international") list = list.filter((d) => !d.domestic);
    if (budget) list = list.filter((d) => d.price <= budget);
    return list;
  }, [data, scope, budget]);

  return (
    <div className="container py-8">
      <header className="mb-6">
        <p className="section-label flex items-center gap-1.5">
          <Globe2 size={13} aria-hidden />
          Everywhere
        </p>
        <h1 className="mt-1.5 font-display text-3xl font-extrabold tracking-tight">
          Fly anywhere from {origin?.city ?? from}
        </h1>
        <p className="mt-1 text-sm text-ink-muted dark:text-ink-inverse/60">
          Every destination we track, ranked by the cheapest simulated fare.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {(
            [
              { id: "all", label: "All" },
              { id: "domestic", label: "Within India" },
              { id: "international", label: "International" },
            ] as const
          ).map((s) => (
            <Chip key={s.id} active={scope === s.id} onClick={() => setScope(s.id)}>
              {s.label}
            </Chip>
          ))}
          <span className="mx-1 h-5 w-px bg-black/10 dark:bg-white/15" aria-hidden />
          {[5000, 15000, 40000].map((b) => (
            <Chip
              key={b}
              active={budget === b}
              onClick={() => setBudget(budget === b ? null : b)}
            >
              Under {formatINR(b)}
            </Chip>
          ))}
        </div>
      </header>

      <section
        aria-busy={isLoading}
        className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
      >
        {isLoading &&
          Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="card h-44 animate-pulse bg-surface-muted/50 dark:bg-surface-dark-muted/50" />
          ))}

        {visible.map((d, i) => {
          const gradient = FALLBACK_GRADIENTS[i % FALLBACK_GRADIENTS.length];
          return (
            <motion.div
              key={d.iata}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.04, 0.5) }}
            >
              <Link
                to={`/flights?from=${encodeURIComponent(from)}&to=${encodeURIComponent(`${d.city} (${d.iata})`)}&pax=1&cabin=economy`}
                className={cn(
                  "group relative flex h-44 flex-col justify-end overflow-hidden rounded-2xl bg-gradient-to-br p-4 text-white transition-transform hover:-translate-y-1",
                  gradient,
                )}
              >
                <img
                  src={getCityPhoto(d.iata, i)}
                  alt=""
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" aria-hidden />
                <span className="absolute right-3 top-3 rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold backdrop-blur">
                  {d.iata}
                </span>
                <div className="relative">
                  <p className="font-display text-lg font-extrabold leading-tight drop-shadow">
                    {d.city}
                  </p>
                  <p className="text-xs text-white/75">{d.country}</p>
                  <p className="tnum mt-1.5 flex items-center gap-1 text-sm font-bold">
                    from {formatINR(d.price)}
                    <ArrowRight size={13} className="opacity-0 transition-opacity group-hover:opacity-100" aria-hidden />
                  </p>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </section>

      {!isLoading && visible.length === 0 && (
        <div className="card mt-4 py-16 text-center text-sm text-ink-muted dark:text-ink-inverse/60">
          Nothing under that budget from here. Try a higher cap.
        </div>
      )}
    </div>
  );
}
