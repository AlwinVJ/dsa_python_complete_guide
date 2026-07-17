import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { PageShell, PageHeader, Callout } from "@/components/Callout";
import { CodeViewer } from "@/components/CodeViewer";
import {
  PlaygroundBackButton,
  PlaygroundFooterNav,
} from "@/components/PlaygroundNav";
import { Play, Pause, RotateCcw, StepForward, StepBack } from "lucide-react";

export const Route = createFileRoute("/playgrounds/graph-algorithms")({
  head: () => ({
    meta: [
      { title: "Graph Algorithms Playground — DSA with Python" },
      {
        name: "description",
        content:
          "Step through BFS, DFS, and Dijkstra frame by frame on an interactive graph — watch the queue, stack, priority queue, and distance table update live.",
      },
      { property: "og:title", content: "Graph Algorithms Playground — DSA with Python" },
      {
        property: "og:description",
        content:
          "Interactive BFS, DFS, and Dijkstra visualizer with animated frontier and distance table.",
      },
    ],
  }),
  component: Page,
});

/* ---------- Graph data ---------- */
type Node = { id: number; label: string; x: number; y: number };
type Edge = { u: number; v: number; w: number };

// Small fixed graph with pleasant layout — enough to see the algorithms breathe.
const NODES: Node[] = [
  { id: 0, label: "A", x: 90, y: 80 },
  { id: 1, label: "B", x: 260, y: 60 },
  { id: 2, label: "C", x: 430, y: 100 },
  { id: 3, label: "D", x: 160, y: 220 },
  { id: 4, label: "E", x: 340, y: 220 },
  { id: 5, label: "F", x: 90, y: 360 },
  { id: 6, label: "G", x: 260, y: 380 },
  { id: 7, label: "H", x: 430, y: 340 },
];

const EDGES: Edge[] = [
  { u: 0, v: 1, w: 4 },
  { u: 0, v: 3, w: 2 },
  { u: 1, v: 2, w: 3 },
  { u: 1, v: 4, w: 5 },
  { u: 2, v: 4, w: 1 },
  { u: 2, v: 7, w: 6 },
  { u: 3, v: 4, w: 3 },
  { u: 3, v: 5, w: 4 },
  { u: 3, v: 6, w: 6 },
  { u: 4, v: 6, w: 2 },
  { u: 4, v: 7, w: 4 },
  { u: 5, v: 6, w: 3 },
  { u: 6, v: 7, w: 5 },
];

function buildAdj() {
  const adj: { v: number; w: number }[][] = NODES.map(() => []);
  for (const { u, v, w } of EDGES) {
    adj[u].push({ v, w });
    adj[v].push({ v: u, w });
  }
  return adj;
}

const edgeKey = (u: number, v: number) => (u < v ? `${u}-${v}` : `${v}-${u}`);

/* ---------- Frame model ---------- */
type BaseFrame = { line: number; note: string; done?: boolean };

type BFSFrame = BaseFrame & {
  kind: "bfs";
  visited: number[];
  queue: number[];
  current: number | null;
  dist: number[];
  treeEdges: string[];
};
type DFSFrame = BaseFrame & {
  kind: "dfs";
  visited: number[];
  stack: number[];
  current: number | null;
  treeEdges: string[];
};
type DijkFrame = BaseFrame & {
  kind: "dijkstra";
  visited: number[];
  pq: { d: number; v: number }[];
  current: number | null;
  dist: number[];
  treeEdges: string[];
};
type AnyFrame = BFSFrame | DFSFrame | DijkFrame;

/* ---------- Tracers ---------- */

const BFS_CODE = `from collections import deque

def bfs(G, src):
    seen = {src}
    dist = {src: 0}
    q = deque([src])
    while q:
        u = q.popleft()
        for v in G[u]:
            if v not in seen:
                seen.add(v)
                dist[v] = dist[u] + 1
                q.append(v)
    return dist`;

