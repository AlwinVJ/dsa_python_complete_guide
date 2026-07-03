// Subtype mini-courses for Linked Lists: Singly, Doubly, Circular,
// Circular-Doubly. Each subtype provides its own ~15-lesson course that
// renders through the same LLSection pipeline used by the top-level
// linked-lists module. Lessons live at /linked-lists/<subtype>/<slug>.

import type { LLLesson } from "./linked-lists-content";

// ---------------------------------------------------------------- helpers

type Subtype = "singly" | "doubly" | "circular" | "circular-doubly";

const NEXT: Record<Subtype, string> = {
  singly: "next",
  doubly: "next",
  circular: "next",
  "circular-doubly": "next",
};

const HAS_PREV: Record<Subtype, boolean> = {
  singly: false,
  doubly: true,
  circular: false,
  "circular-doubly": true,
};

const IS_CIRCULAR: Record<Subtype, boolean> = {
  singly: false,
  doubly: false,
  circular: true,
  "circular-doubly": true,
};

const VARIANT_VIZ: Record<Subtype, "singly" | "doubly" | "circular" | "circular-doubly"> = {
  singly: "singly",
  doubly: "doubly",
  circular: "circular",
  "circular-doubly": "circular-doubly",
};

const PRETTY: Record<Subtype, string> = {
  singly: "Singly Linked List",
  doubly: "Doubly Linked List",
  circular: "Circular Linked List",
  "circular-doubly": "Circular Doubly Linked List",
};

function nodeClass(t: Subtype): string {
  if (t === "doubly" || t === "circular-doubly") {
    return `class Node:
    __slots__ = ("val", "prev", "next")
    def __init__(self, val, prev=None, nxt=None):
        self.val = val
        self.prev = prev
        self.next = nxt`;
  }
  return `class Node:
    __slots__ = ("val", "next")
    def __init__(self, val, nxt=None):
        self.val = val
        self.next = nxt`;
}

function traversalCode(t: Subtype): string {
  if (IS_CIRCULAR[t]) {
    return `def traverse(head):
    if head is None:
        return
    cur = head
    while True:
        print(cur.val)
        cur = cur.next
        if cur is head:      # stop when we loop back
            break`;
  }
  return `def traverse(head):
    cur = head
    while cur is not None:
        print(cur.val)
        cur = cur.next`;
}

function insertFrontCode(t: Subtype): string {
  switch (t) {
    case "singly":
      return `def push_front(head, val):
    return Node(val, head)   # O(1)`;
    case "doubly":
      return `def push_front(head, val):
    node = Node(val, None, head)
    if head is not None:
        head.prev = node
    return node   # O(1)`;
    case "circular":
      return `def push_front(head, val):
    node = Node(val)
    if head is None:
        node.next = node
        return node
    # find current tail (O(n))
    tail = head
    while tail.next is not head:
        tail = tail.next
    node.next = head
    tail.next = node
    return node   # new head`;
    case "circular-doubly":
      return `def push_front(head, val):
    node = Node(val)
    if head is None:
        node.prev = node.next = node
        return node
    tail = head.prev            # O(1) — tail is head.prev
    node.next, node.prev = head, tail
    head.prev = node
    tail.next = node
    return node   # O(1)`;
  }
}

function insertBackCode(t: Subtype): string {
  switch (t) {
    case "singly":
      return `def push_back(head, val):
    node = Node(val)
    if head is None:
        return node
    cur = head
    while cur.next:
        cur = cur.next
    cur.next = node
    return head   # O(n) without tail pointer`;
    case "doubly":
      return `def push_back(head, val):
    node = Node(val)
    if head is None:
        return node
    cur = head
    while cur.next:
        cur = cur.next
    cur.next = node
    node.prev = cur
    return head   # O(n) without tail; O(1) with maintained tail`;
    case "circular":
      return `def push_back(head, val):
    node = Node(val)
    if head is None:
        node.next = node
        return node
    tail = head
    while tail.next is not head:
        tail = tail.next
    tail.next = node
    node.next = head
    return head   # O(n) without tail pointer`;
    case "circular-doubly":
      return `def push_back(head, val):
    if head is None:
        node = Node(val)
        node.prev = node.next = node
        return node
    push_front(head, val)         # inserts before head
    return head                    # tail is head.prev now the new node`;
  }
}

