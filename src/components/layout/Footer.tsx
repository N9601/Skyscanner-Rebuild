import { Compass } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-black/[0.06] bg-surface-muted/60 py-10 text-sm dark:border-white/[0.08] dark:bg-surface-dark-muted/50">
      <div className="container flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 text-white">
            <Compass size={15} aria-hidden />
          </span>
          <div>
            <p className="font-display font-bold text-ink dark:text-ink-inverse">Akashavani</p>
            <p className="text-xs text-ink-soft">Search once. Travel smarter.</p>
          </div>
        </div>
        <p className="max-w-md text-xs leading-relaxed text-ink-muted dark:text-ink-inverse/60">
          Prototype built for RE:BUILD by Team Dietcoke. Prices, providers, and emissions figures
          are simulated. Not a real booking service.
        </p>
        <p className="text-xs text-ink-soft">© {new Date().getFullYear()} Team Dietcoke</p>
      </div>
    </footer>
  );
}
