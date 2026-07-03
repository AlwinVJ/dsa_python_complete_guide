import type { QueueLesson } from "./types";

/** Variants tier — six canonical queue implementations. */
export const QUEUE_VARIANTS: QueueLesson[] = [
  {
    slug: "linear-queue",
    title: "Linear Queue",
    eyebrow: "Variants · 1",
    description: "The textbook FIFO — array-backed with front and rear pointers that only move right.",
    difficulty: "Beginner",
    readMinutes: 6,
    sections: [
      { type: "theory", text: "A linear queue uses a fixed-size array with two indices. Enqueue writes to buf[rear] and advances rear; dequeue reads buf[front] and advances front. Simple — and wasteful once the front leaves slots behind." },
      { type: "viz", items: [10, 20, 30, 40], caption: "Live window inside a 6-slot buffer.", capacity: 6 },
      { type: "code", title: "class LinearQueue", code:
`class LinearQueue:
    def __init__(self, cap):
        self.buf   = [None] * cap
        self.cap   = cap
        self.front = 0
        self.rear  = 0

    def enqueue(self, x):
        if self.rear == self.cap:
            raise OverflowError("queue is full")
        self.buf[self.rear] = x
        self.rear += 1

    def dequeue(self):
        if self.front == self.rear:
            raise IndexError("dequeue from empty queue")
        x = self.buf[self.front]
        self.front += 1
        return x

    def __len__(self):
        return self.rear - self.front` },
      { type: "complexity", rows: [
        { op: "enqueue", time: "O(1)" },
        { op: "dequeue", time: "O(1)" },
        { op: "space",   time: "O(cap)", note: "wasted slots left behind by dequeue" },
      ]},
      { type: "callout", kind: "warn", title: "Waste problem",
        text: "After many dequeues, front can reach the end of the array even though most slots are empty. That is why the circular queue exists." },
    ],
  },
  {
    slug: "circular-queue",
    title: "Circular Queue",
    eyebrow: "Variants · 2",
    description: "Wrap the rear back to slot 0 to reclaim empty space — a fixed-capacity queue that never wastes slots.",
    difficulty: "Intermediate",
    readMinutes: 8,
    sections: [
      { type: "theory", text: "Treat the buffer as a ring. Both front and rear advance modulo the capacity, so when rear reaches the end it wraps to index 0 and reuses the space dequeue vacated." },
      { type: "viz", items: [30, 40, 10, 20], variant: "circular", capacity: 6, headIndex: 2,
        caption: "front=2, rear=(2+4)%6=0 — the queue wraps across the buffer boundary." },
      { type: "code", title: "class CircularQueue", code:
`class CircularQueue:
    def __init__(self, cap):
        self.buf   = [None] * cap
        self.cap   = cap
        self.front = 0
        self.size  = 0

    def enqueue(self, x):
        if self.size == self.cap:
            raise OverflowError("queue is full")
        rear = (self.front + self.size) % self.cap
        self.buf[rear] = x
        self.size += 1

    def dequeue(self):
        if self.size == 0:
            raise IndexError("empty")
        x = self.buf[self.front]
        self.front = (self.front + 1) % self.cap
        self.size -= 1
        return x` },
      { type: "dryRun", headers: ["op", "front", "size", "buf"], rows: [
        ["init cap=4",         "0", "0", "[_, _, _, _]"],
        ["enqueue 10, 20, 30", "0", "3", "[10, 20, 30, _]"],
        ["dequeue → 10",       "1", "2", "[_, 20, 30, _]"],
        ["dequeue → 20",       "2", "1", "[_, _, 30, _]"],
        ["enqueue 40, 50",     "2", "3", "[50, _, 30, 40]"],
      ], caption: "Notice how 50 wraps into slot 0." },
      { type: "complexity", rows: [
        { op: "enqueue / dequeue", time: "O(1)" },
        { op: "space",             time: "O(cap)", note: "no wasted slots" },
      ]},
      { type: "callout", kind: "interview", title: "LeetCode 622",
        text: "Design Circular Queue is a very common interview problem — practise until the modulo arithmetic feels effortless." },
    ],
  },
  {
    slug: "deque",
    title: "Deque (Double-Ended Queue)",
    eyebrow: "Variants · 3",
    description: "O(1) push and pop at both ends — the Swiss Army knife of sliding-window and monotonic algorithms.",
    difficulty: "Intermediate",
    readMinutes: 6,
    sections: [
      { type: "theory", text: "A deque generalises the queue: you can enqueue or dequeue at either end in O(1). Python ships one in `collections.deque`, implemented as a doubly linked list of 64-slot blocks." },
      { type: "code", code:
`from collections import deque

dq = deque([1, 2, 3])
dq.appendleft(0)     # [0, 1, 2, 3]  — enqueue front
dq.append(4)         # [0, 1, 2, 3, 4] — enqueue rear
dq.popleft()         # 0             — dequeue front
dq.pop()             # 4             — dequeue rear` },
      { type: "complexity", rows: [
        { op: "append / appendleft", time: "O(1)" },
        { op: "pop / popleft",       time: "O(1)" },
        { op: "indexing dq[k]",      time: "O(k)", note: "not random-access — avoid" },
      ]},
      { type: "callout", kind: "did", title: "Real uses",
        text: "Sliding-window maximum, undo/redo, palindrome checking, and BFS with early termination all lean on deques." },
    ],
  },
  {
    slug: "priority-queue",
    title: "Priority Queue",
    eyebrow: "Variants · 4",
    description: "Not FIFO — the smallest (or largest) priority leaves first. Backed by a binary heap.",
    difficulty: "Intermediate",
    readMinutes: 7,
    sections: [
      { type: "theory", text: "A priority queue orders items by an external key, not by arrival time. Python's `heapq` module maintains a binary min-heap on top of a list — push and pop are O(log n) and peek is O(1)." },
      { type: "code", code:
`import heapq

pq = []
heapq.heappush(pq, (2, "task B"))
heapq.heappush(pq, (1, "task A"))
heapq.heappush(pq, (3, "task C"))

heapq.heappop(pq)   # (1, 'task A') — smallest priority first` },
      { type: "callout", kind: "tip", title: "Max-heap trick",
        text: "Python only ships a min-heap. For a max-heap, push -priority and negate on pop." },
      { type: "complexity", rows: [
        { op: "push",    time: "O(log n)" },
        { op: "pop",     time: "O(log n)" },
        { op: "peek",    time: "O(1)" },
        { op: "heapify", time: "O(n)" },
      ]},
      { type: "callout", kind: "interview", title: "Where it shows up",
        text: "Dijkstra, A*, top-K problems, median-in-a-stream, meeting-room scheduling — all priority-queue territory." },
    ],
  },
  {
    slug: "queue-using-linked-list",
    title: "Queue using a Linked List",
    eyebrow: "Variants · 5",
    description: "No fixed capacity, guaranteed O(1) — a linked list with head and tail pointers is the classic textbook queue.",
    difficulty: "Intermediate",
    readMinutes: 6,
    sections: [
      { type: "theory", text: "Keep two pointers: head (the front) and tail (the rear). Dequeue unlinks head; enqueue appends to tail. No resizing, no wrap-around, no wasted slots — but every node costs one pointer of overhead." },
      { type: "code", title: "class LinkedListQueue", code:
`class Node:
    __slots__ = ("value", "next")
    def __init__(self, value):
        self.value = value
        self.next  = None

class LinkedListQueue:
    def __init__(self):
        self.head = None
        self.tail = None
        self._n   = 0

    def enqueue(self, x):
        node = Node(x)
        if self.tail is None:
            self.head = self.tail = node
        else:
            self.tail.next = node
            self.tail = node
        self._n += 1

    def dequeue(self):
        if self.head is None:
            raise IndexError("empty")
        node = self.head
        self.head = node.next
        if self.head is None:
            self.tail = None
        self._n -= 1
        return node.value

    def __len__(self):
        return self._n` },
      { type: "complexity", rows: [
        { op: "enqueue / dequeue", time: "O(1)" },
        { op: "space per node",    time: "O(1)", note: "one extra pointer" },
      ]},
    ],
  },
  {
    slug: "queue-using-stacks",
    title: "Queue using two Stacks",
    eyebrow: "Variants · 6",
    description: "A classic interview trick — build FIFO out of only push/pop primitives.",
    difficulty: "Intermediate",
    readMinutes: 6,
    sections: [
      { type: "theory", text: "Use two stacks: `inbox` for incoming items and `outbox` for outgoing. Enqueue just pushes onto inbox. Dequeue: if outbox is empty, drain inbox into outbox (which reverses the order), then pop outbox. Each element moves at most twice — amortised O(1)." },
      { type: "code", title: "class QueueFromStacks", code:
`class QueueFromStacks:
    def __init__(self):
        self.inb = []
        self.out = []

    def enqueue(self, x):
        self.inb.append(x)

    def dequeue(self):
        if not self.out:
            while self.inb:
                self.out.append(self.inb.pop())
        if not self.out:
            raise IndexError("empty")
        return self.out.pop()` },
      { type: "dryRun", headers: ["op", "inb", "out", "returns"], rows: [
        ["enqueue(1)",       "[1]",    "[]",       "—"],
        ["enqueue(2)",       "[1, 2]", "[]",       "—"],
        ["dequeue → 1",      "[]",     "[2]",      "1 (drained then popped)"],
        ["enqueue(3)",       "[3]",    "[2]",      "—"],
        ["dequeue → 2",      "[3]",    "[]",       "2"],
        ["dequeue → 3",      "[]",    "[]",        "3 (drain again)"],
      ]},
      { type: "complexity", rows: [
        { op: "enqueue",          time: "O(1)" },
        { op: "dequeue amortised",time: "O(1)" },
        { op: "dequeue worst",    time: "O(n)", note: "when outbox is empty and inbox has n items" },
      ]},
      { type: "callout", kind: "interview", title: "LeetCode 232",
        text: "Implement Queue using Stacks — a warm-up FAANG problem. Nail the amortised analysis." },
    ],
  },
];
