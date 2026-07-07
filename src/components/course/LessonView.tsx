import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Circle,
  ChevronRight,
  Lightbulb,
  AlertTriangle,
  Sparkles,
  BookOpen,
  ExternalLink,
  Trophy,
} from "lucide-react";
import { CodeBlock } from "@/components/CodeBlock";
import { Callout } from "@/components/Callout";
import type { Course, Lesson, LessonSection } from "@/lib/courses/types";
import { lessonHref } from "@/lib/courses/types";
import { ComingSoon } from "@/components/ComingSoon";
import { SortingRedirect } from "@/components/SortingRedirect";
import { TrieRedirect } from "@/components/TrieRedirect";

function isLessonEmpty(l: Lesson): boolean {
  if (l.sections && l.sections.length > 0) return false;
  return !(
    l.theory ||
    (l.bullets && l.bullets.length) ||
    l.code ||
    (l.complexity && l.complexity.length) ||
    (l.mistakes && l.mistakes.length) ||
    l.tip ||
    l.quiz ||
    (l.practice && l.practice.length) ||
    (l.references && l.references.length)
  );
}

function normalizeLesson(lesson: Lesson): LessonSection[] {
  if (lesson.sections && lesson.sections.length > 0) {
    return lesson.sections;
  }
  const sections: LessonSection[] = [];
  if (lesson.theory || (lesson.bullets && lesson.bullets.length)) {
    sections.push({
      type: "theory",
      text: lesson.theory,
      bullets: lesson.bullets,
    });
  }
  if (lesson.code) {
    sections.push({
      type: "code",
      code: lesson.code,
      title: lesson.codeTitle,
      explanation: lesson.explanation,
    });
  }
  if (lesson.complexity && lesson.complexity.length) {
    sections.push({
      type: "complexity",
      rows: lesson.complexity.map((c) => ({
        op: c.op,
        time: c.time,
        space: c.space,
      })),
    });
  }
  if (lesson.mistakes && lesson.mistakes.length) {
    sections.push({
      type: "mistakes",
      items: lesson.mistakes,
    });
  }
  if (lesson.tip) {
    sections.push({
      type: "tip",
      text: lesson.tip,
    });
  }
  if (lesson.quiz) {
    sections.push({
      type: "quiz",
      items: [
        {
          q: lesson.quiz.q,
          choices: lesson.quiz.choices,
          answer: lesson.quiz.answer,
          explain: lesson.quiz.explain,
        },
      ],
    });
  }
  if (lesson.practice && lesson.practice.length) {
    sections.push({
      type: "practice",
      groups: [
        {
          level: "Intermediate",
          items: lesson.practice,
        },
      ],
    });
  }
  if (lesson.references && lesson.references.length) {
    sections.push({
      type: "references",
      items: lesson.references,
    });
  }
  return sections;
}

export function LessonView({
  course,
  lesson,
  index,
  prev,
  next,
}: {
  course: Course;
  lesson: Lesson;
  index: number;
  prev?: Lesson;
  next?: Lesson;
}) {
  // This course is a thin duplicate of canonical content living elsewhere
  // (e.g. Tries duplicating Trees → Trie) — show the landing page instead
  // of a second copy of the lessons.
  if (course.duplicateOf) return <TrieRedirect />;

  // Sorting algorithms are best experienced in the interactive Sorting
  // Playground. Redirect instead of duplicating static educational content.
  if (course.slug === "sorting-algorithms") return <SortingRedirect />;

  // Entire course is under development — every lesson renders the shared
  // ComingSoon page while preserving its slot in the sidebar and prev/next.
  if (course.comingSoon || isLessonEmpty(lesson)) {
    return (
      <ComingSoon
        title={lesson.title}
        description={
          course.comingSoon
            ? "This module is currently under development and will be available in a future update."
            : (lesson.tagline ??
              "This lesson is currently under development and will be added in a future update.")
        }
        backHref={prev ? lessonHref(course, prev) : undefined}
        overviewHref={`/learn/${course.slug}`}
      />
    );
  }

  const sections = normalizeLesson(lesson);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-[color:var(--brand)]" />
          {course.title} · Lesson {index + 1} of {course.lessons.length}
        </div>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{lesson.title}</h1>
        {lesson.tagline && (
          <p className="mt-3 max-w-3xl text-lg text-muted-foreground">{lesson.tagline}</p>
        )}

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Link
            to="/learn/$course"
            params={{ course: course.slug }}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <BookOpen className="h-4 w-4" /> Course outline
          </Link>
        </div>
      </motion.div>

      <div className="mt-10 space-y-8">
        {sections.map((s, i) => (
          <SectionRenderer key={i} s={s} />
        ))}
      </div>

      <div className="mt-12 grid gap-3 border-t border-border pt-6 sm:grid-cols-2">
        {prev ? (
          <Link
            to={lessonHref(course, prev)}
            className="card-surface p-4 hover:bg-accent transition"
          >
            <div className="text-xs text-muted-foreground">← Previous</div>
            <div className="mt-1 font-medium">{prev.title}</div>
          </Link>
        ) : (
          <div />
        )}
        {next ? (
          <Link
            to={lessonHref(course, next)}
            className="card-surface p-4 hover:bg-accent transition sm:text-right"
          >
            <div className="text-xs text-muted-foreground">Next →</div>
            <div className="mt-1 font-medium inline-flex items-center gap-1 sm:justify-end">
              {next.title} <ChevronRight className="h-4 w-4" />
            </div>
          </Link>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}

function SectionRenderer({ s }: { s: LessonSection }) {
  switch (s.type) {
    case "heading":
      return <h2 className="mt-8 text-2xl font-semibold">{s.text}</h2>;
    case "theory":
      return (
        <div className="space-y-4 leading-relaxed text-muted-foreground">
          {s.text && s.text.split("\n\n").map((para, i) => <p key={i}>{para}</p>)}
          {s.bullets && (
            <ul className="list-disc space-y-1.5 pl-6">
              {s.bullets.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          )}
        </div>
      );
    case "code":
      return (
        <div>
          <CodeBlock code={s.code} title={s.title ?? "python"} />
          {s.explanation && <p className="mt-2 text-sm text-muted-foreground">{s.explanation}</p>}
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
                    <td className="px-4 py-2 font-mono text-[color:var(--brand)]">{r.time}</td>
                    <td className="px-4 py-2 font-mono text-muted-foreground">{r.space ?? "—"}</td>
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
        <Callout kind="warn" title="Common Mistakes">
          <ul className="list-disc space-y-1.5 pl-5">
            {s.items.map((m, i) => (
              <li key={i}>{m}</li>
            ))}
          </ul>
        </Callout>
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
          <ul className="space-y-2">
            {s.items.map((r) => (
              <li key={r.url}>
                <a
                  href={r.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-[color:var(--brand)] hover:underline"
                >
                  <ExternalLink className="h-3.5 w-3.5" /> {r.label}
                </a>
              </li>
            ))}
          </ul>
        </section>
      );
    default:
      return null;
  }
}

function QuizCard({
  q,
}: {
  q: { q: string; choices: string[]; answer: number; explain?: string };
}) {
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
