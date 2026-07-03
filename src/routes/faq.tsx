import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHeader, Callout } from "@/components/Callout";
import { ComplexityBadgeCell } from "@/components/ComplexityTable";
import { CodeBlock } from "@/components/CodeBlock";
import { ListVisualizer, makeItems } from "@/components/ListVisualizer";
import { PrevNext } from "@/components/PrevNext";
import { ChevronDown, Play, RotateCcw, Search, StepForward } from "lucide-react";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "Python List FAQ & Interview Questions" },
      { name: "description", content: "Concepts, operations, and coding-interview classics for Python lists — with visual step-by-step solutions and complexity analysis." },
    ],
  }),
  component: Page,
});

type Category = "Concepts" | "Operations" | "Easy" | "Medium" | "Advanced";

type FAQ = {
  q: string;
  category: Category;
  a: string;
  code?: string;
  time?: string;
  space?: string;
  mistakes?: string;
  edge?: string;
  didYouKnow?: string;
};

const faqs: FAQ[] = [
  // ── Concepts ──
  {
    category: "Concepts",
    q: "What is the difference between a Python List and a traditional Array?",
    a: "A Python list is a dynamic array of pointers to Python objects. A traditional (C-style) array is a fixed-size block of contiguous, same-typed values. Lists trade a bit of memory and cache locality for flexibility.",
    code: `arr = [10, 20, 30]           # each slot holds a pointer\narr.append("hello")          # mixed types are fine\narr[0] = [1, 2]              # any object`,
    didYouKnow: "Use array.array or numpy.ndarray when you need packed, homogeneous, cache-friendly storage.",
  },
  {
    category: "Concepts",
    q: "Why are Python Lists dynamic?",
    a: "The interpreter reserves extra capacity beyond the current length. When capacity is exceeded, Python allocates a bigger block (~1.125× growth) and copies the pointers — you never manually resize.",
    time: "append is amortized O(1)",
  },
  {
    category: "Concepts",
    q: "How are Python Lists stored internally?",
    a: "As a PyListObject: a struct with a length, an allocated capacity, and a pointer to a contiguous C array of PyObject* pointers. The values themselves live elsewhere on the heap.",
    didYouKnow: "That's why lists can hold mixed types: every slot is the same size — a pointer.",
  },
  {
    category: "Concepts",
    q: "What is contiguous memory?",
    a: "Memory laid out in one unbroken block. Contiguous storage lets the CPU compute an element's address as base + index * size — that's why index access is O(1).",
  },
  {
    category: "Concepts",
    q: "Why is insertion at the beginning slower than append()?",
    a: "insert(0, x) has to shift every existing element one slot to the right. append() just writes at the end.",
    code: `a.insert(0, x)   # O(n)  — shift everything\na.append(x)      # O(1)* — amortized`,
    time: "insert(0): O(n) — append: O(1) amortized",
    mistakes: "Building a list by inserting at index 0 in a loop is O(n²). Append and reverse at the end instead.",
  },
  {
    category: "Concepts",
    q: "What happens internally when append() runs out of space?",
    a: "CPython allocates a new, larger backing array (using an over-allocation formula), copies existing pointers over, frees the old block, and only then stores the new pointer.",
    time: "Amortized O(1)",
    didYouKnow: "The growth pattern is roughly: 0, 4, 8, 16, 25, 35, 46, 58, 72, 88…",
  },
  {
    category: "Concepts",
    q: "What are mutable and immutable objects?",
    a: "Mutable objects can change in place (list, dict, set). Immutable objects cannot (int, float, str, tuple, frozenset). Reassignment binds the name to a new object — that's not mutation.",
    mistakes: "Using a mutable default argument (def f(x, cache=[])) shares state across calls.",
  },
  {
    category: "Concepts",
    q: "What is the difference between shallow copy and deep copy?",
    a: "A shallow copy creates a new list containing the same references. A deep copy recursively copies every nested object.",
    code: `import copy\nshallow = a.copy()          # or list(a) or a[:]\ndeep    = copy.deepcopy(a)`,
    time: "shallow: O(n) — deep: O(total nested elements)",
    mistakes: "Modifying nested lists in a shallow copy also modifies the original.",
  },
  {
    category: "Concepts",
    q: "What are homogeneous and heterogeneous collections?",
    a: "Homogeneous: every element is the same type (e.g. numpy arrays). Heterogeneous: mixed types (Python lists). Homogeneous storage is faster and more memory-efficient.",
  },
  {
    category: "Concepts",
    q: "When should I use a tuple instead of a list?",
    a: "Use a tuple when the sequence is fixed and won't change: coordinates, RGB colors, dict keys, function return values with multiple items. Tuples are also slightly faster to create.",
  },
  {
    category: "Concepts",
    q: "Why is list lookup (x in lst) O(n)?",
    a: "Python has no hash structure behind a list — it has to compare each element until a match is found. Use a set or dict for O(1) membership.",
    time: "O(n)",
  },
  {
    category: "Concepts",
    q: "Why is append() usually O(1)?",
    a: "Because of over-allocation. Most appends just bump an index and store a pointer; only the occasional reallocation costs O(n). Averaged over many appends, the cost is O(1).",
  },

  // ── Operations ──
  {
    category: "Operations",
    q: "How do I access, update, and slice elements?",
    a: "Use zero-based indices, negative indices from the end, and start:stop:step slicing.",
    code: `a = [10, 20, 30, 40, 50]\na[0]        # 10\na[-1]       # 50\na[1:4]      # [20, 30, 40]\na[::2]      # [10, 30, 50]\na[::-1]     # reversed`,
    time: "Access: O(1) — Slice: O(k)",
  },
  {
    category: "Operations",
    q: "How do I insert, delete, and search elements?",
    a: "append/insert/extend to add; pop/remove/del/clear to remove; in/index/count to search.",
    code: `a.append(99)\na.insert(1, 5)\na.extend([7, 8])\n\na.pop()          # last\na.pop(0)         # by index\na.remove(5)      # by value\ndel a[0]\n\n5 in a\na.index(5)\na.count(5)`,
    time: "append/pop: O(1) — insert/pop(i)/remove/in/index: O(n)",
  },
  {
    category: "Operations",
    q: "Traversing a list — the four idioms",
    a: "Prefer for x in lst. Use enumerate when you need indices; use zip to walk two lists together.",
    code: `for x in a: ...\nfor i in range(len(a)): a[i]\nfor i, x in enumerate(a): ...\nfor x, y in zip(a, b): ...`,
    time: "O(n)",
  },
  {
    category: "Operations",
    q: "Reversing a list",
    a: "In-place with .reverse(), a shallow copy with [::-1], or an iterator with reversed().",
    code: `a.reverse()          # in place\nb = a[::-1]          # new list\nfor x in reversed(a): ...`,
    time: "O(n)",
    space: "In place: O(1) — Slice: O(n)",
  },
  {
    category: "Operations",
    q: "Copying a list (three levels)",
    a: "list(a), a.copy(), a[:] all give a shallow copy. copy.deepcopy(a) recursively clones nested objects.",
    code: `shallow = a[:]\ndeep    = copy.deepcopy(a)`,
  },
  {
    category: "Operations",
    q: "Sorting: sort() vs sorted()",
    a: ".sort() mutates in place and returns None. sorted() returns a new list and leaves the original alone.",
    code: `a.sort(reverse=True)\na.sort(key=len)\nb = sorted(a)`,
    time: "O(n log n)",
    space: "O(n) (TimSort merge buffers)",
  },
  {
    category: "Operations",
    q: "Merging two lists",
    a: "Use extend for in-place merge, + for a new list, and heapq.merge for two already-sorted sequences.",
    code: `a.extend(b)\nc = a + b\nimport heapq\nlist(heapq.merge(sorted_a, sorted_b))`,
  },
  {
    category: "Operations",
    q: "Flattening a nested list",
    a: "Comprehension for one level; itertools.chain for cleaner code; recursion for arbitrary depth.",
    code: `flat = [x for row in matrix for x in row]\nfrom itertools import chain\nlist(chain.from_iterable(matrix))`,
    time: "O(total elements)",
  },
  {
    category: "Operations",
    q: "Removing duplicates",
    a: "Set for fastest (order not preserved). dict.fromkeys keeps insertion order.",
    code: `unique = list(set(a))\nunique = list(dict.fromkeys(a))   # order preserved`,
    time: "O(n)",
  },

  // ── Easy problems ──
  {
    category: "Easy",
    q: "Reverse a list",
    a: "Two-pointer swap in place, or slice for a copy.",
    code: `def reverse(a):\n    i, j = 0, len(a) - 1\n    while i < j:\n        a[i], a[j] = a[j], a[i]\n        i, j = i + 1, j - 1\n    return a`,
    time: "O(n)",
    space: "O(1)",
    edge: "Empty list and length-1 list: nothing to do.",
  },
  {
    category: "Easy",
    q: "Find the second largest element",
    a: "Track two variables in one pass — no sort needed.",
    code: `def second_largest(a):\n    first = second = float('-inf')\n    for x in a:\n        if x > first:\n            second, first = first, x\n        elif x > second and x != first:\n            second = x\n    return second`,
    time: "O(n)",
    space: "O(1)",
    mistakes: "Sorting is O(n log n) — overkill. Also handle ties correctly with x != first.",
  },
  {
    category: "Easy",
    q: "Find the third largest without sorting",
    a: "Extend the two-pointer trick to three variables.",
    code: `def third_largest(a):\n    f = s = t = float('-inf')\n    for x in a:\n        if x > f: t, s, f = s, f, x\n        elif s < x < f: t, s = s, x\n        elif t < x < s: t = x\n    return t`,
    time: "O(n)",
    space: "O(1)",
  },
  {
    category: "Easy",
    q: "Find the kth largest element",
    a: "Min-heap of size k. Push, and pop when it exceeds k. The root is the answer.",
    code: `import heapq\ndef kth_largest(a, k):\n    h = []\n    for x in a:\n        heapq.heappush(h, x)\n        if len(h) > k:\n            heapq.heappop(h)\n    return h[0]`,
    time: "O(n log k)",
    space: "O(k)",
  },
  {
    category: "Easy",
    q: "Frequency of each element",
    a: "Use collections.Counter.",
    code: `from collections import Counter\nCounter(a)   # {value: count}`,
    time: "O(n)",
    space: "O(distinct values)",
  },
  {
    category: "Easy",
    q: "Average of even numbers",
    a: "Filter + sum + len in one pass.",
    code: `def avg_even(a):\n    total, n = 0, 0\n    for x in a:\n        if x % 2 == 0:\n            total += x\n            n += 1\n    return total / n if n else 0`,
    time: "O(n)",
    space: "O(1)",
    edge: "Return 0 (or None) when there are no evens.",
  },
  {
    category: "Easy",
    q: "Common elements between two arrays",
    a: "Convert one to a set for O(1) lookups.",
    code: `def common(a, b):\n    sb = set(b)\n    return [x for x in a if x in sb]`,
    time: "O(n + m)",
    space: "O(m)",
  },
  {
    category: "Easy",
    q: "Maximum and minimum in one pass",
    a: "Track both variables simultaneously.",
    code: `def min_max(a):\n    lo = hi = a[0]\n    for x in a[1:]:\n        if x < lo: lo = x\n        elif x > hi: hi = x\n    return lo, hi`,
    time: "O(n)",
    space: "O(1)",
  },
  {
    category: "Easy",
    q: "Remove duplicate elements (preserve order)",
    a: "Walk the list and keep a seen-set.",
    code: `def dedup(a):\n    seen, out = set(), []\n    for x in a:\n        if x not in seen:\n            seen.add(x)\n            out.append(x)\n    return out`,
    time: "O(n)",
    space: "O(n)",
  },
  {
    category: "Easy",
    q: "Rotate an array left or right by k",
    a: "Slice-and-concat is the shortest; three-reverse is O(1) extra space.",
    code: `def rotate_right(a, k):\n    k %= len(a)\n    return a[-k:] + a[:-k]\n\ndef rotate_left(a, k):\n    k %= len(a)\n    return a[k:] + a[:k]`,
    time: "O(n)",
    space: "O(n) with slicing, O(1) with reverse trick",
  },
  {
    category: "Easy",
    q: "Merge two sorted arrays",
    a: "Two pointers; append the smaller head each step.",
    code: `def merge(a, b):\n    i = j = 0\n    out = []\n    while i < len(a) and j < len(b):\n        if a[i] <= b[j]: out.append(a[i]); i += 1\n        else:            out.append(b[j]); j += 1\n    out.extend(a[i:])\n    out.extend(b[j:])\n    return out`,
    time: "O(n + m)",
    space: "O(n + m)",
  },
  {
    category: "Easy",
    q: "Move all zeros to the end",
    a: "Two pointers — write index advances only for non-zero values.",
    code: `def move_zeros(a):\n    w = 0\n    for r in range(len(a)):\n        if a[r] != 0:\n            a[w], a[r] = a[r], a[w]\n            w += 1\n    return a`,
    time: "O(n)",
    space: "O(1)",
  },
  {
    category: "Easy",
    q: "Check if an array is sorted",
    a: "Compare each pair. Bail on the first out-of-order pair.",
    code: `def is_sorted(a):\n    return all(a[i] <= a[i+1] for i in range(len(a) - 1))`,
    time: "O(n)",
    space: "O(1)",
  },
  {
    category: "Easy",
    q: "Find the missing number in 1..n",
    a: "Sum formula minus actual sum.",
    code: `def missing(a, n):\n    return n * (n + 1) // 2 - sum(a)`,
    time: "O(n)",
    space: "O(1)",
  },
  {
    category: "Easy",
    q: "Find duplicate numbers",
    a: "Set membership.",
    code: `def duplicates(a):\n    seen, dupes = set(), set()\n    for x in a:\n        if x in seen: dupes.add(x)\n        else:         seen.add(x)\n    return list(dupes)`,
    time: "O(n)",
    space: "O(n)",
  },
  {
    category: "Easy",
    q: "Find leaders in an array",
    a: "A leader is greater than everything to its right. Scan right-to-left tracking the max.",
    code: `def leaders(a):\n    out, m = [], float('-inf')\n    for x in reversed(a):\n        if x >= m:\n            out.append(x); m = x\n    return out[::-1]`,
    time: "O(n)",
    space: "O(n) output",
  },
  {
    category: "Easy",
    q: "Check if two arrays are equal (any order)",
    a: "Compare sorted versions, or use Counter for O(n).",
    code: `from collections import Counter\ndef equal_unordered(a, b):\n    return Counter(a) == Counter(b)`,
    time: "O(n)",
    space: "O(n)",
  },

  // ── Medium ──
  {
    category: "Medium",
    q: "Two Sum (LeetCode #1)",
    a: "One-pass hash map: for each x, look up target - x.",
    code: `def two_sum(nums, target):\n    seen = {}\n    for i, x in enumerate(nums):\n        if target - x in seen:\n            return [seen[target - x], i]\n        seen[x] = i`,
    time: "O(n)",
    space: "O(n)",
    edge: "Assumes exactly one solution and distinct indices.",
  },
  {
    category: "Medium",
    q: "Product of Array Except Self",
    a: "Two passes — left products then right products — no division.",
    code: `def product_except_self(a):\n    n = len(a)\n    out = [1] * n\n    left = 1\n    for i in range(n):\n        out[i] = left\n        left *= a[i]\n    right = 1\n    for i in range(n - 1, -1, -1):\n        out[i] *= right\n        right *= a[i]\n    return out`,
    time: "O(n)",
    space: "O(1) extra",
  },
  {
    category: "Medium",
    q: "Maximum Sum Subarray (Kadane's Algorithm)",
    a: "Reset the running sum whenever it goes negative.",
    code: `def max_subarray(a):\n    best = cur = a[0]\n    for x in a[1:]:\n        cur = max(x, cur + x)\n        best = max(best, cur)\n    return best`,
    time: "O(n)",
    space: "O(1)",
  },
  {
    category: "Medium",
    q: "Longest Increasing Continuous Subarray",
    a: "Track the current run length; reset when the increase breaks.",
    code: `def lics(a):\n    best = run = 1\n    for i in range(1, len(a)):\n        run = run + 1 if a[i] > a[i-1] else 1\n        best = max(best, run)\n    return best`,
    time: "O(n)",
    space: "O(1)",
  },
  {
    category: "Medium",
    q: "Minimum in a sorted-rotated array",
    a: "Binary search: shrink the half that is not sorted.",
    code: `def find_min(a):\n    lo, hi = 0, len(a) - 1\n    while lo < hi:\n        mid = (lo + hi) // 2\n        if a[mid] > a[hi]: lo = mid + 1\n        else:              hi = mid\n    return a[lo]`,
    time: "O(log n)",
    space: "O(1)",
  },
  {
    category: "Medium",
    q: "Last occurrence in a sorted array (with duplicates)",
    a: "Binary search that biases right.",
    code: `def last_occurrence(a, x):\n    lo, hi, ans = 0, len(a) - 1, -1\n    while lo <= hi:\n        mid = (lo + hi) // 2\n        if a[mid] == x: ans = mid; lo = mid + 1\n        elif a[mid] < x: lo = mid + 1\n        else: hi = mid - 1\n    return ans`,
    time: "O(log n)",
    space: "O(1)",
  },
  {
    category: "Medium",
    q: "First occurrence using Binary Search",
    a: "Same idea — bias left.",
    code: `def first_occurrence(a, x):\n    lo, hi, ans = 0, len(a) - 1, -1\n    while lo <= hi:\n        mid = (lo + hi) // 2\n        if a[mid] == x: ans = mid; hi = mid - 1\n        elif a[mid] < x: lo = mid + 1\n        else: hi = mid - 1\n    return ans`,
    time: "O(log n)",
    space: "O(1)",
  },
  {
    category: "Medium",
    q: "Remove the row containing the largest element from a 2D array",
    a: "Find max coordinates then delete that row.",
    code: `def remove_max_row(m):\n    r = max(range(len(m)), key=lambda i: max(m[i]))\n    return m[:r] + m[r+1:]`,
    time: "O(rows × cols)",
    space: "O(rows × cols)",
  },
  {
    category: "Medium",
    q: "Merge overlapping intervals",
    a: "Sort by start, then merge on overlap.",
    code: `def merge_intervals(iv):\n    iv.sort(key=lambda x: x[0])\n    out = [iv[0]]\n    for s, e in iv[1:]:\n        if s <= out[-1][1]:\n            out[-1][1] = max(out[-1][1], e)\n        else:\n            out.append([s, e])\n    return out`,
    time: "O(n log n)",
    space: "O(n)",
  },
  {
    category: "Medium",
    q: "Intersection and Union of two arrays",
    a: "Use set operations.",
    code: `def intersect(a, b):\n    return list(set(a) & set(b))\n\ndef union(a, b):\n    return list(set(a) | set(b))`,
    time: "O(n + m)",
    space: "O(n + m)",
  },

  // ── Advanced conceptual ──
  {
    category: "Advanced",
    q: "Sparse Arrays",
    a: "Arrays where most entries are the default value (usually 0). Store only the non-defaults — as a dict {index: value} or (row, col, val) triples.",
    didYouKnow: "scipy.sparse uses CSR/CSC formats to store huge matrices efficiently.",
  },
  {
    category: "Advanced",
    q: "Jagged Arrays",
    a: "2D structures where rows can have different lengths. Python does this naturally: [[1,2],[3],[4,5,6]].",
  },
  {
    category: "Advanced",
    q: "Multidimensional Arrays",
    a: "Arrays with more than one axis. Python uses lists of lists; NumPy stores a true N-dimensional contiguous buffer with strides.",
  },
  {
    category: "Advanced",
    q: "Dynamic Arrays & Memory Reallocation",
    a: "A dynamic array doubles (or grows by some factor) when it runs out of room. Each realloc is O(n), but averaged over n appends the cost is O(1).",
  },
  {
    category: "Advanced",
    q: "Array Resizing",
    a: "Growing usually reallocates. Shrinking is lazy — most implementations don't return memory until many pops happen. Use lst.clear() to release.",
  },
  {
    category: "Advanced",
    q: "Cache Locality",
    a: "Contiguous memory means the CPU can prefetch the next elements. Random pointer chasing (linked lists, dicts) is cache-unfriendly and can be 10-100× slower than a linear array scan.",
  },
  {
    category: "Advanced",
    q: "Python List Overallocation Strategy",
    a: "CPython grows capacity as newsize + (newsize >> 3) + 6, rounded up. This produces the 0, 4, 8, 16, 25, 35, 46, 58, 72, 88… sequence.",
  },
  {
    category: "Advanced",
    q: "How Python's list differs from NumPy arrays",
    a: "Python list stores pointers to arbitrary objects. NumPy ndarray stores packed, same-typed values in a real contiguous buffer — vectorized operations run in C, no Python loop overhead.",
    didYouKnow: "For numerical work, NumPy is easily 10-100× faster than plain lists.",
  },
];

