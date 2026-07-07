// Curriculum data: full DSA-with-Python roadmap.
// Modules that already exist as real routes have `route` pointing there.
// Stub modules point to `/modules/<slug>` which is rendered by modules.$slug.tsx.

import { getCourse } from "./courses";

export type ModuleStatus = "available" | "stub";

export type Module = {
  slug: string;
  title: string;
  tagline: string;
  route: string;
  status: ModuleStatus;
  group: string;
  icon?: string;
  // Content for stub renderer
  theory?: string[];
  operations?: string[];
  applications?: string[];
  interviewQs?: string[];
  faqs?: { q: string; a: string }[];
  practice?: { title: string; url: string; difficulty: "Easy" | "Medium" | "Hard" }[];
  complexity?: { op: string; time: string; space?: string }[];
  pythonSnippet?: string;
};

// -----------------------------------------------------------------------------
// Roadmap (ordered progression)
// -----------------------------------------------------------------------------
export const ROADMAP: { slug: string; title: string; route: string; group: string }[] = [
  {
    slug: "python-basics",
    title: "Prerequisites",
    route: "/modules/python-basics",
    group: "Foundations",
  },
  { slug: "big-o", title: "Time Complexity (Big-O)", route: "/complexity", group: "Foundations" },
  { slug: "arrays", title: "Arrays & Python Lists", route: "/introduction", group: "Linear DS" },
  { slug: "strings", title: "Strings", route: "/modules/strings", group: "Linear DS" },
  { slug: "recursion", title: "Recursion", route: "/modules/recursion", group: "Foundations" },
  { slug: "searching", title: "Searching Algorithms", route: "/searching", group: "Algorithms" },
  { slug: "sorting", title: "Sorting Algorithms", route: "/sorting", group: "Algorithms" },
  {
    slug: "linked-lists",
    title: "Linked Lists",
    route: "/modules/linked-lists",
    group: "Linear DS",
  },
  { slug: "stacks", title: "Stacks", route: "/modules/stacks", group: "Linear DS" },
  { slug: "queues", title: "Queues", route: "/modules/queues", group: "Linear DS" },
  {
    slug: "hashing",
    title: "Hash Tables & Hashing",
    route: "/modules/hashing",
    group: "Linear DS",
  },
  { slug: "trees", title: "Trees", route: "/modules/trees", group: "Non-Linear DS" },
  { slug: "bst", title: "Binary Search Trees", route: "/modules/bst", group: "Non-Linear DS" },
  { slug: "avl", title: "AVL Trees", route: "/modules/avl", group: "Non-Linear DS" },
  { slug: "heaps", title: "Heaps", route: "/modules/heaps", group: "Non-Linear DS" },
  {
    slug: "priority-queues",
    title: "Priority Queues",
    route: "/modules/priority-queues",
    group: "Non-Linear DS",
  },
  { slug: "tries", title: "Tries", route: "/modules/tries", group: "Non-Linear DS" },
  { slug: "graphs", title: "Graphs", route: "/modules/graphs", group: "Non-Linear DS" },
  {
    slug: "graph-algorithms",
    title: "Graph Algorithms",
    route: "/modules/graph-algorithms",
    group: "Algorithms",
  },
  { slug: "greedy", title: "Greedy Algorithms", route: "/algorithms/greedy", group: "Patterns" },
  {
    slug: "backtracking",
    title: "Backtracking",
    route: "/algorithms/backtracking",
    group: "Patterns",
  },
  {
    slug: "divide-and-conquer",
    title: "Divide & Conquer",
    route: "/algorithms/divide-and-conquer",
    group: "Patterns",
  },
  { slug: "dp", title: "Dynamic Programming", route: "/modules/dp", group: "Patterns" },
  {
    slug: "advanced-graphs",
    title: "Advanced Graph Algorithms",
    route: "/modules/advanced-graphs",
    group: "Algorithms",
  },
  {
    slug: "cp",
    title: "Competitive Programming Patterns",
    route: "/modules/cp",
    group: "Advanced",
  },
  {
    slug: "interview",
    title: "Interview Preparation",
    route: "/modules/interview",
    group: "Advanced",
  },
];

