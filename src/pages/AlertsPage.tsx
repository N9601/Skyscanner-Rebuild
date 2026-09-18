import { FormEvent, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown, BellRing, Plus, Trash2 } from "lucide-react";
import { formatINR } from "@/lib/mockApi";
import { useAlerts } from "@/stores/alerts";
import { AirportField } from "@/features/search/AirportField";
import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/cn";

export function AlertsPage() {
  const { alerts, add, remove } = useAlerts();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [target, setTarget] = useState("");

  function createAlert(e: FormEvent) {
    e.preventDefault();
    const t = Number(target);
    if (!from || !to || !t) return;
    add({
      route: `${from} → ${to}`,
      from,
      to,
      targetPrice: t,
      currentPrice: Math.round(t * (1.05 + Math.random() * 0.25)),
    });
    setFrom("");
    setTo("");
    setTarget("");
  }

  return (
    <div className="container py-8">
      <header className="mb-8">
        <p className="section-label">Price alerts</p>
        <h1 className="mt-1.5 font-display text-3xl font-extrabold tracking-tight">
          Watch fares while you sleep
        </h1>
        <p className="mt-1 text-sm text-ink-muted dark:text-ink-inverse/60">
          Set a target and we flag the route the moment the simulated fare dips below it.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <Reveal>
          <form onSubmit={createAlert} className="card h-fit space-y-4 p-6 lg:sticky lg:top-24">
            <p className="font-display text-sm font-bold uppercase tracking-wider text-ink-soft">
              New alert
            </p>
            <AirportField label="From" value={from} onChange={setFrom} required />
            <AirportField label="To" value={to} onChange={setTo} required />
            <label className="input-shell">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-soft">
                Alert me below
              </span>
              <input
                type="number"
                min={500}
                required
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                placeholder="e.g. 8000"
                className="tnum w-full bg-transparent text-sm font-medium outline-none placeholder:font-normal placeholder:text-ink-soft/70"
              />
            </label>
            <button type="submit" className="btn-primary w-full rounded-xl py-2.5">
              <Plus size={15} aria-hidden />
              Create alert
            </button>
          </form>
        </Reveal>

        <section aria-label="Active alerts" className="space-y-3">
          {alerts.length === 0 && (
            <Reveal delay={100}>
              <div className="card flex flex-col items-center gap-3 py-16 text-center">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-100 text-amber-500 dark:bg-amber-500/15">
                  <BellRing size={22} aria-hidden />
                </span>
                <p className="font-display text-lg font-bold">No alerts yet</p>
                <p className="max-w-sm text-sm text-ink-muted dark:text-ink-inverse/60">
                  Create one here, or tap the bell on any flight result to track that route.
                </p>
              </div>
            </Reveal>
          )}

          <AnimatePresence initial={false}>
            {alerts.map((a) => {
              const triggered = a.currentPrice <= a.targetPrice;
              const diff = Math.round(((a.currentPrice - a.targetPrice) / a.targetPrice) * 100);
              return (
                <motion.article
                  key={a.id}
                  layout
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -30, transition: { duration: 0.25 } }}
                  className="card card-hover flex flex-wrap items-center gap-4 p-5"
                >
                  <span
                    className={cn(
                      "grid h-11 w-11 shrink-0 place-items-center rounded-xl",
                      triggered
                        ? "bg-eco-soft text-eco dark:bg-eco-dark/40"
                        : "bg-amber-100 text-amber-500 dark:bg-amber-500/15",
                    )}
                  >
                    <BellRing size={19} aria-hidden />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-display text-lg font-bold">{a.route}</p>
                    <p className="text-xs text-ink-soft">
                      created {new Date(a.createdAt).toLocaleDateString("en-IN")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] uppercase tracking-wider text-ink-soft">Target</p>
                    <p className="tnum font-semibold">{formatINR(a.targetPrice)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] uppercase tracking-wider text-ink-soft">Now</p>
                    <p className={cn("tnum font-semibold", triggered ? "text-eco" : "")}>
                      {formatINR(a.currentPrice)}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold",
                      triggered
                        ? "bg-eco-soft text-eco dark:bg-eco-dark/40 dark:text-emerald-300"
                        : "bg-surface-muted text-ink-muted dark:bg-surface-dark dark:text-ink-inverse/60",
                    )}
                  >
                    {triggered ? (
                      <>
                        <ArrowDown size={12} aria-hidden /> Below target
                      </>
                    ) : (
                      `${diff}% above`
                    )}
                  </span>
                  <button
                    type="button"
                    onClick={() => remove(a.id)}
                    aria-label={`Delete alert for ${a.route}`}
                    className="grid h-9 w-9 place-items-center rounded-lg text-ink-soft transition-colors hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-500/10"
                  >
                    <Trash2 size={16} aria-hidden />
                  </button>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </section>
      </div>
    </div>
  );
}