const CATEGORIES: Category[] = ["Concepts", "Operations", "Easy", "Medium", "Advanced"];

// ─── Interactive problem runners ───
type Step = { arr: number[]; highlight?: number[]; compare?: number[]; msg: string };

function reverseSteps(a: number[]): Step[] {
  const arr = [...a];
  const steps: Step[] = [{ arr: [...arr], msg: "Start — two pointers at both ends." }];
  let i = 0, j = arr.length - 1;
  while (i < j) {
    steps.push({ arr: [...arr], compare: [i, j], msg: `Swap indices ${i} and ${j}.` });
    [arr[i], arr[j]] = [arr[j], arr[i]];
    steps.push({ arr: [...arr], highlight: [i, j], msg: `After swap.` });
    i++; j--;
  }
  steps.push({ arr: [...arr], msg: "Done — array reversed." });
  return steps;
}

function twoSumSteps(a: number[], target: number): Step[] {
  const seen = new Map<number, number>();
  const steps: Step[] = [{ arr: [...a], msg: `Looking for two indices whose values sum to ${target}.` }];
  for (let i = 0; i < a.length; i++) {
    const need = target - a[i];
    if (seen.has(need)) {
      steps.push({ arr: [...a], highlight: [seen.get(need)!, i], msg: `Found: a[${seen.get(need)}] + a[${i}] = ${target} ✓` });
      return steps;
    }
    steps.push({ arr: [...a], compare: [i], msg: `Check a[${i}]=${a[i]} — need ${need}. Store it.` });
    seen.set(a[i], i);
  }
  steps.push({ arr: [...a], msg: "No pair found." });
  return steps;
}

