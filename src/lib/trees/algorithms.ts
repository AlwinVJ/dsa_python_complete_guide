import type { TLesson } from "./types";

/** Tree Algorithms — the operations that work across every tree variant. */
export const T_ALGORITHMS: TLesson[] = [
  {
    slug: "dfs",
    title: "Depth-First Search (DFS)",
    eyebrow: "Algorithms · 1",
    description: "Go as deep as possible along each branch before backtracking.",
    difficulty: "Beginner",
    readMinutes: 3,
    sections: [
      { type: "theory", text: "DFS is the parent template of preorder, inorder, and postorder. It uses O(h) space (the recursion stack) and visits every node in O(n)." },
      { type: "code", code:
`def dfs(node, visit):
    if not node: return
    visit(node)
    dfs(node.left,  visit)
    dfs(node.right, visit)` },
      { type: "complexity", rows: [{ op: "DFS", time: "O(n)", space: "O(h)" }] },
    ],
  },
  {
    slug: "bfs",
    title: "Breadth-First Search (BFS)",
    eyebrow: "Algorithms · 2",
    description: "Visit level by level using a queue.",
    difficulty: "Beginner",
    readMinutes: 3,
    sections: [
      { type: "code", code:
`from collections import deque
def bfs(root, visit):
    if not root: return
    q = deque([root])
    while q:
        n = q.popleft()
        visit(n)
        if n.left:  q.append(n.left)
        if n.right: q.append(n.right)` },
      { type: "callout", kind: "tip", title: "When to pick BFS",
        text: "Shortest edge-count path in a tree, minimum-depth problems, and any question asking about levels." },
    ],
  },
  {
    slug: "preorder",
    title: "Preorder Traversal",
    eyebrow: "Algorithms · 3",
    description: "Root → Left → Right. Useful for copying and serializing.",
    difficulty: "Beginner",
    readMinutes: 3,
    sections: [
      { type: "code", code:
`def preorder(node, out):
    if not node: return
    out.append(node.val)
    preorder(node.left,  out)
    preorder(node.right, out)

# iterative with stack
def preorder_iter(root):
    stack, out = [root] if root else [], []
    while stack:
        n = stack.pop()
        out.append(n.val)
        if n.right: stack.append(n.right)
        if n.left:  stack.append(n.left)
    return out` },
    ],
  },
  {
    slug: "inorder",
    title: "Inorder Traversal",
    eyebrow: "Algorithms · 4",
    description: "Left → Root → Right. On a BST, returns values in sorted order.",
    difficulty: "Beginner",
    readMinutes: 3,
    sections: [
      { type: "code", code:
`def inorder(node, out):
    if not node: return
    inorder(node.left, out)
    out.append(node.val)
    inorder(node.right, out)

def inorder_iter(root):
    stack, out, cur = [], [], root
    while cur or stack:
        while cur: stack.append(cur); cur = cur.left
        cur = stack.pop(); out.append(cur.val)
        cur = cur.right
    return out` },
    ],
  },
  {
    slug: "postorder",
    title: "Postorder Traversal",
    eyebrow: "Algorithms · 5",
    description: "Left → Right → Root. Process children before their parent — used for evaluation and cleanup.",
    difficulty: "Beginner",
    readMinutes: 3,
    sections: [
      { type: "code", code:
`def postorder(node, out):
    if not node: return
    postorder(node.left,  out)
    postorder(node.right, out)
    out.append(node.val)` },
    ],
  },
  {
    slug: "level-order",
    title: "Level Order Traversal",
    eyebrow: "Algorithms · 6",
    description: "BFS grouped by depth — a list of lists.",
    difficulty: "Intermediate",
    readMinutes: 3,
    sections: [
      { type: "code", code:
`from collections import deque
def level_order(root):
    if not root: return []
    q, out = deque([root]), []
    while q:
        level = []
        for _ in range(len(q)):
            n = q.popleft()
            level.append(n.val)
            if n.left:  q.append(n.left)
            if n.right: q.append(n.right)
        out.append(level)
    return out` },
    ],
  },
  {
    slug: "height",
    title: "Height of a Tree",
    eyebrow: "Algorithms · 7",
    description: "The longest edge-count from a node to a leaf.",
    difficulty: "Beginner",
    readMinutes: 2,
    sections: [
      { type: "code", code:
`def height(node):
    if not node: return -1     # 0 for node-count convention
    return 1 + max(height(node.left), height(node.right))` },
    ],
  },
  {
    slug: "depth",
    title: "Depth of a Node",
    eyebrow: "Algorithms · 8",
    description: "The number of edges from the root down to that node.",
    difficulty: "Beginner",
    readMinutes: 2,
    sections: [
      { type: "code", code:
`def depth(root, target, d=0):
    if not root: return -1
    if root is target: return d
    left = depth(root.left, target, d + 1)
    if left != -1: return left
    return depth(root.right, target, d + 1)` },
    ],
  },
  {
    slug: "diameter",
    title: "Diameter",
    eyebrow: "Algorithms · 9",
    description: "The longest path between any two nodes — measured in edges.",
    difficulty: "Intermediate",
    readMinutes: 4,
    sections: [
      { type: "code", code:
`def diameter(root):
    best = [0]
    def h(n):
        if not n: return 0
        l = h(n.left);  r = h(n.right)
        best[0] = max(best[0], l + r)
        return 1 + max(l, r)
    h(root)
    return best[0]` },
      { type: "callout", kind: "tip", title: "Global vs local",
        text: "The diameter through node n is left_height + right_height. Track the max as you compute heights." },
    ],
  },
  {
    slug: "lca",
    title: "Lowest Common Ancestor",
    eyebrow: "Algorithms · 10",
    description: "The deepest node that has both targets in its subtree.",
    difficulty: "Intermediate",
    readMinutes: 4,
    sections: [
      { type: "code", title: "general binary tree", code:
`def lca(root, p, q):
    if not root or root is p or root is q: return root
    L = lca(root.left,  p, q)
    R = lca(root.right, p, q)
    return root if L and R else (L or R)` },
      { type: "code", title: "BST — use the ordering", code:
`def lca_bst(root, p, q):
    while root:
        if p.val < root.val and q.val < root.val:  root = root.left
        elif p.val > root.val and q.val > root.val: root = root.right
        else: return root` },
    ],
  },
  {
    slug: "balanced-check",
    title: "Balanced Tree Check",
    eyebrow: "Algorithms · 11",
    description: "|height(left) − height(right)| ≤ 1 at every node.",
    difficulty: "Intermediate",
    readMinutes: 3,
    sections: [
      { type: "code", code:
`def is_balanced(root):
    def h(n):
        if not n: return 0
        l = h(n.left);  r = h(n.right)
        if l < 0 or r < 0 or abs(l - r) > 1: return -1
        return 1 + max(l, r)
    return h(root) >= 0` },
    ],
  },
  {
    slug: "invert",
    title: "Invert Tree",
    eyebrow: "Algorithms · 12",
    description: "Swap left and right at every node — the famous whiteboard question.",
    difficulty: "Beginner",
    readMinutes: 2,
    sections: [
      { type: "code", code:
`def invert(root):
    if not root: return None
    root.left, root.right = invert(root.right), invert(root.left)
    return root` },
    ],
  },
  {
    slug: "serialize",
    title: "Serialize",
    eyebrow: "Algorithms · 13",
    description: "Turn a tree into a string — preorder with nulls is easiest.",
    difficulty: "Advanced",
    readMinutes: 3,
    sections: [
      { type: "code", code:
`def serialize(root):
    parts = []
    def walk(n):
        if not n: parts.append("#"); return
        parts.append(str(n.val))
        walk(n.left); walk(n.right)
    walk(root)
    return ",".join(parts)` },
    ],
  },
  {
    slug: "deserialize",
    title: "Deserialize",
    eyebrow: "Algorithms · 14",
    description: "Rebuild a tree from a preorder-with-nulls string.",
    difficulty: "Advanced",
    readMinutes: 3,
    sections: [
      { type: "code", code:
`def deserialize(data):
    it = iter(data.split(","))
    def build():
        v = next(it)
        if v == "#": return None
        n = TreeNode(int(v))
        n.left  = build()
        n.right = build()
        return n
    return build()` },
    ],
  },
  {
    slug: "boundary",
    title: "Boundary Traversal",
    eyebrow: "Algorithms · 15",
    description: "Left boundary + leaves + right boundary reversed.",
    difficulty: "Advanced",
    readMinutes: 4,
    sections: [
      { type: "theory", text: "Boundary traversal returns nodes on the outline of the tree in anticlockwise order. Split it into three passes: left boundary (top-down), leaves (left-to-right), right boundary (bottom-up)." },
    ],
  },
  {
    slug: "vertical-order",
    title: "Vertical Order Traversal",
    eyebrow: "Algorithms · 16",
    description: "Group nodes by their horizontal distance from the root.",
    difficulty: "Advanced",
    readMinutes: 3,
    sections: [
      { type: "code", code:
`from collections import defaultdict, deque
def vertical(root):
    cols = defaultdict(list)
    q = deque([(root, 0)])
    while q:
        n, x = q.popleft()
        if not n: continue
        cols[x].append(n.val)
        q.append((n.left,  x - 1))
        q.append((n.right, x + 1))
    return [cols[k] for k in sorted(cols)]` },
    ],
  },
  {
    slug: "zigzag",
    title: "Zig-Zag Traversal",
    eyebrow: "Algorithms · 17",
    description: "Level order alternating left-to-right and right-to-left.",
    difficulty: "Intermediate",
    readMinutes: 3,
    sections: [
      { type: "code", code:
`from collections import deque
def zigzag(root):
    if not root: return []
    q, out, ltr = deque([root]), [], True
    while q:
        lvl = []
        for _ in range(len(q)):
            n = q.popleft()
            lvl.append(n.val)
            if n.left:  q.append(n.left)
            if n.right: q.append(n.right)
        out.append(lvl if ltr else lvl[::-1])
        ltr = not ltr
    return out` },
    ],
  },
  {
    slug: "views",
    title: "Top / Bottom / Left / Right View",
    eyebrow: "Algorithms · 18",
    description: "Four related traversals — the visible silhouette of the tree from each side.",
    difficulty: "Intermediate",
    readMinutes: 4,
    sections: [
      { type: "table", headers: ["View", "First visited per…"], rows: [
        ["Top view", "horizontal distance (BFS)"],
        ["Bottom view", "horizontal distance (BFS, last write wins)"],
        ["Left view", "depth (BFS, first per level)"],
        ["Right view", "depth (BFS, last per level)"],
      ]},
    ],
  },
  {
    slug: "mirror",
    title: "Mirror Tree",
    eyebrow: "Algorithms · 19",
    description: "Same operation as Invert — swap children top-down.",
    difficulty: "Beginner",
    readMinutes: 2,
    sections: [
      { type: "code", code:
`def mirror(root):
    if not root: return None
    root.left, root.right = mirror(root.right), mirror(root.left)
    return root` },
    ],
  },
  {
    slug: "reconstruction",
    title: "Tree Reconstruction",
    eyebrow: "Algorithms · 20",
    description: "Rebuild a tree from any two of {preorder, inorder, postorder}.",
    difficulty: "Advanced",
    readMinutes: 4,
    sections: [
      { type: "code", title: "preorder + inorder", code:
`def build(preorder, inorder):
    idx = {v: i for i, v in enumerate(inorder)}
    it = iter(preorder)
    def go(l, r):
        if l > r: return None
        v = next(it)
        i = idx[v]
        n = TreeNode(v)
        n.left  = go(l, i - 1)
        n.right = go(i + 1, r)
        return n
    return go(0, len(inorder) - 1)` },
    ],
  },
  {
    slug: "complexity-comparison",
    title: "Complexity Comparison",
    eyebrow: "Algorithms · 21",
    description: "Every algorithm at a glance.",
    difficulty: "Beginner",
    readMinutes: 3,
    sections: [
      { type: "complexity", rows: [
        { op: "DFS / BFS / traversals", time: "O(n)", space: "O(h) / O(w)" },
        { op: "Height / depth / size", time: "O(n)", space: "O(h)" },
        { op: "Diameter", time: "O(n)", space: "O(h)" },
        { op: "LCA (general binary tree)", time: "O(n)", space: "O(h)" },
        { op: "LCA (BST)", time: "O(h)", space: "O(1)" },
        { op: "Balanced check", time: "O(n)", space: "O(h)" },
        { op: "Serialize / deserialize", time: "O(n)", space: "O(n)" },
        { op: "Reconstruction from two orders", time: "O(n)", space: "O(n)" },
      ]},
    ],
  },
  {
    slug: "practice",
    title: "Practice",
    eyebrow: "Algorithms · 22",
    description: "One problem for every algorithm above.",
    difficulty: "Intermediate",
    readMinutes: 4,
    sections: [
      { type: "practice", groups: [
        { level: "Beginner", items: [
          { title: "LC 104 · Max Depth", url: "https://leetcode.com/problems/maximum-depth-of-binary-tree/", difficulty: "Easy" },
          { title: "LC 226 · Invert Binary Tree", url: "https://leetcode.com/problems/invert-binary-tree/", difficulty: "Easy" },
          { title: "LC 543 · Diameter", url: "https://leetcode.com/problems/diameter-of-binary-tree/", difficulty: "Easy" },
        ]},
        { level: "Intermediate", items: [
          { title: "LC 102 · Level Order", url: "https://leetcode.com/problems/binary-tree-level-order-traversal/", difficulty: "Medium" },
          { title: "LC 236 · LCA of Binary Tree", url: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/", difficulty: "Medium" },
          { title: "LC 199 · Right Side View", url: "https://leetcode.com/problems/binary-tree-right-side-view/", difficulty: "Medium" },
          { title: "LC 103 · Zigzag Level Order", url: "https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/", difficulty: "Medium" },
        ]},
        { level: "Advanced", items: [
          { title: "LC 297 · Serialize / Deserialize", url: "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/", difficulty: "Hard" },
          { title: "LC 124 · Max Path Sum", url: "https://leetcode.com/problems/binary-tree-maximum-path-sum/", difficulty: "Hard" },
          { title: "LC 987 · Vertical Order Traversal", url: "https://leetcode.com/problems/vertical-order-traversal-of-a-binary-tree/", difficulty: "Hard" },
        ]},
      ]},
    ],
  },
  {
    slug: "interview-questions",
    title: "Interview Questions",
    eyebrow: "Algorithms · 23",
    description: "Common variants of the algorithms above that interviewers love.",
    difficulty: "Intermediate",
    readMinutes: 3,
    sections: [
      { type: "interview", items: [
        "How do you find the diameter of a binary tree in one pass?",
        "How do LCA algorithms differ between a general binary tree and a BST?",
        "Which traversal reconstructs a BST from a single output list?",
        "How would you serialise a tree with duplicate values?",
        "Design an iterator that returns the next inorder value in O(1) amortised.",
      ]},
    ],
  },
];
