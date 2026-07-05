import type { Course } from "./types";

export const searchingCourse: Course = {
  slug: "searching",
  title: "Searching",
  tagline: "Finding an element inside a collection — from linear scan to interpolation.",
  category: "algorithm",
  order: 11,
  icon: "Search",
  hidden: true,
  comingSoon: false,
  lessons: [
    {
      slug: "introduction",
      title: "Introduction",
      theory: "Search algorithms locate a target value within a collection of data. Finding items efficiently is a foundational computer science problem. The best choice of algorithm depends on whether the data is sorted, contiguous, or dynamically streamed. We cover 6 major algorithms, comparing their complexity and real-world performance.",
      tip: "For interactive, step-by-step animations, open the Searching Playground at /playgrounds/searching.",
    },
    {
      slug: "linear-search",
      title: "Linear Search",
      theory: "Linear search (also known as sequential search) is the simplest searching algorithm. It starts at the beginning of a collection and inspects each element sequentially until the target element is found or the end of the collection is reached. Since it makes no assumptions about the order of elements, it is the only general-purpose search for unsorted lists.",
      code: `def linear_search(arr, target):
    for i in range(len(arr)):
        if arr[i] == target:
            return i
    return -1`,
      explanation: "Iterate through the array index-by-index. Compare arr[i] with target. If they are equal, return index i. If the loop completes without a match, return -1.",
      complexity: [
        { op: "Best Case", time: "O(1)", space: "O(1)" },
        { op: "Average Case", time: "O(n)", space: "O(1)" },
        { op: "Worst Case", time: "O(n)", space: "O(1)" },
      ],
      mistakes: [
        "Iterating over indices using range(len(arr)) when you only need the element. In Python, use enumerate(arr) if you need both the index and element.",
        "Forgetting to return -1 if the loop finishes without finding the target.",
      ],
    },
    {
      slug: "binary-search",
      title: "Binary Search",
      theory: "Binary search is a highly efficient algorithm for locating items in a sorted collection. It works by repeatedly dividing the search space in half. It compares the target with the middle element. If the target is smaller, it rules out the right half; if larger, it rules out the left half. This reduces the search space logarithmically.",
      code: `def binary_search(arr, target):
    low, high = 0, len(arr) - 1
    while low <= high:
        mid = low + (high - low) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1`,
      explanation: "Keep track of the low and high pointers. Calculate mid. If arr[mid] equals target, return mid. If arr[mid] < target, shift low to mid + 1. Otherwise, shift high to mid - 1.",
      complexity: [
        { op: "Best Case", time: "O(1)", space: "O(1)" },
        { op: "Average Case", time: "O(log n)", space: "O(1)" },
        { op: "Worst Case", time: "O(log n)", space: "O(1)" },
      ],
      mistakes: [
        "Using low < high instead of low <= high. This can cause the algorithm to skip checking the last remaining element.",
        "Incorrect bounds updates like low = mid or high = mid, which leads to infinite loops on adjacent elements.",
        "Potential overflow when calculating mid via (low + high) // 2 in static typed languages (not a problem in Python, but low + (high - low) // 2 is a great practice).",
      ],
      tip: "Binary search can be applied to any monotonic function, not just arrays. This pattern is known as 'binary search on the answer space'.",
    },
    {
      slug: "ternary-search",
      title: "Ternary Search",
      theory: "Ternary search is a decrease-and-conquer algorithm similar to binary search, but it divides the search space into three parts instead of two by using two midpoints: mid1 and mid2. It performs more comparisons per step than binary search, but narrows the search space by two-thirds each iteration. It is mathematically slower for lookup arrays but crucial for optimization problems.",
      code: `def ternary_search(arr, target):
    low, high = 0, len(arr) - 1
    while low <= high:
        mid1 = low + (high - low) // 3
        mid2 = high - (high - low) // 3
        if arr[mid1] == target:
            return mid1
        if arr[mid2] == target:
            return mid2
        if target < arr[mid1]:
            high = mid1 - 1
        elif target > arr[mid2]:
            low = mid2 + 1
        else:
            low = mid1 + 1
            high = mid2 - 1
    return -1`,
      complexity: [
        { op: "Best Case", time: "O(1)", space: "O(1)" },
        { op: "Average Case", time: "O(log3 n)", space: "O(1)" },
        { op: "Worst Case", time: "O(log3 n)", space: "O(1)" },
      ],
      mistakes: [
        "Using ternary search for general array lookups. Although the log base is larger, the extra comparisons (4 vs 2 in binary search) make it slower in practice.",
      ],
      tip: "Ternary search is highly effective for finding the maximum or minimum of a unimodal function (a function which increases then decreases, or vice-versa).",
    },
    {
      slug: "jump-search",
      title: "Jump Search",
      theory: "Jump search is an algorithm for sorted arrays that checks fewer elements by jumping ahead by a fixed step size (usually √n) instead of scanning element-by-element. Once a block is found where the target could exist, a linear search is performed forward inside that block.",
      code: `import math

def jump_search(arr, target):
    n = len(arr)
    step = int(math.sqrt(n))
    prev = 0
    while arr[min(step, n) - 1] < target:
        prev = step
        step += int(math.sqrt(n))
        if prev >= n:
            return -1
    for i in range(prev, min(step, n)):
        if arr[i] == target:
            return i
    return -1`,
      complexity: [
        { op: "Best Case", time: "O(1)", space: "O(1)" },
        { op: "Average Case", time: "O(√n)", space: "O(1)" },
        { op: "Worst Case", time: "O(√n)", space: "O(1)" },
      ],
      mistakes: [
        "Choosing an inappropriate step size. The optimal step size is mathematically proven to be √n.",
        "Out of bounds errors near the end of the array. Ensure you use min(step, n) as the block boundary limit.",
      ],
      tip: "Jump search is very useful when backward jumps are expensive (e.g. sequential tape drives or network streaming buffers) since it only requires one backward jump to start the linear search.",
    },
    {
      slug: "interpolation-search",
      title: "Interpolation Search",
      theory: "Interpolation search is an algorithm for sorted arrays with uniformly distributed values. It mimics how humans search a dictionary: if you search for a word starting with 'Z', you look near the end. It calculates a probe position using the values at the current bounds, giving an average time complexity of O(log log n).",
      code: `def interpolation_search(arr, target):
    low, high = 0, len(arr) - 1
    while low <= high and target >= arr[low] and target <= arr[high]:
        if low == high:
            if arr[low] == target: return low
            return -1
        pos = low + int(((target - arr[low]) * (high - low)) // (arr[high] - arr[low]))
        if arr[pos] == target:
            return pos
        elif arr[pos] < target:
            low = pos + 1
        else:
            high = pos - 1
    return -1`,
      complexity: [
        { op: "Best Case", time: "O(1)", space: "O(1)" },
        { op: "Average Case", time: "O(log log n)", space: "O(1)" },
        { op: "Worst Case", time: "O(n)", space: "O(1)" },
      ],
      mistakes: [
        "Dividing by zero when arr[high] == arr[low]. Handled by adding boundaries checks in the while loop.",
        "Using on non-uniform data: if the data is skewed, performance drops back to linear O(n).",
      ],
      tip: "Use interpolation search for uniformly distributed values, such as auto-incremented database primary keys or timestamps.",
    },
    {
      slug: "exponential-search",
      title: "Exponential Search",
      theory: "Exponential search is designed for sorted, unbounded, or infinite arrays. It finds the range containing the target by doubling the index range (1, 2, 4, 8...) until the element at that index is greater than the target. It then performs binary search within this bounded range.",
      code: `def binary_search_range(arr, low, high, target):
    while low <= high:
        mid = low + (high - low) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1

def exponential_search(arr, target):
    n = len(arr)
    if n == 0: return -1
    if arr[0] == target: return 0
    i = 1
    while i < n and arr[i] <= target:
        i = i * 2
    return binary_search_range(arr, i // 2, min(i, n - 1), target)`,
      complexity: [
        { op: "Best Case", time: "O(1)", space: "O(1)" },
        { op: "Average Case", time: "O(log i)", space: "O(1)" },
        { op: "Worst Case", time: "O(log n)", space: "O(1)" },
      ],
      mistakes: [
        "Forgetting to check the 0-th element or empty arrays, which leads to index error or infinite doubling loop.",
      ],
      tip: "Exponential search is highly efficient when the target is located near the beginning of the list, running in O(log i) time, where i is the target's index.",
    },
    {
      slug: "bisect",
      title: "Python bisect",
      theory: "The Python standard library provides the `bisect` module, which implements binary search on sorted lists. It is highly optimized and written in C under the hood, making it the preferred way to perform binary search in Python.",
      code: `import bisect
a = [1, 3, 4, 7, 9]
idx = bisect.bisect_left(a, 4)   # idx = 2
bisect.insort(a, 5)              # inserts 5 and keeps list sorted`,
    },
    {
      slug: "applications",
      title: "Applications",
      bullets: [
        "Lookup in database sorted tables and indexes (B-trees, B+ trees).",
        "Subroutine in complex geometry/graphics calculations.",
        "Solving optimization and threshold bounds using binary search on answer.",
        "Unimodal optimization using Ternary Search.",
        "Streaming buffer lookups with Exponential Search.",
      ],
    },
    {
      slug: "complexity",
      title: "Complexity",
      complexity: [
        { op: "Linear Search", time: "O(n)", space: "O(1)" },
        { op: "Binary Search", time: "O(log n)", space: "O(1)" },
        { op: "Jump Search", time: "O(√n)", space: "O(1)" },
        { op: "Interpolation Search", time: "O(log log n) avg", space: "O(1)" },
        { op: "Exponential Search", time: "O(log n)", space: "O(1)" },
        { op: "Ternary Search", time: "O(log3 n)", space: "O(1)" },
      ],
    },
    {
      slug: "practice",
      title: "Practice",
      practice: [
        { title: "LC 704 · Binary Search", url: "https://leetcode.com/problems/binary-search/", difficulty: "Easy" },
        { title: "LC 33 · Search in Rotated Sorted Array", url: "https://leetcode.com/problems/search-in-rotated-sorted-array/", difficulty: "Medium" },
        { title: "LC 875 · Koko Eating Bananas", url: "https://leetcode.com/problems/koko-eating-bananas/", difficulty: "Medium" },
      ],
    },
    {
      slug: "quiz",
      title: "Quiz",
      quiz: {
        q: "Which searching algorithm yields O(log log n) average time complexity on uniformly distributed sorted values?",
        choices: ["Binary Search", "Interpolation Search", "Jump Search", "Exponential Search"],
        answer: 1,
        explain: "Interpolation search probes the value dynamically, yielding O(log log n) time on uniform distributions.",
      },
    },
    {
      slug: "references",
      title: "References",
      references: [
        { label: "bisect — Python docs", url: "https://docs.python.org/3/library/bisect.html" },
        { label: "Binary Search — Wikipedia", url: "https://en.wikipedia.org/wiki/Binary_search_algorithm" },
      ],
    },
  ],
};
