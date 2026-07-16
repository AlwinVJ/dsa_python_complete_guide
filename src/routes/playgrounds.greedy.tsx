import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageShell, PageHeader, Callout } from "@/components/Callout";
import { CodeViewer } from "@/components/CodeViewer";
import {
  PlaygroundBackButton,
  PlaygroundFooterNav,
} from "@/components/PlaygroundNav";
import { Play, Pause, RotateCcw, StepForward, StepBack } from "lucide-react";

export const Route = createFileRoute("/playgrounds/greedy")({
  head: () => ({
    meta: [
      { title: "Greedy Algorithms Playground — DSA with Python" },
      {
        name: "description",
        content:
          "Step through Activity Selection, Fractional Knapsack, and Huffman Coding frame by frame — watch each greedy choice, rejection, and running objective update live.",
      },
      { property: "og:title", content: "Greedy Algorithms Playground — DSA with Python" },
      {
        property: "og:description",
        content:
          "Interactive greedy visualizer — three classic problems, one live playground.",
      },
    ],
  }),
  component: Page,
});

/* ---------- Shared frame model ---------- */
type BaseFrame = {
  line: number;
  note: string;
  solution?: boolean;
  reject?: boolean;
  pick?: boolean;
};

/* ---------- Activity Selection tracer ---------- */
const ACTIVITY_CODE = `def activity_selection(intervals):
    intervals.sort(key=lambda x: x[1])   # sort by end time
    picked, last_end = [], float('-inf')
    for s, e in intervals:
        if s >= last_end:
            picked.append((s, e))
            last_end = e
    return picked`;

type Activity = { s: number; e: number; id: number };

type ActivityFrame = BaseFrame & {
  kind: "activity";
  activities: Activity[]; // sorted order
  index: number;
  picked: number[]; // ids
  rejected: number[]; // ids
  lastEnd: number;
};

const DEFAULT_ACTIVITIES: Activity[] = [
  { s: 1, e: 4, id: 0 },
  { s: 3, e: 5, id: 1 },
  { s: 0, e: 6, id: 2 },
  { s: 5, e: 7, id: 3 },
  { s: 3, e: 9, id: 4 },
  { s: 5, e: 9, id: 5 },
  { s: 6, e: 10, id: 6 },
  { s: 8, e: 11, id: 7 },
];

function traceActivity(input: Activity[]): ActivityFrame[] {
  const frames: ActivityFrame[] = [];
  const activities = [...input].sort((a, b) => a.e - b.e);
  const picked: number[] = [];
  const rejected: number[] = [];
  let lastEnd = -Infinity;

  const snap = (line: number, note: string, index: number, extras: Partial<ActivityFrame> = {}) => {
    frames.push({
      kind: "activity",
      line,
      note,
      activities: activities.map((a) => ({ ...a })),
      index,
      picked: [...picked],
      rejected: [...rejected],
      lastEnd,
      ...extras,
    });
  };

  snap(2, "Sorted activities by end time.", -1);

  for (let i = 0; i < activities.length; i++) {
    const a = activities[i];
    snap(4, `Consider activity #${a.id} — [${a.s}, ${a.e}]`, i);
    if (a.s >= lastEnd) {
      picked.push(a.id);
      lastEnd = a.e;
      snap(6, `Start ${a.s} ≥ lastEnd → pick #${a.id}. lastEnd = ${a.e}.`, i, { pick: true });
    } else {
      rejected.push(a.id);
      snap(5, `Start ${a.s} < lastEnd (${lastEnd}) → reject #${a.id}.`, i, { reject: true });
    }
  }
  snap(7, `Done — selected ${picked.length} activities.`, activities.length, { solution: true });
  return frames;
}

/* ---------- Fractional Knapsack tracer ---------- */
const KNAPSACK_CODE = `def fractional_knapsack(items, capacity):
    items.sort(key=lambda x: x[0] / x[1], reverse=True)
    total = 0.0
    for v, w in items:
        if capacity == 0: break
        take = min(w, capacity)
        total += v * (take / w)
        capacity -= take
    return total`;

type KItem = { v: number; w: number; id: number };

type KnapsackFrame = BaseFrame & {
  kind: "knapsack";
  items: KItem[];
  index: number;
  capacity: number;
  remaining: number;
  totalValue: number;
  fractions: number[]; // fraction taken per index (0..1)
};

