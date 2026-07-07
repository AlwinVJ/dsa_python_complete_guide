import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronRight, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Node =
  | { kind: "q"; text: string; yes: string; no: string }
  | { kind: "a"; algo: string; title: string; why: string };

const TREE: Record<string, Node> = {
  root: {
    kind: "q",
    text: "Is the array (or convertible to) sorted?",
    yes: "sorted",
    no: "unsorted",
  },

  sorted: {
    kind: "q",
    text: "Do you need a specific value / position (search)?",
    yes: "binary-search",
    no: "sorted-pair",
  },
  "sorted-pair": {
    kind: "q",
    text: "Do you need a pair meeting a condition?",
    yes: "two-pointers",
    no: "sorted-interval",
  },
  "sorted-interval": {
    kind: "q",
    text: "Are the elements intervals to merge / overlap-check?",
    yes: "merge-intervals",
    no: "sorted-other",
  },
  "sorted-other": {
    kind: "q",
    text: "Do you need the k-th smallest / largest?",
    yes: "quick-select",
    no: "sorting-based",
  },

  unsorted: {
    kind: "q",
    text: "Do you need contiguous subarrays?",
    yes: "contig",
    no: "noncontig",
  },

  contig: {
    kind: "q",
    text: "Fixed / variable window with a condition?",
    yes: "sliding-window",
    no: "contig-sum",
  },
  "contig-sum": {
    kind: "q",
    text: "Maximum / minimum subarray sum?",
    yes: "kadane",
    no: "contig-range",
  },
  "contig-range": {
    kind: "q",
    text: "Repeated range-sum queries?",
    yes: "prefix-sum",
    no: "linear-traversal",
  },

  noncontig: {
    kind: "q",
    text: "Do you need frequency / lookups by key?",
    yes: "hash-map",
    no: "noncontig-order",
  },
  "noncontig-order": {
    kind: "q",
    text: "Need next-greater / next-smaller per element?",
    yes: "monotonic-stack",
    no: "noncontig-window",
  },
  "noncontig-window": {
    kind: "q",
    text: "Sliding-window max / min?",
    yes: "monotonic-queue",
    no: "noncontig-select",
  },
  "noncontig-select": {
    kind: "q",
    text: "Need the k-th element or top-k?",
    yes: "heap",
    no: "noncontig-bounded",
  },
  "noncontig-bounded": {
    kind: "q",
    text: "Values bounded in 1..n?",
    yes: "cyclic-sort",
    no: "noncontig-enum",
  },
  "noncontig-enum": {
    kind: "q",
    text: "Enumerate all subsets / permutations?",
    yes: "backtracking",
    no: "noncontig-2d",
  },
  "noncontig-2d": {
    kind: "q",
    text: "Input is a 2D matrix?",
    yes: "matrix-traversal",
    no: "noncontig-dp",
  },
  "noncontig-dp": {
    kind: "q",
    text: "Optimal substructure + overlapping subproblems?",
    yes: "dp-intro",
    no: "linear-traversal",
  },

  // Answer leaves
  "binary-search": {
    kind: "a",
    algo: "binary-search",
    title: "Binary Search",
    why: "Sorted + query → halve the search space every step.",
  },
  "two-pointers": {
    kind: "a",
    algo: "two-pointers",
    title: "Two Pointers",
    why: "Sorted + pair condition → coordinate two indices in O(n).",
  },
  "merge-intervals": {
    kind: "a",
    algo: "merge-intervals",
    title: "Merge Intervals",
    why: "Sort by start, sweep, merge overlaps.",
  },
  "quick-select": {
    kind: "a",
    algo: "quick-select",
    title: "Quick Select",
    why: "Partition around a pivot, recurse only on the side with k.",
  },
  "sorting-based": {
    kind: "a",
    algo: "sorting-based",
    title: "Sort-then-solve",
    why: "Sort first, then a linear pass wraps it up.",
  },
  "sliding-window": {
    kind: "a",
    algo: "sliding-window",
    title: "Sliding Window",
    why: "Reuse work as the window moves — O(n) instead of O(n·k).",
  },
  kadane: {
    kind: "a",
    algo: "kadane",
    title: "Kadane's Algorithm",
    why: "1D DP: current = max(x, current + x); track global best.",
  },
  "prefix-sum": {
    kind: "a",
    algo: "prefix-sum",
    title: "Prefix Sum",
    why: "O(n) build + O(1) range queries.",
  },
  "linear-traversal": {
    kind: "a",
    algo: "linear-traversal",
    title: "Linear Traversal",
    why: "The baseline: one pass, O(1) space.",
  },
  "hash-map": {
    kind: "a",
    algo: "hash-map",
    title: "Hash Map / Counting",
    why: "Trade O(n) space for O(1) lookup.",
  },
  "monotonic-stack": {
    kind: "a",
    algo: "monotonic-stack",
    title: "Monotonic Stack",
    why: "Each index pushed / popped once → O(n).",
  },
  "monotonic-queue": {
    kind: "a",
    algo: "monotonic-queue",
    title: "Monotonic Queue",
    why: "Front of deque is always the window extremum.",
  },
  heap: {
    kind: "a",
    algo: "heap",
    title: "Heap / Priority Queue",
    why: "O(log n) push/pop; size-K heap for top-K.",
  },
  "cyclic-sort": {
    kind: "a",
    algo: "cyclic-sort",
    title: "Cyclic Sort",
    why: "Bounded values → swap into home in O(n), O(1) space.",
  },
  backtracking: {
    kind: "a",
    algo: "backtracking",
    title: "Backtracking",
    why: "DFS over decisions; undo on the way back.",
  },
  "matrix-traversal": {
    kind: "a",
    algo: "matrix-traversal",
    title: "Matrix Traversal",
    why: "Pick the right traversal order for the problem.",
  },
  "dp-intro": {
    kind: "a",
    algo: "dp-intro",
    title: "Dynamic Programming",
    why: "Cache overlapping subproblem answers.",
  },
};

