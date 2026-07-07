import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Circle,
  Sparkles,
  Clock,
  BookOpen,
  ExternalLink,
  AlertTriangle,
  Lightbulb,
  Trophy,
} from "lucide-react";
import { PageShell, PageHeader, Callout, ComplexityBadge } from "@/components/Callout";
import { CodeBlock } from "@/components/CodeBlock";
import {
  GraphViz,
  BFSPlayer,
  DFSPlayer,
  AdjMatrixViz,
  AdjListViz,
  EdgeListViz,
  IncidenceMatrixViz,
  CsrViz,
  MemoryDiagram,
  DijkstraPlayer,
  BellmanFordPlayer,
  PrimPlayer,
  KruskalPlayer,
  TopoSortPlayer,
  UnionFindPlayground,
} from "@/components/graphs/Visualizers";
import { GraphPlayground } from "@/components/graphs/GraphPlayground";
import { CoursePrevNext } from "@/components/CoursePrevNext";
import { useLessonProgress } from "@/lib/lesson-progress";
import type { GLesson, GSection, TQuizItem } from "@/lib/graphs/types";
import { G_FOUNDATIONS } from "@/lib/graphs/foundations";
import { G_REPRESENTATIONS } from "@/lib/graphs/representations";
import { G_TRAVERSALS } from "@/lib/graphs/traversals";
import { G_ALGORITHMS } from "@/lib/graphs/algorithms";

type Tier = { kind: string; title: string; lessons: GLesson[] };

const TIERS: Record<string, Tier> = {
  foundations: { kind: "foundations", title: "Foundations", lessons: G_FOUNDATIONS },
  representations: { kind: "applications", title: "Representations", lessons: G_REPRESENTATIONS },
  traversals: { kind: "applications", title: "Traversals", lessons: G_TRAVERSALS },
  algorithms: { kind: "applications", title: "Algorithms", lessons: G_ALGORITHMS },
  // Graph Types / Review — populated in a later content pass.
};

type Resolved = { tierKey: string; tierTitle: string; lesson: GLesson };

function resolvePath(splat: string): Resolved | undefined {
  const parts = splat.split("/").filter(Boolean);
  if (parts.length !== 2) return undefined;
  const [a, b] = parts;
  const tier = TIERS[a];
  if (!tier) return undefined;
  const lesson = tier.lessons.find((l) => l.slug === b);
  return lesson ? { tierKey: a, tierTitle: tier.title, lesson } : undefined;
}

export const Route = createFileRoute("/graphs/$")({
  beforeLoad: ({ params }) => {
    const splat = (params as { _splat?: string })._splat ?? "";
    if (!resolvePath(splat)) throw notFound();
  },
  loader: ({ params }) => params,
  head: ({ params }) => {
    const splat = (params as { _splat?: string })._splat ?? "";
    const r = resolvePath(splat);
    const title = r ? `${r.lesson.title} — Graphs — DSA with Python` : "Graphs — DSA with Python";
    return {
      meta: [
        { title },
        {
          name: "description",
          content:
            r?.lesson.description ??
            "Graphs in Python — foundations, types, representations, traversals, and algorithms.",
        },
        { property: "og:title", content: title },
        { property: "og:description", content: r?.lesson.description ?? "" },
      ],
    };
  },
  component: GraphsLessonPage,
});

function GraphsLessonPage() {
  const params = Route.useLoaderData() as { _splat?: string };
  const splat = params._splat ?? "";
  const r = resolvePath(splat)!;
  const data = r.lesson;

  const eyebrow = data.eyebrow ?? r.tierTitle;
  const progressKey = `${r.tierKey}/${data.slug}`;

  const { isDone, toggle } = useLessonProgress();
  const done = isDone("graphs", progressKey);
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
          Graphs · Lesson
        </div>
        <PageHeader eyebrow={eyebrow} title={data.title} description={data.description} />

        <div className="-mt-6 mb-8 flex flex-wrap items-center gap-3 text-sm">
          <span
            className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium ${diffColor}`}
          >
            {data.difficulty}
          </span>
          <span className="inline-flex items-center gap-1 text-muted-foreground">
            <Clock className="h-3.5 w-3.5" /> {data.readMinutes} min read
          </span>
          <button
            onClick={() => toggle("graphs", progressKey)}
            className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium transition ${
              done
                ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                : "gradient-brand text-primary-foreground"
            }`}
          >
            {done ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Circle className="h-3.5 w-3.5" />}
            {done ? "Completed" : "Mark complete"}
          </button>
          <Link
            to="/graphs"
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <BookOpen className="h-3.5 w-3.5" /> Course overview
          </Link>
        </div>
      </motion.div>

      <div className="space-y-6">
        {data.sections.map((s, i) => (
          <SectionRenderer key={i} s={s} />
        ))}
      </div>

      <CoursePrevNext courseSlug="graphs" lessonSlug={progressKey} />
    </PageShell>
  );
}

