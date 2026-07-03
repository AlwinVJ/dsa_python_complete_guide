import type { TreeVariantMeta } from "./types";

// ----------------------------------------------------------------------------
// AVL Tree
// ----------------------------------------------------------------------------
export const V_AVL: TreeVariantMeta = {
  slug: "avl",
  title: "AVL Tree",
  tagline: "Height-balanced BST — every insert or delete restores |bf| ≤ 1 with rotations.",
  lessons: [
    {
      slug: "introduction",
      title: "Introduction",
      eyebrow: "AVL · 1",
      description: "A self-balancing BST that guarantees O(log n) height by rotating after every mutation.",
      difficulty: "Intermediate",
      readMinutes: 4,
      sections: [
        { type: "theory", text: "Named after Adelson-Velsky and Landis (1962), the AVL tree keeps its height within roughly 1.44 · log₂(n) by requiring that every node's balance factor — height(left) − height(right) — stay in {−1, 0, +1}." },
        { type: "tree", root: {
          id: 30, label: 30, color: "brand", badge: "bf=0",
          children: [
            { id: 20, label: 20, badge: "bf=0", children: [{ id: 10, label: 10, badge: "bf=0" }, { id: 25, label: 25, badge: "bf=0" }]},
            { id: 40, label: 40, badge: "bf=0", children: [{ id: 35, label: 35, badge: "bf=0" }, { id: 50, label: 50, badge: "bf=0" }]},
          ],
        }, caption: "Perfectly balanced — every balance factor is zero." },
      ],
    },
    {
      slug: "balance-factor",
      title: "Balance Factor",
      eyebrow: "AVL · 2",
      description: "bf(n) = height(n.left) − height(n.right) — the number the AVL tree cares about above all others.",
      difficulty: "Intermediate",
      readMinutes: 3,
      sections: [
        { type: "code", code:
`def bf(n):
    return height(n.left) - height(n.right) if n else 0

# after each insert/delete, walk back up and rebalance any node
# whose |bf| becomes 2 (an AVL invariant violation).` },
        { type: "callout", kind: "info", title: "Storing heights",
          text: "Production AVL trees store the height (or bf) on each node so bf() is O(1) instead of O(n)." },
      ],
    },
    {
      slug: "rotations",
      title: "Rotations",
      eyebrow: "AVL · 3",
      description: "Four rotation shapes: LL, RR, LR, RL — every fix is one of these.",
      difficulty: "Intermediate",
      readMinutes: 5,
      sections: [
        { type: "table", headers: ["Case", "Shape", "Fix"], rows: [
          ["Left-Left (LL)", "Inserted into left subtree of left child", "Single right rotation"],
          ["Right-Right (RR)", "Inserted into right subtree of right child", "Single left rotation"],
          ["Left-Right (LR)", "Inserted into right subtree of left child", "Left-rotate child, then right-rotate node"],
          ["Right-Left (RL)", "Inserted into left subtree of right child", "Right-rotate child, then left-rotate node"],
        ]},
      ],
    },
    {
      slug: "ll-rotation",
      title: "LL Rotation",
      eyebrow: "AVL · 4",
      description: "Single right rotation — restores balance when the excess sits on the outer left.",
      difficulty: "Intermediate",
      readMinutes: 3,
      sections: [
        { type: "code", code:
`def rotate_right(y):
    x = y.left
    T2 = x.right
    x.right = y
    y.left  = T2
    y.height = 1 + max(h(y.left), h(y.right))
    x.height = 1 + max(h(x.left), h(x.right))
    return x` },
      ],
    },
    {
      slug: "rr-rotation",
      title: "RR Rotation",
      eyebrow: "AVL · 5",
      description: "Single left rotation — mirror of LL.",
      difficulty: "Intermediate",
      readMinutes: 2,
      sections: [
        { type: "code", code:
`def rotate_left(x):
    y = x.right
    T2 = y.left
    y.left  = x
    x.right = T2
    x.height = 1 + max(h(x.left), h(x.right))
    y.height = 1 + max(h(y.left), h(y.right))
    return y` },
      ],
    },
    {
      slug: "lr-rotation",
      title: "LR Rotation",
      eyebrow: "AVL · 6",
      description: "A left rotation on the child, then a right rotation on the node.",
      difficulty: "Intermediate",
      readMinutes: 3,
      sections: [
        { type: "code", code:
`# unbalanced case: bf(node) = +2 and bf(node.left) = -1
node.left = rotate_left(node.left)
return rotate_right(node)` },
      ],
    },
    {
      slug: "rl-rotation",
      title: "RL Rotation",
      eyebrow: "AVL · 7",
      description: "A right rotation on the child, then a left rotation on the node.",
      difficulty: "Intermediate",
      readMinutes: 3,
      sections: [
        { type: "code", code:
`# unbalanced case: bf(node) = -2 and bf(node.right) = +1
node.right = rotate_right(node.right)
return rotate_left(node)` },
      ],
    },
    {
      slug: "insertion",
      title: "Insertion",
      eyebrow: "AVL · 8",
      description: "Standard BST insert plus rebalance on the way up.",
      difficulty: "Advanced",
      readMinutes: 4,
      sections: [
        { type: "code", title: "insert + rebalance", code:
`def insert(root, v):
    if not root: return Node(v)
    if v < root.val: root.left  = insert(root.left,  v)
    else:            root.right = insert(root.right, v)
    root.height = 1 + max(h(root.left), h(root.right))
    b = bf(root)
    if b >  1 and v < root.left.val:  return rotate_right(root)          # LL
    if b < -1 and v > root.right.val: return rotate_left(root)           # RR
    if b >  1 and v > root.left.val:                                     # LR
        root.left = rotate_left(root.left); return rotate_right(root)
    if b < -1 and v < root.right.val:                                    # RL
        root.right = rotate_right(root.right); return rotate_left(root)
    return root` },
      ],
    },
    {
      slug: "deletion",
      title: "Deletion",
      eyebrow: "AVL · 9",
      description: "Standard BST delete plus rebalance on the way up — up to O(log n) rotations.",
      difficulty: "Advanced",
      readMinutes: 4,
      sections: [
        { type: "theory", text: "AVL deletion mirrors insertion but may trigger more rotations — each ancestor whose balance factor breaks must be rebalanced. The number of rotations is bounded by the height, so still O(log n)." },
      ],
    },
    {
      slug: "applications",
      title: "Applications",
      eyebrow: "AVL · 10",
      description: "Where you'd reach for AVL rather than a Red-Black tree.",
      difficulty: "Beginner",
      readMinutes: 2,
      sections: [
        { type: "theory", bullets: [
          "Read-heavy workloads — AVL is more strictly balanced than RB.",
          "In-memory ordered maps / sets when lookups dominate.",
          "Databases with expensive disk reads that benefit from tighter balance.",
        ]},
      ],
    },
    {
      slug: "complexity",
      title: "Complexity",
      eyebrow: "AVL · 11",
      description: "O(log n) all round — that's the point.",
      difficulty: "Beginner",
      readMinutes: 2,
      sections: [
        { type: "complexity", rows: [
          { op: "Search", time: "O(log n)", note: "Tighter bound than RB" },
          { op: "Insert", time: "O(log n)", note: "≤ 2 rotations" },
          { op: "Delete", time: "O(log n)", note: "≤ log n rotations" },
        ]},
      ],
    },
    {
      slug: "practice",
      title: "Practice",
      eyebrow: "AVL · 12",
      description: "Focused problems on self-balancing BSTs.",
      difficulty: "Advanced",
      readMinutes: 3,
      sections: [
        { type: "practice", groups: [
          { level: "Intermediate", items: [
            { title: "LC 108 · Sorted Array to Balanced BST", url: "https://leetcode.com/problems/convert-sorted-array-to-binary-search-tree/", difficulty: "Easy" },
            { title: "LC 1382 · Balance a BST", url: "https://leetcode.com/problems/balance-a-binary-search-tree/", difficulty: "Medium" },
          ]},
        ]},
      ],
    },
    {
      slug: "quiz",
      title: "Quiz",
      eyebrow: "AVL · 13",
      description: "Confirm which rotation fixes which case.",
      difficulty: "Intermediate",
      readMinutes: 2,
      sections: [
        { type: "quiz", items: [
          { q: "You inserted into the right subtree of the left child (LR case). Which rotation restores balance?",
            choices: ["Single right", "Single left", "Left then right", "Right then left"],
            answer: 2, explain: "LR = rotate left on the child, then right on the node." },
        ]},
      ],
    },
    {
      slug: "references",
      title: "References",
      eyebrow: "AVL · 14",
      description: "Further reading.",
      difficulty: "Beginner",
      readMinutes: 1,
      sections: [
        { type: "references", items: [
          { label: "Wikipedia — AVL tree", url: "https://en.wikipedia.org/wiki/AVL_tree" },
          { label: "Visualgo — BST/AVL", url: "https://visualgo.net/en/bst" },
        ]},
      ],
    },
  ],
};

