import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { PageShell, PageHeader, Callout } from "@/components/Callout";
import { CodeViewer } from "@/components/CodeViewer";
import { PlaygroundBackButton, PlaygroundFooterNav } from "@/components/PlaygroundNav";
import {
  Play,
  Pause,
  RotateCcw,
  StepForward,
  StepBack,
  Sparkles,
} from "lucide-react";

export const Route = createFileRoute("/playgrounds/dp")({
  head: () => ({
    meta: [
      { title: "Dynamic Programming Playground — DSA with Python" },
      {
        name: "description",
        content:
          "Step through Fibonacci (memoization vs tabulation), Climbing Stairs, and Coin Change frame by frame — watch DP tables fill and caches populate.",
      },
      { property: "og:title", content: "Dynamic Programming Playground — DSA with Python" },
      {
        property: "og:description",
        content:
          "Interactive DP visualizer — see recursion trees, caches, and DP tables construct in real time.",
      },
    ],
  }),
  component: Page,
});

/* ---------- Frame model ---------- */
type BaseFrame = {
  line: number;
  note: string;
  depth: number;
  solution?: boolean;
  cacheHit?: boolean;
  write?: boolean;
};

type FibMemoFrame = BaseFrame & {
  kind: "fib-memo";
  n: number;
  arg: number;
  cache: Record<number, number>;
  stack: number[];
  calls: number;
  hits: number;
  result?: number;
};

type FibTabFrame = BaseFrame & {
  kind: "fib-tab";
  n: number;
  dp: number[];
  i: number;
};

type StairsFrame = BaseFrame & {
  kind: "stairs";
  n: number;
  dp: number[];
  i: number;
};

type CoinFrame = BaseFrame & {
  kind: "coin";
  coins: number[];
  amount: number;
  dp: number[];
  a: number;
  c?: number;
};

type AnyFrame = FibMemoFrame | FibTabFrame | StairsFrame | CoinFrame;

/* ---------- Fibonacci Memoization tracer ---------- */
const FIB_MEMO_CODE = `from functools import lru_cache

@lru_cache(maxsize=None)
def fib(n):
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)`;

function traceFibMemo(n: number): FibMemoFrame[] {
  const frames: FibMemoFrame[] = [];
  const cache: Record<number, number> = {};
  const stack: number[] = [];
  let calls = 0;
  let hits = 0;

  const snap = (
    line: number,
    note: string,
    arg: number,
    depth: number,
    extras: Partial<FibMemoFrame> = {},
  ) => {
    frames.push({
      kind: "fib-memo",
      line,
      note,
      depth,
      n,
      arg,
      cache: { ...cache },
      stack: [...stack],
      calls,
      hits,
      ...extras,
    });
  };

  function fib(x: number, depth: number): number {
    calls++;
    stack.push(x);
    snap(4, `fib(${x}) — call`, x, depth);
    if (x in cache) {
      hits++;
      const v = cache[x];
      snap(4, `fib(${x}) cache HIT → ${v}`, x, depth, {
        cacheHit: true,
        result: v,
      });
      stack.pop();
      return v;
    }
    if (x < 2) {
      cache[x] = x;
      snap(5, `Base case fib(${x}) = ${x}`, x, depth, {
        solution: true,
        write: true,
        result: x,
      });
      stack.pop();
      return x;
    }
    snap(7, `Recurse: fib(${x - 1}) + fib(${x - 2})`, x, depth);
    const a = fib(x - 1, depth + 1);
    const b = fib(x - 2, depth + 1);
    const v = a + b;
    cache[x] = v;
    snap(7, `Store fib(${x}) = ${v}`, x, depth, {
      write: true,
      result: v,
    });
    stack.pop();
    return v;
  }

  fib(n, 0);
  return frames;
}

/* ---------- Fibonacci Tabulation tracer ---------- */
const FIB_TAB_CODE = `def fib(n):
    if n < 2:
        return n
    dp = [0] * (n + 1)
    dp[1] = 1
    for i in range(2, n + 1):
        dp[i] = dp[i - 1] + dp[i - 2]
    return dp[n]`;

