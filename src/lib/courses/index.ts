import type { Course, Lesson } from "./types";
import { arraysCourse } from "./arrays";
import { stringsCourse } from "./strings";
import { linkedListsCourse } from "./linked-lists";
import { stacksCourse } from "./stacks";
import { queuesCourse } from "./queues";
import { hashTablesCourse } from "./hash-tables";
import { treesCourse } from "./trees";
import { heapsCourse } from "./heaps";
import { triesCourse } from "./tries";
import { graphsCourse } from "./graphs";
import { searchingCourse } from "./searching";
import { sortingCourse } from "./sorting-course";
import { recursionCourse } from "./recursion";
import { divideConquerCourse } from "./divide-conquer";
import { greedyCourse } from "./greedy";
import { dpCourse } from "./dp";
import { graphAlgorithmsCourse } from "./graph-algorithms";
import { stringAlgorithmsCourse } from "./string-algorithms";
import { backtrackingCourse } from "./backtracking";
import { bitManipulationCourse } from "./bit-manipulation";

export const COURSES: Course[] = [
  arraysCourse,
  stringsCourse,
  linkedListsCourse,
  stacksCourse,
  queuesCourse,
  hashTablesCourse,
  treesCourse,
  heapsCourse,
  triesCourse,
  graphsCourse,
  searchingCourse,
  sortingCourse,
  recursionCourse,
  divideConquerCourse,
  greedyCourse,
  dpCourse,
  graphAlgorithmsCourse,
  stringAlgorithmsCourse,
  backtrackingCourse,
  bitManipulationCourse,
];

export function getCourse(slug: string): Course | undefined {
  return COURSES.find((c) => c.slug === slug);
}

export function getLesson(courseSlug: string, lessonSlug: string):
  | { course: Course; lesson: Lesson; index: number }
  | undefined {
  const course = getCourse(courseSlug);
  if (!course) return undefined;
  const all = [...course.lessons, ...(course.groups?.flatMap((g) => g.lessons) ?? []), ...(course.outro ?? [])];
  const index = all.findIndex((l) => l.slug === lessonSlug);
  if (index === -1) return undefined;
  return { course, lesson: all[index], index };
}

export function getPrevNext(course: Course, index: number) {
  const all = [...course.lessons, ...(course.groups?.flatMap((g) => g.lessons) ?? []), ...(course.outro ?? [])];
  const prev = index > 0 ? all[index - 1] : undefined;
  const next = index < all.length - 1 ? all[index + 1] : undefined;
  return { prev, next };
}

export function coursesByCategory() {
  const groups: Record<string, Course[]> = {
    linear: [],
    "non-linear": [],
    algorithm: [],
    foundation: [],
  };
  for (const c of COURSES) groups[c.category].push(c);
  for (const key of Object.keys(groups)) {
    groups[key].sort((a, b) => a.order - b.order);
  }
  return groups;
}
