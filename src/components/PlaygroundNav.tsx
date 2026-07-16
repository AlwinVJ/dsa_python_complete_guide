import { useRouter } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, ChevronLeft } from "lucide-react";

function SpaLink({
  to,
  className,
  children,
}: {
  to: string;
  className?: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  return (
    <a
      href={to}
      onClick={(e) => {
        e.preventDefault();
        router.navigate({ to });
      }}
      className={className}
    >
      {children}
    </a>
  );
}

export type PlaygroundNavKey =
  | "graph"
  | "sorting"
  | "searching"
  | "recursion"
  | "divide-conquer"
  | "backtracking"
  | "greedy"
  | "dp";


type Entry = {
  key: PlaygroundNavKey;
  label: string;
  moduleLabel: string;
  moduleHref: string;
  playgroundHref: string;
};

// Ordering used for prev / next algorithm navigation. Mirrors the
// Playground Hub sequence for the algorithm-flavoured playgrounds.
export const PLAYGROUND_ORDER: Entry[] = [
  {
    key: "graph",
    label: "Graph Playground",
    moduleLabel: "Graphs",
    moduleHref: "/graphs",
    playgroundHref: "/playgrounds/graph",
  },
  {
    key: "sorting",
    label: "Sorting Playground",
    moduleLabel: "Sorting Algorithms",
    moduleHref: "/learn/sorting-algorithms",
    playgroundHref: "/playgrounds/sorting",
  },
  {
    key: "searching",
    label: "Searching Playground",
    moduleLabel: "Searching Algorithms",
    moduleHref: "/learn/searching",
    playgroundHref: "/playgrounds/searching",
  },
  {
    key: "recursion",
    label: "Recursion Playground",
    moduleLabel: "Recursion",
    moduleHref: "/learn/recursion",
    playgroundHref: "/playgrounds/recursion",
  },
  {
    key: "divide-conquer",
    label: "Divide & Conquer Playground",
    moduleLabel: "Divide & Conquer",
    moduleHref: "/learn/divide-and-conquer",
    playgroundHref: "/playgrounds/divide-conquer",
  },
  {
    key: "backtracking",
    label: "Backtracking Playground",
    moduleLabel: "Backtracking",
    moduleHref: "/learn/backtracking",
    playgroundHref: "/playgrounds/backtracking",
  },
  {
    key: "greedy",
    label: "Greedy Playground",
    moduleLabel: "Greedy Algorithms",
    moduleHref: "/learn/greedy",
    playgroundHref: "/playgrounds/greedy",
  },
  {
    key: "dp",
    label: "Dynamic Programming Playground",
    moduleLabel: "Dynamic Programming",
    moduleHref: "/playgrounds/dp",
    playgroundHref: "/playgrounds/dp",
  },
];


// The DP module doesn't have a learn/* course route, so fall back to the hub.
const DP_MODULE_HREF = "/playgrounds";
const DP_MODULE_LABEL = "Playgrounds";

function resolveModule(entry: Entry) {
  if (entry.key === "dp") {
    return { moduleHref: DP_MODULE_HREF, moduleLabel: DP_MODULE_LABEL };
  }
  return { moduleHref: entry.moduleHref, moduleLabel: entry.moduleLabel };
}

/**
 * Top-left "Back" button — uses browser history when possible and falls back
 * to the module overview page. Rendered near the top of every playground.
 */
export function PlaygroundBackButton({ playground }: { playground: PlaygroundNavKey }) {
  const router = useRouter();
  const entry = PLAYGROUND_ORDER.find((p) => p.key === playground)!;
  const { moduleHref, moduleLabel } = resolveModule(entry);

  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined" && window.history.length > 1) {
      window.history.back();
    } else {
      router.navigate({ to: moduleHref });
    }
  };

  return (
    <div className="mb-4">
      <a
        href={moduleHref}
        onClick={onClick}
        className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground hover:bg-accent hover:text-foreground transition"
        aria-label={`Back to ${moduleLabel}`}
      >
        <ChevronLeft className="h-3.5 w-3.5" /> Back
      </a>
    </div>
  );
}

/**
 * Footer navigation — Back to Module + Prev / Next playground. Shared across
 * every playground so learners get a consistent journey.
 */
export function PlaygroundFooterNav({ playground }: { playground: PlaygroundNavKey }) {
  const idx = PLAYGROUND_ORDER.findIndex((p) => p.key === playground);
  const entry = PLAYGROUND_ORDER[idx];
  const prev = idx > 0 ? PLAYGROUND_ORDER[idx - 1] : null;
  const next = idx >= 0 && idx < PLAYGROUND_ORDER.length - 1 ? PLAYGROUND_ORDER[idx + 1] : null;
  const { moduleHref, moduleLabel } = resolveModule(entry);

  return (
    <div className="mt-10 border-t border-border pt-6">
      <div className="mb-4 flex justify-center">
        <SpaLink
          to={moduleHref}
          className="inline-flex items-center gap-1.5 rounded-md gradient-brand px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg hover:opacity-90 transition"
        >
          <ArrowLeft className="h-4 w-4" /> Back to {moduleLabel}
        </SpaLink>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {prev ? (
          <SpaLink
            to={prev.playgroundHref}
            className="card-surface p-4 hover:bg-accent transition"
          >
            <div className="text-xs text-muted-foreground">← Previous playground</div>
            <div className="mt-1 font-medium">{prev.label}</div>
          </SpaLink>
        ) : (
          <div />
        )}
        {next ? (
          <SpaLink
            to={next.playgroundHref}
            className="card-surface p-4 hover:bg-accent transition sm:text-right"
          >
            <div className="text-xs text-muted-foreground">Next playground →</div>
            <div className="mt-1 font-medium inline-flex items-center gap-1 sm:justify-end">
              {next.label} <ArrowRight className="h-4 w-4" />
            </div>
          </SpaLink>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