function traceFibTab(n: number): FibTabFrame[] {
  const frames: FibTabFrame[] = [];
  const dp = new Array(Math.max(n + 1, 2)).fill(0);
  const snap = (line: number, note: string, i: number, extras: Partial<FibTabFrame> = {}) => {
    frames.push({
      kind: "fib-tab",
      line,
      note,
      depth: 0,
      n,
      dp: [...dp],
      i,
      ...extras,
    });
  };

  if (n < 2) {
    snap(2, `n < 2 → return ${n}`, 0, { solution: true });
    return frames;
  }
  snap(4, `Initialize dp = [0] * ${n + 1}`, 0);
  dp[1] = 1;
  snap(5, `dp[1] = 1 (base case)`, 1, { write: true });
  for (let i = 2; i <= n; i++) {
    snap(6, `i = ${i} — reading dp[${i - 1}] + dp[${i - 2}]`, i);
    dp[i] = dp[i - 1] + dp[i - 2];
    snap(7, `dp[${i}] = dp[${i - 1}] + dp[${i - 2}] = ${dp[i]}`, i, { write: true });
  }
  snap(8, `Return dp[${n}] = ${dp[n]}`, n, { solution: true });
  return frames;
}

/* ---------- Climbing Stairs tracer ---------- */
const STAIRS_CODE = `def climb_stairs(n):
    if n <= 2:
        return n
    dp = [0] * (n + 1)
    dp[1], dp[2] = 1, 2
    for i in range(3, n + 1):
        dp[i] = dp[i - 1] + dp[i - 2]
    return dp[n]`;

function traceStairs(n: number): StairsFrame[] {
  const frames: StairsFrame[] = [];
  const dp = new Array(Math.max(n + 1, 3)).fill(0);
  const snap = (line: number, note: string, i: number, extras: Partial<StairsFrame> = {}) => {
    frames.push({
      kind: "stairs",
      line,
      note,
      depth: 0,
      n,
      dp: [...dp],
      i,
      ...extras,
    });
  };

  if (n <= 2) {
    snap(2, `n ≤ 2 → return ${n}`, 0, { solution: true });
    return frames;
  }
  snap(4, `Initialize dp = [0] * ${n + 1}`, 0);
  dp[1] = 1;
  dp[2] = 2;
  snap(5, `Base cases: dp[1] = 1, dp[2] = 2`, 2, { write: true });
  for (let i = 3; i <= n; i++) {
    snap(6, `i = ${i}`, i);
    dp[i] = dp[i - 1] + dp[i - 2];
    snap(7, `dp[${i}] = dp[${i - 1}] + dp[${i - 2}] = ${dp[i]}`, i, { write: true });
  }
  snap(8, `Return dp[${n}] = ${dp[n]} distinct ways`, n, { solution: true });
  return frames;
}

/* ---------- Coin Change tracer ---------- */
const COIN_CODE = `def coin_change(coins, amount):
    INF = amount + 1
    dp = [INF] * (amount + 1)
    dp[0] = 0
    for a in range(1, amount + 1):
        for c in coins:
            if c <= a:
                dp[a] = min(dp[a], dp[a - c] + 1)
    return dp[amount] if dp[amount] != INF else -1`;

function traceCoin(coins: number[], amount: number): CoinFrame[] {
  const frames: CoinFrame[] = [];
  const INF = amount + 1;
  const dp = new Array(amount + 1).fill(INF);
  const snap = (line: number, note: string, a: number, extras: Partial<CoinFrame> = {}) => {
    frames.push({
      kind: "coin",
      line,
      note,
      depth: 0,
      coins: [...coins],
      amount,
      dp: [...dp],
      a,
      ...extras,
    });
  };

  snap(3, `Initialize dp = [INF] * ${amount + 1}`, 0);
  dp[0] = 0;
  snap(4, `dp[0] = 0 (base case)`, 0, { write: true });
  for (let a = 1; a <= amount; a++) {
    snap(5, `Compute dp[${a}]`, a);
    for (const c of coins) {
      snap(6, `Try coin ${c}`, a, { c });
      if (c <= a) {
        const cand = dp[a - c] + 1;
        if (cand < dp[a]) {
          dp[a] = cand;
          snap(8, `dp[${a}] = dp[${a - c}] + 1 = ${cand} (new best)`, a, {
            c,
            write: true,
          });
        } else {
          snap(8, `dp[${a}] stays ${dp[a] === INF ? "INF" : dp[a]} (${cand} not better)`, a, {
            c,
          });
        }
      } else {
        snap(7, `Coin ${c} > amount ${a} — skip`, a, { c });
      }
    }
  }
  const finalNote =
    dp[amount] === INF
      ? `Amount ${amount} unreachable → return -1`
      : `Return dp[${amount}] = ${dp[amount]} coins`;
  snap(9, finalNote, amount, { solution: true });
  return frames;
}

