import { useState } from "react";
import { Plus, Minus, Eye, RotateCcw, AlertTriangle } from "lucide-react";
import { QueueVisualizer } from "./QueueVisualizer";

type Op = "enqueue" | "dequeue" | "peek" | "reset" | "underflow" | "overflow" | "peek-empty";

const OP_META: Record<Op, { label: string; time: string; tone: string }> = {
  enqueue: { label: "Enqueue", time: "O(1)", tone: "text-emerald-500" },
  dequeue: { label: "Dequeue", time: "O(1)", tone: "text-emerald-500" },
  peek: { label: "Peek", time: "O(1)", tone: "text-emerald-500" },
  reset: { label: "Reset", time: "O(n)", tone: "text-muted-foreground" },
  underflow: { label: "Underflow!", time: "—", tone: "text-rose-500" },
  overflow: { label: "Overflow!", time: "—", tone: "text-rose-500" },
  "peek-empty": { label: "Peek on empty", time: "—", tone: "text-rose-500" },
};

/**
 * Interactive queue playground — enqueue / dequeue / peek / reset with
 * live FRONT & REAR pointers, size, and last-op complexity panel.
 */
export function QueuePlayground({
  initial = [10, 20, 30],
  maxSize = 10,
}: {
  initial?: Array<string | number>;
  maxSize?: number;
}) {
  const [q, setQ] = useState<Array<string | number>>(initial);
  const [value, setValue] = useState("");
  const [lastOp, setLastOp] = useState<Op | null>(null);
  const [flash, setFlash] = useState<string | null>(null);

  const front = q.length ? q[0] : null;
  const rear = q.length ? q[q.length - 1] : null;

  function enqueue() {
    if (q.length >= maxSize) {
      setLastOp("overflow");
      setFlash(`Overflow — max size ${maxSize} reached`);
      return;
    }
    const v = value.trim();
    const parsed =
      v === "" ? Math.floor(Math.random() * 90) + 10 : /^-?\d+$/.test(v) ? Number(v) : v;
    setQ((s) => [...s, parsed]);
    setValue("");
    setLastOp("enqueue");
    setFlash(`enqueued ${parsed} at REAR`);
  }
  function dequeue() {
    if (!q.length) {
      setLastOp("underflow");
      setFlash("Underflow — dequeue from empty queue");
      return;
    }
    const t = q[0];
    setQ((s) => s.slice(1));
    setLastOp("dequeue");
    setFlash(`dequeued ${t} from FRONT`);
  }
  function peek() {
    if (!q.length) {
      setLastOp("peek-empty");
      setFlash("Cannot peek — queue is empty");
      return;
    }
    setLastOp("peek");
    setFlash(`front = ${q[0]}`);
  }
  function reset() {
    setQ(initial);
    setLastOp("reset");
    setFlash("Reset to initial state");
  }

  const meta = lastOp ? OP_META[lastOp] : null;

  return (
    <div className="card-surface p-4 sm:p-5">
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && enqueue()}
          placeholder="value (or blank for random)"
          className="min-w-0 flex-1 rounded-md border border-border bg-background px-3 py-1.5 text-sm"
        />
        <div className="flex flex-wrap gap-2">
          <Btn
            onClick={enqueue}
            icon={<Plus className="h-3.5 w-3.5" />}
            label="Enqueue"
            tone="brand"
          />
          <Btn onClick={dequeue} icon={<Minus className="h-3.5 w-3.5" />} label="Dequeue" />
          <Btn onClick={peek} icon={<Eye className="h-3.5 w-3.5" />} label="Peek" />
          <Btn onClick={reset} icon={<RotateCcw className="h-3.5 w-3.5" />} label="Reset" />
        </div>
      </div>

      <QueueVisualizer items={q} />

      <div className="mt-4 grid gap-2 sm:grid-cols-4">
        <Stat label="Size" value={String(q.length)} />
        <Stat label="Front" value={front === null ? "null" : String(front)} />
        <Stat label="Rear" value={rear === null ? "null" : String(rear)} />
        <Stat label="Last op" value={meta?.label ?? "—"} tone={meta?.tone} />
      </div>

      {flash && (
        <div
          className={`mt-3 flex items-center gap-2 rounded-md border px-3 py-2 text-xs ${
            lastOp === "underflow" || lastOp === "overflow" || lastOp === "peek-empty"
              ? "border-rose-500/40 bg-rose-500/10 text-rose-500"
              : "border-border bg-muted/40 text-muted-foreground"
          }`}
        >
          {(lastOp === "underflow" || lastOp === "overflow" || lastOp === "peek-empty") && (
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

function Stat({ label, value, tone }: { label: string; value: string; tone?: string }) {
  return (
    <div className="rounded-md border border-border bg-card px-3 py-2">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`mt-0.5 truncate text-sm font-semibold ${tone ?? ""}`}>{value}</div>
    </div>
  );
}