function deleteFrontCode(t: Subtype): string {
  switch (t) {
    case "singly":
      return `def pop_front(head):
    if head is None: return None
    return head.next          # O(1)`;
    case "doubly":
      return `def pop_front(head):
    if head is None: return None
    new_head = head.next
    if new_head: new_head.prev = None
    return new_head           # O(1)`;
    case "circular":
      return `def pop_front(head):
    if head is None or head.next is head:
        return None            # 0 or 1 nodes
    tail = head
    while tail.next is not head:
        tail = tail.next
    tail.next = head.next
    return head.next           # O(n) unless tail is tracked`;
    case "circular-doubly":
      return `def pop_front(head):
    if head is None or head.next is head:
        return None
    tail = head.prev           # O(1)
    new_head = head.next
    tail.next = new_head
    new_head.prev = tail
    return new_head            # O(1)`;
  }
}

function reverseCode(t: Subtype): string {
  switch (t) {
    case "singly":
      return `def reverse(head):
    prev, cur = None, head
    while cur:
        nxt = cur.next
        cur.next = prev
        prev = cur
        cur = nxt
    return prev`;
    case "doubly":
      return `def reverse(head):
    cur, new_head = head, head
    while cur:
        cur.prev, cur.next = cur.next, cur.prev
        new_head = cur
        cur = cur.prev        # was cur.next before swap
    return new_head`;
    case "circular":
      return `def reverse(head):
    if head is None or head.next is head:
        return head
    prev, cur = None, head
    first = head
    while True:
        nxt = cur.next
        cur.next = prev
        prev = cur
        cur = nxt
        if cur is first:
            break
    first.next = prev
    return prev`;
    case "circular-doubly":
      return `def reverse(head):
    if head is None: return head
    cur = head
    while True:
        cur.prev, cur.next = cur.next, cur.prev
        cur = cur.prev        # was cur.next
        if cur is head: break
    return head.next          # old head.prev becomes new head`;
  }
}

// ---------------------------------------------------------------- lesson gen

