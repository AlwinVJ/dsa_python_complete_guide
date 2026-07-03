import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageShell, PageHeader } from "@/components/Callout";
import { Section, ListVisualizer, makeItems } from "@/components/ListVisualizer";
import { CodeBlock } from "@/components/CodeBlock";
import { PrevNext } from "@/components/PrevNext";
import { Play, Pause, RotateCcw } from "lucide-react";

export const Route = createFileRoute("/traversing")({
  head: () => ({
    meta: [
      { title: "Traversing a List — DSA with Python" },
      { name: "description", content: "for, while, enumerate — animated iteration." },
    ],
  }),
  component: Page,
});

function Traverser() {
  const items = makeItems(["a", "b", "c", "d", "e", "f"]);
  const [i, setI] = useState(-1);
  const [running, setRunning] = useState(false);
  useEffect(() => {
    if (!running) return;
    const t = setTimeout(() => {
      setI((prev) => {
        if (prev >= items.length - 1) {
          setRunning(false);
          return prev;
        }
        return prev + 1;
      });
    }, 700);
    return () => clearTimeout(t);
  }, [running, i, items.length]);
  return (
    <div className="card-surface p-4">
      <ListVisualizer items={items} highlight={i >= 0 ? [i] : []} showIndices />
      <div className="mt-4 flex gap-2">
        <button
          onClick={() => setRunning((r) => !r)}
          className="inline-flex items-center gap-1.5 rounded-md gradient-brand px-3 py-1.5 text-sm text-primary-foreground"
        >
          {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {running ? "Pause" : "Run"}
        </button>
        <button
          onClick={() => {
            setI(-1);
            setRunning(false);
          }}
          className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-sm hover:bg-accent"
        >
          <RotateCcw className="h-4 w-4" /> Reset
        </button>
        <div className="ml-auto self-center font-mono text-sm text-muted-foreground">
          i = {i < 0 ? "—" : i}, value = {i < 0 ? "—" : `"${items[i].value}"`}
        </div>
      </div>
    </div>
  );
}

function Page() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Basics"
        title="Traversing"
        description="Four idiomatic ways to walk through a list. Hit Run to watch each element light up."
      />

      <Section title="Animated iteration">
        <Traverser />
      </Section>

      <Section title="for loop">
        <CodeBlock code={`for item in items:\n    print(item)`} />
      </Section>

      <Section title="while loop">
        <CodeBlock code={`i = 0\nwhile i < len(items):\n    print(items[i])\n    i += 1`} />
      </Section>

      <Section title="enumerate">
        <CodeBlock code={`for i, item in enumerate(items):\n    print(i, item)`} />
      </Section>

      <Section title="comprehension iteration">
        <CodeBlock code={`upper = [x.upper() for x in items]`} />
      </Section>

      <PrevNext current="/traversing" />
    </PageShell>
  );
}
