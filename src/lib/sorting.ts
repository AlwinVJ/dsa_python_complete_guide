// Sorting algorithm step generators. Each returns a list of Steps where
// Step describes { array, highlight, compare, sorted, note }.

export type SortStep = {
  array: number[];
  compare?: number[];
  highlight?: number[];
  sorted?: number[];
  note?: string;
};

export type SortMeta = {
  id: string;
  name: string;
  timeBest: string;
  timeAvg: string;
  timeWorst: string;
  space: string;
  stable: boolean;
  inPlace: boolean;
  description: string;
  advantages: string[];
  disadvantages: string[];
  applications: string[];
  code: string;
  generate: (arr: number[]) => SortStep[];
};

const clone = (a: number[]) => a.slice();

function bubbleSort(input: number[]): SortStep[] {
  const a = clone(input);
  const steps: SortStep[] = [{ array: clone(a), note: "Start" }];
  const n = a.length;
  const sorted = new Set<number>();
  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      steps.push({ array: clone(a), compare: [j, j + 1], sorted: Array.from(sorted), note: `Compare ${a[j]} and ${a[j + 1]}` });
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        swapped = true;
        steps.push({ array: clone(a), highlight: [j, j + 1], sorted: Array.from(sorted), note: `Swap` });
      }
    }
    sorted.add(n - i - 1);
    if (!swapped) {
      for (let k = 0; k < n - i - 1; k++) sorted.add(k);
      break;
    }
  }
  sorted.add(0);
  steps.push({ array: clone(a), sorted: Array.from({ length: n }, (_, k) => k), note: "Done" });
  return steps;
}

function selectionSort(input: number[]): SortStep[] {
  const a = clone(input);
  const steps: SortStep[] = [{ array: clone(a), note: "Start" }];
  const n = a.length;
  const sorted = new Set<number>();
  for (let i = 0; i < n; i++) {
    let min = i;
    for (let j = i + 1; j < n; j++) {
      steps.push({ array: clone(a), compare: [min, j], highlight: [i], sorted: Array.from(sorted), note: `Min so far: ${a[min]}` });
      if (a[j] < a[min]) min = j;
    }
    if (min !== i) {
      [a[i], a[min]] = [a[min], a[i]];
      steps.push({ array: clone(a), highlight: [i, min], sorted: Array.from(sorted), note: `Swap` });
    }
    sorted.add(i);
  }
  steps.push({ array: clone(a), sorted: Array.from({ length: n }, (_, k) => k), note: "Done" });
  return steps;
}

function insertionSort(input: number[]): SortStep[] {
  const a = clone(input);
  const steps: SortStep[] = [{ array: clone(a), note: "Start" }];
  const n = a.length;
  const sorted = new Set<number>([0]);
  for (let i = 1; i < n; i++) {
    let j = i;
    steps.push({ array: clone(a), highlight: [i], sorted: Array.from(sorted), note: `Insert ${a[i]}` });
    while (j > 0 && a[j - 1] > a[j]) {
      [a[j - 1], a[j]] = [a[j], a[j - 1]];
      j--;
      steps.push({ array: clone(a), compare: [j, j + 1], sorted: Array.from(sorted) });
    }
    sorted.add(i);
  }
  steps.push({ array: clone(a), sorted: Array.from({ length: n }, (_, k) => k), note: "Done" });
  return steps;
}

function mergeSort(input: number[]): SortStep[] {
  const a = clone(input);
  const steps: SortStep[] = [{ array: clone(a), note: "Start" }];
  const merge = (l: number, m: number, r: number) => {
    const left = a.slice(l, m + 1);
    const right = a.slice(m + 1, r + 1);
    let i = 0, j = 0, k = l;
    while (i < left.length && j < right.length) {
      steps.push({ array: clone(a), compare: [l + i, m + 1 + j], note: `Merge [${l}..${r}]` });
      if (left[i] <= right[j]) a[k++] = left[i++];
      else a[k++] = right[j++];
      steps.push({ array: clone(a), highlight: [k - 1] });
    }
    while (i < left.length) { a[k++] = left[i++]; steps.push({ array: clone(a), highlight: [k - 1] }); }
    while (j < right.length) { a[k++] = right[j++]; steps.push({ array: clone(a), highlight: [k - 1] }); }
  };
  const rec = (l: number, r: number) => {
    if (l >= r) return;
    const m = Math.floor((l + r) / 2);
    rec(l, m);
    rec(m + 1, r);
    merge(l, m, r);
  };
  rec(0, a.length - 1);
  steps.push({ array: clone(a), sorted: Array.from({ length: a.length }, (_, k) => k), note: "Done" });
  return steps;
}

