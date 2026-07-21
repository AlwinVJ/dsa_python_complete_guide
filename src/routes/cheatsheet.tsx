import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHeader } from "@/components/Callout";
import { PrevNext } from "@/components/PrevNext";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/cheatsheet")({
  head: () => ({
    meta: [
      { title: "Quick Revision — DSA Modules" },
      {
        name: "description",
        content:
          "Quick revision dashboard for every Data Structure and Algorithm module.",
      },
    ],
  }),
  component: Page,
});

type RevisionItem = { label: string };

const dataStructures: RevisionItem[] = [
  { label: "Arrays" },
  { label: "Linked Lists" },
  { label: "Stacks" },
  { label: "Queues" },
  { label: "Hash Tables" },
  { label: "Trees" },
  { label: "Heaps" },
  { label: "Tries" },
  { label: "Graphs" },
];

const algorithms: RevisionItem[] = [
  { label: "Searching" },
  { label: "Sorting" },
  { label: "Recursion" },
  { label: "Divide & Conquer" },
  { label: "Backtracking" },
  { label: "Dynamic Programming" },
  { label: "Greedy Algorithms" },
  { label: "Graph Algorithms" },
  { label: "String Algorithms" },
  { label: "Bit Manipulation" },
];

function ComingSoonCard({ label }: RevisionItem) {
  return (
    <div
      className="card-surface flex cursor-not-allowed items-center justify-between gap-3 p-4 opacity-60"
      aria-disabled="true"
    >
      <span className="font-medium text-muted-foreground">{label}</span>
      <Badge variant="secondary">Coming Soon</Badge>
    </div>
  );
}

function Page() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Reference"
        title="Quick Revision"
        description="Pick a module to review key concepts, formulas, and interview patterns."
      />

      <section className="space-y-8">
        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Data Structures
          </h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {dataStructures.map((item) => (
              <ComingSoonCard key={item.label} label={item.label} />
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Algorithms
          </h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {algorithms.map((item) => (
              <ComingSoonCard key={item.label} label={item.label} />
            ))}
          </div>
        </div>
      </section>

      <PrevNext current="/cheatsheet" />
    </PageShell>
  );
}
