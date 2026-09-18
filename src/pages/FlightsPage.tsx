import { useSearchParams } from "react-router-dom";
import { Card, CardBody, CardTitle } from "@/components/ui/Card";

export function FlightsPage() {
  const [params] = useSearchParams();
  const from = params.get("from") ?? "—";
  const to = params.get("to") ?? "—";
  const depart = params.get("depart") ?? "—";

  return (
    <div className="container py-10">
      <header className="mb-6">
        <p className="text-sm text-ink-muted dark:text-ink-inverse/60">Flights</p>
        <h1 className="font-display text-3xl font-bold">
          {from} → {to}
        </h1>
        <p className="mt-1 text-sm text-ink-muted dark:text-ink-inverse/60">Departing {depart}</p>
      </header>

      <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
        <aside aria-label="Filters" className="card space-y-4 p-4">
          <p className="text-sm font-semibold">Filters</p>
          <p className="text-xs text-ink-muted dark:text-ink-inverse/60">Stops, price, airlines, times — coming next.</p>
        </aside>
        <section aria-label="Results" className="space-y-3">
          <Card>
            <CardTitle className="text-base">Results will appear here</CardTitle>
            <CardBody className="mt-2">
              Mock results, filters, sort, and the price calendar strip land in the next iteration.
            </CardBody>
          </Card>
        </section>
      </div>
    </div>
  );
}
