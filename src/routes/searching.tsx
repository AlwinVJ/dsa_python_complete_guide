import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { PageShell, PageHeader, Callout, ComplexityBadge } from "@/components/Callout";
import { Section, ListVisualizer, makeItems } from "@/components/ListVisualizer";
import { CodeBlock } from "@/components/CodeBlock";
import { PrevNext } from "@/components/PrevNext";
import { Play, RotateCcw } from "lucide-react";

export const Route = createFileRoute("/searching")({
  head: () => ({
    meta: [
      { title: "Searching a Python List" },
      { name: "description", content: "Linear search, in operator, index() and count() — animated." },
    ],
  }),
  component: Page,
});

function LinearSearch() {
  const items = makeItems([5, 12, 7, 3, 19, 8, 21, 4, 15]);
  const [target, setTarget] = useState("19");
  const [i, setI] = useState(-1);
  const [found, setFound] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stop = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  };

  const run = () => {
    stop();
    setI(-1);
    setFound(null);
    let k = 0;
    const t = Number(target);
    timerRef.current = setInterval(() => {
      if (k >= items.length) {
        stop();
        return;
      }
      setI(k);
      if (items[k].value === t) {
        setFound(k);
        stop();
      }
      k++;
    }, 500);
  };

  useEffect(() => () => stop(), []);

  return (
    <div className="card-surface p-4">
      <ListVisualizer
        items={items}
        highlight={found !== null ? [found] : []}
        compare={i >= 0 && found === null ? [i] : []}
        showIndices
      />
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <label className="text-sm text-muted-foreground">target</label>
        <input
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          className="w-24 rounded-md border border-input bg-background px-2 py-1.5 font-mono text-sm"
        />
        <button
          onClick={run}
          className="inline-flex items-center gap-1 rounded-md gradient-brand px-3 py-1.5 text-sm text-primary-foreground"
        >
          <Play className="h-4 w-4" /> Search
        </button>
        <button
          onClick={() => {
            stop();
            setI(-1);
            setFound(null);
          }}
          className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-3 py-1.5 text-sm hover:bg-accent"
        >
          <RotateCcw className="h-4 w-4" /> Reset
        </button>
        <div className="ml-auto text-sm text-muted-foreground">
          {found !== null ? (
            <>Found at index <b className="text-foreground">{found}</b></>
          ) : i >= 0 ? (
            <>Checking index {i}…</>
          ) : (
            <>Idle</>
          )}
        </div>
      </div>
    </div>
  );
}

function Page() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Operations"
        title="Searching"
        description="Lists are unordered by default, so most searches are linear — O(n)."
      />

      <Section title="Animated linear search">
        <LinearSearch />
        <CodeBlock
          code={`def linear_search(lst, target):\n    for i, x in enumerate(lst):\n        if x == target:\n            return i\n    return -1`}
        />
      </Section>

      <Section title="Membership: the in operator">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">Returns True/False. Also O(n) — scans until match or end.</p>
          <ComplexityBadge value="O(n)" />
        </div>
        <CodeBlock code={`5 in [1, 2, 3, 5]   # True\n"a" in ["b", "c"]   # False`} />
      </Section>

      <Section title="index(x)">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">Returns the position of the first x. Raises ValueError if missing.</p>
          <ComplexityBadge value="O(n)" />
        </div>
        <CodeBlock code={`["a", "b", "c", "b"].index("b")  # 1`} />
      </Section>

      <Section title="count(x)">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">Counts how many times x appears.</p>
          <ComplexityBadge value="O(n)" />
        </div>
        <CodeBlock code={`[1, 2, 2, 3, 2].count(2)  # 3`} />
      </Section>

      <Callout kind="perf">
        If you'll do many membership checks, convert to a <code>set</code> first. Set lookups are{" "}
        <ComplexityBadge value="O(1)" /> on average.
      </Callout>

      <PrevNext current="/searching" />
    </PageShell>
  );
}
