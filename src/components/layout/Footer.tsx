export function Footer() {
  return (
    <footer className="border-t border-black/5 bg-surface-muted py-8 text-sm text-ink-muted dark:border-white/10 dark:bg-surface-dark-muted dark:text-ink-inverse/70">
      <div className="container flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <p className="font-medium text-ink dark:text-ink-inverse">Akashavani</p>
        <p>Prototype built for RE:BUILD by Team Dietcoke. Not a real booking service.</p>
        <p>© {new Date().getFullYear()}</p>
      </div>
    </footer>
  );
}
