import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Circle,
  ExternalLink,
  ListChecks,
} from "lucide-react";
import { Callout, ComplexityBadge, PageHeader, PageShell } from "@/components/Callout";
import { CodeBlock } from "@/components/CodeBlock";
import { AlgorithmPlayground } from "@/components/AlgorithmPlayground";
import {
  ALGO_BY_SLUG,
  ALGORITHMS,
  nextAlgorithm,
  prevAlgorithm,
  type Algorithm,
  type LeetProblem,
} from "@/lib/algorithms";
import { useLocalSet } from "@/lib/useLocalSet";

export const Route = createFileRoute("/algorithms/$slug")({
  loader: ({ params }) => {
    const algo = ALGO_BY_SLUG[params.slug];
    if (!algo) throw notFound();
    return { algo };
  },
  head: ({ loaderData }) => {
    const a = loaderData?.algo;
    if (!a) return {};
    return {
      meta: [
        { title: `${a.title} — Popular Algorithms` },
        { name: "description", content: a.tagline },
        { property: "og:title", content: `${a.title} — Popular Algorithms` },
        { property: "og:description", content: a.tagline },
      ],
    };
  },
  component: AlgorithmPage,
});

const PLAYGROUND_HINTS: Record<string, { input?: string; useParam?: boolean; paramLabel?: string; defaultParam?: number }> = {
  "two-pointers": { input: "1, 2, 4, 5, 7, 11, 15", useParam: true, paramLabel: "Target", defaultParam: 9 },
  "sliding-window": { input: "2, 1, 5, 1, 3, 2, 4, 1, 6", useParam: true, paramLabel: "Window k", defaultParam: 3 },
  "binary-search": { input: "1, 3, 5, 7, 9, 11, 13, 17, 21", useParam: true, paramLabel: "Target", defaultParam: 11 },
  "hash-map": { input: "3, 5, 2, 4, 8, 11", useParam: true, paramLabel: "Target", defaultParam: 7 },
  "kadane": { input: "-2, 1, -3, 4, -1, 2, 1, -5, 4" },
  "monotonic-stack": { input: "2, 1, 5, 6, 2, 3" },
  "prefix-sum": { input: "3, 1, 4, 1, 5, 9, 2, 6" },
  "linear-traversal": { input: "4, 8, 15, 16, 23, 42" },
};