const DEFAULT_KNAPSACK_ITEMS: KItem[] = [
  { v: 60, w: 10, id: 0 },
  { v: 100, w: 20, id: 1 },
  { v: 120, w: 30, id: 2 },
];
const DEFAULT_CAPACITY = 50;

function traceKnapsack(itemsIn: KItem[], capacity: number): KnapsackFrame[] {
  const frames: KnapsackFrame[] = [];
  const items = [...itemsIn].sort((a, b) => b.v / b.w - a.v / a.w);
  const fractions = new Array(items.length).fill(0);
  let remaining = capacity;
  let totalValue = 0;

  const snap = (
    line: number,
    note: string,
    index: number,
    extras: Partial<KnapsackFrame> = {},
  ) => {
    frames.push({
      kind: "knapsack",
      line,
      note,
      items: items.map((i) => ({ ...i })),
      index,
      capacity,
      remaining,
      totalValue,
      fractions: [...fractions],
      ...extras,
    });
  };

  snap(2, "Sorted items by value / weight ratio (descending).", -1);

  for (let i = 0; i < items.length; i++) {
    const it = items[i];
    snap(4, `Consider item #${it.id} — value ${it.v}, weight ${it.w}, ratio ${(it.v / it.w).toFixed(2)}.`, i);
    if (remaining === 0) {
      snap(5, "Capacity exhausted — stop.", i, { reject: true });
      break;
    }
    const take = Math.min(it.w, remaining);
    const frac = take / it.w;
    totalValue += it.v * frac;
    remaining -= take;
    fractions[i] = frac;
    if (frac === 1) {
      snap(7, `Take all of #${it.id} (weight ${take}) → +${it.v} value.`, i, { pick: true });
    } else {
      snap(7, `Take ${(frac * 100).toFixed(0)}% of #${it.id} → +${(it.v * frac).toFixed(1)} value.`, i, {
        pick: true,
      });
    }
  }
  snap(8, `Done — total value ${totalValue.toFixed(1)}.`, items.length, { solution: true });
  return frames;
}

/* ---------- Huffman Coding tracer ---------- */
const HUFFMAN_CODE = `import heapq

def huffman_codes(freq):
    heap = [[f, ch] for ch, f in freq.items()]
    heapq.heapify(heap)
    while len(heap) > 1:
        lo = heapq.heappop(heap)
        hi = heapq.heappop(heap)
        merged = [lo[0] + hi[0], (lo, hi)]
        heapq.heappush(heap, merged)
    return heap[0]`;

type HNode = {
  id: number;
  freq: number;
  label: string; // single char or "internal"
  isLeaf: boolean;
  left?: number;
  right?: number;
};

type HuffmanFrame = BaseFrame & {
  kind: "huffman";
  nodes: HNode[]; // all nodes ever created
  heap: number[]; // ids currently in the heap, sorted asc by freq
  totalCost: number;
  merges: { parent: number; left: number; right: number }[];
};

const DEFAULT_FREQ: { ch: string; f: number }[] = [
  { ch: "a", f: 5 },
  { ch: "b", f: 9 },
  { ch: "c", f: 12 },
  { ch: "d", f: 13 },
  { ch: "e", f: 16 },
  { ch: "f", f: 45 },
];

