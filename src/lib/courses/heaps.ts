import type { Course } from "./types";

export const heapsCourse: Course = {
  slug: "heaps",
  title: "Heaps",
  tagline: "Priority queues in disguise — the tree behind heapq.",
  category: "non-linear",
  order: 8,
  icon: "TrendingUp",
  lessons: [
    {
      slug: "introduction",
      title: "Introduction",
      theory:
        "A heap is a complete binary tree that respects an order relation between each parent and its children. In a min-heap the smallest value bubbles to the root; in a max-heap, the largest.",
      code: `import heapq\nh = []\nheapq.heappush(h, 3)\nheapq.heappush(h, 1)\nheapq.heappush(h, 4)\nheapq.heappop(h)   # 1`,
      tip: "Python's stdlib ships only a min-heap. Push negated numbers or wrap in a class to fake a max-heap.",
    },
    {
      slug: "min-heap",
      title: "Min Heap",
      theory: "Every parent is ≤ its children. Extract-min is O(log n) and peek-min is O(1). Used by Dijkstra, Huffman coding, and event schedulers.",
    },
    {
      slug: "max-heap",
      title: "Max Heap",
      theory: "Every parent is ≥ its children. In Python, either negate values or push tuples like (-priority, item).",
      code: `import heapq\nnums = [5, 1, 8, 3]\nh = [-x for x in nums]\nheapq.heapify(h)\n-heapq.heappop(h)   # 8`,
    },
    {
      slug: "memory-representation",
      title: "Memory Representation",
      theory:
        "A complete binary tree packs perfectly into an array: index i has parent (i-1)//2 and children 2i+1, 2i+2. That is exactly how `heapq` stores its heap inside a Python list.",
    },
    {
      slug: "heapify",
      title: "Heapify",
      theory:
        "Turning an arbitrary list into a heap runs in O(n), not O(n log n): sift-down from the last internal node up to the root.",
      code: `import heapq\narr = [5, 3, 8, 1, 2]\nheapq.heapify(arr)   # in-place, O(n)`,
      complexity: [{ op: "heapify", time: "O(n)", space: "O(1)" }],
    },
    {
      slug: "insertion",
      title: "Insertion",
      theory: "Append at the tail, then sift up until the heap property holds.",
      code: `heapq.heappush(h, x)   # O(log n)`,
      complexity: [{ op: "push", time: "O(log n)" }],
    },
    {
      slug: "deletion",
      title: "Deletion",
      theory: "Swap the root with the last element, pop the tail, then sift down.",
      code: `heapq.heappop(h)      # returns smallest, O(log n)`,
    },
    {
      slug: "extract-min",
      title: "Extract Min",
      code: `smallest = heapq.heappop(h)   # O(log n)\npeek = h[0]                   # O(1)`,
    },
    {
      slug: "extract-max",
      title: "Extract Max",
      theory: "Negate on push, negate on pop — or use a wrapper class that inverts __lt__.",
    },
    {
      slug: "priority-queue",
      title: "Priority Queue",
      theory:
        "Push (priority, tiebreaker, item) tuples so items with equal priority compare deterministically (usually a monotonic counter) instead of raising `TypeError` on unhashable items.",
      code: `import heapq, itertools\ncounter = itertools.count()\npq = []\nheapq.heappush(pq, (2, next(counter), "b"))\nheapq.heappush(pq, (1, next(counter), "a"))\nheapq.heappop(pq)   # (1, 0, 'a')`,
      mistakes: ["Pushing (priority, dict) fails when priorities tie — dicts aren't comparable. Always add a counter."],
    },
    {
      slug: "heap-sort",
      title: "Heap Sort",
      theory: "Heapify then repeatedly extract-min. In-place variant runs in O(n log n) worst case with O(1) extra memory.",
      code: `import heapq\ndef heap_sort(a):\n    heapq.heapify(a)\n    return [heapq.heappop(a) for _ in range(len(a))]`,
    },
    {
      slug: "top-k",
      title: "Top-K Pattern",
      theory:
        "Maintain a min-heap of size k. For each new value, push and pop if size > k. Ends with the k largest in O(n log k) time and O(k) space.",
      code: `import heapq\ndef top_k(nums, k):\n    h = []\n    for x in nums:\n        heapq.heappush(h, x)\n        if len(h) > k: heapq.heappop(h)\n    return h`,
    },
    {
      slug: "applications",
      title: "Applications",
      bullets: [
        "Dijkstra's shortest paths.",
        "Median from a data stream (two heaps).",
        "Task scheduling by priority.",
        "Huffman coding for compression.",
        "Merging k sorted lists.",
      ],
    },
    {
      slug: "complexity",
      title: "Complexity",
      complexity: [
        { op: "peek", time: "O(1)" },
        { op: "push", time: "O(log n)" },
        { op: "pop", time: "O(log n)" },
        { op: "heapify", time: "O(n)" },
        { op: "heap sort", time: "O(n log n)" },
      ],
    },
    {
      slug: "interview-questions",
      title: "Interview Questions",
      bullets: [
        "Kth largest element in an array.",
        "Top K frequent elements.",
        "Merge K sorted lists.",
        "Find median from data stream.",
        "Reorganize string.",
      ],
    },
    {
      slug: "practice",
      title: "Practice",
      practice: [
        { title: "LC 215 · Kth Largest", url: "https://leetcode.com/problems/kth-largest-element-in-an-array/", difficulty: "Medium" },
        { title: "LC 347 · Top K Frequent", url: "https://leetcode.com/problems/top-k-frequent-elements/", difficulty: "Medium" },
        { title: "LC 23 · Merge k Sorted Lists", url: "https://leetcode.com/problems/merge-k-sorted-lists/", difficulty: "Hard" },
        { title: "LC 295 · Find Median From Stream", url: "https://leetcode.com/problems/find-median-from-data-stream/", difficulty: "Hard" },
      ],
    },
    {
      slug: "quiz",
      title: "Quiz",
      quiz: {
        q: "What is the time complexity of building a heap from an unsorted list of size n?",
        choices: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
        answer: 2,
        explain: "Sift-down from bottom to top gives a linear bound thanks to the geometric-series analysis.",
      },
    },
    {
      slug: "references",
      title: "References",
      references: [
        { label: "heapq — Python docs", url: "https://docs.python.org/3/library/heapq.html" },
        { label: "CLRS Chapter 6 — Heapsort", url: "https://mitpress.mit.edu/9780262046305/" },
      ],
    },
  ],
};
