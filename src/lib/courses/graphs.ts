import type { Course } from "./types";
import { G_FOUNDATIONS } from "@/lib/graphs/foundations";

// Flagship interactive graphs course.
// Sidebar links go through /graphs/<tier>/<slug>, handled by
// src/routes/graphs.$.tsx. Types / Representations / Traversals / Algorithms
// / Review are added in later content passes; the architecture is set up
// so pushing new groups here picks them up in the sidebar automatically.

const toLessons = (
  tier: string,
  xs: { slug: string; title: string; description: string }[],
) =>
  xs.map((l) => ({
    slug: l.slug,
    title: l.title,
    tagline: l.description,
    href: `/graphs/${tier}/${l.slug}`,
  }));

export const graphsCourse: Course = {
  slug: "graphs",
  title: "Graphs",
  tagline: "Foundations, types, representations, traversals, and every core algorithm.",
  category: "non-linear",
  order: 10,
  icon: "Network",
  lessons: [],
  groups: [
    {
      slug: "foundations",
      title: "Foundations",
      tagline: "Vocabulary, memory layout, and the graph mental model.",
      kind: "foundations",
      lessons: toLessons("foundations", G_FOUNDATIONS),
    },
  ],
};