function quickSort(input: number[]): SortStep[] {
  const a = clone(input);
  const steps: SortStep[] = [{ array: clone(a), note: "Start" }];
  const partition = (l: number, r: number) => {
    const pivot = a[r];
    let i = l - 1;
    for (let j = l; j < r; j++) {
      steps.push({ array: clone(a), compare: [j, r], highlight: [r], note: `Pivot ${pivot}` });
      if (a[j] < pivot) {
        i++;
        [a[i], a[j]] = [a[j], a[i]];
        steps.push({ array: clone(a), highlight: [i, j] });
      }
    }
    [a[i + 1], a[r]] = [a[r], a[i + 1]];
    steps.push({ array: clone(a), highlight: [i + 1] });
    return i + 1;
  };
  const rec = (l: number, r: number) => {
    if (l >= r) return;
    const p = partition(l, r);
    rec(l, p - 1);
    rec(p + 1, r);
  };
  rec(0, a.length - 1);
  steps.push({ array: clone(a), sorted: Array.from({ length: a.length }, (_, k) => k), note: "Done" });
  return steps;
}

function heapSort(input: number[]): SortStep[] {
  const a = clone(input);
  const steps: SortStep[] = [{ array: clone(a), note: "Start" }];
  const n = a.length;
  const heapify = (size: number, i: number) => {
    let largest = i;
    const l = 2 * i + 1, r = 2 * i + 2;
    if (l < size && a[l] > a[largest]) largest = l;
    if (r < size && a[r] > a[largest]) largest = r;
    if (largest !== i) {
      steps.push({ array: clone(a), compare: [i, largest], note: `Heapify` });
      [a[i], a[largest]] = [a[largest], a[i]];
      steps.push({ array: clone(a), highlight: [i, largest] });
      heapify(size, largest);
    }
  };
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) heapify(n, i);
  const sorted = new Set<number>();
  for (let i = n - 1; i > 0; i--) {
    [a[0], a[i]] = [a[i], a[0]];
    sorted.add(i);
    steps.push({ array: clone(a), highlight: [0, i], sorted: Array.from(sorted) });
    heapify(i, 0);
  }
  steps.push({ array: clone(a), sorted: Array.from({ length: n }, (_, k) => k), note: "Done" });
  return steps;
}

function countingSort(input: number[]): SortStep[] {
  const a = clone(input);
  const steps: SortStep[] = [{ array: clone(a), note: "Start" }];
  const max = Math.max(...a);
  const count = new Array(max + 1).fill(0);
  for (let i = 0; i < a.length; i++) {
    count[a[i]]++;
    steps.push({ array: clone(a), highlight: [i], note: `Count ${a[i]}` });
  }
  let k = 0;
  for (let v = 0; v <= max; v++) {
    while (count[v]-- > 0) {
      a[k] = v;
      steps.push({ array: clone(a), highlight: [k], note: `Place ${v}` });
      k++;
    }
  }
  steps.push({ array: clone(a), sorted: Array.from({ length: a.length }, (_, k) => k), note: "Done" });
  return steps;
}

function radixSort(input: number[]): SortStep[] {
  const a = clone(input);
  const steps: SortStep[] = [{ array: clone(a), note: "Start" }];
  const max = Math.max(...a);
  let exp = 1;
  while (Math.floor(max / exp) > 0) {
    const buckets: number[][] = Array.from({ length: 10 }, () => []);
    for (let i = 0; i < a.length; i++) {
      buckets[Math.floor(a[i] / exp) % 10].push(a[i]);
      steps.push({ array: clone(a), highlight: [i], note: `Digit ${exp}` });
    }
    let k = 0;
    for (const b of buckets) for (const v of b) {
      a[k++] = v;
      steps.push({ array: clone(a), highlight: [k - 1] });
    }
    exp *= 10;
  }
  steps.push({ array: clone(a), sorted: Array.from({ length: a.length }, (_, k) => k), note: "Done" });
  return steps;
}

