import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2, Circle, Sparkles, Clock, BookOpen, ExternalLink,
  AlertTriangle, Lightbulb, Trophy,
} from "lucide-react";
import { PageShell, PageHeader, Callout, ComplexityBadge } from "@/components/Callout";
import { CodeBlock } from "@/components/CodeBlock";
import { TreeVisualizer } from "@/components/TreeVisualizer";
import { TreePlayground } from "@/components/TreePlayground";
import {
  BinaryTreePlayground, CompleteBinaryTreeViz, PerfectBinaryTreeViz,
  FullBinaryTreeViz, BalancedTreeViz, DegenerateTreeViz,
  AVLPlayground, RedBlackPlayground, TriePlayground,
  SegmentTreePlayground, FenwickTreeViz, TraversalPlayer, MemoryDiagram,
} from "@/components/trees/Visualizers";
import { CoursePrevNext } from "@/components/CoursePrevNext";
import { useLessonProgress } from "@/lib/lesson-progress";
import type { TLesson, TSection, TQuizItem } from "@/lib/trees/types";
import { T_FOUNDATIONS } from "@/lib/trees/foundations";
import { T_ALGORITHMS } from "@/lib/trees/algorithms";
import { T_REVISION } from "@/lib/trees/revision";
import { TREE_VARIANTS } from "@/lib/trees/variants";

type Tier =
  | { kind: "foundations"; title: string; lessons: TLesson[] }
  | { kind: "algorithms"; title: string; lessons: TLesson[] }
  | { kind: "revision"; title: string; lessons: TLesson[] }
  | { kind: "variant"; title: string; lessons: TLesson[] };

const TIERS: Record<string, Tier> = {
  foundations: { kind: "foundations", title: "Foundations", lessons: T_FOUNDATIONS },
  algorithms: { kind: "algorithms", title: "Tree Algorithms", lessons: T_ALGORITHMS },
  revision: { kind: "revision", title: "Review & Practice", lessons: T_REVISION },
  ...Object.fromEntries(TREE_VARIANTS.map((v) => [v.slug, { kind: "variant", title: v.title, lessons: v.lessons } as Tier])),
};

type Resolved = { tierKey: string; tierTitle: string; lesson: TLesson };

function resolvePath(splat: string): Resolved | undefined {
  const parts = splat.split("/").filter(Boolean);
  if (parts.length !== 2) return undefined;
  const [a, b] = parts;
  const tier = TIERS[a];
  if (!tier) return undefined;
  const lesson = tier.lessons.find((l) => l.slug === b);
  return lesson ? { tierKey: a, tierTitle: tier.title, lesson } : undefined;
}

export const Route = createFileRoute("/trees/$")({
  beforeLoad: ({ params }) => {
    const splat = (params as { _splat?: string })._splat ?? "";
    if (!resolvePath(splat)) throw notFound();
  },
  loader: ({ params }) => params,
  head: ({ params }) => {
    const splat = (params as { _splat?: string })._splat ?? "";
    const r = resolvePath(splat);
    const title = r
      ? `${r.lesson.title} — Trees — DSA with Python`
      : "Trees — DSA with Python";
    return {
      meta: [
        { title },
        { name: "description", content: r?.lesson.description ?? "Trees in Python — foundations, variants, algorithms, and review." },
        { property: "og:title", content: title },
        { property: "og:description", content: r?.lesson.description ?? "" },
      ],
    };
  },
  component: TreesLessonPage,
});

function TreesLessonPage() {
  const params = Route.useLoaderData() as { _splat?: string };
  const splat = params._splat ?? "";
  const r = resolvePath(splat)!;
  const data = r.lesson;

  const eyebrow = data.eyebrow ?? r.tierTitle;
  const progressKey = `${r.tierKey}/${data.slug}`;

  const { isDone, toggle } = useLessonProgress();
  const done = isDone("trees", progressKey);
  const diffColor =
    data.difficulty === "Beginner"
      ? "bg-emerald-500/15 text-emerald-500 border-emerald-500/30"
      : data.difficulty === "Intermediate"
        ? "bg-amber-500/15 text-amber-500 border-amber-500/30"
        : "bg-rose-500/15 text-rose-500 border-rose-500/30";

  return (
    <PageShell>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-[color:var(--brand)]" />
          Trees · Lesson
        </div>
        <PageHeader eyebrow={eyebrow} title={data.title} description={data.description} />

        <div className="-mt-6 mb-8 flex flex-wrap items-center gap-3 text-sm">
          <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium ${diffColor}`}>
            {data.difficulty}
          </span>
          <span className="inline-flex items-center gap-1 text-muted-foreground">
            <Clock className="h-3.5 w-3.5" /> {data.readMinutes} min read
          </span>
          <button
            onClick={() => toggle("trees", progressKey)}
            className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium transition ${
              done
                ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                : "gradient-brand text-primary-foreground"
            }`}
          >
            {done ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Circle className="h-3.5 w-3.5" />}
            {done ? "Completed" : "Mark complete"}
          </button>
          <Link to="/learn/$course" params={{ course: "trees" }}
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
            <BookOpen className="h-3.5 w-3.5" /> Course outline
          </Link>
        </div>
      </motion.div>

      <div className="space-y-6">
        {data.sections.map((s, i) => <SectionRenderer key={i} s={s} />)}
      </div>

      <CoursePrevNext courseSlug="trees" lessonSlug={progressKey} />
    </PageShell>
  );
}

