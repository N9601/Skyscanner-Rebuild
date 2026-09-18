# Akashavani

Travel meta-search front-end — flights, stays, cars, trip plan, price alerts, AI assistant, and a Greener Choice toggle.

Built by **Team Dietcoke** for the **RE:BUILD** hackathon (Round 2 — Rebuild).

> Codename **Akashavani**. Reference site is never named — see `HANDOVER.md`.

## Stack

React 18 + TypeScript · Vite · Tailwind CSS · React Router v6 · TanStack Query · Zustand · lucide-react.

Full stack rationale in `TechStack.md`. Scope in `PRD.md`. Risks in `Feasibility-Study.md`.

## Getting started

```bash
pnpm install
pnpm dev
```

Then open http://localhost:5173.

## Scripts

- `pnpm dev` — start Vite dev server.
- `pnpm build` — type-check + production build.
- `pnpm preview` — preview the built app locally.
- `pnpm lint` — run ESLint.
- `pnpm format` — run Prettier.

## Folder layout

```
src/
├─ app/            # Providers (query client, theme)
├─ components/     # Layout + shared UI primitives
├─ features/       # Feature-scoped modules (search, flights, stays, cars, trips, alerts, assistant)
├─ pages/          # Route-level views
├─ lib/            # Utilities (cn helper, format, storage)
└─ styles/         # Tailwind entry + tokens
```

## Repository

<https://github.com/N9601/Skyscanner-Rebuild>
