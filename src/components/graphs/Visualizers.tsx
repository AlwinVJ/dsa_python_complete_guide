import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, SkipForward, RefreshCcw } from "lucide-react";
import type { GraphSpec, GNode, GEdge } from "@/lib/graphs/types";

/* =========================================================
 * Shared layout helpers
 * ========================================================= */

export function layoutCircle(nodes: GNode[], w = 520, h = 320, pad = 40): Record<string, { x: number; y: number }> {
  const cx = w / 2;
  const cy = h / 2;
  const r = Math.min(w, h) / 2 - pad;
  const out: Record<string, { x: number; y: number }> = {};
  nodes.forEach((n, i) => {
    if (typeof n.x === "number" && typeof n.y === "number") {
      out[n.id] = { x: n.x, y: n.y };
      return;
    }
    const t = (i / nodes.length) * Math.PI * 2 - Math.PI / 2;
    out[n.id] = { x: cx + r * Math.cos(t), y: cy + r * Math.sin(t) };
  });
  return out;
}

const NODE_R = 20;

const colorFor = (kind?: string): { fill: string; stroke: string; text: string } => {
  switch (kind) {
    case "brand": return { fill: "color-mix(in oklab, var(--brand) 22%, transparent)", stroke: "var(--brand)", text: "var(--brand)" };
    case "highlight": return { fill: "color-mix(in oklab, var(--warn) 25%, transparent)", stroke: "var(--warn)", text: "var(--warn)" };
    case "visited": return { fill: "color-mix(in oklab, var(--good) 22%, transparent)", stroke: "var(--good)", text: "var(--good)" };
    case "muted": return { fill: "color-mix(in oklab, var(--muted-foreground) 12%, transparent)", stroke: "var(--muted-foreground)", text: "var(--muted-foreground)" };
    case "warn": return { fill: "color-mix(in oklab, var(--bad) 22%, transparent)", stroke: "var(--bad)", text: "var(--bad)" };
    case "good": return { fill: "color-mix(in oklab, var(--good) 22%, transparent)", stroke: "var(--good)", text: "var(--good)" };
    default: return { fill: "var(--card)", stroke: "color-mix(in oklab, var(--foreground) 25%, transparent)", text: "var(--foreground)" };
  }
};

function edgeKey(e: GEdge) {
  return `${e.from}-${e.to}`;
}

/* =========================================================
 * GraphViz — SVG rendering for static graphs
 * ========================================================= */

export function GraphViz({ spec, caption, minHeight = 320 }: { spec: GraphSpec; caption?: string; minHeight?: number }) {
  const W = 560;
  const H = Math.max(minHeight, 300);
  const pos = useMemo(() => layoutCircle(spec.nodes, W, H), [spec.nodes]);
  const highlightSet = new Set(spec.highlightEdges ?? []);

  return (
    <figure className="card-surface p-4">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: H }}>
        {spec.directed && (
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" fill="var(--muted-foreground)" />
            </marker>
            <marker id="arrow-hi" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" fill="var(--brand)" />
            </marker>
          </defs>
        )}

        {spec.edges.map((e) => {
          const a = pos[e.from];
          const b = pos[e.to];
          if (!a || !b) return null;
          const hi = highlightSet.has(edgeKey(e));
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const len = Math.hypot(dx, dy) || 1;
          const nx = dx / len;
          const ny = dy / len;
          const sx = a.x + nx * NODE_R;
          const sy = a.y + ny * NODE_R;
          const tx = b.x - nx * NODE_R;
          const ty = b.y - ny * NODE_R;
          const mx = (sx + tx) / 2;
          const my = (sy + ty) / 2;
          return (
            <g key={`${e.from}-${e.to}-${e.weight ?? ""}`}>
              <line
                x1={sx} y1={sy} x2={tx} y2={ty}
                stroke={hi ? "var(--brand)" : "color-mix(in oklab, var(--foreground) 35%, transparent)"}
                strokeWidth={hi ? 2.5 : 1.5}
                markerEnd={spec.directed ? (hi ? "url(#arrow-hi)" : "url(#arrow)") : undefined}
              />
              {(spec.weighted || e.weight != null) && (
                <g>
                  <rect x={mx - 12} y={my - 9} width={24} height={16} rx={4}
                    fill="var(--card)" stroke="color-mix(in oklab, var(--foreground) 20%, transparent)" />
                  <text x={mx} y={my + 3} textAnchor="middle" fontSize={10} fill="var(--foreground)">{e.weight ?? ""}</text>
                </g>
              )}
            </g>
          );
        })}

        {spec.nodes.map((n) => {
          const p = pos[n.id];
          if (!p) return null;
          const c = colorFor(spec.colors?.[n.id]);
          return (
            <g key={n.id}>
              <circle cx={p.x} cy={p.y} r={NODE_R} fill={c.fill} stroke={c.stroke} strokeWidth={2} />
              <text x={p.x} y={p.y + 4} textAnchor="middle" fontSize={12} fontWeight={600} fill={c.text}>
                {n.label ?? n.id}
              </text>
            </g>
          );
        })}
      </svg>
      {caption && <figcaption className="mt-2 text-center text-xs italic text-muted-foreground">{caption}</figcaption>}
    </figure>
  );
}

