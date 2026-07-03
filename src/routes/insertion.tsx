import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell, PageHeader, Callout, ComplexityBadge } from "@/components/Callout";
import { Section, ListVisualizer, makeItems, type ListItem } from "@/components/ListVisualizer";
import { CodeBlock } from "@/components/CodeBlock";
import { PrevNext } from "@/components/PrevNext";
import { Plus } from "lucide-react";

export const Route = createFileRoute("/insertion")({
  head: () => ({
    meta: [
      { title: "Inserting into a Python List" },
      { name: "description", content: "append, insert, extend and concatenation — animated." },
    ],
  }),
  component: Page,
});

function InsertPlayground() {
  const [items, setItems] = useState<ListItem[]>(makeItems([1, 2, 3, 4]));
  const [value, setValue] = useState("99");
  const [index, setIndex] = useState("0");

  const parsed = (() => {
    const n = Number(value);
    return Number.isNaN(n) ? value : n;
  })();

  const doAppend = () => setItems((s) => [...s, ...makeItems([parsed as never])]);
  const doInsert = () => {
    const i = Math.max(0, Math.min(items.length, Number(index) || 0));
    setItems((s) => {
      const copy = s.slice();
      copy.splice(i, 0, ...makeItems([parsed as never]));
      return copy;
    });
  };
  const doExtend = () =>
    setItems((s) => [...s, ...makeItems([parsed as never, "x", 42])]);
  const doReset = () => setItems(makeItems([1, 2, 3, 4]));

  return (
    <div className="card-surface p-4">
      <ListVisualizer items={items} showIndices />
      <div className="mt-4 grid gap-2 sm:grid-cols-[1fr_1fr_auto_auto_auto_auto]">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="value"
          className="rounded-md border border-input bg-background px-3 py-1.5 font-mono text-sm"
        />
        <input
          value={index}
          onChange={(e) => setIndex(e.target.value)}
          placeholder="index"
          className="rounded-md border border-input bg-background px-3 py-1.5 font-mono text-sm"
        />
        <button onClick={doAppend} className="inline-flex items-center gap-1 rounded-md gradient-brand px-3 py-1.5 text-sm text-primary-foreground">
          <Plus className="h-4 w-4" /> append
        </button>
        <button onClick={doInsert} className="rounded-md border border-border bg-card px-3 py-1.5 text-sm hover:bg-accent">
          insert
        </button>
        <button onClick={doExtend} className="rounded-md border border-border bg-card px-3 py-1.5 text-sm hover:bg-accent">
          extend
        </button>
        <button onClick={doReset} className="rounded-md border border-border bg-card px-3 py-1.5 text-sm hover:bg-accent">
          reset
        </button>
      </div>
    </div>
  );
}

function OpCard({
  name,
  desc,
  code,
  complexity,
}: {
  name: string;
  desc: string;
  code: string;
  complexity: string;
}) {
  return (
    <div className="card-surface p-5">
      <div className="mb-2 flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold font-mono">{name}</h3>
        <ComplexityBadge value={complexity} />
      </div>
      <p className="mb-2 text-sm text-muted-foreground">{desc}</p>
      <CodeBlock code={code} />
    </div>
  );
}

function Page() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Operations"
        title="Insertion"
        description="Five ways to add elements to a list — pick the one that matches your intent."
      />

      <Section title="Interactive playground">
        <InsertPlayground />
      </Section>

      <div className="grid gap-4 md:grid-cols-2">
        <OpCard
          name="append(x)"
          desc="Add a single item to the end. Fastest way to grow a list."
          complexity="O(1)"
          code={`nums = [1, 2, 3]\nnums.append(4)\n# [1, 2, 3, 4]`}
        />
        <OpCard
          name="insert(i, x)"
          desc="Insert x before index i. All later elements shift right by one."
          complexity="O(n)"
          code={`nums = [1, 2, 3]\nnums.insert(1, 99)\n# [1, 99, 2, 3]`}
        />
        <OpCard
          name="extend(iterable)"
          desc="Append every element from another iterable."
          complexity="O(k)"
          code={`nums = [1, 2]\nnums.extend([3, 4, 5])\n# [1, 2, 3, 4, 5]`}
        />
        <OpCard
          name="+="
          desc="Same as extend for lists — mutates in place."
          complexity="O(k)"
          code={`nums = [1, 2]\nnums += [3, 4]\n# [1, 2, 3, 4]`}
        />
        <OpCard
          name="+"
          desc="Concatenation returns a brand new list — the originals are unchanged."
          complexity="O(n + k)"
          code={`a = [1, 2]\nb = [3, 4]\nc = a + b   # [1, 2, 3, 4]`}
        />
      </div>

      <Callout kind="warn">
        <b>append vs extend:</b> <code>lst.append([1,2])</code> adds a nested list, while <code>lst.extend([1,2])</code>
        adds each element. Confusing them is one of the most common Python bugs.
      </Callout>

      <PrevNext current="/insertion" />
    </PageShell>
  );
}
