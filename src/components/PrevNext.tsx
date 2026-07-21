import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { NAV_SECTIONS } from "@/lib/nav";

// Educational-flow overrides applied on top of the flat NAV_SECTIONS order.
// Use these to fix transitions that should follow the curriculum sequence
// rather than the (sometimes-legacy) sidebar ordering.
//
//   Arrays (last lesson /copying) → Linked Lists
//   Complexity module            → Arrays
//
type Override = { to: string; label: string };
const NEXT_OVERRIDES: Record<string, Override> = {
  "/copying": { to: "/modules/linked-lists", label: "Linked Lists — Overview" },
  "/complexity": { to: "/introduction", label: "Arrays — Introduction" },
  "/complexity/time": { to: "/complexity/space", label: "Space Complexity" },
  "/complexity/space": { to: "/introduction", label: "Arrays — Introduction" },
};

const PREV_OVERRIDES: Record<string, Override> = {
  "/introduction": { to: "/complexity", label: "Complexity Analysis" },
  "/complexity": { to: "/learn/introduction-to-dsa", label: "Introduction to DSA" },
};

export function PrevNext({ current }: { current: string }) {
  const flat = NAV_SECTIONS.flatMap((s) => s.items);
  const idx = flat.findIndex((i) => i.to === current);
  const defaultPrev = idx > 0 ? flat[idx - 1] : null;
  const defaultNext = idx >= 0 && idx < flat.length - 1 ? flat[idx + 1] : null;

  const prev = PREV_OVERRIDES[current] ?? defaultPrev;
  const next = NEXT_OVERRIDES[current] ?? defaultNext;

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
