import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BellRing,
  Leaf,
  Map,
  Plane,
  ShieldCheck,
  Sparkles,
  Ticket,
  TrendingDown,
} from "lucide-react";
import { SearchWidget } from "@/features/search/SearchWidget";
import { DestinationCarousel } from "@/features/destinations/DestinationCarousel";
import { Reveal } from "@/components/motion/Reveal";
import { TiltCard } from "@/components/motion/TiltCard";
import { CountUp } from "@/components/motion/CountUp";

const TICKER = [
  { route: "BLR → DXB", price: "₹12,480", drop: true },
  { route: "DEL → LHR", price: "₹42,310", drop: false },
  { route: "BOM → SIN", price: "₹18,940", drop: true },
  { route: "MAA → CMB", price: "₹9,120", drop: true },
  { route: "HYD → BKK", price: "₹14,650", drop: false },
  { route: "DEL → JFK", price: "₹58,220", drop: true },
  { route: "BLR → GOI", price: "₹3,499", drop: true },
  { route: "CCU → KTM", price: "₹8,730", drop: false },
  { route: "BOM → MLE", price: "₹16,080", drop: true },
  { route: "DEL → CDG", price: "₹39,540", drop: false },
];

const FEATURES = [
  {
    icon: TrendingDown,
    title: "One search, every provider",
    body: "Flights, stays, and cars compared side by side, so the best price finds you first.",
    tint: "bg-brand-50 text-brand dark:bg-brand-700/20",
  },
  {
    icon: Leaf,
    title: "Greener Choice",
    body: "A single toggle surfaces the lowest-emission itineraries with real CO2 estimates.",
    tint: "bg-eco-soft text-eco dark:bg-eco-dark/40",
  },
  {
    icon: Sparkles,
    title: "AI trip assistant",
    body: "Describe the trip in plain language. Get routes, plans, and price context back.",
    tint: "bg-violet-100 text-violet-600 dark:bg-violet-500/15",
  },
  {
    icon: BellRing,
    title: "Price alerts",
    body: "Track a route, set your number, and get pinged the moment fares dip below it.",
    tint: "bg-amber-100 text-amber-600 dark:bg-amber-500/15",
  },
];

