import type { Course } from "./types";

// Arrays maps to the existing polished pages under the site root.
// Every lesson uses `href` so the sidebar links to the legacy routes.
export const arraysCourse: Course = {
  slug: "arrays",
  title: "Arrays & Python Lists",
  tagline: "The most-used linear data structure in Python.",
  category: "linear",
  order: 1,
  icon: "ListTree",
  lessons: [
    { slug: "introduction", title: "Introduction", href: "/introduction" },
    { slug: "array-vs-list", title: "Array vs List", href: "/array-vs-list" },
    { slug: "creating", title: "Creating Lists", href: "/creating" },
    { slug: "accessing", title: "Accessing & Updating", href: "/accessing" },
    { slug: "slicing", title: "Slicing", href: "/slicing" },
    { slug: "traversing", title: "Traversing", href: "/traversing" },
    { slug: "insertion", title: "Insertion", href: "/insertion" },
    { slug: "deletion", title: "Deletion", href: "/deletion" },
    { slug: "searching", title: "Searching", href: "/searching" },
    { slug: "methods", title: "Built-in Methods", href: "/methods" },
    { slug: "nested", title: "Nested Lists", href: "/nested" },
    { slug: "comprehension", title: "List Comprehension", href: "/comprehension" },
    { slug: "copying", title: "Copying & Memory", href: "/copying" },
    { slug: "faq", title: "FAQ & Interview Qs", href: "/faq" },
  ],
};
