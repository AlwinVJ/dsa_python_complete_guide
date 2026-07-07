import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { NAV_SECTIONS } from "@/lib/nav";

export function PrevNext({ current }: { current: string }) {
  const flat = NAV_SECTIONS.flatMap((s) => s.items);
  const idx = flat.findIndex((i) => i.to === current);
  const prev = idx > 0 ? flat[idx - 1] : null;
  const next = idx >= 0 && idx < flat.length - 1 ? flat[idx + 1] : null;
  return (
    <div className="mt-12 grid gap-3 border-t border-border pt-6 sm:grid-cols-2">
      {prev ? (
        <Link to={prev.to} className="card-surface p-4 hover:bg-accent transition">
          <div className="text-xs text-muted-foreground">← Previous</div>
          <div className="mt-1 font-medium">{prev.label}</div>
        </Link>
      ) : (
        <div />
      )}
      {next ? (
        <Link to={next.to} className="card-surface p-4 hover:bg-accent transition sm:text-right">
          <div className="text-xs text-muted-foreground">Next →</div>
          <div className="mt-1 font-medium inline-flex items-center gap-1 sm:justify-end">
            {next.label} <ChevronRight className="h-4 w-4" />
          </div>
        </Link>
      ) : (
        <div />
      )}
    </div>
  );
}