function lessons(t: Subtype): LLLesson[] {
  const name = PRETTY[t];
  const viz = VARIANT_VIZ[t];
  const isCirc = IS_CIRCULAR[t];
  const hasPrev = HAS_PREV[t];
  const nl = !isCirc; // null terminator?

  return [
    {
      slug: "introduction",
      title: `${name} · Introduction`,
      eyebrow: "Overview",
      description: `What is a ${name.toLowerCase()} and where does it fit in?`,
      difficulty: "Beginner",
      readMinutes: 5,
      sections: [
        { type: "theory", text:
          `A ${name} is a chain of nodes where each node stores a value and ${
            hasPrev ? "two pointers — `prev` and `next` —" : "a single `next` pointer"
          }${isCirc ? " that ultimately links back to the head, forming a ring." : "; the last node's `next` is `None`."}` },
        { type: "viz", nodes: [10, 20, 30, 40], variant: viz, nullTerminator: nl, cycleTo: isCirc ? 0 : undefined, caption: `A four-node ${name.toLowerCase()}.` },
        { type: "theory", bullets: [
          hasPrev ? "Bidirectional traversal — forward AND backward in O(n)." : "Forward-only traversal.",
          isCirc ? "No `None` terminator — traversal must stop when `cur is head`." : "Terminates cleanly at `None`.",
          hasPrev ? "Deletion given a node reference is O(1)." : "Deletion requires the previous node — O(n) unless you already have it.",
          hasPrev ? `Higher memory cost — every node carries an extra pointer (${(t === "circular-doubly" || t === "doubly") ? "24" : "16"} bytes on 64-bit CPython).` : "Minimal per-node overhead.",
        ]},
        { type: "callout", kind: "did", title: "Where it shows up",
          text: t === "singly" ? "Stack implementations, immutable functional lists (Lisp/Haskell), hash-table separate chaining."
              : t === "doubly" ? "LRU caches (dict + doubly linked list), collections.deque, browser back/forward history."
              : t === "circular" ? "Round-robin schedulers, music playlists, Josephus problem, token-ring networks."
              : "Fibonacci heaps, MRU caches with wrap-around, real-time buffer rings." },
      ],
    },
    {
      slug: "theory",
      title: `${name} · Theory`,
      eyebrow: "Concept",
      description: `The invariants that define a ${name.toLowerCase()}.`,
      difficulty: "Beginner",
      readMinutes: 5,
      sections: [
        { type: "theory", bullets: [
          `Every node has ${hasPrev ? "exactly two pointers: `prev` and `next`" : "exactly one pointer: `next`"}.`,
          `The list is identified by a single \`head\` pointer${hasPrev ? " (tail = head.prev in circular-doubly form)" : ""}.`,
          isCirc
            ? "The last node's `next` is `head` — the ring closes."
            : "The last node's `next` is `None` — the sentinel that terminates every walk.",
          hasPrev && isCirc ? "The head's `prev` is the tail — both ends are reachable in O(1)." : "",
        ].filter(Boolean) },
        { type: "callout", kind: "perf",
          text: `Compared to a Python list: same O(n) index-access, but ${
            isCirc ? "wrap-around is free" : "insertion at head is O(1)"
          }${hasPrev ? " and deletion given the node is O(1)." : "."}` },
      ],
    },
    {
      slug: "memory-representation",
      title: `${name} · Memory Representation`,
      eyebrow: "Internals",
      description: "How nodes actually sit in memory.",
      difficulty: "Beginner",
      readMinutes: 5,
      sections: [
        { type: "theory", text:
          `Each node is an independent heap object. ${hasPrev ? "Two 8-byte pointers per node instead of one" : "One 8-byte pointer per node"}. Cache locality is poor either way — every pointer chase can miss.` },
        { type: "memory", nodes: [10, 20, 30] },
        { type: "code", title: "raw memory sketch", code:
`# addresses are illustrative
0x100:  Node(val=10${hasPrev ? ", prev=" + (isCirc ? "0x188" : "None") : ""}, next=0x240)
0x240:  Node(val=20${hasPrev ? ", prev=0x100" : ""}, next=0x188)
0x188:  Node(val=30${hasPrev ? ", prev=0x240" : ""}, next=${isCirc ? "0x100" : "None"})

head = 0x100${hasPrev && isCirc ? "  # tail = head.prev = 0x188" : ""}` },
      ],
    },
    {
      slug: "internal-working",
      title: `${name} · Internal Working`,
      eyebrow: "How it works",
      description: "The pointer dance that every operation performs.",
      difficulty: "Beginner",
      readMinutes: 6,
      sections: [
        { type: "theory", text:
          `Every operation on a ${name.toLowerCase()} boils down to reading and writing \`.${NEXT[t]}\`${hasPrev ? " / `.prev`" : ""} fields. Drawing the pointer diagram before coding is the single strongest habit you can build.` },
        { type: "viz", nodes: [1, 2, 3], variant: viz, nullTerminator: nl, cycleTo: isCirc ? 0 : undefined, highlight: [0] },
        { type: "callout", kind: "tip",
          text: "Whenever an operation touches `k` nodes, `k` `.next`/`.prev` assignments must happen in the right order — draw it, then write it." },
      ],
    },
    {
      slug: "node-structure",
      title: `${name} · Node Class`,
      eyebrow: "Python",
      description: "The tiny class every operation builds on.",
      difficulty: "Beginner",
      readMinutes: 4,
      sections: [
        { type: "code", title: "node class", code: nodeClass(t) },
        { type: "callout", kind: "perf", title: "Why __slots__?",
          text: "Skipping the per-instance `__dict__` saves ~40% memory. Multiply by millions of nodes." },
      ],
    },
    {
      slug: "creating",
      title: `${name} · Creating a List`,
      eyebrow: "Build",
      description: "Turn an iterable of values into a linked list.",
      difficulty: "Beginner",
      readMinutes: 5,
      sections: [
        { type: "code", title: "build from iterable", code:
          isCirc
            ? `def from_iterable(values):
    head = None
    tail = None
    for v in values:
        node = Node(v)
        if head is None:
            head = tail = node
        else:
            tail.next = node
            ${hasPrev ? "node.prev = tail\n            " : ""}tail = node
    if head is None:
        return None
    tail.next = head
    ${hasPrev ? "head.prev = tail\n    " : ""}return head`
            : `def from_iterable(values):
    dummy = Node(None)
    tail = dummy
    for v in values:
        node = Node(v)
        tail.next = node
        ${hasPrev ? "node.prev = tail\n        " : ""}tail = node
    return dummy.next` },
        { type: "playground", initial: [10, 20, 30, 40] },
      ],
    },
    {
      slug: "traversal",
      title: `${name} · Traversal`,
      eyebrow: "Walk",
      description: hasPrev ? "Forward AND backward walks." : "The head-to-tail loop.",
      difficulty: "Beginner",
      readMinutes: 5,
      sections: [
        { type: "code", title: "forward traversal", code: traversalCode(t) },
        ...(hasPrev
          ? [{
              type: "code" as const,
              title: "reverse traversal",
              code: isCirc
                ? `def traverse_reverse(head):
    if head is None: return
    tail = head.prev
    cur = tail
    while True:
        print(cur.val)
        cur = cur.prev
        if cur is tail:
            break`
                : `def traverse_reverse(head):
    # walk to tail, then follow .prev
    if head is None: return
    cur = head
    while cur.next: cur = cur.next
    while cur:
        print(cur.val)
        cur = cur.prev`,
            }]
          : []),
        { type: "viz", nodes: [10, 20, 30, 40], variant: viz, nullTerminator: nl, cycleTo: isCirc ? 0 : undefined, highlight: [2], caption: "cur lands on node 30." },
        { type: "complexity", rows: [{ op: "traverse", time: "O(n)", space: "O(1)" }] },
      ],
    },
    {
      slug: "searching",
      title: `${name} · Searching`,
      eyebrow: "Find",
      description: "Locate a value, return its index or -1.",
      difficulty: "Beginner",
      readMinutes: 4,
      sections: [
        { type: "code", code:
          isCirc
            ? `def find(head, target):
    if head is None: return -1
    cur, idx = head, 0
    while True:
        if cur.val == target: return idx
        cur = cur.next
        idx += 1
        if cur is head:
            return -1`
            : `def find(head, target):
    cur, idx = head, 0
    while cur:
        if cur.val == target: return idx
        cur = cur.next
        idx += 1
    return -1` },
        { type: "complexity", rows: [
          { op: "search (best)", time: "O(1)" },
          { op: "search (avg / worst)", time: "O(n)" },
        ]},
      ],
    },
    {
      slug: "insertion",
      title: `${name} · Insertion`,
      eyebrow: "Add",
      description: "Head, tail, and arbitrary-position inserts.",
      difficulty: "Intermediate",
      readMinutes: 7,
      sections: [
        { type: "code", title: "insert at front", code: insertFrontCode(t) },
        { type: "code", title: "insert at back", code: insertBackCode(t) },
        { type: "viz", nodes: [10, 20, 30], variant: viz, nullTerminator: nl, cycleTo: isCirc ? 0 : undefined, caption: "Before" },
        { type: "viz", nodes: [5, 10, 20, 30, 99], variant: viz, nullTerminator: nl, cycleTo: isCirc ? 0 : undefined, highlight: [0, 4], caption: "After push_front(5) + push_back(99)" },
        { type: "playground", initial: [10, 20, 30] },
        { type: "complexity", rows: [
          { op: "push_front", time: t === "circular" ? "O(n)" : "O(1)", note: t === "circular" ? "must locate tail" : "" },
          { op: "push_back",  time: t === "circular-doubly" ? "O(1)" : (t === "circular" ? "O(n)" : "O(n) / O(1) w/ tail") },
          { op: "insert at k", time: "O(k)" },
        ]},
      ],
    },
    {
      slug: "deletion",
      title: `${name} · Deletion`,
      eyebrow: "Remove",
      description: "Delete by position or by value.",
      difficulty: "Intermediate",
      readMinutes: 7,
      sections: [
        { type: "code", title: "delete at front", code: deleteFrontCode(t) },
        { type: "code", title: "delete by value", code:
          isCirc
            ? `def delete_value(head, target):
    if head is None: return None
    # single-node case
    if head.next is head:
        return None if head.val == target else head
    prev, cur = ${hasPrev ? "head.prev" : "head"}, head
    ${hasPrev ? "" : "# locate previous manually\n    while prev.next is not head:\n        prev = prev.next\n    prev, cur = head.prev if False else prev, head  # noqa\n    "}first = head
    while True:
        if cur.val == target:
            prev.next = cur.next
            ${hasPrev ? "cur.next.prev = prev\n            " : ""}if cur is head:
                head = cur.next
            return head
        prev = cur
        cur = cur.next
        if cur is first:
            return head`
            : `def delete_value(head, target):
    dummy = Node(0, ${hasPrev ? "None, " : ""}head)
    ${hasPrev ? "if head: head.prev = dummy\n    " : ""}prev = dummy
    while prev.next:
        if prev.next.val == target:
            prev.next = prev.next.next
            ${hasPrev ? "if prev.next: prev.next.prev = prev\n            " : ""}break
        prev = prev.next
    return dummy.next` },
        { type: "callout", kind: "tip", title: "Dummy-head pattern",
          text: "A sentinel before the real head means the deletion code is identical whether the target is the head or not." },
        { type: "playground", initial: [10, 20, 30, 40] },
      ],
    },
    {
      slug: "reverse",
      title: `${name} · Reverse`,
      eyebrow: "Classic",
      description: "In-place reversal in one pass.",
      difficulty: "Intermediate",
      readMinutes: 6,
      sections: [
        { type: "code", title: "iterative reverse", code: reverseCode(t) },
        { type: "viz", nodes: [1, 2, 3, 4], variant: viz, nullTerminator: nl, cycleTo: isCirc ? 0 : undefined, caption: "Before" },
        { type: "viz", nodes: [4, 3, 2, 1], variant: viz, nullTerminator: nl, cycleTo: isCirc ? 0 : undefined, highlight: [0], caption: "After reverse" },
        { type: "complexity", rows: [{ op: "reverse", time: "O(n)", space: "O(1)" }] },
      ],
    },
    {
      slug: "dry-run",
      title: `${name} · Dry Run`,
      eyebrow: "Walk-through",
      description: "Trace insertion + deletion pointer by pointer.",
      difficulty: "Beginner",
      readMinutes: 5,
      sections: [
        { type: "dryRun", headers: ["step", "operation", "list state"], rows: [
          ["1", "push_front(5)", "5 → …"],
          ["2", "push_back(99)", "5 → 10 → 20 → 30 → 99"],
          ["3", "delete_value(20)", "5 → 10 → 30 → 99"],
          ["4", "reverse()", "99 → 30 → 10 → 5"],
        ]},
        { type: "viz", nodes: [99, 30, 10, 5], variant: viz, nullTerminator: nl, cycleTo: isCirc ? 0 : undefined },
      ],
    },
    {
      slug: "complexity",
      title: `${name} · Complexity`,
      eyebrow: "Reference",
      description: "All operations, all cases.",
      difficulty: "Beginner",
      readMinutes: 3,
      sections: [
        { type: "complexity", rows: [
          { op: "Access i-th", time: "O(n)" },
          { op: "Search by value", time: "O(n)" },
          { op: "Insert at head", time: t === "circular" ? "O(n)" : "O(1)" },
          { op: "Insert at tail", time: (t === "circular-doubly") ? "O(1)" : (t === "circular" ? "O(n)" : "O(n) / O(1) w/ tail") },
          { op: "Delete at head", time: t === "circular" ? "O(n)" : "O(1)" },
          { op: "Delete at tail", time: hasPrev && isCirc ? "O(1)" : (hasPrev ? "O(1) w/ tail" : "O(n)") },
          { op: "Reverse", time: "O(n)" },
          { op: "Memory / node", time: hasPrev ? "≈ 24 bytes ptrs" : "≈ 16 bytes ptrs" },
        ]},
      ],
    },
    {
      slug: "common-mistakes",
      title: `${name} · Common Mistakes`,
      eyebrow: "Debug",
      description: "The bugs that catch every learner.",
      difficulty: "Beginner",
      readMinutes: 4,
      sections: [
        { type: "mistakes", items: [
          "Overwriting `cur.next` before saving `nxt` — you lose the rest of the list.",
          "Forgetting to return the (possibly new) head after front-inserts and front-deletes.",
          ...(hasPrev ? ["Updating `next` but forgetting the matching `prev` link — silently breaks reverse traversal."] : []),
          ...(isCirc ? [
            "Using `while cur:` on a circular list — that loop never terminates. Use `while True: … if cur is head: break`.",
            "Forgetting to close the ring after building the list — `tail.next` MUST point back to `head`.",
          ] : ["Using `while cur.next:` to visit every node — you skip the tail."]),
          "Losing the tail pointer after append/pop_back — every subsequent O(1) claim becomes O(n).",
        ]},
      ],
    },
    {
      slug: "interview-tips",
      title: `${name} · Interview Tips`,
      eyebrow: "Prep",
      description: "How to nail the whiteboard.",
      difficulty: "Intermediate",
      readMinutes: 4,
      sections: [
        { type: "tip", text: "Draw the list BEFORE you write the loop — most bugs are pointer-order bugs." },
        { type: "callout", kind: "interview", title: "Standard follow-ups",
          text: t === "singly" ? "Reverse in groups of k · Detect a cycle · Merge two sorted lists · Palindrome check in O(1) space."
              : t === "doubly" ? "Design an LRU cache · Flatten a multilevel doubly linked list · Insertion Sort a DLL."
              : t === "circular" ? "Josephus problem · Split a circular list into two halves · Detect the loop's starting node."
              : "Fibonacci heap consolidation · Design a MRU cache with wrap-around · Rotate a CDLL by k in O(1)." },
      ],
    },
    {
      slug: "faqs",
      title: `${name} · FAQs`,
      eyebrow: "Q&A",
      description: "The questions students ask most often.",
      difficulty: "Beginner",
      readMinutes: 5,
      sections: [
        { type: "theory", text: `Q: When should I choose a ${name.toLowerCase()} over a Python list?` },
        { type: "theory", text:
          t === "singly" ? "A: When you need cheap front-inserts and don't care about random indexing — e.g. persistent immutable structures, undo stacks, hash-table chaining."
          : t === "doubly" ? "A: When you need O(1) deletion given a node reference AND O(1) pop-from-either-end — the LRU-cache pattern."
          : t === "circular" ? "A: When your workload naturally wraps around — round-robin schedulers, playlists, ring buffers."
          : "A: When you need both wrap-around AND O(1) tail operations — Fibonacci heaps, real-time buffers." },
        { type: "theory", text: "Q: Is Python's built-in `list` this kind of linked list?" },
        { type: "theory", text: "A: No — CPython `list` is a resizable dynamic array. For deque-like linked storage use `collections.deque` (implemented as a doubly linked list of blocks)." },
        { type: "theory", text: `Q: What's the memory overhead vs. an array?` },
        { type: "theory", text: `A: A ${hasPrev ? "doubly" : "singly"} linked node adds ${hasPrev ? "≈ 24" : "≈ 16"} bytes of pointers per element on top of the value. A Python list stores a single 8-byte reference per element.` },
      ],
    },
    {
      slug: "practice",
      title: `${name} · Practice`,
      eyebrow: "LeetCode",
      description: "Curated problems that drill this subtype.",
      difficulty: "Intermediate",
      readMinutes: 3,
      sections: [
        { type: "practice", groups: [
          { level: "Beginner", items:
            t === "doubly" ? [
              { title: "146 · LRU Cache", url: "https://leetcode.com/problems/lru-cache/", difficulty: "Medium", pattern: "Hash + DLL", time: "45m" },
              { title: "430 · Flatten Multilevel DLL", url: "https://leetcode.com/problems/flatten-a-multilevel-doubly-linked-list/", difficulty: "Medium", pattern: "DFS on DLL", time: "30m" },
            ]
            : t === "circular" ? [
              { title: "708 · Insert into a Sorted Circular Linked List", url: "https://leetcode.com/problems/insert-into-a-sorted-circular-linked-list/", difficulty: "Medium", pattern: "Circular walk", time: "25m" },
              { title: "Josephus Problem", url: "https://leetcode.com/problems/find-the-winner-of-the-circular-game/", difficulty: "Medium", pattern: "Circular delete", time: "25m" },
            ]
            : t === "circular-doubly" ? [
              { title: "1290 · Convert Binary Number in LL to Integer", url: "https://leetcode.com/problems/convert-binary-number-in-a-linked-list-to-integer/", difficulty: "Easy", pattern: "Traversal", time: "10m" },
              { title: "460 · LFU Cache (uses CDLL)", url: "https://leetcode.com/problems/lfu-cache/", difficulty: "Hard", pattern: "Hash + CDLL", time: "60m" },
            ]
            : [
              { title: "206 · Reverse Linked List", url: "https://leetcode.com/problems/reverse-linked-list/", difficulty: "Easy", pattern: "Iterative reverse", time: "15m" },
              { title: "876 · Middle of the Linked List", url: "https://leetcode.com/problems/middle-of-the-linked-list/", difficulty: "Easy", pattern: "Slow/fast", time: "10m" },
              { title: "141 · Linked List Cycle", url: "https://leetcode.com/problems/linked-list-cycle/", difficulty: "Easy", pattern: "Floyd", time: "15m" },
            ]
          },
        ]},
      ],
    },
    {
      slug: "quiz",
      title: `${name} · Quiz`,
      eyebrow: "Check yourself",
      description: "Five quick questions.",
      difficulty: "Beginner",
      readMinutes: 4,
      sections: [
        { type: "quiz", items: [
          { q: `Time complexity of accessing the k-th element in a ${name.toLowerCase()}?`,
            choices: ["O(1)", "O(log n)", "O(k)", "O(n²)"], answer: 2 },
          { q: `Which pointer(s) does every ${name.toLowerCase()} node hold?`,
            choices: ["next only", "prev only", hasPrev ? "prev AND next" : "value only", "index"],
            answer: hasPrev ? 2 : 0 },
          { q: `The last node's next pointer in a ${name.toLowerCase()} points to…`,
            choices: [isCirc ? "None" : "head", isCirc ? "head" : "None", "the previous node", "itself"],
            answer: 1 },
          { q: `Insert-at-front on a ${name.toLowerCase()} costs…`,
            choices: ["O(1)", "O(log n)", "O(n)", "amortised O(1)"],
            answer: t === "circular" ? 2 : 0,
            explain: t === "circular" ? "Plain circular singly needs an O(n) walk to find the tail." : "Front-insert is a couple of pointer writes." },
          { q: `Which structure is famously implemented with a ${name.toLowerCase()}?`,
            choices: [
              t === "doubly" ? "LRU cache" : "None",
              t === "circular" ? "Round-robin scheduler" : (t === "singly" ? "Undo stack" : "Fibonacci heap"),
              t === "singly" ? "Binary heap" : "Hash table (open addressing)",
              "Union-find",
            ],
            answer: (t === "singly" || t === "doubly") ? 0 : 1 },
        ]},
      ],
    },
    {
      slug: "references",
      title: `${name} · References`,
      eyebrow: "Further reading",
      description: "External resources to go deeper.",
      difficulty: "Beginner",
      readMinutes: 2,
      sections: [
        { type: "references", items: [
          { label: `GeeksforGeeks · ${name}`,
            url: t === "singly" ? "https://www.geeksforgeeks.org/singly-linked-list-tutorial/"
              : t === "doubly" ? "https://www.geeksforgeeks.org/doubly-linked-list/"
              : t === "circular" ? "https://www.geeksforgeeks.org/circular-linked-list/"
              : "https://www.geeksforgeeks.org/doubly-circular-linked-list-set-1-introduction-and-insertion/" },
          { label: `Visualgo · Linked List`, url: "https://visualgo.net/en/list" },
          { label: `LeetCode · Linked List tag`, url: "https://leetcode.com/tag/linked-list/" },
          { label: `Programiz · ${name}`,
            url: t === "singly" ? "https://www.programiz.com/dsa/linked-list"
              : t === "doubly" ? "https://www.programiz.com/dsa/doubly-linked-list"
              : t === "circular" ? "https://www.programiz.com/dsa/circular-linked-list"
              : "https://www.programiz.com/dsa/doubly-linked-list" },
        ]},
      ],
    },
  ];
}

// ---------------------------------------------------------------- exports

export type LLSubtypeSlug = Subtype;

export const LL_SUBTYPES: {
  slug: Subtype;
  title: string;
  tagline: string;
  lessons: LLLesson[];
}[] = [
  { slug: "singly", title: "Singly Linked List", tagline: "One-way chain of nodes.", lessons: lessons("singly") },
  { slug: "doubly", title: "Doubly Linked List", tagline: "Bidirectional pointers for O(1) either-end ops.", lessons: lessons("doubly") },
  { slug: "circular", title: "Circular Linked List", tagline: "Tail loops back to head — perfect for round-robin.", lessons: lessons("circular") },
  { slug: "circular-doubly", title: "Circular Doubly Linked List", tagline: "Rings with both-way traversal.", lessons: lessons("circular-doubly") },
];

export function getSubtypeLesson(subtype: string, slug: string): LLLesson | undefined {
  const s = LL_SUBTYPES.find((x) => x.slug === subtype);
  if (!s) return undefined;
  return s.lessons.find((l) => l.slug === slug);
}

export function getSubtype(subtype: string) {
  return LL_SUBTYPES.find((x) => x.slug === subtype);
}
