import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell, PageHeader, Callout } from "@/components/Callout";
import { Section, makeItems, type ListItem } from "@/components/ListVisualizer";
import { CodeBlock } from "@/components/CodeBlock";
import { PrevNext } from "@/components/PrevNext";
import { motion } from "framer-motion";

export const Route = createFileRoute("/accessing")({
  head: () => ({
    meta: [
      { title: "Accessing & Updating List Elements" },
      { name: "description", content: "Positive and negative indexing, plus in-place updates." },
    ],
  }),
  component: Page,
});

function IndexPicker({ items, negative }: { items: ListItem[]; negative?: boolean }) {
  const [selected, setSelected] = useState<number | null>(null);
  return (
    <div className="card-surface p-4">
      <div className="flex flex-wrap gap-2">
        {items.map((item, i) => {
          const displayIdx = negative ? -(items.length - i) : i;
          const active = selected === i;
          return (
            <button
              key={item.id}
              onClick={() => setSelected(i)}
              className={`flex flex-col items-center gap-1 rounded-md border p-2 transition ${
                active
                  ? "border-[color:var(--brand)] bg-[color:var(--brand)]/15"
                  : "border-border bg-card hover:bg-accent"
              }`}
            >
              <span className="text-xs text-muted-foreground">{displayIdx}</span>
              <motion.span
                animate={{ scale: active ? 1.1 : 1 }}
                className="font-mono text-lg font-semibold"
              >
                {String(item.value)}
              </motion.span>
            </button>
          );
        })}
      </div>
      {selected !== null && (
        <div className="mt-4 rounded-md bg-muted p-3 font-mono text-sm">
          items[{negative ? -(items.length - selected) : selected}] ={" "}
          <span className="text-[color:var(--brand)]">
            {typeof items[selected].value === "string"
              ? `"${items[selected].value}"`
              : String(items[selected].value)}
          </span>
        </div>
      )}
    </div>
  );
}

function Page() {
  const fruits = makeItems(["Apple", "Banana", "Mango", "Orange"]);
  return (
    <PageShell>
      <PageHeader
        eyebrow="Basics"
        title="Accessing & Updating Elements"
        description="Click any index below to see how positive and negative indexing pick out an element."
      />

      <Section title="Positive indexing">
        <p>
          Positive indices start at <code>0</code> and count forward.
        </p>
        <IndexPicker items={fruits} />
        <CodeBlock
          code={`fruits = ["Apple", "Banana", "Mango", "Orange"]\nprint(fruits[0])  # Apple\nprint(fruits[2])  # Mango`}
        />
      </Section>

      <Section title="Negative indexing">
        <p>
          Negative indices count from the end. <code>-1</code> is the last element.
        </p>
        <IndexPicker items={fruits} negative />
        <CodeBlock code={`print(fruits[-1])  # Orange\nprint(fruits[-2])  # Mango`} />
      </Section>

      <Section title="Updating elements">
        <p>Because lists are mutable, you can assign to any valid index.</p>
        <CodeBlock
          code={`numbers = [10, 20, 30, 40]\nnumbers[2] = 100\nprint(numbers)  # [10, 20, 100, 40]`}
        />
      </Section>

      <Callout kind="warn">
        Accessing an out-of-range index raises <code>IndexError</code>. Use <code>len(lst)</code> to
        check bounds, or catch it with <code>try / except</code>.
      </Callout>

      <PrevNext current="/accessing" />
    </PageShell>
  );
}
