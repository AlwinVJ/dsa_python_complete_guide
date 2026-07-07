import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell, PageHeader, Callout, ComplexityBadge } from "@/components/Callout";
import { Section, ListVisualizer, makeItems, type ListItem } from "@/components/ListVisualizer";
import { CodeBlock } from "@/components/CodeBlock";
import { PrevNext } from "@/components/PrevNext";

export const Route = createFileRoute("/slicing")({
  head: () => ({
    meta: [
      { title: "List Slicing — DSA with Python" },
      {
        name: "description",
        content: "Master start:stop:step slicing, negatives, and reverse tricks.",
      },
    ],
  }),
  component: Page,
});

function SlicePlayground({ items }: { items: ListItem[] }) {
  const [start, setStart] = useState<string>("");
  const [stop, setStop] = useState<string>("");
  const [step, setStep] = useState<string>("");
  const s = start === "" ? undefined : Number(start);
  const e = stop === "" ? undefined : Number(stop);
  const st = step === "" ? 1 : Number(step) || 1;
  const arr = items.map((_, i) => i);
  const sliced = arr.slice().filter((_, __) => false); // placeholder
  // Use native slice logic
  const selected = new Set<number>();
  const src = items.map((_, i) => i);
  const result = ((): number[] => {
    // emulate Python slicing on indices
    const len = src.length;
    const stepN = st;
    let i =
      s === undefined
        ? stepN > 0
          ? 0
          : len - 1
        : s < 0
          ? Math.max(len + s, stepN > 0 ? 0 : -1)
          : Math.min(s, stepN > 0 ? len : len - 1);
    const j =
      e === undefined ? (stepN > 0 ? len : -1) : e < 0 ? Math.max(len + e, -1) : Math.min(e, len);
    const out: number[] = [];
    if (stepN > 0) for (; i < j; i += stepN) out.push(i);
    else for (; i > j; i += stepN) out.push(i);
    return out;
  })();
  result.forEach((r) => selected.add(r));
  void sliced;

  const py = `nums[${start}${stop !== "" || step !== "" ? ":" + stop : ""}${step !== "" ? ":" + step : ""}]`;

  return (
    <div className="card-surface p-4">
      <div className="mb-3 grid grid-cols-3 gap-2">
        {[
          { label: "start", v: start, set: setStart, ph: "0" },
          { label: "stop", v: stop, set: setStop, ph: String(items.length) },
          { label: "step", v: step, set: setStep, ph: "1" },
        ].map((c) => (
          <label key={c.label} className="text-xs text-muted-foreground">
            {c.label}
            <input
              value={c.v}
              onChange={(e) => c.set(e.target.value)}
              placeholder={c.ph}
              className="mt-1 w-full rounded-md border border-input bg-background px-2 py-1.5 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </label>
        ))}
      </div>
      <ListVisualizer items={items} highlight={Array.from(selected)} showIndices showNegative />
      <div className="mt-3 rounded-md bg-muted p-2 font-mono text-sm">
        <span className="text-muted-foreground">Python:</span> {py}
      </div>
    </div>
  );
}

function Page() {
  const items = makeItems([10, 20, 30, 40, 50, 60, 70, 80]);
  return (
    <PageShell>
      <PageHeader
        eyebrow="Basics"
        title="Slicing"
        description="Slicing takes a range: [start:stop:step]. Every part is optional — omit them for smart defaults."
      />

      <Section title="Interactive slice playground">
        <SlicePlayground items={items} />
      </Section>

      <Section title="Common patterns">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="card-surface p-4">
            <div className="mb-2 font-medium">First three</div>
            <CodeBlock code={`nums[:3]   # [10, 20, 30]`} />
          </div>
          <div className="card-surface p-4">
            <div className="mb-2 font-medium">Last three</div>
            <CodeBlock code={`nums[-3:]  # [60, 70, 80]`} />
          </div>
          <div className="card-surface p-4">
            <div className="mb-2 font-medium">Every second</div>
            <CodeBlock code={`nums[::2]  # [10, 30, 50, 70]`} />
          </div>
          <div className="card-surface p-4">
            <div className="mb-2 font-medium">Reversed</div>
            <CodeBlock code={`nums[::-1] # [80, 70, ..., 10]`} />
          </div>
        </div>
      </Section>

      <Callout kind="perf">
        Slicing creates a <b>new list</b> — that's <ComplexityBadge value="O(k)" /> where k is the
        slice length. If you only need to iterate, a <code>for</code> loop over the range is
        cheaper.
      </Callout>

      <PrevNext current="/slicing" />
    </PageShell>
  );
}
