import type { ModuleQA } from "./types";

export const linkedListsQA: ModuleQA = {
  moduleSlug: "linked-lists",
  moduleTitle: "Linked Lists",
  faqPath: "/linked-lists/faq",
  interviewPath: "/linked-lists/interview",
  faqs: [
    // ── Concepts ─────────────────────────────────────────────────────────
    {
      category: "Concepts",
      q: "What is a linked list and how is it different from an array?",
      answer: [
        "A linked list is a linear collection of nodes stored non-contiguously in memory. Each node holds a value and one (or more) pointers to other nodes. The list is identified by a single reference — the `head`.",
        "Arrays are laid out contiguously so any index costs O(1), but insertion/deletion in the middle costs O(n) because everything shifts. Linked lists give up random access (O(n) to reach index k) in exchange for O(1) insertion/deletion when you already hold a pointer to the node.",
      ],
      code: `class Node:\n    def __init__(self, value, nxt=None):\n        self.value = value\n        self.next  = nxt\n\nhead = Node(10, Node(20, Node(30)))`,
      didYouKnow:
        "Python's built-in `list` is a dynamic array — the language does not ship a linked-list primitive. `collections.deque` is a doubly-linked block list underneath.",
      related: [
        {
          label: "Foundations · Array vs Linked List",
          to: "/linked-lists/foundations/array-vs-list",
        },
        { label: "Introduction", to: "/linked-lists/foundations/introduction" },
      ],
    },
    {
      category: "Concepts",
      q: "Why would I choose a linked list over a Python list?",
      answer: [
        "Pick a linked list when the workload is dominated by insertions or deletions at the front (or at a known node) and you rarely need random access. Classic examples: a task queue processed FIFO, an LRU cache, an undo history, adjacency lists in a graph.",
        "Skip a linked list when you need cache-friendly iteration, random indexing, or slicing — a Python list wins on every one of those. Nodes scattered across the heap defeat CPU caching, which is why even algorithms with the same Big-O run slower on linked lists in practice.",
      ],
      time: "insert-at-head O(1) · access index k O(k)",
      mistake:
        "Reaching for a linked list because it 'sounds efficient' — most application code is faster on a plain Python list.",
      related: [
        { label: "Foundations · When to use", to: "/linked-lists/foundations/when-to-use" },
      ],
    },
    {
      category: "Concepts",
      q: "What are the different types of linked lists?",
      answer: [
        "Four variants show up in interviews and real code:",
        "• Singly — one `next` pointer per node; smallest memory footprint.",
        "• Doubly — `next` and `prev`; O(1) delete when you hold the node, O(1) backward traversal.",
        "• Circular — the tail's `next` loops back to head; useful for round-robin schedulers.",
        "• Circular Doubly — both circular and doubly linked; the shape used by `collections.deque` blocks and many LRU caches.",
      ],
      related: [
        { label: "Foundations · Variant comparison", to: "/linked-lists/foundations/comparison" },
        { label: "Singly Linked List", to: "/linked-lists/singly/introduction" },
        { label: "Doubly Linked List", to: "/linked-lists/doubly/introduction" },
      ],
    },
    {
      category: "Concepts",
      q: "What is the head, and why do we need it?",
      answer: [
        "The head is the only reference the caller keeps. Every traversal starts there and walks `head → head.next → …` until reaching `None` (or looping back to head in a circular list).",
        "Losing the head reference is equivalent to leaking the entire list — Python's garbage collector will free every node because nothing is reachable anymore.",
      ],
      mistake:
        "Assigning `head = head.next` before checking whether the new head is what you meant — you have effectively deleted the first node.",
    },
    {
      category: "Concepts",
      q: "Is a linked list faster than an array?",
      answer: [
        "In Big-O terms, some operations are asymptotically better on a linked list — head insertion is O(1) vs O(n) for an array's `insert(0, x)`. But in wall-clock time on modern CPUs, arrays usually win because contiguous memory hits the CPU cache and pointer chasing does not.",
        "Rule of thumb: linked lists shine when you truly need O(1) splice/delete at known positions; arrays win almost everywhere else.",
      ],
      didYouKnow:
        "A single L1 cache miss can cost 100–300 cycles — more than the entire cost of a small array operation.",
    },

    // ── Memory ───────────────────────────────────────────────────────────
    {
      category: "Memory",
      q: "How much extra memory does a node use?",
      answer: [
        "In CPython each node is a `PyObject` with its own header (~16 bytes), plus one `PyObject*` per field. A singly-linked node with a value + `next` ends up around 48–56 bytes; a doubly-linked node with `prev` too is around 56–64 bytes.",
        "For n integers that's roughly 8× the memory of an equivalent NumPy array. Never use a Python-implemented linked list to store millions of numbers — use `numpy` or `array.array` instead.",
      ],
      code: `import sys\nclass N:\n    __slots__ = ('v', 'next')\n    def __init__(self, v): self.v, self.next = v, None\nprint(sys.getsizeof(N(0)))  # ~48 bytes with __slots__`,
      didYouKnow:
        "Adding `__slots__` shaves ~40 % off node size by removing the per-instance `__dict__`.",
    },
    {
      category: "Memory",
      q: "Where are the nodes stored in memory?",
      answer: [
        "Every `Node` is a separate object on the CPython heap. Their addresses are arbitrary — two adjacent nodes in a list can be far apart in memory.",
        "That scattering is what makes linked-list iteration slower per element than array iteration, even though both are Θ(n).",
      ],
      related: [
        { label: "Foundations · Memory model", to: "/linked-lists/foundations/memory-model" },
      ],
    },
    {
      category: "Memory",
      q: "What happens to a node after it is 'deleted'?",
      answer: [
        "Deletion in a linked list is really 'unlink': you point the previous node's `next` past the doomed node. Once nothing references the node anymore, CPython's reference-counted GC frees its memory automatically.",
        "You do not need to `del node`. But if the node was part of a cycle (circular list) you must also break the cycle, otherwise reference counting alone cannot reclaim it — Python's cyclic GC will eventually catch it.",
      ],
      mistake:
        "Forgetting to clear the deleted node's own `next` — leaves a dangling pointer that can revive freed nodes if you keep an external reference.",
    },

    // ── Operations ───────────────────────────────────────────────────────
    {
      category: "Operations",
      q: "How do I insert a node at the head, tail, or middle?",
      answer: [
        "Insert at head is always O(1) — allocate a new node, point its `next` to the current head, then move `head`.",
        "Insert at tail is O(1) only if you cache a tail pointer. Without one, you must walk from head → O(n).",
        "Insert after a known node is O(1) — the classic `new.next = cur.next; cur.next = new` two-liner.",
      ],
      code: `def push_front(head, v):\n    return Node(v, head)\n\ndef insert_after(node, v):\n    node.next = Node(v, node.next)`,
      time: "head O(1) · tail O(1) with tail cache, O(n) without · after-node O(1)",
      related: [{ label: "Singly · Insertion", to: "/linked-lists/singly/insertion" }],
    },
    {
      category: "Operations",
      q: "How do I delete a specific node from a linked list?",
      answer: [
        "If you have the previous node: `prev.next = target.next`. O(1).",
        "If you only have the target (singly-linked) and it is NOT the tail: overwrite its value with `target.next.value` and unlink `target.next`. Also O(1). This is the classic 'delete without prev' trick.",
        "In a doubly linked list you can always unlink in O(1): `node.prev.next = node.next` and `node.next.prev = node.prev`.",
      ],
      code: `def delete_node(node):\n    # Given only the target in a singly LL (not tail):\n    node.value = node.next.value\n    node.next  = node.next.next`,
      related: [
        { label: "Singly · Deletion", to: "/linked-lists/singly/deletion" },
        { label: "Doubly · Deletion", to: "/linked-lists/doubly/deletion" },
      ],
    },
    {
      category: "Operations",
      q: "How do I reverse a linked list?",
      answer: [
        "Walk the list with three pointers — `prev`, `cur`, `nxt`. At every step, remember `cur.next`, flip it to point at `prev`, then advance. At the end `prev` is the new head.",
        "The recursive version reverses the rest of the list first, then rewires the current pair. Watch out — recursion costs O(n) stack space and can blow up on long lists.",
      ],
      code: `def reverse(head):\n    prev, cur = None, head\n    while cur:\n        cur.next, prev, cur = prev, cur, cur.next\n    return prev`,
      time: "O(n)",
      space: "O(1) iterative · O(n) recursive",
      related: [{ label: "Singly · Reverse", to: "/linked-lists/singly/reverse" }],
    },
    {
      category: "Operations",
      q: "How do I find the middle node in one pass?",
      answer: [
        "The slow / fast pointer trick. Move `slow` one step and `fast` two steps at a time. When `fast` reaches the end, `slow` is at the middle. For even-length lists `slow` lands on the second middle — biasing right is usually preferred by interviewers.",
      ],
      code: `def middle(head):\n    slow = fast = head\n    while fast and fast.next:\n        slow, fast = slow.next, fast.next.next\n    return slow`,
      time: "O(n)",
      space: "O(1)",
    },
    {
      category: "Operations",
      q: "How do I merge two sorted linked lists?",
      answer: [
        "Use a dummy head and one pointer `tail`. Repeatedly attach the smaller of the two head values to `tail.next`, advance that list, then advance `tail`. When one list runs out, attach whatever remains of the other.",
        "The dummy-head pattern eliminates the special case of an empty result.",
      ],
      code: `def merge(a, b):\n    dummy = tail = Node(0)\n    while a and b:\n        if a.value <= b.value:\n            tail.next, a = a, a.next\n        else:\n            tail.next, b = b, b.next\n        tail = tail.next\n    tail.next = a or b\n    return dummy.next`,
      time: "O(n + m)",
      space: "O(1)",
      related: [{ label: "Singly · Merge two sorted lists", to: "/linked-lists/singly/merge" }],
    },

    // ── Design ───────────────────────────────────────────────────────────
    {
      category: "Design",
      q: "Why not always use a doubly linked list?",
      answer: [
        "Every doubly-linked node pays for one extra pointer per node — that is 8 more bytes on 64-bit CPython — and every insertion / deletion must update two neighbours instead of one.",
        "You only get the O(1) delete-by-node super-power if you already hold the node. If you always start from the head to find the target, singly is just as fast in Big-O.",
      ],
    },
    {
      category: "Design",
      q: "When should I use a circular linked list?",
      answer: [
        "Anywhere the data itself is a ring: round-robin CPU scheduling, media playlists on repeat, ring buffers, the Josephus problem. Circular lists remove the special-case for wrapping.",
        "Downside: every traversal now needs a stop condition (`cur is head`) — a plain `while cur` loops forever.",
      ],
      related: [{ label: "Circular Linked List", to: "/linked-lists/circular/introduction" }],
    },
    {
      category: "Design",
      q: "How do I get the length of a linked list?",
      answer: [
        "Walking from head to tail is O(n). If you need O(1) length, wrap the list in a class and update a `size` counter on every insert and delete — the same trick `collections.deque` uses.",
      ],
      code: `class LinkedList:\n    def __init__(self):\n        self.head, self.size = None, 0\n    def push_front(self, v):\n        self.head = Node(v, self.head); self.size += 1`,
    },

    // ── Practical ────────────────────────────────────────────────────────
    {
      category: "Practical",
      q: "How do I detect a cycle in a linked list?",
      answer: [
        "Floyd's tortoise-and-hare: `slow` moves one step, `fast` moves two. If they ever meet, there is a cycle. If `fast` reaches None, the list is acyclic.",
        "To find the node where the cycle begins, reset `slow` to head after they meet and advance both by one — they meet again at the cycle entry.",
      ],
      code: `def has_cycle(head):\n    slow = fast = head\n    while fast and fast.next:\n        slow, fast = slow.next, fast.next.next\n        if slow is fast:\n            return True\n    return False`,
      time: "O(n)",
      space: "O(1)",
      related: [{ label: "Related interview: Cycle II", to: "/linked-lists/interview" }],
    },
    {
      category: "Practical",
      q: "How do I remove the middle element from a linked list?",
      answer: [
        "Use two pointers to find the middle, but keep a `prev` behind `slow` so you can unlink in O(1). Special-case: single-node list becomes empty.",
      ],
      code: `def delete_middle(head):\n    if not head or not head.next: return None\n    slow, fast, prev = head, head, None\n    while fast and fast.next:\n        prev, slow = slow, slow.next\n        fast = fast.next.next\n    prev.next = slow.next\n    return head`,
      time: "O(n)",
      space: "O(1)",
      related: [{ label: "Interview · Remove middle", to: "/linked-lists/interview" }],
    },
    {
      category: "Practical",
      q: "Are recursive linked-list solutions safe in Python?",
      answer: [
        "Python's default recursion limit is 1000 frames — a recursive reverse or merge on a 10 000-node list will raise `RecursionError`.",
        "Prefer iterative versions in production. Only use recursion for lists you know are small, or bump the limit explicitly with `sys.setrecursionlimit`.",
      ],
      mistake:
        "Submitting a recursive LeetCode solution that passes the sample tests but fails the hidden test with 50 000 nodes.",
    },
    {
      category: "Practical",
      q: "How is a linked list garbage-collected in Python?",
      answer: [
        "CPython uses reference counting. When you overwrite `head`, the old first node's refcount drops to zero and it is freed — which drops the second node's refcount, and so on. The entire chain is reclaimed in a cascade.",
        "The exception is a cycle: refcounts never reach zero, so the generational cyclic GC eventually collects them. Explicitly breaking the cycle (`tail.next = None`) is faster and more predictable.",
      ],
    },
  ],

  interview: [
    // ── Beginner · Theory / Conceptual ───────────────────────────────────
    {
      id: "ll-i-1",
      title: "Explain how a linked list is stored in memory",
      category: "Theory",
      difficulty: "Beginner",
      estMin: 5,
      tags: ["memory", "fundamentals"],
      explanation: [
        "Every node is an independent object on the heap. Its address is arbitrary — the OS/allocator decides. What links them is the `next` pointer inside each node.",
        "Contrast with an array, whose elements are contiguous, meaning index k lives at `base + k * elemSize` — the reason arrays get O(1) random access.",
      ],
      relatedLessons: [
        { label: "Foundations · Memory model", to: "/linked-lists/foundations/memory-model" },
      ],
    },
    {
      id: "ll-i-2",
      title: "Array vs Linked List — when to use which?",
      category: "Conceptual",
      difficulty: "Beginner",
      estMin: 5,
      tags: ["comparison"],
      explanation: [
        "Arrays: O(1) random access, cache-friendly, but O(n) insertion/deletion in the middle.",
        "Linked lists: O(1) insertion/deletion at head or at a known node, but O(n) to reach index k and poor cache behaviour.",
        "Pick a linked list when the workload is push/pop-heavy at the ends, or when you need to splice sub-sequences quickly. Otherwise reach for an array.",
      ],
      relatedLessons: [
        {
          label: "Foundations · Array vs Linked List",
          to: "/linked-lists/foundations/array-vs-list",
        },
      ],
    },
    {
      id: "ll-i-3",
      title: "What is the difference between singly and doubly linked lists?",
      category: "Theory",
      difficulty: "Beginner",
      estMin: 4,
      tags: ["variants"],
      explanation: [
        "Singly: each node has only `next`. Cheapest per node; backward traversal impossible without reversing.",
        "Doubly: each node has `next` and `prev`. Costs one extra pointer per node but supports O(1) delete-by-node and O(1) backward walking.",
      ],
      relatedLessons: [{ label: "Variant comparison", to: "/linked-lists/foundations/comparison" }],
    },
    {
      id: "ll-i-4",
      title: "What happens if you lose the head pointer?",
      category: "Edge Case",
      difficulty: "Beginner",
      estMin: 3,
      tags: ["safety"],
      explanation: [
        "The list becomes unreachable. Python's garbage collector will reclaim every node whose refcount drops to zero.",
        "That is why every linked-list method should either return the (possibly new) head or store it in a wrapper class field.",
      ],
    },

    // ── Intermediate · Coding ────────────────────────────────────────────
    {
      id: "ll-i-5",
      title: "Reverse a singly linked list (iterative and recursive)",
      category: "Coding",
      difficulty: "Intermediate",
      estMin: 15,
      tags: ["must-do", "pointers"],
      explanation: [
        "Iterative: three-pointer walk. Save `nxt`, flip `cur.next` to `prev`, advance both.",
        "Recursive: reverse `head.next`, then set `head.next.next = head` and `head.next = None`.",
      ],
      code: `def reverse_iter(head):\n    prev, cur = None, head\n    while cur:\n        cur.next, prev, cur = prev, cur, cur.next\n    return prev\n\ndef reverse_rec(head):\n    if not head or not head.next: return head\n    new_head = reverse_rec(head.next)\n    head.next.next = head\n    head.next = None\n    return new_head`,
      time: "O(n)",
      space: "O(1) iter · O(n) rec",
      leetcode: {
        title: "206 · Reverse Linked List",
        url: "https://leetcode.com/problems/reverse-linked-list/",
        difficulty: "Easy",
      },
      relatedLessons: [{ label: "Singly · Reverse", to: "/linked-lists/singly/reverse" }],
    },
    {
      id: "ll-i-6",
      title: "Delete a specific node given only that node",
      category: "Coding",
      difficulty: "Intermediate",
      estMin: 10,
      tags: ["trick"],
      explanation: [
        "You do not have `prev`, so you cannot unlink the node itself. Instead, copy the next node's value into the current node and unlink `node.next`.",
        "Assumption: the given node is not the tail. Interviewers usually specify this.",
      ],
      code: `def delete_node(node):\n    node.value = node.next.value\n    node.next  = node.next.next`,
      time: "O(1)",
      space: "O(1)",
      leetcode: {
        title: "237 · Delete Node in a Linked List",
        url: "https://leetcode.com/problems/delete-node-in-a-linked-list/",
        difficulty: "Medium",
      },
      relatedLessons: [{ label: "Singly · Deletion", to: "/linked-lists/singly/deletion" }],
    },
    {
      id: "ll-i-7",
      title: "Merge two sorted linked lists",
      category: "Coding",
      difficulty: "Intermediate",
      estMin: 15,
      tags: ["merge", "two-pointer"],
      explanation: [
        "Use a dummy head. Splice the smaller head each iteration; when one list runs out, attach the remaining tail.",
      ],
      code: `def merge_two(a, b):\n    dummy = tail = Node(0)\n    while a and b:\n        if a.value <= b.value:\n            tail.next, a = a, a.next\n        else:\n            tail.next, b = b, b.next\n        tail = tail.next\n    tail.next = a or b\n    return dummy.next`,
      time: "O(n + m)",
      space: "O(1)",
      leetcode: {
        title: "21 · Merge Two Sorted Lists",
        url: "https://leetcode.com/problems/merge-two-sorted-lists/",
        difficulty: "Easy",
      },
      relatedLessons: [{ label: "Singly · Merge", to: "/linked-lists/singly/merge" }],
    },
    {
      id: "ll-i-8",
      title: "Remove the N-th node from the end",
      category: "Coding",
      difficulty: "Intermediate",
      estMin: 15,
      tags: ["two-pointer"],
      explanation: [
        "Advance `fast` n steps first, then move `slow` and `fast` together until `fast.next` is None — `slow` is now at the predecessor of the target.",
        "Use a dummy head so removing the very first node has no special case.",
      ],
      code: `def remove_nth_from_end(head, n):\n    dummy = Node(0, head)\n    slow = fast = dummy\n    for _ in range(n): fast = fast.next\n    while fast.next:\n        slow, fast = slow.next, fast.next\n    slow.next = slow.next.next\n    return dummy.next`,
      time: "O(n)",
      space: "O(1)",
      leetcode: {
        title: "19 · Remove Nth Node From End",
        url: "https://leetcode.com/problems/remove-nth-node-from-end-of-list/",
        difficulty: "Medium",
      },
      relatedAlgorithm: "two-pointers",
    },
    {
      id: "ll-i-9",
      title: "Remove the middle element of a linked list",
      category: "Coding",
      difficulty: "Intermediate",
      estMin: 15,
      tags: ["slow-fast"],
      explanation: [
        "Slow-fast pointers to find middle; keep a `prev` behind `slow` so you can unlink in O(1). Handle the single-node case explicitly.",
      ],
      code: `def delete_middle(head):\n    if not head or not head.next: return None\n    slow, fast, prev = head, head, None\n    while fast and fast.next:\n        prev, slow = slow, slow.next\n        fast = fast.next.next\n    prev.next = slow.next\n    return head`,
      time: "O(n)",
      space: "O(1)",
      leetcode: {
        title: "2095 · Delete the Middle Node",
        url: "https://leetcode.com/problems/delete-the-middle-node-of-a-linked-list/",
        difficulty: "Medium",
      },
    },
    {
      id: "ll-i-10",
      title: "Detect and find the start of a cycle",
      category: "Coding",
      difficulty: "Intermediate",
      estMin: 20,
      tags: ["floyd", "must-do"],
      explanation: [
        "Floyd's algorithm: `slow`/`fast` meet inside the cycle. Reset one pointer to head and advance both by one — they meet at the entry.",
      ],
      code: `def detect_cycle(head):\n    slow = fast = head\n    while fast and fast.next:\n        slow, fast = slow.next, fast.next.next\n        if slow is fast:\n            slow = head\n            while slow is not fast:\n                slow, fast = slow.next, fast.next\n            return slow\n    return None`,
      time: "O(n)",
      space: "O(1)",
      leetcode: {
        title: "142 · Linked List Cycle II",
        url: "https://leetcode.com/problems/linked-list-cycle-ii/",
        difficulty: "Medium",
      },
    },
    {
      id: "ll-i-11",
      title: "Check if a linked list is a palindrome",
      category: "Coding",
      difficulty: "Intermediate",
      estMin: 20,
      tags: ["reverse", "two-pointer"],
      explanation: [
        "Find the middle with slow/fast, reverse the second half in place, then compare with the first half node by node.",
        "Restore the reversed half before returning to keep the input intact (interviewers often ask for this follow-up).",
      ],
      code: `def is_palindrome(head):\n    slow = fast = head\n    while fast and fast.next:\n        slow, fast = slow.next, fast.next.next\n    prev, cur = None, slow\n    while cur:\n        cur.next, prev, cur = prev, cur, cur.next\n    left, right = head, prev\n    while right:\n        if left.value != right.value: return False\n        left, right = left.next, right.next\n    return True`,
      time: "O(n)",
      space: "O(1)",
      leetcode: {
        title: "234 · Palindrome Linked List",
        url: "https://leetcode.com/problems/palindrome-linked-list/",
        difficulty: "Easy",
      },
    },

    // ── Advanced · Optimization / Edge cases ─────────────────────────────
    {
      id: "ll-i-12",
      title: "Merge k sorted linked lists",
      category: "Optimization",
      difficulty: "Advanced",
      estMin: 30,
      tags: ["heap", "divide-conquer"],
      explanation: [
        "Two clean approaches:",
        "• Min-heap of the k current heads → O(n log k).",
        "• Divide and conquer: pairwise merge k → k/2 → k/4 … → 1 → also O(n log k) but no heap overhead.",
      ],
      code: `import heapq\ndef merge_k(lists):\n    heap = []\n    for i, node in enumerate(lists):\n        if node: heapq.heappush(heap, (node.value, i, node))\n    dummy = tail = Node(0)\n    while heap:\n        _, i, node = heapq.heappop(heap)\n        tail.next = node; tail = node\n        if node.next: heapq.heappush(heap, (node.next.value, i, node.next))\n    return dummy.next`,
      time: "O(n log k)",
      space: "O(k)",
      leetcode: {
        title: "23 · Merge k Sorted Lists",
        url: "https://leetcode.com/problems/merge-k-sorted-lists/",
        difficulty: "Hard",
      },
      relatedAlgorithm: "heap",
    },
    {
      id: "ll-i-13",
      title: "Reverse nodes in k-group",
      category: "Optimization",
      difficulty: "Advanced",
      estMin: 30,
      tags: ["segment-reverse"],
      explanation: [
        "Break the list into blocks of length k. For each block, reverse in place and reconnect to the previous block's tail. If fewer than k nodes remain, leave that block alone.",
      ],
      code: `def reverse_k_group(head, k):\n    dummy = group_prev = Node(0, head)\n    while True:\n        kth = group_prev\n        for _ in range(k):\n            kth = kth.next\n            if not kth: return dummy.next\n        group_next = kth.next\n        prev, cur = group_next, group_prev.next\n        while cur is not group_next:\n            cur.next, prev, cur = prev, cur, cur.next\n        tmp = group_prev.next\n        group_prev.next = kth\n        group_prev = tmp`,
      time: "O(n)",
      space: "O(1)",
      leetcode: {
        title: "25 · Reverse Nodes in k-Group",
        url: "https://leetcode.com/problems/reverse-nodes-in-k-group/",
        difficulty: "Hard",
      },
    },
    {
      id: "ll-i-14",
      title: "Copy a linked list with random pointers",
      category: "Optimization",
      difficulty: "Advanced",
      estMin: 30,
      tags: ["hash", "in-place"],
      explanation: [
        "Interleave copies inline: after each original node, splice its clone. Then wire the clones' `random` from their neighbours' `random.next`. Finally, unweave the two lists.",
        "Runs in O(n) time with O(1) extra space (vs the classic hash-map solution, which uses O(n)).",
      ],
      time: "O(n)",
      space: "O(1)",
      leetcode: {
        title: "138 · Copy List with Random Pointer",
        url: "https://leetcode.com/problems/copy-list-with-random-pointer/",
        difficulty: "Medium",
      },
    },

    // ── FAANG · multi-step ───────────────────────────────────────────────
    {
      id: "ll-i-15",
      title: "Design an LRU Cache",
      category: "Company",
      difficulty: "FAANG",
      estMin: 45,
      tags: ["design", "hash + DLL"],
      explanation: [
        "Combine a hash map (key → node) with a doubly linked list ordered by recency. On get: look up the node and move it to the front. On put: insert at front; if full, evict the tail.",
        "Both operations end up O(1) because every step is either a hash lookup or an O(1) DLL splice.",
      ],
      code: `class Node:\n    def __init__(self, k, v): self.k, self.v, self.prev, self.next = k, v, None, None\nclass LRU:\n    def __init__(self, cap):\n        self.cap = cap; self.m = {}\n        self.head, self.tail = Node(0,0), Node(0,0)\n        self.head.next, self.tail.prev = self.tail, self.head\n    def _add(self, n):\n        n.prev, n.next = self.head, self.head.next\n        self.head.next.prev = n; self.head.next = n\n    def _rm(self, n):\n        n.prev.next, n.next.prev = n.next, n.prev\n    def get(self, k):\n        if k not in self.m: return -1\n        n = self.m[k]; self._rm(n); self._add(n); return n.v\n    def put(self, k, v):\n        if k in self.m: self._rm(self.m[k])\n        n = Node(k, v); self.m[k] = n; self._add(n)\n        if len(self.m) > self.cap:\n            lru = self.tail.prev; self._rm(lru); del self.m[lru.k]`,
      time: "O(1) per op",
      space: "O(capacity)",
      leetcode: {
        title: "146 · LRU Cache",
        url: "https://leetcode.com/problems/lru-cache/",
        difficulty: "Medium",
      },
      followUp: "Extend to LFU (LeetCode 460) — you now need a frequency dimension too.",
    },
    {
      id: "ll-i-16",
      title: "Add two numbers represented as linked lists",
      category: "Coding",
      difficulty: "Intermediate",
      estMin: 20,
      tags: ["carry"],
      explanation: [
        "Walk both lists in lock-step, tracking the carry. Allocate a new node for every digit of the sum. Do not forget a trailing carry node when the final sum overflows.",
      ],
      code: `def add_two_numbers(a, b):\n    dummy = tail = Node(0); carry = 0\n    while a or b or carry:\n        s = carry + (a.value if a else 0) + (b.value if b else 0)\n        carry, d = divmod(s, 10)\n        tail.next = Node(d); tail = tail.next\n        a = a.next if a else None\n        b = b.next if b else None\n    return dummy.next`,
      time: "O(max(n, m))",
      space: "O(max(n, m))",
      leetcode: {
        title: "2 · Add Two Numbers",
        url: "https://leetcode.com/problems/add-two-numbers/",
        difficulty: "Medium",
      },
    },
    {
      id: "ll-i-17",
      title: "Reorder list: L0 → Ln → L1 → Ln-1 → …",
      category: "Company",
      difficulty: "FAANG",
      estMin: 30,
      tags: ["split", "reverse", "merge"],
      explanation: [
        "Three-step recipe: find middle → reverse second half → interleave the two halves. Every step is a canonical linked-list operation you should have memorised.",
      ],
      leetcode: {
        title: "143 · Reorder List",
        url: "https://leetcode.com/problems/reorder-list/",
        difficulty: "Medium",
      },
    },

    // ── Follow-ups & Edge cases ──────────────────────────────────────────
    {
      id: "ll-i-18",
      title: "Follow-up: reverse in-place without extra space, then in one pass?",
      category: "Follow-up",
      difficulty: "Advanced",
      estMin: 15,
      tags: ["reverse"],
      explanation: [
        "Iterative reverse already achieves both: single pass over n nodes, O(1) extra space. The interviewer is probably pushing you to state those bounds explicitly and defend them.",
      ],
      followUp:
        "Can you reverse only nodes between positions m and n? (LeetCode 92 · Reverse Linked List II)",
    },
    {
      id: "ll-i-19",
      title: "Edge case: empty list, single node, two nodes",
      category: "Edge Case",
      difficulty: "Beginner",
      estMin: 5,
      tags: ["edge"],
      explanation: [
        "Every linked-list function should behave correctly for `head is None`, a single-node list, and a two-node list. These are the three inputs interviewers dry-run first.",
        "The dummy-head trick usually eliminates the empty-list special case for free.",
      ],
    },
    {
      id: "ll-i-20",
      title: "Follow-up: intersection of two singly linked lists",
      category: "Follow-up",
      difficulty: "Intermediate",
      estMin: 15,
      tags: ["two-pointer"],
      explanation: [
        "Two pointers `a` and `b` start at each head. When either reaches the end, restart it at the other list's head. They meet at the intersection node — or both reach None if there is none.",
        "Elegant O(n + m) time, O(1) space — no length calculation needed.",
      ],
      leetcode: {
        title: "160 · Intersection of Two Linked Lists",
        url: "https://leetcode.com/problems/intersection-of-two-linked-lists/",
        difficulty: "Easy",
      },
    },
  ],
};
