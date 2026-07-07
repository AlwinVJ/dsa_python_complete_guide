// Popular algorithms curriculum data.
// One entry per algorithm. The dynamic route /algorithms/$slug renders the
// standard sections from these fields. Keep this file as the single source
// of truth so new algorithms can be added without touching UI code.

export type Complexity = {
  best?: string;
  average?: string;
  worst?: string;
  space?: string;
};

export type LeetProblem = {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  url: string;
  tags?: string[];
  minutes?: number;
  note?: string;
};

export type CodeSample = {
  label: string; // "Brute force", "Better", "Optimal"
  code: string;
  note?: string;
};

export type DryRunRow = {
  step: number;
  state: string;
  action: string;
};

export type Algorithm = {
  slug: string;
  number: number;
  title: string;
  tagline: string;
  category:
    | "Traversal"
    | "Two Pointers"
    | "Windowing"
    | "Prefix / Range"
    | "Hashing"
    | "Search"
    | "Sorting"
    | "DP"
    | "Greedy"
    | "Divide & Conquer"
    | "Heap"
    | "Stack / Queue"
    | "Matrix"
    | "Backtracking"
    | "Bits"
    | "Intervals"
    | "Cyclic"
    | "Selection";
  // Standard layout fields
  whyItExists: string;
  recognition: string[]; // "How do I know to use this?"
  intuition: string;
  complexity: Complexity;
  code: CodeSample[];
  dryRun?: { array: number[]; rows: DryRunRow[] };
  commonMistakes: string[];
  edgeCases: string[];
  interviewTips: string[];
  realWorld: string[];
  related: string[]; // slugs
  leetcode: LeetProblem[];
  // Optional interactive playground identifier — matched in algorithm-steps.ts
  playground?: string;
  pythonTricks?: string[];
  whenNot?: string[];
};

