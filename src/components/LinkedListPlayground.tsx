import { useState, useMemo } from "react";
import { LinkedListVisualizer, LinkedListMemory, makeNodes, type LLNode } from "./LinkedListVisualizer";
import { Plus, Trash2, RotateCcw, Search, Repeat, Shuffle, ArrowRight, ArrowLeft } from "lucide-react";

type Variant = "singly" | "doubly" | "circular" | "circular-doubly";

type Op =
  | { kind: "push-front"; value: string | number }
  | { kind: "push-back"; value: string | number }
  | { kind: "insert-at"; index: number; value: string | number }
  | { kind: "delete-front" }
  | { kind: "delete-back" }
  | { kind: "delete-at"; index: number }
  | { kind: "delete-value"; value: string | number }
  | { kind: "search"; value: string | number; foundAt: number }
  | { kind: "traverse-forward" }
  | { kind: "traverse-backward" }
  | { kind: "reverse" }
  | { kind: "reset" }
  | { kind: "shuffle" };

const OP_COMPLEXITY: Record<Op["kind"], string> = {
  "push-front": "O(1)",
  "push-back": "O(1) w/ tail",
  "insert-at": "O(k)",
  "delete-front": "O(1)",
  "delete-back": "O(n) singly · O(1) doubly",
  "delete-at": "O(k)",
  "delete-value": "O(n)",
  search: "O(n)",
  "traverse-forward": "O(n)",
  "traverse-backward": "O(n)",
  reverse: "O(n)",
  reset: "—",
  shuffle: "—",
};

const OP_LABEL: Record<Op["kind"], string> = {
  "push-front": "Insertion at Front",
  "push-back": "Insertion at End",
  "insert-at": "Insertion at Position",
  "delete-front": "Deletion at Front",
  "delete-back": "Deletion at End",
  "delete-at": "Deletion at Position",
  "delete-value": "Deletion by Value",
  search: "Search",
  "traverse-forward": "Forward Traversal",
  "traverse-backward": "Backward Traversal",
  reverse: "Reverse",
  reset: "Reset",
  shuffle: "Shuffle",
};

