# Akashavani — Tech Stack Plan

**Team:** Dietcoke · **Domain:** Travel · **Repo:** https://github.com/N9601/Skyscanner-Rebuild

## 1. Guiding Constraints

- Front-end-only demo, no real bookings.
- Runs offline on the demo laptop.
- 2-day hackathon window, 2–4 contributors.
- Must be fast, responsive, and accessible (WCAG AA).
- AI-assisted development friendly (typed, componentized, idiomatic).

## 2. Recommended Stack

### 2.1 Core
| Layer | Choice | Why |
|---|---|---|
| Framework | **React 18 + TypeScript** | Component model, type safety, huge ecosystem, easy AI pairing. |
| Bundler / dev server | **Vite** | Instant HMR, tiny config, fast prod build. |
| Routing | **React Router v6** | File-agnostic, matches our IA (/flights, /stays, /cars, /explore, /trips, /alerts, /assistant). |
| Styling | **Tailwind CSS** + **shadcn/ui** (Radix under the hood) | Tokens, dark mode, accessible primitives, quick to theme. |
| Icons | **lucide-react** | Clean, MIT, tree-shakeable. |
| Fonts | Inter (UI) + Manrope (display) via `@fontsource` | No CDN dependency; offline-safe. |

### 2.2 State & Data
| Layer | Choice | Why |
|---|---|---|
| Server-cache state | **TanStack Query** | Handles our mock API layer, retries, caching, pagination. |
| Local UI state | **Zustand** | Tiny, no boilerplate; ideal for search widget, filters, trip plan. |
| Mock API | **MSW (Mock Service Worker)** | Intercepts fetch, keeps calls realistic, easy to swap for real APIs later. |
| Forms & validation | **React Hook Form + Zod** | Type-safe search widget, alert forms, assistant intents. |
| Dates | **date-fns** + **react-day-picker** | Small, tree-shakeable; calendars for search + price strip. |
| Persistence | `localStorage` via a typed wrapper | Trip plan, alerts, recent searches, theme. |

### 2.3 Visuals & Interaction
| Layer | Choice | Why |
|---|---|---|
| Charts (price calendar strip, emissions bar) | **Recharts** | Declarative, matches Tailwind theming. |
| Motion | **Framer Motion** (targeted use only) | Drawer, dialog, filter transitions. |
| Maps (stretch, hotels) | **MapLibre GL** + free tiles | No API key needed for basic view. |

### 2.4 AI Assistant
| Layer | Choice | Why |
|---|---|---|
| Default (offline demo) | Scripted intent router + canned itineraries | Guaranteed to work on demo laptop. |
| Optional (online) | Anthropic Claude via a thin `/api/assistant` proxy (Vite dev middleware or Vercel Edge) | Only if venue network + keys allow. |
| Guardrails | Zod schema for parsed intent; refusal for non-travel prompts | Deterministic UI wiring. |

### 2.5 Quality
| Layer | Choice | Why |
|---|---|---|
| Lint / format | ESLint + Prettier + `@typescript-eslint` | Consistent code, easy AI diffs. |
| Type check | `tsc --noEmit` in CI | Catches drift early. |
| Unit tests | **Vitest + React Testing Library** | Cover filters, alerts store, trip plan reducer, intent parser. |
| E2E smoke | **Playwright** (1 golden-path spec per surface) | Prevents demo-day regressions. |
| Git hooks | **Husky + lint-staged** | Fast, local, no CI dependency. |

### 2.6 Tooling & DX
- **pnpm** (fast, disk-friendly, deterministic).
- **Node 20 LTS**.
- **VS Code** + Tailwind IntelliSense + ESLint + Error Lens.
- **Storybook** (optional, only if we have time — good demo asset for components).

### 2.7 Deployment
- **Vercel** (or Netlify) for public link — one-click from the GitHub repo.
- Offline demo build: `pnpm build && pnpm preview` locally as fallback.

## 3. Folder Layout

```
akashavani/
├─ public/
├─ src/
│  ├─ app/                     # Router, providers, theme
│  ├─ pages/                   # Route-level views (Home, Flights, Stays, Cars, Explore, Trips, Alerts, Assistant)
│  ├─ features/
│  │  ├─ search/               # Search widget + shared logic
│  │  ├─ flights/              # Result cards, filters, price calendar
│  │  ├─ stays/
│  │  ├─ cars/
│  │  ├─ trips/                # Trip plan store + views
│  │  ├─ alerts/               # Price alert store + views
│  │  └─ assistant/            # Intent router + chat panel
│  ├─ components/ui/           # shadcn-generated primitives
│  ├─ components/              # Cross-feature shared components
│  ├─ lib/                     # date, format, mock-api client, persistence
│  ├─ mocks/                   # MSW handlers + seed data (flights, stays, cars)
│  ├─ styles/                  # tailwind.css, tokens
│  └─ types/                   # Shared TS types
├─ tests/
├─ .storybook/                 # optional
├─ index.html
├─ vite.config.ts
├─ tailwind.config.ts
├─ package.json
└─ tsconfig.json
```

## 4. Rationale Highlights

- **Vite over Next.js:** we don't need SSR or an API layer; Vite ships faster in a 48-hour window.
- **shadcn/ui over MUI:** we own the components, so restyling to the Akashavani brand is a token change, not a fight.
- **MSW over a hand-rolled JSON server:** same fetch code will work if we ever swap in a real API.
- **Zustand + TanStack Query, not Redux:** less boilerplate, cleaner mock-network story.
- **Recharts over D3:** faster to build the price strip and emissions widgets; enough control for our polish level.

## 5. Setup Commands

```bash
pnpm create vite@latest akashavani -- --template react-ts
cd akashavani
pnpm add react-router-dom @tanstack/react-query zustand
pnpm add react-hook-form zod @hookform/resolvers
pnpm add date-fns react-day-picker recharts framer-motion lucide-react
pnpm add @fontsource/inter @fontsource/manrope
pnpm add -D tailwindcss postcss autoprefixer
pnpm add -D msw vitest @testing-library/react @testing-library/jest-dom jsdom
pnpm add -D playwright eslint prettier husky lint-staged
npx tailwindcss init -p
npx shadcn@latest init
```

## 6. Risks to This Stack

- **shadcn/ui learning curve** for anyone new — mitigation: one dev owns the component library day 1.
- **MSW + service worker in production build** — mitigation: keep it dev-only or use MSW's node adapter for `vite preview`.
- **MapLibre bundle size** — mitigation: lazy-load only on the Stays map view.
