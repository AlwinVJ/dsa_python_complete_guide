import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { PageShell, PageHeader, Callout, ComplexityBadge } from "@/components/Callout";
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
  label: string; // e.g. "bs(0, 11)" or "sort([38, 27])"
  array?: number[]; // slice elements
  status: "pending" | "active" | "base" | "done";
  badge?: string; // return value e.g. "ret: 4" or "sorted: [3, 9]"
  children: TreeNodeViz[];
};

type TraceStep = {
  tree: TreeNodeViz; // full snapshot of the tree state at this step
  array: number[]; // main array elements
  highlightIndices: number[]; // e.g. pivot, found index
  compareIndices: number[]; // indices being compared
  sortedIndices: number[]; // elements that are fully sorted
  note: string; // textual explanation
  lineNo?: number; // code highlight line
  phase: "Initial" | "Divide" | "Conquer" | "Combine" | "Base Case";
  currentCall: string;
  depth: number;
  subproblem: string;
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

function layoutTree(root: TreeNodeViz, gapX = 72, gapY = 64) {
  const nodes: PositionedNode[] = [];
  const edges: PositionedEdge[] = [];
  let nextX = 0;

  function walk(node: TreeNodeViz, depth: number): PositionedNode {
    // Only walk visible / non-pending nodes to grow naturally
    const children = (node.children ?? []).filter((c) => c.status !== "pending");
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

  // Shift nodes to center aligned at 0
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

/* ---------- Trace helpers ---------- */
function copyTree(node: TreeNodeViz): TreeNodeViz {
  return {
    ...node,
    children: node.children.map(copyTree),
  };
}

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
    const nodeId = parentId === "" ? rootId : `${parentId}-${nodeNum}`;
    const label = `bs(${lo}, ${hi})`;
    const subArr = mainArr.slice(lo, hi + 1);

    const newNode: TreeNodeViz = {
      id: nodeId,
      label,
      array: subArr,
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

    const subproblem = `[${subArr.join(", ")}]`;
    const depth = parentId === "" ? 0 : parentId.split("-").length;
    const currentCall = `binary_search(arr, target=${target}, lo=${lo}, hi=${hi})`;

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
      note: `Entering binary_search with range [${lo}..${hi}]. Subproblem size is ${hi - lo + 1}.`,
      lineNo: 1,
      phase: "Conquer",
      currentCall,
      depth,
      subproblem,
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
        note: `Base Case: lo (${lo}) > hi (${hi}). Target ${target} not found. Returning -1.`,
        lineNo: 2,
        phase: "Base Case",
        currentCall,
        depth,
        subproblem,
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
      note: `Calculate midpoint: mid = (${lo} + ${hi}) // 2 = ${mid}. Inspecting value ${mainArr[mid]}.`,
      lineNo: 4,
      phase: "Divide",
      currentCall,
      depth,
      subproblem,
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
      phase: "Conquer",
      currentCall,
      depth,
      subproblem,
    });

    if (mainArr[mid] === target) {
      currentTree = updateNodeInTree(currentTree, nodeId, (n) => {
        n.status = "done";
        n.badge = `found: ${mid}`;
      });
      steps.push({
        tree: copyTree(currentTree),
        array: mainArr,
        highlightIndices: [mid],
        compareIndices: [],
        sortedIndices: [mid],
        note: `Found target ${target} at index ${mid}! Returning index ${mid}.`,
        lineNo: 6,
        phase: "Combine",
        currentCall,
        depth,
        subproblem,
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
        note: `Target ${target} < arr[mid] (${mainArr[mid]}). Recursing into left half [${lo}..${mid - 1}].`,
        lineNo: 8,
        phase: "Divide",
        currentCall,
        depth,
        subproblem,
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
        note: `Left recursive call returned ${ret} to parent ${label}.`,
        lineNo: 8,
        phase: "Combine",
        currentCall,
        depth,
        subproblem,
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
        note: `Target ${target} > arr[mid] (${mainArr[mid]}). Recursing into right half [${mid + 1}..${hi}].`,
        lineNo: 10,
        phase: "Divide",
        currentCall,
        depth,
        subproblem,
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
        note: `Right recursive call returned ${ret} to parent ${label}.`,
        lineNo: 10,
        phase: "Combine",
        currentCall,
        depth,
        subproblem,
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

  const rootId = "ms-0";
  const rootNode: TreeNodeViz = {
    id: rootId,
    label: `sort([${activeArr.join(",")}])`,
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

    const subproblem = `[${sub.join(", ")}]`;
    const depth = parentId === "" ? 0 : parentId.split("-").length;
    const currentCall = `merge_sort(arr[${lo}..${hi}])`;

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
      phase: "Conquer",
      currentCall,
      depth,
      subproblem,
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
        phase: "Base Case",
        currentCall,
        depth,
        subproblem,
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
      phase: "Divide",
      currentCall,
      depth,
      subproblem,
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
      phase: "Combine",
      currentCall: `merge([${leftSorted.join(", ")}], [${rightSorted.join(", ")}])`,
      depth,
      subproblem,
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
        phase: "Combine",
        currentCall: `merge_step(${leftSorted[i]} vs ${rightSorted[j]})`,
        depth,
        subproblem,
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

    for (let k = 0; k < merged.length; k++) {
      activeArr[lo + k] = merged[k];
    }

    // Step: Merge done
    currentTree = updateNodeInTree(currentTree, nodeId, (n) => {
      n.status = "done";
      n.badge = `[${merged.join(",")}]`;
      n.array = [...merged];
    });
    steps.push({
      tree: copyTree(currentTree),
      array: [...activeArr],
      highlightIndices: Array.from({ length: merged.length }, (_, k) => lo + k),
      compareIndices: [],
      sortedIndices: Array.from({ length: merged.length }, (_, k) => lo + k),
      note: `Merged sorted subproblems successfully. Subarray is now [${merged.join(", ")}].`,
      lineNo: 15,
      phase: "Combine",
      currentCall,
      depth,
      subproblem: `[${merged.join(", ")}]`,
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

  const rootId = "qs-0";
  const rootNode: TreeNodeViz = {
    id: rootId,
    label: `qs(0, ${activeArr.length - 1})`,
    array: [...activeArr],
    status: "pending",
    children: [],
  };

  let currentTree = rootNode;

  function run(lo: number, hi: number, parentId: string, nodeNum: number) {
    const nodeId = parentId === "" ? rootId : `${parentId}-${nodeNum}`;
    const sub = activeArr.slice(lo, hi + 1);
    const label = `qs(${lo}, ${hi})`;

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

    const subproblem = `[${sub.join(", ")}]`;
    const depth = parentId === "" ? 0 : parentId.split("-").length;
    const currentCall = `quicksort(arr, lo=${lo}, hi=${hi})`;

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
      phase: "Conquer",
      currentCall,
      depth,
      subproblem,
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
        phase: "Base Case",
        currentCall,
        depth,
        subproblem,
      });
      return;
    }

    const pivot = activeArr[hi];
    steps.push({
      tree: copyTree(currentTree),
      array: [...activeArr],
      highlightIndices: [hi],
      compareIndices: [],
      sortedIndices: [],
      note: `Partitioning: Selected pivot value ${pivot} at index ${hi}.`,
      lineNo: 7,
      phase: "Divide",
      currentCall: `partition(arr, lo=${lo}, hi=${hi}, pivot=${pivot})`,
      depth,
      subproblem,
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
        phase: "Divide",
        currentCall: `partition_compare(${activeArr[j]} <= ${pivot}?)`,
        depth,
        subproblem,
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
            note: `arr[${j}] <= pivot. Increment i to ${i} and swap elements at index ${i} and ${j}.`,
            lineNo: 12,
            phase: "Divide",
            currentCall: `partition_swap(i=${i}, j=${j})`,
            depth,
            subproblem,
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
        note: `Place pivot in its correct sorted position by swapping indices ${pIndex} and ${hi}.`,
        lineNo: 13,
        phase: "Divide",
        currentCall: `partition_pivot_place(idx=${pIndex})`,
        depth,
        subproblem,
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
      note: `Partitioning complete. Pivot ${pivot} is now fixed at sorted index ${pIndex}.`,
      lineNo: 14,
      phase: "Divide",
      currentCall,
      depth,
      subproblem,
    });

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
      note: `Combine: Quick Sort completed for range [${lo}..${hi}] in-place. No merge needed.`,
      lineNo: 4,
      phase: "Combine",
      currentCall,
      depth,
      subproblem,
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
    phase: "Initial" as const,
    currentCall: "No active call",
    depth: 0,
    subproblem: "[]",
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

  const done = step >= steps.length - 1;

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
          <div className="card-surface mb-6 p-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setRunning((r) => !r)}
                  disabled={done && !running}
                  className="inline-flex items-center gap-1.5 rounded-md gradient-brand px-3 py-1.5 text-xs font-semibold text-primary-foreground disabled:opacity-60 hover:opacity-95"
                >
                  {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  {running ? "Pause" : done ? "Done" : step === 0 ? "Start" : "Resume"}
                </button>
                <button
                  onClick={() => setStep((s) => Math.max(0, s - 1))}
                  className="rounded-md border border-border bg-card p-1.5 hover:bg-accent disabled:opacity-40"
                  disabled={step === 0}
                  aria-label="Step back"
                >
                  <StepBack className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))}
                  className="rounded-md border border-border bg-card p-1.5 hover:bg-accent disabled:opacity-40"
                  disabled={done}
                  aria-label="Step forward"
                >
                  <StepForward className="h-4 w-4" />
                </button>
                <button
                  onClick={() => {
                    setStep(0);
                    setRunning(false);
                  }}
                  className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs hover:bg-accent font-semibold disabled:opacity-40"
                  disabled={step === 0}
                >
                  <RotateCcw className="h-3.5 w-3.5" /> Reset
                </button>
                <button
                  onClick={() => {
                    setSeed((n) => n + 1);
                    setRunning(false);
                  }}
                  className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs hover:bg-accent font-semibold disabled:opacity-40"
                  disabled={arrayInputMode === "custom"}
                >
                  <Shuffle className="h-3.5 w-3.5" /> Randomize
                </button>
              </div>

              <div className="h-4 w-px bg-border hidden sm:block" />

              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <label className="flex items-center gap-1.5">
                  Input Mode
                  <select
                    value={arrayInputMode}
                    onChange={(e) => setArrayInputMode(e.target.value as any)}
                    className="rounded border border-border bg-card px-1.5 py-0.5 text-xs text-foreground"
                  >
                    <option value="random">Random Arrays</option>
                    <option value="custom">Custom Values</option>
                  </select>
                </label>

                {arrayInputMode === "random" ? (
                  <label className="flex items-center gap-1.5">
                    Size
                    <input
                      type="range"
                      min={4}
                      max={12}
                      value={size}
                      onChange={(e) => setSize(Number(e.target.value))}
                      className="w-20"
                    />
                    <span className="font-mono text-foreground">{size}</span>
                  </label>
                ) : (
                  <label className="flex items-center gap-1.5">
                    Array
                    <input
                      type="text"
                      value={customArrayStr}
                      onChange={(e) => setCustomArrayStr(e.target.value)}
                      placeholder="e.g. 5, 2, 8, 12, 1"
                      className="w-32 rounded border border-border bg-card px-1.5 py-0.5 font-mono text-foreground"
                    />
                  </label>
                )}

                {algoId === "binary-search" && (
                  <label className="flex items-center gap-1.5">
                    Target
                    <input
                      type="number"
                      value={targetVal}
                      onChange={(e) => setTargetVal(e.target.value)}
                      className="w-12 rounded border border-border bg-card px-1.5 py-0.5 font-mono text-foreground"
                    />
                  </label>
                )}

                <label className="flex items-center gap-1.5 ml-auto">
                  Speed
                  <input
                    type="range"
                    min={50}
                    max={1200}
                    step={50}
                    value={1250 - speed}
                    onChange={(e) => setSpeed(1250 - Number(e.target.value))}
                    className="w-20"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Main Visualization Grid */}
          <div className="grid gap-6 lg:grid-cols-12">
            {/* Left Column (8 cols): Tree + Array */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              {/* Recursion Tree Panel */}
              <div className="card-surface p-4 flex flex-col min-h-[300px]">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm font-semibold flex items-center gap-1.5">
                    <Split className="h-4 w-4 text-[color:var(--brand)]" /> Recursion Tree
                  </div>
                  <div className="text-xs text-muted-foreground font-mono">
                    Step {step + 1} / {steps.length}
                  </div>
                </div>

                <div className="flex-1 overflow-auto border border-border/40 rounded bg-muted/10 relative p-3 flex items-center justify-center min-h-[220px]">
                  {layout ? (
                    <svg
                      viewBox={`0 0 ${layout.width + 48} ${layout.height + 40}`}
                      className="block w-full"
                      style={{
                        maxWidth: Math.max(layout.width + 48, 220),
                        maxHeight: 220,
                      }}
                    >
                      <g transform="translate(24, 16)">
                        {/* Edges */}
                        {layout.edges.map((e, idx) => (
                          <motion.line
                            key={`edge-${idx}`}
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            x1={e.fromX + 32}
                            y1={e.fromY + 32}
                            x2={e.toX + 32}
                            y2={e.toY}
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
                      </g>
                    </svg>
                  ) : (
                    <div className="text-xs text-muted-foreground">Generating visual layout...</div>
                  )}
                </div>

                {/* Legend */}
                <div className="mt-3 flex flex-wrap gap-4 text-[11px] border-t border-border/40 pt-2.5">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded border border-amber-500 bg-amber-500/15" />
                    <span className="text-amber-500">Active Call</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded border border-emerald-500 bg-emerald-500/15" />
                    <span className="text-emerald-500">Base Case</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded border border-[color:var(--brand)]/60 bg-[color:var(--brand)]/10" />
                    <span className="text-foreground">Done / Split</span>
                  </div>
                </div>
              </div>

              {/* Array State Panel */}
              <div className="card-surface p-4">
                <div className="text-sm font-semibold mb-3">Array State</div>
                <div className="flex flex-wrap gap-1.5 justify-center py-2">
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
                        className={`w-9 h-9 rounded border flex flex-col items-center justify-center text-xs font-mono transition-all ${bg}`}
                      >
                        <div>{val}</div>
                        <div className="text-[7px] text-muted-foreground select-none">#{idx}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column (4 cols): State details + Code */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              {/* Information Hierarchy / State Details */}
              <div className="card-surface p-4 flex flex-col gap-3">
                <div className="text-sm font-semibold">Subproblem Status</div>
                
                <div className="space-y-2 border border-border/40 bg-muted/10 rounded p-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Phase:</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                        currentStep.phase === "Divide"
                          ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                          : currentStep.phase === "Combine"
                            ? "bg-purple-500/10 text-purple-500 border border-purple-500/20"
                            : currentStep.phase === "Base Case"
                              ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                              : "bg-blue-500/10 text-blue-500 border border-blue-500/20"
                      }`}
                    >
                      {currentStep.phase}
                    </span>
                  </div>

                  <div className="flex flex-col gap-0.5 text-xs">
                    <span className="text-muted-foreground">Active Call:</span>
                    <span className="font-mono text-foreground font-medium truncate">{currentStep.currentCall}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1 border-t border-border/20">
                    <span className="text-muted-foreground">Recursion Depth:</span>
                    <span className="font-mono font-medium text-foreground">{currentStep.depth}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Active Subproblem:</span>
                    <span className="font-mono font-medium text-foreground truncate max-w-[150px]">{currentStep.subproblem}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="border border-border/30 bg-card p-2 rounded text-center">
                    <div className="text-muted-foreground text-[9px] uppercase">Recurse Calls</div>
                    <div className="text-sm font-bold text-foreground mt-0.5">{stats.calls}</div>
                  </div>
                  <div className="border border-border/30 bg-card p-2 rounded text-center">
                    <div className="text-muted-foreground text-[9px] uppercase">Comparisons</div>
                    <div className="text-sm font-bold text-foreground mt-0.5">{stats.comparisons}</div>
                  </div>
                </div>
              </div>

              {/* Code viewer */}
              <div className="card-surface p-4 flex-1 flex flex-col min-h-[220px]">
                <div className="text-sm font-semibold mb-2">Python Implementation</div>
                <div className="flex-1 overflow-auto rounded border border-border/40 font-mono text-[10px] bg-code-bg p-3 relative max-h-[260px]">
                  {CODE_SNIPPETS[algoId].split("\n").map((line, idx) => {
                    const isActive = currentStep.lineNo === idx + 1;
                    return (
                      <div
                        key={idx}
                        className={`py-0.5 px-1.5 flex gap-3 ${
                          isActive
                            ? "bg-amber-500/15 border-l-2 border-amber-500 text-amber-200 font-medium"
                            : "text-muted-foreground"
                        }`}
                      >
                        <span className="w-4 text-right select-none text-muted-foreground/35 font-mono">{idx + 1}</span>
                        <pre className="flex-1 whitespace-pre">{line}</pre>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Explanation panel */}
          <div className="mt-6 card-surface p-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Step Explanation
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {currentStep.note}
            </p>
          </div>

          {/* About & Stats Panel */}
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div className="card-surface p-4">
              <div className="text-sm font-semibold mb-2">About {activeAlgo.name}</div>
              <p className="text-sm text-muted-foreground">{activeAlgo.description}</p>
            </div>
            <div className="card-surface p-4">
              <div className="text-sm font-semibold mb-3">Complexity Summary</div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center border-b border-border/40 pb-1.5">
                  <span className="text-muted-foreground">Best Time:</span>
                  <span><ComplexityBadge value={activeAlgo.best ?? "N/A"} /></span>
                </div>
                <div className="flex justify-between items-center border-b border-border/40 pb-1.5">
                  <span className="text-muted-foreground">Average Time:</span>
                  <span><ComplexityBadge value={activeAlgo.avg ?? "N/A"} /></span>
                </div>
                <div className="flex justify-between items-center border-b border-border/40 pb-1.5">
                  <span className="text-muted-foreground">Worst Time:</span>
                  <span><ComplexityBadge value={activeAlgo.worst ?? "N/A"} /></span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Space Complexity:</span>
                  <span><ComplexityBadge value={activeAlgo.space ?? "N/A"} /></span>
                </div>
              </div>
            </div>
          </div>

          {/* Related Lessons */}
          <div className="mt-8 card-surface p-4">
            <div className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Related Lessons
            </div>
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
                className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-sm hover:bg-accent text-muted-foreground hover:text-foreground transition font-medium"
              >
                <BookOpen className="h-4 w-4 text-[color:var(--brand)]" /> Recurrence Relations Lesson
              </Link>
              <Link
                to="/complexity/time"
                className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-sm hover:bg-accent text-muted-foreground hover:text-foreground transition font-medium"
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
