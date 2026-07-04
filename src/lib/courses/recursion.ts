import type { Course } from "./types";

export const recursionCourse: Course = {
  slug: "recursion",
  title: "Recursion",
  tagline: "Functions that call themselves — the base of divide-and-conquer and DP.",
  category: "algorithm",
  order: 13,
  icon: "RotateCcw",
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
      theory: "Recursion solves a problem by reducing it to smaller versions of itself. Every recursive solution needs a base case and a recursive case.",
      code: `def factorial(n):\n    if n <= 1: return 1        # base\n    return n * factorial(n-1)  # recursive`,
    },
    {
      slug: "call-stack",
      title: "Call Stack",
      theory: "Each recursive call pushes a stack frame with local variables and the return address. Python defaults to a recursion limit of 1000 — deeper recursions raise `RecursionError`.",
      tip: "Convert deep recursion to iteration with an explicit stack, or bump the limit with `sys.setrecursionlimit`.",
    },
    {
      slug: "tail-recursion",
      title: "Tail Recursion",
      theory: "A tail-recursive call is the last action in the function. Some languages optimise it into a loop; CPython does not, so tail recursion in Python still consumes stack.",
    },
    {
      slug: "memoization",
      title: "Memoization",
      theory: "Cache recursive results so overlapping subproblems solve in O(1) — turning exponential recursion into polynomial time. `functools.lru_cache` gives you this for free.",
      code: `from functools import lru_cache\n@lru_cache(maxsize=None)\ndef fib(n):\n    if n < 2: return n\n    return fib(n-1) + fib(n-2)`,
    },
    {
      slug: "fibonacci",
      title: "Fibonacci",
      code: `def fib(n):\n    if n < 2: return n\n    return fib(n-1) + fib(n-2)   # O(2^n) without memo`,
    },
    {
      slug: "tower-of-hanoi",
      title: "Tower of Hanoi",
      code: `def hanoi(n, a, c, b):\n    if n == 0: return\n    hanoi(n-1, a, b, c)\n    print(f"move {a} -> {c}")\n    hanoi(n-1, b, c, a)`,
    },
    {
      slug: "permutations",
      title: "Permutations",
      code: `def perms(a):\n    if not a: return [[]]\n    out = []\n    for i, x in enumerate(a):\n        for p in perms(a[:i] + a[i+1:]):\n            out.append([x] + p)\n    return out`,
    },
    {
      slug: "subsets",
      title: "Subsets",
      code: `def subsets(a, i=0, cur=None, out=None):\n    if cur is None: cur, out = [], []\n    if i == len(a):\n        out.append(cur[:]); return out\n    subsets(a, i+1, cur, out)\n    cur.append(a[i]); subsets(a, i+1, cur, out); cur.pop()\n    return out`,
    },
    {
      slug: "complexity",
      title: "Complexity",
      theory: "The recursion tree of a divide-and-conquer algorithm satisfies T(n) = a·T(n/b) + f(n). Solve via the Master Theorem.",
      complexity: [
        { op: "linear recursion (factorial)", time: "O(n)", space: "O(n) stack" },
        { op: "branching recursion (naive fib)", time: "O(2^n)", space: "O(n) stack" },
      ],
    },
    {
      slug: "practice",
      title: "Practice",
      practice: [
        { title: "LC 509 · Fibonacci Number", url: "https://leetcode.com/problems/fibonacci-number/", difficulty: "Easy" },
        { title: "LC 46 · Permutations", url: "https://leetcode.com/problems/permutations/", difficulty: "Medium" },
        { title: "LC 78 · Subsets", url: "https://leetcode.com/problems/subsets/", difficulty: "Medium" },
      ],
    },
    {
      slug: "quiz",
      title: "Quiz",
      quiz: {
        q: "Every recursive function must have…",
        choices: ["A loop", "A base case", "A return type annotation", "A helper function"],
        answer: 1,
        explain: "Without a base case the recursion never terminates.",
      },
    },
    {
      slug: "references",
      title: "References",
      references: [{ label: "functools.lru_cache", url: "https://docs.python.org/3/library/functools.html#functools.lru_cache" }],
    },
  ],
};
