import type { Course } from "./types";
import { LL_FOUNDATIONS } from "@/lib/linked-lists/foundations";
import { LL_REVISION } from "@/lib/linked-lists/revision";
import { LL_SUBTYPES } from "@/lib/linked-lists-subtypes";

// Three-tier structure: Foundations → Variants → Revision.
// Every lesson uses a fully-qualified href so the sidebar links directly
// into /linked-lists/<tier-or-variant>/<slug>, handled by the splat route.

const foundations = LL_FOUNDATIONS.map((l) => ({
  slug: l.slug,
  title: l.title,
  tagline: l.description,
  href: `/linked-lists/foundations/${l.slug}`,
}));

const variantGroups = LL_SUBTYPES.map((s) => ({
  slug: s.slug,
  title: s.title,
  tagline: s.tagline,
  kind: "variant" as const,
  lessons: s.lessons.map((l) => ({
    slug: l.slug,
    title: l.title.replace(`${s.title} · `, ""),
    tagline: l.description,
    href: `/linked-lists/${s.slug}/${l.slug}`,
  })),
}));

const revision = LL_REVISION.map((l) => ({
  slug: l.slug,
  title: l.title,
  tagline: l.description,
  href: `/linked-lists/revision/${l.slug}`,
}));

export const linkedListsCourse: Course = {
  slug: "linked-lists",
  title: "Linked Lists",
  tagline: "Nodes connected by pointers — foundations, four variants, and revision.",
  category: "linear",
  order: 2,
  icon: "Link",
  // No top-level lessons — everything lives inside a tier group.
  lessons: [],
  groups: [
    {
      slug: "foundations",
      title: "Foundations",
      tagline: "Shared concepts for every variant.",
      kind: "foundations",
      lessons: foundations,
    },
    ...variantGroups,
    {
      slug: "revision",
      title: "Revision",
      tagline: "Recap, cheat sheets, interview prep.",
      kind: "revision",
      lessons: revision,
    },
  ],
};
