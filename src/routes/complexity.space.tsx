import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHeader, Callout } from "@/components/Callout";
import { ComplexityTable, type ComplexityRow } from "@/components/ComplexityTable";
import { PrevNext } from "@/components/PrevNext";

export const Route = createFileRoute("/complexity/space")({
  head: () => ({
    meta: [
      { title: "Space Complexity Cheat Sheet — Python Lists & Algorithms" },
      { name: "description", content: "Auxiliary space usage for Python list operations, sorting, searching, and common interview problems." },
    ],
  }),
  component: Page,
});

const rows: ComplexityRow[] = [
  { name: "append(x)", category: "List operations", aux: "O(1)", note: "Amortized; occasional realloc." },
  { name: "insert(i, x)", category: "List operations", aux: "O(1)", note: "Shifts in place." },
  { name: "pop() / pop(i)", category: "List operations", aux: "O(1)", note: "Shrinks in place." },
  { name: "remove(x)", category: "List operations", aux: "O(1)", note: "Shift in place." },
  { name: "del lst[i]", category: "List operations", aux: "O(1)", note: "In place." },
  { name: "copy() / lst[:]", category: "List operations", aux: "O(n)", note: "New shallow list of pointers." },
  { name: "reverse()", category: "List operations", aux: "O(1)", note: "Swaps in place." },
  { name: "reversed(lst) → list", category: "List operations", aux: "O(n)", note: "Materialized new list." },
  { name: "Slice lst[a:b]", category: "List operations", aux: "O(k)", note: "k = slice length." },
  { name: "extend(iter)", category: "List operations", aux: "O(1)", note: "Amortized; grows in place." },
  { name: "Concatenation a + b", category: "List operations", aux: "O(n + k)", note: "New list is allocated." },

  { name: "Bubble Sort", category: "Sorting", aux: "O(1)", note: "In place." },
  { name: "Selection Sort", category: "Sorting", aux: "O(1)", note: "In place." },
  { name: "Insertion Sort", category: "Sorting", aux: "O(1)", note: "In place." },
  { name: "Merge Sort", category: "Sorting", aux: "O(n)", note: "Temporary merge buffer." },
  { name: "Quick Sort", category: "Sorting", aux: "O(log n)", note: "Recursion stack (average)." },
  { name: "Heap Sort", category: "Sorting", aux: "O(1)", note: "In-place heap." },
  { name: "Counting Sort", category: "Sorting", aux: "O(n + k)", note: "Count array + output." },
  { name: "Radix Sort", category: "Sorting", aux: "O(n + k)", note: "Buckets per digit." },
  { name: "Bucket Sort", category: "Sorting", aux: "O(n + k)", note: "One list per bucket." },
  { name: "Shell Sort", category: "Sorting", aux: "O(1)", note: "In place." },
  { name: "TimSort (Python)", category: "Sorting", aux: "O(n)", note: "Merge buffers." },

  { name: "Linear Search", category: "Searching", aux: "O(1)", note: "Two indices at most." },
  { name: "Binary Search (iterative)", category: "Searching", aux: "O(1)", note: "Just lo/hi/mid." },
  { name: "Binary Search (recursive)", category: "Searching", aux: "O(log n)", note: "Call stack." },
  { name: "Jump Search", category: "Searching", aux: "O(1)", note: "Constant pointers." },

  { name: "Two Sum (hash map)", category: "Interview problems", aux: "O(n)", note: "Dict of value → index." },
  { name: "Product Except Self", category: "Interview problems", aux: "O(1)", note: "Excluding the output array." },
  { name: "Frequency Counter", category: "Interview problems", aux: "O(k)", note: "k = distinct elements." },
  { name: "Kadane's Algorithm", category: "Interview problems", aux: "O(1)", note: "Two running variables." },
  { name: "Prefix Sum", category: "Interview problems", aux: "O(n)", note: "Prefix array." },
  { name: "Sliding Window", category: "Interview problems", aux: "O(1)", note: "Or O(k) if tracking a window set." },
  { name: "Merge Sorted Arrays", category: "Interview problems", aux: "O(n + m)", note: "New output array." },
  { name: "Rotate Array (reverse trick)", category: "Interview problems", aux: "O(1)", note: "In place." },
  { name: "Reverse Array", category: "Interview problems", aux: "O(1)", note: "Two pointer swap." },
  { name: "Kth Largest (heap)", category: "Interview problems", aux: "O(k)", note: "Min-heap of size k." },
];

const categories = ["List operations", "Sorting", "Searching", "Interview problems"];

function Page() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Complexity Cheat Sheets"
        title="Space Complexity"
        description="How much extra memory each algorithm or operation uses beyond its input."
      />

      <Callout kind="info" title="Auxiliary vs total space">
        <p>
          <b>Auxiliary space</b> is the <i>extra</i> memory an algorithm allocates on top of its input. Total space would include the input itself (usually O(n) for a list of n elements).
        </p>
      </Callout>

      <ComplexityTable rows={rows} mode="space" categories={categories} />

      <Callout kind="perf" title="Recursive vs iterative">
        <p>
          Recursive versions of the same algorithm pay for the call stack. Binary search costs O(log n) recursive frames; iterative binary search is O(1). Convert to a loop when the depth could blow the stack.
        </p>
      </Callout>

      <PrevNext current="/complexity/space" />
    </PageShell>
  );
}
