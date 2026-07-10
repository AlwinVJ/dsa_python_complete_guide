import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHeader, Callout } from "@/components/Callout";
import { ComplexityTable, type ComplexityRow } from "@/components/ComplexityTable";
import { PrevNext } from "@/components/PrevNext";

export const Route = createFileRoute("/complexity/time")({
  head: () => ({
    meta: [
      { title: "Time Complexity Cheat Sheet — Python Lists & Algorithms" },
      {
        name: "description",
        content:
          "Searchable, sortable time-complexity reference for Python list operations, sorting, searching, and problem patterns.",
      },
    ],
  }),
  component: Page,
});

const rows: ComplexityRow[] = [
  // Basic list operations
  {
    name: "Access by index lst[i]",
    category: "List operations",
    best: "O(1)",
    average: "O(1)",
    worst: "O(1)",
    note: "Direct pointer lookup.",
  },
  {
    name: "Update lst[i] = x",
    category: "List operations",
    best: "O(1)",
    average: "O(1)",
    worst: "O(1)",
    note: "Overwrites a slot.",
  },
  {
    name: "append(x)",
    category: "List operations",
    best: "O(1)",
    average: "O(1)",
    worst: "O(n)",
    note: "Amortized O(1); reallocates when full.",
  },
  {
    name: "insert(i, x)",
    category: "List operations",
    best: "O(1)",
    average: "O(n)",
    worst: "O(n)",
    note: "Shifts elements after i.",
  },
  {
    name: "extend(iter)",
    category: "List operations",
    best: "O(k)",
    average: "O(k)",
    worst: "O(k)",
    note: "k = length of iterable.",
  },
  {
    name: "pop() (end)",
    category: "List operations",
    best: "O(1)",
    average: "O(1)",
    worst: "O(1)",
    note: "No shifting needed.",
  },
  {
    name: "pop(i)",
    category: "List operations",
    best: "O(1)",
    average: "O(n)",
    worst: "O(n)",
    note: "Shifts elements after i.",
  },
  {
    name: "remove(x)",
    category: "List operations",
    best: "O(1)",
    average: "O(n)",
    worst: "O(n)",
    note: "Linear scan + shift.",
  },
  {
    name: "del lst[i]",
    category: "List operations",
    best: "O(1)",
    average: "O(n)",
    worst: "O(n)",
    note: "Same as pop(i).",
  },
  {
    name: "clear()",
    category: "List operations",
    best: "O(n)",
    average: "O(n)",
    worst: "O(n)",
    note: "Frees references.",
  },
  {
    name: "count(x)",
    category: "List operations",
    best: "O(n)",
    average: "O(n)",
    worst: "O(n)",
    note: "Full traversal.",
  },
  {
    name: "index(x)",
    category: "List operations",
    best: "O(1)",
    average: "O(n)",
    worst: "O(n)",
    note: "Stops at first match.",
  },
  {
    name: "reverse()",
    category: "List operations",
    best: "O(n)",
    average: "O(n)",
    worst: "O(n)",
    note: "In place.",
  },
  {
    name: "copy() / lst[:]",
    category: "List operations",
    best: "O(n)",
    average: "O(n)",
    worst: "O(n)",
    note: "Shallow copy.",
  },
  {
    name: "Slice lst[a:b]",
    category: "List operations",
    best: "O(k)",
    average: "O(k)",
    worst: "O(k)",
    note: "k = slice length.",
  },
  {
    name: "Concatenation a + b",
    category: "List operations",
    best: "O(n + k)",
    average: "O(n + k)",
    worst: "O(n + k)",
    note: "Allocates new list.",
  },
  {
    name: "Membership x in lst",
    category: "List operations",
    best: "O(1)",
    average: "O(n)",
    worst: "O(n)",
    note: "Sequential scan.",
  },
  {
    name: "Iteration for x in lst",
    category: "List operations",
    best: "O(n)",
    average: "O(n)",
    worst: "O(n)",
    note: "Touch every element.",
  },
  {
    name: "len(lst)",
    category: "List operations",
    best: "O(1)",
    average: "O(1)",
    worst: "O(1)",
    note: "Cached length.",
  },

  // Sorting
  {
    name: "Bubble Sort",
    category: "Sorting",
    best: "O(n)",
    average: "O(n²)",
    worst: "O(n²)",
    stable: true,
    inPlace: true,
    adaptive: true,
    note: "Best case if already sorted with early exit.",
  },
  {
    name: "Selection Sort",
    category: "Sorting",
    best: "O(n²)",
    average: "O(n²)",
    worst: "O(n²)",
    stable: false,
    inPlace: true,
    adaptive: false,
    note: "Always scans full unsorted portion.",
  },
  {
    name: "Insertion Sort",
    category: "Sorting",
    best: "O(n)",
    average: "O(n²)",
    worst: "O(n²)",
    stable: true,
    inPlace: true,
    adaptive: true,
    note: "Great for tiny or nearly-sorted arrays.",
  },
  {
    name: "Merge Sort",
    category: "Sorting",
    best: "O(n log n)",
    average: "O(n log n)",
    worst: "O(n log n)",
    stable: true,
    inPlace: false,
    adaptive: false,
    note: "Divide and conquer.",
  },
  {
    name: "Quick Sort",
    category: "Sorting",
    best: "O(n log n)",
    average: "O(n log n)",
    worst: "O(n²)",
    stable: false,
    inPlace: true,
    adaptive: false,
    note: "Worst case with bad pivot.",
  },
  {
    name: "Heap Sort",
    category: "Sorting",
    best: "O(n log n)",
    average: "O(n log n)",
    worst: "O(n log n)",
    stable: false,
    inPlace: true,
    adaptive: false,
    note: "Uses binary heap.",
  },
  {
    name: "Counting Sort",
    category: "Sorting",
    best: "O(n + k)",
    average: "O(n + k)",
    worst: "O(n + k)",
    stable: true,
    inPlace: false,
    adaptive: false,
    note: "k = value range. Integers only.",
  },
  {
    name: "Radix Sort",
    category: "Sorting",
    best: "O(nk)",
    average: "O(nk)",
    worst: "O(nk)",
    stable: true,
    inPlace: false,
    adaptive: false,
    note: "k = number of digits.",
  },
  {
    name: "Bucket Sort",
    category: "Sorting",
    best: "O(n + k)",
    average: "O(n + k)",
    worst: "O(n²)",
    stable: true,
    inPlace: false,
    adaptive: false,
    note: "Worst if all in one bucket.",
  },
  {
    name: "Shell Sort",
    category: "Sorting",
    best: "O(n log n)",
    average: "O(n log n)",
    worst: "O(n²)",
    stable: false,
    inPlace: true,
    adaptive: true,
    note: "Gap-based insertion sort.",
  },
  {
    name: "TimSort (Python)",
    category: "Sorting",
    best: "O(n)",
    average: "O(n log n)",
    worst: "O(n log n)",
    stable: true,
    inPlace: false,
    adaptive: true,
    note: "Python's built-in sort() and sorted().",
  },

  // Searching
  {
    name: "Linear Search",
    category: "Searching",
    best: "O(1)",
    average: "O(n)",
    worst: "O(n)",
    note: "No ordering needed.",
  },
  {
    name: "Binary Search",
    category: "Searching",
    best: "O(1)",
    average: "O(log n)",
    worst: "O(log n)",
    note: "Requires sorted array.",
  },
  {
    name: "Jump Search",
    category: "Searching",
    best: "O(1)",
    average: "O(√n)",
    worst: "O(√n)",
    note: "Jump then linear scan block.",
  },
  {
    name: "Interpolation Search",
    category: "Searching",
    best: "O(1)",
    average: "O(log log n)",
    worst: "O(n)",
    note: "For uniformly distributed data.",
  },
  {
    name: "Exponential Search",
    category: "Searching",
    best: "O(1)",
    average: "O(log n)",
    worst: "O(log n)",
    note: "Doubling range + binary search.",
  },

  // Patterns
  {
    name: "Two Pointers",
    category: "Patterns",
    best: "O(n)",
    average: "O(n)",
    worst: "O(n)",
    note: "Single pass with two indices.",
  },
  {
    name: "Sliding Window",
    category: "Patterns",
    best: "O(n)",
    average: "O(n)",
    worst: "O(n)",
    note: "Expand / shrink window.",
  },
  {
    name: "Prefix Sum build",
    category: "Patterns",
    best: "O(n)",
    average: "O(n)",
    worst: "O(n)",
    note: "Range queries after become O(1).",
  },
  {
    name: "Hash Map Counting",
    category: "Patterns",
    best: "O(n)",
    average: "O(n)",
    worst: "O(n)",
    note: "Dict lookups amortized O(1).",
  },
  {
    name: "Divide and Conquer",
    category: "Patterns",
    best: "O(n log n)",
    average: "O(n log n)",
    worst: "O(n log n)",
    note: "Recurrence T(n)=2T(n/2)+O(n).",
  },
  {
    name: "Recursion (linear)",
    category: "Patterns",
    best: "O(n)",
    average: "O(n)",
    worst: "O(n)",
    note: "One recursive call per level.",
  },
  {
    name: "Backtracking",
    category: "Patterns",
    best: "O(n)",
    average: "O(2^n)",
    worst: "O(n!)",
    note: "Explores decision tree.",
  },
];

