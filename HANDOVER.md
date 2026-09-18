# Handover Prompt — paste this into a new Claude Code chat

Copy everything between the fences below into your next chat as the first message.

---

```
CONTEXT HANDOVER — RE:BUILD Hackathon

Project folder: C:\Users\Owner\Documents\Projects\Skyscanner-Rebuild
GitHub repo:    https://github.com/N9601/Skyscanner-Rebuild
Team name:      Dietcoke
Codename:       Akashavani  (never mention or infer the real reference site — refer to it ONLY as "Akashavani")
Domain:         Travel (flight, stay, and car meta-search + AI travel assistant + Greener Choice)

HARD RULES (from the RE:BUILD organizer, must follow every turn)
1. Never explicitly reveal or name the real target website. Always call it "Akashavani".
2. All significant prompts must be logged in RE_BUILD-PromptLog.pdf.
3. Summarize each prompt AND its output in ≤50 words.
4. Do NOT fabricate, backfill, or alter past prompt-log entries — only append new ones.
5. Prompts must be grounded in the team's own Round-1 decode observations (see Copy of Decode Sheet.pdf).
6. AI is only a development assistant — do not lift assets or code from the reference site.
7. Log format must match the official template: Team/Website/Domain header,
   then a table of Prompt · AI Tools Used · Output Received · How It was used.

FILES ALREADY IN THE FOLDER
- Copy of Decode Sheet.pdf   — Round-1 feature analysis (source of truth for scope)
- RE_BUILD-PromptLog.pdf     — filled prompt log (template layout; keep appending)
- Feasibility-Study.md       — MVP/stretch scope, risks, verdict
- PRD.md                     — goals, personas, user stories, functional/non-functional specs, IA, data model, milestones, acceptance
- TechStack.md               — recommended stack + folder plan + setup commands
- HANDOVER.md                — this file

DECISIONS ALREADY LOCKED
- Stack: React 18 + TypeScript + Vite, Tailwind + shadcn/ui, React Router v6,
  TanStack Query + Zustand, MSW for mock APIs, React Hook Form + Zod,
  date-fns + react-day-picker, Recharts, Framer Motion, lucide-react,
  Vitest + RTL, Playwright smoke, ESLint + Prettier + Husky, pnpm, Node 20.
- Deploy target: Vercel (offline fallback: `pnpm build && pnpm preview`).
- MVP surfaces: Home + unified Search, Flights results (filters, sort,
  price calendar strip), Stays results, Cars results, Trip Plan (localStorage),
  Price Alerts (localStorage), AI Assistant panel (scripted intent router),
  Greener Choice toggle. Dark mode included. WCAG AA.
- Stretch: Everywhere grid, multi-city, whole-month price grid, mock auth,
  hotel map (MapLibre).
- Out of scope: real bookings, payments, live inventory, real accounts.

WHAT I NEED YOU TO DO IN THIS CHAT
1. Read RE_BUILD-PromptLog.pdf first so you know the last logged entry.
2. From this point on, after every one of my prompts:
     a. Do the work I asked for.
     b. Append a new row to RE_BUILD-PromptLog.pdf via a Python + reportlab
        rebuild (Python 3.13 + reportlab are installed). Never edit the .md
        alternative — keep the log as PDF only.
     c. Prompt summary ≤50 words. Output summary ≤50 words.
     d. Regenerate the PDF preserving the template cover page
        (RE:BUILD title, DECODE. REBUILD. EVOLVE tag, Prompt Log heading,
        Team=Dietcoke / Website=<blank, user fills> / Domain=Travel,
        guidelines, participant instructions, "Better prompts. Smarter builds.")
        and the entries table on page 2+.
3. Never call the real site by its real name in chat, in files, or in the log.
4. When in doubt about scope, defer to PRD.md; when in doubt about feasibility
   or risk, defer to Feasibility-Study.md; when in doubt about tooling,
   defer to TechStack.md.
5. Do not add features, docs, or refactors I did not ask for.
6. Keep chat replies short (a few sentences) — deliverables live in files.

NEXT LIKELY STEPS (do NOT do these until I ask)
- Scaffold the Vite + React + TS project inside the repo.
- Wire Tailwind + shadcn/ui + router + providers.
- Build the shared search widget and Flights results first.

Start by reading RE_BUILD-PromptLog.pdf and confirming the last-logged entry
number so we continue from the correct row. Then wait for my next prompt.
```

---

## Tips

- Paste the block once at the start of the new chat. Don't paraphrase it — the rules and file list are what keep the log defensible.
- If Claude in the new chat offers to "clean up" past log entries, refuse — only appending is allowed.
- Keep this HANDOVER.md updated whenever a locked decision changes (stack swap, scope change, new hard rule from organizer).
