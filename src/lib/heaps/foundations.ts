import type { HLesson } from "./types";

/** Foundations — vocabulary, memory layout, and mental model every heap
 *  variant depends on. */
export const H_FOUNDATIONS: HLesson[] = [
  {
    slug: "introduction",
    title: "Introduction",
    eyebrow: "Foundations · 1",
    description: "A heap is a complete binary tree that always keeps the extreme value at the root — the shape behind priority queues, Dijkstra, and heapq.",
    difficulty: "Beginner",
    readMinutes: 4,
    sections: [
      { type: "theory", text: "A heap is a complete binary tree that obeys a heap property: every parent compares favourably against its children. In a min-heap the smallest value sits at the root; in a max-heap the largest. Heaps are the tree behind the priority queue — the abstract data type that answers 'what should I look at next?' in O(log n)." },
      { type: "heapViz", data: [1, 3, 5, 7, 9, 8], kind: "min",
        caption: "A min-heap: 1 is the smallest and sits at the root; every parent ≤ its children." },
      { type: "callout", kind: "info", title: "Where we're headed",
        text: "Foundations → Min Heap → Max Heap → Heap Algorithms → Review & Practice. Master each tier before moving on." },
      { type: "code", title: "Python heapq — the built-in", code:
`import heapq

h = []
heapq.heappush(h, 5)
heapq.heappush(h, 1)
heapq.heappush(h, 3)

heapq.heappop(h)   # 1  — always the smallest
h[0]               # 3  — peek in O(1)` },
    ],
  },
  {
    slug: "why-heaps",
    title: "Why Heaps Matter",
    eyebrow: "Foundations · 2",
    description: "The one operation heaps are unbeatable at: give me the next extreme value, over and over, in O(log n).",
    difficulty: "Beginner",
    readMinutes: 4,
    sections: [
      { type: "table", headers: ["Structure", "Insert", "Peek min/max", "Extract min/max"], rows: [
        ["Unsorted array", "O(1)", "O(n)", "O(n)"],
        ["Sorted array",   "O(n)", "O(1)", "O(1) / O(n)"],
        ["Balanced BST",   "O(log n)", "O(log n)", "O(log n)"],
        ["Heap",           "O(log n)", "O(1)", "O(log n)"],
      ]},
      { type: "theory", text: "Heaps trade full ordering for partial ordering. You cannot list values in sorted order without repeatedly extracting — but if you only ever need the next best item, a heap beats every alternative." },
      { type: "callout", kind: "did", title: "The unifying idea",
        text: "A heap doesn't sort. It answers one question — 'what's the extreme value right now?' — cheaply, again and again, even as new values arrive." },
    ],
  },
  {
    slug: "terminology",
    title: "Heap Terminology",
    eyebrow: "Foundations · 3",
    description: "Root, leaf, height, complete tree, heap property — the vocabulary every later lesson assumes.",
    difficulty: "Beginner",
    readMinutes: 5,
    sections: [
      { type: "heapViz", data: [10, 20, 15, 30, 40, 50, 100, 25, 45], kind: "min",
        caption: "A complete binary tree stored in an array. Root = index 0; leaves live in the lower half of the array." },
      { type: "table", headers: ["Term", "Meaning"], rows: [
        ["Root", "The topmost node — index 0 in the array. Holds the extreme value."],
        ["Leaf", "A node with no children — indices >= n/2 in the array."],
        ["Height", "Longest root-to-leaf path length. For n nodes it is ⌊log₂ n⌋."],
        ["Complete tree", "Every level is fully filled except possibly the last, which fills left-to-right."],
        ["Heap property", "Parent-child ordering. Min-heap: parent ≤ children. Max-heap: parent ≥ children."],
        ["Last index", "n − 1 for an array of size n. The 'next free slot' during insertion."],
      ]},
      { type: "callout", kind: "tip", title: "Heap ≠ sorted",
        text: "A heap only guarantees the root is extreme. Siblings are NOT ordered — [1, 3, 2] and [1, 2, 3] are both valid min-heaps." },
    ],
  },
  {
    slug: "complete-binary-tree",
    title: "Complete Binary Tree Relationship",
    eyebrow: "Foundations · 4",
    description: "Why heaps insist on the shape of a complete binary tree — and what breaks if that shape is violated.",
    difficulty: "Beginner",
    readMinutes: 4,
    sections: [
      { type: "theory", text: "A complete binary tree fills every level top-to-bottom, left-to-right. Two properties fall out for free:" },
      { type: "theory", bullets: [
        "Height is exactly ⌊log₂ n⌋ — the tree stays as short as possible.",
        "There are no gaps in the array representation — we can pack the tree into a contiguous list.",
        "Insertion and deletion happen at the last index, which is trivially findable.",
      ]},
      { type: "heapViz", data: [1, 2, 3, 4, 5, 6, 7, 8, 9], kind: "min",
        caption: "Complete: nine nodes fill three levels perfectly, then the fourth level fills from the left." },
      { type: "callout", kind: "warn", title: "Non-complete = broken index math",
        text: "If the tree has holes, `2i + 1` no longer points at a real child. Every heap operation assumes the shape stays complete — insertion and deletion preserve it deliberately." },
    ],
  },
  {
    slug: "heap-property",
    title: "The Heap Property",
    eyebrow: "Foundations · 5",
    description: "The single ordering rule that defines a heap — and how min vs max heaps differ from BSTs.",
    difficulty: "Beginner",
    readMinutes: 5,
    sections: [
      { type: "theory", text: "The heap property is a local rule: it only relates a node to its immediate children, not siblings or cousins. That local rule is enough to guarantee the root is globally extreme." },
      { type: "table", headers: ["Structure", "Ordering rule", "Root holds"], rows: [
        ["Min heap", "parent ≤ each child", "Smallest value"],
        ["Max heap", "parent ≥ each child", "Largest value"],
        ["BST",      "left < parent < right (all descendants)", "Nothing special"],
      ]},
      { type: "callout", kind: "warn", title: "Heap ≠ BST",
        text: "In a BST, an inorder traversal produces sorted output. In a heap, the only guarantee is at the root — a heap traversal is essentially random order. Do not use a heap when you need to search for arbitrary values." },
      { type: "heapViz", data: [2, 5, 3, 8, 6, 7, 4], kind: "min",
        caption: "Valid min-heap: parents (2, 5, 3) are all ≤ their children. Siblings 5 and 3 are out of order — that's fine." },
    ],
  },
  {
    slug: "parent-child",
    title: "Parent & Child Relationships",
    eyebrow: "Foundations · 6",
    description: "Three arithmetic formulas replace pointer chasing — this is why heaps live in arrays.",
    difficulty: "Beginner",
    readMinutes: 5,
    sections: [
      { type: "code", title: "The three formulas", code:
`parent(i) = (i - 1) // 2
left(i)   = 2 * i + 1
right(i)  = 2 * i + 2` },
      { type: "indexDiagram", data: [10, 20, 15, 30, 40, 50, 100, 25], focus: 1,
        caption: "For index 1 (value 20): parent is 0, left child is 3, right child is 4." },
      { type: "theory", text: "Because indices are just integers, moving 'up' the tree is a single arithmetic shift. That eliminates the pointer overhead of a linked tree and keeps every heap operation cache-friendly." },
      { type: "callout", kind: "did", title: "Zero-indexed vs one-indexed",
        text: "Textbooks often use one-indexed arrays (root at index 1) because the math is prettier: parent = i//2, left = 2i, right = 2i+1. Python's heapq uses zero-indexed math shown above." },
    ],
  },
  {
    slug: "array-representation",
    title: "Array Representation",
    eyebrow: "Foundations · 7",
    description: "Level-order traversal of the tree IS the array. That single fact powers everything else.",
    difficulty: "Beginner",
    readMinutes: 5,
    sections: [
      { type: "theory", text: "Read the tree level by level, left to right, and write down each value. The resulting sequence is exactly the array representation. Reading it back the same way reconstructs the tree." },
      { type: "heapViz", data: [1, 3, 5, 7, 9, 8, 6], kind: "min",
        caption: "Read levels left-to-right: [1, 3, 5, 7, 9, 8, 6]." },
      { type: "code", title: "Python — build tree from array (mental model only)", code:
`# You NEVER actually build these nodes for a heap — the array IS the tree.
class Node:
    __slots__ = ("v", "l", "r")

def tree_from_heap(arr, i=0):
    if i >= len(arr): return None
    n = Node(); n.v = arr[i]
    n.l = tree_from_heap(arr, 2*i + 1)
    n.r = tree_from_heap(arr, 2*i + 2)
    return n` },
      { type: "callout", kind: "perf", title: "Why array beats pointers",
        text: "No allocations per node, no NULL branches, no cache misses walking pointers. A heap of a million ints is a single contiguous 8MB list — the CPU loves it." },
    ],
  },
  {
    slug: "memory-representation",
    title: "Memory Representation",
    eyebrow: "Foundations · 8",
    description: "How Python actually lays out a heap in memory — and why it is O(1) space overhead per element.",
    difficulty: "Beginner",
    readMinutes: 4,
    sections: [
      { type: "theory", text: "Python's `heapq` stores the heap in a regular `list`. A list is a contiguous array of PyObject pointers, so a heap of n integers costs exactly the same as a plain list of n integers — no per-node header, no left/right pointers, no null slots." },
      { type: "table", headers: ["Layout", "Bytes per element", "Overhead"], rows: [
        ["Linked binary tree", "value + 2 pointers + object header", "~48–64 B"],
        ["Array heap (Python list)", "1 PyObject pointer", "8 B on 64-bit"],
        ["Array heap (C / numpy int32)", "int32", "4 B"],
      ]},
      { type: "callout", kind: "info", title: "Amortized O(1) growth",
        text: "Python lists double in capacity when full, so n pushes cost O(n) total re-allocation work — amortized O(1) per push, on top of the heap's O(log n)." },
    ],
  },
  {
    slug: "index-calculations",
    title: "Index Calculations — Walked Through",
    eyebrow: "Foundations · 9",
    description: "Dry-run every parent/child hop on a real heap so the formulas stick.",
    difficulty: "Beginner",
    readMinutes: 4,
    sections: [
      { type: "heapViz", data: [10, 20, 15, 30, 40, 50, 100, 25, 45], kind: "min" },
      { type: "dryRun",
        headers: ["Node (i)", "Value", "parent = (i-1)//2", "left = 2i+1", "right = 2i+2"],
        rows: [
          ["0", "10", "—",   "1 (20)", "2 (15)"],
          ["1", "20", "0",   "3 (30)", "4 (40)"],
          ["2", "15", "0",   "5 (50)", "6 (100)"],
          ["3", "30", "1",   "7 (25)", "8 (45)"],
          ["4", "40", "1",   "9 (—)",  "10 (—)"],
        ],
        caption: "'—' means the index is out of range: that direction has no child." },
      { type: "tip", title: "Boundary check", text: "Always test `if left < n` before dereferencing a child. Off-by-one here is the #1 heap bug." },
    ],
  },
  {
    slug: "dynamic-memory",
    title: "Dynamic Memory & Resizing",
    eyebrow: "Foundations · 10",
    description: "How the underlying array grows during push and shrinks after pop — and why it stays amortized cheap.",
    difficulty: "Beginner",
    readMinutes: 4,
    sections: [
      { type: "theory", text: "A heap of n elements needs a container that supports append and pop-back in amortized O(1). Python's `list` gives exactly that: it over-allocates on growth so most appends cost O(1), with occasional O(n) copies when the capacity doubles." },
      { type: "table", headers: ["Operation", "Container work", "Heap work", "Total"], rows: [
        ["push",  "append (amortized O(1))",  "sift-up O(log n)", "O(log n) amortized"],
        ["pop",   "pop-back O(1)",            "sift-down O(log n)", "O(log n)"],
        ["heapify", "no growth", "n * O(1) sift-down (careful sum)", "O(n)"],
      ]},
      { type: "callout", kind: "warn", title: "Do not preserve iteration order",
        text: "Never iterate `for x in heap:` expecting sorted output — the list is in heap order, not sorted order. Extract with `heappop` in a loop, or use `heapq.nsmallest`." },
    ],
  },
  {
    slug: "time-complexity",
    title: "Time Complexity Overview",
    eyebrow: "Foundations · 11",
    description: "All heap operations at a glance — what the numbers are, and where they come from.",
    difficulty: "Beginner",
    readMinutes: 4,
    sections: [
      { type: "complexity", rows: [
        { op: "peek (root)",         time: "O(1)",       space: "O(1)", note: "Just read index 0." },
        { op: "push (insert)",       time: "O(log n)",   space: "O(1)", note: "Append + sift-up." },
        { op: "pop (extract root)",  time: "O(log n)",   space: "O(1)", note: "Swap + pop + sift-down." },
        { op: "heapify (build)",     time: "O(n)",       space: "O(1)", note: "Bottom-up sift-down." },
        { op: "heap sort",           time: "O(n log n)", space: "O(1)", note: "Heapify + n extracts." },
        { op: "search arbitrary",    time: "O(n)",       space: "O(1)", note: "Heap doesn't help search." },
        { op: "delete arbitrary",    time: "O(n)",       space: "O(1)", note: "Search + swap-last + sift both ways." },
      ]},
      { type: "callout", kind: "perf", title: "Why heapify is O(n), not O(n log n)",
        text: "Most nodes live near the bottom, where sift-down does almost no work. Summing the geometric series gives O(n) — see the Heap Algorithms tier for the derivation." },
    ],
  },
  {
    slug: "space-complexity",
    title: "Space Complexity Overview",
    eyebrow: "Foundations · 12",
    description: "How much memory a heap of n elements really takes — and where each byte goes.",
    difficulty: "Beginner",
    readMinutes: 3,
    sections: [
      { type: "complexity", rows: [
        { op: "storage",             time: "—", space: "O(n)",     note: "One slot per element in the array." },
        { op: "recursion (sift)",    time: "—", space: "O(log n)", note: "Iterative versions use O(1)." },
        { op: "heap sort in place",  time: "—", space: "O(1)",     note: "Sorts inside the input list." },
        { op: "k-way merge",         time: "—", space: "O(k)",     note: "Heap of k head pointers." },
      ]},
      { type: "tip", text: "Prefer iterative sift routines when writing your own heap — the extra stack frame from recursion is real, and `sys.setrecursionlimit` will bite you on very deep heaps." },
    ],
  },
];