export const ALGORITHMS: Algorithm[] = [
  // 1
  {
    slug: "linear-traversal",
    number: 1,
    title: "Linear Traversal",
    tagline: "Visit every element once — the foundation of every array algorithm.",
    category: "Traversal",
    whyItExists:
      "Most array problems require inspecting every element at least once. Linear traversal is the baseline pattern every other technique is measured against.",
    recognition: [
      "The problem asks you to look at each element to compute a total, count, or check a condition.",
      "No sorted input, no obvious pointers, no window — just a scan.",
      "The output depends on all elements, not a subset.",
    ],
    intuition:
      "Walk the array from left to right, do O(1) work per element, and accumulate an answer. Reverse traversal helps when the answer at index i depends on values to the right.",
    complexity: { best: "O(n)", average: "O(n)", worst: "O(n)", space: "O(1)" },
    code: [
      {
        label: "Forward traversal",
        code: `def total(nums):
    s = 0
    for num in nums:   # O(n) single pass
        s += num
    return s`,
      },
      {
        label: "Reverse traversal",
        code: `def last_positive(nums):
    for i in range(len(nums) - 1, -1, -1):
        if nums[i] > 0:
            return i
    return -1`,
      },
      {
        label: "Index + value with enumerate",
        code: `def first_duplicate_index(nums):
    seen = set()
    for i, x in enumerate(nums):
        if x in seen:
            return i
        seen.add(x)
    return -1`,
      },
    ],
    dryRun: {
      array: [3, 1, 4, 1, 5],
      rows: [
        { step: 1, state: "i=0, s=0", action: "Add 3 → s=3" },
        { step: 2, state: "i=1, s=3", action: "Add 1 → s=4" },
        { step: 3, state: "i=2, s=4", action: "Add 4 → s=8" },
        { step: 4, state: "i=3, s=8", action: "Add 1 → s=9" },
        { step: 5, state: "i=4, s=9", action: "Add 5 → s=14" },
      ],
    },
    commonMistakes: [
      "Using range(len(nums)) when you don't need indices — prefer `for x in nums`.",
      "Mutating the list while iterating over it (skips or duplicates elements).",
      "Off-by-one errors in reverse traversal — use range(len(nums)-1, -1, -1).",
    ],
    edgeCases: [
      "Empty list — most accumulators start at their identity element (0 for sum, 1 for product).",
      "Single element — verify your logic doesn't require i-1 or i+1 without bounds checks.",
      "Very large lists — prefer generators (`sum(x*x for x in nums)`) to avoid intermediate lists.",
    ],
    interviewTips: [
      "State that your solution is O(n) time / O(1) space before writing code.",
      "Ask if the input can be empty or contain negatives — this often changes the base case.",
    ],
    realWorld: [
      "Aggregations in analytics (sum, average, count).",
      "Log scanning for the first / last error line.",
      "Simple validators (all fields non-null).",
    ],
    related: ["two-pointers", "prefix-sum", "hash-map"],
    playground: "linear-traversal",
    pythonTricks: [
      "`sum`, `min`, `max`, `any`, `all` are C-implemented linear scans — use them.",
      "`enumerate(nums, start=1)` avoids manual index bookkeeping.",
    ],
    whenNot: [
      "When the array is sorted and you need O(log n) lookup — use binary search.",
      "When you'll query the same range repeatedly — precompute a prefix sum.",
    ],
    leetcode: [
      {
        id: "1108",
        title: "Defanging an IP Address",
        difficulty: "Easy",
        url: "https://leetcode.com/problems/defanging-an-ip-address/",
        minutes: 5,
      },
      {
        id: "1512",
        title: "Number of Good Pairs",
        difficulty: "Easy",
        url: "https://leetcode.com/problems/number-of-good-pairs/",
        minutes: 10,
      },
      {
        id: "1365",
        title: "How Many Numbers Are Smaller Than the Current",
        difficulty: "Easy",
        url: "https://leetcode.com/problems/how-many-numbers-are-smaller-than-the-current-number/",
        minutes: 15,
      },
      {
        id: "485",
        title: "Max Consecutive Ones",
        difficulty: "Easy",
        url: "https://leetcode.com/problems/max-consecutive-ones/",
        minutes: 15,
      },
      {
        id: "283",
        title: "Move Zeroes",
        difficulty: "Easy",
        url: "https://leetcode.com/problems/move-zeroes/",
        minutes: 20,
      },
    ],
  },

  // 2
  {
    slug: "two-pointers",
    number: 2,
    title: "Two Pointer Technique",
    tagline: "Coordinate two indices to solve pair, palindrome, and partition problems in O(n).",
    category: "Two Pointers",
    whyItExists:
      "Nested loops are O(n²). When the input is sorted (or convertible to sorted) or you need to compare/partition from both ends, two coordinated pointers collapse the work to O(n).",
    recognition: [
      "Sorted array + you need a pair meeting some condition (target sum, closest, container).",
      "Words like 'palindrome', 'reverse', 'partition in place', 'remove duplicates in place'.",
      "You need to compare front and back or advance two indices at different speeds.",
    ],
    intuition:
      "Place one pointer at each end (opposite) or both at the start (same direction). At each step, decide which pointer to move based on the invariant you want to preserve.",
    complexity: { best: "O(n)", average: "O(n)", worst: "O(n)", space: "O(1)" },
    code: [
      {
        label: "Two Sum on sorted array (opposite pointers)",
        code: `def two_sum_sorted(nums, target):
    l, r = 0, len(nums) - 1
    while l < r:
        s = nums[l] + nums[r]
        if s == target:
            return [l, r]
        if s < target:
            l += 1
        else:
            r -= 1
    return [-1, -1]`,
      },
      {
        label: "Remove duplicates in place (same direction)",
        code: `def remove_duplicates(nums):
    if not nums:
        return 0
    write = 1
    for read in range(1, len(nums)):
        if nums[read] != nums[read - 1]:
            nums[write] = nums[read]
            write += 1
    return write`,
      },
      {
        label: "Fast / slow (cycle detection style)",
        code: `def middle_index(nums):
    slow = fast = 0
    while fast + 1 < len(nums):
        slow += 1
        fast += 2
    return slow`,
      },
    ],
    dryRun: {
      array: [1, 2, 4, 7, 11, 15],
      rows: [
        { step: 1, state: "l=0(1), r=5(15)", action: "sum=16 > 12 → r--" },
        { step: 2, state: "l=0(1), r=4(11)", action: "sum=12 == 12 → return [0,4]" },
      ],
    },
    commonMistakes: [
      "Using two pointers on unsorted data when the invariant requires order — sort first or switch to hashing.",
      "Forgetting to move a pointer inside the loop — infinite loop.",
      "Overwriting the read pointer's value before it's read (same-direction problems).",
    ],
    edgeCases: [
      "Length 0 or 1 — often the answer is the input itself.",
      "All duplicates — write pointer stays at 1.",
      "Target smaller than min or larger than max — no answer exists.",
    ],
    interviewTips: [
      "Say the invariant out loud: 'l is the next write slot, r scans forward'.",
      "Two pointers usually turns an O(n²) brute force into O(n) — mention this improvement explicitly.",
    ],
    realWorld: [
      "In-place stream filtering (compact non-null events).",
      "Palindrome checks for DNA / string validation.",
      "Merging two sorted result sets from a database.",
    ],
    related: ["sliding-window", "sorting-based", "cyclic-sort"],
    playground: "two-pointers",
    pythonTricks: [
      "Tuple unpacking swap: `l, r = r, l`.",
      "For palindrome, compare `s[l] == s[r]` without slicing — slicing is O(n).",
    ],
    whenNot: [
      "Unsorted array where you need arbitrary pairs — hash map is O(n) with O(n) space.",
      "You need every pair (not just one match) — you can't skip pairs with two pointers.",
    ],
    leetcode: [
      {
        id: "167",
        title: "Two Sum II - Input Array Is Sorted",
        difficulty: "Easy",
        url: "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/",
        minutes: 15,
      },
      {
        id: "26",
        title: "Remove Duplicates from Sorted Array",
        difficulty: "Easy",
        url: "https://leetcode.com/problems/remove-duplicates-from-sorted-array/",
        minutes: 15,
      },
      {
        id: "283",
        title: "Move Zeroes",
        difficulty: "Easy",
        url: "https://leetcode.com/problems/move-zeroes/",
        minutes: 15,
      },
      {
        id: "125",
        title: "Valid Palindrome",
        difficulty: "Easy",
        url: "https://leetcode.com/problems/valid-palindrome/",
        minutes: 15,
      },
      {
        id: "977",
        title: "Squares of a Sorted Array",
        difficulty: "Easy",
        url: "https://leetcode.com/problems/squares-of-a-sorted-array/",
        minutes: 20,
      },
      {
        id: "11",
        title: "Container With Most Water",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/container-with-most-water/",
        minutes: 25,
      },
      {
        id: "15",
        title: "3Sum",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/3sum/",
        minutes: 40,
      },
      {
        id: "42",
        title: "Trapping Rain Water",
        difficulty: "Hard",
        url: "https://leetcode.com/problems/trapping-rain-water/",
        minutes: 45,
      },
    ],
  },

  // 3
  {
    slug: "sliding-window",
    number: 3,
    title: "Sliding Window",
    tagline: "Reuse work across contiguous subarrays instead of recomputing from scratch.",
    category: "Windowing",
    whyItExists:
      "When the answer for a subarray of length k+1 can be derived from the answer for length k by adding one element and removing one, sliding window turns O(n·k) into O(n).",
    recognition: [
      "'Contiguous subarray / substring' + a size or condition on the window.",
      "'Maximum / minimum / longest / shortest' over a range.",
      "The window has a monotonic property (grows or shrinks based on a condition).",
    ],
    intuition:
      "Maintain [l, r] window state (sum, count, hash of chars). Expand r to include new element; while the window violates the condition, shrink from l. Record the answer whenever the window is valid.",
    complexity: { best: "O(n)", average: "O(n)", worst: "O(n)", space: "O(k)" },
    code: [
      {
        label: "Fixed-size window (max sum of k)",
        code: `def max_sum_k(nums, k):
    window = sum(nums[:k])
    best = window
    for i in range(k, len(nums)):
        window += nums[i] - nums[i - k]  # slide
        best = max(best, window)
    return best`,
      },
      {
        label: "Variable window (longest substring without repeat)",
        code: `def longest_unique(s):
    seen = {}
    l = best = 0
    for r, c in enumerate(s):
        if c in seen and seen[c] >= l:
            l = seen[c] + 1
        seen[c] = r
        best = max(best, r - l + 1)
    return best`,
      },
    ],
    dryRun: {
      array: [2, 1, 5, 1, 3, 2],
      rows: [
        { step: 1, state: "l=0 r=2 window=[2,1,5]", action: "sum=8 → best=8" },
        { step: 2, state: "l=1 r=3 window=[1,5,1]", action: "sum=7" },
        { step: 3, state: "l=2 r=4 window=[5,1,3]", action: "sum=9 → best=9" },
        { step: 4, state: "l=3 r=5 window=[1,3,2]", action: "sum=6" },
      ],
    },
    commonMistakes: [
      "Recomputing the window sum from scratch each iteration (defeats the point).",
      "Forgetting to shrink until the invariant is restored in variable-window problems.",
      "Off-by-one when computing window length: `r - l + 1`, not `r - l`.",
    ],
    edgeCases: [
      "k larger than the array — return 0 / handle gracefully.",
      "All identical characters (variable window) — shrink logic must still terminate.",
    ],
    interviewTips: [
      "State the invariant maintained inside the window.",
      "Point out the O(n) amortized cost: each element enters and leaves the window at most once.",
    ],
    realWorld: [
      "Rate limiting (requests in the last N seconds).",
      "Streaming moving averages / rolling statistics.",
      "Bandwidth throttling / packet inspection.",
    ],
    related: ["two-pointers", "prefix-sum", "monotonic-queue"],
    playground: "sliding-window",
    pythonTricks: [
      "`collections.deque` gives O(1) popleft — great for windows that need explicit contents.",
      "Use a `Counter` to track character frequencies inside a variable window.",
    ],
    whenNot: [
      "Non-contiguous subsets — sliding window relies on contiguity.",
      "You need answers for every window of every size — consider prefix sum instead.",
    ],
    leetcode: [
      {
        id: "643",
        title: "Maximum Average Subarray I",
        difficulty: "Easy",
        url: "https://leetcode.com/problems/maximum-average-subarray-i/",
        minutes: 15,
      },
      {
        id: "1004",
        title: "Max Consecutive Ones III",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/max-consecutive-ones-iii/",
        minutes: 30,
      },
      {
        id: "3",
        title: "Longest Substring Without Repeating Characters",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
        minutes: 30,
      },
      {
        id: "209",
        title: "Minimum Size Subarray Sum",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/minimum-size-subarray-sum/",
        minutes: 25,
      },
      {
        id: "76",
        title: "Minimum Window Substring",
        difficulty: "Hard",
        url: "https://leetcode.com/problems/minimum-window-substring/",
        minutes: 50,
      },
    ],
  },

  // 4
  {
    slug: "prefix-sum",
    number: 4,
    title: "Prefix Sum",
    tagline: "Precompute cumulative sums so any range query becomes O(1).",
    category: "Prefix / Range",
    whyItExists:
      "Without preprocessing, computing sum(nums[l..r]) is O(n). If you'll issue many range queries, one O(n) preprocessing pass makes each query O(1).",
    recognition: [
      "Multiple range-sum / range-count queries.",
      "'Subarray sum equals k' or 'divisible by k' problems.",
      "Any problem asking for `nums[i] - nums[j]` style differences over ranges.",
    ],
    intuition:
      "Build `prefix[i] = nums[0] + ... + nums[i-1]`. Then `sum(l..r) = prefix[r+1] - prefix[l]`. For 'count subarrays with sum k', pair a running prefix with a hash map of prefixes seen so far.",
    complexity: { best: "O(n) build, O(1) query", average: "O(n)", worst: "O(n)", space: "O(n)" },
    code: [
      {
        label: "Range sum query",
        code: `def build_prefix(nums):
    p = [0] * (len(nums) + 1)
    for i, x in enumerate(nums):
        p[i + 1] = p[i] + x
    return p

def range_sum(p, l, r):
    return p[r + 1] - p[l]`,
      },
      {
        label: "Subarray sum equals k (optimal)",
        code: `def subarray_sum(nums, k):
    from collections import defaultdict
    counts = defaultdict(int)
    counts[0] = 1
    total = running = 0
    for x in nums:
        running += x
        total += counts[running - k]
        counts[running] += 1
    return total`,
      },
    ],
    dryRun: {
      array: [3, 1, 4, 1, 5],
      rows: [
        { step: 0, state: "prefix=[0]", action: "init" },
        { step: 1, state: "prefix=[0,3]", action: "+3" },
        { step: 2, state: "prefix=[0,3,4]", action: "+1" },
        { step: 3, state: "prefix=[0,3,4,8]", action: "+4" },
        { step: 4, state: "prefix=[0,3,4,8,9]", action: "+1" },
        { step: 5, state: "prefix=[0,3,4,8,9,14]", action: "+5" },
      ],
    },
    commonMistakes: [
      "Off-by-one on `prefix[r+1] - prefix[l]` (using r instead of r+1).",
      "Forgetting the sentinel `prefix[0] = 0` — every subarray-sum-k solution needs it.",
      "Recomputing prefix on every query instead of once up front.",
    ],
    edgeCases: [
      "Empty array — `prefix = [0]` still works.",
      "Negative numbers — running sum can decrease; the hash-map approach still works.",
    ],
    interviewTips: [
      "Distinguish between 'range sum queries' (build prefix, answer many queries) and 'subarray sum equals k' (streaming with a hash map).",
      "Prefix XOR, prefix product, prefix max apply the same pattern to different operations.",
    ],
    realWorld: [
      "OLAP / analytics: cumulative revenue over any date range.",
      "Image processing: 2D integral images (Viola-Jones face detection).",
      "Rolling KPIs in dashboards.",
    ],
    related: ["hash-map", "sliding-window", "kadane"],
    playground: "prefix-sum",
    pythonTricks: [
      "`itertools.accumulate(nums)` builds the prefix in one line.",
      "For 2D, `prefix[i+1][j+1] = nums[i][j] + prefix[i][j+1] + prefix[i+1][j] - prefix[i][j]`.",
    ],
    whenNot: [
      "Single query — an O(n) scan is simpler and uses O(1) space.",
      "Frequent updates + queries — use a Fenwick tree / segment tree instead.",
    ],
    leetcode: [
      {
        id: "1480",
        title: "Running Sum of 1d Array",
        difficulty: "Easy",
        url: "https://leetcode.com/problems/running-sum-of-1d-array/",
        minutes: 10,
      },
      {
        id: "724",
        title: "Find Pivot Index",
        difficulty: "Easy",
        url: "https://leetcode.com/problems/find-pivot-index/",
        minutes: 15,
      },
      {
        id: "303",
        title: "Range Sum Query - Immutable",
        difficulty: "Easy",
        url: "https://leetcode.com/problems/range-sum-query-immutable/",
        minutes: 15,
      },
      {
        id: "560",
        title: "Subarray Sum Equals K",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/subarray-sum-equals-k/",
        minutes: 30,
      },
      {
        id: "974",
        title: "Subarray Sums Divisible by K",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/subarray-sums-divisible-by-k/",
        minutes: 35,
      },
      {
        id: "304",
        title: "Range Sum Query 2D - Immutable",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/range-sum-query-2d-immutable/",
        minutes: 40,
      },
    ],
  },

  // 5
  {
    slug: "hash-map",
    number: 5,
    title: "Hash Map / Frequency Counting",
    tagline: "Trade O(n) space for O(1) lookup — kills most O(n²) brute forces.",
    category: "Hashing",
    whyItExists:
      "The single most common optimization: any 'have I seen this before?' or 'how many times has this appeared?' question drops from O(n²) to O(n) with a hash map.",
    recognition: [
      "Words like 'unique', 'duplicate', 'frequency', 'anagram', 'group by'.",
      "You need O(1) lookup by key.",
      "You'd otherwise nest two loops to compare each element to the rest.",
    ],
    intuition:
      "Scan once, updating a `dict` or `Counter`. Answer questions from the map afterward, or answer during the scan by checking membership before insertion (classic Two Sum trick).",
    complexity: { best: "O(n)", average: "O(n)", worst: "O(n) expected", space: "O(n)" },
    code: [
      {
        label: "Two Sum (optimal)",
        code: `def two_sum(nums, target):
    seen = {}
    for i, x in enumerate(nums):
        if target - x in seen:
            return [seen[target - x], i]
        seen[x] = i
    return []`,
      },
      {
        label: "Group anagrams",
        code: `def group_anagrams(strs):
    from collections import defaultdict
    groups = defaultdict(list)
    for s in strs:
        key = tuple(sorted(s))     # or a 26-length count tuple
        groups[key].append(s)
    return list(groups.values())`,
      },
      {
        label: "Top K frequent (bucket sort variant)",
        code: `def top_k_frequent(nums, k):
    from collections import Counter
    freq = Counter(nums)
    buckets = [[] for _ in range(len(nums) + 1)]
    for x, c in freq.items():
        buckets[c].append(x)
    result = []
    for bucket in reversed(buckets):
        for x in bucket:
            result.append(x)
            if len(result) == k:
                return result
    return result`,
      },
    ],
    commonMistakes: [
      "Inserting the current value before checking for its complement — matches itself.",
      "Using a list where a set is enough — `x in list` is O(n).",
      "Assuming dict ordering matters pre-Python 3.7 (it's insertion-ordered from 3.7+).",
    ],
    edgeCases: [
      "Duplicates in input — decide whether they count as separate items.",
      "Case-sensitive vs case-insensitive keys — normalize up front.",
    ],
    interviewTips: [
      "State the space cost — some interviewers push for O(1) space alternatives.",
      "Use `collections.Counter` and `defaultdict` — cleaner and less error-prone.",
    ],
    realWorld: [
      "Session tracking by user ID.",
      "Deduplication in ETL pipelines.",
      "Real-time trending topic counts.",
    ],
    related: ["prefix-sum", "linear-traversal", "sorting-based"],
    playground: "hash-map",
    pythonTricks: [
      "`Counter(nums).most_common(k)` returns the top-k pairs directly.",
      "`set(a) & set(b)` gives intersection in O(min(len(a), len(b))).",
    ],
    whenNot: [
      "You need ordered traversal by key — use a sorted structure.",
      "Memory is severely constrained — a bit-set or Bloom filter may fit better.",
    ],
    leetcode: [
      {
        id: "1",
        title: "Two Sum",
        difficulty: "Easy",
        url: "https://leetcode.com/problems/two-sum/",
        minutes: 15,
      },
      {
        id: "169",
        title: "Majority Element",
        difficulty: "Easy",
        url: "https://leetcode.com/problems/majority-element/",
        minutes: 20,
      },
      {
        id: "217",
        title: "Contains Duplicate",
        difficulty: "Easy",
        url: "https://leetcode.com/problems/contains-duplicate/",
        minutes: 10,
      },
      {
        id: "49",
        title: "Group Anagrams",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/group-anagrams/",
        minutes: 25,
      },
      {
        id: "347",
        title: "Top K Frequent Elements",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/top-k-frequent-elements/",
        minutes: 30,
      },
      {
        id: "128",
        title: "Longest Consecutive Sequence",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/longest-consecutive-sequence/",
        minutes: 30,
      },
    ],
  },

  // 6
  {
    slug: "binary-search",
    number: 6,
    title: "Binary Search",
    tagline: "Halve the search space each step — O(log n) on any monotonic condition.",
    category: "Search",
    whyItExists:
      "On a sorted (or monotonic) input, checking every element is wasteful. Binary search rules out half the remaining candidates every comparison.",
    recognition: [
      "Sorted array + you need to find / insert / count.",
      "The problem has an implicit sorted axis: 'minimum X such that predicate(X) is true'.",
      "Rotated sorted arrays, peak-finding, capacity-fitting problems.",
    ],
    intuition:
      "Maintain [lo, hi] and shrink toward the answer. Templates: exact match, lower bound (first index where pred is true), upper bound (first index where pred is false).",
    complexity: { best: "O(1)", average: "O(log n)", worst: "O(log n)", space: "O(1)" },
    code: [
      {
        label: "Exact match",
        code: `def binary_search(nums, target):
    lo, hi = 0, len(nums) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if nums[mid] == target:
            return mid
        if nums[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1`,
      },
      {
        label: "Lower bound (first index where nums[i] >= target)",
        code: `def lower_bound(nums, target):
    lo, hi = 0, len(nums)  # half-open
    while lo < hi:
        mid = (lo + hi) // 2
        if nums[mid] < target:
            lo = mid + 1
        else:
            hi = mid
    return lo`,
      },
      {
        label: "Search in rotated sorted array",
        code: `def search_rotated(nums, target):
    lo, hi = 0, len(nums) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if nums[mid] == target:
            return mid
        if nums[lo] <= nums[mid]:            # left half sorted
            if nums[lo] <= target < nums[mid]:
                hi = mid - 1
            else:
                lo = mid + 1
        else:                                # right half sorted
            if nums[mid] < target <= nums[hi]:
                lo = mid + 1
            else:
                hi = mid - 1
    return -1`,
      },
    ],
    dryRun: {
      array: [1, 3, 5, 7, 9, 11, 13],
      rows: [
        { step: 1, state: "lo=0 hi=6 mid=3(7)", action: "target=11 > 7 → lo=4" },
        { step: 2, state: "lo=4 hi=6 mid=5(11)", action: "found → return 5" },
      ],
    },
    commonMistakes: [
      "Integer overflow: `(lo + hi) // 2` is fine in Python; in Java/C++ use `lo + (hi - lo) // 2`.",
      "Inconsistent boundaries: mixing `hi = len(nums)` and `hi = len(nums) - 1` in the same solution.",
      "Infinite loop: forgetting `lo = mid + 1` when `nums[mid] < target`.",
    ],
    edgeCases: [
      "Empty array — return -1 or 0 depending on template.",
      "All duplicates equal to target — decide whether you want first, last, or any.",
      "Rotated array with pivot at index 0 — behaves like a normal sorted array.",
    ],
    interviewTips: [
      "Pick one template (half-open lo/hi = 0, len(nums)) and stick with it across variants.",
      "State the invariant: 'answer lies in [lo, hi)' before writing the loop.",
    ],
    realWorld: [
      "Database B-tree lookups.",
      "Autocomplete / dictionary word lookup.",
      "Version control git bisect.",
    ],
    related: ["sorting-based", "quick-select"],
    playground: "binary-search",
    pythonTricks: [
      "`bisect.bisect_left(nums, x)` is a battle-tested lower bound.",
      "`bisect.insort(nums, x)` inserts while keeping the list sorted.",
    ],
    whenNot: [
      "Unsorted data and only one query — a linear scan is O(n) and simpler.",
      "You need to answer non-monotonic questions — binary search doesn't apply.",
    ],
    leetcode: [
      {
        id: "704",
        title: "Binary Search",
        difficulty: "Easy",
        url: "https://leetcode.com/problems/binary-search/",
        minutes: 15,
      },
      {
        id: "35",
        title: "Search Insert Position",
        difficulty: "Easy",
        url: "https://leetcode.com/problems/search-insert-position/",
        minutes: 15,
      },
      {
        id: "278",
        title: "First Bad Version",
        difficulty: "Easy",
        url: "https://leetcode.com/problems/first-bad-version/",
        minutes: 20,
      },
      {
        id: "162",
        title: "Find Peak Element",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/find-peak-element/",
        minutes: 25,
      },
      {
        id: "33",
        title: "Search in Rotated Sorted Array",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/search-in-rotated-sorted-array/",
        minutes: 30,
      },
      {
        id: "34",
        title: "Find First and Last Position of Element",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/",
        minutes: 30,
      },
      {
        id: "875",
        title: "Koko Eating Bananas",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/koko-eating-bananas/",
        minutes: 35,
      },
    ],
  },

  // 7
  {
    slug: "sorting-based",
    number: 7,
    title: "Sorting-Based Algorithms",
    tagline: "Sort first, then a linear pass or greedy sweep finishes the job.",
    category: "Sorting",
    whyItExists:
      "Many problems become trivial once elements are ordered. The O(n log n) sort pays for itself when the follow-up pass is O(n).",
    recognition: [
      "'Merge intervals', 'meeting rooms', 'minimum difference'.",
      "You need to make greedy decisions in a specific order.",
      "The relative order of elements does not matter for the final answer.",
    ],
    intuition:
      "Sort by the key that makes the invariant obvious (start time, price, deadline). Then process left-to-right, updating a running state.",
    complexity: {
      best: "O(n log n)",
      average: "O(n log n)",
      worst: "O(n log n)",
      space: "O(n) auxiliary (Timsort)",
    },
    code: [
      {
        label: "Merge intervals",
        code: `def merge(intervals):
    intervals.sort(key=lambda x: x[0])
    out = [intervals[0]]
    for s, e in intervals[1:]:
        if s <= out[-1][1]:
            out[-1][1] = max(out[-1][1], e)
        else:
            out.append([s, e])
    return out`,
      },
      {
        label: "K closest points to origin",
        code: `def k_closest(points, k):
    points.sort(key=lambda p: p[0] * p[0] + p[1] * p[1])
    return points[:k]`,
      },
    ],
    commonMistakes: [
      "Sorting by the wrong key (end time instead of start time for interval merging).",
      "Sorting a list of tuples of mixed types — Python 3 raises TypeError.",
      "Assuming sort is stable in every language (Python's Timsort IS stable).",
    ],
    edgeCases: [
      "Already sorted — Timsort runs in O(n).",
      "All equal elements — stable sort preserves original order.",
    ],
    interviewTips: [
      "Ask if sorting is allowed — some problems forbid it.",
      "For k-smallest / largest, heap-based selection is O(n log k) — often better than a full sort.",
    ],
    realWorld: ["Calendar scheduling.", "Leaderboards.", "Order matching engines."],
    related: ["heap", "quick-select", "merge-intervals"],
    pythonTricks: [
      "`sorted(items, key=..., reverse=True)` — key function beats writing a comparator.",
      "`functools.cmp_to_key` when you truly need a comparator (rare).",
    ],
    whenNot: [
      "You only need one element (min, max, k-th) — heap or quick-select is faster.",
      "Data is a stream — you can't sort what you haven't seen.",
    ],
    leetcode: [
      {
        id: "56",
        title: "Merge Intervals",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/merge-intervals/",
        minutes: 25,
      },
      {
        id: "252",
        title: "Meeting Rooms",
        difficulty: "Easy",
        url: "https://leetcode.com/problems/meeting-rooms/",
        minutes: 15,
      },
      {
        id: "253",
        title: "Meeting Rooms II",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/meeting-rooms-ii/",
        minutes: 30,
      },
      {
        id: "973",
        title: "K Closest Points to Origin",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/k-closest-points-to-origin/",
        minutes: 25,
      },
      {
        id: "1200",
        title: "Minimum Absolute Difference",
        difficulty: "Easy",
        url: "https://leetcode.com/problems/minimum-absolute-difference/",
        minutes: 15,
      },
    ],
  },

  // 8
  {
    slug: "kadane",
    number: 8,
    title: "Kadane's Algorithm",
    tagline: "Maximum-sum contiguous subarray in one pass, O(1) space.",
    category: "DP",
    whyItExists:
      "The brute force for maximum subarray sum is O(n²) or O(n³). Kadane observes that the best subarray ending at i extends the best subarray ending at i-1 — or starts fresh at i.",
    recognition: [
      "'Maximum sum contiguous subarray', with possibly negative numbers.",
      "Any problem where the answer at i depends only on the answer at i-1.",
      "Streaming-friendly maximum aggregate problems.",
    ],
    intuition:
      "`current = max(nums[i], current + nums[i])`. Track the global best as you go. Reset current to nums[i] whenever extending would hurt.",
    complexity: { best: "O(n)", average: "O(n)", worst: "O(n)", space: "O(1)" },
    code: [
      {
        label: "Kadane (standard)",
        code: `def max_subarray(nums):
    current = best = nums[0]
    for x in nums[1:]:
        current = max(x, current + x)
        best = max(best, current)
    return best`,
      },
      {
        label: "With subarray recovery",
        code: `def max_subarray_with_bounds(nums):
    current = best = nums[0]
    s = e = temp_s = 0
    for i in range(1, len(nums)):
        if nums[i] > current + nums[i]:
            current = nums[i]
            temp_s = i
        else:
            current += nums[i]
        if current > best:
            best = current
            s, e = temp_s, i
    return best, s, e`,
      },
    ],
    dryRun: {
      array: [-2, 1, -3, 4, -1, 2, 1, -5, 4],
      rows: [
        { step: 1, state: "cur=-2 best=-2", action: "start" },
        { step: 2, state: "cur=1 best=1", action: "reset at 1" },
        { step: 3, state: "cur=-2 best=1", action: "extend" },
        { step: 4, state: "cur=4 best=4", action: "reset at 4" },
        { step: 5, state: "cur=3 best=4", action: "extend" },
        { step: 6, state: "cur=5 best=5", action: "extend" },
        { step: 7, state: "cur=6 best=6", action: "extend" },
        { step: 8, state: "cur=1 best=6", action: "extend" },
        { step: 9, state: "cur=5 best=6", action: "extend" },
      ],
    },
    commonMistakes: [
      "Initializing `current = 0` fails on all-negative inputs — initialize with `nums[0]`.",
      "Returning `current` instead of `best`.",
      "Forgetting to update `best` inside the loop.",
    ],
    edgeCases: [
      "All negatives — answer is the maximum element.",
      "Length 1 — return nums[0].",
      "Circular subarray (LC 918) — combine Kadane with total - min-subarray.",
    ],
    interviewTips: [
      "Kadane is a 1D DP — you can recite it in 4 lines. Interviewers love the clarity.",
      "Explicitly explain the recurrence: `dp[i] = max(nums[i], dp[i-1] + nums[i])`.",
    ],
    realWorld: [
      "Best trading day range.",
      "Longest positive-signal region in sensor data.",
      "Peak revenue window in daily P&L.",
    ],
    related: ["prefix-sum", "sliding-window", "dp-intro"],
    playground: "kadane",
    pythonTricks: [
      "Two-liner with reduce is possible but harder to read — keep the loop explicit.",
    ],
    whenNot: [
      "You need non-contiguous subsets — that's a different DP (subset sum).",
      "Element multiplication instead of sum — see Maximum Product Subarray (track min & max).",
    ],
    leetcode: [
      {
        id: "53",
        title: "Maximum Subarray",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/maximum-subarray/",
        minutes: 20,
      },
      {
        id: "918",
        title: "Maximum Sum Circular Subarray",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/maximum-sum-circular-subarray/",
        minutes: 30,
      },
      {
        id: "152",
        title: "Maximum Product Subarray",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/maximum-product-subarray/",
        minutes: 30,
      },
      {
        id: "978",
        title: "Longest Turbulent Subarray",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/longest-turbulent-subarray/",
        minutes: 30,
      },
    ],
  },

  // 9
  {
    slug: "greedy",
    number: 9,
    title: "Greedy Algorithms",
    tagline:
      "Make the locally optimal choice at each step — when it provably leads to the global optimum.",
    category: "Greedy",
    whyItExists:
      "When a problem has the greedy-choice property (local optima combine into a global optimum), greedy beats DP: O(n) or O(n log n) vs O(n²) or worse.",
    recognition: [
      "'Minimum number of X to cover Y', 'earliest deadline', 'jump game'.",
      "You can prove (or intuit) that a locally best choice never eliminates a better global option.",
      "Sorting the input often exposes the greedy order.",
    ],
    intuition:
      "Pick a sort order (deadline, reward/weight, end time). Sweep once, taking each item unless it violates a constraint. If the greedy choice is safe (proof or exchange argument), you're done.",
    complexity: { best: "O(n)", average: "O(n log n)", worst: "O(n log n)", space: "O(1)" },
    code: [
      {
        label: "Jump Game",
        code: `def can_jump(nums):
    reach = 0
    for i, jump in enumerate(nums):
        if i > reach:
            return False
        reach = max(reach, i + jump)
    return True`,
      },
      {
        label: "Assign cookies",
        code: `def find_content_children(g, s):
    g.sort(); s.sort()
    i = j = 0
    while i < len(g) and j < len(s):
        if s[j] >= g[i]:
            i += 1
        j += 1
    return i`,
      },
    ],
    commonMistakes: [
      "Applying greedy without proof — many problems (0/1 knapsack) look greedy but require DP.",
      "Sorting by the wrong key (reward vs reward/weight for fractional knapsack).",
    ],
    edgeCases: [
      "Empty input — usually the answer is 0 or trivial.",
      "Ties — decide tie-breaking rule up front (often it doesn't matter, but say so).",
    ],
    interviewTips: [
      "Justify the greedy choice with an exchange argument: 'swapping to the greedy choice never makes the solution worse'.",
      "If proof is shaky, try a small counterexample or fall back to DP.",
    ],
    realWorld: [
      "Interval scheduling (rooms, CPU jobs).",
      "Huffman coding.",
      "Change-making with canonical coin systems.",
    ],
    related: ["sorting-based", "merge-intervals", "dp-intro"],
    whenNot: [
      "The problem needs an exact optimum and greedy has known counterexamples — use DP.",
      "The greedy choice depends on future decisions — use backtracking or DP.",
    ],
    leetcode: [
      {
        id: "55",
        title: "Jump Game",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/jump-game/",
        minutes: 25,
      },
      {
        id: "45",
        title: "Jump Game II",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/jump-game-ii/",
        minutes: 30,
      },
      {
        id: "134",
        title: "Gas Station",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/gas-station/",
        minutes: 30,
      },
      {
        id: "455",
        title: "Assign Cookies",
        difficulty: "Easy",
        url: "https://leetcode.com/problems/assign-cookies/",
        minutes: 15,
      },
      {
        id: "135",
        title: "Candy",
        difficulty: "Hard",
        url: "https://leetcode.com/problems/candy/",
        minutes: 40,
      },
    ],
  },

  // 10
  {
    slug: "divide-and-conquer",
    number: 10,
    title: "Divide and Conquer",
    tagline: "Split the problem, recurse on the halves, and combine the results.",
    category: "Divide & Conquer",
    whyItExists:
      "When a problem's answer can be built from answers on halves, splitting cuts work multiplicatively. Merge Sort, Quick Sort, and Fast Fourier Transform all follow this template.",
    recognition: [
      "The answer on [l, r] can be assembled from answers on [l, mid] and [mid+1, r] plus O(n) merge work.",
      "Sorting, closest-pair, count-of-inversions, or max-subarray style problems.",
    ],
    intuition:
      "Recursion tree: T(n) = 2·T(n/2) + O(merge). If merge is O(n), total is O(n log n) by the Master Theorem.",
    complexity: {
      best: "O(n log n)",
      average: "O(n log n)",
      worst: "O(n log n)",
      space: "O(n) or O(log n) recursion",
    },
    code: [
      {
        label: "Merge sort",
        code: `def merge_sort(nums):
    if len(nums) <= 1:
        return nums
    mid = len(nums) // 2
    left = merge_sort(nums[:mid])
    right = merge_sort(nums[mid:])
    return merge(left, right)

def merge(a, b):
    out, i, j = [], 0, 0
    while i < len(a) and j < len(b):
        if a[i] <= b[j]:
            out.append(a[i]); i += 1
        else:
            out.append(b[j]); j += 1
    out.extend(a[i:]); out.extend(b[j:])
    return out`,
      },
      {
        label: "Max subarray (D&C form)",
        code: `def max_sub(nums, l, r):
    if l == r: return nums[l]
    m = (l + r) // 2
    left = max_sub(nums, l, m)
    right = max_sub(nums, m + 1, r)
    # crossing sum
    lsum, s = float('-inf'), 0
    for i in range(m, l - 1, -1):
        s += nums[i]; lsum = max(lsum, s)
    rsum, s = float('-inf'), 0
    for i in range(m + 1, r + 1):
        s += nums[i]; rsum = max(rsum, s)
    return max(left, right, lsum + rsum)`,
      },
    ],
    commonMistakes: [
      "Off-by-one on the midpoint or recursion bounds.",
      "Allocating fresh lists in every recursion — use indices for in-place variants.",
      "Missing the base case — infinite recursion / RecursionError.",
    ],
    edgeCases: [
      "Length 0 or 1 — return as is.",
      "Deep recursion in Python (>1000) — raise sys.setrecursionlimit or convert to iterative.",
    ],
    interviewTips: [
      "Draw the recursion tree and count levels to derive the complexity.",
      "Mention the Master Theorem when arguing O(n log n).",
    ],
    realWorld: [
      "Distributed sorting (map-reduce style).",
      "Parallel algorithms — halves run on separate cores.",
      "Signal processing (FFT).",
    ],
    related: ["sorting-based", "quick-select"],
    whenNot: [
      "The merge step is expensive relative to the halves — recursion tree cost may dominate.",
      "Data fits in memory and a linear scan solves it — recursion adds constant overhead.",
    ],
    leetcode: [
      {
        id: "912",
        title: "Sort an Array",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/sort-an-array/",
        minutes: 30,
      },
      {
        id: "53",
        title: "Maximum Subarray (D&C variant)",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/maximum-subarray/",
        minutes: 30,
      },
      {
        id: "148",
        title: "Sort List",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/sort-list/",
        minutes: 40,
      },
      {
        id: "23",
        title: "Merge k Sorted Lists",
        difficulty: "Hard",
        url: "https://leetcode.com/problems/merge-k-sorted-lists/",
        minutes: 45,
      },
    ],
  },

  // 11
  {
    slug: "heap",
    number: 11,
    title: "Heap / Priority Queue",
    tagline: "Keep the smallest (or largest) element accessible in O(log n).",
    category: "Heap",
    whyItExists:
      "When you repeatedly need the min or max of a changing collection, sorting on every insert is O(n log n) per query. A binary heap gives O(log n) push/pop and O(1) peek.",
    recognition: [
      "'Kth largest / smallest', 'top K frequent', 'merge K sorted'.",
      "A streaming problem where you keep the best K seen so far.",
      "Scheduling: repeatedly pop the next job by priority.",
    ],
    intuition:
      "Python's `heapq` is a min-heap. For a max-heap, push negatives. For top-K largest, maintain a min-heap of size K — the root is the current threshold.",
    complexity: {
      best: "O(log n) push/pop",
      average: "O(log n)",
      worst: "O(log n)",
      space: "O(n)",
    },
    code: [
      {
        label: "Kth largest (min-heap of size K)",
        code: `import heapq
def kth_largest(nums, k):
    heap = []
    for x in nums:
        heapq.heappush(heap, x)
        if len(heap) > k:
            heapq.heappop(heap)
    return heap[0]`,
      },
      {
        label: "Top K frequent",
        code: `from collections import Counter
import heapq
def top_k_frequent(nums, k):
    freq = Counter(nums)
    return heapq.nlargest(k, freq.keys(), key=freq.get)`,
      },
      {
        label: "Merge K sorted lists",
        code: `import heapq
def merge_k(lists):
    heap = []
    for i, lst in enumerate(lists):
        if lst:
            heapq.heappush(heap, (lst[0], i, 0))
    out = []
    while heap:
        val, i, j = heapq.heappop(heap)
        out.append(val)
        if j + 1 < len(lists[i]):
            heapq.heappush(heap, (lists[i][j + 1], i, j + 1))
    return out`,
      },
    ],
    commonMistakes: [
      "Forgetting Python has no built-in max-heap — negate values.",
      "Comparing non-comparable objects — push tuples with a tiebreaker.",
      "Building a heap of size n when a size-k heap would do — wastes memory and time.",
    ],
    edgeCases: [
      "k = 0 or k > n — handle before touching the heap.",
      "Duplicates — heaps handle them fine; make sure your tiebreaker is deterministic.",
    ],
    interviewTips: [
      "`heapq.heapify(nums)` is O(n) — cheaper than n pushes.",
      "State the size-K trick: 'we cap the heap at K, so each push is O(log K), total O(n log K)'.",
    ],
    realWorld: ["Task schedulers (OS, cron).", "Dijkstra's shortest path.", "Event simulators."],
    related: ["quick-select", "sorting-based", "monotonic-queue"],
    pythonTricks: [
      "`heapq.nlargest` / `nsmallest` — no manual heap for small K.",
      "For a max-heap of tuples, negate only the ordering key.",
    ],
    whenNot: [
      "You need random access by index — heaps aren't indexed containers.",
      "You need to iterate in sorted order once — a plain sort is simpler.",
    ],
    leetcode: [
      {
        id: "215",
        title: "Kth Largest Element in an Array",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/kth-largest-element-in-an-array/",
        minutes: 25,
      },
      {
        id: "347",
        title: "Top K Frequent Elements",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/top-k-frequent-elements/",
        minutes: 25,
      },
      {
        id: "703",
        title: "Kth Largest Element in a Stream",
        difficulty: "Easy",
        url: "https://leetcode.com/problems/kth-largest-element-in-a-stream/",
        minutes: 20,
      },
      {
        id: "23",
        title: "Merge k Sorted Lists",
        difficulty: "Hard",
        url: "https://leetcode.com/problems/merge-k-sorted-lists/",
        minutes: 45,
      },
      {
        id: "295",
        title: "Find Median from Data Stream",
        difficulty: "Hard",
        url: "https://leetcode.com/problems/find-median-from-data-stream/",
        minutes: 45,
      },
    ],
  },

  // 12
  {
    slug: "monotonic-stack",
    number: 12,
    title: "Monotonic Stack",
    tagline: "Stack whose contents stay sorted — solves next-greater / next-smaller in O(n).",
    category: "Stack / Queue",
    whyItExists:
      "For each element, finding the next greater / smaller element with a nested loop is O(n²). A stack that never breaks its monotonic order makes each element pushed and popped at most once — O(n) total.",
    recognition: [
      "'Next greater element', 'previous smaller', 'daily temperatures', 'largest rectangle in histogram'.",
      "For each i, you need the closest index j on one side where a condition holds.",
    ],
    intuition:
      "Iterate; while the stack's top violates the monotonic property with the current element, pop and record the answer for the popped index. Then push current.",
    complexity: { best: "O(n)", average: "O(n)", worst: "O(n)", space: "O(n)" },
    code: [
      {
        label: "Next greater element (decreasing stack)",
        code: `def next_greater(nums):
    result = [-1] * len(nums)
    stack = []          # indices, values decreasing
    for i, x in enumerate(nums):
        while stack and nums[stack[-1]] < x:
            result[stack.pop()] = x
        stack.append(i)
    return result`,
      },
      {
        label: "Largest rectangle in histogram",
        code: `def largest_rectangle(heights):
    stack = []          # increasing indices
    best = 0
    for i, h in enumerate(heights + [0]):
        while stack and heights[stack[-1]] > h:
            top = stack.pop()
            left = stack[-1] if stack else -1
            best = max(best, heights[top] * (i - left - 1))
        stack.append(i)
    return best`,
      },
    ],
    commonMistakes: [
      "Pushing values instead of indices when you need distances.",
      "Confusing increasing vs decreasing stack — pick based on 'what am I looking for'.",
      "Not appending a sentinel at the end (histograms need it to flush the stack).",
    ],
    edgeCases: [
      "Strictly increasing input — stack never pops mid-loop; sentinel flushes it.",
      "All equals — decide whether ties count as 'greater' or not.",
    ],
    interviewTips: [
      "State the amortized argument: each index pushed once, popped once → O(n).",
      "Sketch the stack after each step to spot the invariant.",
    ],
    realWorld: [
      "Stock span problems.",
      "Skyline / silhouette rendering.",
      "Compiler expression parsing.",
    ],
    related: ["monotonic-queue", "two-pointers"],
    playground: "monotonic-stack",
    pythonTricks: ["Use a plain list as a stack — `.append` and `.pop()` are O(1)."],
    whenNot: ["You need the greater element globally, not just the closest — sort or use a heap."],
    leetcode: [
      {
        id: "496",
        title: "Next Greater Element I",
        difficulty: "Easy",
        url: "https://leetcode.com/problems/next-greater-element-i/",
        minutes: 20,
      },
      {
        id: "739",
        title: "Daily Temperatures",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/daily-temperatures/",
        minutes: 25,
      },
      {
        id: "901",
        title: "Online Stock Span",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/online-stock-span/",
        minutes: 30,
      },
      {
        id: "84",
        title: "Largest Rectangle in Histogram",
        difficulty: "Hard",
        url: "https://leetcode.com/problems/largest-rectangle-in-histogram/",
        minutes: 45,
      },
      {
        id: "42",
        title: "Trapping Rain Water",
        difficulty: "Hard",
        url: "https://leetcode.com/problems/trapping-rain-water/",
        minutes: 40,
      },
    ],
  },

  // 13
  {
    slug: "monotonic-queue",
    number: 13,
    title: "Monotonic Queue",
    tagline: "Deque that keeps its contents sorted — sliding window max/min in O(n).",
    category: "Stack / Queue",
    whyItExists:
      "Sliding window max with a heap is O(n log k). A monotonic deque preserves the invariant that the front is always the answer, giving O(n).",
    recognition: [
      "Sliding-window max/min.",
      "You need the extremum of a moving window, not just any window property.",
    ],
    intuition:
      "Keep a deque of indices whose values are strictly decreasing (for max). When you add a new element, pop weaker tails. When the front falls out of the window, pop it. Front is always the window max.",
    complexity: { best: "O(n)", average: "O(n)", worst: "O(n)", space: "O(k)" },
    code: [
      {
        label: "Sliding window maximum",
        code: `from collections import deque
def max_sliding_window(nums, k):
    dq = deque()   # indices, values decreasing
    out = []
    for i, x in enumerate(nums):
        while dq and nums[dq[-1]] < x:
            dq.pop()
        dq.append(i)
        if dq[0] <= i - k:
            dq.popleft()
        if i >= k - 1:
            out.append(nums[dq[0]])
    return out`,
      },
    ],
    commonMistakes: [
      "Storing values instead of indices — you can't detect when to pop the front.",
      "Popping the front unconditionally instead of when it leaves the window.",
    ],
    edgeCases: ["k = 1 — output equals input.", "k = n — one output equal to max(nums)."],
    interviewTips: [
      "Sliding window max is a classic — memorize the deque template.",
      "Same template with `>` instead of `<` gives sliding window min.",
    ],
    realWorld: [
      "Streaming analytics (max value in last N seconds).",
      "Signal processing sliding-window filters.",
    ],
    related: ["sliding-window", "monotonic-stack", "heap"],
    leetcode: [
      {
        id: "239",
        title: "Sliding Window Maximum",
        difficulty: "Hard",
        url: "https://leetcode.com/problems/sliding-window-maximum/",
        minutes: 35,
      },
      {
        id: "862",
        title: "Shortest Subarray with Sum at Least K",
        difficulty: "Hard",
        url: "https://leetcode.com/problems/shortest-subarray-with-sum-at-least-k/",
        minutes: 50,
      },
    ],
  },

  // 14
  {
    slug: "matrix-traversal",
    number: 14,
    title: "Matrix Traversal",
    tagline: "Row, column, diagonal, spiral — templates for every 2D scan pattern.",
    category: "Matrix",
    whyItExists:
      "Grid problems are pervasive (images, maps, game boards). Choosing the right traversal order (spiral, boundary, diagonal) makes many problems fall out.",
    recognition: [
      "The input is a 2D list / grid.",
      "The problem specifies an order: spiral, zigzag, diagonal, boundary.",
      "You need to rotate or transpose in place.",
    ],
    intuition:
      "Row-major uses two nested loops. Spiral maintains four boundaries and shrinks them. Diagonal iterates by (i+j) for anti-diagonal or (i-j) for main diagonal. Rotation = transpose then reverse each row.",
    complexity: { best: "O(m·n)", average: "O(m·n)", worst: "O(m·n)", space: "O(1) if in-place" },
    code: [
      {
        label: "Spiral order",
        code: `def spiral(matrix):
    if not matrix: return []
    out = []
    top, bottom, left, right = 0, len(matrix) - 1, 0, len(matrix[0]) - 1
    while top <= bottom and left <= right:
        for j in range(left, right + 1): out.append(matrix[top][j])
        top += 1
        for i in range(top, bottom + 1): out.append(matrix[i][right])
        right -= 1
        if top <= bottom:
            for j in range(right, left - 1, -1): out.append(matrix[bottom][j])
            bottom -= 1
        if left <= right:
            for i in range(bottom, top - 1, -1): out.append(matrix[i][left])
            left += 1
    return out`,
      },
      {
        label: "Rotate 90° in place",
        code: `def rotate(matrix):
    n = len(matrix)
    for i in range(n):
        for j in range(i + 1, n):
            matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]
    for row in matrix:
        row.reverse()`,
      },
    ],
    commonMistakes: [
      "Off-by-one on spiral boundary updates.",
      "Rotating without checking whether the second half (after transpose) is required.",
      "Confusing rows and columns in non-square grids.",
    ],
    edgeCases: [
      "Single row or column — spiral degenerates; guard the inner passes.",
      "Empty matrix — return early.",
    ],
    interviewTips: [
      "For rotation: 'transpose then reverse each row' is easier to remember than layer-by-layer swaps.",
      "For DFS/BFS grids, define a `dirs = [(-1,0),(1,0),(0,-1),(0,1)]` list.",
    ],
    realWorld: [
      "Image filters and rotations.",
      "Game boards (chess, minesweeper).",
      "Grid pathfinding (maps, warehouses).",
    ],
    related: ["backtracking", "sliding-window"],
    leetcode: [
      {
        id: "54",
        title: "Spiral Matrix",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/spiral-matrix/",
        minutes: 30,
      },
      {
        id: "48",
        title: "Rotate Image",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/rotate-image/",
        minutes: 25,
      },
      {
        id: "73",
        title: "Set Matrix Zeroes",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/set-matrix-zeroes/",
        minutes: 30,
      },
      {
        id: "74",
        title: "Search a 2D Matrix",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/search-a-2d-matrix/",
        minutes: 25,
      },
      {
        id: "36",
        title: "Valid Sudoku",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/valid-sudoku/",
        minutes: 30,
      },
    ],
  },

  // 15
  {
    slug: "backtracking",
    number: 15,
    title: "Backtracking (Array-Based)",
    tagline: "Explore choices depth-first, undoing them on the way back up.",
    category: "Backtracking",
    whyItExists:
      "When you must enumerate all subsets, permutations, or combinations that satisfy constraints, backtracking prunes branches early instead of generating everything.",
    recognition: [
      "'All subsets', 'all permutations', 'combination sum'.",
      "The solution is a sequence of decisions with constraints that let you prune.",
    ],
    intuition:
      "Recursive `dfs(index, path)`: try each choice, recurse, undo the choice. Prune when constraints are violated.",
    complexity: {
      best: "problem-dependent",
      average: "O(n · 2^n) subsets",
      worst: "O(n · n!) permutations",
      space: "O(n) recursion",
    },
    code: [
      {
        label: "Subsets",
        code: `def subsets(nums):
    out, path = [], []
    def dfs(i):
        if i == len(nums):
            out.append(path[:])
            return
        # exclude
        dfs(i + 1)
        # include
        path.append(nums[i])
        dfs(i + 1)
        path.pop()
    dfs(0)
    return out`,
      },
      {
        label: "Permutations",
        code: `def permute(nums):
    out, path = [], []
    used = [False] * len(nums)
    def dfs():
        if len(path) == len(nums):
            out.append(path[:])
            return
        for i, x in enumerate(nums):
            if used[i]: continue
            used[i] = True
            path.append(x)
            dfs()
            path.pop()
            used[i] = False
    dfs()
    return out`,
      },
      {
        label: "Combination sum",
        code: `def combination_sum(candidates, target):
    candidates.sort()
    out, path = [], []
    def dfs(start, remaining):
        if remaining == 0:
            out.append(path[:]); return
        for i in range(start, len(candidates)):
            if candidates[i] > remaining: break   # prune
            path.append(candidates[i])
            dfs(i, remaining - candidates[i])
            path.pop()
    dfs(0, target)
    return out`,
      },
    ],
    commonMistakes: [
      "Appending `path` (a reference) instead of `path[:]` — all results end up mutated.",
      "Forgetting to undo the choice — state leaks across branches.",
      "Missing the prune condition — recursion explodes.",
    ],
    edgeCases: [
      "Empty input — usually returns `[[]]` for subsets and `[]` for permutations.",
      "Duplicates — sort and skip duplicates at each level to avoid duplicate outputs.",
    ],
    interviewTips: [
      "Draw the decision tree for a size-3 input to explain the recursion.",
      "State the branching factor and depth to derive the complexity.",
    ],
    realWorld: [
      "Solvers (Sudoku, N-Queens, crossword).",
      "Constraint satisfaction (scheduling with restrictions).",
      "Test case generation.",
    ],
    related: ["divide-and-conquer", "dp-intro"],
    whenNot: [
      "The state space is astronomical — try DP with memoization or branch-and-bound.",
      "You only need one solution and greedy works — greedy is faster.",
    ],
    leetcode: [
      {
        id: "78",
        title: "Subsets",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/subsets/",
        minutes: 25,
      },
      {
        id: "46",
        title: "Permutations",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/permutations/",
        minutes: 25,
      },
      {
        id: "39",
        title: "Combination Sum",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/combination-sum/",
        minutes: 30,
      },
      {
        id: "77",
        title: "Combinations",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/combinations/",
        minutes: 25,
      },
      {
        id: "51",
        title: "N-Queens",
        difficulty: "Hard",
        url: "https://leetcode.com/problems/n-queens/",
        minutes: 45,
      },
    ],
  },

  // 16
  {
    slug: "bit-manipulation",
    number: 16,
    title: "Bit Manipulation",
    tagline: "XOR tricks and bitmasks — O(1) space where hash maps would take O(n).",
    category: "Bits",
    whyItExists:
      "Bit operations are single CPU instructions. XOR's `a ^ a == 0` property yields elegant O(1)-space solutions to problems that look like they need a set.",
    recognition: [
      "'Single number' — every element appears twice except one.",
      "'Missing number' from 0..n.",
      "Subset enumeration by bitmask.",
    ],
    intuition:
      "XOR is commutative and self-inverse: pairs cancel out. AND / OR / shift compose bitmask subset iteration in constant time per bit.",
    complexity: { best: "O(n)", average: "O(n)", worst: "O(n)", space: "O(1)" },
    code: [
      {
        label: "Single number",
        code: `def single_number(nums):
    result = 0
    for x in nums:
        result ^= x
    return result`,
      },
      {
        label: "Missing number in 0..n",
        code: `def missing_number(nums):
    n = len(nums)
    result = n
    for i, x in enumerate(nums):
        result ^= i ^ x
    return result`,
      },
      {
        label: "Count set bits (Brian Kernighan)",
        code: `def hamming_weight(n):
    count = 0
    while n:
        n &= n - 1
        count += 1
    return count`,
      },
    ],
    commonMistakes: [
      "Confusing `^` (XOR) with `**` (power) — different operators.",
      "Forgetting that XOR of a value with 0 is the value itself.",
      "Signed vs unsigned interpretation in other languages (not a Python issue).",
    ],
    edgeCases: ["Empty list — XOR identity is 0.", "All duplicates — XOR result is 0."],
    interviewTips: [
      "Say the XOR property out loud before coding: 'x ^ x == 0, x ^ 0 == x'.",
      "Bitmask DP subset iteration: `for sub in range(mask); sub = (sub - 1) & mask`.",
    ],
    realWorld: [
      "Permissions (Unix chmod).",
      "Bloom filters and probabilistic data structures.",
      "Hardware register manipulation.",
    ],
    related: ["hash-map", "cyclic-sort"],
    whenNot: [
      "The pattern of duplicates doesn't fit XOR (e.g., 'appear thrice') — need frequency counting or bit-count DP.",
    ],
    leetcode: [
      {
        id: "136",
        title: "Single Number",
        difficulty: "Easy",
        url: "https://leetcode.com/problems/single-number/",
        minutes: 15,
      },
      {
        id: "268",
        title: "Missing Number",
        difficulty: "Easy",
        url: "https://leetcode.com/problems/missing-number/",
        minutes: 15,
      },
      {
        id: "191",
        title: "Number of 1 Bits",
        difficulty: "Easy",
        url: "https://leetcode.com/problems/number-of-1-bits/",
        minutes: 15,
      },
      {
        id: "260",
        title: "Single Number III",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/single-number-iii/",
        minutes: 30,
      },
      {
        id: "78",
        title: "Subsets (bitmask variant)",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/subsets/",
        minutes: 25,
      },
    ],
  },

  // 17
  {
    slug: "merge-intervals",
    number: 17,
    title: "Merge Intervals Pattern",
    tagline: "Sort by start, sweep, merge overlapping ranges.",
    category: "Intervals",
    whyItExists:
      "Scheduling and range problems repeatedly ask 'do these overlap?' Sorting exposes overlap in one pass.",
    recognition: [
      "Input is a list of [start, end] intervals.",
      "'Merge', 'insert', 'meeting rooms', 'free time', 'employee free time'.",
    ],
    intuition:
      "Sort by start. Walk through; if the next interval's start ≤ current end, extend the current end. Otherwise close the current interval and start a new one.",
    complexity: { best: "O(n log n)", average: "O(n log n)", worst: "O(n log n)", space: "O(n)" },
    code: [
      {
        label: "Merge intervals",
        code: `def merge(intervals):
    intervals.sort(key=lambda x: x[0])
    out = []
    for s, e in intervals:
        if out and s <= out[-1][1]:
            out[-1][1] = max(out[-1][1], e)
        else:
            out.append([s, e])
    return out`,
      },
      {
        label: "Insert interval",
        code: `def insert(intervals, new):
    out = []
    i, n = 0, len(intervals)
    while i < n and intervals[i][1] < new[0]:
        out.append(intervals[i]); i += 1
    while i < n and intervals[i][0] <= new[1]:
        new = [min(new[0], intervals[i][0]), max(new[1], intervals[i][1])]
        i += 1
    out.append(new)
    out.extend(intervals[i:])
    return out`,
      },
    ],
    commonMistakes: [
      "Sorting by end time — makes overlap detection harder.",
      "Using strict `<` where inclusive `<=` is required (or vice versa).",
    ],
    edgeCases: [
      "Empty input — return [].",
      "Fully contained interval — the max() update still handles it.",
      "Touching endpoints [1,3][3,5] — decide if they merge (usually yes).",
    ],
    interviewTips: [
      "Sort key + one-pass merge is the template — memorize it.",
      "For 'meeting rooms II', use a heap of end times or a sweep-line diff array.",
    ],
    realWorld: [
      "Calendar conflict detection.",
      "Video timeline / subtitle merging.",
      "IP range consolidation.",
    ],
    related: ["sorting-based", "greedy", "heap"],
    leetcode: [
      {
        id: "56",
        title: "Merge Intervals",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/merge-intervals/",
        minutes: 25,
      },
      {
        id: "57",
        title: "Insert Interval",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/insert-interval/",
        minutes: 30,
      },
      {
        id: "435",
        title: "Non-overlapping Intervals",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/non-overlapping-intervals/",
        minutes: 30,
      },
      {
        id: "253",
        title: "Meeting Rooms II",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/meeting-rooms-ii/",
        minutes: 35,
      },
    ],
  },

  // 18
  {
    slug: "cyclic-sort",
    number: 18,
    title: "Cyclic Sort Pattern",
    tagline: "Numbers in 1..n belong at index (x-1) — swap into place in O(n), O(1) space.",
    category: "Cyclic",
    whyItExists:
      "When values are constrained to 1..n (or 0..n), each value has a natural home index. Swapping in place solves 'missing / duplicate number' problems without a hash set.",
    recognition: [
      "Input contains numbers in the range 1..n (or 0..n).",
      "'Find missing', 'find duplicate', 'first missing positive'.",
      "The interviewer says 'O(1) extra space, do not modify the input' — cyclic sort modifies input; check constraints.",
    ],
    intuition:
      "Iterate. If nums[i] is in range and doesn't equal its home, swap it with the element at its home index. After one pass, mismatched positions reveal missing / duplicate numbers.",
    complexity: { best: "O(n)", average: "O(n)", worst: "O(n)", space: "O(1)" },
    code: [
      {
        label: "Cyclic sort in place",
        code: `def cyclic_sort(nums):
    i = 0
    while i < len(nums):
        home = nums[i] - 1        # for 1..n
        if 0 <= home < len(nums) and nums[i] != nums[home]:
            nums[i], nums[home] = nums[home], nums[i]
        else:
            i += 1
    return nums`,
      },
      {
        label: "First missing positive",
        code: `def first_missing_positive(nums):
    n = len(nums)
    i = 0
    while i < n:
        home = nums[i] - 1
        if 0 <= home < n and nums[i] != nums[home]:
            nums[i], nums[home] = nums[home], nums[i]
        else:
            i += 1
    for i in range(n):
        if nums[i] != i + 1:
            return i + 1
    return n + 1`,
      },
    ],
    commonMistakes: [
      "Advancing `i` inside the swap branch — the swapped-in value hasn't been checked yet.",
      "Off-by-one between 0-indexed and 1-indexed home.",
      "Comparing `i != home` instead of `nums[i] != nums[home]` — infinite loop on duplicates.",
    ],
    edgeCases: [
      "Negative or out-of-range values — skip them.",
      "All correctly placed — one linear pass, no swaps.",
    ],
    interviewTips: [
      "State the total swap count is at most n — that's how you argue O(n).",
      "This pattern is often the intended O(1)-space solution when hash-map is 'too easy'.",
    ],
    realWorld: ["Small-domain data validation (bounded IDs)."],
    related: ["two-pointers", "hash-map", "bit-manipulation"],
    whenNot: [
      "Values are not bounded by n — no natural home index.",
      "You can't modify input — use a set or bit manipulation instead.",
    ],
    leetcode: [
      {
        id: "268",
        title: "Missing Number",
        difficulty: "Easy",
        url: "https://leetcode.com/problems/missing-number/",
        minutes: 15,
      },
      {
        id: "448",
        title: "Find All Numbers Disappeared",
        difficulty: "Easy",
        url: "https://leetcode.com/problems/find-all-numbers-disappeared-in-an-array/",
        minutes: 25,
      },
      {
        id: "287",
        title: "Find the Duplicate Number",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/find-the-duplicate-number/",
        minutes: 30,
      },
      {
        id: "442",
        title: "Find All Duplicates in an Array",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/find-all-duplicates-in-an-array/",
        minutes: 25,
      },
      {
        id: "41",
        title: "First Missing Positive",
        difficulty: "Hard",
        url: "https://leetcode.com/problems/first-missing-positive/",
        minutes: 40,
      },
    ],
  },

  // 19
  {
    slug: "quick-select",
    number: 19,
    title: "Quick Select",
    tagline: "kth smallest / largest in expected O(n) — one partition, no full sort.",
    category: "Selection",
    whyItExists:
      "Sorting to grab the kth element is O(n log n). Quick Select partitions like Quick Sort but recurses on only the side containing k — expected O(n).",
    recognition: [
      "'Kth smallest / largest' when you don't need the rest sorted.",
      "You want expected O(n) instead of the O(n log k) heap approach.",
    ],
    intuition:
      "Pick a pivot, partition into < / == / > pivot. If k falls in the equal region you're done; else recurse into the side that contains k.",
    complexity: {
      best: "O(n)",
      average: "O(n)",
      worst: "O(n²) worst case",
      space: "O(1) with iterative partition, O(log n) recursion",
    },
    code: [
      {
        label: "Quick select (Lomuto partition)",
        code: `import random
def quickselect(nums, k):
    """Return the k-th smallest (1-indexed)."""
    def partition(lo, hi, pivot_idx):
        pivot = nums[pivot_idx]
        nums[pivot_idx], nums[hi] = nums[hi], nums[pivot_idx]
        store = lo
        for i in range(lo, hi):
            if nums[i] < pivot:
                nums[i], nums[store] = nums[store], nums[i]
                store += 1
        nums[store], nums[hi] = nums[hi], nums[store]
        return store

    lo, hi = 0, len(nums) - 1
    target = k - 1
    while lo <= hi:
        p = partition(lo, hi, random.randint(lo, hi))
        if p == target:
            return nums[p]
        if p < target:
            lo = p + 1
        else:
            hi = p - 1
    return -1`,
      },
    ],
    commonMistakes: [
      "Deterministic pivot (always nums[0]) hits O(n²) on sorted inputs — randomize.",
      "Off-by-one between 1-indexed and 0-indexed k.",
      "Recursing on both sides — that's Quick Sort, not Quick Select.",
    ],
    edgeCases: [
      "k = 1 → min; k = n → max. Consider `heapq` for those specifically.",
      "Duplicates equal to pivot — a three-way partition (Dutch flag) avoids O(n²) on all-equal inputs.",
    ],
    interviewTips: [
      "Mention Median-of-Medians for a guaranteed O(n) worst case.",
      "Compare with heap: 'heap is O(n log k) but streaming; quick-select is expected O(n) but requires the full array in memory'.",
    ],
    realWorld: [
      "Percentile / median statistics on large datasets.",
      "Order-statistic queries in databases.",
    ],
    related: ["divide-and-conquer", "heap", "sorting-based"],
    whenNot: [
      "Streaming data (no random access) — use a heap.",
      "You need k smallest AND their order — sort the k-subset after selection.",
    ],
    leetcode: [
      {
        id: "215",
        title: "Kth Largest Element in an Array",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/kth-largest-element-in-an-array/",
        minutes: 30,
      },
      {
        id: "973",
        title: "K Closest Points to Origin",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/k-closest-points-to-origin/",
        minutes: 30,
      },
      {
        id: "347",
        title: "Top K Frequent Elements",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/top-k-frequent-elements/",
        minutes: 30,
      },
    ],
  },

  // 20
  {
    slug: "dp-intro",
    number: 20,
    title: "Dynamic Programming (Intro)",
    tagline: "Solve overlapping subproblems once, remember the answers.",
    category: "DP",
    whyItExists:
      "When a recursion revisits the same subproblem, exponential blow-up is common. DP caches subproblem answers — polynomial time in exchange for polynomial memory.",
    recognition: [
      "'Number of ways', 'minimum / maximum cost', 'can I reach', 'longest / shortest'.",
      "Two properties: optimal substructure AND overlapping subproblems.",
      "Naive recursion times out.",
    ],
    intuition:
      "Define the state precisely (`dp[i]` = answer using items up to index i). Write the recurrence. Choose top-down (memoize) or bottom-up (tabulate). Reduce space when the recurrence uses only the last few states.",
    complexity: {
      best: "problem-dependent",
      average: "O(n) or O(n·k)",
      worst: "same",
      space: "O(n) → O(1) with rolling variables",
    },
    code: [
      {
        label: "Climbing stairs",
        code: `def climb_stairs(n):
    if n <= 2: return n
    a, b = 1, 2
    for _ in range(3, n + 1):
        a, b = b, a + b
    return b`,
      },
      {
        label: "House robber",
        code: `def rob(nums):
    prev, curr = 0, 0
    for x in nums:
        prev, curr = curr, max(curr, prev + x)
    return curr`,
      },
      {
        label: "Fibonacci (memoized)",
        code: `from functools import lru_cache
@lru_cache(maxsize=None)
def fib(n):
    if n < 2: return n
    return fib(n - 1) + fib(n - 2)`,
      },
    ],
    commonMistakes: [
      "Confusing overlapping subproblems (DP) with disjoint subproblems (divide & conquer).",
      "Overly large state space — every extra state parameter multiplies memory.",
      "Forgetting the base case — off-by-one at n=0 or n=1.",
    ],
    edgeCases: [
      "n = 0 or 1 — hard-code the base case.",
      "All-negative inputs — the DP identity may need to be `-inf`, not `0`.",
    ],
    interviewTips: [
      "Verbalize the recurrence before coding: 'dp[i] depends on dp[i-1] and dp[i-2]'.",
      "Show the space-optimization step: keep only the last two variables.",
    ],
    realWorld: [
      "Edit distance in diff tools.",
      "Sequence alignment in bioinformatics.",
      "Resource allocation and knapsack-style planning.",
    ],
    related: ["kadane", "greedy", "divide-and-conquer"],
    pythonTricks: [
      "`functools.lru_cache` turns any pure function into a memoized DP.",
      "Rolling two variables is idiomatic: `prev, curr = curr, curr + prev`.",
    ],
    whenNot: [
      "Greedy provably works — greedy is faster and uses less memory.",
      "The state space is exponential — try meet-in-the-middle or branch-and-bound.",
    ],
    leetcode: [
      {
        id: "70",
        title: "Climbing Stairs",
        difficulty: "Easy",
        url: "https://leetcode.com/problems/climbing-stairs/",
        minutes: 15,
      },
      {
        id: "509",
        title: "Fibonacci Number",
        difficulty: "Easy",
        url: "https://leetcode.com/problems/fibonacci-number/",
        minutes: 10,
      },
      {
        id: "198",
        title: "House Robber",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/house-robber/",
        minutes: 25,
      },
      {
        id: "213",
        title: "House Robber II",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/house-robber-ii/",
        minutes: 30,
      },
      {
        id: "746",
        title: "Min Cost Climbing Stairs",
        difficulty: "Easy",
        url: "https://leetcode.com/problems/min-cost-climbing-stairs/",
        minutes: 20,
      },
      {
        id: "300",
        title: "Longest Increasing Subsequence",
        difficulty: "Medium",
        url: "https://leetcode.com/problems/longest-increasing-subsequence/",
        minutes: 35,
      },
    ],
  },
];

export const ALGO_BY_SLUG: Record<string, Algorithm> = Object.fromEntries(
  ALGORITHMS.map((a) => [a.slug, a]),
);

export function nextAlgorithm(slug: string): Algorithm | null {
  const i = ALGORITHMS.findIndex((a) => a.slug === slug);
  if (i < 0 || i >= ALGORITHMS.length - 1) return null;
  return ALGORITHMS[i + 1];
}
export function prevAlgorithm(slug: string): Algorithm | null {
  const i = ALGORITHMS.findIndex((a) => a.slug === slug);
  if (i <= 0) return null;
  return ALGORITHMS[i - 1];
}
