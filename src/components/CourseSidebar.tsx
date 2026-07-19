import { useEffect, useMemo, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronDown, ChevronRight } from "lucide-react";
import { COURSES, coursesByCategory } from "@/lib/courses";
import { lessonHref } from "@/lib/courses/types";
import type { Course } from "@/lib/courses/types";

const TOP_LINKS = [
  { to: "/", label: "Welcome" },
  { to: "/modules/python-basics", label: "Prerequisites" },
  { to: "/roadmap", label: "Learning Roadmap" },
];

const SEARCHING_LINK = { to: "/searching", label: "Searching Algorithms" };
const SORTING_LINK = { to: "/sorting", label: "Sorting Algorithms" };
const ALGO_EXTRA_LINKS = [{ to: "/algorithms", label: "Popular Patterns" }];

const SPECIALIZED_SLUGS = new Set(["heaps", "tries"]);


const REFERENCE_LINKS = [
  { to: "/complexity", label: "Complexity Cheat Sheet" },
  { to: "/cheatsheet", label: "Quick Revision" },
  { to: "/resources", label: "References & Practice" },
  { to: "/faq", label: "FAQ & Interview Qs" },
];

const OPEN_KEY = "dsa-sidebar:v2";

function readOpen(): Record<string, boolean> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(OPEN_KEY);
    return raw ? (JSON.parse(raw) as Record<string, boolean>) : {};
  } catch {
    return {};
  }
}

