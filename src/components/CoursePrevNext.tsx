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

  const enteringNewGroup =
    !!next && !!next.group && next.group.slug !== current.group?.slug;

  return (
    <div className="mt-12 space-y-6 border-t border-border pt-6">


      {enteringNewGroup && next?.group && (
        <SectionTransition
          finishedTitle={current.group?.title ?? "Section"}
          nextGroupTitle={next.group.title}
          nextHref={lessonHref(course, next.lesson)}
        />
      )}

      {!next && nextCourse && (
        <SectionTransition
          finishedTitle={course.title}
          nextGroupTitle={nextCourse.title}
          nextHref={`/learn/${nextCourse.slug}`}
          courseComplete
        />
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {prev ? (
          <PrevCard
            title={prev.lesson.title}
            subtitle={prev.group?.title}
            href={lessonHref(course, prev.lesson)}
          />
        ) : (
          <PrevCard title="Back to Roadmap" subtitle="Start of course" href="/roadmap" icon="roadmap" />
        )}
        {next ? (
          <NextCard
            title={next.lesson.title}
            subtitle={next.group?.title}
            href={lessonHref(course, next.lesson)}
          />
        ) : nextCourse ? (
          <NextCard
            title={nextCourse.title}
            subtitle="Continue Learning"
            href={`/learn/${nextCourse.slug}`}
          />
        ) : (
          <NextCard title="Back to Roadmap" subtitle="Course complete" href="/roadmap" />
        )}
      </div>
    </div>
  );
}

/* ---------- pieces ---------- */


function SectionTransition({
  finishedTitle, nextGroupTitle, nextHref, courseComplete = false,
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
            {courseComplete ? "Continue with" : "You are now ready to begin"} <span className="font-medium text-foreground">{nextGroupTitle}</span>
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
  title, subtitle, href, icon,
}: { title: string; subtitle?: string; href: string; icon?: "roadmap" }) {
  return (
    <Link to={href} className="card-surface p-4 transition hover:bg-accent">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        {icon === "roadmap" ? <Map className="h-3.5 w-3.5" /> : <ArrowLeft className="h-3.5 w-3.5" />}
        {icon === "roadmap" ? "Roadmap" : "Previous"}
      </div>
      <div className="mt-1 font-medium">{title}</div>
      {subtitle && <div className="mt-0.5 text-xs text-muted-foreground">{subtitle}</div>}
    </Link>
  );
}

function NextCard({
  title, subtitle, href,
}: { title: string; subtitle?: string; href: string }) {
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
