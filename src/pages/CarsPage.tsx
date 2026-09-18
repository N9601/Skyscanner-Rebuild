import { Card, CardBody, CardTitle } from "@/components/ui/Card";

export function CarsPage() {
  return (
    <div className="container py-10">
      <h1 className="font-display text-3xl font-bold">Cars</h1>
      <p className="mt-1 text-sm text-ink-muted dark:text-ink-inverse/60">
        Rental cars by pickup location, vehicle class, and price.
      </p>
      <div className="mt-6">
        <Card>
          <CardTitle className="text-base">Coming next</CardTitle>
          <CardBody className="mt-2">Result cards and filter chips.</CardBody>
        </Card>
      </div>
    </div>
  );
}
