import { ArrowLeft } from "lucide-react";
import { useRouter, useRouterState } from "@tanstack/react-router";

/**
 * Derive a sensible parent route from a pathname when there is no browser
 * history to pop back to (e.g. the page was opened from a shared link).
 *
 *   /learn/arrays/introduction   -> /learn/arrays
 *   /learn/arrays                -> /learn
 *   /playgrounds/sorting         -> /playgrounds
 *   /trees/trie/introduction     -> /trees
 *   /complexity/time             -> /complexity
 *   /cheatsheet                  -> /
 */
function deriveParent(pathname: string): string {
  const clean = pathname.replace(/\/+$/, "");
  if (!clean || clean === "/") return "/";

  const parts = clean.split("/").filter(Boolean);

  // Playgrounds: every playground page falls back to the hub.
  if (parts[0] === "playgrounds") return "/playgrounds";

  // Learn: lesson -> course overview, course overview -> hub / home.
  if (parts[0] === "learn") {
    if (parts.length >= 3) return `/learn/${parts[1]}`;
    return "/";
  }

  // Module-scoped areas (trees, graphs, linked-lists, stacks, queues,
  // heaps, hash-tables) — fall back to the module landing page.
  const moduleRoots = new Set([
    "trees",
    "graphs",
    "linked-lists",
    "stacks",
    "queues",
    "heaps",
    "hash-tables",
    "modules",
    "algorithms",
    "complexity",
  ]);
  if (moduleRoots.has(parts[0]) && parts.length > 1) {
    return `/${parts[0]}`;
  }

  // Default: drop the last segment; if nothing left, go home.
  parts.pop();
  return parts.length ? `/${parts.join("/")}` : "/";
}

export function BackButton() {
  const router = useRouter();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  if (pathname === "/") return null;

  const handleClick = () => {
    const hasHistory =
      typeof window !== "undefined" && window.history.length > 1;
    if (hasHistory) {
      router.history.back();
      return;
    }
    router.navigate({ to: deriveParent(pathname) });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Go back to previous page"
      className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-accent hover:border-[color:var(--brand)] transition"
    >
      <ArrowLeft className="h-3.5 w-3.5" />
      Back
    </button>
  );
}
