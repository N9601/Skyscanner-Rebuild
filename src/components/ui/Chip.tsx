import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

export function Chip({ active, className, ...props }: ChipProps) {
  return (
    <button
      type="button"
      className={cn(
        "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
        active
          ? "border-brand bg-brand text-white"
          : "border-black/10 bg-white text-ink hover:border-brand/50 hover:text-brand dark:border-white/15 dark:bg-surface-dark-muted dark:text-ink-inverse dark:hover:border-brand/60",
        className,
      )}
      {...props}
    />
  );
}