function bucketSort(input: number[]): SortStep[] {
  const a = clone(input);
  const steps: SortStep[] = [{ array: clone(a), note: "Start" }];
  const n = a.length;
  const max = Math.max(...a);
  const buckets: number[][] = Array.from({ length: n }, () => []);
  for (let i = 0; i < n; i++) {
    const b = Math.min(n - 1, Math.floor((a[i] / (max + 1)) * n));
    buckets[b].push(a[i]);
    steps.push({ array: clone(a), highlight: [i], note: `Bucket ${b}` });
  }
  let k = 0;
  for (const b of buckets) {
    b.sort((x, y) => x - y);
    for (const v of b) {
      a[k++] = v;
      steps.push({ array: clone(a), highlight: [k - 1] });
    }
  }
  steps.push({ array: clone(a), sorted: Array.from({ length: n }, (_, k) => k), note: "Done" });
  return steps;
}

function shellSort(input: number[]): SortStep[] {
  const a = clone(input);
  const steps: SortStep[] = [{ array: clone(a), note: "Start" }];
  const n = a.length;
  for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
    for (let i = gap; i < n; i++) {
      const tmp = a[i];
      let j = i;
      steps.push({ array: clone(a), highlight: [i], note: `Gap ${gap}` });
      while (j >= gap && a[j - gap] > tmp) {
        a[j] = a[j - gap];
        steps.push({ array: clone(a), compare: [j, j - gap] });
        j -= gap;
      }
      a[j] = tmp;
    }
  }
  steps.push({ array: clone(a), sorted: Array.from({ length: n }, (_, k) => k), note: "Done" });
  return steps;
}

function timSort(input: number[]): SortStep[] {
  // Simplified TimSort — insertion sort on small runs, merge them
  const RUN = 8;
  const a = clone(input);
  const steps: SortStep[] = [{ array: clone(a), note: "Start (TimSort)" }];
  const n = a.length;
  const insSort = (l: number, r: number) => {
    for (let i = l + 1; i <= r; i++) {
      let j = i;
      while (j > l && a[j - 1] > a[j]) {
        [a[j - 1], a[j]] = [a[j], a[j - 1]];
        steps.push({ array: clone(a), compare: [j - 1, j], note: `Insertion in run` });
        j--;
      }
    }
  };
  for (let i = 0; i < n; i += RUN) insSort(i, Math.min(i + RUN - 1, n - 1));
  const merge = (l: number, m: number, r: number) => {
    const left = a.slice(l, m + 1);
    const right = a.slice(m + 1, r + 1);
    let i = 0, j = 0, k = l;
    while (i < left.length && j < right.length) {
      steps.push({ array: clone(a), compare: [l + i, m + 1 + j], note: `Merge runs` });
      if (left[i] <= right[j]) a[k++] = left[i++];
      else a[k++] = right[j++];
    }
    while (i < left.length) a[k++] = left[i++];
    while (j < right.length) a[k++] = right[j++];
    steps.push({ array: clone(a), note: `Runs merged` });
  };
  for (let size = RUN; size < n; size *= 2) {
    for (let l = 0; l < n; l += 2 * size) {
      const m = Math.min(l + size - 1, n - 1);
      const r = Math.min(l + 2 * size - 1, n - 1);
      if (m < r) merge(l, m, r);
    }
  }
  steps.push({ array: clone(a), sorted: Array.from({ length: n }, (_, k) => k), note: "Done" });
  return steps;
}