// ----------------------------------------------------------------------------
// Red-Black Tree
// ----------------------------------------------------------------------------
export const V_RB: TreeVariantMeta = {
  slug: "red-black",
  title: "Red-Black Tree",
  tagline: "A looser self-balancing BST — used inside std::map, TreeMap, and the Linux CFS scheduler.",
  lessons: [
    {
      slug: "introduction",
      title: "Introduction",
      eyebrow: "Red-Black · 1",
      description: "A BST where each node is coloured red or black to keep height ≤ 2·log(n+1).",
      difficulty: "Intermediate",
      readMinutes: 4,
      sections: [
        { type: "theory", text: "A Red-Black Tree is a self-balancing binary search tree in which every node carries one extra bit of information — its colour, red or black. By enforcing five simple colouring rules on top of the usual BST ordering, the tree guarantees its height stays within 2·log₂(n+1), which makes search, insert, and delete O(log n) even under adversarial input." },
        { type: "theory", text: "Compared to AVL trees, Red-Black trees are less strictly balanced but require fewer rotations per mutation — an insert triggers at most two rotations, a delete at most three. That trade-off makes them the balanced BST of choice inside general-purpose libraries: C++'s std::map/std::set, Java's TreeMap/TreeSet, and the Linux Completely Fair Scheduler are all Red-Black trees." },
        { type: "tree", root: {
          id: 20, label: 20, color: "black",
          children: [
            { id: 10, label: 10, color: "red", children: [{ id: 5, label: 5, color: "black" }, { id: 15, label: 15, color: "black" }]},
            { id: 30, label: 30, color: "red", children: [{ id: 25, label: 25, color: "black" }, { id: 40, label: 40, color: "black" }]},
          ],
        }, caption: "A valid RB tree — root black, no two reds adjacent, equal black-height on every root-to-NIL path." },
        { type: "callout", kind: "interview", title: "Why RB and not AVL?",
          text: "Interviewers love this question. Short answer: RB trees are faster to update because they need fewer rotations. AVL trees are faster to search because they're more tightly balanced. Databases, kernels, and standard libraries pick RB because writes matter as much as reads." },
      ],
    },
    {
      slug: "why-red-black",
      title: "Why Red-Black Trees?",
      eyebrow: "Red-Black · 2",
      description: "Understanding the trade-off that RB trees solve.",
      difficulty: "Beginner",
      readMinutes: 3,
      sections: [
        { type: "theory", text: "A plain BST degenerates to a linked list on sorted input, taking O(n) per operation. AVL fixes this by re-balancing aggressively — but pays for it with more rotations and taller code. Red-Black trees answer 'can we bound the height cheaply, tolerating a bit of imbalance?'" },
        { type: "table", headers: ["Property", "AVL", "Red-Black"], rows: [
          ["Max height", "1.44 · log₂(n)", "2 · log₂(n+1)"],
          ["Rotations on insert", "≤ 2", "≤ 2"],
          ["Rotations on delete", "≤ O(log n)", "≤ 3"],
          ["Extra info per node", "height / bf", "1 colour bit"],
          ["Best for", "Search-heavy workloads", "Mixed / write-heavy workloads"],
        ]},
        { type: "callout", kind: "info", text: "std::map, Java TreeMap, and the Linux kernel all picked Red-Black — a strong empirical signal that fewer rotations wins in general-purpose code." },
      ],
    },
    {
      slug: "properties",
      title: "Red-Black Properties",
      eyebrow: "Red-Black · 3",
      description: "Five invariants that together guarantee logarithmic height.",
      difficulty: "Intermediate",
      readMinutes: 4,
      sections: [
        { type: "theory", bullets: [
          "1. Every node is coloured red or black.",
          "2. The root is black.",
          "3. Every leaf (the sentinel NIL) is black.",
          "4. A red node cannot have a red child — no two reds in a row.",
          "5. Every path from a node to any descendant NIL contains the same number of black nodes (its black-height).",
        ]},
        { type: "callout", kind: "did", title: "Why these five?",
          text: "Property 5 fixes a minimum path length in black nodes. Property 4 prevents red 'padding' on any path. Together they force the longest path ≤ 2× the shortest — enough to bound the height at ~2·log n without demanding perfect balance." },
        { type: "rbPlayground", caption: "Insert values and watch the invariants stay true after each fixup." },
      ],
    },
    {
      slug: "node-coloring",
      title: "Node Coloring",
      eyebrow: "Red-Black · 4",
      description: "One bit of state per node — but a lot of meaning packed into it.",
      difficulty: "Beginner",
      readMinutes: 3,
      sections: [
        { type: "theory", text: "Every node stores a colour. Newly inserted nodes are always coloured red — inserting a black node would immediately break property 5 (black-height equality). Starting red only risks breaking property 4 (no red-red), which is cheap to fix." },
        { type: "code", title: "Node class", code:
`RED, BLACK = 0, 1  # sentinel constants

class RBNode:
    __slots__ = ("val", "color", "left", "right", "parent")
    def __init__(self, val, color=RED, parent=None):
        self.val = val
        self.color = color
        self.left = self.right = None
        self.parent = parent

    def is_red(self):   return self.color == RED
    def is_black(self): return self.color == BLACK` },
        { type: "callout", kind: "tip", title: "Sentinel NIL",
          text: "Production implementations use one shared black 'NIL' sentinel instead of Python None. This lets rotation code touch parent pointers uniformly without checking for None everywhere." },
      ],
    },
    {
      slug: "black-height",
      title: "Black Height",
      eyebrow: "Red-Black · 5",
      description: "The single number that governs the tree's shape.",
      difficulty: "Intermediate",
      readMinutes: 3,
      sections: [
        { type: "theory", text: "The black-height of a node is the number of black nodes on any path from it (exclusive) down to a NIL leaf. Property 5 says every such path has the same black-height. This is what caps the height." },
        { type: "table", headers: ["Node", "Colour", "Black-height"], rows: [
          ["20 (root)", "black", "2"],
          ["10, 30", "red", "2"],
          ["5, 15, 25, 40", "black", "1"],
          ["NIL", "black", "0"],
        ]},
        { type: "callout", kind: "perf", text: "For any RB tree with n internal nodes, height ≤ 2·log₂(n+1). Proof sketch: the subtree rooted at any node with black-height b contains ≥ 2ᵇ − 1 internal nodes." },
      ],
    },
    {
      slug: "memory-representation",
      title: "Memory Representation",
      eyebrow: "Red-Black · 6",
      description: "Every node holds value, colour, two child pointers, and a parent pointer.",
      difficulty: "Beginner",
      readMinutes: 3,
      sections: [
        { type: "memoryDiagram", nodes: [
          { id: "n20", value: "20 · B", left: "n10", right: "n30" },
          { id: "n10", value: "10 · R", left: "n5",  right: "n15" },
          { id: "n30", value: "30 · R", left: "n25", right: "n40" },
          { id: "n5",  value: "5 · B",  left: null,  right: null },
          { id: "n15", value: "15 · B", left: null,  right: null },
          { id: "n25", value: "25 · B", left: null,  right: null },
          { id: "n40", value: "40 · B", left: null,  right: null },
        ], caption: "Each node holds a value, a colour bit, and left / right / parent pointers." },
        { type: "callout", kind: "info", text: "The parent pointer is what lets insert-fixup walk upward in O(1) per step. AVL trees can also skip it by returning values on the recursion stack." },
      ],
    },
    {
      slug: "rotations",
      title: "Rotations",
      eyebrow: "Red-Black · 7",
      description: "Same left/right rotations as AVL — used sparingly to fix red-red or double-black cases.",
      difficulty: "Intermediate",
      readMinutes: 4,
      sections: [
        { type: "theory", text: "A rotation restructures three nodes in O(1) while preserving BST order. Left-rotate at x makes x the left child of its right child y. Right-rotate is the mirror." },
        { type: "code", title: "left_rotate / right_rotate", code:
`def left_rotate(T, x):
    y = x.right
    x.right = y.left
    if y.left: y.left.parent = x
    y.parent = x.parent
    if not x.parent: T.root = y
    elif x is x.parent.left: x.parent.left  = y
    else:                    x.parent.right = y
    y.left = x
    x.parent = y

def right_rotate(T, x):
    y = x.left
    x.left = y.right
    if y.right: y.right.parent = x
    y.parent = x.parent
    if not x.parent: T.root = y
    elif x is x.parent.right: x.parent.right = y
    else:                     x.parent.left  = y
    y.right = x
    x.parent = y` },
      ],
    },
    {
      slug: "recoloring",
      title: "Recoloring",
      eyebrow: "Red-Black · 8",
      description: "Cheaper than a rotation — just repaint parent, uncle, and grandparent.",
      difficulty: "Intermediate",
      readMinutes: 3,
      sections: [
        { type: "theory", text: "When a red node has a red parent AND a red uncle, we recolour: parent and uncle become black, grandparent becomes red, then recurse on the grandparent. No rotation needed. This is the fast path — most inserts finish here." },
        { type: "table", headers: ["Before", "Action", "After"], rows: [
          ["Parent = red, Uncle = red", "Recolour up", "Parent + uncle black, grandparent red"],
          ["Parent = red, Uncle = black, node on outer side", "Single rotation + recolour", "Balanced"],
          ["Parent = red, Uncle = black, node on inner side", "Two rotations + recolour", "Balanced"],
        ]},
      ],
    },
    {
      slug: "insertion",
      title: "Insertion",
      eyebrow: "Red-Black · 9",
      description: "Standard BST insert (as red) then walk up fixing red-red violations.",
      difficulty: "Advanced",
      readMinutes: 6,
      sections: [
        { type: "theory", text: "Insert like a plain BST, colour the new node red, then call insert_fixup. Fixup climbs from the new node, handling the three cases above until either the parent turns black or we reach the root (which we then paint black)." },
        { type: "code", title: "insert + insert_fixup", code:
`def insert(T, val):
    z = RBNode(val, RED)
    y, x = None, T.root
    while x:
        y = x
        x = x.left if val < x.val else x.right
    z.parent = y
    if not y:            T.root = z
    elif val < y.val:    y.left  = z
    else:                y.right = z
    insert_fixup(T, z)

def insert_fixup(T, z):
    while z.parent and z.parent.is_red():
        gp = z.parent.parent
        if z.parent is gp.left:
            uncle = gp.right
            if uncle and uncle.is_red():            # case 1: recolour
                z.parent.color = uncle.color = BLACK
                gp.color = RED
                z = gp
            else:
                if z is z.parent.right:              # case 2: inner → rotate to outer
                    z = z.parent; left_rotate(T, z)
                z.parent.color = BLACK               # case 3: outer → rotate gp
                gp.color = RED
                right_rotate(T, gp)
        else:                                        # mirror of the above
            uncle = gp.left
            if uncle and uncle.is_red():
                z.parent.color = uncle.color = BLACK
                gp.color = RED
                z = gp
            else:
                if z is z.parent.left:
                    z = z.parent; right_rotate(T, z)
                z.parent.color = BLACK
                gp.color = RED
                left_rotate(T, gp)
    T.root.color = BLACK` },
        { type: "dryRun", caption: "Insert 10, 20, 30 into an empty tree",
          headers: ["Step", "Action", "Tree"], rows: [
            ["1", "Insert 10 (red), recolour root → black", "10(B)"],
            ["2", "Insert 20 (red) as right child of 10", "10(B) → 20(R)"],
            ["3", "Insert 30 (red) as right child of 20 — red-red violation with parent 20", "unbalanced"],
            ["4", "Case 3 (uncle is NIL/black, outer side): left-rotate at 10, swap colours 10↔20", "20(B) with 10(R) left, 30(R) right"],
          ]},
      ],
    },
    {
      slug: "deletion",
      title: "Deletion",
      eyebrow: "Red-Black · 10",
      description: "Handle the 'double-black' node with four fixup cases.",
      difficulty: "Advanced",
      readMinutes: 6,
      sections: [
        { type: "theory", text: "Deletion mirrors BST deletion but must repair black-height if the removed (or replacement) node was black. We model the deficit by giving the replacement an extra 'black' — a 'double-black' — then eliminate it via four cases based on the sibling's colour and its children." },
        { type: "code", title: "delete_fixup — the four cases", code:
`def delete_fixup(T, x):
    while x is not T.root and (x is None or x.is_black()):
        parent = x.parent
        if x is parent.left:
            w = parent.right
            if w.is_red():                            # Case 1
                w.color = BLACK; parent.color = RED
                left_rotate(T, parent); w = parent.right
            if (not w.left  or w.left.is_black()) and \\
               (not w.right or w.right.is_black()):    # Case 2
                w.color = RED
                x = parent
            else:
                if not w.right or w.right.is_black(): # Case 3
                    if w.left: w.left.color = BLACK
                    w.color = RED
                    right_rotate(T, w); w = parent.right
                w.color = parent.color                # Case 4
                parent.color = BLACK
                if w.right: w.right.color = BLACK
                left_rotate(T, parent); x = T.root
        else:
            ...  # symmetric
    if x: x.color = BLACK` },
        { type: "callout", kind: "warn", title: "Hardest routine in the book",
          text: "RB delete_fixup is famously fiddly. Beginners should be able to explain the four cases; production code should be copied from a battle-tested reference (CLRS Ch. 13)." },
      ],
    },
    {
      slug: "searching",
      title: "Searching",
      eyebrow: "Red-Black · 11",
      description: "Exactly the same as any BST — colour is irrelevant to lookup.",
      difficulty: "Beginner",
      readMinutes: 2,
      sections: [
        { type: "code", code:
`def search(node, val):
    while node and node.val != val:
        node = node.left if val < node.val else node.right
    return node` },
        { type: "callout", kind: "perf", text: "Because height ≤ 2·log(n+1), search is guaranteed O(log n) — the whole point of colouring." },
      ],
    },
    {
      slug: "maintaining-balance",
      title: "Maintaining Balance",
      eyebrow: "Red-Black · 12",
      description: "Why the five properties are enough to keep the tree short.",
      difficulty: "Advanced",
      readMinutes: 3,
      sections: [
        { type: "theory", text: "Every RB mutation preserves properties 1, 3, and 5 automatically. Only property 4 (no red-red) and property 2 (root is black) can be broken temporarily — insert_fixup and delete_fixup restore them in O(log n) time. The colour system is chosen precisely so that this repair is bounded in rotations." },
      ],
    },
    {
      slug: "applications",
      title: "Applications",
      eyebrow: "Red-Black · 13",
      description: "Where you'll find RB trees in production.",
      difficulty: "Beginner",
      readMinutes: 2,
      sections: [
        { type: "theory", bullets: [
          "C++ std::map, std::set — every ordered container.",
          "Java TreeMap, TreeSet, ConcurrentSkipListMap fallbacks.",
          "Linux kernel — Completely Fair Scheduler and epoll interval trees.",
          "Nginx — timer wheels and event scheduling.",
          "Databases — process control blocks and query planners.",
        ]},
      ],
    },
    {
      slug: "advantages",
      title: "Advantages",
      eyebrow: "Red-Black · 14",
      description: "What you get out of choosing RB over other balanced BSTs.",
      difficulty: "Beginner",
      readMinutes: 2,
      sections: [
        { type: "theory", bullets: [
          "Guaranteed O(log n) worst case for search / insert / delete.",
          "Few rotations per mutation — ≤ 2 on insert, ≤ 3 on delete.",
          "Only one extra bit of memory per node.",
          "Iterative implementation is possible (no recursion depth risk).",
          "Battle-tested — the default in most standard libraries.",
        ]},
      ],
    },
    {
      slug: "disadvantages",
      title: "Disadvantages",
      eyebrow: "Red-Black · 15",
      description: "Where RB is not the right pick.",
      difficulty: "Beginner",
      readMinutes: 2,
      sections: [
        { type: "theory", bullets: [
          "Delete-fixup is complex and error-prone to implement from scratch.",
          "Slightly slower search than AVL under read-heavy workloads.",
          "Extra parent pointer costs one word per node.",
          "Not cache-friendly compared to B-Trees on disk.",
        ]},
      ],
    },
    {
      slug: "complexity",
      title: "Complexity",
      eyebrow: "Red-Black · 16",
      description: "Same as AVL asymptotically, better constant on mutation.",
      difficulty: "Beginner",
      readMinutes: 2,
      sections: [
        { type: "complexity", rows: [
          { op: "Search", time: "O(log n)", space: "O(1)", note: "Slightly higher constant than AVL" },
          { op: "Insert", time: "O(log n)", space: "O(1)", note: "≤ 2 rotations + O(log n) recolouring" },
          { op: "Delete", time: "O(log n)", space: "O(1)", note: "≤ 3 rotations + O(log n) recolouring" },
          { op: "Space", time: "—", space: "O(n)", note: "One colour bit + parent pointer per node" },
        ]},
      ],
    },
    {
      slug: "python-implementation",
      title: "Complete Python Implementation",
      eyebrow: "Red-Black · 17",
      description: "A production-shaped RBTree class with search, insert, and delete.",
      difficulty: "Advanced",
      readMinutes: 8,
      sections: [
        { type: "code", title: "rbtree.py", code:
`RED, BLACK = 0, 1

class RBNode:
    __slots__ = ("val", "color", "left", "right", "parent")
    def __init__(self, val, color=RED):
        self.val = val
        self.color = color
        self.left = self.right = self.parent = None

class RBTree:
    def __init__(self):
        self.root = None

    # ---------- rotations ----------
    def _left_rotate(self, x):
        y = x.right
        x.right = y.left
        if y.left: y.left.parent = x
        y.parent = x.parent
        if not x.parent: self.root = y
        elif x is x.parent.left: x.parent.left = y
        else: x.parent.right = y
        y.left = x
        x.parent = y

    def _right_rotate(self, x):
        y = x.left
        x.left = y.right
        if y.right: y.right.parent = x
        y.parent = x.parent
        if not x.parent: self.root = y
        elif x is x.parent.right: x.parent.right = y
        else: x.parent.left = y
        y.right = x
        x.parent = y

    # ---------- search ----------
    def search(self, val):
        n = self.root
        while n and n.val != val:
            n = n.left if val < n.val else n.right
        return n

    # ---------- insert ----------
    def insert(self, val):
        z = RBNode(val, RED)
        y, x = None, self.root
        while x:
            y = x
            x = x.left if val < x.val else x.right
        z.parent = y
        if not y:            self.root = z
        elif val < y.val:    y.left  = z
        else:                y.right = z
        self._insert_fixup(z)

    def _insert_fixup(self, z):
        while z.parent and z.parent.color == RED:
            gp = z.parent.parent
            if z.parent is gp.left:
                u = gp.right
                if u and u.color == RED:
                    z.parent.color = u.color = BLACK
                    gp.color = RED
                    z = gp
                else:
                    if z is z.parent.right:
                        z = z.parent; self._left_rotate(z)
                    z.parent.color = BLACK
                    gp.color = RED
                    self._right_rotate(gp)
            else:
                u = gp.left
                if u and u.color == RED:
                    z.parent.color = u.color = BLACK
                    gp.color = RED
                    z = gp
                else:
                    if z is z.parent.left:
                        z = z.parent; self._right_rotate(z)
                    z.parent.color = BLACK
                    gp.color = RED
                    self._left_rotate(gp)
        self.root.color = BLACK

    # ---------- traversal helper ----------
    def inorder(self):
        out = []
        def go(n):
            if not n: return
            go(n.left); out.append((n.val, "R" if n.color == RED else "B")); go(n.right)
        go(self.root)
        return out` },
        { type: "callout", kind: "tip", title: "Delete omitted for readability",
          text: "Delete + delete_fixup adds ~60 lines. The 'Deletion' lesson above has the fixup skeleton; a complete listing is in CLRS Ch. 13.4." },
      ],
    },
    {
      slug: "interactive-playground",
      title: "Interactive Visualization",
      eyebrow: "Red-Black · 18",
      description: "Insert values live and watch colouring, rotations, and fixups.",
      difficulty: "Intermediate",
      readMinutes: 3,
      sections: [
        { type: "rbPlayground", caption: "Insert a sequence like 10, 20, 30, 15, 25, 5 and observe how colouring keeps height low." },
      ],
    },
    {
      slug: "dry-run",
      title: "Dry Run",
      eyebrow: "Red-Black · 19",
      description: "Trace insert of 10, 20, 30, 15 step-by-step.",
      difficulty: "Intermediate",
      readMinutes: 4,
      sections: [
        { type: "dryRun", headers: ["Step", "Insert", "Case", "Result"], rows: [
          ["1", "10", "Root (auto-black)", "10(B)"],
          ["2", "20", "Parent black → no fixup", "10(B) → 20(R)"],
          ["3", "30", "Uncle NIL, outer right — left-rotate at 10, swap colours", "20(B), 10(R), 30(R)"],
          ["4", "15", "Uncle 30 is red — recolour: 10, 30 → B; 20 → R; root repaint → B", "20(B), 10(B), 30(B), 15(R)"],
        ]},
      ],
    },
    {
      slug: "common-mistakes",
      title: "Common Mistakes",
      eyebrow: "Red-Black · 20",
      description: "Where beginners consistently trip.",
      difficulty: "Intermediate",
      readMinutes: 3,
      sections: [
        { type: "mistakes", items: [
          "Forgetting to repaint the root black at the end of insert_fixup.",
          "Treating None as red — NIL is always black.",
          "Confusing the uncle's colour with the sibling's colour (sibling matters only in delete).",
          "Doing only one rotation for an inner-side red-red — the LR/RL analogue needs two.",
          "Skipping the parent pointer update inside rotations.",
        ]},
      ],
    },
    {
      slug: "faq",
      title: "FAQ",
      eyebrow: "Red-Black · 21",
      description: "The most-asked Red-Black questions, answered in depth.",
      difficulty: "Intermediate",
      readMinutes: 5,
      sections: [
        { type: "heading", text: "Why is the root always black?" },
        { type: "theory", text: "It's a bookkeeping convenience. A black root makes property 5 (equal black-height) count uniformly from the top, and it means insert_fixup can terminate simply by painting the root black after the loop." },
        { type: "heading", text: "Why start new nodes red instead of black?" },
        { type: "theory", text: "Inserting a red node can only break property 4 (no red-red), which we can fix locally. Inserting a black node would immediately break property 5 on every path through the new node — much harder to repair." },
        { type: "heading", text: "AVL vs Red-Black — how do I actually choose?" },
        { type: "theory", text: "If searches vastly outnumber mutations, prefer AVL: it's ~10% shorter on average and cache access wins. If mutations are common (queues, schedulers, ordered maps), prefer Red-Black: its bounded rotation count means lower worst-case latency per operation." },
        { type: "heading", text: "How many rotations per insert / delete?" },
        { type: "theory", text: "Insert: at most 2 rotations, plus O(log n) recolourings. Delete: at most 3 rotations, plus O(log n) recolourings. Recolouring is cheap — a single memory write — so real-world mutation is fast." },
      ],
    },
    {
      slug: "interview-questions",
      title: "Interview Questions",
      eyebrow: "Red-Black · 22",
      description: "How to talk about RB trees under pressure.",
      difficulty: "Intermediate",
      readMinutes: 3,
      sections: [
        { type: "interview", items: [
          "State the five RB properties from memory.",
          "AVL vs Red-Black — when would you pick each?",
          "Why is the root always black?",
          "What is black-height and why is it constant on every path?",
          "How many rotations can a single insert cause? A single delete?",
          "Walk through inserting 10, 20, 30 into an empty RB tree.",
          "What breaks if we insert new nodes as black instead of red?",
          "Explain the 'double-black' concept in delete_fixup.",
          "Why do standard libraries (std::map, TreeMap) use RB over AVL?",
          "Prove that RB tree height ≤ 2·log₂(n+1).",
        ]},
      ],
    },
    {
      slug: "practice",
      title: "Practice Problems",
      eyebrow: "Red-Black · 23",
      description: "Most languages ship an RB tree — practice by using it.",
      difficulty: "Intermediate",
      readMinutes: 3,
      sections: [
        { type: "practice", groups: [
          { level: "Beginner", items: [
            { title: "LC 703 · Kth Largest in Stream (SortedList)", url: "https://leetcode.com/problems/kth-largest-element-in-a-stream/", difficulty: "Easy", pattern: "Ordered container" },
            { title: "LC 1046 · Last Stone Weight", url: "https://leetcode.com/problems/last-stone-weight/", difficulty: "Easy", pattern: "Ordered container" },
          ]},
          { level: "Intermediate", items: [
            { title: "LC 220 · Contains Duplicate III (SortedContainers)", url: "https://leetcode.com/problems/contains-duplicate-iii/", difficulty: "Medium", pattern: "Ordered window" },
            { title: "LC 855 · Exam Room", url: "https://leetcode.com/problems/exam-room/", difficulty: "Medium", pattern: "Ordered set" },
            { title: "LC 729 · My Calendar I", url: "https://leetcode.com/problems/my-calendar-i/", difficulty: "Medium", pattern: "Interval tree" },
          ]},
          { level: "Advanced", items: [
            { title: "LC 315 · Count of Smaller Numbers After Self", url: "https://leetcode.com/problems/count-of-smaller-numbers-after-self/", difficulty: "Hard", pattern: "Order statistic tree" },
            { title: "LC 493 · Reverse Pairs", url: "https://leetcode.com/problems/reverse-pairs/", difficulty: "Hard", pattern: "Order statistic tree" },
            { title: "LC 732 · My Calendar III", url: "https://leetcode.com/problems/my-calendar-iii/", difficulty: "Hard", pattern: "Sweep + ordered map" },
          ]},
        ]},
      ],
    },
    {
      slug: "quiz",
      title: "Quiz",
      eyebrow: "Red-Black · 24",
      description: "Confirm the invariants and cases.",
      difficulty: "Intermediate",
      readMinutes: 3,
      sections: [
        { type: "quiz", items: [
          { q: "Which property is violated when a red node has a red child?",
            choices: ["Property 2 (root)", "Property 4 (no red-red)", "Property 5 (black-height)", "None"],
            answer: 1, explain: "Property 4 forbids two consecutive red nodes on any path." },
          { q: "What is the maximum height of an RB tree with n nodes?",
            choices: ["log₂(n)", "1.44·log₂(n)", "2·log₂(n+1)", "n"],
            answer: 2, explain: "The loose balance guarantees height ≤ 2·log₂(n+1)." },
          { q: "How many rotations can a single insert cause?",
            choices: ["0", "≤ 2", "≤ 3", "O(log n)"],
            answer: 1, explain: "Insert triggers at most two rotations plus O(log n) recolourings." },
          { q: "In insert_fixup, when the uncle is red we…",
            choices: ["Rotate on the grandparent", "Recolour parent, uncle, grandparent and recurse", "Swap the node with its parent", "Do nothing"],
            answer: 1, explain: "The recolour case pushes the violation up two levels — no rotation." },
        ]},
      ],
    },
    {
      slug: "references",
      title: "References",
      eyebrow: "Red-Black · 25",
      description: "Further reading.",
      difficulty: "Beginner",
      readMinutes: 1,
      sections: [
        { type: "references", items: [
          { label: "CLRS — Introduction to Algorithms, Ch. 13", url: "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/" },
          { label: "Wikipedia — Red-Black tree", url: "https://en.wikipedia.org/wiki/Red%E2%80%93black_tree" },
          { label: "Visualgo — BST / RB", url: "https://visualgo.net/en/bst" },
          { label: "Linux kernel rbtree.h", url: "https://github.com/torvalds/linux/blob/master/include/linux/rbtree.h" },
          { label: "Sedgewick — Left-leaning Red-Black Trees", url: "https://sedgewick.io/wp-content/themes/sedgewick/papers/2008LLRB.pdf" },
        ]},
      ],
    },
  ],
};