export function LinkedListPlayground({
  initial = [10, 20, 30, 40],
  variant = "singly",
}: {
  initial?: Array<string | number>;
  variant?: Variant;
}) {
  const [nodes, setNodes] = useState<LLNode[]>(makeNodes(initial));
  const [value, setValue] = useState("50");
  const [index, setIndex] = useState("1");
  const [highlight, setHighlight] = useState<number[]>([]);
  const [lastOp, setLastOp] = useState<Op | null>(null);

  const isDoubly = variant === "doubly" || variant === "circular-doubly";

  const parsed: string | number = useMemo(() => {
    const n = Number(value);
    return Number.isFinite(n) && value.trim() !== "" ? n : value;
  }, [value]);

  const clearHighlightSoon = () => setTimeout(() => setHighlight([]), 1200);

  // Insertion
  const pushFront = () => {
    const [nn] = makeNodes([parsed]);
    setNodes((s) => [nn, ...s]);
    setHighlight([0]); clearHighlightSoon();
    setLastOp({ kind: "push-front", value: parsed });
  };
  const pushBack = () => {
    const [nn] = makeNodes([parsed]);
    setNodes((s) => {
      setHighlight([s.length]); clearHighlightSoon();
      return [...s, nn];
    });
    setLastOp({ kind: "push-back", value: parsed });
  };
  const insertAt = () => {
    const i = Math.max(0, Math.min(nodes.length, Number(index) || 0));
    const [nn] = makeNodes([parsed]);
    setNodes((s) => {
      const c = s.slice();
      c.splice(i, 0, nn);
      return c;
    });
    setHighlight([i]); clearHighlightSoon();
    setLastOp({ kind: "insert-at", index: i, value: parsed });
  };

  // Deletion
  const deleteFront = () => {
    if (nodes.length === 0) return;
    setHighlight([0]);
    setTimeout(() => { setNodes((s) => s.slice(1)); setHighlight([]); }, 350);
    setLastOp({ kind: "delete-front" });
  };
  const deleteBack = () => {
    if (nodes.length === 0) return;
    const i = nodes.length - 1;
    setHighlight([i]);
    setTimeout(() => { setNodes((s) => s.slice(0, -1)); setHighlight([]); }, 350);
    setLastOp({ kind: "delete-back" });
  };
  const deleteAt = () => {
    const i = Math.max(0, Math.min(nodes.length - 1, Number(index) || 0));
    if (nodes.length === 0) return;
    setHighlight([i]);
    setTimeout(() => { setNodes((s) => s.filter((_, k) => k !== i)); setHighlight([]); }, 350);
    setLastOp({ kind: "delete-at", index: i });
  };
  const deleteValue = () => {
    const i = nodes.findIndex((n) => n.value === parsed);
    if (i === -1) { setLastOp({ kind: "delete-value", value: parsed }); return; }
    setHighlight([i]);
    setTimeout(() => { setNodes((s) => s.filter((_, k) => k !== i)); setHighlight([]); }, 350);
    setLastOp({ kind: "delete-value", value: parsed });
  };

  // Search
  const search = () => {
    const i = nodes.findIndex((n) => n.value === parsed);
    setHighlight(i === -1 ? [] : [i]);
    clearHighlightSoon();
    setLastOp({ kind: "search", value: parsed, foundAt: i });
  };

  // Traversal — animate
  const runTraversal = (backward: boolean) => {
    const order = backward
      ? Array.from({ length: nodes.length }, (_, i) => nodes.length - 1 - i)
      : Array.from({ length: nodes.length }, (_, i) => i);
    setLastOp({ kind: backward ? "traverse-backward" : "traverse-forward" });
    order.forEach((idx, step) => {
      setTimeout(() => setHighlight([idx]), step * 400);
    });
    setTimeout(() => setHighlight([]), (order.length + 1) * 400);
  };

  // Utilities
  const reverse = () => { setNodes((s) => s.slice().reverse()); setLastOp({ kind: "reverse" }); };
  const reset = () => { setNodes(makeNodes(initial)); setHighlight([]); setLastOp({ kind: "reset" }); };
  const shuffle = () => {
    const vals = Array.from({ length: 4 + Math.floor(Math.random() * 3) }, () =>
      Math.floor(Math.random() * 90) + 10,
    );
    setNodes(makeNodes(vals));
    setLastOp({ kind: "shuffle" });
  };

  const currentOp = lastOp ? OP_LABEL[lastOp.kind] : "—";
  const currentComplexity = lastOp ? OP_COMPLEXITY[lastOp.kind] : "—";
  const head = nodes[0]?.value ?? "∅";
  const tail = nodes[nodes.length - 1]?.value ?? "∅";

  return (
    <div className="card-surface p-4">
      {/* Visualizer */}
      <div className="overflow-x-auto">
        <LinkedListVisualizer
          nodes={nodes}
          highlight={highlight}
          headLabel="HEAD"
          tailLabel={variant === "circular" || variant === "circular-doubly" ? null : "TAIL"}
          variant={variant}
        />
      </div>

      {/* Info Panel */}
      <div className="mt-4 grid grid-cols-2 gap-2 rounded-lg border border-border bg-muted/30 p-3 text-xs sm:grid-cols-4">
        <InfoStat label="Length" value={String(nodes.length)} />
        <InfoStat label="Head" value={String(head)} />
        <InfoStat label="Tail" value={String(tail)} />
        <InfoStat label="Complexity" value={currentComplexity} mono />
        <div className="col-span-2 sm:col-span-4">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Current Operation</div>
          <div className="mt-0.5 text-sm font-medium">{currentOp}</div>
        </div>
      </div>

      {/* Inputs */}
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-xs text-muted-foreground">
          Value
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="e.g. 50"
            className="rounded-md border border-input bg-background px-3 py-1.5 font-mono text-sm"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs text-muted-foreground">
          Index / Position
          <input
            value={index}
            onChange={(e) => setIndex(e.target.value)}
            placeholder="e.g. 1"
            className="rounded-md border border-input bg-background px-3 py-1.5 font-mono text-sm"
          />
        </label>
      </div>

      {/* Grouped Controls */}
      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <ControlGroup title="Insert">
          <ActionBtn icon={<Plus className="h-3.5 w-3.5" />} label="Front" primary onClick={pushFront} />
          <ActionBtn icon={<Plus className="h-3.5 w-3.5" />} label="Back" primary onClick={pushBack} />
          <ActionBtn label="At Position" onClick={insertAt} />
        </ControlGroup>

        <ControlGroup title="Delete">
          <ActionBtn icon={<Trash2 className="h-3.5 w-3.5" />} label="Front" onClick={deleteFront} />
          <ActionBtn icon={<Trash2 className="h-3.5 w-3.5" />} label="Back" onClick={deleteBack} />
          <ActionBtn label="Position" onClick={deleteAt} />
          <ActionBtn label="Value" onClick={deleteValue} />
        </ControlGroup>

        <ControlGroup title="Search & Traverse">
          <ActionBtn icon={<Search className="h-3.5 w-3.5" />} label="Find" onClick={search} />
          <ActionBtn icon={<ArrowRight className="h-3.5 w-3.5" />} label="Forward" onClick={() => runTraversal(false)} />
          {isDoubly && (
            <ActionBtn icon={<ArrowLeft className="h-3.5 w-3.5" />} label="Backward" onClick={() => runTraversal(true)} />
          )}
        </ControlGroup>

        <ControlGroup title="Utilities">
          <ActionBtn icon={<Repeat className="h-3.5 w-3.5" />} label="Reverse" onClick={reverse} />
          <ActionBtn icon={<Shuffle className="h-3.5 w-3.5" />} label="Shuffle" onClick={shuffle} />
          <ActionBtn icon={<RotateCcw className="h-3.5 w-3.5" />} label="Reset" onClick={reset} />
        </ControlGroup>
      </div>

      {/* Op description */}
      {lastOp && (
        <div className="mt-3 rounded-md border border-border bg-muted/30 px-3 py-2 font-mono text-xs text-muted-foreground">
          {opDescription(lastOp, variant)}
        </div>
      )}

      {/* Memory view */}
      <details className="mt-4 rounded-md border border-border bg-muted/20">
        <summary className="cursor-pointer px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Memory Representation
        </summary>
        <div className="p-3">
          <LinkedListMemory nodes={nodes} />
        </div>
      </details>
    </div>
  );
}

