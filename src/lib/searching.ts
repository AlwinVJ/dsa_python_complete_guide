export type SearchStep = {
  array: number[];
  currentIndex?: number;
  compare?: number[]; // indices being compared
  visited?: number[]; // indices visited/ruled out so far
  foundIndex?: number; // if found, the index
  notFound?: boolean; // if finished searching and not found
  note?: string;
};

export type SearchMeta = {
  id: string;
  name: string;
  sortedRequired: boolean;
  timeBest: string;
  timeAvg: string;
  timeWorst: string;
  space: string;
  stable: boolean;
  typicalUseCase: string;
  description: string;
  advantages: string[];
  disadvantages: string[];
  applications: string[];
  code: string;
  generate: (arr: number[], target: number) => SearchStep[];
};

const clone = (a: number[]) => a.slice();

export const ALGORITHMS: SearchMeta[] = [
  {
    id: "linear",
    name: "Linear Search",
    sortedRequired: false,
    timeBest: "O(1)",
    timeAvg: "O(n)",
    timeWorst: "O(n)",
    space: "O(1)",
    stable: true,
    typicalUseCase: "Small or unsorted collections; initial scanning.",
    description:
      "Linear search scans every element in the array one by one from the beginning until a match is found or the array is exhausted. It makes no assumptions about the order of elements and works on any sequence (sorted or unsorted, linked list or array).",
    advantages: [
      "Simple to implement and easy to understand.",
      "Does not require the array to be sorted.",
      "Works on any iterable data structure (e.g., linked lists).",
      "Highly efficient for small arrays.",
    ],
    disadvantages: [
      "Infeasible for large datasets due to O(n) average/worst time.",
      "Does not exploit any ordering or structure in the data.",
    ],
    applications: [
      "Finding an element in unsorted small collections.",
      "Looking up keys in a simple association list.",
      "Default fallback for Python's 'in' operator on lists.",
    ],
    code: `def linear_search(arr, target):
    for i in range(len(arr)):
        if arr[i] == target:
            return i
    return -1`,
    generate: (a, target) => {
      const steps: SearchStep[] = [];
      const visited: number[] = [];
      for (let i = 0; i < a.length; i++) {
        steps.push({
          array: clone(a),
          currentIndex: i,
          compare: [i],
          visited: clone(visited),
          note: `Compare index ${i} (${a[i]}) with target ${target}`,
        });
        if (a[i] === target) {
          steps.push({
            array: clone(a),
            currentIndex: i,
            foundIndex: i,
            visited: clone(visited),
            note: `Found target ${target} at index ${i}!`,
          });
          return steps;
        }
        visited.push(i);
      }
      steps.push({
        array: clone(a),
        visited: clone(visited),
        notFound: true,
        note: `Target ${target} not found in the array.`,
      });
      return steps;
    },
  },
  {
    id: "binary",
    name: "Binary Search",
    sortedRequired: true,
    timeBest: "O(1)",
    timeAvg: "O(log n)",
    timeWorst: "O(log n)",
    space: "O(1)",
    stable: true,
    typicalUseCase: "Large sorted index tables, databases, root-finding.",
    description:
      "Binary search locates a target value in a sorted array by repeatedly halving the search range. It compares the target with the middle element, discarding the half in which the target cannot lie, resulting in highly efficient logarithmic time complexity.",
    advantages: [
      "Logarithmic time complexity makes it extremely fast for large datasets.",
      "Uses O(1) auxiliary space (iterative version).",
      "Well-known and widely used standard library implementations (e.g. bisect).",
    ],
    disadvantages: [
      "Requires the data to be sorted beforehand.",
      "Requires random access (indexable array). Does not work efficiently on linked lists.",
    ],
    applications: [
      "Database index lookups.",
      "Searching within sorted collections (like dictionary words).",
      "Finding target parameters or roots (binary search on the answer).",
    ],
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
    generate: (a, target) => {
      const steps: SearchStep[] = [];
      let lo = 0;
      let hi = a.length - 1;
      const getVisited = (l: number, h: number) => {
        const vis: number[] = [];
        for (let k = 0; k < a.length; k++) {
          if (k < l || k > h) vis.push(k);
        }
        return vis;
      };

      while (lo <= hi) {
        const mid = lo + Math.floor((hi - lo) / 2);
        steps.push({
          array: clone(a),
          currentIndex: mid,
          compare: [lo, mid, hi],
          visited: getVisited(lo, hi),
          note: `Mid calculated at index ${mid} (${a[mid]}). Current interval bounds: [${lo}..${hi}].`,
        });

        if (a[mid] === target) {
          steps.push({
            array: clone(a),
            currentIndex: mid,
            foundIndex: mid,
            visited: getVisited(lo, hi),
            note: `Found target ${target} at index ${mid}!`,
          });
          return steps;
        }

        if (a[mid] < target) {
          const prevLo = lo;
          lo = mid + 1;
          steps.push({
            array: clone(a),
            currentIndex: mid,
            visited: getVisited(lo, hi),
            note: `${a[mid]} < ${target}. Target must be in right half. Set low = ${lo}`,
          });
        } else {
          const prevHi = hi;
          hi = mid - 1;
          steps.push({
            array: clone(a),
            currentIndex: mid,
            visited: getVisited(lo, hi),
            note: `${a[mid]} > ${target}. Target must be in left half. Set high = ${hi}`,
          });
        }
      }

      steps.push({
        array: clone(a),
        visited: Array.from({ length: a.length }, (_, k) => k),
        notFound: true,
        note: `low (${lo}) > high (${hi}). Target ${target} not found.`,
      });
      return steps;
    },
  },
  {
    id: "jump",
    name: "Jump Search",
    sortedRequired: true,
    timeBest: "O(1)",
    timeAvg: "O(√n)",
    timeWorst: "O(√n)",
    space: "O(1)",
    stable: true,
    typicalUseCase: "Sorted lists on sequential devices where jumping back is costly.",
    description:
      "Jump search moves forward by jumping in fixed steps of size √n, and when an element greater than the target is reached, it performs a linear search backward (or forward from the previous step) within that block to find the target. It performs fewer backward movements than linear search.",
    advantages: [
      "Better than linear search (O(√n) vs O(n)).",
      "Requires only forward steps when traversing, which is helpful if backward traversal is expensive or slow.",
    ],
    disadvantages: [
      "Requires the array to be sorted.",
      "Slower than binary search (O(√n) vs O(log n)).",
    ],
    applications: [
      "Useful in systems where jumping back is costly, but jumping forward is cheaper.",
      "Searching in systems with physical tapes or CD-ROM drives where seek time increases with distance.",
    ],
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
    generate: (a, target) => {
      const steps: SearchStep[] = [];
      const n = a.length;
      const stepSize = Math.floor(Math.sqrt(n));
      let prev = 0;
      let curr = stepSize;
      const visited: number[] = [];

      steps.push({
        array: clone(a),
        visited: [],
        note: `Start Jump Search with step size √${n} = ${stepSize}`,
      });

      while (curr < n && a[curr - 1] < target) {
        for (let k = prev; k < curr; k++) visited.push(k);

        steps.push({
          array: clone(a),
          currentIndex: curr - 1,
          compare: [curr - 1],
          visited: clone(visited),
          note: `Block boundary index ${curr - 1} (${a[curr - 1]}) < target ${target}. Jump to next block.`,
        });

        prev = curr;
        curr += stepSize;
      }

      const limit = Math.min(curr, n);
      steps.push({
        array: clone(a),
        currentIndex: limit - 1,
        compare: [limit - 1],
        visited: clone(visited),
        note: `Inspecting block boundary at index ${limit - 1} (${a[limit - 1]}). target <= boundary. Linear search block [${prev}..${limit - 1}].`,
      });

      for (let i = prev; i < limit; i++) {
        steps.push({
          array: clone(a),
          currentIndex: i,
          compare: [i],
          visited: clone(visited),
          note: `Linear scan index ${i} (${a[i]}) in block`,
        });
        if (a[i] === target) {
          steps.push({
            array: clone(a),
            currentIndex: i,
            foundIndex: i,
            visited: clone(visited),
            note: `Found target ${target} at index ${i}!`,
          });
          return steps;
        }
        visited.push(i);
      }

      for (let i = prev; i < limit; i++) {
        if (!visited.includes(i)) visited.push(i);
      }
      steps.push({
        array: clone(a),
        visited: clone(visited),
        notFound: true,
        note: `Target ${target} not found in block.`,
      });
      return steps;
    },
  },
  {
    id: "interpolation",
    name: "Interpolation Search",
    sortedRequired: true,
    timeBest: "O(1)",
    timeAvg: "O(log log n)",
    timeWorst: "O(n)",
    space: "O(1)",
    stable: true,
    typicalUseCase: "Uniformly distributed large sorted files and directory lookups.",
    description:
      "Interpolation search is an improvement over binary search for sorted, uniformly distributed datasets. Instead of always splitting the search range in half, it estimates the target's position using the value differences at the boundaries (similar to how humans look up names in a phone book).",
    advantages: [
      "Extremely fast O(log log n) average time complexity on uniformly distributed datasets.",
      "Performs fewer comparisons than binary search for large datasets.",
    ],
    disadvantages: [
      "Requires the data to be sorted and uniformly distributed.",
      "Worst-case time complexity is O(n) if the data is highly skewed.",
    ],
    applications: [
      "Looking up keys in databases where keys are uniformly distributed (e.g. auto-incrementing IDs, phone numbers).",
    ],
    code: `def interpolation_search(arr, target):
    low, high = 0, len(arr) - 1
    while low <= high and target >= arr[low] and target <= arr[high]:
        if low == high:
            if arr[low] == target: return low
            return -1
        
        # Linear interpolation estimation
        pos = low + int(((target - arr[low]) * (high - low)) // (arr[high] - arr[low]))
        
        if arr[pos] == target:
            return pos
        elif arr[pos] < target:
            low = pos + 1
        else:
            high = pos - 1
    return -1`,
    generate: (a, target) => {
      const steps: SearchStep[] = [];
      let lo = 0;
      let hi = a.length - 1;

      const getVisited = (l: number, h: number) => {
        const vis: number[] = [];
        for (let k = 0; k < a.length; k++) {
          if (k < l || k > h) vis.push(k);
        }
        return vis;
      };

      while (lo <= hi && target >= a[lo] && target <= a[hi]) {
        if (a[hi] === a[lo]) {
          if (a[lo] === target) {
            steps.push({
              array: clone(a),
              currentIndex: lo,
              foundIndex: lo,
              visited: getVisited(lo, hi),
              note: `Found target ${target} at index ${lo}!`,
            });
            return steps;
          }
          break;
        }

        const pos = lo + Math.floor(((target - a[lo]) * (hi - lo)) / (a[hi] - a[lo]));

        if (pos < lo || pos > hi) {
          break;
        }

        steps.push({
          array: clone(a),
          currentIndex: pos,
          compare: [lo, pos, hi],
          visited: getVisited(lo, hi),
          note: `Estimate pos = ${lo} + ((${target} - ${a[lo]}) * (${hi} - ${lo})) // (${a[hi]} - ${a[lo]}) = index ${pos}. Compare index ${pos} (${a[pos]})`,
        });

        if (a[pos] === target) {
          steps.push({
            array: clone(a),
            currentIndex: pos,
            foundIndex: pos,
            visited: getVisited(lo, hi),
            note: `Found target ${target} at index ${pos}!`,
          });
          return steps;
        }

        if (a[pos] < target) {
          lo = pos + 1;
          steps.push({
            array: clone(a),
            currentIndex: pos,
            visited: getVisited(lo, hi),
            note: `${a[pos]} < ${target}. Set low = ${lo}`,
          });
        } else {
          hi = pos - 1;
          steps.push({
            array: clone(a),
            currentIndex: pos,
            visited: getVisited(lo, hi),
            note: `${a[pos]} > ${target}. Set high = ${hi}`,
          });
        }
      }

      steps.push({
        array: clone(a),
        visited: Array.from({ length: a.length }, (_, k) => k),
        notFound: true,
        note: `Target ${target} not found. Out of bounds or not in range.`,
      });
      return steps;
    },
  },
  {
    id: "exponential",
    name: "Exponential Search",
    sortedRequired: true,
    timeBest: "O(1)",
    timeAvg: "O(log i)",
    timeWorst: "O(log n)",
    space: "O(1)",
    stable: true,
    typicalUseCase: "Unbounded or infinite arrays; data streams.",
    description:
      "Exponential search is designed for sorted, unbounded, or infinite arrays. It finds the range containing the target by doubling the index range (1, 2, 4, 8...) until the element at that index is greater than the target. It then performs binary search within this bounded range.",
    advantages: [
      "Very efficient when the target is near the beginning of the array (runs in O(log i) time).",
      "Works on unbounded/infinite arrays or streamed data where the size of the array is unknown.",
    ],
    disadvantages: [
      "Requires the array to be sorted.",
      "Slightly more complex to implement than binary search.",
    ],
    applications: [
      "Searching within huge files or databases where size is unknown or unbounded.",
      "Searching in network packets or streams of data.",
    ],
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
    generate: (a, target) => {
      const steps: SearchStep[] = [];
      const n = a.length;
      const visited: number[] = [];

      if (n === 0) {
        steps.push({ array: clone(a), notFound: true, note: "Empty array. Target not found." });
        return steps;
      }

      steps.push({
        array: clone(a),
        currentIndex: 0,
        compare: [0],
        visited: [],
        note: `Check index 0 (${a[0]})`,
      });

      if (a[0] === target) {
        steps.push({
          array: clone(a),
          currentIndex: 0,
          foundIndex: 0,
          visited: [],
          note: `Found target ${target} at index 0!`,
        });
        return steps;
      }

      let i = 1;
      while (i < n && a[i] <= target) {
        for (let k = 0; k < i / 2; k++) {
          if (!visited.includes(k)) visited.push(k);
        }

        steps.push({
          array: clone(a),
          currentIndex: i,
          compare: [i],
          visited: clone(visited),
          note: `Exponential expansion: inspect index ${i} (${a[i]}) <= ${target}`,
        });

        if (a[i] === target) {
          steps.push({
            array: clone(a),
            currentIndex: i,
            foundIndex: i,
            visited: clone(visited),
            note: `Found target ${target} at index ${i}!`,
          });
          return steps;
        }

        i = i * 2;
      }

      const lo = Math.floor(i / 2);
      const hi = Math.min(i, n - 1);
      
      for (let k = 0; k < lo; k++) {
        if (!visited.includes(k)) visited.push(k);
      }
      for (let k = hi + 1; k < n; k++) {
        if (!visited.includes(k)) visited.push(k);
      }

      steps.push({
        array: clone(a),
        visited: clone(visited),
        note: `Target must lie in range [${lo}..${hi}]. Commencing Binary Search.`,
      });

      let l = lo;
      let h = hi;
      const getBSVisited = (currL: number, currH: number) => {
        const vis: number[] = [];
        for (let k = 0; k < n; k++) {
          if (k < currL || k > currH) vis.push(k);
        }
        return vis;
      };

      while (l <= h) {
        const mid = l + Math.floor((h - l) / 2);
        steps.push({
          array: clone(a),
          currentIndex: mid,
          compare: [l, mid, h],
          visited: getBSVisited(l, h),
          note: `Binary Search mid calculated at ${mid} (${a[mid]})`,
        });

        if (a[mid] === target) {
          steps.push({
            array: clone(a),
            currentIndex: mid,
            foundIndex: mid,
            visited: getBSVisited(l, h),
            note: `Found target ${target} at index ${mid}!`,
          });
          return steps;
        }

        if (a[mid] < target) {
          l = mid + 1;
          steps.push({
            array: clone(a),
            currentIndex: mid,
            visited: getBSVisited(l, h),
            note: `${a[mid]} < ${target}. Set low = ${l}`,
          });
        } else {
          h = mid - 1;
          steps.push({
            array: clone(a),
            currentIndex: mid,
            visited: getBSVisited(l, h),
            note: `${a[mid]} > ${target}. Set high = ${h}`,
          });
        }
      }

      steps.push({
        array: clone(a),
        visited: Array.from({ length: n }, (_, k) => k),
        notFound: true,
        note: `Target ${target} not found in range.`,
      });
      return steps;
    },
  },
  {
    id: "ternary",
    name: "Ternary Search",
    sortedRequired: true,
    timeBest: "O(1)",
    timeAvg: "O(log3 n)",
    timeWorst: "O(log3 n)",
    space: "O(1)",
    stable: true,
    typicalUseCase: "Finding extrema (max/min) in unimodal functions.",
    description:
      "Ternary search divides the sorted search space into three parts rather than two, using two middle indices (mid1 and mid2). While it performs more comparisons per step than binary search, it reduces the search space by two-thirds per step. It is mathematically slower than binary search for lookups but invaluable for finding extrema of unimodal functions.",
    advantages: [
      "Reduces the search space faster mathematically per step (by two-thirds).",
      "Highly useful for optimization problems, specifically finding local maxima/minima of unimodal functions.",
    ],
    disadvantages: [
      "Requires sorting.",
      "Performs more comparisons per iteration than binary search (4 comparisons vs 2), making it slower in practice for general array search.",
    ],
    applications: [
      "Finding maximum/minimum values of unimodal functions (e.g. peak of a mathematical function).",
      "Optimization problems in computer graphics and game design.",
    ],
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
    generate: (a, target) => {
      const steps: SearchStep[] = [];
      let lo = 0;
      let hi = a.length - 1;

      const getVisited = (l: number, h: number) => {
        const vis: number[] = [];
        for (let k = 0; k < a.length; k++) {
          if (k < l || k > h) vis.push(k);
        }
        return vis;
      };

      while (lo <= hi) {
        const mid1 = lo + Math.floor((hi - lo) / 3);
        const mid2 = hi - Math.floor((hi - lo) / 3);

        steps.push({
          array: clone(a),
          currentIndex: mid1, // we highlight both mid1 and mid2 in compare
          compare: [lo, mid1, mid2, hi],
          visited: getVisited(lo, hi),
          note: `Divide range [${lo}..${hi}] into thirds. mid1 = ${mid1} (${a[mid1]}), mid2 = ${mid2} (${a[mid2]})`,
        });

        if (a[mid1] === target) {
          steps.push({
            array: clone(a),
            currentIndex: mid1,
            foundIndex: mid1,
            visited: getVisited(lo, hi),
            note: `Found target ${target} at mid1 index ${mid1}!`,
          });
          return steps;
        }

        if (a[mid2] === target) {
          steps.push({
            array: clone(a),
            currentIndex: mid2,
            foundIndex: mid2,
            visited: getVisited(lo, hi),
            note: `Found target ${target} at mid2 index ${mid2}!`,
          });
          return steps;
        }

        if (target < a[mid1]) {
          hi = mid1 - 1;
          steps.push({
            array: clone(a),
            visited: getVisited(lo, hi),
            note: `Target ${target} < mid1 value (${a[mid1]}). Search left third. Set high = ${hi}`,
          });
        } else if (target > a[mid2]) {
          lo = mid2 + 1;
          steps.push({
            array: clone(a),
            visited: getVisited(lo, hi),
            note: `Target ${target} > mid2 value (${a[mid2]}). Search right third. Set low = ${lo}`,
          });
        } else {
          lo = mid1 + 1;
          hi = mid2 - 1;
          steps.push({
            array: clone(a),
            visited: getVisited(lo, hi),
            note: `Target is between mid1 (${a[mid1]}) and mid2 (${a[mid2]}). Search middle third. Set low = ${lo}, high = ${hi}`,
          });
        }
      }

      steps.push({
        array: clone(a),
        visited: Array.from({ length: a.length }, (_, k) => k),
        notFound: true,
        note: `Target ${target} not found. Range exhausted.`,
      });
      return steps;
    },
  },
];
