// Rich, per-lesson content for the Linked Lists course.
// Each lesson is rendered by /src/routes/linked-lists.$lesson.tsx using the
// same components (PageShell, Callout, CodeBlock, LinkedListVisualizer,
// LinkedListPlayground) so the experience mirrors the Arrays module.

export type LLViz = {
  type: "viz";
  nodes: Array<string | number>;
  highlight?: number[];
  compare?: number[];
  slowIdx?: number;
  fastIdx?: number;
  headLabel?: string | null;
  tailLabel?: string | null;
  variant?: "singly" | "doubly" | "circular" | "circular-doubly";
  cycleTo?: number;
  nullTerminator?: boolean;
  caption?: string;
};

export type LLMemory = { type: "memory"; nodes: Array<string | number>; caption?: string };
export type LLTheory = { type: "theory"; text?: string; bullets?: string[] };
export type LLCode = { type: "code"; code: string; title?: string; explanation?: string };
export type LLDryRun = { type: "dryRun"; headers: string[]; rows: string[][]; caption?: string };
export type LLPlayground = { type: "playground"; initial?: Array<string | number> };
export type LLComplexity = {
  type: "complexity";
  rows: { op: string; time: string; space?: string; note?: string }[];
};
export type LLMistakes = { type: "mistakes"; items: string[] };
export type LLTip = { type: "tip"; text: string; title?: string };
export type LLCallout = {
  type: "callout";
  kind: "info" | "warn" | "perf" | "did" | "tip" | "interview";
  title?: string;
  text: string;
};
export type LLQuizItem = { q: string; choices: string[]; answer: number; explain?: string };
export type LLQuiz = { type: "quiz"; items: LLQuizItem[] };
export type LLPractice = {
  type: "practice";
  groups: {
    level: "Beginner" | "Intermediate" | "Advanced";
    items: {
      title: string;
      url: string;
      difficulty: "Easy" | "Medium" | "Hard";
      pattern?: string;
      time?: string;
    }[];
  }[];
};
export type LLRefs = { type: "references"; items: { label: string; url: string }[] };
export type LLInterview = { type: "interview"; items: string[] };
export type LLHeading = { type: "heading"; text: string };

export type LLSection =
  | LLViz
  | LLMemory
  | LLTheory
  | LLCode
  | LLDryRun
  | LLPlayground
  | LLComplexity
  | LLMistakes
  | LLTip
  | LLCallout
  | LLQuiz
  | LLPractice
  | LLRefs
  | LLInterview
  | LLHeading;

export type LLLesson = {
  slug: string;
  title: string;
  eyebrow?: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  readMinutes: number;
  sections: LLSection[];
};