function traceBFS(src: number): BFSFrame[] {
  const adj = buildAdj();
  const frames: BFSFrame[] = [];
  const visited: number[] = [];
  const dist = NODES.map(() => Infinity);
  const treeEdges: string[] = [];
  let queue: number[] = [];

  const snap = (line: number, note: string, current: number | null, extras: Partial<BFSFrame> = {}) => {
    frames.push({
      kind: "bfs",
      line,
      note,
      current,
      visited: [...visited],
      queue: [...queue],
      dist: [...dist],
      treeEdges: [...treeEdges],
      ...extras,
    });
  };

  visited.push(src);
  dist[src] = 0;
  queue.push(src);
  snap(6, `Start BFS at ${NODES[src].label}.`, src);

  while (queue.length) {
    const u = queue.shift()!;
    snap(7, `Dequeue ${NODES[u].label} (dist ${dist[u]}).`, u);
    for (const { v } of adj[u]) {
      if (!visited.includes(v)) {
        visited.push(v);
        dist[v] = dist[u] + 1;
        treeEdges.push(edgeKey(u, v));
        queue.push(v);
        snap(11, `Visit ${NODES[v].label} via ${NODES[u].label} → dist ${dist[v]}.`, u);
      } else {
        snap(9, `Skip ${NODES[v].label} — already visited.`, u);
      }
    }
  }
  snap(12, "BFS complete.", null, { done: true });
  return frames;
}

const DFS_CODE = `def dfs(G, src):
    seen = set()
    stack = [src]
    while stack:
        u = stack.pop()
        if u in seen: continue
        seen.add(u)
        for v in G[u]:
            if v not in seen:
                stack.append(v)`;

function traceDFS(src: number): DFSFrame[] {
  const adj = buildAdj();
  const frames: DFSFrame[] = [];
  const visited: number[] = [];
  const treeEdges: string[] = [];
  let stack: number[] = [src];
  const parent = new Map<number, number>();

  const snap = (line: number, note: string, current: number | null, extras: Partial<DFSFrame> = {}) => {
    frames.push({
      kind: "dfs",
      line,
      note,
      current,
      visited: [...visited],
      stack: [...stack],
      treeEdges: [...treeEdges],
      ...extras,
    });
  };

  snap(3, `Start DFS at ${NODES[src].label}.`, src);
  while (stack.length) {
    const u = stack.pop()!;
    if (visited.includes(u)) {
      snap(6, `Pop ${NODES[u].label} — already visited, skip.`, u);
      continue;
    }
    visited.push(u);
    const p = parent.get(u);
    if (p !== undefined) treeEdges.push(edgeKey(p, u));
    snap(7, `Visit ${NODES[u].label}.`, u);
    // push in reverse so lowest-id neighbour is popped first
    const neigh = [...adj[u]].sort((a, b) => b.v - a.v);
    for (const { v } of neigh) {
      if (!visited.includes(v)) {
        stack.push(v);
        parent.set(v, u);
        snap(9, `Push ${NODES[v].label} onto stack.`, u);
      }
    }
  }
  snap(10, "DFS complete.", null, { done: true });
  return frames;
}

const DIJK_CODE = `import heapq

def dijkstra(G, src):
    dist = {u: float('inf') for u in G}
    dist[src] = 0
    pq = [(0, src)]
    while pq:
        d, u = heapq.heappop(pq)
        if d > dist[u]: continue
        for v, w in G[u]:
            nd = d + w
            if nd < dist[v]:
                dist[v] = nd
                heapq.heappush(pq, (nd, v))
    return dist`;

function traceDijkstra(src: number): DijkFrame[] {
  const adj = buildAdj();
  const frames: DijkFrame[] = [];
  const dist = NODES.map(() => Infinity);
  const visited: number[] = [];
  const treeEdges: string[] = [];
  const parent = new Map<number, number>();
  let pq: { d: number; v: number }[] = [];

  const sortPQ = () => {
    pq = [...pq].sort((a, b) => a.d - b.d);
  };
  const snap = (line: number, note: string, current: number | null, extras: Partial<DijkFrame> = {}) => {
    frames.push({
      kind: "dijkstra",
      line,
      note,
      current,
      visited: [...visited],
      pq: pq.map((e) => ({ ...e })),
      dist: [...dist],
      treeEdges: [...treeEdges],
      ...extras,
    });
  };

  dist[src] = 0;
  pq.push({ d: 0, v: src });
  sortPQ();
  snap(6, `Initialise: dist[${NODES[src].label}] = 0.`, src);

  while (pq.length) {
    sortPQ();
    const { d, v: u } = pq.shift()!;
    if (d > dist[u]) {
      snap(8, `Pop stale entry for ${NODES[u].label} (d=${d} > dist=${dist[u]}).`, u);
      continue;
    }
    visited.push(u);
    const p = parent.get(u);
    if (p !== undefined) treeEdges.push(edgeKey(p, u));
    snap(7, `Finalise ${NODES[u].label} at distance ${d}.`, u);
    for (const { v, w } of adj[u]) {
      const nd = d + w;
      if (nd < dist[v]) {
        dist[v] = nd;
        parent.set(v, u);
        pq.push({ d: nd, v });
        sortPQ();
        snap(11, `Relax ${NODES[u].label}→${NODES[v].label} (w=${w}) → dist[${NODES[v].label}] = ${nd}.`, u);
      } else {
        snap(10, `Edge ${NODES[u].label}→${NODES[v].label} does not improve dist[${NODES[v].label}]=${dist[v]}.`, u);
      }
    }
  }
  snap(12, "Dijkstra complete.", null, { done: true });
  return frames;
}

