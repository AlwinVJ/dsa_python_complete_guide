import type { Course } from "./types";
import { QUEUE_FOUNDATIONS } from "@/lib/queues/foundations";
import { QUEUE_VARIANTS } from "@/lib/queues/variants";
import { QUEUE_APPLICATIONS } from "@/lib/queues/applications";
import { QUEUE_REVISION } from "@/lib/queues/revision";

// Four-tier structure mirroring the Stack flagship course:
//   Foundations → Variants → Algorithms & Applications → Review & Practice.
// Every lesson uses a fully-qualified href so the sidebar links directly into
// /queues/<tier>/<slug>, handled by the splat route in src/routes/queues.$.tsx.

const toLessons = (
  tier: string,
  xs: { slug: string; title: string; description: string }[],
) =>
  xs.map((l) => ({
    slug: l.slug,
    title: l.title,
    tagline: l.description,
    href: `/queues/${tier}/${l.slug}`,
  }));

export const queuesCourse: Course = {
  slug: "queues",
  title: "Queues",
  tagline:
    "First-in first-out containers — foundations, variants, algorithms, and revision.",
  category: "linear",
  order: 5,
  icon: "ArrowRightLeft",
  lessons: [],
  groups: [
    {
      slug: "foundations",
      title: "Foundations",
      tagline: "The vocabulary and primitives every queue learner needs first.",
      kind: "foundations",
      lessons: toLessons("foundations", QUEUE_FOUNDATIONS),
    },
    {
      slug: "variants",
      title: "Variants",
      tagline:
        "Six canonical queue variants — linear, circular, deque, priority, linked, two-stack.",
      kind: "variants",
      lessons: toLessons("variants", QUEUE_VARIANTS),
    },
    {
      slug: "applications",
      title: "Algorithms & Applications",
      tagline:
        "Real-world uses and the classic queue-driven algorithms — BFS, monotonic queue, scheduling.",
      kind: "applications",
      lessons: toLessons("applications", QUEUE_APPLICATIONS),
    },
    {
      slug: "revision",
      title: "Review & Practice",
      tagline:
        "Common mistakes, FAQ, interview bank, cheat sheet, and final quiz.",
      kind: "revision",
      lessons: toLessons("revision", QUEUE_REVISION),
    },
  ],
};
