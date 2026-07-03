import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHeader, Callout } from "@/components/Callout";
import { Section } from "@/components/ListVisualizer";
import { CodeBlock } from "@/components/CodeBlock";
import { PrevNext } from "@/components/PrevNext";

export const Route = createFileRoute("/copying")({
  head: () => ({
    meta: [
      { title: "Copying Lists — Shallow vs Deep" },
      { name: "description", content: "Assignment, shallow copy, deep copy — visualized." },
    ],
  }),
  component: Page,
});

function Diagram({
  title,
  boxes,
}: {
  title: string;
  boxes: { label: string; items: (string | number)[]; color: string }[];
}) {
  return (
    <div className="card-surface p-5">
      <div className="mb-3 text-sm font-semibold">{title}</div>
      <div className="flex flex-wrap gap-4">
        {boxes.map((b) => (
          <div key={b.label} className="min-w-[160px]">
            <div className="mb-1 text-xs" style={{ color: b.color }}>{b.label}</div>
            <div className="flex gap-1 rounded-md border p-2" style={{ borderColor: b.color }}>
              {b.items.map((it, i) => (
                <div key={i} className="grid h-9 w-9 place-items-center rounded border border-border bg-background font-mono text-sm">
                  {it}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Page() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Advanced"
        title="Copying & Memory"
        description="Assignment is not a copy. Understand references, shallow copies, and deep copies before they bite you."
      />

      <Section title="1 · Assignment shares the same object">
        <Diagram
          title="a = [1,2,3]; b = a"
          boxes={[
            { label: "a  →", items: [1, 2, 3], color: "var(--brand)" },
            { label: "b  →  (same list)", items: [1, 2, 3], color: "var(--brand)" },
          ]}
        />
        <CodeBlock code={`a = [1, 2, 3]\nb = a\nb.append(4)\nprint(a)  # [1, 2, 3, 4]  <- both changed!`} />
      </Section>

      <Section title="2 · Shallow copy">
        <p>Creates a new outer list, but nested objects are still shared.</p>
        <Diagram
          title="b = a.copy()"
          boxes={[
            { label: "a", items: [1, 2, 3], color: "var(--good)" },
            { label: "b (new list)", items: [1, 2, 3], color: "var(--brand-2)" },
          ]}
        />
        <CodeBlock
          code={`import copy\n\na = [[1,2], [3,4]]\nb = a.copy()          # or list(a) or a[:]\nb[0].append(99)\nprint(a)  # [[1,2,99], [3,4]]  <- inner list is shared`}
        />
      </Section>

      <Section title="3 · Deep copy">
        <p>Recursively copies every nested object — fully independent.</p>
        <CodeBlock
          code={`import copy\n\na = [[1,2], [3,4]]\nb = copy.deepcopy(a)\nb[0].append(99)\nprint(a)  # [[1,2], [3,4]]  <- untouched`}
        />
      </Section>

      <Callout kind="warn">
        <b>Common bug:</b> Using <code>a.copy()</code> and expecting nested lists to be independent. For any nested
        structure, always use <code>copy.deepcopy()</code>.
      </Callout>

      <PrevNext current="/copying" />
    </PageShell>
  );
}