function ProblemRow({ p, storageKey }: { p: LeetProblem; storageKey: string }) {
  const { has, toggle } = useLocalSet(storageKey);
  const done = has(p.id);
  const diffColor =
    p.difficulty === "Easy" ? "var(--good)" : p.difficulty === "Medium" ? "var(--warn)" : "var(--bad)";
  return (
    <div className={`flex items-start gap-3 rounded-lg border border-border bg-card p-3 transition ${done ? "opacity-70" : ""}`}>
      <button
        onClick={() => toggle(p.id)}
        className="mt-0.5 shrink-0 text-muted-foreground hover:text-[color:var(--good)]"
        aria-label={done ? "Mark as not done" : "Mark as done"}
      >
        {done ? <CheckCircle2 className="h-5 w-5 text-[color:var(--good)]" /> : <Circle className="h-5 w-5" />}
      </button>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <a
            href={p.url}
            target="_blank"
            rel="noreferrer"
            className={`text-sm font-semibold hover:text-[color:var(--brand)] ${done ? "line-through" : ""}`}
          >
            {p.id}. {p.title}
          </a>
          <span
            className="rounded border px-1.5 py-0.5 text-[10px] font-medium"
            style={{ borderColor: diffColor, color: diffColor, background: `color-mix(in oklab, ${diffColor} 12%, transparent)` }}
          >
            {p.difficulty}
          </span>
          {p.minutes && (
            <span className="rounded border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground">
              ~{p.minutes} min
            </span>
          )}
          <a
            href={p.url}
            target="_blank"
            rel="noreferrer"
            className="ml-auto text-muted-foreground hover:text-foreground"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
        {p.note && <div className="mt-1 text-xs text-muted-foreground">{p.note}</div>}
        {p.tags && p.tags.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1">
            {p.tags.map((t) => (
              <span key={t} className="rounded bg-accent px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                {t}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function AlgorithmPage() {
  const data = Route.useLoaderData() as { algo: Algorithm };
  const algo = data.algo;
  const prev = prevAlgorithm(algo.slug);
  const next = nextAlgorithm(algo.slug);
  const hint = PLAYGROUND_HINTS[algo.slug] ?? {};

  const easy = algo.leetcode.filter((p) => p.difficulty === "Easy");
  const medium = algo.leetcode.filter((p) => p.difficulty === "Medium");
  const hard = algo.leetcode.filter((p) => p.difficulty === "Hard");

  const storageKey = `algo:done:${algo.slug}`;
  const { size: doneCount } = useLocalSet(storageKey);
  const pct = algo.leetcode.length ? Math.round((doneCount / algo.leetcode.length) * 100) : 0;

  return (
    <PageShell>
      <div className="mb-4 text-xs text-muted-foreground">
        <Link to="/algorithms" className="hover:text-foreground">Popular Algorithms</Link>
        <span className="mx-1">/</span>
        <span>{algo.title}</span>
      </div>

      <PageHeader
        eyebrow={`${algo.number.toString().padStart(2, "0")} · ${algo.category}`}
        title={algo.title}
        description={algo.tagline}
      />

      {/* Complexity strip */}
      <div className="mb-8 flex flex-wrap items-center gap-3 rounded-lg border border-border bg-card p-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Complexity</span>
        {algo.complexity.best && (
          <span className="flex items-center gap-1 text-xs">Best <ComplexityBadge value={algo.complexity.best} /></span>
        )}
        {algo.complexity.average && (
          <span className="flex items-center gap-1 text-xs">Avg <ComplexityBadge value={algo.complexity.average} /></span>
        )}
        {algo.complexity.worst && (
          <span className="flex items-center gap-1 text-xs">Worst <ComplexityBadge value={algo.complexity.worst} /></span>
        )}
        {algo.complexity.space && (
          <span className="flex items-center gap-1 text-xs">Space <ComplexityBadge value={algo.complexity.space} /></span>
        )}
      </div>

      {/* Why + recognition */}
      <section className="mb-10">
        <h2 className="mb-2 text-xl font-semibold">Why this algorithm exists</h2>
        <p className="text-sm text-muted-foreground">{algo.whyItExists}</p>

        <h3 className="mt-6 mb-2 flex items-center gap-2 text-sm font-semibold">
          <ListChecks className="h-4 w-4 text-[color:var(--brand)]" />
          Recognition checklist
        </h3>
        <ul className="space-y-1 text-sm">
          {algo.recognition.map((r, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--brand)]" />
              <span>{r}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Intuition */}
      <section className="mb-10">
        <h2 className="mb-2 text-xl font-semibold">Intuition</h2>
        <p className="text-sm text-muted-foreground">{algo.intuition}</p>
      </section>

      {/* Playground */}
      <section className="mb-10">
        <h2 className="mb-3 text-xl font-semibold">Interactive playground</h2>
        <AlgorithmPlayground
          playgroundKey={algo.playground ?? algo.slug}
          defaultInput={hint.input ?? "3, 1, 4, 1, 5, 9, 2, 6"}
          useParam={hint.useParam}
          paramLabel={hint.paramLabel}
          defaultParam={hint.defaultParam ?? 7}
        />
      </section>

      {/* Code samples */}
      <section className="mb-10">
        <h2 className="mb-3 text-xl font-semibold">Python implementation</h2>
        {algo.code.map((c, i) => (
          <div key={i}>
            <div className="mt-4 mb-1 text-sm font-semibold text-[color:var(--brand)]">{c.label}</div>
            {c.note && <p className="mb-2 text-xs text-muted-foreground">{c.note}</p>}
            <CodeBlock code={c.code} title={`${algo.slug}.py`} />
          </div>
        ))}
      </section>

      {/* Dry run */}
      {algo.dryRun && (
        <section className="mb-10">
          <h2 className="mb-3 text-xl font-semibold">Dry run</h2>
          <p className="mb-3 text-xs text-muted-foreground">
            Input: <span className="font-mono">[{algo.dryRun.array.join(", ")}]</span>
          </p>
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead className="bg-accent/50 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-3 py-2 text-left">Step</th>
                  <th className="px-3 py-2 text-left">State</th>
                  <th className="px-3 py-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {algo.dryRun.rows.map((r) => (
                  <tr key={r.step} className="border-t border-border">
                    <td className="px-3 py-2 font-mono">{r.step}</td>
                    <td className="px-3 py-2 font-mono">{r.state}</td>
                    <td className="px-3 py-2 text-muted-foreground">{r.action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Learning aids grid */}
      <section className="mb-10 grid gap-4 md:grid-cols-2">
        <Callout kind="warn" title="Common mistakes">
          <ul className="list-disc pl-5">
            {algo.commonMistakes.map((m, i) => (<li key={i}>{m}</li>))}
          </ul>
        </Callout>
        <Callout kind="info" title="Edge cases">
          <ul className="list-disc pl-5">
            {algo.edgeCases.map((m, i) => (<li key={i}>{m}</li>))}
          </ul>
        </Callout>
        <Callout kind="interview" title="Interview tips">
          <ul className="list-disc pl-5">
            {algo.interviewTips.map((m, i) => (<li key={i}>{m}</li>))}
          </ul>
        </Callout>
        <Callout kind="did" title="Real-world uses">
          <ul className="list-disc pl-5">
            {algo.realWorld.map((m, i) => (<li key={i}>{m}</li>))}
          </ul>
        </Callout>
        {algo.pythonTricks && algo.pythonTricks.length > 0 && (
          <Callout kind="tip" title="Python-specific tricks">
            <ul className="list-disc pl-5">
              {algo.pythonTricks.map((m, i) => (<li key={i}>{m}</li>))}
            </ul>
          </Callout>
        )}
        {algo.whenNot && algo.whenNot.length > 0 && (
          <Callout kind="perf" title="When NOT to use">
            <ul className="list-disc pl-5">
              {algo.whenNot.map((m, i) => (<li key={i}>{m}</li>))}
            </ul>
          </Callout>
        )}
      </section>

      {/* Related */}
      {algo.related.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-3 text-xl font-semibold">Related algorithms</h2>
          <div className="flex flex-wrap gap-2">
            {algo.related.map((slug) => {
              const rel = ALGO_BY_SLUG[slug];
              if (!rel) return null;
              return (
                <Link
                  key={slug}
                  to="/algorithms/$slug"
                  params={{ slug }}
                  className="rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium hover:border-[color:var(--brand)]"
                >
                  {rel.title}
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* LeetCode roadmap */}
      <section className="mb-10">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-semibold">LeetCode roadmap</h2>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span>{doneCount}/{algo.leetcode.length} solved</span>
            <div className="h-2 w-32 overflow-hidden rounded-full bg-accent">
              <motion.div
                className="h-full gradient-brand"
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
              />
            </div>
            <span className="font-mono">{pct}%</span>
          </div>
        </div>

        {[
          { title: "Beginner", items: easy },
          { title: "Intermediate", items: medium },
          { title: "Advanced", items: hard },
        ].map((group) =>
          group.items.length === 0 ? null : (
            <div key={group.title} className="mb-4">
              <div className="mb-2 text-sm font-semibold text-muted-foreground">{group.title}</div>
              <div className="grid gap-2">
                {group.items.map((p) => (
                  <ProblemRow key={p.id} p={p} storageKey={storageKey} />
                ))}
              </div>
            </div>
          ),
        )}
      </section>

      {/* Pagination */}
      <nav className="mt-12 flex items-center justify-between border-t border-border pt-6">
        {prev ? (
          <Link
            to="/algorithms/$slug"
            params={{ slug: prev.slug }}
            className="group flex flex-col rounded-md border border-border bg-card p-3 text-left hover:border-[color:var(--brand)]"
          >
            <span className="text-xs text-muted-foreground"><ArrowLeft className="mr-1 inline h-3 w-3" />Previous</span>
            <span className="text-sm font-semibold">{prev.title}</span>
          </Link>
        ) : <div />}
        {next ? (
          <Link
            to="/algorithms/$slug"
            params={{ slug: next.slug }}
            className="group flex flex-col rounded-md border border-border bg-card p-3 text-right hover:border-[color:var(--brand)]"
          >
            <span className="text-xs text-muted-foreground">Next <ArrowRight className="ml-1 inline h-3 w-3" /></span>
            <span className="text-sm font-semibold">{next.title}</span>
          </Link>
        ) : (
          <Link to="/algorithms" className="text-sm text-[color:var(--brand)] hover:underline">
            Back to overview
          </Link>
        )}
      </nav>

      <div className="mt-6 text-center text-xs text-muted-foreground">
        Algorithm {algo.number} of {ALGORITHMS.length}
      </div>
    </PageShell>
  );
}
