import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/cn";

interface Step {
  target: string;
  title: string;
  body: string;
}

const STEPS: Step[] = [
  {
    target: '[data-tour="search"]',
    title: "One search for everything",
    body: "Flights, stays and cars in one bar. Leave 'To' empty and hit search to explore Everywhere by price.",
  },
  {
    target: '[data-tour="nav"]',
    title: "Your travel hub",
    body: "Results feed your Trip plan and Price alerts. Sign in and they sync to the cloud.",
  },
  {
    target: '[data-tour="assistant"]',
    title: "AI copilot",
    body: "Ask for a route, a budget or a vibe. Instant answers with one-tap searches.",
  },
  {
    target: '[data-tour="palette"]',
    title: "Move fast",
    body: "Ctrl+K opens the command palette: jump to pages, popular routes, or toggle dark mode.",
  },
];

const KEY = "akashavani-tour-done";

export function Tour() {
  const [step, setStep] = useState(-1);
  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    try {
      if (localStorage.getItem(KEY)) return;
    } catch {
      return;
    }
    const t = setTimeout(() => setStep(0), 1600);
    return () => clearTimeout(t);
  }, []);

  const measure = useCallback(() => {
    if (step < 0 || step >= STEPS.length) return;
    const el = document.querySelector(STEPS[step].target);
    if (!el) {
      setRect(null);
      return;
    }
    el.scrollIntoView({ block: "center", behavior: "smooth" });
    setTimeout(() => setRect(el.getBoundingClientRect()), 350);
  }, [step]);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  // Layout keeps shifting after mount (fonts, images, entry animations), so re-track the
  // target every frame-ish tick while the tour is up instead of trusting one measurement.
  useEffect(() => {
    if (step < 0 || step >= STEPS.length) return;
    const id = setInterval(() => {
      const el = document.querySelector(STEPS[step].target);
      if (!el) return;
      const r = el.getBoundingClientRect();
      setRect((prev) =>
        prev &&
        Math.abs(prev.top - r.top) < 1.5 &&
        Math.abs(prev.left - r.left) < 1.5 &&
        Math.abs(prev.width - r.width) < 1.5 &&
        Math.abs(prev.height - r.height) < 1.5
          ? prev
          : r,
      );
    }, 180);
    return () => clearInterval(id);
  }, [step]);

  useEffect(() => {
    const active = step >= 0 && step < STEPS.length;
    if (!active) return;
    const t = setTimeout(() => {
      document.body.style.overflow = "hidden";
    }, 400);
    return () => {
      clearTimeout(t);
      document.body.style.overflow = "";
    };
  }, [step]);

  function finish() {
    setStep(-1);
    try {
      localStorage.setItem(KEY, "1");
    } catch {
      /* private mode */
    }
  }

  const active = step >= 0 && step < STEPS.length;
  const current = active ? STEPS[step] : null;
  const below = rect ? rect.bottom + 190 < window.innerHeight : true;

  return (
    <AnimatePresence>
      {active && current && rect && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[95]"
          role="dialog"
          aria-label="Product tour"
        >
          <motion.div
            animate={{
              top: rect.top - 8,
              left: rect.left - 8,
              width: rect.width + 16,
              height: rect.height + 16,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 32 }}
            className="absolute rounded-2xl ring-2 ring-brand"
            style={{ boxShadow: "0 0 0 9999px rgba(8, 12, 24, 0.6)" }}
          />
          <motion.div
            key={step}
            initial={{ opacity: 0, y: below ? 10 : -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.1 }}
            className="absolute w-[320px] max-w-[calc(100vw-32px)] rounded-2xl border border-black/[0.07] bg-white p-5 shadow-lifted dark:border-white/[0.1] dark:bg-surface-dark-muted"
            style={
              window.innerWidth < 640
                ? { bottom: 84, left: 16, right: 16, width: "auto" }
                : {
                    top: below ? rect.bottom + 16 : Math.max(rect.top - 216, 16),
                    left: Math.min(
                      Math.max(rect.left + rect.width / 2 - 160, 16),
                      window.innerWidth - 336,
                    ),
                  }
            }
          >
            <p className="section-label">
              Step {step + 1} of {STEPS.length}
            </p>
            <h2 className="mt-1.5 font-display text-lg font-extrabold">{current.title}</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-muted dark:text-ink-inverse/70">
              {current.body}
            </p>
            <div className="mt-4 flex items-center justify-between">
              <div className="flex gap-1.5" aria-hidden>
                {STEPS.map((_, i) => (
                  <span
                    key={i}
                    className={cn(
                      "h-1.5 rounded-full transition-all",
                      i === step ? "w-5 bg-brand" : "w-1.5 bg-ink-soft/30",
                    )}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={finish}
                  className="text-xs font-semibold text-ink-soft hover:text-ink dark:hover:text-ink-inverse"
                >
                  Skip
                </button>
                <button
                  type="button"
                  onClick={() => (step === STEPS.length - 1 ? finish() : setStep(step + 1))}
                  className="btn-primary btn-shine rounded-full px-4 py-1.5 text-sm"
                >
                  {step === STEPS.length - 1 ? "Done" : "Next"}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