export function HomePage() {
  return (
    <div>
      <section className="container pt-6 md:pt-10">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-brand-50 via-sky-50 to-indigo-50 px-6 pb-28 pt-14 dark:from-brand-900/40 dark:via-surface-dark-muted dark:to-indigo-950/40 md:px-14 md:pb-32 md:pt-20">
          <div className="absolute inset-0 bg-hero-grid bg-[size:44px_44px] opacity-60 dark:opacity-20" aria-hidden />
          <div
            className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-gradient-to-br from-brand-300/40 to-indigo-300/30 blur-3xl dark:from-brand-500/20 dark:to-indigo-500/10"
            aria-hidden
          />

          <div className="relative grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <Reveal>
                <p className="section-label mb-5 inline-flex items-center gap-2 rounded-full border border-brand/15 bg-white/70 px-3 py-1 backdrop-blur dark:bg-white/10">
                  <Plane size={13} aria-hidden />
                  Meta-search for modern travel
                </p>
              </Reveal>
              <h1 className="font-display text-5xl font-extrabold leading-[1.04] tracking-tight text-ink dark:text-ink-inverse md:text-6xl">
                <span className="line-mask">
                  <span className="line-rise">Let's plan your</span>
                </span>
                <span className="line-mask">
                  <span className="line-rise" style={{ animationDelay: "0.12s" }}>
                    perfect <span className="text-brand">journey</span>
                    <svg
                      className="ml-3 inline-block h-8 w-14 text-ink dark:text-ink-inverse"
                      viewBox="0 0 60 32"
                      fill="none"
                      aria-hidden
                    >
                      <path
                        d="M4 22c14 6 30 4 40-6m0 0l-8 1m8-1l-2 8"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </span>
              </h1>
              <Reveal delay={250}>
                <p className="mt-5 max-w-lg text-lg leading-relaxed text-ink-muted dark:text-ink-inverse/70">
                  Compare flights, stays, and cars across hundreds of providers, keep a trip plan,
                  and pick the greener option, all from one clean search.
                </p>
              </Reveal>
              <Reveal delay={350}>
                <div className="mt-7 flex flex-wrap items-center gap-4">
                  <Link
                    to="/flights?from=Bengaluru+(BLR)&to=Goa+(GOI)&pax=1&cabin=economy"
                    className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:scale-[1.03] hover:shadow-xl active:scale-95 dark:bg-white dark:text-ink"
                  >
                    Discover now
                    <ArrowRight size={16} aria-hidden />
                  </Link>
                  <span className="flex items-center gap-2 text-sm text-ink-muted dark:text-ink-inverse/60">
                    <span className="flex -space-x-1.5" aria-hidden>
                      {["bg-rose-400", "bg-amber-400", "bg-emerald-400", "bg-sky-400"].map((c) => (
                        <span key={c} className={`h-6 w-6 rounded-full border-2 border-white dark:border-surface-dark ${c}`} />
                      ))}
                    </span>
                    Loved by 15K+ travelers
                  </span>
                </div>
              </Reveal>
            </div>

            <div className="relative hidden h-[340px] lg:block" aria-hidden>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="animate-float-slow absolute left-[30%] top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-sky-400 via-brand-500 to-indigo-600 shadow-glow"
              >
                <div className="absolute inset-0 overflow-hidden rounded-full">
                  <div className="absolute left-6 top-10 h-16 w-24 rounded-[40%] bg-emerald-400/90 blur-[1px]" />
                  <div className="absolute bottom-8 right-4 h-20 w-28 rounded-[45%] bg-emerald-500/80 blur-[1px]" />
                  <div className="absolute left-10 top-6 h-10 w-10 rounded-full bg-white/30 blur-md" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -30, rotate: -8 }}
                animate={{ opacity: 1, x: 0, rotate: -8 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="animate-float absolute left-4 top-8 rounded-2xl bg-white/90 p-3.5 shadow-lifted backdrop-blur dark:bg-surface-dark-muted/90"
                style={{ "--float-rot": "-8deg" } as React.CSSProperties}
              >
                <Plane size={26} className="text-brand" aria-hidden />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30, rotate: 6 }}
                animate={{ opacity: 1, x: 0, rotate: 6 }}
                transition={{ duration: 0.6, delay: 0.65 }}
                className="animate-float absolute bottom-10 right-2 w-44 rounded-2xl bg-white/90 p-3.5 shadow-lifted backdrop-blur dark:bg-surface-dark-muted/90"
                style={{ "--float-rot": "6deg", animationDelay: "1.2s" } as React.CSSProperties}
              >
                <div className="flex items-center gap-2">
                  <Ticket size={16} className="text-rose-500" aria-hidden />
                  <span className="text-xs font-semibold text-ink dark:text-ink-inverse">BLR → GOI</span>
                </div>
                <div className="mt-2 space-y-1.5">
                  <div className="h-1.5 w-full rounded-full bg-rose-200/70 dark:bg-rose-500/30" />
                  <div className="h-1.5 w-2/3 rounded-full bg-rose-200/70 dark:bg-rose-500/30" />
                </div>
                <p className="tnum mt-2 text-sm font-bold text-ink dark:text-ink-inverse">₹3,499</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="animate-float-slow absolute right-10 top-2 rounded-2xl bg-white/90 px-4 py-2.5 shadow-lifted backdrop-blur dark:bg-surface-dark-muted/90"
                style={{ animationDelay: "0.8s" }}
              >
                <p className="flex items-center gap-1.5 text-xs font-semibold text-eco">
                  <Leaf size={13} aria-hidden />
                  -32% CO2 on this route
                </p>
              </motion.div>
            </div>
          </div>
        </div>

        <div className="relative z-10 -mt-16 px-2 md:px-10">
          <SearchWidget />
        </div>
      </section>

      <section className="ticker-mask mt-14 overflow-hidden border-y border-black/[0.05] py-3.5 dark:border-white/[0.07]" aria-label="Live fare movements">
        <div className="ticker-track flex items-center gap-8">
          {[...TICKER, ...TICKER].map((t, i) => (
            <span key={i} className="flex shrink-0 items-center gap-2.5 text-sm">
              <span className="font-semibold tracking-wide text-ink dark:text-ink-inverse">{t.route}</span>
              <span className={`tnum font-medium ${t.drop ? "text-eco" : "text-ink-soft"}`}>
                {t.price} {t.drop ? "↓" : ""}
              </span>
            </span>
          ))}
        </div>
      </section>

      <section className="container py-16">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {[
            { to: 500, suffix: "+", label: "Airlines and providers" },
            { to: 15, suffix: "K+", label: "Routes tracked daily" },
            { to: 48, prefix: "", suffix: "%", label: "Avg saving vs walk-up fares" },
            { to: 32, suffix: "%", label: "CO2 cut with Greener Choice" },
          ].map((s, i) => (
            <Reveal key={s.label} delay={i * 90}>
              <div className="text-center md:text-left">
                <p className="font-display text-4xl font-extrabold text-ink dark:text-ink-inverse md:text-5xl">
                  <CountUp to={s.to} prefix={s.prefix ?? ""} suffix={s.suffix} />
                </p>
                <p className="mt-1.5 text-sm text-ink-muted dark:text-ink-inverse/60">{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <DestinationCarousel />

      <section className="container pb-4 pt-2">
        <Reveal>
          <p className="section-label">Why Akashavani</p>
          <h2 className="mt-2 max-w-xl font-display text-3xl font-extrabold tracking-tight md:text-4xl">
            Everything a trip needs, in one place
          </h2>
        </Reveal>
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i * 90}>
              <TiltCard className="h-full">
                <div className="card card-hover h-full p-6">
                  <span className={`grid h-11 w-11 place-items-center rounded-xl ${f.tint}`}>
                    <f.icon size={20} aria-hidden />
                  </span>
                  <h3 className="mt-4 font-display text-lg font-bold">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted dark:text-ink-inverse/70">
                    {f.body}
                  </p>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container py-16">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-eco-dark via-emerald-800 to-teal-900 px-8 py-12 text-white md:px-14">
            <div
              className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-emerald-400/20 blur-3xl"
              aria-hidden
            />
            <div className="relative flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
              <div className="max-w-xl">
                <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-emerald-300">
                  <Leaf size={15} aria-hidden />
                  Greener Choice
                </p>
                <h2 className="mt-3 font-display text-3xl font-extrabold md:text-4xl">
                  Fly lighter on the planet
                </h2>
                <p className="mt-3 leading-relaxed text-emerald-100/90">
                  Every result carries a CO2 estimate. Flip the toggle and we rank the cleanest
                  itineraries first, often within a few hundred rupees of the cheapest fare.
                </p>
              </div>
              <div className="flex shrink-0 flex-col items-start gap-3">
                <div className="flex items-center gap-6 rounded-2xl bg-white/10 px-6 py-4 backdrop-blur">
                  <div>
                    <p className="tnum font-display text-3xl font-extrabold text-emerald-300">
                      <CountUp to={128} suffix=" kg" />
                    </p>
                    <p className="text-xs text-emerald-100/80">avg CO2 saved per trip</p>
                  </div>
                  <ShieldCheck size={34} className="text-emerald-300" aria-hidden />
                </div>
                <Link
                  to="/flights?from=New+Delhi+(DEL)&to=Mumbai+(BOM)&pax=1&cabin=economy"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-eco-dark transition-transform hover:scale-105"
                >
                  Try a greener search
                  <ArrowRight size={15} aria-hidden />
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="container pb-20">
        <Reveal>
          <div className="flex flex-col items-center gap-5 rounded-[2rem] border border-black/[0.06] bg-surface-muted/60 px-8 py-14 text-center dark:border-white/[0.08] dark:bg-surface-dark-muted/50">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-violet-500 to-brand text-white shadow-glow">
              <Map size={22} aria-hidden />
            </span>
            <h2 className="max-w-lg font-display text-3xl font-extrabold tracking-tight">
              Not sure where to go? Ask the assistant.
            </h2>
            <p className="max-w-md text-ink-muted dark:text-ink-inverse/70">
              Tell it a budget, a vibe, or a long weekend. It answers with real routes and one-tap
              searches.
            </p>
            <Link to="/assistant" className="btn-primary rounded-full px-6 py-3">
              <Sparkles size={16} aria-hidden />
              Open the assistant
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