export const LL_LESSONS: LLLesson[] = [
  // 1
  {
    slug: "introduction",
    title: "Introduction to Linked Lists",
    eyebrow: "Getting started",
    description:
      "A linked list is a chain of nodes where each node stores a value and a pointer to the next node. Understand the mental model before touching any code.",
    difficulty: "Beginner",
    readMinutes: 6,
    sections: [
      {
        type: "theory",
        text: "Unlike a Python list — which is a contiguous block of pointers — a linked list scatters its nodes across the heap. Each node holds two things: its value, and a reference (`next`) to the next node. The list is identified by a single `head` pointer; when `head is None`, the list is empty.",
      },
      {
        type: "viz",
        nodes: [10, 20, 30, 40],
        headLabel: "HEAD",
        caption: "A four-node singly linked list.",
      },
      {
        type: "theory",
        bullets: [
          "Dynamic size — grows and shrinks without pre-allocation.",
          "O(1) insertion / deletion at the head given the head pointer.",
          "O(n) random access — no direct indexing.",
          "Extra memory per element for the pointer.",
        ],
      },
      {
        type: "callout",
        kind: "did",
        title: "Did you know?",
        text: "Python's built-in `list` is NOT a linked list — it's a dynamic array. Linked lists show up inside CPython for `collections.OrderedDict` and `deque` implementations.",
      },
      {
        type: "quiz",
        items: [
          {
            q: "What does a linked-list `head` point to?",
            choices: ["The last node", "The first node", "The middle node", "The largest value"],
            answer: 1,
            explain:
              "`head` references the first node; the list is walked by following `next` pointers.",
          },
        ],
      },
    ],
  },

  // 2
  {
    slug: "why-linked-lists",
    title: "Why Linked Lists?",
    eyebrow: "Motivation",
    description: "When contiguous arrays hurt and pointer-based lists shine.",
    difficulty: "Beginner",
    readMinutes: 5,
    sections: [
      {
        type: "theory",
        text: "Arrays are amazing at random access but pay for it. Inserting at the front of a Python list is O(n) because every element shifts. If your workload is dominated by head-inserts, tail-appends, and 'delete this node' operations, a linked list wins.",
      },
      { type: "heading", text: "Real systems that use linked lists" },
      {
        type: "theory",
        bullets: [
          "LRU caches — a doubly linked list plus a dict gives O(1) get/put.",
          "Adjacency lists for sparse graphs.",
          "Undo history where new actions push to the head.",
          "Music playlists / round-robin schedulers (circular linked lists).",
          "Memory allocators track free blocks in a linked list of holes.",
        ],
      },
      {
        type: "callout",
        kind: "perf",
        text: "Rule of thumb: choose linked lists when you insert/delete at endpoints far more than you index.",
      },
    ],
  },

  // 3
  {
    slug: "array-vs-linked-list",
    title: "Array vs Linked List",
    eyebrow: "Compare",
    description: "Side-by-side comparison of the two workhorse linear structures.",
    difficulty: "Beginner",
    readMinutes: 6,
    sections: [
      { type: "theory", text: "Same 'linear' shape, very different mechanics." },
      {
        type: "complexity",
        rows: [
          { op: "Access by index (i)", time: "Array O(1) · Linked O(n)" },
          { op: "Search by value", time: "Both O(n)" },
          { op: "Insert at head", time: "Array O(n) · Linked O(1)" },
          { op: "Insert at tail (with tail pointer)", time: "Array O(1)* · Linked O(1)" },
          { op: "Insert at arbitrary index k", time: "Array O(n) · Linked O(k)" },
          { op: "Delete given node", time: "Array O(n) · Linked O(1) (doubly)" },
          { op: "Memory overhead per element", time: "Array 8 bytes · Linked 16–24 bytes" },
        ],
      },
      {
        type: "callout",
        kind: "perf",
        text: "Even when Big-O is equal, arrays win on cache locality. Traversing a linked list jumps around the heap; the CPU cache hates it.",
      },
      {
        type: "quiz",
        items: [
          {
            q: "You need to insert 1000 items at the front of a collection. Which is faster?",
            choices: ["Python list", "Singly linked list", "Both same"],
            answer: 1,
            explain:
              "Each `list.insert(0, x)` is O(n); linked-list push-front is O(1) — 1000× vs 1000² operations.",
          },
        ],
      },
    ],
  },

  // 4
  {
    slug: "memory-representation",
    title: "Memory Representation",
    eyebrow: "Internals",
    description: "How nodes actually sit in memory — and why that matters.",
    difficulty: "Beginner",
    readMinutes: 5,
    sections: [
      {
        type: "theory",
        text: "Every `Node` is an independent heap object. The `next` field is just a reference (essentially an 8-byte pointer on 64-bit CPython). Traversing the list dereferences one pointer at a time; each jump can be a cache miss.",
      },
      { type: "memory", nodes: [10, 20, 30] },
      {
        type: "code",
        title: "raw memory sketch",
        code: `# addresses are illustrative
0x100:  Node(val=10, next=0x240)
0x240:  Node(val=20, next=0x188)
0x188:  Node(val=30, next=None)

head = 0x100`,
      },
      {
        type: "callout",
        kind: "did",
        text: "Arrays give you O(1) index because address = base + i * stride. Linked lists have no such formula — you must walk.",
      },
    ],
  },

  // 5
  {
    slug: "node-structure",
    title: "Node Structure",
    eyebrow: "Building blocks",
    description: "The tiny class that makes everything else possible.",
    difficulty: "Beginner",
    readMinutes: 4,
    sections: [
      {
        type: "code",
        title: "singly linked node",
        code: `class Node:
    __slots__ = ("val", "next")

    def __init__(self, val, nxt=None):
        self.val = val
        self.next = nxt

    def __repr__(self):
        return f"Node({self.val!r})"`,
      },
      {
        type: "callout",
        kind: "perf",
        title: "Why __slots__?",
        text: "Skipping the per-instance `__dict__` saves ~40% memory. When you create millions of nodes, that adds up.",
      },
      {
        type: "code",
        title: "doubly linked node",
        code: `class DNode:
    __slots__ = ("val", "prev", "next")
    def __init__(self, val, prev=None, nxt=None):
        self.val = val
        self.prev = prev
        self.next = nxt`,
      },
      {
        type: "quiz",
        items: [
          {
            q: "What is the default value of `next` in a freshly created `Node(5)`?",
            choices: ["0", "None", "Node(0)", "undefined"],
            answer: 1,
          },
        ],
      },
    ],
  },

  // 6
  {
    slug: "creating-linked-lists",
    title: "Creating Linked Lists",
    eyebrow: "Operations",
    description: "Three canonical ways to build a linked list from data.",
    difficulty: "Beginner",
    readMinutes: 6,
    sections: [
      { type: "heading", text: "1. Build from an iterable" },
      {
        type: "code",
        code: `def from_iterable(values):
    dummy = Node(None)
    tail = dummy
    for v in values:
        tail.next = Node(v)
        tail = tail.next
    return dummy.next`,
      },
      { type: "heading", text: "2. Build in reverse (fast head-insert)" },
      {
        type: "code",
        code: `def from_iterable_reversed(values):
    head = None
    for v in reversed(values):
        head = Node(v, head)
    return head`,
      },
      { type: "heading", text: "3. Manual, node by node" },
      {
        type: "code",
        code: `head = Node(10)
head.next = Node(20)
head.next.next = Node(30)`,
      },
      { type: "playground", initial: [10, 20, 30, 40] },
      {
        type: "callout",
        kind: "tip",
        text: "The `dummy` (sentinel) trick removes the special case of an empty list — you always have somewhere to attach `tail.next`.",
      },
    ],
  },

  // 7
  {
    slug: "traversal",
    title: "Traversal",
    eyebrow: "Operations",
    description: "Walk from head to tail — the loop that every linked-list algorithm builds on.",
    difficulty: "Beginner",
    readMinutes: 5,
    sections: [
      { type: "viz", nodes: [10, 20, 30, 40], highlight: [0], caption: "Start at HEAD." },
      { type: "viz", nodes: [10, 20, 30, 40], highlight: [1] },
      { type: "viz", nodes: [10, 20, 30, 40], highlight: [2] },
      { type: "viz", nodes: [10, 20, 30, 40], highlight: [3], caption: "…until `cur is None`." },
      {
        type: "code",
        code: `def traverse(head):
    cur = head
    while cur is not None:
        print(cur.val)
        cur = cur.next`,
      },
      {
        type: "dryRun",
        headers: ["step", "cur", "cur.val"],
        rows: [
          ["1", "Node(10)", "10"],
          ["2", "Node(20)", "20"],
          ["3", "Node(30)", "30"],
          ["4", "Node(40)", "40"],
          ["5", "None", "loop exits"],
        ],
      },
      { type: "complexity", rows: [{ op: "traverse whole list", time: "O(n)", space: "O(1)" }] },
      {
        type: "mistakes",
        items: [
          "Using `while cur.next` instead of `while cur` — skips the last node.",
          "Mutating `head` inside the loop and losing the entry point. Walk with a temporary `cur`.",
        ],
      },
    ],
  },

  // 8
  {
    slug: "searching",
    title: "Searching",
    eyebrow: "Operations",
    description: "Find a value or return -1.",
    difficulty: "Beginner",
    readMinutes: 5,
    sections: [
      {
        type: "code",
        code: `def find(head, target):
    idx = 0
    while head:
        if head.val == target:
            return idx
        head = head.next
        idx += 1
    return -1`,
      },
      {
        type: "viz",
        nodes: [5, 8, 12, 21, 34],
        highlight: [2],
        caption: "find(head, 12) → returns 2",
      },
      {
        type: "complexity",
        rows: [
          { op: "best case (head match)", time: "O(1)" },
          { op: "average", time: "O(n)" },
          { op: "worst (not present)", time: "O(n)" },
          { op: "space", time: "O(1)" },
        ],
      },
      {
        type: "tip",
        text: "Unlike sorted arrays, a linked list can't use binary search — random access is O(n), which cancels out log-n gains.",
      },
    ],
  },

  // 9
  {
    slug: "insertion-beginning",
    title: "Insertion at Beginning",
    eyebrow: "Insertion · O(1)",
    description: "The fastest insertion — nothing shifts, just relink the head.",
    difficulty: "Beginner",
    readMinutes: 5,
    sections: [
      { type: "viz", nodes: [20, 30, 40], caption: "Before: head → 20 → 30 → 40" },
      { type: "viz", nodes: [10, 20, 30, 40], highlight: [0], caption: "After push_front(10)" },
      {
        type: "code",
        code: `def push_front(head, val):
    return Node(val, head)   # new node's next = old head`,
      },
      {
        type: "dryRun",
        headers: ["step", "action"],
        rows: [
          ["1", "create Node(val=10, next=head)"],
          ["2", "return new node → becomes the new head"],
        ],
      },
      { type: "complexity", rows: [{ op: "push_front", time: "O(1)", space: "O(1)" }] },
      { type: "playground", initial: [20, 30, 40] },
    ],
  },

  // 10
  {
    slug: "insertion-end",
    title: "Insertion at End",
    eyebrow: "Insertion",
    description: "O(n) without a tail pointer, O(1) with one.",
    difficulty: "Beginner",
    readMinutes: 6,
    sections: [
      {
        type: "code",
        title: "no tail pointer — O(n)",
        code: `def push_back(head, val):
    node = Node(val)
    if head is None:
        return node
    cur = head
    while cur.next:
        cur = cur.next
    cur.next = node
    return head`,
      },
      {
        type: "code",
        title: "maintained tail pointer — O(1)",
        code: `class LinkedList:
    def __init__(self):
        self.head = self.tail = None

    def push_back(self, val):
        node = Node(val)
        if self.tail is None:
            self.head = self.tail = node
        else:
            self.tail.next = node
            self.tail = node`,
      },
      { type: "viz", nodes: [10, 20, 30], caption: "Before" },
      { type: "viz", nodes: [10, 20, 30, 40], highlight: [3], caption: "After push_back(40)" },
      {
        type: "complexity",
        rows: [
          { op: "push_back (no tail)", time: "O(n)" },
          { op: "push_back (with tail)", time: "O(1)" },
        ],
      },
      {
        type: "callout",
        kind: "warn",
        text: "Forgetting to update `tail` after inserting/removing at the end silently breaks subsequent operations.",
      },
    ],
  },

  // 11
  {
    slug: "insertion-position",
    title: "Insertion at Position",
    eyebrow: "Insertion · O(k)",
    description: "Walk to the (k-1)-th node, splice the new one in.",
    difficulty: "Intermediate",
    readMinutes: 6,
    sections: [
      {
        type: "code",
        code: `def insert_at(head, k, val):
    if k == 0:
        return Node(val, head)
    dummy = Node(0, head)
    prev = dummy
    for _ in range(k):
        if prev.next is None:
            raise IndexError("index out of range")
        prev = prev.next
    prev.next = Node(val, prev.next)
    return dummy.next`,
      },
      { type: "viz", nodes: [10, 20, 40, 50], compare: [1], caption: "prev lands on index 1" },
      {
        type: "viz",
        nodes: [10, 20, 30, 40, 50],
        highlight: [2],
        caption: "insert_at(head, 2, 30)",
      },
      {
        type: "dryRun",
        headers: ["k", "prev", "prev.next", "action"],
        rows: [
          ["0", "dummy", "10", "walk"],
          ["1", "Node(10)", "20", "walk"],
          ["2", "Node(20)", "40", "splice new Node(30)"],
        ],
      },
      { type: "playground", initial: [10, 20, 40, 50] },
      {
        type: "mistakes",
        items: [
          "Off-by-one: stopping at index `k` instead of `k-1` puts the new node after the wrong neighbour.",
          "Not handling `k == 0` — you'd never enter the loop but still need to update `head`.",
        ],
      },
    ],
  },

  // 12
  {
    slug: "deletion-beginning",
    title: "Deletion at Beginning",
    eyebrow: "Deletion · O(1)",
    description: "Advance the head pointer — Python's GC does the rest.",
    difficulty: "Beginner",
    readMinutes: 4,
    sections: [
      {
        type: "code",
        code: `def pop_front(head):
    if head is None:
        return None, None       # (new_head, popped_value)
    return head.next, head.val`,
      },
      { type: "viz", nodes: [10, 20, 30, 40], compare: [0], caption: "Before: pop node 10" },
      { type: "viz", nodes: [20, 30, 40], caption: "After: head → 20" },
      { type: "complexity", rows: [{ op: "pop_front", time: "O(1)" }] },
    ],
  },

  // 13
  {
    slug: "deletion-end",
    title: "Deletion at End",
    eyebrow: "Deletion",
    description: "You need the second-to-last node — that's the O(n) part.",
    difficulty: "Intermediate",
    readMinutes: 5,
    sections: [
      {
        type: "code",
        code: `def pop_back(head):
    if head is None or head.next is None:
        return None            # 0 or 1 nodes → head becomes None
    cur = head
    while cur.next.next:
        cur = cur.next
    cur.next = None
    return head`,
      },
      {
        type: "viz",
        nodes: [10, 20, 30, 40],
        compare: [2],
        caption: "Stop at the 2nd-to-last node.",
      },
      { type: "viz", nodes: [10, 20, 30], caption: "After pop_back" },
      {
        type: "complexity",
        rows: [
          { op: "pop_back (singly)", time: "O(n)" },
          { op: "pop_back (doubly with tail)", time: "O(1)" },
        ],
      },
      {
        type: "callout",
        kind: "perf",
        text: "This is the single strongest argument for a doubly linked list — cheap deletion at either end.",
      },
    ],
  },

  // 14
  {
    slug: "deletion-by-value",
    title: "Deletion by Value",
    eyebrow: "Deletion · O(n)",
    description: "Use a dummy head so the 'target is the head' case disappears.",
    difficulty: "Intermediate",
    readMinutes: 6,
    sections: [
      {
        type: "code",
        code: `def delete_value(head, target):
    dummy = Node(0, head)
    prev = dummy
    while prev.next:
        if prev.next.val == target:
            prev.next = prev.next.next   # unlink
            break                        # remove only the first occurrence
        prev = prev.next
    return dummy.next`,
      },
      {
        type: "callout",
        kind: "tip",
        title: "Dummy-head pattern",
        text: "A sentinel node in front of the real head means the deletion code is the same whether the target is the head or not.",
      },
      {
        type: "viz",
        nodes: [10, 20, 30, 40],
        compare: [1],
        caption: "delete_value(head, 20) — locate",
      },
      { type: "viz", nodes: [10, 30, 40], caption: "After unlink" },
      {
        type: "code",
        title: "delete every occurrence",
        code: `def delete_all(head, target):
    dummy = Node(0, head)
    prev = dummy
    while prev.next:
        if prev.next.val == target:
            prev.next = prev.next.next
        else:
            prev = prev.next
    return dummy.next`,
      },
      {
        type: "mistakes",
        items: [
          "Advancing `prev` after deletion — you skip the node that just took the deleted node's place.",
          "Forgetting to return `dummy.next` — the head may have changed.",
        ],
      },
    ],
  },

  // 15
  {
    slug: "updating",
    title: "Updating Nodes",
    eyebrow: "Operations",
    description: "Change a value in place — walk to the index, assign.",
    difficulty: "Beginner",
    readMinutes: 3,
    sections: [
      {
        type: "code",
        code: `def update(head, idx, val):
    cur = head
    for _ in range(idx):
        if cur is None:
            raise IndexError
        cur = cur.next
    if cur is None:
        raise IndexError
    cur.val = val`,
      },
      { type: "complexity", rows: [{ op: "update(k)", time: "O(k)", space: "O(1)" }] },
    ],
  },

  // 16
  {
    slug: "reversing",
    title: "Reversing a Linked List",
    eyebrow: "Classic problem",
    description:
      "The single most-asked linked-list interview question. In-place, one pass, three pointers.",
    difficulty: "Intermediate",
    readMinutes: 7,
    sections: [
      {
        type: "theory",
        text: "Walk the list once, and at every step flip the current node's `next` pointer to point at the previously visited node. Three pointers — `prev`, `cur`, `nxt` — are enough. Return `prev` as the new head.",
      },
      { type: "viz", nodes: [1, 2, 3, 4], caption: "Before" },
      { type: "viz", nodes: [4, 3, 2, 1], highlight: [0], caption: "After reverse" },
      {
        type: "code",
        title: "iterative",
        code: `def reverse(head):
    prev, cur = None, head
    while cur:
        nxt = cur.next     # remember the rest
        cur.next = prev    # flip pointer
        prev = cur         # advance prev
        cur = nxt          # advance cur
    return prev`,
      },
      {
        type: "dryRun",
        headers: ["iter", "prev", "cur", "cur.next after flip"],
        rows: [
          ["0", "None", "1", "None"],
          ["1", "1", "2", "1"],
          ["2", "2", "3", "2"],
          ["3", "3", "4", "3"],
          ["4", "4", "None", "-"],
        ],
      },
      {
        type: "code",
        title: "recursive",
        code: `def reverse_rec(head):
    if head is None or head.next is None:
        return head
    new_head = reverse_rec(head.next)
    head.next.next = head
    head.next = None
    return new_head`,
      },
      {
        type: "complexity",
        rows: [
          { op: "iterative", time: "O(n)", space: "O(1)" },
          { op: "recursive", time: "O(n)", space: "O(n) (call stack)" },
        ],
      },
      { type: "playground", initial: [1, 2, 3, 4, 5] },
      {
        type: "mistakes",
        items: [
          "Reassigning `cur.next` before saving `nxt` — you lose the rest of the list.",
          "Returning `head` instead of `prev` — you return the (now-tail) original head.",
        ],
      },
      {
        type: "callout",
        kind: "interview",
        title: "Follow-up questions",
        text: "Reverse in groups of k · Reverse only nodes between positions m and n · Reverse a doubly linked list.",
      },
    ],
  },

  // 17
  {
    slug: "middle-node",
    title: "Finding the Middle Node",
    eyebrow: "Two pointers",
    description: "Slow moves 1, fast moves 2 — when fast hits the end, slow sits on the middle.",
    difficulty: "Intermediate",
    readMinutes: 5,
    sections: [
      {
        type: "code",
        code: `def middle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    return slow`,
      },
      {
        type: "viz",
        nodes: [1, 2, 3, 4, 5],
        slowIdx: 2,
        fastIdx: 4,
        caption: "After the loop for odd length: slow is exactly the middle.",
      },
      {
        type: "viz",
        nodes: [1, 2, 3, 4],
        slowIdx: 2,
        fastIdx: 3,
        caption:
          "Even length: slow is the SECOND middle. Use `while fast.next and fast.next.next` for the first middle.",
      },
      { type: "complexity", rows: [{ op: "middle", time: "O(n)", space: "O(1)" }] },
      {
        type: "quiz",
        items: [
          {
            q: "For [1,2,3,4,5,6] with the standard slow/fast loop, what does `middle` return?",
            choices: ["3", "4", "3.5", "None"],
            answer: 1,
            explain: "Even length returns the second middle, i.e. 4.",
          },
        ],
      },
    ],
  },

  // 18
  {
    slug: "cycle-detection",
    title: "Detecting a Cycle",
    eyebrow: "Floyd's algorithm",
    description: "Two pointers at different speeds must eventually meet inside a cycle.",
    difficulty: "Intermediate",
    readMinutes: 6,
    sections: [
      {
        type: "theory",
        text: "If there's no cycle, `fast` will hit `None`. If there IS a cycle, `fast` laps `slow` and they meet. This is the celebrated tortoise-and-hare algorithm.",
      },
      {
        type: "viz",
        nodes: [3, 2, 0, -4],
        cycleTo: 1,
        slowIdx: 2,
        fastIdx: 2,
        caption: "They meet at node index 2.",
      },
      {
        type: "code",
        code: `def has_cycle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow is fast:
            return True
    return False`,
      },
      { type: "complexity", rows: [{ op: "detect", time: "O(n)", space: "O(1)" }] },
      {
        type: "callout",
        kind: "did",
        text: "Compare with the hash-set approach: also O(n) time but O(n) space. Floyd's is strictly better on space.",
      },
    ],
  },

  // 19
  {
    slug: "removing-cycle",
    title: "Removing a Cycle",
    eyebrow: "Floyd's algorithm — part 2",
    description: "Once you know a cycle exists, a second walk locates its entry point.",
    difficulty: "Advanced",
    readMinutes: 7,
    sections: [
      {
        type: "theory",
        text: "After slow/fast meet inside the cycle, reset one pointer to `head` and advance both by 1. The point where they meet again is the cycle's entry. Then walk to the node whose `next` is that entry and set `.next = None`.",
      },
      {
        type: "code",
        code: `def detect_start(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow is fast:
            break
    else:
        return None
    slow = head
    while slow is not fast:
        slow = slow.next
        fast = fast.next
    return slow    # entry of the cycle

def remove_cycle(head):
    start = detect_start(head)
    if start is None:
        return head
    cur = start
    while cur.next is not start:
        cur = cur.next
    cur.next = None
    return head`,
      },
      {
        type: "viz",
        nodes: [3, 2, 0, -4],
        cycleTo: 1,
        highlight: [1],
        caption: "Cycle entry = node at index 1.",
      },
      { type: "complexity", rows: [{ op: "detect + remove", time: "O(n)", space: "O(1)" }] },
      {
        type: "tip",
        text: "Prove it on paper: let L = distance head→entry, C = cycle length, and show slow travels L + kC to meet fast.",
      },
    ],
  },

  // 20
  {
    slug: "merge-two-sorted",
    title: "Merge Two Sorted Lists",
    eyebrow: "Classic problem",
    description: "Iterative merge with a dummy head — the atomic building block of merge sort.",
    difficulty: "Intermediate",
    readMinutes: 6,
    sections: [
      {
        type: "code",
        code: `def merge(a, b):
    dummy = tail = Node(0)
    while a and b:
        if a.val <= b.val:
            tail.next, a = a, a.next
        else:
            tail.next, b = b, b.next
        tail = tail.next
    tail.next = a or b       # attach the remainder
    return dummy.next`,
      },
      { type: "viz", nodes: [1, 4, 8], caption: "a" },
      { type: "viz", nodes: [2, 3, 9], caption: "b" },
      { type: "viz", nodes: [1, 2, 3, 4, 8, 9], caption: "merge(a, b)" },
      {
        type: "dryRun",
        headers: ["a", "b", "chosen", "tail"],
        rows: [
          ["1→4→8", "2→3→9", "1", "1"],
          ["4→8", "2→3→9", "2", "1→2"],
          ["4→8", "3→9", "3", "1→2→3"],
          ["4→8", "9", "4", "1→2→3→4"],
          ["8", "9", "8", "…→8"],
          ["∅", "9", "attach 9", "…→8→9"],
        ],
      },
      { type: "complexity", rows: [{ op: "merge", time: "O(n + m)", space: "O(1)" }] },
    ],
  },

  // 21
  {
    slug: "sorting",
    title: "Sorting a Linked List",
    eyebrow: "Algorithm",
    description: "Merge sort is the natural fit — no random access required.",
    difficulty: "Advanced",
    readMinutes: 7,
    sections: [
      {
        type: "theory",
        text: "Quick sort needs random access to partition efficiently, so it degrades on linked lists. Merge sort — split by finding the middle, recurse, merge — hits O(n log n) time and O(log n) recursion space, no swaps.",
      },
      {
        type: "code",
        code: `def sort_list(head):
    if head is None or head.next is None:
        return head
    # split into two halves at the middle
    slow, fast = head, head.next
    while fast and fast.next:
        slow, fast = slow.next, fast.next.next
    mid, slow.next = slow.next, None
    left = sort_list(head)
    right = sort_list(mid)
    return merge(left, right)`,
      },
      {
        type: "complexity",
        rows: [
          { op: "time", time: "O(n log n)" },
          { op: "space", time: "O(log n)", note: "recursion stack" },
        ],
      },
      {
        type: "callout",
        kind: "interview",
        text: "This is LeetCode 148 — a textbook 'medium' that separates candidates who understand recursion structure from those who don't.",
      },
    ],
  },

  // 22
  {
    slug: "applications",
    title: "Applications",
    eyebrow: "Where they're used",
    description: "Concrete places linked lists power real systems.",
    difficulty: "Beginner",
    readMinutes: 4,
    sections: [
      {
        type: "theory",
        bullets: [
          "LRU / LFU caches — doubly linked list + hash map = O(1) get/put.",
          "collections.deque (CPython) is a doubly linked list of fixed-size blocks.",
          "Undo / redo stacks in editors.",
          "Adjacency lists in graph algorithms.",
          "Free-list memory allocators.",
          "Music playlists / round-robin schedulers (circular linked list).",
          "Polynomial arithmetic where terms are stored in decreasing exponent order.",
        ],
      },
      {
        type: "callout",
        kind: "did",
        text: "The Linux kernel's `list_head` is a classic intrusive doubly-linked list used everywhere — from processes to filesystems.",
      },
    ],
  },

  // 23
  {
    slug: "time-complexity",
    title: "Time Complexity",
    eyebrow: "Reference",
    description: "All operations, all cases.",
    difficulty: "Beginner",
    readMinutes: 3,
    sections: [
      {
        type: "complexity",
        rows: [
          { op: "Access i-th", time: "O(n)", space: "O(1)" },
          { op: "Search by value", time: "O(n)", space: "O(1)" },
          { op: "Insert at head", time: "O(1)", space: "O(1)" },
          { op: "Insert at tail (no tail ptr)", time: "O(n)", space: "O(1)" },
          { op: "Insert at tail (with tail ptr)", time: "O(1)", space: "O(1)" },
          { op: "Insert at index k", time: "O(k)", space: "O(1)" },
          { op: "Delete at head", time: "O(1)", space: "O(1)" },
          { op: "Delete at tail (singly)", time: "O(n)", space: "O(1)" },
          { op: "Delete at tail (doubly)", time: "O(1)", space: "O(1)" },
          { op: "Delete by value", time: "O(n)", space: "O(1)" },
          { op: "Reverse", time: "O(n)", space: "O(1)" },
          { op: "Cycle detection (Floyd)", time: "O(n)", space: "O(1)" },
          { op: "Merge sort", time: "O(n log n)", space: "O(log n)" },
        ],
      },
    ],
  },

  // 24
  {
    slug: "space-complexity",
    title: "Space Complexity",
    eyebrow: "Reference",
    description: "Per-node overhead is the real cost of a linked list.",
    difficulty: "Beginner",
    readMinutes: 3,
    sections: [
      {
        type: "theory",
        text: "A Python `Node` with `__slots__ = ('val', 'next')` weighs ~56 bytes on 64-bit CPython (16 bytes object header + 2 × 8-byte pointers + object padding). A dynamic array pays only 8 bytes per element (a single reference).",
      },
      {
        type: "complexity",
        rows: [
          { op: "storage per element (list)", time: "≈ 8 bytes" },
          { op: "storage per element (linked)", time: "≈ 56 bytes" },
          { op: "recursion for merge sort", time: "O(log n)" },
          { op: "iterative reverse", time: "O(1)" },
        ],
      },
      {
        type: "callout",
        kind: "perf",
        text: "7× more memory per element is the price you pay for O(1) mid-list splicing.",
      },
    ],
  },

  // 25
  {
    slug: "common-mistakes",
    title: "Common Mistakes",
    eyebrow: "Debugging",
    description: "The bugs that catch every beginner (and most seniors).",
    difficulty: "Beginner",
    readMinutes: 5,
    sections: [
      {
        type: "mistakes",
        items: [
          "Losing the `next` pointer before reassigning it — save it in a temp first.",
          "Off-by-one in loop bounds: `while cur.next` skips the last node; `while cur` visits it.",
          "Modifying `head` while iterating — walk with `cur = head`.",
          "Forgetting to return the (possibly new) head after insertion/deletion at position 0.",
          "Not using a dummy head — special-casing every head mutation.",
          "Infinite loop from `cur = cur` instead of `cur = cur.next`.",
          "Missing `is None` guards — Python's truthiness on nodes will happily match anything non-null-ish.",
          "Not updating a maintained tail pointer after append/pop_back.",
          "Assuming `slow == fast` at the start of the Floyd loop means a cycle — it always does before the first iteration.",
        ],
      },
    ],
  },

  // 26
  {
    slug: "interview-questions",
    title: "Interview Questions",
    eyebrow: "Preparation",
    description: "The pattern-level questions asked at every FAANG interview.",
    difficulty: "Advanced",
    readMinutes: 6,
    sections: [
      {
        type: "interview",
        items: [
          "Reverse a linked list — iterative AND recursive.",
          "Reverse nodes in k-sized groups.",
          "Detect a cycle · find the cycle's entry point.",
          "Find the middle node in one pass.",
          "Merge two sorted linked lists · Merge k sorted linked lists.",
          "Remove the n-th node from the end (one pass).",
          "Check if a linked list is a palindrome (O(1) space).",
          "Add two numbers represented as linked lists.",
          "Copy a linked list with random pointers.",
          "Flatten a multilevel doubly linked list.",
          "Rotate a linked list by k.",
          "Sort a linked list in O(n log n) constant space (bottom-up merge sort).",
          "LRU cache design (doubly linked list + hash map).",
        ],
      },
      {
        type: "callout",
        kind: "interview",
        title: "Signals interviewers look for",
        text: "Draw before you code · handle empty & single-node cases first · introduce a dummy head · explain time & space before touching syntax.",
      },
    ],
  },

  // 27
  {
    slug: "faqs",
    title: "FAQs",
    eyebrow: "Q&A",
    description: "The questions students ask most often.",
    difficulty: "Beginner",
    readMinutes: 6,
    sections: [
      { type: "theory", text: "Q: Are Python lists linked lists?" },
      {
        type: "theory",
        text: "A: No. `list` is a resizable dynamic array — O(1) indexing, O(n) mid-insert. For a doubly-linked queue-like structure use `collections.deque`.",
      },
      { type: "theory", text: "Q: Should I ever build my own linked list in production Python?" },
      {
        type: "theory",
        text: "A: Rarely. `deque` covers 95% of use cases. Write your own only for interview practice or when implementing custom cache eviction, intrusive lists, or lock-free structures in C-extensions.",
      },
      { type: "theory", text: "Q: Why is push_back O(n) here but O(1) on Python lists?" },
      {
        type: "theory",
        text: "A: Python lists over-allocate their backing array and pay amortised O(1) for append. A linked list without a tail pointer has to walk the whole chain.",
      },
      {
        type: "theory",
        text: "Q: What's the practical difference between singly and doubly linked?",
      },
      {
        type: "theory",
        text: "A: Doubly gives you O(1) deletion given the node and O(1) pop_back; singly saves one pointer per node. Choose doubly when either matters.",
      },
      { type: "theory", text: "Q: Can I use recursion to solve every linked-list problem?" },
      {
        type: "theory",
        text: "A: Yes structurally, but you pay O(n) stack space and risk `RecursionError` on long lists (CPython's default limit is 1000). Prefer iterative solutions in interviews unless recursion is clearly cleaner.",
      },
    ],
  },

  // 28
  {
    slug: "practice-problems",
    title: "Practice Problems",
    eyebrow: "LeetCode roadmap",
    description: "A curated set that covers every important pattern.",
    difficulty: "Intermediate",
    readMinutes: 4,
    sections: [
      {
        type: "practice",
        groups: [
          {
            level: "Beginner",
            items: [
              {
                title: "206 · Reverse Linked List",
                url: "https://leetcode.com/problems/reverse-linked-list/",
                difficulty: "Easy",
                pattern: "Iterative reverse",
                time: "15m",
              },
              {
                title: "141 · Linked List Cycle",
                url: "https://leetcode.com/problems/linked-list-cycle/",
                difficulty: "Easy",
                pattern: "Floyd's",
                time: "15m",
              },
              {
                title: "876 · Middle of the Linked List",
                url: "https://leetcode.com/problems/middle-of-the-linked-list/",
                difficulty: "Easy",
                pattern: "Slow/fast",
                time: "10m",
              },
              {
                title: "21 · Merge Two Sorted Lists",
                url: "https://leetcode.com/problems/merge-two-sorted-lists/",
                difficulty: "Easy",
                pattern: "Dummy head",
                time: "15m",
              },
              {
                title: "83 · Remove Duplicates from Sorted List",
                url: "https://leetcode.com/problems/remove-duplicates-from-sorted-list/",
                difficulty: "Easy",
                pattern: "One pass",
                time: "10m",
              },
            ],
          },
          {
            level: "Intermediate",
            items: [
              {
                title: "19 · Remove Nth From End",
                url: "https://leetcode.com/problems/remove-nth-node-from-end-of-list/",
                difficulty: "Medium",
                pattern: "Two pointers",
                time: "20m",
              },
              {
                title: "142 · Linked List Cycle II",
                url: "https://leetcode.com/problems/linked-list-cycle-ii/",
                difficulty: "Medium",
                pattern: "Floyd's + entry",
                time: "25m",
              },
              {
                title: "234 · Palindrome Linked List",
                url: "https://leetcode.com/problems/palindrome-linked-list/",
                difficulty: "Easy",
                pattern: "Reverse half",
                time: "25m",
              },
              {
                title: "2 · Add Two Numbers",
                url: "https://leetcode.com/problems/add-two-numbers/",
                difficulty: "Medium",
                pattern: "Carry & merge",
                time: "25m",
              },
              {
                title: "148 · Sort List",
                url: "https://leetcode.com/problems/sort-list/",
                difficulty: "Medium",
                pattern: "Merge sort",
                time: "30m",
              },
              {
                title: "138 · Copy List with Random Pointer",
                url: "https://leetcode.com/problems/copy-list-with-random-pointer/",
                difficulty: "Medium",
                pattern: "Interleave / hash",
                time: "30m",
              },
            ],
          },
          {
            level: "Advanced",
            items: [
              {
                title: "23 · Merge k Sorted Lists",
                url: "https://leetcode.com/problems/merge-k-sorted-lists/",
                difficulty: "Hard",
                pattern: "Min-heap",
                time: "35m",
              },
              {
                title: "25 · Reverse Nodes in k-Group",
                url: "https://leetcode.com/problems/reverse-nodes-in-k-group/",
                difficulty: "Hard",
                pattern: "Group reverse",
                time: "40m",
              },
              {
                title: "146 · LRU Cache",
                url: "https://leetcode.com/problems/lru-cache/",
                difficulty: "Medium",
                pattern: "DLL + hashmap",
                time: "45m",
              },
              {
                title: "460 · LFU Cache",
                url: "https://leetcode.com/problems/lfu-cache/",
                difficulty: "Hard",
                pattern: "DLL of DLLs",
                time: "60m",
              },
            ],
          },
        ],
      },
    ],
  },

  // 29
  {
    slug: "quiz",
    title: "Quiz",
    eyebrow: "Check yourself",
    description: "Ten questions across theory, complexity, pointer tracing and debugging.",
    difficulty: "Intermediate",
    readMinutes: 8,
    sections: [
      {
        type: "quiz",
        items: [
          {
            q: "Time complexity of accessing the k-th element in a singly linked list?",
            choices: ["O(1)", "O(log n)", "O(k)", "O(n²)"],
            answer: 2,
            explain: "You must walk k pointers from the head.",
          },
          {
            q: "After `head = Node(1, Node(2, Node(3)))`, what is `head.next.next.val`?",
            choices: ["1", "2", "3", "None"],
            answer: 2,
          },
          {
            q: "Which pattern gives the middle node in one pass?",
            choices: ["Binary search", "Slow/fast pointers", "Recursion + counter", "Hashing"],
            answer: 1,
          },
          {
            q: "In `reverse`, why do we save `nxt = cur.next` first?",
            choices: [
              "It's faster",
              "Otherwise we lose access to the rest of the list",
              "To satisfy Python's assignment rules",
              "For readability only",
            ],
            answer: 1,
          },
          {
            q: "You call `pop_back` on a singly linked list of length 10⁶. Roughly how many pointer dereferences?",
            choices: ["1", "log 10⁶", "10⁶", "10⁶ · log 10⁶"],
            answer: 2,
            explain: "You must walk to the second-to-last node.",
          },
          {
            q: "Which of these is NOT solvable in O(1) extra space?",
            choices: [
              "Reverse iteratively",
              "Detect cycle",
              "Merge two sorted lists",
              "Sort with merge sort (naive recursion)",
            ],
            answer: 3,
            explain: "Recursive merge sort uses O(log n) call-stack space.",
          },
          {
            q: "You forgot to add `dummy = Node(0, head)` before deleting by value. Which case now breaks?",
            choices: ["Empty list", "Deleting the head", "Deleting the tail", "Duplicate values"],
            answer: 1,
          },
          {
            q: "What does Floyd's algorithm return when the list has no cycle?",
            choices: ["The head", "None / False", "The tail", "Infinite loop"],
            answer: 1,
          },
          {
            q: "In a merge of `[1,3]` and `[2]`, how many comparisons does the loop perform?",
            choices: ["1", "2", "3", "4"],
            answer: 1,
            explain:
              "Compare 1 vs 2 (pick 1), compare 3 vs 2 (pick 2). Then b is empty and remainder is attached.",
          },
          {
            q: "Choosing between a linked list and a Python list for a stack, which is better and why?",
            choices: [
              "Linked — O(1) push/pop",
              "Python list — O(1) amortised push/pop with better cache locality",
              "Same performance",
              "Depends on the OS",
            ],
            answer: 1,
          },
        ],
      },
    ],
  },

  // 30
  {
    slug: "references",
    title: "References",
    eyebrow: "Further reading",
    description: "Books, articles, and visual playgrounds to go deeper.",
    difficulty: "Beginner",
    readMinutes: 2,
    sections: [
      {
        type: "references",
        items: [
          {
            label: "Python docs · collections.deque",
            url: "https://docs.python.org/3/library/collections.html#collections.deque",
          },
          {
            label: "CPython source · _collectionsmodule.c",
            url: "https://github.com/python/cpython/blob/main/Modules/_collectionsmodule.c",
          },
          { label: "Visualgo · Linked List", url: "https://visualgo.net/en/list" },
          {
            label: "GeeksforGeeks · Linked List",
            url: "https://www.geeksforgeeks.org/data-structures/linked-list/",
          },
          { label: "Programiz · Linked List", url: "https://www.programiz.com/dsa/linked-list" },
          {
            label: "MIT 6.006 · Linked lists (lecture notes)",
            url: "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/",
          },
          {
            label: "Linux kernel intrusive list",
            url: "https://www.kernel.org/doc/html/latest/core-api/kernel-api.html#list-management-functions",
          },
          { label: "LeetCode · Linked List tag", url: "https://leetcode.com/tag/linked-list/" },
          { label: "NeetCode roadmap · Linked List", url: "https://neetcode.io/roadmap" },
          {
            label: "HackerRank · Linked List domain",
            url: "https://www.hackerrank.com/domains/data-structures?filters%5Bsubdomains%5D%5B%5D=linked-lists",
          },
        ],
      },
    ],
  },
];

export function getLL(slug: string): LLLesson | undefined {
  return LL_LESSONS.find((l) => l.slug === slug);
}
