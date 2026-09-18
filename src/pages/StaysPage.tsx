import { Card, CardBody, CardTitle } from "@/components/ui/Card";

export function StaysPage() {
  return (
    <div className="container py-10">
      <h1 className="font-display text-3xl font-bold">Stays</h1>
      <p className="mt-1 text-sm text-ink-muted dark:text-ink-inverse/60">
        Hotels and rentals, filterable by price, rating and location.
      </p>
      <div className="mt-6">
        <Card>
          <CardTitle className="text-base">Coming next</CardTitle>
          <CardBody className="mt-2">Result cards, filters, and an optional map view.</CardBody>
        </Card>
      </div>
    </div>
  );
}
