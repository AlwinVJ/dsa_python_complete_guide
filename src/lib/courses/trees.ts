import type { Course } from "./types";
import { T_FOUNDATIONS } from "@/lib/trees/foundations";
import { T_ALGORITHMS } from "@/lib/trees/algorithms";
import { T_REVISION } from "@/lib/trees/revision";
import { TREE_VARIANTS } from "@/lib/trees/variants";

// Flagship four-tier course:
//   Foundations → Variants (10 mini-courses) → Tree Algorithms → Review & Practice.
// Sidebar links go through /trees/<tier>/<slug>, handled by src/routes/trees.$.tsx.

const toLessons = (tier: string, xs: { slug: string; title: string; description: string }[]) =>
  xs.map((l) => ({
    slug: l.slug,
    title: l.title,
    tagline: l.description,
    href: `/trees/${tier}/${l.slug}`,
  }));

export const treesCourse: Course = {
  slug: "trees",
  title: "Trees",
  tagline: "Hierarchical data — foundations, ten variants, tree algorithms, and revision.",
  category: "non-linear",
  order: 1,
  icon: "GitBranch",
  lessons: [],
  groups: [
    {
      slug: "foundations",
      title: "Foundations",
      tagline:
        "Vocabulary, memory layout, and the recursive nature of trees — before touching any variant.",
      kind: "foundations",
      lessons: toLessons("foundations", T_FOUNDATIONS),
    },
    ...TREE_VARIANTS.map((v) => ({
      slug: v.slug,
      title: v.title,
      tagline: v.tagline,
      kind: "variant" as const,
      lessons: toLessons(v.slug, v.lessons),
    })),
    {
      slug: "algorithms",
      title: "Tree Algorithms",
      tagline:
        "DFS, BFS, LCA, diameter, serialize/deserialize — one place for every tree algorithm.",
      kind: "applications",
      lessons: toLessons("algorithms", T_ALGORITHMS),
    },
    {
      slug: "revision",
      title: "Review & Practice",
      tagline: "Cheat sheets, FAQ, interview bank, LeetCode roadmap, and final quiz.",
      kind: "revision",
      lessons: toLessons("revision", T_REVISION),
    },
  ],
};