function kadaneSteps(a: number[]): Step[] {
  const steps: Step[] = [{ arr: [...a], msg: "Start Kadane's." }];
  let best = a[0], cur = a[0], bestStart = 0, bestEnd = 0, curStart = 0;
  for (let i = 1; i < a.length; i++) {
    if (a[i] > cur + a[i]) { cur = a[i]; curStart = i; }
    else cur += a[i];
    if (cur > best) { best = cur; bestStart = curStart; bestEnd = i; }
    const win = [];
    for (let k = curStart; k <= i; k++) win.push(k);
    steps.push({ arr: [...a], compare: win, highlight: [i], msg: `i=${i}: cur=${cur}, best=${best}` });
  }
  const finalWin = [];
  for (let k = bestStart; k <= bestEnd; k++) finalWin.push(k);
  steps.push({ arr: [...a], highlight: finalWin, msg: `Max subarray sum = ${best}` });
  return steps;
}

function moveZerosSteps(a: number[]): Step[] {
  const arr = [...a];
  const steps: Step[] = [{ arr: [...arr], msg: "Start — write pointer w=0." }];
  let w = 0;
  for (let r = 0; r < arr.length; r++) {
    if (arr[r] !== 0) {
      if (w !== r) {
        steps.push({ arr: [...arr], compare: [w, r], msg: `Swap w=${w} with r=${r}.` });
        [arr[w], arr[r]] = [arr[r], arr[w]];
        steps.push({ arr: [...arr], highlight: [w, r], msg: `After swap.` });
      }
      w++;
    } else {
      steps.push({ arr: [...arr], compare: [r], msg: `r=${r} is zero — skip.` });
    }
  }
  steps.push({ arr: [...arr], msg: "Done — zeros pushed to the end." });
  return steps;
}

