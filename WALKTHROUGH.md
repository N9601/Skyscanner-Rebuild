# Akashavani Demo Walkthrough (~3 min)

Start: `npm run dev` → http://localhost:5173

## 1. Home (30s)
- Point out the animated hero: letterpress headline reveal, gradient word, floating fare cards, aurora background.
- Scroll: live fare ticker, count-up stats, dark 3D destination carousel (click arrows, hover a card for photo zoom), Greener Choice band.

## 2. Search + Everywhere (30s)
- In the search bar: From = Bengaluru. Leave To EMPTY → hit search → **Everywhere grid**: every destination ranked by price. Filter "Within India" and "Under ₹15,000".

## 3. Flights (45s)
- Pick Dubai from the grid (or search BLR → DXB).
- Show: price calendar strip, **Whole month** heatmap (tap a cheap green day), sort pills (Greenest), filters, real airline logos.
- Toggle **Greener Choice** → only lowest-CO2 itineraries stay.
- Click a result → **detail drawer**: timeline, fare breakdown, CO2 vs route average.
- Hit **Book** → contacting provider → fare review → simulated handoff with reference.

## 4. Trip plan + Alerts (30s)
- Add 2 flights + a stay (Stays → Goa: photo cards, **Map view** with price pins synced to cards).
- Trips page: count rings, editable budget bar, lime total card.
- Alerts: bell icon on any flight, or create one manually; below-target alerts glow green.

## 5. Sign in + Sync (20s)
- Header avatar → sign up / sign in (Supabase). Trips and alerts now sync to the cloud, follow you across devices.

## 6. Assistant (20s)
- Ask "somewhere under ₹15,000" → scripted instant answer with search buttons.
- Ask anything open ("3 days in Kyoto in autumn?") → **Gemini** answers live, travel-only guardrails.

## 7. Closers
- Ctrl+K command palette, dark mode toggle, mobile bottom nav (resize), scroll progress bar.
- 13 passing tests (`npm test`), deployable to Vercel in one click.

**One-liner:** "One search across flights, stays and cars, with a greener choice at every step, an AI copilot, and your trip synced to the cloud."
