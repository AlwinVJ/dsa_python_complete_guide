import type { Course } from "./types";
import { H_FOUNDATIONS } from "@/lib/heaps/foundations";
import { H_MIN_HEAP } from "@/lib/heaps/min-heap";
import { H_MAX_HEAP } from "@/lib/heaps/max-heap";
import { H_ALGORITHMS } from "@/lib/heaps/algorithms";
import { H_REVISION } from "@/lib/heaps/revision";

// Flagship five-tier course:
//   Foundations → Min Heap → Max Heap → Heap Algorithms → Review & Practice.
// Sidebar links go through /heaps/<tier>/<slug>, handled by src/routes/heaps.$.tsx.

const toLessons = (
  tier: string,
  xs: { slug: string; title: string; description: string }[],
) =>
  xs.map((l) => ({
    slug: l.slug,
    title: l.title,
    tagline: l.description,
    href: `/heaps/${tier}/${l.slug}`,
  }));

export const heapsCourse: Course = {
  slug: "heaps",
  title: "Heaps",
  tagline: "Priority queues in disguise — the tree behind heapq and Dijkstra.",
  category: "non-linear",
  order: 8,
  icon: "TrendingUp",
  lessons: [],
  groups: [
    {
      slug: "foundations",
      title: "Foundations",
      tagline: "Vocabulary, memory layout, and index arithmetic — before touching min or max heaps.",
      kind: "foundations",
      lessons: toLessons("foundations", H_FOUNDATIONS),
    },
    {
      slug: "min-heap",
      title: "Min Heap",
      tagline: "The default flavour — smallest at the root, powering heapq and Dijkstra.",
      kind: "variant",
      lessons: toLessons("min-heap", H_MIN_HEAP),
    },
    {
      slug: "max-heap",
      title: "Max Heap",
      tagline: "Flip the comparator — largest at the root, powering top-K and IPO.",
      kind: "variant",
      lessons: toLessons("max-heap", H_MAX_HEAP),
    },
    {
      slug: "algorithms",
      title: "Heap Algorithms",
      tagline: "Heapify, heap sort, priority queues, top-K, median stream, k-way merge.",
      kind: "applications",
      lessons: toLessons("algorithms", H_ALGORITHMS),
    },
    {
      slug: "revision",
      title: "Review & Practice",
      tagline: "Cheat sheet, common mistakes, FAQ, interview bank, LeetCode roadmap, references.",
      kind: "revision",
      lessons: toLessons("revision", H_REVISION),
    },
  ],
};
