import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, RefreshCcw, Search, Trash2, TreeDeciduous } from "lucide-react";
import { TreeVisualizer } from "./TreeVisualizer";
import type { TreeNodeViz } from "@/lib/trees/types";

// ---------- BST core ----------
type BstNode = { v: number; l: BstNode | null; r: BstNode | null };

function bstInsert(root: BstNode | null, v: number): BstNode {
  if (!root) return { v, l: null, r: null };
  if (v < root.v) root.l = bstInsert(root.l, v);
  else if (v > root.v) root.r = bstInsert(root.r, v);
  return root;
}
function bstDelete(root: BstNode | null, v: number): BstNode | null {
  if (!root) return null;
  if (v < root.v) root.l = bstDelete(root.l, v);
  else if (v > root.v) root.r = bstDelete(root.r, v);
  else {
    if (!root.l) return root.r;
    if (!root.r) return root.l;
    let s = root.r;
    while (s.l) s = s.l;
    root.v = s.v;
    root.r = bstDelete(root.r, s.v);
  }
  return root;
}
function bstFindPath(root: BstNode | null, v: number): number[] {
  const p: number[] = [];
  let cur = root;
  while (cur) {
    p.push(cur.v);
    if (cur.v === v) return p;
    cur = v < cur.v ? cur.l : cur.r;
  }
  return [];
}
function toViz(n: BstNode | null, hi: Set<number>, path: Set<number>): TreeNodeViz | null {
  if (!n) return null;
  const kids = [n.l, n.r].filter((c): c is BstNode => c !== null).map((c) => toViz(c, hi, path)!);
  return {
    id: n.v,
    label: n.v,
    color: hi.has(n.v) ? "highlight" : path.has(n.v) ? "visited" : "default",
    children: kids.length ? kids : undefined,
  };
}
function stats(n: BstNode | null): { size: number; leaves: number; height: number } {
  if (!n) return { size: 0, leaves: 0, height: -1 };
  const l = stats(n.l);
  const r = stats(n.r);
  const isLeaf = !n.l && !n.r;
  return {
    size: 1 + l.size + r.size,
    leaves: isLeaf ? 1 : l.leaves + r.leaves,
    height: 1 + Math.max(l.height, r.height),
  };
}
function orderTraverse(n: BstNode | null, mode: "in" | "pre" | "post" | "level"): number[] {
  const out: number[] = [];
  if (mode === "level") {
    const q: BstNode[] = n ? [n] : [];
    while (q.length) {
      const cur = q.shift()!;
      out.push(cur.v);
      if (cur.l) q.push(cur.l);
      if (cur.r) q.push(cur.r);
    }
    return out;
  }
  const walk = (x: BstNode | null) => {
    if (!x) return;
    if (mode === "pre") out.push(x.v);
    walk(x.l);
    if (mode === "in") out.push(x.v);
    walk(x.r);
    if (mode === "post") out.push(x.v);
  };
  walk(n);
  return out;
}

// ---------- component ----------
const DEFAULTS = [50, 30, 70, 20, 40, 60, 80, 10, 35, 65];

