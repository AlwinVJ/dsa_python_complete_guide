import type { Course } from "./types";

export const backtrackingCourse: Course = {
  slug: "backtracking",
  title: "Backtracking",
  tagline: "Explore, undo, retry — the DFS of the algorithm world.",
  category: "algorithm",
  order: 9,
  icon: "CornerDownLeft",
  courseLayout: "overview",
  comingSoon: false,
  overview: {
    introduction:
      "Backtracking is a general algorithmic technique for solving problems recursively by trying to build a solution incrementally, one piece at a time, and abandoning a partial candidate (\"backtracking\") as soon as it decides the candidate cannot possibly lead to a valid full solution.",
    whyLearn:
      "Backtracking is the go-to pattern for constraint-satisfaction problems, puzzles, and enumeration — N-Queens, Sudoku, permutations, subsets, word search, path finding in mazes, and countless interview problems. Understanding it deeply teaches you to reason about decision trees, prune search spaces early, and design elegant recursive solutions with clean state management.",
    learningObjectives: [
      "Model any search problem as a decision tree of choices.",
      "Design a clean choose → explore → undo recursive template.",
      "Recognize when to prune branches early using constraints.",
      "Solve classic problems: N-Queens, Sudoku, Rat in a Maze, permutations, subsets, combinations.",
      "Distinguish backtracking from plain recursion, DFS, and dynamic programming.",
      "Analyze time and space complexity of exponential search algorithms.",
    ],
    realWorldApplications: [
      "Puzzle solvers — Sudoku, crosswords, chess engines.",
      "Constraint satisfaction — timetable and exam scheduling, resource allocation.",
      "Compiler and regex engines — parsing and pattern matching with alternatives.",
      "Path finding in games and robotics (maze navigation, AI planning).",
      "Combinatorial generation — permutations, subsets, and combinations for testing.",
    ],
    advantages: [
      "Explores the full solution space systematically — will find a solution if one exists.",
      "Prunes invalid branches early, often much faster than naive brute force.",
      "Uses O(depth) memory — the call stack is the only bookkeeping.",
      "The choose/explore/undo template applies to a huge class of problems.",
    ],
    limitations: [
      "Worst-case exponential time — O(k^n) or O(n!) for many problems.",
      "Requires careful state restoration; forgetting to undo corrupts sibling branches.",
      "Not suitable when subproblems overlap heavily — use dynamic programming instead.",
      "Deep recursion can hit Python's call-stack limit on large inputs.",
    ],
    prerequisites: [
      "Comfort with recursion, base cases, and the call stack.",
      "Basic understanding of DFS and recursion trees.",
      "Familiarity with Python lists, sets, and dictionaries.",
    ],
    estimatedTime: "5–7 Hours",
    difficulty: 4,
  },
  infoCard: {
    estimatedTime: "5–7 Hours",
    difficulty: 4,
    practiceRequired: true,
    language: "Python",
  },
  whoIsThisFor: [
    "Learners who already know recursion and want to solve puzzle-style problems.",
    "Candidates preparing for coding interviews — backtracking questions are extremely common.",
    "Developers building constraint solvers, puzzle games, or AI search agents.",
  ],
  ctaText: "Open Backtracking Playground →",
  ctaRoute: "/playgrounds/backtracking",
  lessons: [
    {
      slug: "introduction",
      title: "Introduction to Backtracking",
      tagline: "What backtracking is and why it powers so many interview problems.",
      theory:
        "Backtracking is a refined form of brute force. Instead of generating every possible candidate up front, it builds a solution one step at a time and abandons a partial candidate the moment it becomes clear it cannot succeed. That single idea — pruning early — is what separates backtracking from naive enumeration and makes it fast enough to solve N-Queens, Sudoku, and other exponential problems in practice.",
      bullets: [
        "Incrementally builds a solution one choice at a time.",
        "Undoes the last choice when it fails and tries the next option.",
        "Explores a decision tree using depth-first search.",
        "Prunes branches that cannot lead to a valid solution.",
      ],
      code: `def backtrack(state):
    if is_solution(state):
        record(state)
        return
    for choice in candidates(state):
        if is_valid(state, choice):
            apply(state, choice)      # choose
            backtrack(state)          # explore
            undo(state, choice)       # backtrack`,
      tip: "Every backtracking solution collapses to the same three-line pattern: choose, explore, undo. Learn the template once and adapt it forever.",
    },
    {
      slug: "recursive-thinking",
      title: "Recursive Thinking Revisited",
      tagline: "How recursion becomes a search over choices.",
      theory:
        "Backtracking is recursion with a purpose. Where plain recursion reduces a problem to a smaller version of itself, backtracking treats each recursive call as one decision inside a search. The call stack remembers where you are; when a call returns, you're back exactly where you were before making that choice.\n\nThat automatic state restoration is the entire magic — the stack is your undo history.",
      bullets: [
        "Each recursive call represents one decision in the search.",
        "The return from a call implicitly undoes that decision.",
        "Explicit undo is needed only for shared mutable state (a list, set, or grid).",
        "The depth of recursion equals the depth of your decision tree.",
      ],
      code: `def count_down(n):
    # Plain recursion — one linear path
    if n == 0: return
    print(n); count_down(n - 1)

def choose_letter(path, letters):
    # Backtracking — many branching paths
    if len(path) == 3:
        print(path); return
    for ch in letters:
        path.append(ch)
        choose_letter(path, letters)
        path.pop()               # undo`,
    },
    {
      slug: "decision-trees",
      title: "Decision Trees",
      tagline: "Every backtracking problem is a tree of choices.",
      theory:
        "Draw a node for the initial state. From every node, draw a child for each possible next choice. Keep expanding until you either hit a valid full solution (a leaf) or a dead end. That tree — the decision tree — is exactly what backtracking walks in depth-first order.\n\nOnce you can sketch the decision tree, writing the code is mechanical.",
      bullets: [
        "Root = starting state (empty path, empty board).",
        "Edges = choices; children = states after making that choice.",
        "Leaves = complete solutions OR pruned dead ends.",
        "Backtracking = DFS on this tree with pruning.",
      ],
      code: `# Decision tree for subsets of [1, 2]
#                     []
#                    /  \\
#                 skip   take 1
#                  []      [1]
#                 / \\      / \\
#              skip take skip take
#              []   [2]   [1]  [1,2]
#
# Each leaf is one subset. 4 leaves = 2^2 subsets.`,
      tip: "Before writing any code, sketch the decision tree for a tiny input by hand. If the tree makes sense on paper, the code will too.",
    },
    {
      slug: "state-space-search",
      title: "State Space Search",
      tagline: "Backtracking as systematic exploration of a state space.",
      theory:
        "A state space is the set of all partial and complete configurations your problem can be in. Backtracking is a systematic way to visit every state in that space — depth-first, with pruning.\n\nThe three ingredients that define a state space are: the initial state, the set of legal moves from any state, and the goal test that recognizes a solution.",
      bullets: [
        "State: a snapshot of the current partial solution.",
        "Transitions: legal moves that lead to neighbouring states.",
        "Goal test: recognizes a complete, valid solution.",
        "Constraint test: rejects states that cannot be extended to a solution.",
      ],
      complexity: [
        { op: "Enumerate subsets", time: "O(2ⁿ)", space: "O(n) stack" },
        { op: "Enumerate permutations", time: "O(n · n!)", space: "O(n) stack" },
        { op: "N-Queens", time: "O(n!)", space: "O(n) stack" },
      ],
    },
    {
      slug: "algorithm-pattern",
      title: "The Backtracking Algorithm Pattern",
      tagline: "The template that solves almost every backtracking problem.",
      theory:
        "Almost every backtracking solution fits the same skeleton. Master this template and you're 80% of the way to solving any new problem in the family.",
      code: `def backtrack(state):
    # 1. Base case: is this a complete solution?
    if is_goal(state):
        results.append(snapshot(state))
        return

    # 2. Iterate over all candidates from this state
    for choice in candidates(state):
        # 3. Prune early if the choice is invalid
        if not is_valid(state, choice):
            continue

        # 4. Choose — apply the decision
        apply(state, choice)

        # 5. Explore — recurse on the new state
        backtrack(state)

        # 6. Undo — restore state before trying next choice
        undo(state, choice)`,
      tip: "Write the six steps as comments first, then fill each block in. It works for N-Queens, Sudoku, permutations, subsets, word search, and Combination Sum with almost no structural change.",
    },
    {
      slug: "choose-explore-undo",
      title: "Choosing, Exploring, and Undoing",
      tagline: "The three-step rhythm at the heart of every backtracking algorithm.",
      theory:
        "Backtracking has three beats: **choose** a candidate, **explore** the consequences recursively, then **undo** the choice before trying the next one. The undo step is what makes backtracking sound — it guarantees each branch of the decision tree starts from the same clean state its parent left behind.\n\nSkipping the undo is the single most common bug in beginner backtracking code.",
      code: `def permutations(nums):
    result, path, used = [], [], [False] * len(nums)

    def backtrack():
        if len(path) == len(nums):
            result.append(path[:])          # snapshot
            return
        for i, n in enumerate(nums):
            if used[i]: continue
            path.append(n); used[i] = True  # choose
            backtrack()                     # explore
            path.pop();   used[i] = False   # undo

    backtrack()
    return result

print(permutations([1, 2, 3]))`,
      mistakes: [
        "Forgetting the undo — subsequent branches inherit stale state and produce wrong answers.",
        "Appending path directly instead of path[:] — every result ends up pointing at the same emptied list.",
        "Mutating a shared set/dict without a matching remove.",
      ],
    },
    {
      slug: "pruning",
      title: "Pruning: The Key to Speed",
      tagline: "Great backtracking = brute force + aggressive pruning.",
      theory:
        "Naive brute force enumerates every candidate then filters. Backtracking checks constraints *before* recursing, cutting entire subtrees of dead ends. The difference between an O(n!) algorithm that finishes in milliseconds and one that never terminates is almost always the quality of your pruning.\n\nAdd every constraint the problem gives you as an early check, not a late filter.",
      bullets: [
        "Prune with problem constraints (row/column/diagonal for N-Queens).",
        "Prune with bounds (remaining sum < target ⇒ stop).",
        "Prune with symmetry (fix the first queen to the first half of the board).",
        "Prune with memoization when partial states can repeat.",
      ],
      code: `def combination_sum(nums, target):
    result = []
    nums.sort()                     # enables ordering-based pruning

    def backtrack(start, path, remaining):
        if remaining == 0:
            result.append(path[:]); return
        for i in range(start, len(nums)):
            if nums[i] > remaining:  # PRUNE — sorted, so all later are worse
                break
            path.append(nums[i])
            backtrack(i, path, remaining - nums[i])
            path.pop()

    backtrack(0, [], target)
    return result`,
      tip: "Every problem constraint you check earlier is a whole subtree you don't have to walk. Pruning is not an optimization — it is the algorithm.",
    },
    {
      slug: "when-to-use",
      title: "When to Use Backtracking",
      tagline: "Recognizing problems that fit the pattern.",
      theory:
        "Backtracking shines whenever you need to construct or count all valid configurations under constraints. The clearest signals are: 'find all…', 'is there any…', 'enumerate…', or constraint-satisfaction language like rows/columns/diagonals/mask conditions.\n\nIf the problem asks for the optimal value and subproblems overlap, reach for dynamic programming instead.",
      bullets: [
        "'Generate all X' → subsets, permutations, combinations, parentheses.",
        "'Find any valid X' → Sudoku, N-Queens, word search, maze escape.",
        "'Count the number of X' → count subsets summing to k, count paths.",
        "Constraint satisfaction — CSP, graph colouring, timetable scheduling.",
      ],
      quiz: {
        q: "Which problem is NOT a natural fit for backtracking?",
        choices: [
          "Generate all subsets of a set.",
          "Find any solution to a Sudoku board.",
          "Compute the nth Fibonacci number.",
          "Place N queens on an N × N board so none attack each other.",
        ],
        answer: 2,
        explain:
          "Fibonacci has overlapping subproblems — memoized recursion (DP) is the right tool. The other three are classic backtracking problems.",
      },
    },
    {
      slug: "vs-recursion",
      title: "Backtracking vs Plain Recursion",
      tagline: "Same syntax, different intent.",
      theory:
        "All backtracking is recursion, but not all recursion is backtracking. Plain recursion reduces a problem to one smaller instance. Backtracking recursion tries many alternatives at each step and explicitly undoes state between them.\n\nIf your recursive function returns a single scalar (factorial, sum, gcd), it's plain recursion. If it explores multiple branches and mutates shared state that must be restored, it's backtracking.",
      bullets: [
        "Plain recursion: one branch per call (factorial, sum, binary search).",
        "Backtracking: many branches per call, shared mutable state, explicit undo.",
        "Plain recursion is O(n) or O(log n); backtracking is typically exponential.",
        "Plain recursion returns a value; backtracking usually collects into a shared list.",
      ],
    },
    {
      slug: "vs-dp",
      title: "Backtracking vs Dynamic Programming",
      tagline: "Disjoint decision branches vs overlapping subproblems.",
      theory:
        "Backtracking assumes the search tree has independent branches — each branch explores a distinct configuration. Dynamic programming assumes the opposite: subproblems overlap heavily, so caching results turns exponential work into polynomial work.\n\nA useful rule of thumb: if the recursion tree contains the *same state* (same arguments) reached by many paths, DP is the right optimization. Otherwise, backtracking with good pruning is the right tool.",
      complexity: [
        { op: "Backtracking (subsets)", time: "O(2ⁿ)", space: "O(n)" },
        { op: "DP (0/1 knapsack)", time: "O(n · W)", space: "O(n · W)" },
        { op: "Backtracking (N-Queens)", time: "O(n!)", space: "O(n)" },
        { op: "DP (edit distance)", time: "O(mn)", space: "O(mn)" },
      ],
      tip: "'Find one/all valid configuration' ⇒ backtracking. 'Find the best value / count reaching a target' with overlapping subproblems ⇒ DP.",
    },
    {
      slug: "n-queens",
      title: "Solving N-Queens",
      tagline: "The canonical backtracking problem.",
      theory:
        "Place N queens on an N × N board so that no two attack each other. Since exactly one queen goes in each row, the state is 'which column holds the queen in each row so far'. Adding a queen means checking the column, main diagonal (row − col), and anti-diagonal (row + col) haven't been used before.\n\nThree sets — cols, d1, d2 — give O(1) constraint checks, turning a naive O(nⁿ) search into O(n!) with tight pruning.",
      code: `def solve_n_queens(n):
    result, board = [], []
    cols, d1, d2 = set(), set(), set()

    def backtrack(row):
        if row == n:
            result.append(board[:])
            return
        for col in range(n):
            if col in cols or (row - col) in d1 or (row + col) in d2:
                continue
            cols.add(col); d1.add(row - col); d2.add(row + col)
            board.append(col)
            backtrack(row + 1)
            board.pop()
            cols.remove(col); d1.remove(row - col); d2.remove(row + col)

    backtrack(0)
    return result

print(len(solve_n_queens(8)))  # 92 solutions`,
      complexity: [
        { op: "N-Queens (all solutions)", time: "O(n!)", space: "O(n)" },
      ],
      tip: "The (row + col) and (row − col) trick for diagonals is worth memorizing — it turns O(n) diagonal checks into a single set lookup.",
    },
    {
      slug: "sudoku",
      title: "Solving Sudoku",
      tagline: "Constraint satisfaction on a 9 × 9 grid.",
      theory:
        "Sudoku is backtracking with three constraint sets per cell: the row, the column, and the 3 × 3 box. Walk the grid cell by cell; for each empty cell try digits 1–9 and recurse. The moment a digit violates a constraint, skip it. When you finish the last cell, the board is solved.\n\nA smart cell-selection heuristic (fewest-remaining-values first) can turn hours into milliseconds, but plain left-to-right works for most textbook puzzles.",
      code: `def solve_sudoku(board):
    rows = [set() for _ in range(9)]
    cols = [set() for _ in range(9)]
    boxes = [set() for _ in range(9)]
    empties = []

    for r in range(9):
        for c in range(9):
            v = board[r][c]
            if v == 0:
                empties.append((r, c))
            else:
                rows[r].add(v); cols[c].add(v)
                boxes[(r // 3) * 3 + c // 3].add(v)

    def backtrack(i):
        if i == len(empties): return True
        r, c = empties[i]; b = (r // 3) * 3 + c // 3
        for d in range(1, 10):
            if d in rows[r] or d in cols[c] or d in boxes[b]:
                continue
            board[r][c] = d
            rows[r].add(d); cols[c].add(d); boxes[b].add(d)
            if backtrack(i + 1): return True
            board[r][c] = 0
            rows[r].remove(d); cols[c].remove(d); boxes[b].remove(d)
        return False

    backtrack(0)
    return board`,
    },
    {
      slug: "rat-in-a-maze",
      title: "Rat in a Maze",
      tagline: "Backtracking on a 2-D grid.",
      theory:
        "Given a grid of 0s (blocked) and 1s (open), find a path from the top-left corner to the bottom-right, moving only through open cells. Each recursive call tries the four neighbours in a fixed order; if none succeeds, we return False and the caller tries the next direction.\n\nMark cells visited on the way in and unmark on the way out — that's the backtracking step.",
      code: `def rat_in_maze(grid):
    n, m = len(grid), len(grid[0])
    path = []

    def backtrack(r, c):
        if r < 0 or c < 0 or r >= n or c >= m: return False
        if grid[r][c] != 1: return False
        path.append((r, c))
        if (r, c) == (n - 1, m - 1): return True
        grid[r][c] = 2                          # mark visited
        for dr, dc in [(1, 0), (0, 1), (-1, 0), (0, -1)]:
            if backtrack(r + dr, c + dc): return True
        grid[r][c] = 1                          # undo
        path.pop()
        return False

    return path if backtrack(0, 0) else []

print(rat_in_maze([[1,0,0],[1,1,0],[0,1,1]]))`,
    },
    {
      slug: "permutations",
      title: "Generate Permutations",
      tagline: "Every arrangement of n distinct elements.",
      theory:
        "Building a permutation is a decision at each position: which unused element goes here? A used[] boolean array marks which elements are currently in the path. Choose one, recurse, then unmark — the classic three beats.",
      code: `def permute(nums):
    result, path = [], []
    used = [False] * len(nums)

    def backtrack():
        if len(path) == len(nums):
            result.append(path[:]); return
        for i, n in enumerate(nums):
            if used[i]: continue
            used[i] = True; path.append(n)
            backtrack()
            used[i] = False; path.pop()

    backtrack()
    return result

print(permute([1, 2, 3]))
# [[1,2,3], [1,3,2], [2,1,3], [2,3,1], [3,1,2], [3,2,1]]`,
      complexity: [{ op: "All permutations", time: "O(n · n!)", space: "O(n)" }],
    },
    {
      slug: "subsets",
      title: "Generate Subsets",
      tagline: "Choose or skip — the smallest backtracking template.",
      theory:
        "At each index you have two choices: include the element or skip it. That yields 2ⁿ subsets. The same structure — one binary decision per element — is the template behind power sets, binary strings, and every subset-sum problem.",
      code: `def subsets(nums):
    result, path = [], []

    def backtrack(i):
        if i == len(nums):
            result.append(path[:]); return
        # skip nums[i]
        backtrack(i + 1)
        # take nums[i]
        path.append(nums[i])
        backtrack(i + 1)
        path.pop()

    backtrack(0)
    return result

print(subsets([1, 2, 3]))`,
      complexity: [{ op: "All subsets", time: "O(n · 2ⁿ)", space: "O(n)" }],
    },
    {
      slug: "combination-sum",
      title: "Combination Sum",
      tagline: "Backtracking with a running total and a pruning bound.",
      theory:
        "Given candidate numbers and a target sum, find every combination that adds to the target. Numbers can be reused. Sorting first lets us break out of the loop the moment a candidate exceeds the remaining target — a tiny change that turns the problem tractable.",
      code: `def combination_sum(candidates, target):
    result = []
    candidates.sort()

    def backtrack(start, path, remaining):
        if remaining == 0:
            result.append(path[:]); return
        for i in range(start, len(candidates)):
            if candidates[i] > remaining: break     # PRUNE
            path.append(candidates[i])
            backtrack(i, path, remaining - candidates[i])  # i, not i+1 — reuse allowed
            path.pop()

    backtrack(0, [], target)
    return result

print(combination_sum([2, 3, 6, 7], 7))
# [[2, 2, 3], [7]]`,
    },
    {
      slug: "common-mistakes",
      title: "Common Mistakes",
      tagline: "The pitfalls every backtracking beginner hits at least once.",
      mistakes: [
        "Forgetting the undo — the next branch inherits corrupted state.",
        "Appending path directly to result — every entry ends up pointing at the same emptied list. Use path[:] or list(path).",
        "Missing base case ⇒ infinite recursion ⇒ RecursionError.",
        "Late constraint checks (filter after) instead of early pruning (check before recursing).",
        "Recomputing state (recreating sets, lists) inside the recursive call — pass shared state and undo instead.",
        "Choosing an inefficient state representation — hashing large arrays repeatedly instead of using diff-based bitmasks or sets.",
        "Trying to solve overlapping-subproblem questions (edit distance, coin change count) with backtracking — reach for DP.",
      ],
      tip: "When a backtracking solution returns wrong answers, add a print at the top of the function to see the sequence of calls — the undo bug is almost always visible in the first ten lines of output.",
    },
    {
      slug: "interview-prep",
      title: "Interview Preparation & Revision",
      tagline: "How to recognize, structure, and communicate a backtracking solution under pressure.",
      bullets: [
        "Recognize the pattern: 'find all', 'is there any', 'enumerate', constraint satisfaction.",
        "State the decision tree out loud before writing any code.",
        "Write the six-step template as comments first (base case, candidates, prune, choose, explore, undo).",
        "Mention pruning explicitly — interviewers love hearing what branches you're cutting and why.",
        "State complexity honestly — backtracking is exponential in the worst case, and that's fine when the pruning is aggressive.",
        "Know when to switch to DP: overlapping subproblems + optimal value objective.",
      ],
      tip: "Two sentences you should have ready: 'This has a decision tree of size roughly O(k^n), pruned aggressively by the constraint check' and 'I'm mutating shared state, so I undo after each recursive call to keep sibling branches clean.'",
      practice: [
        {
          title: "LC 78 · Subsets",
          url: "https://leetcode.com/problems/subsets/",
          difficulty: "Medium",
        },
        {
          title: "LC 46 · Permutations",
          url: "https://leetcode.com/problems/permutations/",
          difficulty: "Medium",
        },
        {
          title: "LC 39 · Combination Sum",
          url: "https://leetcode.com/problems/combination-sum/",
          difficulty: "Medium",
        },
        {
          title: "LC 22 · Generate Parentheses",
          url: "https://leetcode.com/problems/generate-parentheses/",
          difficulty: "Medium",
        },
        {
          title: "LC 17 · Letter Combinations of a Phone Number",
          url: "https://leetcode.com/problems/letter-combinations-of-a-phone-number/",
          difficulty: "Medium",
        },
        {
          title: "LC 79 · Word Search",
          url: "https://leetcode.com/problems/word-search/",
          difficulty: "Medium",
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
      quiz: {
        q: "What single line separates a correct backtracking solution from a broken one most often?",
        choices: [
          "The base case.",
          "The recursive call.",
          "The undo step that restores state after the recursive call returns.",
          "The pruning check.",
        ],
        answer: 2,
        explain:
          "Every other step usually exists in some form. Forgetting to undo shared mutable state is the single most common bug — sibling branches inherit stale state and produce wrong answers.",
      },
      references: [
        {
          label: "CLRS Chapter 34 — NP-Completeness",
          url: "https://mitpress.mit.edu/9780262046305/",
        },
        {
          label: "Skiena — The Algorithm Design Manual, Ch. 9 (Combinatorial Search)",
          url: "https://www.algorist.com/",
        },
        {
          label: "LeetCode Backtracking Tag",
          url: "https://leetcode.com/tag/backtracking/",
        },
      ],
    },
  ],
};
