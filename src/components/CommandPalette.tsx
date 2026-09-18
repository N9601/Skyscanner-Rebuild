import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  BellRing,
  Briefcase,
  Car,
  Home,
  Hotel,
  Moon,
  Plane,
  Search,
  Sparkles,
} from "lucide-react";
import { ROUTES } from "@/features/search/PopularGrids";
import { useTheme } from "@/stores/theme";
import { cn } from "@/lib/cn";

interface Command {
  id: string;
  label: string;
  hint?: string;
  icon: typeof Home;
  run: () => void;
}

export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate();
  const toggleTheme = useTheme((s) => s.toggle);
  const [query, setQuery] = useState("");
  const [highlight, setHighlight] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands = useMemo<Command[]>(() => {
    const go = (to: string) => () => {
      navigate(to);
      onClose();
    };
    return [
      { id: "home", label: "Home", icon: Home, run: go("/") },
      { id: "flights", label: "Flights", icon: Plane, run: go("/flights") },
      { id: "stays", label: "Stays", icon: Hotel, run: go("/stays") },
      { id: "cars", label: "Cars", icon: Car, run: go("/cars") },
      { id: "trips", label: "Trip plan", icon: Briefcase, run: go("/trips") },
      { id: "alerts", label: "Price alerts", icon: BellRing, run: go("/alerts") },
      { id: "assistant", label: "Ask the assistant", icon: Sparkles, run: go("/assistant") },
      {
        id: "theme",
        label: "Toggle dark mode",
        icon: Moon,
        run: () => {
          toggleTheme();
          onClose();
        },
      },
      ...ROUTES.map((r) => ({
        id: `route-${r.from[1]}-${r.to[1]}`,
        label: `${r.from[0]} to ${r.to[0]}`,
        hint: `${r.from[1]} → ${r.to[1]}`,
        icon: Plane,
        run: go(
          `/flights?from=${encodeURIComponent(`${r.from[0]} (${r.from[1]})`)}&to=${encodeURIComponent(`${r.to[0]} (${r.to[1]})`)}&pax=1&cabin=economy`,
        ),
      })),
    ];
  }, [navigate, onClose, toggleTheme]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter(
      (c) => c.label.toLowerCase().includes(q) || c.hint?.toLowerCase().includes(q),
    );
  }, [commands, query]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setHighlight(0);
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [open]);

  useEffect(() => setHighlight(0), [query]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[100] flex items-start justify-center bg-black/40 px-4 pt-[12vh] backdrop-blur-sm"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-lg overflow-hidden rounded-2xl border border-black/[0.07] bg-white shadow-lifted dark:border-white/[0.1] dark:bg-surface-dark-muted"
            role="dialog"
            aria-label="Command palette"
          >
            <div className="flex items-center gap-3 border-b border-black/[0.05] px-4 dark:border-white/[0.07]">
              <Search size={16} className="text-ink-soft" aria-hidden />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setHighlight((h) => Math.min(h + 1, visible.length - 1));
                  } else if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setHighlight((h) => Math.max(h - 1, 0));
                  } else if (e.key === "Enter") {
                    visible[highlight]?.run();
                  } else if (e.key === "Escape") {
                    onClose();
                  }
                }}
                placeholder="Search pages, routes, actions"
                className="w-full bg-transparent py-3.5 text-sm outline-none placeholder:text-ink-soft/60"
              />
              <kbd className="rounded-md border border-black/[0.08] px-1.5 py-0.5 text-[10px] font-semibold text-ink-soft dark:border-white/[0.1]">
                ESC
              </kbd>
            </div>
            <ul className="max-h-72 overflow-y-auto py-2">
              {visible.length === 0 && (
                <li className="px-4 py-6 text-center text-sm text-ink-soft">No matches</li>
              )}
              {visible.map((c, i) => (
                <li key={c.id}>
                  <button
                    type="button"
                    onMouseEnter={() => setHighlight(i)}
                    onClick={c.run}
                    className={cn(
                      "flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm",
                      i === highlight && "bg-brand-50 dark:bg-brand-700/20",
                    )}
                  >
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-surface-muted text-ink-muted dark:bg-surface-dark dark:text-ink-inverse/60">
                      <c.icon size={14} aria-hidden />
                    </span>
                    <span className="flex-1 font-medium">{c.label}</span>
                    {c.hint && <span className="tnum text-xs text-ink-soft">{c.hint}</span>}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
