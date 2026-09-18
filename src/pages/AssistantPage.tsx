import { Sparkles } from "lucide-react";
import { Card, CardBody, CardTitle } from "@/components/ui/Card";

export function AssistantPage() {
  return (
    <div className="container py-10">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand text-white">
          <Sparkles size={20} aria-hidden />
        </span>
        <div>
          <h1 className="font-display text-3xl font-bold">AI assistant</h1>
          <p className="text-sm text-ink-muted dark:text-ink-inverse/60">
            Ask in plain language. Get a plan and a search.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_320px]">
        <Card>
          <CardTitle className="text-base">Chat panel</CardTitle>
          <CardBody className="mt-2">
            Intent router, scripted responses, and canned itineraries land here. Non-travel prompts
            get a polite refusal.
          </CardBody>
        </Card>
        <Card>
          <CardTitle className="text-base">Try asking</CardTitle>
          <CardBody className="mt-2">
            <ul className="list-disc space-y-1 pl-5">
              <li>Cheapest weekend from BLR under ₹8000</li>
              <li>3-day Goa trip in October</li>
              <li>Greener flights from DEL to BOM</li>
            </ul>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