type ProblemDef = {
  id: string;
  title: string;
  defaults: number[];
  needsTarget?: boolean;
  defaultTarget?: number;
  run: (a: number[], target?: number) => Step[];
  code: string;
  time: string;
  space: string;
};

const problems: ProblemDef[] = [
  {
    id: "reverse",
    title: "Reverse an array (two pointer)",
    defaults: [1, 2, 3, 4, 5, 6, 7],
    run: (a) => reverseSteps(a),
    code: `i, j = 0, len(a) - 1\nwhile i < j:\n    a[i], a[j] = a[j], a[i]\n    i, j = i+1, j-1`,
    time: "O(n)",
    space: "O(1)",
  },
  {
    id: "two-sum",
    title: "Two Sum (hash map)",
    defaults: [2, 7, 11, 15, 3, 6],
    needsTarget: true,
    defaultTarget: 9,
    run: (a, t) => twoSumSteps(a, t ?? 9),
    code: `seen = {}\nfor i, x in enumerate(a):\n    if target - x in seen:\n        return [seen[target-x], i]\n    seen[x] = i`,
    time: "O(n)",
    space: "O(n)",
  },
  {
    id: "kadane",
    title: "Maximum subarray sum (Kadane)",
    defaults: [-2, 1, -3, 4, -1, 2, 1, -5, 4],
    run: (a) => kadaneSteps(a),
    code: `best = cur = a[0]\nfor x in a[1:]:\n    cur = max(x, cur + x)\n    best = max(best, cur)`,
    time: "O(n)",
    space: "O(1)",
  },
  {
    id: "move-zeros",
    title: "Move zeros to the end",
    defaults: [0, 1, 0, 3, 12, 0, 5],
    run: (a) => moveZerosSteps(a),
    code: `w = 0\nfor r in range(len(a)):\n    if a[r] != 0:\n        a[w], a[r] = a[r], a[w]\n        w += 1`,
    time: "O(n)",
    space: "O(1)",
  },
];

