import type { TreeVariantMeta } from "./types";

export const V_GENERAL: TreeVariantMeta = {
  slug: "general-tree",
  title: "General Tree",
  tagline: "Any number of children per node — the shape of filesystems and org charts.",
  lessons: [
    {
      slug: "introduction",
      title: "Introduction",
      eyebrow: "General Tree · 1",
      description: "A tree with no upper bound on how many children each node may have.",
      difficulty: "Beginner",
      readMinutes: 3,
      sections: [
        {
          type: "theory",
          text: "A general (n-ary) tree lets every node hold an arbitrary list of children. It's the raw hierarchy — no ordering, no balancing, no fan-out cap. File systems, DOM trees, and JSON documents are general trees.",
        },
        {
          type: "tree",
          root: {
            id: "/",
            label: "/",
            color: "brand",
            children: [
              {
                id: "u",
                label: "usr",
                children: [
                  { id: "b", label: "bin" },
                  { id: "l", label: "lib" },
                  { id: "s", label: "share" },
                ],
              },
              {
                id: "e",
                label: "etc",
                children: [
                  { id: "n", label: "nginx" },
                  { id: "sys", label: "systemd" },
                ],
              },
              {
                id: "h",
                label: "home",
                children: [
                  { id: "a", label: "alice" },
                  { id: "bo", label: "bob" },
                ],
              },
            ],
          },
          caption: "A Unix filesystem — a general tree with variable fan-out.",
        },
      ],
    },
    {
      slug: "structure",
      title: "Structure",
      eyebrow: "General Tree · 2",
      description: "One value, one parent, a list of children — nothing more.",
      difficulty: "Beginner",
      readMinutes: 3,
      sections: [
        {
          type: "code",
          title: "n-ary node in Python",
          code: `class NTreeNode:
    __slots__ = ("val", "children")
    def __init__(self, val, children=None):
        self.val = val
        self.children = children or []   # ← list of NTreeNode

    def add(self, child):
        self.children.append(child)`,
        },
        {
          type: "callout",
          kind: "tip",
          title: "Why a list?",
          text: "Using a list keeps insertion O(1) amortised at the tail and matches Python's dynamic-array strengths. A dict of children is only worth it if you need to look up by key.",
        },
      ],
    },
    {
      slug: "representation",
      title: "Representation",
      eyebrow: "General Tree · 3",
      description:
        "Three common encodings — list of children, parent array, and first-child-next-sibling.",
      difficulty: "Intermediate",
      readMinutes: 4,
      sections: [
        {
          type: "table",
          headers: ["Encoding", "When to use"],
          rows: [
            ["List of children per node", "General-purpose — mirrors the definition."],
            ["Parent array", "Union-find, ancestor queries, bottom-up problems."],
            [
              "First-child / next-sibling",
              "Fixed-size nodes, unbounded fan-out with only two pointers each.",
            ],
          ],
        },
        {
          type: "code",
          title: "parent array",
          code: `# tree with 5 nodes, parent[i] = parent of i (or -1 for root)
parent = [-1, 0, 0, 1, 1]
# node 0 is root; 1 and 2 are its children; 3 and 4 are children of 1.`,
        },
      ],
    },
    {
      slug: "traversal",
      title: "Traversal",
      eyebrow: "General Tree · 4",
      description: "Depth-first and breadth-first over a variable-arity tree.",
      difficulty: "Beginner",
      readMinutes: 4,
      sections: [
        {
          type: "code",
          title: "DFS and BFS",
          code: `def dfs(node, visit):
    if not node: return
    visit(node.val)
    for c in node.children:
        dfs(c, visit)

from collections import deque
def bfs(root, visit):
    q = deque([root])
    while q:
        n = q.popleft()
        visit(n.val)
        q.extend(n.children)`,
        },
      ],
    },
    {
      slug: "applications",
      title: "Applications",
      eyebrow: "General Tree · 5",
      description: "Where general trees show up in the wild.",
      difficulty: "Beginner",
      readMinutes: 2,
      sections: [
        {
          type: "theory",
          bullets: [
            "File systems, disk directories.",
            "DOM trees, XML, JSON.",
            "Company org charts.",
            "Menu systems and site navigation.",
            "Category taxonomies in e-commerce.",
          ],
        },
      ],
    },
    {
      slug: "complexity",
      title: "Complexity",
      eyebrow: "General Tree · 6",
      description:
        "General trees carry no balance guarantee — everything is proportional to the shape.",
      difficulty: "Beginner",
      readMinutes: 2,
      sections: [
        {
          type: "complexity",
          rows: [
            { op: "Insert child", time: "O(1)" },
            { op: "Search by value", time: "O(n)" },
            { op: "Traverse", time: "O(n)", space: "O(h)" },
            { op: "Delete node", time: "O(n)", note: "Must locate first" },
          ],
        },
      ],
    },
    {
      slug: "practice",
      title: "Practice",
      eyebrow: "General Tree · 7",
      description: "Warm-up problems using n-ary trees.",
      difficulty: "Intermediate",
      readMinutes: 3,
      sections: [
        {
          type: "practice",
          groups: [
            {
              level: "Beginner",
              items: [
                {
                  title: "LC 589 · N-ary Tree Preorder Traversal",
                  url: "https://leetcode.com/problems/n-ary-tree-preorder-traversal/",
                  difficulty: "Easy",
                },
                {
                  title: "LC 590 · N-ary Tree Postorder Traversal",
                  url: "https://leetcode.com/problems/n-ary-tree-postorder-traversal/",
                  difficulty: "Easy",
                },
              ],
            },
            {
              level: "Intermediate",
              items: [
                {
                  title: "LC 429 · N-ary Level Order Traversal",
                  url: "https://leetcode.com/problems/n-ary-tree-level-order-traversal/",
                  difficulty: "Medium",
                },
                {
                  title: "LC 559 · Max Depth of N-ary Tree",
                  url: "https://leetcode.com/problems/maximum-depth-of-n-ary-tree/",
                  difficulty: "Easy",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      slug: "quiz",
      title: "Quiz",
      eyebrow: "General Tree · 8",
      description: "Confirm the essentials before moving on.",
      difficulty: "Beginner",
      readMinutes: 2,
      sections: [
        {
          type: "quiz",
          items: [
            {
              q: "Which representation stores each node's parent index in a flat array?",
              choices: [
                "List of children",
                "Parent array",
                "First-child next-sibling",
                "Adjacency matrix",
              ],
              answer: 1,
              explain: "Parent arrays are minimal and fast for union-find style problems.",
            },
          ],
        },
      ],
    },
    {
      slug: "references",
      title: "References",
      eyebrow: "General Tree · 9",
      description: "Further reading.",
      difficulty: "Beginner",
      readMinutes: 1,
      sections: [
        {
          type: "references",
          items: [
            {
              label: "Wikipedia — Tree data structure",
              url: "https://en.wikipedia.org/wiki/Tree_(data_structure)",
            },
            {
              label: "Python Docs — os.walk",
              url: "https://docs.python.org/3/library/os.html#os.walk",
            },
          ],
        },
      ],
    },
  ],
};

// ----------------------------------------------------------------------------
// Binary Tree
// ----------------------------------------------------------------------------
export const V_BINARY: TreeVariantMeta = {
  slug: "binary-tree",
  title: "Binary Tree",
  tagline: "At most two children per node — the workhorse of DSA interviews.",
  lessons: [
    {
      slug: "introduction",
      title: "Introduction",
      eyebrow: "Binary Tree · 1",
      description: "A binary tree limits each node to a left and a right child.",
      difficulty: "Beginner",
      readMinutes: 3,
      sections: [
        {
          type: "theory",
          text: "A binary tree is the most studied tree in computer science. It's the foundation for BSTs, heaps, expression trees, Huffman coding, and almost every tree question you'll ever be asked in an interview.",
        },
        {
          type: "tree",
          root: {
            id: 1,
            label: 1,
            color: "brand",
            children: [
              {
                id: 2,
                label: 2,
                children: [
                  { id: 4, label: 4 },
                  { id: 5, label: 5 },
                ],
              },
              {
                id: 3,
                label: 3,
                children: [
                  { id: 6, label: 6 },
                  { id: 7, label: 7 },
                ],
              },
            ],
          },
          caption: "A complete binary tree of depth 2.",
        },
        { type: "heading", text: "Build one yourself" },
        {
          type: "binaryPlayground",
          caption: "Click Add to attach children, then classify each node as leaf / internal.",
        },
      ],
    },
    {
      slug: "types",
      title: "Types",
      eyebrow: "Binary Tree · 2",
      description:
        "Full, complete, perfect, balanced, degenerate — five shapes with strict definitions.",
      difficulty: "Beginner",
      readMinutes: 5,
      sections: [
        {
          type: "table",
          headers: ["Type", "Definition"],
          rows: [
            ["Full", "Every node has 0 or 2 children — never 1."],
            ["Complete", "All levels full except possibly the last, which fills left-to-right."],
            ["Perfect", "All internal nodes have 2 children AND all leaves at the same depth."],
            ["Balanced", "Height difference between left/right subtree ≤ 1 at every node."],
            [
              "Degenerate (skewed)",
              "Every node has exactly one child — a linked list wearing a tree costume.",
            ],
          ],
        },
      ],
    },
    {
      slug: "complete-binary-tree",
      title: "Complete Binary Tree",
      eyebrow: "Binary Tree · 3",
      description:
        "Every level full except the last, which fills strictly left-to-right — heaps are built on this shape.",
      difficulty: "Beginner",
      readMinutes: 3,
      sections: [
        {
          type: "tree",
          root: {
            id: 1,
            label: 1,
            color: "brand",
            children: [
              {
                id: 2,
                label: 2,
                children: [
                  { id: 4, label: 4 },
                  { id: 5, label: 5 },
                ],
              },
              { id: 3, label: 3, children: [{ id: 6, label: 6 }] },
            ],
          },
          caption: "Last level is not full but fills left-to-right — still complete.",
        },
        {
          type: "theory",
          text: "Complete binary trees pack perfectly into an array: no wasted slots, cache-friendly, and children live at 2i+1 / 2i+2.",
        },
        { type: "heading", text: "Drag the slider to grow it" },
        {
          type: "completeViz",
          count: 7,
          caption:
            "Adjust node count; the next-slot indicator shows where a level-order insert would land.",
        },
      ],
    },
    {
      slug: "perfect-binary-tree",
      title: "Perfect Binary Tree",
      eyebrow: "Binary Tree · 4",
      description:
        "Every internal node has exactly two children AND every leaf shares the same depth.",
      difficulty: "Beginner",
      readMinutes: 2,
      sections: [
        {
          type: "theory",
          text: "A perfect tree of height h has exactly 2^(h+1) − 1 nodes and 2^h leaves. Rare in the real world but perfect for reasoning about worst-case sizes.",
        },
        {
          type: "perfectViz",
          levels: 3,
          caption: "Adjust height h — count updates to 2^(h+1) − 1 nodes.",
        },
      ],
    },
    {
      slug: "full-binary-tree",
      title: "Full Binary Tree",
      eyebrow: "Binary Tree · 5",
      description: "Every node has zero or two children. No node has exactly one.",
      difficulty: "Beginner",
      readMinutes: 2,
      sections: [
        {
          type: "theory",
          text: "Also called a strict binary tree. Expression trees and Huffman codes are always full — every internal node combines two subtrees.",
        },
        {
          type: "fullViz",
          caption: "Nodes with exactly one child are highlighted as rule breakers.",
        },
      ],
    },
    {
      slug: "balanced-binary-tree",
      title: "Balanced Binary Tree",
      eyebrow: "Binary Tree · 6",
      description:
        "Height difference between the two children ≤ 1 at every node — the property AVL enforces.",
      difficulty: "Intermediate",
      readMinutes: 3,
      sections: [
        {
          type: "code",
          title: "check balance in O(n)",
          code: `def is_balanced(root):
    def h(n):
        if not n: return 0
        l = h(n.left);  r = h(n.right)
        if l < 0 or r < 0 or abs(l - r) > 1: return -1
        return 1 + max(l, r)
    return h(root) >= 0`,
        },
        {
          type: "balancedViz",
          caption: "Every node shows its live balance factor; unbalanced nodes flash red.",
        },
      ],
    },
    {
      slug: "degenerate-tree",
      title: "Degenerate Tree",
      eyebrow: "Binary Tree · 7",
      description:
        "Every node has one child — the pathological shape that turns tree ops into O(n).",
      difficulty: "Beginner",
      readMinutes: 2,
      sections: [
        {
          type: "tree",
          root: {
            id: 1,
            label: 1,
            color: "brand",
            children: [
              { id: 2, label: 2, children: [{ id: 3, label: 3, children: [{ id: 4, label: 4 }] }] },
            ],
          },
          caption: "Left-skewed tree — height = n − 1.",
        },
        {
          type: "callout",
          kind: "warn",
          text: "Inserting a sorted sequence into a plain BST produces exactly this shape.",
        },
        {
          type: "degenerateViz",
          caption: "Watch a sorted BST insertion deform into a linked list.",
        },
      ],
    },
    {
      slug: "construction",
      title: "Construction",
      eyebrow: "Binary Tree · 8",
      description: "Build a binary tree from a level-order list or from preorder + inorder pairs.",
      difficulty: "Intermediate",
      readMinutes: 5,
      sections: [
        {
          type: "code",
          title: "from a level-order list",
          code: `def build(values):
    if not values: return None
    nodes = [TreeNode(v) if v is not None else None for v in values]
    for i, n in enumerate(nodes):
        if n is None: continue
        l, r = 2*i+1, 2*i+2
        if l < len(nodes): n.left  = nodes[l]
        if r < len(nodes): n.right = nodes[r]
    return nodes[0]`,
        },
      ],
    },
    {
      slug: "representation",
      title: "Representation",
      eyebrow: "Binary Tree · 9",
      description: "Nodes vs arrays vs implicit heap layout.",
      difficulty: "Beginner",
      readMinutes: 3,
      sections: [
        {
          type: "code",
          title: "node object",
          code: `class TreeNode:
    __slots__ = ("val", "left", "right")
    def __init__(self, val=0, left=None, right=None):
        self.val, self.left, self.right = val, left, right`,
        },
        { type: "heading", text: "How it actually lives in memory" },
        {
          type: "memoryDiagram",
          nodes: [
            { id: "n1", value: 1, left: "n2", right: "n3" },
            { id: "n2", value: 2, left: "n4", right: "n5" },
            { id: "n3", value: 3, left: null, right: null },
            { id: "n4", value: 4, left: null, right: null },
            { id: "n5", value: 5, left: null, right: null },
          ],
          caption:
            "Each node is a heap-allocated object with two pointers; addresses are stable for a given id.",
        },
      ],
    },
    {
      slug: "insertion",
      title: "Insertion",
      eyebrow: "Binary Tree · 10",
      description:
        "Insertion in a plain binary tree — usually at the first empty slot in level order.",
      difficulty: "Intermediate",
      readMinutes: 3,
      sections: [
        {
          type: "code",
          title: "level-order insert (iterative)",
          code: `from collections import deque
def insert(root, val):
    node = TreeNode(val)
    if not root: return node
    q = deque([root])
    while q:
        n = q.popleft()
        if not n.left:  n.left  = node; return root
        if not n.right: n.right = node; return root
        q.append(n.left); q.append(n.right)
    return root`,
        },
        {
          type: "code",
          title: "recursive variant (fills leftmost missing slot)",
          code: `def insert_rec(root, val):
    if not root: return TreeNode(val)
    lh = height(root.left); rh = height(root.right)
    if lh <= rh: root.left  = insert_rec(root.left, val)
    else:        root.right = insert_rec(root.right, val)
    return root`,
        },
        {
          type: "dryRun",
          caption: "Insert 6 into [1,2,3,4,5] level-order",
          headers: ["Step", "Dequeued", "n.left", "n.right", "Action"],
          rows: [
            ["1", "1", "2", "3", "both filled → enqueue children"],
            ["2", "2", "4", "5", "both filled → enqueue children"],
            ["3", "3", "∅", "—", "left empty → attach 6 here, return"],
          ],
        },
        {
          type: "mistakes",
          items: [
            "Forgetting to enqueue children when both slots are occupied.",
            "Returning the new node instead of the original root.",
            "Confusing this with BST insert — plain binary trees have no ordering constraint.",
          ],
        },
      ],
    },
    {
      slug: "deletion",
      title: "Deletion",
      eyebrow: "Binary Tree · 11",
      description: "Replace target with the deepest node, then remove the deepest node.",
      difficulty: "Intermediate",
      readMinutes: 3,
      sections: [
        {
          type: "code",
          title: "level-order delete",
          code: `from collections import deque
def delete(root, key):
    if not root: return None
    q, target = deque([root]), None
    last = root
    parent = None; is_left = False
    while q:
        last = q.popleft()
        if last.val == key: target = last
        if last.left:  parent, is_left = last, True;  q.append(last.left)
        if last.right: parent, is_left = last, False; q.append(last.right)
    if target:
        target.val = last.val
        if parent:
            if is_left: parent.left = None
            else:       parent.right = None
        else:
            return None
    return root`,
        },
      ],
    },
    {
      slug: "searching",
      title: "Searching",
      eyebrow: "Binary Tree · 12",
      description: "Binary trees have no ordering — search is a full DFS/BFS.",
      difficulty: "Beginner",
      readMinutes: 2,
      sections: [
        {
          type: "code",
          title: "recursive contains",
          code: `def contains(node, target):
    if not node: return False
    if node.val == target: return True
    return contains(node.left, target) or contains(node.right, target)`,
        },
        {
          type: "code",
          title: "iterative BFS variant",
          code: `from collections import deque
def contains_iter(root, target):
    if not root: return False
    q = deque([root])
    while q:
        n = q.popleft()
        if n.val == target: return True
        if n.left:  q.append(n.left)
        if n.right: q.append(n.right)
    return False`,
        },
        { type: "heading", text: "Traverse it live" },
        {
          type: "traversalPlayer",
          mode: "in",
          root: {
            id: 1,
            label: 1,
            children: [
              {
                id: 2,
                label: 2,
                children: [
                  { id: 4, label: 4 },
                  { id: 5, label: 5 },
                ],
              },
              {
                id: 3,
                label: 3,
                children: [
                  { id: 6, label: 6 },
                  { id: 7, label: 7 },
                ],
              },
            ],
          },
          caption: "Step through pre-, in-, post-, level-, and Morris-order traversals.",
        },
      ],
    },
    {
      slug: "applications",
      title: "Applications",
      eyebrow: "Binary Tree · 13",
      description: "Where the binary shape appears.",
      difficulty: "Beginner",
      readMinutes: 2,
      sections: [
        {
          type: "theory",
          bullets: [
            "Expression trees for parsers.",
            "Huffman coding for compression.",
            "Binary heaps (priority queues).",
            "Decision trees.",
            "Every BST, AVL, and RB tree in existence.",
          ],
        },
      ],
    },
    {
      slug: "complexity",
      title: "Complexity",
      eyebrow: "Binary Tree · 14",
      description: "Plain binary tree — no balance guarantee.",
      difficulty: "Beginner",
      readMinutes: 2,
      sections: [
        {
          type: "complexity",
          rows: [
            { op: "Search / contains", time: "O(n)", space: "O(h)" },
            { op: "Insert (level order)", time: "O(n)", space: "O(w)" },
            { op: "Delete", time: "O(n)", space: "O(w)" },
            { op: "Traverse", time: "O(n)", space: "O(h)" },
          ],
        },
      ],
    },
    {
      slug: "practice",
      title: "Practice",
      eyebrow: "Binary Tree · 15",
      description: "Warm-up problems on plain binary trees.",
      difficulty: "Intermediate",
      readMinutes: 3,
      sections: [
        {
          type: "practice",
          groups: [
            {
              level: "Beginner",
              items: [
                {
                  title: "LC 104 · Max Depth of Binary Tree",
                  url: "https://leetcode.com/problems/maximum-depth-of-binary-tree/",
                  difficulty: "Easy",
                },
                {
                  title: "LC 226 · Invert Binary Tree",
                  url: "https://leetcode.com/problems/invert-binary-tree/",
                  difficulty: "Easy",
                },
                {
                  title: "LC 100 · Same Tree",
                  url: "https://leetcode.com/problems/same-tree/",
                  difficulty: "Easy",
                },
              ],
            },
            {
              level: "Intermediate",
              items: [
                {
                  title: "LC 102 · Level Order Traversal",
                  url: "https://leetcode.com/problems/binary-tree-level-order-traversal/",
                  difficulty: "Medium",
                },
                {
                  title: "LC 105 · Build from Preorder + Inorder",
                  url: "https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/",
                  difficulty: "Medium",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      slug: "quiz",
      title: "Quiz",
      eyebrow: "Binary Tree · 16",
      description: "Confirm the type definitions.",
      difficulty: "Beginner",
      readMinutes: 2,
      sections: [
        {
          type: "quiz",
          items: [
            {
              q: "A tree where every node has either 0 or 2 children is called…",
              choices: ["Complete", "Full", "Perfect", "Balanced"],
              answer: 1,
              explain: "Full = strictly 0 or 2 children, no exceptions.",
            },
          ],
        },
      ],
    },
    {
      slug: "references",
      title: "References",
      eyebrow: "Binary Tree · 17",
      description: "Further reading.",
      difficulty: "Beginner",
      readMinutes: 1,
      sections: [
        {
          type: "references",
          items: [
            {
              label: "CLRS Chapter 12 — Binary Search Trees",
              url: "https://mitpress.mit.edu/9780262046305/",
            },
            { label: "Visualgo — Binary Tree", url: "https://visualgo.net/en/bst" },
          ],
        },
      ],
    },
  ],
};

// ----------------------------------------------------------------------------
// Binary Search Tree
// ----------------------------------------------------------------------------
export const V_BST: TreeVariantMeta = {
  slug: "bst",
  title: "Binary Search Tree",
  tagline: "Left < node < right — search, insert, and delete in O(log n) when balanced.",
  lessons: [
    {
      slug: "introduction",
      title: "Introduction",
      eyebrow: "BST · 1",
      description: "A binary tree that maintains sorted order at every node.",
      difficulty: "Beginner",
      readMinutes: 3,
      sections: [
        {
          type: "theory",
          text: "A Binary Search Tree (BST) constrains every node: everything in the left subtree is smaller, everything in the right subtree is larger. That single invariant turns O(n) search into O(log n) when the tree is balanced.",
        },
        {
          type: "tree",
          root: {
            id: 50,
            label: 50,
            color: "brand",
            children: [
              {
                id: 30,
                label: 30,
                children: [
                  { id: 20, label: 20 },
                  { id: 40, label: 40 },
                ],
              },
              {
                id: 70,
                label: 70,
                children: [
                  { id: 60, label: 60 },
                  { id: 80, label: 80 },
                ],
              },
            ],
          },
          caption: "A BST — every left descendant < node < every right descendant.",
        },
        {
          type: "memoryDiagram",
          nodes: [
            { id: "n50", value: 50, left: "n30", right: "n70" },
            { id: "n30", value: 30, left: "n20", right: "n40" },
            { id: "n70", value: 70, left: "n60", right: "n80" },
            { id: "n20", value: 20, left: null, right: null },
            { id: "n40", value: 40, left: null, right: null },
            { id: "n60", value: 60, left: null, right: null },
            { id: "n80", value: 80, left: null, right: null },
          ],
          caption:
            "Each node holds a value and two pointers. Simulated addresses are stable per node id.",
        },
      ],
    },
    {
      slug: "complete-implementation",
      title: "Complete Python Implementation",
      eyebrow: "BST · 1b",
      description:
        "A drop-in BST class with insert, search, delete, traversals, min/max, height, and validation.",
      difficulty: "Beginner",
      readMinutes: 6,
      sections: [
        {
          type: "theory",
          text: "Below is a self-contained, beginner-friendly BST class. Every method is commented so you can read it top-to-bottom. Paste it into a file and run — no external dependencies.",
        },
        {
          type: "code",
          title: "bst.py — full implementation",
          code: `from collections import deque

class Node:
    """A single BST node holds a value and two child pointers."""
    __slots__ = ("val", "left", "right")
    def __init__(self, val):
        self.val   = val
        self.left  = None
        self.right = None

class BST:
    def __init__(self):
        self.root = None
        self._size = 0

    # ---------- Insert ----------
    def insert(self, v):
        def go(n):
            if n is None:
                self._size += 1
                return Node(v)
            if v < n.val:  n.left  = go(n.left)
            elif v > n.val: n.right = go(n.right)
            # duplicates are ignored
            return n
        self.root = go(self.root)

    # ---------- Search ----------
    def search(self, v):
        cur = self.root
        while cur and cur.val != v:
            cur = cur.left if v < cur.val else cur.right
        return cur          # None if missing

    # ---------- Delete ----------
    def delete(self, v):
        def go(n):
            if n is None: return None
            if v < n.val:  n.left  = go(n.left)
            elif v > n.val: n.right = go(n.right)
            else:
                self._size -= 1
                if n.left  is None: return n.right     # 0 / right-only
                if n.right is None: return n.left      # left-only
                s = n.right                            # inorder successor
                while s.left: s = s.left
                n.val = s.val
                self._size += 1                        # will decrement in recursive delete
                n.right = go_inner(n.right, s.val)
            return n
        def go_inner(n, target):
            if n is None: return None
            if target < n.val:  n.left  = go_inner(n.left,  target)
            elif target > n.val: n.right = go_inner(n.right, target)
            else:
                self._size -= 1
                if n.left is None:  return n.right
                if n.right is None: return n.left
            return n
        self.root = go(self.root)

    # ---------- Min / Max ----------
    def min(self):
        n = self.root
        if not n: return None
        while n.left: n = n.left
        return n.val

    def max(self):
        n = self.root
        if not n: return None
        while n.right: n = n.right
        return n.val

    # ---------- Traversals ----------
    def inorder(self):
        out = []
        def walk(n):
            if not n: return
            walk(n.left);  out.append(n.val);  walk(n.right)
        walk(self.root); return out

    def preorder(self):
        out = []
        def walk(n):
            if not n: return
            out.append(n.val); walk(n.left); walk(n.right)
        walk(self.root); return out

    def postorder(self):
        out = []
        def walk(n):
            if not n: return
            walk(n.left); walk(n.right); out.append(n.val)
        walk(self.root); return out

    def level_order(self):
        if not self.root: return []
        q, out = deque([self.root]), []
        while q:
            n = q.popleft(); out.append(n.val)
            if n.left:  q.append(n.left)
            if n.right: q.append(n.right)
        return out

    # ---------- Utilities ----------
    def height(self):
        def h(n): return -1 if n is None else 1 + max(h(n.left), h(n.right))
        return h(self.root)

    def size(self):  return self._size

    def is_valid(self, lo=float("-inf"), hi=float("inf")):
        def ok(n, lo, hi):
            if not n: return True
            if not (lo < n.val < hi): return False
            return ok(n.left, lo, n.val) and ok(n.right, n.val, hi)
        return ok(self.root, lo, hi)

# ---------- Quick demo ----------
if __name__ == "__main__":
    t = BST()
    for v in [50, 30, 70, 20, 40, 60, 80]: t.insert(v)
    print(t.inorder())          # [20, 30, 40, 50, 60, 70, 80]
    print(t.search(40).val)     # 40
    t.delete(30)
    print(t.inorder())          # [20, 40, 50, 60, 70, 80]
    print(t.height(), t.size()) # 2 6`,
        },
        {
          type: "callout",
          kind: "tip",
          title: "Why __slots__",
          text: "Adding __slots__ on Node drops per-instance dict overhead — useful for large trees where memory matters.",
        },
      ],
    },
    {
      slug: "bst-property",
      title: "The BST Property",
      eyebrow: "BST · 2",
      description: "The rule that makes every BST algorithm work.",
      difficulty: "Beginner",
      readMinutes: 3,
      sections: [
        {
          type: "theory",
          bullets: [
            "For every node n: max(n.left subtree) < n.val < min(n.right subtree).",
            "This is a global property — checking only immediate children is not enough.",
            "Inorder traversal of a BST returns values in sorted order.",
          ],
        },
        {
          type: "callout",
          kind: "warn",
          title: "Common validation bug",
          text: "if node.left.val < node.val and node.right.val > node.val — this only checks the immediate children. A malformed grandchild would pass. Use min/max bounds instead.",
        },
      ],
    },
    {
      slug: "insertion",
      title: "Insertion",
      eyebrow: "BST · 3",
      description: "Recurse left or right until you find an empty slot.",
      difficulty: "Beginner",
      readMinutes: 3,
      sections: [
        {
          type: "theory",
          text: "Insertion is a single walk from the root. At each node we compare with the value being inserted and go left (smaller) or right (larger); when we fall off the tree we allocate a new leaf.",
        },
        {
          type: "code",
          title: "recursive insert",
          code: `def insert(root, v):
    if not root: return TreeNode(v)
    if v < root.val:  root.left  = insert(root.left,  v)
    elif v > root.val: root.right = insert(root.right, v)
    return root  # duplicates ignored`,
        },
        {
          type: "code",
          title: "iterative insert (no recursion stack)",
          code: `def insert_iter(root, v):
    if not root: return TreeNode(v)
    cur = root
    while True:
        if v == cur.val: return root
        side = "left" if v < cur.val else "right"
        nxt = getattr(cur, side)
        if nxt is None:
            setattr(cur, side, TreeNode(v))
            return root
        cur = nxt`,
        },
        {
          type: "dryRun",
          headers: ["Step", "Current node", "Compare", "Action"],
          rows: [
            ["1", "50", "35 < 50", "go left"],
            ["2", "30", "35 > 30", "go right"],
            ["3", "40", "35 < 40", "go left"],
            ["4", "None", "—", "attach new leaf 35"],
          ],
          caption: "Inserting 35 into the reference BST.",
        },
        { type: "binaryPlayground" },
        { type: "playground" },
      ],
    },
    {
      slug: "deletion",
      title: "Deletion",
      eyebrow: "BST · 4",
      description: "Three cases: leaf, one child, two children (inorder successor).",
      difficulty: "Intermediate",
      readMinutes: 5,
      sections: [
        {
          type: "theory",
          text: "Deletion is the trickiest core BST operation. Three shapes to handle: a leaf (just detach), a node with one child (splice the child in), and a node with two children (copy the inorder successor's value in and delete the successor from the right subtree — which is guaranteed to have at most one child).",
        },
        {
          type: "code",
          title: "delete a value",
          code: `def delete(root, v):
    if not root: return None
    if v < root.val:  root.left  = delete(root.left,  v)
    elif v > root.val: root.right = delete(root.right, v)
    else:
        if not root.left:  return root.right   # 0 or right-only
        if not root.right: return root.left    # left-only
        # two children — copy the in-order successor
        s = root.right
        while s.left: s = s.left
        root.val = s.val
        root.right = delete(root.right, s.val)
    return root`,
        },
        {
          type: "dryRun",
          headers: ["Step", "State", "Compare", "Action"],
          rows: [
            ["1", "delete(50, 30)", "30 < 50", "recurse left"],
            ["2", "delete(30, 30)", "match", "two children"],
            ["3", "walk 40 → 40", "successor", "successor = 40"],
            ["4", "copy 40 into node", "—", "node.val ← 40"],
            ["5", "delete(40, 40) in right subtree", "match, leaf", "detach"],
          ],
          caption: "Deleting the root's left child (value 30) using inorder-successor.",
        },
        {
          type: "mistakes",
          items: [
            "Forgetting the two-children case and just returning None loses the entire subtree.",
            "Returning root.left or root.right without null-checking overwrites siblings.",
            "Copying the successor's value but forgetting to recursively delete the successor node itself leaves duplicate values in the tree.",
            "Deleting in a shared/aliased tree without cloning corrupts other references.",
          ],
        },
      ],
    },
    {
      slug: "searching",
      title: "Searching",
      eyebrow: "BST · 5",
      description: "Iterative or recursive — O(log n) balanced, O(n) worst.",
      difficulty: "Beginner",
      readMinutes: 2,
      sections: [
        {
          type: "code",
          title: "iterative",
          code: `def search(root, v):
    while root and root.val != v:
        root = root.left if v < root.val else root.right
    return root`,
        },
        {
          type: "code",
          title: "recursive",
          code: `def search_rec(root, v):
    if not root or root.val == v: return root
    return search_rec(root.left, v) if v < root.val else search_rec(root.right, v)`,
        },
        {
          type: "dryRun",
          headers: ["Step", "cur", "Compare", "Move"],
          rows: [
            ["1", "50", "60 > 50", "right"],
            ["2", "70", "60 < 70", "left"],
            ["3", "60", "match", "return node"],
          ],
          caption: "Searching for 60 in the reference BST.",
        },
        {
          type: "traversalPlayer",
          mode: "in",
          root: {
            id: 50,
            label: 50,
            children: [
              {
                id: 30,
                label: 30,
                children: [
                  { id: 20, label: 20 },
                  { id: 40, label: 40 },
                ],
              },
              {
                id: 70,
                label: 70,
                children: [
                  { id: 60, label: 60 },
                  { id: 80, label: 80 },
                ],
              },
            ],
          },
        },
      ],
    },
    {
      slug: "successor",
      title: "Inorder Successor",
      eyebrow: "BST · 6",
      description: "The smallest value strictly greater than a target — used by deletion.",
      difficulty: "Intermediate",
      readMinutes: 3,
      sections: [
        {
          type: "code",
          code: `def successor(root, target):
    succ, cur = None, root
    while cur:
        if cur.val > target.val:
            succ = cur; cur = cur.left
        else:
            cur = cur.right
    return succ`,
        },
      ],
    },
    {
      slug: "predecessor",
      title: "Inorder Predecessor",
      eyebrow: "BST · 7",
      description: "The largest value strictly less than a target — mirror of successor.",
      difficulty: "Intermediate",
      readMinutes: 3,
      sections: [
        {
          type: "code",
          code: `def predecessor(root, target):
    pred, cur = None, root
    while cur:
        if cur.val < target.val:
            pred = cur; cur = cur.right
        else:
            cur = cur.left
    return pred`,
        },
      ],
    },
    {
      slug: "min",
      title: "Minimum",
      eyebrow: "BST · 8",
      description: "Walk left until you can't.",
      difficulty: "Beginner",
      readMinutes: 1,
      sections: [
        {
          type: "code",
          code: `def bst_min(root):
    while root.left: root = root.left
    return root.val`,
        },
      ],
    },
    {
      slug: "max",
      title: "Maximum",
      eyebrow: "BST · 9",
      description: "Walk right until you can't.",
      difficulty: "Beginner",
      readMinutes: 1,
      sections: [
        {
          type: "code",
          code: `def bst_max(root):
    while root.right: root = root.right
    return root.val`,
        },
      ],
    },
    {
      slug: "validation",
      title: "Validation",
      eyebrow: "BST · 10",
      description: "The canonical bounds-based BST validation.",
      difficulty: "Intermediate",
      readMinutes: 3,
      sections: [
        {
          type: "code",
          title: "bounds recursion",
          code: `import math
def is_bst(node, lo=-math.inf, hi=math.inf):
    if not node: return True
    if not (lo < node.val < hi): return False
    return (is_bst(node.left,  lo, node.val)
        and is_bst(node.right, node.val, hi))`,
        },
      ],
    },
    {
      slug: "applications",
      title: "Applications",
      eyebrow: "BST · 11",
      description: "Sorted map / set, order statistics, range queries.",
      difficulty: "Beginner",
      readMinutes: 2,
      sections: [
        {
          type: "theory",
          bullets: [
            "Sorted maps and sets when hashing isn't wanted.",
            "Rank / select and order statistic queries.",
            "Range queries — 'all keys between a and b'.",
            "Foundation for AVL, Red-Black, and Treap.",
          ],
        },
      ],
    },
    {
      slug: "complexity",
      title: "Complexity",
      eyebrow: "BST · 12",
      description: "O(h) everywhere — the whole point of balanced variants is to keep h small.",
      difficulty: "Beginner",
      readMinutes: 2,
      sections: [
        {
          type: "complexity",
          rows: [
            { op: "Search / insert / delete (balanced)", time: "O(log n)", space: "O(log n)" },
            { op: "Search / insert / delete (skewed)", time: "O(n)", space: "O(n)" },
            { op: "Min / max / successor / predecessor", time: "O(h)", space: "O(1)" },
          ],
        },
      ],
    },
    {
      slug: "interview-questions",
      title: "Interview Questions",
      eyebrow: "BST · 13",
      description: "Signature BST questions that show up in every rotation.",
      difficulty: "Intermediate",
      readMinutes: 3,
      sections: [
        {
          type: "interview",
          items: [
            "Validate a BST using bounds recursion.",
            "Find the kth smallest element using inorder traversal with a counter.",
            "Convert a sorted array to a balanced BST.",
            "Lowest common ancestor of two nodes in a BST (uses the ordering).",
            "Recover a BST where two nodes were swapped.",
            "Serialize / deserialize a BST using preorder + bounds.",
          ],
        },
      ],
    },
    {
      slug: "practice",
      title: "Practice",
      eyebrow: "BST · 14",
      description: "Solve these to internalise the property.",
      difficulty: "Intermediate",
      readMinutes: 3,
      sections: [
        {
          type: "practice",
          groups: [
            {
              level: "Beginner",
              items: [
                {
                  title: "LC 700 · Search in a BST",
                  url: "https://leetcode.com/problems/search-in-a-binary-search-tree/",
                  difficulty: "Easy",
                },
                {
                  title: "LC 701 · Insert into a BST",
                  url: "https://leetcode.com/problems/insert-into-a-binary-search-tree/",
                  difficulty: "Medium",
                },
              ],
            },
            {
              level: "Intermediate",
              items: [
                {
                  title: "LC 98 · Validate BST",
                  url: "https://leetcode.com/problems/validate-binary-search-tree/",
                  difficulty: "Medium",
                },
                {
                  title: "LC 230 · Kth Smallest Element",
                  url: "https://leetcode.com/problems/kth-smallest-element-in-a-bst/",
                  difficulty: "Medium",
                },
                {
                  title: "LC 235 · LCA of a BST",
                  url: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/",
                  difficulty: "Medium",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      slug: "quiz",
      title: "Quiz",
      eyebrow: "BST · 15",
      description: "Confirm the BST rules.",
      difficulty: "Beginner",
      readMinutes: 2,
      sections: [
        {
          type: "quiz",
          items: [
            {
              q: "Inorder traversal of a BST returns values in what order?",
              choices: ["Random", "Reverse insertion", "Ascending sorted", "Level by level"],
              answer: 2,
              explain: "L → root → R with L < root < R yields sorted output.",
            },
          ],
        },
      ],
    },
    {
      slug: "references",
      title: "References",
      eyebrow: "BST · 16",
      description: "Further reading.",
      difficulty: "Beginner",
      readMinutes: 1,
      sections: [
        {
          type: "references",
          items: [
            {
              label: "Sedgewick — BSTs (Algorithms)",
              url: "https://algs4.cs.princeton.edu/32bst/",
            },
            { label: "Visualgo — BST", url: "https://visualgo.net/en/bst" },
          ],
        },
      ],
    },
  ],
};
