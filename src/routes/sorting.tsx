import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell, PageHeader, Callout, ComplexityBadge } from "@/components/Callout";
import { Section } from "@/components/ListVisualizer";
import { CodeBlock } from "@/components/CodeBlock";
import { PrevNext } from "@/components/PrevNext";
import { ALGORITHMS } from "@/lib/sorting";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/sorting")({
  head: () => ({
    meta: [
      { title: "Sorting Algorithms — DSA with Python" },
      { name: "description", content: "Reference guide to 11 sorting algorithms with Python implementations and complexity analysis." },
    ],
  }),
  component: Page,
});

function Page() {
  const [algoId, setAlgoId] = useState("bubble");
  const algo = ALGORITHMS.find((a) => a.id === algoId)!;

  return (
    <PageShell>
      <PageHeader
        eyebrow="Advanced"
        title="Sorting Algorithms"
        description="A reference to 11 classic sorting algorithms — how they work, when to use them, and their Python implementations."
      />

      <Callout kind="tip" title="Want to experiment with sorting algorithms?">
        <p className="mb-3">
          The interactive step-by-step visualizer now lives in the dedicated Sorting Playground — pick an algorithm,
          tweak the array, and watch comparisons and swaps in real time.
        </p>
        <Link
          to="/playgrounds/sorting"
          className="inline-flex items-center gap-1.5 rounded-md gradient-brand px-3 py-1.5 text-sm text-primary-foreground"
        >
          Open Sorting Playground <ArrowRight className="h-4 w-4" />
        </Link>
      </Callout>

      <div className="mb-6 flex flex-wrap gap-2">
        {ALGORITHMS.map((a) => (
          <button
            key={a.id}
            onClick={() => setAlgoId(a.id)}
            className={`rounded-full border px-3 py-1 text-xs transition ${
              a.id === algoId
                ? "border-[color:var(--brand)] bg-[color:var(--brand)]/15 text-foreground"
                : "border-border bg-card text-muted-foreground hover:bg-accent"
            }`}
          >
            {a.name}
          </button>
        ))}
      </div>

      <Section title={algo.name}>
        <p>{algo.description}</p>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="card-surface p-3">
            <div className="text-xs text-muted-foreground">Best</div>
            <div className="mt-1"><ComplexityBadge value={algo.timeBest} /></div>
          </div>
          <div className="card-surface p-3">
            <div className="text-xs text-muted-foreground">Average</div>
            <div className="mt-1"><ComplexityBadge value={algo.timeAvg} /></div>
          </div>
          <div className="card-surface p-3">
            <div className="text-xs text-muted-foreground">Worst</div>
            <div className="mt-1"><ComplexityBadge value={algo.timeWorst} /></div>
          </div>
          <div className="card-surface p-3">
            <div className="text-xs text-muted-foreground">Space</div>
            <div className="mt-1"><ComplexityBadge value={algo.space} /></div>
          </div>
          <div className="card-surface p-3">
            <div className="text-xs text-muted-foreground">Stable</div>
            <div className="mt-1 text-sm">{algo.stable ? "Yes" : "No"}</div>
          </div>
          <div className="card-surface p-3">
            <div className="text-xs text-muted-foreground">In-place</div>
            <div className="mt-1 text-sm">{algo.inPlace ? "Yes" : "No"}</div>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="card-surface p-4">
            <div className="mb-2 text-sm font-semibold text-[color:var(--good)]">Advantages</div>
            <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
              {algo.advantages.map((x) => <li key={x}>{x}</li>)}
            </ul>
          </div>
          <div className="card-surface p-4">
            <div className="mb-2 text-sm font-semibold text-[color:var(--bad)]">Disadvantages</div>
            <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
              {algo.disadvantages.map((x) => <li key={x}>{x}</li>)}
            </ul>
          </div>
        </div>

        <div className="card-surface p-4">
          <div className="mb-2 text-sm font-semibold">Real-world applications</div>
          <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            {algo.applications.map((x) => <li key={x}>{x}</li>)}
          </ul>
        </div>

        <CodeBlock code={algo.code} title={`${algo.id}.py`} />
      </Section>

      <Callout kind="did" title="Why Python uses TimSort">
        TimSort was designed by Tim Peters in 2002 specifically for Python. It exploits the "runs" of already-sorted
        data that appear in real-world inputs — giving <ComplexityBadge value="O(n)" /> on nearly-sorted arrays while
        keeping <ComplexityBadge value="O(n log n)" /> as the worst case. It's now the default in Python, Java (for
        objects), Android, V8, and more.
      </Callout>

      <PrevNext current="/sorting" />
    </PageShell>
  );
}
