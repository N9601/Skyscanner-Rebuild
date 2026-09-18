import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BellPlus, Check, Leaf, Plane, Plus, X } from "lucide-react";
import type { FlightOffer } from "@/types";
import { formatDuration, formatINR } from "@/lib/mockApi";
import { findAirport } from "@/data/airports";
import { useTrips } from "@/stores/trips";
import { useAlerts } from "@/stores/alerts";
import { cn } from "@/lib/cn";

interface DrawerProps {
  offer: FlightOffer | null;
  avgCo2: number;
  onClose: () => void;
}

export function FlightDetailDrawer({ offer, avgCo2, onClose }: DrawerProps) {
  const { items, add, remove } = useTrips();
  const addAlert = useAlerts((s) => s.add);
  const [logoFailed, setLogoFailed] = useState(false);

  useEffect(() => {
    setLogoFailed(false);
  }, [offer?.id]);

  useEffect(() => {
    if (!offer) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [offer, onClose]);

  const inTrip = offer ? items.some((i) => i.id === offer.id) : false;
  const base = offer ? Math.round(offer.price * 0.74) : 0;
  const taxes = offer ? Math.round(offer.price * 0.18) : 0;
  const fees = offer ? offer.price - base - taxes : 0;
  const co2Delta = offer && avgCo2 > 0 ? Math.round(((offer.co2kg - avgCo2) / avgCo2) * 100) : 0;

  return (
    <AnimatePresence>
      {offer && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[90] bg-black/40 backdrop-blur-sm"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 380, damping: 40 }}
            className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col overflow-y-auto bg-white shadow-lifted dark:bg-surface-dark-muted"
            role="dialog"
            aria-label="Flight details"
          >
            <header className="sticky top-0 z-10 flex items-center justify-between border-b border-black/[0.05] bg-white/90 px-6 py-4 backdrop-blur dark:border-white/[0.07] dark:bg-surface-dark-muted/90">
              <div className="flex items-center gap-3">
                {logoFailed ? (
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 font-display text-sm font-extrabold text-brand dark:bg-brand-700/20">
                    {offer.airlineCode}
                  </span>
                ) : (
                  <img
                    src={`https://images.kiwi.com/airlines/64/${offer.airlineCode}.png`}
                    alt=""
                    onError={() => setLogoFailed(true)}
                    className="h-10 w-10 rounded-xl border border-black/[0.06] bg-white object-contain p-1 dark:border-white/[0.1]"
                  />
                )}
                <div>
                  <p className="font-display font-bold">{offer.airline}</p>
                  <p className="text-xs text-ink-soft">
                    {offer.flightNo} · {offer.cabin}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close details"
                className="grid h-9 w-9 place-items-center rounded-full text-ink-soft transition-colors hover:bg-surface-muted hover:text-ink dark:hover:bg-surface-dark"
              >
                <X size={18} aria-hidden />
              </button>
            </header>

            <div className="flex-1 space-y-6 px-6 py-6">
              <section aria-label="Itinerary">
                <p className="section-label mb-4">Itinerary</p>
                <div className="relative pl-6">
                  <span className="absolute bottom-2 left-[7px] top-2 w-px bg-gradient-to-b from-brand via-ink-soft/40 to-brand" aria-hidden />
                  <div className="relative pb-5">
                    <span className="absolute -left-6 top-1 h-3.5 w-3.5 rounded-full border-2 border-brand bg-white dark:bg-surface-dark-muted" aria-hidden />
                    <p className="tnum font-display text-lg font-bold">{offer.departTime}</p>
                    <p className="text-sm text-ink-muted dark:text-ink-inverse/70">
                      {findAirport(offer.from)?.city ?? offer.from} ({offer.from})
                    </p>
                  </div>
                  {offer.stops > 0 && offer.stopCity && (
                    <div className="relative pb-5">
                      <span className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full bg-amber-500" aria-hidden />
                      <p className="text-xs font-medium text-amber-600 dark:text-amber-400">
                        {offer.stops === 1 ? "Layover" : `${offer.stops} stops`} · {offer.stopCity}
                      </p>
                    </div>
                  )}
                  <div className="relative">
                    <span className="absolute -left-6 top-1 grid h-3.5 w-3.5 place-items-center rounded-full bg-brand text-white" aria-hidden>
                      <Plane size={8} />
                    </span>
                    <p className="tnum font-display text-lg font-bold">{offer.arriveTime}</p>
                    <p className="text-sm text-ink-muted dark:text-ink-inverse/70">
                      {findAirport(offer.to)?.city ?? offer.to} ({offer.to})
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex gap-2 text-xs">
                  <span className="rounded-full bg-surface-muted px-2.5 py-1 font-medium text-ink-muted dark:bg-surface-dark dark:text-ink-inverse/70">
                    {formatDuration(offer.durationMin)}
                  </span>
                  <span className="rounded-full bg-surface-muted px-2.5 py-1 font-medium text-ink-muted dark:bg-surface-dark dark:text-ink-inverse/70">
                    {offer.distanceKm.toLocaleString("en-IN")} km
                  </span>
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-1 font-medium",
                      offer.stops === 0
                        ? "bg-eco-soft text-eco dark:bg-eco-dark/40 dark:text-emerald-300"
                        : "bg-surface-muted text-ink-muted dark:bg-surface-dark dark:text-ink-inverse/70",
                    )}
                  >
                    {offer.stops === 0 ? "Nonstop" : `${offer.stops} stop${offer.stops > 1 ? "s" : ""}`}
                  </span>
                </div>
              </section>

              <section aria-label="Fare breakdown" className="card p-5">
                <p className="section-label mb-3">Fare breakdown</p>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-ink-muted dark:text-ink-inverse/70">Base fare</dt>
                    <dd className="tnum font-medium">{formatINR(base)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-ink-muted dark:text-ink-inverse/70">Taxes and surcharges</dt>
                    <dd className="tnum font-medium">{formatINR(taxes)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-ink-muted dark:text-ink-inverse/70">Booking fees</dt>
                    <dd className="tnum font-medium">{formatINR(fees)}</dd>
                  </div>
                  <div className="flex justify-between border-t border-black/[0.06] pt-2 dark:border-white/[0.08]">
                    <dt className="font-semibold">Total</dt>
                    <dd className="tnum font-display text-lg font-extrabold">{formatINR(offer.price)}</dd>
                  </div>
                </dl>
              </section>

              <section aria-label="Emissions" className="card p-5">
                <p className="section-label mb-3 flex items-center gap-1.5">
                  <Leaf size={13} aria-hidden />
                  Emissions
                </p>
                <p className="tnum font-display text-2xl font-extrabold">
                  {offer.co2kg} kg CO2
                  <span className="ml-2 align-middle text-xs font-semibold text-ink-soft">per traveler</span>
                </p>
                <div className="mt-3 space-y-2">
                  <Bar label="This flight" value={offer.co2kg} max={Math.max(offer.co2kg, avgCo2) * 1.15} tone={offer.greener ? "eco" : "neutral"} />
                  <Bar label="Route average" value={Math.round(avgCo2)} max={Math.max(offer.co2kg, avgCo2) * 1.15} tone="muted" />
                </div>
                <p className={cn("mt-3 text-sm font-medium", co2Delta <= 0 ? "text-eco" : "text-amber-600 dark:text-amber-400")}>
                  {co2Delta === 0
                    ? "Right at the route average."
                    : co2Delta < 0
                      ? `${Math.abs(co2Delta)}% less CO2 than the route average.`
                      : `${co2Delta}% more CO2 than the route average.`}
                </p>
              </section>
            </div>

            <footer className="sticky bottom-0 flex gap-2 border-t border-black/[0.05] bg-white/90 px-6 py-4 backdrop-blur dark:border-white/[0.07] dark:bg-surface-dark-muted/90">
              <button
                type="button"
                onClick={() =>
                  addAlert({
                    route: `${offer.from} → ${offer.to}`,
                    from: offer.from,
                    to: offer.to,
                    targetPrice: Math.round(offer.price * 0.9),
                    currentPrice: offer.price,
                  })
                }
                className="inline-flex h-11 items-center gap-1.5 rounded-xl border border-black/[0.08] px-4 text-sm font-semibold text-ink-muted transition-colors hover:border-amber-400 hover:text-amber-500 dark:border-white/[0.1] dark:text-ink-inverse/70"
              >
                <BellPlus size={16} aria-hidden />
                Alert
              </button>
              <button
                type="button"
                onClick={() =>
                  inTrip
                    ? remove(offer.id)
                    : add({
                        id: offer.id,
                        kind: "flight",
                        title: `${offer.from} → ${offer.to}`,
                        subtitle: `${offer.airline} · ${offer.departTime} · ${offer.stops === 0 ? "Nonstop" : `${offer.stops} stop`}`,
                        price: offer.price,
                        meta: `${offer.co2kg} kg CO2`,
                      })
                }
                className={cn(
                  "inline-flex h-11 flex-1 items-center justify-center gap-1.5 rounded-xl text-sm font-semibold transition-all",
                  inTrip
                    ? "bg-eco-soft text-eco dark:bg-eco-dark/40 dark:text-emerald-300"
                    : "bg-ink text-white hover:scale-[1.01] dark:bg-white dark:text-ink",
                )}
              >
                {inTrip ? <Check size={16} aria-hidden /> : <Plus size={16} aria-hidden />}
                {inTrip ? "In your trip" : `Add to trip · ${formatINR(offer.price)}`}
              </button>
            </footer>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Bar({
  label,
  value,
  max,
  tone,
}: {
  label: string;
  value: number;
  max: number;
  tone: "eco" | "neutral" | "muted";
}) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs">
        <span className="text-ink-soft">{label}</span>
        <span className="tnum font-semibold">{value} kg</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-black/[0.06] dark:bg-white/[0.08]">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${(value / max) * 100}%` }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          className={cn(
            "h-full rounded-full",
            tone === "eco" ? "bg-eco" : tone === "neutral" ? "bg-amber-500" : "bg-ink-soft/50",
          )}
        />
      </div>
    </div>
  );
}