function parseArr(s: string): number[] {
  return s
    .split(/[,\s]+/)
    .map((t) => t.trim())
    .filter(Boolean)
    .map(Number)
    .filter((n) => !Number.isNaN(n));
}

function ProblemRunner({ p }: { p: ProblemDef }) {
  const [text, setText] = useState(p.defaults.join(", "));
  const [target, setTarget] = useState(p.defaultTarget ?? 0);
  const [steps, setSteps] = useState<Step[] | null>(null);
  const [i, setI] = useState(0);

  const run = () => {
    const arr = parseArr(text);
    if (!arr.length) return;
    const s = p.run(arr, target);
    setSteps(s);
    setI(0);
  };
  const reset = () => { setSteps(null); setI(0); };
  const step = steps?.[i];

  return (
    <div className="card-surface p-4">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <div className="text-sm font-semibold flex-1 min-w-full sm:min-w-0">{p.title}</div>
        <ComplexityBadgeCell value={p.time} tip="Time" />
        <ComplexityBadgeCell value={p.space} tip="Space" />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="1, 2, 3, …"
          className="h-9 flex-1 min-w-[180px] rounded-md border border-input bg-background px-3 text-sm font-mono"
        />
        {p.needsTarget && (
          <input
            type="number"
            value={target}
            onChange={(e) => setTarget(Number(e.target.value))}
            className="h-9 w-20 rounded-md border border-input bg-background px-2 text-sm font-mono"
          />
        )}
        <button onClick={run} className="inline-flex h-9 items-center gap-1 rounded-md gradient-brand px-3 text-xs font-medium text-primary-foreground">
          <Play className="h-3.5 w-3.5" /> Run
        </button>
        <button onClick={reset} className="inline-flex h-9 items-center gap-1 rounded-md border border-input bg-background px-3 text-xs hover:bg-accent">
          <RotateCcw className="h-3.5 w-3.5" /> Reset
        </button>
      </div>

      {step && (
        <div className="mt-4">
          <ListVisualizer items={makeItems(step.arr)} highlight={step.highlight} compare={step.compare} size="sm" />
          <div className="mt-2 text-sm text-muted-foreground">{step.msg}</div>
          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={() => setI((n) => Math.max(0, n - 1))}
              disabled={i === 0}
              className="inline-flex h-8 items-center rounded-md border border-input bg-background px-2 text-xs disabled:opacity-40"
            >
              ← Prev
            </button>
            <button
              onClick={() => setI((n) => Math.min((steps?.length ?? 1) - 1, n + 1))}
              disabled={i >= (steps?.length ?? 0) - 1}
              className="inline-flex h-8 items-center gap-1 rounded-md border border-input bg-background px-2 text-xs disabled:opacity-40"
            >
              <StepForward className="h-3 w-3" /> Next
            </button>
            <span className="ml-auto text-xs text-muted-foreground">
              Step {i + 1} / {steps?.length}
            </span>
          </div>
        </div>
      )}

      <details className="mt-3">
        <summary className="cursor-pointer text-xs text-muted-foreground hover:text-foreground">Show code</summary>
        <CodeBlock code={p.code} />
      </details>
    </div>
  );
}

