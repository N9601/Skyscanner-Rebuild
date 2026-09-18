import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";

export function NotFoundPage() {
  return (
    <div className="container flex flex-col items-start gap-4 py-20">
      <p className="text-sm font-semibold text-brand">404</p>
      <h1 className="font-display text-4xl font-bold">This route doesn't exist.</h1>
      <p className="text-ink-muted dark:text-ink-inverse/70">
        The page you're looking for isn't here. Try one of the sections above.
      </p>
      <Link to="/">
        <Button>Back home</Button>
      </Link>
    </div>
  );
}
