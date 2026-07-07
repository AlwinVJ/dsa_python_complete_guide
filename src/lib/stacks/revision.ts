import type { StackLesson } from "./types";

/** Review & Practice tier — recap, cheat sheet, roadmaps, quiz. */
export const STACK_REVISION: StackLesson[] = [
  {
    slug: "common-mistakes",
    title: "Common Mistakes",
    eyebrow: "Review · 1",
    description: "The bugs every stack beginner makes at least once.",
    difficulty: "Beginner",
    readMinutes: 4,
    sections: [
      {
        type: "mistakes",
        items: [
          "Using list.pop(0) instead of list.pop() — that's O(n) and defeats the purpose of a stack.",
          "Popping without checking is_empty() — IndexError at 3am in production.",
          "Silently returning None on underflow — callers keep working with garbage.",
          "Forgetting to clear the redo stack when a new action is performed.",
          "Deep recursion without converting to an explicit stack — RecursionError at ~1000 frames.",
          "Peeking with stack[0] instead of stack[-1] — you read the base, not the top.",
          "Sharing one stack between two logical concerns — split into named stacks (undo vs redo).",
        ],
      },
    ],
  },
  {
    slug: "faq",
    title: "Frequently Asked Questions",
    eyebrow: "Review · 2",
    description:
      "Jump to the full FAQ — same questions learners ask most, curated with code and complexity.",
    difficulty: "Beginner",
    readMinutes: 2,
    sections: [
      {
        type: "callout",
        kind: "info",
        title: "Full FAQ lives on a dedicated page",
        text: "Open /stacks/faq for the searchable, categorised bank with code snippets, complexity notes, and cross-links. Below is a taster.",
      },
      {
        type: "theory",
        bullets: [
          "What is LIFO and why does it matter? — the ordering that makes recursion, parsing, and undo trivial.",
          "Stack vs Array — same storage, opposite discipline.",
          "Stack vs Queue — LIFO vs FIFO.",
          "Why is my recursion slow / crashing? — you've hit Python's 1000-frame limit; use an explicit stack.",
          "When should I pick a linked-list stack over a Python list? — real-time systems that can't tolerate amortised resizing.",
        ],
      },
    ],
  },
  {
    slug: "interview-questions",
    title: "Interview Questions",
    eyebrow: "Review · 3",
    description:
      "Jump to the full interview bank — 20+ questions from theory to FAANG monotonic-stack problems.",
    difficulty: "Intermediate",
    readMinutes: 2,
    sections: [
      {
        type: "callout",
        kind: "interview",
        title: "Full interview bank",
        text: "Open /stacks/interview for the difficulty-filtered bank with Python solutions, complexity analysis, and LeetCode links.",
      },
      {
        type: "interview",
        items: [
          "Implement a stack with getMin() in O(1).",
          "Valid parentheses (LC #20).",
          "Next greater element / daily temperatures.",
          "Largest rectangle in a histogram.",
          "Evaluate reverse Polish notation.",
          "Sort a stack using recursion only.",
          "Delete a specific / middle node from a stack.",
          "Implement a queue using two stacks.",
          "Design a browser-history back/forward.",
          "Trapping rain water using a monotonic stack.",
        ],
      },
    ],
  },
  {
    slug: "complexity-cheatsheet",
    title: "Complexity Cheat Sheet",
    eyebrow: "Review · 4",
    description: "Time & space for every operation and every implementation, side by side.",
    difficulty: "Beginner",
    readMinutes: 3,
    sections: [
      {
        type: "complexity",
        rows: [
          { op: "push (Python list)", time: "O(1) amortised", space: "O(1)" },
          { op: "push (linked list)", time: "O(1) worst", space: "O(1)" },
          { op: "push (fixed array)", time: "O(1) worst", space: "O(1)" },
          { op: "pop", time: "O(1)", space: "O(1)" },
          { op: "peek / top", time: "O(1)", space: "O(1)" },
          { op: "is_empty / size", time: "O(1)", space: "O(1)" },
          { op: "search", time: "O(n)", space: "O(n) aux" },
          { op: "reverse via aux stack", time: "O(n)", space: "O(n)" },
          { op: "sort a stack", time: "O(n²)", space: "O(n)" },
          { op: "monotonic-stack scan", time: "O(n) amortised", space: "O(n)" },
        ],
      },
    ],
  },
  {
    slug: "practice-problems",
    title: "Practice Problems",
    eyebrow: "Review · 5",
    description: "A curated ladder — start easy, end on monotonic-stack hard problems.",
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
                title: "LC 20 · Valid Parentheses",
                url: "https://leetcode.com/problems/valid-parentheses/",
                difficulty: "Easy",
              },
              {
                title: "LC 1047 · Remove All Adjacent Duplicates",
                url: "https://leetcode.com/problems/remove-all-adjacent-duplicates-in-string/",
                difficulty: "Easy",
              },
              {
                title: "LC 232 · Implement Queue using Stacks",
                url: "https://leetcode.com/problems/implement-queue-using-stacks/",
                difficulty: "Easy",
              },
              {
                title: "LC 496 · Next Greater Element I",
                url: "https://leetcode.com/problems/next-greater-element-i/",
                difficulty: "Easy",
              },
            ],
          },
          {
            level: "Intermediate",
            items: [
              {
                title: "LC 155 · Min Stack",
                url: "https://leetcode.com/problems/min-stack/",
                difficulty: "Medium",
              },
              {
                title: "LC 150 · Evaluate Reverse Polish Notation",
                url: "https://leetcode.com/problems/evaluate-reverse-polish-notation/",
                difficulty: "Medium",
              },
              {
                title: "LC 739 · Daily Temperatures",
                url: "https://leetcode.com/problems/daily-temperatures/",
                difficulty: "Medium",
                pattern: "Monotonic Stack",
              },
              {
                title: "LC 394 · Decode String",
                url: "https://leetcode.com/problems/decode-string/",
                difficulty: "Medium",
              },
              {
                title: "LC 402 · Remove K Digits",
                url: "https://leetcode.com/problems/remove-k-digits/",
                difficulty: "Medium",
              },
            ],
          },
          {
            level: "Advanced",
            items: [
              {
                title: "LC 84 · Largest Rectangle in Histogram",
                url: "https://leetcode.com/problems/largest-rectangle-in-histogram/",
                difficulty: "Hard",
                pattern: "Monotonic Stack",
              },
              {
                title: "LC 42 · Trapping Rain Water",
                url: "https://leetcode.com/problems/trapping-rain-water/",
                difficulty: "Hard",
              },
              {
                title: "LC 32 · Longest Valid Parentheses",
                url: "https://leetcode.com/problems/longest-valid-parentheses/",
                difficulty: "Hard",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "leetcode-roadmap",
    title: "LeetCode Roadmap",
    eyebrow: "Review · 6",
    description: "A four-week LeetCode plan to become fluent with the stack pattern.",
    difficulty: "Intermediate",
    readMinutes: 3,
    sections: [
      {
        type: "theory",
        bullets: [
          "Week 1 — Basics: LC 20, 155, 232, 1047.",
          "Week 2 — Expression parsing: LC 150, 224, 227, 394.",
          "Week 3 — Monotonic stacks: LC 496, 503, 739, 901.",
          "Week 4 — Hard monotonic: LC 84, 42, 402, 32.",
        ],
      },
    ],
  },
  {
    slug: "hackerrank-roadmap",
    title: "HackerRank Roadmap",
    eyebrow: "Review · 7",
    description: "HackerRank's stack track, in order.",
    difficulty: "Beginner",
    readMinutes: 2,
    sections: [
      {
        type: "references",
        items: [
          {
            label: "HackerRank · Stacks (all problems)",
            url: "https://www.hackerrank.com/domains/data-structures?filters%5Bsubdomains%5D%5B%5D=stacks",
          },
          {
            label: "HackerRank · Balanced Brackets",
            url: "https://www.hackerrank.com/challenges/balanced-brackets/problem",
          },
          {
            label: "HackerRank · Largest Rectangle",
            url: "https://www.hackerrank.com/challenges/largest-rectangle/problem",
          },
          {
            label: "HackerRank · Poisonous Plants",
            url: "https://www.hackerrank.com/challenges/poisonous-plants/problem",
          },
        ],
      },
    ],
  },
  {
    slug: "references",
    title: "References",
    eyebrow: "Review · 8",
    description: "Authoritative reading for going deeper.",
    difficulty: "Beginner",
    readMinutes: 2,
    sections: [
      {
        type: "references",
        items: [
          {
            label: "Stack (abstract data type) — Wikipedia",
            url: "https://en.wikipedia.org/wiki/Stack_(abstract_data_type)",
          },
          {
            label: "CPython source · listobject.c (list.pop internals)",
            url: "https://github.com/python/cpython/blob/main/Objects/listobject.c",
          },
          {
            label: "Python docs · using lists as stacks",
            url: "https://docs.python.org/3/tutorial/datastructures.html#using-lists-as-stacks",
          },
          {
            label: "MIT 6.006 · Stacks & Queues (lecture notes)",
            url: "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/",
          },
          { label: "Visualgo · Stack visualization", url: "https://visualgo.net/en/list" },
        ],
      },
    ],
  },
  {
    slug: "final-quiz",
    title: "Final Quiz",
    eyebrow: "Review · 9",
    description: "Ten mixed-difficulty questions covering the entire course.",
    difficulty: "Intermediate",
    readMinutes: 5,
    sections: [
      {
        type: "quiz",
        items: [
          {
            q: "Which operation is NOT O(1) on a Python-list-backed stack?",
            choices: ["append", "pop", "pop(0)", "list[-1]"],
            answer: 2,
            explain: "pop(0) shifts every remaining element — O(n).",
          },
          {
            q: "What is the acronym describing stack ordering?",
            choices: ["FIFO", "LIFO", "LRU", "LILO"],
            answer: 1,
          },
          {
            q: "Popping an empty stack raises which exception?",
            choices: ["ValueError", "KeyError", "IndexError", "TypeError"],
            answer: 2,
          },
          {
            q: "Which structure is most naturally implemented with a stack?",
            choices: [
              "Round-robin scheduler",
              "Depth-first search",
              "Breadth-first search",
              "Print queue",
            ],
            answer: 1,
          },
          {
            q: "The stack pointer typically points to…",
            choices: ["the current top", "the next free slot", "the base", "the middle"],
            answer: 1,
          },
          {
            q: "Two stacks can implement a…",
            choices: ["Hash map", "Queue", "Priority queue", "Trie"],
            answer: 1,
          },
          {
            q: "Min-stack achieves O(1) getMin by storing…",
            choices: ["a heap", "(value, running_min) pairs", "sorted values", "a BST"],
            answer: 1,
          },
          {
            q: "The monotonic stack solves problems of the shape…",
            choices: [
              "shortest path",
              "next greater / smaller element",
              "in-order traversal",
              "cycle detection",
            ],
            answer: 1,
          },
          {
            q: "Python's default recursion limit is roughly…",
            choices: ["100", "1000", "10 000", "100 000"],
            answer: 1,
          },
          {
            q: "Which is TRUE about a stack?",
            choices: [
              "Random access is O(1)",
              "Insertion at the middle is O(1)",
              "All core ops are O(1)",
              "Search is O(log n)",
            ],
            answer: 2,
          },
        ],
      },
    ],
  },
  {
    slug: "next-topic",
    title: "Next Topic",
    eyebrow: "Review · 10",
    description: "You've finished Stacks. Continue the DSA journey.",
    difficulty: "Beginner",
    readMinutes: 2,
    sections: [
      {
        type: "theory",
        text: "Queues are the LIFO-vs-FIFO mirror of everything you just learned. Same primitives, opposite ordering. After Queues comes Hash Tables — the last of the linear data structures — and then the non-linear world of Trees and Graphs.",
      },
      {
        type: "callout",
        kind: "did",
        title: "Recommended next course",
        text: "Head to /learn/queues to keep the momentum going.",
      },
    ],
  },
];
