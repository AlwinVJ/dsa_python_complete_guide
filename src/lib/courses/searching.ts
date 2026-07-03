import type { Course } from "./types";

export const searchingCourse: Course = {
  slug: "searching",
  title: "Searching",
  tagline: "Finding an element inside a collection — from linear scan to interpolation.",
  category: "algorithm",
  order: 11,
  icon: "Search",
  lessons: [
    {
      slug: "introduction",
      title: "Introduction",
      theory: "Search algorithms locate a target within a data set. The right choice depends on whether the input is sorted, indexable, or streamed.",
    },
    {
      slug: "linear-search",
      title: "Linear Search",
      theory: "Scan every element until you find the target. Works on any iterable. O(n) time, O(1) space.",
      code: `def linear_search(a, x):\n    for i, v in enumerate(a):\n        if v == x: return i\n    return -1`,
      complexity: [{ op: "search", time: "O(n)", space: "O(1)" }],
    },
    {
      slug: "binary-search",
      title: "Binary Search",
      theory: "Halve the search space each iteration. Requires a sorted, indexable sequence. O(log n).",
      code: `def binary_search(a, x):\n    lo, hi = 0, len(a) - 1\n    while lo <= hi:\n        mid = (lo + hi) // 2\n        if a[mid] == x: return mid\n        if a[mid] < x: lo = mid + 1\n        else: hi = mid - 1\n    return -1`,
      complexity: [{ op: "search", time: "O(log n)" }],
      mistakes: ["Compute mid as `lo + (hi - lo) // 2` in languages where lo+hi can overflow — Python ints don't, but the habit is worth keeping."],
    },
    {
      slug: "ternary-search",
      title: "Ternary Search",
      theory: "Split the range into three parts. Useful for finding the max of a unimodal function, not for plain lookup.",
    },
    {
      slug: "jump-search",
      title: "Jump Search",
      theory: "Jump forward in fixed blocks of size √n, then linearly scan the block containing the target. O(√n).",
    },
    {
      slug: "interpolation-search",
      title: "Interpolation Search",
      theory: "For uniformly distributed sorted data, estimate the position of the target instead of always splitting in half. O(log log n) average, O(n) worst.",
    },
    {
      slug: "exponential-search",
      title: "Exponential Search",
      theory: "Double the range until it brackets the target, then binary-search inside. Great for unbounded or streaming inputs.",
    },
    {
      slug: "bisect",
      title: "Python bisect",
      theory: "The stdlib `bisect` module implements binary search on sorted lists.",
      code: `import bisect\na = [1, 3, 4, 7, 9]\nbisect.bisect_left(a, 4)   # 2\nbisect.insort(a, 5)        # keeps a sorted`,
    },
    {
      slug: "applications",
      title: "Applications",
      bullets: [
        "Lookup in sorted arrays / logs.",
        "Answer-search patterns (binary search on the answer).",
        "Finding a range in an index (bisect_left / bisect_right).",
        "Ternary search for optimising unimodal functions.",
      ],
    },
    {
      slug: "complexity",
      title: "Complexity",
      complexity: [
        { op: "linear", time: "O(n)" },
        { op: "binary", time: "O(log n)" },
        { op: "jump", time: "O(√n)" },
        { op: "interpolation", time: "O(log log n) avg" },
      ],
    },
    {
      slug: "practice",
      title: "Practice",
      practice: [
        { title: "LC 704 · Binary Search", url: "https://leetcode.com/problems/binary-search/", difficulty: "Easy" },
        { title: "LC 33 · Search in Rotated Sorted Array", url: "https://leetcode.com/problems/search-in-rotated-sorted-array/", difficulty: "Medium" },
        { title: "LC 875 · Koko Eating Bananas", url: "https://leetcode.com/problems/koko-eating-bananas/", difficulty: "Medium" },
      ],
    },
    {
      slug: "quiz",
      title: "Quiz",
      quiz: {
        q: "Binary search requires the input to be…",
        choices: ["Hashable", "Sorted and indexable", "Contiguous in memory", "Unique"],
        answer: 1,
        explain: "Halving the search space needs both an order and O(1) index access.",
      },
    },
    {
      slug: "references",
      title: "References",
      references: [
        { label: "bisect — Python docs", url: "https://docs.python.org/3/library/bisect.html" },
      ],
    },
  ],
};
