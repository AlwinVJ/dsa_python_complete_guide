export type NavItem = { to: string; label: string };
export type NavSection = { title: string; items: NavItem[] };

export const NAV_SECTIONS: NavSection[] = [
  {
    title: "Getting Started",
    items: [
      { to: "/", label: "Home" },
      { to: "/roadmap", label: "DSA Roadmap" },
      { to: "/dashboard", label: "Dashboard" },
      { to: "/practice", label: "Question Bank" },
      { to: "/search", label: "Search" },
    ],
  },
  {
    title: "Foundations",
    items: [
      { to: "/modules/python-basics", label: "Prerequisites" },
      { to: "/complexity", label: "Big-O Complexity" },
      { to: "/learn/recursion", label: "Recursion" },
    ],
  },

  // ---------- Data Structures — Linear ----------
  {
    title: "Linear · Arrays & Python Lists",
    items: [
      { to: "/introduction", label: "Introduction" },
      { to: "/array-vs-list", label: "Array vs List" },
      { to: "/creating", label: "Creating Lists" },
      { to: "/accessing", label: "Accessing & Updating" },
      { to: "/slicing", label: "Slicing" },
      { to: "/traversing", label: "Traversing" },
      { to: "/insertion", label: "Insertion" },
      { to: "/deletion", label: "Deletion" },
      { to: "/searching", label: "Searching" },
      { to: "/methods", label: "Built-in Methods" },
      { to: "/nested", label: "Nested Lists" },
      { to: "/comprehension", label: "List Comprehension" },
      { to: "/copying", label: "Copying & Memory" },
    ],
  },
  {
    title: "Linear · Strings",
    items: [
      { to: "/learn/strings", label: "Strings — Overview" },
    ],
  },
  {
    title: "Linear · Linked Lists",
    items: [
      { to: "/modules/linked-lists", label: "Linked Lists — Overview" },
      { to: "/modules/singly-linked-list", label: "Singly Linked List" },
      { to: "/modules/doubly-linked-list", label: "Doubly Linked List" },
      { to: "/modules/circular-linked-list", label: "Circular Linked List" },
      { to: "/modules/circular-doubly-linked-list", label: "Circular Doubly Linked List" },
      { to: "/linked-lists/faq", label: "Linked Lists — FAQ" },
      { to: "/linked-lists/interview", label: "Linked Lists — Interview Qs" },
    ],
  },
  {
    title: "Linear · Stacks",
    items: [
      { to: "/learn/stacks", label: "Stacks — Course" },
      { to: "/stacks/foundations/introduction", label: "Foundations" },
      { to: "/stacks/implementations/python-list", label: "Implementations" },
      { to: "/stacks/applications/valid-parentheses", label: "Algorithms & Applications" },
      { to: "/stacks/revision/faq", label: "Review & Practice" },
      { to: "/stacks/faq", label: "Stacks — FAQ" },
      { to: "/stacks/interview", label: "Stacks — Interview Qs" },
    ],
  },
  {
    title: "Linear · Queues",
    items: [
      { to: "/learn/queues", label: "Queues — Course" },
      { to: "/queues/foundations/introduction", label: "Foundations" },
      { to: "/queues/variants/circular-queue", label: "Variants" },
      { to: "/queues/applications/bfs", label: "Algorithms & Applications" },
      { to: "/queues/revision/faq", label: "Review & Practice" },
      { to: "/queues/faq", label: "Queues — FAQ" },
      { to: "/queues/interview", label: "Queues — Interview Qs" },
    ],
  },
  {
    title: "Linear · Hash Tables",
    items: [
      { to: "/learn/hash-tables", label: "Hash Tables — Course" },
      { to: "/hash-tables/foundations/introduction", label: "Foundations" },
      { to: "/hash-tables/hashing/introduction", label: "Hashing Fundamentals" },
      { to: "/hash-tables/tables/introduction", label: "Hash Tables" },
      { to: "/hash-tables/revision/faq", label: "Review & Practice" },
    ],
  },

  // ---------- Data Structures — Non-Linear ----------
  {
    title: "Non-Linear · Trees",
    items: [
      { to: "/learn/trees", label: "Trees — Course" },
      { to: "/trees/foundations/introduction", label: "Foundations" },
      { to: "/trees/general-tree/introduction", label: "General Tree" },
      { to: "/trees/binary-tree/introduction", label: "Binary Tree" },
      { to: "/trees/bst/introduction", label: "Binary Search Tree" },
      { to: "/trees/avl/introduction", label: "AVL Tree" },
      { to: "/trees/red-black/introduction", label: "Red-Black Tree" },
      { to: "/trees/b-tree/introduction", label: "B-Tree" },
      { to: "/trees/b-plus-tree/introduction", label: "B+ Tree" },
      { to: "/trees/trie/introduction", label: "Trie" },
      { to: "/trees/segment-tree/introduction", label: "Segment Tree" },
      { to: "/trees/fenwick-tree/introduction", label: "Fenwick Tree" },
      { to: "/trees/algorithms/dfs", label: "Tree Algorithms" },
      { to: "/trees/revision/faq", label: "Review & Practice" },
    ],
  },
  {
    title: "Non-Linear · Heaps",
    items: [
      { to: "/learn/heaps", label: "Heaps" },
    ],
  },
  {
    title: "Non-Linear · Graphs",
    items: [
      { to: "/graphs", label: "Graphs — Overview" },
      { to: "/graphs/foundations/introduction", label: "Foundations" },
      { to: "/playgrounds/graph", label: "Graph Playground" },
    ],
  },

  // ---------- Algorithms ----------
  {
    title: "Algorithms",
    items: [
      { to: "/sorting", label: "Sorting Algorithms" },
      { to: "/learn/graph-algorithms", label: "Graph Algorithms" },
      { to: "/learn/dp", label: "Dynamic Programming" },
      { to: "/modules/advanced-graphs", label: "Advanced Graphs" },
    ],
  },
  {
    title: "Popular Algorithm Patterns",
    items: [
      { to: "/algorithms", label: "Overview & Decision Tree" },
      { to: "/algorithms/linear-traversal", label: "1 · Linear Traversal" },
      { to: "/algorithms/two-pointers", label: "2 · Two Pointers" },
      { to: "/algorithms/sliding-window", label: "3 · Sliding Window" },
      { to: "/algorithms/prefix-sum", label: "4 · Prefix Sum" },
      { to: "/algorithms/hash-map", label: "5 · Hash Map / Counting" },
      { to: "/algorithms/binary-search", label: "6 · Binary Search" },
      { to: "/algorithms/sorting-based", label: "7 · Sorting-Based" },
      { to: "/algorithms/kadane", label: "8 · Kadane's Algorithm" },
      { to: "/algorithms/greedy", label: "9 · Greedy" },
      { to: "/algorithms/divide-and-conquer", label: "10 · Divide & Conquer" },
      { to: "/algorithms/heap", label: "11 · Heap / Priority Queue" },
      { to: "/algorithms/monotonic-stack", label: "12 · Monotonic Stack" },
      { to: "/algorithms/monotonic-queue", label: "13 · Monotonic Queue" },
      { to: "/algorithms/matrix-traversal", label: "14 · Matrix Traversal" },
      { to: "/algorithms/backtracking", label: "15 · Backtracking" },
      { to: "/algorithms/bit-manipulation", label: "16 · Bit Manipulation" },
      { to: "/algorithms/merge-intervals", label: "17 · Merge Intervals" },
      { to: "/algorithms/cyclic-sort", label: "18 · Cyclic Sort" },
      { to: "/algorithms/quick-select", label: "19 · Quick Select" },
      { to: "/algorithms/dp-intro", label: "20 · DP Intro" },
    ],
  },
  {
    title: "Complexity Cheat Sheets",
    items: [
      { to: "/complexity", label: "Overview" },
      { to: "/complexity/time", label: "Time Complexity" },
      { to: "/complexity/space", label: "Space Complexity" },
    ],
  },
  {
    title: "Interview Prep",
    items: [
      { to: "/modules/interview", label: "Interview Preparation" },
      { to: "/modules/cp", label: "Competitive Programming" },
      { to: "/faq", label: "FAQ & Interview Qs" },
    ],
  },
  {
    title: "Playgrounds",
    items: [
      { to: "/playgrounds/sorting", label: "Sorting Playground" },
    ],
  },
  {
    title: "Reference",
    items: [
      { to: "/cheatsheet", label: "Quick Revision" },
      { to: "/resources", label: "References & Practice" },
    ],
  },
];
