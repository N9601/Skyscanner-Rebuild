import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRightLeft, CalendarDays, SearchX } from "lucide-react";
import { useFlights, useMonthPrices, usePriceCalendar } from "@/features/flights/useFlights";
import { FlightCard } from "@/features/flights/FlightCard";
import { FiltersPanel, type FlightFilters } from "@/features/flights/FiltersPanel";
import { PriceStrip } from "@/features/flights/PriceStrip";
import { MonthGrid } from "@/features/flights/MonthGrid";
import { FlightDetailDrawer } from "@/features/flights/FlightDetailDrawer";
import { SearchWidget } from "@/features/search/SearchWidget";
import { PopularRoutes } from "@/features/search/PopularGrids";
import { findAirport } from "@/data/airports";
import { cn } from "@/lib/cn";
import type { CabinClass, FlightOffer, SearchQuery } from "@/types";

type SortKey = "best" | "cheapest" | "fastest" | "greenest";

const SORTS: { id: SortKey; label: string }[] = [
  { id: "best", label: "Best" },
  { id: "cheapest", label: "Cheapest" },
  { id: "fastest", label: "Fastest" },
  { id: "greenest", label: "Greenest" },
];

export function FlightsPage() {
  const [params, setParams] = useSearchParams();
  const query: SearchQuery = {
    from: params.get("from") ?? "",
    to: params.get("to") ?? "",
    depart: params.get("depart") ?? new Date().toISOString().slice(0, 10),
    return: params.get("return") ?? undefined,
    pax: Number(params.get("pax") ?? 1),
    cabin: (params.get("cabin") ?? "economy") as CabinClass,
  };

  const { data: offers, isLoading } = useFlights(query);
  const { data: calendar } = usePriceCalendar(query);
  const [sort, setSort] = useState<SortKey>("best");
  const [showMonth, setShowMonth] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<FlightOffer | null>(null);
  const { data: monthPrices } = useMonthPrices(query, showMonth);
  const [filters, setFilters] = useState<FlightFilters>({
    stops: "any",
    maxPrice: 500000,
    airlines: [],
    greenerOnly: false,
  });

  const fromAirport = findAirport(query.from);
  const toAirport = findAirport(query.to);

  const airlineOptions = useMemo(
    () => [...new Set((offers ?? []).map((o) => o.airline))].sort(),
    [offers],
  );
  const priceBounds = useMemo<[number, number]>(() => {
    if (!offers?.length) return [0, 500000];
    const prices = offers.map((o) => o.price);
    return [Math.min(...prices), Math.max(...prices)];
  }, [offers]);

  const visible = useMemo(() => {
    let list = offers ?? [];
    if (filters.stops !== "any") list = list.filter((o) => o.stops <= Number(filters.stops));
    if (filters.maxPrice < priceBounds[1]) list = list.filter((o) => o.price <= filters.maxPrice);
    if (filters.airlines.length) list = list.filter((o) => filters.airlines.includes(o.airline));
    if (filters.greenerOnly) list = list.filter((o) => o.greener);
    const score = (o: (typeof list)[number]) =>
      o.price / priceBounds[1] + o.durationMin / 1200 + o.stops * 0.15;
    return [...list].sort((a, b) => {
      switch (sort) {
        case "cheapest":
          return a.price - b.price;
        case "fastest":
          return a.durationMin - b.durationMin;
        case "greenest":
          return a.co2kg - b.co2kg;
        default:
          return score(a) - score(b);
      }
    });
  }, [offers, filters, sort, priceBounds]);

  if (!query.from || !query.to) {
    return (
      <div className="container py-12">
        <h1 className="font-display text-3xl font-extrabold tracking-tight">Find a flight</h1>
        <p className="mt-1.5 text-ink-muted dark:text-ink-inverse/60">
          Pick where you're going and we'll line up every option.
        </p>
        <div className="mt-8">
          <SearchWidget compact />
        </div>
        <PopularRoutes />
      </div>
    );
  }

  return (
    <div className="container py-8">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="section-label">Flights</p>
          <h1 className="mt-1.5 flex items-center gap-3 font-display text-3xl font-extrabold tracking-tight">
            {fromAirport?.city ?? query.from}
            <ArrowRightLeft size={22} className="text-ink-soft" aria-hidden />
            {toAirport?.city ?? query.to}
          </h1>
          <p className="mt-1 text-sm text-ink-muted dark:text-ink-inverse/60">
            {new Date(query.depart).toLocaleDateString("en-IN", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
            {" · "}
            {query.pax} traveler{query.pax > 1 ? "s" : ""} · {query.cabin}
          </p>
        </div>

        <div
          role="tablist"
          aria-label="Sort results"
          className="flex rounded-full border border-black/[0.06] bg-surface-muted p-1 dark:border-white/[0.07] dark:bg-surface-dark-muted"
        >
          {SORTS.map((s) => (
            <button
              key={s.id}
              role="tab"
              aria-selected={sort === s.id}
              onClick={() => setSort(s.id)}
              className={cn(
                "relative rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                sort === s.id
                  ? "text-ink dark:text-ink-inverse"
                  : "text-ink-muted hover:text-ink dark:text-ink-inverse/60",
              )}
            >
              {sort === s.id && (
                <motion.span
                  layoutId="sort-pill"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  className="absolute inset-0 rounded-full bg-white shadow-sm dark:bg-surface-dark"
                  aria-hidden
                />
              )}
              <span className="relative">{s.label}</span>
            </button>
          ))}
        </div>
      </header>

      {calendar && (
        <div className="mb-6">
          <div className="flex items-start gap-2">
            <div className="min-w-0 flex-1">
              <PriceStrip
                days={calendar}
                selected={query.depart}
                onSelect={(date) => {
                  params.set("depart", date);
                  setParams(params);
                }}
              />
            </div>
            <button
              type="button"
              onClick={() => setShowMonth((v) => !v)}
              aria-expanded={showMonth}
              className={cn(
                "inline-flex shrink-0 items-center gap-1.5 rounded-xl border px-3.5 py-2.5 text-sm font-medium transition-colors",
                showMonth
                  ? "border-brand bg-brand-50 text-brand dark:bg-brand-700/25"
                  : "border-black/[0.08] text-ink-muted hover:border-brand/40 dark:border-white/[0.1] dark:text-ink-inverse/70",
              )}
            >
              <CalendarDays size={15} aria-hidden />
              <span className="hidden sm:inline">Whole month</span>
            </button>
          </div>
          <AnimatePresence>
            {showMonth && monthPrices && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <div className="pt-4">
                  <MonthGrid
                    days={monthPrices}
                    selected={query.depart}
                    onSelect={(date) => {
                      params.set("depart", date);
                      setParams(params);
                    }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[270px_1fr]">
        <FiltersPanel
          filters={filters}
          onChange={setFilters}
          airlineOptions={airlineOptions}
          priceBounds={priceBounds}
        />

        <section aria-label="Results" aria-busy={isLoading} className="space-y-3.5">
          {isLoading &&
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="card h-24 animate-pulse bg-surface-muted/50 dark:bg-surface-dark-muted/50" />
            ))}

          {!isLoading && visible.length === 0 && (
            <div className="card flex flex-col items-center gap-3 py-16 text-center">
              <SearchX size={32} className="text-ink-soft" aria-hidden />
              <p className="font-display text-lg font-bold">Nothing matches those filters</p>
              <p className="max-w-sm text-sm text-ink-muted dark:text-ink-inverse/60">
                Try widening the price range or allowing more stops.
              </p>
            </div>
          )}

          <AnimatePresence initial={false}>
            {!isLoading &&
              visible.map((o, i) => (
                <FlightCard key={o.id} offer={o} index={i} onSelect={setSelectedOffer} />
              ))}
          </AnimatePresence>

          {!isLoading && visible.length > 0 && (
            <p className="pt-2 text-center text-xs text-ink-soft">
              {visible.length} of {offers?.length} itineraries shown · prices are simulated for
              this demo
            </p>
          )}
        </section>
      </div>

      <FlightDetailDrawer
        offer={selectedOffer}
        avgCo2={
          offers?.length ? offers.reduce((s, o) => s + o.co2kg, 0) / offers.length : 0
        }
        onClose={() => setSelectedOffer(null)}
      />
    </div>
  );
}
