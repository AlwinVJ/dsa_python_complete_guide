import type { TLesson } from "./types";

/** Foundations — vocabulary and mental model every tree variant depends on. */
export const T_FOUNDATIONS: TLesson[] = [
  {
    slug: "introduction",
    title: "Introduction",
    eyebrow: "Foundations · 1",
    description: "A tree is a hierarchical, acyclic collection of nodes — the shape behind file systems, DOMs, parsers, and database indexes.",
    difficulty: "Beginner",
    readMinutes: 4,
    sections: [
      { type: "theory", text: "A tree is a connected, acyclic graph with a single designated root. Every node has zero or more children and exactly one parent (except the root). Trees model any 'is contained by / belongs to' relationship, from folders on a disk to the parse tree a compiler builds from your source code." },
      { type: "tree", root: {
        id: "A", label: "root", color: "brand",
        children: [
          { id: "B", label: "L", children: [{ id: "D", label: "L·L" }, { id: "E", label: "L·R" }] },
          { id: "C", label: "R", children: [{ id: "F", label: "R·L" }] },
        ],
      }, caption: "A rooted tree — one root, edges point downward, no cycles."},
      { type: "callout", kind: "info", title: "Where we're headed",
        text: "Foundations → Tree Variants → Tree Algorithms → Review & Practice. Master each tier before moving on." },
    ],
  },
  {
    slug: "why-trees",
    title: "Why Trees?",
    eyebrow: "Foundations · 2",
    description: "The problems that arrays and linked lists cannot solve cheaply — and how a tree shape fixes them.",
    difficulty: "Beginner",
    readMinutes: 4,
    sections: [
      { type: "theory", bullets: [
        "Arrays give O(1) index, but O(n) search unless sorted.",
        "Sorted arrays give O(log n) search, but O(n) insert.",
        "Linked lists insert in O(1) at a known position, but search in O(n).",
        "Trees give O(log n) search AND O(log n) insert — when balanced.",
        "Trees are the natural shape for hierarchy: parse trees, org charts, DOM, file systems.",
      ]},
      { type: "callout", kind: "did", title: "The unifying idea",
        text: "A balanced tree turns 'scan every element' into 'ask log n comparisons' — the same speedup binary search gives, but with cheap inserts too." },
    ],
  },
  {
    slug: "problems-linear",
    title: "Problems with Linear Structures",
    eyebrow: "Foundations · 3",
    description: "Where arrays and linked lists break down when data grows.",
    difficulty: "Beginner",
    readMinutes: 3,
    sections: [
      { type: "table", headers: ["Structure", "Access", "Search", "Insert", "Weakness"], rows: [
        ["Unsorted array", "O(1)", "O(n)", "O(1) amortised", "Search is a scan"],
        ["Sorted array", "O(1)", "O(log n)", "O(n)", "Every insert shifts"],
        ["Linked list", "O(n)", "O(n)", "O(1) at head", "Nothing is fast twice"],
        ["Balanced BST", "O(log n)", "O(log n)", "O(log n)", "Extra pointer overhead"],
      ]},
      { type: "theory", text: "Trees trade a little constant-factor overhead for logarithmic behaviour on the hard operations. That trade is why every database index in production is a tree." },
    ],
  },
  {
    slug: "real-world",
    title: "Real-World Examples",
    eyebrow: "Foundations · 4",
    description: "Where trees show up outside the textbook.",
    difficulty: "Beginner",
    readMinutes: 3,
    sections: [
      { type: "theory", bullets: [
        "File systems — directories nest directories.",
        "The DOM — every HTML page is a tree of elements.",
        "Parse trees — compilers build ASTs to reason about code.",
        "Database indexes — B-trees and B+ trees.",
        "Autocomplete — tries hold every prefix of a dictionary.",
        "Decision trees in ML and rule-based systems.",
      ]},
    ],
  },
  {
    slug: "terminology",
    title: "Terminology",
    eyebrow: "Foundations · 5",
    description: "The vocabulary every tree lesson assumes: root, leaf, edge, depth, height, degree.",
    difficulty: "Beginner",
    readMinutes: 6,
    sections: [
      { type: "tree", root: {
        id: 1, label: 1, color: "brand", badge: "root",
        children: [
          { id: 2, label: 2, badge: "internal", children: [
            { id: 4, label: 4, badge: "leaf" },
            { id: 5, label: 5, badge: "leaf" },
          ]},
          { id: 3, label: 3, badge: "internal", children: [{ id: 6, label: 6, badge: "leaf" }]},
        ],
      }, caption: "Root is 1; internal nodes are 2 and 3; leaves are 4, 5, 6." },
      { type: "table", headers: ["Term", "Meaning"], rows: [
        ["Node", "A container holding a value and links to children."],
        ["Root", "The top node — the only node with no parent."],
        ["Leaf", "A node with no children."],
        ["Internal node", "Any node that is not a leaf."],
        ["Parent / Child", "Adjacent nodes on the same edge — the higher one is the parent."],
        ["Sibling", "Nodes that share the same parent."],
        ["Ancestor / Descendant", "Anything on the path up to the root / anything in the subtree."],
        ["Subtree", "A node plus everything reachable below it."],
        ["Edge", "The link between a parent and one of its children."],
        ["Path", "A sequence of nodes connected by edges."],
        ["Degree", "Number of children a node has."],
        ["Depth", "Number of edges from the root to that node (root depth = 0)."],
        ["Height", "Number of edges from that node down to its deepest leaf (leaf height = 0)."],
        ["Level", "Depth + 1 — commonly used with 'level order' traversal."],
      ]},
      { type: "callout", kind: "tip", title: "Height vs depth",
        text: "Depth is measured downward from the root; height is measured downward from the node. Root has depth 0 but may have height n-1." },
    ],
  },
  {
    slug: "properties",
    title: "Tree Properties",
    eyebrow: "Foundations · 6",
    description: "Invariants that every tree respects — n nodes have n-1 edges, and other useful facts.",
    difficulty: "Beginner",
    readMinutes: 4,
    sections: [
      { type: "theory", bullets: [
        "A tree with n nodes has exactly n - 1 edges.",
        "There is a unique path between any two nodes.",
        "Removing any edge disconnects the tree.",
        "The height of a tree with n nodes is between ⌈log₂(n+1)⌉ - 1 and n - 1.",
        "A binary tree of height h has at most 2^(h+1) - 1 nodes.",
        "The number of leaves in a full binary tree is (n + 1) / 2.",
      ]},
      { type: "callout", kind: "info", title: "Why n − 1 edges?",
        text: "Every non-root node has exactly one edge to its parent, and there are n − 1 non-root nodes. Adding another edge would create a cycle." },
    ],
  },
  {
    slug: "memory-representation",
    title: "Memory Representation",
    eyebrow: "Foundations · 7",
    description: "How Python actually lays a tree out in memory — pointers, arrays, and the trade-offs.",
    difficulty: "Beginner",
    readMinutes: 5,
    sections: [
      { type: "code", title: "node objects (the default)", code:
`class TreeNode:
    __slots__ = ("val", "left", "right")
    def __init__(self, val, left=None, right=None):
        self.val = val
        self.left = left    # reference to child, or None
        self.right = right

# root -> [ val: 1 | left: 0x… | right: 0x… ]
#         └─ each field is a Python object reference` },
      { type: "code", title: "array-backed (heap layout)", code:
`# For a *complete* binary tree, index 0 is root, and
# children of index i are at 2*i + 1 and 2*i + 2.
# Parent of i is (i - 1) // 2.
tree = [1, 2, 3, 4, 5, 6, 7]
#         0  1  2  3  4  5  6` },
      { type: "table", headers: ["Layout", "Pros", "Cons"], rows: [
        ["Node objects (pointers)", "Any shape, cheap insertion, easy code", "Extra bytes per node, pointer chase"],
        ["Array (heap)", "Cache-friendly, no pointers, index math", "Wastes memory on sparse trees"],
        ["Parent array", "Great for union-find style problems", "No cheap top-down traversal"],
      ]},
      { type: "callout", kind: "perf", title: "Cache locality",
        text: "For a fully populated tree of moderate size, an array layout can beat a node layout on modern CPUs by 3–5x — that's why heaps use it." },
    ],
  },
  {
    slug: "traversal-concepts",
    title: "Tree Traversal Concepts",
    eyebrow: "Foundations · 8",
    description: "Depth-first (preorder / inorder / postorder) vs breadth-first (level order) — the four ways to visit every node.",
    difficulty: "Beginner",
    readMinutes: 5,
    sections: [
      { type: "theory", text: "A traversal is a total ordering of every node in the tree. Depth-first uses recursion or an explicit stack; breadth-first uses a queue. Every algorithm you meet in the Algorithms tier is built from one of these four." },
      { type: "table", headers: ["Traversal", "Order", "Use case"], rows: [
        ["Preorder", "Root → Left → Right", "Copy tree, serialize, prefix expressions"],
        ["Inorder", "Left → Root → Right", "Return BST values in sorted order"],
        ["Postorder", "Left → Right → Root", "Delete children before parent, evaluate expressions"],
        ["Level order (BFS)", "Level by level", "Shortest path, tree width, LC 102"],
      ]},
      { type: "callout", kind: "did", title: "Inorder of a BST is sorted",
        text: "Because L < root < R at every node, walking L-root-R over the whole tree yields the values in ascending order — a great sanity check." },
    ],
  },
  {
    slug: "recursive-nature",
    title: "The Recursive Nature of Trees",
    eyebrow: "Foundations · 9",
    description: "Every tree operation reduces to 'do the thing to the left subtree, do the thing to the right subtree, combine'.",
    difficulty: "Beginner",
    readMinutes: 4,
    sections: [
      { type: "theory", text: "Trees are defined recursively — a tree is either empty, or a root plus a list of subtrees, each itself a tree. That recursive definition makes recursion the natural implementation." },
      { type: "code", title: "the template", code:
`def solve(node):
    if node is None:
        return base_case
    left_answer  = solve(node.left)
    right_answer = solve(node.right)
    return combine(node.val, left_answer, right_answer)` },
      { type: "callout", kind: "tip", title: "Interview tip",
        text: "When stuck, write the base case first (None → 0 / -1 / True / []) and let the recurrence write itself." },
    ],
  },
  {
    slug: "binary-vs-general",
    title: "Binary vs General Trees",
    eyebrow: "Foundations · 10",
    description: "Constraining every node to at most two children unlocks compact representations and simpler algorithms.",
    difficulty: "Beginner",
    readMinutes: 3,
    sections: [
      { type: "theory", bullets: [
        "General tree — any number of children per node (n-ary).",
        "Binary tree — at most two children (left, right).",
        "Binary trees fit into array layouts and enable BSTs, heaps, and expression trees.",
        "General trees model file systems and XML/JSON where fan-out is unbounded.",
      ]},
      { type: "tree", root: {
        id: "gt", label: "GT", color: "brand",
        children: [
          { id: "a", label: "A" }, { id: "b", label: "B" }, { id: "c", label: "C" }, { id: "d", label: "D" },
        ],
      }, caption: "A general tree — one root, four children."},
    ],
  },
  {
    slug: "playground",
    title: "Interactive Tree Playground",
    eyebrow: "Foundations · 11",
    description: "Insert, delete, search, and inspect metrics on a live BST — internalise the vocabulary before moving to variants.",
    difficulty: "Beginner",
    readMinutes: 5,
    sections: [
      { type: "theory", text: "The playground is a real Binary Search Tree. Every insert grows the shape; every search highlights the path from the root. Watch the metrics (nodes, leaves, height, levels) update as you mutate it, and switch traversal modes to see the four orders side by side." },
      { type: "playground" },
      { type: "callout", kind: "tip", title: "Try this",
        text: "Insert 1, 2, 3, 4, 5 in order and watch the height. Then reset and insert 3, 1, 4, 2, 5 — same values, very different height." },
    ],
  },
  {
    slug: "advantages",
    title: "Advantages",
    eyebrow: "Foundations · 12",
    description: "What trees do better than any linear structure.",
    difficulty: "Beginner",
    readMinutes: 3,
    sections: [
      { type: "theory", bullets: [
        "Logarithmic search, insert, and delete when balanced.",
        "Natural hierarchical modelling — no adapter code needed.",
        "Supports range queries efficiently (segment trees, BSTs).",
        "Cheap subtree operations — a whole branch is one pointer.",
      ]},
    ],
  },
  {
    slug: "disadvantages",
    title: "Disadvantages",
    eyebrow: "Foundations · 13",
    description: "The costs you pay for that logarithmic behaviour.",
    difficulty: "Beginner",
    readMinutes: 3,
    sections: [
      { type: "theory", bullets: [
        "Skewed trees degenerate to O(n) — balance is not free.",
        "Extra pointers per node — 16-40 bytes overhead.",
        "Deep trees can blow Python's recursion limit (default 1000).",
        "Cache locality is worse than an array.",
      ]},
      { type: "mistakes", items: [
        "Inserting sorted data into a plain BST — you get a linked list.",
        "Recursing on a 100k-node skewed tree without sys.setrecursionlimit.",
        "Confusing height (edges down) with size (nodes total).",
      ]},
    ],
  },
  {
    slug: "applications",
    title: "Applications",
    eyebrow: "Foundations · 14",
    description: "The problems the world solves with trees every day.",
    difficulty: "Beginner",
    readMinutes: 3,
    sections: [
      { type: "table", headers: ["Application", "Tree used"], rows: [
        ["Filesystems / directories", "General tree"],
        ["DOM, XML, JSON", "General tree"],
        ["Compiler AST", "General or binary tree"],
        ["Database indexes", "B-tree, B+ tree"],
        ["Autocomplete / spellcheck", "Trie"],
        ["Range sum / min queries", "Segment tree, Fenwick tree"],
        ["Priority queue / scheduler", "Heap (array-based binary tree)"],
        ["Huffman coding", "Binary tree"],
        ["Set / map in Java, C++", "Red-Black tree"],
      ]},
    ],
  },
  {
    slug: "complexity-overview",
    title: "Complexity Overview",
    eyebrow: "Foundations · 15",
    description: "The one table you should be able to reproduce from memory.",
    difficulty: "Beginner",
    readMinutes: 3,
    sections: [
      { type: "complexity", rows: [
        { op: "Traversal (any order)", time: "O(n)", space: "O(h)", note: "h = height, recursion stack" },
        { op: "Search / insert / delete (balanced)", time: "O(log n)", space: "O(log n)" },
        { op: "Search / insert / delete (skewed)", time: "O(n)", space: "O(n)" },
        { op: "Height / depth", time: "O(n)", space: "O(h)" },
        { op: "Level order (BFS)", time: "O(n)", space: "O(w)", note: "w = max width" },
        { op: "LCA (general binary tree)", time: "O(n)", space: "O(h)" },
      ]},
    ],
  },
  {
    slug: "summary",
    title: "Summary",
    eyebrow: "Foundations · 16",
    description: "You are ready for the variants — pick a tree and go deep.",
    difficulty: "Beginner",
    readMinutes: 2,
    sections: [
      { type: "theory", bullets: [
        "A tree is a rooted, acyclic, hierarchical structure.",
        "n nodes → n − 1 edges; unique path between any two nodes.",
        "Four traversals: preorder, inorder, postorder, level order.",
        "Balance is what turns O(n) into O(log n).",
        "Every variant in the next tier specialises one of these ideas.",
      ]},
      { type: "callout", kind: "did", title: "Next up",
        text: "Move on to Tree Variants — pick General Tree, Binary Tree, or BST for the smoothest ramp." },
    ],
  },
];