/* =========================================================
 * BFS / DFS step players
 * ========================================================= */

type Step = {
  visited: Set<string>;
  frontier: string[]; // queue or stack contents
  current: string | null;
  log: string;
};

function neighbors(spec: GraphSpec, u: string): string[] {
  const adj: string[] = [];
  for (const e of spec.edges) {
    if (e.from === u) adj.push(e.to);
    else if (!spec.directed && e.to === u) adj.push(e.from);
  }
  // stable order
  return Array.from(new Set(adj));
}

function bfsSteps(spec: GraphSpec, start: string): Step[] {
  const steps: Step[] = [];
  const visited = new Set<string>([start]);
  const q: string[] = [start];
  steps.push({ visited: new Set(visited), frontier: [...q], current: null, log: `enqueue ${start}` });
  while (q.length) {
    const u = q.shift()!;
    steps.push({ visited: new Set(visited), frontier: [...q], current: u, log: `visit ${u}` });
    for (const v of neighbors(spec, u)) {
      if (!visited.has(v)) {
        visited.add(v);
        q.push(v);
        steps.push({ visited: new Set(visited), frontier: [...q], current: u, log: `enqueue ${v}` });
      }
    }
  }
  return steps;
}

function dfsSteps(spec: GraphSpec, start: string): Step[] {
  const steps: Step[] = [];
  const visited = new Set<string>();
  const stack: string[] = [start];
  steps.push({ visited: new Set(visited), frontier: [...stack], current: null, log: `push ${start}` });
  while (stack.length) {
    const u = stack.pop()!;
    if (visited.has(u)) continue;
    visited.add(u);
    steps.push({ visited: new Set(visited), frontier: [...stack], current: u, log: `visit ${u}` });
    const nb = neighbors(spec, u).slice().reverse();
    for (const v of nb) {
      if (!visited.has(v)) {
        stack.push(v);
        steps.push({ visited: new Set(visited), frontier: [...stack], current: u, log: `push ${v}` });
      }
    }
  }
  return steps;
}