// -----------------------------------------------------------------------------
// Module details for stub pages
// -----------------------------------------------------------------------------
const M = (m: Module): [string, Module] => [m.slug, m];

export const MODULES: Record<string, Module> = Object.fromEntries([
  M({
    slug: "python-basics",
    title: "Prerequisites",
    tagline: "Python syntax, reference models, and recursion basics before DSA.",
    route: "/modules/python-basics",
    status: "stub",
    group: "Foundations",
    theory: [
      "Variables are references to objects; Python is dynamically typed.",
      "Everything is an object: numbers, strings, functions, classes.",
      "Indentation defines blocks — 4 spaces is the standard.",
    ],
    operations: [
      "print / input",
      "if / elif / else",
      "for / while",
      "def / return",
      "try / except",
    ],
    applications: ["Scripts", "Automation", "Data pipelines", "Web backends", "ML prototypes"],
    interviewQs: [
      "What is the difference between `is` and `==`?",
      "How does Python handle memory management?",
      "Explain mutable vs immutable types with examples.",
    ],
    pythonSnippet: `def greet(name: str) -> str:\n    return f"Hello, {name}!"\n\nprint(greet("DSA"))`,
    practice: [
      { title: "FizzBuzz", url: "https://leetcode.com/problems/fizz-buzz/", difficulty: "Easy" },
      {
        title: "Palindrome Number",
        url: "https://leetcode.com/problems/palindrome-number/",
        difficulty: "Easy",
      },
    ],
  }),
  M({
    slug: "strings",
    title: "Strings",
    tagline: "Immutable sequences: operations, pattern matching, palindromes, KMP, Rabin–Karp.",
    route: "/modules/strings",
    status: "stub",
    group: "Linear DS",
    theory: [
      "Strings in Python are immutable sequences of Unicode code points.",
      "Every mutation creates a new string; prefer `''.join(...)` over `+=` in loops.",
    ],
    operations: [
      "slicing",
      "find / index",
      "split / join",
      "replace",
      "startswith / endswith",
      "f-strings",
    ],
    applications: [
      "Text processing",
      "Parsers",
      "DNA/bioinformatics",
      "Compilers",
      "Search engines",
    ],
    interviewQs: [
      "Reverse a string in place (as list).",
      "Check if two strings are anagrams.",
      "Longest palindromic substring.",
      "Implement KMP pattern matching.",
      "Group anagrams.",
    ],
    complexity: [
      { op: "Access s[i]", time: "O(1)" },
      { op: "Concatenation s + t", time: "O(n + m)" },
      { op: "Substring search (naive)", time: "O(n·m)" },
      { op: "KMP", time: "O(n + m)" },
    ],
    pythonSnippet: `def is_palindrome(s: str) -> bool:\n    s = s.lower()\n    return s == s[::-1]\n\nprint(is_palindrome("Racecar"))`,
    practice: [
      {
        title: "Valid Anagram",
        url: "https://leetcode.com/problems/valid-anagram/",
        difficulty: "Easy",
      },
      {
        title: "Longest Palindromic Substring",
        url: "https://leetcode.com/problems/longest-palindromic-substring/",
        difficulty: "Medium",
      },
      {
        title: "Implement strStr()",
        url: "https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/",
        difficulty: "Easy",
      },
    ],
  }),
  M({
    slug: "recursion",
    title: "Recursion",
    tagline: "Functions that call themselves — the call stack, base cases, and recurrence.",
    route: "/modules/recursion",
    status: "stub",
    group: "Foundations",
    theory: [
      "Every recursive function needs a base case and a recursive case.",
      "Each call adds a frame to the call stack — deep recursion risks stack overflow.",
      "Recursion trades stack space for cleaner expression of divide-and-conquer.",
    ],
    operations: ["Base case", "Recursive step", "Tail call", "Memoization"],
    interviewQs: [
      "Factorial and Fibonacci recursively.",
      "Tower of Hanoi.",
      "Print all subsets / permutations.",
      "Reverse a linked list recursively.",
    ],
    pythonSnippet: `def fact(n: int) -> int:\n    if n <= 1:\n        return 1\n    return n * fact(n - 1)\n\nprint(fact(6))  # 720`,
    practice: [
      {
        title: "Fibonacci Number",
        url: "https://leetcode.com/problems/fibonacci-number/",
        difficulty: "Easy",
      },
      { title: "Subsets", url: "https://leetcode.com/problems/subsets/", difficulty: "Medium" },
    ],
  }),
  M({
    slug: "linked-lists",
    title: "Linked Lists",
    tagline: "Nodes and pointers: singly, doubly, circular, and their operations.",
    route: "/modules/linked-lists",
    status: "stub",
    group: "Linear DS",
    theory: [
      "A linked list stores elements as nodes; each node points to the next (and previous in doubly-linked).",
      "Unlike arrays, insertion/deletion at the head is O(1) but random access is O(n).",
    ],
    operations: [
      "Insert head/tail",
      "Delete",
      "Search",
      "Reverse",
      "Detect cycle (Floyd's)",
      "Find middle",
      "Merge two sorted",
    ],
    applications: [
      "Undo history",
      "Music playlists",
      "Adjacency lists",
      "LRU cache",
      "Polynomial arithmetic",
    ],
    interviewQs: [
      "Reverse a linked list (iterative + recursive).",
      "Detect cycle using slow/fast pointers.",
      "Merge two sorted linked lists.",
      "Remove Nth node from end.",
      "Copy list with random pointer.",
    ],
    complexity: [
      { op: "Access i-th", time: "O(n)" },
      { op: "Insert at head", time: "O(1)" },
      { op: "Insert at tail (with tail ptr)", time: "O(1)" },
      { op: "Delete by value", time: "O(n)" },
    ],
    pythonSnippet: `class Node:\n    def __init__(self, val, nxt=None):\n        self.val, self.next = val, nxt\n\ndef reverse(head):\n    prev, cur = None, head\n    while cur:\n        cur.next, prev, cur = prev, cur, cur.next\n    return prev`,
    practice: [
      {
        title: "Reverse Linked List",
        url: "https://leetcode.com/problems/reverse-linked-list/",
        difficulty: "Easy",
      },
      {
        title: "Linked List Cycle",
        url: "https://leetcode.com/problems/linked-list-cycle/",
        difficulty: "Easy",
      },
      {
        title: "Merge Two Sorted Lists",
        url: "https://leetcode.com/problems/merge-two-sorted-lists/",
        difficulty: "Easy",
      },
    ],
  }),
  M({
    slug: "stacks",
    title: "Stacks",
    tagline: "LIFO — push and pop from the top. Backed by list or linked nodes.",
    route: "/modules/stacks",
    status: "stub",
    group: "Linear DS",
    theory: [
      "Stack follows Last-In-First-Out order.",
      "Python's `list.append` and `list.pop` give an O(1) stack.",
    ],
    operations: ["push", "pop", "peek / top", "isEmpty", "size"],
    applications: [
      "Expression evaluation",
      "Balanced parentheses",
      "Undo/redo",
      "Browser back button",
      "DFS traversal",
      "Function call stack",
    ],
    interviewQs: [
      "Valid parentheses.",
      "Evaluate Reverse Polish Notation.",
      "Min stack (O(1) getMin).",
      "Daily temperatures (monotonic stack).",
      "Largest rectangle in histogram.",
    ],
    complexity: [
      { op: "push / pop", time: "O(1)" },
      { op: "peek", time: "O(1)" },
    ],
    pythonSnippet: `stack = []\nstack.append(1); stack.append(2); stack.append(3)\nprint(stack.pop())  # 3\nprint(stack[-1])    # 2 (peek)`,
    practice: [
      {
        title: "Valid Parentheses",
        url: "https://leetcode.com/problems/valid-parentheses/",
        difficulty: "Easy",
      },
      { title: "Min Stack", url: "https://leetcode.com/problems/min-stack/", difficulty: "Medium" },
      {
        title: "Daily Temperatures",
        url: "https://leetcode.com/problems/daily-temperatures/",
        difficulty: "Medium",
      },
    ],
  }),
  M({
    slug: "queues",
    title: "Queues",
    tagline: "FIFO — enqueue at rear, dequeue at front. Linear, circular, deque, priority.",
    route: "/modules/queues",
    status: "stub",
    group: "Linear DS",
    theory: [
      "Queue follows First-In-First-Out.",
      "Use `collections.deque` for O(1) both-end operations; `queue.PriorityQueue` for priorities.",
    ],
    operations: ["enqueue", "dequeue", "front", "rear", "isEmpty", "size"],
    applications: [
      "BFS",
      "CPU scheduling",
      "Printer queue",
      "Message brokers",
      "Task scheduling",
      "Rate limiting",
    ],
    interviewQs: [
      "Implement queue using two stacks.",
      "Sliding window maximum.",
      "First non-repeating character in a stream.",
      "Design circular deque.",
    ],
    pythonSnippet: `from collections import deque\nq = deque()\nq.append(1); q.append(2)\nprint(q.popleft())  # 1`,
    practice: [
      {
        title: "Implement Queue using Stacks",
        url: "https://leetcode.com/problems/implement-queue-using-stacks/",
        difficulty: "Easy",
      },
      {
        title: "Sliding Window Maximum",
        url: "https://leetcode.com/problems/sliding-window-maximum/",
        difficulty: "Hard",
      },
    ],
  }),
  M({
    slug: "hashing",
    title: "Hash Tables & Hashing",
    tagline: "O(1) average lookups: dicts, sets, collisions, load factor.",
    route: "/modules/hashing",
    status: "stub",
    group: "Linear DS",
    theory: [
      "Hash tables map keys to indices via a hash function.",
      "Collisions are resolved by chaining or open addressing (linear/quadratic probing, double hashing).",
      "Python's `dict` and `set` are open-addressed hash tables.",
    ],
    operations: ["insert", "get", "delete", "contains", "resize / rehash"],
    applications: [
      "Caches (LRU)",
      "Symbol tables",
      "De-duplication",
      "Databases (indexes)",
      "Bloom filters",
    ],
    interviewQs: [
      "Two Sum.",
      "Group anagrams.",
      "LRU Cache.",
      "Design a hash map.",
      "Subarray sum equals K.",
    ],
    complexity: [{ op: "insert / get / delete", time: "O(1) avg, O(n) worst" }],
    pythonSnippet: `d = {"a": 1, "b": 2}\nd["c"] = 3\nprint(d.get("a"))     # 1\nprint("b" in d)       # True`,
    practice: [
      { title: "Two Sum", url: "https://leetcode.com/problems/two-sum/", difficulty: "Easy" },
      {
        title: "Group Anagrams",
        url: "https://leetcode.com/problems/group-anagrams/",
        difficulty: "Medium",
      },
      { title: "LRU Cache", url: "https://leetcode.com/problems/lru-cache/", difficulty: "Medium" },
    ],
  }),
  M({
    slug: "trees",
    title: "Trees",
    tagline: "Hierarchical structures: binary, n-ary, traversals, and properties.",
    route: "/modules/trees",
    status: "stub",
    group: "Non-Linear DS",
    theory: [
      "A tree is an acyclic connected graph. A binary tree has ≤ 2 children per node.",
      "Traversals: pre-order (N-L-R), in-order (L-N-R), post-order (L-R-N), level-order (BFS).",
    ],
    operations: ["insert", "delete", "search", "traversals", "height", "diameter", "LCA"],
    applications: [
      "File systems",
      "DOM",
      "Compilers (AST)",
      "Databases (B-trees)",
      "Routing tables",
    ],
    interviewQs: [
      "Invert a binary tree.",
      "Max depth of binary tree.",
      "Level-order traversal.",
      "Lowest common ancestor.",
      "Serialize and deserialize binary tree.",
    ],
    pythonSnippet: `class TreeNode:\n    def __init__(self, val, left=None, right=None):\n        self.val, self.left, self.right = val, left, right\n\ndef inorder(root):\n    if not root: return []\n    return inorder(root.left) + [root.val] + inorder(root.right)`,
    practice: [
      {
        title: "Invert Binary Tree",
        url: "https://leetcode.com/problems/invert-binary-tree/",
        difficulty: "Easy",
      },
      {
        title: "Binary Tree Level Order Traversal",
        url: "https://leetcode.com/problems/binary-tree-level-order-traversal/",
        difficulty: "Medium",
      },
    ],
  }),
  M({
    slug: "bst",
    title: "Binary Search Trees",
    tagline: "Ordered binary trees — O(log n) search when balanced.",
    route: "/modules/bst",
    status: "stub",
    group: "Non-Linear DS",
    theory: ["Left subtree < node < right subtree.", "In-order traversal yields sorted sequence."],
    operations: ["insert", "search", "delete (3 cases)", "successor / predecessor", "range query"],
    interviewQs: ["Validate BST.", "Kth smallest in BST.", "Convert sorted array to BST."],
    practice: [
      {
        title: "Validate Binary Search Tree",
        url: "https://leetcode.com/problems/validate-binary-search-tree/",
        difficulty: "Medium",
      },
      {
        title: "Kth Smallest Element in a BST",
        url: "https://leetcode.com/problems/kth-smallest-element-in-a-bst/",
        difficulty: "Medium",
      },
    ],
  }),
  M({
    slug: "avl",
    title: "AVL Trees",
    tagline: "Self-balancing BSTs — height difference ≤ 1 via rotations.",
    route: "/modules/avl",
    status: "stub",
    group: "Non-Linear DS",
    theory: [
      "Balance factor = height(left) - height(right); must stay in {-1, 0, 1}.",
      "Four rotation cases: LL, RR, LR, RL.",
    ],
    operations: ["insert (with rebalance)", "delete (with rebalance)", "rotate left/right"],
    interviewQs: ["Explain rotations.", "Insert sequence and show balance."],
  }),
  M({
    slug: "heaps",
    title: "Heaps",
    tagline: "Complete binary trees satisfying the heap property. Min-heap & max-heap.",
    route: "/modules/heaps",
    status: "stub",
    group: "Non-Linear DS",
    theory: [
      "A heap is a complete binary tree — parent is ≤ (min-heap) or ≥ (max-heap) its children.",
      "Python's `heapq` is a min-heap on a list.",
    ],
    operations: ["push (sift-up)", "pop (sift-down)", "peek", "heapify O(n)"],
    applications: ["Priority queues", "Dijkstra", "Heap sort", "Kth largest", "Median from stream"],
    interviewQs: [
      "Kth largest element.",
      "Top K frequent elements.",
      "Merge K sorted lists.",
      "Find median from data stream.",
    ],
    pythonSnippet: `import heapq\nh = []\nheapq.heappush(h, 3); heapq.heappush(h, 1); heapq.heappush(h, 2)\nprint(heapq.heappop(h))  # 1`,
    practice: [
      {
        title: "Kth Largest Element in an Array",
        url: "https://leetcode.com/problems/kth-largest-element-in-an-array/",
        difficulty: "Medium",
      },
      {
        title: "Top K Frequent Elements",
        url: "https://leetcode.com/problems/top-k-frequent-elements/",
        difficulty: "Medium",
      },
    ],
  }),
  M({
    slug: "priority-queues",
    title: "Priority Queues",
    tagline: "Queues where highest-priority element leaves first — usually a heap.",
    route: "/modules/priority-queues",
    status: "stub",
    group: "Non-Linear DS",
    operations: ["insert (with priority)", "extract-min / extract-max", "decrease-key"],
    applications: ["Dijkstra", "A* pathfinding", "Job scheduling", "Event simulation"],
  }),
  M({
    slug: "tries",
    title: "Tries (Prefix Trees)",
    tagline: "Trees indexed by character — fast prefix lookup for strings.",
    route: "/modules/tries",
    status: "stub",
    group: "Non-Linear DS",
    theory: [
      "Each edge is a character; each node may mark end-of-word.",
      "Search is O(L) where L = key length.",
    ],
    operations: ["insert", "search", "startsWith", "delete"],
    applications: ["Autocomplete", "Spell check", "IP routing", "Dictionary compression"],
    interviewQs: ["Implement Trie.", "Word search II.", "Replace words."],
    practice: [
      {
        title: "Implement Trie",
        url: "https://leetcode.com/problems/implement-trie-prefix-tree/",
        difficulty: "Medium",
      },
      {
        title: "Word Search II",
        url: "https://leetcode.com/problems/word-search-ii/",
        difficulty: "Hard",
      },
    ],
  }),
  M({
    slug: "graphs",
    title: "Graphs",
    tagline: "Vertices and edges — the most general data structure.",
    route: "/modules/graphs",
    status: "stub",
    group: "Non-Linear DS",
    theory: [
      "Graphs can be directed/undirected, weighted/unweighted, cyclic/acyclic, connected/disconnected.",
      "Representations: adjacency list (space O(V+E)) or matrix (O(V²)).",
    ],
    operations: ["addVertex", "addEdge", "removeEdge", "neighbors(v)"],
    applications: [
      "Social networks",
      "Maps & routing",
      "Web crawling",
      "Dependency resolution",
      "Circuit design",
    ],
    interviewQs: [
      "Clone graph.",
      "Number of islands.",
      "Course schedule (cycle in directed).",
      "Connected components.",
    ],
  }),
  M({
    slug: "graph-algorithms",
    title: "Graph Algorithms",
    tagline: "BFS, DFS, shortest paths, MSTs, topological sort, union-find.",
    route: "/modules/graph-algorithms",
    status: "stub",
    group: "Algorithms",
    theory: [
      "BFS finds shortest path in unweighted graphs.",
      "Dijkstra requires non-negative weights.",
      "Bellman-Ford handles negatives, detects negative cycles.",
    ],
    operations: [
      "BFS",
      "DFS",
      "Dijkstra",
      "Bellman-Ford",
      "Floyd-Warshall",
      "Prim",
      "Kruskal",
      "Topological Sort",
      "Union-Find",
    ],
    interviewQs: [
      "Shortest path in binary matrix.",
      "Network delay time.",
      "Redundant connection.",
    ],
  }),
  M({
    slug: "dp",
    title: "Dynamic Programming",
    tagline: "Solve big problems by combining answers to overlapping subproblems.",
    route: "/modules/dp",
    status: "stub",
    group: "Patterns",
    theory: [
      "Two hallmarks: overlapping subproblems + optimal substructure.",
      "Two techniques: top-down memoization vs bottom-up tabulation.",
      "Design steps: state → transition → base case → order → answer.",
    ],
    operations: [
      "Define state",
      "Write recurrence",
      "Add memo",
      "Convert to table",
      "Space-optimize",
    ],
    interviewQs: [
      "Fibonacci.",
      "Climbing stairs.",
      "House robber.",
      "Coin change.",
      "Longest increasing subsequence.",
      "Longest common subsequence.",
      "0/1 Knapsack.",
      "Edit distance.",
    ],
    pythonSnippet: `def climb(n: int) -> int:\n    a, b = 1, 1\n    for _ in range(n):\n        a, b = b, a + b\n    return a`,
    practice: [
      {
        title: "Climbing Stairs",
        url: "https://leetcode.com/problems/climbing-stairs/",
        difficulty: "Easy",
      },
      {
        title: "Coin Change",
        url: "https://leetcode.com/problems/coin-change/",
        difficulty: "Medium",
      },
      {
        title: "Longest Increasing Subsequence",
        url: "https://leetcode.com/problems/longest-increasing-subsequence/",
        difficulty: "Medium",
      },
      {
        title: "Edit Distance",
        url: "https://leetcode.com/problems/edit-distance/",
        difficulty: "Hard",
      },
    ],
  }),
  M({
    slug: "advanced-graphs",
    title: "Advanced Graph Algorithms",
    tagline: "Articulation points, bridges, SCCs, min-cut, network flow.",
    route: "/modules/advanced-graphs",
    status: "stub",
    group: "Algorithms",
    operations: [
      "Tarjan's SCC",
      "Articulation points",
      "Bridges",
      "Ford-Fulkerson",
      "Bipartite matching",
    ],
  }),
  M({
    slug: "cp",
    title: "Competitive Programming Patterns",
    tagline: "Contest-specific techniques: sqrt decomposition, Mo's algorithm, bitmask DP.",
    route: "/modules/cp",
    status: "stub",
    group: "Advanced",
    operations: [
      "Sqrt decomposition",
      "Mo's algorithm",
      "Bitmask DP",
      "Persistent DS",
      "Heavy-light decomposition",
    ],
  }),
  M({
    slug: "interview",
    title: "Interview Preparation",
    tagline: "A curated 12-week plan to prepare for FAANG-style technical interviews.",
    route: "/modules/interview",
    status: "stub",
    group: "Advanced",
    theory: [
      "Study patterns, not individual problems.",
      "Do 3-5 problems per day, then review the editorial.",
      "Mock interviews weekly — practice thinking out loud.",
    ],
    practice: [
      { title: "NeetCode 150", url: "https://neetcode.io/practice", difficulty: "Medium" },
      { title: "Blind 75", url: "https://leetcode.com/list/xoqag3yj/", difficulty: "Medium" },
    ],
  }),
]);

