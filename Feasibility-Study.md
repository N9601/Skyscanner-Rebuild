# Akashavani — Feasibility Study

**Team:** Dietcoke
**Domain:** Travel (flight, stay, and car meta-search)
**Round:** RE:BUILD — Rebuild Phase (Round 2 prep)
**Date:** 2026-09-18

---

## 1. Purpose

Assess whether the team can rebuild Akashavani — a travel meta-search web experience covering flights, stays, car rentals, price alerts, destination discovery, and an AI travel assistant — as a functional, interactive site within the hackathon window, using AI-assisted development.

## 2. Product Summary

Akashavani is a travel comparison platform that lets users:

- Search one-way, round-trip, and multi-city flights across many airlines and OTAs.
- Explore flexible dates through price calendars, whole-month views, and an "Everywhere" mode for discovery.
- Filter results by airline, alliance, stops, layover duration, and connecting airport.
- Set price alerts on routes and dates.
- Compare hotels, resorts, vacation rentals, and rental cars with reviews and category/fuel/pickup filters.
- Save favorites, plan trips, and sync preferences via an account.
- Consult an AI-Powered Travel Assistant for itineraries and use a Greener Choice filter to surface lower-emission flights.

## 3. Scope for the Rebuild

### 3.1 In Scope (MVP)
- Landing page with unified search (Flights / Stays / Car Rentals tabs).
- Flight search results with sorting, filters, and a price calendar strip.
- Hotel search results with basic filter panel and card list.
- Car rental search results with category filters.
- Price-alert opt-in (client-side mock).
- Trip planner / saved items (localStorage-backed).
- AI Travel Assistant panel (chat-style UI, mocked or LLM-backed responses).
- Greener Choice toggle on flights.
- Responsive layouts for desktop, tablet, and mobile.

### 3.2 Stretch
- "Everywhere" discovery grid (destinations by budget).
- Multi-city itinerary builder.
- Whole-month price grid heat map.
- Auth flow (mock login → profile → saved trips sync).
- Interactive map for hotels/destinations.

### 3.3 Out of Scope
- Real airline/OTA integrations and live inventory.
- Real payments, ticketing, or booking confirmations.
- Production-grade account system with server-side persistence.

## 4. Feasibility Analysis

### 4.1 Technical Feasibility

| Concern | Assessment | Mitigation |
|---|---|---|
| UI complexity (multi-tab search, complex filters, calendars) | Achievable with a modern component library. | Use React + Tailwind + shadcn/ui; Radix primitives for date pickers, dialogs, popovers. |
| Data (flights, hotels, cars) | No paid API access assumed. | Generate deterministic mock datasets; expose them via a mock API layer (MSW or local JSON) so UI is realistic and swappable. |
| AI assistant | LLM keys may be restricted. | Provide a scripted intent handler with canned itinerary responses; if keys allowed, wire a lightweight chat endpoint. |
| Price alerts / notifications | Real email/push not possible in hackathon. | Persist alerts to localStorage; simulate confirmation toast + inbox UI. |
| Map & greener-choice data | Emissions data non-trivial. | Precompute an "emissions score" per mock flight based on stops + aircraft type. |
| Responsive behavior | Multiple breakpoints. | Mobile-first Tailwind; smoke-test at 360/768/1280. |

**Verdict:** Technically feasible with a React + Vite + Tailwind + TypeScript stack, mocked data, and a small state layer (Zustand or Redux Toolkit).

### 4.2 Time Feasibility

Assuming a ~48-hour build window with 2–4 contributors:

| Phase | Effort |
|---|---|
| Scaffold + design tokens + shared components | 4 h |
| Landing page + search widget | 4 h |
| Flight results (list, filters, sort, calendar strip) | 8 h |
| Hotel results | 5 h |
| Car rental results | 4 h |
| Trip planner + saved items | 3 h |
| AI assistant panel | 4 h |
| Price alerts UI | 2 h |
| Responsive polish + a11y pass | 4 h |
| QA, mock data hardening, demo script | 4 h |
| Buffer | 4 h |

Total ≈ 46 h — fits, provided scope is held to MVP and stretch items are added only when core paths are green.

### 4.3 Resource Feasibility

- **People:** 2–4 devs; ideally 1 on flights, 1 on stays/cars, 1 on shared shell + assistant, 1 on data + polish.
- **Tools:** VS Code, Node 20+, pnpm, Vite, Git. AI assistants (Claude Code, ChatGPT) allowed per rules.
- **Assets:** Open icon set (lucide), free imagery (Unsplash), open fonts (Inter, Manrope).

### 4.4 Risk Register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Scope creep on filters | High | Medium | Freeze filter list at MVP checkpoint. |
| Calendar/date picker complexity | Medium | Medium | Use a proven library (react-day-picker). |
| Mock data feels thin during demo | Medium | High | Seed 200+ flights, 100+ stays, 50+ cars with realistic variance. |
| AI assistant returns off-topic content | Medium | Medium | Constrain with intent router + safety fallback. |
| Responsive breakage on results tables | Medium | Medium | Card layout on mobile, tabular on desktop. |
| Demo laptop offline | Low | High | Everything runs locally with no external calls at demo time. |

### 4.5 Legal / Compliance
- Do not scrape or embed the reference site's assets.
- Use only openly licensed fonts, icons, images.
- Do not name or brand-mimic any real travel provider.

## 5. Success Criteria

- Working search-to-results flow on flights, stays, and cars.
- At least 5 working filters on flights with instant client-side re-sort.
- Price calendar strip changes results when a date is picked.
- Trip planner persists across reloads.
- AI assistant answers at least 8 seeded traveler questions coherently.
- Lighthouse: Performance ≥ 85, Accessibility ≥ 90 on desktop.
- Runs offline on the demo laptop.

## 6. Recommendation

**Proceed.** The rebuild is technically and time-feasible at MVP scope with the proposed React/Vite/Tailwind stack and mock-data layer. Lock scope early, defend the filter list, and treat the AI assistant + Greener Choice + Everywhere modes as differentiators only after the core search-and-compare loop works end-to-end.
