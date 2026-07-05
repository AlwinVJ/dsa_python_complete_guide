import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { PageShell, PageHeader, ComplexityBadge } from "@/components/Callout";
import { Legend } from "@/components/ListVisualizer";
import { CodeBlock } from "@/components/CodeBlock";
import { ALGORITHMS } from "@/lib/searching";
import { Play, Pause, RotateCcw, Shuffle, StepForward, StepBack, BookOpen, Settings2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const Route = createFileRoute("/playgrounds/searching")({
  head: () => ({
    meta: [
      { title: "Searching Playground — DSA with Python" },
      { name: "description", content: "Interactive lab for 6 searching algorithms — animations, stats, controls, and Python code side by side." },
    ],
  }),
  component: Page,
});

const defaultArray = [5, 12, 15, 23, 38, 42, 50, 64, 78, 85, 92, 100];

function Page() {
  const [algoId, setAlgoId] = useState("linear");
  const [customArrayStr, setCustomArrayStr] = useState("5, 12, 15, 23, 38, 42, 50, 64, 78, 85, 92, 100");
  const [targetVal, setTargetVal] = useState("42");
  const [speed, setSpeed] = useState(150);
  const [running, setRunning] = useState(false);
  const [step, setStep] = useState(0);
  const [seed, setSeed] = useState(0);
  const [arrayInputMode, setArrayInputMode] = useState<"random" | "custom">("random");
  const [size, setSize] = useState(12);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Generate random array
  const randomArray = (n: number) => {
    const arr = Array.from({ length: n }, () => Math.floor(Math.random() * 95) + 5);
    if (algoId !== "linear") {
      arr.sort((a, b) => a - b);
    }
    return arr;
  };

  const array = useMemo(() => {
    if (arrayInputMode === "custom") {
      const parsed = customArrayStr
        .split(",")
        .map((x) => parseInt(x.trim(), 10))
        .filter((x) => !isNaN(x));
      if (parsed.length === 0) return defaultArray;
      if (algoId !== "linear") {
        parsed.sort((a, b) => a - b);
      }
      return parsed;
    }
    return randomArray(size);
  }, [arrayInputMode, customArrayStr, size, seed, algoId]);

  const algo = ALGORITHMS.find((a) => a.id === algoId)!;

  const target = useMemo(() => {
    const num = parseInt(targetVal, 10);
    return isNaN(num) ? 42 : num;
  }, [targetVal]);

  const steps = useMemo(() => {
    return algo.generate(array, target);
  }, [algo, array, target]);

  useEffect(() => {
    setStep(0);
    setRunning(false);
  }, [algoId, arrayInputMode, customArrayStr, size, seed, targetVal]);

  useEffect(() => {
    if (!running) {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
      return;
    }
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
    };
  }, [running, speed, steps.length]);

  const currentStep = steps[Math.min(step, steps.length - 1)] || { array };

  // Calculate live stats
  const stats = useMemo(() => {
    let comparisons = 0;
    for (let i = 0; i <= Math.min(step, steps.length - 1); i++) {
      const s = steps[i];
      if (s && s.compare && s.compare.length > 0) {
        // Linear or binary index inspections
        comparisons++;
      }
    }
    return { comparisons };
  }, [step, steps]);

  const currentInterval = useMemo(() => {
    const visitedSet = new Set(currentStep.visited ?? []);
    let firstActive = -1;
    let lastActive = -1;
    for (let k = 0; k < array.length; k++) {
      if (!visitedSet.has(k)) {
        if (firstActive === -1) firstActive = k;
        lastActive = k;
      }
    }
    if (firstActive === -1) return "None";
    return `[${firstActive}..${lastActive}] (Size: ${lastActive - firstActive + 1})`;
  }, [currentStep, array.length]);

  return (
    <PageShell>
      <PageHeader
        eyebrow="Playground"
        title="Searching Playground"
        description="An interactive visual lab to step through searching algorithms. Pick an algorithm, adjust the target value, set the array, and inspect comparison bounds in real-time."
      />

      {/* Algorithm selector */}
      <div className="mb-4">
        <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Algorithm</div>
        <div className="flex flex-wrap gap-2">
          {ALGORITHMS.map((a) => (
            <button
              key={a.id}
              onClick={() => {
                setAlgoId(a.id);
                setStep(0);
                setRunning(false);
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

      {/* Controls & Inputs Panel */}
      <div className="card-surface mb-6 p-4 space-y-4">
        {/* Row 1: Animation Controls */}
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
            }}
            className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-3 py-1.5 text-sm hover:bg-accent"
          >
            <RotateCcw className="h-4 w-4" /> Reset
          </button>
          <label className="flex items-center gap-2 text-xs text-muted-foreground ml-auto">
            Speed
            <input
              type="range"
              min={50}
              max={1000}
              value={1050 - speed}
              onChange={(e) => setSpeed(1050 - Number(e.target.value))}
              className="w-24"
            />
          </label>
        </div>

        <div className="h-px bg-border/60" />

        {/* Row 2: Array & Target Configuration */}
        <div className="flex flex-wrap items-end gap-4 text-xs">
          {/* Target */}
          <div className="flex flex-col gap-1.5">
            <span className="font-semibold text-muted-foreground">Target value</span>
            <input
              type="number"
              value={targetVal}
              onChange={(e) => setTargetVal(e.target.value)}
              className="w-20 rounded-md border border-border bg-card px-2.5 py-1.5 font-mono text-sm focus:border-[color:var(--brand)] focus:outline-none"
            />
          </div>

          {/* Array Input Mode Selector */}
          <div className="flex flex-col gap-1.5">
            <span className="font-semibold text-muted-foreground">Array Input Mode</span>
            <div className="flex rounded-md border border-border overflow-hidden bg-card">
              <button
                onClick={() => setArrayInputMode("random")}
                className={`px-3 py-1.5 font-medium transition ${
                  arrayInputMode === "random"
                    ? "bg-accent text-accent-foreground font-semibold"
                    : "text-muted-foreground hover:bg-accent/40"
                }`}
              >
                Random
              </button>
              <button
                onClick={() => setArrayInputMode("custom")}
                className={`px-3 py-1.5 font-medium transition ${
                  arrayInputMode === "custom"
                    ? "bg-accent text-accent-foreground font-semibold"
                    : "text-muted-foreground hover:bg-accent/40"
                }`}
              >
                Custom List
              </button>
            </div>
          </div>

          {arrayInputMode === "random" ? (
            <>
              {/* Array Size */}
              <div className="flex flex-col gap-1.5">
                <span className="font-semibold text-muted-foreground">Array Size</span>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min={5}
                    max={25}
                    value={size}
                    onChange={(e) => setSize(Number(e.target.value))}
                    className="w-24"
                  />
                  <span className="font-mono text-sm">{size}</span>
                </div>
              </div>

              {/* Shuffle */}
              <button
                onClick={() => setSeed((s) => s + 1)}
                className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-3 py-2 hover:bg-accent font-medium h-9"
              >
                <Shuffle className="h-3.5 w-3.5" /> Re-Generate
              </button>
            </>
          ) : (
            /* Custom Array Input */
            <div className="flex-1 flex flex-col gap-1.5 min-w-[200px]">
              <span className="font-semibold text-muted-foreground">Enter numbers (comma-separated)</span>
              <input
                type="text"
                value={customArrayStr}
                onChange={(e) => setCustomArrayStr(e.target.value)}
                className="w-full rounded-md border border-border bg-card px-2.5 py-1.5 font-mono text-sm focus:border-[color:var(--brand)] focus:outline-none"
                placeholder="e.g. 3, 8, 12, 19, 24"
              />
            </div>
          )}
        </div>
      </div>

      {/* Visualizer Box */}
      <div className="card-surface p-6 flex flex-col gap-4">
        <div className="w-full overflow-x-auto py-4">
          <div className="inline-flex flex-col gap-2 min-w-full items-center">
            {/* Index row */}
            <div className="flex gap-2.5 justify-center">
              {array.map((_, i) => (
                <div key={i} className="w-12 text-center text-xs font-semibold text-muted-foreground/80">
                  {i}
                </div>
              ))}
            </div>

            {/* Boxes row */}
            <div className="flex gap-2.5 justify-center">
              <AnimatePresence initial={false}>
                {array.map((val, i) => {
                  const isVisited = currentStep.visited?.includes(i);
                  const isCurrent = currentStep.currentIndex === i;
                  const isCompare = currentStep.compare?.includes(i);
                  const isFound = currentStep.foundIndex === i;

                  let borderClass = "border-border bg-card text-foreground";
                  let extraStyle = "";

                  if (isFound) {
                    borderClass = "border-emerald-500 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold shadow-[0_0_0_2px_rgba(16,185,129,0.2)]";
                  } else if (isCurrent) {
                    borderClass = "border-[color:var(--brand)] bg-[color:var(--brand)]/15 text-[color:var(--brand)] font-bold shadow-[0_0_0_2px_rgba(244,63,94,0.2)]";
                  } else if (isCompare) {
                    borderClass = "border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold";
                  }

                  if (isVisited && !isFound && !isCurrent) {
                    extraStyle = "opacity-30 scale-95";
                  }

                  return (
                    <motion.div
                      key={`${i}-${val}`}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ type: "spring", stiffness: 350, damping: 28 }}
                      className={`w-12 h-12 flex items-center justify-center rounded-lg border font-mono text-sm shadow-sm transition-all duration-300 ${borderClass} ${extraStyle}`}
                    >
                      {val}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Legend & Instructions */}
        <div className="flex flex-wrap items-center gap-4 text-xs border-t border-border pt-4">
          <Legend
            items={[
              { color: "var(--brand)", label: "Current Index / mid" },
              { color: "rgb(245 158 11)", label: "Compared / boundaries" },
              { color: "rgb(16 185 129)", label: "Found" },
              { color: "rgba(100, 116, 139, 0.3)", label: "Ruled out (Visited)" },
            ]}
          />
          <div className="ml-auto font-medium text-muted-foreground italic">
            Step {step + 1} / {steps.length} {currentStep.note ? `· ${currentStep.note}` : ""}
          </div>
        </div>
      </div>

      {/* Live Statistics */}
      <div className="mt-6">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Statistics</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Current Algorithm" value={algo.name} />
          <Stat label="Comparisons" value={String(stats.comparisons)} />
          <Stat label="Active Search Interval" value={currentInterval} />
          <Stat label="Result" value={currentStep.foundIndex !== undefined ? `Found at index ${currentStep.foundIndex}` : currentStep.notFound ? "Not Found" : "Searching..."} />
          <div className="card-surface p-3">
            <div className="text-xs text-muted-foreground">Best Case</div>
            <div className="mt-1"><ComplexityBadge value={algo.timeBest} /></div>
          </div>
          <div className="card-surface p-3">
            <div className="text-xs text-muted-foreground">Average Case</div>
            <div className="mt-1"><ComplexityBadge value={algo.timeAvg} /></div>
          </div>
          <div className="card-surface p-3">
            <div className="text-xs text-muted-foreground">Worst Case</div>
            <div className="mt-1"><ComplexityBadge value={algo.timeWorst} /></div>
          </div>
          <div className="card-surface p-3">
            <div className="text-xs text-muted-foreground">Space Complexity</div>
            <div className="mt-1"><ComplexityBadge value={algo.space} /></div>
          </div>
        </div>
      </div>

      {/* Python implementation code */}
      <div className="mt-6">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Python Code</h3>
        <CodeBlock code={algo.code} title={`${algo.id}_search.py`} />
      </div>

      {/* Algorithm description card */}
      <div className="mt-6 card-surface p-4">
        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Algorithm Overview</h3>
        <p className="text-sm text-muted-foreground">{algo.description}</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div>
            <div className="mb-1 text-xs font-semibold text-[color:var(--good)]">Advantages</div>
            <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
              {algo.advantages.map((x) => <li key={x}>{x}</li>)}
            </ul>
          </div>
          <div>
            <div className="mb-1 text-xs font-semibold text-[color:var(--bad)]">Disadvantages</div>
            <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
              {algo.disadvantages.map((x) => <li key={x}>{x}</li>)}
            </ul>
          </div>
        </div>
      </div>

      {/* Related lessons */}
      <div className="mt-6 card-surface p-4">
        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Related Lessons</h3>
        <div className="flex flex-wrap gap-2">
          <Link
            to="/searching"
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-sm hover:bg-accent"
          >
            <BookOpen className="h-4 w-4" /> Searching Reference
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
      <div className="mt-1 font-mono text-sm font-semibold truncate text-foreground">{value}</div>
    </div>
  );
}
