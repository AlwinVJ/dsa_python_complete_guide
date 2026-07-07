import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell, PageHeader, Callout } from "@/components/Callout";
import { Section, ListVisualizer, makeItems } from "@/components/ListVisualizer";
import { CodeBlock } from "@/components/CodeBlock";
import { PrevNext } from "@/components/PrevNext";

export const Route = createFileRoute("/creating")({
  head: () => ({
    meta: [
      { title: "Creating Python Lists — DSA with Python" },
      { name: "description", content: "Every way to create a Python list, visualized." },
    ],
  }),
  component: Page,
});

function Page() {
  const [input, setInput] = useState("1, 2, 3, hello, 3.14, True");
  const parsed = input
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => {
      if (s === "True") return true;
      if (s === "False") return false;
      if (s === "None") return null;
      const n = Number(s);
      if (!Number.isNaN(n) && s !== "") return n;
      return s;
    });

  return (
    <PageShell>
      <PageHeader
        eyebrow="Basics"
        title="Creating Lists"
        description="Six common patterns for building a list — and when to reach for each one."
      />

      <Section title="Try it: type values, see the list">
        <div className="card-surface p-4">
          <label className="mb-2 block text-xs font-medium text-muted-foreground">
            Comma-separated values
          </label>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="mb-4 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <ListVisualizer items={makeItems(parsed as never)} showIndices />
        </div>
      </Section>

      <Section title="1 · Literal syntax">
        <CodeBlock code={`numbers = [1, 2, 3]\nempty   = []`} />
      </Section>

      <Section title="2 · The list constructor">
        <CodeBlock
          code={`letters = list("abc")   # ['a', 'b', 'c']\nempty2  = list()        # []`}
        />
      </Section>

      <Section title="3 · From a range">
        <CodeBlock code={`nums = list(range(5))   # [0, 1, 2, 3, 4]`} />
      </Section>

      <Section title="4 · Nested lists (matrices)">
        <CodeBlock code={`matrix = [[1, 2], [3, 4]]`} />
      </Section>

      <Section title="5 · Repetition">
        <CodeBlock code={`zeros = [0] * 5   # [0, 0, 0, 0, 0]`} />
        <Callout kind="warn">
          <code>[[0]*3]*3</code> creates three references to the <b>same</b> inner list. Mutating
          one row mutates all. Use a comprehension instead: <code>[[0]*3 for _ in range(3)]</code>.
        </Callout>
      </Section>

      <Section title="6 · List comprehension">
        <CodeBlock code={`squares = [x*x for x in range(6)]  # [0, 1, 4, 9, 16, 25]`} />
      </Section>

      <PrevNext current="/creating" />
    </PageShell>
  );
}