/* ---------- Problems registry ---------- */
type ProblemKey = "fib-memo" | "fib-tab" | "stairs" | "coin";

type ProblemDef = {
  id: ProblemKey;
  name: string;
  description: string;
  code: string;
  fileName: string;
};

const PROBLEMS: ProblemDef[] = [
  {
    id: "fib-memo",
    name: "Fibonacci — Memoization",
    description:
      "Recursive Fibonacci with a cache. Watch the call stack unwind, see the cache populate, and count how many times a cache HIT saves an entire subtree of work.",
    code: FIB_MEMO_CODE,
    fileName: "fib_memo.py",
  },
  {
    id: "fib-tab",
    name: "Fibonacci — Tabulation",
    description:
      "Iterative bottom-up Fibonacci. The dp table fills left to right; each cell is computed from the two on its left. No recursion, no stack.",
    code: FIB_TAB_CODE,
    fileName: "fib_tab.py",
  },
  {
    id: "stairs",
    name: "Climbing Stairs",
    description:
      "Count distinct ways to climb n stairs taking 1 or 2 steps at a time. Same recurrence as Fibonacci, different base cases.",
    code: STAIRS_CODE,
    fileName: "climb_stairs.py",
  },
  {
    id: "coin",
    name: "Coin Change",
    description:
      "Minimum coins to make a target amount. Watch each amount try every coin denomination and adopt the best subresult.",
    code: COIN_CODE,
    fileName: "coin_change.py",
  },
];

const COMING_SOON = [
  { name: "0/1 Knapsack", note: "2-D table with take/skip transitions." },
  {
    name: "Longest Common Subsequence",
    note: "Fill the m × n grid diagonally and read the trace.",
  },
  {
    name: "Longest Increasing Subsequence",
    note: "Watch the patience-sort tails array update.",
  },
  {
    name: "Edit Distance",
    note: "Insert / delete / replace transitions on a 2-D grid.",
  },
  {
    name: "Matrix Chain Multiplication",
    note: "Interval DP filling by chain length.",
  },
];

