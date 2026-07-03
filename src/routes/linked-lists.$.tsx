import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2, Circle, Sparkles, Clock, BookOpen, ExternalLink,
  AlertTriangle, Lightbulb, Trophy,
} from "lucide-react";
import { PageShell, PageHeader, Callout, ComplexityBadge } from "@/components/Callout";
import { CodeBlock } from "@/components/CodeBlock";
import { LinkedListVisualizer, LinkedListMemory } from "@/components/LinkedListVisualizer";
import { LinkedListPlayground } from "@/components/LinkedListPlayground";
import { NodePlayground } from "@/components/playground/NodePlayground";
import { VariantComparisonTable } from "@/components/linked-lists/VariantComparisonTable";
import { CoursePrevNext } from "@/components/CoursePrevNext";
import { getLL, type LLSection, type LLQuizItem, type LLLesson } from "@/lib/linked-lists-content";
import { getSubtype, getSubtypeLesson, type LLSubtypeSlug } from "@/lib/linked-lists-subtypes";
import { LL_FOUNDATIONS } from "@/lib/linked-lists/foundations";
import { LL_REVISION } from "@/lib/linked-lists/revision";
import { useLessonProgress } from "@/lib/lesson-progress";

type Tier = "foundations" | "revision";

type Resolved =
  | { kind: "tier"; tier: Tier; tierTitle: string; lesson: LLLesson }
  | { kind: "top"; lesson: LLLesson }
  | { kind: "sub"; subtype: LLSubtypeSlug; subtypeTitle: string; lesson: LLLesson };

const TIERS: Record<Tier, { title: string; lessons: LLLesson[] }> = {
  foundations: { title: "Foundations", lessons: LL_FOUNDATIONS },
  revision:    { title: "Revision",    lessons: LL_REVISION },
};

function resolvePath(splat: string): Resolved | undefined {
  const parts = splat.split("/").filter(Boolean);
  if (parts.length === 2) {
    const [a, b] = parts;
    if (a === "foundations" || a === "revision") {
      const lesson = TIERS[a].lessons.find((l) => l.slug === b);
      return lesson ? { kind: "tier", tier: a, tierTitle: TIERS[a].title, lesson } : undefined;
    }
    const s = getSubtype(a);
    if (!s) return undefined;
    const l = getSubtypeLesson(a, b);
    return l ? { kind: "sub", subtype: s.slug, subtypeTitle: s.title, lesson: l } : undefined;
  }
  if (parts.length === 1) {
    // Legacy fallback for pre-refactor URLs (e.g. /linked-lists/introduction).
    const l = getLL(parts[0]);
    return l ? { kind: "top", lesson: l } : undefined;
  }
  return undefined;
}

export const Route = createFileRoute("/linked-lists/$")({
  beforeLoad: ({ params }) => {
    const splat = (params as { _splat?: string })._splat ?? "";
    if (!resolvePath(splat)) throw notFound();
  },
  loader: ({ params }) => params,
  head: ({ params }) => {
    const splat = (params as { _splat?: string })._splat ?? "";
    const r = resolvePath(splat);
    const title = r
      ? `${r.lesson.title} — Linked Lists — DSA with Python`
      : "Linked Lists — DSA with Python";
    return {
      meta: [
        { title },
        { name: "description", content: r?.lesson.description ?? "Linked Lists in Python — animated, interactive lessons." },
        { property: "og:title", content: title },
        { property: "og:description", content: r?.lesson.description ?? "" },
      ],
    };
  },
  component: LinkedListLessonPage,
});

