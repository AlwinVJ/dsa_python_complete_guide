import type { Course } from "./types";
import { STACK_FOUNDATIONS } from "@/lib/stacks/foundations";
import { STACK_IMPLEMENTATIONS } from "@/lib/stacks/implementations";
import { STACK_APPLICATIONS } from "@/lib/stacks/applications";
import { STACK_REVISION } from "@/lib/stacks/revision";

// Four-tier structure mirroring Linked Lists:
//   Foundations → Implementations → Algorithms & Applications → Review & Practice.
// Every lesson uses a fully-qualified href so the sidebar links directly into
// /stacks/<tier>/<slug>, handled by the splat route.

const toLessons = (tier: string, xs: { slug: string; title: string; description: string }[]) =>
  xs.map((l) => ({
    slug: l.slug,
    title: l.title,
    tagline: l.description,
    href: `/stacks/${tier}/${l.slug}`,
  }));

export const stacksCourse: Course = {
  slug: "stacks",
  title: "Stacks",
  tagline: "LIFO containers — foundations, implementations, algorithms, and revision.",
  category: "linear",
  order: 4,
  icon: "Layers",
  lessons: [],
  groups: [
    {
      slug: "foundations",
      title: "Foundations",
      tagline: "The vocabulary and primitives every stack learner needs first.",
      kind: "foundations",
      lessons: toLessons("foundations", STACK_FOUNDATIONS),
    },
    {
      slug: "implementations",
      title: "Implementations",
      tagline: "Four canonical ways to build a stack — list, array, linked list, queue.",
      kind: "implementations",
      lessons: toLessons("implementations", STACK_IMPLEMENTATIONS),
    },
    {
      slug: "applications",
      title: "Algorithms & Applications",
      tagline: "Real-world uses and the classic stack-driven algorithms.",
      kind: "applications",
      lessons: toLessons("applications", STACK_APPLICATIONS),
    },
    {
      slug: "revision",
      title: "Review & Practice",
      tagline: "Common mistakes, FAQ, interview bank, cheat sheet, and final quiz.",
      kind: "revision",
      lessons: toLessons("revision", STACK_REVISION),
    },
  ],
};
