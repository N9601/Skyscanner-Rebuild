# Akashavani — Product Requirements Document (PRD)

**Team:** Dietcoke
**Domain:** Travel
**Version:** 1.0
**Date:** 2026-09-18
**Status:** Draft for Rebuild Round

---

## 1. Overview

Akashavani is a travel meta-search web application. It aggregates flight, stay, and car-rental options into one interface, layered with discovery, price awareness, and AI-guided planning. The rebuild is a functional, interactive front-end backed by a mock data layer — no real bookings, no live inventory.

## 2. Goals

1. Let a traveler go from "I want to go somewhere" to a comparable, filterable set of options in under 30 seconds.
2. Make price transparency first-class: calendars, alerts, "cheapest month" hints.
3. Support discovery for travelers without a fixed destination ("Everywhere").
4. Integrate an AI assistant that turns free-form intent into structured search + itinerary.
5. Surface sustainability signals (Greener Choice) without hiding cheaper options.

### Non-Goals
- Real payments, ticketing, PNR generation.
- Loyalty programs, seat maps, ancillary sales.
- Multi-currency FX at production accuracy (display-only).

## 3. Personas

- **Priya, the Budget Hunter** — flexible dates, wants the cheapest fare of the month, uses price alerts.
- **Arjun, the Business Traveler** — fixed dates, prioritizes fewest stops and short layovers.
- **The Dhillons, Family Planners** — round-trip + hotel + car rental, need one shared saved trip.
- **Ravi, the Explorer** — has no destination in mind, uses "Everywhere" mode and the AI assistant for ideas.

## 4. User Stories (MVP)

- As a user, I can pick trip type (one-way / round-trip / multi-city), origin, destination, dates, passengers, and cabin, and get results.
- As a user, I can switch between Flights, Stays, and Car Rentals tabs on the same search shell.
- As a user, I can filter flight results by airline, stops, layover length, connecting airport, departure/arrival time, and price range.
- As a user, I can sort by cheapest, fastest, and best.
- As a user, I can view a price calendar strip for the current route and jump between days.
- As a user, I can set a price alert on a route + date range and see it in "My Alerts".
- As a user, I can save flights, hotels, or cars into a Trip Plan that survives refreshes.
- As a user, I can toggle Greener Choice to prioritize lower-emission flights.
- As a user, I can open the AI assistant and describe my trip in plain language to get a suggested search + itinerary.
- As a user on mobile, I can complete the entire search-and-filter flow one-handed.

## 5. Functional Requirements

### 5.1 Global Shell
- Top nav: logo, Flights / Stays / Cars / Explore / Trips / Login.
- Currency + language selector (display-only, INR default).
- Footer: About, Help, Legal (static).

### 5.2 Search Widget
- Tabs: Flights, Stays, Cars.
- Flight fields: trip type, from, to, depart, return, passengers (adults/children/infants), cabin.
- "Add another flight" for multi-city (up to 5 legs).
- Flexible dates checkbox → expands to "Cheapest month" grid.
- Autocomplete on origin/destination (airport + city).
- "Everywhere" as a valid destination.

### 5.3 Flight Results
- Header shows route summary + edit-search chip.
- Sort tabs: Best / Cheapest / Fastest.
- Filter panel: stops, airlines, alliances, price slider, times (depart/arrive), duration, layover, connecting airport, Greener Choice toggle.
- Result card: airline logo, departure/arrival times, duration, stops, layover cities, emissions badge, price, "Select" CTA.
- Price calendar strip above results: ±3 days with cheapest-day highlighted.
- "Set price alert" affordance.

### 5.4 Stays Results
- Filter panel: price range, star rating, guest rating, property type (hotel/resort/rental), amenities, distance from center.
- Card: image carousel, name, area, rating, review count, per-night price, total price, "View deal".
- Map toggle (stretch).

### 5.5 Car Rentals Results
- Filter panel: vehicle category, fuel policy, transmission, pickup location, supplier rating.
- Card: image, category, seats/bags, transmission, mileage policy, supplier, price/day, total.

### 5.6 Explore / Everywhere
- Grid of destination cards sorted by lowest sample fare from selected origin.
- Filter by region and budget cap.

### 5.7 Trip Plan
- Saved items list grouped by trip.
- Rename, delete, and share (copy link) a trip.
- Persist to localStorage; export as JSON.

### 5.8 Price Alerts
- Create from any result card or search state.
- List page with route, dates, current price, delta since creation.
- Toggle on/off; delete.

### 5.9 AI Travel Assistant
- Slide-over panel accessible from any page.
- Input: free text ("cheap beach trip from Delhi in December for 4 days").
- Output: parsed intent (origin, dates, budget, vibe), a proposed search, and a 3–5-day sample itinerary.
- "Apply to search" button pre-fills the search widget.
- Guardrails: refuse non-travel prompts; safety fallback message.

