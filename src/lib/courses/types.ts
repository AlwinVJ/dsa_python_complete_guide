// Data-driven course/lesson schema. Every DS or algorithm topic becomes a
// Course, split into ordered Lessons that render through a single template.
// Courses may also declare `groups` — nested subtype mini-courses (e.g.
// Singly / Doubly / Circular Linked Lists). The sidebar renders `lessons`,
// then each collapsible group, then `outro` lessons.

export type LessonComplexity = { op: string; time: string; space?: string };

export type LessonQuiz = {
  q: string;
  choices: string[];
  answer: number;
  explain?: string;
};

export type LessonPractice = {
  title: string;
  url: string;
  difficulty: "Easy" | "Medium" | "Hard";
};

export type LessonReference = { label: string; url: string };

export type Lesson = {
  slug: string;
  title: string;
  tagline?: string;
  /** If set, sidebar links to this URL instead of /learn/<course>/<slug>. */
  href?: string;
  theory?: string;
  bullets?: string[];
  code?: string;
  codeTitle?: string;
  explanation?: string;
  complexity?: LessonComplexity[];
  mistakes?: string[];
  tip?: string;
  quiz?: LessonQuiz;
  practice?: LessonPractice[];
  references?: LessonReference[];
};

export type LessonGroup = {
  slug: string;
  title: string;
  tagline?: string;
  /**
   * Tiered learning shape used by Linked Lists, Stacks (and, going
   * forward, every complex DS module):
   *   foundations → variant(s) | implementations | applications → revision
   * The sidebar auto-expands `foundations` and `revision`, renders tier
   * dividers between kinds, and keeps everything else collapsible.
   */
  kind?: "foundations" | "variant" | "variants" | "implementations" | "applications" | "revision";
  lessons: Lesson[];
};

export type CourseCategory =
  | "foundation"
  | "linear"
  | "non-linear"
  | "algorithm";

export type CourseInfoCard = {
  estimatedTime: string;
  difficulty: number; // e.g. 4 for 4 stars
  practiceRequired: boolean;
  language: string;
};

export type Course = {
  slug: string;
  title: string;
  tagline: string;
  category: CourseCategory;
  order: number;
  icon?: string; // lucide icon name (rendered by sidebar)
  lessons: Lesson[];
  /** Nested subtype mini-courses (Linked Lists → Singly / Doubly / …). */
  groups?: LessonGroup[];
  /** Wrap-up lessons rendered below the subtype groups. */
  outro?: Lesson[];
  /**
   * Marks the whole module as not yet built out. When true, the sidebar
   * collapses this course into a single ordinary navigation link (no
   * expand arrow, no lesson tree, no visual badge — it looks identical to
   * a completed module until clicked), and every lesson/overview route
   * under it renders the shared ComingSoon page. Flip to false (or remove)
   * once the module has real content — no sidebar changes required.
   */
  comingSoon?: boolean;
  /**
   * Marks this course as a thin duplicate of content that has a single
   * canonical home elsewhere in the platform (e.g. Tries duplicating the
   * Trie variant under Trees). When set, the sidebar collapses this course
   * to a single link instead of exposing a second lesson tree, and its
   * routes render a short landing page pointing at the canonical course
   * instead of duplicating lessons. `label`/`href` describe that canonical
   * destination.
   */
  duplicateOf?: { label: string; href: string };
  /** Hides the course from rendering dynamically in the sidebar tree. */
  hidden?: boolean;
  infoCard?: CourseInfoCard;
  whoIsThisFor?: string[];
  showRoadmap?: boolean;
  ctaText?: string;
  ctaRoute?: string;
};

export function lessonHref(course: Course, lesson: Lesson) {
  return lesson.href ?? `/learn/${course.slug}/${lesson.slug}`;
}

/** All lessons across top-level, groups, and outro — used for flat lookups. */
export function allCourseLessons(course: Course): Lesson[] {
  const g = course.groups?.flatMap((gr) => gr.lessons) ?? [];
  return [...course.lessons, ...g, ...(course.outro ?? [])];
}