export function TreePlayground({ initial = DEFAULTS }: { initial?: number[] } = {}) {
  const [root, setRoot] = useState<BstNode | null>(() =>
    initial.reduce<BstNode | null>((r, v) => bstInsert(r, v), null),
  );
  const [value, setValue] = useState("");
  const [hi, setHi] = useState<Set<number>>(new Set());
  const [path, setPath] = useState<Set<number>>(new Set());
  const [log, setLog] = useState<string[]>(["Ready. Try inserting a value."]);
  const [mode, setMode] = useState<"in" | "pre" | "post" | "level">("in");

  const meta = useMemo(() => stats(root), [root]);
  const order = useMemo(() => orderTraverse(root, mode), [root, mode]);
  const viz = useMemo(() => toViz(root, hi, path), [root, hi, path]);

  const pushLog = (msg: string) =>
    setLog((prev) => [msg, ...prev].slice(0, 6));

  const parse = (): number | null => {
    const v = parseInt(value, 10);
    if (Number.isNaN(v)) return null;
    return v;
  };

  const doInsert = () => {
    const v = parse();
    if (v == null) return;
    setRoot((r) => bstInsert(r ? { ...r } : null, v));
    setHi(new Set([v]));
    setPath(new Set());
    pushLog(`Inserted ${v}`);
    setValue("");
    setTimeout(() => setHi(new Set()), 900);
  };
  const doDelete = () => {
    const v = parse();
    if (v == null) return;
    if (bstFindPath(root, v).length === 0) {
      pushLog(`Delete: ${v} not found`);
      return;
    }
    setRoot((r) => bstDelete(r ? { ...r } : null, v));
    pushLog(`Deleted ${v}`);
    setValue("");
  };
  const doSearch = () => {
    const v = parse();
    if (v == null) return;
    const p = bstFindPath(root, v);
    setPath(new Set(p));
    setHi(new Set(p.length && p[p.length - 1] === v ? [v] : []));
    pushLog(p.length && p[p.length - 1] === v ? `Found ${v} in ${p.length} step(s)` : `${v} not found`);
    setTimeout(() => {
      setHi(new Set());
      setPath(new Set());
    }, 1600);
  };
  const doReset = () => {
    setRoot(DEFAULTS.reduce<BstNode | null>((r, v) => bstInsert(r, v), null));
    setHi(new Set());
    setPath(new Set());
    pushLog("Reset to default BST");
  };
  const doClear = () => {
    setRoot(null);
    setHi(new Set());
    setPath(new Set());
    pushLog("Cleared tree");
  };
  const doRandom = () => {
    const arr = Array.from({ length: 7 }, () => Math.floor(Math.random() * 90) + 10);
    setRoot(arr.reduce<BstNode | null>((r, v) => bstInsert(r, v), null));
    setHi(new Set());
    setPath(new Set());
    pushLog(`Built random tree from ${arr.join(", ")}`);
  };

  return (
    <div className="card-surface p-4 sm:p-5">
      <div className="mb-3 flex items-center gap-2">
        <TreeDeciduous className="h-4 w-4 text-[color:var(--brand)]" />
        <h3 className="text-sm font-semibold">Interactive Tree Playground</h3>
        <span className="ml-auto text-xs text-muted-foreground">Backed by a live BST</span>
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value.replace(/[^\d-]/g, ""))}
          placeholder="value"
          className="w-24 rounded-md border border-border bg-background px-2 py-1 text-sm"
          onKeyDown={(e) => e.key === "Enter" && doInsert()}
        />
        <button onClick={doInsert} className="inline-flex items-center gap-1 rounded-md bg-[color:var(--brand)] px-2.5 py-1 text-xs font-medium text-primary-foreground hover:opacity-90">
          <Plus className="h-3.5 w-3.5" /> Insert
        </button>
        <button onClick={doSearch} className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1 text-xs hover:bg-accent">
          <Search className="h-3.5 w-3.5" /> Search
        </button>
        <button onClick={doDelete} className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1 text-xs hover:bg-accent">
          <Trash2 className="h-3.5 w-3.5" /> Delete
        </button>
        <button onClick={doRandom} className="rounded-md border border-border px-2.5 py-1 text-xs hover:bg-accent">Random</button>
        <button onClick={doReset} className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1 text-xs hover:bg-accent">
          <RefreshCcw className="h-3.5 w-3.5" /> Reset
        </button>
        <button onClick={doClear} className="rounded-md border border-border px-2.5 py-1 text-xs hover:bg-accent">Clear</button>
      </div>

      <TreeVisualizer root={viz} caption={viz ? undefined : "Insert a value to grow the tree"} />

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div>
          <div className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Metrics</div>
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            <Metric label="Nodes" value={meta.size} />
            <Metric label="Leaves" value={meta.leaves} />
            <Metric label="Height" value={meta.height < 0 ? 0 : meta.height} />
            <Metric label="Levels" value={meta.height + 1 <= 0 ? 0 : meta.height + 1} />
          </div>
          <div className="mt-3">
            <div className="mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Traversal
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value as typeof mode)}
                className="rounded-md border border-border bg-background px-1.5 py-0.5 text-[11px] font-normal capitalize text-foreground"
              >
                <option value="in">Inorder</option>
                <option value="pre">Preorder</option>
                <option value="post">Postorder</option>
                <option value="level">Level order</option>
              </select>
            </div>
            <div className="rounded-md border border-border bg-muted/40 p-2 font-mono text-xs">
              [{order.join(", ")}]
            </div>
          </div>
        </div>
        <div>
          <div className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Log</div>
          <div className="max-h-40 overflow-y-auto rounded-md border border-border bg-muted/40 p-2">
            <AnimatePresence initial={false}>
              {log.map((l, i) => (
                <motion.div
                  key={l + i}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="py-0.5 text-xs text-muted-foreground"
                >
                  › {l}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-md border border-border bg-muted/30 p-2">
      <div className="text-lg font-semibold">{value}</div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
    </div>
  );
}
