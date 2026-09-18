import { DESTINATIONS } from "@/features/destinations/data";
import { findAirport } from "@/data/airports";
import { formatINR } from "@/lib/mockApi";

export interface AssistantAction {
  label: string;
  to: string;
}

export interface AssistantReply {
  text: string;
  actions?: AssistantAction[];
}

function flightLink(fromCity: string, fromIata: string, toCity: string, toIata: string) {
  return `/flights?from=${encodeURIComponent(`${fromCity} (${fromIata})`)}&to=${encodeURIComponent(`${toCity} (${toIata})`)}&pax=1&cabin=economy`;
}

const VIBES: { keys: string[]; tag: string; blurb: string }[] = [
  { keys: ["beach", "sea", "coast", "island"], tag: "Beach break", blurb: "sand and sunsets" },
  { keys: ["mountain", "hill", "trek", "snow", "alpine"], tag: "Mountains", blurb: "cool air and big views" },
  { keys: ["food", "eat", "street food", "cuisine"], tag: "Food trip", blurb: "eating your way through town" },
  { keys: ["culture", "history", "temple", "museum"], tag: "Culture", blurb: "old streets and older stories" },
  { keys: ["city", "shopping", "nightlife"], tag: "City lights", blurb: "big city energy" },
];

export function routeIntent(raw: string): AssistantReply {
  const input = raw.trim().toLowerCase();

  if (!input) {
    return { text: "Tell me where you want to go, or what kind of trip you're dreaming about." };
  }

  if (/^(hi|hello|hey|namaste|yo)\b/.test(input)) {
    return {
      text: "Hey, I'm your trip planner. Try 'Bengaluru to Goa', 'somewhere under ₹10,000', or 'a beach weekend'.",
    };
  }

  const greener = /(green|eco|emission|co2|sustain|planet)/.test(input);

  const routeMatch = input.match(
    /(?:from\s+)?([a-z\s]+?)\s+(?:to|→|->)\s+([a-z\s]+?)(?:\s|$|\?|,)/,
  );
  if (routeMatch) {
    const from = findAirport(routeMatch[1].trim());
    const to = findAirport(routeMatch[2].trim());
    if (from && to) {
      return {
        text: greener
          ? `Good call. I'll rank ${from.city} to ${to.city} with the cleanest itineraries first. Flip the Greener Choice toggle on the results page.`
          : `${from.city} to ${to.city}, nice. I lined up every airline on that route, sorted by best overall value.`,
        actions: [
          { label: `Search ${from.iata} → ${to.iata}`, to: flightLink(from.city, from.iata, to.city, to.iata) },
        ],
      };
    }
    return {
      text: "I couldn't place one of those cities. Try airport codes like BLR, DEL, DXB, or big city names.",
    };
  }

  const budgetMatch = input.match(/under\s*(?:₹|rs\.?\s*)?([\d,]+)\s*k?/);
  if (budgetMatch) {
    let amount = Number(budgetMatch[1].replace(/,/g, ""));
    if (/k\b/.test(input) || amount < 100) amount *= 1000;
    const picks = DESTINATIONS.filter((d) => d.from <= amount).slice(0, 3);
    if (picks.length === 0) {
      return {
        text: `Nothing in my picks flies for ${formatINR(amount)} right now. Goa at ${formatINR(DESTINATIONS[0].from)} is the closest.`,
        actions: [
          { label: "See Goa fares", to: flightLink("Bengaluru", "BLR", "Goa", "GOI") },
        ],
      };
    }
    return {
      text: `For ${formatINR(amount)} you've got real options: ${picks
        .map((p) => `${p.city} from ${formatINR(p.from)}`)
        .join(", ")}. Want me to open one?`,
      actions: picks.map((p) => ({
        label: `${p.city} from ${formatINR(p.from)}`,
        to: flightLink("Bengaluru", "BLR", p.city, p.iata),
      })),
    };
  }

  for (const vibe of VIBES) {
    if (vibe.keys.some((k) => input.includes(k))) {
      const picks = DESTINATIONS.filter((d) => d.tag === vibe.tag);
      const list = picks.length ? picks : DESTINATIONS.slice(0, 2);
      return {
        text: `If it's ${vibe.blurb} you're after: ${list
          .map((p) => `${p.city} (${p.tagline.toLowerCase()})`)
          .join(", or ")}.`,
        actions: list.map((p) => ({
          label: `Fly to ${p.city}`,
          to: flightLink("Bengaluru", "BLR", p.city, p.iata),
        })),
      };
    }
  }

  if (greener) {
    return {
      text: "Every flight result carries a CO2 estimate, and the Greener Choice toggle filters to the cleanest 30% of itineraries. Nonstop routes almost always win.",
      actions: [
        { label: "Try a greener search", to: flightLink("New Delhi", "DEL", "Mumbai", "BOM") },
      ],
    };
  }

  if (/(weekend|getaway|short trip|quick trip)/.test(input)) {
    return {
      text: "For a quick escape from Bengaluru I'd look at Goa (45 min hop), Kochi, or Hyderabad. All three have solid nonstop options.",
      actions: [
        { label: "Goa weekend", to: flightLink("Bengaluru", "BLR", "Goa", "GOI") },
        { label: "Kochi weekend", to: flightLink("Bengaluru", "BLR", "Kochi", "COK") },
      ],
    };
  }

  if (/(hotel|stay|room|resort)/.test(input)) {
    return {
      text: "I compare stays too. Search a city and I'll rank hotels by rating, price, and eco certification.",
      actions: [{ label: "Browse stays in Goa", to: "/stays?city=Goa" }],
    };
  }

  if (/(car|drive|rental)/.test(input)) {
    return {
      text: "Rental cars, sorted. Filter to hybrids and EVs if you want the greener pick.",
      actions: [{ label: "Cars in Goa", to: "/cars?city=Goa" }],
    };
  }

  if (/(weather|news|stock|code|math|joke|recipe)/.test(input)) {
    return {
      text: "I only do travel. Routes, budgets, trip ideas, greener options, that's my lane. Where do you want to go?",
    };
  }

  return {
    text: "I can find routes ('BLR to DXB'), work to a budget ('under ₹15,000'), or pitch ideas ('a beach weekend'). What sounds right?",
  };
}
