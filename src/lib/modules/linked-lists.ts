import type { RichModule } from "@/lib/module-schema";

export const LINKED_LISTS: RichModule = {
  slug: "linked-lists",
  title: "Linked Lists",
  tagline:
    "Nodes connected by pointers — the foundational dynamic data structure behind stacks, queues, graphs, and more.",
  group: "Linear Data Structures",

  introduction: {
    definition:
      "A linked list is a linear data structure where each element (node) stores a value and a reference (pointer) to the next node in the sequence. Unlike arrays, elements are not stored in contiguous memory.",
    whyExists:
      "Arrays require contiguous memory and expensive resizing. Linked lists let programs grow and shrink dynamically at O(1) per node and insert/delete in the middle in O(1) once the position is known, without shifting other elements.",
    history:
      "Invented by Allen Newell, Cliff Shaw and Herbert Simon around 1955-1956 as part of the IPL (Information Processing Language) — one of the first ideas that let a program allocate structured data at runtime.",
    advantages: [
      "Dynamic size — grows and shrinks at runtime.",
      "O(1) insertion and deletion once you have a reference to the node.",
      "No wasted space from over-allocation.",
      "Efficient for implementing stacks, queues, adjacency lists and hash-table buckets.",
    ],
    disadvantages: [
      "No random access — indexing is O(n).",
      "Extra memory for each node's pointer(s).",
      "Poor cache locality vs arrays; slower iteration in practice.",
      "Reverse traversal requires a doubly linked list.",
    ],
    whenToUse: [
      "Frequent insertions/deletions in the middle of a sequence.",
      "Size unknown or highly variable at runtime.",
      "Implementing LRU caches, undo stacks, adjacency lists.",
      "When you never need random access by index.",
    ],
    whenNotToUse: [
      "You need fast index access (use an array/list).",
      "Iteration speed is critical (arrays win via cache locality).",
      "Memory is extremely tight (pointer overhead matters).",
    ],
    comparedWith: [
      {
        name: "Array / Python list",
        note: "O(1) index, O(n) insert-middle. Linked list is the opposite.",
      },
      {
        name: "Deque (collections.deque)",
        note: "A doubly linked list under the hood — use it in Python instead of hand-rolling.",
      },
      {
        name: "Stack / Queue",
        note: "Both can be implemented with a linked list for true O(1) ops.",
      },
    ],
  },

  internals: {
    summary:
      "Each node is a small heap object holding a value plus one or more pointers to other nodes. The list itself is just a reference to the head (and optionally tail). Traversal follows pointers hop-by-hop.",
    bullets: [
      "A Node = { value, next } (singly) or { value, prev, next } (doubly).",
      "The list holds head, and often tail and length, as separate fields.",
      "Allocation is per-node — Python creates a small object on the heap for every push.",
      "Deallocation happens automatically when no reference points to a node (reference counting + GC).",
      "There is no bulk memmove — inserts only rewire pointers.",
    ],
    memory: {
      kind: "linked",
      caption: "Nodes live at arbitrary heap addresses; arrows are the .next pointers.",
      notes: [
        "Head → Node(A) → Node(B) → Node(C) → None",
        "Insertion in the middle rewires two pointers, not the whole list.",
        "Losing the head reference makes the entire list unreachable → memory leak.",
      ],
    },
  },

  variants: [
    {
      slug: "singly",
      name: "Singly Linked List",
      description:
        "Each node points only to the next node. Traversal is one-way; simplest and most memory-efficient variant.",
      useCases: ["Stacks", "Hash table buckets", "Simple queues", "Adjacency lists"],
      pros: ["Minimal memory overhead", "Simple to implement"],
      cons: ["No backward traversal", "Deletion by node needs previous pointer"],
      complexity: [
        { op: "Insert head", time: "O(1)", space: "O(1)" },
        { op: "Insert tail (with tail ptr)", time: "O(1)", space: "O(1)" },
        { op: "Delete head", time: "O(1)", space: "O(1)" },
        { op: "Search", time: "O(n)", space: "O(1)" },
      ],
      python: {
        title: "Singly linked list",
        language: "python",
        code: `class Node:
    def __init__(self, value, next=None):
        self.value = value
        self.next = next

class SinglyLinkedList:
    def __init__(self):
        self.head = None
        self.size = 0

    def push_front(self, value):
        self.head = Node(value, self.head)
        self.size += 1

    def pop_front(self):
        if not self.head:
            raise IndexError("pop from empty list")
        v = self.head.value
        self.head = self.head.next
        self.size -= 1
        return v

    def __iter__(self):
        cur = self.head
        while cur:
            yield cur.value
            cur = cur.next`,
      },
    },
    {
      slug: "doubly",
      name: "Doubly Linked List",
      description:
        "Each node has prev and next pointers. Enables bidirectional traversal and O(1) deletion given a node reference.",
      useCases: ["LRU caches", "Browser history", "Text editor buffers", "Deques"],
      pros: ["Backward traversal", "O(1) delete of arbitrary node"],
      cons: ["Extra pointer per node", "More pointer bookkeeping"],
      complexity: [
        { op: "Insert head/tail", time: "O(1)", space: "O(1)" },
        { op: "Delete given node", time: "O(1)", space: "O(1)" },
        { op: "Search", time: "O(n)", space: "O(1)" },
      ],
      python: {
        title: "Doubly linked list",
        language: "python",
        code: `class DNode:
    def __init__(self, v, prev=None, nxt=None):
        self.v, self.prev, self.next = v, prev, nxt

class DoublyLinkedList:
    def __init__(self):
        self.head = self.tail = None

    def push_back(self, v):
        node = DNode(v, prev=self.tail)
        if self.tail:
            self.tail.next = node
        else:
            self.head = node
        self.tail = node

    def remove(self, node):
        if node.prev: node.prev.next = node.next
        else: self.head = node.next
        if node.next: node.next.prev = node.prev
        else: self.tail = node.prev`,
      },
    },
    {
      slug: "circular",
      name: "Circular Linked List",
      description:
        "The last node's next points back to the head instead of None. Useful when traversal should wrap around.",
      useCases: ["Round-robin scheduling", "Multiplayer turn order", "Circular buffers"],
      pros: ["Natural cyclic traversal", "Any node can be the entry point"],
      cons: ["Easy to write infinite loops", "Cycle detection needed for termination"],
      complexity: [
        { op: "Insert / delete", time: "O(1)", space: "O(1)" },
        { op: "Traverse full cycle", time: "O(n)", space: "O(1)" },
      ],
    },
    {
      slug: "circular-doubly",
      name: "Circular Doubly Linked List",
      description:
        "Combines doubly linked and circular — every node has prev and next, and the ends wrap around.",
      useCases: ["Music playlists", "Image carousels", "Undo/redo rings"],
      pros: ["Bidirectional + cyclic", "O(1) at either end of the ring"],
      cons: ["Trickiest pointer maintenance"],
    },
  ],

  operations: [
    {
      name: "Insert at beginning",
      summary: "Create a new node whose next is the current head, then move head.",
      steps: [
        "Create node = Node(value)",
        "Set node.next = head",
        "Update head = node",
        "Increment size",
      ],
      python: {
        title: "insert_head(value)",
        language: "python",
        code: `def insert_head(self, value):
    self.head = Node(value, self.head)
    self.size += 1`,
      },
      time: "O(1)",
      space: "O(1)",
      edgeCases: ["Empty list: head becomes the new node whose next is None."],
    },
    {
      name: "Insert at end",
      summary: "Walk to the last node and attach; O(1) if a tail pointer is maintained.",
      steps: [
        "If head is None → head = new node",
        "Else walk cur.next until None",
        "cur.next = new node",
      ],
      python: {
        title: "insert_tail(value)",
        language: "python",
        code: `def insert_tail(self, value):
    node = Node(value)
    if not self.head:
        self.head = node
        return
    cur = self.head
    while cur.next:
        cur = cur.next
    cur.next = node
    self.size += 1`,
      },
      time: "O(n) without tail · O(1) with tail",
      space: "O(1)",
    },
    {
      name: "Insert in middle",
      summary: "Given a position k, walk k-1 steps and splice a new node.",
      steps: [
        "Validate 0 ≤ k ≤ size",
        "Walk k-1 nodes from head",
        "new.next = cur.next; cur.next = new",
      ],
      python: {
        title: "insert_at(k, value)",
        language: "python",
        code: `def insert_at(self, k, value):
    if k == 0:
        return self.insert_head(value)
    cur = self.head
    for _ in range(k - 1):
        if cur is None: raise IndexError
        cur = cur.next
    cur.next = Node(value, cur.next)
    self.size += 1`,
      },
      time: "O(k)",
      space: "O(1)",
    },
    {
      name: "Delete",
      summary: "Find the predecessor of the target and reroute its next pointer.",
      steps: [
        "If deleting head, head = head.next",
        "Else walk to predecessor",
        "prev.next = prev.next.next",
      ],
      python: {
        title: "delete(value)",
        language: "python",
        code: `def delete(self, value):
    if not self.head: return
    if self.head.value == value:
        self.head = self.head.next
        return
    cur = self.head
    while cur.next and cur.next.value != value:
        cur = cur.next
    if cur.next:
        cur.next = cur.next.next`,
      },
      time: "O(n)",
      space: "O(1)",
      edgeCases: ["Value not found — do nothing.", "Deleting head with only one node."],
    },
    {
      name: "Search",
      summary: "Linear scan comparing each node value.",
      steps: [
        "cur = head",
        "while cur: if cur.value == target return True; cur = cur.next",
        "return False",
      ],
      python: {
        title: "contains(target)",
        language: "python",
        code: `def contains(self, target):
    cur = self.head
    while cur:
        if cur.value == target: return True
        cur = cur.next
    return False`,
      },
      time: "O(n)",
      space: "O(1)",
    },
    {
      name: "Reverse",
      summary: "Iteratively flip each next pointer using three variables.",
      steps: [
        "prev = None; cur = head",
        "While cur: nxt = cur.next; cur.next = prev; prev = cur; cur = nxt",
        "head = prev",
      ],
      python: {
        title: "reverse()",
        language: "python",
        code: `def reverse(self):
    prev, cur = None, self.head
    while cur:
        nxt = cur.next
        cur.next = prev
        prev = cur
        cur = nxt
    self.head = prev`,
      },
      time: "O(n)",
      space: "O(1)",
    },
    {
      name: "Traverse",
      summary: "Visit each node once.",
      steps: ["cur = head", "while cur: visit(cur); cur = cur.next"],
      python: {
        title: "traverse()",
        language: "python",
        code: `def traverse(self):
    cur = self.head
    while cur:
        print(cur.value)
        cur = cur.next`,
      },
      time: "O(n)",
      space: "O(1)",
    },
    {
      name: "Merge two sorted lists",
      summary: "Weave nodes into a new list in sorted order.",
      steps: [
        "Use a dummy head",
        "While both a and b: pick the smaller; advance",
        "Attach the remainder",
      ],
      python: {
        title: "merge(a, b)",
        language: "python",
        code: `def merge(a, b):
    dummy = Node(0)
    tail = dummy
    while a and b:
        if a.value <= b.value:
            tail.next, a = a, a.next
        else:
            tail.next, b = b, b.next
        tail = tail.next
    tail.next = a or b
    return dummy.next`,
      },
      time: "O(n + m)",
      space: "O(1)",
    },
  ],

  algorithms: [
    {
      slug: "reverse-linked-list",
      title: "Reverse a Linked List",
      problem: "Given head of a singly linked list, reverse it in place.",
      approach: "Iterate with three pointers (prev, cur, next) flipping cur.next each step.",
      python: {
        title: "reverseList(head)",
        language: "python",
        code: `def reverseList(head):
    prev = None
    while head:
        head.next, prev, head = prev, head, head.next
    return prev`,
      },
      time: "O(n)",
      space: "O(1)",
      pattern: "Pointer manipulation",
    },
    {
      slug: "detect-cycle",
      title: "Detect a Cycle (Floyd)",
      problem: "Return True if the linked list contains a cycle.",
      approach: "Two pointers — slow moves by 1, fast by 2. They meet iff a cycle exists.",
      python: {
        title: "hasCycle(head)",
        language: "python",
        code: `def hasCycle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow is fast: return True
    return False`,
      },
      time: "O(n)",
      space: "O(1)",
      pattern: "Fast & slow pointers",
    },
    {
      slug: "remove-loop",
      title: "Remove a Loop",
      problem: "If the list has a cycle, break it while preserving the linear part.",
      approach:
        "Detect meeting point with Floyd's, then move one pointer to head and walk both at speed 1 until they meet — that's the loop start.",
      python: {
        title: "removeLoop(head)",
        language: "python",
        code: `def removeLoop(head):
    slow = fast = head
    while fast and fast.next:
        slow, fast = slow.next, fast.next.next
        if slow is fast: break
    else:
        return
    slow = head
    while slow.next is not fast.next:
        slow, fast = slow.next, fast.next
    fast.next = None`,
      },
      time: "O(n)",
      space: "O(1)",
      pattern: "Fast & slow pointers",
    },
    {
      slug: "find-middle",
      title: "Find the Middle Node",
      problem: "Return the middle node; for even length return the second middle.",
      approach: "Slow/fast pointers — when fast hits the end, slow is at the middle.",
      python: {
        title: "middle(head)",
        language: "python",
        code: `def middle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    return slow`,
      },
      time: "O(n)",
      space: "O(1)",
      pattern: "Fast & slow pointers",
    },
    {
      slug: "merge-sort-list",
      title: "Merge Sort on a Linked List",
      problem: "Sort a linked list in O(n log n) time and O(log n) stack space.",
      approach: "Split at middle, recursively sort halves, merge them.",
      python: {
        title: "sortList(head)",
        language: "python",
        code: `def sortList(head):
    if not head or not head.next: return head
    slow, fast = head, head.next
    while fast and fast.next:
        slow, fast = slow.next, fast.next.next
    mid, slow.next = slow.next, None
    return merge(sortList(head), sortList(mid))`,
      },
      time: "O(n log n)",
      space: "O(log n)",
      pattern: "Divide & Conquer",
    },
    {
      slug: "intersection",
      title: "Intersection of Two Linked Lists",
      problem: "Find the node where two singly linked lists first intersect.",
      approach:
        "Two pointers a, b. When one reaches the end, redirect to the other list's head. They meet at the intersection (or None).",
      python: {
        title: "getIntersectionNode(a, b)",
        language: "python",
        code: `def getIntersectionNode(a, b):
    p, q = a, b
    while p is not q:
        p = p.next if p else b
        q = q.next if q else a
    return p`,
      },
      time: "O(n + m)",
      space: "O(1)",
      pattern: "Two pointers",
    },
  ],

  complexity: {
    operations: [
      { op: "Access by index", best: "O(1)", avg: "O(n)", worst: "O(n)", space: "O(1)" },
      { op: "Search", best: "O(1)", avg: "O(n)", worst: "O(n)", space: "O(1)" },
      { op: "Insert at head", best: "O(1)", avg: "O(1)", worst: "O(1)", space: "O(1)" },
      { op: "Insert at tail", best: "O(1)", avg: "O(1)", worst: "O(n)", space: "O(1)" },
      { op: "Insert in middle", best: "O(1)", avg: "O(n)", worst: "O(n)", space: "O(1)" },
      { op: "Delete head", best: "O(1)", avg: "O(1)", worst: "O(1)", space: "O(1)" },
      { op: "Delete given node (doubly)", best: "O(1)", avg: "O(1)", worst: "O(1)", space: "O(1)" },
      { op: "Reverse", best: "O(n)", avg: "O(n)", worst: "O(n)", space: "O(1)" },
    ],
    notes: [
      "Best case for search is when the target is the head; worst case is the tail or a miss.",
      "'Insert at tail' is O(1) only if the list stores a tail pointer.",
      "Total space of the list itself is O(n) — one node per element.",
    ],
  },

  applications: [
    { area: "Browsers", example: "Back / forward history as a doubly linked list." },
    {
      area: "Music players",
      example: "Playlist with previous / next track as a circular doubly list.",
    },
    { area: "Editors", example: "Undo / redo stacks implemented over linked nodes." },
    { area: "Operating systems", example: "Free memory blocks, process scheduling queues." },
    { area: "Databases", example: "LRU cache eviction using a doubly linked list + hash map." },
    { area: "Graphs", example: "Adjacency list storage." },
    { area: "Hash tables", example: "Chained collision buckets." },
  ],

  interview: {
    theory: [
      "Explain the trade-offs between arrays and linked lists.",
      "Why is a doubly linked list preferred for an LRU cache?",
      "What's the difference between a circular and a singly linked list?",
      "How does Python's collections.deque relate to linked lists?",
    ],
    coding: [
      "Reverse a linked list (iterative and recursive).",
      "Detect and remove a cycle.",
      "Merge two sorted linked lists.",
      "Add two numbers represented as linked lists.",
      "Reorder list: L0 → Ln → L1 → Ln-1 …",
      "Copy list with random pointer.",
    ],
    optimization: [
      "Merge k sorted lists in O(n log k) using a heap.",
      "Sort a linked list in O(n log n) using merge sort.",
      "Remove nth node from end in one pass.",
    ],
    edgeCase: [
      "Empty list.",
      "Single-node list.",
      "Two-node cycle.",
      "All duplicates.",
      "Self-loop at head.",
    ],
    company: [
      "Google — Copy list with random pointer.",
      "Meta — Reorder list.",
      "Amazon — LRU cache design.",
      "Microsoft — Reverse nodes in k-group.",
      "Apple — Palindrome linked list.",
    ],
  },

  faqs: [
    {
      q: "How is a linked list different from an array?",
      a: "Arrays use contiguous memory and support O(1) indexing; linked lists use pointer-connected nodes and support O(1) insertion once positioned.",
    },
    {
      q: "Why is random access O(n)?",
      a: "Because nodes aren't contiguous in memory — the only way to reach index k is to hop from the head k times.",
    },
    {
      q: "Should I ever hand-roll a linked list in Python?",
      a: "Usually no. Use collections.deque for O(1) appends at both ends. Roll your own when interviewing or when you need explicit node references.",
    },
    {
      q: "Can Python garbage collect a cyclic list?",
      a: "Yes — CPython has a cycle collector on top of reference counting. Still, avoid unnecessary cycles.",
    },
    {
      q: "How do I detect a cycle without extra space?",
      a: "Use Floyd's tortoise-and-hare: slow moves 1, fast moves 2; they meet iff there's a cycle.",
    },
    {
      q: "Why use a dummy head?",
      a: "It removes the special case for inserting/deleting at the head, simplifying pointer code.",
    },
    {
      q: "What's the space cost of a Python node object?",
      a: "Roughly 56 bytes for the object header plus attributes — much heavier than a raw C struct.",
    },
    {
      q: "When is a doubly linked list worth the overhead?",
      a: "When you need O(1) deletion of an arbitrary node given its reference (e.g. LRU cache) or bidirectional traversal.",
    },
    {
      q: "How do I reverse a linked list recursively?",
      a: "Reverse the tail, then set head.next.next = head; head.next = None.",
    },
    {
      q: "How do I find the middle in one pass?",
      a: "Slow/fast pointers — when fast reaches the end, slow is at the middle.",
    },
    {
      q: "What's a sentinel node?",
      a: "A dummy node that's always present at head/tail to remove edge cases from insert/delete code.",
    },
    {
      q: "Can I sort a linked list faster than O(n log n)?",
      a: "No comparison sort beats O(n log n); merge sort is the standard because it doesn't rely on random access.",
    },
    {
      q: "How do I merge two sorted linked lists?",
      a: "Use a dummy tail and repeatedly attach the smaller current node until one list is empty; then attach the rest.",
    },
    {
      q: "How do I remove the nth node from the end in one pass?",
      a: "Advance a fast pointer n steps, then move slow and fast together until fast hits the end; slow.next is the target.",
    },
    {
      q: "How does an LRU cache use a linked list?",
      a: "A doubly linked list holds items by recency; a hash map maps keys to nodes for O(1) access. Access moves the node to head; eviction removes the tail.",
    },
    {
      q: "What's a skip list?",
      a: "A probabilistic layered linked list that supports O(log n) search — used as a simpler alternative to balanced trees.",
    },
    {
      q: "How do I detect palindrome linked list in O(1) space?",
      a: "Find middle, reverse the second half, compare with the first half, then optionally restore.",
    },
    {
      q: "Is a Python list a linked list?",
      a: "No — CPython's list is a dynamic array. Use collections.deque for doubly linked behavior.",
    },
    {
      q: "Do linked lists suffer from cache misses?",
      a: "Yes — nodes are scattered on the heap, breaking CPU cache prefetching. Arrays are far faster to iterate.",
    },
    {
      q: "What is the tail pointer good for?",
      a: "Constant-time appends. Without it, insert-at-tail is O(n).",
    },
    {
      q: "How do I clone a list with random pointers?",
      a: "Interleave copies with originals, wire random pointers, then unweave; or use a hash map from original to clone.",
    },
    {
      q: "Can I do binary search on a linked list?",
      a: "Not efficiently — indexing is O(n), so the whole point of binary search is lost. Use a skip list or convert to array.",
    },
    {
      q: "What is a self-adjusting list?",
      a: "A list that reorders itself on access (e.g. move-to-front) to speed up common queries.",
    },
    {
      q: "How do I safely delete during iteration?",
      a: "Keep a prev pointer, or use a dummy head so head deletion is uniform.",
    },
    {
      q: "Why 'floyd' for cycle detection and not a hash set?",
      a: "Floyd's is O(1) space; hashing is O(n). Both are O(n) time.",
    },
  ],

  practice: {
    beginner: [
      {
        title: "Design Singly Linked List",
        url: "https://leetcode.com/problems/design-linked-list/",
        difficulty: "Easy",
        pattern: "Design",
        estMin: 30,
      },
      {
        title: "Reverse Linked List",
        url: "https://leetcode.com/problems/reverse-linked-list/",
        difficulty: "Easy",
        pattern: "Pointers",
        estMin: 15,
      },
      {
        title: "Merge Two Sorted Lists",
        url: "https://leetcode.com/problems/merge-two-sorted-lists/",
        difficulty: "Easy",
        pattern: "Two pointers",
        estMin: 15,
      },
      {
        title: "Middle of the Linked List",
        url: "https://leetcode.com/problems/middle-of-the-linked-list/",
        difficulty: "Easy",
        pattern: "Fast/slow",
        estMin: 10,
      },
      {
        title: "Remove Duplicates from Sorted List",
        url: "https://leetcode.com/problems/remove-duplicates-from-sorted-list/",
        difficulty: "Easy",
        pattern: "Traversal",
        estMin: 10,
      },
    ],
    intermediate: [
      {
        title: "Linked List Cycle II",
        url: "https://leetcode.com/problems/linked-list-cycle-ii/",
        difficulty: "Medium",
        pattern: "Fast/slow",
        estMin: 25,
      },
      {
        title: "Reorder List",
        url: "https://leetcode.com/problems/reorder-list/",
        difficulty: "Medium",
        pattern: "Reverse+merge",
        estMin: 25,
      },
      {
        title: "Add Two Numbers",
        url: "https://leetcode.com/problems/add-two-numbers/",
        difficulty: "Medium",
        pattern: "Simulation",
        estMin: 20,
      },
      {
        title: "Copy List with Random Pointer",
        url: "https://leetcode.com/problems/copy-list-with-random-pointer/",
        difficulty: "Medium",
        pattern: "Hash / weave",
        estMin: 30,
      },
      {
        title: "Odd Even Linked List",
        url: "https://leetcode.com/problems/odd-even-linked-list/",
        difficulty: "Medium",
        pattern: "Pointers",
        estMin: 20,
      },
      {
        title: "Sort List",
        url: "https://leetcode.com/problems/sort-list/",
        difficulty: "Medium",
        pattern: "Merge sort",
        estMin: 35,
      },
      {
        title: "Rotate List",
        url: "https://leetcode.com/problems/rotate-list/",
        difficulty: "Medium",
        pattern: "Two pointers",
        estMin: 20,
      },
    ],
    advanced: [
      {
        title: "Reverse Nodes in k-Group",
        url: "https://leetcode.com/problems/reverse-nodes-in-k-group/",
        difficulty: "Hard",
        pattern: "Reverse",
        estMin: 45,
      },
      {
        title: "Merge k Sorted Lists",
        url: "https://leetcode.com/problems/merge-k-sorted-lists/",
        difficulty: "Hard",
        pattern: "Heap",
        estMin: 40,
      },
      {
        title: "LRU Cache",
        url: "https://leetcode.com/problems/lru-cache/",
        difficulty: "Medium",
        pattern: "Hash + DLL",
        estMin: 45,
      },
      {
        title: "LFU Cache",
        url: "https://leetcode.com/problems/lfu-cache/",
        difficulty: "Hard",
        pattern: "Hash + DLL",
        estMin: 60,
      },
    ],
    interview: [
      {
        title: "Palindrome Linked List",
        url: "https://leetcode.com/problems/palindrome-linked-list/",
        difficulty: "Easy",
        pattern: "Reverse half",
        estMin: 25,
      },
      {
        title: "Intersection of Two Linked Lists",
        url: "https://leetcode.com/problems/intersection-of-two-linked-lists/",
        difficulty: "Easy",
        pattern: "Two pointers",
        estMin: 20,
      },
      {
        title: "Remove Nth Node From End",
        url: "https://leetcode.com/problems/remove-nth-node-from-end-of-list/",
        difficulty: "Medium",
        pattern: "Fast/slow",
        estMin: 15,
      },
      {
        title: "Swap Nodes in Pairs",
        url: "https://leetcode.com/problems/swap-nodes-in-pairs/",
        difficulty: "Medium",
        pattern: "Pointers",
        estMin: 20,
      },
    ],
    competitive: [
      {
        title: "Flatten a Multilevel DLL",
        url: "https://leetcode.com/problems/flatten-a-multilevel-doubly-linked-list/",
        difficulty: "Medium",
        pattern: "DFS",
        estMin: 30,
      },
      {
        title: "Split Linked List in Parts",
        url: "https://leetcode.com/problems/split-linked-list-in-parts/",
        difficulty: "Medium",
        pattern: "Math",
        estMin: 20,
      },
    ],
  },

  mistakes: [
    {
      mistake: "Forgetting to update prev.next after deleting a node.",
      fix: "Always assign prev.next = target.next before losing the reference.",
    },
    {
      mistake: "Creating a cycle when reversing (setting head.next = head).",
      fix: "Set the old head's next to None once you become the tail.",
    },
    {
      mistake: "Losing the head reference during in-place reversal.",
      fix: "Save head.next in a temp before overwriting head.next.",
    },
    {
      mistake: "Infinite loop in circular lists.",
      fix: "Terminate on `cur.next is start` rather than `cur.next is None`.",
    },
    {
      mistake: "Off-by-one in insert_at(k).",
      fix: "Walk k-1 steps to reach the predecessor, not k.",
    },
    {
      mistake: "Not handling empty list in every method.",
      fix: "Guard `if not self.head:` at the top of pop/delete/find.",
    },
  ],

  quiz: [
    {
      q: "What is the worst-case time to access the k-th element of a singly linked list?",
      choices: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
      answer: 2,
      explain: "You must hop from the head k times — linear in the position.",
    },
    {
      q: "Which pointers do you need to delete an arbitrary node in O(1) in a doubly linked list?",
      choices: ["The head only", "The node itself", "prev and next", "size and tail"],
      answer: 1,
      explain:
        "With the node in hand you can rewire node.prev.next and node.next.prev — no traversal needed.",
    },
    {
      q: "In Floyd's cycle detection, how many steps does fast move per iteration?",
      choices: ["1", "2", "log n", "n"],
      answer: 1,
      explain: "Slow moves 1, fast moves 2 — they meet iff a cycle exists.",
    },
    {
      q: "Which Python built-in is essentially a doubly linked list?",
      choices: ["list", "tuple", "collections.deque", "queue.SimpleQueue"],
      answer: 2,
      explain: "collections.deque supports O(1) appends and pops from both ends.",
    },
    {
      q: "Which of these is NOT a valid reason to prefer a linked list over an array?",
      choices: [
        "You need frequent middle insertions.",
        "You want O(1) random access.",
        "The size varies dramatically at runtime.",
        "You need constant-time splicing of two sequences.",
      ],
      answer: 1,
      explain: "Arrays give O(1) random access; linked lists don't.",
    },
    {
      q: "The middle of a linked list can be found using…",
      choices: ["Binary search", "Fast and slow pointers", "Divide and conquer", "Hashing"],
      answer: 1,
      explain: "Fast moves twice as fast as slow; when fast ends, slow is at the middle.",
    },
    {
      q: "What is the space complexity of iterative reversal?",
      choices: ["O(1)", "O(log n)", "O(n)", "O(n^2)"],
      answer: 0,
      explain: "Only three pointer variables are needed regardless of list length.",
    },
    {
      q: "Which structure is typically used to build an LRU cache with O(1) get/put?",
      choices: ["Array + heap", "Hash map + doubly linked list", "BST + queue", "Trie + set"],
      answer: 1,
      explain: "The map gives O(1) lookup, the DLL gives O(1) move-to-front and eviction.",
    },
  ],

  references: [
    {
      label: "Python collections.deque docs",
      url: "https://docs.python.org/3/library/collections.html#collections.deque",
      kind: "docs",
    },
    {
      label: "GeeksforGeeks — Linked List",
      url: "https://www.geeksforgeeks.org/data-structures/linked-list/",
      kind: "article",
    },
    {
      label: "Programiz — Linked List in Python",
      url: "https://www.programiz.com/dsa/linked-list",
      kind: "article",
    },
    {
      label: "Real Python — Linked Lists",
      url: "https://realpython.com/linked-lists-python/",
      kind: "article",
    },
    { label: "NeetCode — Linked List playlist", url: "https://neetcode.io/roadmap", kind: "video" },
    { label: "VisuAlgo — Linked List", url: "https://visualgo.net/en/list", kind: "visualization" },
    {
      label: "LeetCode — Linked List tag",
      url: "https://leetcode.com/tag/linked-list/",
      kind: "practice",
    },
    {
      label: "HackerRank — Linked Lists",
      url: "https://www.hackerrank.com/domains/data-structures?filters%5Bsubdomains%5D%5B%5D=linked-lists",
      kind: "practice",
    },
    {
      label: "CLRS — Introduction to Algorithms (Ch. 10)",
      url: "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/",
      kind: "book",
    },
  ],

  revision: {
    quickNotes: [
      "A node holds a value + pointer(s).",
      "Head is the entry point; tail speeds up appends.",
      "Insertion is O(1) once positioned; access is O(n).",
      "Doubly linked lists enable O(1) delete-by-node.",
      "Use Floyd's for cycle detection in O(1) space.",
      "Prefer collections.deque in real Python code.",
    ],
    cheatSheet: [
      { label: "Access k-th", value: "O(n)" },
      { label: "Insert head", value: "O(1)" },
      { label: "Insert tail", value: "O(1)*" },
      { label: "Delete head", value: "O(1)" },
      { label: "Delete node (DLL)", value: "O(1)" },
      { label: "Search", value: "O(n)" },
      { label: "Reverse", value: "O(n)" },
      { label: "Merge two sorted", value: "O(n + m)" },
      { label: "Detect cycle", value: "O(n) time, O(1) space" },
    ],
    interviewTips: [
      "Draw the pointer diagram before coding.",
      "Always consider empty and single-node cases first.",
      "Use a dummy head to unify head and non-head cases.",
      "State time and space complexity out loud.",
      "Verify with a two-node cycle and an odd-length list.",
    ],
    memoryTricks: [
      "'Prev, cur, next' — the reversal mantra.",
      "'Tortoise and hare' — cycle detection.",
      "'Dummy first, real later' — simpler splicing.",
    ],
  },
};
