import type { Course } from "./types";

export const divideConquerCourse: Course = {
  slug: "divide-and-conquer",
  title: "Divide & Conquer",
  tagline: "Split, solve, combine — the pattern behind merge sort and FFT.",
  category: "algorithm",
  order: 14,
  icon: "Split",
  // Lesson content below is complete, but the platform is intentionally
  // presenting this module as under development for now (per current
  // product decision). Flip this to false — or delete the line — to
  // automatically restore the expandable lesson tree; no sidebar changes
  // are needed.
  comingSoon: true,
  lessons: [
    {
      slug: "introduction",
      title: "Introduction",
      theory:
        "Divide & conquer solves a problem by breaking it into disjoint subproblems, solving each recursively, and combining the results.",
    },
    {
      slug: "pattern",
      title: "Pattern",
      bullets: [
        "Divide — split the input into smaller pieces.",
        "Conquer — solve each piece recursively.",
        "Combine — merge results back into the answer.",
      ],
    },
    {
      slug: "merge-sort",
      title: "Merge Sort",
      code: `def merge_sort(a):\n    if len(a) <= 1: return a\n    m = len(a)//2\n    return merge(merge_sort(a[:m]), merge_sort(a[m:]))`,
      complexity: [{ op: "sort", time: "O(n log n)", space: "O(n)" }],
    },
    {
      slug: "quick-sort",
      title: "Quick Sort",
      theory:
        "Divide via a partition around a pivot; conquer by recursing into each side; combine is a no-op because sorting happens in place.",
    },
    {
      slug: "binary-search",
      title: "Binary Search",
      theory: "The purest divide & conquer — discard half of the search space each step.",
    },
    {
      slug: "master-theorem",
      title: "Master Theorem",
      theory:
        "For recurrences of the form T(n) = a·T(n/b) + f(n), compare f(n) to n^log_b(a) to classify the running time. Handles most divide-and-conquer analyses in one line.",
      code: `# a=2, b=2, f(n)=O(n)  =>  T(n) = O(n log n)  (merge sort)\n# a=1, b=2, f(n)=O(1)  =>  T(n) = O(log n)      (binary search)\n# a=8, b=2, f(n)=O(n^2) =>  T(n) = O(n^3)       (naive matrix mult)`,
    },
    {
      slug: "closest-pair",
      title: "Closest Pair of Points",
      theory:
        "Sort by x, recurse into halves, then scan a narrow strip around the median. O(n log n).",
    },
    {
      slug: "karatsuba",
      title: "Karatsuba Multiplication",
      theory:
        "Multiplies two n-digit numbers with 3 (not 4) recursive half-size multiplications. T(n) = 3T(n/2) + O(n) = O(n^log2 3) ≈ O(n^1.585).",
    },
    {
      slug: "applications",
      title: "Applications",
      bullets: [
        "Merge sort, quick sort.",
        "Fast Fourier Transform (FFT).",
        "Strassen's matrix multiplication.",
        "Segment trees, k-d trees.",
      ],
    },
    {
      slug: "practice",
      title: "Practice",
      practice: [
        {
          title: "LC 53 · Maximum Subarray (D&C)",
          url: "https://leetcode.com/problems/maximum-subarray/",
          difficulty: "Medium",
        },
        {
          title: "LC 169 · Majority Element",
          url: "https://leetcode.com/problems/majority-element/",
          difficulty: "Easy",
        },
        {
          title: "LC 315 · Count Smaller Numbers After Self",
          url: "https://leetcode.com/problems/count-of-smaller-numbers-after-self/",
          difficulty: "Hard",
        },
      ],
    },
    {
      slug: "quiz",
      title: "Quiz",
      quiz: {
        q: "Merge sort's recurrence T(n) = 2·T(n/2) + O(n) solves to…",
        choices: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"],
        answer: 1,
      },
    },
    {
      slug: "references",
      title: "References",
      references: [
        {
          label: "CLRS Chapter 4 — Divide and Conquer",
          url: "https://mitpress.mit.edu/9780262046305/",
        },
      ],
    },
  ],
};
