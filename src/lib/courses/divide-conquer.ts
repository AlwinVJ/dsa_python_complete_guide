import type { Course } from "./types";

export const divideConquerCourse: Course = {
  slug: "divide-and-conquer",
  title: "Divide & Conquer",
  tagline: "Split, solve, combine — the paradigm behind the world's most scalable algorithms.",
  category: "algorithm",
  order: 4,
  icon: "Split",
  courseLayout: "overview",
  comingSoon: false,
  overview: {
    introduction:
      "Divide & Conquer is a fundamental algorithm design paradigm. It solves a complex problem by recursively breaking it down into two or more subproblems of the same or related type, until these become simple enough to be solved directly (base cases). The solutions to the subproblems are then combined to give a solution to the original problem.",
    whyLearn:
      "Divide & Conquer is the secret behind key algorithmic performance leaps, turning slow O(n²) operations into highly efficient O(n log n) solutions. It forms the backbone of fast sorting, binary searches, geometric closest-pair, and Cooley-Tukey Fast Fourier Transforms (FFT). Mastering this paradigm is essential for interview preparation and designing scalable systems.",
    learningObjectives: [
      "Deconstruct problems into independent, disjoint subproblems.",
      "Understand the mechanics of dividing, conquering recursively, and combining results.",
      "Design efficient recursive algorithms with appropriate base cases.",
      "Trace and evaluate recursion trees for divide & conquer processes.",
      "Distinguish Divide & Conquer from Dynamic Programming and Greedy approaches.",
      "Implement classic algorithms: Binary Search, Merge Sort, Quick Sort, and Maximum Subarray.",
    ],
    realWorldApplications: [
      "Database sorting and querying (Merge Sort and Quick Sort).",
      "Fast Fourier Transform (FFT) for digital signal processing and audio compression.",
      "Strassen's matrix multiplication in computer graphics and machine learning frameworks.",
      "MapReduce programming models for parallel computing on distributed clusters.",
    ],
    advantages: [
      "Significantly reduces time complexity (e.g., O(n²) to O(n log n)).",
      "Naturally adapts to parallel and multi-core processing architectures.",
      "Maintains clean, modular, and mathematically verifiable structures.",
    ],
    limitations: [
      "Incurs O(log n) stack frames overhead, risking stack overflow on extreme recursion depths.",
      "Can consume substantial memory if combining steps require extra space (e.g., Merge Sort O(n)).",
      "Less efficient than Dynamic Programming if the subproblems overlap.",
    ],
    prerequisites: [
      "Basic programming logic and loops in Python.",
      "Understanding of fundamental Recursion (base cases, call stack).",
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
    "Learners seeking to transition from brute-force loops to optimal algorithms.",
    "Candidates preparing for software engineering technical interviews.",
    "Developers wanting to write efficient parallelizable code.",
  ],
  ctaText: "Open Divide & Conquer Playground →",
  ctaRoute: "/playgrounds/divide-conquer",
  lessons: [
    {
      slug: "introduction",
      title: "Introduction to Divide & Conquer",
      tagline: "What Divide & Conquer is and why it powers the world's fastest algorithms.",
      theory:
        "Divide & Conquer (D&C) is a high-level algorithm design pattern. Instead of tackling a massive dataset or problem all at once, D&C systematically breaks the problem down into smaller, identical pieces, solves them individually, and glues the pieces back together to form the final solution.\n\nIt is the foundation of computer science's most famous algorithms, including Merge Sort, Quick Sort, and Fast Fourier Transform.",
      bullets: [
        "Paradigm: A problem-solving strategy, not a single static algorithm.",
        "Disjoint subproblems: Unlike Dynamic Programming, D&C subproblems are independent and do not share state.",
        "Recursive structure: D&C uses recursive calls, calling itself with smaller versions of the input.",
        "Efficiency: D&C often improves running time, for instance, from O(n²) to O(n log n).",
      ],
      code: `# Conceptual Divide & Conquer structure
def solve(problem):
    # 1. Base Case: problem is small enough to solve directly
    if is_base_case(problem):
        return solve_directly(problem)
    
    # 2. Divide: Split the problem into subproblems
    subproblems = divide(problem)
    
    # 3. Conquer: Solve subproblems recursively
    subsolutions = [solve(sub) for sub in subproblems]
    
    # 4. Combine: Merge subsolutions into the final result
    return combine(subsolutions)`,
      tip: "Think of D&C as delegation. If a task is too big, divide it equally among helpers, let them work, and compile their reports.",
    },
    {
      slug: "divide-conquer-combine",
      title: "Divide, Conquer and Combine",
      tagline: "The three pillars of the divide & conquer strategy.",
      theory:
        "Every Divide & Conquer algorithm follows three precise steps in its recursive cycle:\n\n1. **Divide**: Split the problem into a number of smaller subproblems that are identical to the original problem but operate on smaller chunks of data.\n\n2. **Conquer**: Solve the subproblems recursively. If a subproblem is small enough (the base case), solve it directly without recursing further.\n\n3. **Combine**: Merge the solved subproblem results into the final solution for the original problem. This is often where the core work occurs.",
      bullets: [
        "Divide: Usually involves mathematical splits, like dividing arrays at their midpoint index.",
        "Conquer: Leaf nodes in the recursion tree represent the base cases where the division stops.",
        "Combine: Merging results back up the recursion tree to reconstruct the solution.",
      ],
      code: `# Example: Finding sum of array using Divide & Conquer
def recursive_sum(arr):
    # Base Case (Conquer directly)
    if len(arr) == 0:
        return 0
    if len(arr) == 1:
        return arr[0]
        
    # Divide
    mid = len(arr) // 2
    left_half = arr[:mid]
    right_half = arr[mid:]
    
    # Conquer (Recurse)
    left_sum = recursive_sum(left_half)
    right_sum = recursive_sum(right_half)
    
    # Combine
    return left_sum + right_sum

print(recursive_sum([3, 1, 4, 1, 5, 9])) # Output: 23`,
      tip: "The combine phase is the key. In Merge Sort, combining is the merge step. In Quick Sort, the work is done in the divide (partitioning) step, making the combine step a no-op.",
    },
    {
      slug: "when-to-use",
      title: "When to Use Divide & Conquer",
      tagline: "Identifying structural properties that make problems ripe for division.",
      theory:
        "You should not apply Divide & Conquer blindly. For D&C to be the optimal choice, the problem must possess specific structural properties:\n\n1. **Optimal Substructure**: The optimal solution to the large problem can be constructed from the optimal solutions of its subproblems.\n\n2. **Disjoint Subproblems**: The subproblems must be independent. Solving subproblem A should not require information about or recalculation of subproblem B. If they overlap, Dynamic Programming is the correct pattern.",
      bullets: [
        "Disjoint subproblems mean there is zero redundant calculation in the recursion tree.",
        "Excellent for parallel processing: since subproblems are independent, they can run on separate CPU cores simultaneously.",
        "Ideal for logarithmic search spaces (e.g., throwing away half the input at each step).",
      ],
      complexity: [
        { op: "D&C (Merge Sort)", time: "O(n log n)", space: "O(n)" },
        { op: "D&C (Binary Search)", time: "O(log n)", space: "O(log n) stack" },
      ],
      tip: "If a problem requires checking combinations of independent halves (like left half vs right half, or checking crossing borders), it is a classic candidate for Divide & Conquer.",
    },
    {
      slug: "designing-algorithms",
      title: "Designing Divide & Conquer Algorithms",
      tagline: "A step-by-step methodology for building recursive algorithms from scratch.",
      theory:
        "Designing a D&C solution requires defining four key parts:\n\n1. **Subproblem definition**: State what the recursive function accepts and returns.\n2. **Divide strategy**: Choose how to split the input (e.g., split at index `mid`, or partition around a pivot).\n3. **Base case selection**: Pinpoint the smallest input size (usually 0 or 1 elements) that can be solved immediately.\n4. **Combine logic**: Define how to merge subproblem solutions.\n\nLet's apply this design process to compute $x^n$ (calculating powers).",
      bullets: [
        "Naive power computation ($x \\times x \\times \\dots$) is $O(n)$ time.",
        "Using Divide & Conquer: We split the exponent in half ($x^n = x^{n/2} \\times x^{n/2}$).",
        "If $n$ is odd, we multiply by $x$ once more: $x^n = x \\times x^{(n-1)/2} \\times x^{(n-1)/2}$.",
        "This reduces the number of operations to $O(\\log n)$.",
      ],
      code: `def fast_power(x, n):
    # 1. Base Case
    if n == 0:
        return 1
    if n < 0:
        return 1 / fast_power(x, -n)
        
    # 2. Divide & Conquer
    half = fast_power(x, n // 2)
    
    # 3. Combine
    if n % 2 == 0:
        return half * half
    else:
        return x * half * half

print(fast_power(2, 10))  # Output: 1024`,
      mistakes: [
        "Calling fast_power(x, n//2) twice: e.g., 'fast_power(x, n//2) * fast_power(x, n//2)'. This runs in O(n) instead of O(log n) because it doubles the work at each node, destroying the logarithmic advantage.",
      ],
      quiz: {
        q: "Why is computing 'half = fast_power(x, n // 2)' and squaring it better than calling 'fast_power(x, n // 2) * fast_power(x, n // 2)'?",
        choices: [
          "It uses less call-stack memory.",
          "It avoids repeating the same recursive calculation, keeping time complexity at O(log n) rather than O(n).",
          "It prevents floating point errors in division.",
          "Python does not support multiplying two identical recursive calls.",
        ],
        answer: 1,
        explain:
          "Caching the result of the recursive call prevents duplicate evaluations, which would otherwise lead to an exponential number of calls.",
      },
    },
    {
      slug: "vs-brute-force",
      title: "Divide & Conquer vs Brute Force",
      tagline: "Understanding the exponential savings of division over iteration.",
      theory:
        "Brute force solutions generally evaluate every single state or combination one by one (linear scan or nested loops), yielding $O(n)$ or $O(n^2)$ time complexities. Divide & Conquer alters the search space geometry by partitioning inputs.\n\nFor example, finding a peak element in a 1D array iteratively takes $O(n)$ time. With D&C, we inspect the middle element. If it's smaller than its right neighbor, a peak *must* exist on the right side. We throw away the entire left half, reducing search time to $O(\\log n)$.",
      bullets: [
        "Brute force checks every possibility; D&C eliminates halves of possibilities.",
        "D&C converts flat loops into balanced binary trees of execution.",
        "For list problems, D&C turns nested loop $O(n^2)$ comparisons into $O(n \\log n)$ by sorting or splitting.",
      ],
      code: `# Peak Finder: Brute Force O(n) vs Divide & Conquer O(log n)
def find_peak_dc(arr, lo, hi):
    mid = (lo + hi) // 2
    
    # Check if mid is a peak
    left_val = arr[mid - 1] if mid > 0 else float('-inf')
    right_val = arr[mid + 1] if mid < len(arr) - 1 else float('-inf')
    
    if arr[mid] >= left_val and arr[mid] >= right_val:
        return mid # Peak found
        
    # If left neighbor is greater, a peak must exist on the left
    if mid > 0 and arr[mid - 1] > arr[mid]:
        return find_peak_dc(arr, lo, mid - 1)
    # Otherwise, it exists on the right
    return find_peak_dc(arr, mid + 1, hi)`,
    },
    {
      slug: "vs-dynamic-programming",
      title: "Divide & Conquer vs Dynamic Programming",
      tagline: "Disjoint subproblems vs overlapping subproblems.",
      theory:
        "D&C and Dynamic Programming (DP) both solve problems by breaking them into subproblems. However, their subproblem structures are completely different:\n\n- **Divide & Conquer**: Splits the problem into **disjoint** (non-overlapping) subproblems. Each subproblem is solved independently, and results are combined. E.g., Merge Sort splits left and right indices. Left and right sub-arrays have no elements in common.\n\n- **Dynamic Programming**: Solves problems with **overlapping** subproblems. Subproblems share sub-subproblems. DP avoids recalculating these overlapping states by storing results in a table (memoization/tabulation). E.g., Fibonacci numbers $F(n) = F(n-1) + F(n-2)$, where both branches recalculate $F(n-3)$.",
      bullets: [
        "D&C: Wide, shallow recursion trees with zero overlaps.",
        "DP: Dense, overlapping recursion trees that collapse into tables.",
        "D&C combine step is active; DP transition step selects and updates table values.",
      ],
      code: `# Recursion tree comparison
# Divide & Conquer: merge_sort([4, 1, 3, 2])
#               [4, 1, 3, 2]
#              /            \\
#          [4, 1]          [3, 2]       <-- Completely disjoint halves
#          /    \\          /    \\
#        [4]    [1]      [3]    [2]
#
# Dynamic Programming: fib(4)
#                 fib(4)
#                /      \\
#            fib(3)     fib(2)          <-- Overlapping subproblems
#            /    \\     /    \\
#        fib(2)  fib(1)fib(1) fib(0)    <-- fib(2) and fib(1) calculated multiple times`,
    },
    {
      slug: "vs-greedy",
      title: "Divide & Conquer vs Greedy Algorithms",
      tagline: "Global search reduction vs local choices.",
      theory:
        "Divide & Conquer and Greedy are two ways to solve optimization problems:\n\n- **Divide & Conquer**: Performs a global recursive search by solving all subproblems. It guarantees the absolute global optimum because it divides the whole search space and combines all branches.\n\n- **Greedy Algorithms**: Make a single, locally optimal choice at each step, hoping it leads to the global optimum. It never backtracks or solves recursive subproblems on alternative paths. Greedy algorithms are faster ($O(n)$) but only work if the problem has the greedy-choice property.",
      bullets: [
        "D&C is exhaustive over its split branches (e.g., checking both left and right halves).",
        "Greedy is quick, picking the best immediate option without checking alternatives.",
        "D&C guarantees correctness for a broader set of mathematical conditions.",
      ],
    },
    {
      slug: "binary-search",
      title: "Binary Search",
      tagline: "The purest form of divide & conquer with a single branch.",
      theory:
        "Binary Search is a classic example of Divide & Conquer, even though it only recurses into *one* subproblem. Let's trace it:\n\n1. **Divide**: Calculate the middle index `mid` of the sorted array.\n2. **Conquer**: Compare `arr[mid]` with the target. If they are equal, return `mid`. If target is smaller, recurse into the left sub-array. If larger, recurse into the right sub-array.\n3. **Combine**: A no-op (requires no combine calculations, as the index is returned directly).",
      complexity: [
        { op: "Binary Search time", time: "O(log n)", space: "O(1) iterative" },
        { op: "Binary Search space", time: "O(log n)", space: "O(log n) call stack" },
      ],
      code: `def binary_search_dc(arr, target, lo, hi):
    # Base Case
    if lo > hi:
        return -1
        
    mid = (lo + hi) // 2
    if arr[mid] == target:
        return mid
    
    # Conquer (Recurse into ONE side)
    if arr[mid] > target:
        return binary_search_dc(arr, target, lo, mid - 1)
    else:
        return binary_search_dc(arr, target, mid + 1, hi)

# Example
nums = [1, 3, 5, 7, 9, 11, 13]
print(binary_search_dc(nums, 9, 0, len(nums) - 1))  # Output: 4`,
      tip: "Because Binary Search only makes a single recursive call at each level, its recursion tree is a single line, making its time complexity logarithmic: $O(\\log n)$.",
    },
    {
      slug: "merge-sort",
      title: "Merge Sort",
      tagline: "Sorting by splitting, recursing, and merging sorted runs.",
      theory:
        "Merge Sort is the textbook example of Divide & Conquer. It sorts an array by:\n\n1. **Divide**: Find the middle point and split the array into two halves.\n2. **Conquer**: Recursively sort both halves.\n3. **Combine**: Merge the two sorted halves back into a single sorted array.",
      bullets: [
        "Stable sorting: Preserves the relative order of duplicate elements.",
        "Out-of-place: Requires O(n) temporary storage to merge the sub-arrays.",
        "Dividing is O(1) index math; Combining (merging) is O(n) linear scanning.",
      ],
      code: `def merge_sort(arr):
    if len(arr) <= 1:
        return arr
        
    # 1. Divide
    mid = len(arr) // 2
    left = arr[:mid]
    right = arr[mid:]
    
    # 2. Conquer
    left_sorted = merge_sort(left)
    right_sorted = merge_sort(right)
    
    # 3. Combine (Merge)
    return merge(left_sorted, right_sorted)

def merge(left, right):
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i]); i += 1
        else:
            result.append(right[j]); j += 1
    result.extend(left[i:])
    result.extend(right[j:])
    return result

print(merge_sort([38, 27, 43, 3, 9, 82, 10]))`,
      complexity: [{ op: "Merge Sort", time: "O(n log n)", space: "O(n)" }],
    },
    {
      slug: "quick-sort",
      title: "Quick Sort",
      tagline: "In-place partitioning with work done in the divide phase.",
      theory:
        "Quick Sort is the opposite of Merge Sort in terms of work allocation:\n\n- Merge Sort: Divide is trivial ($O(1)$); Combine is where sorting happens ($O(n)$).\n- Quick Sort: Divide is where the sorting happens (partitioning, $O(n)$); Combine is a no-op ($O(1)$) because the array is sorted in-place.\n\n1. **Divide**: Select a pivot element. Partition the array so all elements smaller than the pivot go left, and larger elements go right.\n2. **Conquer**: Recursively sort the left and right partitions.\n3. **Combine**: No action needed (the array is already modified in-place).",
      bullets: [
        "In-place: Requires O(1) auxiliary space (excluding recursive call stack).",
        "Unstable: Swaps elements out of order during partitioning.",
        "Pivot selection: Crucial. A bad pivot (like choosing the minimum or maximum in a sorted array) triggers worst-case O(n²) behavior.",
      ],
      code: `def quicksort(arr, lo, hi):
    if lo < hi:
        # Divide (Partition)
        p_index = partition(arr, lo, hi)
        
        # Conquer
        quicksort(arr, lo, p_index - 1)
        quicksort(arr, p_index + 1, hi)

def partition(arr, lo, hi):
    # Lomuto partition scheme using last element as pivot
    pivot = arr[hi]
    i = lo - 1
    for j in range(lo, hi):
        if arr[j] <= pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    arr[i + 1], arr[hi] = arr[hi], arr[i + 1]
    return i + 1

nums = [38, 27, 43, 3, 9, 82, 10]
quicksort(nums, 0, len(nums) - 1)
print(nums)  # Output: [3, 9, 10, 27, 38, 43, 82]`,
      complexity: [
        { op: "Quick Sort (average)", time: "O(n log n)", space: "O(log n) stack" },
        { op: "Quick Sort (worst)", time: "O(n²)", space: "O(n) stack" },
      ],
    },
    {
      slug: "maximum-subarray",
      title: "Maximum Subarray Problem",
      tagline: "Finding the contiguous subarray with the largest sum.",
      theory:
        "The Maximum Subarray problem (LeetCode 53) asks us to find a contiguous block of values with the maximum sum.\n\nUsing Divide & Conquer:\n1. **Divide**: Split the array in half.\n2. **Conquer**: The maximum subarray must lie entirely in the left half, entirely in the right half, or cross the midpoint.\n3. **Combine**: Find the maximum subarray crossing the midpoint (which takes $O(n)$ time), then return the maximum of the three options.",
      bullets: [
        "Left max and right max are solved recursively.",
        "Crossing max is solved by scanning left and right from the midpoint index.",
        "Total time complexity is O(n log n) because the combine step (crossing scan) is O(n).",
      ],
      code: `def max_crossing_sum(arr, lo, mid, hi):
    # Left part crossing mid
    left_sum = float('-inf')
    curr = 0
    for i in range(mid, lo - 1, -1):
        curr += arr[i]
        left_sum = max(left_sum, curr)
        
    # Right part crossing mid
    right_sum = float('-inf')
    curr = 0
    for j in range(mid + 1, hi + 1):
        curr += arr[j]
        right_sum = max(right_sum, curr)
        
    return left_sum + right_sum

def max_subarray_dc(arr, lo, hi):
    if lo == hi:
        return arr[lo]
        
    mid = (lo + hi) // 2
    
    # Solve recursively (Conquer)
    left_max = max_subarray_dc(arr, lo, mid)
    right_max = max_subarray_dc(arr, mid + 1, hi)
    
    # Solve crossing part (Combine helper)
    cross_max = max_crossing_sum(arr, lo, mid, hi)
    
    return max(left_max, right_max, cross_max)

nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]
print(max_subarray_dc(nums, 0, len(nums) - 1))  # Output: 6 (subarray [4, -1, 2, 1])`,
      complexity: [{ op: "Maximum Subarray (D&C)", time: "O(n log n)", space: "O(log n) stack" }],
    },
    {
      slug: "closest-pair-points",
      title: "Closest Pair of Points",
      tagline: "Finding the two closest coordinates on a 2D plane in O(n log n).",
      theory:
        "Finding the closest pair of points among $n$ coordinates in 2D by brute force compares all pairs, which takes $O(n^2)$ time. Divide & Conquer reduces this to $O(n \\log n)$:\n\n1. **Divide**: Sort the points by x-coordinates, and divide them into left and right halves using a vertical line.\n2. **Conquer**: Recursively find the closest distance in the left half ($\\delta_L$) and right half ($\\delta_R$). Let $\\delta = \\min(\\delta_L, \\delta_R)$.\n3. **Combine**: Find if there is any pair crossing the division line with a distance smaller than $\\delta$. We only need to check points within a vertical strip of width $2\\delta$ around the dividing line. Crucially, sorting by y-coordinates allows us to check only 7 neighboring points for each point in the strip, keeping the combine phase linear: $O(n)$.",
      bullets: [
        "Base Case: If there are 2 or 3 points, solve by brute force.",
        "Dividing line: Median x-coordinate of sorted points.",
        "Strip scan: Constant lookahead (7 points) due to geometry constraints.",
      ],
      code: `# Conceptual overview of Closest Pair combine step
# delta = min(closest_left, closest_right)
# strip = [p for p in points if abs(p.x - mid_x) < delta]
# sort_by_y(strip)
# for i in range(len(strip)):
#     for j in range(i + 1, min(i + 8, len(strip))):
#         delta = min(delta, dist(strip[i], strip[j]))`,
    },
    {
      slug: "strassen-multiplication",
      title: "Strassen Matrix Multiplication",
      tagline: "How Strassen reduced matrix multiplication from O(n³) to O(n^2.807).",
      theory:
        "Multiplying two $n \\times n$ matrices naive-style performs dot products, taking $O(n^3)$ operations. A standard block divide-and-conquer partition splits matrices into 4 sub-blocks of size $n/2 \\times n/2$, which requires 8 matrix multiplications: $T(n) = 8T(n/2) + O(n^2)$, yielding $O(n^3)$ by the Master Theorem.\n\nVolker Strassen discovered a mathematical trick in 1969. By defining 7 strategic equations ($P_1$ to $P_7$) using additions and subtractions, he computed the product with only **7** recursive multiplications instead of 8. The recurrence becomes:\n\n$$T(n) = 7T(n/2) + O(n^2)$$\n\nThis solves to $O(n^{\\log_2 7}) \\approx O(n^{2.807})$ operations. For large matrices, this represents a significant performance improvement.",
      bullets: [
        "Naive D&C: 8 recursive multiplications $\\implies O(n^3)$.",
        "Strassen: 7 recursive multiplications $\\implies O(n^{2.807})$.",
        "Trade-off: Strassen performs more matrix additions ($O(n^2)$) and requires extra memory, making it practical only for large matrices ($n > 128$).",
      ],
    },
    {
      slug: "recurrence-relations",
      title: "Recurrence Relations in Divide & Conquer",
      tagline: "Expressing recursive runtimes mathematically.",
      theory:
        "The time complexity of a recursive algorithm cannot be measured with a simple loop counter. Instead, we write a **recurrence relation** — an equation that defines the running time of a function on input size $n$ in terms of its execution on smaller inputs.\n\nA divide-and-conquer recurrence typically takes the form:\n\n$$T(n) = a \\cdot T(n / b) + f(n)$$\n\nWhere:\n- $T(n)$ is the total time to solve a problem of size $n$.\n- $a$ is the number of recursive subproblems generated.\n- $n / b$ is the size of each subproblem (meaning the input is divided by $b$).\n- $f(n)$ is the work done outside the recursive calls (the divide and combine steps).",
      bullets: [
        "Binary Search recurrence: $T(n) = T(n/2) + O(1)$. One subproblem of half-size, plus constant-time comparison.",
        "Merge Sort recurrence: $T(n) = 2T(n/2) + O(n)$. Two subproblems of half-size, plus linear-time merge.",
        "Advanced solving: Recurrence equations are solved using recursion trees or the **Master Theorem**, which is covered in detail in the [Complexity Analysis](file:///d:/Projects/DSA/dsa_python_complete_guide/src/routes/complexity.time.tsx) section.",
      ],
      code: `# Runtimes derived from recurrences:
# T(n) = T(n/2) + O(1)    =>  O(log n)      (Binary Search)
# T(n) = 2T(n/2) + O(1)   =>  O(n)          (Binary Tree Traversal)
# T(n) = 2T(n/2) + O(n)   =>  O(n log n)    (Merge Sort)
# T(n) = 8T(n/2) + O(n^2)  =>  O(n^3)        (Naive Matrix Multiplication)
# T(n) = 7T(n/2) + O(n^2)  =>  O(n^2.807)    (Strassen Multiplication)`,
      quiz: {
        q: "What does the '2' represent in the Merge Sort recurrence T(n) = 2T(n/2) + O(n)?",
        choices: [
          "The division of the array in half.",
          "The number of recursive subproblems (left and right sorted halves).",
          "The number of merge operations.",
          "The space complexity factor.",
        ],
        answer: 1,
        explain:
          "In the recurrence formula T(n) = a*T(n/b) + f(n), 'a' represents the number of recursive calls made at each step.",
      },
    },
    {
      slug: "common-mistakes",
      title: "Common Mistakes",
      tagline: "Pitfalls to avoid when implementing divide & conquer.",
      theory:
        "Implementing Divide & Conquer algorithms involves writing complex recursion. Keep an eye out for these four common bugs:",
      bullets: [
        "**Infinite Recursion**: Occurs if your base case is missing or your recursive call does not shrink the input. Double-check that indices strictly narrow down on every path.",
        "**Off-by-One Indices**: Index math, especially calculating `mid = (lo + hi) // 2`, frequently leads to infinite loops or index errors. Watch out for dividing `lo + hi` versus `hi - lo` offsets.",
        "**Slice Copying Overhead**: Writing `merge_sort(arr[:mid])` copies the array. Each slice is an $O(n)$ operation. Doing this at every recursion level raises the actual time complexity of Merge Sort, and consumes $O(n \\log n)$ memory. To sort in-place or optimize, pass index pointers `lo` and `hi` instead.",
        "**Overlapping Subproblems**: Do not use D&C if the subproblems overlap (e.g., calculating Fibonacci recursively). It recomputes states, degrading the runtime from linear to exponential.",
      ],
      code: `# INEFICIENT (Slicing creates arrays at each frame):
def merge_sort_naive(arr):
    if len(arr) <= 1: return arr
    mid = len(arr) // 2
    left = merge_sort_naive(arr[:mid])   # O(n) slice creation
    right = merge_sort_naive(arr[mid:])  # O(n) slice creation
    return merge(left, right)

# EFFICIENT (Use index pointers to avoid copies):
def merge_sort_opt(arr, lo, hi):
    if lo >= hi: return
    mid = (lo + hi) // 2
    merge_sort_opt(arr, lo, mid)
    merge_sort_opt(arr, mid + 1, hi)
    merge_inplace(arr, lo, mid, hi)`,
      tip: "When writing index bounds, verify with a small array of 2 elements. Trace what happens to `lo`, `mid`, and `hi` to ensure the subproblems always shrink.",
    },
    {
      slug: "summary-revision",
      title: "Summary & Revision",
      tagline: "A complete review of the Divide & Conquer module.",
      theory:
        "Let's review the core concepts of the Divide & Conquer paradigm to consolidate your understanding:\n\n- **Definition**: D&C divides a problem into disjoint subproblems, solves them recursively, and combines the subsolutions.\n- **Pillars**: Divide, Conquer, Combine.\n- **Subproblems**: Must be disjoint (non-overlapping). If subproblems overlap, Dynamic Programming is the correct pattern. If you make immediate, local, non-recursive choices, the pattern is Greedy.\n- **Key Algorithms**: Binary Search ($O(\\log n)$), Merge Sort ($O(n \\log n)$), Quick Sort ($O(n \\log n)$ average), Maximum Subarray ($O(n \\log n)$), and Closest Pair of Points ($O(n \\log n)$).",
      bullets: [
        "Binary Search is a D&C algorithm that discards half of the remaining elements at each step.",
        "Merge Sort does the sorting work in the combine phase (merging).",
        "Quick Sort does the sorting work in the divide phase (partitioning around a pivot).",
        "Recurrences take the form T(n) = a*T(n/b) + f(n) and are solved using recursion trees.",
      ],
      references: [
        {
          label: "CLRS Chapter 4 — Divide-and-Conquer",
          url: "https://mitpress.mit.edu/9780262046305/",
        },
      ],
    },
    {
      slug: "interview-prep",
      title: "Interview Preparation & Practice",
      tagline: "Master Divide & Conquer interview questions, pattern matching, and practice.",
      theory:
        "In coding interviews, you can recognize a Divide & Conquer problem by searching for these indicators:\n\n1. **The problem can be split down the middle**: Can you divide the array, grid, or coordinate plane into two equal halves?\n2. **Disjoint subproblem solutions**: Can you solve the left half and right half independently?\n3. **Combine phase is efficient**: Can you merge the results in linear time ($O(n)$) or constant time ($O(1)$)?\n\nUse this decision tree to identify D&C candidates:\n\n- **Are subproblems independent?**\n  - *No* $\\rightarrow$ Use Dynamic Programming (e.g., Knapsack, Edit Distance).\n  - *Yes* $\\rightarrow$ Can we solve with local choices without recursion? \n    - *Yes* $\\rightarrow$ Use Greedy (e.g., Interval Scheduling).\n    - *No* $\\rightarrow$ Use Divide & Conquer (e.g., Merge Sort, Closest Pair).",
      bullets: [
        "State your base cases clearly to the interviewer before coding.",
        "For array problems, use index pointers (lo, hi) instead of slicing to show you care about space optimization.",
        "Explain that D&C is highly parallelizable, which is a major advantage in real-world large-scale systems.",
      ],
      quiz: {
        q: "Which algorithm design pattern is best suited for finding the shortest path in a graph where decisions at each step are made locally and cannot be undone?",
        choices: [
          "Divide & Conquer",
          "Dynamic Programming",
          "Greedy Algorithm",
          "Brute Force Search",
        ],
        answer: 2,
        explain:
          "Greedy algorithms make localized, immediate optimal choices at each stage (like Dijkstra's algorithm for shortest paths) without backtracking.",
      },
      practice: [
        {
          title: "LC 704 · Binary Search",
          url: "https://leetcode.com/problems/binary-search/",
          difficulty: "Easy",
        },
        {
          title: "LC 912 · Sort an Array (Merge/Quick Sort)",
          url: "https://leetcode.com/problems/sort-an-array/",
          difficulty: "Medium",
        },
        {
          title: "LC 53 · Maximum Subarray",
          url: "https://leetcode.com/problems/maximum-subarray/",
          difficulty: "Medium",
        },
        {
          title: "LC 169 · Majority Element",
          url: "https://leetcode.com/problems/majority-element/",
          difficulty: "Easy",
        },
        {
          title: "LC 240 · Search a 2D Matrix II",
          url: "https://leetcode.com/problems/search-a-2d-matrix-ii/",
          difficulty: "Medium",
        },
        {
          title: "LC 4 · Median of Two Sorted Arrays",
          url: "https://leetcode.com/problems/median-of-two-sorted-arrays/",
          difficulty: "Hard",
        },
      ],
    },
  ],
};
