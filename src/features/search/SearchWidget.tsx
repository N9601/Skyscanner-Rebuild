import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ArrowLeftRight, MapPin, Calendar, Users } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { TripTypeTabs, type TripType } from "./TripTypeTabs";

type Cabin = "economy" | "premium" | "business" | "first";

export function SearchWidget() {
  const [tripType, setTripType] = useState<TripType>("flights");
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [depart, setDepart] = useState("");
  const [ret, setRet] = useState("");
  const [travelers, setTravelers] = useState(1);
  const [cabin, setCabin] = useState<Cabin>("economy");
  const navigate = useNavigate();

  function swap() {
    setOrigin(destination);
    setDestination(origin);
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams({
      from: origin,
      to: destination,
      depart,
      return: ret,
      pax: String(travelers),
      cabin,
    });
    navigate(`/${tripType}?${params.toString()}`);
  }

  return (
    <form
      onSubmit={submit}
      className="card space-y-4 border border-black/5 p-5 dark:border-white/10 md:p-6"
      aria-label="Search"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <TripTypeTabs value={tripType} onChange={setTripType} />
        <div className="flex items-center gap-3 text-sm text-ink-muted dark:text-ink-inverse/70">
          <label className="flex items-center gap-2">
            <Users size={16} aria-hidden />
            <input
              type="number"
              min={1}
              max={9}
              value={travelers}
              onChange={(e) => setTravelers(Number(e.target.value))}
              className="w-14 rounded-md border border-black/10 bg-white px-2 py-1 dark:border-white/10 dark:bg-surface-dark-muted"
              aria-label="Travelers"
            />
          </label>
          {tripType === "flights" && (
            <select
              value={cabin}
              onChange={(e) => setCabin(e.target.value as Cabin)}
              className="rounded-md border border-black/10 bg-white px-2 py-1 dark:border-white/10 dark:bg-surface-dark-muted"
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

      <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto_1fr_1fr_1fr_auto]">
        <Field label="From" icon={<MapPin size={16} aria-hidden />}>
          <input
            required
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            placeholder="City or airport"
            className="w-full bg-transparent text-sm outline-none placeholder:text-ink-muted/60"
          />
        </Field>

        <button
          type="button"
          onClick={swap}
          aria-label="Swap origin and destination"
          className="hidden self-end rounded-full border border-black/10 p-2 hover:bg-surface-muted dark:border-white/10 dark:hover:bg-surface-dark-muted md:inline-flex"
        >
          <ArrowLeftRight size={16} aria-hidden />
        </button>

        <Field label="To" icon={<MapPin size={16} aria-hidden />}>
          <input
            required
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="City or airport"
            className="w-full bg-transparent text-sm outline-none placeholder:text-ink-muted/60"
          />
        </Field>

        <Field label="Depart" icon={<Calendar size={16} aria-hidden />}>
          <input
            required
            type="date"
            value={depart}
            onChange={(e) => setDepart(e.target.value)}
            className="w-full bg-transparent text-sm outline-none"
          />
        </Field>

        <Field label="Return" icon={<Calendar size={16} aria-hidden />}>
          <input
            type="date"
            value={ret}
            onChange={(e) => setRet(e.target.value)}
            className="w-full bg-transparent text-sm outline-none"
          />
        </Field>

        <Button type="submit" size="lg" className="md:h-full">
          <span>Search</span>
          <ArrowRight size={16} aria-hidden />
        </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  icon,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1 rounded-xl border border-black/10 bg-white px-3 py-2 dark:border-white/10 dark:bg-surface-dark-muted">
      <span className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-ink-muted dark:text-ink-inverse/60">
        {icon}
        {label}
      </span>
      {children}
    </label>
  );
}
