import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHeader, Callout } from "@/components/Callout";
import { Section, ListVisualizer, makeItems } from "@/components/ListVisualizer";
import { CodeBlock } from "@/components/CodeBlock";
import { PrevNext } from "@/components/PrevNext";

export const Route = createFileRoute("/introduction")({
  head: () => ({
    meta: [
      { title: "Introduction to Python Lists — DSA with Python" },
      { name: "description", content: "What is a Python list, why it matters, and how to think about it visually." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Getting started"
        title="Introduction to Python Lists"
        description="A list is Python's built-in, ordered, mutable, heterogeneous collection. Think of it as a numbered row of slots — each slot points to any Python object."
      />

      <Section title="A first look">
        <p>
          Lists are created with square brackets. Elements are separated by commas and can be of any type.
        </p>
        <ListVisualizer items={makeItems(["apple", "banana", "mango", "orange"])} showIndices />
        <CodeBlock code={`fruits = ["apple", "banana", "mango", "orange"]\nprint(fruits[0])   # apple\nprint(len(fruits)) # 4`} />
      </Section>

      <Section title="Key properties">
        <ul className="list-disc space-y-1 pl-6">
          <li><b>Ordered:</b> items keep their insertion position.</li>
          <li><b>Mutable:</b> you can change, add, and remove items in place.</li>
          <li><b>Indexed:</b> access items by position, starting at <code>0</code>.</li>
          <li><b>Heterogeneous:</b> different types can live in the same list.</li>
          <li><b>Dynamic:</b> the list grows and shrinks automatically.</li>
        </ul>
      </Section>

      <Callout kind="did" title="Did you know?">
        A Python list doesn't actually store your objects. It stores <b>references</b> (pointers) to objects that live
        elsewhere in memory. That's why lists can hold any type — every slot is just a pointer.
      </Callout>

      <Callout kind="perf">
        Appending to the end is <b>O(1)</b> amortized, but inserting at the start is <b>O(n)</b> because every other
        element has to shift over. Choose your operations accordingly.
      </Callout>

      <PrevNext current="/introduction" />
    </PageShell>
  );
}
