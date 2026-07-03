// Revision tier for the Linked Lists course. Wrap-up lessons that
// summarize learnings from Foundations + all four variants. Rendered
// through the same LLSection pipeline.

import type { LLLesson } from "@/lib/linked-lists-content";

export const LL_REVISION: LLLesson[] = [
  {
    slug: "common-mistakes",
    title: "Common Mistakes",
    eyebrow: "Revision · 1",
    description: "The bugs every beginner hits — internalize them so you never ship one.",
    difficulty: "Intermediate",
    readMinutes: 5,
    sections: [
      { type: "mistakes", items: [
        "Forgetting to update `head` after inserting at or deleting from the front.",
        "Losing the reference to the next node before reassigning `.next` during reverse.",
        "Comparing nodes by value instead of by identity (`is`) when detecting cycles.",
        "Iterating past the tail on a circular list — no None means you loop forever.",
        "Assigning `b = a` and expecting `a` to stay unchanged when you mutate `b`.",
        "Skipping the previous pointer update on a doubly linked list — leaves dangling `.prev`.",
        "Assuming `len()` on a linked list is O(1) — it's O(n) unless you cache size.",
      ]},
    ],
  },
  {
    slug: "interview-questions",
    title: "Interview Question Bank",
    eyebrow: "Revision · 2",
    description: "The linked-list problems that show up in every FAANG loop — with full solutions.",
    difficulty: "Intermediate",
    readMinutes: 6,
    sections: [
      { type: "callout", kind: "interview", title: "Full interview bank",
        text: "Every question below (and 15+ more) has a detailed explanation, Python solution, complexity analysis, and related-lesson links on the dedicated Interview Questions page → /linked-lists/interview" },
      { type: "interview", items: [
        "Reverse a linked list (iterative + recursive).",
        "Detect a cycle with Floyd's tortoise & hare.",
        "Find the node where a cycle begins.",
        "Find the middle node in one pass.",
        "Merge two sorted linked lists.",
        "Merge k sorted linked lists.",
        "Remove the N-th node from the end.",
        "Remove the middle element of a linked list.",
        "Delete a specific node given only that node.",
        "Check if a linked list is a palindrome.",
        "Add two numbers represented as linked lists.",
        "Copy a list with random pointers.",
        "Rotate a linked list by k positions.",
        "Reorder list: L0 → Ln → L1 → Ln-1 …",
        "Design an LRU cache (hash + doubly linked list).",
      ]},
    ],
  },
  {
    slug: "faqs",
    title: "Frequently Asked Questions",
    eyebrow: "Revision · 3",
    description: "Quick answers to the questions learners ask most often.",
    difficulty: "Beginner",
    readMinutes: 5,
    sections: [
      { type: "callout", kind: "info", title: "Full FAQ",
        text: "Every question below is expanded — with code, complexity, common mistakes, and lesson links — on the dedicated FAQ page → /linked-lists/faq" },
      { type: "theory", bullets: [
        "Q: Why not always use a doubly linked list? A: It doubles pointer memory and complicates every mutation — only pay for it when you need backward traversal or O(1) delete-by-node.",
        "Q: Does Python have a built-in linked list? A: Not exposed directly, but `collections.deque` is a doubly-linked block list under the hood.",
        "Q: How do I get length in O(1)? A: Wrap the list in a class and update a `size` counter on every insert/delete.",
        "Q: Can I sort a linked list in O(n log n)? A: Yes — merge sort is the standard choice; quicksort is awkward on singly-linked nodes.",
        "Q: Are recursive solutions safe? A: They cost O(n) stack. For lists over ~1000 nodes, prefer iterative to avoid RecursionError.",
      ]},
    ],
  },
  {
    slug: "complexity-cheatsheet",
    title: "Complexity Cheat Sheet",
    eyebrow: "Revision · 4",
    description: "Every operation, every variant, in one glance-able table.",
    difficulty: "Beginner",
    readMinutes: 3,
    sections: [
      { type: "complexity", rows: [
        { op: "Access index k",            time: "O(k)" },
        { op: "Search value",              time: "O(n)" },
        { op: "Insert at head",            time: "O(1)" },
        { op: "Insert at tail (w/ tail)",  time: "O(1)" },
        { op: "Insert at tail (no tail)",  time: "O(n)" },
        { op: "Insert after known node",   time: "O(1)" },
        { op: "Delete at head",            time: "O(1)" },
        { op: "Delete at tail (singly)",   time: "O(n)" },
        { op: "Delete at tail (doubly)",   time: "O(1)" },
        { op: "Delete known node (doubly)",time: "O(1)" },
        { op: "Reverse",                   time: "O(n)" },
        { op: "Find middle",               time: "O(n)" },
        { op: "Detect cycle (Floyd)",      time: "O(n)", space: "O(1)" },
        { op: "Merge two sorted",          time: "O(n+m)" },
        { op: "Merge sort",                time: "O(n log n)", space: "O(log n)" },
      ]},
    ],
  },
  {
    slug: "comparison-cheatsheet",
    title: "Variant Comparison Cheat Sheet",
    eyebrow: "Revision · 5",
    description: "Structure, memory, and use-cases across all four linked-list variants.",
    difficulty: "Beginner",
    readMinutes: 4,
    sections: [
      // The route renders <VariantComparisonTable /> above the sections
      // for this slug — same component as the foundations comparison.
      { type: "theory", text:
        "Refer to the comparison table above when you need to pick a variant. In practice: default to Singly, upgrade to Doubly when you need O(1) delete-by-node, use Circular when the data itself is a ring." },
    ],
  },
  {
    slug: "practice-problems",
    title: "Curated Practice Set",
    eyebrow: "Revision · 6",
    description: "A ladder from warm-up to hard, covering every core linked-list pattern.",
    difficulty: "Intermediate",
    readMinutes: 4,
    sections: [
      { type: "practice", groups: [
        { level: "Beginner", items: [
          { title: "206 · Reverse Linked List", url: "https://leetcode.com/problems/reverse-linked-list/", difficulty: "Easy", pattern: "Iterative reverse", time: "15m" },
          { title: "876 · Middle of the Linked List", url: "https://leetcode.com/problems/middle-of-the-linked-list/", difficulty: "Easy", pattern: "Slow/fast", time: "10m" },
          { title: "21 · Merge Two Sorted Lists", url: "https://leetcode.com/problems/merge-two-sorted-lists/", difficulty: "Easy", pattern: "Two-pointer merge", time: "15m" },
          { title: "141 · Linked List Cycle", url: "https://leetcode.com/problems/linked-list-cycle/", difficulty: "Easy", pattern: "Floyd", time: "15m" },
        ]},
        { level: "Intermediate", items: [
          { title: "142 · Linked List Cycle II", url: "https://leetcode.com/problems/linked-list-cycle-ii/", difficulty: "Medium", pattern: "Floyd + reset", time: "25m" },
          { title: "19 · Remove Nth From End", url: "https://leetcode.com/problems/remove-nth-node-from-end-of-list/", difficulty: "Medium", pattern: "Two pointer", time: "20m" },
          { title: "2 · Add Two Numbers", url: "https://leetcode.com/problems/add-two-numbers/", difficulty: "Medium", pattern: "Digit carry", time: "20m" },
          { title: "143 · Reorder List", url: "https://leetcode.com/problems/reorder-list/", difficulty: "Medium", pattern: "Split+reverse+merge", time: "30m" },
          { title: "146 · LRU Cache", url: "https://leetcode.com/problems/lru-cache/", difficulty: "Medium", pattern: "Hash + DLL", time: "45m" },
        ]},
        { level: "Advanced", items: [
          { title: "23 · Merge k Sorted Lists", url: "https://leetcode.com/problems/merge-k-sorted-lists/", difficulty: "Hard", pattern: "Heap / divide-conquer", time: "40m" },
          { title: "25 · Reverse Nodes in k-Group", url: "https://leetcode.com/problems/reverse-nodes-in-k-group/", difficulty: "Hard", pattern: "Segment reverse", time: "45m" },
          { title: "460 · LFU Cache", url: "https://leetcode.com/problems/lfu-cache/", difficulty: "Hard", pattern: "Hash + CDLL", time: "60m" },
        ]},
      ]},
    ],
  },
  {
    slug: "quiz",
    title: "Final Quiz",
    eyebrow: "Revision · 7",
    description: "Test yourself across foundations and every variant.",
    difficulty: "Intermediate",
    readMinutes: 8,
    sections: [
      { type: "quiz", items: [
        { q: "Which variant supports O(1) delete when you already hold a pointer to the node?", choices: ["Singly", "Doubly", "Circular singly", "None"], answer: 1, explain: "You need `.prev` to unlink without a full traversal." },
        { q: "Floyd's cycle detection runs in…", choices: ["O(n) time · O(1) space", "O(n) time · O(n) space", "O(n log n) time", "O(1) time"], answer: 0, explain: "Two pointers, no auxiliary set." },
        { q: "What terminates traversal in a NON-circular list?", choices: ["An empty node", "cur is None", "A special sentinel value", "len == 0"], answer: 1, explain: "The tail's `next` is None." },
        { q: "Best sort for a singly linked list is…", choices: ["Quicksort", "Insertion sort", "Merge sort", "Bubble sort"], answer: 2, explain: "Merge sort works with O(1) extra list ops and gives O(n log n)." },
        { q: "In a circular doubly linked list, `head.prev` is…", choices: ["None", "The tail node", "Head itself", "Undefined"], answer: 1, explain: "That's the whole reason CDLL gives O(1) tail access." },
      ]},
    ],
  },
  {
    slug: "references",
    title: "Further Reading",
    eyebrow: "Revision · 8",
    description: "Deep-dive links to canonical resources.",
    difficulty: "Beginner",
    readMinutes: 2,
    sections: [
      { type: "references", items: [
        { label: "CPython list implementation notes", url: "https://github.com/python/cpython/blob/main/Include/cpython/listobject.h" },
        { label: "collections.deque (docs)", url: "https://docs.python.org/3/library/collections.html#collections.deque" },
        { label: "MIT 6.006 · Lecture: Sequences", url: "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/" },
        { label: "CLRS · Chapter 10: Elementary Data Structures", url: "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/" },
        { label: "LeetCode · Linked List problem tag", url: "https://leetcode.com/tag/linked-list/" },
      ]},
    ],
  },
  {
    slug: "next-topic",
    title: "What to Learn Next",
    eyebrow: "Revision · 9",
    description: "You've mastered linked lists — here's the natural next step.",
    difficulty: "Beginner",
    readMinutes: 2,
    sections: [
      { type: "theory", text:
        "Linked lists are the backbone of Stacks, Queues, and Hash-table chaining. Any of those modules will feel familiar now that you understand pointer manipulation." },
      { type: "theory", bullets: [
        "→ Stacks — LIFO built on top of a singly linked list.",
        "→ Queues — FIFO, most naturally a singly LL with head+tail.",
        "→ Trees — nodes with multiple children; the same pointer-chasing skills apply.",
        "→ Graphs — adjacency lists are literally arrays of linked lists.",
      ]},
      { type: "callout", kind: "did", title: "Suggested next module", text: "Stacks — you'll implement one in ~30 lines using the linked-list skills you just built." },
    ],
  },
];
