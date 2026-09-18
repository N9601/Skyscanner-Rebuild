import { Leaf, MapPinned, Sparkles, TrendingDown } from "lucide-react";
import { SearchWidget } from "@/features/search/SearchWidget";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";

const HIGHLIGHTS = [
  {
    icon: TrendingDown,
    title: "Compare in one place",
    body: "Flights, stays, and cars across providers — no jumping between tabs.",
  },
  {
    icon: Leaf,
    title: "Greener Choice",
    body: "Surface lower-emission itineraries with a single toggle.",
  },
  {
    icon: Sparkles,
    title: "AI trip assistant",
    body: "Ask in plain language. Get a route, a plan, and price context.",
  },
  {
    icon: MapPinned,
    title: "Plan and save",
    body: "Build a trip plan, set price alerts, come back later.",
  },
];

export function HomePage() {
  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 to-transparent dark:from-brand-700/20">
        <div className="container flex flex-col gap-8 py-14 md:py-20">
          <div className="max-w-2xl">
            <h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
              Find your way, everywhere.
            </h1>
            <p className="mt-4 text-lg text-ink-muted dark:text-ink-inverse/70">
              Search flights, stays and cars across the web, plan your trip, and choose the greener
              option — all in one place.
            </p>
          </div>
          <SearchWidget />
        </div>
      </section>

      <section className="container py-14">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {HIGHLIGHTS.map(({ icon: Icon, title, body }) => (
            <Card key={title}>
              <CardHeader>
                <CardTitle className="text-base">{title}</CardTitle>
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-50 text-brand dark:bg-brand-700/20">
                  <Icon size={18} aria-hidden />
                </span>
              </CardHeader>
              <CardBody>{body}</CardBody>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
