import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHeader, Callout, ComplexityBadge } from "@/components/Callout";
import { Section } from "@/components/ListVisualizer";
import { CodeBlock } from "@/components/CodeBlock";
import { PrevNext } from "@/components/PrevNext";

export const Route = createFileRoute("/methods")({
  head: () => ({
    meta: [
      { title: "Built-in List Methods — DSA with Python" },
      {
        name: "description",
        content: "Every method on the list class, with syntax, code, and complexity.",
      },
    ],
  }),
  component: Page,
});

const methods = [
  { name: "append(x)", desc: "Add x to the end.", complexity: "O(1)", code: `lst.append(10)` },
  {
    name: "extend(it)",
    desc: "Append every element of iterable.",
    complexity: "O(k)",
    code: `lst.extend([1,2,3])`,
  },
  {
    name: "insert(i, x)",
    desc: "Insert x at index i.",
    complexity: "O(n)",
    code: `lst.insert(0, "hi")`,
  },
  {
    name: "remove(x)",
    desc: "Remove first occurrence of x.",
    complexity: "O(n)",
    code: `lst.remove(3)`,
  },
  {
    name: "pop([i])",
    desc: "Remove and return item at i (default last).",
    complexity: "O(1) end / O(n) middle",
    code: `lst.pop()\nlst.pop(0)`,
  },
  { name: "clear()", desc: "Remove everything.", complexity: "O(n)", code: `lst.clear()` },
  { name: "index(x)", desc: "Position of first x.", complexity: "O(n)", code: `lst.index(5)` },
  {
    name: "count(x)",
    desc: "Number of times x appears.",
    complexity: "O(n)",
    code: `lst.count(2)`,
  },
  {
    name: "sort()",
    desc: "Sort in place. Uses TimSort.",
    complexity: "O(n log n)",
    code: `lst.sort()\nlst.sort(reverse=True)\nlst.sort(key=len)`,
  },
  { name: "reverse()", desc: "Reverse in place.", complexity: "O(n)", code: `lst.reverse()` },
  { name: "copy()", desc: "Return a shallow copy.", complexity: "O(n)", code: `new = lst.copy()` },
];

function Page() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Reference"
        title="Built-in List Methods"
        description="Every method available on Python's list class."
      />

      <Section title="Method reference">
        <div className="overflow-x-auto rounded-lg border border-border lg:overflow-visible">
          <table className="min-w-full text-sm">
            <thead className="bg-muted/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="p-3">Method</th>
                <th className="p-3">Description</th>
                <th className="p-3">Complexity</th>
              </tr>
            </thead>
            <tbody>
              {methods.map((m) => (
                <tr key={m.name} className="border-t border-border align-top">
                  <td className="p-3 font-mono">{m.name}</td>
                  <td className="p-3 text-muted-foreground">{m.desc}</td>
                  <td className="p-3">
                    <ComplexityBadge value={m.complexity.split(" ")[0]} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Handy examples">
        <CodeBlock
          code={`fruits = ["apple", "banana", "cherry"]\n\nfruits.append("date")            # ['apple','banana','cherry','date']\nfruits.insert(1, "blueberry")    # ['apple','blueberry','banana','cherry','date']\nfruits.remove("banana")          # first occurrence gone\nlast = fruits.pop()              # removes and returns 'date'\nfruits.sort()                    # in-place alphabetical\nfruits.reverse()                 # reversed in place\nprint(fruits.index("apple"))     # position of 'apple'`}
        />
      </Section>

      <Section title="sort v/s sorted">
        <p>
          <code>list.sort()</code> mutates the original list and returns <code>None</code>.{" "}
          <code>sorted(iterable)</code> returns a new list and leaves the original untouched.
        </p>
        <CodeBlock
          code={`nums = [3, 1, 2]\n\nresult = nums.sort()   # result = None, nums = [1, 2, 3]\nnew    = sorted(nums)  # new = [1, 2, 3], nums unchanged`}
        />
      </Section>

      <Callout kind="perf">
        Use the <code>key=</code> argument to sort by a custom criterion without writing a
        comparator: <code>words.sort(key=len)</code>.
      </Callout>

      <PrevNext current="/methods" />
    </PageShell>
  );
}
