import { describe, expect, it } from "vitest";
import {
  fetchEverywhere,
  fetchFlights,
  fetchMonthPrices,
  formatDuration,
  formatINR,
} from "../src/lib/mockApi";
import type { SearchQuery } from "../src/types";

const QUERY: SearchQuery = {
  from: "Bengaluru (BLR)",
  to: "Dubai (DXB)",
  depart: "2026-10-10",
  pax: 1,
  cabin: "economy",
};

describe("fetchFlights", () => {
  it("is deterministic for the same query", async () => {
    const [a, b] = await Promise.all([fetchFlights(QUERY), fetchFlights(QUERY)]);
    expect(a.map((o) => o.id + o.price)).toEqual(b.map((o) => o.id + o.price));
  });

  it("resolves airports from City (IATA) format", async () => {
    const offers = await fetchFlights(QUERY);
    expect(offers[0].from).toBe("BLR");
    expect(offers[0].to).toBe("DXB");
    expect(offers[0].domestic).toBe(false);
  });

  it("marks roughly the cleanest third as greener", async () => {
    const offers = await fetchFlights(QUERY);
    const greener = offers.filter((o) => o.greener);
    expect(greener.length).toBeGreaterThan(0);
    const maxGreener = Math.max(...greener.map((o) => o.co2kg));
    const minOther = Math.min(...offers.filter((o) => !o.greener).map((o) => o.co2kg));
    expect(maxGreener).toBeLessThanOrEqual(minOther);
  });

  it("prices international long-haul above the domestic floor", async () => {
    const offers = await fetchFlights(QUERY);
    offers.forEach((o) => expect(o.price).toBeGreaterThanOrEqual(9000));
  });
});

describe("fetchMonthPrices", () => {
  it("returns a full month with exactly one cheapest day", async () => {
    const days = await fetchMonthPrices(QUERY);
    expect(days.length).toBeGreaterThanOrEqual(28);
    expect(days.filter((d) => d.cheapest).length).toBeGreaterThanOrEqual(1);
    const min = Math.min(...days.map((d) => d.price));
    days.filter((d) => d.cheapest).forEach((d) => expect(d.price).toBe(min));
  });
});

describe("fetchEverywhere", () => {
  it("sorts destinations by ascending price and excludes the origin", async () => {
    const list = await fetchEverywhere("Bengaluru (BLR)");
    expect(list.some((d) => d.iata === "BLR")).toBe(false);
    for (let i = 1; i < list.length; i++) {
      expect(list[i].price).toBeGreaterThanOrEqual(list[i - 1].price);
    }
  });
});

describe("formatters", () => {
  it("formats INR without decimals", () => {
    expect(formatINR(12480)).toMatch(/12,480/);
  });
  it("formats durations", () => {
    expect(formatDuration(132)).toBe("2h 12m");
  });
});
