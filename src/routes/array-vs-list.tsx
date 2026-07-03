import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHeader, Callout } from "@/components/Callout";
import { Section, ListVisualizer, makeItems } from "@/components/ListVisualizer";
import { CodeBlock } from "@/components/CodeBlock";
import { PrevNext } from "@/components/PrevNext";

export const Route = createFileRoute("/array-vs-list")({
  head: () => ({
    meta: [
      { title: "Array vs Python List — DSA with Python" },
      { name: "description", content: "How a Python list differs from a traditional fixed-size array." },
    ],
  }),
  component: Page,
});

const rows = [
  ["Size", "Fixed at creation", "Grows & shrinks dynamically"],
  ["Types", "Homogeneous (one type)", "Heterogeneous (any type)"],
  ["Memory", "Contiguous block of values", "Contiguous block of pointers"],
  ["Resizing", "Manual — allocate new array", "Automatic (over-allocation strategy)"],
  ["Mutability", "Values can change", "Values, size, and structure can change"],
  ["Performance", "Faster raw math", "Flexible, slightly higher overhead"],
  ["Typical use", "Numeric buffers, low-level code", "Everyday Python collections"],
];

function Page() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Concepts"
        title="Array vs Python List"
        description="They look similar, but under the hood they're very different beasts."
      />

      <Section title="Side by side">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="card-surface p-4">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              C-style Array
            </div>
            <ListVisualizer items={makeItems([10, 20, 30, 40])} showIndices />
            <div className="mt-2 text-xs text-muted-foreground">Same type, fixed size, values stored inline.</div>
          </div>
          <div className="card-surface p-4">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Python List
            </div>
            <ListVisualizer items={makeItems([10, "Hello", 3.14, true, null])} showIndices />
            <div className="mt-2 text-xs text-muted-foreground">Any type, dynamic size, slots hold pointers.</div>
          </div>
        </div>
      </Section>

      <Section title="Comparison table">
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="min-w-full text-sm">
            <thead className="bg-muted/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="p-3">Aspect</th>
                <th className="p-3">Array</th>
                <th className="p-3">Python List</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r[0]} className="border-t border-border">
                  <td className="p-3 font-medium">{r[0]}</td>
                  <td className="p-3 text-muted-foreground">{r[1]}</td>
                  <td className="p-3 text-muted-foreground">{r[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Under the hood: pointers, not values">
        <p>
          A Python list is essentially an array of <b>pointers</b>. Each slot in the list references an object stored
          somewhere else in memory. That's why a single list can hold an integer, a string, and another list at the
          same time.
        </p>
        <div className="card-surface p-5">
          <pre className="whitespace-pre-wrap text-xs leading-relaxed text-muted-foreground">
{`Memory Objects           Python List (array of refs)
┌───────────┐            ┌──────┬──────┬──────┬──────┐
│ int 10    │◀───────────│  •   │      │      │      │
├───────────┤            ├──────┼──────┼──────┼──────┤
│ str "hi"  │◀───────────│      │  •   │      │      │
├───────────┤            ├──────┼──────┼──────┼──────┤
│ float 3.14│◀───────────│      │      │  •   │      │
├───────────┤            ├──────┼──────┼──────┼──────┤
│ list [..] │◀───────────│      │      │      │  •   │
└───────────┘            └──────┴──────┴──────┴──────┘`}
          </pre>
        </div>
        <CodeBlock code={`mixed = [10, "hi", 3.14, [1, 2, 3]]\nfor item in mixed:\n    print(type(item))`} />
      </Section>

      <Callout kind="perf">
        Because slots are pointer-sized, indexing is still <b>O(1)</b> — the interpreter just jumps to the correct
        pointer and dereferences it.
      </Callout>

      <PrevNext current="/array-vs-list" />
    </PageShell>
  );
}
