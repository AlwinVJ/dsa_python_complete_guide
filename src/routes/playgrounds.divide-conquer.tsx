import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { PageShell, PageHeader, Callout, ComplexityBadge } from "@/components/Callout";
import { CodeBlock } from "@/components/CodeBlock";
import {
  Play,
  Pause,
  RotateCcw,
  Shuffle,
  StepForward,
  StepBack,
  BookOpen,
  ArrowRight,
  Split,
  Search,
  ArrowUpDown,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const Route = createFileRoute("/playgrounds/divide-conquer")({
  head: () => ({
    meta: [
      { title: "Divide & Conquer Playground — DSA with Python" },
      {
        name: "description",
        content:
          "Interactive Divide & Conquer visualizer — step through Binary Search, Merge Sort, and Quick Sort and watch the recursion tree construct live.",
      },
      { property: "og:title", content: "Divide & Conquer Playground — DSA with Python" },
      {
        property: "og:description",
        content:
          "Observe recursive splitting, merging, and complete recursion trees for Divide & Conquer algorithms.",
      },
    ],
  }),
  component: Page,
});

/* ---------- Trace types ---------- */
type TreeNodeViz = {
  id: string;
  label: string; // e.g. "binary_search(0, 11)" or "merge_sort([38, 27...])"
  array?: number[]; // slice elements at this subproblem
  status: "pending" | "active" | "base" | "done";
  badge?: string; // return value e.g. "ret: 4" or "sorted: [3, 9]"
  children: TreeNodeViz[];
};

type TraceStep = {
  tree: TreeNodeViz; // full snapshot of the tree state at this step
  array: number[]; // main array elements
  highlightIndices: number[]; // e.g. pivot, found index
  compareIndices: number[]; // indices being compared
  sortedIndices: number[]; // elements that are fully sorted at this step
  note: string; // textual explanation of the step
  lineNo?: number; // code highlight line
};

/* ---------- SVG Layout logic ---------- */
type PositionedNode = {
  node: TreeNodeViz;
  x: number;
  y: number;
  depth: number;
};

type PositionedEdge = {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
};

function layoutTree(root: TreeNodeViz, gapX = 64, gapY = 72) {
  const nodes: PositionedNode[] = [];
  const edges: PositionedEdge[] = [];
  let nextX = 0;

  function walk(node: TreeNodeViz, depth: number): PositionedNode {
    const children = node.children ?? [];
    if (children.length === 0) {
      const p: PositionedNode = { node, x: nextX++ * gapX, y: depth * gapY, depth };
      nodes.push(p);
      return p;
    }
    const childPos = children.map((c) => walk(c, depth + 1));
    const midX = (childPos[0].x + childPos[childPos.length - 1].x) / 2;
    const p: PositionedNode = { node, x: midX, y: depth * gapY, depth };
    nodes.push(p);
    for (const cp of childPos) {
      edges.push({ fromX: p.x, fromY: p.y, toX: cp.x, toY: cp.y });
    }
    return p;
  }

  walk(root, 0);

  const minX = Math.min(...nodes.map((n) => n.x));
  const maxX = Math.max(...nodes.map((n) => n.x));
  const maxY = Math.max(...nodes.map((n) => n.y));

  // Shift nodes so minX is 0
  for (const n of nodes) {
    n.x = n.x - minX;
  }
  for (const e of edges) {
    e.fromX = e.fromX - minX;
    e.toX = e.toX - minX;
  }

  const width = maxX - minX + gapX;
  const height = maxY + gapY;

  return { nodes, edges, width, height };
}

/* ---------- Code snippets ---------- */
const CODE_SNIPPETS: Record<string, string> = {
  "binary-search": `def binary_search(arr, target, lo, hi):
    if lo > hi:
        return -1
    mid = (lo + hi) // 2
    if arr[mid] == target:
        return mid
    elif arr[mid] > target:
        return binary_search(arr, target, lo, mid - 1)
    else:
        return binary_search(arr, target, mid + 1, hi)`,
  "merge-sort": `def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    return merge(left, right)

def merge(left, right):
    res = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            res.append(left[i]); i += 1
        else:
            res.append(right[j]); j += 1
    res.extend(left[i:])
    res.extend(right[j:])
    return res`,
  "quick-sort": `def quicksort(arr, lo, hi):
    if lo < hi:
        p = partition(arr, lo, hi)
        quicksort(arr, lo, p - 1)
        quicksort(arr, p + 1, hi)

def partition(arr, lo, hi):
    pivot = arr[hi]
    i = lo - 1
    for j in range(lo, hi):
        if arr[j] <= pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    arr[i+1], arr[hi] = arr[hi], arr[i+1]
    return i + 1`,
};

/* ---------- Trace generators ---------- */
function copyTree(node: TreeNodeViz): TreeNodeViz {
  return {
    ...node,
    children: node.children.map(copyTree),
  };
}

// Find a node by ID and update it
function updateNodeInTree(root: TreeNodeViz, id: string, updater: (node: TreeNodeViz) => void): TreeNodeViz {
  const nextRoot = copyTree(root);
  function findAndApply(node: TreeNodeViz): boolean {
    if (node.id === id) {
      updater(node);
      return true;
    }
    for (const child of node.children) {
      if (findAndApply(child)) return true;
    }
    return false;
  }
  findAndApply(nextRoot);
  return nextRoot;
}

/* 1. Binary Search Tracer */
function generateBinarySearchTrace(arr: number[], target: number): TraceStep[] {
  const steps: TraceStep[] = [];
  const mainArr = [...arr].sort((a, b) => a - b); // Ensure sorted

  // Pre-build full recursion tree structure
  const rootId = "bs-0";
  const rootNode: TreeNodeViz = {
    id: rootId,
    label: `bs(0, ${mainArr.length - 1})`,
    array: mainArr,
    status: "pending",
    children: [],
  };

  let currentTree = rootNode;

  function run(lo: number, hi: number, parentId: string, nodeNum: number): number {
    const nodeId = `${parentId}-${nodeNum}`;
    const label = `bs(${lo}, ${hi})`;
    const subArr = mainArr.slice(lo, hi + 1);

    const newNode: TreeNodeViz = {
      id: nodeId,
      label,
      array: subArr,
      status: "pending",
      children: [],
    };

    if (parentId === rootId) {
      currentTree = updateNodeInTree(currentTree, parentId, (n) => {
        n.children.push(newNode);
      });
    } else if (parentId !== "") {
      currentTree = updateNodeInTree(currentTree, parentId, (n) => {
        n.children.push(newNode);
      });
    } else {
      currentTree = newNode; // root
    }

    // Step: Enter function
    currentTree = updateNodeInTree(currentTree, nodeId, (n) => {
      n.status = "active";
    });
    steps.push({
      tree: copyTree(currentTree),
      array: mainArr,
      highlightIndices: lo <= hi ? [Math.floor((lo + hi) / 2)] : [],
      compareIndices: [],
      sortedIndices: [],
      note: `Entering binary_search with range [${lo}..${hi}]. Size is ${hi - lo + 1}.`,
      lineNo: 1,
    });

    if (lo > hi) {
      // Step: Base case not found
      currentTree = updateNodeInTree(currentTree, nodeId, (n) => {
        n.status = "base";
        n.badge = "ret: -1";
      });
      steps.push({
        tree: copyTree(currentTree),
        array: mainArr,
        highlightIndices: [],
        compareIndices: [],
        sortedIndices: [],
        note: `Base Case: lo (${lo}) > hi (${hi}). Target ${target} not found in this range. Returning -1.`,
        lineNo: 2,
      });
      return -1;
    }

    const mid = Math.floor((lo + hi) / 2);

    // Step: Mid calculation
    steps.push({
      tree: copyTree(currentTree),
      array: mainArr,
      highlightIndices: [mid],
      compareIndices: [],
      sortedIndices: [],
      note: `Calculate midpoint: mid = (${lo} + ${hi}) // 2 = ${mid}. Inspecting arr[${mid}] = ${mainArr[mid]}.`,
      lineNo: 4,
    });

    // Step: Comparison
    steps.push({
      tree: copyTree(currentTree),
      array: mainArr,
      highlightIndices: [mid],
      compareIndices: [mid],
      sortedIndices: [],
      note: `Comparing arr[mid] (${mainArr[mid]}) with target (${target}).`,
      lineNo: 5,
    });

    if (mainArr[mid] === target) {
      currentTree = updateNodeInTree(currentTree, nodeId, (n) => {
        n.status = "done";
        n.badge = `found at: ${mid}`;
      });
      steps.push({
        tree: copyTree(currentTree),
        array: mainArr,
        highlightIndices: [mid],
        compareIndices: [],
        sortedIndices: [mid],
        note: `Found target ${target} at index ${mid}! Returning ${mid}.`,
        lineNo: 6,
      });
      return mid;
    }

    if (mainArr[mid] > target) {
      // Step: Recurse left
      currentTree = updateNodeInTree(currentTree, nodeId, (n) => {
        n.status = "done";
      });
      steps.push({
        tree: copyTree(currentTree),
        array: mainArr,
        highlightIndices: [mid],
        compareIndices: [],
        sortedIndices: [],
        note: `Target ${target} is smaller than arr[mid] (${mainArr[mid]}). Recursing left: [${lo}..${mid - 1}].`,
        lineNo: 8,
      });
      const ret = run(lo, mid - 1, nodeId, 1);
      currentTree = updateNodeInTree(currentTree, nodeId, (n) => {
        n.badge = `ret: ${ret}`;
      });
      steps.push({
        tree: copyTree(currentTree),
        array: mainArr,
        highlightIndices: [],
        compareIndices: [],
        sortedIndices: ret !== -1 ? [ret] : [],
        note: `Returned value ${ret} back to parent call ${label}.`,
        lineNo: 8,
      });
      return ret;
    } else {
      // Step: Recurse right
      currentTree = updateNodeInTree(currentTree, nodeId, (n) => {
        n.status = "done";
      });
      steps.push({
        tree: copyTree(currentTree),
        array: mainArr,
        highlightIndices: [mid],
        compareIndices: [],
        sortedIndices: [],
        note: `Target ${target} is larger than arr[mid] (${mainArr[mid]}). Recursing right: [${mid + 1}..${hi}].`,
        lineNo: 10,
      });
      const ret = run(mid + 1, hi, nodeId, 2);
      currentTree = updateNodeInTree(currentTree, nodeId, (n) => {
        n.badge = `ret: ${ret}`;
      });
      steps.push({
        tree: copyTree(currentTree),
        array: mainArr,
        highlightIndices: [],
        compareIndices: [],
        sortedIndices: ret !== -1 ? [ret] : [],
        note: `Returned value ${ret} back to parent call ${label}.`,
        lineNo: 10,
      });
      return ret;
    }
  }

  run(0, mainArr.length - 1, "", 0);
  return steps;
}

/* 2. Merge Sort Tracer */
function generateMergeSortTrace(arr: number[]): TraceStep[] {
  const steps: TraceStep[] = [];
  let activeArr = [...arr];

  // Pre-build root
  const rootId = "ms-0";
  const rootNode: TreeNodeViz = {
    id: rootId,
    label: `merge_sort(${activeArr.join(",")})`,
    array: [...activeArr],
    status: "pending",
    children: [],
  };

  let currentTree = rootNode;

  function run(lo: number, hi: number, parentId: string, nodeNum: number): number[] {
    const nodeId = parentId === "" ? rootId : `${parentId}-${nodeNum}`;
    const len = hi - lo + 1;
    const sub = activeArr.slice(lo, hi + 1);
    const label = `sort([${sub.join(",")}])`;

    const newNode: TreeNodeViz = {
      id: nodeId,
      label,
      array: [...sub],
      status: "pending",
      children: [],
    };

    if (parentId !== "") {
      currentTree = updateNodeInTree(currentTree, parentId, (n) => {
        n.children.push(newNode);
      });
    } else {
      currentTree = newNode; // root
    }

    // Step: Enter call
    currentTree = updateNodeInTree(currentTree, nodeId, (n) => {
      n.status = "active";
    });
    steps.push({
      tree: copyTree(currentTree),
      array: [...activeArr],
      highlightIndices: Array.from({ length: len }, (_, idx) => lo + idx),
      compareIndices: [],
      sortedIndices: [],
      note: `Entering merge_sort on range [${lo}..${hi}] with subarray [${sub.join(", ")}].`,
      lineNo: 1,
    });

    if (len <= 1) {
      // Step: Base case
      currentTree = updateNodeInTree(currentTree, nodeId, (n) => {
        n.status = "base";
        n.badge = `sorted: ${sub[0]}`;
      });
      steps.push({
        tree: copyTree(currentTree),
        array: [...activeArr],
        highlightIndices: [lo],
        compareIndices: [],
        sortedIndices: [lo],
        note: `Base Case: Subarray size <= 1. Already sorted! Returning [${sub[0]}].`,
        lineNo: 2,
      });
      return [...sub];
    }

    const mid = Math.floor((lo + hi) / 2);

    // Step: Dividing
    currentTree = updateNodeInTree(currentTree, nodeId, (n) => {
      n.status = "done";
    });
    steps.push({
      tree: copyTree(currentTree),
      array: [...activeArr],
      highlightIndices: [mid],
      compareIndices: [],
      sortedIndices: [],
      note: `Divide: Split array of size ${len} at mid index ${mid}. Left: [${lo}..${mid}], Right: [${mid + 1}..${hi}].`,
      lineNo: 4,
    });

    const leftSorted = run(lo, mid, nodeId, 1);
    const rightSorted = run(mid + 1, hi, nodeId, 2);

    // Step: Start merge
    currentTree = updateNodeInTree(currentTree, nodeId, (n) => {
      n.status = "active";
    });
    steps.push({
      tree: copyTree(currentTree),
      array: [...activeArr],
      highlightIndices: [],
      compareIndices: [],
      sortedIndices: [],
      note: `Combine: Start merging sorted left [${leftSorted.join(", ")}] and right [${rightSorted.join(", ")}].`,
      lineNo: 6,
    });

    // Merge simulation
    const merged: number[] = [];
    let i = 0;
    let j = 0;

    while (i < leftSorted.length && j < rightSorted.length) {
      const idxLeft = lo + i;
      const idxRight = mid + 1 + j;

      // Step: Compare merge elements
      steps.push({
        tree: copyTree(currentTree),
        array: [...activeArr],
        highlightIndices: [],
        compareIndices: [idxLeft, idxRight],
        sortedIndices: [],
        note: `Comparing left element ${leftSorted[i]} at index ${idxLeft} and right element ${rightSorted[j]} at index ${idxRight}.`,
        lineNo: 11,
      });

      if (leftSorted[i] <= rightSorted[j]) {
        merged.push(leftSorted[i]);
        i++;
      } else {
        merged.push(rightSorted[j]);
        j++;
      }
    }

    while (i < leftSorted.length) {
      merged.push(leftSorted[i]);
      i++;
    }
    while (j < rightSorted.length) {
      merged.push(rightSorted[j]);
      j++;
    }

    // Write merged values back into activeArr
    for (let k = 0; k < merged.length; k++) {
      activeArr[lo + k] = merged[k];
    }

    // Step: Merge done
    currentTree = updateNodeInTree(currentTree, nodeId, (n) => {
      n.status = "done";
      n.badge = `sorted: [${merged.join(",")}]`;
      n.array = [...merged];
    });
    steps.push({
      tree: copyTree(currentTree),
      array: [...activeArr],
      highlightIndices: Array.from({ length: merged.length }, (_, k) => lo + k),
      compareIndices: [],
      sortedIndices: Array.from({ length: merged.length }, (_, k) => lo + k),
      note: `Merged sorted run successfully. Active subarray is now [${merged.join(", ")}].`,
      lineNo: 15,
    });

    return merged;
  }

  run(0, activeArr.length - 1, "", 0);
  return steps;
}

/* 3. Quick Sort Tracer */
function generateQuickSortTrace(arr: number[]): TraceStep[] {
  const steps: TraceStep[] = [];
  let activeArr = [...arr];

  // Pre-build root
  const rootId = "qs-0";
  const rootNode: TreeNodeViz = {
    id: rootId,
    label: `quicksort(${activeArr.join(",")})`,
    array: [...activeArr],
    status: "pending",
    children: [],
  };

  let currentTree = rootNode;

  function run(lo: number, hi: number, parentId: string, nodeNum: number) {
    const nodeId = parentId === "" ? rootId : `${parentId}-${nodeNum}`;
    const sub = activeArr.slice(lo, hi + 1);
    const label = `qs([${sub.join(",")}])`;

    const newNode: TreeNodeViz = {
      id: nodeId,
      label,
      array: [...sub],
      status: "pending",
      children: [],
    };

    if (parentId !== "") {
      currentTree = updateNodeInTree(currentTree, parentId, (n) => {
        n.children.push(newNode);
      });
    } else {
      currentTree = newNode; // root
    }

    // Step: Enter call
    currentTree = updateNodeInTree(currentTree, nodeId, (n) => {
      n.status = "active";
    });
    steps.push({
      tree: copyTree(currentTree),
      array: [...activeArr],
      highlightIndices: Array.from({ length: hi - lo + 1 }, (_, idx) => lo + idx),
      compareIndices: [],
      sortedIndices: [],
      note: `Entering quicksort on range [${lo}..${hi}] with subarray [${sub.join(", ")}].`,
      lineNo: 1,
    });

    if (lo >= hi) {
      currentTree = updateNodeInTree(currentTree, nodeId, (n) => {
        n.status = "base";
        n.badge = `sorted`;
      });
      steps.push({
        tree: copyTree(currentTree),
        array: [...activeArr],
        highlightIndices: lo === hi ? [lo] : [],
        compareIndices: [],
        sortedIndices: lo === hi ? [lo] : [],
        note: `Base Case: Range contains ${hi - lo + 1} elements. Already sorted.`,
        lineNo: 2,
      });
      return;
    }

    // Partition step simulation
    const pivot = activeArr[hi];
    steps.push({
      tree: copyTree(currentTree),
      array: [...activeArr],
      highlightIndices: [hi],
      compareIndices: [],
      sortedIndices: [],
      note: `Partitioning: Selected pivot element ${pivot} at index ${hi}.`,
      lineNo: 7,
    });

    let i = lo - 1;
    for (let j = lo; j < hi; j++) {
      steps.push({
        tree: copyTree(currentTree),
        array: [...activeArr],
        highlightIndices: [hi, j],
        compareIndices: [j, hi],
        sortedIndices: [],
        note: `Comparing arr[${j}] (${activeArr[j]}) with pivot (${pivot}).`,
        lineNo: 10,
      });

      if (activeArr[j] <= pivot) {
        i++;
        if (i !== j) {
          const tmp = activeArr[i];
          activeArr[i] = activeArr[j];
          activeArr[j] = tmp;
          steps.push({
            tree: copyTree(currentTree),
            array: [...activeArr],
            highlightIndices: [i, j],
            compareIndices: [],
            sortedIndices: [],
            note: `arr[${j}] <= pivot. Increment pointer i to ${i} and swap arr[${i}] and arr[${j}].`,
            lineNo: 12,
          });
        }
      }
    }

    const pIndex = i + 1;
    if (pIndex !== hi) {
      const tmp = activeArr[pIndex];
      activeArr[pIndex] = activeArr[hi];
      activeArr[hi] = tmp;
      steps.push({
        tree: copyTree(currentTree),
        array: [...activeArr],
        highlightIndices: [pIndex, hi],
        compareIndices: [],
        sortedIndices: [],
        note: `Place pivot in its correct position by swapping arr[${pIndex}] and arr[${hi}].`,
        lineNo: 13,
      });
    }

    currentTree = updateNodeInTree(currentTree, nodeId, (n) => {
      n.status = "done";
      n.badge = `piv: ${pIndex}`;
    });
    steps.push({
      tree: copyTree(currentTree),
      array: [...activeArr],
      highlightIndices: [pIndex],
      compareIndices: [],
      sortedIndices: [pIndex],
      note: `Partitioning complete. Pivot ${pivot} is now in its final sorted position at index ${pIndex}.`,
      lineNo: 14,
    });

    // Recurse left and right
    run(lo, pIndex - 1, nodeId, 1);
    run(pIndex + 1, hi, nodeId, 2);

    currentTree = updateNodeInTree(currentTree, nodeId, (n) => {
      n.status = "done";
      n.badge = "sorted";
    });
    steps.push({
      tree: copyTree(currentTree),
      array: [...activeArr],
      highlightIndices: [],
      compareIndices: [],
      sortedIndices: Array.from({ length: hi - lo + 1 }, (_, idx) => lo + idx),
      note: `Quick Sort completed for range [${lo}..${hi}].`,
      lineNo: 4,
    });
  }

  run(0, activeArr.length - 1, "", 0);
  return steps;
}

const ALGORITHMS_LIST = [
  {
    id: "binary-search",
    name: "Binary Search",
    tagline: "Logarithmic search on a sorted array",
    best: "O(1)",
    avg: "O(log n)",
    worst: "O(log n)",
    space: "O(log n) recursive stack",
    description:
      "A classic D&C algorithm that solves the search problem. It divides the sorted list at the midpoint, conquers by recursing into the active half, and combines via a no-op.",
  },
  {
    id: "merge-sort",
    name: "Merge Sort",
    tagline: "Stable, divide & conquer sort",
    best: "O(n log n)",
    avg: "O(n log n)",
    worst: "O(n log n)",
    space: "O(n)",
    description:
      "A flagship divide & conquer sorting algorithm. It splits the array down the middle, recursively sorts the halves, and merges the sorted subproblems in linear O(n) time.",
  },
  {
    id: "quick-sort",
    name: "Quick Sort",
    tagline: "Efficient, in-place sorting",
    best: "O(n log n)",
    avg: "O(n log n)",
    worst: "O(n²)",
    space: "O(log n) stack",
    description:
      "An in-place sorting algorithm. It partitions elements around a pivot, recursively sorts the resulting left and right halves, and combines via a no-op since sorting happens in-place.",
  },
  {
    id: "maximum-subarray",
    name: "Maximum Subarray",
    tagline: "Finding the maximum contiguous sum",
    comingSoon: true,
  },
  {
    id: "closest-pair",
    name: "Closest Pair of Points",
    tagline: "Find closest coordinates on a 2D plane",
    comingSoon: true,
  },
];

const DEFAULT_ARRAY = [38, 27, 43, 3, 9, 82, 10];
const DEFAULT_TARGET = 10;

function Page() {
  const [algoId, setAlgoId] = useState("binary-search");
  const [customArrayStr, setCustomArrayStr] = useState("3, 9, 10, 27, 38, 43, 82");
  const [targetVal, setTargetVal] = useState("10");
  const [speed, setSpeed] = useState(250);
  const [running, setRunning] = useState(false);
  const [step, setStep] = useState(0);
  const [seed, setSeed] = useState(0);
  const [arrayInputMode, setArrayInputMode] = useState<"random" | "custom">("random");
  const [size, setSize] = useState(7);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const activeAlgo = ALGORITHMS_LIST.find((a) => a.id === algoId)!;

  // Generate random array
  const array = useMemo(() => {
    if (activeAlgo.comingSoon) return [];
    if (arrayInputMode === "custom") {
      const parsed = customArrayStr
        .split(",")
        .map((x) => parseInt(x.trim(), 10))
        .filter((x) => !isNaN(x));
      if (parsed.length === 0) return DEFAULT_ARRAY;
      if (algoId === "binary-search") {
        parsed.sort((a, b) => a - b);
      }
      return parsed;
    }
    const arr = Array.from({ length: size }, () => Math.floor(Math.random() * 90) + 5);
    if (algoId === "binary-search") {
      arr.sort((a, b) => a - b);
    }
    return arr;
  }, [arrayInputMode, customArrayStr, size, seed, algoId, activeAlgo.comingSoon]);

  const target = useMemo(() => {
    const num = parseInt(targetVal, 10);
    return isNaN(num) ? DEFAULT_TARGET : num;
  }, [targetVal]);

  // Generate trace steps
  const steps = useMemo(() => {
    if (activeAlgo.comingSoon) return [];
    if (algoId === "binary-search") {
      return generateBinarySearchTrace(array, target);
    }
    if (algoId === "merge-sort") {
      return generateMergeSortTrace(array);
    }
    if (algoId === "quick-sort") {
      return generateQuickSortTrace(array);
    }
    return [];
  }, [algoId, array, target, activeAlgo.comingSoon]);

  // Reset steps
  useEffect(() => {
    setStep(0);
    setRunning(false);
  }, [algoId, arrayInputMode, customArrayStr, size, seed, targetVal]);

  // Playback timer
  useEffect(() => {
    if (!running) {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
      return;
    }
    timerRef.current = setInterval(() => {
      setStep((s) => {
        if (s >= steps.length - 1) {
          setRunning(false);
          return s;
        }
        return s + 1;
      });
    }, speed);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [running, speed, steps.length]);

  const currentStep = steps[Math.min(step, steps.length - 1)] || {
    array,
    tree: null,
    highlightIndices: [],
    compareIndices: [],
    sortedIndices: [],
    note: "Initial state",
    lineNo: 0,
  };

  const layout = useMemo(() => {
    if (!currentStep.tree) return null;
    return layoutTree(currentStep.tree);
  }, [currentStep.tree]);

  // Count comparisons and calls
  const stats = useMemo(() => {
    let comparisons = 0;
    let calls = 0;
    for (let i = 0; i <= Math.min(step, steps.length - 1); i++) {
      const s = steps[i];
      if (s) {
        if (s.compareIndices && s.compareIndices.length > 0) comparisons++;
        if (s.note.startsWith("Entering")) calls++;
      }
    }
    return { comparisons, calls };
  }, [step, steps]);

  return (
    <PageShell>
      <PageHeader
        eyebrow="Playground"
        title="Divide & Conquer Playground"
        description="Visualize recursive splitting, merging, partitioning, and the building of recursion trees step by step. Tweak inputs and speed to master recursive flow."
      />

      {/* Algorithm selector */}
      <div className="mb-4">
        <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Algorithm
        </div>
        <div className="flex flex-wrap gap-2">
          {ALGORITHMS_LIST.map((a) => (
            <button
              key={a.id}
              onClick={() => {
                setAlgoId(a.id);
                setStep(0);
                setRunning(false);
                if (a.id === "binary-search") {
                  setCustomArrayStr("3, 9, 10, 27, 38, 43, 82");
                } else {
                  setCustomArrayStr("38, 27, 43, 3, 9, 82, 10");
                }
              }}
              className={`rounded-full border px-3 py-1 text-xs transition ${
                a.id === algoId
                  ? "border-[color:var(--brand)] bg-[color:var(--brand)]/15 text-foreground font-semibold"
                  : "border-border bg-card text-muted-foreground hover:bg-accent"
              }`}
            >
              {a.name} {a.comingSoon && <span className="text-[10px] text-amber-500 font-mono">(Soon)</span>}
            </button>
          ))}
        </div>
      </div>

      {activeAlgo.comingSoon ? (
        <div className="card-surface flex flex-col items-center justify-center p-12 text-center">
          <Sparkles className="h-10 w-10 text-amber-500 mb-3 animate-pulse" />
          <h3 className="text-lg font-semibold">{activeAlgo.name} Playground</h3>
          <p className="text-sm text-muted-foreground max-w-md mt-1">
            This visualizer is currently in our roadmap backlog. The underlying educational content is fully available in the lessons. Keep an eye out for future updates!
          </p>
          <div className="mt-6 flex gap-3">
            <Link
              to="/learn/$course"
              params={{ course: "divide-and-conquer" }}
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-4 py-2 text-sm hover:bg-accent font-medium"
            >
              <BookOpen className="h-4 w-4" /> Go to Lessons
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Controls & Inputs */}
          <div className="card-surface mb-6 p-4 space-y-4">
            {/* Playback buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setRunning((r) => !r)}
                className="inline-flex items-center gap-1.5 rounded-md gradient-brand px-3 py-1.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition"
              >
                {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {running ? "Pause" : step === 0 ? "Start" : "Resume"}
              </button>
              <button
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                className="rounded-md border border-border bg-card p-1.5 hover:bg-accent"
                disabled={step === 0}
                aria-label="Step back"
              >
                <StepBack className="h-4 w-4" />
              </button>
              <button
                onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))}
                className="rounded-md border border-border bg-card p-1.5 hover:bg-accent"
                disabled={step >= steps.length - 1}
                aria-label="Step forward"
              >
                <StepForward className="h-4 w-4" />
              </button>
              <button
                onClick={() => {
                  setStep(0);
                  setRunning(false);
                }}
                className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-3 py-1.5 text-sm hover:bg-accent font-semibold"
                disabled={step === 0}
              >
                <RotateCcw className="h-4 w-4" /> Reset
              </button>
              <button
                onClick={() => {
                  setSeed((n) => n + 1);
                  setRunning(false);
                }}
                className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-3 py-1.5 text-sm hover:bg-accent font-semibold"
                disabled={arrayInputMode === "custom"}
              >
                <Shuffle className="h-4 w-4" /> Randomize
              </button>

              <label className="flex items-center gap-2 text-xs text-muted-foreground ml-2">
                Input Mode
                <select
                  value={arrayInputMode}
                  onChange={(e) => setArrayInputMode(e.target.value as any)}
                  className="rounded border border-border bg-card px-2 py-1 text-xs"
                >
                  <option value="random">Random Generator</option>
                  <option value="custom">Custom Values</option>
                </select>
              </label>

              {arrayInputMode === "random" ? (
                <label className="flex items-center gap-2 text-xs text-muted-foreground ml-2">
                  Size
                  <input
                    type="range"
                    min={4}
                    max={12}
                    value={size}
                    onChange={(e) => setSize(Number(e.target.value))}
                    className="w-24"
                  />
                  <span className="font-mono">{size}</span>
                </label>
              ) : (
                <div className="flex items-center gap-2 text-xs text-muted-foreground ml-2">
                  Array
                  <input
                    type="text"
                    value={customArrayStr}
                    onChange={(e) => setCustomArrayStr(e.target.value)}
                    placeholder="e.g. 5, 2, 8, 12, 1"
                    className="w-36 rounded border border-border bg-card px-2 py-1 text-xs text-foreground font-mono"
                  />
                </div>
              )}

              {algoId === "binary-search" && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground ml-2">
                  Target
                  <input
                    type="number"
                    value={targetVal}
                    onChange={(e) => setTargetVal(e.target.value)}
                    className="w-14 rounded border border-border bg-card px-2 py-1 text-xs text-foreground font-mono"
                  />
                </div>
              )}

              <label className="flex items-center gap-2 text-xs text-muted-foreground ml-auto">
                Speed
                <input
                  type="range"
                  min={50}
                  max={1000}
                  step={50}
                  value={1050 - speed}
                  onChange={(e) => setSpeed(1050 - Number(e.target.value))}
                  className="w-24"
                />
              </label>
            </div>
          </div>

          {/* Main Visualizer Panel */}
          <div className="grid gap-6 lg:grid-cols-5">
            {/* Left: Recursion Tree Visualizer (3/5 cols) */}
            <div className="lg:col-span-3 flex flex-col gap-4">
              <div className="card-surface p-4 flex-1 flex flex-col min-h-[380px]">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Split className="h-4 w-4 text-[color:var(--brand)]" /> Recursion Tree
                  </h3>
                  <span className="text-xs text-muted-foreground font-mono">
                    Step {step + 1} / {steps.length}
                  </span>
                </div>

                <div className="flex-1 overflow-auto border border-border/40 rounded bg-muted/20 relative p-4 flex items-center justify-center">
                  {layout ? (
                    <svg
                      viewBox={`0 0 ${Math.max(layout.width, 300)} ${Math.max(layout.height, 300)}`}
                      className="block max-h-[450px] w-full"
                      style={{ minWidth: layout.width, maxWidth: layout.width }}
                    >
                      {/* Edges */}
                      {layout.edges.map((e, idx) => (
                        <motion.path
                          key={`edge-${idx}`}
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          d={`M ${e.fromX + 32} ${e.fromY + 24} C ${e.fromX + 32} ${(e.fromY + e.toY) / 2 + 12}, ${e.toX + 32} ${(e.fromY + e.toY) / 2 + 12}, ${e.toX + 32} ${e.toY + 12}`}
                          fill="none"
                          className="stroke-border/70"
                          strokeWidth={1.5}
                        />
                      ))}

                      {/* Nodes */}
                      {layout.nodes.map((n) => {
                        const statusColors: Record<string, string> = {
                          pending: "fill-muted stroke-border/40 text-muted-foreground",
                          active: "fill-amber-500/15 stroke-amber-500 text-amber-500 font-semibold",
                          base: "fill-emerald-500/15 stroke-emerald-500 text-emerald-500",
                          done: "fill-[color:var(--brand)]/10 stroke-[color:var(--brand)]/60 text-foreground",
                        };
                        const colorClass = statusColors[n.node.status] || statusColors.pending;

                        return (
                          <g key={n.node.id}>
                            <rect
                              x={n.x}
                              y={n.y}
                              width={64}
                              height={32}
                              rx={4}
                              className={`transition-colors ${colorClass}`}
                              strokeWidth={1.5}
                            />
                            <text
                              x={n.x + 32}
                              y={n.y + 16}
                              textAnchor="middle"
                              alignmentBaseline="middle"
                              className="text-[9px] font-mono select-none pointer-events-none fill-current"
                            >
                              {n.node.label.length > 12 ? n.node.label.slice(0, 10) + ".." : n.node.label}
                            </text>
                            {n.node.badge && (
                              <text
                                x={n.x + 32}
                                y={n.y + 26}
                                textAnchor="middle"
                                className="text-[7px] font-mono fill-muted-foreground pointer-events-none"
                              >
                                {n.node.badge}
                              </text>
                            )}
                          </g>
                        );
                      })}
                    </svg>
                  ) : (
                    <div className="text-xs text-muted-foreground">Generating visual layout...</div>
                  )}
                </div>

                <div className="mt-3 flex gap-4 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded border border-border bg-muted" />
                    <span className="text-muted-foreground">Pending</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded border border-amber-500 bg-amber-500/15" />
                    <span className="text-amber-500 font-medium">Active Call</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded border border-emerald-500 bg-emerald-500/15" />
                    <span className="text-emerald-500">Base Case</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded border border-[color:var(--brand)]/60 bg-[color:var(--brand)]/10" />
                    <span className="text-foreground">Done / Split</span>
                  </div>
                </div>
              </div>

              {/* Array visualizer panel */}
              <div className="card-surface p-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                  Array State
                </h3>
                <div className="flex flex-wrap gap-2 justify-center py-2">
                  {currentStep.array.map((val, idx) => {
                    const isHighlight = currentStep.highlightIndices.includes(idx);
                    const isCompare = currentStep.compareIndices.includes(idx);
                    const isSorted = currentStep.sortedIndices.includes(idx);

                    let bg = "bg-card border-border text-foreground";
                    if (isHighlight) {
                      bg = "bg-amber-500/20 border-amber-500 text-amber-500 font-bold scale-105 shadow-sm";
                    } else if (isCompare) {
                      bg = "bg-rose-500/20 border-rose-500 text-rose-500 font-bold scale-105 animate-pulse";
                    } else if (isSorted) {
                      bg = "bg-emerald-500/20 border-emerald-500 text-emerald-500";
                    }

                    return (
                      <div
                        key={idx}
                        className={`w-10 h-10 rounded border flex flex-col items-center justify-center text-xs font-mono transition-all ${bg}`}
                      >
                        <div>{val}</div>
                        <div className="text-[8px] text-muted-foreground select-none mt-0.5">#{idx}</div>
                      </div>
                    );
                  })}
                </div>
                <div className="text-xs text-muted-foreground text-center mt-2 italic">
                  {currentStep.note}
                </div>
              </div>
            </div>

            {/* Right: Code Block & Step Description (2/5 cols) */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              <div className="card-surface p-4 flex-1 flex flex-col">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                  Python Implementation
                </h3>
                <div className="flex-1 overflow-auto rounded border border-border/40 font-mono text-[11px] bg-code-bg p-3 relative">
                  {CODE_SNIPPETS[algoId].split("\n").map((line, idx) => {
                    const isActive = currentStep.lineNo === idx + 1;
                    return (
                      <div
                        key={idx}
                        className={`py-0.5 px-2 flex gap-4 ${
                          isActive
                            ? "bg-amber-500/15 border-l-2 border-amber-500 text-amber-200 font-medium"
                            : "text-muted-foreground"
                        }`}
                      >
                        <span className="w-5 text-right select-none text-muted-foreground/40 font-mono">{idx + 1}</span>
                        <pre className="flex-1 whitespace-pre-wrap">{line}</pre>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Statistics & Related Info */}
              <div className="card-surface p-4 space-y-3">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Trace Details
                </h3>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="border border-border/40 bg-muted/10 rounded p-2 text-center">
                    <div className="text-muted-foreground text-[10px]">RECURSIVE CALLS</div>
                    <div className="text-sm font-semibold mt-1">{stats.calls}</div>
                  </div>
                  <div className="border border-border/40 bg-muted/10 rounded p-2 text-center">
                    <div className="text-muted-foreground text-[10px]">COMPARISONS</div>
                    <div className="text-sm font-semibold mt-1">{stats.comparisons}</div>
                  </div>
                </div>

                <div className="border-t border-border/40 pt-3">
                  <div className="text-xs text-muted-foreground flex justify-between mb-1.5">
                    <span>Algorithm:</span>
                    <span className="font-semibold text-foreground">{activeAlgo.name}</span>
                  </div>
                  <div className="text-xs text-muted-foreground flex justify-between mb-1.5">
                    <span>Best Time:</span>
                    <span><ComplexityBadge value={activeAlgo.best} /></span>
                  </div>
                  <div className="text-xs text-muted-foreground flex justify-between mb-1.5">
                    <span>Average Time:</span>
                    <span><ComplexityBadge value={activeAlgo.avg} /></span>
                  </div>
                  <div className="text-xs text-muted-foreground flex justify-between mb-1.5">
                    <span>Space Cost:</span>
                    <span><ComplexityBadge value={activeAlgo.space} /></span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Related Lessons */}
          <div className="mt-8 card-surface p-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Related Lessons
            </h3>
            <div className="flex flex-wrap gap-2">
              <Link
                to="/learn/$course"
                params={{ course: "divide-and-conquer" }}
                className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-sm hover:bg-accent text-muted-foreground hover:text-foreground transition"
              >
                <BookOpen className="h-4 w-4 text-[color:var(--brand)]" /> Divide & Conquer Course Overview
              </Link>
              <Link
                to="/learn/divide-and-conquer/recurrence-relations"
                className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-sm hover:bg-accent text-muted-foreground hover:text-foreground transition"
              >
                <BookOpen className="h-4 w-4 text-[color:var(--brand)]" /> Recurrence Relations Lesson
              </Link>
              <Link
                to="/complexity/time"
                className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-sm hover:bg-accent text-muted-foreground hover:text-foreground transition"
              >
                <BookOpen className="h-4 w-4 text-[color:var(--brand)]" /> Time Complexity Cheat Sheet (Master Theorem)
              </Link>
            </div>
          </div>
        </>
      )}
    </PageShell>
  );
}
