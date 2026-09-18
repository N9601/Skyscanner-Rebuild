import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeftRight, Calendar, Search, Users } from "lucide-react";
import { AirportField } from "./AirportField";
import { TripTypeTabs, type TripType } from "./TripTypeTabs";
import { cn } from "@/lib/cn";

type Cabin = "economy" | "premium" | "business" | "first";

function isoPlus(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function SearchWidget({ compact }: { compact?: boolean }) {
  const [tripType, setTripType] = useState<TripType>("flights");
  const [origin, setOrigin] = useState("Bengaluru (BLR)");
  const [destination, setDestination] = useState("");
  const [depart, setDepart] = useState(isoPlus(7));
  const [ret, setRet] = useState(isoPlus(12));
  const [travelers, setTravelers] = useState(1);
  const [cabin, setCabin] = useState<Cabin>("economy");
  const navigate = useNavigate();

  function swap() {
    setOrigin(destination);
    setDestination(origin);
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    if (tripType === "flights" && !destination.trim()) {
      navigate(`/explore?from=${encodeURIComponent(origin)}`);
      return;
    }
    if (tripType === "flights") {
      const params = new URLSearchParams({
        from: origin,
        to: destination,
        depart,
        return: ret,
        pax: String(travelers),
        cabin,
      });
      navigate(`/flights?${params.toString()}`);
    } else {
      const params = new URLSearchParams({
        city: destination,
        from: depart,
        to: ret,
        pax: String(travelers),
      });
      navigate(`/${tripType}?${params.toString()}`);
    }
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.21, 0.61, 0.35, 1], delay: 0.15 }}
      onSubmit={submit}
      aria-label="Search"
      data-tour="search"
      className="relative z-30 w-full"
    >
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <TripTypeTabs value={tripType} onChange={setTripType} />
        <div className="flex items-center gap-2 text-sm">
          <label className="flex items-center gap-1.5 rounded-full border border-black/[0.07] bg-white px-3 py-1.5 dark:border-white/[0.1] dark:bg-surface-dark-muted">
            <Users size={14} aria-hidden className="text-ink-soft" />
            <input
              type="number"
              min={1}
              max={9}
              value={travelers}
              onChange={(e) => setTravelers(Number(e.target.value))}
              className="w-8 bg-transparent text-center font-medium outline-none"
              aria-label="Travelers"
            />
          </label>
          {tripType === "flights" && (
            <select
              value={cabin}
              onChange={(e) => setCabin(e.target.value as Cabin)}
              className="rounded-full border border-black/[0.07] bg-white px-3 py-1.5 font-medium outline-none dark:border-white/[0.1] dark:bg-surface-dark-muted"
              aria-label="Cabin class"
            >
              <option value="economy">Economy</option>
              <option value="premium">Premium</option>
              <option value="business">Business</option>
              <option value="first">First</option>
            </select>
          )}
        </div>
      </div>

      <div
        className={cn(
          "grid items-stretch overflow-visible rounded-2xl border border-black/[0.06] bg-white/90 shadow-lifted backdrop-blur dark:border-white/[0.09] dark:bg-surface-dark-muted/90",
          "grid-cols-1 divide-y divide-black/[0.06] dark:divide-white/[0.07]",
          tripType === "flights"
            ? "md:grid-cols-[1.25fr_auto_1.25fr_1fr_1fr_auto] md:divide-x md:divide-y-0"
            : "md:grid-cols-[1.6fr_1fr_1fr_auto] md:divide-x md:divide-y-0",
          compact && "shadow-card",
        )}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {tripType === "flights" && (
            <motion.div
              key="origin"
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="min-w-0"
            >
              <AirportField bare label="From" value={origin} onChange={setOrigin} required />
            </motion.div>
          )}
          {tripType === "flights" && (
            <motion.div
              key="swap"
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="hidden items-center px-1 md:flex"
            >
              <button
                type="button"
                onClick={swap}
                aria-label="Swap origin and destination"
                className="grid h-9 w-9 place-items-center rounded-full border border-black/[0.08] bg-white text-ink-muted transition-transform hover:rotate-180 hover:text-brand dark:border-white/[0.12] dark:bg-surface-dark dark:text-ink-inverse/70"
                style={{ transitionDuration: "350ms" }}
              >
                <ArrowLeftRight size={15} aria-hidden />
              </button>
            </motion.div>
          )}

          <motion.div
            key="dest"
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-w-0"
          >
            <AirportField
              bare
              label={tripType === "flights" ? "To" : tripType === "stays" ? "Where to?" : "Pick-up city"}
              value={destination}
              onChange={setDestination}
              placeholder={tripType === "flights" ? "Anywhere" : "City"}
              required={tripType !== "flights"}
            />
          </motion.div>

          <motion.div key="depart" layout className="min-w-0">
            <DateCell
              label={tripType === "stays" ? "Check-in" : tripType === "cars" ? "From" : "Depart"}
              value={depart}
              onChange={setDepart}
              required
            />
          </motion.div>

          <motion.div key="return" layout className="min-w-0">
            <DateCell
              label={tripType === "stays" ? "Check-out" : tripType === "cars" ? "Until" : "Return"}
              value={ret}
              onChange={setRet}
            />
          </motion.div>

          <motion.div key="go" layout className="flex items-center justify-end p-2.5 md:justify-center">
            <button
              type="submit"
              aria-label="Search"
              className="grid h-12 w-full place-items-center rounded-xl bg-ink text-white shadow-lg transition-all hover:scale-[1.03] hover:shadow-xl active:scale-95 dark:bg-white dark:text-ink md:h-12 md:w-12 md:rounded-full"
            >
              <Search size={18} aria-hidden />
            </button>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.form>
  );
}

function DateCell({
  label,
  value,
  onChange,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <label className="flex h-full flex-col justify-center gap-1 px-5 py-3.5">
      <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-ink-soft">
        <Calendar size={13} aria-hidden />
        {label}
      </span>
      <input
        type="date"
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent text-sm font-medium outline-none"
      />
    </label>
  );
}
