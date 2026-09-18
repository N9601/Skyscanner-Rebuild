import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MapPin, Plane } from "lucide-react";
import { suggestAirports, type Airport } from "@/data/airports";
import { cn } from "@/lib/cn";

interface AirportFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  bare?: boolean;
}

export function AirportField({
  label,
  value,
  onChange,
  placeholder,
  required,
  bare,
}: AirportFieldProps) {
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);
  const suggestions = suggestAirports(value);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  function pick(a: Airport) {
    onChange(`${a.city} (${a.iata})`);
    setOpen(false);
  }

  return (
    <div ref={wrapRef} className={cn("relative", bare && "h-full")}>
      <label className={cn(bare ? "flex h-full flex-col justify-center gap-1 px-5 py-3.5" : "input-shell")}>
        <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-ink-soft">
          <MapPin size={13} aria-hidden />
          {label}
        </span>
        <input
          required={required}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setOpen(true);
            setHighlight(0);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (!open) return;
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setHighlight((h) => Math.min(h + 1, suggestions.length - 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setHighlight((h) => Math.max(h - 1, 0));
            } else if (e.key === "Enter" && suggestions[highlight]) {
              e.preventDefault();
              pick(suggestions[highlight]);
            } else if (e.key === "Escape") {
              setOpen(false);
            }
          }}
          placeholder={placeholder ?? "City or airport"}
          className="w-full bg-transparent text-sm font-medium outline-none placeholder:font-normal placeholder:text-ink-soft/70"
          role="combobox"
          aria-expanded={open}
          aria-autocomplete="list"
        />
      </label>

      <AnimatePresence>
        {open && suggestions.length > 0 && (
          <motion.ul
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.16 }}
            className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-black/[0.07] bg-white py-1.5 shadow-lifted dark:border-white/[0.1] dark:bg-surface-dark-muted"
            role="listbox"
          >
            {suggestions.map((a, i) => (
              <li key={a.iata}>
                <button
                  type="button"
                  role="option"
                  aria-selected={i === highlight}
                  onMouseEnter={() => setHighlight(i)}
                  onClick={() => pick(a)}
                  className={cn(
                    "flex w-full items-center gap-3 px-3.5 py-2 text-left",
                    i === highlight && "bg-brand-50 dark:bg-brand-700/20",
                  )}
                >
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-surface-muted text-ink-muted dark:bg-surface-dark dark:text-ink-inverse/60">
                    <Plane size={14} aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">
                      {a.city}, {a.country}
                    </span>
                    <span className="block truncate text-xs text-ink-soft">{a.name}</span>
                  </span>
                  <span className="rounded-md bg-surface-muted px-1.5 py-0.5 text-xs font-semibold text-ink-muted dark:bg-surface-dark dark:text-ink-inverse/70">
                    {a.iata}
                  </span>
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