function traceHuffman(freq: { ch: string; f: number }[]): HuffmanFrame[] {
  const frames: HuffmanFrame[] = [];
  const nodes: HNode[] = freq.map((x, i) => ({
    id: i,
    freq: x.f,
    label: x.ch,
    isLeaf: true,
  }));
  let heap: number[] = nodes.map((n) => n.id);
  const merges: { parent: number; left: number; right: number }[] = [];
  let totalCost = 0;

  const sortHeap = () => {
    heap = [...heap].sort((a, b) => nodes[a].freq - nodes[b].freq);
  };

  const snap = (line: number, note: string, extras: Partial<HuffmanFrame> = {}) => {
    frames.push({
      kind: "huffman",
      line,
      note,
      nodes: nodes.map((n) => ({ ...n })),
      heap: [...heap],
      totalCost,
      merges: merges.map((m) => ({ ...m })),
      ...extras,
    });
  };

  sortHeap();
  snap(4, "Initial min-heap built from character frequencies.");

  while (heap.length > 1) {
    sortHeap();
    const loId = heap.shift()!;
    snap(6, `Pop smallest: node ${nodes[loId].label} (freq ${nodes[loId].freq}).`, {
      pick: true,
    });
    const hiId = heap.shift()!;
    snap(7, `Pop next smallest: node ${nodes[hiId].label} (freq ${nodes[hiId].freq}).`, {
      pick: true,
    });

    const parentId = nodes.length;
    const parent: HNode = {
      id: parentId,
      freq: nodes[loId].freq + nodes[hiId].freq,
      label: "•",
      isLeaf: false,
      left: loId,
      right: hiId,
    };
    nodes.push(parent);
    heap.push(parentId);
    merges.push({ parent: parentId, left: loId, right: hiId });
    totalCost += parent.freq;
    sortHeap();
    snap(8, `Merge into parent (freq ${parent.freq}). Cost += ${parent.freq}.`, { pick: true });
  }
  snap(9, `Done — Huffman tree built. Total merge cost = ${totalCost}.`, { solution: true });
  return frames;
}

type AnyFrame = ActivityFrame | KnapsackFrame | HuffmanFrame;

/* ---------- Problem registry ---------- */
type ProblemKey = "activity" | "knapsack" | "huffman";

type ProblemDef = {
  id: ProblemKey;
  name: string;
  description: string;
  code: string;
  fileName: string;
};

const PROBLEMS: ProblemDef[] = [
  {
    id: "activity",
    name: "Activity Selection",
    description:
      "Sort activities by end time and pick every one whose start is at or after the last picked end. Every picked interval is a locally optimal choice, and the exchange argument shows greedy is globally optimal.",
    code: ACTIVITY_CODE,
    fileName: "activity_selection.py",
  },
  {
    id: "knapsack",
    name: "Fractional Knapsack",
    description:
      "Sort items by value per unit weight (descending) and pour as much of each item into the knapsack as fits. Because we can take fractions, the highest-ratio choice at each step is always safe.",
    code: KNAPSACK_CODE,
    fileName: "fractional_knapsack.py",
  },
  {
    id: "huffman",
    name: "Huffman Coding",
    description:
      "Build an optimal prefix-code tree by repeatedly popping the two lowest-frequency nodes from a min-heap and merging them into a parent whose frequency is their sum. Total merge cost equals the length of the encoded output.",
    code: HUFFMAN_CODE,
    fileName: "huffman.py",
  },
];

