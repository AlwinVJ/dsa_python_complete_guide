import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageShell, PageHeader, Callout } from "@/components/Callout";
import { CodeViewer } from "@/components/CodeViewer";
import { Play, Pause, RotateCcw, StepForward, StepBack, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/playgrounds/recursion")({
  head: () => ({
    meta: [
      { title: "Recursion Playground — DSA with Python" },
      {
        name: "description",
        content:
          "Interactive recursion visualizer — step through the call stack for factorial, Fibonacci, power, GCD, and more.",
      },
      { property: "og:title", content: "Recursion Playground — DSA with Python" },
      {
        property: "og:description",
        content:
          "Watch stack frames get pushed and popped as recursive functions execute step by step.",
      },
    ],
  }),
  component: Page,
});

/* ---------- Frame model ---------- */
type Frame = {
  id: number;
  label: string; // e.g. "factorial(3)"
  status: "calling" | "base" | "returned";
  returnValue?: number | string;
  detail?: string;
};

type StepEvent =
  | { kind: "call"; frame: Frame }
  | { kind: "return"; id: number; value: number | string; detail?: string };

type Problem = {
  id: string;
  name: string;
  description: string;
  code: string;
  defaultInput: number;
  minInput: number;
  maxInput: number;
  build: (input: number) => StepEvent[];
};

/* ---------- Recursive traces ---------- */
let uid = 0;
const nextId = () => ++uid;

function traceFactorial(n: number): StepEvent[] {
  const events: StepEvent[] = [];
  function run(k: number): number {
    const id = nextId();
    events.push({
      kind: "call",
      frame: { id, label: `factorial(${k})`, status: k <= 1 ? "base" : "calling" },
    });
    if (k <= 1) {
      events.push({ kind: "return", id, value: 1, detail: "base case" });
      return 1;
    }
    const sub = run(k - 1);
    const result = k * sub;
    events.push({ kind: "return", id, value: result, detail: `${k} × ${sub}` });
    return result;
  }
  run(n);
  return events;
}

function traceFibonacci(n: number): StepEvent[] {
  const events: StepEvent[] = [];
  function run(k: number): number {
    const id = nextId();
    events.push({
      kind: "call",
      frame: { id, label: `fib(${k})`, status: k < 2 ? "base" : "calling" },
    });
    if (k < 2) {
      events.push({ kind: "return", id, value: k, detail: "base case" });
      return k;
    }
    const a = run(k - 1);
    const b = run(k - 2);
    const r = a + b;
    events.push({ kind: "return", id, value: r, detail: `${a} + ${b}` });
    return r;
  }
  run(n);
  return events;
}

function traceSum(n: number): StepEvent[] {
  const events: StepEvent[] = [];
  function run(k: number): number {
    const id = nextId();
    events.push({
      kind: "call",
      frame: { id, label: `sum(${k})`, status: k === 0 ? "base" : "calling" },
    });
    if (k === 0) {
      events.push({ kind: "return", id, value: 0, detail: "base case" });
      return 0;
    }
    const sub = run(k - 1);
    const r = k + sub;
    events.push({ kind: "return", id, value: r, detail: `${k} + ${sub}` });
    return r;
  }
  run(n);
  return events;
}

function tracePower(base: number, exp: number): StepEvent[] {
  const events: StepEvent[] = [];
  function run(b: number, e: number): number {
    const id = nextId();
    events.push({
      kind: "call",
      frame: { id, label: `power(${b}, ${e})`, status: e === 0 ? "base" : "calling" },
    });
    if (e === 0) {
      events.push({ kind: "return", id, value: 1, detail: "base case" });
      return 1;
    }
    const sub = run(b, e - 1);
    const r = b * sub;
    events.push({ kind: "return", id, value: r, detail: `${b} × ${sub}` });
    return r;
  }
  run(base, exp);
  return events;
}

function traceGcd(a: number, b: number): StepEvent[] {
  const events: StepEvent[] = [];
  function run(x: number, y: number): number {
    const id = nextId();
    events.push({
      kind: "call",
      frame: { id, label: `gcd(${x}, ${y})`, status: y === 0 ? "base" : "calling" },
    });
    if (y === 0) {
      events.push({ kind: "return", id, value: x, detail: "base case" });
      return x;
    }
    const sub = run(y, x % y);
    events.push({ kind: "return", id, value: sub });
    return sub;
  }
  run(a, b);
  return events;
}