function SectionRenderer({ s }: { s: TSection }) {
  switch (s.type) {
    case "heading":
      return <h2 className="mt-8 text-2xl font-semibold">{s.text}</h2>;
    case "theory":
      return (
        <div className="space-y-3 text-[15px] leading-relaxed text-muted-foreground">
          {s.text && <p>{s.text}</p>}
          {s.bullets && (
            <ul className="list-disc space-y-1 pl-6">
              {s.bullets.map((b, i) => <li key={i}>{b}</li>)}
            </ul>
          )}
        </div>
      );
    case "tree":
      return (
        <TreeVisualizer
          root={s.root}
          caption={s.caption}
          path={s.path}
          minHeight={s.minHeight}
        />
      );
    case "playground":
      return (
        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[color:var(--brand)]">Interactive Playground</h3>
          <TreePlayground />
        </div>
      );
    case "binaryPlayground":     return <BinaryTreePlayground />;
    case "completeViz":          return <CompleteBinaryTreeViz count={s.count} />;
    case "perfectViz":           return <PerfectBinaryTreeViz levels={s.levels} />;
    case "fullViz":              return <FullBinaryTreeViz />;
    case "balancedViz":          return <BalancedTreeViz />;
    case "degenerateViz":        return <DegenerateTreeViz />;
    case "avlPlayground":        return <AVLPlayground />;
    case "rbPlayground":         return <RedBlackPlayground />;
    case "triePlayground":       return <TriePlayground seed={s.seed} />;
    case "segTree":              return <SegmentTreePlayground data={s.data} />;
    case "fenwick":              return <FenwickTreeViz data={s.data} />;
    case "traversalPlayer":      return <TraversalPlayer root={s.root} mode={s.mode} />;
    case "memoryDiagram":        return <MemoryDiagram nodes={s.nodes} caption={s.caption} />;
    case "code":
      return (
        <div>
          <CodeBlock code={s.code} title={s.title ?? "python"} />
          {s.explanation && <p className="mt-2 text-sm text-muted-foreground">{s.explanation}</p>}
        </div>
      );
    case "dryRun":
      return (
        <div>
          <div className="overflow-hidden rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>{s.headers.map((h) => <th key={h} className="px-4 py-2 text-left font-semibold">{h}</th>)}</tr>
              </thead>
              <tbody>
                {s.rows.map((r, i) => (
                  <tr key={i} className="border-t border-border">
                    {r.map((c, j) => (
                      <td key={j} className="px-4 py-2 font-mono text-xs text-muted-foreground">{c}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {s.caption && <p className="mt-2 text-xs italic text-muted-foreground">{s.caption}</p>}
        </div>
      );
    case "table":
      return (
        <div>
          <div className="overflow-hidden rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>{s.headers.map((h) => <th key={h} className="px-4 py-2 text-left font-semibold">{h}</th>)}</tr>
              </thead>
              <tbody>
                {s.rows.map((r, i) => (
                  <tr key={i} className="border-t border-border">
                    {r.map((c, j) => (
                      <td key={j} className="px-4 py-2 text-sm text-muted-foreground">{c}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {s.caption && <p className="mt-2 text-xs italic text-muted-foreground">{s.caption}</p>}
        </div>
      );
    case "complexity":
      return (
        <div>
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-[color:var(--brand)]">Complexity</h3>
          <div className="overflow-hidden rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-2 text-left">Operation</th>
                  <th className="px-4 py-2 text-left">Time</th>
                  <th className="px-4 py-2 text-left">Space</th>
                  <th className="px-4 py-2 text-left">Notes</th>
                </tr>
              </thead>
              <tbody>
                {s.rows.map((r, i) => (
                  <tr key={i} className="border-t border-border">
                    <td className="px-4 py-2">{r.op}</td>
                    <td className="px-4 py-2"><ComplexityText value={r.time} /></td>
                    <td className="px-4 py-2 font-mono text-xs text-muted-foreground">{r.space ?? "—"}</td>
                    <td className="px-4 py-2 text-xs text-muted-foreground">{r.note ?? ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    case "mistakes":
      return (
        <section>
          <h3 className="mb-3 inline-flex items-center gap-2 text-xl font-semibold">
            <AlertTriangle className="h-5 w-5 text-amber-500" /> Common Mistakes
          </h3>
          <ul className="space-y-2">
            {s.items.map((m, i) => (
              <li key={i} className="card-surface p-3 text-sm text-muted-foreground">{m}</li>
            ))}
          </ul>
        </section>
      );
    case "tip":
      return (
        <div className="card-surface flex gap-3 border-l-4 border-l-[color:var(--brand)] p-4">
          <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-[color:var(--brand)]" />
          <div>
            <div className="text-sm font-semibold">{s.title ?? "Tip"}</div>
            <div className="mt-1 text-sm text-muted-foreground">{s.text}</div>
          </div>
        </div>
      );
    case "callout":
      return <Callout kind={s.kind} title={s.title}>{s.text}</Callout>;
    case "quiz":
      return (
        <section>
          <h3 className="mb-3 inline-flex items-center gap-2 text-xl font-semibold">
            <Trophy className="h-5 w-5 text-amber-500" /> Quiz
          </h3>
          <div className="space-y-3">
            {s.items.map((q, i) => <QuizCard key={i} q={q} />)}
          </div>
        </section>
      );
    case "practice":
      return (
        <section>
          <h3 className="mb-3 text-xl font-semibold">Practice Problems</h3>
          <div className="space-y-5">
            {s.groups.map((g) => (
              <div key={g.level}>
                <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{g.level}</div>
                <ul className="space-y-2">
                  {g.items.map((p) => (
                    <li key={p.url}>
                      <a href={p.url} target="_blank" rel="noreferrer"
                        className="card-surface flex flex-wrap items-center justify-between gap-2 p-3 hover:border-[color:var(--brand)]/60 transition">
                        <div>
                          <div className="text-sm font-medium">{p.title}</div>
                          <div className="mt-0.5 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                            {p.pattern && <span>Pattern: {p.pattern}</span>}
                            {p.time && <span>~{p.time}</span>}
                          </div>
                        </div>
                        <span className={`rounded-md px-2 py-0.5 text-xs ${
                          p.difficulty === "Easy" ? "bg-emerald-500/15 text-emerald-500" :
                          p.difficulty === "Medium" ? "bg-amber-500/15 text-amber-500" :
                          "bg-rose-500/15 text-rose-500"
                        }`}>{p.difficulty}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      );
    case "references":
      return (
        <section>
          <h3 className="mb-3 text-xl font-semibold">References</h3>
          <ul className="grid gap-2 sm:grid-cols-2">
            {s.items.map((r) => (
              <li key={r.url}>
                <a href={r.url} target="_blank" rel="noreferrer"
                  className="card-surface flex items-center gap-2 p-3 text-sm hover:border-[color:var(--brand)]/60 transition">
                  <ExternalLink className="h-3.5 w-3.5 text-[color:var(--brand)]" />
                  <span className="truncate">{r.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      );
    case "interview":
      return (
        <section>
          <h3 className="mb-3 text-xl font-semibold">Interview Questions</h3>
          <ul className="grid gap-2 sm:grid-cols-2">
            {s.items.map((it, i) => (
              <li key={i} className="card-surface p-3 text-sm">{it}</li>
            ))}
          </ul>
        </section>
      );
  }
}

function ComplexityText({ value }: { value: string }) {
  const parts = value.split(/·|\|/).map((p) => p.trim()).filter(Boolean);
  if (parts.length === 1 && /^O\(/.test(parts[0])) return <ComplexityBadge value={parts[0]} />;
  if (parts.length > 1) {
    return (
      <div className="flex flex-wrap gap-1.5">
        {parts.map((p, i) => {
          const m = p.match(/O\([^)]+\)/);
          return m ? (
            <span key={i} className="inline-flex items-center gap-1 text-xs">
              <span className="text-muted-foreground">{p.replace(m[0], "").trim()}</span>
              <ComplexityBadge value={m[0]} />
            </span>
          ) : (
            <span key={i} className="text-xs">{p}</span>
          );
        })}
      </div>
    );
  }
  return <span className="font-mono text-xs">{value}</span>;
}

function QuizCard({ q }: { q: TQuizItem }) {
  const [pick, setPick] = useState<number | null>(null);
  const correct = pick === q.answer;
  return (
    <div className="card-surface p-4">
      <p className="font-medium">{q.q}</p>
      <div className="mt-3 grid gap-2">
        {q.choices.map((c, i) => {
          const chosen = pick === i;
          const isRight = q.answer === i;
          return (
            <button
              key={i}
              onClick={() => setPick(i)}
              className={`rounded-md border px-3 py-2 text-left text-sm transition ${
                pick == null
                  ? "border-border hover:border-[color:var(--brand)]/60"
                  : isRight
                    ? "border-emerald-500/60 bg-emerald-500/10"
                    : chosen
                      ? "border-rose-500/60 bg-rose-500/10"
                      : "border-border opacity-70"
              }`}
            >
              {c}
            </button>
          );
        })}
      </div>
      {pick != null && (
        <div className={`mt-3 text-sm ${correct ? "text-emerald-500" : "text-rose-500"}`}>
          {correct ? "Correct!" : "Not quite."} {q.explain}
        </div>
      )}
    </div>
  );
}
