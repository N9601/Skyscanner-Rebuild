import { Link, NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Moon, Sparkles, Sun } from "lucide-react";
import { Logo } from "@/components/Logo";
import { cn } from "@/lib/cn";
import { springy } from "@/lib/motion";
import { useTheme } from "@/stores/theme";
import { useTrips } from "@/stores/trips";

const NAV = [
  { to: "/flights", label: "Flights" },
  { to: "/stays", label: "Stays" },
  { to: "/cars", label: "Cars" },
  { to: "/trips", label: "Trips" },
  { to: "/alerts", label: "Alerts" },
];

export function Header() {
  const { pathname } = useLocation();
  const { dark, toggle } = useTheme();
  const tripCount = useTrips((s) => s.items.length);

  return (
    <header className="sticky top-0 z-40 border-b border-black/[0.06] bg-white/75 backdrop-blur-xl dark:border-white/[0.08] dark:bg-surface-dark/75">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2.5">
          <Logo size={36} />
          <span className="font-display text-lg font-extrabold tracking-tight">Akashavani</span>
        </Link>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-0.5 rounded-full border border-black/[0.05] bg-surface-muted/70 p-1 dark:border-white/[0.06] dark:bg-surface-dark-muted/70">
            {NAV.map((item) => {
              const active = pathname.startsWith(item.to);
              return (
                <li key={item.to} className="relative">
                  <NavLink
                    to={item.to}
                    className={cn(
                      "relative block rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                      active
                        ? "text-ink dark:text-ink-inverse"
                        : "text-ink-muted hover:text-ink dark:text-ink-inverse/60 dark:hover:text-ink-inverse",
                    )}
                  >
                    {active && (
                      <motion.span
                        layoutId="nav-pill"
                        transition={springy}
                        className="absolute inset-0 rounded-full bg-white shadow-sm dark:bg-surface-dark"
                        aria-hidden
                      />
                    )}
                    <span className="relative flex items-center gap-1.5">
                      {item.label}
                      {item.to === "/trips" && tripCount > 0 && (
                        <span className="grid h-4 min-w-4 place-items-center rounded-full bg-brand px-1 text-[10px] font-semibold text-white">
                          {tripCount}
                        </span>
                      )}
                    </span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggle}
            aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
            className="grid h-9 w-9 place-items-center rounded-full border border-black/[0.08] text-ink-muted transition-colors hover:text-ink dark:border-white/[0.1] dark:text-ink-inverse/70 dark:hover:text-ink-inverse"
          >
            {dark ? <Sun size={16} aria-hidden /> : <Moon size={16} aria-hidden />}
          </button>
          <NavLink to="/assistant" className="btn-primary rounded-full">
            <Sparkles size={15} aria-hidden />
            <span className="hidden sm:inline">Assistant</span>
          </NavLink>
        </div>
      </div>
    </header>
  );
}