const PROBLEMS: Problem[] = [
  {
    id: "factorial",
    name: "Factorial",
    description: "factorial(n) = n × factorial(n − 1), base case factorial(1) = 1.",
    defaultInput: 5,
    minInput: 0,
    maxInput: 8,
    code: `def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)`,
    build: (n) => {
      uid = 0;
      return traceFactorial(n);
    },
  },
  {
    id: "fibonacci",
    name: "Fibonacci",
    description: "Classic tree recursion — every call branches into two.",
    defaultInput: 5,
    minInput: 0,
    maxInput: 7,
    code: `def fib(n):
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)`,
    build: (n) => {
      uid = 0;
      return traceFibonacci(n);
    },
  },
  {
    id: "sum",
    name: "Sum of N",
    description: "sum(n) = n + sum(n − 1). A textbook reduce-by-one recursion.",
    defaultInput: 5,
    minInput: 0,
    maxInput: 10,
    code: `def sum_to(n):
    if n == 0:
        return 0
    return n + sum_to(n - 1)`,
    build: (n) => {
      uid = 0;
      return traceSum(n);
    },
  },
  {
    id: "power",
    name: "Power (base 2)",
    description: "power(2, n) — grows linearly with n.",
    defaultInput: 4,
    minInput: 0,
    maxInput: 8,
    code: `def power(b, e):
    if e == 0:
        return 1
    return b * power(b, e - 1)`,
    build: (n) => {
      uid = 0;
      return tracePower(2, n);
    },
  },
  {
    id: "gcd",
    name: "GCD (with 24)",
    description: "Euclid's algorithm: gcd(a, b) = gcd(b, a mod b). Base case b == 0.",
    defaultInput: 60,
    minInput: 1,
    maxInput: 200,
    code: `def gcd(a, b):
    if b == 0:
        return a
    return gcd(b, a % b)`,
    build: (n) => {
      uid = 0;
      return traceGcd(n, 24);
    },
  },
];

