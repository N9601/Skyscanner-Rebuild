import { Card, CardBody, CardTitle } from "@/components/ui/Card";

export function AlertsPage() {
  return (
    <div className="container py-10">
      <h1 className="font-display text-3xl font-bold">Price alerts</h1>
      <p className="mt-1 text-sm text-ink-muted dark:text-ink-inverse/60">
        Track a route and get notified when the mock price crosses your threshold.
      </p>
      <div className="mt-6">
        <Card>
          <CardTitle className="text-base">No alerts yet</CardTitle>
          <CardBody className="mt-2">Create one from any flights result card.</CardBody>
        </Card>
      </div>
    </div>
  );
}
