import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Trash2, Search, RefreshCcw, Play, Pause, SkipForward, Shuffle,
  ArrowRight,
} from "lucide-react";
import { TreeVisualizer } from "@/components/TreeVisualizer";
import type { TreeNodeViz } from "@/lib/trees/types";

/* =========================================================
 * Shared helpers
 * ========================================================= */
type Node = { v: number; l: Node | null; r: Node | null };
type ANode = Node & { h: number };

function insert(n: Node | null, v: number): Node {
  if (!n) return { v, l: null, r: null };
  if (v < n.v) n.l = insert(n.l, v);
  else if (v > n.v) n.r = insert(n.r, v);
  return n;
}
function height(n: Node | null): number {
  return n ? 1 + Math.max(height(n.l), height(n.r)) : -1;
}
function toViz(
  n: Node | null,
  opts: { hi?: Set<number>; path?: Set<number>; badge?: (x: Node) => string | undefined } = {},
): TreeNodeViz | null {
  if (!n) return null;
  const kids = [n.l, n.r].filter((c): c is Node => !!c).map((c) => toViz(c, opts)!);
  return {
    id: n.v,
    label: n.v,
    color: opts.hi?.has(n.v) ? "highlight" : opts.path?.has(n.v) ? "visited" : "default",
    badge: opts.badge?.(n),
    children: kids.length ? kids : undefined,
  };
}
function fmtAddr(id: string | number) {
  const s = String(id);
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return "0x" + (Math.abs(h) % 0xffff).toString(16).padStart(4, "0").toUpperCase();
}

const btn = "inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1 text-xs hover:bg-accent";
const btnPrimary = "inline-flex items-center gap-1 rounded-md bg-[color:var(--brand)] px-2.5 py-1 text-xs font-medium text-primary-foreground hover:opacity-90";

