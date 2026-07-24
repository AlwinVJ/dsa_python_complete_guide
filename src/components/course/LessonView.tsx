import { useState } from "react";
import { BackButton } from "@/components/BackButton";
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
import { lessonHref, allCourseLessons } from "@/lib/courses/types";
import { ComingSoon } from "@/components/ComingSoon";

import { TrieRedirect } from "@/components/TrieRedirect";
import { CoursePrevNext } from "@/components/CoursePrevNext";


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
  const flatLessons = allCourseLessons(course);
  const flatIndex = flatLessons.findIndex((l) => l.slug === lesson.slug);
  const total = flatLessons.length;
  const displayIndex = flatIndex >= 0 ? flatIndex : index;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="mb-6"><BackButton /></div>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-[color:var(--brand)]" />
          {course.title} · Lesson {displayIndex + 1} of {total}
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

      <CoursePrevNext courseSlug={course.slug} lessonSlug={lesson.slug} />
    </div>
  );
}


function parseSuperscripts(text: string): React.ReactNode[] {
  const parts = text.split(/\^([a-zA-Z0-9\-+]+)/g);
  return parts.map((part, idx) => {
    if (idx % 2 === 1) {
      return <sup key={idx} className="text-[10px]">{part}</sup>;
    }
    return part;
  });
}

export function parseInlineMarkdown(text: string): React.ReactNode {
  if (!text) return "";
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*|_[^_]+_)/g);
  return parts.map((part, idx) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={idx} className="font-semibold text-foreground">
          {parseInlineMarkdown(part.slice(2, -2))}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={idx}
          className="rounded bg-muted border border-border/60 px-1.5 py-0.5 font-mono text-[11px] text-foreground font-semibold"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return (
        <em key={idx} className="italic text-foreground">
          {parseInlineMarkdown(part.slice(1, -1))}
        </em>
      );
    }
    if (part.startsWith("_") && part.endsWith("_")) {
      return (
        <em key={idx} className="italic text-foreground">
          {parseInlineMarkdown(part.slice(1, -1))}
        </em>
      );
    }
    return <span key={idx}>{parseSuperscripts(part)}</span>;
  });
}

function parseBlocks(text: string) {
  const lines = text.split("\n");
  const blocks: { type: string; lines: string[] }[] = [];
  let currentBlock: { type: string; lines: string[] } | null = null;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) {
      if (currentBlock) {
        blocks.push(currentBlock);
        currentBlock = null;
      }
      continue;
    }

    let lineType = "p";
    if (line.startsWith("### ")) lineType = "h3";
    else if (line.startsWith("#### ")) lineType = "h4";
    else if (line.startsWith("|")) lineType = "table";
    else if (line.startsWith("* ") || line.startsWith("- ")) lineType = "ul";
    else if (/^\d+\.\s+/.test(line)) lineType = "ol";

    if (lineType === "h3" || lineType === "h4") {
      if (currentBlock) {
        blocks.push(currentBlock);
      }
      blocks.push({ type: lineType, lines: [line] });
      currentBlock = null;
    } else {
      if (currentBlock && currentBlock.type === lineType) {
        currentBlock.lines.push(rawLine);
      } else {
        if (currentBlock) {
          blocks.push(currentBlock);
        }
        currentBlock = { type: lineType, lines: [rawLine] };
      }
    }
  }

  if (currentBlock) {
    blocks.push(currentBlock);
  }

  return blocks;
}