/* ---------- Page ---------- */
function Page() {
  const [problemId, setProblemId] = useState<ProblemKey>("activity");
  const problem = PROBLEMS.find((p) => p.id === problemId)!;
  const [capacity, setCapacity] = useState(DEFAULT_CAPACITY);

  const frames: AnyFrame[] = useMemo(() => {
    if (problem.id === "activity") return traceActivity(DEFAULT_ACTIVITIES);
    if (problem.id === "knapsack") return traceKnapsack(DEFAULT_KNAPSACK_ITEMS, capacity);
    return traceHuffman(DEFAULT_FREQ);
  }, [problem.id, capacity]);

  const [step, setStep] = useState(0);
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(600);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setStep(0);
    setRunning(false);
  }, [problem.id, capacity]);

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
      <PlaygroundBackButton playground="greedy" />
      <PageHeader
        eyebrow="Greedy Playground"
        title="Sort, commit, win — live"
        description="Pick a classic greedy problem, step through every decision, and watch the running objective grow as the algorithm commits to its next locally optimal choice."
      />

      <Callout kind="tip" title="Reading the visualization">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            The <span className="font-semibold text-foreground">code panel</span> highlights the
            line currently executing.
          </li>
          <li>
            Green means the greedy step <span className="font-semibold">picked</span> an item;
            amber means it <span className="font-semibold">rejected</span> or skipped.
          </li>
          <li>
            The <span className="font-semibold">running objective</span> (activities picked, total
            value, or merge cost) updates on every step.
          </li>
        </ul>
      </Callout>

      <div className="card-surface mt-6 p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[240px]">
            <div className="mb-1 text-xs text-muted-foreground">Problem</div>
            <div className="flex flex-wrap gap-2">
              {PROBLEMS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setProblemId(p.id)}
                  className={`rounded-full border px-3 py-1 text-xs transition ${
                    p.id === problemId
                      ? "border-[color:var(--brand)] bg-[color:var(--brand)]/15 text-foreground"
                      : "border-border bg-card text-muted-foreground hover:bg-accent"
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {problem.id === "knapsack" && (
            <div>
              <div className="mb-1 text-xs text-muted-foreground">
                Capacity = {capacity}
              </div>
              <input
                type="range"
                min={10}
                max={60}
                value={capacity}
                onChange={(e) => setCapacity(parseInt(e.target.value, 10))}
                className="w-40 accent-[color:var(--brand)]"
              />
            </div>
          )}

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
          <div className="mb-3 flex items-center justify-between">
            <div className="text-sm font-semibold">Visualization</div>
          </div>
          <FrameVisualizer frame={frame} />
          <div
            className={`mt-3 rounded-md border px-3 py-2 text-sm ${
              frame?.solution
                ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-600"
                : frame?.reject
                  ? "border-amber-500/50 bg-amber-500/10 text-amber-600"
                  : frame?.pick
                    ? "border-[color:var(--brand)]/40 bg-[color:var(--brand)]/10 text-[color:var(--brand)]"
                    : "border-border bg-muted/40 text-muted-foreground"
            }`}
          >
            {frame?.note ?? "Press Play to start."}
          </div>
        </div>

        <div className="card-surface p-4">
          <div className="mb-2 text-sm font-semibold">Live statistics</div>
          <FrameStats frame={frame} />
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
        <div className="mb-2 text-sm font-semibold">About this problem</div>
        <p className="text-sm text-muted-foreground">{problem.description}</p>
      </div>

      <PlaygroundFooterNav playground="greedy" />
    </PageShell>
  );
}

/* ---------- Sub-renderers ---------- */

function FrameVisualizer({ frame }: { frame: AnyFrame | undefined }) {
  if (!frame) return <div className="h-40" />;
  if (frame.kind === "activity") return <ActivityViz f={frame} />;
  if (frame.kind === "knapsack") return <KnapsackViz f={frame} />;
  return <HuffmanViz f={frame} />;
}

function ActivityViz({ f }: { f: ActivityFrame }) {
  const maxEnd = Math.max(...f.activities.map((a) => a.e), 1);
  return (
    <div className="space-y-2">
      {f.activities.map((a, i) => {
        const picked = f.picked.includes(a.id);
        const rejected = f.rejected.includes(a.id);
        const active = i === f.index;
        const leftPct = (a.s / maxEnd) * 100;
        const widthPct = ((a.e - a.s) / maxEnd) * 100;
        return (
          <div key={a.id} className="flex items-center gap-2">
            <div className="w-16 text-xs text-muted-foreground">
              #{a.id} [{a.s},{a.e}]
            </div>
            <div className="relative h-6 flex-1 rounded-md bg-muted/40">
              <motion.div
                layout
                initial={false}
                animate={{
                  left: `${leftPct}%`,
                  width: `${widthPct}%`,
                }}
                className={`absolute top-0 h-full rounded-md border ${
                  picked
                    ? "border-emerald-500/60 bg-emerald-500/25"
                    : rejected
                      ? "border-amber-500/60 bg-amber-500/20 opacity-70"
                      : active
                        ? "border-[color:var(--brand)] bg-[color:var(--brand)]/25"
                        : "border-border bg-background"
                }`}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function KnapsackViz({ f }: { f: KnapsackFrame }) {
  const filled = f.capacity - f.remaining;
  const pct = (filled / f.capacity) * 100;
  return (
    <div className="space-y-4">
      <div>
        <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
          <span>Knapsack fill</span>
          <span>
            {filled} / {f.capacity}
          </span>
        </div>
        <div className="relative h-6 w-full overflow-hidden rounded-md border border-border bg-muted/40">
          <motion.div
            initial={false}
            animate={{ width: `${pct}%` }}
            className="h-full bg-[color:var(--brand)]/40"
          />
        </div>
      </div>
      <div>
        <div className="mb-2 text-xs text-muted-foreground">
          Items (sorted by value/weight ratio)
        </div>
        <div className="space-y-2">
          {f.items.map((it, i) => {
            const frac = f.fractions[i];
            const active = i === f.index;
            return (
              <div
                key={it.id}
                className={`rounded-md border p-2 transition ${
                  active
                    ? "border-[color:var(--brand)] bg-[color:var(--brand)]/10"
                    : frac > 0
                      ? "border-emerald-500/40 bg-emerald-500/10"
                      : "border-border bg-background"
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono">
                    #{it.id} · v={it.v}, w={it.w} · ratio {(it.v / it.w).toFixed(2)}
                  </span>
                  <span className="text-muted-foreground">
                    taken {(frac * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="mt-1 h-1.5 w-full overflow-hidden rounded bg-muted">
                  <motion.div
                    initial={false}
                    animate={{ width: `${frac * 100}%` }}
                    className="h-full bg-emerald-500/60"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function HuffmanViz({ f }: { f: HuffmanFrame }) {
  return (
    <div className="space-y-4">
      <div>
        <div className="mb-1 text-xs text-muted-foreground">
          Min-heap ({f.heap.length} node{f.heap.length === 1 ? "" : "s"})
        </div>
        <div className="flex min-h-[42px] flex-wrap items-center gap-2 rounded-md border border-border bg-background p-2">
          <AnimatePresence initial={false}>
            {f.heap.map((id) => {
              const n = f.nodes[id];
              return (
                <motion.span
                  key={id}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  className={`rounded-md border px-2.5 py-1 font-mono text-xs ${
                    n.isLeaf
                      ? "border-[color:var(--brand)]/60 bg-[color:var(--brand)]/10 text-[color:var(--brand)]"
                      : "border-emerald-500/60 bg-emerald-500/10 text-emerald-600"
                  }`}
                >
                  {n.label}:{n.freq}
                </motion.span>
              );
            })}
          </AnimatePresence>
          {f.heap.length === 0 && <span className="text-xs text-muted-foreground">empty</span>}
        </div>
      </div>
      <div>
        <div className="mb-1 text-xs text-muted-foreground">
          Merges so far ({f.merges.length})
        </div>
        <div className="max-h-40 space-y-1 overflow-y-auto rounded-md border border-border bg-background p-2 font-mono text-xs">
          {f.merges.length === 0 && <div className="text-muted-foreground">none yet</div>}
          {f.merges.map((m, i) => {
            const parent = f.nodes[m.parent];
            const left = f.nodes[m.left];
            const right = f.nodes[m.right];
            return (
              <div key={i} className="text-emerald-600">
                {left.label}:{left.freq} + {right.label}:{right.freq} → •:{parent.freq}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function FrameStats({ frame }: { frame: AnyFrame | undefined }) {
  if (!frame) {
    return <div className="text-xs text-muted-foreground">Press Play to begin.</div>;
  }
  const rows: { label: string; value: string | number }[] = [];
  if (frame.kind === "activity") {
    rows.push({ label: "Considered", value: `${Math.max(frame.index + 1, 0)} / ${frame.activities.length}` });
    rows.push({ label: "Picked", value: frame.picked.length });
    rows.push({ label: "Rejected", value: frame.rejected.length });
    rows.push({
      label: "Last end",
      value: Number.isFinite(frame.lastEnd) ? frame.lastEnd : "−∞",
    });
  } else if (frame.kind === "knapsack") {
    rows.push({ label: "Capacity", value: frame.capacity });
    rows.push({ label: "Remaining", value: frame.remaining });
    rows.push({ label: "Total value", value: frame.totalValue.toFixed(1) });
    rows.push({
      label: "Items done",
      value: `${frame.fractions.filter((x) => x > 0).length} / ${frame.items.length}`,
    });
  } else {
    rows.push({ label: "Heap size", value: frame.heap.length });
    rows.push({ label: "Merges", value: frame.merges.length });
    rows.push({ label: "Total cost", value: frame.totalCost });
  }
  return (
    <dl className="grid grid-cols-2 gap-y-2 text-xs">
      {rows.map((r) => (
        <div key={r.label} className="contents">
          <dt className="text-muted-foreground">{r.label}</dt>
          <dd className="text-right font-mono text-foreground">{r.value}</dd>
        </div>
      ))}
    </dl>
  );
}
