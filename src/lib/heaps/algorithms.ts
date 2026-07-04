import type { HLesson } from "./types";

export const H_ALGORITHMS: HLesson[] = [
  {
    slug: "heapify",
    title: "Heapify",
    eyebrow: "Algorithms · 1",
    description: "The one-node fix — sift-down from a single index. Every other heap operation is built on top of it.",
    difficulty: "Intermediate",
    readMinutes: 4,
    sections: [
      { type: "theory", text: "'Heapify at i' assumes both subtrees rooted at i are already valid heaps and fixes the single potentially-broken relationship between i and its children. It runs in O(height − depth(i)) — at most O(log n)." },
      { type: "code", code:
`def heapify(a, i, n=None):
    """Sift-down at index i, assuming children are already heaps."""
    n = n if n is not None else len(a)
    while True:
        l, r = 2*i + 1, 2*i + 2
        s = i
        if l < n and a[l] < a[s]: s = l
        if r < n and a[r] < a[s]: s = r
        if s == i: return
        a[i], a[s] = a[s], a[i]
        i = s` },
      { type: "callout", kind: "tip", title: "The `n` parameter",
        text: "The explicit `n` argument lets heap sort reuse this routine while shrinking the active heap in place — see the Heap Sort lesson." },
    ],
  },
  {
    slug: "build-heap",
    title: "Build Heap — Why O(n)?",
    eyebrow: "Algorithms · 2",
    description: "The single most surprising heap fact, proved with a geometric sum.",
    difficulty: "Advanced",
    readMinutes: 5,
    sections: [
      { type: "theory", text: "At height h a node's sift-down does at most h work. In a complete tree with n nodes, roughly n/2^(h+1) nodes sit at height h. Summing h × n/2^(h+1) from h=0 to log n gives a bounded geometric series that collapses to O(n)." },
      { type: "code", title: "Bottom-up construction", code:
`def build_heap(a):
    for i in range(len(a) // 2 - 1, -1, -1):
        heapify(a, i)` },
      { type: "callout", kind: "perf", title: "Contrast: naïve build",
        text: "Calling push n times does one O(log n) sift-up per element — worst-case Θ(n log n). The bottom-up approach saves the log-factor by processing shallow subtrees before deep ones." },
    ],
  },
  {
    slug: "insert",
    title: "Insert — Sift Up",
    eyebrow: "Algorithms · 3",
    description: "Append + walk toward the root swapping with the parent.",
    difficulty: "Beginner",
    readMinutes: 3,
    sections: [
      { type: "heapPlayground", kind: "min", seed: [2, 5, 3, 8, 6] },
      { type: "code", code:
`def push(a, x):
    a.append(x)
    i = len(a) - 1
    while i > 0 and a[i] < a[(i-1)//2]:
        a[i], a[(i-1)//2] = a[(i-1)//2], a[i]
        i = (i-1)//2` },
    ],
  },
  {
    slug: "delete",
    title: "Delete Root — Sift Down",
    eyebrow: "Algorithms · 4",
    description: "Swap root with last, pop tail, then sift-down.",
    difficulty: "Beginner",
    readMinutes: 3,
    sections: [
      { type: "heapPlayground", kind: "min", seed: [1, 3, 2, 7, 9, 5, 4, 10, 12, 8] },
      { type: "code", code:
`def pop(a):
    top = a[0]
    last = a.pop()
    if a:
        a[0] = last
        heapify(a, 0)
    return top` },
    ],
  },
  {
    slug: "extract-min",
    title: "Extract Min",
    eyebrow: "Algorithms · 5",
    description: "The API surface of a min-priority queue: peek in O(1), pop in O(log n).",
    difficulty: "Beginner",
    readMinutes: 2,
    sections: [
      { type: "code", code:
`import heapq

h = [5, 3, 8, 1, 2]
heapq.heapify(h)                 # O(n)

heapq.heappop(h)                 # 1  — extract min
heapq.heapreplace(h, 6)          # pop, then push 6 in a single sift` },
      { type: "callout", kind: "tip", title: "heapreplace vs pop+push",
        text: "`heapreplace` performs one sift-down instead of a pop followed by a separate sift-up — half the constant factor when you know you're immediately reinserting." },
    ],
  },
  {
    slug: "extract-max",
    title: "Extract Max",
    eyebrow: "Algorithms · 6",
    description: "Same shape as extract-min with a flipped comparator — or a negated heapq wrapper.",
    difficulty: "Beginner",
    readMinutes: 2,
    sections: [
      { type: "code", code:
`import heapq

h = [-x for x in [5, 3, 8, 1, 2]]
heapq.heapify(h)

-heapq.heappop(h)   # 8 — extract max
-h[0]               # 5 — peek max` },
    ],
  },
  {
    slug: "heap-sort",
    title: "Heap Sort",
    eyebrow: "Algorithms · 7",
    description: "In-place O(n log n) sorting with O(1) extra memory — the algorithm that gives heaps their pedigree.",
    difficulty: "Intermediate",
    readMinutes: 5,
    sections: [
      { type: "theory", text: "Build a max-heap over the array, then repeatedly swap the root with the last unsorted position and shrink the heap by one. After n − 1 iterations the array is sorted ascending, entirely in place." },
      { type: "code", title: "In-place heap sort", code:
`def heap_sort(a):
    n = len(a)

    # 1) Build a max-heap in O(n).
    for i in range(n // 2 - 1, -1, -1):
        _sift_down(a, i, n)

    # 2) Repeatedly extract the max to the end.
    for end in range(n - 1, 0, -1):
        a[0], a[end] = a[end], a[0]
        _sift_down(a, 0, end)          # shrink heap boundary


def _sift_down(a, i, n):
    while True:
        l, r = 2*i + 1, 2*i + 2
        big = i
        if l < n and a[l] > a[big]: big = l
        if r < n and a[r] > a[big]: big = r
        if big == i: return
        a[i], a[big] = a[big], a[i]
        i = big` },
      { type: "complexity", rows: [
        { op: "build (max-heap)", time: "O(n)",       space: "O(1)" },
        { op: "n × extract-max",  time: "O(n log n)", space: "O(1)" },
        { op: "total",            time: "O(n log n)", space: "O(1)", note: "In-place, but not stable." },
      ]},
      { type: "callout", kind: "warn", title: "Not stable",
        text: "Heap sort does not preserve the relative order of equal keys. If you need stability, use merge sort or Python's Timsort (`sorted`)." },
    ],
  },
  {
    slug: "priority-queue",
    title: "Priority Queue",
    eyebrow: "Algorithms · 8",
    description: "The abstract data type that heaps implement — plus the tuple trick that keeps it usable with real objects.",
    difficulty: "Intermediate",
    readMinutes: 5,
    sections: [
      { type: "theory", text: "A priority queue exposes three operations: add-with-priority, peek-highest, and remove-highest. A heap gives you all three at logarithmic cost. When two items share a priority, we push a monotonic counter as a tiebreaker so Python never has to compare the payloads themselves." },
      { type: "code", title: "Robust priority queue", code:
`import heapq, itertools

class PriorityQueue:
    def __init__(self):
        self.pq = []
        self.counter = itertools.count()

    def push(self, item, priority):
        heapq.heappush(self.pq, (priority, next(self.counter), item))

    def pop(self):
        return heapq.heappop(self.pq)[-1]

    def peek(self):
        return self.pq[0][-1]

    def __len__(self):
        return len(self.pq)` },
      { type: "mistakes", items: [
        "Pushing `(priority, dict)` — dicts are unhashable AND unorderable, so ties crash.",
        "Forgetting a stable tiebreaker — swaps become non-deterministic and tests flake.",
        "Trying to delete an arbitrary item — mark it invalid and skip on pop instead (lazy deletion).",
      ]},
    ],
  },
  {
    slug: "top-k",
    title: "Top-K Pattern",
    eyebrow: "Algorithms · 9",
    description: "Maintain a min-heap of size k over a stream to get the k largest in O(n log k).",
    difficulty: "Intermediate",
    readMinutes: 4,
    sections: [
      { type: "theory", text: "For each value, push it; if the heap grows past k, pop the smallest. What remains is the k largest values in O(n log k) time and O(k) space — dramatically better than sorting when k ≪ n." },
      { type: "code", code:
`import heapq

def top_k_largest(nums, k):
    h = []
    for x in nums:
        heapq.heappush(h, x)
        if len(h) > k:
            heapq.heappop(h)
    return h        # size k, in heap order (root = k-th largest)` },
      { type: "complexity", rows: [
        { op: "n × push + evict", time: "O(n log k)", space: "O(k)" },
        { op: "sort-then-slice",  time: "O(n log n)", space: "O(1)–O(n)", note: "Worse when k ≪ n." },
      ]},
    ],
  },
  {
    slug: "kth-largest",
    title: "Kth Largest Element",
    eyebrow: "Algorithms · 10",
    description: "The canonical top-K application: return the root of a size-k min-heap.",
    difficulty: "Intermediate",
    readMinutes: 3,
    sections: [
      { type: "code", code:
`import heapq

def kth_largest(nums, k):
    h = []
    for x in nums:
        heapq.heappush(h, x)
        if len(h) > k:
            heapq.heappop(h)
    return h[0]     # smallest of the k largest = k-th largest overall

# Or with the stdlib helper:
def kth_largest_v2(nums, k):
    return heapq.nlargest(k, nums)[-1]` },
    ],
  },
  {
    slug: "median-stream",
    title: "Median From Data Stream",
    eyebrow: "Algorithms · 11",
    description: "Two heaps in a see-saw — max-heap for the lower half, min-heap for the upper.",
    difficulty: "Advanced",
    readMinutes: 5,
    sections: [
      { type: "theory", text: "Split the stream in half. The lower half sits in a max-heap so its largest value is instantly available; the upper half sits in a min-heap. Rebalance after every insert so the sizes differ by at most one. The median is either the top of the larger heap or the average of the two tops." },
      { type: "code", code:
`import heapq

class MedianFinder:
    def __init__(self):
        self.lo = []   # max-heap (store negatives)
        self.hi = []   # min-heap

    def add(self, x):
        heapq.heappush(self.lo, -heapq.heappushpop(self.hi, x))
        if len(self.lo) > len(self.hi) + 1:
            heapq.heappush(self.hi, -heapq.heappop(self.lo))

    def median(self):
        if len(self.lo) > len(self.hi):
            return -self.lo[0]
        return (-self.lo[0] + self.hi[0]) / 2` },
      { type: "complexity", rows: [
        { op: "add",    time: "O(log n)", space: "O(n)" },
        { op: "median", time: "O(1)",     space: "O(1)" },
      ]},
    ],
  },
  {
    slug: "merge-k-sorted",
    title: "Merge K Sorted Lists",
    eyebrow: "Algorithms · 12",
    description: "Heap of size k over the list heads — pop the smallest, advance that list, repeat.",
    difficulty: "Advanced",
    readMinutes: 4,
    sections: [
      { type: "code", code:
`import heapq

def merge_k_sorted(lists):
    """lists: list of ascending iterables. Returns a merged ascending list."""
    h = []
    for i, it in enumerate(lists):
        it = iter(it)
        first = next(it, None)
        if first is not None:
            heapq.heappush(h, (first, i, it))

    out = []
    while h:
        val, i, it = heapq.heappop(h)
        out.append(val)
        nxt = next(it, None)
        if nxt is not None:
            heapq.heappush(h, (nxt, i, it))
    return out` },
      { type: "complexity", rows: [
        { op: "each element", time: "O(log k)", space: "O(k)" },
        { op: "total (N items)", time: "O(N log k)", space: "O(k)" },
      ]},
      { type: "callout", kind: "tip", title: "Use heapq.merge",
        text: "For plain iterables of comparable items you can skip the manual heap: `list(heapq.merge(*lists))` implements this pattern for you." },
    ],
  },
];