function Page() {
  const [problemId, setProblemId] = useState<string>(PROBLEMS[0].id);
  const problem = PROBLEMS.find((p) => p.id === problemId)!;
  const [input, setInput] = useState<number>(problem.defaultInput);
  const [step, setStep] = useState(0);
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(600);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const events = useMemo(() => problem.build(input), [problem, input]);

  // Reset step when problem or input changes
  useEffect(() => {
    setStep(0);
    setRunning(false);
  }, [problemId, input]);

  // Auto-run
  useEffect(() => {
    if (!running) return;
    timerRef.current = setInterval(() => {
      setStep((s) => {
        if (s >= events.length) {
          setRunning(false);
          return s;
        }
        return s + 1;
      });
    }, speed);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [running, speed, events.length]);

  // Rebuild the stack + return log up to the current step
  const { stack, returns, finalValue } = useMemo(() => {
    const stack: Frame[] = [];
    const returns: { label: string; value: number | string; detail?: string }[] = [];
    let finalValue: number | string | undefined;
    for (let i = 0; i < Math.min(step, events.length); i++) {
      const ev = events[i];
      if (ev.kind === "call") {
        stack.push({ ...ev.frame });
      } else {
        const idx = stack.findIndex((f) => f.id === ev.id);
        if (idx >= 0) {
          const [popped] = stack.splice(idx, 1);
          returns.push({
            label: popped.label,
            value: ev.value,
            detail: ev.detail,
          });
        }
        if (stack.length === 0) finalValue = ev.value;
      }
    }
    return { stack, returns, finalValue };
  }, [events, step]);

  const done = step >= events.length;

  return (
    <PageShell>
      <PageHeader
        eyebrow="Recursion Playground"
        title="Watch the call stack come alive"
        description="Pick a classic recursive problem, choose an input, and step through every call. Frames get pushed as calls happen and popped as they return."
      />

      <Callout kind="tip" title="Reading the visualization">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            Each rectangle in the stack panel is a{" "}
            <span className="font-semibold text-foreground">stack frame</span>.
          </li>
          <li>New calls are pushed on top; returns pop from the top.</li>
          <li>The return log on the right records every value flowing back up the tree.</li>
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
                  onClick={() => {
                    setProblemId(p.id);
                    setInput(p.defaultInput);
                  }}
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

          <div>
            <div className="mb-1 text-xs text-muted-foreground">
              Input (n = {input}) — max {problem.maxInput}
            </div>
            <input
              type="range"
              min={problem.minInput}
              max={problem.maxInput}
              value={input}
              onChange={(e) => setInput(parseInt(e.target.value, 10))}
              className="w-48 accent-[color:var(--brand)]"
            />
          </div>

          <div>
            <div className="mb-1 text-xs text-muted-foreground">
              Speed ({(1000 / speed).toFixed(1)} steps/s)
            </div>
            <input
              type="range"
              min={120}
              max={1400}
              value={1520 - speed}
              onChange={(e) => setSpeed(1520 - parseInt(e.target.value, 10))}
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
            onClick={() => setStep((s) => Math.min(events.length, s + 1))}
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
            Step {Math.min(step, events.length)} / {events.length}
          </div>
        </div>
      </div>

      {/* Visualization */}
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="card-surface p-4">
          <div className="mb-2 text-sm font-semibold">
            Call Stack{" "}
            <span className="ml-1 text-xs text-muted-foreground">
              (depth {stack.length})
            </span>
          </div>
          <div className="flex min-h-[280px] flex-col-reverse gap-1.5">
            <AnimatePresence initial={false}>
              {stack.map((f) => (
                <motion.div
                  key={f.id}
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  transition={{ duration: 0.18 }}
                  className={`rounded-md border px-3 py-2 text-sm font-mono ${
                    f.status === "base"
                      ? "border-amber-500/60 bg-amber-500/10"
                      : "border-[color:var(--brand)]/60 bg-[color:var(--brand)]/10"
                  }`}
                >
                  {f.label}
                  {f.status === "base" && (
                    <span className="ml-2 text-[10px] uppercase tracking-wider text-amber-600">
                      base
                    </span>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            {stack.length === 0 && (
              <div className="grid flex-1 place-items-center text-xs text-muted-foreground">
                {step === 0 ? "Press Play to start." : "Stack is empty — recursion complete."}
              </div>
            )}
          </div>
        </div>

        <div className="card-surface p-4">
          <div className="mb-2 text-sm font-semibold">Return Log</div>
          <div className="max-h-[280px] space-y-1 overflow-y-auto text-sm">
            {returns.length === 0 && (
              <div className="text-xs text-muted-foreground">No returns yet.</div>
            )}
            {returns.map((r, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded border border-border/60 bg-muted/40 px-2 py-1 font-mono text-xs"
              >
                <span className="text-muted-foreground">{r.label}</span>
                <span className="flex items-center gap-2">
                  {r.detail && (
                    <span className="text-[10px] text-muted-foreground">{r.detail}</span>
                  )}
                  <span className="text-[color:var(--brand)]">→ {String(r.value)}</span>
                </span>
              </div>
            ))}
          </div>
          {finalValue !== undefined && (
            <div className="mt-3 rounded-md border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-sm">
              <span className="font-semibold text-emerald-600">Final result:</span>{" "}
              <span className="font-mono">{String(finalValue)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Code + description */}
      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_1fr]">
        <div className="card-surface p-4">
          <div className="mb-2 text-sm font-semibold">About this problem</div>
          <p className="text-sm text-muted-foreground">{problem.description}</p>
          <p className="mt-3 text-xs text-muted-foreground">
            Total recursive calls for this input: <span className="font-mono">{events.length / 2}</span>.
          </p>
        </div>
        <CodeViewer code={problem.code} title={`${problem.id}.py`} />
      </div>

      <div className="mt-8 flex justify-center">
        <Link
          to="/learn/$course"
          params={{ course: "recursion" }}
          className="inline-flex items-center gap-1.5 rounded-md gradient-brand px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg hover:opacity-90 transition"
        >
          Back to Recursion module <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </PageShell>
  );
}
