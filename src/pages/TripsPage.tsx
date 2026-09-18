import { Card, CardBody, CardTitle } from "@/components/ui/Card";

export function TripsPage() {
  return (
    <div className="container py-10">
      <h1 className="font-display text-3xl font-bold">Trip plan</h1>
      <p className="mt-1 text-sm text-ink-muted dark:text-ink-inverse/60">
        Save flights, stays and cars into an itinerary. Persisted locally.
      </p>
      <div className="mt-6">
        <Card>
          <CardTitle className="text-base">Empty for now</CardTitle>
          <CardBody className="mt-2">Add items from results pages — they will show up here.</CardBody>
        </Card>
      </div>
    </div>
  );
}