### 5.10 Account (Stretch)
- Mock login (email only, no password) → profile page.
- Sync saved trips and alerts to the mocked account.

## 6. Non-Functional Requirements

- **Performance:** first meaningful paint < 2 s on mid-tier laptop; results filter re-render < 100 ms.
- **Accessibility:** WCAG 2.1 AA — keyboard nav on search + filters, focus rings, ARIA on dialogs, color contrast ≥ 4.5:1.
- **Responsiveness:** breakpoints at 360, 768, 1024, 1280.
- **Browser support:** latest Chrome, Edge, Firefox, Safari.
- **Offline demo:** all data and assets local.
- **State:** unsaved search state should survive tab switches within the session.

## 7. Information Architecture

```
/                       Landing + search
/flights?…              Flight results
/flights/:id            Flight detail (stretch)
/stays?…                Stays results
/cars?…                 Car rental results
/explore                Everywhere grid
/trips                  Saved trips
/alerts                 Price alerts
/assistant              Full-page assistant view
/account                Profile (stretch)
```

## 8. Data Model (Mocked)

- **Flight:** id, origin, destination, departAt, arriveAt, airline, flightNumber, stops[], duration, price, currency, emissionsKg, cabin.
- **Stay:** id, name, city, area, type, stars, rating, reviewCount, amenities[], pricePerNight, images[].
- **Car:** id, category, model, seats, bags, transmission, fuelPolicy, supplier, pickupLocation, pricePerDay.
- **PriceAlert:** id, kind, route, dateRange, threshold, createdAt.
- **Trip:** id, name, items[], notes, updatedAt.
- **Message (Assistant):** id, role, content, intent?

## 9. UI System

- **Type:** Inter for UI, Manrope for headings.
- **Color:** primary teal-blue for actions; success green for cheapest/greener badges; warm accent for price highlights; neutral grays; full dark mode.
- **Components:** button, input, select, combobox, dialog, drawer, tabs, tooltip, toast, card, badge, slider, calendar, chip.

## 10. Tech Stack

- React 18 + TypeScript + Vite
- Tailwind CSS + shadcn/ui (Radix under the hood)
- Zustand for local state; TanStack Query for the mock-API layer
- react-day-picker for calendars
- MSW (Mock Service Worker) for mock endpoints
- Vitest + React Testing Library for critical logic (filters, alerts, trip plan)

## 11. Analytics & Telemetry (Local)

- Event log in console + a debug drawer: search_submitted, filter_applied, result_selected, alert_created, trip_item_saved, assistant_message.

## 12. Milestones

| Day | Milestone |
|---|---|
| D0 morning | Repo scaffolded, tokens + shared components ready. |
| D0 evening | Landing + search widget + flight results skeleton. |
| D1 morning | Flight filters, sort, price calendar strip working. |
| D1 afternoon | Stays and Cars results done. |
| D1 evening | Trip Plan + Alerts + Assistant panel. |
| D2 morning | Greener Choice, Explore grid, responsive polish. |
| D2 afternoon | QA, mock data hardening, demo script, freeze. |

## 13. Acceptance Criteria (Demo)

1. Search "DEL → BOM, Dec 12–15, 2 adults" returns ≥ 20 flights.
2. Filtering to "non-stop only" collapses to the correct subset instantly.
3. Selecting a date on the price calendar re-runs the search.
4. Creating a price alert shows a toast and appears in `/alerts`.
5. Saving 2 flights and 1 hotel to "Goa Trip" persists after refresh.
6. Assistant: "cheap beach trip from Delhi in December for 4 days" produces a valid search + a 4-day itinerary.
7. Greener Choice toggle re-ranks the list and shows an emissions badge on top 3.
8. All above works at 360 px width.

## 14. Open Questions

- Do we include multi-city as MVP or stretch? (Recommend: stretch.)
- Do we ship dark mode? (Recommend: yes — one theme file, cheap.)
- Do we allow assistant via real LLM at demo, or fully scripted? (Depends on network policy at venue.)

## 15. Appendix — Source Observations

Sourced from the team's own decode-sheet exploration of the reference travel meta-search site:

- One-way / round-trip / multi-city flight search across many airlines and booking sites.
- Flexible dates, price calendars, whole-month view, "Everywhere" discovery.
- Price alerts for routes and dates.
- Filters: airlines, alliances, stops, layover duration, connecting airports.
- Hotel / resort / vacation-rental comparison with guest reviews.
- Car rental filters: vehicle category, fuel policy, pickup location, ratings.
- Account tools: saved favorites, trip plans, synced alerts, device preferences.
- Mobile app features: mobile-only deals, push alerts, widgets.
- Travel guides and low-cost carrier aggregation.
- AI-Powered Travel Assistant for personalized itineraries.
- Greener Choice filter for lower-carbon flights.
