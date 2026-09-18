import { FormEvent, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Send, Sparkles } from "lucide-react";
import { routeIntent, type AssistantReply } from "@/features/assistant/intentRouter";
import { cn } from "@/lib/cn";

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
  "Mountains in December",
];

let nextId = 1;

export function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      role: "assistant",
      text: "Hey, I'm the Akashavani assistant. Give me a route, a budget, or a vibe and I'll turn it into a search.",
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  function ask(text: string) {
    if (!text.trim() || typing) return;
    setMessages((m) => [...m, { id: nextId++, role: "user", text }]);
    setInput("");
    setTyping(true);
    const reply = routeIntent(text);
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        { id: nextId++, role: "assistant", text: reply.text, actions: reply.actions },
      ]);
      setTyping(false);
    }, 650 + Math.random() * 500);
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    ask(input);
  }

  return (
    <div className="route-fade container py-8">
      <div className="mx-auto max-w-3xl">
        <div className="overflow-hidden rounded-[2rem] bg-[#0B1D1E] text-white shadow-lifted">
          <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 text-black">
                <Sparkles size={17} aria-hidden />
              </span>
              <div>
                <p className="font-display font-bold">Trip assistant</p>
                <p className="text-xs text-white/50">Scripted demo · travel only</p>
              </div>
            </div>
            <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden />
              Online
            </span>
          </div>

          <div
            ref={scrollRef}
            className="h-[420px] space-y-4 overflow-y-auto px-6 py-6"
            aria-live="polite"
          >
            <AnimatePresence initial={false}>
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 14, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}
                >
                  <div
                    className={cn(
                      "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                      m.role === "user"
                        ? "rounded-br-md bg-white text-ink"
                        : "rounded-bl-md bg-white/10 text-white/90",
                    )}
                  >
                    <p>{m.text}</p>
                    {m.actions && m.actions.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {m.actions.map((a) => (
                          <Link
                            key={a.to + a.label}
                            to={a.to}
                            className="inline-flex items-center gap-1 rounded-full bg-emerald-400 px-3 py-1.5 text-xs font-bold text-black transition-transform hover:scale-105"
                          >
                            {a.label}
                            <ArrowUpRight size={12} aria-hidden />
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {typing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md bg-white/10 px-4 py-3.5">
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      className="h-1.5 w-1.5 rounded-full bg-white/60"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ repeat: Infinity, duration: 1, delay: i * 0.18 }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          <div className="border-t border-white/10 p-4">
            <div className="scrollbar-none mb-3 flex gap-2 overflow-x-auto">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => ask(s)}
                  className="shrink-0 rounded-full border border-white/15 px-3.5 py-1.5 text-xs font-medium text-white/70 transition-colors hover:border-emerald-400 hover:text-emerald-300"
                >
                  {s}
                </button>
              ))}
            </div>
            <form onSubmit={submit} className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Where to next?"
                aria-label="Message the assistant"
                className="flex-1 rounded-xl bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-white/40 focus:bg-white/15"
              />
              <button
                type="submit"
                aria-label="Send"
                disabled={!input.trim() || typing}
                className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-400 text-black transition-all hover:scale-105 disabled:opacity-40"
              >
                <Send size={17} aria-hidden />
              </button>
            </form>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-ink-soft">
          Responses are scripted for the offline demo. No data leaves this device.
        </p>
      </div>
    </div>
  );
}
