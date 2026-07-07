import type { ModuleQA } from "./types";

export const queuesQA: ModuleQA = {
  moduleSlug: "queues",
  moduleTitle: "Queues",
  faqPath: "/queues/faq",
  interviewPath: "/queues/interview",
  faqs: [
    {
      category: "Concepts",
      q: "What is a queue and why FIFO?",
      answer: [
        "A queue is a linear container where insertions happen at one end (rear) and removals at the other (front). First-In-First-Out order is what gives us fairness — items are served in the order they arrived.",
        "Everyday analogue: a ticket line, a printer job spool, requests entering a web server.",
      ],
      code: `from collections import deque\nq = deque()\nq.append(1)      # enqueue at rear\nq.append(2)\nq.popleft()      # dequeue from front → 1 (FIFO)`,
    },
    {
      category: "Concepts",
      q: "What are the different types of queues?",
      answer: [
        "• Linear queue — plain FIFO, either linked-list or array-backed.",
        "• Circular queue — fixed capacity, indices wrap modulo capacity → no unused slots.",
        "• Deque — double-ended, O(1) at both ends.",
        "• Priority queue — smallest (or largest) priority leaves first, backed by a heap.",
        "• Bounded / blocking queue — fixed capacity with `put`/`get` that block when full/empty (used in producer-consumer).",
      ],
      related: [
        { label: "Deque", to: "/modules/deque" },
        { label: "Priority Queue", to: "/modules/priority-queues" },
        { label: "Circular Queue", to: "/modules/circular-queue" },
      ],
    },
    {
      category: "Concepts",
      q: "Why is `list.pop(0)` a bad queue?",
      answer: [
        "`pop(0)` on a Python list shifts every remaining element one slot to the left — O(n) per dequeue. Running a real workload through it becomes O(n²) instantly.",
        "Always use `collections.deque` for a real FIFO: `append` at the rear and `popleft` at the front are both O(1).",
      ],
      code: `# BAD  – O(n) per dequeue\nq = []\nq.append(x); q.pop(0)\n\n# GOOD – O(1)\nfrom collections import deque\nq = deque()\nq.append(x); q.popleft()`,
      mistake:
        "Reaching for `list` when you needed a queue. This is the single most common Python performance bug in interview code.",
    },
    {
      category: "Concepts",
      q: "What is a bounded queue?",
      answer: [
        "A queue with a fixed maximum size. When full, further enqueues either block (in concurrent code) or fail. Used to apply back-pressure in producer-consumer pipelines so a fast producer cannot exhaust memory.",
        "Python's `queue.Queue(maxsize=N)` and `asyncio.Queue(maxsize=N)` are the standard-library bounded queues.",
      ],
    },
    {
      category: "Concepts",
      q: "What is a priority queue?",
      answer: [
        "A queue where each item has a priority, and the smallest (or largest) priority is dequeued first — not the oldest. Not FIFO.",
        "In Python, use `heapq` on a list: `heappush` and `heappop` are O(log n); reading the minimum is O(1) via `heap[0]`.",
      ],
      code: `import heapq\npq = []\nheapq.heappush(pq, (2, 'B'))\nheapq.heappush(pq, (1, 'A'))\nheapq.heappop(pq)     # (1, 'A')`,
      didYouKnow: "For a max-heap, negate the priority: `heapq.heappush(pq, -x)`.",
      related: [
        { label: "Priority Queue", to: "/modules/priority-queues" },
        { label: "Heaps", to: "/modules/heaps" },
      ],
    },
    {
      category: "Operations",
      q: "What are the core operations of a queue?",
      answer: [
        "• enqueue(x) — add to the rear.",
        "• dequeue() — remove from the front.",
        "• front() / peek() — read the front without removing.",
        "• rear() — read the rear without removing.",
        "• isEmpty(), size().",
        "All O(1) on a deque or a linked-list-backed queue.",
      ],
    },
    {
      category: "Operations",
      q: "How do I implement a queue using a linked list?",
      answer: [
        "Track both `head` (front) and `tail` (rear). Enqueue appends after `tail`; dequeue removes at `head`. Update both pointers correctly when the list becomes empty.",
      ],
      code: `class Node:\n    def __init__(self, v): self.v, self.next = v, None\nclass Queue:\n    def __init__(self): self.head = self.tail = None\n    def enqueue(self, x):\n        n = Node(x)\n        if not self.tail: self.head = n\n        else: self.tail.next = n\n        self.tail = n\n    def dequeue(self):\n        n = self.head\n        self.head = n.next\n        if not self.head: self.tail = None\n        return n.v`,
      time: "enqueue · dequeue — O(1)",
      related: [
        { label: "Linked Lists · Foundations", to: "/linked-lists/foundations/introduction" },
      ],
    },
    {
      category: "Operations",
      q: "How do I implement a queue using two stacks?",
      answer: [
        "Keep an `in` stack for enqueues and an `out` stack for dequeues. Whenever `out` is empty, drain `in` into `out`. Because each element moves at most once per stack, amortised cost is O(1) per operation.",
      ],
      code: `class Queue:\n    def __init__(self): self.i, self.o = [], []\n    def enqueue(self, x): self.i.append(x)\n    def dequeue(self):\n        if not self.o:\n            while self.i: self.o.append(self.i.pop())\n        return self.o.pop()`,
      time: "amortised O(1)",
      related: [{ label: "Interview · Queue using Stacks", to: "/queues/interview" }],
    },
    {
      category: "Operations",
      q: "How does a circular queue work?",
      answer: [
        "A fixed-capacity buffer with two indices — `front` and `rear` — plus a `size`. Both indices advance modulo capacity, so the array is reused as a ring. When `size == capacity` the queue is full; when `size == 0` it is empty.",
        "Tracking `size` separately is simpler than the classic 'leave one slot empty' trick — you don't have to reason about wrap-around collisions.",
      ],
      code: `class CircularQueue:\n    def __init__(self, cap):\n        self.buf = [None] * cap\n        self.cap = cap; self.front = 0; self.size = 0\n    def enqueue(self, x):\n        if self.size == self.cap: raise OverflowError\n        self.buf[(self.front + self.size) % self.cap] = x\n        self.size += 1\n    def dequeue(self):\n        if not self.size: raise IndexError\n        x = self.buf[self.front]\n        self.front = (self.front + 1) % self.cap\n        self.size -= 1\n        return x`,
      related: [{ label: "Circular Queue module", to: "/modules/circular-queue" }],
    },
    {
      category: "Operations",
      q: "How do I reverse a queue?",
      answer: [
        "Either dump into a stack and re-enqueue in pop order, or use recursion: dequeue the front, recurse on the smaller queue, then enqueue the saved element at the back.",
      ],
      code: `from collections import deque\ndef reverse(q):\n    st = []\n    while q: st.append(q.popleft())\n    while st: q.append(st.pop())`,
      time: "O(n)",
      space: "O(n)",
    },
    {
      category: "Design",
      q: "What is a deque and when should I use one?",
      answer: [
        "A deque (double-ended queue) supports O(1) push and pop at both ends. Ideal for sliding-window problems, monotonic-queue algorithms, and undo/redo where new events can arrive at either end.",
      ],
      code: `from collections import deque\ndq = deque([1, 2, 3])\ndq.appendleft(0)    # [0,1,2,3]\ndq.pop()            # 3`,
      related: [{ label: "Deque module", to: "/modules/deque" }],
    },
    {
      category: "Design",
      q: "When is a monotonic queue useful?",
      answer: [
        "A deque that keeps its values in monotonic (usually decreasing) order. It lets you answer 'max in a sliding window' in O(1) per window, giving overall O(n) instead of O(n·k).",
        "Whenever a new element arrives, pop from the back everything smaller — those can never be the max again while the newcomer is in the window.",
      ],
      code: `from collections import deque\ndef sliding_max(nums, k):\n    dq, out = deque(), []\n    for i, x in enumerate(nums):\n        while dq and nums[dq[-1]] < x: dq.pop()\n        dq.append(i)\n        if dq[0] <= i - k: dq.popleft()\n        if i >= k - 1: out.append(nums[dq[0]])\n    return out`,
      time: "O(n)",
      related: [{ label: "Pattern · Monotonic Queue", to: "/algorithms/monotonic-queue" }],
    },
    {
      category: "Design",
      q: "How does BFS use a queue?",
      answer: [
        "BFS explores a graph level by level. A queue guarantees you visit every node at distance d before any node at distance d+1 — because they were enqueued in that order.",
        "That's why BFS uses a queue and DFS uses a stack (implicit via recursion or explicit).",
      ],
      code: `from collections import deque\ndef bfs(start, graph):\n    seen = {start}; q = deque([start])\n    while q:\n        node = q.popleft()\n        for nb in graph[node]:\n            if nb not in seen:\n                seen.add(nb); q.append(nb)\n    return seen`,
    },
    {
      category: "Practical",
      q: "Applications of a queue in the real world",
      answer: [
        "• CPU / task schedulers (round-robin).",
        "• Printer job spool.",
        "• Message brokers and network buffers (Kafka partitions, TCP receive buffer).",
        "• Breadth-first search on trees and graphs.",
        "• Producer-consumer pipelines with back-pressure.",
      ],
    },
    {
      category: "Practical",
      q: "How is a priority queue used in Dijkstra's algorithm?",
      answer: [
        "Dijkstra always relaxes the currently-closest unvisited node. That 'currently closest' is exactly the min-priority element — an O(log n) heap pop.",
      ],
      related: [{ label: "Pattern · Heap", to: "/algorithms/heap" }],
    },
  ],

  interview: [
    // ── Theory ────────────────────────────────────────────────────────────
    {
      id: "q-i-1",
      title: "Applications of a queue",
      category: "Theory",
      difficulty: "Beginner",
      estMin: 3,
      tags: ["applications"],
      explanation: [
        "Schedulers, printer spools, network buffers, message brokers, BFS on graphs, producer-consumer pipelines. Any 'process in arrival order' problem.",
      ],
    },
    {
      id: "q-i-2",
      title: "Types of queues (Linear, Circular, Deque, Priority)",
      category: "Theory",
      difficulty: "Beginner",
      estMin: 4,
      tags: ["variants"],
      explanation: [
        "Linear: plain FIFO. Circular: fixed capacity, indices wrap. Deque: O(1) both ends. Priority: heap-backed, smallest (or largest) leaves first.",
      ],
    },
    {
      id: "q-i-3",
      title: "What is a priority queue?",
      category: "Theory",
      difficulty: "Beginner",
      estMin: 4,
      tags: ["heap"],
      explanation: [
        "Not FIFO. Elements carry a priority; smallest priority is dequeued first. Backed by a binary heap → O(log n) push/pop and O(1) peek.",
      ],
      relatedLessons: [{ label: "Priority Queue module", to: "/modules/priority-queues" }],
    },
    {
      id: "q-i-4",
      title: "What is a bounded queue?",
      category: "Theory",
      difficulty: "Beginner",
      estMin: 3,
      tags: ["concurrency"],
      explanation: [
        "A queue with maximum capacity. In concurrent code, enqueue blocks when full — that's how producers are throttled to match consumers.",
      ],
    },
    {
      id: "q-i-5",
      title: "Why is `list.pop(0)` a bad queue?",
      category: "Conceptual",
      difficulty: "Beginner",
      estMin: 3,
      tags: ["python-internals"],
      explanation: [
        "Contiguous storage means removing index 0 shifts every remaining element one slot left — O(n). Use `collections.deque` for real O(1) FIFO.",
      ],
    },

    // ── Implementation ────────────────────────────────────────────────────
    {
      id: "q-i-6",
      title: "Implement basic queue operations (enqueue, dequeue, front, isEmpty)",
      category: "Coding",
      difficulty: "Beginner",
      estMin: 10,
      tags: ["impl"],
      explanation: [
        "Wrap `collections.deque`. `append`, `popleft`, `[0]`, `not len(q)`. Five lines, all O(1).",
      ],
      code: `from collections import deque\nclass Queue:\n    def __init__(self): self.q = deque()\n    def enqueue(self, x): self.q.append(x)\n    def dequeue(self): return self.q.popleft()\n    def front(self): return self.q[0]\n    def is_empty(self): return not self.q`,
      time: "O(1)",
    },
    {
      id: "q-i-7",
      title: "Implement a queue using a linked list",
      category: "Coding",
      difficulty: "Intermediate",
      estMin: 15,
      tags: ["linked-list"],
      explanation: [
        "Track head + tail. Enqueue at tail; dequeue at head. Reset both to None when the list empties.",
      ],
      code: `class Node:\n    def __init__(self, v): self.v, self.next = v, None\nclass Queue:\n    def __init__(self): self.head = self.tail = None\n    def enqueue(self, x):\n        n = Node(x)\n        if not self.tail: self.head = n\n        else: self.tail.next = n\n        self.tail = n\n    def dequeue(self):\n        n = self.head\n        self.head = n.next\n        if not self.head: self.tail = None\n        return n.v`,
      time: "O(1)",
      relatedLessons: [
        { label: "Linked Lists foundations", to: "/linked-lists/foundations/introduction" },
      ],
    },
    {
      id: "q-i-8",
      title: "Implement a queue using two stacks",
      category: "Coding",
      difficulty: "Intermediate",
      estMin: 15,
      tags: ["must-do", "stack"],
      explanation: [
        "Enqueue into `in_stack`. Dequeue from `out_stack`, refilling it (by popping every element out of `in_stack`) only when empty. Amortised O(1) per op — every element moves at most twice.",
      ],
      code: `class Queue:\n    def __init__(self): self.i, self.o = [], []\n    def enqueue(self, x): self.i.append(x)\n    def dequeue(self):\n        if not self.o:\n            while self.i: self.o.append(self.i.pop())\n        return self.o.pop()`,
      time: "amortised O(1)",
      leetcode: {
        title: "232 · Implement Queue using Stacks",
        url: "https://leetcode.com/problems/implement-queue-using-stacks/",
        difficulty: "Easy",
      },
    },
    {
      id: "q-i-9",
      title: "Design a circular queue",
      category: "Coding",
      difficulty: "Intermediate",
      estMin: 25,
      tags: ["must-do", "design"],
      explanation: [
        "Fixed-size buffer, `front` index, `size` counter. Rear index derived as `(front + size) % capacity`. Full when `size == capacity`, empty when `size == 0`.",
      ],
      code: `class MyCircularQueue:\n    def __init__(self, k):\n        self.buf = [0]*k; self.cap = k; self.front = 0; self.size = 0\n    def enQueue(self, x):\n        if self.size == self.cap: return False\n        self.buf[(self.front + self.size) % self.cap] = x; self.size += 1; return True\n    def deQueue(self):\n        if not self.size: return False\n        self.front = (self.front + 1) % self.cap; self.size -= 1; return True\n    def Front(self): return -1 if not self.size else self.buf[self.front]\n    def Rear(self):  return -1 if not self.size else self.buf[(self.front + self.size - 1) % self.cap]\n    def isEmpty(self): return self.size == 0\n    def isFull(self):  return self.size == self.cap`,
      time: "O(1)",
      leetcode: {
        title: "622 · Design Circular Queue",
        url: "https://leetcode.com/problems/design-circular-queue/",
        difficulty: "Medium",
      },
    },
    {
      id: "q-i-10",
      title: "Design a circular queue with maximum length (LRU-like)",
      category: "Coding",
      difficulty: "Advanced",
      estMin: 25,
      tags: ["design"],
      explanation: [
        "Extend the circular queue: when it hits capacity, overwrite the oldest slot instead of rejecting the push. Advance `front` too.",
      ],
      code: `class RingBuffer:\n    def __init__(self, cap):\n        self.buf = [None]*cap; self.cap = cap; self.front = 0; self.size = 0\n    def push(self, x):\n        idx = (self.front + self.size) % self.cap\n        self.buf[idx] = x\n        if self.size < self.cap: self.size += 1\n        else: self.front = (self.front + 1) % self.cap`,
      time: "O(1)",
    },
    {
      id: "q-i-11",
      title: "Implement a deque with O(1) at both ends",
      category: "Coding",
      difficulty: "Intermediate",
      estMin: 15,
      tags: ["deque"],
      explanation: [
        "The circular-buffer trick extends to both ends: adjust `front` on `appendleft`, adjust `rear` on `append`. Python ships `collections.deque` for exactly this.",
      ],
      code: `from collections import deque\ndq = deque([1, 2, 3])\ndq.appendleft(0); dq.append(4); dq.popleft(); dq.pop()`,
      time: "O(1) per op",
    },

    // ── Algorithms ────────────────────────────────────────────────────────
    {
      id: "q-i-12",
      title: "Reverse a queue",
      category: "Coding",
      difficulty: "Beginner",
      estMin: 10,
      tags: ["stack"],
      explanation: [
        "Push everything into a stack, then re-enqueue popping from the stack. O(n) time and space.",
      ],
      code: `from collections import deque\ndef reverse(q):\n    st = []\n    while q: st.append(q.popleft())\n    while st: q.append(st.pop())`,
      time: "O(n)",
      space: "O(n)",
    },
    {
      id: "q-i-13",
      title: "Sliding Window Maximum",
      category: "Optimization",
      difficulty: "FAANG",
      estMin: 30,
      tags: ["must-do", "monotonic-queue"],
      explanation: [
        "Maintain a deque of indices whose values are decreasing. When a new element is larger than the deque's back, pop until it isn't. Drop the front if it falls outside the window. Overall O(n).",
      ],
      code: `from collections import deque\ndef sliding_max(nums, k):\n    dq, out = deque(), []\n    for i, x in enumerate(nums):\n        while dq and nums[dq[-1]] < x: dq.pop()\n        dq.append(i)\n        if dq[0] <= i - k: dq.popleft()\n        if i >= k - 1: out.append(nums[dq[0]])\n    return out`,
      time: "O(n)",
      space: "O(k)",
      leetcode: {
        title: "239 · Sliding Window Maximum",
        url: "https://leetcode.com/problems/sliding-window-maximum/",
        difficulty: "Hard",
      },
      relatedAlgorithm: "monotonic-queue",
    },
    {
      id: "q-i-14",
      title: "Number of Islands (BFS)",
      category: "Coding",
      difficulty: "Intermediate",
      estMin: 25,
      tags: ["bfs", "grid"],
      explanation: [
        "Scan the grid. On each unvisited '1' cell, run BFS with a queue to flood the connected component and increment the island counter.",
      ],
      leetcode: {
        title: "200 · Number of Islands",
        url: "https://leetcode.com/problems/number-of-islands/",
        difficulty: "Medium",
      },
    },
    {
      id: "q-i-15",
      title: "Task Scheduler with cool-down",
      category: "Optimization",
      difficulty: "FAANG",
      estMin: 30,
      tags: ["heap", "queue"],
      explanation: [
        "Max-heap of task counts + a FIFO queue of (count, ready-time). Pop the most frequent task, decrement, and push into the cool-down queue; refill the heap when tasks come off cool-down.",
      ],
      leetcode: {
        title: "621 · Task Scheduler",
        url: "https://leetcode.com/problems/task-scheduler/",
        difficulty: "Medium",
      },
      relatedAlgorithm: "heap",
    },
    {
      id: "q-i-16",
      title: "Design a Hit Counter (last 5 minutes)",
      category: "Company",
      difficulty: "Intermediate",
      estMin: 20,
      tags: ["design"],
      explanation: [
        "Store timestamps in a deque. On hit, append the timestamp; on getHits(t), popleft everything older than `t - 300`, then return the deque length.",
      ],
      leetcode: {
        title: "362 · Design Hit Counter",
        url: "https://leetcode.com/problems/design-hit-counter/",
        difficulty: "Medium",
      },
    },

    // ── Follow-ups ────────────────────────────────────────────────────────
    {
      id: "q-i-17",
      title: "Convert a queue into a stack",
      category: "Follow-up",
      difficulty: "Intermediate",
      estMin: 15,
      tags: ["design"],
      explanation: [
        "Use a single queue. Push new element by appending, then rotating the queue by (n-1) — the newest element ends up at the front, making it 'top of stack'.",
      ],
      code: `from collections import deque\nclass Stack:\n    def __init__(self): self.q = deque()\n    def push(self, x):\n        self.q.append(x)\n        for _ in range(len(self.q) - 1): self.q.append(self.q.popleft())\n    def pop(self): return self.q.popleft()\n    def top(self): return self.q[0]`,
      time: "push O(n) · pop O(1)",
      leetcode: {
        title: "225 · Implement Stack using Queues",
        url: "https://leetcode.com/problems/implement-stack-using-queues/",
        difficulty: "Easy",
      },
    },
    {
      id: "q-i-18",
      title: "Applications of a deque in interview problems",
      category: "Follow-up",
      difficulty: "Intermediate",
      estMin: 10,
      tags: ["deque"],
      explanation: [
        "Sliding-window max/min, palindrome checking (compare `pop()` and `popleft()`), monotonic-queue shortest-path shortcuts, and undo/redo stacks that need to be capped from the far end.",
      ],
    },
    {
      id: "q-i-19",
      title: "Applications of a priority queue",
      category: "Follow-up",
      difficulty: "Intermediate",
      estMin: 10,
      tags: ["heap"],
      explanation: [
        "Dijkstra's shortest path, Prim's MST, A* pathfinding, top-K problems, event-driven simulations, Huffman coding, k-way merge, task scheduling with priorities.",
      ],
      relatedLessons: [
        { label: "Priority Queue module", to: "/modules/priority-queues" },
        { label: "Heap pattern", to: "/algorithms/heap" },
      ],
    },
    {
      id: "q-i-20",
      title: "Edge case — enqueue on a full circular queue",
      category: "Edge Case",
      difficulty: "Beginner",
      estMin: 3,
      tags: ["safety"],
      explanation: [
        "Return `False` or raise `OverflowError` — but pick one and document it. Silent overwrite (ring buffer) is a valid design choice for logging, but a terrible surprise for a FIFO.",
      ],
    },
    {
      id: "q-i-21",
      title: "Edge case — dequeue from an empty queue",
      category: "Edge Case",
      difficulty: "Beginner",
      estMin: 3,
      tags: ["safety"],
      explanation: [
        "`deque.popleft()` raises `IndexError`. Blocking queues (`queue.Queue.get`) block until an item arrives or a timeout expires. Choose one behaviour and stick to it API-wide.",
      ],
    },
  ],
};
