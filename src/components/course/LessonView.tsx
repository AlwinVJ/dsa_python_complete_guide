import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  CheckCircle2, Circle, ChevronRight, Lightbulb, AlertTriangle,
  Sparkles, BookOpen, ExternalLink, Trophy,
} from "lucide-react";
import { CodeBlock } from "@/components/CodeBlock";
import type { Course, Lesson } from "@/lib/courses/types";
import { lessonHref } from "@/lib/courses/types";
import { useLessonProgress } from "@/lib/lesson-progress";

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
  const { isDone, toggle } = useLessonProgress();
  const done = isDone(course.slug, lesson.slug);

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
          <button
            onClick={() => toggle(course.slug, lesson.slug)}
            className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition ${
              done
                ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                : "gradient-brand text-primary-foreground"
            }`}
          >
            {done ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
            {done ? "Completed" : "Mark as complete"}
          </button>
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
        {lesson.theory && (
          <section>
            <h2 className="mb-3 text-xl font-semibold">Theory</h2>
            <p className="leading-relaxed text-muted-foreground">{lesson.theory}</p>
            {lesson.bullets && (
              <ul className="mt-4 list-disc space-y-1.5 pl-6 text-muted-foreground">
                {lesson.bullets.map((b, i) => <li key={i}>{b}</li>)}
              </ul>
            )}
          </section>
        )}

        {lesson.code && (
          <section>
            <h2 className="mb-3 text-xl font-semibold">Python Implementation</h2>
            <CodeBlock code={lesson.code} title={lesson.codeTitle ?? "python"} />
            {lesson.explanation && (
              <p className="mt-3 text-sm text-muted-foreground">{lesson.explanation}</p>
            )}
          </section>
        )}

        {lesson.complexity && lesson.complexity.length > 0 && (
          <section>
            <h2 className="mb-3 text-xl font-semibold">Complexity</h2>
            <div className="overflow-hidden rounded-lg border border-border">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-2 text-left">Operation</th>
                    <th className="px-4 py-2 text-left">Time</th>
                    <th className="px-4 py-2 text-left">Space</th>
                  </tr>
                </thead>
                <tbody>
                  {lesson.complexity.map((r) => (
                    <tr key={r.op} className="border-t border-border">
                      <td className="px-4 py-2">{r.op}</td>
                      <td className="px-4 py-2 font-mono text-[color:var(--brand)]">{r.time}</td>
                      <td className="px-4 py-2 font-mono text-muted-foreground">{r.space ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {lesson.mistakes && lesson.mistakes.length > 0 && (
          <section>
            <h2 className="mb-3 inline-flex items-center gap-2 text-xl font-semibold">
              <AlertTriangle className="h-5 w-5 text-amber-500" /> Common Mistakes
            </h2>
            <ul className="space-y-2">
              {lesson.mistakes.map((m, i) => (
                <li key={i} className="card-surface p-3 text-sm text-muted-foreground">{m}</li>
              ))}
            </ul>
          </section>
        )}

        {lesson.tip && (
          <section>
            <div className="card-surface flex gap-3 border-l-4 border-l-[color:var(--brand)] p-4">
              <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-[color:var(--brand)]" />
              <div>
                <div className="text-sm font-semibold">Interview Tip</div>
                <div className="mt-1 text-sm text-muted-foreground">{lesson.tip}</div>
              </div>
            </div>
          </section>
        )}

        {lesson.quiz && <QuizCard quiz={lesson.quiz} />}

        {lesson.practice && lesson.practice.length > 0 && (
          <section>
            <h2 className="mb-3 text-xl font-semibold">Practice</h2>
            <ul className="space-y-2">
              {lesson.practice.map((p) => (
                <li key={p.url}>
                  <a href={p.url} target="_blank" rel="noreferrer"
                    className="card-surface flex items-center justify-between p-3 hover:border-[color:var(--brand)]/60 transition">
                    <span className="text-sm font-medium">{p.title}</span>
                    <span className={`rounded-md px-2 py-0.5 text-xs ${
                      p.difficulty === "Easy" ? "bg-emerald-500/15 text-emerald-500" :
                      p.difficulty === "Medium" ? "bg-amber-500/15 text-amber-500" :
                      "bg-rose-500/15 text-rose-500"
                    }`}>{p.difficulty}</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        {lesson.references && lesson.references.length > 0 && (
          <section>
            <h2 className="mb-3 text-xl font-semibold">References</h2>
            <ul className="space-y-2">
              {lesson.references.map((r) => (
                <li key={r.url}>
                  <a href={r.url} target="_blank" rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-[color:var(--brand)] hover:underline">
                    <ExternalLink className="h-3.5 w-3.5" /> {r.label}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}
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
        ) : <div />}
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
        ) : <div />}
      </div>
    </div>
  );
}

function QuizCard({ quiz }: { quiz: NonNullable<Lesson["quiz"]> }) {
  const [pick, setPick] = useState<number | null>(null);
  const correct = pick === quiz.answer;
  return (
    <section>
      <h2 className="mb-3 inline-flex items-center gap-2 text-xl font-semibold">
        <Trophy className="h-5 w-5 text-amber-500" /> Quiz
      </h2>
      <div className="card-surface p-4">
        <p className="font-medium">{quiz.q}</p>
        <div className="mt-3 grid gap-2">
          {quiz.choices.map((c, i) => {
            const chosen = pick === i;
            const isRight = quiz.answer === i;
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
            {correct ? "Correct!" : "Not quite."} {quiz.explain}
          </div>
        )}
      </div>
    </section>
  );
}
