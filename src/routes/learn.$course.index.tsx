import { createFileRoute, Link, notFound, redirect } from "@tanstack/react-router";
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
  ArrowRight,
} from "lucide-react";
import { getCourse } from "@/lib/courses";
import { allCourseLessons, lessonHref } from "@/lib/courses/types";
import type { Course, Lesson, LessonGroup } from "@/lib/courses/types";
import { cn } from "@/lib/utils";
import { ComingSoon } from "@/components/ComingSoon";
import { TrieRedirect } from "@/components/TrieRedirect";
import { getModuleRoute } from "@/lib/curriculum";
import { Callout } from "@/components/Callout";

export const Route = createFileRoute("/learn/$course/")({
  beforeLoad: ({ params }) => {
    const course = getCourse(params.course);
    if (!course) throw notFound();
    if (course.redirectRoute) {
      throw redirect({ to: course.redirectRoute });
    }
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
  const totalMinutes = allLessons.length * MINUTES_PER_LESSON;

  // Build a normalized list of sections for rendering. Top-level `lessons`
  // and `outro` are treated as implicit sections when non-empty.
  type Section = {
    slug: string;
    title: string;
    tagline?: string;
    kind:
      | "flat"
      | "foundations"
      | "variant"
      | "variants"
      | "implementations"
      | "applications"
      | "revision";
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
  ];

  const arraysRoute = getModuleRoute({ slug: "arrays", route: "/introduction" });

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-[color:var(--brand)]" />
          {course.category === "algorithm" ? "algorithm module" : `${course.category.replace("-", " ")} data structure`}
        </div>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{course.title}</h1>
        <p className="mt-3 max-w-3xl text-lg text-muted-foreground">{course.tagline}</p>

        {course.ctaText && course.ctaRoute && (
          <div className="mt-6">
            <Callout kind="tip" title={`Want to experiment with ${course.title}?`}>
              <p className="mb-3">
                The interactive call stack and execution visualizer lives in the dedicated {course.title} Playground. Watch execution steps, trace variables, and visualize recursion trees in real time.
              </p>
              <Link
                to={course.ctaRoute}
                className="inline-flex items-center gap-1.5 rounded-md gradient-brand px-3 py-1.5 text-sm text-primary-foreground font-semibold shadow-sm transition hover:opacity-90"
              >
                {course.ctaText} <ArrowRight className="h-4 w-4" />
              </Link>
            </Callout>
          </div>
        )}

        {(course.infoCard || course.overview?.estimatedTime || course.overview?.difficulty !== undefined) && (
          <div className="card-surface p-5 grid gap-4 sm:grid-cols-4 mt-6">
            <div>
              <div className="text-xs text-muted-foreground">Estimated Completion Time</div>
              <div className="text-base font-semibold mt-0.5">
                {course.infoCard?.estimatedTime ?? course.overview?.estimatedTime}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Difficulty</div>
              <div className="text-base font-semibold mt-0.5 text-amber-500">
                {"★".repeat(course.infoCard?.difficulty ?? course.overview?.difficulty ?? 0)}
                {"☆".repeat(5 - (course.infoCard?.difficulty ?? course.overview?.difficulty ?? 0))}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Coding Practice Required</div>
              <div className="text-base font-semibold mt-0.5">
                {course.infoCard?.practiceRequired ?? (course.overview ? "Yes" : "No")}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Programming Language</div>
              <div className="text-base font-semibold mt-0.5">
                {course.infoCard?.language ?? "Python"}
              </div>
            </div>
          </div>
        )}

        {course.overview?.introduction && (
          <div className="card-surface p-5 mt-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Introduction
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {course.overview.introduction}
            </p>
          </div>
        )}

        {course.overview?.whyLearn && (
          <div className="card-surface p-5 mt-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Why Learn {course.title}?
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {course.overview.whyLearn}
            </p>
          </div>
        )}

        {course.overview?.learningObjectives && (
          <div className="card-surface p-5 mt-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Learning Objectives
            </h3>
            <ul className="grid gap-2 sm:grid-cols-2 text-sm text-muted-foreground">
              {course.overview.learningObjectives.map((obj, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-[color:var(--brand)] font-bold mt-0.5">•</span>
                  <span>{obj}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {course.overview?.prerequisites && (
          <div className="card-surface p-5 mt-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Recommended Prerequisites
            </h3>
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
              {course.overview.prerequisites.map((req, i) => (
                <li key={i}>{req}</li>
              ))}
            </ul>
          </div>
        )}

        {course.overview?.realWorldApplications && (
          <div className="card-surface p-5 mt-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Real-world Applications
            </h3>
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
              {course.overview.realWorldApplications.map((app, i) => (
                <li key={i}>{app}</li>
              ))}
            </ul>
          </div>
        )}

        {(course.overview?.advantages || course.overview?.limitations) && (
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {course.overview.advantages && (
              <div className="card-surface p-5">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-[color:var(--good)] mb-3">
                  Advantages
                </h3>
                <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                  {course.overview.advantages.map((adv, i) => (
                    <li key={i}>{adv}</li>
                  ))}
                </ul>
              </div>
            )}
            {course.overview.limitations && (
              <div className="card-surface p-5">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-[color:var(--bad)] mb-3">
                  Limitations
                </h3>
                <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                  {course.overview.limitations.map((lim, i) => (
                    <li key={i}>{lim}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {!course.overview && course.whoIsThisFor && (
          <div className="card-surface p-5 mt-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Who is this Course For?
            </h3>
            <ul className="grid gap-2 sm:grid-cols-2 text-sm text-muted-foreground">
              {course.whoIsThisFor.map((item, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="text-emerald-500 font-bold">✓</span> {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {!course.overview && course.showRoadmap && (
          <div className="card-surface p-5 mt-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              Learning Roadmap
            </h3>
            <div className="relative border-l border-border pl-6 ml-3 space-y-4">
              {[
                { name: "Prerequisites", duration: "2–3 Days" },
                { name: "Introduction to DSA", duration: "30–60 Minutes" },
                { name: "Complexity Analysis", duration: "2–4 Hours" },
                {
                  name: "Linear Data Structures",
                  duration:
                    "Linear data structures: Arrays (2 Days), Linked Lists (2 Days), Stacks, Queues, Hash Tables",
                },
                {
                  name: "Non-Linear Data Structures",
                  duration: "Non-linear structures: Trees (3 Days), Graphs (3–4 Days)",
                },
                {
                  name: "Specialized Data Structures",
                  duration: "Specialized structures: Heaps, Tries",
                },
                {
                  name: "Algorithms",
                  duration: "2–3 Weeks (Sorting, Searching, and other algorithms)",
                },
                {
                  name: "Interview Preparation",
                  duration: "1–2 Weeks (mock interviews, practice)",
                },
              ].map((stage, idx) => (
                <div key={stage.name} className="relative">
                  <span className="absolute -left-9 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-muted border border-border text-[10px] font-bold">
                    {idx + 1}
                  </span>
                  <div className="text-sm font-semibold">{stage.name}</div>
                  <div className="text-xs text-muted-foreground">{stage.duration}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {course.slug !== "introduction-to-dsa" && course.courseLayout !== "overview" && (
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
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
        )}
      </motion.div>

      <div className="mt-10 space-y-10">
        {course.courseLayout === "overview" && (
          <div>
            <SectionHeader
              title="Learning Path"
              tagline="Master recursion step-by-step through our structured curriculum."
            />
          </div>
        )}

        {foundations.map((s) => (
          <SectionBlock key={s.slug} course={course} section={s} />
        ))}

        {flat.map((s) => (
          <SectionBlock key={s.slug} course={course} section={s} />
        ))}

        {implementations.map((s) => (
          <SectionBlock key={s.slug} course={course} section={s} />
        ))}

        {applications.map((s) => (
          <SectionBlock key={s.slug} course={course} section={s} />
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
                <VariantGroup key={s.slug} course={course} section={s} defaultOpen={i === 0} />
              ))}
            </div>
          </div>
        )}

        {revision.map((s) => (
          <SectionBlock key={s.slug} course={course} section={s} />
        ))}

        {course.ctaText && course.courseLayout !== "overview" && (
          <div className="mt-8 flex justify-center">
            <Link
              to={course.ctaRoute ?? arraysRoute}
              className="inline-flex items-center gap-1.5 rounded-md gradient-brand px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg hover:opacity-90 transition"
            >
              {course.ctaText}
            </Link>
          </div>
        )}
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
}: {
  course: Course;
  section: { slug: string; title: string; tagline?: string; lessons: Lesson[] };
}) {
  return (
    <div>
      <SectionHeader title={section.title} tagline={section.tagline} />
      <LessonGrid course={course} lessons={section.lessons} />
    </div>
  );
}

function VariantGroup({
  course,
  section,
  defaultOpen,
}: {
  course: Course;
  section: { slug: string; title: string; tagline?: string; lessons: Lesson[] };
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(!!defaultOpen);
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
            <div className="mt-0.5 truncate text-xs text-muted-foreground">{section.tagline}</div>
          )}
        </div>
      </button>
      {open && (
        <div className="border-t border-border p-4">
          <LessonGrid course={course} lessons={section.lessons} />
        </div>
      )}
    </div>
  );
}

function LessonGrid({ course, lessons }: { course: Course; lessons: Lesson[] }) {
  return (
    <ol className="grid gap-2 sm:grid-cols-2">
      {lessons.map((l, i) => {
        return (
          <li key={l.slug}>
            <Link
              to={lessonHref(course, l)}
              className="card-surface group flex h-full items-start gap-3 p-3 transition hover:border-[color:var(--brand)]/60"
            >
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
                <div className="mt-2 flex items-center justify-between gap-3">
                  <div className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                    <Clock className="h-3 w-3" /> {MINUTES_PER_LESSON} min read
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-md gradient-brand px-2.5 py-1 text-[11px] font-semibold text-primary-foreground shadow-sm transition group-hover:opacity-90">
                    {course.courseLayout === "overview" ? "Learn More →" : "Open Lesson →"}
                  </span>
                </div>
              </div>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
