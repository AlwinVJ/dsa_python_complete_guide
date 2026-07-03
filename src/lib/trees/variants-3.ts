import type { TreeVariantMeta } from "./types";

// ----------------------------------------------------------------------------
// Trie
// ----------------------------------------------------------------------------
export const V_TRIE: TreeVariantMeta = {
  slug: "trie",
  title: "Trie",
  tagline: "A tree indexed by character — the shape behind autocomplete, spellcheck, and IP routing.",
  lessons: [
    {
      slug: "introduction",
      title: "Introduction",
      eyebrow: "Trie · 1",
      description: "A prefix tree — each edge is a character; each path from the root spells a stored string.",
      difficulty: "Intermediate",
      readMinutes: 4,
      sections: [
        { type: "theory", text: "A trie (pronounced 'try', from *retrieval*) stores strings by their prefixes. Insert 'cat', 'car', and 'cart', and you share the 'ca' prefix once. Lookup, prefix search, and autocomplete are all linear in the KEY length — independent of the dictionary size. That is the property no hash table can match." },
        { type: "tree", root: { id: "*", label: "•", color: "brand",
          children: [
            { id: "c", label: "c", children: [
              { id: "ca", label: "a", children: [
                { id: "cat", label: "t", color: "visited", badge: "end" },
                { id: "car", label: "r", color: "visited", badge: "end", children: [
                  { id: "cart", label: "t", color: "visited", badge: "end" },
                ]},
              ]},
            ]},
          ],
        }, caption: "Trie storing {cat, car, cart} — green nodes mark word ends." },
      ],
    },
    {
      slug: "internal-structure",
      title: "Internal Structure",
      eyebrow: "Trie · 2",
      description: "How characters, edges, and end-of-word flags fit together.",
      difficulty: "Beginner",
      readMinutes: 3,
      sections: [
        { type: "theory", bullets: [
          "Root is empty and represents the empty prefix.",
          "Each edge is labelled with a single character.",
          "Each node represents the prefix formed by the path from the root.",
          "A boolean `is_end` marks whether that prefix is itself a stored word.",
          "Two words with a common prefix share the corresponding path — that's the space win.",
        ]},
        { type: "table", headers: ["Term", "Meaning"], rows: [
          ["Alphabet Σ", "Set of possible characters (26 for a-z, 128 for ASCII, unbounded for Unicode)."],
          ["Depth", "Length of the longest key inserted."],
          ["End node", "A node whose is_end flag is True."],
          ["Fan-out", "Number of children — up to |Σ|."],
        ]},
      ],
    },
    {
      slug: "memory-representation",
      title: "Memory Representation",
      eyebrow: "Trie · 3",
      description: "Dict-of-children vs fixed array — the classic trade-off.",
      difficulty: "Intermediate",
      readMinutes: 3,
      sections: [
        { type: "table", headers: ["Representation", "Space per node", "Pros", "Cons"], rows: [
          ["dict {ch: node}", "≈ 80B empty, grows", "Sparse-friendly, any alphabet", "Slower dispatch, hashing overhead"],
          ["list of 26/128 pointers", "26 · pointer size", "O(1) lookup, cache friendly", "Wastes space when children are sparse"],
          ["Compressed (radix)", "≈ label length", "Best space for sparse dictionaries", "Trickier code, edge splits"],
        ]},
        { type: "memoryDiagram", nodes: [
          { id: "root", value: "•", left: "c", right: null },
          { id: "c", value: "c", left: "a", right: null },
          { id: "a", value: "a", left: "t", right: "r" },
          { id: "t", value: "t*", left: null, right: null },
          { id: "r", value: "r*", left: "rt", right: null },
          { id: "rt", value: "t*", left: null, right: null },
        ], caption: "* denotes is_end=True. Shared 'ca' prefix ties {cat, car, cart} together." },
      ],
    },
    {
      slug: "node-structure",
      title: "Node Structure",
      eyebrow: "Trie · 4",
      description: "A minimal Python node.",
      difficulty: "Beginner",
      readMinutes: 2,
      sections: [
        { type: "code", code:
`class TrieNode:
    __slots__ = ("children", "is_end")

    def __init__(self):
        self.children: dict[str, "TrieNode"] = {}
        self.is_end: bool = False` },
      ],
    },
    {
      slug: "creation",
      title: "Creation",
      eyebrow: "Trie · 5",
      description: "Bootstrap an empty trie.",
      difficulty: "Beginner",
      readMinutes: 1,
      sections: [
        { type: "code", code:
`class Trie:
    def __init__(self):
        self.root = TrieNode()` },
      ],
    },
    {
      slug: "insertion",
      title: "Insertion",
      eyebrow: "Trie · 6",
      description: "Walk / create one edge per character, then mark the final node.",
      difficulty: "Beginner",
      readMinutes: 3,
      sections: [
        { type: "code", code:
`def insert(self, word: str) -> None:
    node = self.root
    for ch in word:
        node = node.children.setdefault(ch, TrieNode())
    node.is_end = True` },
        { type: "callout", kind: "tip", text: "Using `dict.setdefault` avoids the two-line 'if not in, create' idiom — one dict lookup instead of two." },
      ],
    },
    {
      slug: "search",
      title: "Search",
      eyebrow: "Trie · 7",
      description: "Walk character-by-character; check the end flag.",
      difficulty: "Beginner",
      readMinutes: 2,
      sections: [
        { type: "code", code:
`def search(self, word: str) -> bool:
    node = self._walk(word)
    return node is not None and node.is_end

def _walk(self, s: str):
    node = self.root
    for ch in s:
        node = node.children.get(ch)
        if node is None: return None
    return node` },
      ],
    },
    {
      slug: "prefix-search",
      title: "Prefix Search",
      eyebrow: "Trie · 8",
      description: "Walk the prefix; if you don't fall off, every descendant is a match.",
      difficulty: "Beginner",
      readMinutes: 2,
      sections: [
        { type: "code", code:
`def starts_with(self, prefix: str) -> bool:
    return self._walk(prefix) is not None` },
      ],
    },
    {
      slug: "deletion",
      title: "Deletion",
      eyebrow: "Trie · 9",
      description: "Unset the end flag, then prune orphan nodes on the way back up.",
      difficulty: "Intermediate",
      readMinutes: 3,
      sections: [
        { type: "code", code:
`def delete(self, word: str) -> bool:
    def go(node, i):
        if i == len(word):
            if not node.is_end: return False   # not present
            node.is_end = False
            return len(node.children) == 0     # ok to prune
        ch = word[i]
        child = node.children.get(ch)
        if child is None: return False
        prune = go(child, i + 1)
        if prune:
            del node.children[ch]
            return not node.is_end and len(node.children) == 0
        return False
    return go(self.root, 0)` },
        { type: "callout", kind: "warn", text: "Never prune a node whose is_end is True or which still has children — that would silently erase other words." },
      ],
    },
    {
      slug: "autocomplete",
      title: "Autocomplete",
      eyebrow: "Trie · 10",
      description: "Locate the prefix node, then DFS-collect every word beneath it.",
      difficulty: "Intermediate",
      readMinutes: 4,
      sections: [
        { type: "code", code:
`def autocomplete(self, prefix: str, limit: int = 10) -> list[str]:
    node = self._walk(prefix)
    if node is None: return []
    out: list[str] = []
    def dfs(n, path):
        if len(out) >= limit: return
        if n.is_end: out.append(prefix + "".join(path))
        for ch in sorted(n.children):
            path.append(ch); dfs(n.children[ch], path); path.pop()
    dfs(node, [])
    return out` },
        { type: "triePlayground", seed: ["cat", "car", "cart", "care", "cargo", "dog", "dove"], caption: "Type a prefix and watch the trie light up matching paths." },
      ],
    },
    {
      slug: "traversal",
      title: "Traversal — All Words",
      eyebrow: "Trie · 11",
      description: "Yield every stored word in sorted order.",
      difficulty: "Beginner",
      readMinutes: 2,
      sections: [
        { type: "code", code:
`def words(self):
    out = []
    def dfs(n, path):
        if n.is_end: out.append("".join(path))
        for ch in sorted(n.children):
            path.append(ch); dfs(n.children[ch], path); path.pop()
    dfs(self.root, [])
    return out` },
      ],
    },
    {
      slug: "complexity",
      title: "Complexity",
      eyebrow: "Trie · 12",
      description: "Time is O(key length) — independent of the dictionary size.",
      difficulty: "Beginner",
      readMinutes: 2,
      sections: [
        { type: "complexity", rows: [
          { op: "Insert", time: "O(L)", space: "O(L · Σ)", note: "L = key length, Σ = alphabet" },
          { op: "Search / prefix", time: "O(L)", space: "O(1)" },
          { op: "Delete", time: "O(L)", space: "O(L) rec" },
          { op: "Autocomplete top-k", time: "O(L + k · L)", note: "DFS bounded by k results" },
          { op: "Total space", time: "O(N · Σ)", note: "N = total chars stored — compressed trie beats it" },
        ]},
      ],
    },
    {
      slug: "advantages",
      title: "Advantages",
      eyebrow: "Trie · 13",
      description: "Where tries win over hash tables and BSTs.",
      difficulty: "Beginner",
      readMinutes: 2,
      sections: [
        { type: "theory", bullets: [
          "Prefix operations are trivial — hash tables can't do prefix queries at all.",
          "Time depends on key length, not dictionary size.",
          "Sorted enumeration for free.",
          "No hash collisions, no rehashing.",
          "Shared prefixes save memory for large dictionaries.",
        ]},
      ],
    },
    {
      slug: "disadvantages",
      title: "Disadvantages",
      eyebrow: "Trie · 14",
      description: "Where a plain dict wins.",
      difficulty: "Beginner",
      readMinutes: 2,
      sections: [
        { type: "theory", bullets: [
          "Memory-hungry for small dictionaries — each node has overhead.",
          "Cache-unfriendly for pointer-based implementations.",
          "Wide alphabets (Unicode) blow up per-node arrays — use dicts or compressed tries.",
          "Deletion is fiddly to get right (pruning invariants).",
        ]},
      ],
    },
    {
      slug: "applications",
      title: "Applications",
      eyebrow: "Trie · 15",
      description: "Where tries power real products.",
      difficulty: "Beginner",
      readMinutes: 2,
      sections: [
        { type: "theory", bullets: [
          "IDE autocomplete and search suggestions.",
          "Spell checkers (edit-distance search inside a trie).",
          "IP routing tables (radix / Patricia tries).",
          "T9 predictive keyboards.",
          "Aho-Corasick multi-pattern matching (spam/AV scanners).",
          "URL routers (nested prefix match).",
        ]},
      ],
    },
    {
      slug: "python-implementation",
      title: "Complete Python Implementation",
      eyebrow: "Trie · 16",
      description: "A ready-to-use Trie with insert, search, prefix, delete, and autocomplete.",
      difficulty: "Intermediate",
      readMinutes: 5,
      sections: [
        { type: "code", code:
`class TrieNode:
    __slots__ = ("children", "is_end")
    def __init__(self):
        self.children: dict[str, "TrieNode"] = {}
        self.is_end = False


class Trie:
    def __init__(self):
        self.root = TrieNode()

    # ---------- writes ----------
    def insert(self, word: str) -> None:
        node = self.root
        for ch in word:
            node = node.children.setdefault(ch, TrieNode())
        node.is_end = True

    def delete(self, word: str) -> bool:
        def go(n, i):
            if i == len(word):
                if not n.is_end: return False
                n.is_end = False
                return not n.children
            ch = word[i]
            c = n.children.get(ch)
            if c is None: return False
            prune = go(c, i + 1)
            if prune:
                del n.children[ch]
                return not n.is_end and not n.children
            return False
        return go(self.root, 0)

    # ---------- reads ----------
    def _walk(self, s: str):
        node = self.root
        for ch in s:
            node = node.children.get(ch)
            if node is None: return None
        return node

    def search(self, word: str) -> bool:
        n = self._walk(word)
        return n is not None and n.is_end

    def starts_with(self, prefix: str) -> bool:
        return self._walk(prefix) is not None

    def autocomplete(self, prefix: str, limit: int = 10) -> list[str]:
        node = self._walk(prefix)
        if node is None: return []
        out: list[str] = []
        def dfs(n, path):
            if len(out) >= limit: return
            if n.is_end: out.append(prefix + "".join(path))
            for ch in sorted(n.children):
                path.append(ch); dfs(n.children[ch], path); path.pop()
        dfs(node, [])
        return out


if __name__ == "__main__":
    t = Trie()
    for w in ["cat", "car", "cart", "care", "cargo", "dog", "dove"]:
        t.insert(w)
    print(t.search("car"))            # True
    print(t.search("ca"))             # False (prefix, not word)
    print(t.starts_with("ca"))        # True
    print(t.autocomplete("ca"))       # ['car', 'care', 'cargo', 'cart', 'cat']
    t.delete("car")
    print(t.autocomplete("ca"))       # ['care', 'cargo', 'cart', 'cat']` },
      ],
    },
    {
      slug: "dry-run",
      title: "Dry Run",
      eyebrow: "Trie · 17",
      description: "Insert 'cat', 'car', 'cart' and watch the trie grow.",
      difficulty: "Beginner",
      readMinutes: 3,
      sections: [
        { type: "dryRun", headers: ["Step", "Op", "Root children", "Notes"], rows: [
          ["1", "insert('cat')", "{c → a → t*}", "3 new nodes, mark t as end"],
          ["2", "insert('car')", "{c → a → {t*, r*}}", "share 'ca'; add sibling r"],
          ["3", "insert('cart')", "{c → a → {t*, r* → t*}}", "share 'car'; extend to t"],
          ["4", "search('car')", "→ True", "walk c-a-r, is_end=True"],
          ["5", "search('ca')", "→ False", "prefix exists but is_end=False"],
          ["6", "starts_with('ca')", "→ True", "walk c-a succeeds"],
          ["7", "delete('cat')", "{c → a → {r* → t*}}", "prune orphan t leaf"],
        ]},
      ],
    },
    {
      slug: "common-mistakes",
      title: "Common Mistakes",
      eyebrow: "Trie · 18",
      description: "The bugs every trie eventually ships.",
      difficulty: "Intermediate",
      readMinutes: 3,
      sections: [
        { type: "mistakes", items: [
          "Treating a prefix as a word — forgetting to check is_end in `search`.",
          "Deleting a shared prefix and wiping out other words. Only prune leaves.",
          "Fixed-size arrays sized to 26 when the alphabet is Unicode.",
          "Mutating shared list-of-children arrays without copying them.",
          "Building a trie in Python with a class per node when a nested dict would do — but then losing the is_end flag by convention (use a sentinel key like '$').",
        ]},
      ],
    },
    {
      slug: "faq",
      title: "FAQ",
      eyebrow: "Trie · 19",
      description: "The most common questions.",
      difficulty: "Beginner",
      readMinutes: 3,
      sections: [
        { type: "interview", items: [
          "Is a trie faster than a hash set for lookups? — Not for exact match; but tries win on prefix ops.",
          "How much memory does a trie use? — O(total characters × per-node overhead) — a lot unless compressed.",
          "What is a Patricia / radix trie? — A trie where chains of single-child nodes are compressed into one edge.",
          "Can a trie store non-string keys? — Yes, any sequence: byte strings, integers-as-bits, tokens.",
          "Where does Aho-Corasick fit? — It's a trie + failure links for multi-pattern matching.",
        ]},
      ],
    },
    {
      slug: "interview-questions",
      title: "Interview Questions",
      eyebrow: "Trie · 20",
      description: "Trie interview classics.",
      difficulty: "Intermediate",
      readMinutes: 3,
      sections: [
        { type: "interview", items: [
          "Implement a Trie with insert, search, and startsWith.",
          "Design an autocomplete system with top-k results by frequency.",
          "Word Search II — find all dictionary words in a grid.",
          "Longest common prefix of a set of strings using a trie.",
          "Replace words in a sentence with their shortest root (LC 648).",
          "Design a search dictionary that supports '.' wildcards (LC 211).",
        ]},
      ],
    },
    {
      slug: "practice",
      title: "Practice",
      eyebrow: "Trie · 21",
      description: "Classic trie interview problems.",
      difficulty: "Intermediate",
      readMinutes: 3,
      sections: [
        { type: "practice", groups: [
          { level: "Beginner", items: [
            { title: "LC 208 · Implement Trie", url: "https://leetcode.com/problems/implement-trie-prefix-tree/", difficulty: "Medium", pattern: "Foundation" },
            { title: "LC 720 · Longest Word in Dictionary", url: "https://leetcode.com/problems/longest-word-in-dictionary/", difficulty: "Medium" },
          ]},
          { level: "Intermediate", items: [
            { title: "LC 211 · Add and Search Word", url: "https://leetcode.com/problems/design-add-and-search-words-data-structure/", difficulty: "Medium", pattern: "Wildcard DFS" },
            { title: "LC 648 · Replace Words", url: "https://leetcode.com/problems/replace-words/", difficulty: "Medium" },
            { title: "LC 677 · Map Sum Pairs", url: "https://leetcode.com/problems/map-sum-pairs/", difficulty: "Medium", pattern: "Prefix sum" },
          ]},
          { level: "Advanced", items: [
            { title: "LC 212 · Word Search II", url: "https://leetcode.com/problems/word-search-ii/", difficulty: "Hard", pattern: "Trie + backtracking" },
            { title: "LC 336 · Palindrome Pairs", url: "https://leetcode.com/problems/palindrome-pairs/", difficulty: "Hard" },
            { title: "LC 1032 · Stream of Characters", url: "https://leetcode.com/problems/stream-of-characters/", difficulty: "Hard", pattern: "Suffix trie" },
          ]},
        ]},
      ],
    },
    {
      slug: "quiz",
      title: "Quiz",
      eyebrow: "Trie · 22",
      description: "Confirm the complexity story.",
      difficulty: "Beginner",
      readMinutes: 2,
      sections: [
        { type: "quiz", items: [
          { q: "A trie lookup for a length-L key over an n-word dictionary runs in…",
            choices: ["O(n)", "O(log n)", "O(L)", "O(L · n)"], answer: 2,
            explain: "Trie lookups depend only on the key length." },
          { q: "Deleting a word from a trie should…",
            choices: ["Always remove every node on its path", "Never touch the tree — just flip is_end", "Flip is_end, then prune only childless, non-end nodes on the way up", "Rebuild the whole trie"], answer: 2,
            explain: "Prune upward only while a node is childless and not an end for another word." },
          { q: "Which structure beats a trie for exact-match membership?",
            choices: ["Sorted array", "Hash set", "Segment tree", "Linked list"], answer: 1,
            explain: "Hash sets are O(1) average per exact lookup; tries pay per character." },
        ]},
      ],
    },
    {
      slug: "references",
      title: "References",
      eyebrow: "Trie · 23",
      description: "Papers, textbooks, and further reading.",
      difficulty: "Beginner",
      readMinutes: 2,
      sections: [
        { type: "references", items: [
          { label: "Fredkin — Trie Memory (1960)", url: "https://dl.acm.org/doi/10.1145/367390.367400" },
          { label: "Sedgewick & Wayne — Tries (Algorithms 4e)", url: "https://algs4.cs.princeton.edu/52trie/" },
          { label: "Aho-Corasick algorithm (Wikipedia)", url: "https://en.wikipedia.org/wiki/Aho%E2%80%93Corasick_algorithm" },
          { label: "Radix tree / Patricia trie", url: "https://en.wikipedia.org/wiki/Radix_tree" },
          { label: "LeetCode Trie tag", url: "https://leetcode.com/tag/trie/" },
        ]},
      ],
    },
  ],
};

