import { useState } from "react";
import { Plus, Minus, Eye, RotateCcw, AlertTriangle } from "lucide-react";
import { StackVisualizer } from "./StackVisualizer";

type Op = "push" | "pop" | "peek" | "reset" | "underflow" | "peek-empty";

const OP_META: Record<Op, { label: string; time: string; tone: string }> = {
  push: { label: "Push", time: "O(1) amortised", tone: "text-emerald-500" },
  pop: { label: "Pop", time: "O(1)", tone: "text-emerald-500" },
  peek: { label: "Peek", time: "O(1)", tone: "text-emerald-500" },
  reset: { label: "Reset", time: "O(n)", tone: "text-muted-foreground" },
  underflow: { label: "Underflow!", time: "—", tone: "text-rose-500" },
  "peek-empty": { label: "Peek on empty", time: "—", tone: "text-rose-500" },
};

/**
 * Interactive playground: push / pop / peek / reset with a live
 * visualization, size counter, current top, and last-operation panel.
 * Fully responsive — button row wraps on narrow viewports.
 */
export function StackPlayground({
  initial = [10, 20, 30],
  maxSize = 12,
}: {
  initial?: Array<string | number>;
  maxSize?: number;
}) {
  const [stack, setStack] = useState<Array<string | number>>(initial);
  const [value, setValue] = useState("");
  const [lastOp, setLastOp] = useState<Op | null>(null);
  const [flash, setFlash] = useState<string | null>(null);

  const top = stack.length ? stack[stack.length - 1] : null;

  function push() {
    if (stack.length >= maxSize) {
      setLastOp("underflow");
      setFlash(`Overflow — max size ${maxSize} reached`);
      return;
    }
    const v = value.trim();
    const parsed =
      v === "" ? Math.floor(Math.random() * 90) + 10 : /^-?\d+$/.test(v) ? Number(v) : v;
    setStack((s) => [...s, parsed]);
    setValue("");
    setLastOp("push");
    setFlash(`pushed ${parsed}`);
  }
  function pop() {
    if (!stack.length) {
      setLastOp("underflow");
      setFlash("Underflow — pop from empty stack");
      return;
    }
    const t = stack[stack.length - 1];
    setStack((s) => s.slice(0, -1));
    setLastOp("pop");
    setFlash(`popped ${t}`);
  }
  function peek() {
    if (!stack.length) {
      setLastOp("peek-empty");
      setFlash("Cannot peek — stack is empty");
      return;
    }
    setLastOp("peek");
    setFlash(`top = ${stack[stack.length - 1]}`);
  }
  function reset() {
    setStack(initial);
    setLastOp("reset");
    setFlash("Reset to initial state");
  }

  const opMeta = lastOp ? OP_META[lastOp] : null;

  return (
    <div className="card-surface p-4 sm:p-5">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && push()}
          placeholder="value (or blank for random)"
          className="min-w-0 flex-1 rounded-md border border-border bg-background px-3 py-1.5 text-sm"
        />
        <div className="flex flex-wrap gap-2">
          <Btn onClick={push} icon={<Plus className="h-3.5 w-3.5" />} label="Push" tone="brand" />
          <Btn onClick={pop} icon={<Minus className="h-3.5 w-3.5" />} label="Pop" />
          <Btn onClick={peek} icon={<Eye className="h-3.5 w-3.5" />} label="Peek" />
          <Btn onClick={reset} icon={<RotateCcw className="h-3.5 w-3.5" />} label="Reset" />
        </div>
      </div>

      <StackVisualizer items={stack} />

      <div className="mt-4 grid gap-2 sm:grid-cols-4">
        <Stat label="Size" value={String(stack.length)} />
        <Stat label="Top" value={top === null ? "null" : String(top)} />
        <Stat label="Last op" value={opMeta?.label ?? "—"} tone={opMeta?.tone} />
        <Stat label="Complexity" value={opMeta?.time ?? "—"} mono />
      </div>

      {flash && (
        <div
          className={`mt-3 flex items-center gap-2 rounded-md border px-3 py-2 text-xs ${
            lastOp === "underflow" || lastOp === "peek-empty"
              ? "border-rose-500/40 bg-rose-500/10 text-rose-500"
              : "border-border bg-muted/40 text-muted-foreground"
          }`}
        >
          {(lastOp === "underflow" || lastOp === "peek-empty") && (
            <AlertTriangle className="h-3.5 w-3.5" />
          )}
          {flash}
        </div>
      )}
    </div>
  );
}

function Btn({
  onClick,
  icon,
  label,
  tone,
}: {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  tone?: "brand";
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition ${
        tone === "brand"
          ? "gradient-brand text-primary-foreground"
          : "border border-border bg-card hover:border-[color:var(--brand)]/60"
      }`}
    >
      {icon} {label}
    </button>
  );
}

function Stat({
  label,
  value,
  tone,
  mono,
}: {
  label: string;
  value: string;
  tone?: string;
  mono?: boolean;
}) {
  return (
    <div className="rounded-md border border-border bg-card px-3 py-2">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div
        className={`mt-0.5 truncate text-sm font-semibold ${tone ?? ""} ${mono ? "font-mono" : ""}`}
      >
        {value}
      </div>
    </div>
  );
}
