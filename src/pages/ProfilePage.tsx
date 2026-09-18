import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BellRing,
  Briefcase,
  Cloud,
  Leaf,
  LogOut,
  Moon,
  Sun,
  UserRound,
  Wallet,
} from "lucide-react";
import { AuthModal } from "@/features/auth/AuthModal";
import { Reveal } from "@/components/motion/Reveal";
import { CountUp } from "@/components/motion/CountUp";
import { formatINR } from "@/lib/mockApi";
import { supabaseEnabled } from "@/lib/supabase";
import { useAuth } from "@/stores/auth";
import { useTheme } from "@/stores/theme";
import { useTrips } from "@/stores/trips";
import { useAlerts } from "@/stores/alerts";

export function ProfilePage() {
  const { user, signOut } = useAuth();
  const { dark, toggle } = useTheme();
  const trips = useTrips((s) => s.items);
  const alerts = useAlerts((s) => s.alerts);
  const [authOpen, setAuthOpen] = useState(false);

  const totalPlanned = useMemo(() => trips.reduce((s, i) => s + i.price, 0), [trips]);
  const co2Saved = useMemo(
    () => trips.filter((t) => t.kind === "flight").length * 32,
    [trips],
  );
  const triggered = alerts.filter((a) => a.currentPrice <= a.targetPrice).length;

  if (!user) {
    return (
      <div className="container flex min-h-[60vh] flex-col items-center justify-center gap-4 py-12 text-center">
        <span className="grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-brand-600 text-white shadow-glow">
          <UserRound size={28} aria-hidden />
        </span>
        <h1 className="font-display text-3xl font-extrabold tracking-tight">Your travel profile</h1>
        <p className="max-w-sm text-sm text-ink-muted dark:text-ink-inverse/60">
          Sign in to sync your trip plan and price alerts to the cloud and see your travel stats.
        </p>
        <button type="button" onClick={() => setAuthOpen(true)} className="btn-primary btn-shine rounded-full px-6 py-3">
          Sign in or create account
        </button>
        <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
      </div>
    );
  }

  return (
    <div className="container py-8">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-brand-500 via-indigo-600 to-violet-600 px-8 py-10 text-white">
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" aria-hidden />
          <div className="relative flex flex-wrap items-center gap-5">
            <motion.span
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
              className="grid h-20 w-20 place-items-center rounded-full bg-white/15 font-display text-2xl font-extrabold uppercase backdrop-blur"
            >
              {user.email.slice(0, 2)}
            </motion.span>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-widest text-white/60">Traveler</p>
              <h1 className="truncate font-display text-3xl font-extrabold">{user.email}</h1>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-white/80">
                <Cloud size={14} aria-hidden />
                {supabaseEnabled ? "Synced to the cloud" : "Local profile"}
              </p>
            </div>
            <div className="ml-auto flex gap-2">
              <button
                type="button"
                onClick={toggle}
                className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur transition-colors hover:bg-white/25"
              >
                {dark ? <Sun size={15} aria-hidden /> : <Moon size={15} aria-hidden />}
                {dark ? "Light" : "Dark"} mode
              </button>
              <button
                type="button"
                onClick={() => void signOut()}
                className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur transition-colors hover:bg-rose-500/80"
              >
                <LogOut size={15} aria-hidden />
                Sign out
              </button>
            </div>
          </div>
        </div>
      </Reveal>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { icon: Briefcase, label: "Items in trip plan", value: trips.length, suffix: "" },
          { icon: Wallet, label: "Planned spend", value: totalPlanned, prefix: "₹" },
          { icon: BellRing, label: `Price alerts (${triggered} triggered)`, value: alerts.length, suffix: "" },
          { icon: Leaf, label: "Est. CO2 saved (kg)", value: co2Saved, suffix: "" },
        ].map((s, i) => (
          <Reveal key={s.label} delay={i * 80}>
            <div className="card card-hover p-5">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand dark:bg-brand-700/20">
                <s.icon size={18} aria-hidden />
              </span>
              <p className="text-gradient mt-3 font-display text-3xl font-extrabold">
                <CountUp to={s.value} prefix={s.prefix ?? ""} suffix={s.suffix ?? ""} duration={900} />
              </p>
              <p className="mt-1 text-xs text-ink-muted dark:text-ink-inverse/60">{s.label}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Reveal delay={100}>
          <Link to="/trips" className="card card-hover flex items-center justify-between p-6">
            <div>
              <p className="font-display text-lg font-bold">Trip plan</p>
              <p className="text-sm text-ink-soft">
                {trips.length ? `${trips.length} saved item${trips.length > 1 ? "s" : ""} worth ${formatINR(totalPlanned)}` : "Nothing saved yet, start a search"}
              </p>
            </div>
            <Briefcase size={22} className="text-brand" aria-hidden />
          </Link>
        </Reveal>
        <Reveal delay={180}>
          <Link to="/alerts" className="card card-hover flex items-center justify-between p-6">
            <div>
              <p className="font-display text-lg font-bold">Price alerts</p>
              <p className="text-sm text-ink-soft">
                {alerts.length ? `${alerts.length} active, ${triggered} below target` : "Track a route to get started"}
              </p>
            </div>
            <BellRing size={22} className="text-amber-500" aria-hidden />
          </Link>
        </Reveal>
      </div>
    </div>
  );
}
