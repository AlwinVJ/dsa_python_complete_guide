import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  ChevronDown,
  Circle,
  Clock,
  GraduationCap,
  Layers,
  Sparkles,
} from "lucide-react";
import { getCourse } from "@/lib/courses";
import { allCourseLessons, lessonHref } from "@/lib/courses/types";
import type { Course, Lesson, LessonGroup } from "@/lib/courses/types";
import { useLessonProgress } from "@/lib/lesson-progress";
import { cn } from "@/lib/utils";
import { ComingSoon } from "@/components/ComingSoon";
import { TrieRedirect } from "@/components/TrieRedirect";

export const Route = createFileRoute("/learn/$course")({
  beforeLoad: ({ params }) => {
    if (!getCourse(params.course)) throw notFound();
  },
  loader: ({ params }) => params,
  head: ({ params }) => {
    const c = getCourse(params.course);
    const title = c ? `${c.title} — DSA with Python` : "Course — DSA with Python";
    const desc = c?.tagline ?? "Learn data structures & algorithms in Python.";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
      ],
    };
  },
  component: CoursePage,
});

// Rough reading-time estimate — 2 min per lesson unless the lesson opts in.
const MINUTES_PER_LESSON = 2;

function CoursePage() {
  const { course: slug } = Route.useLoaderData();
  const course = getCourse(slug)!;
  const { isDone, courseProgress } = useLessonProgress();

  // Thin duplicate of canonical content living elsewhere (e.g. Tries).
  if (course.duplicateOf) {
    return <TrieRedirect />;
  }

  // Whole module is still under development — show the shared landing page
  // instead of an overview grid that would otherwise link to empty lessons.
  if (course.comingSoon) {
    return (
      <ComingSoon
        title={course.title}
        description="This module is currently under active development. It will include detailed theory, Python implementations, interactive visualizations, complexity analysis, memory diagrams, interview questions, FAQs, practice problems, quizzes, and references."
        backHref="/roadmap"
        backLabel="Go Back"
        overviewHref="/"
        overviewLabel="Return to Overview"
      />
    );
  }

  const allLessons = allCourseLessons(course);
  const prog = courseProgress(course.slug, allLessons.map((l) => l.slug));
  const totalMinutes = allLessons.length * MINUTES_PER_LESSON;

  // Build a normalized list of sections for rendering. Top-level `lessons`
  // and `outro` are treated as implicit sections when non-empty.
  type Section = {
    slug: string;
    title: string;
    tagline?: string;
    kind: "flat" | "foundations" | "variant" | "variants" | "implementations" | "applications" | "revision";
    lessons: Lesson[];
  };
  const sections: Section[] = [];
  if (course.lessons.length) {
    sections.push({
      slug: "lessons",
      title: "Lessons",
      kind: "flat",
      lessons: course.lessons,
    });
  }
  for (const g of course.groups ?? []) {
    sections.push({
      slug: g.slug,
      title: g.title,
      tagline: g.tagline,
      kind: g.kind ?? "flat",
      lessons: g.lessons,
    });
  }
  if (course.outro?.length) {
    sections.push({
      slug: "outro",
      title: "Wrap-up",
      kind: "flat",
      lessons: course.outro,
    });
  }

  // Group variant sections under a single "Variants" band so they can be
  // rendered as an expandable list (matches the sidebar's tier layout).
  const variants = sections.filter((s) => s.kind === "variant" || s.kind === "variants");
  const foundations = sections.filter((s) => s.kind === "foundations");
  const implementations = sections.filter((s) => s.kind === "implementations");
  const applications = sections.filter((s) => s.kind === "applications");
  const revision = sections.filter((s) => s.kind === "revision");
  const flat = sections.filter((s) => s.kind === "flat");

  const summary = [
    { label: "Sections", value: sections.length, icon: Layers },
    { label: "Lessons", value: allLessons.length, icon: BookOpen },
    { label: "Est. time", value: `${totalMinutes} min`, icon: Clock },
    { label: "Progress", value: `${prog.pct}%`, icon: GraduationCap },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-[color:var(--brand)]" />
          {course.category.replace("-", " ")} data structure
        </div>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{course.title}</h1>
        <p className="mt-3 max-w-3xl text-lg text-muted-foreground">{course.tagline}</p>

        <div className="mt-5 max-w-sm">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Course progress</span>
            <span>{prog.done} / {prog.total} · {prog.pct}%</span>
          </div>
          <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
            <div className="h-full gradient-brand transition-all" style={{ width: `${prog.pct}%` }} />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {summary.map((s) => (
            <div key={s.label} className="card-surface flex items-center gap-3 p-3">
              <s.icon className="h-4 w-4 text-[color:var(--brand)]" />
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold">{s.value}</div>
                <div className="truncate text-[11px] text-muted-foreground">{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="mt-10 space-y-10">
        {foundations.map((s) => (
          <SectionBlock key={s.slug} course={course} section={s} isDone={isDone} />
        ))}

        {flat.map((s) => (
          <SectionBlock key={s.slug} course={course} section={s} isDone={isDone} />
        ))}

        {implementations.map((s) => (
          <SectionBlock key={s.slug} course={course} section={s} isDone={isDone} />
        ))}

        {applications.map((s) => (
          <SectionBlock key={s.slug} course={course} section={s} isDone={isDone} />
        ))}

        {variants.length > 0 && (
          <div>
            <SectionHeader
              title="Variants"
              tagline="Complete mini-courses for each linked list variant."
              icon={<Layers className="h-5 w-5 text-[color:var(--brand)]" />}
            />
            <div className="space-y-3">
              {variants.map((s, i) => (
                <VariantGroup
                  key={s.slug}
                  course={course}
                  section={s}
                  isDone={isDone}
                  defaultOpen={i === 0}
                />
              ))}
            </div>
          </div>
        )}

        {revision.map((s) => (
          <SectionBlock key={s.slug} course={course} section={s} isDone={isDone} />
        ))}
      </div>
    </div>
  );
}

function SectionHeader({
  title,
  tagline,
  icon,
}: {
  title: string;
  tagline?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="mb-4">
      <h2 className="inline-flex items-center gap-2 text-xl font-semibold">
        {icon ?? <BookOpen className="h-5 w-5 text-[color:var(--brand)]" />} {title}
      </h2>
      {tagline && <p className="mt-1 text-sm text-muted-foreground">{tagline}</p>}
    </div>
  );
}

function SectionBlock({
  course,
  section,
  isDone,
}: {
  course: Course;
  section: { slug: string; title: string; tagline?: string; lessons: Lesson[] };
  isDone: (c: string, l: string) => boolean;
}) {
  return (
    <div>
      <SectionHeader title={section.title} tagline={section.tagline} />
      <LessonGrid course={course} lessons={section.lessons} isDone={isDone} />
    </div>
  );
}

function VariantGroup({
  course,
  section,
  isDone,
  defaultOpen,
}: {
  course: Course;
  section: { slug: string; title: string; tagline?: string; lessons: Lesson[] };
  isDone: (c: string, l: string) => boolean;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(!!defaultOpen);
  const done = section.lessons.filter((l) => isDone(course.slug, l.slug)).length;
  return (
    <div className="card-surface overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-3 p-4 text-left transition hover:bg-muted/40"
        aria-expanded={open}
      >
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-muted-foreground transition-transform",
            open && "rotate-180",
          )}
        />
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold">{section.title}</div>
          {section.tagline && (
            <div className="mt-0.5 truncate text-xs text-muted-foreground">
              {section.tagline}
            </div>
          )}
        </div>
        <div className="shrink-0 text-xs text-muted-foreground">
          {done} / {section.lessons.length}
        </div>
      </button>
      {open && (
        <div className="border-t border-border p-4">
          <LessonGrid course={course} lessons={section.lessons} isDone={isDone} />
        </div>
      )}
    </div>
  );
}

function LessonGrid({
  course,
  lessons,
  isDone,
}: {
  course: Course;
  lessons: Lesson[];
  isDone: (c: string, l: string) => boolean;
}) {
  return (
    <ol className="grid gap-2 sm:grid-cols-2">
      {lessons.map((l, i) => {
        const done = isDone(course.slug, l.slug);
        return (
          <li key={l.slug}>
            <Link
              to={lessonHref(course, l)}
              className="card-surface group flex h-full items-start gap-3 p-3 transition hover:border-[color:var(--brand)]/60"
            >
              {done ? (
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
              ) : (
                <Circle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              )}
              <span className="mt-0.5 w-6 shrink-0 text-xs text-muted-foreground">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium leading-tight group-hover:text-[color:var(--brand)]">
                  {l.title}
                </div>
                {l.tagline && (
                  <div className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                    {l.tagline}
                  </div>
                )}
                <div className="mt-1.5 inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                  <Clock className="h-3 w-3" /> {MINUTES_PER_LESSON} min read
                </div>
              </div>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
