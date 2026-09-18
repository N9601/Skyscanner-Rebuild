import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Check, Leaf, Plus, Star } from "lucide-react";
import { fetchStays, formatINR } from "@/lib/mockApi";
import { SearchWidget } from "@/features/search/SearchWidget";
import { PopularCities } from "@/features/search/PopularGrids";
import { TiltCard } from "@/components/motion/TiltCard";
import { useTrips } from "@/stores/trips";
import { cn } from "@/lib/cn";

type StaySort = "recommended" | "price" | "rating";

export function StaysPage() {
  const [params] = useSearchParams();
  const city = params.get("city") ?? "";
  const { data: stays, isLoading } = useQuery({
    queryKey: ["stays", city],
    queryFn: () => fetchStays(city),
    enabled: Boolean(city),
  });
  const [sort, setSort] = useState<StaySort>("recommended");
  const [ecoOnly, setEcoOnly] = useState(false);
  const { items, add, remove } = useTrips();

  const visible = useMemo(() => {
    let list = stays ?? [];
    if (ecoOnly) list = list.filter((s) => s.ecoCertified);
    return [...list].sort((a, b) => {
      if (sort === "price") return a.pricePerNight - b.pricePerNight;
      if (sort === "rating") return b.rating - a.rating;
      return b.rating * 2 - a.pricePerNight / 4000 - (a.rating * 2 - b.pricePerNight / 4000);
    });
  }, [stays, sort, ecoOnly]);

  if (!city) {
    return (
      <div className="route-fade container py-12">
        <h1 className="font-display text-3xl font-extrabold tracking-tight">Find a stay</h1>
        <p className="mt-1.5 text-ink-muted dark:text-ink-inverse/60">
          Hotels, villas, and hidden gems, side by side.
        </p>
        <div className="mt-8">
          <SearchWidget compact />
        </div>
        <PopularCities kind="stays" label="Cities travelers are booking" />
      </div>
    );
  }

  return (
    <div className="route-fade container py-8">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="section-label">Stays</p>
          <h1 className="mt-1.5 font-display text-3xl font-extrabold tracking-tight">
            Places to stay in {city.replace(/\s*\([A-Z]{3}\)$/, "")}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            role="switch"
            aria-checked={ecoOnly}
            onClick={() => setEcoOnly((v) => !v)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
              ecoOnly
                ? "border-eco bg-eco-soft text-eco dark:bg-eco-dark/30"
                : "border-black/[0.08] text-ink-muted dark:border-white/[0.1] dark:text-ink-inverse/70",
            )}
          >
            <Leaf size={14} aria-hidden />
            Eco-certified
          </button>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as StaySort)}
            aria-label="Sort stays"
            className="rounded-full border border-black/[0.08] bg-white px-3.5 py-1.5 text-sm font-medium outline-none dark:border-white/[0.1] dark:bg-surface-dark-muted"
          >
            <option value="recommended">Recommended</option>
            <option value="price">Lowest price</option>
            <option value="rating">Top rated</option>
          </select>
        </div>
      </header>

      <section aria-busy={isLoading} className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading &&
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card h-72 animate-pulse bg-surface-muted/50 dark:bg-surface-dark-muted/50" />
          ))}

        {visible.map((s, i) => {
          const inTrip = items.some((t) => t.id === s.id);
          return (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.06, 0.4) }}
            >
              <TiltCard max={5} className="h-full">
                <article className="card card-hover flex h-full flex-col overflow-hidden p-0">
                  <div className={cn("relative h-36 bg-gradient-to-br", s.gradient)}>
                    <span className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" aria-hidden />
                    {s.ecoCertified && (
                      <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-eco backdrop-blur">
                        <Leaf size={11} aria-hidden />
                        Eco-certified
                      </span>
                    )}
                    <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full bg-black/40 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur">
                      <Star size={11} className="fill-amber-400 text-amber-400" aria-hidden />
                      {s.rating} · {s.reviews.toLocaleString("en-IN")} reviews
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h2 className="font-display text-lg font-bold">{s.name}</h2>
                    <p className="text-sm text-ink-soft">{s.area}</p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {s.amenities.map((a) => (
                        <span
                          key={a}
                          className="rounded-full bg-surface-muted px-2.5 py-1 text-[11px] font-medium text-ink-muted dark:bg-surface-dark dark:text-ink-inverse/70"
                        >
                          {a}
                        </span>
                      ))}
                    </div>
                    <div className="mt-auto flex items-end justify-between pt-4">
                      <div>
                        <p className="tnum font-display text-xl font-extrabold">
                          {formatINR(s.pricePerNight)}
                        </p>
                        <p className="text-[11px] text-ink-soft">per night</p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          inTrip
                            ? remove(s.id)
                            : add({
                                id: s.id,
                                kind: "stay",
                                title: s.name,
                                subtitle: `${s.area}, ${s.city}`,
                                price: s.pricePerNight,
                                meta: `${s.rating}★`,
                              })
                        }
                        className={cn(
                          "inline-flex h-9 items-center gap-1.5 rounded-xl px-3.5 text-sm font-semibold transition-all",
                          inTrip
                            ? "bg-eco-soft text-eco dark:bg-eco-dark/40 dark:text-emerald-300"
                            : "bg-ink text-white hover:scale-[1.03] dark:bg-white dark:text-ink",
                        )}
                      >
                        {inTrip ? <Check size={14} aria-hidden /> : <Plus size={14} aria-hidden />}
                        {inTrip ? "Added" : "Add"}
                      </button>
                    </div>
                  </div>
                </article>
              </TiltCard>
            </motion.div>
          );
        })}
      </section>
    </div>
  );
}
