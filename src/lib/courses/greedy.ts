import type { Course } from "./types";

export const greedyCourse: Course = {
  slug: "greedy",
  title: "Greedy Algorithms",
  tagline: "Make the locally optimal choice and hope it stays optimal globally.",
  category: "algorithm",
  order: 5,
  icon: "Coins",
  courseLayout: "overview",
  comingSoon: false,
  overview: {
    introduction:
      "A greedy algorithm builds a solution one piece at a time, always choosing the option that looks best right now. There is no lookahead, no backtracking, and no memoization — just a series of locally optimal decisions that, for a well-chosen class of problems, add up to a globally optimal answer.",
    whyLearn:
      "Greedy is the fastest, simplest technique in the algorithm toolbox — often O(n log n) — and it powers real systems from Huffman compression and Dijkstra's shortest paths to Kruskal's MST, task scheduling, and network routing. Learning greedy teaches you to recognize the greedy-choice property, prove correctness with exchange arguments, and choose between greedy, DP, and backtracking with confidence.",
    learningObjectives: [
      "Recognize when a problem satisfies the greedy-choice property and optimal substructure.",
      "Design greedy algorithms by choosing the right ordering (by end time, by ratio, by deadline).",
      "Prove correctness informally with exchange arguments and counter-examples.",
      "Solve classics: activity selection, fractional knapsack, Huffman coding, job sequencing.",
      "Distinguish greedy from dynamic programming and divide & conquer.",
      "Analyse time and space complexity — most greedy solutions are O(n log n).",
    ],
    realWorldApplications: [
      "Data compression — Huffman coding used in ZIP, JPEG, MP3.",
      "Graph algorithms — Dijkstra's shortest path, Kruskal's and Prim's MST.",
      "Scheduling — CPU job scheduling, meeting rooms, interval scheduling.",
      "Networking — routing tables, load balancing, packet forwarding.",
      "Finance — coin/change dispensing, portfolio rebalancing heuristics.",
    ],
    advantages: [
      "Very fast — typically O(n log n) once inputs are sorted.",
      "Simple to implement — usually a sort plus a single pass.",
      "Uses O(1) or O(n) extra memory; no recursion trees or DP tables.",
      "Ideal for online / streaming problems where DP is infeasible.",
    ],
    limitations: [
      "Not every problem has the greedy-choice property — a wrong choice ruins the whole answer.",
      "Correctness proofs are subtle; counter-examples are easy to miss.",
      "Fails on problems with overlapping subproblems (0/1 knapsack, edit distance).",
      "Small input changes can silently break a previously working greedy strategy.",
    ],
    prerequisites: [
      "Comfort with sorting, arrays, and priority queues / heaps.",
      "Basic complexity analysis (Big-O, sorting cost).",
      "Familiarity with recursion and, ideally, an intro to dynamic programming.",
    ],
    estimatedTime: "5–7 Hours",
    difficulty: 3,
  },
  infoCard: {
    estimatedTime: "5–7 Hours",
    difficulty: 3,
    practiceRequired: true,
    language: "Python",
  },
  whoIsThisFor: [
    "Learners who know sorting and heaps and want a fast, elegant algorithm technique.",
    "Interview candidates — greedy problems appear in almost every coding interview.",
    "Developers building schedulers, compression, or routing systems.",
  ],
  ctaText: "Open Greedy Playground →",
  ctaRoute: "/playgrounds/greedy",
  lessons: [
    {
      slug: "introduction",
      title: "Introduction to Greedy Algorithms",
      tagline: "The simplest, fastest algorithm technique — when it works.",
      theory:
        "A greedy algorithm builds up a solution incrementally, always taking the locally best option available at each step. There is no lookahead and no undo. When a problem has the right structure, this simple strategy produces a globally optimal answer in a single pass — usually after an O(n log n) sort.\n\nGreedy is the mental opposite of dynamic programming: DP explores every option and remembers the best; greedy commits immediately and never looks back.",
      bullets: [
        "One-pass algorithm — no backtracking, no memoization.",
        "Requires a well-chosen ordering (by end time, ratio, deadline, …).",
        "Correctness must be proven — a plausible greedy strategy can be wrong.",
        "Typical runtime: O(n log n), dominated by sorting.",
      ],
      code: `def greedy_template(items):
    items.sort(key=criterion)      # 1. sort by the greedy criterion
    result = []
    for item in items:
        if feasible(result, item): # 2. pick the locally best item
            result.append(item)
    return result`,
      tip: "Whenever a problem asks for the maximum count, minimum cost, or an optimal selection under simple constraints, ask yourself: is there an ordering that makes the choice obvious at every step? That's the greedy question.",
    },
    {
      slug: "greedy-choice-property",
      title: "The Greedy-Choice Property",
      tagline: "The single condition that makes greedy correct.",
      theory:
        "A problem has the greedy-choice property if a globally optimal solution can always be reached by making the locally optimal choice at each step. In other words: whichever option looks best right now, there exists some optimal solution that includes it.\n\nThis is the deep reason greedy works — you never need to consider alternatives, because at least one optimal answer agrees with your first move.",
      bullets: [
        "At every step, at least one optimal solution contains the greedy choice.",
        "The property is problem-specific — must be proved, not assumed.",
        "The standard proof technique is the exchange argument (swap the greedy choice into any optimal solution).",
        "Without this property, greedy is at best a heuristic.",
      ],
      tip: "Exchange argument in one line: assume an optimal solution differs from greedy at the first step; swap the greedy choice into it; show the result is still optimal. If that swap always works, greedy is correct.",
    },
    {
      slug: "optimal-substructure",
      title: "Optimal Substructure",
      tagline: "Why one good choice makes the remaining problem the same shape.",
      theory:
        "A problem has optimal substructure when an optimal solution to the whole contains optimal solutions to its subproblems. Greedy relies on this: once you commit to the first greedy choice, what's left must itself be an instance of the same problem, solvable by the same greedy rule.\n\nBoth greedy and dynamic programming need optimal substructure; the difference is whether subproblems overlap (DP) or not (greedy).",
      bullets: [
        "Making one choice reduces the input to a smaller instance of the same problem.",
        "The subproblem's optimum + the greedy choice = the whole optimum.",
        "Present in most sorting-based greedy problems (activity selection, scheduling).",
        "Missing in problems where a local choice constrains future options in complex ways.",
      ],
    },
    {
      slug: "designing-greedy",
      title: "Designing a Greedy Algorithm",
      tagline: "A repeatable recipe for greedy problem solving.",
      theory:
        "Designing a greedy algorithm is a five-step process. Skip any step and you either miss the right criterion or ship a subtly broken solution.",
      bullets: [
        "1. Cast the problem as a sequence of choices.",
        "2. Guess a greedy criterion (by end time, ratio, deadline, size, …).",
        "3. Prove correctness with an exchange argument or find a counter-example.",
        "4. Implement: sort by the criterion, then scan.",
        "5. Analyse: sorting cost dominates — usually O(n log n).",
      ],
      code: `# Skeleton every greedy solution eventually collapses to
def greedy(items):
    items.sort(key=key_fn)
    picked, state = [], initial_state()
    for item in items:
        if feasible(state, item):
            picked.append(item)
            state = update(state, item)
    return picked`,
      tip: "Before coding, hand-run your greedy criterion on a tiny adversarial input. If you can construct a case where greedy loses, pick a better criterion — or reach for DP.",
    },
    {
      slug: "when-greedy-works",
      title: "When Greedy Works",
      tagline: "Signals that a greedy strategy is safe.",
      theory:
        "Greedy shines on problems where a natural ordering — deadlines, end times, value/weight ratios — makes the next choice obvious and independent of future choices. If reordering the input never changes which items are optimally picked, you're almost certainly in greedy territory.",
      bullets: [
        "Selection problems: 'pick as many as possible' under simple constraints.",
        "Scheduling: minimise lateness / maximise throughput with independent jobs.",
        "Optimisation with a monotone objective (value/weight ratio, deadlines).",
        "Graph problems where a cut/tree property guarantees a safe edge (MST, shortest paths).",
      ],
      quiz: {
        q: "Which of these is the strongest hint that a problem might yield to a greedy solution?",
        choices: [
          "The problem has overlapping subproblems.",
          "There is a natural ordering that makes the locally best choice obvious.",
          "The state space is exponential.",
          "The answer requires exploring every combination.",
        ],
        answer: 1,
        explain:
          "A natural ordering + local choice = greedy signal. Overlapping subproblems point to DP; exponential state space points to backtracking.",
      },
    },
    {
      slug: "when-greedy-fails",
      title: "When Greedy Fails",
      tagline: "The classic traps and how to spot them.",
      theory:
        "Greedy fails whenever a locally best choice locks the algorithm out of a better global solution. The textbook example is the 0/1 knapsack: picking the item with the highest value/weight ratio first can waste capacity that a smarter combination would fill more valuably.\n\nAnother trap is arbitrary coin systems: greedy dispenses {1, 3, 4} for target 6 as 4+1+1 = three coins, while the optimum is 3+3 = two.",
      bullets: [
        "Fails when subproblems overlap heavily — use DP.",
        "Fails when a local choice constrains future feasibility in non-obvious ways.",
        "Fails on non-canonical coin systems.",
        "Fails on 0/1 knapsack, weighted interval scheduling, TSP.",
      ],
      mistakes: [
        "Assuming greedy works because it produces the right answer on small examples.",
        "Skipping the exchange-argument proof.",
        "Applying fractional knapsack's greedy to the 0/1 variant.",
      ],
      tip: "Always try to break your greedy with a small adversarial input. If you can't and the exchange argument holds, you're safe.",
    },
    {
      slug: "greedy-vs-dp",
      title: "Greedy vs Dynamic Programming",
      tagline: "One commits early; the other explores everything.",
      theory:
        "Greedy makes one choice per step and commits. Dynamic programming considers every choice, memoizes the results, and picks the best. Both rely on optimal substructure — the difference is overlapping subproblems.\n\nA rough rule: if the recursion tree revisits the same state via many paths, use DP. If each subproblem is distinct and one clear rule dominates, greedy wins.",
      complexity: [
        { op: "Greedy (activity selection)", time: "O(n log n)", space: "O(1)" },
        { op: "DP (weighted interval scheduling)", time: "O(n log n)", space: "O(n)" },
        { op: "Greedy (fractional knapsack)", time: "O(n log n)", space: "O(1)" },
        { op: "DP (0/1 knapsack)", time: "O(n · W)", space: "O(n · W)" },
      ],
      tip: "'Take as many / as much as possible' with one clear ordering → greedy. 'Best value with weight / count constraint and reuse of subproblems' → DP.",
    },
    {
      slug: "greedy-vs-divide-and-conquer",
      title: "Greedy vs Divide & Conquer",
      tagline: "Two very different ways to shrink a problem.",
      theory:
        "Divide & conquer splits a problem into independent halves, solves each recursively, and merges the results. Greedy shrinks the problem by making one committed decision at a time — no split, no merge.\n\nD&C typically runs in O(n log n) because of the merge step; greedy also runs in O(n log n), but almost always because of the initial sort. When a problem admits both, greedy is usually simpler to implement.",
      bullets: [
        "D&C: split → recurse → combine (Merge Sort, Quick Sort, Binary Search).",
        "Greedy: sort once, then decide in a single pass.",
        "D&C recursion depth is O(log n); greedy is iterative and stack-free.",
        "Choose D&C when the problem naturally halves; greedy when a global ordering exists.",
      ],
    },
    {
      slug: "activity-selection",
      title: "Activity Selection",
      tagline: "The canonical greedy problem: earliest end time wins.",
      theory:
        "Given N activities, each with a start and end time, pick the largest set of non-overlapping activities. The correct greedy rule is 'sort by end time and always pick the next activity whose start is ≥ the last picked end'. Sorting by start time or shortest duration both fail on standard counter-examples.\n\nExchange argument: any optimal solution can be transformed to include the earliest-ending compatible activity without loss, so greedy is safe at every step.",
      code: `def activity_selection(intervals):
    intervals.sort(key=lambda x: x[1])   # sort by end time
    picked, last_end = [], float('-inf')
    for s, e in intervals:
        if s >= last_end:
            picked.append((s, e))
            last_end = e
    return picked

print(activity_selection([(1,4),(3,5),(0,6),(5,7),(3,9),(5,9),(6,10),(8,11)]))`,
      complexity: [
        { op: "Sort", time: "O(n log n)", space: "O(1)" },
        { op: "Scan", time: "O(n)", space: "O(1)" },
      ],
      tip: "'Earliest end time' is the greedy ordering to memorise — the same idea powers interval scheduling and meeting-room problems.",
    },
    {
      slug: "fractional-knapsack",
      title: "Fractional Knapsack",
      tagline: "Sort by value/weight ratio and pour items in.",
      theory:
        "You have items with weights and values and a knapsack of capacity W. Unlike 0/1 knapsack, you may take any fraction of an item. Sort by value-per-unit-weight (descending), take as much of the highest-ratio item as fits, then move to the next.\n\nThe greedy-choice property holds because dropping a lower-ratio item and replacing its weight with a higher-ratio item can only increase total value.",
      code: `def fractional_knapsack(items, capacity):
    # items: list of (value, weight)
    items.sort(key=lambda x: x[0] / x[1], reverse=True)
    total, taken = 0.0, []
    for v, w in items:
        if capacity == 0: break
        take = min(w, capacity)
        total += v * (take / w)
        taken.append((v, w, take))
        capacity -= take
    return total, taken

print(fractional_knapsack([(60,10),(100,20),(120,30)], 50))
# 240.0`,
      complexity: [
        { op: "Sort by ratio", time: "O(n log n)", space: "O(1)" },
        { op: "Fill knapsack", time: "O(n)", space: "O(1)" },
      ],
      mistakes: [
        "Applying this greedy to 0/1 knapsack — items are indivisible there, so DP is required.",
        "Sorting by value or weight alone instead of the ratio.",
      ],
    },
    {
      slug: "huffman-coding",
      title: "Huffman Coding",
      tagline: "Build an optimal prefix code by repeatedly merging the two smallest.",
      theory:
        "Given character frequencies, build a binary tree so that no codeword is a prefix of another and total code length is minimized. Huffman's algorithm: put every character in a min-heap keyed by frequency; repeatedly pop the two smallest nodes, merge them into a parent whose frequency is the sum, and push it back. When only one node remains, it's the root of the optimal tree.\n\nThe two lowest-frequency characters must be sibling leaves at the deepest level of some optimal tree — a classic exchange-argument result — which is why the greedy merge is correct.",
      code: `import heapq

def huffman_codes(freq):
    # freq: dict of char -> count
    heap = [[f, [ch, ""]] for ch, f in freq.items()]
    heapq.heapify(heap)
    while len(heap) > 1:
        lo = heapq.heappop(heap)
        hi = heapq.heappop(heap)
        for pair in lo[1:]:
            pair[1] = '0' + pair[1]
        for pair in hi[1:]:
            pair[1] = '1' + pair[1]
        heapq.heappush(heap, [lo[0] + hi[0]] + lo[1:] + hi[1:])
    return sorted(heap[0][1:], key=lambda p: (len(p[1]), p))

print(huffman_codes({'a': 5, 'b': 9, 'c': 12, 'd': 13, 'e': 16, 'f': 45}))`,
      complexity: [
        { op: "Huffman build", time: "O(n log n)", space: "O(n)" },
      ],
      tip: "Huffman codes are used everywhere — ZIP, JPEG, MP3, PNG. Knowing how the tree is built end-to-end is a high-value interview topic.",
    },
    {
      slug: "job-sequencing",
      title: "Job Sequencing with Deadlines",
      tagline: "Maximise profit when every job takes one unit of time.",
      theory:
        "Each job has a deadline and a profit; every job takes one unit of time. You may schedule at most one job per time slot. Maximise total profit. Sort jobs by profit descending; for each job, place it in the latest free slot ≤ its deadline.\n\nUsing the latest slot preserves earlier slots for future jobs with tighter deadlines — the greedy-choice property in action.",
      code: `def job_sequencing(jobs):
    # jobs: list of (id, deadline, profit)
    jobs.sort(key=lambda j: j[2], reverse=True)
    max_deadline = max(j[1] for j in jobs)
    slots = [None] * (max_deadline + 1)
    total = 0
    for jid, d, p in jobs:
        for t in range(min(d, max_deadline), 0, -1):
            if slots[t] is None:
                slots[t] = jid
                total += p
                break
    return total, [s for s in slots[1:] if s]

print(job_sequencing([('a',2,100),('b',1,19),('c',2,27),('d',1,25),('e',3,15)]))`,
      complexity: [
        { op: "Sort + scan", time: "O(n²)", space: "O(n)" },
        { op: "Union-Find optimisation", time: "O(n log n)", space: "O(n)" },
      ],
    },
    {
      slug: "minimum-platforms",
      title: "Minimum Platforms",
      tagline: "How many platforms does a train station need?",
      theory:
        "Given arrival and departure times for N trains, find the minimum number of platforms required so that no train has to wait. Sort arrivals and departures separately; use two pointers to sweep through time, incrementing a counter when a train arrives and decrementing when one leaves. The maximum counter value is the answer.\n\nThis is a lightweight interval-overlap sweep — arguably the most reused greedy pattern in interviews.",
      code: `def min_platforms(arr, dep):
    arr.sort(); dep.sort()
    i = j = 0
    platforms = result = 0
    while i < len(arr):
        if arr[i] <= dep[j]:
            platforms += 1
            result = max(result, platforms)
            i += 1
        else:
            platforms -= 1
            j += 1
    return result

print(min_platforms([900,940,950,1100,1500,1800],
                    [910,1200,1120,1130,1900,2000]))
# 3`,
      complexity: [
        { op: "Sort + two pointers", time: "O(n log n)", space: "O(1)" },
      ],
      tip: "The same sweep answers 'max concurrent meetings', 'minimum meeting rooms', and 'peak concurrent connections'. Memorise the pattern once, reuse it forever.",
    },
    {
      slug: "minimum-cost-rope",
      title: "Minimum Cost to Connect Ropes",
      tagline: "A min-heap greedy identical in spirit to Huffman.",
      theory:
        "You have N ropes with different lengths. Connecting two ropes costs the sum of their lengths. Find the minimum total cost to connect them all into one rope.\n\nExactly like Huffman: put lengths in a min-heap, repeatedly pop the two smallest, connect them (adding their sum to total cost), and push the merged rope back. Connecting the two shortest at every step keeps later merges as cheap as possible.",
      code: `import heapq

def connect_ropes(ropes):
    heapq.heapify(ropes)
    total = 0
    while len(ropes) > 1:
        a = heapq.heappop(ropes)
        b = heapq.heappop(ropes)
        total += a + b
        heapq.heappush(ropes, a + b)
    return total

print(connect_ropes([4, 3, 2, 6]))
# 29`,
      complexity: [{ op: "Heap-based merges", time: "O(n log n)", space: "O(n)" }],
    },
    {
      slug: "common-mistakes",
      title: "Common Mistakes",
      tagline: "Every trap greedy beginners eventually walk into.",
      mistakes: [
        "Choosing the wrong greedy criterion (sorting by start time in activity selection, by value in fractional knapsack).",
        "Applying fractional knapsack's greedy to 0/1 knapsack — the answer is often wrong.",
        "Assuming a coin-change greedy works for arbitrary denominations. It only works for canonical systems.",
        "Skipping the exchange-argument proof and shipping a plausible-looking but incorrect algorithm.",
        "Not testing on small adversarial inputs designed to break greedy.",
        "Confusing 'the greedy that works' with 'any greedy' — activity selection needs *end time*, not duration.",
        "Using greedy on problems with overlapping subproblems where DP would be correct.",
      ],
      tip: "When in doubt, write a brute-force reference solution and fuzz-test both on random inputs. A ten-line brute force plus a hundred random tests will surface a wrong greedy in seconds.",
    },
    {
      slug: "interview-prep",
      title: "Interview Preparation",
      tagline: "Recognising, communicating, and defending a greedy solution.",
      bullets: [
        "Recognise the pattern: 'select the maximum / minimum X under a simple constraint'.",
        "State your greedy criterion out loud before writing code (by end time / ratio / deadline).",
        "Sketch an exchange argument in one sentence — interviewers love hearing it.",
        "Contrast with DP: explain why the problem has no overlapping subproblems.",
        "State complexity honestly: greedy is almost always O(n log n) dominated by sorting.",
        "Test on a small adversarial input; walk the interviewer through why greedy still wins.",
      ],
      tip: "Two sentences to have ready: 'Sorting by <criterion> lets the greedy choice be locally optimal at every step' and 'An exchange argument shows any optimal solution can be transformed to include the greedy pick, so greedy is safe.'",
      practice: [
        {
          title: "GfG · N Meetings in One Room",
          url: "https://www.geeksforgeeks.org/problems/n-meetings-in-one-room-1587115620/1",
          difficulty: "Easy",
        },
        {
          title: "LC 455 · Assign Cookies",
          url: "https://leetcode.com/problems/assign-cookies/",
          difficulty: "Easy",
        },
        {
          title: "LC 55 · Jump Game",
          url: "https://leetcode.com/problems/jump-game/",
          difficulty: "Medium",
        },
        {
          title: "LC 45 · Jump Game II",
          url: "https://leetcode.com/problems/jump-game-ii/",
          difficulty: "Medium",
        },
        {
          title: "LC 134 · Gas Station",
          url: "https://leetcode.com/problems/gas-station/",
          difficulty: "Medium",
        },
        {
          title: "LC 435 · Non-overlapping Intervals",
          url: "https://leetcode.com/problems/non-overlapping-intervals/",
          difficulty: "Medium",
        },
        {
          title: "LC 253 · Meeting Rooms II",
          url: "https://leetcode.com/problems/meeting-rooms-ii/",
          difficulty: "Medium",
        },
        {
          title: "GfG · Fractional Knapsack",
          url: "https://www.geeksforgeeks.org/problems/fractional-knapsack-1587115620/1",
          difficulty: "Medium",
        },
        {
          title: "GfG · Job Sequencing Problem",
          url: "https://www.geeksforgeeks.org/problems/job-sequencing-problem-1587115620/1",
          difficulty: "Medium",
        },
        {
          title: "GfG · Minimum Platforms",
          url: "https://www.geeksforgeeks.org/problems/minimum-platforms-1587115620/1",
          difficulty: "Medium",
        },
        {
          title: "GfG · Huffman Encoding",
          url: "https://www.geeksforgeeks.org/problems/huffman-encoding3345/1",
          difficulty: "Medium",
        },
        {
          title: "LC 135 · Candy",
          url: "https://leetcode.com/problems/candy/",
          difficulty: "Hard",
        },
      ],
      quiz: {
        q: "Which single practice is most likely to catch a subtly wrong greedy solution?",
        choices: [
          "Adding more test cases from the problem statement.",
          "Fuzz-testing greedy against a brute-force reference on random inputs.",
          "Rewriting the code in another language.",
          "Increasing recursion depth.",
        ],
        answer: 1,
        explain:
          "Greedy correctness is a proof question. A brute-force reference plus random inputs surfaces counter-examples immediately.",
      },
      references: [
        {
          label: "CLRS Chapter 16 — Greedy Algorithms",
          url: "https://mitpress.mit.edu/9780262046305/",
        },
        {
          label: "Kleinberg & Tardos — Algorithm Design, Ch. 4",
          url: "https://www.pearson.com/en-us/subject-catalog/p/algorithm-design/P200000003259",
        },
        {
          label: "LeetCode Greedy Tag",
          url: "https://leetcode.com/tag/greedy/",
        },
      ],
    },
    {
      slug: "summary-revision",
      title: "Summary & Revision",
      tagline: "Fast reference of every greedy pattern in this module.",
      bullets: [
        "Greedy = sort by a criterion, then commit to the locally best choice in one pass.",
        "Requires the greedy-choice property + optimal substructure.",
        "Prove correctness with an exchange argument or find a counter-example.",
        "Typical runtime: O(n log n), dominated by sorting.",
        "Activity selection → sort by end time.",
        "Fractional knapsack → sort by value/weight ratio.",
        "Huffman & minimum cost ropes → min-heap of the two smallest.",
        "Job sequencing → sort by profit, fill latest free slot ≤ deadline.",
        "Minimum platforms → two-pointer sweep on sorted arrivals/departures.",
        "If subproblems overlap → switch to DP. If a local choice constrains the future in complex ways → switch to backtracking.",
      ],
      practice: [
        {
          title: "LC 121 · Best Time to Buy and Sell Stock",
          url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
          difficulty: "Easy",
        },
        {
          title: "LC 122 · Best Time to Buy and Sell Stock II",
          url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/",
          difficulty: "Medium",
        },
        {
          title: "LC 763 · Partition Labels",
          url: "https://leetcode.com/problems/partition-labels/",
          difficulty: "Medium",
        },
      ],
      references: [
        {
          label: "Sedgewick & Wayne — Algorithms, 4th ed.",
          url: "https://algs4.cs.princeton.edu/home/",
        },
      ],
    },
  ],
};
