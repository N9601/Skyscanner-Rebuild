import { NavLink } from "react-router-dom";
import { Briefcase, Car, Hotel, Plane, Sparkles } from "lucide-react";
import { cn } from "@/lib/cn";

const ITEMS = [
  { to: "/flights", label: "Flights", icon: Plane },
  { to: "/stays", label: "Stays", icon: Hotel },
  { to: "/cars", label: "Cars", icon: Car },
  { to: "/trips", label: "Trips", icon: Briefcase },
  { to: "/assistant", label: "Ask", icon: Sparkles },
];

export function BottomNav() {
  return (
    <nav
      aria-label="Mobile"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-black/[0.06] bg-white/90 backdrop-blur-xl dark:border-white/[0.08] dark:bg-surface-dark/90 md:hidden"
    >
      <ul className="flex items-stretch justify-around pb-[env(safe-area-inset-bottom)]">
        {ITEMS.map(({ to, label, icon: Icon }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-semibold",
                  isActive
                    ? "text-brand"
                    : "text-ink-soft hover:text-ink dark:hover:text-ink-inverse",
                )
              }
            >
              <Icon size={19} aria-hidden />
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
