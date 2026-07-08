import type { Course } from "./types";

export const backtrackingCourse: Course = {
  slug: "backtracking",
  title: "Backtracking",
  tagline: "Explore, undo, retry — the DFS of the algorithm world.",
  category: "algorithm",
  order: 9,
  icon: "CornerDownLeft",
  // Lesson content below is complete, but the platform is intentionally
  // presenting this module as under development for now (per current
  // product decision). Flip this to false — or delete the line — to
  // automatically restore the expandable lesson tree; no sidebar changes
  // are needed.
  comingSoon: true,
  lessons: [
    {
      slug: "introduction",
      title: "Introduction",
      theory:
        "Backtracking incrementally builds a candidate, abandons it as soon as it can't lead to a valid solution, and tries the next option.",
    },
    {
      slug: "pattern",
      title: "Pattern",
      code: `def backtrack(path, choices):\n    if is_goal(path):\n        record(path); return\n    for c in choices:\n        if valid(path, c):\n            path.append(c)\n            backtrack(path, next_choices(path))\n            path.pop()`,
    },
    {
      slug: "n-queens",
      title: "N-Queens",
      code: `def solve(n):\n    out, cols, d1, d2 = [], set(), set(), set()\n    def bt(r, board):\n        if r == n: out.append(board[:]); return\n        for c in range(n):\n            if c in cols or (r-c) in d1 or (r+c) in d2: continue\n            cols.add(c); d1.add(r-c); d2.add(r+c); board.append(c)\n            bt(r+1, board)\n            cols.remove(c); d1.remove(r-c); d2.remove(r+c); board.pop()\n    bt(0, [])\n    return out`,
    },
    {
      slug: "sudoku",
      title: "Sudoku Solver",
      theory:
        "Backtrack cell by cell, trying every digit that doesn't already occur in the row, column, or 3×3 block.",
    },
    {
      slug: "subsets",
      title: "Subsets / Combinations",
      theory: "Choose or skip each element; the recursion tree has 2ⁿ leaves.",
    },
    {
      slug: "permutations",
      title: "Permutations",
      theory:
        "Pick each remaining element in turn; use an in-place swap trick to avoid extra memory.",
    },
    {
      slug: "word-search",
      title: "Word Search",
      theory:
        "DFS on the grid with visited-set backtracking. Combine with a trie for the multi-word variant.",
    },
    {
      slug: "pruning",
      title: "Pruning",
      tip: "The difference between backtracking and brute force is the pruning. Add every constraint you can before recursing.",
    },
    {
      slug: "practice",
      title: "Practice",
      practice: [
        {
          title: "LC 46 · Permutations",
          url: "https://leetcode.com/problems/permutations/",
          difficulty: "Medium",
        },
        {
          title: "LC 51 · N-Queens",
          url: "https://leetcode.com/problems/n-queens/",
          difficulty: "Hard",
        },
        {
          title: "LC 79 · Word Search",
          url: "https://leetcode.com/problems/word-search/",
          difficulty: "Medium",
        },
        {
          title: "LC 37 · Sudoku Solver",
          url: "https://leetcode.com/problems/sudoku-solver/",
          difficulty: "Hard",
        },
      ],
    },
    {
      slug: "quiz",
      title: "Quiz",
      quiz: {
        q: "The key idea that separates backtracking from brute force is…",
        choices: ["Memoization", "Sorting", "Pruning invalid branches early", "Parallelism"],
        answer: 2,
      },
    },
    {
      slug: "references",
      title: "References",
      references: [
        {
          label: "CLRS Chapter 34 — NP-Completeness",
          url: "https://mitpress.mit.edu/9780262046305/",
        },
      ],
    },
  ],
};