function FAQCard({ f }: { f: FAQ }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border last:border-b-0">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-start justify-between gap-4 py-4 text-left"
      >
        <div className="min-w-0">
          <div className="text-xs font-semibold uppercase tracking-wider text-[color:var(--brand)]">{f.category}</div>
          <div className="mt-0.5 font-medium">{f.q}</div>
        </div>
        <ChevronDown className={`mt-1 h-4 w-4 shrink-0 transition ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="pb-5 text-sm">
          <p className="text-muted-foreground">{f.a}</p>
          {f.code && <CodeBlock code={f.code} />}
          {(f.time || f.space) && (
            <div className="mt-3 flex flex-wrap gap-2">
              {f.time && <span className="text-xs text-muted-foreground">Time: <ComplexityBadgeCell value={f.time.split(" ")[0]} /> {f.time.replace(/^O\([^)]+\)\s*/, "")}</span>}
              {f.space && <span className="text-xs text-muted-foreground">Space: <ComplexityBadgeCell value={f.space.split(" ")[0]} /> {f.space.replace(/^O\([^)]+\)\s*/, "")}</span>}
            </div>
          )}
          {f.edge && (
            <div className="mt-3 rounded-md border border-border bg-muted/40 p-3 text-xs">
              <b className="text-foreground">Edge cases: </b>
              <span className="text-muted-foreground">{f.edge}</span>
            </div>
          )}
          {f.mistakes && (
            <Callout kind="warn" title="Common mistake">
              {f.mistakes}
            </Callout>
          )}
          {f.didYouKnow && (
            <Callout kind="did" title="Did you know?">
              {f.didYouKnow}
            </Callout>
          )}
        </div>
      )}
    </div>
  );
}

function Page() {
  const [cat, setCat] = useState<Category | "All">("All");
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return faqs.filter((f) => (cat === "All" || f.category === cat) && (!query || f.q.toLowerCase().includes(query) || f.a.toLowerCase().includes(query)));
  }, [cat, q]);

  return (
    <PageShell>
      <PageHeader
        eyebrow="Reference"
        title="FAQ & Interview Questions"
        description="Concepts, operations, and coding-interview classics — searchable, categorized, and with visual step-through solutions for the most common problems."
      />

      <Callout kind="did" title="Try the interactive problems">
        <p>Below you'll find four fully interactive problem visualizers — edit the input, hit Run, and step through the algorithm one operation at a time.</p>
      </Callout>

      <div className="mb-8 grid gap-4 md:grid-cols-2">
        {problems.map((p) => <ProblemRunner key={p.id} p={p} />)}
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {(["All", ...CATEGORIES] as const).map((c) => (
          <button
            key={c}
            onClick={() => setCat(c as Category | "All")}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
              cat === c ? "gradient-brand text-primary-foreground border-transparent" : "border-border text-muted-foreground hover:bg-accent"
            }`}
          >
            {c}
          </button>
        ))}
        <div className="relative ml-auto min-w-[180px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search FAQs…"
            className="h-9 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm"
          />
        </div>
      </div>

      <div className="card-surface px-5">
        {filtered.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground">No FAQs match.</div>
        ) : (
          filtered.map((f) => <FAQCard key={f.q} f={f} />)
        )}
      </div>

      <PrevNext current="/faq" />
    </PageShell>
  );
}
