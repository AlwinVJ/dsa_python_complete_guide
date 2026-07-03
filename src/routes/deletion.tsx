import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell, PageHeader, Callout, ComplexityBadge } from "@/components/Callout";
import { Section, ListVisualizer, makeItems, type ListItem } from "@/components/ListVisualizer";
import { CodeBlock } from "@/components/CodeBlock";
import { PrevNext } from "@/components/PrevNext";
import { Trash2 } from "lucide-react";

export const Route = createFileRoute("/deletion")({
  head: () => ({
    meta: [
      { title: "Deleting from a Python List" },
      { name: "description", content: "pop, remove, clear, del — every deletion pattern." },
    ],
  }),
  component: Page,
});

function DeletePlayground() {
  const [items, setItems] = useState<ListItem[]>(makeItems([10, 20, 30, 40, 50]));
  const [idx, setIdx] = useState("0");

  const popEnd = () => setItems((s) => s.slice(0, -1));
  const popAt = () => {
    const i = Math.max(0, Math.min(items.length - 1, Number(idx) || 0));
    setItems((s) => s.filter((_, k) => k !== i));
  };
  const clear = () => setItems([]);
  const reset = () => setItems(makeItems([10, 20, 30, 40, 50]));

  return (
    <div className="card-surface p-4">
      {items.length ? (
        <ListVisualizer items={items} showIndices />
      ) : (
        <div className="rounded-md border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          Empty list
        </div>
      )}
      <div className="mt-4 grid gap-2 sm:grid-cols-[1fr_auto_auto_auto_auto]">
        <input
          value={idx}
          onChange={(e) => setIdx(e.target.value)}
          placeholder="index"
          className="rounded-md border border-input bg-background px-3 py-1.5 font-mono text-sm"
        />
        <button onClick={popAt} className="inline-flex items-center gap-1 rounded-md gradient-brand px-3 py-1.5 text-sm text-primary-foreground">
          <Trash2 className="h-4 w-4" /> pop(i)
        </button>
        <button onClick={popEnd} className="rounded-md border border-border bg-card px-3 py-1.5 text-sm hover:bg-accent">
          pop()
        </button>
        <button onClick={clear} className="rounded-md border border-border bg-card px-3 py-1.5 text-sm hover:bg-accent">
          clear()
        </button>
        <button onClick={reset} className="rounded-md border border-border bg-card px-3 py-1.5 text-sm hover:bg-accent">
          reset
        </button>
      </div>
    </div>
  );
}

const ops = [
  {
    name: "pop()",
    desc: "Remove and return the last item. Fast because nothing needs shifting.",
    complexity: "O(1)",
    code: `nums = [1, 2, 3]\nlast = nums.pop()\n# last = 3, nums = [1, 2]`,
  },
  {
    name: "pop(i)",
    desc: "Remove and return the item at index i. Elements after it shift left.",
    complexity: "O(n)",
    code: `nums = [1, 2, 3, 4]\nx = nums.pop(1)\n# x = 2, nums = [1, 3, 4]`,
  },
  {
    name: "remove(x)",
    desc: "Remove the first occurrence of x. Raises ValueError if not found.",
    complexity: "O(n)",
    code: `nums = [1, 2, 3, 2]\nnums.remove(2)\n# [1, 3, 2]`,
  },
  {
    name: "clear()",
    desc: "Empty the list in place.",
    complexity: "O(n)",
    code: `nums.clear()\n# []`,
  },
  {
    name: "del",
    desc: "Statement — delete by index or slice.",
    complexity: "O(n)",
    code: `nums = [1, 2, 3, 4]\ndel nums[1]\n# [1, 3, 4]\ndel nums[:]  # like clear()`,
  },
  {
    name: "del slice",
    desc: "Delete a whole slice at once.",
    complexity: "O(n)",
    code: `nums = [1, 2, 3, 4, 5]\ndel nums[1:4]\n# [1, 5]`,
  },
];

function Page() {
  return (
    <PageShell>
      <PageHeader eyebrow="Operations" title="Deletion" description="Removing items — by index, by value, or all at once." />

      <Section title="Interactive playground">
        <DeletePlayground />
      </Section>

      <div className="grid gap-4 md:grid-cols-2">
        {ops.map((op) => (
          <div key={op.name} className="card-surface p-5">
            <div className="mb-2 flex items-center justify-between gap-3">
              <h3 className="font-mono text-lg font-semibold">{op.name}</h3>
              <ComplexityBadge value={op.complexity} />
            </div>
            <p className="mb-2 text-sm text-muted-foreground">{op.desc}</p>
            <CodeBlock code={op.code} />
          </div>
        ))}
      </div>

      <Callout kind="warn">
        Never delete items while iterating forward — you'll skip elements. Iterate over a copy (<code>for x in lst[:]</code>)
        or build a new list with a comprehension.
      </Callout>

      <PrevNext current="/deletion" />
    </PageShell>
  );
}
