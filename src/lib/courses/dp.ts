import type { Course } from "./types";

export const dpCourse: Course = {
  slug: "dynamic-programming",
  title: "Dynamic Programming",
  tagline: "Solve overlapping subproblems once and reuse the answer.",
  category: "algorithm",
  order: 6,
  icon: "Grid3x3",
  courseLayout: "overview",
  comingSoon: false,
  overview: {
    introduction:
      "Dynamic Programming (DP) is a problem-solving technique for optimization and counting problems where a bigger problem's answer is built from answers to smaller, overlapping subproblems. Instead of recomputing the same subproblem millions of times, DP computes each subproblem once, stores the result, and reuses it — trading memory for a dramatic reduction in time.",
    whyLearn:
      "DP is the highest-leverage algorithmic technique in interviews and in practice. Once you can recognize overlapping subproblems and optimal substructure, entire families of problems — knapsack, sequence alignment, shortest paths, edit distance, resource scheduling, parsing — become variations of the same template. Mastering DP is what separates candidates who solve hard problems from those who guess.",
    learningObjectives: [
      "Recognize when a problem has overlapping subproblems and optimal substructure.",
      "Translate a recurrence relation into either memoized recursion or a tabulated iteration.",
      "Choose between top-down (memoization) and bottom-up (tabulation) confidently.",
      "Design 1-D and 2-D DP tables and reason about state transitions.",
      "Optimize DP space from O(n) or O(n·m) down to O(1) or O(min(n, m)) using rolling arrays.",
      "Solve classic DP problems: Fibonacci, Climbing Stairs, Coin Change, 0/1 Knapsack, LCS, LIS, Edit Distance.",
    ],
    realWorldApplications: [
      "Bioinformatics — DNA and protein sequence alignment (Needleman–Wunsch, Smith–Waterman).",
      "Compilers and text editors — diff, spell-check, and syntax-directed parsing use edit distance.",
      "Finance and operations research — portfolio selection, resource allocation, revenue management.",
      "Speech and NLP — hidden Markov models, Viterbi decoding, CKY parsing.",
      "Graphics and pathfinding — shortest paths, image seam carving, dynamic time warping.",
    ],
    advantages: [
      "Reduces exponential brute-force recursions to polynomial time.",
      "Applies to a huge class of optimization and counting problems.",
      "Two interchangeable styles (top-down and bottom-up) fit different problems naturally.",
      "Space can often be shrunk from O(n·m) to O(min(n, m)) with rolling arrays.",
    ],
    limitations: [
      "Only useful when subproblems overlap — pure divide & conquer problems gain nothing.",
      "Requires designing a correct state and recurrence, which can be non-obvious.",
      "Memoization can blow the recursion stack on very deep problems.",
      "Tabulation forces you to compute every subproblem, even ones the answer does not need.",
    ],
    prerequisites: [
      "Comfort with recursion, base cases, and the call stack.",
      "Familiarity with arrays, dictionaries, and 2-D grids in Python.",
      "Basic understanding of Big-O time and space complexity.",
    ],
    estimatedTime: "6–8 Hours",
    difficulty: 5,
  },
  infoCard: {
    estimatedTime: "6–8 Hours",
    difficulty: 5,
    practiceRequired: true,
    language: "Python",
  },
  whoIsThisFor: [
    "Learners preparing for coding interviews — DP is asked at almost every senior-level company.",
    "Developers who already know recursion and want to systematically speed it up.",
    "Anyone tackling optimization or counting problems where brute force is too slow.",
  ],
  ctaText: "Open Dynamic Programming Playground →",
  ctaRoute: "/playgrounds/dp",
  lessons: [
    {
      slug: "introduction",
      title: "Introduction to Dynamic Programming",
      tagline: "What DP is and why it turns exponential recursion into polynomial time.",
      theory:
        "Dynamic Programming is the art of solving a problem once and reusing the answer. When a recursion tree contains the same subproblem reached along many different paths, DP replaces the repeated work with a single lookup. The classic warning sign is a recursive solution that is 'correct but too slow' — the same call is being made again and again with the same arguments.\n\nEvery DP solution has two ingredients: a state (the arguments to the recurrence) and a transition (how the state's answer depends on smaller states).",
      bullets: [
        "DP = recursion + caching of subproblem answers.",
        "Applies to problems with overlapping subproblems and optimal substructure.",
        "Two styles: top-down (memoization) or bottom-up (tabulation).",
        "Turns exponential brute force into polynomial time.",
      ],
      tip: "Before writing any DP code, write the recurrence in one line: 'dp[i] = something in terms of dp[j] for j < i'. If you can write that line, the code is mechanical.",
    },
    {
      slug: "why-dp",
      title: "Why Dynamic Programming?",
      tagline: "Motivation, history, and where DP wins over brute force.",
      theory:
        "The term 'Dynamic Programming' was coined by Richard Bellman in the 1950s while working on multi-stage decision processes at RAND. The word 'programming' here means 'planning' (as in linear programming) — not writing code. Bellman famously picked 'dynamic' partly because it sounded impressive to management, but the name stuck because the technique really is about making a sequence of decisions over time.\n\nDP is the right tool whenever a problem can be broken into overlapping subproblems and you want either the optimal value, the count of ways, or the existence of a solution.",
      bullets: [
        "Coined by Richard Bellman in the 1950s.",
        "Turns problems like Fibonacci from O(2ⁿ) to O(n).",
        "Powers real systems: diff, spell-check, sequence alignment, Viterbi decoding.",
        "Whenever brute-force recursion 'times out', DP is usually the fix.",
      ],
    },
    {
      slug: "overlapping-subproblems",
      title: "Overlapping Subproblems",
      tagline: "The first ingredient of a DP problem.",
      theory:
        "A problem has overlapping subproblems when the recursive solution solves the same subproblem many times. Fibonacci is the canonical example: fib(5) calls fib(4) and fib(3); fib(4) also calls fib(3) and fib(2); fib(3) is now computed twice. Deeper down, fib(2) is computed 3 times, fib(1) is computed 5 times — an exponential explosion of duplicated work.\n\nThe moment you notice a subproblem being solved more than once, DP applies.",
      code: `# Naive Fibonacci — recomputes the same call millions of times
def fib(n):
    if n < 2: return n
    return fib(n - 1) + fib(n - 2)

# fib(30) is ~1.6 million calls; fib(40) takes seconds; fib(50) is unusable.`,
      bullets: [
        "Same arguments reach the same function many times.",
        "Recursion tree contains repeated subtrees.",
        "Caching each unique subproblem's answer collapses the tree.",
        "This is what turns O(2ⁿ) into O(n) for Fibonacci.",
      ],
    },
    {
      slug: "optimal-substructure",
      title: "Optimal Substructure",
      tagline: "The second ingredient — build big answers from optimal small ones.",
      theory:
        "A problem has optimal substructure when its optimal solution can be constructed from optimal solutions to its subproblems. The shortest path from A to C via B is the shortest A→B plus the shortest B→C. The longest increasing subsequence ending at index i is 1 plus the longest LIS ending at some j < i with nums[j] < nums[i].\n\nWithout optimal substructure, DP cannot be applied — combining optimal subanswers would not yield an optimal answer.",
      bullets: [
        "Optimal answer to the whole = combination of optimal answers to parts.",
        "Every subproblem's answer is independent of choices made outside it.",
        "This lets us safely reuse cached subanswers.",
        "Missing this property? DP will produce wrong results.",
      ],
      tip: "Ask yourself: 'If I knew the answer to every strictly smaller subproblem, could I compute the answer to this one in O(1) or O(k)?' If yes, you have optimal substructure.",
    },
    {
      slug: "memoization",
      title: "Memoization (Top-Down)",
      tagline: "Recursion with a cache — write the recurrence, add a dict.",
      theory:
        "Memoization keeps the natural recursive structure and adds a cache. Before doing any work, check whether this exact call has been seen before; if so, return the stored answer. Otherwise, compute normally and store the result before returning.\n\nIn Python, the easiest way is @lru_cache. For custom caches, a dict keyed by the function arguments works just as well.",
      code: `from functools import lru_cache

@lru_cache(maxsize=None)
def fib(n):
    if n < 2: return n
    return fib(n - 1) + fib(n - 2)

# fib(100) now runs instantly.`,
      complexity: [
        { op: "Fibonacci (memoized)", time: "O(n)", space: "O(n) cache + O(n) stack" },
      ],
      mistakes: [
        "Forgetting to make the arguments hashable (@lru_cache requires it).",
        "Caching across test cases — clear the cache between runs.",
        "Recursion depth on large n — Python's default limit is 1000.",
      ],
    },
    {
      slug: "tabulation",
      title: "Tabulation (Bottom-Up)",
      tagline: "Fill a table iteratively from the base cases up.",
      theory:
        "Tabulation flips the direction. Instead of recursing down to base cases, you start at the base cases and iteratively fill a table until you reach the answer you want. No recursion, no stack overflow risk, and the loop order guarantees that every dependency is already computed.\n\nTabulation is usually faster in practice than memoization — no function call overhead, and the CPU cache loves sequential array access.",
      code: `def fib(n):
    if n < 2: return n
    dp = [0] * (n + 1)
    dp[1] = 1
    for i in range(2, n + 1):
        dp[i] = dp[i - 1] + dp[i - 2]
    return dp[n]

# O(n) time, O(n) space — no recursion at all.`,
      complexity: [
        { op: "Fibonacci (tabulated)", time: "O(n)", space: "O(n) → O(1) with rolling vars" },
      ],
      tip: "Tabulation makes space optimization obvious. If dp[i] depends only on dp[i-1] and dp[i-2], you don't need the whole array — two variables suffice.",
    },
    {
      slug: "memoization-vs-tabulation",
      title: "Memoization vs Tabulation",
      tagline: "Same problem, two shapes — when to pick which.",
      theory:
        "Both approaches solve the same problem in the same asymptotic time. The difference is style, stack usage, and which subproblems you actually visit.\n\nMemoization only computes the subproblems the top-level call actually needs — great when the recurrence is sparse. Tabulation computes every entry from the base cases up — great when you need most of the table anyway, and it avoids Python's recursion limit.",
      complexity: [
        { op: "Memoization", time: "O(states)", space: "O(states) + O(depth) stack" },
        { op: "Tabulation", time: "O(states)", space: "O(states) — no stack" },
      ],
      bullets: [
        "Memoization: natural recursion, only visits needed subproblems, risks stack overflow.",
        "Tabulation: iterative, visits every subproblem, easy space optimization.",
        "Both are O(states × transition cost) in time.",
        "Interviewers accept either; pick the one you can code cleanly under pressure.",
      ],
      tip: "Start with memoization to prove the recurrence is correct. Convert to tabulation to optimize space.",
    },
    {
      slug: "dp-vs-divide-conquer",
      title: "DP vs Divide & Conquer",
      tagline: "Both split problems — only DP caches the overlap.",
      theory:
        "Divide & Conquer (Merge Sort, Binary Search, Quick Sort) splits a problem into disjoint subproblems. Each subproblem is solved once and the results are combined. There is no overlap, so caching gains nothing.\n\nDP splits a problem into overlapping subproblems — the same subproblem is reached along many paths. Caching each unique subproblem is exactly the point.",
      bullets: [
        "Divide & Conquer: disjoint subproblems, no caching needed.",
        "DP: overlapping subproblems, caching is the whole point.",
        "Both use recursion; only DP benefits from a memo table.",
        "Merge Sort would gain nothing from a cache; Fibonacci gains everything.",
      ],
      complexity: [
        { op: "Merge Sort (no reuse)", time: "O(n log n)", space: "O(n)" },
        { op: "Fibonacci DP (heavy reuse)", time: "O(n)", space: "O(n)" },
      ],
    },
    {
      slug: "dp-vs-backtracking",
      title: "DP vs Backtracking",
      tagline: "Enumerate all vs count / optimize with reuse.",
      theory:
        "Backtracking enumerates every valid configuration by walking a decision tree with pruning. Each branch is distinct — the same state is rarely reached twice — so caching helps very little.\n\nDP applies when the same state IS reached many times and you want a count, existence, or optimum rather than every configuration. If the problem asks 'how many ways' or 'what is the minimum/maximum', DP is usually right. If it asks 'give me every arrangement', backtracking is usually right.",
      bullets: [
        "Backtracking: 'find all X' — decision tree with distinct branches.",
        "DP: 'count / minimize / maximize X' — overlapping subproblems.",
        "Backtracking result is a list of configurations; DP result is a number.",
        "Coin Change ('fewest coins') is DP; Combination Sum ('list every combination') is backtracking.",
      ],
      quiz: {
        q: "Which problem is best solved with DP rather than backtracking?",
        choices: [
          "Generate all permutations of a list.",
          "Find the minimum number of coins to make amount N.",
          "Solve a Sudoku board.",
          "Enumerate every path in a maze.",
        ],
        answer: 1,
        explain:
          "Coin Change has overlapping subproblems (amount N reached by many coin sequences) and asks for a single optimum. The others enumerate distinct configurations — classic backtracking.",
      },
    },
    {
      slug: "fibonacci",
      title: "The Fibonacci Problem",
      tagline: "The 'Hello World' of DP — three solutions, three complexities.",
      theory:
        "Fibonacci is the shortest possible way to see all three DP styles side by side. Naive recursion is O(2ⁿ). Memoized recursion is O(n) time and O(n) space. Tabulated iteration is O(n) time and can be squeezed to O(1) space using two rolling variables. The recurrence never changes — only how we compute it.",
      code: `# O(2ⁿ) — naive
def fib1(n): return n if n < 2 else fib1(n-1) + fib1(n-2)

# O(n) time, O(n) space — memoization
from functools import lru_cache
@lru_cache(None)
def fib2(n): return n if n < 2 else fib2(n-1) + fib2(n-2)

# O(n) time, O(1) space — space-optimized tabulation
def fib3(n):
    if n < 2: return n
    a, b = 0, 1
    for _ in range(n - 1):
        a, b = b, a + b
    return b`,
      complexity: [
        { op: "Naive", time: "O(2ⁿ)", space: "O(n) stack" },
        { op: "Memoized", time: "O(n)", space: "O(n)" },
        { op: "Tabulated (rolling)", time: "O(n)", space: "O(1)" },
      ],
      tip: "In an interview, walk through all three. Show that you understand the recurrence, the caching, and the space optimization — it's five extra sentences that signal fluency.",
    },
    {
      slug: "climbing-stairs",
      title: "Climbing Stairs",
      tagline: "Fibonacci in disguise — count ways to reach step n.",
      theory:
        "You can climb 1 or 2 stairs at a time. How many distinct ways to reach step n? To land on step i, the last move was either a 1-step from i-1 or a 2-step from i-2. Therefore ways(i) = ways(i-1) + ways(i-2) — the Fibonacci recurrence, with base cases ways(1) = 1 and ways(2) = 2.\n\nSame recurrence, same O(n) time, same O(1) space with rolling variables.",
      code: `def climb_stairs(n):
    if n <= 2: return n
    a, b = 1, 2
    for _ in range(n - 2):
        a, b = b, a + b
    return b

print(climb_stairs(5))  # 8`,
      complexity: [{ op: "Climbing Stairs", time: "O(n)", space: "O(1)" }],
      mistakes: [
        "Off-by-one on the base cases — verify n=1 → 1 and n=2 → 2.",
        "Building the full dp array when two variables suffice.",
      ],
    },
    {
      slug: "coin-change",
      title: "Coin Change (Fewest Coins)",
      tagline: "Unbounded knapsack — pick the smallest number of coins that sum to amount.",
      theory:
        "Given coin denominations and a target amount, return the minimum number of coins that sum to amount, or -1 if impossible. Each coin can be used any number of times.\n\nState: dp[a] = minimum coins to make amount a. Transition: dp[a] = 1 + min(dp[a - c] for c in coins if c <= a). Base case: dp[0] = 0 (zero coins make amount 0). Initialize the rest to infinity so any real answer wins in the min.",
      code: `def coin_change(coins, amount):
    INF = amount + 1
    dp = [INF] * (amount + 1)
    dp[0] = 0
    for a in range(1, amount + 1):
        for c in coins:
            if c <= a:
                dp[a] = min(dp[a], dp[a - c] + 1)
    return dp[amount] if dp[amount] != INF else -1

print(coin_change([1, 2, 5], 11))  # 3  (5 + 5 + 1)`,
      complexity: [
        { op: "Coin Change (min coins)", time: "O(amount · len(coins))", space: "O(amount)" },
      ],
      mistakes: [
        "Using a greedy 'always pick the largest coin' strategy — fails on {1, 3, 4}, amount 6.",
        "Forgetting to check c <= a before indexing dp[a - c].",
        "Returning 0 instead of -1 when the amount cannot be made.",
      ],
    },
    {
      slug: "knapsack-01",
      title: "0/1 Knapsack",
      tagline: "Take it or leave it — the flagship 2-D DP problem.",
      theory:
        "Given n items each with a weight and value, and a knapsack of capacity W, maximize the total value you can carry. Each item can be taken at most once.\n\nState: dp[i][w] = max value using the first i items with capacity w. Transition: skip item i (dp[i-1][w]) OR take item i if it fits (dp[i-1][w - wt[i]] + val[i]) — take the max. Base case: dp[0][*] = 0.",
      code: `def knapsack_01(weights, values, W):
    n = len(weights)
    dp = [[0] * (W + 1) for _ in range(n + 1)]
    for i in range(1, n + 1):
        for w in range(W + 1):
            dp[i][w] = dp[i - 1][w]                            # skip
            if weights[i - 1] <= w:                            # take
                dp[i][w] = max(dp[i][w],
                               dp[i - 1][w - weights[i - 1]] + values[i - 1])
    return dp[n][W]`,
      complexity: [{ op: "0/1 Knapsack", time: "O(n · W)", space: "O(n · W) → O(W)" }],
      tip: "Space can be reduced to a single 1-D array by iterating capacity from W down to weights[i] — that ordering guarantees you don't reuse the same item twice.",
    },
    {
      slug: "lcs",
      title: "Longest Common Subsequence",
      tagline: "The classic 2-D string DP — diff, git, DNA alignment.",
      theory:
        "Given two strings a and b, find the length of the longest subsequence that appears in both (not necessarily contiguous). This powers file diff, Git's blame, and DNA sequence alignment.\n\nState: dp[i][j] = LCS length of a[:i] and b[:j]. Transition: if a[i-1] == b[j-1], dp[i][j] = dp[i-1][j-1] + 1; otherwise dp[i][j] = max(dp[i-1][j], dp[i][j-1]). Base case: dp[0][*] = dp[*][0] = 0.",
      code: `def lcs(a, b):
    m, n = len(a), len(b)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if a[i - 1] == b[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + 1
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
    return dp[m][n]

print(lcs("abcde", "ace"))  # 3  ("ace")`,
      complexity: [{ op: "LCS", time: "O(m · n)", space: "O(m · n) → O(min(m, n))" }],
    },
    {
      slug: "lis",
      title: "Longest Increasing Subsequence",
      tagline: "O(n²) DP or the O(n log n) patience-sort trick.",
      theory:
        "Given a list of integers, find the length of the longest strictly increasing subsequence. The straightforward DP is O(n²): dp[i] = 1 + max(dp[j] for j < i if nums[j] < nums[i]).\n\nA far faster O(n log n) solution maintains a 'tails' array where tails[k] is the smallest possible tail of any increasing subsequence of length k+1. For each new number, binary-search its slot; if it extends the longest, append; otherwise overwrite the first tail that is >= it. The length of tails is the answer.",
      code: `import bisect

def lis_n2(nums):
    n = len(nums)
    dp = [1] * n
    for i in range(n):
        for j in range(i):
            if nums[j] < nums[i]:
                dp[i] = max(dp[i], dp[j] + 1)
    return max(dp) if dp else 0

def lis_nlogn(nums):
    tails = []
    for x in nums:
        i = bisect.bisect_left(tails, x)
        if i == len(tails):
            tails.append(x)
        else:
            tails[i] = x
    return len(tails)`,
      complexity: [
        { op: "LIS (DP)", time: "O(n²)", space: "O(n)" },
        { op: "LIS (patience)", time: "O(n log n)", space: "O(n)" },
      ],
      tip: "The tails array is NOT the actual LIS — only its length is guaranteed. Reconstructing the LIS needs extra parent pointers.",
    },
    {
      slug: "common-mistakes",
      title: "Common Mistakes",
      tagline: "The pitfalls every DP beginner hits at least once.",
      mistakes: [
        "Applying DP where subproblems don't overlap — you're just adding a useless cache.",
        "Wrong state definition — dp[i] means one thing on paper and another in code.",
        "Off-by-one on base cases — dp[0], dp[1] mismatched with the recurrence.",
        "Wrong iteration order — dp[i][j] read before it's been written.",
        "Forgetting to initialize with the correct 'identity' value (0 for sum, ∞ for min, -∞ for max).",
        "Optimizing space too early — write the full 2-D version first, then compress.",
        "Using DP for problems that need every solution enumerated — those are backtracking.",
        "Recursion depth errors with memoization on large n — convert to tabulation.",
      ],
      tip: "When a DP solution returns the wrong answer, print the full dp table. The first wrong cell tells you exactly which transition is off.",
    },
    {
      slug: "interview-prep",
      title: "Interview Preparation & Revision",
      tagline: "How to recognize, structure, and communicate a DP solution under pressure.",
      bullets: [
        "Recognize the signals: 'count the number of ways', 'minimum / maximum', 'is it possible', subsequence / substring / partition, grid path.",
        "State the recurrence out loud before writing code: 'dp[i] means X; dp[i] = f(dp[j] for j < i)'.",
        "Start with brute-force recursion → add memoization → convert to tabulation → optimize space. That is the interview arc.",
        "Draw the recursion tree for n = 5 to prove overlap exists — this is the moment DP becomes 'obviously the right tool'.",
        "State time and space complexity as 'O(states × transition)' — interviewers love that framing.",
        "Mention space optimization even if you don't code it: 'This can be O(1) space with two rolling variables.'",
        "Practice pattern recognition, not memorization — Knapsack, LCS, LIS, and Coin Change cover 70% of interview DP.",
      ],
      tip: "Two sentences to have ready: 'The state is [X], the transition is [Y], so this is O(states × transition) time.' and 'Since dp[i] only depends on the previous row, I can compress space from O(n·m) to O(min(n, m)).'",
      practice: [
        { title: "LC 509 · Fibonacci Number", url: "https://leetcode.com/problems/fibonacci-number/", difficulty: "Easy" },
        { title: "LC 70 · Climbing Stairs", url: "https://leetcode.com/problems/climbing-stairs/", difficulty: "Easy" },
        { title: "LC 198 · House Robber", url: "https://leetcode.com/problems/house-robber/", difficulty: "Medium" },
        { title: "LC 322 · Coin Change", url: "https://leetcode.com/problems/coin-change/", difficulty: "Medium" },
        { title: "LC 416 · Partition Equal Subset Sum", url: "https://leetcode.com/problems/partition-equal-subset-sum/", difficulty: "Medium" },
        { title: "LC 1143 · Longest Common Subsequence", url: "https://leetcode.com/problems/longest-common-subsequence/", difficulty: "Medium" },
        { title: "LC 300 · Longest Increasing Subsequence", url: "https://leetcode.com/problems/longest-increasing-subsequence/", difficulty: "Medium" },
        { title: "LC 494 · Target Sum (0/1 Knapsack)", url: "https://leetcode.com/problems/target-sum/", difficulty: "Medium" },
        { title: "LC 72 · Edit Distance", url: "https://leetcode.com/problems/edit-distance/", difficulty: "Hard" },
        { title: "LC 1039 · Minimum Score Triangulation (Matrix Chain)", url: "https://leetcode.com/problems/minimum-score-triangulation-of-polygon/", difficulty: "Medium" },
      ],
      quiz: {
        q: "What single property MUST a problem have for DP to give a correct answer?",
        choices: [
          "Fixed input size.",
          "Optimal substructure — the optimum combines optimal subanswers.",
          "Sorted input.",
          "A closed-form mathematical formula.",
        ],
        answer: 1,
        explain:
          "Without optimal substructure, combining cached optimal subanswers does not produce an optimal overall answer — DP would silently return wrong results. Overlapping subproblems is what makes DP *fast*; optimal substructure is what makes it *correct*.",
      },
      references: [
        { label: "CLRS Chapter 15 — Dynamic Programming", url: "https://mitpress.mit.edu/9780262046305/" },
        { label: "Erickson — Algorithms, Ch. 3 (Dynamic Programming)", url: "https://jeffe.cs.illinois.edu/teaching/algorithms/" },
        { label: "LeetCode Dynamic Programming Tag", url: "https://leetcode.com/tag/dynamic-programming/" },
      ],
    },
  ],
};
