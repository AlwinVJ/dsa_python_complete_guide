import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { PageShell, PageHeader, ComplexityBadge } from "@/components/Callout";
import { BarVisualizer, Legend } from "@/components/ListVisualizer";
import { CodeBlock } from "@/components/CodeBlock";
import { ALGORITHMS } from "@/lib/sorting";
import { Play, Pause, RotateCcw, Shuffle, StepForward, StepBack, BookOpen } from "lucide-react";

export const Route = createFileRoute("/playgrounds/sorting")({
  head: () => ({
    meta: [
      { title: "Sorting Playground — DSA with Python" },
      {
        name: "description",
        content:
          "Interactive lab for 11 sorting algorithms — animations, stats, controls, and Python code side by side.",
      },
    ],
  }),
  component: Page,
});

const randomArray = (n: number) =>
  Array.from({ length: n }, () => Math.floor(Math.random() * 90) + 5);

function Page() {
  const [algoId, setAlgoId] = useState("bubble");
  const [size, setSize] = useState(18);
  const [speed, setSpeed] = useState(80);
  const [running, setRunning] = useState(false);
  const [step, setStep] = useState(0);
  const [seed, setSeed] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const clockRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startedAt = useRef<number | null>(null);

  const array = useMemo(() => randomArray(size), [size, seed]);
  const algo = ALGORITHMS.find((a) => a.id === algoId)!;
  const steps = useMemo(() => algo.generate(array), [algo, array]);

  useEffect(() => {
    setStep(0);
    setElapsed(0);
  }, [algoId, size, seed]);

  useEffect(() => {
    if (!running) {
      if (timerRef.current) clearInterval(timerRef.current);
      if (clockRef.current) clearInterval(clockRef.current);
      timerRef.current = null;
      clockRef.current = null;
      if (startedAt.current) {
        setElapsed((e) => e + (performance.now() - startedAt.current!));
        startedAt.current = null;
      }
      return;
    }
    startedAt.current = performance.now();
    clockRef.current = setInterval(() => {
      if (startedAt.current) setElapsed((e) => e); // trigger re-render via tick below
    }, 100);
    timerRef.current = setInterval(() => {
      setStep((s) => {
        if (s >= steps.length - 1) {
          setRunning(false);
          return s;
        }
        return s + 1;
      });
    }, speed);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (clockRef.current) clearInterval(clockRef.current);
    };
  }, [running, speed, steps.length]);

  // Live tick for elapsed while running
  const [, force] = useState(0);
  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => force((n) => n + 1), 100);
    return () => clearInterval(t);
  }, [running]);

  const current = steps[Math.min(step, steps.length - 1)];

  // Stats up to current step
  const stats = useMemo(() => {
    let comparisons = 0,
      swaps = 0;
    for (let i = 0; i <= Math.min(step, steps.length - 1); i++) {
      const s = steps[i];
      if (s.compare && s.compare.length) comparisons++;
      if (s.highlight && s.highlight.length && s.note === "Swap") swaps++;
    }
    return { comparisons, swaps };
  }, [step, steps]);

  const liveElapsed =
    elapsed + (running && startedAt.current ? performance.now() - startedAt.current : 0);

  return (
    <PageShell>
      <PageHeader
        eyebrow="Playground"
        title="Sorting Playground"
        description="A standalone lab for experimenting with sorting algorithms. Pick an algorithm, tweak the array, and step through the animation."
      />

      {/* Algorithm selector */}
      <div className="mb-4">
        <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Algorithm
        </div>
        <div className="flex flex-wrap gap-2">
          {ALGORITHMS.map((a) => (
            <button
              key={a.id}
              onClick={() => {
                setAlgoId(a.id);
                setStep(0);
                setRunning(false);
                setElapsed(0);
              }}
              className={`rounded-full border px-3 py-1 text-xs transition ${
                a.id === algoId
                  ? "border-[color:var(--brand)] bg-[color:var(--brand)]/15 text-foreground"
                  : "border-border bg-card text-muted-foreground hover:bg-accent"
              }`}
            >
              {a.name}
            </button>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="card-surface mb-4 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setRunning((r) => !r)}
            className="inline-flex items-center gap-1.5 rounded-md gradient-brand px-3 py-1.5 text-sm text-primary-foreground"
          >
            {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {running ? "Pause" : step === 0 ? "Start" : "Resume"}
          </button>
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            className="rounded-md border border-border bg-card p-1.5 hover:bg-accent"
            aria-label="Step back"
          >
            <StepBack className="h-4 w-4" />
          </button>
          <button
            onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))}
            className="rounded-md border border-border bg-card p-1.5 hover:bg-accent"
            aria-label="Step forward"
          >
            <StepForward className="h-4 w-4" />
          </button>
          <button
            onClick={() => {
              setStep(0);
              setRunning(false);
              setElapsed(0);
            }}
            className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-3 py-1.5 text-sm hover:bg-accent"
          >
            <RotateCcw className="h-4 w-4" /> Reset
          </button>
          <button
            onClick={() => {
              setSeed((n) => n + 1);
              setRunning(false);
              setElapsed(0);
            }}
            className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-3 py-1.5 text-sm hover:bg-accent"
          >
            <Shuffle className="h-4 w-4" /> Generate Random Array
          </button>
          <label className="ml-2 flex items-center gap-2 text-xs text-muted-foreground">
            Array size
            <input
              type="range"
              min={5}
              max={40}
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="w-28"
            />
            <span className="font-mono">{size}</span>
          </label>
          <label className="flex items-center gap-2 text-xs text-muted-foreground">
            Speed
            <input
              type="range"
              min={10}
              max={400}
              value={410 - speed}
              onChange={(e) => setSpeed(410 - Number(e.target.value))}
              className="w-28"
            />
          </label>
        </div>
      </div>

      {/* Visualization */}
      <div className="card-surface p-4">
        <BarVisualizer
          values={current.array}
          highlight={current.highlight ?? []}
          compare={current.compare ?? []}
          sorted={current.sorted ?? []}
          max={100}
        />
        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
          <Legend
            items={[
              { color: "var(--brand)", label: "Active / swap" },
              { color: "var(--warn)", label: "Comparing" },
              { color: "var(--good)", label: "Sorted" },
            ]}
          />
          <div className="ml-auto text-xs text-muted-foreground">
            Step {step + 1} / {steps.length} {current.note ? `· ${current.note}` : ""}
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="mt-6">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Statistics
        </h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Current Algorithm" value={algo.name} />
          <Stat label="Comparisons" value={String(stats.comparisons)} />
          <Stat label="Swaps" value={String(stats.swaps)} />
          <Stat label="Elapsed Time" value={`${(liveElapsed / 1000).toFixed(1)}s`} />
          <div className="card-surface p-3">
            <div className="text-xs text-muted-foreground">Best</div>
            <div className="mt-1">
              <ComplexityBadge value={algo.timeBest} />
            </div>
          </div>
          <div className="card-surface p-3">
            <div className="text-xs text-muted-foreground">Average</div>
            <div className="mt-1">
              <ComplexityBadge value={algo.timeAvg} />
            </div>
          </div>
          <div className="card-surface p-3">
            <div className="text-xs text-muted-foreground">Worst</div>
            <div className="mt-1">
              <ComplexityBadge value={algo.timeWorst} />
            </div>
          </div>
          <div className="card-surface p-3">
            <div className="text-xs text-muted-foreground">Space</div>
            <div className="mt-1">
              <ComplexityBadge value={algo.space} />
            </div>
          </div>
        </div>
      </div>

      {/* Python code */}
      <div className="mt-6">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Python Code
        </h3>
        <CodeBlock code={algo.code} title={`${algo.id}.py`} />
      </div>

      {/* Explanation */}
      <div className="mt-6 card-surface p-4">
        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Algorithm Explanation
        </h3>
        <p className="text-sm text-muted-foreground">{algo.description}</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div>
            <div className="mb-1 text-xs font-semibold text-[color:var(--good)]">Advantages</div>
            <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
              {algo.advantages.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </div>
          <div>
            <div className="mb-1 text-xs font-semibold text-[color:var(--bad)]">Disadvantages</div>
            <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
              {algo.disadvantages.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Related lessons */}
      <div className="mt-6 card-surface p-4">
        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Related Lessons
        </h3>
        <div className="flex flex-wrap gap-2">
          <Link
            to="/learn/$course"
            params={{ course: "sorting-algorithms" }}
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-sm hover:bg-accent"
          >
            <BookOpen className="h-4 w-4" /> Sorting Algorithms Course
          </Link>
          <Link
            to="/sorting"
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-sm hover:bg-accent"
          >
            <BookOpen className="h-4 w-4" /> Sorting Reference
          </Link>
          <Link
            to="/complexity/time"
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-sm hover:bg-accent"
          >
            <BookOpen className="h-4 w-4" /> Time Complexity Cheat Sheet
          </Link>
        </div>
      </div>
    </PageShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="card-surface p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 font-mono text-lg">{value}</div>
    </div>
  );
}
