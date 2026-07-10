import type { Course } from "./types";

export const sortingCourse: Course = {
  slug: "sorting-algorithms",
  title: "Sorting Algorithms",
  tagline: "Ordering data — comparison-based and non-comparison-based.",
  category: "algorithm",
  order: 1,
  icon: "ArrowUpDown",
  hidden: true,
  comingSoon: false,
  redirectRoute: "/sorting",
  courseLayout: "overview",
  ctaText: "Open Sorting Playground →",
  ctaRoute: "/playgrounds/sorting",
  overview: {
    introduction:
      "Sorting algorithms are designed to rearrange a collection of items (such as an array or list) into a specific order (typically ascending or descending). They are classified into comparison-based and non-comparison-based methods.",
    whyLearn:
      "Sorting is a fundamental operation that optimizes other tasks (like searching, merging, and deduplication). In interviews, sorting is the ultimate playground for exploring algorithm design, invariants, stability, in-place behavior, and performance trade-offs.",
    learningObjectives: [
      "Master simple sorting algorithms: Bubble, Selection, and Insertion Sort.",
      "Understand efficient comparison-based sorts: Merge, Quick, and Heap Sort.",
      "Explore non-comparison linear sorts: Counting, Radix, and Bucket Sort.",
      "Differentiate between stable and unstable sorting algorithms.",
      "Understand in-place versus out-of-place memory management.",
    ],
    realWorldApplications: [
      "Database systems sorting queries using external merge sort.",
      "E-commerce platforms ranking products by price, rating, or relevance.",
      "File explorers sorting files by name, size, or date modified.",
      "Scheduling tasks in operating systems based on priority.",
    ],
    advantages: [
      "Enables fast logarithmic searching (Binary Search).",
      "Assists in identifying duplicates and grouping identical elements.",
      "Implements predictability in data layouts for serialization.",
    ],
    limitations: [
      "Comparison-based sorting has a mathematical lower bound of O(n log n).",
      "Linear-time non-comparison sorts require specific keys and ranges.",
      "Certain sorts (like Merge Sort) require O(n) auxiliary space.",
    ],
    prerequisites: [
      "Familiarity with arrays/lists indexing.",
      "Basic recursive reasoning (for Merge and Quick Sort).",
    ],
    estimatedTime: "4–5 Hours",
    difficulty: 3,
  },
  lessons: [
    {
      slug: "introduction",
      title: "Introduction",
      theory:
        "Sorting is a warm-up for almost every algorithm interview. Learn the shape of each algorithm and when to reach for it.",
      tip: "For visual step-by-step animation, open the Sorting Playground at /playgrounds/sorting.",
    },
    {
      slug: "bubble-sort",
      title: "Bubble Sort",
      theory:
        "Repeatedly swap adjacent out-of-order pairs. O(n²) time, O(1) space, stable. Rarely used except for teaching.",
      code: `def bubble(a):\n    n = len(a)\n    for i in range(n):\n        swapped = False\n        for j in range(n - i - 1):\n            if a[j] > a[j+1]:\n                a[j], a[j+1] = a[j+1], a[j]; swapped = True\n        if not swapped: break`,
      complexity: [{ op: "average", time: "O(n²)", space: "O(1)" }],
    },
    {
      slug: "selection-sort",
      title: "Selection Sort",
      theory: "Pick the smallest remaining element and place it at position i. O(n²), not stable.",
      code: `def selection(a):\n    n = len(a)\n    for i in range(n):\n        m = min(range(i, n), key=lambda k: a[k])\n        a[i], a[m] = a[m], a[i]`,
    },
    {
      slug: "insertion-sort",
      title: "Insertion Sort",
      theory:
        "Grow a sorted prefix by inserting each new element into place. O(n²) worst, O(n) best. Excellent for tiny or almost-sorted arrays; used inside TimSort.",
      code: `def insertion(a):\n    for i in range(1, len(a)):\n        v, j = a[i], i - 1\n        while j >= 0 and a[j] > v:\n            a[j+1] = a[j]; j -= 1\n        a[j+1] = v`,
    },
    {
      slug: "merge-sort",
      title: "Merge Sort",
      theory:
        "Split, sort each half, merge. O(n log n) worst case, O(n) extra space, stable. Great when stability or predictable performance matters.",
      code: `def merge_sort(a):\n    if len(a) <= 1: return a\n    m = len(a) // 2\n    L, R = merge_sort(a[:m]), merge_sort(a[m:])\n    out, i, j = [], 0, 0\n    while i < len(L) and j < len(R):\n        if L[i] <= R[j]: out.append(L[i]); i += 1\n        else: out.append(R[j]); j += 1\n    return out + L[i:] + R[j:]`,
      complexity: [{ op: "worst", time: "O(n log n)", space: "O(n)" }],
    },
    {
      slug: "quick-sort",
      title: "Quick Sort",
      theory:
        "Partition around a pivot, recurse on each side. O(n log n) average, O(n²) worst (pathological pivots). In-place with O(log n) stack.",
      code: `def quicksort(a, lo=0, hi=None):\n    if hi is None: hi = len(a) - 1\n    if lo >= hi: return\n    p = a[(lo + hi) // 2]\n    i, j = lo, hi\n    while i <= j:\n        while a[i] < p: i += 1\n        while a[j] > p: j -= 1\n        if i <= j:\n            a[i], a[j] = a[j], a[i]; i += 1; j -= 1\n    quicksort(a, lo, j); quicksort(a, i, hi)`,
      mistakes: [
        "Choosing a[0] as the pivot on already-sorted input yields O(n²). Pick a random or median-of-three pivot.",
      ],
    },
    {
      slug: "heap-sort",
      title: "Heap Sort",
      theory:
        "Heapify then repeatedly extract-min. O(n log n) worst, O(1) extra memory, not stable.",
    },
    {
      slug: "counting-sort",
      title: "Counting Sort",
      theory:
        "For integers in a small range k: count occurrences, then reconstruct. O(n + k), not comparison-based.",
      code: `def counting(a):\n    lo, hi = min(a), max(a)\n    cnt = [0] * (hi - lo + 1)\n    for x in a: cnt[x - lo] += 1\n    out = []\n    for i, c in enumerate(cnt): out.extend([i + lo] * c)\n    return out`,
    },
    {
      slug: "radix-sort",
      title: "Radix Sort",
      theory:
        "Sort by digit, least-significant first, using a stable inner sort (usually counting sort). O(d · (n + k)) where d is digit count.",
    },
    {
      slug: "tim-sort",
      title: "TimSort",
      theory:
        "Python's built-in `sorted` and `list.sort` use TimSort — a hybrid of insertion sort on small runs and merge sort on top. O(n log n) worst, O(n) best on nearly-sorted data, and stable.",
      code: `sorted([3, 1, 4, 1, 5])            # ascending\nsorted(items, key=lambda x: x.name)\nlst.sort(reverse=True)`,
    },
    {
      slug: "comparison",
      title: "Comparison Table",
      complexity: [
        { op: "Bubble / Selection / Insertion", time: "O(n²)", space: "O(1)" },
        { op: "Merge", time: "O(n log n)", space: "O(n)" },
        { op: "Quick", time: "O(n log n) avg · O(n²) worst", space: "O(log n)" },
        { op: "Heap", time: "O(n log n)", space: "O(1)" },
        { op: "Counting / Radix", time: "O(n + k)", space: "O(n + k)" },
        { op: "TimSort", time: "O(n log n)", space: "O(n)" },
      ],
    },
    {
      slug: "stability",
      title: "Stability & In-Place",
      theory:
        "A sort is *stable* if equal keys keep their input order — matters when sorting by multiple keys. Merge/Insertion/TimSort are stable; Quick/Heap/Selection are not.",
    },
    {
      slug: "practice",
      title: "Practice",
      practice: [
        {
          title: "LC 912 · Sort an Array",
          url: "https://leetcode.com/problems/sort-an-array/",
          difficulty: "Medium",
        },
        {
          title: "LC 148 · Sort List",
          url: "https://leetcode.com/problems/sort-list/",
          difficulty: "Medium",
        },
        {
          title: "LC 75 · Sort Colors",
          url: "https://leetcode.com/problems/sort-colors/",
          difficulty: "Medium",
        },
      ],
    },
    {
      slug: "quiz",
      title: "Quiz",
      quiz: {
        q: "Which sort does Python's `list.sort` use?",
        choices: ["Quick Sort", "Merge Sort", "TimSort", "Heap Sort"],
        answer: 2,
        explain: "TimSort — hybrid of merge sort and insertion sort, stable, adaptive.",
      },
    },
    {
      slug: "references",
      title: "References",
      references: [
        {
          label: "TimSort description",
          url: "https://github.com/python/cpython/blob/main/Objects/listsort.txt",
        },
      ],
    },
  ],
};