// Lightweight stubs for variant modules referenced from the nav. These render
// via modules.$slug.tsx and get upgraded to full RichModule content over time.
const VARIANT_STUBS: { slug: string; title: string; group: string; tagline: string }[] = [
  {
    slug: "singly-linked-list",
    title: "Singly Linked List",
    group: "Linear Data Structures",
    tagline: "The simplest linked list — one pointer, one direction.",
  },
  {
    slug: "doubly-linked-list",
    title: "Doubly Linked List",
    group: "Linear Data Structures",
    tagline: "Bidirectional traversal with prev and next pointers.",
  },
  {
    slug: "circular-linked-list",
    title: "Circular Linked List",
    group: "Linear Data Structures",
    tagline: "The tail wraps back to head — great for round-robin.",
  },
  {
    slug: "circular-doubly-linked-list",
    title: "Circular Doubly Linked List",
    group: "Linear Data Structures",
    tagline: "Cyclic ring with prev and next pointers.",
  },
  {
    slug: "linear-queue",
    title: "Linear Queue",
    group: "Linear Data Structures",
    tagline: "First-in first-out with fixed capacity.",
  },
  {
    slug: "circular-queue",
    title: "Circular Queue",
    group: "Linear Data Structures",
    tagline: "Ring buffer — reuses freed slots.",
  },
  {
    slug: "deque",
    title: "Deque",
    group: "Linear Data Structures",
    tagline: "Double-ended queue — O(1) at both ends.",
  },
  {
    slug: "hash-sets",
    title: "Hash Sets",
    group: "Non-Linear Data Structures",
    tagline: "Hash-backed sets for O(1) membership.",
  },
  {
    slug: "binary-tree",
    title: "Binary Tree",
    group: "Non-Linear Data Structures",
    tagline: "Every node has at most two children.",
  },
  {
    slug: "red-black-tree",
    title: "Red-Black Tree",
    group: "Non-Linear Data Structures",
    tagline: "Self-balancing BST with color invariants.",
  },
  {
    slug: "b-tree",
    title: "B Tree",
    group: "Non-Linear Data Structures",
    tagline: "Multi-way search tree for disk-based databases.",
  },
  {
    slug: "b-plus-tree",
    title: "B+ Tree",
    group: "Non-Linear Data Structures",
    tagline: "B tree variant with linked leaves — the backbone of RDBMS indexes.",
  },
  {
    slug: "segment-tree",
    title: "Segment Tree",
    group: "Non-Linear Data Structures",
    tagline: "Range queries and point updates in O(log n).",
  },
  {
    slug: "fenwick-tree",
    title: "Fenwick Tree (BIT)",
    group: "Non-Linear Data Structures",
    tagline: "Compact prefix-sum tree for range aggregates.",
  },
];
for (const v of VARIANT_STUBS) {
  MODULES[v.slug] = {
    slug: v.slug,
    title: v.title,
    tagline: v.tagline,
    route: `/modules/${v.slug}`,
    status: "stub",
    group: v.group,
  };
}

export function getAllModuleSlugs() {
  return Object.keys(MODULES);
}

export function getModuleRoute(item: { slug: string; route: string }): string {
  const courseSlug =
    item.slug === "sorting"
      ? "sorting-algorithms"
      : item.slug === "hashing"
        ? "hash-tables"
        : item.slug;
  const course = getCourse(courseSlug);
  if (course) {
    if (course.slug === "sorting-algorithms") {
      return "/sorting";
    }
    if (course.slug === "searching") {
      return "/searching";
    }
    return `/learn/${course.slug}`;
  }
  return item.route;
}
