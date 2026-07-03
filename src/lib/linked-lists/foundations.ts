// Foundations tier for the Linked Lists course.
// Every lesson uses the LLSection pipeline so it renders identically to
// the existing linked-lists lesson page. These lessons cover concepts
// shared by every linked-list variant — teach once here, don't repeat
// inside Singly / Doubly / Circular mini-courses.

import type { LLLesson } from "@/lib/linked-lists-content";

export const LL_FOUNDATIONS: LLLesson[] = [
  {
    slug: "introduction",
    title: "Introduction to Linked Lists",
    eyebrow: "Foundations · 1",
    description:
      "A linked list is a chain of nodes connected by pointers. Build the mental model before touching any variant.",
    difficulty: "Beginner",
    readMinutes: 5,
    sections: [
      { type: "theory", text:
        "A linked list is a linear data structure where each element (a node) stores a value plus a pointer to the next element. Unlike arrays, the elements live at arbitrary memory locations — they only appear ordered because each node knows where the next one lives." },
      { type: "viz", nodes: [10, 20, 30, 40], headLabel: "HEAD", caption: "A 4-node singly linked list." },
      { type: "theory", bullets: [
        "Nodes are allocated one at a time on the heap.",
        "The list is identified entirely by its head pointer.",
        "The last node's next pointer is NULL to mark the end.",
        "Size is dynamic — you never pre-declare capacity.",
      ]},
      { type: "callout", kind: "info", title: "You will meet 4 variants",
        text: "Singly, Doubly, Circular, and Circular Doubly. Foundations teaches the shared concepts; each variant only adds what is unique to it." },
    ],
  },
  {
    slug: "why-linked-lists",
    title: "Why Linked Lists?",
    eyebrow: "Foundations · 2",
    description: "The pain points that motivated linked lists in the first place.",
    difficulty: "Beginner",
    readMinutes: 4,
    sections: [
      { type: "theory", text:
        "Arrays are wonderfully cache-friendly but rigid: a fixed contiguous block of memory. When you need to insert or delete in the middle, arrays force you to shift every element after it. Linked lists trade random access for cheap mid-sequence structural changes." },
      { type: "theory", bullets: [
        "O(1) insertion / deletion when you already hold the node.",
        "Grow forever — no reallocation, no doubling, no moving.",
        "No wasted capacity; each node costs exactly what it holds.",
        "Building blocks for stacks, queues, adjacency lists, LRU caches.",
      ]},
    ],
  },
  {
    slug: "problems-with-arrays",
    title: "Problems with Arrays",
    eyebrow: "Foundations · 3",
    description: "Concrete situations where arrays hurt — and why linked lists exist.",
    difficulty: "Beginner",
    readMinutes: 4,
    sections: [
      { type: "theory", bullets: [
        "Static arrays have a fixed capacity — full is full.",
        "Dynamic arrays reallocate + copy every time capacity doubles → occasional O(n) hiccups.",
        "Inserting at index 0 shifts every element right → O(n).",
        "Deleting a middle element leaves a hole that must be filled by shifting → O(n).",
        "You must know a good starting size in advance to avoid many resizes.",
      ]},
      { type: "callout", kind: "warn", title: "The tradeoff",
        text: "Linked lists fix all of the above but lose O(1) random access — you cannot jump straight to index k." },
    ],
  },
  {
    slug: "array-vs-linked-list",
    title: "Array vs Linked List",
    eyebrow: "Foundations · 4",
    description: "Side-by-side comparison of the two most fundamental linear structures.",
    difficulty: "Beginner",
    readMinutes: 5,
    sections: [
      { type: "complexity", rows: [
        { op: "Access by index", time: "Array O(1) · LinkedList O(n)", note: "Arrays win big for random access." },
        { op: "Insert at head", time: "Array O(n) · LinkedList O(1)" },
        { op: "Insert at tail", time: "Array O(1)* · LinkedList O(1) w/ tail" },
        { op: "Insert middle", time: "Array O(n) · LinkedList O(1) w/ ptr" },
        { op: "Delete by value", time: "Array O(n) · LinkedList O(n)" },
        { op: "Memory layout", time: "Contiguous · Scattered", note: "Cache locality favors arrays." },
        { op: "Extra memory per element", time: "0 · pointer(s)", note: "LinkedList pays for links." },
      ]},
    ],
  },
  {
    slug: "what-is-a-node",
    title: "What is a Node?",
    eyebrow: "Foundations · 5",
    description: "The atomic unit of every linked list — a value plus one or more pointers.",
    difficulty: "Beginner",
    readMinutes: 4,
    sections: [
      { type: "theory", text:
        "A node is a small container object that holds a value and one or more references to other nodes. The reference (also called a link or pointer) is what stitches independent nodes into a sequence." },
      { type: "code", title: "smallest possible node", code:
`class Node:
    __slots__ = ("val", "next")
    def __init__(self, val, nxt=None):
        self.val = val
        self.next = nxt` },
      { type: "callout", kind: "tip", title: "Why __slots__?",
        text: "It skips Python's per-instance dict and cuts memory roughly in half for tiny structures like nodes." },
    ],
  },
  {
    slug: "node-anatomy",
    title: "Node Anatomy",
    eyebrow: "Foundations · 6",
    description: "Every linked-list variant adds or removes fields on the node.",
    difficulty: "Beginner",
    readMinutes: 4,
    sections: [
      { type: "theory", bullets: [
        "Singly node   →  { val, next }",
        "Doubly node   →  { val, prev, next }",
        "Circular node →  same as singly, but tail.next points back to head",
        "Skip-list node → { val, next[] }  (an array of forward pointers)",
      ]},
      { type: "callout", kind: "did", title: "The payload is arbitrary",
        text: "`val` can be an int, a string, a tuple, or a full object — the node structure doesn't care." },
    ],
  },
  {
    slug: "memory-representation",
    title: "Memory Representation",
    eyebrow: "Foundations · 7",
    description: "How linked lists are actually laid out in memory — with simulated addresses.",
    difficulty: "Beginner",
    readMinutes: 6,
    sections: [
      { type: "theory", text:
        "Nodes live wherever the allocator finds free space. The values look sequential only because each node's `next` field stores the address of the next allocated block." },
      { type: "code", title: "conceptual memory dump", code:
`Node A          Node B          Node C
value:   10     value:   20     value:   30
addr:  0x120    addr:  0x240    addr:  0x580
next:  0x240    next:  0x580    next:  NULL` },
      { type: "memory", nodes: [10, 20, 30], caption:
        "Nodes are scattered; each stores the address of the next." },
      { type: "callout", kind: "perf", title: "Cache impact",
        text: "Arrays load neighbors into cache for free. Linked lists chase pointers — each hop can be a cache miss. That's why arrays are usually faster despite the same Big-O." },
    ],
  },
  {
    slug: "pointers-references",
    title: "Pointers & References",
    eyebrow: "Foundations · 8",
    description: "In Python, every variable is a reference. Understand that or debugging linked lists is a nightmare.",
    difficulty: "Beginner",
    readMinutes: 5,
    sections: [
      { type: "theory", text:
        "Python doesn't expose raw pointers, but every variable holds a reference to an object. Assigning `b = a` does not copy the node — both names now point to the same object." },
      { type: "code", title: "shared references", code:
`a = Node(10)
b = a               # b and a are the SAME node
b.val = 99
print(a.val)        # 99 — a was mutated too` },
      { type: "callout", kind: "warn", title: "Mutation vs rebinding",
        text: "`b.next = something` mutates the shared node. `b = something` only changes what the *name* b points to — it does NOT touch a." },
    ],
  },
  {
    slug: "head-pointer",
    title: "Head Pointer",
    eyebrow: "Foundations · 9",
    description: "The single reference that owns the entire list.",
    difficulty: "Beginner",
    readMinutes: 3,
    sections: [
      { type: "theory", text:
        "The `head` pointer is the entry point. Lose it and you lose the whole list — Python's garbage collector will free every unreachable node. Almost every algorithm walks starts from `head`." },
      { type: "viz", nodes: [10, 20, 30], headLabel: "HEAD", caption: "Head refers to the first node." },
      { type: "callout", kind: "tip", title: "Always update head",
        text: "When you insert at the front, or delete the first node, `head` itself must move. Forgetting this is the #1 beginner bug." },
    ],
  },
  {
    slug: "tail-pointer",
    title: "Tail Pointer",
    eyebrow: "Foundations · 10",
    description: "An optional shortcut that turns O(n) tail operations into O(1).",
    difficulty: "Beginner",
    readMinutes: 3,
    sections: [
      { type: "theory", text:
        "Without a tail pointer, appending forces a full traversal. Storing a second reference — `tail` — lets you append in constant time. The tradeoff: every insert / delete must maintain that pointer correctly." },
      { type: "viz", nodes: [10, 20, 30], headLabel: "HEAD", tailLabel: "TAIL" },
    ],
  },
  {
    slug: "null-pointer",
    title: "NULL Pointer",
    eyebrow: "Foundations · 11",
    description: "How the list knows it has ended — the terminator that stops every traversal.",
    difficulty: "Beginner",
    readMinutes: 3,
    sections: [
      { type: "theory", text:
        "The last node's `next` field is `None` in Python (equivalent to NULL in C). Every traversal loop tests `while cur is not None` — if you forget the terminator you get an AttributeError, and if you forget the check you loop forever." },
      { type: "code", title: "the terminator check", code:
`cur = head
while cur is not None:      # None marks the end
    print(cur.val)
    cur = cur.next` },
    ],
  },
  {
    slug: "traversal-concept",
    title: "Traversal Concept",
    eyebrow: "Foundations · 12",
    description: "The universal pattern for walking every node in a linked list.",
    difficulty: "Beginner",
    readMinutes: 4,
    sections: [
      { type: "theory", text:
        "Traversal always follows the same shape: start at `head`, do something with the current node, advance via `cur = cur.next`. This pattern is the atomic building block for search, count, reverse, and almost every other algorithm." },
      { type: "viz", nodes: [10, 20, 30, 40], highlight: [0], caption: "cur starts at head" },
      { type: "viz", nodes: [10, 20, 30, 40], highlight: [2], caption: "cur has advanced two hops" },
    ],
  },
  {
    slug: "how-nodes-connect",
    title: "How Nodes Connect",
    eyebrow: "Foundations · 13",
    description: "Building a 3-node list by hand, one link at a time.",
    difficulty: "Beginner",
    readMinutes: 4,
    sections: [
      { type: "code", title: "manual wiring", code:
`a = Node(10)
b = Node(20)
c = Node(30)

a.next = b       # 10 → 20
b.next = c       # 20 → 30
c.next = None    # 30 → NULL

head = a         # entry point` },
      { type: "viz", nodes: [10, 20, 30], headLabel: "HEAD", caption: "The result of wiring three nodes together." },
    ],
  },
  {
    slug: "memory-allocation",
    title: "Memory Allocation",
    eyebrow: "Foundations · 14",
    description: "Nodes are allocated on the heap, one at a time — no bulk reservation.",
    difficulty: "Beginner",
    readMinutes: 3,
    sections: [
      { type: "theory", text:
        "Every `Node(...)` call reserves memory on Python's heap. There is no pre-allocated buffer. This is the opposite of a Python list, which grows in doubling chunks and occasionally copies everything." },
    ],
  },
  {
    slug: "dynamic-memory",
    title: "Dynamic Memory Concept",
    eyebrow: "Foundations · 15",
    description: "Why linked lists scale to any size without a reallocation penalty.",
    difficulty: "Beginner",
    readMinutes: 3,
    sections: [
      { type: "theory", bullets: [
        "Nodes are created lazily — one allocation per insert.",
        "No amortized doubling, no worst-case O(n) resize.",
        "Deleting a node returns its memory to Python's allocator immediately.",
        "Ideal for streams where you don't know the total size up front.",
      ]},
    ],
  },
  {
    slug: "advantages-disadvantages",
    title: "Advantages & Disadvantages",
    eyebrow: "Foundations · 16",
    description: "Know exactly when to reach for a linked list — and when not to.",
    difficulty: "Beginner",
    readMinutes: 5,
    sections: [
      { type: "theory", bullets: [
        "✅ O(1) insert / delete at a known node.",
        "✅ No wasted capacity; sizes are exact.",
        "✅ Splitting / merging lists is pointer-only work.",
      ]},
      { type: "theory", bullets: [
        "❌ O(n) random access — you must walk from head.",
        "❌ Extra memory per element for the `next` pointer.",
        "❌ Poor cache locality; pointer chasing hurts CPUs.",
        "❌ More edge cases (head/tail/null) than an array.",
      ]},
    ],
  },
  {
    slug: "time-complexity-overview",
    title: "Time Complexity Overview",
    eyebrow: "Foundations · 17",
    description: "The Big-O of every core linked-list operation, in one table.",
    difficulty: "Beginner",
    readMinutes: 3,
    sections: [
      { type: "complexity", rows: [
        { op: "Access index k", time: "O(k)", note: "Walk from head." },
        { op: "Search value",   time: "O(n)" },
        { op: "Insert at head", time: "O(1)" },
        { op: "Insert at tail", time: "O(1) w/ tail · O(n) without" },
        { op: "Insert after node ptr", time: "O(1)" },
        { op: "Delete at head", time: "O(1)" },
        { op: "Delete at tail", time: "O(n) singly · O(1) doubly" },
        { op: "Delete by value", time: "O(n)" },
        { op: "Reverse", time: "O(n)" },
      ]},
    ],
  },
  {
    slug: "space-complexity-overview",
    title: "Space Complexity Overview",
    eyebrow: "Foundations · 18",
    description: "How much extra memory each variant costs per node.",
    difficulty: "Beginner",
    readMinutes: 3,
    sections: [
      { type: "complexity", rows: [
        { op: "Singly node",         time: "O(1)", space: "1 pointer" },
        { op: "Doubly node",         time: "O(1)", space: "2 pointers" },
        { op: "Whole list of n",     time: "O(n)", space: "n × node size" },
        { op: "Iterative traversal", time: "O(1) aux",  space: "no recursion" },
        { op: "Recursive traversal", time: "O(n) aux",  space: "call stack" },
      ]},
    ],
  },
  {
    slug: "choosing-linked-list",
    title: "Choosing the Right Linked List",
    eyebrow: "Foundations · 19",
    description: "A decision guide for picking Singly, Doubly, Circular, or CDLL.",
    difficulty: "Beginner",
    readMinutes: 5,
    sections: [
      { type: "theory", bullets: [
        "Singly — smallest memory footprint, forward-only traversal. Default choice.",
        "Doubly — bidirectional traversal + O(1) delete-by-node. LRU caches, editor buffers.",
        "Circular — round-robin scheduling, ring buffers, Josephus-style problems.",
        "Circular Doubly — both-way rings; underlies Python's own `collections.deque`.",
      ]},
    ],
  },
  {
    slug: "comparison",
    title: "Comparison of All Linked List Types",
    eyebrow: "Foundations · 20",
    description: "Structure, memory, traversal, complexity, and real-world usage — side by side.",
    difficulty: "Beginner",
    readMinutes: 6,
    sections: [
      // The route renders <VariantComparisonTable /> above the sections for
      // the `comparison` and `revision/comparison-cheatsheet` slugs.
      { type: "theory", text:
        "The table above lays out how the four variants differ across every axis that matters. Use it as a lookup when you're picking a structure for a new problem." },
    ],
  },
  {
    slug: "node-playground",
    title: "Interactive Node Playground",
    eyebrow: "Foundations · 21",
    description: "Create nodes, connect them by hand, and watch simulated memory addresses update.",
    difficulty: "Beginner",
    readMinutes: 8,
    sections: [
      // The route renders <NodePlayground /> above the sections for this
      // slug — it's the whole point of the lesson.
      { type: "theory", text:
        "Use the playground above to build intuition. Try: create three nodes, connect A→B and B→C, then move the HEAD chip onto A. Notice how the simulated addresses stay stable while only the `next` fields change." },
      { type: "callout", kind: "tip", title: "Suggested experiments",
        text: "1) Disconnect A→B and watch B become unreachable. 2) Point C.next back at A — you've just built a cycle. 3) Set both HEAD and TAIL onto the same node — that's a 1-node list." },
    ],
  },
  {
    slug: "summary",
    title: "Foundations Summary",
    eyebrow: "Foundations · 22",
    description: "Everything you need to remember before diving into the variants.",
    difficulty: "Beginner",
    readMinutes: 3,
    sections: [
      { type: "theory", bullets: [
        "A linked list is nodes connected by pointers, identified by HEAD.",
        "Nodes live at scattered heap addresses — order is imposed by `next`.",
        "The last node's `next` is None; traversal ends when you hit it.",
        "Insertions and deletions at a known node are O(1); random access is O(n).",
        "The four variants differ only in what fields the node carries and how the last node points.",
      ]},
      { type: "callout", kind: "did", title: "You are ready",
        text: "Head into any variant — Singly is the natural starting point — and you'll only encounter concepts unique to that shape." },
    ],
  },
];
