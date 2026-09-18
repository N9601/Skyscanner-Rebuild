import { describe, expect, it } from "vitest";
import { routeIntent } from "../src/features/assistant/intentRouter";

describe("routeIntent", () => {
  it("parses a route and returns a search action", () => {
    const reply = routeIntent("bengaluru to goa");
    expect(reply.actions?.[0].to).toContain("/flights?");
    expect(reply.actions?.[0].to).toContain("BLR");
    expect(reply.actions?.[0].to).toContain("GOI");
  });

  it("handles budget queries with destination picks", () => {
    const reply = routeIntent("somewhere under ₹15,000");
    expect(reply.actions?.length).toBeGreaterThan(0);
  });

  it("suggests beach destinations for beach vibes", () => {
    const reply = routeIntent("i want a beach weekend");
    expect(reply.text.toLowerCase()).toContain("goa");
  });

  it("declines non-travel questions", () => {
    const reply = routeIntent("tell me a joke");
    expect(reply.actions).toBeUndefined();
    expect(reply.text).toContain("travel");
  });

  it("greets on hello", () => {
    const reply = routeIntent("hello");
    expect(reply.text.length).toBeGreaterThan(0);
  });
});
