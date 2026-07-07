// Side-by-side comparison of the four linked-list variants.
// Rendered above the LLSection body for the "comparison" (foundations)
// and "comparison-cheatsheet" (revision) lessons.

const VARIANTS = ["Singly", "Doubly", "Circular", "Circular Doubly"] as const;

const ROWS: { axis: string; values: [string, string, string, string] }[] = [
  {
    axis: "Structure",
    values: [
      "val · next",
      "val · prev · next",
      "val · next (tail→head)",
      "val · prev · next (ring)",
    ],
  },
  { axis: "Memory / node", values: ["1 pointer", "2 pointers", "1 pointer", "2 pointers"] },
  {
    axis: "Traversal",
    values: ["Forward only", "Forward + backward", "Forward, wraps around", "Both, wraps around"],
  },
  { axis: "Insert at head", values: ["O(1)", "O(1)", "O(1)*", "O(1)"] },
  { axis: "Insert at tail", values: ["O(1) w/ tail", "O(1)", "O(1) w/ tail", "O(1)"] },
  { axis: "Delete at head", values: ["O(1)", "O(1)", "O(1)*", "O(1)"] },
  { axis: "Delete at tail", values: ["O(n)", "O(1)", "O(n)", "O(1)"] },
  { axis: "Reverse traversal", values: ["✗", "✓", "✗", "✓"] },
  {
    axis: "Advantage",
    values: [
      "Smallest memory footprint",
      "Bidirectional; O(1) node delete",
      "Natural round-robin",
      "Ring + backward walk",
    ],
  },
  {
    axis: "Disadvantage",
    values: [
      "No backward walk",
      "Extra pointer overhead",
      "Termination trickier — no NULL",
      "Most complex to maintain",
    ],
  },
  {
    axis: "Real-world use",
    values: [
      "Undo stacks, adjacency lists",
      "LRU cache, browser history",
      "Round-robin schedulers, Josephus",
      "collections.deque, playlist loops",
    ],
  },
];

export function VariantComparisonTable() {
  return (
    <div className="mb-6 overflow-x-auto rounded-lg border border-border">
      <table className="w-full min-w-[720px] text-sm">
        <thead className="bg-muted/50">
          <tr>
            <th className="px-3 py-2 text-left font-semibold">Axis</th>
            {VARIANTS.map((v) => (
              <th key={v} className="px-3 py-2 text-left font-semibold">
                {v}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ROWS.map((r) => (
            <tr key={r.axis} className="border-t border-border">
              <td className="px-3 py-2 font-medium">{r.axis}</td>
              {r.values.map((c, i) => (
                <td key={i} className="px-3 py-2 text-muted-foreground">
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
