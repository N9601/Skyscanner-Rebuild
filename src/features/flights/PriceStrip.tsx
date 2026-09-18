import { motion } from "framer-motion";
import type { DayPrice } from "@/types";
import { cn } from "@/lib/cn";

export function PriceStrip({
  days,
  selected,
  onSelect,
}: {
  days: DayPrice[];
  selected: string;
  onSelect: (date: string) => void;
}) {
  const max = Math.max(...days.map((d) => d.price));
  return (
    <div className="scrollbar-none -mx-1 flex gap-2 overflow-x-auto px-1 pb-1" role="listbox" aria-label="Prices by day">
      {days.map((d, i) => {
        const date = new Date(d.date);
        const isSelected = d.date === selected;
        return (
          <motion.button
            key={d.date}
            type="button"
            role="option"
            aria-selected={isSelected}
            onClick={() => onSelect(d.date)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className={cn(
              "flex min-w-20 shrink-0 flex-col items-center gap-1.5 rounded-xl border px-3 py-2.5 transition-colors",
              isSelected
                ? "border-brand bg-brand-50 dark:bg-brand-700/25"
                : "border-black/[0.07] bg-white hover:border-brand/40 dark:border-white/[0.08] dark:bg-surface-dark-muted",
            )}
          >
            <span className="text-[11px] font-medium text-ink-soft">
              {date.toLocaleDateString("en-IN", { weekday: "short", day: "numeric" })}
            </span>
            <span className="relative flex h-8 w-full items-end justify-center">
              <span
                className={cn(
                  "w-4 rounded-t-md",
                  d.cheapest ? "bg-eco" : isSelected ? "bg-brand" : "bg-ink-soft/25",
                )}
                style={{ height: `${Math.max(18, (d.price / max) * 100)}%` }}
              />
            </span>
            <span className={cn("tnum text-xs font-bold", d.cheapest ? "text-eco" : "")}>
              ₹{Math.round(d.price / 100) / 10}k
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