// ----------------------------------------------------------------------------
// B-Tree
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
// B-Tree
// ----------------------------------------------------------------------------
export const V_BTREE: TreeVariantMeta = {
  slug: "b-tree",
  title: "B-Tree",
  tagline: "A multi-way balanced search tree tuned for block storage — the backbone of every database index.",
  lessons: [
    {
      slug: "introduction",
      title: "Introduction",
      eyebrow: "B-Tree · 1",
      description: "A generalisation of the BST where each node holds many keys and points to many children.",
      difficulty: "Intermediate",
      readMinutes: 4,
      sections: [
        { type: "theory", text: "Bayer & McCreight introduced the B-Tree in 1972 for disk-resident indexes. By packing hundreds of keys into one node, a B-Tree collapses the tree height so that a lookup over 10⁸ records touches only 4–5 disk blocks. Every relational database, most filesystems, and many key-value stores use a B-Tree variant." },
        { type: "callout", kind: "info", title: "Why not a BST on disk?", text: "A BST with 10⁸ keys has height ~27. On disk that's 27 seeks per lookup ≈ 270 ms. A B-Tree with t=100 does 5 seeks — ~50 ms — because every seek reads a whole block full of keys." },
      ],
    },
    {
      slug: "structure",
      title: "Internal Structure",
      eyebrow: "B-Tree · 2",
      description: "The invariants that define a B-Tree of minimum degree t.",
      difficulty: "Intermediate",
      readMinutes: 3,
      sections: [
        { type: "theory", bullets: [
          "Every node holds between t−1 and 2t−1 keys (root may hold as few as 1).",
          "A non-leaf node with k keys has exactly k+1 child pointers.",
          "Keys inside a node are stored sorted.",
          "All leaves live at the same depth — the tree is perfectly height-balanced.",
          "Height h ≤ log_t((n+1)/2).",
        ]},
        { type: "table", headers: ["Term", "Meaning"], rows: [
          ["Minimum degree t", "Branching factor. t=2 is the 2-3-4 tree."],
          ["Order m", "Maximum children per node (m = 2t)."],
          ["Fan-out", "Actual children of a node (t..2t)."],
          ["Leaf", "Node with no children — holds keys only."],
        ]},
      ],
    },
    {
      slug: "node-structure",
      title: "Node Structure",
      eyebrow: "B-Tree · 3",
      description: "A B-Tree node in Python.",
      difficulty: "Intermediate",
      readMinutes: 3,
      sections: [
        { type: "code", code:
`class BTreeNode:
    __slots__ = ("keys", "children", "leaf")

    def __init__(self, leaf: bool = True):
        self.keys: list = []          # sorted list of up to 2t-1 keys
        self.children: list = []      # up to 2t child pointers
        self.leaf = leaf              # True if no children

    def is_full(self, t: int) -> bool:
        return len(self.keys) == 2 * t - 1` },
      ],
    },
    {
      slug: "memory-representation",
      title: "Memory Representation",
      eyebrow: "B-Tree · 4",
      description: "One node = one disk block. That single design choice explains B-Trees.",
      difficulty: "Intermediate",
      readMinutes: 3,
      sections: [
        { type: "theory", text: "A node is sized to fit exactly in a disk page (typically 4 KiB or 8 KiB). All keys and child pointers are packed contiguously so a single read yields the entire node." },
        { type: "memoryDiagram", nodes: [
          { id: "root", value: "[10, 20, 30]", left: "c0", right: "c3" },
          { id: "c0", value: "[3, 7]", left: null, right: null },
          { id: "c3", value: "[35, 40, 50]", left: null, right: null },
        ], caption: "Simplified 3-key root with sibling leaves — each row is one disk page." },
      ],
    },
    {
      slug: "creation",
      title: "Creation",
      eyebrow: "B-Tree · 5",
      description: "Bootstrap an empty B-Tree with a chosen minimum degree.",
      difficulty: "Beginner",
      readMinutes: 2,
      sections: [
        { type: "code", code:
`class BTree:
    def __init__(self, t: int = 3):
        assert t >= 2
        self.t = t
        self.root = BTreeNode(leaf=True)` },
        { type: "callout", kind: "tip", text: "Databases pick t so 2t·pointer_size ≈ page size — usually a few hundred." },
      ],
    },
    {
      slug: "search",
      title: "Search",
      eyebrow: "B-Tree · 6",
      description: "Binary-search within a node, descend into the right child.",
      difficulty: "Intermediate",
      readMinutes: 3,
      sections: [
        { type: "code", code:
`def search(node, k):
    i = 0
    while i < len(node.keys) and k > node.keys[i]:
        i += 1
    if i < len(node.keys) and node.keys[i] == k:
        return node, i
    if node.leaf:
        return None
    return search(node.children[i], k)` },
        { type: "theory", text: "Cost = O(log_t n) disk reads × O(log t) in-memory binary search per node = O(log n) total comparisons but only O(log_t n) I/O." },
      ],
    },
    {
      slug: "insertion",
      title: "Insertion",
      eyebrow: "B-Tree · 7",
      description: "Descend to a leaf, insert; split any full node on the way down.",
      difficulty: "Advanced",
      readMinutes: 5,
      sections: [
        { type: "theory", text: "Classic (proactive) insertion splits any node with 2t−1 keys before descending into it. This guarantees a single top-down pass with no walk back up." },
        { type: "code", code:
`def insert(tree, k):
    r = tree.root
    if r.is_full(tree.t):
        s = BTreeNode(leaf=False)
        s.children.append(r)
        tree.root = s
        _split_child(s, 0, tree.t)
        _insert_nonfull(s, k, tree.t)
    else:
        _insert_nonfull(r, k, tree.t)

def _split_child(parent, i, t):
    y = parent.children[i]
    z = BTreeNode(leaf=y.leaf)
    z.keys = y.keys[t:]                # right half
    if not y.leaf:
        z.children = y.children[t:]
        y.children = y.children[:t]
    mid = y.keys[t - 1]                # promoted key
    y.keys = y.keys[:t - 1]            # left half
    parent.keys.insert(i, mid)
    parent.children.insert(i + 1, z)

def _insert_nonfull(node, k, t):
    i = len(node.keys) - 1
    if node.leaf:
        node.keys.append(None)
        while i >= 0 and k < node.keys[i]:
            node.keys[i + 1] = node.keys[i]; i -= 1
        node.keys[i + 1] = k
    else:
        while i >= 0 and k < node.keys[i]: i -= 1
        i += 1
        if node.children[i].is_full(t):
            _split_child(node, i, t)
            if k > node.keys[i]: i += 1
        _insert_nonfull(node.children[i], k, t)` },
      ],
    },
    {
      slug: "split-and-merge",
      title: "Split & Merge",
      eyebrow: "B-Tree · 8",
      description: "The two structural surgeries that keep a B-Tree balanced.",
      difficulty: "Advanced",
      readMinutes: 4,
      sections: [
        { type: "theory", bullets: [
          "Split (on insert): a full node y (2t−1 keys) is cut around its median. The median moves up into the parent; the right half becomes a new sibling z.",
          "Merge (on delete): two siblings each with t−1 keys are fused with the separator key from the parent, producing one 2t−1 node.",
          "Split is the reverse of merge — together they let the tree grow and shrink one level at a time only at the root.",
        ]},
      ],
    },
    {
      slug: "deletion",
      title: "Deletion",
      eyebrow: "B-Tree · 9",
      description: "The messiest B-Tree operation — borrow or merge to preserve the t−1 minimum.",
      difficulty: "Advanced",
      readMinutes: 5,
      sections: [
        { type: "theory", bullets: [
          "Case 1 — key in a leaf: remove it directly (leaf still has ≥ t−1 keys).",
          "Case 2 — key in an internal node: replace with in-order predecessor or successor (recursive delete in a child).",
          "Case 3 — key is not in this node: before descending into child c[i], ensure c[i] has ≥ t keys by borrowing from a sibling or merging.",
        ]},
        { type: "callout", kind: "warn", text: "Deletion is the reason many textbooks show B-Trees as insertion-only. Real implementations (LMDB, SQLite) all handle borrow + merge." },
      ],
    },
    {
      slug: "traversal",
      title: "Traversal",
      eyebrow: "B-Tree · 10",
      description: "In-order iteration yields sorted keys — the same pattern as a BST.",
      difficulty: "Beginner",
      readMinutes: 2,
      sections: [
        { type: "code", code:
`def inorder(node, out):
    if node is None: return
    for i, k in enumerate(node.keys):
        if not node.leaf: inorder(node.children[i], out)
        out.append(k)
    if not node.leaf: inorder(node.children[-1], out)` },
      ],
    },
    {
      slug: "complexity",
      title: "Complexity",
      eyebrow: "B-Tree · 11",
      description: "Everything is O(log_t n) — the base of the log is the win.",
      difficulty: "Beginner",
      readMinutes: 2,
      sections: [
        { type: "complexity", rows: [
          { op: "Search", time: "O(log_t n)", space: "O(1) iter · O(h) rec", note: "t=100 → h≈5 for n=10⁸" },
          { op: "Insert", time: "O(log_t n)", space: "O(h)", note: "Splits ≤ h per insert" },
          { op: "Delete", time: "O(log_t n)", space: "O(h)", note: "Merges ≤ h per delete" },
          { op: "Range scan (k results)", time: "O(log_t n + k)", note: "" },
        ]},
      ],
    },
    {
      slug: "advantages",
      title: "Advantages",
      eyebrow: "B-Tree · 12",
      description: "Why the world runs on B-Trees.",
      difficulty: "Beginner",
      readMinutes: 2,
      sections: [
        { type: "theory", bullets: [
          "Extremely shallow — one node per disk block minimises I/O.",
          "Always balanced — worst case = average case.",
          "Sorted order preserved — ranges, ORDER BY, and predecessor/successor are cheap.",
          "Bulk-loading fills nodes to 2t−1 for maximal fan-out.",
        ]},
      ],
    },
    {
      slug: "disadvantages",
      title: "Disadvantages",
      eyebrow: "B-Tree · 13",
      description: "Where B-Trees hurt.",
      difficulty: "Beginner",
      readMinutes: 2,
      sections: [
        { type: "theory", bullets: [
          "Insert/delete under high write load causes page splits/merges — hurts write throughput. LSM trees win here.",
          "Random writes across a huge index thrash the buffer pool.",
          "In-memory workloads: a hash table or a red-black tree is simpler and faster.",
        ]},
      ],
    },
    {
      slug: "applications",
      title: "Applications",
      eyebrow: "B-Tree · 14",
      description: "Storage engines, filesystems, and key-value stores.",
      difficulty: "Beginner",
      readMinutes: 2,
      sections: [
        { type: "theory", bullets: [
          "PostgreSQL, Oracle, SQL Server — B-tree indexes.",
          "MySQL InnoDB, SQLite, LMDB — B+ tree variants.",
          "HFS+, NTFS, ReiserFS, Btrfs — B-tree metadata.",
          "CouchDB, BoltDB — append-only B+ trees.",
        ]},
      ],
    },
    {
      slug: "python-implementation",
      title: "Complete Python Implementation",
      eyebrow: "B-Tree · 15",
      description: "A self-contained B-Tree with insert, search, in-order traversal, and delete stub.",
      difficulty: "Advanced",
      readMinutes: 6,
      sections: [
        { type: "code", code:
`class BTreeNode:
    __slots__ = ("keys", "children", "leaf")
    def __init__(self, leaf=True):
        self.keys, self.children, self.leaf = [], [], leaf
    def is_full(self, t): return len(self.keys) == 2 * t - 1


class BTree:
    def __init__(self, t=3):
        assert t >= 2
        self.t = t
        self.root = BTreeNode(leaf=True)

    # ---------- search ----------
    def search(self, k, node=None):
        node = node if node is not None else self.root
        i = 0
        while i < len(node.keys) and k > node.keys[i]: i += 1
        if i < len(node.keys) and node.keys[i] == k:
            return (node, i)
        return None if node.leaf else self.search(k, node.children[i])

    # ---------- insert ----------
    def insert(self, k):
        r = self.root
        if r.is_full(self.t):
            s = BTreeNode(leaf=False)
            s.children.append(r)
            self.root = s
            self._split_child(s, 0)
            self._insert_nonfull(s, k)
        else:
            self._insert_nonfull(r, k)

    def _split_child(self, parent, i):
        t, y = self.t, parent.children[i]
        z = BTreeNode(leaf=y.leaf)
        z.keys = y.keys[t:]
        if not y.leaf:
            z.children = y.children[t:]
            y.children = y.children[:t]
        mid = y.keys[t - 1]
        y.keys = y.keys[:t - 1]
        parent.keys.insert(i, mid)
        parent.children.insert(i + 1, z)

    def _insert_nonfull(self, node, k):
        i = len(node.keys) - 1
        if node.leaf:
            node.keys.append(None)
            while i >= 0 and k < node.keys[i]:
                node.keys[i + 1] = node.keys[i]; i -= 1
            node.keys[i + 1] = k
        else:
            while i >= 0 and k < node.keys[i]: i -= 1
            i += 1
            if node.children[i].is_full(self.t):
                self._split_child(node, i)
                if k > node.keys[i]: i += 1
            self._insert_nonfull(node.children[i], k)

    # ---------- traversal ----------
    def inorder(self):
        out = []
        def go(n):
            for i, k in enumerate(n.keys):
                if not n.leaf: go(n.children[i])
                out.append(k)
            if not n.leaf: go(n.children[-1])
        go(self.root)
        return out


if __name__ == "__main__":
    bt = BTree(t=3)
    for x in [10, 20, 5, 6, 12, 30, 7, 17, 3, 25, 40, 45]:
        bt.insert(x)
    print(bt.inorder())          # sorted
    print(bt.search(17) is not None)` },
      ],
    },
    {
      slug: "dry-run",
      title: "Dry Run",
      eyebrow: "B-Tree · 16",
      description: "Insert 10, 20, 5, 6, 12, 30, 7, 17 into a t=3 B-Tree.",
      difficulty: "Intermediate",
      readMinutes: 4,
      sections: [
        { type: "dryRun", headers: ["Step", "Insert", "Root", "Notes"], rows: [
          ["1", "10", "[10]", "empty leaf → single key"],
          ["2", "20", "[10, 20]", "still fits (≤ 2t−1 = 5)"],
          ["3", "5",  "[5, 10, 20]", "sorted insert"],
          ["4", "6",  "[5, 6, 10, 20]", ""],
          ["5", "12", "[5, 6, 10, 12, 20]", "root now FULL (5 keys)"],
          ["6", "30", "[10]  ⇢  [5,6] [12,20,30]", "split root, promote 10"],
          ["7", "7",  "[10]  ⇢  [5,6,7] [12,20,30]", "insert into left child"],
          ["8", "17", "[10]  ⇢  [5,6,7] [12,17,20,30]", "insert into right child"],
        ]},
      ],
    },
    {
      slug: "common-mistakes",
      title: "Common Mistakes",
      eyebrow: "B-Tree · 17",
      description: "Bugs that appear in every hand-written B-Tree.",
      difficulty: "Intermediate",
      readMinutes: 3,
      sections: [
        { type: "mistakes", items: [
          "Splitting on the way UP instead of on the way DOWN — forces a second traversal.",
          "Forgetting to update the parent's child pointer array after a split.",
          "Off-by-one on the median index: median is keys[t−1], not keys[t].",
          "During delete, descending into a child with exactly t−1 keys without first borrowing/merging.",
          "Mixing minimum degree t and order m (m = 2t) in the same code path.",
        ]},
      ],
    },
    {
      slug: "faq",
      title: "FAQ",
      eyebrow: "B-Tree · 18",
      description: "Questions that come up every time.",
      difficulty: "Beginner",
      readMinutes: 3,
      sections: [
        { type: "interview", items: [
          "Why isn't a plain BST used for databases? — Height. 27 disk seeks vs 5.",
          "What's the difference between 'order' and 'minimum degree'? — Order m is max children; degree t = m/2.",
          "Can a B-Tree have duplicates? — Yes, with a tie-break rule (e.g. include row-id).",
          "Why is the root allowed to have fewer keys? — So the tree can shrink without dropping a level unnecessarily.",
          "Does concurrency require locks? — Yes; production trees use latch-coupling or optimistic B-link trees.",
        ]},
      ],
    },
    {
      slug: "interview-questions",
      title: "Interview Questions",
      eyebrow: "B-Tree · 19",
      description: "What systems-heavy interviews actually ask.",
      difficulty: "Intermediate",
      readMinutes: 3,
      sections: [
        { type: "interview", items: [
          "Explain B-Tree vs B+ Tree and why databases prefer B+.",
          "Given 10⁸ keys and a 4 KiB page, pick a reasonable t and justify.",
          "Walk through inserting into a full root — what changes about the tree height?",
          "How does deletion maintain the t−1 minimum?",
          "Why do concurrent B-Trees typically use B-link (Lehman & Yao) variants?",
          "Compare B-Tree with LSM Tree for write-heavy workloads.",
        ]},
      ],
    },
    {
      slug: "practice",
      title: "Practice",
      eyebrow: "B-Tree · 20",
      description: "B-Trees are systems-heavy — best practised inside a DB or storage engine.",
      difficulty: "Advanced",
      readMinutes: 3,
      sections: [
        { type: "practice", groups: [
          { level: "Beginner", items: [
            { title: "Implement search on a given B-Tree node", url: "https://www.geeksforgeeks.org/b-tree-set-1-introduction-2/", difficulty: "Easy", pattern: "Traversal" },
            { title: "In-order traversal of a B-Tree", url: "https://www.geeksforgeeks.org/traversal-in-tree/", difficulty: "Easy" },
          ]},
          { level: "Intermediate", items: [
            { title: "Implement B-Tree insertion", url: "https://www.geeksforgeeks.org/insert-operation-in-b-tree/", difficulty: "Medium", pattern: "Split-on-descent" },
            { title: "Implement B-Tree deletion", url: "https://www.geeksforgeeks.org/delete-operation-in-b-tree/", difficulty: "Hard", pattern: "Borrow/Merge" },
          ]},
          { level: "Advanced", items: [
            { title: "Build a disk-backed B-Tree (CMU 15-445 lab)", url: "https://15445.courses.cs.cmu.edu/fall2022/project2/", difficulty: "Hard", pattern: "Systems" },
          ]},
        ]},
      ],
    },
    {
      slug: "quiz",
      title: "Quiz",
      eyebrow: "B-Tree · 21",
      description: "Cement the branching-factor intuition.",
      difficulty: "Intermediate",
      readMinutes: 2,
      sections: [
        { type: "quiz", items: [
          { q: "A B-Tree with t = 100 storing 10⁸ keys has height roughly…",
            choices: ["27", "17", "5", "3"], answer: 2,
            explain: "log₁₀₀(10⁸) = 4, plus the root ≈ 5 disk reads." },
          { q: "The minimum number of keys in a non-root node is…",
            choices: ["1", "t−1", "t", "2t−1"], answer: 1,
            explain: "Non-root nodes hold between t−1 and 2t−1 keys." },
          { q: "When is a B-Tree's height increased?",
            choices: ["On any insert", "Only when the root splits", "On any delete", "Never"], answer: 1,
            explain: "Growth happens only when the root itself splits." },
        ]},
      ],
    },
    {
      slug: "references",
      title: "References",
      eyebrow: "B-Tree · 22",
      description: "Papers, textbooks, and reference implementations.",
      difficulty: "Beginner",
      readMinutes: 2,
      sections: [
        { type: "references", items: [
          { label: "Bayer & McCreight — Organization and Maintenance of Large Ordered Indexes (1972)", url: "https://infolab.usc.edu/csci585/Spring2010/den_ar/indexing.pdf" },
          { label: "CLRS — Chapter 18: B-Trees", url: "https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/" },
          { label: "CMU 15-445 — Tree Indexes", url: "https://15445.courses.cs.cmu.edu/fall2022/notes/07-treeindexes.pdf" },
          { label: "PostgreSQL — B-Tree implementation", url: "https://www.postgresql.org/docs/current/btree-implementation.html" },
          { label: "Wikipedia — B-tree", url: "https://en.wikipedia.org/wiki/B-tree" },
        ]},
      ],
    },
  ],
};

