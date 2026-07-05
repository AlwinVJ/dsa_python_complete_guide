import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell, PageHeader, Callout, ComplexityBadge } from "@/components/Callout";
import { Section } from "@/components/ListVisualizer";
import { CodeBlock } from "@/components/CodeBlock";
import { PrevNext } from "@/components/PrevNext";
import { ALGORITHMS } from "@/lib/searching";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/searching")({
  head: () => ({
    meta: [
      { title: "Searching Algorithms — DSA with Python" },
      { name: "description", content: "Reference guide to 6 classic searching algorithms with Python implementations and complexity analysis." },
    ],
  }),
  component: Page,
});

function Page() {
  const [algoId, setAlgoId] = useState("linear");
  const algo = ALGORITHMS.find((a) => a.id === algoId)!;

  return (
    <PageShell>
      <PageHeader
        eyebrow="Algorithms"
        title="Searching Algorithms"
        description="A reference to 6 classic searching algorithms — how they work, when to use them, and their Python implementations."
      />

      <Callout kind="tip" title="Want to experiment with searching algorithms?">
        <p className="mb-3">
          The interactive step-by-step visualizer lives in the dedicated Searching Playground — pick an algorithm,
          tweak the array, set the target value, and watch comparison steps and intervals in real time.
        </p>
        <Link
          to="/playgrounds/searching"
          className="inline-flex items-center gap-1.5 rounded-md gradient-brand px-3 py-1.5 text-sm text-primary-foreground"
        >
          Open Searching Playground <ArrowRight className="h-4 w-4" />
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
            <div className="text-xs text-muted-foreground">Best Case</div>
            <div className="mt-1"><ComplexityBadge value={algo.timeBest} /></div>
          </div>
          <div className="card-surface p-3">
            <div className="text-xs text-muted-foreground">Average Case</div>
            <div className="mt-1"><ComplexityBadge value={algo.timeAvg} /></div>
          </div>
          <div className="card-surface p-3">
            <div className="text-xs text-muted-foreground">Worst Case</div>
            <div className="mt-1"><ComplexityBadge value={algo.timeWorst} /></div>
          </div>
          <div className="card-surface p-3">
            <div className="text-xs text-muted-foreground">Space Complexity</div>
            <div className="mt-1"><ComplexityBadge value={algo.space} /></div>
          </div>
          <div className="card-surface p-3">
            <div className="text-xs text-muted-foreground">Sorted Required</div>
            <div className="mt-1 text-sm">{algo.sortedRequired ? "Yes" : "No"}</div>
          </div>
          <div className="card-surface p-3">
            <div className="text-xs text-muted-foreground">Stable</div>
            <div className="mt-1 text-sm">{algo.stable ? "Yes" : "No"}</div>
          </div>
        </div>

        <div className="card-surface p-3.5">
          <div className="text-xs text-muted-foreground">Typical Use Case</div>
          <div className="mt-1 text-sm font-medium">{algo.typicalUseCase}</div>
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

        <CodeBlock code={algo.code} title={`${algo.id}_search.py`} />
      </Section>

      <Section title="Comparison Table">
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left font-medium">Algorithm</th>
                <th className="px-4 py-3 text-left font-medium">Sorted Required</th>
                <th className="px-4 py-3 text-left font-medium">Best Case</th>
                <th className="px-4 py-3 text-left font-medium">Average Case</th>
                <th className="px-4 py-3 text-left font-medium">Worst Case</th>
                <th className="px-4 py-3 text-left font-medium">Space</th>
                <th className="px-4 py-3 text-left font-medium">Stable</th>
                <th className="px-4 py-3 text-left font-medium">Typical Use Case</th>
              </tr>
            </thead>
            <tbody>
              {ALGORITHMS.map((a) => (
                <tr key={a.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3 font-semibold text-foreground">{a.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{a.sortedRequired ? "Yes" : "No"}</td>
                  <td className="px-4 py-3 font-mono text-[color:var(--brand)]">{a.timeBest}</td>
                  <td className="px-4 py-3 font-mono text-[color:var(--brand)]">{a.timeAvg}</td>
                  <td className="px-4 py-3 font-mono text-[color:var(--brand)]">{a.timeWorst}</td>
                  <td className="px-4 py-3 font-mono text-muted-foreground">{a.space}</td>
                  <td className="px-4 py-3 text-muted-foreground">{a.stable ? "Yes" : "No"}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground max-w-xs truncate" title={a.typicalUseCase}>
                    {a.typicalUseCase}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <PrevNext current="/searching" />
    </PageShell>
  );
}
