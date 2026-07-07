import { useMemo, useState, useRef, useCallback } from "react";
import { Plus, Trash2, RefreshCcw, MousePointer2, Link2 } from "lucide-react";
import type { GNode, GEdge } from "@/lib/graphs/types";

type Mode = "select" | "add-node" | "add-edge" | "delete";

const NODE_R = 22;

/**
 * Interactive Graph Playground.
 * - Click on empty canvas in "add-node" mode to add a vertex.
 * - Click two nodes in "add-edge" mode to connect them.
 * - Drag nodes in "select" mode to reposition.
 * - Click a node/edge in "delete" mode to remove it.
 */
export function GraphPlayground({
  initial,
}: {
  initial?: { nodes: GNode[]; edges: GEdge[]; directed?: boolean; weighted?: boolean };
} = {}) {
  const [nodes, setNodes] = useState<GNode[]>(
    initial?.nodes ?? [
      { id: "A", x: 120, y: 120 },
      { id: "B", x: 300, y: 90 },
      { id: "C", x: 460, y: 180 },
      { id: "D", x: 220, y: 260 },
      { id: "E", x: 400, y: 300 },
    ],
  );
  const [edges, setEdges] = useState<GEdge[]>(
    initial?.edges ?? [
      { from: "A", to: "B" },
      { from: "A", to: "D" },
      { from: "B", to: "C" },
      { from: "C", to: "E" },
      { from: "D", to: "E" },
    ],
  );
  const [directed, setDirected] = useState(!!initial?.directed);
  const [weighted, setWeighted] = useState(!!initial?.weighted);
  const [mode, setMode] = useState<Mode>("select");
  const [pendingEdgeFrom, setPendingEdgeFrom] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const dragRef = useRef<{ id: string; dx: number; dy: number } | null>(null);

  const nextId = useCallback(() => {
    const used = new Set(nodes.map((n) => n.id));
    for (let i = 0; i < 26 * 4; i++) {
      const letter = String.fromCharCode(65 + (i % 26));
      const suffix = Math.floor(i / 26);
      const id = suffix === 0 ? letter : `${letter}${suffix}`;
      if (!used.has(id)) return id;
    }
    return `N${nodes.length + 1}`;
  }, [nodes]);

  // ---------- svg coord helpers ----------
  const svgPoint = (e: React.MouseEvent) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const ctm = svg.getScreenCTM();
    if (!ctm) return { x: 0, y: 0 };
    const p = pt.matrixTransform(ctm.inverse());
    return { x: p.x, y: p.y };
  };

  // ---------- interactions ----------
  const onCanvasClick = (e: React.MouseEvent) => {
    if (mode !== "add-node") return;
    const { x, y } = svgPoint(e);
    const id = nextId();
    setNodes((ns) => [...ns, { id, x, y }]);
  };

  const onNodeMouseDown = (e: React.MouseEvent, n: GNode) => {
    e.stopPropagation();
    if (mode === "delete") {
      setNodes((ns) => ns.filter((x) => x.id !== n.id));
      setEdges((es) => es.filter((ed) => ed.from !== n.id && ed.to !== n.id));
      return;
    }
    if (mode === "add-edge") {
      if (!pendingEdgeFrom) {
        setPendingEdgeFrom(n.id);
        return;
      }
      if (pendingEdgeFrom === n.id) {
        setPendingEdgeFrom(null);
        return;
      }
      setEdges((es) => {
        const exists = es.some(
          (ed) =>
            (ed.from === pendingEdgeFrom && ed.to === n.id) ||
            (!directed && ed.from === n.id && ed.to === pendingEdgeFrom),
        );
        if (exists) return es;
        return [...es, { from: pendingEdgeFrom, to: n.id, weight: weighted ? 1 : undefined }];
      });
      setPendingEdgeFrom(null);
      return;
    }
    if (mode === "select") {
      const { x, y } = svgPoint(e);
      dragRef.current = { id: n.id, dx: x - (n.x ?? 0), dy: y - (n.y ?? 0) };
    }
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragRef.current) return;
    const { x, y } = svgPoint(e);
    const { id, dx, dy } = dragRef.current;
    setNodes((ns) => ns.map((n) => (n.id === id ? { ...n, x: x - dx, y: y - dy } : n)));
  };

  const onMouseUp = () => {
    dragRef.current = null;
  };

  const onEdgeClick = (edge: GEdge) => {
    if (mode === "delete") {
      setEdges((es) => es.filter((ed) => !(ed.from === edge.from && ed.to === edge.to)));
      return;
    }
    if (weighted) {
      const w = window.prompt("Edge weight", String(edge.weight ?? 1));
      if (w == null) return;
      const nw = Number(w);
      if (Number.isNaN(nw)) return;
      setEdges((es) =>
        es.map((ed) => (ed.from === edge.from && ed.to === edge.to ? { ...ed, weight: nw } : ed)),
      );
    }
  };

  const reset = () => {
    setNodes([]);
    setEdges([]);
    setPendingEdgeFrom(null);
  };

  // ---------- stats ----------
  const stats = useMemo(() => computeStats(nodes, edges, directed), [nodes, edges, directed]);

  const modeBtn = (m: Mode, label: string, Icon: React.ComponentType<{ className?: string }>) => (
    <button
      onClick={() => {
        setMode(m);
        setPendingEdgeFrom(null);
      }}
      className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs transition ${
        mode === m
          ? "border-[color:var(--brand)] bg-[color:var(--brand)]/15 text-[color:var(--brand)]"
          : "border-border hover:bg-accent"
      }`}
    >
      <Icon className="h-3.5 w-3.5" /> {label}
    </button>
  );

  return (
    <div className="card-surface p-3 sm:p-4">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        {modeBtn("select", "Select / Drag", MousePointer2)}
        {modeBtn("add-node", "Add vertex", Plus)}
        {modeBtn("add-edge", "Add edge", Link2)}
        {modeBtn("delete", "Delete", Trash2)}
        <label className="ml-1 inline-flex items-center gap-1 text-xs text-muted-foreground">
          <input
            type="checkbox"
            checked={directed}
            onChange={(e) => setDirected(e.target.checked)}
          />
          Directed
        </label>
        <label className="inline-flex items-center gap-1 text-xs text-muted-foreground">
          <input
            type="checkbox"
            checked={weighted}
            onChange={(e) => setWeighted(e.target.checked)}
          />
          Weighted
        </label>
        <button
          onClick={reset}
          className="ml-auto inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1 text-xs hover:bg-accent"
        >
          <RefreshCcw className="h-3.5 w-3.5" /> Clear
        </button>
      </div>

      <div className="grid gap-3 md:grid-cols-[1fr_180px]">
        <div className="overflow-hidden rounded-md border border-border bg-muted/20">
          <svg
            ref={svgRef}
            viewBox="0 0 560 380"
            className="h-[380px] w-full touch-none"
            onClick={onCanvasClick}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
          >
            {directed && (
              <defs>
                <marker
                  id="pg-arrow"
                  viewBox="0 0 10 10"
                  refX="10"
                  refY="5"
                  markerWidth="7"
                  markerHeight="7"
                  orient="auto-start-reverse"
                >
                  <path d="M0,0 L10,5 L0,10 z" fill="var(--muted-foreground)" />
                </marker>
              </defs>
            )}

            {edges.map((e, i) => {
              const a = nodes.find((n) => n.id === e.from);
              const b = nodes.find((n) => n.id === e.to);
              if (!a || !b || a.x == null || a.y == null || b.x == null || b.y == null) return null;
              const dx = b.x - a.x;
              const dy = b.y - a.y;
              const len = Math.hypot(dx, dy) || 1;
              const nx = dx / len;
              const ny = dy / len;
              const sx = a.x + nx * NODE_R;
              const sy = a.y + ny * NODE_R;
              const tx = b.x - nx * NODE_R;
              const ty = b.y - ny * NODE_R;
              return (
                <g
                  key={i}
                  onClick={(evt) => {
                    evt.stopPropagation();
                    onEdgeClick(e);
                  }}
                  className="cursor-pointer"
                >
                  <line
                    x1={sx}
                    y1={sy}
                    x2={tx}
                    y2={ty}
                    stroke="color-mix(in oklab, var(--foreground) 35%, transparent)"
                    strokeWidth={2}
                    markerEnd={directed ? "url(#pg-arrow)" : undefined}
                  />
                  {/* hit target */}
                  <line x1={sx} y1={sy} x2={tx} y2={ty} stroke="transparent" strokeWidth={12} />
                  {weighted && e.weight != null && (
                    <g>
                      <rect
                        x={(sx + tx) / 2 - 12}
                        y={(sy + ty) / 2 - 9}
                        width={24}
                        height={16}
                        rx={4}
                        fill="var(--card)"
                        stroke="color-mix(in oklab, var(--foreground) 25%, transparent)"
                      />
                      <text
                        x={(sx + tx) / 2}
                        y={(sy + ty) / 2 + 3}
                        textAnchor="middle"
                        fontSize={10}
                      >
                        {e.weight}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}

            {nodes.map((n) => {
              const pending = pendingEdgeFrom === n.id;
              return (
                <g
                  key={n.id}
                  onMouseDown={(e) => onNodeMouseDown(e, n)}
                  className={mode === "select" ? "cursor-grab" : "cursor-pointer"}
                >
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r={NODE_R}
                    fill={
                      pending ? "color-mix(in oklab, var(--warn) 25%, transparent)" : "var(--card)"
                    }
                    stroke={
                      pending
                        ? "var(--warn)"
                        : "color-mix(in oklab, var(--foreground) 30%, transparent)"
                    }
                    strokeWidth={2}
                  />
                  <text
                    x={n.x}
                    y={(n.y ?? 0) + 4}
                    textAnchor="middle"
                    fontSize={12}
                    fontWeight={600}
                  >
                    {n.label ?? n.id}
                  </text>
                </g>
              );
            })}

            {mode === "add-edge" && pendingEdgeFrom && (
              <text x={12} y={20} fontSize={11} fill="var(--warn)">
                Pick target node for edge from {pendingEdgeFrom}…
              </text>
            )}
            {nodes.length === 0 && (
              <text
                x={280}
                y={190}
                textAnchor="middle"
                fontSize={13}
                fill="currentColor"
                className="text-muted-foreground"
              >
                Empty graph — switch to “Add vertex” and click the canvas.
              </text>
            )}
          </svg>
        </div>

        <aside className="rounded-md border border-border bg-muted/30 p-3 text-xs">
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Live stats
          </div>
          <Stat label="Vertices (V)" value={String(nodes.length)} />
          <Stat label="Edges (E)" value={String(edges.length)} />
          <Stat label="Components" value={String(stats.components)} />
          <Stat label="Density" value={stats.density} />
          <Stat label="Type" value={directed ? "Directed" : "Undirected"} />
          <Stat label="Weighted" value={weighted ? "Yes" : "No"} />
          <Stat label="Has cycle?" value={stats.hasCycle ? "Yes" : "No"} />
          <div className="mt-3 text-[11px] text-muted-foreground">
            Tip: drag nodes to rearrange. Click an edge to edit weight when Weighted is on.
          </div>
        </aside>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border/60 py-1 last:border-b-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-mono">{value}</span>
    </div>
  );
}

function computeStats(nodes: GNode[], edges: GEdge[], directed: boolean) {
  const V = nodes.length;
  const E = edges.length;
  const maxE = directed ? V * (V - 1) : (V * (V - 1)) / 2;
  const density = maxE > 0 ? (E / maxE).toFixed(2) : "—";

  // Undirected components via union-find on all nodes.
  const idx = Object.fromEntries(nodes.map((n, i) => [n.id, i]));
  const parent = nodes.map((_, i) => i);
  const find = (x: number): number => {
    while (parent[x] !== x) {
      parent[x] = parent[parent[x]];
      x = parent[x];
    }
    return x;
  };
  const union = (a: number, b: number) => {
    const ra = find(a);
    const rb = find(b);
    if (ra !== rb) parent[ra] = rb;
  };
  for (const e of edges) {
    const a = idx[e.from];
    const b = idx[e.to];
    if (a != null && b != null) union(a, b);
  }
  const components = V === 0 ? 0 : new Set(nodes.map((_, i) => find(i))).size;

  // Naive cycle detection.
  let hasCycle = false;
  if (directed) {
    const WHITE = 0,
      GRAY = 1,
      BLACK = 2;
    const color: Record<string, number> = {};
    nodes.forEach((n) => (color[n.id] = WHITE));
    const adj: Record<string, string[]> = {};
    nodes.forEach((n) => (adj[n.id] = []));
    edges.forEach((e) => adj[e.from]?.push(e.to));
    const dfs = (u: string): boolean => {
      color[u] = GRAY;
      for (const v of adj[u] ?? []) {
        if (color[v] === GRAY) return true;
        if (color[v] === WHITE && dfs(v)) return true;
      }
      color[u] = BLACK;
      return false;
    };
    hasCycle = nodes.some((n) => color[n.id] === WHITE && dfs(n.id));
  } else {
    // Cycle iff E >= V - components (for a simple graph). Detect multi-edges too.
    const seen = new Set<string>();
    for (const e of edges) {
      const k = e.from < e.to ? `${e.from}|${e.to}` : `${e.to}|${e.from}`;
      if (seen.has(k)) {
        hasCycle = true;
        break;
      }
      seen.add(k);
    }
    if (!hasCycle && E >= V - components && E > 0) hasCycle = true;
  }

  return { components, density, hasCycle };
}
