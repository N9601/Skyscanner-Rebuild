import { Leaf } from "lucide-react";
import { formatINR } from "@/lib/mockApi";
import { cn } from "@/lib/cn";

export interface FlightFilters {
  stops: "any" | "0" | "1";
  maxPrice: number;
  airlines: string[];
  greenerOnly: boolean;
}

export function FiltersPanel({
  filters,
  onChange,
  airlineOptions,
  priceBounds,
}: {
  filters: FlightFilters;
  onChange: (f: FlightFilters) => void;
  airlineOptions: string[];
  priceBounds: [number, number];
}) {
  return (
    <aside aria-label="Filters" className="card h-fit space-y-6 p-5 lg:sticky lg:top-24">
      <div className="flex items-center justify-between">
        <p className="font-display text-sm font-bold uppercase tracking-wider text-ink-soft">
          Filters
        </p>
        <button
          type="button"
          onClick={() =>
            onChange({ stops: "any", maxPrice: priceBounds[1], airlines: [], greenerOnly: false })
          }
          className="text-xs font-semibold text-brand hover:underline"
        >
          Reset
        </button>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={filters.greenerOnly}
        onClick={() => onChange({ ...filters, greenerOnly: !filters.greenerOnly })}
        className={cn(
          "flex w-full items-center justify-between rounded-xl border px-4 py-3 transition-colors",
          filters.greenerOnly
            ? "border-eco bg-eco-soft dark:bg-eco-dark/30"
            : "border-black/[0.08] dark:border-white/[0.1]",
        )}
      >
        <span className="flex items-center gap-2 text-sm font-semibold">
          <Leaf size={15} className="text-eco" aria-hidden />
          Greener Choice
        </span>
        <span
          className={cn(
            "relative h-5 w-9 rounded-full transition-colors",
            filters.greenerOnly ? "bg-eco" : "bg-ink-soft/30",
          )}
          aria-hidden
        >
          <span
            className={cn(
              "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all",
              filters.greenerOnly ? "left-[18px]" : "left-0.5",
            )}
          />
        </span>
      </button>

      <fieldset>
        <legend className="mb-2.5 text-sm font-semibold">Stops</legend>
        <div className="flex gap-1.5">
          {(
            [
              { v: "any", label: "Any" },
              { v: "0", label: "Nonstop" },
              { v: "1", label: "≤ 1 stop" },
            ] as const
          ).map((o) => (
            <button
              key={o.v}
              type="button"
              onClick={() => onChange({ ...filters, stops: o.v })}
              className={cn(
                "flex-1 rounded-lg border px-2 py-1.5 text-xs font-medium transition-colors",
                filters.stops === o.v
                  ? "border-brand bg-brand-50 text-brand dark:bg-brand-700/25 dark:text-brand-300"
                  : "border-black/[0.08] text-ink-muted hover:border-brand/40 dark:border-white/[0.1] dark:text-ink-inverse/70",
              )}
            >
              {o.label}
            </button>
          ))}
        </div>
      </fieldset>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <p className="text-sm font-semibold">Max price</p>
          <p className="tnum text-xs font-bold text-brand">{formatINR(filters.maxPrice)}</p>
        </div>
        <input
          type="range"
          min={priceBounds[0]}
          max={priceBounds[1]}
          step={100}
          value={filters.maxPrice}
          onChange={(e) => onChange({ ...filters, maxPrice: Number(e.target.value) })}
          className="w-full accent-brand"
          aria-label="Maximum price"
        />
      </div>

      <fieldset>
        <legend className="mb-2.5 text-sm font-semibold">Airlines</legend>
        <div className="space-y-1.5">
          {airlineOptions.map((a) => {
            const checked = filters.airlines.length === 0 || filters.airlines.includes(a);
            return (
              <label key={a} className="flex cursor-pointer items-center gap-2.5 text-sm">
                <input
                  type="checkbox"
                  checked={filters.airlines.includes(a)}
                  onChange={(e) =>
                    onChange({
                      ...filters,
                      airlines: e.target.checked
                        ? [...filters.airlines, a]
                        : filters.airlines.filter((x) => x !== a),
                    })
                  }
                  className="h-4 w-4 rounded border-ink-soft/40 accent-brand"
                />
                <span className={checked ? "" : "text-ink-soft"}>{a}</span>
              </label>
            );
          })}
        </div>
      </fieldset>
    </aside>
  );
}