// ----------------------------------------------------------------------------
// Segment Tree
// ----------------------------------------------------------------------------
export const V_SEGMENT: TreeVariantMeta = {
  slug: "segment-tree",
  title: "Segment Tree",
  tagline: "Answer any associative range query and point/range update on an array in O(log n).",
  lessons: [
    {
      slug: "introduction",
      title: "Introduction",
      eyebrow: "Segment Tree · 1",
      description: "A balanced binary tree over array intervals — each node stores an aggregate over its range.",
      difficulty: "Intermediate",
      readMinutes: 4,
      sections: [
        { type: "theory", text: "A segment tree over an n-element array uses O(n) space and answers any associative range query (sum, min, max, gcd, xor, mod-p sum…) in O(log n). Point updates are O(log n) too, and with lazy propagation whole-range updates are O(log n) as well. It is the workhorse structure of competitive programming." },
        { type: "callout", kind: "info", title: "When to reach for a segment tree", text: "You have an array, you need range queries AND point/range updates, and the operation is associative. If it's only sum, a Fenwick tree is smaller and faster." },
      ],
    },
    {
      slug: "internal-structure",
      title: "Internal Structure",
      eyebrow: "Segment Tree · 2",
      description: "How intervals split into a perfect(ish) binary tree.",
      difficulty: "Intermediate",
      readMinutes: 3,
      sections: [
        { type: "theory", bullets: [
          "The root covers [0, n−1].",
          "Each internal node covers [l, r]; its children cover [l, m] and [m+1, r] with m = (l+r)/2.",
          "Leaves cover single indices [i, i].",
          "Each node stores the aggregate of its range.",
          "The tree has ≤ 4n nodes total — safe upper bound for the array-backed form.",
        ]},
      ],
    },
    {
      slug: "memory-representation",
      title: "Memory Representation",
      eyebrow: "Segment Tree · 3",
      description: "Flat array indexed like a heap: 2i and 2i+1.",
      difficulty: "Intermediate",
      readMinutes: 3,
      sections: [
        { type: "theory", text: "Store the tree in a flat array `t` of size 4n. Node 1 is the root; node i's children are 2i and 2i+1. This is the same trick as a binary heap and avoids per-node allocation." },
        { type: "memoryDiagram", nodes: [
          { id: "1", value: "sum[0..3]=10", left: "2", right: "3" },
          { id: "2", value: "sum[0..1]=3", left: "4", right: "5" },
          { id: "3", value: "sum[2..3]=7", left: "6", right: "7" },
          { id: "4", value: "a[0]=1", left: null, right: null },
          { id: "5", value: "a[1]=2", left: null, right: null },
          { id: "6", value: "a[2]=3", left: null, right: null },
          { id: "7", value: "a[3]=4", left: null, right: null },
        ], caption: "Segment tree for [1,2,3,4] laid out heap-style in a flat array." },
      ],
    },
    {
      slug: "node-structure",
      title: "Node Structure",
      eyebrow: "Segment Tree · 4",
      description: "A single number per node — no allocation, just an integer.",
      difficulty: "Beginner",
      readMinutes: 2,
      sections: [
        { type: "code", code:
`# The 'node' is just an index into a flat array.
# For sum: t[node] = t[2*node] + t[2*node+1]
# For min: t[node] = min(t[2*node], t[2*node+1])
# For any associative op f: t[node] = f(t[2*node], t[2*node+1])` },
      ],
    },
    {
      slug: "creation",
      title: "Creation",
      eyebrow: "Segment Tree · 5",
      description: "Allocate the 4n array and set the merge operation.",
      difficulty: "Beginner",
      readMinutes: 2,
      sections: [
        { type: "code", code:
`class SegTree:
    def __init__(self, arr, op=lambda a, b: a + b, identity=0):
        self.n = len(arr)
        self.op = op
        self.identity = identity
        self.t = [identity] * (4 * max(self.n, 1))
        if self.n:
            self._build(arr, 1, 0, self.n - 1)` },
      ],
    },
    {
      slug: "construction",
      title: "Construction",
      eyebrow: "Segment Tree · 6",
      description: "Bottom-up build in O(n).",
      difficulty: "Intermediate",
      readMinutes: 4,
      sections: [
        { type: "code", title: "sum segment tree — build", code:
`def _build(self, a, node, l, r):
    if l == r:
        self.t[node] = a[l]
        return
    m = (l + r) // 2
    self._build(a, 2*node,   l,   m)
    self._build(a, 2*node+1, m+1, r)
    self.t[node] = self.op(self.t[2*node], self.t[2*node+1])` },
      ],
    },
    {
      slug: "range-query",
      title: "Range Query",
      eyebrow: "Segment Tree · 7",
      description: "Answer op over [ql, qr] in O(log n).",
      difficulty: "Intermediate",
      readMinutes: 4,
      sections: [
        { type: "code", code:
`def query(self, ql, qr, node=1, l=0, r=None):
    if r is None: r = self.n - 1
    if qr < l or r < ql:          return self.identity   # disjoint
    if ql <= l and r <= qr:       return self.t[node]    # fully inside
    m = (l + r) // 2
    return self.op(
        self.query(ql, qr, 2*node,   l,   m),
        self.query(ql, qr, 2*node+1, m+1, r),
    )` },
        { type: "segTree", data: [1, 3, 5, 7, 9, 11], caption: "Try a range query on this array." },
      ],
    },
    {
      slug: "point-update",
      title: "Point Update",
      eyebrow: "Segment Tree · 8",
      description: "Update a single index and re-aggregate the O(log n) ancestors.",
      difficulty: "Intermediate",
      readMinutes: 3,
      sections: [
        { type: "code", code:
`def update(self, i, v, node=1, l=0, r=None):
    if r is None: r = self.n - 1
    if l == r:
        self.t[node] = v
        return
    m = (l + r) // 2
    if i <= m: self.update(i, v, 2*node,   l,   m)
    else:      self.update(i, v, 2*node+1, m+1, r)
    self.t[node] = self.op(self.t[2*node], self.t[2*node+1])` },
      ],
    },
    {
      slug: "range-update",
      title: "Range Update (naive)",
      eyebrow: "Segment Tree · 9",
      description: "Applying a range update leaf-by-leaf is O(n) — that's what lazy propagation fixes.",
      difficulty: "Intermediate",
      readMinutes: 2,
      sections: [
        { type: "theory", text: "The naïve range update walks every leaf in [l, r] and calls point_update — O((r−l+1) · log n). Fine for tiny ranges, terrible in general. Lazy propagation gets this down to O(log n)." },
      ],
    },
    {
      slug: "lazy-propagation",
      title: "Lazy Propagation",
      eyebrow: "Segment Tree · 10",
      description: "Defer range updates so a whole subtree can be updated in O(log n).",
      difficulty: "Advanced",
      readMinutes: 5,
      sections: [
        { type: "theory", text: "Store a pending 'add x to every element in this range' on each node. The pending value is pushed down only when a child is actually visited — turning O(n) range updates into O(log n)." },
        { type: "code", code:
`class LazySegTree:
    def __init__(self, arr):
        self.n = len(arr)
        self.t    = [0] * (4 * self.n)
        self.lazy = [0] * (4 * self.n)
        self._build(arr, 1, 0, self.n - 1)

    def _build(self, a, node, l, r):
        if l == r: self.t[node] = a[l]; return
        m = (l + r) // 2
        self._build(a, 2*node, l, m); self._build(a, 2*node+1, m+1, r)
        self.t[node] = self.t[2*node] + self.t[2*node+1]

    def _push(self, node, l, r):
        if self.lazy[node]:
            m = (l + r) // 2
            for c, cl, cr in ((2*node, l, m), (2*node+1, m+1, r)):
                self.t[c]    += self.lazy[node] * (cr - cl + 1)
                self.lazy[c] += self.lazy[node]
            self.lazy[node] = 0

    def add(self, ql, qr, x, node=1, l=0, r=None):
        if r is None: r = self.n - 1
        if qr < l or r < ql: return
        if ql <= l and r <= qr:
            self.t[node]    += x * (r - l + 1)
            self.lazy[node] += x
            return
        self._push(node, l, r)
        m = (l + r) // 2
        self.add(ql, qr, x, 2*node,   l,   m)
        self.add(ql, qr, x, 2*node+1, m+1, r)
        self.t[node] = self.t[2*node] + self.t[2*node+1]

    def query(self, ql, qr, node=1, l=0, r=None):
        if r is None: r = self.n - 1
        if qr < l or r < ql: return 0
        if ql <= l and r <= qr: return self.t[node]
        self._push(node, l, r)
        m = (l + r) // 2
        return self.query(ql, qr, 2*node, l, m) + self.query(ql, qr, 2*node+1, m+1, r)` },
      ],
    },
    {
      slug: "traversal",
      title: "Traversal",
      eyebrow: "Segment Tree · 11",
      description: "The tree is walked implicitly — every query is a partial DFS.",
      difficulty: "Beginner",
      readMinutes: 2,
      sections: [
        { type: "theory", text: "You rarely traverse a segment tree explicitly. Every query and update is a DFS that visits O(log n) nodes because at most 2 nodes per level are partially covered by the query interval." },
      ],
    },
    {
      slug: "complexity",
      title: "Complexity",
      eyebrow: "Segment Tree · 12",
      description: "Everything in O(log n), memory in O(n).",
      difficulty: "Beginner",
      readMinutes: 2,
      sections: [
        { type: "complexity", rows: [
          { op: "Build", time: "O(n)", space: "O(n)" },
          { op: "Point update", time: "O(log n)" },
          { op: "Range query", time: "O(log n)" },
          { op: "Range update (lazy)", time: "O(log n)" },
          { op: "Array-backed size", time: "≤ 4n words", note: "safe upper bound" },
        ]},
      ],
    },
    {
      slug: "advantages",
      title: "Advantages",
      eyebrow: "Segment Tree · 13",
      description: "Where segment trees dominate.",
      difficulty: "Beginner",
      readMinutes: 2,
      sections: [
        { type: "theory", bullets: [
          "Works for ANY associative operation — sum, min, max, gcd, matrix product…",
          "Point and range updates in O(log n) with lazy propagation.",
          "Can be made persistent for versioned queries.",
          "Cache-friendly when array-backed.",
        ]},
      ],
    },
    {
      slug: "disadvantages",
      title: "Disadvantages",
      eyebrow: "Segment Tree · 14",
      description: "What you pay for the generality.",
      difficulty: "Beginner",
      readMinutes: 2,
      sections: [
        { type: "theory", bullets: [
          "4n memory — larger than Fenwick tree for sums.",
          "More code, harder to write bug-free (lazy propagation especially).",
          "Constants larger than Fenwick tree.",
          "Non-invertible ops (min, max) can't be replaced with prefix arithmetic.",
        ]},
      ],
    },
    {
      slug: "applications",
      title: "Applications",
      eyebrow: "Segment Tree · 15",
      description: "Where segment trees shine.",
      difficulty: "Beginner",
      readMinutes: 2,
      sections: [
        { type: "theory", bullets: [
          "Range sum / min / max / gcd queries.",
          "Interval assignment (paint tanks / colouring).",
          "Sweep-line algorithms (skyline, area of union of rectangles).",
          "Persistent segment trees (versioned queries, k-th order stats).",
          "Competitive programming — ubiquitous.",
        ]},
      ],
    },
    {
      slug: "python-implementation",
      title: "Complete Python Implementation",
      eyebrow: "Segment Tree · 16",
      description: "A generic segment tree with configurable op + lazy variant.",
      difficulty: "Advanced",
      readMinutes: 5,
      sections: [
        { type: "code", code:
`class SegTree:
    """Generic segment tree parameterised by an associative op."""
    def __init__(self, arr, op=lambda a, b: a + b, identity=0):
        self.n = len(arr)
        self.op, self.identity = op, identity
        self.t = [identity] * (4 * max(self.n, 1))
        if self.n: self._build(arr, 1, 0, self.n - 1)

    def _build(self, a, node, l, r):
        if l == r: self.t[node] = a[l]; return
        m = (l + r) // 2
        self._build(a, 2*node, l, m); self._build(a, 2*node+1, m+1, r)
        self.t[node] = self.op(self.t[2*node], self.t[2*node+1])

    def update(self, i, v, node=1, l=0, r=None):
        if r is None: r = self.n - 1
        if l == r: self.t[node] = v; return
        m = (l + r) // 2
        if i <= m: self.update(i, v, 2*node,   l,   m)
        else:      self.update(i, v, 2*node+1, m+1, r)
        self.t[node] = self.op(self.t[2*node], self.t[2*node+1])

    def query(self, ql, qr, node=1, l=0, r=None):
        if r is None: r = self.n - 1
        if qr < l or r < ql: return self.identity
        if ql <= l and r <= qr: return self.t[node]
        m = (l + r) // 2
        return self.op(
            self.query(ql, qr, 2*node,   l,   m),
            self.query(ql, qr, 2*node+1, m+1, r),
        )


if __name__ == "__main__":
    st = SegTree([1, 3, 5, 7, 9, 11])
    print(st.query(1, 4))   # 3+5+7+9 = 24
    st.update(2, 10)
    print(st.query(1, 4))   # 3+10+7+9 = 29

    from math import gcd
    gt = SegTree([12, 18, 24, 30], op=gcd, identity=0)
    print(gt.query(0, 3))   # gcd(12,18,24,30) = 6` },
      ],
    },
    {
      slug: "dry-run",
      title: "Dry Run",
      eyebrow: "Segment Tree · 17",
      description: "Build → query → update on [1, 3, 5, 7].",
      difficulty: "Intermediate",
      readMinutes: 3,
      sections: [
        { type: "dryRun", headers: ["Step", "Op", "Nodes touched", "Result"], rows: [
          ["1", "build [1,3,5,7]", "1..7 (all leaves + internals)", "t = [_,16,4,12,1,3,5,7]"],
          ["2", "query(1, 2)", "1 → 2 → 5 (a[1]) + 3 → 6 (a[2])", "3 + 5 = 8"],
          ["3", "update(2, 10)", "leaf 6, then 3, then 1", "t = [_,21,4,17,1,3,10,7]"],
          ["4", "query(0, 3)", "root 1 fully covered", "21"],
        ]},
      ],
    },
    {
      slug: "common-mistakes",
      title: "Common Mistakes",
      eyebrow: "Segment Tree · 18",
      description: "Bugs that appear in every hand-written segment tree.",
      difficulty: "Intermediate",
      readMinutes: 3,
      sections: [
        { type: "mistakes", items: [
          "Allocating `2 * n` instead of `4 * n` — heap indices overflow for non-power-of-two n.",
          "Returning 0 as the identity for min/max/gcd — use +∞, −∞, and 0-as-gcd-identity carefully.",
          "Forgetting to push lazy values before descending into children.",
          "Off-by-one on the [l, r] intervals (inclusive vs exclusive).",
          "Doing a range update by looping point_update — silent O(n log n) blow-up.",
        ]},
      ],
    },
    {
      slug: "faq",
      title: "FAQ",
      eyebrow: "Segment Tree · 19",
      description: "The questions that come up every time.",
      difficulty: "Beginner",
      readMinutes: 3,
      sections: [
        { type: "interview", items: [
          "Segment tree vs Fenwick tree? — BIT for prefix sums; segment tree for min/max/gcd or range updates.",
          "Why 4n memory? — Safe upper bound so the heap-index scheme works for any n.",
          "How does lazy propagation preserve correctness? — Any query descending into a lazy node pushes the pending update first.",
          "Can it be iterative? — Yes; the 'iterative segment tree' halves the constants but is trickier for lazy ops.",
          "Persistent segment tree? — Copy only the O(log n) touched nodes per update to keep old versions alive.",
        ]},
      ],
    },
    {
      slug: "interview-questions",
      title: "Interview Questions",
      eyebrow: "Segment Tree · 20",
      description: "Competitive-programming and system-design classics.",
      difficulty: "Advanced",
      readMinutes: 3,
      sections: [
        { type: "interview", items: [
          "Range Sum Query — Mutable (LC 307).",
          "Range Min Query on an array with updates.",
          "Count of Smaller Numbers After Self (LC 315).",
          "Skyline problem via segment tree (LC 218).",
          "Range update, point query using a difference segment tree.",
          "K-th order statistic in a range using a persistent segment tree.",
        ]},
      ],
    },
    {
      slug: "practice",
      title: "Practice",
      eyebrow: "Segment Tree · 21",
      description: "Sharpen with these problems.",
      difficulty: "Advanced",
      readMinutes: 3,
      sections: [
        { type: "practice", groups: [
          { level: "Beginner", items: [
            { title: "LC 303 · Range Sum Query — Immutable", url: "https://leetcode.com/problems/range-sum-query-immutable/", difficulty: "Easy", pattern: "Prefix sum warm-up" },
          ]},
          { level: "Intermediate", items: [
            { title: "LC 307 · Range Sum Query — Mutable", url: "https://leetcode.com/problems/range-sum-query-mutable/", difficulty: "Medium", pattern: "Point update + range query" },
            { title: "LC 315 · Count Smaller Numbers After Self", url: "https://leetcode.com/problems/count-of-smaller-numbers-after-self/", difficulty: "Hard", pattern: "Coord-compress + BIT/seg" },
            { title: "LC 699 · Falling Squares", url: "https://leetcode.com/problems/falling-squares/", difficulty: "Hard", pattern: "Range assign" },
          ]},
          { level: "Advanced", items: [
            { title: "LC 218 · The Skyline Problem", url: "https://leetcode.com/problems/the-skyline-problem/", difficulty: "Hard", pattern: "Sweep line" },
            { title: "LC 732 · My Calendar III", url: "https://leetcode.com/problems/my-calendar-iii/", difficulty: "Hard", pattern: "Range add / max" },
            { title: "CSES · Range Updates and Sums", url: "https://cses.fi/problemset/task/1735", difficulty: "Hard", pattern: "Lazy propagation" },
          ]},
        ]},
      ],
    },
    {
      slug: "quiz",
      title: "Quiz",
      eyebrow: "Segment Tree · 22",
      description: "Solidify the invariants.",
      difficulty: "Intermediate",
      readMinutes: 2,
      sections: [
        { type: "quiz", items: [
          { q: "Safe array size when storing a segment tree over n elements?",
            choices: ["n", "2n", "4n", "n log n"], answer: 2,
            explain: "4n covers all cases without power-of-two padding tricks." },
          { q: "Which operation CAN'T be a Fenwick tree but CAN be a segment tree?",
            choices: ["Sum", "XOR", "Min", "Count"], answer: 2,
            explain: "Min is not invertible; BIT needs invertibility, segment tree does not." },
          { q: "Lazy propagation reduces a range update from…",
            choices: ["O(log n) to O(1)", "O(n) to O(log n)", "O(n log n) to O(n)", "O(1) to O(log n)"], answer: 1,
            explain: "Naive range update is O(n); lazy propagation makes it O(log n)." },
        ]},
      ],
    },
    {
      slug: "references",
      title: "References",
      eyebrow: "Segment Tree · 23",
      description: "The best places to go deeper.",
      difficulty: "Beginner",
      readMinutes: 2,
      sections: [
        { type: "references", items: [
          { label: "cp-algorithms — Segment Tree", url: "https://cp-algorithms.com/data_structures/segment_tree.html" },
          { label: "Codeforces EDU — Segment Tree series", url: "https://codeforces.com/edu/course/2/lesson/4" },
          { label: "CSES Problem Set — Range Queries section", url: "https://cses.fi/problemset/" },
          { label: "USACO Guide — Segment Trees", url: "https://usaco.guide/gold/PURS?lang=cpp" },
          { label: "Wikipedia — Segment tree", url: "https://en.wikipedia.org/wiki/Segment_tree" },
        ]},
      ],
    },
  ],
};