/* ---------- Problem registry ---------- */
type AlgoKey = "bfs" | "dfs" | "dijkstra";
type AlgoDef = { id: AlgoKey; name: string; description: string; code: string; fileName: string };

const ALGOS: AlgoDef[] = [
  {
    id: "bfs",
    name: "Breadth-First Search",
    description:
      "Layer-by-layer traversal using a FIFO queue. Yields the shortest path in edges from the source in an unweighted graph. O(V + E).",
    code: BFS_CODE,
    fileName: "bfs.py",
  },
  {
    id: "dfs",
    name: "Depth-First Search",
    description:
      "Dive as deep as possible before backtracking, using an explicit stack. Backbone of topo sort, cycle detection, and SCC. O(V + E).",
    code: DFS_CODE,
    fileName: "dfs.py",
  },
  {
    id: "dijkstra",
    name: "Dijkstra's Algorithm",
    description:
      "Shortest paths from a single source in a weighted graph with non-negative edges. Uses a min-heap. O((V + E) log V).",
    code: DIJK_CODE,
    fileName: "dijkstra.py",
  },
];

const COMING_SOON = [
  "Bellman-Ford",
  "Floyd-Warshall",
  "Prim",
  "Kruskal",
  "Topological Sort",
  "Union-Find",
  "Strongly Connected Components",
];