export function CourseSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setOpen(readOpen());
  }, []);

  const activeCourse = useMemo(() => {
    for (const c of COURSES) {
      const all = [
        ...c.lessons,
        ...(c.groups?.flatMap((g) => g.lessons) ?? []),
        ...(c.outro ?? []),
      ];
      for (const l of all) {
        if (lessonHref(c, l) === pathname || pathname === `/learn/${c.slug}`) {
          return c.slug;
        }
      }
    }
    return null;
  }, [pathname]);

  const effectiveOpen = (slug: string) => (slug in open ? open[slug] : slug === activeCourse);

  const toggle = (slug: string) => {
    setOpen((prev) => {
      const next = { ...prev, [slug]: !effectiveOpen(slug) };
      try {
        localStorage.setItem(OPEN_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const groups = coursesByCategory();

  return (
    <nav className="h-full overflow-y-auto px-4 py-6 text-sm">
      <SidebarSection title="Getting Started">
        {TOP_LINKS.map((l) => (
          <SidebarLink
            key={l.to}
            to={l.to}
            label={l.label}
            active={pathname === l.to}
            onNavigate={onNavigate}
          />
        ))}
      </SidebarSection>

      <SidebarSection title="Data Structures & Algorithms">
        <SidebarLink
          to="/learn/introduction-to-dsa"
          label="Introduction to DSA"
          active={pathname === "/learn/introduction-to-dsa"}
          onNavigate={onNavigate}
        />
        <SidebarLink
          to="/complexity"
          label="Complexity Analysis"
          active={pathname === "/complexity"}
          onNavigate={onNavigate}
        />

        <SidebarSubSection title="Linear Data Structures">
          {groups.linear
            .filter((c) => !c.hidden)
            .map((c) => (
              <CourseGroup
                key={c.slug}
                course={c}
                open={effectiveOpen(c.slug)}
                onToggle={() => toggle(c.slug)}
                pathname={pathname}
                onNavigate={onNavigate}
              />
            ))}
        </SidebarSubSection>

        <SidebarSubSection title="Non-Linear Data Structures">
          {groups["non-linear"]
            .filter((c) => !c.hidden && !SPECIALIZED_SLUGS.has(c.slug))
            .map((c) => (
              <CourseGroup
                key={c.slug}
                course={c}
                open={effectiveOpen(c.slug)}
                onToggle={() => toggle(c.slug)}
                pathname={pathname}
                onNavigate={onNavigate}
              />
            ))}
        </SidebarSubSection>

        <SidebarSubSection title="Specialized Data Structures">
          {groups["non-linear"]
            .filter((c) => !c.hidden && SPECIALIZED_SLUGS.has(c.slug))
            .map((c) => (
              <CourseGroup
                key={c.slug}
                course={c}
                open={effectiveOpen(c.slug)}
                onToggle={() => toggle(c.slug)}
                pathname={pathname}
                onNavigate={onNavigate}
              />
            ))}
        </SidebarSubSection>
      </SidebarSection>

      <SidebarSection title="Algorithms">
        <SidebarLink
          to={SEARCHING_LINK.to}
          label={SEARCHING_LINK.label}
          active={pathname === SEARCHING_LINK.to}
          onNavigate={onNavigate}
        />
        <SidebarLink
          to={SORTING_LINK.to}
          label={SORTING_LINK.label}
          active={pathname === SORTING_LINK.to}
          onNavigate={onNavigate}
        />
        {groups.algorithm
          .filter((c) => !c.hidden)
          .map((c) => (
            <CourseGroup
              key={c.slug}
              course={c}
              open={effectiveOpen(c.slug)}
              onToggle={() => toggle(c.slug)}
              pathname={pathname}
              onNavigate={onNavigate}
            />
          ))}
        {ALGO_EXTRA_LINKS.map((l) => (
          <SidebarLink
            key={l.to}
            to={l.to}
            label={l.label}
            active={pathname === l.to}
            onNavigate={onNavigate}
          />
        ))}
      </SidebarSection>

      <SidebarSection title="Interview Prep">
        <SidebarLink
          to="/modules/interview"
          label="Interview Preparation"
          active={pathname === "/modules/interview"}
          onNavigate={onNavigate}
        />
        <SidebarLink
          to="/modules/cp"
          label="Competitive Programming"
          active={pathname === "/modules/cp"}
          onNavigate={onNavigate}
        />
      </SidebarSection>


      <SidebarSection title="Reference">
        {REFERENCE_LINKS.map((l) => (
          <SidebarLink
            key={l.to}
            to={l.to}
            label={l.label}
            active={pathname === l.to}
            onNavigate={onNavigate}
          />
        ))}
      </SidebarSection>
    </nav>
  );
}

function SidebarSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <div className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </div>
      <ul className="space-y-0.5">{children}</ul>
    </div>
  );
}

function SidebarLink({
  to,
  label,
  active,
  onNavigate,
}: {
  to: string;
  label: string;
  active: boolean;
  onNavigate?: () => void;
}) {
  return (
    <li>
      <Link
        to={to}
        onClick={onNavigate}
        className={`block rounded-md px-2 py-1.5 transition ${
          active
            ? "bg-accent text-accent-foreground font-medium"
            : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
        }`}
      >
        {label}
      </Link>
    </li>
  );
}

function CourseGroup({
  course,
  open,
  onToggle,
  pathname,
  onNavigate,
}: {
  course: Course;
  open: boolean;
  onToggle: () => void;
  pathname: string;
  onNavigate?: () => void;
}) {
  // Modules that aren't ready for their full lesson tree yet (still under
  // development, or a thin duplicate pointing at canonical content
  // elsewhere, or configured with an overview-based layout style)
  // collapse to a single, ordinary navigation link — same look
  // as any other sidebar item, just no expand arrow. The module explains
  // its own status once opened; the sidebar doesn't editorialize.
  // Tries is a duplicateOf pointer to Trees → Trie, but we still expose its
  // lesson tree in the sidebar with the same chevron affordance as Heaps —
  // the Overview link continues to hit the /learn/tries redirect page.
  const forceExpandable = course.slug === "tries";
  if (!forceExpandable && (course.comingSoon || course.duplicateOf || course.courseLayout === "overview")) {

    const href = `/learn/${course.slug}`;
    const label = course.comingSoon ? `${course.title} (Coming Soon)` : course.title;
    return (
      <SidebarLink
        to={href}
        label={label}
        active={pathname === href}
        onNavigate={onNavigate}
      />
    );
  }

  return (
    <li>
      <button
        onClick={onToggle}
        className="flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-left transition hover:bg-accent/60 hover:text-foreground"
      >
        {open ? (
          <ChevronDown className="h-3.5 w-3.5 shrink-0" />
        ) : (
          <ChevronRight className="h-3.5 w-3.5 shrink-0" />
        )}
        <span className="flex-1 font-medium">{course.title}</span>
      </button>
      {open && (
        <ul className="mb-1 ml-4 mt-0.5 space-y-0.5 border-l border-border pl-3">
          <li>
            <Link
              to="/learn/$course"
              params={{ course: course.slug }}
              onClick={onNavigate}
              className={`block rounded-md px-2 py-1 text-xs transition ${
                pathname === `/learn/${course.slug}` || (course.redirectRoute && pathname === course.redirectRoute)
                  ? "bg-accent text-accent-foreground font-medium"
                  : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
              }`}
            >
              Overview
            </Link>
          </li>
          {course.lessons.map((l) => (
            <LessonLink
              key={l.slug}
              course={course}
              lesson={l}
              pathname={pathname}
              onNavigate={onNavigate}
            />
          ))}
          {course.groups?.map((g, idx) => {
            const prev = course.groups?.[idx - 1];
            const showVariantDivider = g.kind === "variant" && prev?.kind !== "variant";
            const showRevisionDivider = g.kind === "revision";
            const showImplDivider = g.kind === "implementations";
            const showAppsDivider = g.kind === "applications";
            const showFoundationsDivider =
              g.kind === "foundations" && (!prev || prev.kind !== "foundations");
            return (
              <div key={g.slug}>
                {showFoundationsDivider && <TierDivider label="Foundations" />}
                {showImplDivider && <TierDivider label="Implementations" />}
                {showAppsDivider && <TierDivider label="Algorithms & Applications" />}
                {showVariantDivider && <TierDivider label="Variants" />}
                {showRevisionDivider && <TierDivider label="Review & Practice" />}
                <SubGroup
                  courseSlug={course.slug}
                  group={g}
                  pathname={pathname}
                  onNavigate={onNavigate}
                />
              </div>
            );
          })}

          {course.outro && course.outro.length > 0 && (
            <li className="mx-2 my-1 border-t border-border/60" />
          )}
          {course.outro?.map((l) => (
            <LessonLink
              key={l.slug}
              course={course}
              lesson={l}
              pathname={pathname}
              onNavigate={onNavigate}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

function SidebarSubSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="mb-2">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-1 px-2 py-1 text-left text-xs uppercase tracking-wider text-muted-foreground/80 hover:text-foreground transition font-bold"
      >
        {open ? (
          <ChevronDown className="h-3.5 w-3.5 shrink-0" />
        ) : (
          <ChevronRight className="h-3.5 w-3.5 shrink-0" />
        )}
        <span className="flex-1">{title}</span>
      </button>
      {open && <ul className="mt-1 ml-2 space-y-0.5 border-l border-border/50 pl-2">{children}</ul>}
    </div>
  );
}

function LessonLink({
  course,
  lesson: l,
  pathname,
  onNavigate,
}: {
  course: Course;
  lesson: Course["lessons"][number];
  pathname: string;
  onNavigate?: () => void;
}) {
  const href = lessonHref(course, l);
  const active = pathname === href;
  return (
    <li>
      <Link
        to={href}
        onClick={onNavigate}
        className={`flex items-center gap-1.5 rounded-md px-2 py-1 text-xs transition ${
          active
            ? "bg-accent text-accent-foreground font-medium"
            : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
        }`}
      >
        <span className="truncate">{l.title}</span>
      </Link>
    </li>
  );
}

function SubGroup({
  courseSlug,
  group,
  pathname,
  onNavigate,
}: {
  courseSlug: string;
  group: NonNullable<Course["groups"]>[number];
  pathname: string;
  onNavigate?: () => void;
}) {
  const key = `${courseSlug}:${group.slug}`;
  const autoOpen = group.kind === "foundations" || group.kind === "revision";
  const containsActive = autoOpen || group.lessons.some((l) => (l.href ?? "") === pathname);

  const [open, setOpen] = useState<boolean | null>(null);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(OPEN_KEY);
      const map = raw ? (JSON.parse(raw) as Record<string, boolean>) : {};
      setOpen(key in map ? map[key] : containsActive);
    } catch {
      setOpen(containsActive);
    }
  }, [key, containsActive]);
  const isOpen = open ?? containsActive;
  const toggle = () => {
    const next = !isOpen;
    setOpen(next);
    try {
      const raw = localStorage.getItem(OPEN_KEY);
      const map = raw ? (JSON.parse(raw) as Record<string, boolean>) : {};
      map[key] = next;
      localStorage.setItem(OPEN_KEY, JSON.stringify(map));
    } catch {}
  };
  return (
    <li>
      <button
        onClick={toggle}
        className="mt-1 flex w-full items-center gap-1.5 rounded-md px-2 py-1 text-left text-xs uppercase tracking-wider text-muted-foreground/80 transition hover:text-foreground"
      >
        {isOpen ? (
          <ChevronDown className="h-3 w-3 shrink-0" />
        ) : (
          <ChevronRight className="h-3 w-3 shrink-0" />
        )}
        <span className="flex-1 font-semibold">{group.title}</span>
      </button>
      {isOpen && (
        <ul className="ml-3 space-y-0.5 border-l border-border/70 pl-2">
          {group.lessons.map((l) => {
            const href = l.href ?? "#";
            const active = pathname === href;
            return (
              <li key={l.slug}>
                <Link
                  to={href}
                  onClick={onNavigate}
                  className={`flex items-center gap-1.5 rounded-md px-2 py-1 text-xs transition ${
                    active
                      ? "bg-accent text-accent-foreground font-medium"
                      : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                  }`}
                >
                  <span className="truncate">{l.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </li>
  );
}

function TierDivider({ label }: { label: string }) {
  return (
    <li className="my-2 flex items-center gap-2 px-2">
      <span className="h-px flex-1 bg-border/70" />
      <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/70">
        {label}
      </span>
      <span className="h-px flex-1 bg-border/70" />
    </li>
  );
}