function SectionRenderer({ s }: { s: GSection }) {
  switch (s.type) {
    case "heading":
      return <h2 className="mt-8 text-2xl font-semibold">{s.text}</h2>;
    case "theory":
      return (
        <div className="space-y-3 text-[15px] leading-relaxed text-muted-foreground">
          {s.text && <p>{s.text}</p>}
          {s.bullets && (
            <ul className="list-disc space-y-1 pl-6">
              {s.bullets.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          )}
        </div>
      );
    case "graphViz":
      return <GraphViz spec={s.spec} caption={s.caption} minHeight={s.minHeight} />;
    case "graphPlayground":
      return <GraphPlayground initial={s.seed} />;
    case "bfsPlayer":
      return <BFSPlayer spec={s.spec} start={s.start} caption={s.caption} />;
    case "dfsPlayer":
      return <DFSPlayer spec={s.spec} start={s.start} caption={s.caption} />;
    case "adjMatrixViz":
      return <AdjMatrixViz spec={s.spec} caption={s.caption} />;
    case "adjListViz":
      return <AdjListViz spec={s.spec} caption={s.caption} />;
    case "edgeListViz":
      return <EdgeListViz spec={s.spec} caption={s.caption} />;
    case "incidenceMatrixViz":
      return <IncidenceMatrixViz spec={s.spec} caption={s.caption} />;
    case "csrViz":
      return <CsrViz spec={s.spec} caption={s.caption} />;
    case "dijkstraPlayer":
      return <DijkstraPlayer spec={s.spec} start={s.start} caption={s.caption} />;
    case "bellmanFordPlayer":
      return <BellmanFordPlayer spec={s.spec} start={s.start} caption={s.caption} />;
    case "primPlayer":
      return <PrimPlayer spec={s.spec} start={s.start} caption={s.caption} />;
    case "kruskalPlayer":
      return <KruskalPlayer spec={s.spec} caption={s.caption} />;
    case "topoSortPlayer":
      return <TopoSortPlayer spec={s.spec} caption={s.caption} />;
    case "unionFindPlayground":
      return <UnionFindPlayground n={s.n} />;
    case "memoryDiagram":
      return <MemoryDiagram rows={s.rows} caption={s.caption} />;
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
                <tr>
                  {s.headers.map((h) => (
                    <th key={h} className="px-4 py-2 text-left font-semibold">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {s.rows.map((r, i) => (
                  <tr key={i} className="border-t border-border">
                    {r.map((c, j) => (
                      <td key={j} className="px-4 py-2 font-mono text-xs text-muted-foreground">
                        {c}
                      </td>
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
                <tr>
                  {s.headers.map((h) => (
                    <th key={h} className="px-4 py-2 text-left font-semibold">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {s.rows.map((r, i) => (
                  <tr key={i} className="border-t border-border">
                    {r.map((c, j) => (
                      <td key={j} className="px-4 py-2 text-sm text-muted-foreground">
                        {c}
                      </td>
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
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-[color:var(--brand)]">
            Complexity
          </h3>
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
                    <td className="px-4 py-2">
                      <ComplexityText value={r.time} />
                    </td>
                    <td className="px-4 py-2 font-mono text-xs text-muted-foreground">
                      {r.space ?? "—"}
                    </td>
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
              <li key={i} className="card-surface p-3 text-sm text-muted-foreground">
                {m}
              </li>
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
      return (
        <Callout kind={s.kind} title={s.title}>
          {s.text}
        </Callout>
      );
    case "quiz":
      return (
        <section>
          <h3 className="mb-3 inline-flex items-center gap-2 text-xl font-semibold">
            <Trophy className="h-5 w-5 text-amber-500" /> Quiz
          </h3>
          <div className="space-y-3">
            {s.items.map((q, i) => (
              <QuizCard key={i} q={q} />
            ))}
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
                <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {g.level}
                </div>
                <ul className="space-y-2">
                  {g.items.map((p) => (
                    <li key={p.url}>
                      <a
                        href={p.url}
                        target="_blank"
                        rel="noreferrer"
                        className="card-surface flex flex-wrap items-center justify-between gap-2 p-3 hover:border-[color:var(--brand)]/60 transition"
                      >
                        <div>
                          <div className="text-sm font-medium">{p.title}</div>
                          <div className="mt-0.5 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                            {p.pattern && <span>Pattern: {p.pattern}</span>}
                            {p.time && <span>~{p.time}</span>}
                          </div>
                        </div>
                        <span
                          className={`rounded-md px-2 py-0.5 text-xs ${
                            p.difficulty === "Easy"
                              ? "bg-emerald-500/15 text-emerald-500"
                              : p.difficulty === "Medium"
                                ? "bg-amber-500/15 text-amber-500"
                                : "bg-rose-500/15 text-rose-500"
                          }`}
                        >
                          {p.difficulty}
                        </span>
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
                <a
                  href={r.url}
                  target="_blank"
                  rel="noreferrer"
                  className="card-surface flex items-center gap-2 p-3 text-sm hover:border-[color:var(--brand)]/60 transition"
                >
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
              <li key={i} className="card-surface p-3 text-sm">
                {it}
              </li>
            ))}
          </ul>
        </section>
      );
  }
}

function ComplexityText({ value }: { value: string }) {
  const parts = value
    .split(/·|\|/)
    .map((p) => p.trim())
    .filter(Boolean);
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
            <span key={i} className="text-xs">
              {p}
            </span>
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