function StepPlayer({
  spec, steps, kind,
}: { spec: GraphSpec; steps: Step[]; kind: "queue" | "stack" }) {
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => {
      setI((v) => {
        if (v >= steps.length - 1) { setPlaying(false); return v; }
        return v + 1;
      });
    }, 700);
    return () => clearInterval(t);
  }, [playing, steps.length]);

  const step = steps[Math.min(i, steps.length - 1)];
  const colors: GraphSpec["colors"] = {};
  step.visited.forEach((v) => { colors[v] = "visited"; });
  if (step.current) colors[step.current] = "brand";
  step.frontier.forEach((v) => { if (!colors[v]) colors[v] = "highlight"; });

  return (
    <div className="space-y-3">
      <GraphViz spec={{ ...spec, colors }} />
      <div className="card-surface p-3">
        <div className="mb-2 flex items-center gap-2 text-xs">
          <button onClick={() => setPlaying((p) => !p)}
            className="inline-flex items-center gap-1 rounded-md gradient-brand px-2.5 py-1 font-medium text-primary-foreground">
            {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />} {playing ? "Pause" : "Play"}
          </button>
          <button onClick={() => setI((v) => Math.min(v + 1, steps.length - 1))}
            className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1 hover:bg-accent">
            <SkipForward className="h-3.5 w-3.5" /> Step
          </button>
          <button onClick={() => { setI(0); setPlaying(false); }}
            className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1 hover:bg-accent">
            <RefreshCcw className="h-3.5 w-3.5" /> Reset
          </button>
          <span className="ml-auto text-muted-foreground">Step {Math.min(i + 1, steps.length)} / {steps.length}</span>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          <div>
            <div className="mb-1 text-xs font-semibold uppercase text-muted-foreground">{kind === "queue" ? "Queue (front → back)" : "Stack (top on right)"}</div>
            <div className="flex flex-wrap gap-1.5">
              <AnimatePresence>
                {step.frontier.map((v, k) => (
                  <motion.span key={`${v}-${k}`} layout initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="rounded-md border border-[color:var(--brand)]/50 bg-[color:var(--brand)]/10 px-2 py-0.5 text-xs font-mono">
                    {v}
                  </motion.span>
                ))}
              </AnimatePresence>
              {step.frontier.length === 0 && <span className="text-xs text-muted-foreground">empty</span>}
            </div>
          </div>
          <div>
            <div className="mb-1 text-xs font-semibold uppercase text-muted-foreground">Visited</div>
            <div className="flex flex-wrap gap-1.5">
              {Array.from(step.visited).map((v) => (
                <span key={v} className="rounded-md border border-[color:var(--good)]/50 bg-[color:var(--good)]/10 px-2 py-0.5 text-xs font-mono">{v}</span>
              ))}
              {step.visited.size === 0 && <span className="text-xs text-muted-foreground">none</span>}
            </div>
          </div>
        </div>
        <div className="mt-2 text-xs text-muted-foreground">› {step.log}</div>
      </div>
    </div>
  );
}

export function BFSPlayer({ spec, start, caption }: { spec: GraphSpec; start: string; caption?: string }) {
  const steps = useMemo(() => bfsSteps(spec, start), [spec, start]);
  return (
    <div className="space-y-2">
      <StepPlayer spec={spec} steps={steps} kind="queue" />
      {caption && <p className="text-center text-xs italic text-muted-foreground">{caption}</p>}
    </div>
  );
}

export function DFSPlayer({ spec, start, caption }: { spec: GraphSpec; start: string; caption?: string }) {
  const steps = useMemo(() => dfsSteps(spec, start), [spec, start]);
  return (
    <div className="space-y-2">
      <StepPlayer spec={spec} steps={steps} kind="stack" />
      {caption && <p className="text-center text-xs italic text-muted-foreground">{caption}</p>}
    </div>
  );
}

/* =========================================================
 * Representation visualizers
 * ========================================================= */

