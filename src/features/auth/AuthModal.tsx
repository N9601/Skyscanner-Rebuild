import { FormEvent, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, LogIn, X } from "lucide-react";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/stores/auth";
import { cn } from "@/lib/cn";

type Mode = "signin" | "signup";

export function AuthModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setNotice(null);
    const result = mode === "signin" ? await signIn(email, password) : await signUp(email, password);
    setBusy(false);
    if (result === "CONFIRM_EMAIL") {
      setNotice("Account created. Check your email to confirm, then sign in.");
      setMode("signin");
    } else if (result) {
      setError(result);
    } else {
      onClose();
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[100] grid place-items-center bg-black/40 px-4 backdrop-blur-sm"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-sm rounded-2xl border border-black/[0.07] bg-white p-6 shadow-lifted dark:border-white/[0.1] dark:bg-surface-dark-muted"
            role="dialog"
            aria-label="Sign in"
          >
            <div className="mb-5 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Logo size={36} />
                <div>
                  <p className="font-display text-lg font-extrabold">
                    {mode === "signin" ? "Welcome back" : "Create account"}
                  </p>
                  <p className="text-xs text-ink-soft">Trips and alerts sync to your account</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="grid h-8 w-8 place-items-center rounded-full text-ink-soft hover:bg-surface-muted dark:hover:bg-surface-dark"
              >
                <X size={16} aria-hidden />
              </button>
            </div>

            <form onSubmit={submit} className="space-y-3">
              <label className="input-shell">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-soft">
                  Email
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-transparent text-sm font-medium outline-none placeholder:font-normal placeholder:text-ink-soft/60"
                />
              </label>
              <label className="input-shell">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-soft">
                  Password
                </span>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full bg-transparent text-sm font-medium outline-none placeholder:font-normal placeholder:text-ink-soft/60"
                />
              </label>

              {error && (
                <p className="rounded-lg bg-rose-50 px-3 py-2 text-xs font-medium text-rose-600 dark:bg-rose-500/10 dark:text-rose-300">
                  {error}
                </p>
              )}
              {notice && (
                <p className="rounded-lg bg-eco-soft px-3 py-2 text-xs font-medium text-eco dark:bg-eco-dark/30 dark:text-emerald-300">
                  {notice}
                </p>
              )}

              <button
                type="submit"
                disabled={busy}
                className="btn-primary btn-shine w-full rounded-xl py-2.5"
              >
                {busy ? (
                  <Loader2 size={16} className="animate-spin" aria-hidden />
                ) : (
                  <LogIn size={16} aria-hidden />
                )}
                {mode === "signin" ? "Sign in" : "Sign up"}
              </button>
            </form>

            <button
              type="button"
              onClick={() => {
                setMode(mode === "signin" ? "signup" : "signin");
                setError(null);
              }}
              className={cn("mt-4 w-full text-center text-xs font-semibold text-brand hover:underline")}
            >
              {mode === "signin" ? "New here? Create an account" : "Already registered? Sign in"}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
