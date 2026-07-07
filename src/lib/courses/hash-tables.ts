import type { Course } from "./types";
import { HT_FOUNDATIONS } from "@/lib/hash-tables/foundations";
import { HT_HASHING } from "@/lib/hash-tables/hashing";
import { HT_TABLES } from "@/lib/hash-tables/tables";
import { HT_REVISION } from "@/lib/hash-tables/revision";

// Four-tier flagship course, matching the Stacks / Queues architecture:
//   Foundations → Hashing Fundamentals → Hash Tables → Review & Practice.
// Sidebar links go through /hash-tables/<tier>/<slug>, handled by the splat
// route in src/routes/hash-tables.$.tsx.

const toLessons = (tier: string, xs: { slug: string; title: string; description: string }[]) =>
  xs.map((l) => ({
    slug: l.slug,
    title: l.title,
    tagline: l.description,
    href: `/hash-tables/${tier}/${l.slug}`,
  }));

export const hashTablesCourse: Course = {
  slug: "hash-tables",
  title: "Hash Tables",
  tagline:
    "Master hashing first, then wire it into Python's dict and set — with interactive bucket visualizations.",
  category: "linear",
  order: 6,
  icon: "Hash",
  lessons: [],
  groups: [
    {
      slug: "foundations",
      title: "Foundations",
      tagline: "Vocabulary and problem statement — before touching hash functions.",
      kind: "foundations",
      lessons: toLessons("foundations", HT_FOUNDATIONS),
    },
    {
      slug: "hashing",
      title: "Hashing Fundamentals",
      tagline: "How hashing actually works — the mechanism every hash table depends on.",
      kind: "implementations",
      lessons: toLessons("hashing", HT_HASHING),
    },
    {
      slug: "tables",
      title: "Hash Tables",
      tagline: "The data structure — insert, search, delete, and Python's dict.",
      kind: "applications",
      lessons: toLessons("tables", HT_TABLES),
    },
    {
      slug: "revision",
      title: "Review & Practice",
      tagline: "Cheat sheets, FAQ, interview bank, and final quiz.",
      kind: "revision",
      lessons: toLessons("revision", HT_REVISION),
    },
  ],
};
