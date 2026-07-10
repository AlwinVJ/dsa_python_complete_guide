import type { Course } from "./types";

// Recursion is now a first-class, fully authored module. The lessons below
// follow the same shape as Arrays / Trees / Sorting: theory, bullets, code,
// complexity, mistakes, tips, quiz, practice, and references — rendered by
// the shared LessonView. Do NOT set `comingSoon: true` again unless the
// content is intentionally being taken down.
export const recursionCourse: Course = {
  slug: "recursion",
  title: "Recursion",
  tagline: "Functions that call themselves — the base of divide-and-conquer, DP, and backtracking.",
  category: "algorithm",
  order: 3,
  icon: "RotateCcw",
  courseLayout: "overview",
  overview: {
    introduction: "Recursion is a problem-solving technique where a function calls itself on a smaller version of the same problem until it reaches a case simple enough to answer directly.",
    whyLearn: "Almost every advanced algorithmic pattern — including Divide and Conquer, Dynamic Programming, Backtracking, and Tree/Graph Traversals — relies fundamentally on recursive thinking. Mastering recursion transitions your problem-solving mindset from imperative loops to declarative subproblem reduction.",
    learningObjectives: [
      "Understand the mechanics of the Python call stack and stack frames.",
      "Correctly identify and implement base cases and recursive cases.",
      "Analyze time and space complexity of recursive functions.",
      "Optimize naive recursive algorithms using memoization and caching.",
      "Understand the connection between recursion and dynamic programming.",
      "Formulate recursive relationships for backtracking.",
    ],
    realWorldApplications: [
      "Parsing nested formats like JSON, XML, and HTML.",
      "Navigating file directories and tree-like data structures.",
      "Backtracking searches in game AI (e.g. Sudoku, Chess solvers).",
      "Compiler parsing and Abstract Syntax Tree (AST) generation.",
    ],
    advantages: [
      "Produces clean, readable, and elegant code for hierarchical problems.",
      "Reduces explicit state-tracking boilerplate by utilizing the system call stack.",
      "Provides a direct translation from mathematical inductive definitions to code.",
    ],
    limitations: [
      "Consumes additional O(depth) memory via the call stack.",
      "Risks stack overflow errors (RecursionError) on deep inputs.",
      "Can be highly inefficient (exponential complexity) if subproblems overlap and are not memoized.",
    ],
    prerequisites: [
      "Basic control flow (variables, conditions, functions, and loops).",
      "Familiarity with fundamental Python data structures (Lists, Dicts).",
    ],
    estimatedTime: "4–6 Hours",
    difficulty: 3,
  },
  infoCard: {
    estimatedTime: "4–6 Hours",
    difficulty: 3,
    practiceRequired: true,
    language: "Python",
  },
  whoIsThisFor: [
    "Learners who already know loops and functions",
    "Anyone starting divide-and-conquer, DP, or backtracking",
    "Candidates preparing for coding interviews",
    "Developers who want to think recursively with confidence",
  ],
  ctaText: "Open Recursion Playground →",
  ctaRoute: "/playgrounds/recursion",
  lessons: [
    {
      slug: "introduction",
      title: "Introduction to Recursion",
      tagline: "What recursion is and why almost every advanced algorithm relies on it.",
      theory:
        "Recursion is a problem-solving technique where a function calls itself on a smaller version of the same problem until it reaches a case simple enough to answer directly.\n\nIt trades an explicit loop for a self-referential definition — the same way factorials, tree traversals, and divide-and-conquer algorithms are naturally described in mathematics.",
      bullets: [
        "Every recursive solution has two parts: a base case and a recursive case.",
        "The base case stops the recursion — without it the function calls itself forever.",
        "The recursive case shrinks the input so that each call moves closer to the base case.",
        "Recursion is the natural fit for trees, graphs, and divide-and-conquer.",
      ],
      code: `def factorial(n):
    if n <= 1:          # base case
        return 1
    return n * factorial(n - 1)   # recursive case

print(factorial(5))     # 120`,
      tip: "If you can describe a problem as 'solve a smaller version, then combine', recursion is usually the cleanest implementation.",
      references: [
        {
          label: "Python docs — recursion limit",
          url: "https://docs.python.org/3/library/sys.html#sys.setrecursionlimit",
        },
      ],
    },
    {
      slug: "recursive-thinking",
      title: "Recursive Thinking",
      tagline: "Trusting the recursive leap of faith.",
      theory:
        "The hardest part of recursion is not the code — it's the mindset. Instead of tracing every call, assume the recursive call already returns the correct answer for the smaller input, then decide what you do with that answer.",
      bullets: [
        "Define the function by what it should return, not how it computes it.",
        "Ask: 'If I already had the answer for n − 1, how would I build the answer for n?'",
        "Design the base case first — it anchors the entire recursion.",
        "Keep the recursive step small: reduce by one, halve, or split into subproblems.",
      ],
      code: `def sum_to(n):
    # Assume sum_to(n-1) already gives the correct sum 1..n-1
    if n == 0:
        return 0
    return n + sum_to(n - 1)`,
      tip: "This 'leap of faith' is exactly how you'll reason about DP transitions and tree recursion later.",
    },
    {
      slug: "base-recursive-case",
      title: "Base Case and Recursive Case",
      tagline: "The two ingredients every recursive function must have.",
      bullets: [
        "Base case — the smallest input you can answer directly, with no further recursion.",
        "Recursive case — reduces the problem and calls the function on the smaller input.",
        "You may need more than one base case (e.g. n == 0 and n == 1 for Fibonacci).",
        "Every recursive path must eventually hit a base case, or you get infinite recursion.",
      ],
      code: `def fib(n):
    if n == 0: return 0    # base
    if n == 1: return 1    # base
    return fib(n - 1) + fib(n - 2)   # recursive`,
      mistakes: [
        "Forgetting a base case → RecursionError (infinite recursion).",
        "Recursive call that doesn't shrink the input → still infinite.",
        "Handling the base case AFTER the recursive call, so it's never reached.",
      ],
    },
    {
      slug: "call-stack",
      title: "The Call Stack",
      tagline: "How Python actually runs your recursive function.",
      theory:
        "Every function call pushes a new stack frame that stores local variables, arguments, and the return address. When the function returns, its frame is popped. Recursion is just this same mechanism used repeatedly.\n\nWhen `factorial(3)` runs, the stack briefly holds `factorial(3)`, `factorial(2)`, `factorial(1)`, then unwinds as each call returns.",
      bullets: [
        "The call stack has a limit — Python defaults to about 1000 frames.",
        "Deep recursion uses O(depth) memory even if the algorithm itself is O(1) space.",
        "The stack is what enables backtracking — earlier state is restored on return.",
      ],
      code: `# Conceptual view of the stack during factorial(3):
#
#   factorial(3)  ->  waits on factorial(2)
#     factorial(2) ->  waits on factorial(1)
#       factorial(1) ->  returns 1        (base case)
#     factorial(2) ->  returns 2 * 1 = 2
#   factorial(3) ->  returns 3 * 2 = 6`,
      tip: "Open the Recursion Playground to see stack frames pushed and popped step by step.",
    },
    {
      slug: "stack-overflow",
      title: "Stack Overflow & Recursion Limits",
      tagline: "When recursion runs out of room.",
      theory:
        "Stack overflow happens when your recursion pushes more frames than the runtime allows. In Python this raises `RecursionError: maximum recursion depth exceeded`.",
      bullets: [
        "Python defaults to sys.getrecursionlimit() ≈ 1000.",
        "You can raise it with sys.setrecursionlimit(10_000), but you may hit an OS-level stack overflow instead.",
        "The real fix is usually to convert deep recursion into iteration or use tail-recursion-style loops.",
      ],
      code: `import sys
sys.setrecursionlimit(10_000)

def depth(n):
    if n == 0: return 0
    return 1 + depth(n - 1)

# depth(1_000_000)  -> RecursionError, even after raising the limit`,
      mistakes: [
        "Assuming a bigger limit is always safe — the OS stack is finite too.",
        "Recursing on input size (e.g. list length) without checking it can exceed the depth limit.",
      ],
    },
    {
      slug: "recursion-vs-iteration",
      title: "Recursion vs Iteration",
      tagline: "Same problem, two very different shapes.",
      theory:
        "Any recursive algorithm can be rewritten iteratively (using an explicit loop and, if needed, a stack). Choosing between them is about clarity and constraints, not correctness.",
      complexity: [
        { op: "Factorial (recursive)", time: "O(n)", space: "O(n) stack" },
        { op: "Factorial (iterative)", time: "O(n)", space: "O(1)" },
        { op: "Tree DFS (recursive)", time: "O(V+E)", space: "O(h) stack" },
        { op: "Tree DFS (iterative w/ stack)", time: "O(V+E)", space: "O(h)" },
      ],
      bullets: [
        "Recursion: shorter, closer to the mathematical definition, natural for trees.",
        "Iteration: constant call-stack overhead, faster in Python, safer for very deep inputs.",
        "Rule of thumb: use recursion when the structure is recursive (trees, DAGs, divide-and-conquer). Otherwise prefer a loop.",
      ],
      code: `# Recursive
def fact_rec(n):
    return 1 if n <= 1 else n * fact_rec(n - 1)

# Iterative
def fact_iter(n):
    r = 1
    for i in range(2, n + 1):
        r *= i
    return r`,
    },
    {
      slug: "types-of-recursion",
      title: "Types of Recursion",
      tagline: "Direct, indirect, tail, head, and tree — five patterns that cover almost everything.",
      bullets: [
        "Direct — a function calls itself directly (factorial, fib).",
        "Indirect — function A calls B, which calls A again (mutual recursion).",
        "Tail — the recursive call is the last action; can be turned into a loop trivially.",
        "Head — work happens after the recursive call returns (natural for reversing).",
        "Tree — the function calls itself more than once per invocation (fib, subsets).",
      ],
      code: `# Tail recursion — nothing to do after the call
def count_down(n):
    if n == 0: return
    print(n)
    count_down(n - 1)

# Head recursion — work runs on the way back
def print_reverse(n):
    if n == 0: return
    print_reverse(n - 1)
    print(n)

# Tree recursion — two branches per call
def fib(n):
    if n < 2: return n
    return fib(n - 1) + fib(n - 2)

# Indirect / mutual recursion
def is_even(n): return True if n == 0 else is_odd(n - 1)
def is_odd(n):  return False if n == 0 else is_even(n - 1)`,
      tip: "Tree recursion is what makes naive Fibonacci exponential — that's exactly what memoization fixes.",
    },
    {
      slug: "complexity",
      title: "Time and Space Complexity",
      tagline: "Reading the recursion tree.",
      theory:
        "The running time of a recursive function is captured by a recurrence T(n) = a · T(n / b) + f(n). Draw the recursion tree, count work per level, and either sum it directly or apply the Master Theorem.",
      complexity: [
        { op: "Linear recursion (factorial, sum)", time: "O(n)", space: "O(n) stack" },
        { op: "Halving recursion (binary search)", time: "O(log n)", space: "O(log n) stack" },
        { op: "Tree recursion (naive fib)", time: "O(2ⁿ)", space: "O(n) stack" },
        { op: "Merge sort", time: "O(n log n)", space: "O(n)" },
        { op: "Karatsuba multiplication", time: "O(n^1.585)", space: "O(log n)" },
      ],
      bullets: [
        "Depth of recursion contributes O(depth) auxiliary space via the call stack.",
        "Branching factor and depth determine the total number of calls.",
        "Memoization can collapse an exponential recursion into polynomial time.",
      ],
    },
    {
      slug: "memoization",
      title: "Memoization",
      tagline: "Cache results, turn exponential recursion into polynomial time.",
      theory:
        "Memoization stores the result of each recursive call so overlapping subproblems are computed once. It's the bridge between raw recursion and dynamic programming.",
      code: `from functools import lru_cache

@lru_cache(maxsize=None)
def fib(n):
    if n < 2: return n
    return fib(n - 1) + fib(n - 2)

fib(50)   # instant — 51 unique subproblems instead of ~2^50 calls`,
      complexity: [
        { op: "fib without memo", time: "O(2ⁿ)", space: "O(n) stack" },
        { op: "fib with memo", time: "O(n)", space: "O(n) cache + O(n) stack" },
      ],
      tip: "If your recursive function is pure (same input → same output), it's a candidate for @lru_cache — no rewrite needed.",
      references: [
        {
          label: "functools.lru_cache",
          url: "https://docs.python.org/3/library/functools.html#functools.lru_cache",
        },
      ],
    },
    {
      slug: "dp-connection",
      title: "Dynamic Programming Connection",
      tagline: "How memoized recursion becomes DP.",
      theory:
        "Dynamic programming is recursion with two extra ingredients: overlapping subproblems and optimal substructure. Any top-down memoized recursion can be rewritten bottom-up as a table filled in dependency order.",
      bullets: [
        "Top-down DP = recursion + memoization.",
        "Bottom-up DP = iterative table filled in the same order the memoized recursion would.",
        "Both have the same time complexity; bottom-up avoids the call-stack overhead.",
      ],
      code: `# Top-down (memoized recursion)
from functools import lru_cache
@lru_cache(None)
def climb(n):
    if n <= 2: return n
    return climb(n - 1) + climb(n - 2)

# Bottom-up (iterative DP)
def climb_iter(n):
    if n <= 2: return n
    a, b = 1, 2
    for _ in range(3, n + 1):
        a, b = b, a + b
    return b`,
    },
    {
      slug: "backtracking-intro",
      title: "Backtracking Introduction",
      tagline: "Recursion that explores, then undoes.",
      theory:
        "Backtracking is recursion with a twist: at each step you make a choice, recurse, and then undo the choice before trying the next option. It's the standard way to enumerate subsets, permutations, N-Queens, and Sudoku solutions.",
      code: `def subsets(nums):
    out, cur = [], []
    def dfs(i):
        if i == len(nums):
            out.append(cur[:])            # record a choice
            return
        dfs(i + 1)                        # skip nums[i]
        cur.append(nums[i]); dfs(i + 1)   # take nums[i]
        cur.pop()                         # undo — the backtrack step
    dfs(0)
    return out

print(subsets([1, 2, 3]))`,
      tip: "The `cur.pop()` line is the entire idea of backtracking — restore state so the next branch starts clean.",
    },
    {
      slug: "common-patterns",
      title: "Common Recursion Patterns",
      tagline: "Templates you'll reuse in dozens of problems.",
      bullets: [
        "Reduce by one — factorial, sum of digits, list length.",
        "Divide and conquer — merge sort, quick sort, binary search.",
        "Tree recursion — traversals, subsets, permutations, N-Queens.",
        "Accumulator recursion — pass a running result down the calls.",
        "Head vs tail — decide whether work happens before or after the recursive call.",
      ],
      code: `# Reduce-by-one
def length(a):
    return 0 if not a else 1 + length(a[1:])

# Divide-and-conquer
def bsearch(a, t, lo=0, hi=None):
    if hi is None: hi = len(a) - 1
    if lo > hi: return -1
    m = (lo + hi) // 2
    if a[m] == t: return m
    return bsearch(a, t, lo, m - 1) if a[m] > t else bsearch(a, t, m + 1, hi)

# Accumulator
def reverse(a, acc=None):
    if acc is None: acc = []
    if not a: return acc
    return reverse(a[1:], [a[0]] + acc)`,
    },
    {
      slug: "common-mistakes",
      title: "Common Mistakes",
      tagline: "The pitfalls every beginner hits at least once.",
      mistakes: [
        "Missing base case → infinite recursion → RecursionError.",
        "Recursive call that doesn't reduce the input — same effect.",
        "Mutating shared state (list, dict) without undoing it before the next branch.",
        "Assuming Python optimizes tail calls — it does not. Deep tail recursion still overflows.",
        "Using slice-based recursion (a[1:]) on huge inputs — each slice is O(n), so the algorithm is O(n²).",
        "Recomputing the same subproblem in a tree recursion instead of memoizing.",
      ],
      tip: "When debugging, add a print of the arguments at the top of the function — you'll see the recursion tree unfold.",
    },
    {
      slug: "interview-tips",
      title: "Interview Tips",
      tagline: "How to talk about recursion under pressure.",
      bullets: [
        "State the base case out loud first — interviewers love seeing that.",
        "Draw the recursion tree on a whiteboard to justify complexity.",
        "Mention memoization the moment you spot overlapping subproblems.",
        "For tree/graph problems, describe the recursion in terms of 'what the function returns for a subtree'.",
        "Know how to convert recursion → iteration with an explicit stack; sometimes it's required.",
      ],
      tip: "'This is O(2ⁿ) without memoization and O(n) with it' is a great sentence to have ready.",
    },
    {
      slug: "practice",
      title: "Practice Problems",
      tagline: "Beginner to advanced problems to lock the patterns in.",
      practice: [
        {
          title: "LC 509 · Fibonacci Number",
          url: "https://leetcode.com/problems/fibonacci-number/",
          difficulty: "Easy",
        },
        {
          title: "LC 344 · Reverse String",
          url: "https://leetcode.com/problems/reverse-string/",
          difficulty: "Easy",
        },
        {
          title: "LC 231 · Power of Two",
          url: "https://leetcode.com/problems/power-of-two/",
          difficulty: "Easy",
        },
        {
          title: "LC 50 · Pow(x, n)",
          url: "https://leetcode.com/problems/powx-n/",
          difficulty: "Medium",
        },
        {
          title: "LC 46 · Permutations",
          url: "https://leetcode.com/problems/permutations/",
          difficulty: "Medium",
        },
        {
          title: "LC 78 · Subsets",
          url: "https://leetcode.com/problems/subsets/",
          difficulty: "Medium",
        },
        {
          title: "LC 39 · Combination Sum",
          url: "https://leetcode.com/problems/combination-sum/",
          difficulty: "Medium",
        },
        {
          title: "LC 104 · Maximum Depth of Binary Tree",
          url: "https://leetcode.com/problems/maximum-depth-of-binary-tree/",
          difficulty: "Easy",
        },
        {
          title: "LC 51 · N-Queens",
          url: "https://leetcode.com/problems/n-queens/",
          difficulty: "Hard",
        },
        {
          title: "LC 37 · Sudoku Solver",
          url: "https://leetcode.com/problems/sudoku-solver/",
          difficulty: "Hard",
        },
      ],
    },
    {
      slug: "revision",
      title: "Summary & Revision",
      tagline: "Everything you should be able to recite by memory.",
      bullets: [
        "Every recursion needs a base case and a shrinking recursive case.",
        "The call stack costs O(depth) memory even if the algorithm is O(1) auxiliary space.",
        "Python does not optimize tail calls — deep recursion still overflows.",
        "Tree recursion with overlapping subproblems → memoize → linear time.",
        "Backtracking = recursion + undo. Use it for enumeration and constraint search.",
        "Divide-and-conquer (merge sort, binary search) is recursion structured by the Master Theorem.",
      ],
      quiz: {
        q: "Which single change turns naive Fibonacci from O(2ⁿ) into O(n)?",
        choices: [
          "Rewriting it iteratively",
          "Increasing the recursion limit",
          "Adding memoization (e.g. @lru_cache)",
          "Using tail recursion",
        ],
        answer: 2,
        explain:
          "Memoization caches each subproblem so the exponential recursion tree collapses to n unique calls.",
      },
      references: [
        {
          label: "CLRS Chapter 4 — Divide and Conquer",
          url: "https://mitpress.mit.edu/9780262046305/",
        },
        {
          label: "Python sys.setrecursionlimit",
          url: "https://docs.python.org/3/library/sys.html#sys.setrecursionlimit",
        },
        {
          label: "functools.lru_cache",
          url: "https://docs.python.org/3/library/functools.html#functools.lru_cache",
        },
      ],
    },
  ],
};
