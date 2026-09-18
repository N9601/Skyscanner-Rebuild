import { useEffect, useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, BadgeCheck, ExternalLink, Loader2, ShieldCheck } from "lucide-react";
import type { FlightOffer } from "@/types";
import { formatDuration, formatINR } from "@/lib/mockApi";
import { findAirport } from "@/data/airports";

type Stage = "connecting" | "review" | "handoff";

const AIRLINE_SITES: Record<string, string> = {
  "6E": "https://www.goindigo.in",
  AI: "https://www.airindia.com",
  UK: "https://www.airvistara.com",
  SG: "https://www.spicejet.com",
  QP: "https://www.akasaair.com",
  IX: "https://www.airindiaexpress.com",
  EK: "https://www.emirates.com",
  QR: "https://www.qatarairways.com",
  EY: "https://www.etihad.com",
  SQ: "https://www.singaporeair.com",
  TG: "https://www.thaiairways.com",
  MH: "https://www.malaysiaairlines.com",
  CX: "https://www.cathaypacific.com",
  BA: "https://www.britishairways.com",
  LH: "https://www.lufthansa.com",
  AF: "https://www.airfrance.com",
  KL: "https://www.klm.com",
  TK: "https://www.turkishairlines.com",
  UA: "https://www.united.com",
  QF: "https://www.qantas.com",
  UL: "https://www.srilankan.com",
};

export function BookPage() {
  const { state } = useLocation() as { state: { offer?: FlightOffer; pax?: number } | null };
  const offer = state?.offer;
  const pax = state?.pax ?? 1;
  const [stage, setStage] = useState<Stage>("connecting");

  useEffect(() => {
    if (!offer) return;
    const t = setTimeout(() => setStage("review"), 600);
    return () => clearTimeout(t);
  }, [offer]);

  if (!offer) return <Navigate to="/flights" replace />;

  const base = Math.round(offer.price * 0.74);
  const taxes = Math.round(offer.price * 0.18);
  const fees = offer.price - base - taxes;
  const ref = `AKV-${offer.id.replace(/\D/g, "").padEnd(4, "7").slice(0, 4)}${offer.airlineCode}`;

  return (
    <div className="container flex min-h-[70vh] items-center justify-center py-10">
      <div className="w-full max-w-lg">
        <AnimatePresence mode="wait">
          {stage === "connecting" && (
            <motion.div
              key="connecting"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              className="card flex flex-col items-center gap-4 py-16 text-center"
            >
              <Loader2 size={34} className="animate-spin text-brand" aria-hidden />
              <p className="font-display text-xl font-bold">Contacting {offer.airline}</p>
              <p className="text-sm text-ink-soft">Locking your simulated fare</p>
            </motion.div>
          )}

          {stage === "review" && (
            <motion.div
              key="review"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              className="card overflow-hidden p-0"
            >
              <div className="bg-gradient-to-r from-brand-500 to-indigo-600 px-6 py-5 text-white">
                <p className="text-xs font-semibold uppercase tracking-widest text-white/70">
                  Review your trip
                </p>
                <p className="mt-1 font-display text-2xl font-extrabold">
                  {findAirport(offer.from)?.city} → {findAirport(offer.to)?.city}
                </p>
                <p className="mt-0.5 text-sm text-white/80">
                  {offer.airline} {offer.flightNo} · {offer.departTime} to {offer.arriveTime} ·{" "}
                  {formatDuration(offer.durationMin)}
                </p>
              </div>
              <div className="space-y-4 px-6 py-5">
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-ink-muted dark:text-ink-inverse/70">
                      Base fare × {pax} traveler{pax > 1 ? "s" : ""}
                    </dt>
                    <dd className="tnum font-medium">{formatINR(base)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-ink-muted dark:text-ink-inverse/70">Taxes and surcharges</dt>
                    <dd className="tnum font-medium">{formatINR(taxes)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-ink-muted dark:text-ink-inverse/70">Booking fees</dt>
                    <dd className="tnum font-medium">{formatINR(fees)}</dd>
                  </div>
                  <div className="flex justify-between border-t border-black/[0.06] pt-2 dark:border-white/[0.08]">
                    <dt className="font-semibold">Total</dt>
                    <dd className="tnum font-display text-xl font-extrabold">
                      {formatINR(offer.price)}
                    </dd>
                  </div>
                </dl>
                <p className="flex items-center gap-2 rounded-xl bg-eco-soft px-3.5 py-2.5 text-xs font-medium text-eco dark:bg-eco-dark/30 dark:text-emerald-300">
                  <ShieldCheck size={14} aria-hidden />
                  Demo checkout. No payment, no real ticket, nothing leaves this device.
                </p>
                <button
                  type="button"
                  onClick={() => setStage("handoff")}
                  className="btn-primary btn-shine w-full rounded-xl py-3 text-base"
                >
                  Continue to {offer.airline}
                  <ArrowRight size={16} aria-hidden />
                </button>
              </div>
            </motion.div>
          )}

          {stage === "handoff" && (
            <motion.div
              key="handoff"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card flex flex-col items-center gap-4 py-14 text-center"
            >
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.1 }}
                className="grid h-16 w-16 place-items-center rounded-full bg-eco-soft text-eco dark:bg-eco-dark/40"
              >
                <BadgeCheck size={32} aria-hidden />
              </motion.span>
              <div>
                <p className="font-display text-2xl font-extrabold">Handed off to {offer.airline}</p>
                <p className="mt-1 text-sm text-ink-muted dark:text-ink-inverse/60">
                  In a real booking you'd finish payment on the provider's site.
                </p>
              </div>
              <p className="tnum rounded-xl bg-surface-muted px-4 py-2 text-sm font-bold tracking-wider dark:bg-surface-dark">
                Reference {ref}
              </p>
              <div className="flex gap-2">
                <Link to="/trips" className="btn-primary btn-shine rounded-full px-5">
                  View trip plan
                </Link>
                <a
                  href={AIRLINE_SITES[offer.airlineCode] ?? "https://www.google.com/travel/flights"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost rounded-full border border-black/[0.08] px-5 dark:border-white/[0.1]"
                >
                  Open {offer.airline}
                  <ExternalLink size={14} aria-hidden />
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