/* ---------- Page ---------- */
function Page() {
  const [algo, setAlgo] = useState<AlgoKey>("bfs");
  const [src, setSrc] = useState(0);
  const problem = ALGOS.find((p) => p.id === algo)!;

  const frames = useMemo<AnyFrame[]>(() => {
    if (algo === "bfs") return traceBFS(src);
    if (algo === "dfs") return traceDFS(src);
    return traceDijkstra(src);
  }, [algo, src]);

  const [step, setStep] = useState(0);
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(700);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setStep(0);
    setRunning(false);
  }, [algo, src]);

  useEffect(() => {
    if (!running) return;
    timerRef.current = setInterval(() => {
      setStep((s) => {
        if (s >= frames.length - 1) {
          setRunning(false);
          return s;
        }
        return s + 1;
      });
    }, speed);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [running, speed, frames.length]);

  const frame = frames[Math.min(step, frames.length - 1)];
  const done = step >= frames.length - 1;

  return (
    <PageShell>
      <PlaygroundBackButton playground="graph-algorithms" />
      <PageHeader
        eyebrow="Graph Algorithms Playground"
        title="Traverse, relax, converge — live"
        description="Pick BFS, DFS, or Dijkstra, choose a source vertex, and step through every enqueue, pop, and edge relaxation on a shared graph."
      />

      <Callout kind="tip" title="Reading the visualization">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            The <span className="font-semibold text-foreground">current vertex</span> pulses in
            brand blue; <span className="font-semibold text-emerald-500">visited</span> vertices
            turn green.
          </li>
          <li>
            Edges highlighted in emerald form the traversal / shortest-path tree so far.
          </li>
          <li>
            The <span className="font-semibold">queue / stack / priority queue</span> panel updates
            on every step alongside the distance table.
          </li>
        </ul>
      </Callout>

      <div className="card-surface mt-6 p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[240px]">
            <div className="mb-1 text-xs text-muted-foreground">Algorithm</div>
            <div className="flex flex-wrap gap-2">
              {ALGOS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setAlgo(p.id)}
                  className={`rounded-full border px-3 py-1 text-xs transition ${
                    p.id === algo
                      ? "border-[color:var(--brand)] bg-[color:var(--brand)]/15 text-foreground"
                      : "border-border bg-card text-muted-foreground hover:bg-accent"
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-1 text-xs text-muted-foreground">Source vertex</div>
            <div className="flex flex-wrap gap-1">
              {NODES.map((n) => (
                <button
                  key={n.id}
                  onClick={() => setSrc(n.id)}
                  className={`h-7 w-7 rounded-full border text-xs font-semibold transition ${
                    n.id === src
                      ? "border-[color:var(--brand)] bg-[color:var(--brand)]/20 text-foreground"
                      : "border-border bg-card text-muted-foreground hover:bg-accent"
                  }`}
                >
                  {n.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-1 text-xs text-muted-foreground">
              Speed ({(1000 / speed).toFixed(1)} steps/s)
            </div>
            <input
              type="range"
              min={100}
              max={1200}
              value={1300 - speed}
              onChange={(e) => setSpeed(1300 - parseInt(e.target.value, 10))}
              className="w-40 accent-[color:var(--brand)]"
            />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-3 py-1.5 text-xs hover:bg-accent"
          >
            <StepBack className="h-3.5 w-3.5" /> Prev
          </button>
          <button
            onClick={() => setRunning((r) => !r)}
            disabled={done && !running}
            className="inline-flex items-center gap-1 rounded-md gradient-brand px-3 py-1.5 text-xs font-medium text-primary-foreground disabled:opacity-60"
          >
            {running ? (
              <>
                <Pause className="h-3.5 w-3.5" /> Pause
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5" /> {done ? "Done" : "Play"}
              </>
            )}
          </button>
          <button
            onClick={() => setStep((s) => Math.min(frames.length - 1, s + 1))}
            className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-3 py-1.5 text-xs hover:bg-accent"
          >
            <StepForward className="h-3.5 w-3.5" /> Next
          </button>
          <button
            onClick={() => {
              setStep(0);
              setRunning(false);
            }}
            className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-3 py-1.5 text-xs hover:bg-accent"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reset
          </button>
          <div className="ml-auto text-xs text-muted-foreground">
            Step {Math.min(step + 1, frames.length)} / {frames.length}
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,320px)]">
        <div className="card-surface p-4">
          <div className="mb-3 text-sm font-semibold">Graph</div>
          <GraphSVG frame={frame} />
          <div
            className={`mt-3 rounded-md border px-3 py-2 text-sm ${
              frame?.done
                ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-600"
                : "border-border bg-muted/40 text-muted-foreground"
            }`}
          >
            {frame?.note ?? "Press Play to start."}
          </div>
        </div>

        <div className="card-surface flex flex-col gap-4 p-4">
          <FrontierPanel frame={frame} />
          <DistancePanel frame={frame} />
          <StatsPanel frame={frame} />
        </div>
      </div>

      <div className="mt-6">
        <CodeViewer
          code={problem.code}
          title={problem.fileName}
          activeLine={frame?.line}
          defaultExpanded
        />
      </div>

      <div className="mt-6 card-surface p-4">
        <div className="mb-2 text-sm font-semibold">About this algorithm</div>
        <p className="text-sm text-muted-foreground">{problem.description}</p>
      </div>

      <div className="mt-6 card-surface p-4">
        <div className="mb-3 text-sm font-semibold">More algorithms — coming soon</div>
        <div className="flex flex-wrap gap-2">
          {COMING_SOON.map((label) => (
            <span
              key={label}
              className="rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-xs text-amber-500"
            >
              {label}
            </span>
          ))}
        </div>
      </div>

      <PlaygroundFooterNav playground="graph-algorithms" />
    </PageShell>
  );
}

/* ---------- Sub-renderers ---------- */
function GraphSVG({ frame }: { frame: AnyFrame | undefined }) {
  const width = 520;
  const height = 440;
  const treeEdges = new Set(frame?.treeEdges ?? []);
  const visited = new Set(frame?.visited ?? []);
  const current = frame?.current ?? null;
  const dist = frame?.kind === "bfs" || frame?.kind === "dijkstra" ? frame.dist : null;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto rounded-md border border-border bg-background">
      {EDGES.map(({ u, v, w }) => {
        const a = NODES[u];
        const b = NODES[v];
        const highlighted = treeEdges.has(edgeKey(u, v));
        return (
          <g key={`${u}-${v}`}>
            <line
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke={highlighted ? "rgb(16 185 129)" : "currentColor"}
              strokeOpacity={highlighted ? 1 : 0.35}
              strokeWidth={highlighted ? 3 : 1.5}
              className="text-muted-foreground"
            />
            <text
              x={(a.x + b.x) / 2}
              y={(a.y + b.y) / 2 - 4}
              textAnchor="middle"
              fontSize={11}
              className="fill-muted-foreground"
            >
              {w}
            </text>
          </g>
        );
      })}
      {NODES.map((n) => {
        const isCurrent = current === n.id;
        const isVisited = visited.has(n.id);
        const fill = isCurrent
          ? "var(--brand)"
          : isVisited
            ? "rgb(16 185 129)"
            : "hsl(var(--card))";
        const stroke = isCurrent
          ? "var(--brand)"
          : isVisited
            ? "rgb(16 185 129)"
            : "hsl(var(--border))";
        const textColor = isCurrent || isVisited ? "white" : "hsl(var(--foreground))";
        return (
          <g key={n.id}>
            <motion.circle
              cx={n.x}
              cy={n.y}
              r={20}
              initial={false}
              animate={{ scale: isCurrent ? 1.15 : 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              fill={fill}
              stroke={stroke}
              strokeWidth={2}
              style={{ transformOrigin: `${n.x}px ${n.y}px` }}
            />
            <text
              x={n.x}
              y={n.y + 4}
              textAnchor="middle"
              fontSize={13}
              fontWeight={600}
              fill={textColor}
            >
              {n.label}
            </text>
            {dist && (
              <text
                x={n.x}
                y={n.y + 36}
                textAnchor="middle"
                fontSize={10}
                className="fill-muted-foreground"
              >
                {dist[n.id] === Infinity ? "∞" : dist[n.id]}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

function FrontierPanel({ frame }: { frame: AnyFrame | undefined }) {
  if (!frame) return null;
  let title = "";
  let items: string[] = [];
  if (frame.kind === "bfs") {
    title = `Queue (${frame.queue.length})`;
    items = frame.queue.map((id) => NODES[id].label);
  } else if (frame.kind === "dfs") {
    title = `Stack (${frame.stack.length})`;
    items = [...frame.stack].reverse().map((id) => NODES[id].label);
  } else {
    title = `Priority queue (${frame.pq.length})`;
    items = frame.pq.map((e) => `${NODES[e.v].label}:${e.d}`);
  }
  return (
    <div>
      <div className="mb-1 text-xs text-muted-foreground">{title}</div>
      <div className="flex min-h-[36px] flex-wrap gap-1 rounded-md border border-border bg-background p-2 font-mono text-xs">
        {items.length === 0 && <span className="text-muted-foreground">empty</span>}
        {items.map((label, i) => (
          <span
            key={`${label}-${i}`}
            className="rounded-md border border-[color:var(--brand)]/40 bg-[color:var(--brand)]/10 px-2 py-0.5 text-[color:var(--brand)]"
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

function DistancePanel({ frame }: { frame: AnyFrame | undefined }) {
  if (!frame) return null;
  if (frame.kind === "dfs") {
    return (
      <div>
        <div className="mb-1 text-xs text-muted-foreground">Visited order</div>
        <div className="rounded-md border border-border bg-background p-2 font-mono text-xs">
          {frame.visited.length === 0
            ? <span className="text-muted-foreground">none</span>
            : frame.visited.map((id) => NODES[id].label).join(" → ")}
        </div>
      </div>
    );
  }
  const dist = frame.dist;
  return (
    <div>
      <div className="mb-1 text-xs text-muted-foreground">Distance table</div>
      <div className="grid grid-cols-4 gap-1 rounded-md border border-border bg-background p-2 font-mono text-xs">
        {NODES.map((n) => (
          <div key={n.id} className="flex items-center justify-between rounded bg-muted/40 px-1.5 py-0.5">
            <span className="text-muted-foreground">{n.label}</span>
            <span className="text-foreground">
              {dist[n.id] === Infinity ? "∞" : dist[n.id]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatsPanel({ frame }: { frame: AnyFrame | undefined }) {
  if (!frame) return null;
  const rows: { label: string; value: string | number }[] = [
    { label: "Visited", value: `${frame.visited.length} / ${NODES.length}` },
    { label: "Tree edges", value: frame.treeEdges.length },
  ];
  if (frame.kind === "bfs") rows.push({ label: "Queue size", value: frame.queue.length });
  if (frame.kind === "dfs") rows.push({ label: "Stack size", value: frame.stack.length });
  if (frame.kind === "dijkstra") rows.push({ label: "PQ size", value: frame.pq.length });
  return (
    <div>
      <div className="mb-1 text-xs text-muted-foreground">Live statistics</div>
      <dl className="grid grid-cols-2 gap-y-1 text-xs">
        {rows.map((r) => (
          <div key={r.label} className="contents">
            <dt className="text-muted-foreground">{r.label}</dt>
            <dd className="text-right font-mono text-foreground">{r.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