function LinkedListLessonPage() {
  const params = Route.useLoaderData() as { _splat?: string };
  const splat = params._splat ?? "";
  const r = resolvePath(splat)!;
  const data = r.lesson;

  const eyebrow =
    r.kind === "sub"  ? `${r.subtypeTitle} · ${data.eyebrow ?? ""}`
    : r.kind === "tier" ? `${r.tierTitle} · ${data.eyebrow ?? ""}`
    :                     data.eyebrow;

  const progressKey =
    r.kind === "sub"  ? `${r.subtype}/${data.slug}`
    : r.kind === "tier" ? `${r.tier}/${data.slug}`
    :                     data.slug;

  const { isDone, toggle } = useLessonProgress();
  const done = isDone("linked-lists", progressKey);
  const diffColor =
    data.difficulty === "Beginner"
      ? "bg-emerald-500/15 text-emerald-500 border-emerald-500/30"
      : data.difficulty === "Intermediate"
        ? "bg-amber-500/15 text-amber-500 border-amber-500/30"
        : "bg-rose-500/15 text-rose-500 border-rose-500/30";

  const playgroundVariant: "singly" | "doubly" | "circular" | "circular-doubly" =
    r.kind === "sub" ? r.subtype : "singly";

  // Slot-in components that live *above* the LLSection body for specific slugs.
  const injectedTop = (() => {
    if (r.kind === "tier" && r.tier === "foundations" && data.slug === "node-playground") {
      return <NodePlayground />;
    }
    if (r.kind === "tier" && r.tier === "foundations" && data.slug === "comparison") {
      return <VariantComparisonTable />;
    }
    if (r.kind === "tier" && r.tier === "revision" && data.slug === "comparison-cheatsheet") {
      return <VariantComparisonTable />;
    }
    return null;
  })();

  return (
    <PageShell>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-[color:var(--brand)]" />
          Linked Lists · Lesson
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
            onClick={() => toggle("linked-lists", progressKey)}
            className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium transition ${
              done
                ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                : "gradient-brand text-primary-foreground"
            }`}
          >
            {done ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Circle className="h-3.5 w-3.5" />}
            {done ? "Completed" : "Mark complete"}
          </button>
          <Link to="/learn/$course" params={{ course: "linked-lists" }}
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
            <BookOpen className="h-3.5 w-3.5" /> Course outline
          </Link>
        </div>
      </motion.div>

      {injectedTop && <div className="mb-6">{injectedTop}</div>}

      <div className="space-y-6">
        {data.sections.map((s, i) => <SectionRenderer key={i} s={s} playgroundVariant={playgroundVariant} />)}
      </div>

      <CoursePrevNext courseSlug="linked-lists" lessonSlug={progressKey} />
    </PageShell>
  );
}

function SectionRenderer({ s, playgroundVariant }: { s: LLSection; playgroundVariant: "singly" | "doubly" | "circular" | "circular-doubly" }) {
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
    case "viz":
      return (
        <div>
          <LinkedListVisualizer
            nodes={s.nodes.map((v, i) => ({ id: `s-${i}-${v}`, value: v }))}
            highlight={s.highlight}
            compare={s.compare}
            slowIdx={s.slowIdx}
            fastIdx={s.fastIdx}
            headLabel={s.headLabel === undefined ? "HEAD" : s.headLabel}
            tailLabel={s.tailLabel ?? null}
            variant={s.variant}
            cycleTo={s.cycleTo}
            nullTerminator={s.nullTerminator}
          />
          {s.caption && <p className="-mt-1 text-center text-xs italic text-muted-foreground">{s.caption}</p>}
        </div>
      );
    case "memory":
      return (
        <div>
          <LinkedListMemory nodes={s.nodes.map((v, i) => ({ id: `m-${i}-${v}`, value: v }))} />
          {s.caption && <p className="text-xs italic text-muted-foreground">{s.caption}</p>}
        </div>
      );
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
    case "playground":
      return (
        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[color:var(--brand)]">Interactive Playground</h3>
          <LinkedListPlayground initial={s.initial} variant={playgroundVariant} />
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
                  <th className="px-4 py-2 text-left">Time / Value</th>
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
            <div className="text-sm font-semibold">{s.title ?? "Interview Tip"}</div>
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
          <h3 className="mb-3 text-xl font-semibold">Frequently Asked Interview Questions</h3>
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

function QuizCard({ q }: { q: LLQuizItem }) {
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
