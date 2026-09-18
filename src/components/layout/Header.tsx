import { Link, NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { LogOut, Moon, Search, Sparkles, Sun, UserRound } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { Logo } from "@/components/Logo";
import { AuthModal } from "@/features/auth/AuthModal";
import { cn } from "@/lib/cn";
import { springy } from "@/lib/motion";
import { supabaseEnabled } from "@/lib/supabase";
import { useAuth } from "@/stores/auth";
import { useTheme } from "@/stores/theme";
import { useTrips } from "@/stores/trips";

const NAV = [
  { to: "/flights", label: "Flights" },
  { to: "/stays", label: "Stays" },
  { to: "/cars", label: "Cars" },
  { to: "/trips", label: "Trips" },
  { to: "/alerts", label: "Alerts" },
];

export function Header({ onOpenPalette }: { onOpenPalette?: () => void }) {
  const { pathname } = useLocation();
  const { dark, toggle } = useTheme();
  const tripCount = useTrips((s) => s.items.length);
  const { user, init, signOut } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => init(), [init]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-black/[0.06] bg-white/75 backdrop-blur-xl dark:border-white/[0.08] dark:bg-surface-dark/75">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2.5">
          <Logo size={36} />
          <span className="font-display text-lg font-extrabold tracking-tight">Akashavani</span>
        </Link>

        <nav aria-label="Primary" data-tour="nav" className="hidden md:block">
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
                        <span className="flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-brand px-1 text-center text-[10px] font-bold leading-none text-white">
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
            onClick={onOpenPalette}
            data-tour="palette"
            aria-label="Open command palette"
            className="hidden h-9 items-center gap-2 rounded-full border border-black/[0.08] px-3 text-xs font-medium text-ink-soft transition-colors hover:text-ink dark:border-white/[0.1] dark:hover:text-ink-inverse sm:flex"
          >
            <Search size={13} aria-hidden />
            <kbd className="font-sans">Ctrl K</kbd>
          </button>
          <button
            type="button"
            onClick={toggle}
            aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
            className="grid h-9 w-9 place-items-center rounded-full border border-black/[0.08] text-ink-muted transition-colors hover:text-ink dark:border-white/[0.1] dark:text-ink-inverse/70 dark:hover:text-ink-inverse"
          >
            {dark ? <Sun size={16} aria-hidden /> : <Moon size={16} aria-hidden />}
          </button>
          <NavLink to="/assistant" data-tour="assistant" className="btn-primary btn-shine rounded-full">
            <Sparkles size={15} aria-hidden />
            <span className="hidden sm:inline">Assistant</span>
          </NavLink>

          {supabaseEnabled &&
            (user ? (
              <div ref={menuRef} className="relative">
                <button
                  type="button"
                  onClick={() => setMenuOpen((v) => !v)}
                  aria-label="Account menu"
                  aria-expanded={menuOpen}
                  className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-brand-600 text-xs font-extrabold uppercase text-white shadow-glow"
                >
                  {user.email.slice(0, 2)}
                </button>
                <AnimatePresence>
                  {menuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-xl border border-black/[0.07] bg-white py-1.5 shadow-lifted dark:border-white/[0.1] dark:bg-surface-dark-muted"
                    >
                      <p className="truncate px-4 py-2 text-xs text-ink-soft">{user.email}</p>
                      <NavLink
                        to="/profile"
                        onClick={() => setMenuOpen(false)}
                        className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm font-medium hover:bg-surface-muted dark:hover:bg-surface-dark"
                      >
                        <UserRound size={14} aria-hidden />
                        Profile
                      </NavLink>
                      <button
                        type="button"
                        onClick={() => {
                          void signOut();
                          setMenuOpen(false);
                        }}
                        className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm font-medium text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10"
                      >
                        <LogOut size={14} aria-hidden />
                        Sign out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setAuthOpen(true)}
                className="grid h-9 w-9 place-items-center rounded-full border border-black/[0.08] text-ink-muted transition-colors hover:text-ink dark:border-white/[0.1] dark:text-ink-inverse/70 dark:hover:text-ink-inverse"
                aria-label="Sign in"
                title="Sign in"
              >
                <UserRound size={16} aria-hidden />
              </button>
            ))}
        </div>
      </div>
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </header>
  );
}
