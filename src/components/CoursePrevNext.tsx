import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronRight, ArrowLeft, CheckCircle2, Map } from "lucide-react";
import { COURSES, coursesByCategory, getCourse } from "@/lib/courses";
import { lessonHref, type Course, type Lesson, type LessonGroup } from "@/lib/courses/types";

/**
 * Reusable sequential navigation for every course.
 *
 * Renders (in order):
 *   1. Course progress bar (Lesson X of Y — N% complete)
 *   2. Section-end transition banner when the next lesson enters a new group
 *   3. Previous / Next cards (first lesson → "Back to Roadmap";
 *      last lesson → "Continue Learning → <next course>")
 *
 * The current lesson is auto-detected from the URL (falls back to the
 * `lessonSlug` prop for legacy call sites).
 */
export function CoursePrevNext({
  courseSlug,
  lessonSlug,
}: {
  courseSlug: string;
  lessonSlug?: string;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const course = getCourse(courseSlug);

  if (!course) return null;

  const flat = flattenCourse(course);
  if (flat.length === 0) return null;

  // Prefer URL match, fall back to composite/plain slug match.
  let idx = flat.findIndex((e) => lessonHref(course, e.lesson) === pathname);
  if (idx < 0 && lessonSlug) {
    idx = flat.findIndex(
      (e) =>
        e.lesson.slug === lessonSlug ||
        (e.group && `${e.group.slug}/${e.lesson.slug}` === lessonSlug),
    );
  }
  if (idx < 0) return null;

  const current = flat[idx];
  const prev = idx > 0 ? flat[idx - 1] : null;
  const next = idx < flat.length - 1 ? flat[idx + 1] : null;
  const nextCourse = getNextCourse(course);

  const enteringNewGroup = !!next && !!next.group && next.group.slug !== current.group?.slug;

  // Some modules bridge to routes that are not defined as `Course`s (e.g. the
  // Complexity Analysis section lives under /complexity). This lets those hops
  // participate in the same guided flow as course-to-course transitions.
  const externalNext = EXTERNAL_NEXT[course.slug];
  const nextDestination = next
    ? null
    : externalNext
      ? { title: externalNext.title, href: externalNext.href }
      : nextCourse
        ? { title: nextCourse.title, href: `/learn/${nextCourse.slug}` }
        : null;

  return (
    <div className="mt-12 space-y-6 border-t border-border pt-6">
      {enteringNewGroup && next?.group && (
        <SectionTransition
          finishedTitle={current.group?.title ?? "Section"}
          nextGroupTitle={next.group.title}
          nextHref={lessonHref(course, next.lesson)}
        />
      )}

      {!next && nextDestination && (
        <SectionTransition
          finishedTitle={course.title}
          nextGroupTitle={nextDestination.title}
          nextHref={nextDestination.href}
          courseComplete
        />
      )}

      <div className="text-center text-xs text-muted-foreground">
        <span className="uppercase tracking-wide">Current Module</span>
        <span className="mx-2">·</span>
        <span className="font-medium text-foreground">{course.title}</span>
        <span className="mx-2">·</span>
        <span>
          Lesson {idx + 1} of {flat.length}
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {prev ? (
          <PrevCard
            title={prev.lesson.title}
            subtitle={prev.group?.title ?? "Previous Lesson"}
            href={lessonHref(course, prev.lesson)}
          />
        ) : (
          <PrevCard
            title="Back to Roadmap"
            subtitle="Start of course"
            href="/roadmap"
            icon="roadmap"
          />
        )}
        {next ? (
          <NextCard
            title={next.lesson.title}
            subtitle={next.group?.title ?? "Next Lesson"}
            href={lessonHref(course, next.lesson)}
          />
        ) : nextDestination ? (
          <NextCard
            title={nextDestination.title}
            subtitle="Continue Learning"
            href={nextDestination.href}
          />
        ) : (
          <NextCard title="Back to Roadmap" subtitle="Course complete" href="/roadmap" />
        )}
      </div>
    </div>
  );
}

/** Cross-module hops to destinations that aren't defined as `Course`s. */
const EXTERNAL_NEXT: Record<string, { title: string; href: string }> = {
  "introduction-to-dsa": { title: "Complexity Analysis", href: "/complexity" },
  // Skip the "Strings" course so the curriculum flows into Trees after Hash Tables.
  "hash-tables": { title: "Trees", href: "/learn/trees" },
  // Strings sits at the end of the linear category; continue into Trees next.
  strings: { title: "Trees", href: "/learn/trees" },
};

/* ---------- pieces ---------- */

function SectionTransition({
  finishedTitle,
  nextGroupTitle,
  nextHref,
  courseComplete = false,
}: {
  finishedTitle: string;
  nextGroupTitle: string;
  nextHref: string;
  courseComplete?: boolean;
}) {
  return (
    <div className="card-surface flex flex-wrap items-center justify-between gap-3 border-l-4 border-l-emerald-500 p-4">
      <div className="flex items-start gap-3">
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
        <div>
          <div className="text-sm font-semibold">
            {finishedTitle} {courseComplete ? "course completed" : "completed"}
          </div>
          <div className="text-xs text-muted-foreground">
            {courseComplete ? "Continue with" : "You are now ready to begin"}{" "}
            <span className="font-medium text-foreground">{nextGroupTitle}</span>
          </div>
        </div>
      </div>
      <Link
        to={nextHref}
        className="inline-flex items-center gap-1 rounded-md gradient-brand px-3 py-1.5 text-xs font-medium text-primary-foreground"
      >
        Start {nextGroupTitle} <ChevronRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}

function PrevCard({
  title,
  subtitle,
  href,
  icon,
}: {
  title: string;
  subtitle?: string;
  href: string;
  icon?: "roadmap";
}) {
  return (
    <Link to={href} className="card-surface p-4 transition hover:bg-accent">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        {icon === "roadmap" ? (
          <Map className="h-3.5 w-3.5" />
        ) : (
          <ArrowLeft className="h-3.5 w-3.5" />
        )}
        {icon === "roadmap" ? "Roadmap" : "Previous"}
      </div>
      <div className="mt-1 font-medium">{title}</div>
      {subtitle && <div className="mt-0.5 text-xs text-muted-foreground">{subtitle}</div>}
    </Link>
  );
}

function NextCard({ title, subtitle, href }: { title: string; subtitle?: string; href: string }) {
  return (
    <Link to={href} className="card-surface p-4 transition hover:bg-accent sm:text-right">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground sm:justify-end">
        {subtitle ?? "Next"} <ChevronRight className="h-3.5 w-3.5" />
      </div>
      <div className="mt-1 inline-flex items-center gap-1 font-medium sm:justify-end">{title}</div>
    </Link>
  );
}

/* ---------- helpers ---------- */

type FlatEntry = { lesson: Lesson; group?: LessonGroup };

function flattenCourse(course: Course): FlatEntry[] {
  const out: FlatEntry[] = [];
  for (const l of course.lessons) out.push({ lesson: l });
  for (const g of course.groups ?? []) {
    for (const l of g.lessons) out.push({ lesson: l, group: g });
  }
  for (const l of course.outro ?? []) out.push({ lesson: l });
  return out;
}

/** Next course in the same category by `order`, then across categories. */
function getNextCourse(course: Course): Course | null {
  const byCat = coursesByCategory();
  const list = byCat[course.category];
  const i = list.findIndex((c) => c.slug === course.slug);
  if (i >= 0 && i < list.length - 1) return list[i + 1];

  // Fall back to next category in the canonical order.
  const order: Array<keyof typeof byCat> = ["foundation", "linear", "non-linear", "algorithm"];
  const catIdx = order.indexOf(course.category as (typeof order)[number]);
  for (let k = catIdx + 1; k < order.length; k++) {
    const next = byCat[order[k]]?.[0];
    if (next) return next;
  }
  return null;
}

// Silence unused import in case tree-shaking complains.
void COURSES;
