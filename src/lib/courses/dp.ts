import type { Course } from "./types";

export const dpCourse: Course = {
  slug: "dynamic-programming",
  title: "Dynamic Programming",
  tagline: "Solve overlapping subproblems once and reuse the answer.",
  category: "algorithm",
  order: 16,
  icon: "Grid3x3",
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
      theory: "DP applies to problems with optimal substructure and overlapping subproblems. It trades memory for time by caching every subproblem's answer.",
    },
    {
      slug: "overlapping-subproblems",
      title: "Overlapping Subproblems",
      theory: "Naive Fibonacci recomputes fib(k) exponentially many times. DP computes each fib(k) exactly once.",
    },
    {
      slug: "memoization-vs-tabulation",
      title: "Memoization vs Tabulation",
      theory: "Top-down memoization stores results in a dict/array as recursion unwinds. Bottom-up tabulation fills a table iteratively from base cases up.",
      code: `# Top-down\nfrom functools import lru_cache\n@lru_cache(None)\ndef fib(n): return n if n < 2 else fib(n-1) + fib(n-2)\n\n# Bottom-up\ndef fib_iter(n):\n    a, b = 0, 1\n    for _ in range(n): a, b = b, a + b\n    return a`,
    },
    {
      slug: "1d-dp",
      title: "1D DP — Climbing Stairs",
      code: `def climb(n):\n    if n <= 2: return n\n    dp = [0]*(n+1); dp[1], dp[2] = 1, 2\n    for i in range(3, n+1): dp[i] = dp[i-1] + dp[i-2]\n    return dp[n]`,
      complexity: [{ op: "time", time: "O(n)" }, { op: "space", time: "O(n) → O(1) with rolling vars" }],
    },
    {
      slug: "2d-dp",
      title: "2D DP — Unique Paths",
      code: `def unique_paths(m, n):\n    dp = [[1]*n for _ in range(m)]\n    for i in range(1, m):\n        for j in range(1, n):\n            dp[i][j] = dp[i-1][j] + dp[i][j-1]\n    return dp[-1][-1]`,
    },
    {
      slug: "knapsack-01",
      title: "0/1 Knapsack",
      code: `def knapsack(W, wt, val):\n    n = len(wt)\n    dp = [[0]*(W+1) for _ in range(n+1)]\n    for i in range(1, n+1):\n        for w in range(W+1):\n            dp[i][w] = dp[i-1][w]\n            if wt[i-1] <= w:\n                dp[i][w] = max(dp[i][w], dp[i-1][w-wt[i-1]] + val[i-1])\n    return dp[n][W]`,
      complexity: [{ op: "time", time: "O(n·W)", space: "O(n·W)" }],
    },
    {
      slug: "lis",
      title: "Longest Increasing Subsequence",
      theory: "Classic DP in O(n²); patience-sort trick with `bisect` runs in O(n log n).",
      code: `import bisect\ndef lis(a):\n    tails = []\n    for x in a:\n        i = bisect.bisect_left(tails, x)\n        if i == len(tails): tails.append(x)\n        else: tails[i] = x\n    return len(tails)`,
    },
    {
      slug: "lcs",
      title: "Longest Common Subsequence",
      code: `def lcs(a, b):\n    m, n = len(a), len(b)\n    dp = [[0]*(n+1) for _ in range(m+1)]\n    for i in range(1, m+1):\n        for j in range(1, n+1):\n            dp[i][j] = dp[i-1][j-1]+1 if a[i-1]==b[j-1] else max(dp[i-1][j], dp[i][j-1])\n    return dp[m][n]`,
    },
    {
      slug: "edit-distance",
      title: "Edit Distance",
      theory: "Minimum insert/delete/replace to convert one string into another. Classic 2D DP, O(m·n).",
    },
    {
      slug: "coin-change",
      title: "Coin Change (Min Coins)",
      code: `def coin_change(coins, amount):\n    dp = [float('inf')] * (amount + 1)\n    dp[0] = 0\n    for i in range(1, amount + 1):\n        for c in coins:\n            if c <= i: dp[i] = min(dp[i], dp[i-c] + 1)\n    return dp[amount] if dp[amount] != float('inf') else -1`,
    },
    {
      slug: "state-compression",
      title: "State Compression",
      theory: "Encode small sets as bitmasks so state fits in an int — the trick behind TSP, assignment, and set-cover DPs.",
    },
    {
      slug: "practice",
      title: "Practice",
      practice: [
        { title: "LC 70 · Climbing Stairs", url: "https://leetcode.com/problems/climbing-stairs/", difficulty: "Easy" },
        { title: "LC 300 · LIS", url: "https://leetcode.com/problems/longest-increasing-subsequence/", difficulty: "Medium" },
        { title: "LC 322 · Coin Change", url: "https://leetcode.com/problems/coin-change/", difficulty: "Medium" },
        { title: "LC 72 · Edit Distance", url: "https://leetcode.com/problems/edit-distance/", difficulty: "Hard" },
      ],
    },
    {
      slug: "quiz",
      title: "Quiz",
      quiz: {
        q: "DP applies when the problem has…",
        choices: ["Random inputs", "Overlapping subproblems + optimal substructure", "A single base case", "No recursion"],
        answer: 1,
      },
    },
    { slug: "references", title: "References", references: [{ label: "CLRS Chapter 15 — Dynamic Programming", url: "https://mitpress.mit.edu/9780262046305/" }] },
  ],
};
