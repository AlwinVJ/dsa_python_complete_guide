import type { HLesson } from "./types";

export const H_MIN_HEAP: HLesson[] = [
  {
    slug: "introduction",
    title: "Min Heap · Introduction",
    eyebrow: "Min Heap · 1",
    description:
      "The default flavour: the smallest value lives at the root and is available in O(1).",
    difficulty: "Beginner",
    readMinutes: 3,
    sections: [
      {
        type: "theory",
        text: "A min-heap is a complete binary tree where every parent is ≤ each of its children. That single rule guarantees the smallest value in the whole structure sits at the root, ready to be read in constant time or removed in logarithmic time.",
      },
      {
        type: "heapViz",
        data: [1, 3, 5, 7, 9, 8, 6],
        kind: "min",
        caption: "Root 1 is the minimum. Every downward edge points to a value ≥ its parent.",
      },
      {
        type: "callout",
        kind: "info",
        title: "Python default",
        text: "Python's `heapq` implements a min-heap. To get max-heap behaviour, negate on push and pop — see the Max Heap tier.",
      },
    ],
  },
  {
    slug: "structure",
    title: "Structure",
    eyebrow: "Min Heap · 2",
    description:
      "Complete tree + parent ≤ children — the two invariants every operation must preserve.",
    difficulty: "Beginner",
    readMinutes: 3,
    sections: [
      {
        type: "theory",
        bullets: [
          "Shape invariant: the tree stays complete — no gaps, fills left to right.",
          "Order invariant: for every node i, `arr[parent(i)] <= arr[i]`.",
          "Both invariants are local — no traversal is needed to check a single node.",
        ],
      },
      { type: "heapViz", data: [2, 4, 3, 8, 6, 5, 9], kind: "min" },
    ],
  },
  {
    slug: "internal-working",
    title: "Internal Working",
    eyebrow: "Min Heap · 3",
    description: "How push, pop, and heapify keep both invariants alive through swaps only.",
    difficulty: "Beginner",
    readMinutes: 4,
    sections: [
      {
        type: "theory",
        text: "Every heap operation follows the same pattern: temporarily break the order invariant at one node, then swap that node up or down until order is restored. The shape invariant is preserved by always adding and removing at the last index.",
      },
      {
        type: "table",
        headers: ["Op", "Where it starts", "Direction of fix"],
        rows: [
          ["push", "New value at last index", "sift-up: swap with parent while smaller"],
          ["pop", "Last value promoted to root", "sift-down: swap with smaller child while bigger"],
          ["heapify", "Every internal node, bottom-up", "sift-down each"],
        ],
      },
    ],
  },
  {
    slug: "python-implementation",
    title: "Python Implementation",
    eyebrow: "Min Heap · 4",
    description: "A complete, commented min-heap class you can drop into any project.",
    difficulty: "Intermediate",
    readMinutes: 6,
    sections: [
      {
        type: "code",
        title: "min_heap.py",
        code: `class MinHeap:
    """Array-backed min-heap. Root at index 0."""

    def __init__(self, data=None):
        self.a = list(data or [])
        if self.a:
            self._build()

    # ---- read-only helpers -------------------------------------------------
    def __len__(self):        return len(self.a)
    def __bool__(self):       return bool(self.a)
    def peek(self):
        """Return the smallest value in O(1) without removing it."""
        if not self.a: raise IndexError("peek from empty heap")
        return self.a[0]

    # ---- mutating operations ----------------------------------------------
    def push(self, value):
        """Insert value in O(log n)."""
        self.a.append(value)
        self._sift_up(len(self.a) - 1)

    def pop(self):
        """Remove and return the smallest value in O(log n)."""
        if not self.a: raise IndexError("pop from empty heap")
        top = self.a[0]
        last = self.a.pop()               # shrinks the array by one
        if self.a:                        # was there more than one element?
            self.a[0] = last              # promote former last to the root
            self._sift_down(0)
        return top

    # ---- internals --------------------------------------------------------
    def _build(self):
        """Bottom-up heapify in O(n)."""
        for i in range(len(self.a) // 2 - 1, -1, -1):
            self._sift_down(i)

    def _sift_up(self, i):
        a = self.a
        while i > 0:
            parent = (i - 1) // 2
            if a[i] < a[parent]:
                a[i], a[parent] = a[parent], a[i]
                i = parent
            else:
                break

    def _sift_down(self, i):
        a, n = self.a, len(self.a)
        while True:
            l, r = 2 * i + 1, 2 * i + 2
            smallest = i
            if l < n and a[l] < a[smallest]: smallest = l
            if r < n and a[r] < a[smallest]: smallest = r
            if smallest == i: return
            a[i], a[smallest] = a[smallest], a[i]
            i = smallest`,
        explanation:
          "The two invariants only ever break at one node, so both sift routines are single-path — they run in O(height) = O(log n).",
      },
    ],
  },
  {
    slug: "insert",
    title: "Insert (heappush)",
    eyebrow: "Min Heap · 5",
    description: "Append to the tail, then bubble the new value up until it's ≥ its parent.",
    difficulty: "Beginner",
    readMinutes: 5,
    sections: [
      {
        type: "theory",
        text: "Insertion works in two phases: append at the last index (shape invariant preserved), then sift-up (order invariant restored). The path from a leaf to the root has at most ⌊log₂ n⌋ steps, so the whole insert is O(log n).",
      },
      { type: "heapPlayground", kind: "min", seed: [3, 5, 8, 10, 12] },
      {
        type: "code",
        title: "Iterative sift-up",
        code: `def push(a, x):
    a.append(x)
    i = len(a) - 1
    while i > 0:
        parent = (i - 1) // 2
        if a[i] < a[parent]:
            a[i], a[parent] = a[parent], a[i]
            i = parent
        else:
            break`,
      },
      {
        type: "dryRun",
        headers: ["Step", "Array", "i", "parent", "Action"],
        rows: [
          ["start", "[3, 5, 8, 10, 12]", "—", "—", "insert 1"],
          ["append", "[3, 5, 8, 10, 12, 1]", "5", "2", "1 < 8 → swap"],
          ["swap", "[3, 5, 1, 10, 12, 8]", "2", "0", "1 < 3 → swap"],
          ["swap", "[1, 5, 3, 10, 12, 8]", "0", "—", "root reached, done"],
        ],
        caption:
          "Inserting 1 bubbles it from the last index up to the root — three swaps for a heap of six.",
      },
      {
        type: "complexity",
        rows: [{ op: "push", time: "O(log n)", space: "O(1)", note: "Iterative sift-up." }],
      },
    ],
  },
  {
    slug: "delete",
    title: "Delete Root (heappop)",
    eyebrow: "Min Heap · 6",
    description: "Swap root with last, pop the tail, then push the promoted value down.",
    difficulty: "Beginner",
    readMinutes: 5,
    sections: [
      {
        type: "theory",
        text: "Removing the root cannot leave a hole, so we replace it with the last value in the array and pop the tail. The promoted value probably violates the order invariant — sift it down along the path of smaller children until both invariants hold.",
      },
      { type: "heapPlayground", kind: "min", seed: [1, 3, 2, 7, 9, 5, 4] },
      {
        type: "code",
        title: "Iterative sift-down",
        code: `def pop(a):
    top = a[0]
    last = a.pop()
    if a:
        a[0] = last
        i, n = 0, len(a)
        while True:
            l, r = 2*i + 1, 2*i + 2
            s = i
            if l < n and a[l] < a[s]: s = l
            if r < n and a[r] < a[s]: s = r
            if s == i: break
            a[i], a[s] = a[s], a[i]
            i = s
    return top`,
      },
      {
        type: "dryRun",
        headers: ["Step", "Array", "i", "smaller child", "Action"],
        rows: [
          ["start", "[1, 3, 2, 7, 9, 5, 4]", "—", "—", "pop root (1)"],
          ["promote", "[4, 3, 2, 7, 9, 5]", "0", "2 (idx 2)", "4 > 2 → swap"],
          ["swap", "[2, 3, 4, 7, 9, 5]", "2", "5 (idx 5)", "4 < 5 → done"],
        ],
      },
    ],
  },
  {
    slug: "peek",
    title: "Peek",
    eyebrow: "Min Heap · 7",
    description: "The smallest value is always at index 0 — reading it is O(1).",
    difficulty: "Beginner",
    readMinutes: 2,
    sections: [
      {
        type: "code",
        code: `def peek(a):\n    if not a: raise IndexError("peek from empty heap")\n    return a[0]`,
      },
      {
        type: "callout",
        kind: "tip",
        title: "Common pattern",
        text: "Peek before popping when you need to check whether the next extreme meets some condition — e.g. in Dijkstra, peek at the smallest distance to decide if you've reached the target.",
      },
    ],
  },
  {
    slug: "heapify-up",
    title: "Heapify Up (Sift Up)",
    eyebrow: "Min Heap · 8",
    description:
      "The subroutine that restores order after an insertion — swap with parent while smaller.",
    difficulty: "Intermediate",
    readMinutes: 4,
    sections: [
      {
        type: "theory",
        text: "Sift-up starts at any index and walks toward the root, swapping with the parent whenever the child is smaller. It terminates the moment the child is ≥ its parent, guaranteeing an O(log n) bound.",
      },
      {
        type: "code",
        code: `def sift_up(a, i):
    while i > 0:
        p = (i - 1) // 2
        if a[i] < a[p]:
            a[i], a[p] = a[p], a[i]
            i = p
        else:
            return`,
      },
    ],
  },
  {
    slug: "heapify-down",
    title: "Heapify Down (Sift Down)",
    eyebrow: "Min Heap · 9",
    description:
      "The subroutine that restores order after a deletion — swap with the smaller child while bigger.",
    difficulty: "Intermediate",
    readMinutes: 4,
    sections: [
      {
        type: "theory",
        text: "Sift-down starts at any index and walks toward a leaf. At each step it picks the smaller of the two children and swaps if the current node is bigger. Choosing the smaller child is essential — swapping with the bigger one would break the order invariant on the other subtree.",
      },
      {
        type: "code",
        code: `def sift_down(a, i):
    n = len(a)
    while True:
        l, r = 2*i + 1, 2*i + 2
        s = i
        if l < n and a[l] < a[s]: s = l
        if r < n and a[r] < a[s]: s = r
        if s == i: return
        a[i], a[s] = a[s], a[i]
        i = s`,
      },
      {
        type: "callout",
        kind: "warn",
        title: "Pick the smaller child",
        text: "Swapping with the wrong child fixes one subtree while breaking the other. If a[l] < a[r], swap with l; otherwise with r.",
      },
    ],
  },
  {
    slug: "build-heap",
    title: "Build Heap (heapify) — O(n)",
    eyebrow: "Min Heap · 10",
    description:
      "Turn an unsorted array into a heap in linear time by sift-down from the last internal node.",
    difficulty: "Intermediate",
    readMinutes: 5,
    sections: [
      {
        type: "theory",
        text: "The naïve approach — call push n times — costs O(n log n). The bottom-up construction is O(n): start at the last internal node (index n//2 − 1) and sift-down each node toward the root. Because most nodes are near the bottom (where sift-down does almost nothing), the total work is linear.",
      },
      {
        type: "code",
        code: `def build_heap(a):
    for i in range(len(a) // 2 - 1, -1, -1):
        sift_down(a, i)`,
      },
      { type: "heapPlayground", kind: "min", seed: [9, 4, 7, 1, 3, 8, 2, 6, 5] },
      {
        type: "complexity",
        rows: [
          { op: "build (bottom-up)", time: "O(n)", space: "O(1)" },
          { op: "build (n × push)", time: "O(n log n)", space: "O(1)", note: "Naïve — avoid." },
        ],
      },
    ],
  },
  {
    slug: "complexity",
    title: "Complexity",
    eyebrow: "Min Heap · 11",
    description: "All min-heap operations, gathered in one place.",
    difficulty: "Beginner",
    readMinutes: 2,
    sections: [
      {
        type: "complexity",
        rows: [
          { op: "peek", time: "O(1)", space: "O(1)" },
          { op: "push", time: "O(log n)", space: "O(1)" },
          { op: "pop", time: "O(log n)", space: "O(1)" },
          { op: "build_heap", time: "O(n)", space: "O(1)" },
          { op: "search", time: "O(n)", space: "O(1)", note: "Heap doesn't help here." },
        ],
      },
    ],
  },
  {
    slug: "applications",
    title: "Applications",
    eyebrow: "Min Heap · 12",
    description:
      "Where the min-heap is the right tool: Dijkstra, Huffman, k-way merge, event schedulers.",
    difficulty: "Beginner",
    readMinutes: 3,
    sections: [
      {
        type: "theory",
        bullets: [
          "Dijkstra's shortest-path — pop the closest unvisited node.",
          "Prim's minimum spanning tree — pop the cheapest crossing edge.",
          "Huffman coding — repeatedly merge the two rarest symbols.",
          "Merge k sorted lists — heap of size k holds one head per list.",
          "Event-driven simulation — pop the soonest scheduled event.",
          "Top-K largest — a min-heap of size k evicts anything smaller.",
        ],
      },
    ],
  },
  {
    slug: "advantages-disadvantages",
    title: "Advantages & Disadvantages",
    eyebrow: "Min Heap · 13",
    description: "When to reach for a min-heap — and when a sorted structure would serve better.",
    difficulty: "Beginner",
    readMinutes: 3,
    sections: [
      {
        type: "table",
        headers: ["Advantage", "Details"],
        rows: [
          ["Fast extreme access", "O(1) peek, O(log n) pop of the minimum."],
          ["Compact memory", "Array-backed — no per-node overhead."],
          ["Linear construction", "Turn an arbitrary list into a heap in O(n)."],
          ["Cache friendly", "Contiguous storage means predictable prefetching."],
        ],
      },
      {
        type: "table",
        headers: ["Disadvantage", "Details"],
        rows: [
          ["No sorted traversal", "You cannot list values in order without n pops."],
          ["Slow arbitrary search", "Finding an arbitrary value takes O(n)."],
          ["No efficient update-by-key", "Requires an external index map."],
          ["No range queries", "Ranges are BST/segment-tree territory."],
        ],
      },
    ],
  },
  {
    slug: "faq",
    title: "FAQ",
    eyebrow: "Min Heap · 14",
    description:
      "Fast answers to the questions everyone asks after implementing their first min-heap.",
    difficulty: "Beginner",
    readMinutes: 4,
    sections: [
      {
        type: "faq",
        items: [
          {
            q: "Why is `heapq` a module, not a class?",
            a: "The Python stdlib exposes heap functions that operate on a plain list, so any list can be treated as a heap without wrapping it. It's a design choice, not a technical limitation — you can wrap it in a class if you prefer object syntax.",
          },
          {
            q: "Can two elements have the same priority?",
            a: "Yes. When priorities tie, Python compares the next tuple element, which is why priority-queue patterns push (priority, counter, item) triples — the counter breaks ties deterministically without ever comparing the items themselves.",
          },
          {
            q: "Is a min-heap unique for a given multiset of values?",
            a: "No. Many heap shapes satisfy the property. For example [1, 2, 3] and [1, 3, 2] are both valid min-heaps.",
          },
          {
            q: "Why is heapify O(n) but n pushes O(n log n)?",
            a: "Bottom-up sift-down does almost no work at the leaves, where most nodes live. The geometric-series sum collapses to O(n). Pushing one at a time doesn't get this discount.",
          },
        ],
      },
    ],
  },
  {
    slug: "interview-questions",
    title: "Interview Questions",
    eyebrow: "Min Heap · 15",
    description:
      "The questions interviewers reach for when they want to see if you can reason about heaps.",
    difficulty: "Intermediate",
    readMinutes: 3,
    sections: [
      {
        type: "interview",
        items: [
          "Why is peek O(1) but pop O(log n)?",
          "Sketch sift-up and sift-down without touching your editor.",
          "Prove build_heap is O(n), not O(n log n).",
          "How would you support decrease-key without O(n) search?",
          "When is a heap the wrong data structure? (Answer: whenever you need sorted iteration or arbitrary lookup.)",
        ],
      },
    ],
  },
  {
    slug: "practice",
    title: "Practice Problems",
    eyebrow: "Min Heap · 16",
    description: "Warm up with these before tackling the algorithms tier.",
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
                title: "Implement Min Heap (from scratch)",
                url: "https://leetcode.com/problems/design-a-stack-with-increment-operation/",
                difficulty: "Easy",
                pattern: "Structure",
              },
              {
                title: "LC 703 · Kth Largest Element in a Stream",
                url: "https://leetcode.com/problems/kth-largest-element-in-a-stream/",
                difficulty: "Easy",
                pattern: "Min-heap of size k",
              },
            ],
          },
          {
            level: "Intermediate",
            items: [
              {
                title: "LC 215 · Kth Largest Element in an Array",
                url: "https://leetcode.com/problems/kth-largest-element-in-an-array/",
                difficulty: "Medium",
                pattern: "Top-K",
              },
              {
                title: "LC 973 · K Closest Points to Origin",
                url: "https://leetcode.com/problems/k-closest-points-to-origin/",
                difficulty: "Medium",
                pattern: "Top-K",
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
    eyebrow: "Min Heap · 17",
    description: "Where to keep reading if this tier grabbed your interest.",
    difficulty: "Beginner",
    readMinutes: 1,
    sections: [
      {
        type: "references",
        items: [
          {
            label: "Python heapq — official docs",
            url: "https://docs.python.org/3/library/heapq.html",
          },
          { label: "CLRS Chapter 6 · Heapsort", url: "https://mitpress.mit.edu/9780262046305/" },
          {
            label: "GeeksforGeeks · Min Heap",
            url: "https://www.geeksforgeeks.org/min-heap-in-python/",
          },
          {
            label: "CP-Algorithms · Binary Heap",
            url: "https://cp-algorithms.com/data_structures/binary_heap.html",
          },
        ],
      },
    ],
  },
];
