import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Car, Check, Fuel, Leaf, Plus, Users, Zap } from "lucide-react";
import { fetchCars, formatINR } from "@/lib/mockApi";
import { SearchWidget } from "@/features/search/SearchWidget";
import { useTrips } from "@/stores/trips";
import { cn } from "@/lib/cn";

export function CarsPage() {
  const [params] = useSearchParams();
  const city = params.get("city") ?? "";
  const { data: cars, isLoading } = useQuery({
    queryKey: ["cars", city],
    queryFn: () => fetchCars(city),
    enabled: Boolean(city),
  });
  const [greenerOnly, setGreenerOnly] = useState(false);
  const { items, add, remove } = useTrips();

  const visible = useMemo(() => {
    let list = cars ?? [];
    if (greenerOnly) list = list.filter((c) => c.greener);
    return [...list].sort((a, b) => a.pricePerDay - b.pricePerDay);
  }, [cars, greenerOnly]);

  if (!city) {
    return (
      <div className="route-fade container py-12">
        <h1 className="font-display text-3xl font-extrabold tracking-tight">Rent a car</h1>
        <p className="mt-1.5 text-ink-muted dark:text-ink-inverse/60">
          Compare suppliers at pickup points across the map.
        </p>
        <div className="mt-8">
          <SearchWidget compact />
        </div>
      </div>
    );
  }

  return (
    <div className="route-fade container py-8">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="section-label">Cars</p>
          <h1 className="mt-1.5 font-display text-3xl font-extrabold tracking-tight">
            Cars in {city.replace(/\s*\([A-Z]{3}\)$/, "")}
          </h1>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={greenerOnly}
          onClick={() => setGreenerOnly((v) => !v)}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
            greenerOnly
              ? "border-eco bg-eco-soft text-eco dark:bg-eco-dark/30"
              : "border-black/[0.08] text-ink-muted dark:border-white/[0.1] dark:text-ink-inverse/70",
          )}
        >
          <Leaf size={14} aria-hidden />
          Hybrid and electric only
        </button>
      </header>

      <section aria-busy={isLoading} className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {isLoading &&
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card h-36 animate-pulse bg-surface-muted/50 dark:bg-surface-dark-muted/50" />
          ))}

        {visible.map((c, i) => {
          const inTrip = items.some((t) => t.id === c.id);
          return (
            <motion.article
              key={c.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.06, 0.35) }}
              className="card card-hover flex items-center gap-5 p-5"
            >
              <span
                className={cn(
                  "grid h-16 w-16 shrink-0 place-items-center rounded-2xl",
                  c.fuel === "Electric"
                    ? "bg-eco-soft text-eco dark:bg-eco-dark/40"
                    : c.fuel === "Hybrid"
                      ? "bg-teal-100 text-teal-600 dark:bg-teal-500/15"
                      : "bg-surface-muted text-ink-muted dark:bg-surface-dark",
                )}
              >
                <Car size={26} aria-hidden />
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="truncate font-display text-lg font-bold">{c.model}</h2>
                  {c.greener && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-eco-soft px-2 py-0.5 text-[10px] font-bold text-eco dark:bg-eco-dark/40 dark:text-emerald-300">
                      <Leaf size={10} aria-hidden />
                      GREENER
                    </span>
                  )}
                </div>
                <p className="text-sm text-ink-soft">
                  {c.carClass} · {c.supplier}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-ink-muted dark:text-ink-inverse/60">
                  <span className="flex items-center gap-1">
                    <Users size={12} aria-hidden /> {c.seats} seats
                  </span>
                  <span className="flex items-center gap-1">
                    {c.fuel === "Electric" ? (
                      <Zap size={12} aria-hidden />
                    ) : (
                      <Fuel size={12} aria-hidden />
                    )}
                    {c.fuel}
                  </span>
                  <span>{c.transmission}</span>
                  {c.freeCancellation && <span className="font-medium text-eco">Free cancellation</span>}
                </div>
              </div>

              <div className="flex shrink-0 flex-col items-end gap-2">
                <div className="text-right">
                  <p className="tnum font-display text-xl font-extrabold">{formatINR(c.pricePerDay)}</p>
                  <p className="text-[11px] text-ink-soft">per day</p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    inTrip
                      ? remove(c.id)
                      : add({
                          id: c.id,
                          kind: "car",
                          title: c.model,
                          subtitle: `${c.carClass} · ${c.supplier}`,
                          price: c.pricePerDay,
                          meta: c.fuel,
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
            </motion.article>
          );
        })}
      </section>
    </div>
  );
}