// ----------------------------------------------------------------------------
// B+ Tree
// ----------------------------------------------------------------------------
export const V_BPLUS: TreeVariantMeta = {
  slug: "b-plus-tree",
  title: "B+ Tree",
  tagline: "A B-Tree where data lives only in the leaves and leaves form a linked list — the workhorse of every RDBMS.",
  lessons: [
    {
      slug: "introduction",
      title: "Introduction",
      eyebrow: "B+ Tree · 1",
      description: "The B-Tree variant every relational database index actually uses.",
      difficulty: "Intermediate",
      readMinutes: 3,
      sections: [
        { type: "theory", text: "In a B+ Tree, internal nodes hold only routing keys — no data. All records live in the leaves, which are chained in a doubly linked list. That single design change turns range queries into a straight-line walk instead of an in-order traversal, which is exactly what SQL's `WHERE col BETWEEN a AND b` and `ORDER BY col` need." },
      ],
    },
    {
      slug: "structure",
      title: "Internal Structure",
      eyebrow: "B+ Tree · 2",
      description: "Internal nodes route; leaves store; leaves link.",
      difficulty: "Intermediate",
      readMinutes: 3,
      sections: [
        { type: "theory", bullets: [
          "Internal nodes hold up to 2t−1 routing keys and 2t child pointers.",
          "Leaf nodes hold up to L records and a `next` pointer to the following leaf.",
          "Every record appears in exactly one leaf; internal keys may repeat leaf keys for routing.",
          "All leaves are at the same depth — the tree is perfectly balanced.",
        ]},
      ],
    },
    {
      slug: "node-structure",
      title: "Node Structure",
      eyebrow: "B+ Tree · 3",
      description: "Two node flavours: internal (routing only) and leaf (records + next).",
      difficulty: "Intermediate",
      readMinutes: 3,
      sections: [
        { type: "code", code:
`class BPlusInternal:
    __slots__ = ("keys", "children")
    def __init__(self):
        self.keys, self.children = [], []

class BPlusLeaf:
    __slots__ = ("keys", "values", "next")
    def __init__(self):
        self.keys, self.values, self.next = [], [], None

def is_leaf(n): return isinstance(n, BPlusLeaf)` },
      ],
    },
    {
      slug: "memory-representation",
      title: "Memory Representation",
      eyebrow: "B+ Tree · 4",
      description: "Leaves form a linked list — visualise the tree AND the chain.",
      difficulty: "Intermediate",
      readMinutes: 3,
      sections: [
        { type: "memoryDiagram", nodes: [
          { id: "root", value: "[20]", left: "L1", right: "L2" },
          { id: "L1", value: "[10, 15]  → L2", left: null, right: null },
          { id: "L2", value: "[20, 25, 30]  → ∅", left: null, right: null },
        ], caption: "Routing key 20 in the root; leaves L1 → L2 form the sequence set." },
      ],
    },
    {
      slug: "vs-b-tree",
      title: "B+ vs B-Tree",
      eyebrow: "B+ Tree · 5",
      description: "Why databases picked B+.",
      difficulty: "Beginner",
      readMinutes: 3,
      sections: [
        { type: "table", headers: ["Aspect", "B-Tree", "B+ Tree"], rows: [
          ["Data location", "Internal + leaves", "Leaves only"],
          ["Range scan", "In-order traversal", "Walk the leaf list — cache friendly"],
          ["Internal fan-out", "Lower (keys carry data)", "Higher (routing only)"],
          ["Tree height", "Slightly higher", "Slightly lower for same n"],
          ["Point search", "Can stop early at internal hit", "Always descends to a leaf"],
        ]},
      ],
    },
    {
      slug: "creation",
      title: "Creation",
      eyebrow: "B+ Tree · 6",
      description: "A B+ Tree starts as a single leaf.",
      difficulty: "Beginner",
      readMinutes: 2,
      sections: [
        { type: "code", code:
`class BPlusTree:
    def __init__(self, order=4):
        assert order >= 3
        self.order = order          # max keys per node
        self.root = BPlusLeaf()` },
      ],
    },
    {
      slug: "search",
      title: "Search",
      eyebrow: "B+ Tree · 7",
      description: "Descend to a leaf, then binary-search the leaf.",
      difficulty: "Intermediate",
      readMinutes: 3,
      sections: [
        { type: "code", code:
`def find_leaf(node, k):
    while not is_leaf(node):
        i = 0
        while i < len(node.keys) and k >= node.keys[i]:
            i += 1
        node = node.children[i]
    return node

def get(tree, k):
    leaf = find_leaf(tree.root, k)
    for i, kk in enumerate(leaf.keys):
        if kk == k: return leaf.values[i]
    return None` },
      ],
    },
    {
      slug: "insertion",
      title: "Insertion",
      eyebrow: "B+ Tree · 8",
      description: "Insert into the leaf; if it overflows, split and propagate a copy of the split key up.",
      difficulty: "Advanced",
      readMinutes: 4,
      sections: [
        { type: "theory", bullets: [
          "1) Find target leaf via routing.",
          "2) Insert key/value in sorted order.",
          "3) If leaf now has > L keys, split into two leaves and copy the first key of the right leaf up as a router.",
          "4) Fix up leaf.next pointers so the chain stays intact.",
          "5) If the parent internal node overflows, split it recursively — but MOVE the median key up (unlike leaves, where we COPY).",
        ]},
        { type: "callout", kind: "info", title: "Copy vs move", text: "Leaves copy their first key up (data must remain in the leaf). Internal nodes move the median up (they carry no data)." },
      ],
    },
    {
      slug: "deletion",
      title: "Deletion",
      eyebrow: "B+ Tree · 9",
      description: "Same borrow/merge logic as a B-Tree, plus maintain the leaf chain.",
      difficulty: "Advanced",
      readMinutes: 4,
      sections: [
        { type: "theory", bullets: [
          "Delete the key/value from its leaf.",
          "If leaf underflows, borrow from a sibling or merge — always fix the `next` pointer of the previous leaf when merging.",
          "Propagate underflow upward through internal nodes exactly like a B-Tree.",
        ]},
        { type: "callout", kind: "warn", text: "Many production systems (InnoDB, LMDB) skip merges and let leaves stay half-empty until a background page-reorg." },
      ],
    },
    {
      slug: "range-query",
      title: "Range Queries",
      eyebrow: "B+ Tree · 10",
      description: "Descend once, then walk the leaf list — the B+ superpower.",
      difficulty: "Intermediate",
      readMinutes: 3,
      sections: [
        { type: "code", code:
`def range_scan(tree, lo, hi):
    leaf = find_leaf(tree.root, lo)
    out = []
    while leaf is not None:
        for k, v in zip(leaf.keys, leaf.values):
            if k > hi: return out
            if k >= lo: out.append((k, v))
        leaf = leaf.next
    return out` },
        { type: "callout", kind: "perf", text: "Range scan cost = O(log_t n + k) but the k term is a sequential I/O — orders of magnitude cheaper than random access on disk or SSD." },
      ],
    },
    {
      slug: "traversal",
      title: "Full-order Traversal",
      eyebrow: "B+ Tree · 11",
      description: "Ignore the tree; just walk the leftmost leaf forward.",
      difficulty: "Beginner",
      readMinutes: 2,
      sections: [
        { type: "code", code:
`def all_records(tree):
    leaf = tree.root
    while not is_leaf(leaf):
        leaf = leaf.children[0]
    while leaf is not None:
        yield from zip(leaf.keys, leaf.values)
        leaf = leaf.next` },
      ],
    },
    {
      slug: "complexity",
      title: "Complexity",
      eyebrow: "B+ Tree · 12",
      description: "Same asymptotics as B-Tree, better constants on range scans.",
      difficulty: "Beginner",
      readMinutes: 2,
      sections: [
        { type: "complexity", rows: [
          { op: "Point search / insert / delete", time: "O(log_t n)", space: "O(h)" },
          { op: "Range scan of k results",       time: "O(log_t n + k)", note: "Sequential leaf walk" },
          { op: "Full ordered scan",             time: "O(n)", note: "Just follow leaf.next" },
        ]},
      ],
    },
    {
      slug: "advantages",
      title: "Advantages",
      eyebrow: "B+ Tree · 13",
      description: "Why every RDBMS ships one.",
      difficulty: "Beginner",
      readMinutes: 2,
      sections: [
        { type: "theory", bullets: [
          "Higher fan-out — internal nodes hold only routing keys, so more keys fit per page.",
          "Sequential range scans without re-descending the tree.",
          "Predictable query cost — every lookup pays the full log_t n I/O.",
          "Great for prefix scans in composite indexes.",
        ]},
      ],
    },
    {
      slug: "disadvantages",
      title: "Disadvantages",
      eyebrow: "B+ Tree · 14",
      description: "The trade-offs vs a plain B-Tree.",
      difficulty: "Beginner",
      readMinutes: 2,
      sections: [
        { type: "theory", bullets: [
          "Every point lookup pays a full descent — no early exit at an internal hit.",
          "Slightly more storage overhead: routing keys duplicate leaf keys.",
          "Insertion-heavy workloads still fragment leaves under high churn.",
        ]},
      ],
    },
    {
      slug: "applications",
      title: "Applications",
      eyebrow: "B+ Tree · 15",
      description: "The workhorse index of relational databases.",
      difficulty: "Beginner",
      readMinutes: 2,
      sections: [
        { type: "theory", bullets: [
          "MySQL InnoDB — primary and secondary indexes.",
          "Oracle, SQL Server, DB2 — every B-tree they ship.",
          "SQLite — table storage.",
          "LMDB, BoltDB — key-value stores.",
          "Filesystem journals and metadata.",
        ]},
      ],
    },
    {
      slug: "python-implementation",
      title: "Complete Python Implementation",
      eyebrow: "B+ Tree · 16",
      description: "A minimal working B+ Tree with insert, get, and range scan.",
      difficulty: "Advanced",
      readMinutes: 6,
      sections: [
        { type: "code", code:
`from bisect import bisect_left, bisect_right, insort

class BPlusInternal:
    __slots__ = ("keys", "children")
    def __init__(self): self.keys, self.children = [], []

class BPlusLeaf:
    __slots__ = ("keys", "values", "next")
    def __init__(self): self.keys, self.values, self.next = [], [], None

def is_leaf(n): return isinstance(n, BPlusLeaf)


class BPlusTree:
    def __init__(self, order=4):
        assert order >= 3
        self.order = order
        self.root = BPlusLeaf()

    # ---------- search ----------
    def get(self, k):
        leaf = self._find_leaf(k)
        i = bisect_left(leaf.keys, k)
        if i < len(leaf.keys) and leaf.keys[i] == k:
            return leaf.values[i]
        return None

    def _find_leaf(self, k):
        node = self.root
        while not is_leaf(node):
            i = bisect_right(node.keys, k)
            node = node.children[i]
        return node

    # ---------- insert ----------
    def insert(self, k, v):
        root = self.root
        split = self._insert(root, k, v)
        if split is not None:
            sep, right = split
            new_root = BPlusInternal()
            new_root.keys = [sep]
            new_root.children = [root, right]
            self.root = new_root

    def _insert(self, node, k, v):
        if is_leaf(node):
            i = bisect_left(node.keys, k)
            if i < len(node.keys) and node.keys[i] == k:
                node.values[i] = v
                return None
            node.keys.insert(i, k)
            node.values.insert(i, v)
            if len(node.keys) <= self.order:
                return None
            # split leaf
            mid = len(node.keys) // 2
            right = BPlusLeaf()
            right.keys = node.keys[mid:]
            right.values = node.values[mid:]
            node.keys = node.keys[:mid]
            node.values = node.values[:mid]
            right.next, node.next = node.next, right
            return (right.keys[0], right)              # COPY up
        else:
            i = bisect_right(node.keys, k)
            split = self._insert(node.children[i], k, v)
            if split is None: return None
            sep, right = split
            node.keys.insert(i, sep)
            node.children.insert(i + 1, right)
            if len(node.keys) <= self.order:
                return None
            # split internal
            mid = len(node.keys) // 2
            promoted = node.keys[mid]                  # MOVE up
            right_node = BPlusInternal()
            right_node.keys = node.keys[mid + 1:]
            right_node.children = node.children[mid + 1:]
            node.keys = node.keys[:mid]
            node.children = node.children[:mid + 1]
            return (promoted, right_node)

    # ---------- range ----------
    def range(self, lo, hi):
        leaf = self._find_leaf(lo)
        out = []
        while leaf is not None:
            for k, v in zip(leaf.keys, leaf.values):
                if k > hi: return out
                if k >= lo: out.append((k, v))
            leaf = leaf.next
        return out


if __name__ == "__main__":
    t = BPlusTree(order=4)
    for i, k in enumerate([10, 20, 5, 6, 12, 30, 7, 17, 3, 25, 40, 45]):
        t.insert(k, f"v{i}")
    print(t.get(17))
    print(t.range(6, 25))` },
      ],
    },
    {
      slug: "dry-run",
      title: "Dry Run",
      eyebrow: "B+ Tree · 17",
      description: "Insert 10, 20, 5, 6, 12 into an order-4 B+ tree.",
      difficulty: "Intermediate",
      readMinutes: 3,
      sections: [
        { type: "dryRun", headers: ["Step", "Insert", "Root", "Leaf chain", "Notes"], rows: [
          ["1", "10", "leaf[10]", "10", "single leaf"],
          ["2", "20", "leaf[10,20]", "10 → 20 (same leaf)", ""],
          ["3", "5",  "leaf[5,10,20]", "5,10,20", ""],
          ["4", "6",  "leaf[5,6,10,20]", "5,6,10,20", "full but ≤ order"],
          ["5", "12", "internal[10]", "[5,6] → [10,12,20]", "leaf overflow → split, COPY 10 up"],
        ]},
      ],
    },
    {
      slug: "common-mistakes",
      title: "Common Mistakes",
      eyebrow: "B+ Tree · 18",
      description: "Bugs unique to B+ trees.",
      difficulty: "Intermediate",
      readMinutes: 3,
      sections: [
        { type: "mistakes", items: [
          "MOVING the leaf's median up (that's B-Tree). Leaves must COPY — the value stays in the leaf.",
          "Forgetting to relink leaf.next after a split — range scans then skip records.",
          "Using > vs >= wrong in internal routing: with routing key k, values ≥ k live in the right child.",
          "Deleting from a leaf but not removing the stale routing key from an ancestor (causes wrong-side descents).",
          "Confusing 'order' (max children) with 'minimum degree' — pick one convention and stick with it.",
        ]},
      ],
    },
    {
      slug: "faq",
      title: "FAQ",
      eyebrow: "B+ Tree · 19",
      description: "The most common questions.",
      difficulty: "Beginner",
      readMinutes: 3,
      sections: [
        { type: "interview", items: [
          "Why do range scans dominate B+ Tree design? — Because that's what SQL does most often.",
          "Do internal keys have to equal leaf keys? — No. They just need to route correctly; often they're the first key of the right subtree's leftmost leaf.",
          "Can leaves be singly or doubly linked? — Both exist. Doubly linked helps reverse scans.",
          "Is a B+ Tree always balanced? — Yes, every leaf sits at the same depth.",
          "How big is a real-world leaf? — Whatever fits in one page (usually a few hundred records).",
        ]},
      ],
    },
    {
      slug: "interview-questions",
      title: "Interview Questions",
      eyebrow: "B+ Tree · 20",
      description: "Systems and database interview classics.",
      difficulty: "Intermediate",
      readMinutes: 3,
      sections: [
        { type: "interview", items: [
          "Explain the difference between a B-Tree and a B+ Tree.",
          "Why do RDBMS engines prefer B+ Tree for secondary indexes?",
          "Walk through an insertion that causes both a leaf split and an internal split.",
          "How would you support reverse range scans efficiently?",
          "Compare B+ Tree with LSM Tree for write-heavy workloads.",
          "How does an InnoDB clustered index differ from a secondary B+ Tree index?",
        ]},
      ],
    },
    {
      slug: "practice",
      title: "Practice",
      eyebrow: "B+ Tree · 21",
      description: "Real-world practice lives inside a DBMS.",
      difficulty: "Advanced",
      readMinutes: 3,
      sections: [
        { type: "practice", groups: [
          { level: "Beginner", items: [
            { title: "Explain B+ Tree structure with diagrams", url: "https://www.geeksforgeeks.org/introduction-of-b-tree/", difficulty: "Easy" },
            { title: "Walk a leaf chain to answer a range query", url: "https://www.geeksforgeeks.org/b-tree-set-1-introduction-2/", difficulty: "Easy", pattern: "Range" },
          ]},
          { level: "Intermediate", items: [
            { title: "Implement B+ Tree insert with leaf splits", url: "https://www.geeksforgeeks.org/insertion-in-a-b-tree/", difficulty: "Medium", pattern: "Split + copy-up" },
            { title: "Implement a range-scan iterator", url: "https://leetcode.com/problems/range-sum-query-mutable/", difficulty: "Medium", pattern: "Range scan" },
          ]},
          { level: "Advanced", items: [
            { title: "CMU 15-445 Project 2: B+ Tree Index", url: "https://15445.courses.cs.cmu.edu/fall2022/project2/", difficulty: "Hard", pattern: "Systems" },
          ]},
        ]},
      ],
    },
    {
      slug: "quiz",
      title: "Quiz",
      eyebrow: "B+ Tree · 22",
      description: "Test the leaf-chain intuition.",
      difficulty: "Intermediate",
      readMinutes: 2,
      sections: [
        { type: "quiz", items: [
          { q: "In a B+ Tree, where do actual data records live?",
            choices: ["Only in the root", "Only in internal nodes", "Only in leaves", "In leaves and internal nodes"], answer: 2,
            explain: "Internal nodes route; leaves store." },
          { q: "A B+ Tree range scan of k results costs…",
            choices: ["O(k · log_t n)", "O(log_t n + k)", "O(n)", "O(k²)"], answer: 1,
            explain: "One descent, then a linear walk over k leaf entries." },
          { q: "When a leaf splits, its median key is…",
            choices: ["Moved up", "Copied up", "Discarded", "Rotated to a sibling"], answer: 1,
            explain: "Leaves COPY; internal nodes MOVE." },
        ]},
      ],
    },
    {
      slug: "references",
      title: "References",
      eyebrow: "B+ Tree · 23",
      description: "Papers, textbooks, and reference implementations.",
      difficulty: "Beginner",
      readMinutes: 2,
      sections: [
        { type: "references", items: [
          { label: "Comer — The Ubiquitous B-Tree (1979)", url: "https://carlosproal.com/ir/papers/p121-comer.pdf" },
          { label: "InnoDB B+ tree overview", url: "https://dev.mysql.com/doc/refman/8.0/en/innodb-index-types.html" },
          { label: "CMU 15-445 — Tree Indexes", url: "https://15445.courses.cs.cmu.edu/fall2022/notes/07-treeindexes.pdf" },
          { label: "SQLite File Format — B-tree pages", url: "https://www.sqlite.org/fileformat2.html#b_tree_pages" },
          { label: "Wikipedia — B+ tree", url: "https://en.wikipedia.org/wiki/B%2B_tree" },
        ]},
      ],
    },
  ],
};