/* ---------- Page ---------- */
function Page() {
  const [problemId, setProblemId] = useState<ProblemKey>("fib-memo");
  const problem = PROBLEMS.find((p) => p.id === problemId)!;

  const [fibN, setFibN] = useState(6);
  const [stairsN, setStairsN] = useState(6);
  const [coinInput, setCoinInput] = useState("1,2,5");
  const [coinAmount, setCoinAmount] = useState(11);

  const frames: AnyFrame[] = useMemo(() => {
    if (problem.id === "fib-memo") return traceFibMemo(fibN);
    if (problem.id === "fib-tab") return traceFibTab(fibN);
    if (problem.id === "stairs") return traceStairs(stairsN);
    const coins = coinInput
      .split(/[,\s]+/)
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => Number.isFinite(n) && n > 0)
      .slice(0, 5);
    return traceCoin(coins.length ? coins : [1, 2, 5], Math.max(1, Math.min(coinAmount, 20)));
  }, [problem.id, fibN, stairsN, coinInput, coinAmount]);

  const [step, setStep] = useState(0);
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(500);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setStep(0);
    setRunning(false);
  }, [problem.id, fibN, stairsN, coinInput, coinAmount]);

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
      <PlaygroundBackButton playground="dp" />
      <PageHeader
        eyebrow="Dynamic Programming Playground"
        title="Watch DP tables and caches fill — live"
        description="Pick a classic DP problem, step through every transition, and see how each subproblem's answer flows into the next."
      />

      <Callout kind="tip" title="Reading the visualization">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            The <span className="font-semibold text-foreground">code panel</span> highlights the
            line the algorithm is currently executing.
          </li>
          <li>
            The <span className="font-semibold text-foreground">state panel</span> shows the DP
            table, the cache, or the recursion stack being built.
          </li>
          <li>
            Amber cells mean a <span className="font-semibold">cache lookup / try</span>; blue
            cells mean a <span className="font-semibold">write</span>; green marks the{" "}
            <span className="font-semibold">final answer</span>.
          </li>
        </ul>
      </Callout>

      {/* Controls */}
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

          {(problem.id === "fib-memo" || problem.id === "fib-tab") && (
            <div>
              <div className="mb-1 text-xs text-muted-foreground">n = {fibN}</div>
              <input
                type="range"
                min={2}
                max={10}
                value={fibN}
                onChange={(e) => setFibN(parseInt(e.target.value, 10))}
                className="w-40 accent-[color:var(--brand)]"
              />
            </div>
          )}

          {problem.id === "stairs" && (
            <div>
              <div className="mb-1 text-xs text-muted-foreground">n = {stairsN}</div>
              <input
                type="range"
                min={1}
                max={12}
                value={stairsN}
                onChange={(e) => setStairsN(parseInt(e.target.value, 10))}
                className="w-40 accent-[color:var(--brand)]"
              />
            </div>
          )}

          {problem.id === "coin" && (
            <>
              <div>
                <div className="mb-1 text-xs text-muted-foreground">Coins (≤ 5)</div>
                <input
                  type="text"
                  value={coinInput}
                  onChange={(e) => setCoinInput(e.target.value)}
                  className="w-32 rounded-md border border-input bg-background px-2 py-1 font-mono text-xs"
                />
              </div>
              <div>
                <div className="mb-1 text-xs text-muted-foreground">Amount = {coinAmount}</div>
                <input
                  type="range"
                  min={1}
                  max={20}
                  value={coinAmount}
                  onChange={(e) => setCoinAmount(parseInt(e.target.value, 10))}
                  className="w-40 accent-[color:var(--brand)]"
                />
              </div>
            </>
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

      {/* Visualization */}
      <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,320px)]">
        <div className="card-surface p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-sm font-semibold">Visualization</div>
            <div className="text-xs text-muted-foreground">
              depth {frame?.depth ?? 0}
            </div>
          </div>
          <FrameVisualizer frame={frame} />
          <div
            className={`mt-3 rounded-md border px-3 py-2 text-sm ${
              frame?.solution
                ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-600"
                : frame?.cacheHit
                  ? "border-amber-500/50 bg-amber-500/10 text-amber-600"
                  : frame?.write
                    ? "border-sky-500/50 bg-sky-500/10 text-sky-600"
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

      {/* Code viewer */}
      <div className="mt-6">
        <CodeViewer
          code={problem.code}
          title={problem.fileName}
          activeLine={frame?.line}
          defaultExpanded
        />
      </div>

      {/* About */}
      <div className="mt-6 card-surface p-4">
        <div className="mb-2 text-sm font-semibold">About this problem</div>
        <p className="text-sm text-muted-foreground">{problem.description}</p>
      </div>

      {/* Coming soon */}
      <section className="mt-8">
        <h2 className="mb-3 inline-flex items-center gap-2 text-lg font-semibold">
          <Sparkles className="h-4 w-4 text-[color:var(--brand)]" /> Coming soon
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {COMING_SOON.map((c) => (
            <div key={c.name} className="card-surface flex flex-col gap-1 p-4 opacity-70">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold">{c.name}</div>
                <span className="rounded-full border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-amber-500">
                  Soon
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{c.note}</p>
            </div>
          ))}
        </div>
      </section>

      <PlaygroundFooterNav playground="dp" />
    </PageShell>
  );
}

/* ---------- Sub-renderers ---------- */

function FrameVisualizer({ frame }: { frame: AnyFrame | undefined }) {
  if (!frame) return <div className="h-40" />;
  if (frame.kind === "fib-memo") return <FibMemoViz f={frame} />;
  if (frame.kind === "fib-tab") return <ArrayDpViz dp={frame.dp} highlight={frame.i} label="dp" />;
  if (frame.kind === "stairs")
    return <ArrayDpViz dp={frame.dp} highlight={frame.i} label="dp" />;
  return <CoinViz f={frame} />;
}

function FibMemoViz({ f }: { f: FibMemoFrame }) {
  const keys = Object.keys(f.cache)
    .map((k) => parseInt(k, 10))
    .sort((a, b) => a - b);
  return (
    <div className="space-y-4">
      <div>
        <div className="mb-1 text-xs text-muted-foreground">Call stack (top = current)</div>
        <div className="flex min-h-[38px] flex-wrap items-center gap-2 rounded-md border border-border bg-background p-2">
          {f.stack.length === 0 ? (
            <span className="text-xs text-muted-foreground">empty</span>
          ) : (
            f.stack.map((v, i) => (
              <span
                key={i}
                className={`rounded-md px-2.5 py-1 font-mono text-sm ${
                  i === f.stack.length - 1
                    ? "bg-[color:var(--brand)]/20 text-[color:var(--brand)]"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                fib({v})
              </span>
            ))
          )}
        </div>
      </div>
      <div>
        <div className="mb-1 text-xs text-muted-foreground">
          Memo cache ({keys.length} entries)
        </div>
        <div className="grid gap-2 sm:grid-cols-4 md:grid-cols-6">
          {keys.length === 0 && (
            <div className="col-span-full text-xs text-muted-foreground">empty</div>
          )}
          {keys.map((k) => {
            const isHit = f.cacheHit && f.arg === k;
            const isWrite = f.write && f.arg === k;
            return (
              <div
                key={k}
                className={`rounded-md border px-2 py-1.5 font-mono text-xs transition ${
                  isHit
                    ? "border-amber-500/60 bg-amber-500/10 text-amber-600"
                    : isWrite
                      ? "border-sky-500/60 bg-sky-500/10 text-sky-600"
                      : "border-border bg-background"
                }`}
              >
                fib({k}) = {f.cache[k]}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ArrayDpViz({
  dp,
  highlight,
  label,
}: {
  dp: number[];
  highlight: number;
  label: string;
}) {
  return (
    <div>
      <div className="mb-1 text-xs text-muted-foreground">
        {label} table ({dp.length} cells)
      </div>
      <div className="flex flex-wrap gap-1.5">
        {dp.map((v, i) => (
          <div key={i} className="flex flex-col items-center gap-0.5">
            <div className="text-[10px] text-muted-foreground">{i}</div>
            <div
              className={`grid h-10 min-w-[42px] place-items-center rounded-md border font-mono text-sm transition ${
                i === highlight
                  ? "border-[color:var(--brand)] bg-[color:var(--brand)]/15 text-[color:var(--brand)]"
                  : "border-border bg-background text-foreground"
              }`}
            >
              {v}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CoinViz({ f }: { f: CoinFrame }) {
  const INF = f.amount + 1;
  return (
    <div className="space-y-4">
      <div>
        <div className="mb-1 text-xs text-muted-foreground">
          Coins {f.c !== undefined && <span className="text-[color:var(--brand)]">(trying {f.c})</span>}
        </div>
        <div className="flex flex-wrap gap-2">
          {f.coins.map((c, i) => (
            <span
              key={i}
              className={`rounded-md border px-3 py-1 font-mono text-sm ${
                c === f.c
                  ? "border-amber-500 bg-amber-500/10 text-amber-600"
                  : "border-border bg-background text-muted-foreground"
              }`}
            >
              {c}
            </span>
          ))}
        </div>
      </div>
      <div>
        <div className="mb-1 text-xs text-muted-foreground">
          dp table (target amount = {f.amount})
        </div>
        <div className="flex flex-wrap gap-1.5">
          {f.dp.map((v, i) => (
            <div key={i} className="flex flex-col items-center gap-0.5">
              <div className="text-[10px] text-muted-foreground">{i}</div>
              <div
                className={`grid h-10 min-w-[42px] place-items-center rounded-md border font-mono text-xs transition ${
                  i === f.a
                    ? "border-[color:var(--brand)] bg-[color:var(--brand)]/15 text-[color:var(--brand)]"
                    : "border-border bg-background text-foreground"
                }`}
              >
                {v >= INF ? "∞" : v}
              </div>
            </div>
          ))}
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
  if (frame.kind === "fib-memo") {
    rows.push({ label: "n", value: frame.n });
    rows.push({ label: "Calls", value: frame.calls });
    rows.push({ label: "Cache hits", value: frame.hits });
    rows.push({ label: "Cache size", value: Object.keys(frame.cache).length });
    rows.push({ label: "Stack depth", value: frame.stack.length });
  } else if (frame.kind === "fib-tab") {
    rows.push({ label: "n", value: frame.n });
    rows.push({ label: "i", value: frame.i });
    rows.push({ label: "dp[i]", value: frame.dp[frame.i] ?? "—" });
  } else if (frame.kind === "stairs") {
    rows.push({ label: "n", value: frame.n });
    rows.push({ label: "i", value: frame.i });
    rows.push({ label: "Ways so far", value: frame.dp[frame.i] ?? "—" });
  } else {
    const INF = frame.amount + 1;
    rows.push({ label: "Amount", value: frame.amount });
    rows.push({ label: "Sub-amount a", value: frame.a });
    rows.push({
      label: `dp[${frame.a}]`,
      value: frame.dp[frame.a] >= INF ? "∞" : frame.dp[frame.a],
    });
    rows.push({
      label: `dp[${frame.amount}]`,
      value: frame.dp[frame.amount] >= INF ? "∞" : frame.dp[frame.amount],
    });
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