function renderBlock(block: { type: string; lines: string[] }, key: number) {
  if (block.type === "h3") {
    return (
      <h3 key={key} className="mt-6 text-lg font-semibold text-foreground animate-fade-in">
        {parseInlineMarkdown(block.lines[0].trim().slice(4))}
      </h3>
    );
  }
  if (block.type === "h4") {
    return (
      <h4 key={key} className="mt-4 text-base font-semibold text-foreground animate-fade-in">
        {parseInlineMarkdown(block.lines[0].trim().slice(5))}
      </h4>
    );
  }

  if (block.type === "table") {
    const parseRow = (line: string) => {
      return line
        .split("|")
        .map((cell) => cell.trim())
        .filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
    };

    const headers = parseRow(block.lines[0]);
    const dataRows = block.lines.slice(2).map(parseRow);

    return (
      <div key={key} className="overflow-x-auto my-4 rounded-lg border border-border">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              {headers.map((h, idx) => (
                <th key={idx} className="px-4 py-2 text-left font-semibold text-foreground whitespace-nowrap">
                  {parseInlineMarkdown(h)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dataRows.map((row, rowIdx) => (
              <tr key={rowIdx} className="border-t border-border first:border-none hover:bg-muted/10">
                {row.map((cell, cellIdx) => (
                  <td key={cellIdx} className="px-4 py-2 text-muted-foreground font-mono text-xs">
                    {parseInlineMarkdown(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (block.type === "ul") {
    return (
      <ul key={key} className="list-disc space-y-1.5 pl-6 my-2">
        {block.lines.map((line, idx) => {
          const itemText = line.trim().replace(/^[\*\-]\s+/, "");
          return (
            <li key={idx} className="text-muted-foreground">
              {parseInlineMarkdown(itemText)}
            </li>
          );
        })}
      </ul>
    );
  }

  if (block.type === "ol") {
    return (
      <ol key={key} className="list-decimal space-y-1.5 pl-6 my-2">
        {block.lines.map((line, idx) => {
          const itemText = line.trim().replace(/^\d+\.\s+/, "");
          return (
            <li key={idx} className="text-muted-foreground font-sans">
              {parseInlineMarkdown(itemText)}
            </li>
          );
        })}
      </ol>
    );
  }

  return (
    <p key={key} className="leading-relaxed text-muted-foreground">
      {block.lines.map((line, idx) => (
        <span key={idx}>
          {parseInlineMarkdown(line)}
          {idx < block.lines.length - 1 && <br />}
        </span>
      ))}
    </p>
  );
}

function SectionRenderer({ s }: { s: LessonSection }) {
  switch (s.type) {
    case "heading":
      return <h2 className="mt-8 text-2xl font-semibold">{parseInlineMarkdown(s.text)}</h2>;
    case "theory":
      return (
        <div className="space-y-4 leading-relaxed">
          {s.text && parseBlocks(s.text).map((block, i) => renderBlock(block, i))}
          {s.bullets && (
            <ul className="list-disc space-y-1.5 pl-6">
              {s.bullets.map((b, i) => (
                <li key={i} className="text-muted-foreground">{parseInlineMarkdown(b)}</li>
              ))}
            </ul>
          )}
        </div>
      );
    case "code":
      return (
        <div>
          <CodeBlock code={s.code} title={s.title ?? "python"} />
          {s.explanation && <p className="mt-2 text-sm text-muted-foreground">{parseInlineMarkdown(s.explanation)}</p>}
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
                    <td className="px-4 py-2">{parseInlineMarkdown(r.op)}</td>
                    <td className="px-4 py-2 font-mono text-[color:var(--brand)]">{parseInlineMarkdown(r.time)}</td>
                    <td className="px-4 py-2 font-mono text-muted-foreground">{r.space ? parseInlineMarkdown(r.space) : "—"}</td>
                    <td className="px-4 py-2 text-xs text-muted-foreground">{r.note ? parseInlineMarkdown(r.note) : ""}</td>
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
              <li key={i}>{parseInlineMarkdown(m)}</li>
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
            <div className="mt-1 text-sm text-muted-foreground">{parseInlineMarkdown(s.text)}</div>
          </div>
        </div>
      );
    case "callout":
      return (
        <Callout kind={s.kind} title={s.title}>
          {parseInlineMarkdown(s.text)}
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
                          <div className="text-sm font-medium">{parseInlineMarkdown(p.title)}</div>
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
                  <ExternalLink className="h-3.5 w-3.5" /> {parseInlineMarkdown(r.label)}
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
      <p className="font-medium">{parseInlineMarkdown(q.q)}</p>
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
              {parseInlineMarkdown(c)}
            </button>
          );
        })}
      </div>
      {pick != null && (
        <div className={`mt-3 text-sm ${correct ? "text-emerald-500" : "text-rose-500"}`}>
          {correct ? "Correct!" : "Not quite."} {q.explain && parseInlineMarkdown(q.explain)}
        </div>
      )}
    </div>
  );
}
