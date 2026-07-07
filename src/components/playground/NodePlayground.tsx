import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Plus, Link2, Unlink, RotateCcw, Trash2 } from "lucide-react";

// --- types ---------------------------------------------------------------

type Node = {
  id: string;
  value: number;
  addr: string; // simulated hex address, stable per node
  next: string | null; // id of the node it points to
};

const HEX = (n: number) => "0x" + n.toString(16).toUpperCase().padStart(3, "0");

function newNode(index: number, value: number): Node {
  // 0x120, 0x240, 0x360, ... — pretend heap addresses
  return {
    id: `n-${Date.now()}-${index}-${Math.random().toString(36).slice(2, 6)}`,
    value,
    addr: HEX(0x120 * (index + 1)),
    next: null,
  };
}

// --- component -----------------------------------------------------------

/**
 * NodePlayground — a hands-on visual for the Foundations tier.
 * Focused on *nodes*, not full-list operations: create, connect, disconnect,
 * move head/tail chips, and observe simulated memory addresses update live.
 */
export function NodePlayground() {
  const [nodes, setNodes] = useState<Node[]>(() => [
    { ...newNode(0, 10) },
    { ...newNode(1, 20) },
    { ...newNode(2, 30) },
  ]);
  const [head, setHead] = useState<string | null>(null);
  const [tail, setTail] = useState<string | null>(null);
  const [pickFrom, setPickFrom] = useState<string | null>(null);
  const [action, setAction] = useState<string>("Ready — create or connect nodes.");
  const [value, setValue] = useState("40");

  const nodeById = useMemo(() => Object.fromEntries(nodes.map((n) => [n.id, n])), [nodes]);

  const create = () => {
    const v = Number(value) || 0;
    const n = newNode(nodes.length, v);
    setNodes((prev) => [...prev, n]);
    setAction(`Created node { val: ${v}, addr: ${n.addr}, next: NULL }`);
  };

  const remove = (id: string) => {
    setNodes((prev) =>
      prev.filter((n) => n.id !== id).map((n) => (n.next === id ? { ...n, next: null } : n)),
    );
    if (head === id) setHead(null);
    if (tail === id) setTail(null);
    if (pickFrom === id) setPickFrom(null);
    setAction(`Deleted node ${nodeById[id]?.addr}. Any incoming pointer became NULL.`);
  };

  const startConnect = (id: string) => {
    setPickFrom(id);
    setAction(`Pick the target: click any node to set ${nodeById[id]?.addr}.next → target.addr`);
  };

  const connectTo = (target: string) => {
    if (!pickFrom || pickFrom === target) {
      setPickFrom(null);
      return;
    }
    setNodes((prev) => prev.map((n) => (n.id === pickFrom ? { ...n, next: target } : n)));
    setAction(`Wired ${nodeById[pickFrom]?.addr}.next → ${nodeById[target]?.addr}`);
    setPickFrom(null);
  };

  const disconnect = (id: string) => {
    setNodes((prev) => prev.map((n) => (n.id === id ? { ...n, next: null } : n)));
    setAction(`Cleared ${nodeById[id]?.addr}.next → NULL`);
  };

  const reset = () => {
    setNodes([newNode(0, 10), newNode(1, 20), newNode(2, 30)]);
    setHead(null);
    setTail(null);
    setPickFrom(null);
    setAction("Reset to three fresh, unlinked nodes.");
  };

  return (
    <div className="card-surface p-4 sm:p-5">
      {/* Info strip */}
      <div className="mb-4 grid grid-cols-2 gap-2 rounded-md border border-border bg-muted/40 p-3 text-xs sm:grid-cols-4">
        <InfoCell label="Nodes" value={String(nodes.length)} />
        <InfoCell label="HEAD" value={head ? (nodeById[head]?.addr ?? "—") : "NULL"} />
        <InfoCell label="TAIL" value={tail ? (nodeById[tail]?.addr ?? "—") : "NULL"} />
        <InfoCell label="Last action" value={pickFrom ? "waiting for target…" : "idle"} />
      </div>

      {/* Toolbar */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value.replace(/[^\d-]/g, "").slice(0, 4))}
          className="w-16 rounded-md border border-border bg-background px-2 py-1.5 text-sm"
          aria-label="new node value"
        />
        <ToolbarBtn onClick={create} icon={<Plus className="h-3.5 w-3.5" />}>
          Create Node
        </ToolbarBtn>
        <ToolbarBtn onClick={reset} icon={<RotateCcw className="h-3.5 w-3.5" />}>
          Reset
        </ToolbarBtn>
        <span className="ml-auto text-[11px] text-muted-foreground">
          Click <b>connect</b> on a node, then click another to wire <code>next</code>.
        </span>
      </div>

      {/* Nodes */}
      <div className="flex flex-wrap gap-3">
        <AnimatePresence initial={false}>
          {nodes.map((n) => {
            const isHead = head === n.id;
            const isTail = tail === n.id;
            const isPickSrc = pickFrom === n.id;
            const isPickCandidate = pickFrom !== null && pickFrom !== n.id;
            return (
              <motion.div
                key={n.id}
                layout
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                onClick={() => (isPickCandidate ? connectTo(n.id) : undefined)}
                className={[
                  "relative w-[180px] shrink-0 rounded-lg border p-3 transition",
                  isPickSrc
                    ? "border-[color:var(--brand)] ring-2 ring-[color:var(--brand)]/40"
                    : isPickCandidate
                      ? "border-emerald-500/60 cursor-pointer hover:bg-emerald-500/5"
                      : "border-border bg-card",
                ].join(" ")}
              >
                {/* Head/Tail chips */}
                <div className="mb-2 flex items-center gap-1.5 text-[10px]">
                  <Chip active={isHead} onClick={() => setHead(isHead ? null : n.id)}>
                    HEAD
                  </Chip>
                  <Chip active={isTail} onClick={() => setTail(isTail ? null : n.id)}>
                    TAIL
                  </Chip>
                  <button
                    onClick={() => remove(n.id)}
                    className="ml-auto text-muted-foreground hover:text-rose-500"
                    aria-label="delete node"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Value */}
                <div className="text-2xl font-bold tracking-tight">{n.value}</div>

                {/* Address + next */}
                <div className="mt-2 space-y-0.5 font-mono text-[11px] text-muted-foreground">
                  <div>
                    addr: <span className="text-foreground">{n.addr}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    next:{" "}
                    <span
                      className={n.next ? "text-[color:var(--brand)]" : "text-muted-foreground"}
                    >
                      {n.next ? (nodeById[n.next]?.addr ?? "NULL") : "NULL"}
                    </span>
                    {n.next && <ArrowRight className="h-3 w-3 text-[color:var(--brand)]" />}
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-3 flex gap-1.5">
                  <IconBtn onClick={() => startConnect(n.id)} title="Connect this node to another">
                    <Link2 className="h-3.5 w-3.5" /> connect
                  </IconBtn>
                  <IconBtn onClick={() => disconnect(n.id)} title="Set next → NULL">
                    <Unlink className="h-3.5 w-3.5" /> unlink
                  </IconBtn>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Action log */}
      <div className="mt-4 rounded-md border border-border/70 bg-muted/30 p-2 text-xs font-mono text-muted-foreground">
        {action}
      </div>
    </div>
  );
}

function InfoCell({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground/80">{label}</div>
      <div className="mt-0.5 font-mono text-sm text-foreground">{value}</div>
    </div>
  );
}

function ToolbarBtn({
  onClick,
  icon,
  children,
}: {
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs font-medium transition hover:border-[color:var(--brand)]/60 hover:bg-accent"
    >
      {icon}
      {children}
    </button>
  );
}

function IconBtn({
  onClick,
  title,
  children,
}: {
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="inline-flex items-center gap-1 rounded border border-border/70 px-1.5 py-1 text-[10px] uppercase tracking-wider text-muted-foreground transition hover:border-[color:var(--brand)]/60 hover:text-foreground"
    >
      {children}
    </button>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded px-1.5 py-0.5 font-semibold uppercase tracking-wider transition ${
        active
          ? "bg-[color:var(--brand)] text-primary-foreground"
          : "bg-muted text-muted-foreground hover:bg-accent"
      }`}
    >
      {children}
    </button>
  );
}
