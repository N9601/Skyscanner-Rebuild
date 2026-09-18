import { motion } from "framer-motion";
import type { DayPrice } from "@/types";
import { cn } from "@/lib/cn";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function MonthGrid({
  days,
  selected,
  onSelect,
}: {
  days: DayPrice[];
  selected: string;
  onSelect: (date: string) => void;
}) {
  const first = new Date(days[0].date);
  const lead = (first.getDay() + 6) % 7;
  const sorted = [...days.map((d) => d.price)].sort((a, b) => a - b);
  const t1 = sorted[Math.floor(sorted.length / 3)];
  const t2 = sorted[Math.floor((2 * sorted.length) / 3)];
  const monthLabel = first.toLocaleDateString("en-IN", { month: "long", year: "numeric" });

  return (
    <div className="card p-5">
      <div className="mb-4 flex items-center justify-between">
        <p className="font-display font-bold">{monthLabel}</p>
        <div className="flex items-center gap-3 text-[11px] text-ink-soft">
          <span className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-sm bg-eco/70" aria-hidden /> Low
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-sm bg-amber-400/70" aria-hidden /> Mid
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-sm bg-rose-400/70" aria-hidden /> High
          </span>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1.5">
        {WEEKDAYS.map((w) => (
          <p key={w} className="pb-1 text-center text-[11px] font-semibold uppercase tracking-wider text-ink-soft">
            {w}
          </p>
        ))}
        {Array.from({ length: lead }).map((_, i) => (
          <span key={`lead-${i}`} aria-hidden />
        ))}
        {days.map((d, i) => {
          const isSelected = d.date === selected;
          const tone =
            d.price <= t1
              ? "bg-eco-soft text-eco dark:bg-eco-dark/35 dark:text-emerald-300"
              : d.price <= t2
                ? "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300"
                : "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-300";
          return (
            <motion.button
              key={d.date}
              type="button"
              onClick={() => onSelect(d.date)}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: Math.min(i * 0.012, 0.35), duration: 0.25 }}
              aria-label={`${d.date}, ₹${d.price.toLocaleString("en-IN")}`}
              className={cn(
                "flex flex-col items-center gap-0.5 rounded-lg px-1 py-2 transition-all hover:scale-105",
                tone,
                isSelected && "ring-2 ring-brand",
                d.cheapest && "ring-2 ring-eco",
              )}
            >
              <span className="text-xs font-bold">{Number(d.date.slice(8))}</span>
              <span className="tnum text-[10px] font-semibold opacity-80">
                ₹{(d.price / 1000).toFixed(1)}k
              </span>
            </motion.button>
          );
        })}
      </div>
      <p className="mt-3 text-center text-[11px] text-ink-soft">
        Green ring marks the cheapest day of the month. Tap any day to search it.
      </p>
    </div>
  );
}
