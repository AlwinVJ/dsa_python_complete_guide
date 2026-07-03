import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, PageHeader } from "@/components/Callout";
import { ArrowUpDown, ArrowRight, Network } from "lucide-react";

export const Route = createFileRoute("/playgrounds/")({
  head: () => ({
    meta: [
      { title: "Playgrounds — DSA with Python" },
      { name: "description", content: "Interactive DSA playgrounds — experiment with sorting algorithms and more." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Playgrounds"
        title="Interactive Playgrounds"
        description="The central hub for hands-on DSA experimentation. Pick a playground, tweak inputs, and watch algorithms run step by step."
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          to="/playgrounds/sorting"
          className="card-surface group flex flex-col gap-3 p-5 transition hover:border-[color:var(--brand)]/60"
        >
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-md gradient-brand text-primary-foreground">
              <ArrowUpDown className="h-5 w-5" />
            </span>
            <div>
              <div className="text-base font-semibold">Sorting Playground</div>
              <div className="text-xs text-muted-foreground">11 algorithms · animations · stats</div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Bubble, Selection, Insertion, Merge, Quick, Heap, Counting, Radix, Bucket, Shell, and TimSort — each with
            step controls, live comparisons/swaps, and Python code.
          </p>
          <span className="mt-auto inline-flex items-center gap-1 text-sm font-medium text-[color:var(--brand)]">
            Launch playground <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </span>
        </Link>

        <Link
          to="/playgrounds/graph"
          className="card-surface group flex flex-col gap-3 p-5 transition hover:border-[color:var(--brand)]/60"
        >
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-md gradient-brand text-primary-foreground">
              <Network className="h-5 w-5" />
            </span>
            <div>
              <div className="text-base font-semibold">Graph Playground</div>
              <div className="text-xs text-muted-foreground">Build, drag, connect · live stats</div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Create vertices and edges on a canvas, toggle directed / weighted mode, drag nodes freely — live
            counts for V, E, components, density, and cycle detection.
          </p>
          <span className="mt-auto inline-flex items-center gap-1 text-sm font-medium text-[color:var(--brand)]">
            Launch playground <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </span>
        </Link>
      </div>

      <p className="mt-6 text-xs text-muted-foreground">
        More playgrounds (Arrays, Linked Lists, Trees, Hash Tables, …) will be added as the platform grows.
      </p>
    </PageShell>
  );
}