function InfoStat({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`mt-0.5 text-sm font-semibold ${mono ? "font-mono" : ""}`}>{value}</div>
    </div>
  );
}

function ControlGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border bg-background/40 p-3">
      <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{title}</div>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

function ActionBtn({
  label, icon, onClick, primary,
}: { label: string; icon?: React.ReactNode; onClick: () => void; primary?: boolean }) {
  const base = "inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium transition whitespace-nowrap";
  const cls = primary
    ? "gradient-brand text-primary-foreground hover:opacity-90"
    : "border border-border bg-card hover:bg-accent";
  return (
    <button onClick={onClick} className={`${base} ${cls}`}>
      {icon}
      {label}
    </button>
  );
}

function opDescription(op: Op, variant: Variant): string {
  const v = variant === "circular" ? "circular" : variant === "doubly" ? "doubly" : variant === "circular-doubly" ? "circular-doubly" : "singly";
  switch (op.kind) {
    case "push-front": return `${v}.push_front(${JSON.stringify(op.value)})   # O(1)`;
    case "push-back": return `${v}.push_back(${JSON.stringify(op.value)})   # O(1) w/ tail`;
    case "insert-at": return `${v}.insert_at(${op.index}, ${JSON.stringify(op.value)})   # O(k)`;
    case "delete-front": return `${v}.pop_front()   # O(1)`;
    case "delete-back": return variant === "doubly" || variant === "circular-doubly"
      ? `${v}.pop_back()   # O(1) — prev pointer available`
      : `${v}.pop_back()   # O(n) — must walk to tail`;
    case "delete-at": return `${v}.delete_at(${op.index})   # O(k)`;
    case "delete-value": return `${v}.delete_value(${JSON.stringify(op.value)})   # O(n)`;
    case "search": return op.foundAt === -1
      ? `${v}.find(${JSON.stringify(op.value)}) → -1   # not found`
      : `${v}.find(${JSON.stringify(op.value)}) → index ${op.foundAt}   # O(n)`;
    case "traverse-forward": return `for node in ${v}: print(node.value)   # O(n)`;
    case "traverse-backward": return `for node in reversed(${v}): print(node.value)   # O(n)`;
    case "reverse": return `${v}.reverse()   # O(n) time, O(1) space`;
    case "reset": return `# reset to initial list`;
    case "shuffle": return `# random list`;
  }
}
