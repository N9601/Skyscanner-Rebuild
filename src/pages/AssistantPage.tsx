import { FormEvent, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, ArrowUpRight } from "lucide-react";
import { routeIntent, type AssistantReply } from "@/features/assistant/intentRouter";
import { askGemini, geminiEnabled, type GeminiAction } from "@/features/assistant/gemini";
import { findAirport } from "@/data/airports";
import { cn } from "@/lib/cn";

function geminiActionToLink(a: GeminiAction | null | undefined): AssistantReply["actions"] {
  if (!a || a.kind === "none") return undefined;
  if (a.kind === "flights" && a.to) {
    const from = findAirport(a.from ?? "Bengaluru");
    const to = findAirport(a.to);
    if (!from || !to) return undefined;
    const params = new URLSearchParams({
      from: `${from.city} (${from.iata})`,
      to: `${to.city} (${to.iata})`,
      pax: "1",
      cabin: "economy",
    });
    if (a.depart && /^\d{4}-\d{2}-\d{2}$/.test(a.depart)) params.set("depart", a.depart);
    return [{ label: `Search ${from.iata} → ${to.iata}`, to: `/flights?${params.toString()}` }];
  }
  if ((a.kind === "stays" || a.kind === "cars") && a.city) {
    const city = a.city.trim();
    return [{ label: `${a.kind === "stays" ? "Stays" : "Cars"} in ${city}`, to: `/${a.kind}?city=${encodeURIComponent(city)}` }];
  }
  if (a.kind === "explore") {
    const from = findAirport(a.from ?? a.city ?? "Bengaluru") ?? findAirport("Bengaluru")!;
    return [{ label: `Explore from ${from.city}`, to: `/explore?from=${encodeURIComponent(`${from.city} (${from.iata})`)}` }];
  }
  return undefined;
}

interface Message {
  id: number;
  role: "user" | "assistant";
  text: string;
  actions?: AssistantReply["actions"];
}

const SUGGESTIONS = [
  "Bengaluru to Goa",
  "Somewhere under ₹15,000",
  "A beach weekend",
  "Greener flights DEL to BOM",
];

let nextId = 1;

export function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      role: "assistant",
      text: "Hi. Give me a route, a budget, or a vibe and I'll turn it into a search.",
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  async function ask(text: string) {
    if (!text.trim() || typing) return;
    const history = messages.map((m) => ({ role: m.role, text: m.text }));
    setMessages((m) => [...m, { id: nextId++, role: "user", text }]);
    setInput("");
    setTyping(true);

    const scripted = routeIntent(text);
    let reply: AssistantReply = scripted;

    // Deterministic intents (with action buttons) stay scripted; everything else goes to
    // Gemini, which extracts a structured search action alongside its reply.
    if (geminiEnabled && !scripted.actions?.length) {
      try {
        const structured = await askGemini(history, text);
        reply = { text: structured.reply, actions: geminiActionToLink(structured.action) };
      } catch {
        reply = scripted;
      }
    } else {
      await new Promise((r) => setTimeout(r, 550 + Math.random() * 400));
    }

    setMessages((m) => [
      ...m,
      { id: nextId++, role: "assistant", text: reply.text, actions: reply.actions },
    ]);
    setTyping(false);
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    ask(input);
  }

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-2xl">
        <header className="mb-6 text-center">
          <h1 className="font-display text-2xl font-extrabold tracking-tight">Trip assistant</h1>
          <p className="mt-1 text-sm text-ink-soft">
            {geminiEnabled ? "Powered by Gemini · travel only" : "Scripted demo · travel only"}
          </p>
        </header>

        <div className="card overflow-hidden p-0">
          <div ref={scrollRef} className="h-[380px] space-y-3 overflow-y-auto px-5 py-6" aria-live="polite">
            <AnimatePresence initial={false}>
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}
                >
                  <div
                    className={cn(
                      "max-w-[82%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                      m.role === "user"
                        ? "rounded-br-md bg-ink text-white dark:bg-white dark:text-ink"
                        : "rounded-bl-md bg-surface-muted text-ink dark:bg-surface-dark dark:text-ink-inverse",
                    )}
                  >
                    <p>{m.text}</p>
                    {m.actions && m.actions.length > 0 && (
                      <div className="mt-2.5 flex flex-wrap gap-1.5">
                        {m.actions.map((a) => (
                          <Link
                            key={a.to + a.label}
                            to={a.to}
                            className="inline-flex items-center gap-1 rounded-full border border-brand/30 px-3 py-1 text-xs font-semibold text-brand transition-colors hover:bg-brand hover:text-white"
                          >
                            {a.label}
                            <ArrowUpRight size={11} aria-hidden />
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {typing && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                <div className="flex items-center gap-1 rounded-2xl rounded-bl-md bg-surface-muted px-4 py-3 dark:bg-surface-dark">
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      className="h-1 w-1 rounded-full bg-ink-soft"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ repeat: Infinity, duration: 1, delay: i * 0.18 }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          <div className="border-t border-black/[0.05] px-4 pb-4 pt-3 dark:border-white/[0.07]">
            {messages.length <= 1 && (
              <div className="scrollbar-none mb-3 flex gap-1.5 overflow-x-auto">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => ask(s)}
                    className="shrink-0 rounded-full border border-black/[0.08] px-3 py-1.5 text-xs text-ink-muted transition-colors hover:border-brand/50 hover:text-brand dark:border-white/[0.1] dark:text-ink-inverse/60"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
            <form onSubmit={submit} className="flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Where to next?"
                aria-label="Message the assistant"
                className="flex-1 rounded-full border border-black/[0.08] bg-transparent px-4 py-2.5 text-sm outline-none transition-colors placeholder:text-ink-soft/60 focus:border-brand/50 dark:border-white/[0.1]"
              />
              <button
                type="submit"
                aria-label="Send"
                disabled={!input.trim() || typing}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-ink text-white transition-transform hover:scale-105 disabled:opacity-30 dark:bg-white dark:text-ink"
              >
                <ArrowUp size={16} aria-hidden />
              </button>
            </form>
          </div>
        </div>

        <p className="mt-3 text-center text-xs text-ink-soft">
          {geminiEnabled
            ? "Route and budget questions answer instantly in-app. Open questions go to Gemini."
            : "Responses are scripted for the offline demo. Add a Gemini key in .env to go live."}
        </p>
      </div>
    </div>
  );
}
