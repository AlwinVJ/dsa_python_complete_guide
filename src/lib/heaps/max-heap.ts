import type { HLesson } from "./types";

export const H_MAX_HEAP: HLesson[] = [
  {
    slug: "introduction",
    title: "Max Heap · Introduction",
    eyebrow: "Max Heap · 1",
    description:
      "Flip the comparison and the largest value now lives at the root — same shape, same math, opposite ordering.",
    difficulty: "Beginner",
    readMinutes: 3,
    sections: [
      {
        type: "theory",
        text: "A max-heap is a complete binary tree where every parent is ≥ each of its children. The root holds the largest value. Everything you learned about min-heaps applies here — insertion, deletion, heapify, and complexity are unchanged. Only the comparison direction flips.",
      },
      {
        type: "heapViz",
        data: [50, 30, 40, 10, 20, 35, 25],
        kind: "max",
        caption: "Root 50 is the maximum. Every downward edge points to a value ≤ its parent.",
      },
      {
        type: "callout",
        kind: "info",
        title: "Python doesn't ship one",
        text: "The stdlib exposes only `heapq` (min-heap). The idiomatic trick is to negate values on push and pop; the class-based approach shown later wraps the same list with an inverted comparator.",
      },
    ],
  },
  {
    slug: "structure",
    title: "Structure",
    eyebrow: "Max Heap · 2",
    description:
      "Same complete-binary-tree shape and array packing as the min-heap — only the invariant flips.",
    difficulty: "Beginner",
    readMinutes: 2,
    sections: [
      {
        type: "theory",
        bullets: [
          "Shape invariant: complete binary tree — identical to min-heap.",
          "Order invariant: for every node i, `arr[parent(i)] >= arr[i]`.",
          "Root = maximum. Leaves live in the second half of the array.",
        ],
      },
      { type: "heapViz", data: [90, 60, 80, 40, 55, 75, 20], kind: "max" },
    ],
  },
  {
    slug: "internal-working",
    title: "Internal Working",
    eyebrow: "Max Heap · 3",
    description:
      "Push, pop, and heapify use the same choreography — only the direction of every comparison flips.",
    difficulty: "Beginner",
    readMinutes: 3,
    sections: [
      {
        type: "table",
        headers: ["Min-heap", "Max-heap"],
        rows: [
          ["a[i] < a[parent] to sift up", "a[i] > a[parent] to sift up"],
          ["pick smaller child to sift down", "pick larger child to sift down"],
          ["push < parent → swap", "push > parent → swap"],
          ["heappop returns min", "heappop returns max"],
        ],
        caption: "Same code, comparators flipped.",
      },
    ],
  },
  {
    slug: "python-implementation",
    title: "Python Implementation",
    eyebrow: "Max Heap · 4",
    description: "Two practical patterns: negation with heapq, and a full MaxHeap class.",
    difficulty: "Intermediate",
    readMinutes: 6,
    sections: [
      { type: "heading", text: "Pattern 1 — negate values on top of heapq" },
      {
        type: "code",
        title: "negation.py",
        code: `import heapq

def push_max(h, x):  heapq.heappush(h, -x)
def pop_max(h):      return -heapq.heappop(h)
def peek_max(h):     return -h[0]

h = []
for x in [3, 1, 4, 1, 5]: push_max(h, x)
pop_max(h)   # 5`,
      },
      {
        type: "callout",
        kind: "warn",
        title: "Non-numeric values?",
        text: "Negation only works for numbers. For strings or custom objects, wrap them in a class with an inverted __lt__, or push (-priority, item) tuples.",
      },
      { type: "heading", text: "Pattern 2 — full MaxHeap class" },
      {
        type: "code",
        title: "max_heap.py",
        code: `class MaxHeap:
    """Array-backed max-heap. Mirror of MinHeap with flipped comparators."""

    def __init__(self, data=None):
        self.a = list(data or [])
        if self.a:
            self._build()

    def __len__(self): return len(self.a)
    def peek(self):    return self.a[0]

    def push(self, value):
        self.a.append(value)
        self._sift_up(len(self.a) - 1)

    def pop(self):
        top = self.a[0]
        last = self.a.pop()
        if self.a:
            self.a[0] = last
            self._sift_down(0)
        return top

    def _build(self):
        for i in range(len(self.a) // 2 - 1, -1, -1):
            self._sift_down(i)

    def _sift_up(self, i):
        a = self.a
        while i > 0:
            p = (i - 1) // 2
            if a[i] > a[p]:                       # > instead of <
                a[i], a[p] = a[p], a[i]
                i = p
            else:
                return

    def _sift_down(self, i):
        a, n = self.a, len(self.a)
        while True:
            l, r = 2*i + 1, 2*i + 2
            largest = i
            if l < n and a[l] > a[largest]: largest = l
            if r < n and a[r] > a[largest]: largest = r
            if largest == i: return
            a[i], a[largest] = a[largest], a[i]
            i = largest`,
      },
    ],
  },
  {
    slug: "insert",
    title: "Insert",
    eyebrow: "Max Heap · 5",
    description:
      "Append + sift-up with a flipped comparator — the value stops rising the moment it's ≤ its parent.",
    difficulty: "Beginner",
    readMinutes: 4,
    sections: [
      { type: "heapPlayground", kind: "max", seed: [50, 30, 40, 10, 20] },
      {
        type: "dryRun",
        headers: ["Step", "Array", "i", "parent", "Action"],
        rows: [
          ["start", "[50, 30, 40, 10, 20]", "—", "—", "insert 45"],
          ["append", "[50, 30, 40, 10, 20, 45]", "5", "2", "45 > 40 → swap"],
          ["swap", "[50, 30, 45, 10, 20, 40]", "2", "0", "45 < 50 → done"],
        ],
      },
    ],
  },
  {
    slug: "delete",
    title: "Delete Root",
    eyebrow: "Max Heap · 6",
    description:
      "Extract-max mirrors extract-min: swap root with last, pop tail, sift-down toward the larger child.",
    difficulty: "Beginner",
    readMinutes: 3,
    sections: [
      { type: "heapPlayground", kind: "max", seed: [90, 60, 80, 40, 55, 75, 20] },
      {
        type: "code",
        code: `def pop_max(a):
    top = a[0]
    last = a.pop()
    if a:
        a[0] = last
        i, n = 0, len(a)
        while True:
            l, r = 2*i + 1, 2*i + 2
            b = i
            if l < n and a[l] > a[b]: b = l
            if r < n and a[r] > a[b]: b = r
            if b == i: break
            a[i], a[b] = a[b], a[i]
            i = b
    return top`,
      },
    ],
  },
  {
    slug: "peek",
    title: "Peek",
    eyebrow: "Max Heap · 7",
    description: "Same as min-heap: read index 0 in O(1). Just remember it's the maximum now.",
    difficulty: "Beginner",
    readMinutes: 1,
    sections: [{ type: "code", code: `def peek_max(a):\n    return a[0]  # largest value` }],
  },
  {
    slug: "heapify-up",
    title: "Heapify Up",
    eyebrow: "Max Heap · 8",
    description: "Swap with parent while the child is larger.",
    difficulty: "Beginner",
    readMinutes: 2,
    sections: [
      {
        type: "code",
        code: `def sift_up_max(a, i):
    while i > 0:
        p = (i - 1) // 2
        if a[i] > a[p]:
            a[i], a[p] = a[p], a[i]
            i = p
        else:
            return`,
      },
    ],
  },
  {
    slug: "heapify-down",
    title: "Heapify Down",
    eyebrow: "Max Heap · 9",
    description: "Swap with the larger child while the node is smaller.",
    difficulty: "Beginner",
    readMinutes: 2,
    sections: [
      {
        type: "code",
        code: `def sift_down_max(a, i):
    n = len(a)
    while True:
        l, r = 2*i + 1, 2*i + 2
        b = i
        if l < n and a[l] > a[b]: b = l
        if r < n and a[r] > a[b]: b = r
        if b == i: return
        a[i], a[b] = a[b], a[i]
        i = b`,
      },
    ],
  },
  {
    slug: "build-heap",
    title: "Build Max Heap",
    eyebrow: "Max Heap · 10",
    description:
      "Bottom-up sift-down — still O(n), still the fastest way to convert an unordered list to a heap.",
    difficulty: "Intermediate",
    readMinutes: 3,
    sections: [
      { type: "heapPlayground", kind: "max", seed: [5, 12, 3, 15, 8, 20, 1, 9] },
      {
        type: "code",
        code: `def build_max_heap(a):
    for i in range(len(a) // 2 - 1, -1, -1):
        sift_down_max(a, i)`,
      },
    ],
  },
  {
    slug: "complexity",
    title: "Complexity",
    eyebrow: "Max Heap · 11",
    description:
      "Identical to the min-heap — the flipped comparator changes semantics, not asymptotics.",
    difficulty: "Beginner",
    readMinutes: 2,
    sections: [
      {
        type: "complexity",
        rows: [
          { op: "peek", time: "O(1)", space: "O(1)" },
          { op: "push", time: "O(log n)", space: "O(1)" },
          { op: "pop", time: "O(log n)", space: "O(1)" },
          { op: "build_max_heap", time: "O(n)", space: "O(1)" },
        ],
      },
    ],
  },
  {
    slug: "applications",
    title: "Applications",
    eyebrow: "Max Heap · 12",
    description: "Where the max-heap wins outright.",
    difficulty: "Beginner",
    readMinutes: 3,
    sections: [
      {
        type: "theory",
        bullets: [
          "Priority scheduling — highest-priority job runs first.",
          "Kth smallest via a max-heap of size k (mirror of the min-heap trick).",
          "Median maintenance — the left half of a stream lives in a max-heap.",
          "IPO / capital-limited job selection — pick the most-profitable feasible task.",
          "Sliding-window maximum — with lazy deletion.",
        ],
      },
    ],
  },
  {
    slug: "advantages-disadvantages",
    title: "Advantages & Disadvantages",
    eyebrow: "Max Heap · 13",
    description: "Same trade-offs as the min-heap, phrased around the maximum.",
    difficulty: "Beginner",
    readMinutes: 2,
    sections: [
      {
        type: "table",
        headers: ["Advantage", "Details"],
        rows: [
          ["O(1) max access", "Root is always the largest value."],
          ["Efficient extract-max sequence", "Powers heap sort in descending order."],
          ["Cheap to combine with min-heap", "Two-heap median trick, top-K variants."],
        ],
      },
      {
        type: "table",
        headers: ["Disadvantage", "Details"],
        rows: [
          ["Not in Python stdlib", "You either negate values or write a class."],
          ["Not searchable", "Same O(n) arbitrary lookup as min-heap."],
          ["No sorted iteration", "Extract one at a time; O(n log n)."],
        ],
      },
    ],
  },
  {
    slug: "faq",
    title: "FAQ",
    eyebrow: "Max Heap · 14",
    description: "Answers to the max-heap-specific questions that keep coming up.",
    difficulty: "Beginner",
    readMinutes: 3,
    sections: [
      {
        type: "faq",
        items: [
          {
            q: "Should I negate or write a class?",
            a: "For numeric priorities, negation is fine and idiomatic. For custom objects or when readability matters, wrap in a class with `__lt__` inverted, or push (-priority, counter, item) tuples.",
          },
          {
            q: "Can I convert a min-heap to a max-heap in place?",
            a: "Yes — negate every value, then run heapify, which is O(n) total. But rebuilding from the original data via a MaxHeap constructor is usually cleaner.",
          },
          {
            q: "Is a max-heap ever the wrong tool?",
            a: "Whenever you need arbitrary-value search, sorted traversal, or update-by-key. Reach for a balanced BST or a sorted container instead.",
          },
        ],
      },
    ],
  },
  {
    slug: "interview-questions",
    title: "Interview Questions",
    eyebrow: "Max Heap · 15",
    description: "The lens interviewers use when they specifically want the max variant.",
    difficulty: "Intermediate",
    readMinutes: 2,
    sections: [
      {
        type: "interview",
        items: [
          "How would you find the kth smallest element in a stream? (max-heap of size k)",
          "Explain the two-heap median technique — which side is the max-heap?",
          "Given only heapq, how would you build a max-priority-queue for arbitrary comparable objects?",
          "Why is a max-heap the natural data structure for heap sort in ascending order?",
        ],
      },
    ],
  },
  {
    slug: "practice",
    title: "Practice Problems",
    eyebrow: "Max Heap · 16",
    description: "Problems where a max-heap is a clean fit.",
    difficulty: "Intermediate",
    readMinutes: 2,
    sections: [
      {
        type: "practice",
        groups: [
          {
            level: "Beginner",
            items: [
              {
                title: "LC 1046 · Last Stone Weight",
                url: "https://leetcode.com/problems/last-stone-weight/",
                difficulty: "Easy",
                pattern: "Max-heap",
              },
            ],
          },
          {
            level: "Intermediate",
            items: [
              {
                title: "LC 1642 · Furthest Building You Can Reach",
                url: "https://leetcode.com/problems/furthest-building-you-can-reach/",
                difficulty: "Medium",
                pattern: "Greedy + max-heap",
              },
              {
                title: "LC 502 · IPO",
                url: "https://leetcode.com/problems/ipo/",
                difficulty: "Hard",
                pattern: "Two heaps",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "references",
    title: "References",
    eyebrow: "Max Heap · 17",
    description: "Further reading focused on the max variant.",
    difficulty: "Beginner",
    readMinutes: 1,
    sections: [
      {
        type: "references",
        items: [
          {
            label: "Python heapq — max-heap tricks",
            url: "https://docs.python.org/3/library/heapq.html#basic-examples",
          },
          {
            label: "GeeksforGeeks · Max Heap in Python",
            url: "https://www.geeksforgeeks.org/max-heap-in-python/",
          },
          {
            label: "Princeton Algorithms · Priority Queues",
            url: "https://algs4.cs.princeton.edu/24pq/",
          },
        ],
      },
    ],
  },
];