function Log({ lines }: { lines: string[] }) {
  return (
    <div className="mt-3 max-h-32 overflow-y-auto rounded-md border border-border bg-muted/40 p-2 text-xs">
      <AnimatePresence initial={false}>
        {lines.map((l, i) => (
          <motion.div key={l + i} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="py-0.5 text-muted-foreground">
            › {l}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

/* =========================================================
 * 1) Binary Tree Playground — add / remove / classify nodes
 * ========================================================= */
type BTNode = { id: number; l: BTNode | null; r: BTNode | null };
let __btid = 100;
function classify(root: BTNode | null): {
  viz: TreeNodeViz | null; internal: number; leaves: number;
} {
  let internal = 0, leaves = 0;
  const walk = (n: BTNode | null): TreeNodeViz | null => {
    if (!n) return null;
    const isLeaf = !n.l && !n.r;
    if (isLeaf) leaves++; else internal++;
    const label = n.id === (root?.id ?? -1) ? `R:${n.id}` : String(n.id);
    return {
      id: n.id, label,
      color: n === root ? "brand" : isLeaf ? "visited" : "default",
      badge: isLeaf ? "leaf" : "internal",
      children: [walk(n.l), walk(n.r)].filter((x): x is TreeNodeViz => !!x).length
        ? [walk(n.l), walk(n.r)].filter((x): x is TreeNodeViz => !!x)
        : undefined,
    };
  };
  return { viz: walk(root), internal, leaves };
}
export function BinaryTreePlayground() {
  const [root, setRoot] = useState<BTNode | null>(() => {
    __btid = 100;
    const a: BTNode = { id: 1, l: null, r: null };
    a.l = { id: 2, l: { id: 4, l: null, r: null }, r: { id: 5, l: null, r: null } };
    a.r = { id: 3, l: null, r: { id: 6, l: null, r: null } };
    return a;
  });
  const [log, setLog] = useState<string[]>(["Click a node to add a child, or ✕ to remove."]);
  const push = (m: string) => setLog((p) => [m, ...p].slice(0, 6));
  const [selected, setSelected] = useState<number | null>(null);

  const addChild = (id: number, side: "l" | "r") => {
    const clone = (n: BTNode | null): BTNode | null =>
      n ? { ...n, l: clone(n.l), r: clone(n.r) } : null;
    const r2 = clone(root);
    const find = (n: BTNode | null): BTNode | null => {
      if (!n) return null;
      if (n.id === id) return n;
      return find(n.l) || find(n.r);
    };
    const target = find(r2);
    if (!target) return;
    if (target[side]) return push(`Slot ${side.toUpperCase()} already used`);
    target[side] = { id: ++__btid, l: null, r: null };
    setRoot(r2);
    push(`Added node ${__btid} as ${side === "l" ? "left" : "right"} child of ${id}`);
  };
  const remove = (id: number) => {
    if (root?.id === id) { setRoot(null); push(`Removed root ${id}`); return; }
    const clone = (n: BTNode | null): BTNode | null =>
      n ? { ...n, l: clone(n.l), r: clone(n.r) } : null;
    const r2 = clone(root);
    const strip = (n: BTNode | null): boolean => {
      if (!n) return false;
      if (n.l?.id === id) { n.l = null; return true; }
      if (n.r?.id === id) { n.r = null; return true; }
      return strip(n.l) || strip(n.r);
    };
    if (strip(r2)) { setRoot(r2); push(`Removed subtree rooted at ${id}`); }
  };

  const c = classify(root);

  const ids: number[] = [];
  const collect = (n: BTNode | null) => { if (!n) return; ids.push(n.id); collect(n.l); collect(n.r); };
  collect(root);

  return (
    <div className="card-surface p-4">
      <div className="mb-3 flex items-center justify-between text-sm">
        <div className="font-semibold">Binary Tree Playground</div>
        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
          <span>Root: <span className="text-[color:var(--brand)] font-mono">{root?.id ?? "—"}</span></span>
          <span>Internal: <span className="font-mono">{c.internal}</span></span>
          <span>Leaves: <span className="font-mono">{c.leaves}</span></span>
          <span>Height: <span className="font-mono">{height(root as unknown as Node)}</span></span>
        </div>
      </div>
      <TreeVisualizer root={c.viz} caption={root ? undefined : "Empty tree — click New root"} />
      {!root && (
        <div className="mt-3">
          <button className={btnPrimary} onClick={() => { __btid = 100; setRoot({ id: ++__btid, l: null, r: null }); push("New root created"); }}>
            <Plus className="h-3.5 w-3.5" /> New root
          </button>
        </div>
      )}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <div className="text-xs text-muted-foreground">Select node:</div>
        {ids.map((id) => (
          <button key={id} onClick={() => setSelected(id)}
            className={`rounded-md border px-2 py-0.5 text-xs font-mono ${selected === id ? "border-[color:var(--brand)] bg-[color:var(--brand)]/10" : "border-border"}`}>
            {id}
          </button>
        ))}
        {selected != null && (
          <div className="ml-auto flex flex-wrap gap-2">
            <button className={btn} onClick={() => addChild(selected, "l")}>+ Left</button>
            <button className={btn} onClick={() => addChild(selected, "r")}>+ Right</button>
            <button className={btn} onClick={() => { remove(selected); setSelected(null); }}>
              <Trash2 className="h-3.5 w-3.5" /> Remove
            </button>
          </div>
        )}
      </div>
      <Log lines={log} />
    </div>
  );
}

/* =========================================================
 * 2) Complete Binary Tree — level-fill with ghost slots
 * ========================================================= */
export function CompleteBinaryTreeViz({ count = 10 }: { count?: number }) {
  const [n, setN] = useState(count);
  // Build tree from array (heap indexing)
  const buildTree = (size: number): TreeNodeViz | null => {
    if (size <= 0) return null;
    const make = (i: number): TreeNodeViz | null => {
      if (i > size) {
        // ghost slot in the "next expected" position only if it's the immediate next
        if (i === size + 1)
          return { id: `g${i}`, label: "•", color: "muted", badge: "next slot" };
        return null;
      }
      const kids = [make(2 * i), make(2 * i + 1)].filter((x): x is TreeNodeViz => !!x);
      return { id: i, label: i, color: "brand", children: kids.length ? kids : undefined };
    };
    return make(1);
  };
  return (
    <div className="card-surface p-4">
      <div className="mb-2 flex items-center justify-between text-sm">
        <div className="font-semibold">Complete Binary Tree</div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-muted-foreground">Nodes:</span>
          <input type="range" min={1} max={31} value={n} onChange={(e) => setN(+e.target.value)} />
          <span className="font-mono">{n}</span>
        </div>
      </div>
      <TreeVisualizer root={buildTree(n)} caption="Every level filled left-to-right; the muted node marks the next slot." />
    </div>
  );
}

/* =========================================================
 * 3) Perfect Binary Tree
 * ========================================================= */
export function PerfectBinaryTreeViz({ levels = 3 }: { levels?: number }) {
  const [h, setH] = useState(levels);
  const build = (depth: number, id: number): TreeNodeViz => {
    if (depth === 0) return { id, label: id, color: "visited" };
    return {
      id, label: id, color: "brand",
      children: [build(depth - 1, id * 2), build(depth - 1, id * 2 + 1)],
    };
  };
  return (
    <div className="card-surface p-4">
      <div className="mb-2 flex items-center justify-between text-sm">
        <div className="font-semibold">Perfect Binary Tree</div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-muted-foreground">Height:</span>
          <input type="range" min={1} max={4} value={h} onChange={(e) => setH(+e.target.value)} />
          <span className="font-mono">{h}</span>
          <span className="ml-2 text-muted-foreground">Nodes: <span className="font-mono">{(1 << (h + 1)) - 1}</span></span>
        </div>
      </div>
      <TreeVisualizer root={build(h, 1)} caption="Every internal node has 2 children · all leaves at the same depth." />
    </div>
  );
}

/* =========================================================
 * 4) Full Binary Tree — invalid nodes highlighted
 * ========================================================= */
export function FullBinaryTreeViz() {
  const [broken, setBroken] = useState(false);
  const valid: TreeNodeViz = {
    id: 1, label: 1, color: "brand",
    children: [
      { id: 2, label: 2, color: "brand", children: [
        { id: 4, label: 4, color: "visited" },
        { id: 5, label: 5, color: "visited" },
      ]},
      { id: 3, label: 3, color: "visited" },
    ],
  };
  const invalid: TreeNodeViz = {
    id: 1, label: 1, color: "brand",
    children: [
      { id: 2, label: 2, color: "highlight", badge: "1 child ✗",
        children: [{ id: 4, label: 4, color: "visited" }] },
      { id: 3, label: 3, color: "visited" },
    ],
  };
  return (
    <div className="card-surface p-4">
      <div className="mb-2 flex items-center justify-between text-sm">
        <div className="font-semibold">Full Binary Tree</div>
        <button className={btn} onClick={() => setBroken((b) => !b)}>
          Show {broken ? "valid" : "invalid"}
        </button>
      </div>
      <TreeVisualizer root={broken ? invalid : valid}
        caption={broken ? "Node with exactly 1 child breaks the rule." : "Every node has 0 or exactly 2 children."} />
    </div>
  );
}

/* =========================================================
 * 5) Balanced vs Unbalanced
 * ========================================================= */
function annotate(n: Node | null): TreeNodeViz | null {
  if (!n) return null;
  const bf = height(n.l) - height(n.r);
  const kids = [annotate(n.l), annotate(n.r)].filter((x): x is TreeNodeViz => !!x);
  return {
    id: n.v, label: n.v,
    color: Math.abs(bf) > 1 ? "highlight" : "default",
    badge: `bf=${bf}`,
    children: kids.length ? kids : undefined,
  };
}
export function BalancedTreeViz() {
  const [mode, setMode] = useState<"balanced" | "unbalanced">("balanced");
  const balanced = [50, 30, 70, 20, 40, 60, 80].reduce<Node | null>((r, v) => insert(r, v), null);
  const unbal = [10, 20, 30, 40, 50].reduce<Node | null>((r, v) => insert(r, v), null);
  const cur = mode === "balanced" ? balanced : unbal;
  return (
    <div className="card-surface p-4">
      <div className="mb-2 flex items-center justify-between text-sm">
        <div className="font-semibold">Balanced Binary Tree · live balance factors</div>
        <div className="flex gap-2">
          <button className={mode === "balanced" ? btnPrimary : btn} onClick={() => setMode("balanced")}>Balanced</button>
          <button className={mode === "unbalanced" ? btnPrimary : btn} onClick={() => setMode("unbalanced")}>Unbalanced</button>
        </div>
      </div>
      <TreeVisualizer root={annotate(cur)}
        caption="bf = height(left) − height(right). |bf| > 1 (highlighted) means the node is unbalanced." />
    </div>
  );
}

/* =========================================================
 * 6) Degenerate tree — inserts sorted, becomes linked list
 * ========================================================= */
export function DegenerateTreeViz() {
  const [step, setStep] = useState(1);
  const arr = [1, 2, 3, 4, 5, 6, 7];
  const root = arr.slice(0, step).reduce<Node | null>((r, v) => insert(r, v), null);
  return (
    <div className="card-surface p-4">
      <div className="mb-2 flex items-center justify-between text-sm">
        <div className="font-semibold">Degenerate Tree</div>
        <div className="flex items-center gap-2 text-xs">
          <button className={btn} onClick={() => setStep(1)}><RefreshCcw className="h-3.5 w-3.5" /></button>
          <button className={btnPrimary} onClick={() => setStep((s) => Math.min(arr.length, s + 1))}>
            <SkipForward className="h-3.5 w-3.5" /> Insert {arr[Math.min(step, arr.length - 1)]}
          </button>
        </div>
      </div>
      <TreeVisualizer root={toViz(root)} caption={`Sorted inserts turn a BST into a linked list · height = ${height(root)}, O(n) operations.`} />
    </div>
  );
}

/* =========================================================
 * 7) AVL Playground — with rotations
 * ========================================================= */
function avlH(n: ANode | null) { return n ? n.h : 0; }
function bf(n: ANode) { return avlH(n.l as ANode | null) - avlH(n.r as ANode | null); }
function upd(n: ANode) { n.h = 1 + Math.max(avlH(n.l as ANode | null), avlH(n.r as ANode | null)); }
function rotR(y: ANode): ANode {
  const x = y.l as ANode; y.l = x.r; x.r = y; upd(y); upd(x); return x;
}
function rotL(x: ANode): ANode {
  const y = x.r as ANode; x.r = y.l; y.l = x; upd(x); upd(y); return y;
}
function avlInsert(n: ANode | null, v: number): ANode {
  if (!n) return { v, l: null, r: null, h: 1 };
  if (v < n.v) n.l = avlInsert(n.l as ANode | null, v);
  else if (v > n.v) n.r = avlInsert(n.r as ANode | null, v);
  else return n;
  upd(n);
  const b = bf(n);
  if (b > 1 && v < (n.l as ANode).v) return rotR(n);
  if (b < -1 && v > (n.r as ANode).v) return rotL(n);
  if (b > 1 && v > (n.l as ANode).v) { n.l = rotL(n.l as ANode); return rotR(n); }
  if (b < -1 && v < (n.r as ANode).v) { n.r = rotR(n.r as ANode); return rotL(n); }
  return n;
}
function avlAnnotate(n: ANode | null): TreeNodeViz | null {
  if (!n) return null;
  const b = bf(n);
  const kids = [avlAnnotate(n.l as ANode | null), avlAnnotate(n.r as ANode | null)].filter((x): x is TreeNodeViz => !!x);
  return {
    id: n.v, label: n.v,
    color: Math.abs(b) > 1 ? "highlight" : "default",
    badge: `bf=${b}`,
    children: kids.length ? kids : undefined,
  };
}
export function AVLPlayground() {
  const [root, setRoot] = useState<ANode | null>(() =>
    [30, 20, 40, 10].reduce<ANode | null>((r, v) => avlInsert(r, v), null),
  );
  const [val, setVal] = useState("");
  const [log, setLog] = useState<string[]>(["AVL auto-rotates to keep |bf| ≤ 1."]);
  const push = (m: string) => setLog((p) => [m, ...p].slice(0, 6));
  const doInsert = () => {
    const v = parseInt(val, 10); if (Number.isNaN(v)) return;
    setRoot((r) => avlInsert(r, v));
    push(`Inserted ${v}`); setVal("");
  };
  const doPreset = (name: "LL" | "RR" | "LR" | "RL") => {
    const preset: Record<string, number[]> = {
      LL: [30, 20, 10], RR: [10, 20, 30], LR: [30, 10, 20], RL: [10, 30, 20],
    };
    setRoot(preset[name].reduce<ANode | null>((r, v) => avlInsert(r, v), null));
    push(`${name} rotation preset loaded`);
  };
  return (
    <div className="card-surface p-4">
      <div className="mb-2 text-sm font-semibold">AVL Playground</div>
      <div className="mb-3 flex flex-wrap gap-2">
        <input value={val} onChange={(e) => setVal(e.target.value.replace(/[^\d]/g, ""))} placeholder="value"
          className="w-20 rounded-md border border-border bg-background px-2 py-1 text-sm"
          onKeyDown={(e) => e.key === "Enter" && doInsert()} />
        <button className={btnPrimary} onClick={doInsert}><Plus className="h-3.5 w-3.5" /> Insert</button>
        <div className="ml-2 flex gap-1">
          {(["LL", "RR", "LR", "RL"] as const).map((k) => (
            <button key={k} className={btn} onClick={() => doPreset(k)}>{k}</button>
          ))}
        </div>
        <button className={btn} onClick={() => setRoot(null)}>Clear</button>
      </div>
      <TreeVisualizer root={avlAnnotate(root)} caption="Nodes are annotated with their balance factor." />
      <Log lines={log} />
    </div>
  );
}

/* =========================================================
 * 8) Red-Black playground (light illustrative version)
 * ========================================================= */
type RBNode = { v: number; c: "red" | "black"; l: RBNode | null; r: RBNode | null };
function rbInsertSimple(root: RBNode | null, v: number): RBNode {
  const go = (n: RBNode | null): RBNode => {
    if (!n) return { v, c: "red", l: null, r: null };
    if (v < n.v) n.l = go(n.l);
    else if (v > n.v) n.r = go(n.r);
    return n;
  };
  const r = go(root);
  r.c = "black";
  // ad-hoc: recolor a red parent's red-child chain to black at depth 2 for illustration
  const paint = (n: RBNode | null, depth: number) => {
    if (!n) return;
    if (depth > 0 && depth % 2 === 1) n.c = "red"; else if (depth > 0) n.c = "black";
    paint(n.l, depth + 1);
    paint(n.r, depth + 1);
  };
  paint(r, 0);
  return r;
}
function rbToViz(n: RBNode | null): TreeNodeViz | null {
  if (!n) return null;
  const kids = [rbToViz(n.l), rbToViz(n.r)].filter((x): x is TreeNodeViz => !!x);
  return {
    id: n.v, label: n.v, color: n.c,
    children: kids.length ? kids : undefined,
  };
}
export function RedBlackPlayground() {
  const [root, setRoot] = useState<RBNode | null>(() =>
    [10, 20, 30, 15, 25].reduce<RBNode | null>((r, v) => rbInsertSimple(r, v), null),
  );
  const [val, setVal] = useState("");
  return (
    <div className="card-surface p-4">
      <div className="mb-2 text-sm font-semibold">Red-Black Tree (illustration)</div>
      <div className="mb-3 flex flex-wrap gap-2">
        <input value={val} onChange={(e) => setVal(e.target.value.replace(/[^\d]/g, ""))} placeholder="value"
          className="w-20 rounded-md border border-border bg-background px-2 py-1 text-sm" />
        <button className={btnPrimary} onClick={() => {
          const v = parseInt(val, 10); if (Number.isNaN(v)) return;
          setRoot((r) => rbInsertSimple(r, v)); setVal("");
        }}><Plus className="h-3.5 w-3.5" /> Insert</button>
        <button className={btn} onClick={() => setRoot(null)}>Clear</button>
      </div>
      <TreeVisualizer root={rbToViz(root)}
        caption="Red / Black coloring visualized · root is always black · no two consecutive red nodes on any path." />
    </div>
  );
}

/* =========================================================
 * 9) Trie Playground
 * ========================================================= */
type TrieN = { end: boolean; ch: Record<string, TrieN> };
function trieInsert(t: TrieN, w: string) {
  let cur = t;
  for (const c of w) { cur.ch[c] ??= { end: false, ch: {} }; cur = cur.ch[c]; }
  cur.end = true;
}
function trieCollect(t: TrieN, prefix: string, out: string[], limit = 8) {
  if (out.length >= limit) return;
  if (t.end) out.push(prefix);
  for (const k of Object.keys(t.ch).sort()) trieCollect(t.ch[k], prefix + k, out, limit);
}
function trieViz(t: TrieN, label = "•", id = "root", hi: Set<string> = new Set()): TreeNodeViz {
  const kids = Object.entries(t.ch)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([c, n]) => trieViz(n, c, id + "/" + c, hi));
  return {
    id, label,
    color: hi.has(id) ? "highlight" : t.end ? "visited" : "default",
    badge: t.end ? "★" : undefined,
    children: kids.length ? kids : undefined,
  };
}
export function TriePlayground({ seed = ["cat", "car", "cart", "dog"] }: { seed?: string[] } = {}) {
  const [t, setT] = useState<TrieN>(() => {
    const root: TrieN = { end: false, ch: {} };
    seed.forEach((w) => trieInsert(root, w));
    return root;
  });
  const [word, setWord] = useState("");
  const [prefix, setPrefix] = useState("");
  const [suggest, setSuggest] = useState<string[]>([]);
  const [hi, setHi] = useState<Set<string>>(new Set());

  const doInsert = () => {
    if (!word) return;
    const clone: TrieN = JSON.parse(JSON.stringify(t));
    trieInsert(clone, word.toLowerCase());
    setT(clone); setWord("");
  };
  const doPrefix = () => {
    let cur: TrieN | undefined = t;
    let id = "root";
    const path = new Set<string>([id]);
    for (const c of prefix.toLowerCase()) {
      if (!cur || !cur.ch[c]) { cur = undefined; break; }
      cur = cur.ch[c]; id = id + "/" + c; path.add(id);
    }
    setHi(path);
    const out: string[] = [];
    if (cur) trieCollect(cur, prefix.toLowerCase(), out);
    setSuggest(out);
  };

  return (
    <div className="card-surface p-4">
      <div className="mb-2 text-sm font-semibold">Trie Playground · insert · prefix search · autocomplete</div>
      <div className="mb-3 grid gap-2 sm:grid-cols-2">
        <div className="flex gap-2">
          <input value={word} onChange={(e) => setWord(e.target.value)} placeholder="word"
            className="w-32 rounded-md border border-border bg-background px-2 py-1 text-sm" />
          <button className={btnPrimary} onClick={doInsert}><Plus className="h-3.5 w-3.5" /> Insert</button>
        </div>
        <div className="flex gap-2">
          <input value={prefix} onChange={(e) => setPrefix(e.target.value)} placeholder="prefix"
            className="w-32 rounded-md border border-border bg-background px-2 py-1 text-sm" />
          <button className={btn} onClick={doPrefix}><Search className="h-3.5 w-3.5" /> Suggest</button>
        </div>
      </div>
      <TreeVisualizer root={trieViz(t, "•", "root", hi)}
        caption="★ marks end-of-word · highlighted path shows the prefix walk." />
      {suggest.length > 0 && (
        <div className="mt-3">
          <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Suggestions</div>
          <div className="flex flex-wrap gap-2">
            {suggest.map((s) => (
              <span key={s} className="rounded-md border border-border bg-muted/40 px-2 py-0.5 text-xs font-mono">{s}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================
 * 10) Segment Tree Playground
 * ========================================================= */
function buildSeg(a: number[]) {
  const n = a.length;
  const seg = new Array(4 * n).fill(0);
  const build = (node: number, l: number, r: number) => {
    if (l === r) { seg[node] = a[l]; return; }
    const m = (l + r) >> 1;
    build(node * 2, l, m); build(node * 2 + 1, m + 1, r);
    seg[node] = seg[node * 2] + seg[node * 2 + 1];
  };
  build(1, 0, n - 1);
  return { seg, n };
}
function segQuery(seg: number[], node: number, l: number, r: number, ql: number, qr: number): number {
  if (qr < l || r < ql) return 0;
  if (ql <= l && r <= qr) return seg[node];
  const m = (l + r) >> 1;
  return segQuery(seg, node * 2, l, m, ql, qr) + segQuery(seg, node * 2 + 1, m + 1, r, ql, qr);
}
function segUpdate(seg: number[], node: number, l: number, r: number, i: number, v: number) {
  if (l === r) { seg[node] = v; return; }
  const m = (l + r) >> 1;
  if (i <= m) segUpdate(seg, node * 2, l, m, i, v);
  else segUpdate(seg, node * 2 + 1, m + 1, r, i, v);
  seg[node] = seg[node * 2] + seg[node * 2 + 1];
}
function segToViz(seg: number[], node: number, l: number, r: number, hi: Set<number>): TreeNodeViz {
  const label = `${seg[node]}`;
  const meta = `[${l},${r}]`;
  const kids: TreeNodeViz[] = [];
  if (l !== r) {
    const m = (l + r) >> 1;
    kids.push(segToViz(seg, node * 2, l, m, hi));
    kids.push(segToViz(seg, node * 2 + 1, m + 1, r, hi));
  }
  return { id: node, label, color: hi.has(node) ? "highlight" : "default", badge: meta,
    children: kids.length ? kids : undefined };
}
export function SegmentTreePlayground({ data = [2, 1, 5, 3, 4, 7] }: { data?: number[] } = {}) {
  const [arr, setArr] = useState(data);
  const { seg, n } = useMemo(() => buildSeg(arr), [arr]);
  const [ql, setQl] = useState(1); const [qr, setQr] = useState(4);
  const [result, setResult] = useState<number | null>(null);
  const [hi, setHi] = useState<Set<number>>(new Set());
  const [ui, setUi] = useState<number>(2); const [uv, setUv] = useState<number>(10);

  const collectPath = (node: number, l: number, r: number, ql2: number, qr2: number, s: Set<number>) => {
    if (qr2 < l || r < ql2) return;
    s.add(node);
    if (ql2 <= l && r <= qr2) return;
    const m = (l + r) >> 1;
    collectPath(node * 2, l, m, ql2, qr2, s);
    collectPath(node * 2 + 1, m + 1, r, ql2, qr2, s);
  };

  const doQuery = () => {
    const s = new Set<number>();
    collectPath(1, 0, n - 1, ql, qr, s);
    setHi(s);
    setResult(segQuery(seg, 1, 0, n - 1, ql, qr));
  };
  const doUpdate = () => {
    const next = [...arr]; next[ui] = uv; setArr(next);
    setHi(new Set()); setResult(null);
  };

  return (
    <div className="card-surface p-4">
      <div className="mb-2 text-sm font-semibold">Segment Tree · range sum</div>
      <div className="mb-2 flex flex-wrap gap-2 text-xs">
        <span className="font-mono">arr = [{arr.join(", ")}]</span>
      </div>
      <div className="mb-3 grid gap-2 sm:grid-cols-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground">Query [l, r]:</span>
          <input type="number" min={0} max={n - 1} value={ql} onChange={(e) => setQl(+e.target.value)}
            className="w-14 rounded-md border border-border bg-background px-2 py-1 text-sm" />
          <input type="number" min={0} max={n - 1} value={qr} onChange={(e) => setQr(+e.target.value)}
            className="w-14 rounded-md border border-border bg-background px-2 py-1 text-sm" />
          <button className={btnPrimary} onClick={doQuery}>Sum</button>
          {result != null && <span className="rounded-md border border-border px-2 py-0.5 text-xs font-mono">= {result}</span>}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground">Update i, v:</span>
          <input type="number" min={0} max={n - 1} value={ui} onChange={(e) => setUi(+e.target.value)}
            className="w-14 rounded-md border border-border bg-background px-2 py-1 text-sm" />
          <input type="number" value={uv} onChange={(e) => setUv(+e.target.value)}
            className="w-16 rounded-md border border-border bg-background px-2 py-1 text-sm" />
          <button className={btn} onClick={doUpdate}>Apply</button>
        </div>
      </div>
      <TreeVisualizer root={segToViz(seg, 1, 0, n - 1, hi)}
        caption="Each node stores the sum of its range · highlighted nodes are visited during query." />
    </div>
  );
}

/* =========================================================
 * 11) Fenwick Tree — BIT + implicit tree
 * ========================================================= */
export function FenwickTreeViz({ data = [3, 2, -1, 6, 5, 4, -3, 3] }: { data?: number[] } = {}) {
  const [arr, setArr] = useState(data);
  const [i, setI] = useState(0);
  const [d, setD] = useState(1);
  const bit = useMemo(() => {
    const n = arr.length; const b = new Array(n + 1).fill(0);
    for (let idx = 1; idx <= n; idx++) {
      let x = idx; const val = arr[idx - 1];
      while (x <= n) { b[x] += val; x += x & -x; }
    }
    return b;
  }, [arr]);
  const [hi, setHi] = useState<Set<number>>(new Set());
  const [sum, setSum] = useState<number | null>(null);

  const prefix = (k: number) => {
    let x = k + 1; let s = 0; const path = new Set<number>();
    while (x > 0) { path.add(x); s += bit[x]; x -= x & -x; }
    setHi(path); setSum(s);
  };
  const update = (k: number, delta: number) => {
    const next = [...arr]; next[k] += delta; setArr(next);
    let x = k + 1; const path = new Set<number>();
    while (x <= arr.length) { path.add(x); x += x & -x; }
    setHi(path); setSum(null);
  };

  return (
    <div className="card-surface p-4">
      <div className="mb-2 text-sm font-semibold">Fenwick Tree (Binary Indexed Tree)</div>
      <div className="mb-2 font-mono text-xs">arr = [{arr.join(", ")}]</div>
      <div className="mb-3 grid gap-2 sm:grid-cols-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground">Prefix sum [0..i]:</span>
          <input type="number" min={0} max={arr.length - 1} value={i} onChange={(e) => setI(+e.target.value)}
            className="w-14 rounded-md border border-border bg-background px-2 py-1 text-sm" />
          <button className={btnPrimary} onClick={() => prefix(i)}>Compute</button>
          {sum != null && <span className="rounded-md border border-border px-2 py-0.5 text-xs font-mono">= {sum}</span>}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground">Point update:</span>
          <input type="number" min={0} max={arr.length - 1} value={i} onChange={(e) => setI(+e.target.value)}
            className="w-14 rounded-md border border-border bg-background px-2 py-1 text-sm" />
          <input type="number" value={d} onChange={(e) => setD(+e.target.value)}
            className="w-16 rounded-md border border-border bg-background px-2 py-1 text-sm" />
          <button className={btn} onClick={() => update(i, d)}>+= delta</button>
        </div>
      </div>
      <div className="grid grid-cols-8 gap-1 text-center font-mono text-xs">
        {bit.slice(1).map((v, idx) => (
          <div key={idx} className={`rounded-md border p-2 ${hi.has(idx + 1) ? "border-[color:var(--brand)] bg-[color:var(--brand)]/10" : "border-border bg-muted/40"}`}>
            <div className="font-semibold">{v}</div>
            <div className="text-[10px] text-muted-foreground">idx {idx + 1}</div>
          </div>
        ))}
      </div>
      <p className="mt-2 text-xs italic text-muted-foreground">Highlighted cells are the ones visited by the current prefix / update walk (jumping by x &amp;= x-1 or x += x &amp; -x).</p>
    </div>
  );
}

/* =========================================================
 * 12) Traversal player — step through Pre/In/Post/Level/Morris
 * ========================================================= */
type VNode = { id: string | number; children?: VNode[] };
function collectOrder(root: VNode | null, mode: "pre" | "in" | "post" | "level" | "morris"): (string | number)[] {
  if (!root) return [];
  const out: (string | number)[] = [];
  if (mode === "level" || mode === "morris") {
    const q: VNode[] = [root];
    while (q.length) { const x = q.shift()!; out.push(x.id); (x.children ?? []).forEach((c) => q.push(c)); }
    return out;
  }
  const walk = (n: VNode | null) => {
    if (!n) return;
    if (mode === "pre") out.push(n.id);
    walk(n.children?.[0] ?? null);
    if (mode === "in") out.push(n.id);
    walk(n.children?.[1] ?? null);
    if (mode === "post") out.push(n.id);
  };
  walk(root);
  return out;
}
export function TraversalPlayer({
  root, mode = "in",
}: { root: TreeNodeViz; mode?: "pre" | "in" | "post" | "level" | "morris" }) {
  const [m, setM] = useState(mode);
  const order = useMemo(() => collectOrder(root as VNode, m), [root, m]);
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(false);
  const tref = useRef<number | null>(null);
  useEffect(() => {
    if (!playing) return;
    tref.current = window.setTimeout(() => setI((v) => Math.min(order.length, v + 1)), 700);
    return () => { if (tref.current) window.clearTimeout(tref.current); };
  }, [playing, i, order.length]);
  useEffect(() => { if (i >= order.length) setPlaying(false); }, [i, order.length]);

  const visited = new Set(order.slice(0, i).map(String));
  const paint = (n: TreeNodeViz): TreeNodeViz => ({
    ...n,
    color: visited.has(String(n.id)) ? "visited" : String(order[i]) === String(n.id) ? "highlight" : n.color,
    children: n.children?.map(paint),
  });

  return (
    <div className="card-surface p-4">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold">Traversal Player</div>
        <div className="flex flex-wrap items-center gap-2">
          <select value={m} onChange={(e) => { setM(e.target.value as typeof m); setI(0); setPlaying(false); }}
            className="rounded-md border border-border bg-background px-2 py-1 text-xs">
            <option value="pre">Preorder</option>
            <option value="in">Inorder</option>
            <option value="post">Postorder</option>
            <option value="level">Level order (BFS)</option>
            <option value="morris">Morris (level-fallback)</option>
          </select>
          <button className={btn} onClick={() => setI(0)}><RefreshCcw className="h-3.5 w-3.5" /></button>
          <button className={btnPrimary} onClick={() => setPlaying((p) => !p)}>
            {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            {playing ? "Pause" : "Play"}
          </button>
          <button className={btn} onClick={() => setI((v) => Math.min(order.length, v + 1))}>
            <SkipForward className="h-3.5 w-3.5" /> Step
          </button>
        </div>
      </div>
      <TreeVisualizer root={paint(root)} />
      <div className="mt-3 flex flex-wrap items-center gap-1 rounded-md border border-border bg-muted/40 p-2 font-mono text-xs">
        {order.map((v, idx) => (
          <span key={idx} className={`rounded px-1.5 py-0.5 ${idx < i ? "bg-emerald-500/15 text-emerald-500" : idx === i ? "bg-[color:var(--brand)]/15 text-[color:var(--brand)]" : "text-muted-foreground"}`}>{v}</span>
        ))}
      </div>
    </div>
  );
}

/* =========================================================
 * 13) Memory diagram
 * ========================================================= */
export function MemoryDiagram({
  nodes,
  caption,
}: {
  nodes: { id: string; value: string | number; left?: string | null; right?: string | null }[];
  caption?: string;
}) {
  const addr = Object.fromEntries(nodes.map((n) => [n.id, fmtAddr(n.id)] as const));
  return (
    <div className="card-surface p-4">
      <div className="mb-3 text-sm font-semibold">Memory Representation</div>
      <div className="flex flex-wrap gap-3">
        {nodes.map((n) => (
          <div key={n.id} className="rounded-lg border border-border bg-muted/30 p-3 text-xs font-mono">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{addr[n.id]}</div>
            <div className="mt-1 grid grid-cols-3 gap-1 text-center">
              <div className="rounded border border-border bg-background px-2 py-1">
                <div className="text-[9px] text-muted-foreground">left</div>
                <div>{n.left ? addr[n.left] ?? "?" : "None"}</div>
              </div>
              <div className="rounded border border-[color:var(--brand)]/60 bg-[color:var(--brand)]/10 px-2 py-1">
                <div className="text-[9px] text-[color:var(--brand)]">value</div>
                <div className="text-sm font-semibold">{n.value}</div>
              </div>
              <div className="rounded border border-border bg-background px-2 py-1">
                <div className="text-[9px] text-muted-foreground">right</div>
                <div>{n.right ? addr[n.right] ?? "?" : "None"}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {caption && <p className="mt-2 text-xs italic text-muted-foreground">{caption}</p>}
    </div>
  );
}

/* Re-exports so the SectionRenderer can import from a single module */
export {};
// keep unused import warnings quiet when tree-shaking:
void Shuffle; void ArrowRight;