export function AdjMatrixViz({ spec, caption }: { spec: GraphSpec; caption?: string }) {
  const ids = spec.nodes.map((n) => n.id);
  const idx = Object.fromEntries(ids.map((id, i) => [id, i]));
  const m = ids.map(() => ids.map(() => 0));
  for (const e of spec.edges) {
    const i = idx[e.from]; const j = idx[e.to];
    if (i == null || j == null) continue;
    m[i][j] = e.weight ?? 1;
    if (!spec.directed) m[j][i] = e.weight ?? 1;
  }
  return (
    <figure className="card-surface overflow-x-auto p-4">
      <table className="mx-auto text-xs font-mono">
        <thead>
          <tr>
            <th className="px-2 py-1 text-muted-foreground"></th>
            {ids.map((id) => <th key={id} className="px-2 py-1 text-[color:var(--brand)]">{id}</th>)}
          </tr>
        </thead>
        <tbody>
          {ids.map((row, i) => (
            <tr key={row}>
              <th className="px-2 py-1 text-[color:var(--brand)]">{row}</th>
              {ids.map((col, j) => (
                <td key={col} className={`border border-border px-3 py-1 text-center ${m[i][j] ? "bg-[color:var(--brand)]/10 font-semibold" : "text-muted-foreground/50"}`}>
                  {m[i][j] || 0}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {caption && <figcaption className="mt-2 text-center text-xs italic text-muted-foreground">{caption}</figcaption>}
    </figure>
  );
}

export function AdjListViz({ spec, caption }: { spec: GraphSpec; caption?: string }) {
  const map: Record<string, { to: string; w?: number }[]> = {};
  spec.nodes.forEach((n) => (map[n.id] = []));
  for (const e of spec.edges) {
    map[e.from]?.push({ to: e.to, w: e.weight });
    if (!spec.directed) map[e.to]?.push({ to: e.from, w: e.weight });
  }
  return (
    <figure className="card-surface p-4">
      <ul className="space-y-1 font-mono text-xs">
        {spec.nodes.map((n) => (
          <li key={n.id} className="flex items-center gap-2">
            <span className="rounded-md border border-[color:var(--brand)]/40 bg-[color:var(--brand)]/10 px-2 py-0.5 text-[color:var(--brand)]">{n.id}</span>
            <span className="text-muted-foreground">→</span>
            {map[n.id].length === 0
              ? <span className="text-muted-foreground/60">∅</span>
              : map[n.id].map((c, i) => (
                <span key={i} className="rounded-md border border-border bg-muted/40 px-2 py-0.5">
                  {c.to}{c.w != null ? ` (${c.w})` : ""}
                </span>
              ))}
          </li>
        ))}
      </ul>
      {caption && <figcaption className="mt-2 text-center text-xs italic text-muted-foreground">{caption}</figcaption>}
    </figure>
  );
}

export function EdgeListViz({ spec, caption }: { spec: GraphSpec; caption?: string }) {
  return (
    <figure className="card-surface p-4">
      <ul className="grid gap-1 font-mono text-xs sm:grid-cols-2">
        {spec.edges.map((e, i) => (
          <li key={i} className="rounded-md border border-border bg-muted/30 px-2 py-1">
            ({e.from}, {e.to}{e.weight != null ? `, ${e.weight}` : ""})
          </li>
        ))}
      </ul>
      {caption && <figcaption className="mt-2 text-center text-xs italic text-muted-foreground">{caption}</figcaption>}
    </figure>
  );
}

export function IncidenceMatrixViz({ spec, caption }: { spec: GraphSpec; caption?: string }) {
  const ids = spec.nodes.map((n) => n.id);
  return (
    <figure className="card-surface overflow-x-auto p-4">
      <table className="mx-auto text-xs font-mono">
        <thead>
          <tr>
            <th className="px-2 py-1"></th>
            {spec.edges.map((e, i) => <th key={i} className="px-2 py-1 text-[color:var(--brand)]">e{i}</th>)}
          </tr>
        </thead>
        <tbody>
          {ids.map((id) => (
            <tr key={id}>
              <th className="px-2 py-1 text-[color:var(--brand)]">{id}</th>
              {spec.edges.map((e, i) => {
                const inc = spec.directed
                  ? e.from === id ? -1 : e.to === id ? 1 : 0
                  : (e.from === id || e.to === id) ? 1 : 0;
                return (
                  <td key={i} className={`border border-border px-3 py-1 text-center ${inc ? "bg-[color:var(--brand)]/10 font-semibold" : "text-muted-foreground/50"}`}>
                    {inc}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      {caption && <figcaption className="mt-2 text-center text-xs italic text-muted-foreground">{caption}</figcaption>}
    </figure>
  );
}

export function CsrViz({ spec, caption }: { spec: GraphSpec; caption?: string }) {
  const ids = spec.nodes.map((n) => n.id);
  const idx = Object.fromEntries(ids.map((id, i) => [id, i]));
  const rowPtr: number[] = [0];
  const colIdx: number[] = [];
  for (const id of ids) {
    for (const e of spec.edges) {
      if (e.from === id) colIdx.push(idx[e.to]);
      else if (!spec.directed && e.to === id) colIdx.push(idx[e.from]);
    }
    rowPtr.push(colIdx.length);
  }
  return (
    <figure className="card-surface p-4 font-mono text-xs">
      <div className="mb-2"><span className="text-[color:var(--brand)]">row_ptr</span> = [{rowPtr.join(", ")}]</div>
      <div className="mb-2"><span className="text-[color:var(--brand)]">col_idx</span> = [{colIdx.join(", ")}]</div>
      <div className="text-muted-foreground">Neighbours of node i live at col_idx[row_ptr[i] : row_ptr[i+1]]</div>
      {caption && <p className="mt-2 text-xs italic text-muted-foreground">{caption}</p>}
    </figure>
  );
}

/* =========================================================
 * MemoryDiagram — labelled key/value strip
 * ========================================================= */

export function MemoryDiagram({
  rows, caption,
}: { rows: { label: string; value: string; note?: string }[]; caption?: string }) {
  return (
    <figure className="card-surface p-4">
      <div className="grid gap-2">
        {rows.map((r, i) => (
          <div key={i} className="grid grid-cols-[minmax(90px,140px)_1fr_auto] items-center gap-3 rounded-md border border-border bg-muted/30 px-3 py-2">
            <div className="text-xs font-semibold text-[color:var(--brand)]">{r.label}</div>
            <div className="font-mono text-xs">{r.value}</div>
            {r.note && <div className="text-[10px] italic text-muted-foreground">{r.note}</div>}
          </div>
        ))}
      </div>
      {caption && <figcaption className="mt-2 text-center text-xs italic text-muted-foreground">{caption}</figcaption>}
    </figure>
  );
}

/* =========================================================
 * Placeholder algorithm players — full versions land in Turn 3.
 * Keep the section-type contract satisfied without shipping stubs
 * users can see; these render a hint + the source graph.
 * ========================================================= */
function ComingSoon({ label }: { label: string }) {
  return (
    <div className="card-surface border-dashed p-4 text-xs text-muted-foreground">
      <div className="font-semibold text-foreground">{label} — interactive player</div>
      Full step-by-step animation ships in the next content pass. The lesson code, dry run, and complexity below are complete.
    </div>
  );
}
export function DijkstraPlayer({ spec, caption }: { spec: GraphSpec; start: string; caption?: string }) {
  return <div className="space-y-2"><GraphViz spec={spec} caption={caption} /><ComingSoon label="Dijkstra" /></div>;
}
export function BellmanFordPlayer({ spec, caption }: { spec: GraphSpec; start: string; caption?: string }) {
  return <div className="space-y-2"><GraphViz spec={spec} caption={caption} /><ComingSoon label="Bellman-Ford" /></div>;
}
export function PrimPlayer({ spec, caption }: { spec: GraphSpec; start: string; caption?: string }) {
  return <div className="space-y-2"><GraphViz spec={spec} caption={caption} /><ComingSoon label="Prim's algorithm" /></div>;
}
export function KruskalPlayer({ spec, caption }: { spec: GraphSpec; caption?: string }) {
  return <div className="space-y-2"><GraphViz spec={spec} caption={caption} /><ComingSoon label="Kruskal's algorithm" /></div>;
}
export function TopoSortPlayer({ spec, caption }: { spec: GraphSpec; caption?: string }) {
  return <div className="space-y-2"><GraphViz spec={spec} caption={caption} /><ComingSoon label="Topological sort" /></div>;
}

/* =========================================================
 * UnionFindPlayground — interactive DSU
 * ========================================================= */

export function UnionFindPlayground({ n = 8 }: { n?: number }) {
  const [parent, setParent] = useState<number[]>(() => Array.from({ length: n }, (_, i) => i));
  const [rank, setRank] = useState<number[]>(() => Array(n).fill(0));
  const [a, setA] = useState("0");
  const [b, setB] = useState("1");
  const [log, setLog] = useState<string[]>([]);

  const find = (arr: number[], x: number): number => {
    while (arr[x] !== x) { arr[x] = arr[arr[x]]; x = arr[x]; }
    return x;
  };

  const doUnion = () => {
    const x = Number(a); const y = Number(b);
    if (Number.isNaN(x) || Number.isNaN(y) || x < 0 || y < 0 || x >= n || y >= n) return;
    const p = parent.slice(); const r = rank.slice();
    const rx = find(p, x); const ry = find(p, y);
    if (rx === ry) { setLog((l) => [`union(${x}, ${y}) — already joined`, ...l].slice(0, 6)); return; }
    if (r[rx] < r[ry]) p[rx] = ry;
    else if (r[rx] > r[ry]) p[ry] = rx;
    else { p[ry] = rx; r[rx]++; }
    setParent(p); setRank(r);
    setLog((l) => [`union(${x}, ${y})`, ...l].slice(0, 6));
  };
  const doFind = () => {
    const x = Number(a);
    if (Number.isNaN(x) || x < 0 || x >= n) return;
    const p = parent.slice();
    const root = find(p, x);
    setParent(p);
    setLog((l) => [`find(${x}) → ${root} (path compressed)`, ...l].slice(0, 6));
  };
  const reset = () => { setParent(Array.from({ length: n }, (_, i) => i)); setRank(Array(n).fill(0)); setLog([]); };

  // Compute components for coloring
  const roots = parent.map((_, i) => find(parent.slice(), i));
  const rootColors = Array.from(new Set(roots));

  return (
    <div className="card-surface p-4">
      <div className="mb-3 flex flex-wrap items-center gap-2 text-xs">
        <label className="text-muted-foreground">a</label>
        <input value={a} onChange={(e) => setA(e.target.value)} className="w-14 rounded-md border border-border bg-transparent px-2 py-1" />
        <label className="text-muted-foreground">b</label>
        <input value={b} onChange={(e) => setB(e.target.value)} className="w-14 rounded-md border border-border bg-transparent px-2 py-1" />
        <button onClick={doUnion} className="rounded-md gradient-brand px-2.5 py-1 font-medium text-primary-foreground">union(a, b)</button>
        <button onClick={doFind} className="rounded-md border border-border px-2.5 py-1 hover:bg-accent">find(a)</button>
        <button onClick={reset} className="ml-auto rounded-md border border-border px-2.5 py-1 hover:bg-accent">
          <RefreshCcw className="mr-1 inline h-3 w-3" /> reset
        </button>
      </div>

      <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
        {parent.map((p, i) => {
          const rIdx = rootColors.indexOf(roots[i]);
          const hue = (rIdx * 47) % 360;
          return (
            <div key={i} className="rounded-md border border-border p-2 text-center text-xs"
              style={{ background: `hsl(${hue} 70% 45% / 0.14)`, borderColor: `hsl(${hue} 70% 45% / 0.5)` }}>
              <div className="font-mono text-sm font-semibold">{i}</div>
              <div className="mt-1 text-[10px] text-muted-foreground">parent = {p}</div>
              <div className="text-[10px] text-muted-foreground">rank = {rank[i]}</div>
            </div>
          );
        })}
      </div>

      <div className="mt-3 text-xs text-muted-foreground">
        Components: <span className="text-foreground">{rootColors.length}</span>
      </div>
      {log.length > 0 && (
        <div className="mt-2 max-h-24 overflow-auto rounded-md border border-border bg-muted/30 p-2 text-xs">
          {log.map((l, i) => <div key={i} className="text-muted-foreground">› {l}</div>)}
        </div>
      )}
    </div>
  );
}
