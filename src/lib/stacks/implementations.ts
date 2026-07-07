import type { StackLesson } from "./types";

/** Implementations tier — four canonical ways to build a stack. */
export const STACK_IMPLEMENTATIONS: StackLesson[] = [
  {
    slug: "python-list",
    title: "Stack using a Python List",
    eyebrow: "Implementations · 1",
    description: "The default and almost always the right choice. Amortised O(1) push and pop.",
    difficulty: "Beginner",
    readMinutes: 5,
    sections: [
      {
        type: "theory",
        text: "Python's built-in list already supports append() and pop() — both are O(1) amortised. You get a fully-functional stack with zero extra code, but a thin wrapper class is worth it for clarity and error handling.",
      },
      {
        type: "code",
        title: "python — thin wrapper",
        code: `class Stack:
    __slots__ = ("_data",)

    def __init__(self, initial=()):
        self._data = list(initial)

    def push(self, x):        self._data.append(x)
    def pop(self):
        if not self._data:
            raise IndexError("pop from empty stack")
        return self._data.pop()
    def peek(self):           return self._data[-1] if self._data else None
    def is_empty(self):       return not self._data
    def __len__(self):        return len(self._data)
    def __repr__(self):       return f"Stack({self._data!r})"`,
      },
      { type: "viz", items: [10, 20, 30], caption: "Stack([10,20,30]) — TOP = 30" },
      {
        type: "dryRun",
        headers: ["step", "call", "internal list", "return"],
        rows: [
          ["1", "push(10)", "[10]", "—"],
          ["2", "push(20)", "[10, 20]", "—"],
          ["3", "peek()", "[10, 20]", "20"],
          ["4", "pop()", "[10]", "20"],
        ],
      },
      {
        type: "complexity",
        rows: [
          { op: "push", time: "O(1) amortised" },
          { op: "pop", time: "O(1)" },
          { op: "peek", time: "O(1)" },
        ],
      },
      {
        type: "callout",
        kind: "perf",
        title: "Why 'amortised'?",
        text: "list.append doubles the underlying buffer when full. That single doubling costs O(n), but it happens rarely enough that averaged over many pushes each one costs O(1).",
      },
    ],
  },
  {
    slug: "array",
    title: "Stack using a Fixed-size Array",
    eyebrow: "Implementations · 2",
    description:
      "The classic textbook implementation — pre-allocated buffer plus an explicit stack pointer.",
    difficulty: "Beginner",
    readMinutes: 5,
    sections: [
      {
        type: "theory",
        text: "In competitive-programming or embedded contexts you often want a bounded, allocation-free stack. Pre-allocate a fixed buffer and maintain an integer stack pointer yourself.",
      },
      {
        type: "code",
        title: "python — bounded stack",
        code: `class ArrayStack:
    def __init__(self, capacity):
        self.buf = [None] * capacity
        self.sp = 0
        self.cap = capacity

    def push(self, x):
        if self.sp == self.cap:
            raise OverflowError("stack overflow")
        self.buf[self.sp] = x
        self.sp += 1

    def pop(self):
        if self.sp == 0:
            raise IndexError("stack underflow")
        self.sp -= 1
        x = self.buf[self.sp]
        self.buf[self.sp] = None   # let GC reclaim
        return x

    def peek(self):
        return self.buf[self.sp - 1] if self.sp else None`,
      },
      {
        type: "viz",
        items: [10, 20, 30],
        showAddresses: true,
        base: 0x2000,
        caption: "Bounded array-backed stack; SP points to the next free slot.",
      },
      {
        type: "mistakes",
        items: [
          "Forgetting to null out the popped slot — the reference stays alive and blocks GC.",
          "Off-by-one on `sp` — SP points to the NEXT slot, not the current top.",
        ],
      },
      {
        type: "complexity",
        rows: [
          { op: "push", time: "O(1) worst-case" },
          { op: "pop", time: "O(1)" },
          { op: "overflow check", time: "O(1)" },
        ],
      },
    ],
  },
  {
    slug: "linked-list",
    title: "Stack using a Linked List",
    eyebrow: "Implementations · 3",
    description: "True O(1) push — no amortisation, no resize hiccups. Nodes wired at the head.",
    difficulty: "Intermediate",
    readMinutes: 6,
    sections: [
      {
        type: "theory",
        text: "A singly linked list is a natural stack: pushing means prepending a node at the head; popping means unlinking it. Every operation touches exactly one node — worst-case O(1), no doubling.",
      },
      {
        type: "code",
        title: "python — linked-list stack",
        code: `class Node:
    __slots__ = ("val", "next")
    def __init__(self, val, nxt=None):
        self.val, self.next = val, nxt

class LinkedStack:
    def __init__(self):
        self.top = None
        self._size = 0

    def push(self, x):
        self.top = Node(x, self.top)
        self._size += 1

    def pop(self):
        if self.top is None:
            raise IndexError("pop from empty stack")
        node, self.top = self.top, self.top.next
        self._size -= 1
        return node.val

    def peek(self):
        return self.top.val if self.top else None

    def __len__(self):
        return self._size`,
      },
      {
        type: "dryRun",
        headers: ["step", "action", "top → …"],
        rows: [
          ["1", "push(10)", "10 → None"],
          ["2", "push(20)", "20 → 10 → None"],
          ["3", "push(30)", "30 → 20 → 10 → None"],
          ["4", "pop() → 30", "20 → 10 → None"],
        ],
      },
      {
        type: "callout",
        kind: "perf",
        title: "When to reach for this",
        text: "Real-time systems that can't tolerate the occasional O(n) resize spike of a dynamic array. Otherwise, the Python list version is almost always faster in practice.",
      },
      {
        type: "complexity",
        rows: [
          { op: "push / pop / peek", time: "O(1) worst-case" },
          { op: "extra memory / item", time: "+1 pointer" },
        ],
      },
    ],
  },
  {
    slug: "queue",
    title: "Stack using Two Queues",
    eyebrow: "Implementations · 4",
    description: "A classic interview curiosity — build a LIFO stack with only FIFO queues.",
    difficulty: "Intermediate",
    readMinutes: 6,
    sections: [
      {
        type: "theory",
        text: "Two approaches: make push costly (rotate every element on push) or make pop costly (rotate on pop). Both give an amortised O(n) op — this is a teaching exercise, not a production choice.",
      },
      {
        type: "code",
        title: "python — expensive push",
        code: `from collections import deque

class StackFromQueues:
    def __init__(self):
        self.q1, self.q2 = deque(), deque()

    def push(self, x):
        self.q2.append(x)
        while self.q1:
            self.q2.append(self.q1.popleft())
        self.q1, self.q2 = self.q2, self.q1

    def pop(self):
        if not self.q1:
            raise IndexError("pop from empty stack")
        return self.q1.popleft()

    def peek(self):
        return self.q1[0] if self.q1 else None`,
      },
      {
        type: "callout",
        kind: "interview",
        title: "Follow-up question",
        text: "'Can you do it with a single queue?' Yes — after appending x, rotate the queue length-1 times so x ends up at the front.",
      },
      {
        type: "complexity",
        rows: [
          { op: "push (expensive-push variant)", time: "O(n)" },
          { op: "pop / peek", time: "O(1)" },
        ],
      },
    ],
  },
];
