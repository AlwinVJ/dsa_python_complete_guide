import type { Course } from "./types";
import { G_FOUNDATIONS } from "@/lib/graphs/foundations";
import { G_REPRESENTATIONS } from "@/lib/graphs/representations";
import { G_TRAVERSALS } from "@/lib/graphs/traversals";
import { G_ALGORITHMS } from "@/lib/graphs/algorithms";

// Flagship interactive graphs course.
// Sidebar links go through /graphs/<tier>/<slug>, handled by
// src/routes/graphs.$.tsx. Graph Types and Review are added in a later
// content pass; the architecture is set up so pushing new groups here
// picks them up in the sidebar automatically.

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
    {
      slug: "representations",
      title: "Representations",
      tagline: "Adjacency list, matrix, edge list, incidence matrix, CSR.",
      kind: "applications",
      lessons: toLessons("representations", G_REPRESENTATIONS),
    },
    {
      slug: "traversals",
      title: "Traversals",
      tagline: "BFS, DFS (recursive & iterative), connected components.",
      kind: "applications",
      lessons: toLessons("traversals", G_TRAVERSALS),
    },
    {
      slug: "algorithms",
      title: "Algorithms",
      tagline: "Dijkstra, Bellman-Ford, Prim, Kruskal, topological sort, Union-Find.",
      kind: "applications",
      lessons: toLessons("algorithms", G_ALGORITHMS),
    },
  ],
};
