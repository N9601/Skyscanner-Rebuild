import { Plane, Hotel, Car } from "lucide-react";
import { cn } from "@/lib/cn";

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
    <div role="tablist" aria-label="Trip type" className="inline-flex rounded-xl bg-surface-muted p-1 dark:bg-surface-dark-muted">
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
              "inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
              active
                ? "bg-white text-ink shadow-sm dark:bg-surface-dark dark:text-ink-inverse"
                : "text-ink-muted hover:text-ink dark:text-ink-inverse/70 dark:hover:text-ink-inverse",
            )}
          >
            <Icon size={16} aria-hidden />
            {label}
          </button>
        );
      })}
    </div>
  );
}
