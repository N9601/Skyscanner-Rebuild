import { motion } from "framer-motion";
import { Plane, Hotel, Car } from "lucide-react";
import { cn } from "@/lib/cn";
import { springy } from "@/lib/motion";

export type TripType = "flights" | "stays" | "cars";

const TABS: { id: TripType; label: string; icon: typeof Plane }[] = [
  { id: "flights", label: "Flights", icon: Plane },
  { id: "stays", label: "Stays", icon: Hotel },
  { id: "cars", label: "Cars", icon: Car },
];

export function TripTypeTabs({
  value,
  onChange,
}: {
  value: TripType;
  onChange: (v: TripType) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="Trip type"
      className="inline-flex rounded-full border border-black/[0.05] bg-surface-muted p-1 dark:border-white/[0.06] dark:bg-surface-dark"
    >
      {TABS.map(({ id, label, icon: Icon }) => {
        const active = value === id;
        return (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(id)}
            className={cn(
              "relative inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              active
                ? "text-ink dark:text-ink-inverse"
                : "text-ink-muted hover:text-ink dark:text-ink-inverse/60 dark:hover:text-ink-inverse",
            )}
          >
            {active && (
              <motion.span
                layoutId="trip-tab"
                transition={springy}
                className="absolute inset-0 rounded-full bg-white shadow-sm dark:bg-surface-dark-muted"
                aria-hidden
              />
            )}
            <span className="relative flex items-center gap-1.5">
              <Icon size={15} aria-hidden />
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