export const ALGORITHMS: SortMeta[] = [
  {
    id: "bubble",
    name: "Bubble Sort",
    timeBest: "O(n)",
    timeAvg: "O(n²)",
    timeWorst: "O(n²)",
    space: "O(1)",
    stable: true,
    inPlace: true,
    description: "Repeatedly swap adjacent pairs that are out of order. The largest bubbles to the end each pass.",
    advantages: ["Simple to implement", "Detects already-sorted arrays in one pass"],
    disadvantages: ["Very slow on large inputs", "Lots of swaps"],
    applications: ["Teaching sorting concepts", "Tiny datasets where simplicity wins"],
    code: `def bubble_sort(a):\n    n = len(a)\n    for i in range(n - 1):\n        swapped = False\n        for j in range(n - i - 1):\n            if a[j] > a[j+1]:\n                a[j], a[j+1] = a[j+1], a[j]\n                swapped = True\n        if not swapped:\n            break\n    return a`,
    generate: bubbleSort,
  },
  {
    id: "selection",
    name: "Selection Sort",
    timeBest: "O(n²)", timeAvg: "O(n²)", timeWorst: "O(n²)",
    space: "O(1)", stable: false, inPlace: true,
    description: "Each pass finds the minimum of the unsorted portion and swaps it to the front.",
    advantages: ["Minimum number of swaps", "Simple and predictable"],
    disadvantages: ["Always O(n²) — even on sorted data", "Not stable"],
    applications: ["Environments where swap cost is very high"],
    code: `def selection_sort(a):\n    n = len(a)\n    for i in range(n):\n        m = i\n        for j in range(i+1, n):\n            if a[j] < a[m]:\n                m = j\n        a[i], a[m] = a[m], a[i]\n    return a`,
    generate: selectionSort,
  },
  {
    id: "insertion",
    name: "Insertion Sort",
    timeBest: "O(n)", timeAvg: "O(n²)", timeWorst: "O(n²)",
    space: "O(1)", stable: true, inPlace: true,
    description: "Build the sorted portion one element at a time by inserting each new element into place.",
    advantages: ["Very fast on nearly-sorted data", "Stable and in-place"],
    disadvantages: ["Poor on large random data"],
    applications: ["Small arrays", "Nearly-sorted data", "Sub-routine inside TimSort"],
    code: `def insertion_sort(a):\n    for i in range(1, len(a)):\n        j = i\n        while j > 0 and a[j-1] > a[j]:\n            a[j-1], a[j] = a[j], a[j-1]\n            j -= 1\n    return a`,
    generate: insertionSort,
  },
  {
    id: "merge",
    name: "Merge Sort",
    timeBest: "O(n log n)", timeAvg: "O(n log n)", timeWorst: "O(n log n)",
    space: "O(n)", stable: true, inPlace: false,
    description: "Recursively split the array in half, sort each half, then merge them in order.",
    advantages: ["Guaranteed O(n log n)", "Stable"],
    disadvantages: ["Requires extra space", "Slower than QuickSort in practice for arrays"],
    applications: ["External sorting", "Linked lists", "When stability is required"],
    code: `def merge_sort(a):\n    if len(a) <= 1: return a\n    m = len(a) // 2\n    l = merge_sort(a[:m])\n    r = merge_sort(a[m:])\n    out, i, j = [], 0, 0\n    while i < len(l) and j < len(r):\n        if l[i] <= r[j]:\n            out.append(l[i]); i += 1\n        else:\n            out.append(r[j]); j += 1\n    out.extend(l[i:]); out.extend(r[j:])\n    return out`,
    generate: mergeSort,
  },
  {
    id: "quick",
    name: "Quick Sort",
    timeBest: "O(n log n)", timeAvg: "O(n log n)", timeWorst: "O(n²)",
    space: "O(log n)", stable: false, inPlace: true,
    description: "Pick a pivot, partition the array around it, then recurse on each side.",
    advantages: ["Very fast in practice", "In-place"],
    disadvantages: ["Worst case O(n²)", "Not stable"],
    applications: ["General-purpose sorting", "Numeric arrays"],
    code: `def quick_sort(a, l=0, r=None):\n    if r is None: r = len(a) - 1\n    if l >= r: return a\n    p = a[r]\n    i = l - 1\n    for j in range(l, r):\n        if a[j] < p:\n            i += 1\n            a[i], a[j] = a[j], a[i]\n    a[i+1], a[r] = a[r], a[i+1]\n    quick_sort(a, l, i)\n    quick_sort(a, i+2, r)\n    return a`,
    generate: quickSort,
  },
  {
    id: "heap",
    name: "Heap Sort",
    timeBest: "O(n log n)", timeAvg: "O(n log n)", timeWorst: "O(n log n)",
    space: "O(1)", stable: false, inPlace: true,
    description: "Build a max-heap, then repeatedly extract the max to the end.",
    advantages: ["Guaranteed O(n log n)", "In-place"],
    disadvantages: ["Not stable", "Poor cache locality"],
    applications: ["Priority queues", "Systems where worst case matters"],
    code: `import heapq\n\ndef heap_sort(a):\n    h = a[:]\n    heapq.heapify(h)\n    return [heapq.heappop(h) for _ in range(len(h))]`,
    generate: heapSort,
  },
  {
    id: "counting",
    name: "Counting Sort",
    timeBest: "O(n + k)", timeAvg: "O(n + k)", timeWorst: "O(n + k)",
    space: "O(k)", stable: true, inPlace: false,
    description: "Count how many times each value occurs, then reconstruct the array in order.",
    advantages: ["Linear when k is small", "Stable"],
    disadvantages: ["Only for integers", "Uses O(k) space"],
    applications: ["Sorting small-range integers", "Digit step of Radix Sort"],
    code: `def counting_sort(a):\n    m = max(a)\n    c = [0] * (m + 1)\n    for x in a: c[x] += 1\n    out = []\n    for v, count in enumerate(c):\n        out.extend([v] * count)\n    return out`,
    generate: countingSort,
  },
  {
    id: "radix",
    name: "Radix Sort",
    timeBest: "O(nk)", timeAvg: "O(nk)", timeWorst: "O(nk)",
    space: "O(n + k)", stable: true, inPlace: false,
    description: "Sort by each digit from least to most significant, using a stable sub-sort each pass.",
    advantages: ["Linear time for fixed-width keys"],
    disadvantages: ["Only for integers / fixed-length keys"],
    applications: ["Sorting IDs, dates, phone numbers"],
    code: `def radix_sort(a):\n    exp = 1\n    while max(a) // exp > 0:\n        buckets = [[] for _ in range(10)]\n        for x in a:\n            buckets[(x // exp) % 10].append(x)\n        a = [x for b in buckets for x in b]\n        exp *= 10\n    return a`,
    generate: radixSort,
  },
  {
    id: "bucket",
    name: "Bucket Sort",
    timeBest: "O(n + k)", timeAvg: "O(n + k)", timeWorst: "O(n²)",
    space: "O(n)", stable: true, inPlace: false,
    description: "Distribute values into buckets by range, sort each bucket, then concatenate.",
    advantages: ["Great for uniform distributions"],
    disadvantages: ["Bad on skewed data", "Requires knowing the range"],
    applications: ["Uniformly-distributed floating point numbers"],
    code: `def bucket_sort(a):\n    n = len(a)\n    m = max(a) + 1\n    buckets = [[] for _ in range(n)]\n    for x in a:\n        i = min(n - 1, x * n // m)\n        buckets[i].append(x)\n    return [x for b in buckets for x in sorted(b)]`,
    generate: bucketSort,
  },
  {
    id: "shell",
    name: "Shell Sort",
    timeBest: "O(n log n)", timeAvg: "O(n^{1.25})", timeWorst: "O(n²)",
    space: "O(1)", stable: false, inPlace: true,
    description: "Generalized insertion sort — sort elements far apart, then progressively closer.",
    advantages: ["Faster than insertion for medium arrays", "In-place"],
    disadvantages: ["Complexity depends on gap sequence"],
    applications: ["Embedded systems where memory is tight"],
    code: `def shell_sort(a):\n    n = len(a)\n    gap = n // 2\n    while gap:\n        for i in range(gap, n):\n            tmp, j = a[i], i\n            while j >= gap and a[j-gap] > tmp:\n                a[j] = a[j-gap]\n                j -= gap\n            a[j] = tmp\n        gap //= 2\n    return a`,
    generate: shellSort,
  },
  {
    id: "tim",
    name: "TimSort (Python's built-in)",
    timeBest: "O(n)", timeAvg: "O(n log n)", timeWorst: "O(n log n)",
    space: "O(n)", stable: true, inPlace: false,
    description: "Hybrid of merge sort and insertion sort — the algorithm Python uses for list.sort() and sorted().",
    advantages: ["Extremely fast on real-world data", "Stable", "O(n) on already-sorted input"],
    disadvantages: ["More complex implementation"],
    applications: ["Python's list.sort()", "Java's Arrays.sort() for objects", "Android, V8"],
    code: `# Python already uses TimSort — just call:\nnums.sort()\nnew = sorted(nums)`,
    generate: timSort,
  },
];
