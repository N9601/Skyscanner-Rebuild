import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, Car, Hotel, Plane, Trash2, Wallet } from "lucide-react";
import { formatINR } from "@/lib/mockApi";
import { useTrips } from "@/stores/trips";
import { Reveal } from "@/components/motion/Reveal";
import { CountUp } from "@/components/motion/CountUp";
import { cn } from "@/lib/cn";
import type { TripItem } from "@/types";

const KIND_META: Record<TripItem["kind"], { icon: typeof Plane; label: string; tint: string; ring: string }> = {
  flight: { icon: Plane, label: "Flights", tint: "bg-sky-100 text-sky-600 dark:bg-sky-500/15", ring: "#0770E3" },
  stay: { icon: Hotel, label: "Stays", tint: "bg-violet-100 text-violet-600 dark:bg-violet-500/15", ring: "#8B5CF6" },
  car: { icon: Car, label: "Cars", tint: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15", ring: "#16A34A" },
};

function Ring({ value, total, color, label }: { value: number; total: number; color: string; label: string }) {
  const pct = total > 0 ? value / total : 0;
  const r = 34;
  const c = 2 * Math.PI * r;
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative h-24 w-24">
        <svg viewBox="0 0 84 84" className="h-full w-full -rotate-90">
          <circle cx="42" cy="42" r={r} fill="none" strokeWidth="7" className="stroke-black/[0.06] dark:stroke-white/[0.08]" />
          <motion.circle
            cx="42"
            cy="42"
            r={r}
            fill="none"
            stroke={color}
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={c}
            initial={{ strokeDashoffset: c }}
            animate={{ strokeDashoffset: c * (1 - pct) }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          />
        </svg>
        <span className="tnum absolute inset-0 grid place-items-center font-display text-xl font-extrabold">
          {value}
        </span>
      </div>
      <p className="text-xs font-medium text-ink-muted dark:text-ink-inverse/60">{label}</p>
    </div>
  );
}

export function TripsPage() {
  const { items, remove, clear } = useTrips();
  const [budget, setBudget] = useState(50000);

  const total = useMemo(() => items.reduce((s, i) => s + i.price, 0), [items]);
  const counts = useMemo(
    () => ({
      flight: items.filter((i) => i.kind === "flight").length,
      stay: items.filter((i) => i.kind === "stay").length,
      car: items.filter((i) => i.kind === "car").length,
    }),
    [items],
  );
  const budgetPct = Math.min(1, total / budget);

  return (
    <div className="route-fade container py-8">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="section-label">Trip plan</p>
          <h1 className="mt-1.5 font-display text-3xl font-extrabold tracking-tight">Your trip, so far</h1>
          <p className="mt-1 text-sm text-ink-muted dark:text-ink-inverse/60">
            Saved locally on this device. Add items from any results page.
          </p>
        </div>
        {items.length > 0 && (
          <button
            type="button"
            onClick={clear}
            className="text-sm font-semibold text-rose-500 hover:underline"
          >
            Clear all
          </button>
        )}
      </header>

      {items.length === 0 ? (
        <Reveal>
          <div className="card flex flex-col items-center gap-4 py-20 text-center">
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand dark:bg-brand-700/20">
              <Briefcase size={26} aria-hidden />
            </span>
            <h2 className="font-display text-xl font-bold">Nothing saved yet</h2>
            <p className="max-w-sm text-sm text-ink-muted dark:text-ink-inverse/60">
              Search flights, stays, or cars and tap Add. Everything lands here for easy comparing.
            </p>
            <Link to="/" className="btn-primary rounded-full px-5">
              Start a search
            </Link>
          </div>
        </Reveal>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <div className="space-y-5">
            <Reveal>
              <div className="card p-6">
                <p className="mb-5 font-display text-sm font-bold uppercase tracking-wider text-ink-soft">
                  So far you've added
                </p>
                <div className="flex justify-between">
                  {(Object.keys(KIND_META) as TripItem["kind"][]).map((k) => (
                    <Ring
                      key={k}
                      value={counts[k]}
                      total={Math.max(items.length, 1)}
                      color={KIND_META[k].ring}
                      label={KIND_META[k].label}
                    />
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <div className="card p-6">
                <div className="mb-1 flex items-center justify-between">
                  <p className="flex items-center gap-2 font-display text-sm font-bold uppercase tracking-wider text-ink-soft">
                    <Wallet size={14} aria-hidden />
                    Budget
                  </p>
                  <input
                    type="number"
                    value={budget}
                    min={1000}
                    step={1000}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    aria-label="Trip budget"
                    className="tnum w-28 rounded-lg border border-black/[0.08] bg-transparent px-2 py-1 text-right text-sm font-semibold outline-none dark:border-white/[0.1]"
                  />
                </div>
                <p className={cn("mt-3 text-sm", budgetPct >= 1 ? "text-rose-500" : "text-eco")}>
                  {budgetPct >= 1
                    ? "You're over budget, trim something below."
                    : "Good job, you're keeping it under budget."}
                </p>
                <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-black/[0.06] dark:bg-white/[0.08]">
                  <motion.div
                    className={cn("h-full rounded-full", budgetPct >= 1 ? "bg-rose-500" : "bg-eco")}
                    initial={{ width: 0 }}
                    animate={{ width: `${budgetPct * 100}%` }}
                    transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
                <p className="tnum mt-2 text-xs text-ink-soft">
                  {formatINR(total)} of {formatINR(budget)}
                </p>
              </div>
            </Reveal>

            <Reveal delay={200}>
              <div className="rounded-2xl bg-gradient-to-br from-lime-200 to-emerald-200 p-6 text-eco-dark dark:from-eco-dark dark:to-emerald-900 dark:text-emerald-100">
                <p className="font-display text-sm font-bold uppercase tracking-wider opacity-70">
                  Trip total
                </p>
                <p className="tnum mt-1 font-display text-4xl font-extrabold">
                  <CountUp to={total} prefix="₹" duration={900} />
                </p>
                <p className="mt-1 text-xs opacity-70">
                  {items.length} item{items.length > 1 ? "s" : ""} · prices simulated
                </p>
              </div>
            </Reveal>
          </div>

          <section aria-label="Trip items" className="space-y-3">
            <AnimatePresence initial={false}>
              {items.map((item) => {
                const meta = KIND_META[item.kind];
                return (
                  <motion.article
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -30, transition: { duration: 0.25 } }}
                    className="card card-hover flex items-center gap-4 p-4"
                  >
                    <span className={cn("grid h-11 w-11 shrink-0 place-items-center rounded-xl", meta.tint)}>
                      <meta.icon size={19} aria-hidden />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold">{item.title}</p>
                      <p className="truncate text-sm text-ink-soft">{item.subtitle}</p>
                    </div>
                    {item.meta && (
                      <span className="hidden rounded-full bg-surface-muted px-2.5 py-1 text-[11px] font-medium text-ink-muted dark:bg-surface-dark dark:text-ink-inverse/60 sm:block">
                        {item.meta}
                      </span>
                    )}
                    <p className="tnum shrink-0 font-display text-lg font-extrabold">
                      {formatINR(item.price)}
                    </p>
                    <button
                      type="button"
                      onClick={() => remove(item.id)}
                      aria-label={`Remove ${item.title}`}
                      className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-ink-soft transition-colors hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-500/10"
                    >
                      <Trash2 size={16} aria-hidden />
                    </button>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </section>
        </div>
      )}
    </div>
  );
}
