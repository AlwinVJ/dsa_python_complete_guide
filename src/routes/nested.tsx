import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell, PageHeader, Callout } from "@/components/Callout";
import { Section } from "@/components/ListVisualizer";
import { CodeBlock } from "@/components/CodeBlock";
import { PrevNext } from "@/components/PrevNext";

export const Route = createFileRoute("/nested")({
  head: () => ({
    meta: [
      { title: "Nested Lists & Matrices — DSA with Python" },
      {
        name: "description",
        content: "2D lists visualized. Click a cell to see matrix[row][col].",
      },
    ],
  }),
  component: Page,
});

function Matrix() {
  const m = [
    [1, 2, 3, 4],
    [5, 6, 7, 8],
    [9, 10, 11, 12],
  ];
  const [sel, setSel] = useState<[number, number] | null>(null);
  return (
    <div className="card-surface p-4">
      <div
        className="inline-grid"
        style={{ gridTemplateColumns: `auto repeat(${m[0].length}, minmax(52px, 1fr))` }}
      >
        <div />
        {m[0].map((_, c) => (
          <div key={c} className="pb-2 text-center text-xs text-muted-foreground">
            {c}
          </div>
        ))}
        {m.map((row, r) => (
          <div key={`row-${r}`} className="contents">
            <div className="pr-2 text-right text-xs text-muted-foreground self-center">{r}</div>
            {row.map((v, c) => {
              const isSel = sel && sel[0] === r && sel[1] === c;
              const rowHi = sel && sel[0] === r;
              const colHi = sel && sel[1] === c;
              return (
                <button
                  key={`${r}-${c}`}
                  onClick={() => setSel([r, c])}
                  className={`m-0.5 h-14 rounded-md border font-mono text-lg transition ${
                    isSel
                      ? "border-[color:var(--brand)] bg-[color:var(--brand)]/25"
                      : rowHi || colHi
                        ? "border-[color:var(--brand)]/50 bg-[color:var(--brand)]/10"
                        : "border-border bg-card hover:bg-accent"
                  }`}
                >
                  {v}
                </button>
              );
            })}
          </div>
        ))}
      </div>
      {sel && (
        <div className="mt-4 rounded-md bg-muted p-3 font-mono text-sm">
          matrix[{sel[0]}][{sel[1]}] ={" "}
          <span className="text-[color:var(--brand)]">{m[sel[0]][sel[1]]}</span>
        </div>
      )}
    </div>
  );
}

function Page() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Advanced"
        title="Nested Lists"
        description="A list of lists is Python's default way to represent a matrix. Click any cell to see how row and column indices combine."
      />

      <Section title="Interactive matrix">
        <Matrix />
      </Section>

      <Section title="Creating a matrix safely">
        <CodeBlock
          code={`# Wrong — every row is the SAME list\nbad = [[0]*3]*3\nbad[0][0] = 9\n# bad -> [[9,0,0],[9,0,0],[9,0,0]]\n\n# Right — a fresh list per row\ngood = [[0]*3 for _ in range(3)]`}
        />
      </Section>

      <Section title="Iterating a matrix">
        <CodeBlock
          code={`matrix = [[1,2,3], [4,5,6], [7,8,9]]\n\nfor row in matrix:\n    for value in row:\n        print(value, end=" ")\n    print()`}
        />
      </Section>

      <Callout kind="perf">
        For heavy numeric work, reach for <code>numpy</code> — its arrays are contiguous, typed, and
        support vectorized operations that outperform nested Python lists by orders of magnitude.
      </Callout>

      <PrevNext current="/nested" />
    </PageShell>
  );
}
