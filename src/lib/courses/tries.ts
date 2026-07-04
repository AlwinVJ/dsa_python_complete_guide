import type { Course } from "./types";

export const triesCourse: Course = {
  slug: "tries",
  title: "Tries",
  tagline: "Prefix trees for fast autocomplete and dictionary lookups.",
  category: "non-linear",
  order: 9,
  icon: "TypeOutline",
  // The canonical, complete Trie implementation lives under Trees → Variants
  // → Trie (/trees/trie/*), with its own visualizer and Python code. This
  // course's lesson data below is intentionally left untouched (per the
  // "do not regenerate content" rule) but is no longer rendered — see
  // LessonView.tsx and learn.$course.tsx, which check `duplicateOf` and
  // show a redirect landing page instead.
  duplicateOf: { label: "Trees → Trie", href: "/trees/trie/introduction" },
  lessons: [
    {
      slug: "introduction",
      title: "Introduction",
      theory:
        "A trie stores strings by shared prefix. Each edge is a character; the path from the root to any node spells that node's prefix. Lookup, insert, and prefix-match all cost O(L) where L is the query length — independent of dictionary size.",
      tip: "Reach for a trie whenever you need prefix queries (autocomplete, IP routing) or many words share long prefixes.",
    },
    {
      slug: "trie-node",
      title: "Trie Node",
      code: `class Node:\n    __slots__ = ("kids", "end")\n    def __init__(self):\n        self.kids = {}   # char -> Node\n        self.end = False`,
    },
    {
      slug: "insertion",
      title: "Insertion",
      code: `def insert(root, word):\n    cur = root\n    for ch in word:\n        cur = cur.kids.setdefault(ch, Node())\n    cur.end = True`,
      complexity: [{ op: "insert", time: "O(L)", space: "O(L)" }],
    },
    {
      slug: "search",
      title: "Search",
      code: `def contains(root, word):\n    cur = root\n    for ch in word:\n        if ch not in cur.kids: return False\n        cur = cur.kids[ch]\n    return cur.end`,
      complexity: [{ op: "search", time: "O(L)" }],
    },
    {
      slug: "prefix-match",
      title: "Prefix Match",
      theory: "Same walk as search, but success is 'we reached the end of the prefix', regardless of whether that node is end-of-word.",
      code: `def starts_with(root, prefix):\n    cur = root\n    for ch in prefix:\n        if ch not in cur.kids: return False\n        cur = cur.kids[ch]\n    return True`,
    },
    {
      slug: "deletion",
      title: "Deletion",
      theory: "Unset the end-of-word flag on the terminal node. Optionally walk back up and prune nodes that have no children and no end flag.",
      code: `def delete(root, word):\n    def rec(node, i):\n        if i == len(word):\n            node.end = False\n        else:\n            ch = word[i]\n            if ch in node.kids and rec(node.kids[ch], i+1):\n                del node.kids[ch]\n        return not node.end and not node.kids\n    rec(root, 0)`,
    },
    {
      slug: "autocomplete",
      title: "Autocomplete",
      theory: "After locating the prefix node, DFS from there and yield every path that ends with `end=True`.",
      code: `def suggest(root, prefix):\n    cur = root\n    for ch in prefix:\n        if ch not in cur.kids: return []\n        cur = cur.kids[ch]\n    out = []\n    def dfs(node, path):\n        if node.end: out.append(prefix + "".join(path))\n        for ch, child in node.kids.items():\n            path.append(ch); dfs(child, path); path.pop()\n    dfs(cur, [])\n    return out`,
    },
    {
      slug: "spell-check",
      title: "Spell Checker",
      theory: "Combine trie traversal with edit-distance to enumerate every dictionary word within k edits — the algorithm behind most fuzzy-search boxes.",
    },
    {
      slug: "compressed-trie",
      title: "Compressed Trie (Radix Tree)",
      theory:
        "Chains of single-child nodes are merged into one edge labelled with the whole substring. This shrinks memory and speeds up lookup — used inside routing tables and Redis keys.",
    },
    {
      slug: "applications",
      title: "Applications",
      bullets: [
        "Search suggestion / autocomplete.",
        "Longest prefix match in IP routing.",
        "Dictionary lookups and spell check.",
        "Prefix-based ACL matching.",
        "Bioinformatics — suffix trees for DNA.",
      ],
    },
    {
      slug: "complexity",
      title: "Complexity",
      complexity: [
        { op: "insert / search / prefix", time: "O(L)", space: "O(N·L)" },
        { op: "autocomplete", time: "O(L + matches)" },
      ],
    },
    {
      slug: "interview-questions",
      title: "Interview Questions",
      bullets: [
        "Implement Trie (Prefix Tree).",
        "Word Search II — grid of characters, list of words.",
        "Replace words in a sentence with dictionary roots.",
        "Longest word in a dictionary formed one character at a time.",
        "Design search autocomplete system.",
      ],
    },
    {
      slug: "practice",
      title: "Practice",
      practice: [
        { title: "LC 208 · Implement Trie", url: "https://leetcode.com/problems/implement-trie-prefix-tree/", difficulty: "Medium" },
        { title: "LC 212 · Word Search II", url: "https://leetcode.com/problems/word-search-ii/", difficulty: "Hard" },
        { title: "LC 648 · Replace Words", url: "https://leetcode.com/problems/replace-words/", difficulty: "Medium" },
        { title: "LC 642 · Autocomplete System", url: "https://leetcode.com/problems/design-search-autocomplete-system/", difficulty: "Hard" },
      ],
    },
    {
      slug: "quiz",
      title: "Quiz",
      quiz: {
        q: "What is the search complexity of a trie storing N words of average length L?",
        choices: ["O(N)", "O(L)", "O(N·L)", "O(log N)"],
        answer: 1,
        explain: "Trie lookup depends only on the query length, not the dictionary size.",
      },
    },
    {
      slug: "references",
      title: "References",
      references: [
        { label: "Sedgewick — Algorithms Ch 5 (Tries)", url: "https://algs4.cs.princeton.edu/52trie/" },
      ],
    },
  ],
};