const categories = ["List operations", "Sorting", "Searching", "Patterns"];

function Page() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Complexity Cheat Sheets"
        title="Time Complexity"
        description="Search, filter, and sort — the complete time-complexity reference for Python lists, sorting, searching, and interview patterns."
      />

      <Callout kind="tip" title="How to read this table">
        <p>
          <b>Best</b> = luckiest input · <b>Average</b> = typical random input · <b>Worst</b> =
          adversarial input. Column badges are color-coded green → red as complexity grows.
        </p>
      </Callout>

      <ComplexityTable rows={rows} mode="time" categories={categories} />

      <Callout kind="did" title="Why is append usually O(1)?">
        <p>
          Python lists over-allocate memory when they grow. Most appends only bump an index; every
          so often the list doubles its backing array — an O(n) copy — but averaged over many
          appends, the cost is <b>amortized O(1)</b>.
        </p>
      </Callout>

      <Callout kind="warn" title="Beware pop(0) and insert(0, x)">
        <p>
          Both shift every remaining element. For queue-like workloads use{" "}
          <span className="font-mono">collections.deque</span> which offers O(1) popleft/appendleft.
        </p>
      </Callout>

      <Callout kind="info" title="Advanced: The Master Theorem for Recurrences">
        <p className="mb-2">
          For divide-and-conquer recurrences of the form <b>T(n) = a·T(n/b) + f(n)</b>, we can analyze the runtime by comparing <b>f(n)</b> to <b>n<sup>log<sub>b</sub>a</sup></b>:
        </p>
        <ul className="list-disc space-y-1 pl-5 text-sm">
          <li>
            <b>Case 1:</b> If <i>f(n) = O(n<sup>log<sub>b</sub>a - ε</sup>)</i> for some ε &gt; 0, then <b>T(n) = Θ(n<sup>log<sub>b</sub>a</sup>)</b>. The recursive splitting dominates (e.g. Strassen's matrix multiplication).
          </li>
          <li>
            <b>Case 2:</b> If <i>f(n) = Θ(n<sup>log<sub>b</sub>a</sup>)</i>, then <b>T(n) = Θ(n<sup>log<sub>b</sub>a</sup> log n)</b>. The work is evenly distributed across all levels (e.g. Merge Sort).
          </li>
          <li>
            <b>Case 3:</b> If <i>f(n) = Ω(n<sup>log<sub>b</sub>a + ε</sup>)</i> for some ε &gt; 0, and the regularity condition holds, then <b>T(n) = Θ(f(n))</b>. The combining work dominates.
          </li>
        </ul>
        <p className="mt-2 text-xs text-muted-foreground">
          Note: This covers standard balanced splits. Advanced recurrence equations can also be solved visually using recursion trees.
        </p>
      </Callout>

      <PrevNext current="/complexity/time" />
    </PageShell>
  );
}
