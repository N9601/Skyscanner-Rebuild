import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { DESTINATIONS } from "./data";
import { formatINR } from "@/lib/mockApi";
import { cn } from "@/lib/cn";

export function DestinationCarousel() {
  const [active, setActive] = useState(1);
  const n = DESTINATIONS.length;
  const prev = () => setActive((a) => (a - 1 + n) % n);
  const next = () => setActive((a) => (a + 1) % n);
  const current = DESTINATIONS[active];

  return (
    <section className="container py-16 md:py-20">
      <div className="relative overflow-hidden rounded-[2rem] bg-[#0C0F17] px-6 py-14 text-white md:px-12 md:py-16">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(60% 50% at 50% 0%, rgba(7,112,227,0.25), transparent), radial-gradient(40% 40% at 85% 90%, rgba(245,158,11,0.12), transparent)",
          }}
          aria-hidden
        />

        <div className="relative mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="section-label text-amberglow">Get inspired</p>
            <h2 className="mt-2 font-display text-3xl font-extrabold uppercase tracking-wide md:text-4xl">
              Trending escapes
            </h2>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={prev}
              aria-label="Previous destination"
              className="grid h-11 w-11 place-items-center rounded-full border border-white/15 text-white/80 transition-colors hover:bg-white/10"
            >
              <ChevronLeft size={18} aria-hidden />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next destination"
              className="grid h-11 w-11 place-items-center rounded-full border border-white/15 text-white/80 transition-colors hover:bg-white/10"
            >
              <ChevronRight size={18} aria-hidden />
            </button>
          </div>
        </div>

        <div className="relative h-[380px] md:h-[420px]" style={{ perspective: 1200 }}>
          {DESTINATIONS.map((d, i) => {
            let offset = i - active;
            if (offset > n / 2) offset -= n;
            if (offset < -n / 2) offset += n;
            const abs = Math.abs(offset);
            if (abs > 2) return null;
            return (
              <motion.button
                key={d.id}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Show ${d.city}`}
                animate={{
                  x: `calc(-50% + ${offset * 46}%)`,
                  rotateY: offset * -18,
                  scale: offset === 0 ? 1 : 0.82 - abs * 0.04,
                  opacity: abs === 2 ? 0.45 : 1,
                  zIndex: 10 - abs,
                }}
                transition={{ type: "spring", stiffness: 260, damping: 30 }}
                className={cn(
                  "absolute left-1/2 top-0 h-full w-[240px] overflow-hidden rounded-2xl bg-gradient-to-br md:w-[280px]",
                  d.gradient,
                  offset !== 0 && "cursor-pointer",
                )}
                style={{ transformStyle: "preserve-3d" }}
              >
                <span className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/20" aria-hidden />
                {d.tag && (
                  <span className="absolute right-3 top-3 rounded-full bg-white/20 px-2.5 py-1 text-[11px] font-semibold backdrop-blur">
                    #{d.tag}
                  </span>
                )}
                <span className="absolute bottom-4 left-4 right-4 text-left">
                  <span className="block text-xs font-medium uppercase tracking-widest text-white/70">
                    {d.country}
                  </span>
                  <span className="block font-display text-2xl font-extrabold uppercase leading-tight">
                    {d.city}
                  </span>
                </span>
              </motion.button>
            );
          })}

          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-center">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="pointer-events-auto flex flex-wrap items-center gap-x-5 gap-y-2 rounded-2xl bg-white/10 px-5 py-3 backdrop-blur-md"
            >
              <span className="flex items-center gap-1.5 text-sm text-white/85">
                <MapPin size={14} aria-hidden />
                {current.tagline}
              </span>
              <span className="text-sm font-semibold">
                from {formatINR(current.from)}
              </span>
              <Link
                to={`/flights?from=Bengaluru+(BLR)&to=${encodeURIComponent(`${current.city} (${current.iata})`)}&pax=1&cabin=economy`}
                className="inline-flex items-center gap-1.5 rounded-full bg-amberglow px-4 py-1.5 text-sm font-semibold text-black transition-transform hover:scale-105"
              >
                Explore <ArrowRight size={14} aria-hidden />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
