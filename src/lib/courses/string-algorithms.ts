import type { Course } from "./types";

export const stringAlgorithmsCourse: Course = {
  slug: "string-algorithms",
  title: "String Algorithms",
  tagline: "Pattern matching from naïve to Manacher.",
  category: "algorithm",
  order: 18,
  icon: "TextSearch",
  lessons: [
    {
      slug: "introduction",
      title: "Introduction",
      theory: "String algorithms find, match, and transform patterns inside text. Every one of them is asked about in interviews at least once.",
    },
    {
      slug: "naive-search",
      title: "Naïve Search",
      theory: "Slide the pattern over the text and compare character by character. O(n·m) worst case.",
      code: `def naive(t, p):\n    n, m = len(t), len(p)\n    for i in range(n - m + 1):\n        if t[i:i+m] == p: return i\n    return -1`,
    },
    {
      slug: "kmp",
      title: "KMP",
      theory: "Knuth-Morris-Pratt precomputes a failure function so we never re-check a character. O(n + m).",
      code: `def kmp(t, p):\n    lps = [0]*len(p); k = 0\n    for i in range(1, len(p)):\n        while k and p[k] != p[i]: k = lps[k-1]\n        if p[k] == p[i]: k += 1\n        lps[i] = k\n    j = 0\n    for i, ch in enumerate(t):\n        while j and p[j] != ch: j = lps[j-1]\n        if p[j] == ch: j += 1\n        if j == len(p): return i - j + 1\n    return -1`,
    },
    {
      slug: "rabin-karp",
      title: "Rabin-Karp",
      theory: "Rolling hash of the sliding window; verify on hash match. O(n + m) average, O(n·m) worst.",
    },
    {
      slug: "z-algorithm",
      title: "Z-Algorithm",
      theory: "Computes Z[i] = length of the longest substring starting at i that matches a prefix of s. Enables O(n + m) pattern matching by running it on p + '$' + t.",
    },
    {
      slug: "manacher",
      title: "Manacher — Longest Palindromic Substring",
      theory: "Finds all palindromic substrings in O(n) using symmetry around the current centre.",
    },
    {
      slug: "suffix-array",
      title: "Suffix Array",
      theory: "Sorted list of all suffix indices. Built in O(n log n) (or O(n) with SA-IS) and enables lots of substring queries with LCP.",
    },
    {
      slug: "applications",
      title: "Applications",
      bullets: [
        "grep, ripgrep, editor find/replace.",
        "DNA / protein sequence matching.",
        "Plagiarism and duplicate detection.",
        "Compilers — lexers rely on efficient string primitives.",
      ],
    },
    {
      slug: "practice",
      title: "Practice",
      practice: [
        { title: "LC 28 · Find the Index of the First Occurrence", url: "https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/", difficulty: "Easy" },
        { title: "LC 5 · Longest Palindromic Substring", url: "https://leetcode.com/problems/longest-palindromic-substring/", difficulty: "Medium" },
        { title: "LC 214 · Shortest Palindrome", url: "https://leetcode.com/problems/shortest-palindrome/", difficulty: "Hard" },
      ],
    },
    {
      slug: "quiz",
      title: "Quiz",
      quiz: {
        q: "What is the time complexity of KMP pattern matching?",
        choices: ["O(n·m)", "O(n + m)", "O(n log m)", "O(m log n)"],
        answer: 1,
      },
    },
    { slug: "references", title: "References", references: [{ label: "Competitive Programmer's Handbook — Strings", url: "https://cses.fi/book/book.pdf" }] },
  ],
};