// ----------------------------------------------------------------------------
// Fenwick Tree (Binary Indexed Tree)
// ----------------------------------------------------------------------------
export const V_FENWICK: TreeVariantMeta = {
  slug: "fenwick-tree",
  title: "Fenwick Tree",
  tagline: "A smaller, faster segment tree for prefix sums — in ~n words.",
  lessons: [
    {
      slug: "introduction",
      title: "Introduction",
      eyebrow: "Fenwick · 1",
      description: "A Binary Indexed Tree (BIT) answers prefix-sum queries and point updates in O(log n).",
      difficulty: "Intermediate",
      readMinutes: 3,
      sections: [
        { type: "theory", text: "The Fenwick Tree — invented by Peter Fenwick in 1994 — stores partial sums indexed by the lowest set bit of each index. It uses only n words of memory (vs 4n for a segment tree) and has a tiny constant factor. If you only need sums, prefer BIT." },
      ],
    },
    {
      slug: "construction",
      title: "Construction",
      eyebrow: "Fenwick · 2",
      description: "Zero-init then insert each element, or bulk build in O(n).",
      difficulty: "Intermediate",
      readMinutes: 3,
      sections: [
        { type: "code", code:
`class BIT:
    def __init__(self, n):
        self.t = [0] * (n + 1)   # 1-indexed
    def build(self, arr):
        for i, v in enumerate(arr, 1):
            self.add(i, v)` },
      ],
    },
    {
      slug: "prefix-sum",
      title: "Prefix Sum",
      eyebrow: "Fenwick · 3",
      description: "sum(1..i) in O(log n) by stripping the lowest set bit.",
      difficulty: "Intermediate",
      readMinutes: 3,
      sections: [
        { type: "code", code:
`def sum(self, i):
    s = 0
    while i > 0:
        s += self.t[i]
        i -= i & -i   # strip lowest set bit
    return s

def range_sum(self, l, r):
    return self.sum(r) - self.sum(l - 1)` },
      ],
    },
    {
      slug: "update",
      title: "Point Update",
      eyebrow: "Fenwick · 4",
      description: "Add x at position i in O(log n) by climbing the tree.",
      difficulty: "Intermediate",
      readMinutes: 3,
      sections: [
        { type: "code", code:
`def add(self, i, x):
    while i < len(self.t):
        self.t[i] += x
        i += i & -i   # jump to next ancestor` },
      ],
    },
    {
      slug: "applications",
      title: "Applications",
      eyebrow: "Fenwick · 5",
      description: "The go-to structure for cumulative counts.",
      difficulty: "Beginner",
      readMinutes: 2,
      sections: [
        { type: "theory", bullets: [
          "Count inversions in an array.",
          "Range frequency / prefix count queries.",
          "Order-statistic problems (kth smallest via binary lifting).",
          "Anywhere a segment tree is overkill.",
        ]},
      ],
    },
    {
      slug: "complexity",
      title: "Complexity",
      eyebrow: "Fenwick · 6",
      description: "O(log n) for both, half the memory of a segment tree.",
      difficulty: "Beginner",
      readMinutes: 2,
      sections: [
        { type: "complexity", rows: [
          { op: "Point update", time: "O(log n)" },
          { op: "Prefix sum", time: "O(log n)" },
          { op: "Range sum", time: "O(log n)" },
          { op: "Space", time: "O(n)" },
        ]},
      ],
    },
    {
      slug: "practice",
      title: "Practice",
      eyebrow: "Fenwick · 7",
      description: "Practice problems.",
      difficulty: "Intermediate",
      readMinutes: 3,
      sections: [
        { type: "practice", groups: [
          { level: "Intermediate", items: [
            { title: "LC 307 · Range Sum Query — Mutable", url: "https://leetcode.com/problems/range-sum-query-mutable/", difficulty: "Medium" },
            { title: "LC 315 · Count Smaller Numbers After Self", url: "https://leetcode.com/problems/count-of-smaller-numbers-after-self/", difficulty: "Hard" },
            { title: "LC 493 · Reverse Pairs", url: "https://leetcode.com/problems/reverse-pairs/", difficulty: "Hard" },
          ]},
        ]},
      ],
    },
  ],
};
