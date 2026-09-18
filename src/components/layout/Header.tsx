import { NavLink, Link } from "react-router-dom";
import { Compass, Sparkles } from "lucide-react";
import { cn } from "@/lib/cn";

const NAV = [
  { to: "/flights", label: "Flights" },
  { to: "/stays", label: "Stays" },
  { to: "/cars", label: "Cars" },
  { to: "/trips", label: "Trips" },
  { to: "/alerts", label: "Alerts" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-white/80 backdrop-blur dark:border-white/10 dark:bg-surface-dark/80">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-brand text-white">
            <Compass size={18} aria-hidden />
          </span>
          <span className="font-display text-lg font-bold tracking-tight">Akashavani</span>
        </Link>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {NAV.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      "rounded-lg px-3 py-2 text-sm font-medium text-ink-muted hover:text-ink dark:text-ink-inverse/70 dark:hover:text-ink-inverse",
                      isActive && "bg-surface-muted text-ink dark:bg-surface-dark-muted dark:text-ink-inverse",
                    )
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <NavLink to="/assistant" className="btn-primary">
            <Sparkles size={16} aria-hidden />
            <span>Assistant</span>
          </NavLink>
        </div>
      </div>
    </header>
  );
}
