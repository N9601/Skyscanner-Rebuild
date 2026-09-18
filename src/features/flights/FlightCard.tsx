import { motion } from "framer-motion";
import { BellPlus, Leaf, Plus, Check } from "lucide-react";
import type { FlightOffer } from "@/types";
import { formatDuration, formatINR } from "@/lib/mockApi";
import { useTrips } from "@/stores/trips";
import { useAlerts } from "@/stores/alerts";
import { cn } from "@/lib/cn";

const MONOGRAM_TINTS = [
  "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300",
  "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300",
  "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
  "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
];

export function FlightCard({ offer, index }: { offer: FlightOffer; index: number }) {
  const { items, add, remove } = useTrips();
  const addAlert = useAlerts((s) => s.add);
  const inTrip = items.some((i) => i.id === offer.id);
  const tint = MONOGRAM_TINTS[offer.airlineCode.charCodeAt(0) % MONOGRAM_TINTS.length];

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.4) }}
      className="card card-hover p-5"
    >
      <div className="flex flex-wrap items-center gap-4 md:gap-6">
        <div className="flex min-w-40 items-center gap-3">
          <span className={cn("grid h-11 w-11 shrink-0 place-items-center rounded-xl font-display text-sm font-extrabold", tint)}>
            {offer.airlineCode}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{offer.airline}</p>
            <p className="text-xs text-ink-soft">{offer.flightNo}</p>
          </div>
        </div>

        <div className="flex flex-1 items-center gap-3 md:gap-5">
          <div className="text-right">
            <p className="tnum font-display text-xl font-bold">{offer.departTime}</p>
            <p className="text-xs font-medium text-ink-soft">{offer.from}</p>
          </div>
          <div className="flex min-w-24 flex-1 flex-col items-center gap-1">
            <p className="tnum text-[11px] font-medium text-ink-soft">
              {formatDuration(offer.durationMin)}
            </p>
            <div className="relative h-px w-full bg-gradient-to-r from-transparent via-ink-soft/40 to-transparent">
              {offer.stops > 0 && (
                <span className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500" />
              )}
            </div>
            <p className={cn("text-[11px] font-medium", offer.stops === 0 ? "text-eco" : "text-ink-soft")}>
              {offer.stops === 0 ? "Nonstop" : `${offer.stops} stop${offer.stops > 1 ? "s" : ""} · ${offer.stopCity}`}
            </p>
          </div>
          <div>
            <p className="tnum font-display text-xl font-bold">{offer.arriveTime}</p>
            <p className="text-xs font-medium text-ink-soft">{offer.to}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={cn(
              "tnum inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold",
              offer.greener
                ? "bg-eco-soft text-eco dark:bg-eco-dark/40 dark:text-emerald-300"
                : "bg-surface-muted text-ink-soft dark:bg-surface-dark",
            )}
          >
            <Leaf size={11} aria-hidden />
            {offer.co2kg} kg
          </span>
        </div>

        <div className="flex w-full items-center justify-between gap-3 border-t border-black/[0.05] pt-3 dark:border-white/[0.07] md:w-auto md:border-0 md:pt-0">
          <div className="md:text-right">
            <p className="tnum font-display text-2xl font-extrabold">{formatINR(offer.price)}</p>
            <p className="text-[11px] text-ink-soft">total, all travelers</p>
          </div>
          <div className="flex gap-1.5">
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
              aria-label="Create price alert"
              title="Alert me below this price"
              className="grid h-10 w-10 place-items-center rounded-xl border border-black/[0.08] text-ink-muted transition-colors hover:border-amber-400 hover:text-amber-500 dark:border-white/[0.1] dark:text-ink-inverse/70"
            >
              <BellPlus size={16} aria-hidden />
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
                "inline-flex h-10 items-center gap-1.5 rounded-xl px-4 text-sm font-semibold transition-all",
                inTrip
                  ? "bg-eco-soft text-eco dark:bg-eco-dark/40 dark:text-emerald-300"
                  : "bg-ink text-white hover:scale-[1.03] dark:bg-white dark:text-ink",
              )}
            >
              {inTrip ? <Check size={15} aria-hidden /> : <Plus size={15} aria-hidden />}
              {inTrip ? "Added" : "Add"}
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