export function DecisionTree() {
  const [id, setId] = useState<string>("root");
  const [trail, setTrail] = useState<string[]>([]);
  const node = TREE[id];

  const answer = (choice: "yes" | "no") => {
    if (node.kind !== "q") return;
    setTrail((t) => [...t, `${node.text} → ${choice.toUpperCase()}`]);
    setId(choice === "yes" ? node.yes : node.no);
  };
  const reset = () => {
    setId("root");
    setTrail([]);
  };

  return (
    <div className="card-surface p-5">
      <div className="mb-3 flex items-center justify-between">
        <div className="text-sm font-semibold">Which algorithm should I use?</div>
        <button
          onClick={reset}
          className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-2 py-1 text-xs hover:bg-accent"
        >
          <RotateCcw className="h-3 w-3" /> Restart
        </button>
      </div>
      {trail.length > 0 && (
        <div className="mb-4 space-y-1 text-xs text-muted-foreground">
          {trail.map((t, i) => (
            <div key={i}>• {t}</div>
          ))}
        </div>
      )}
      <AnimatePresence mode="wait">
        <motion.div
          key={id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {node.kind === "q" ? (
            <>
              <div className="mb-4 text-base font-medium">{node.text}</div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => answer("yes")}
                  className="rounded-md gradient-brand px-4 py-2 text-sm font-medium text-primary-foreground"
                >
                  Yes
                </button>
                <button
                  onClick={() => answer("no")}
                  className="rounded-md border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-accent"
                >
                  No
                </button>
              </div>
            </>
          ) : (
            <div>
              <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-[color:var(--brand)]">
                Recommended
              </div>
              <div className="text-xl font-semibold">{node.title}</div>
              <p className="mt-2 text-sm text-muted-foreground">{node.why}</p>
              <div className="mt-4">
                <Link
                  to="/algorithms/$slug"
                  params={{ slug: node.algo }}
                  className="inline-flex items-center gap-1 rounded-md gradient-brand px-4 py-2 text-sm font-medium text-primary-foreground"
                >
                  Open guide <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
