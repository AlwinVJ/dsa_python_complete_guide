import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { PageShell, PageHeader, Callout } from "@/components/Callout";
import { CodeViewer } from "@/components/CodeViewer";
import {
  PlaygroundBackButton,
  PlaygroundFooterNav,
} from "@/components/PlaygroundNav";

import { BitFrame } from "@/components/bits/playground/types";
import {
  ALGOS,
  AlgoKey,
  traceConverter,
  traceBitwise,
  traceShift,
  traceModify,
  tracePopcount,
  tracePower2,
  traceMask,
  traceSubsets,
} from "@/components/bits/playground/algorithms";
import { BitRenderer } from "@/components/bits/playground/BitRenderer";
import { BitControls } from "@/components/bits/playground/BitControls";
import { GoalExplanationPanel } from "@/components/bits/playground/GoalExplanationPanel";
import { StatisticsPanel } from "@/components/bits/playground/StatisticsPanel";

export const Route = createFileRoute("/playgrounds/bit-manipulation")({
  head: () => ({
    meta: [
      { title: "Bit Manipulation Playground — DSA with Python" },
      {
        name: "description",
        content:
          "Step through binary converter, logical operators, left/right shifts, bitmask modifications, popcount, and subset generation bit-by-bit.",
      },
      { property: "og:title", content: "Bit Manipulation Playground — DSA with Python" },
      {
        property: "og:description",
        content:
          "Interactive binary visualizer illustrating bitwise shifts, masks, and logical transitions.",
      },
    ],
  }),
  component: Page,
});

const COMING_SOON = [
  "Gray Code Generator",
  "Hamming Distance",
  "Bloom Filter Visualization",
  "Fast Exponentiation using Bits",
];

function Page() {
  const [algo, setAlgo] = useState<AlgoKey>("bitwise");
  const [valA, setValA] = useState(5);
  const [valB, setValB] = useState(3);
  const [opType, setOpType] = useState("AND");

  // Playback state variables
  const [step, setStep] = useState(0);
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(700);

  const problem = useMemo(() => ALGOS.find((p) => p.id === algo)!, [algo]);

  // Generate trace frames
  const frames = useMemo<BitFrame[]>(() => {
    switch (algo) {
      case "converter":
        return traceConverter(valA);
      case "bitwise":
        return traceBitwise(valA, valB, opType as any);
      case "shift":
        return traceShift(valA, valB, opType as any);
      case "modify":
        return traceModify(valA, valB, opType as any);
      case "popcount":
        return tracePopcount(valA);
      case "power2":
        return tracePower2(valA);
      case "mask":
        return traceMask(valA, valB, opType as any);
      case "subsets":
        return traceSubsets(["A", "B", "C"]);
      default:
        return [];
    }
  }, [algo, valA, valB, opType]);

  // Set default values when switching algorithms
  useEffect(() => {
    setStep(0);
    setRunning(false);
    
    // Choose appropriate default configurations
    if (algo === "converter") {
      setValA(13);
    } else if (algo === "bitwise") {
      setValA(5);
      setValB(3);
      setOpType("AND");
    } else if (algo === "shift") {
      setValA(6);
      setValB(2);
      setOpType("LEFT");
    } else if (algo === "modify") {
      setValA(13);
      setValB(2);
      setOpType("GET");
    } else if (algo === "popcount") {
      setValA(13);
    } else if (algo === "power2") {
      setValA(8);
    } else if (algo === "mask") {
      setValA(13);
      setValB(6);
      setOpType("UNION");
    }
  }, [algo]);

  // Reset steps when input values change
  useEffect(() => {
    setStep(0);
    setRunning(false);
  }, [valA, valB, opType]);

  // Animation loop
  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      setStep((s) => {
        if (s >= frames.length - 1) {
          setRunning(false);
          return s;
        }
        return s + 1;
      });
    }, speed);
    return () => clearInterval(interval);
  }, [running, speed, frames.length]);

  const frame = frames[Math.min(step, frames.length - 1)];

  return (
    <PageShell>
      <PlaygroundBackButton playground="bit-manipulation" />
      <PageHeader
        eyebrow="Bit Manipulation Playground"
        title="Bit-twiddling and binary shifts"
        description="Interact with binary conversions, standard logical gates (AND/OR/XOR/NOT), shifts, bit modifying masks, popcount, and subsets. Tweak decimal registers to watch bits toggle."
      />

      <Callout kind="tip" title="Reading the visualizer">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            Set bits (1) are colored in <span className="font-semibold text-[color:var(--brand)]">brand outlines</span>.
          </li>
          <li>
            The specific bit position under active check is outlined with a thick <span className="font-semibold text-amber-500">amber border</span>.
          </li>
          <li>
            Calculated or updated result bits are highlighted in <span className="font-semibold text-emerald-500">green</span>.
          </li>
        </ul>
      </Callout>

      {/* Selector panel */}
      <div className="card-surface mt-6 p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[240px]">
            <div className="mb-2 text-xs font-semibold text-muted-foreground uppercase">Operation Type</div>
            <div className="flex flex-wrap gap-1.5">
              {ALGOS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setAlgo(p.id)}
                  className={`rounded-full border px-3 py-1 text-xs transition font-semibold ${
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
        </div>
      </div>

      {/* Main visualization grid */}
      <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* Left: SVG Bit Viewer */}
        <div className="card-surface p-4 flex flex-col justify-between">
          <div>
            <div className="mb-3 text-sm font-semibold flex items-center justify-between">
              <span>Bit Register Arena</span>
              <span className="text-xs text-muted-foreground font-mono">
                8-bit representation (signed limit: 255)
              </span>
            </div>
            <BitRenderer frame={frame} />
          </div>

          <div
            className={`mt-4 rounded-md border px-3 py-2.5 text-sm ${
              frame?.done
                ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold"
                : "border-border bg-muted/40 text-muted-foreground"
            }`}
          >
            {frame?.note ?? "Configure inputs and start execution."}
          </div>
        </div>

        {/* Right: Timeline controls, goal details, and live stats */}
        <div className="flex flex-col gap-4">
          <BitControls
            algo={algo}
            step={step}
            totalSteps={frames.length}
            running={running}
            speed={speed}
            valA={valA}
            valB={valB}
            opType={opType}
            onStepChange={setStep}
            onRunningToggle={() => setRunning(!running)}
            onSpeedChange={setSpeed}
            onValAChange={setValA}
            onValBChange={setValB}
            onOpTypeChange={setOpType}
            onReset={() => {
              setStep(0);
              setRunning(false);
            }}
          />

          <GoalExplanationPanel frame={frame} />

          <div className="card-surface p-4">
            <StatisticsPanel frame={frame} />
          </div>
        </div>
      </div>

      {/* Live Python code sync */}
      <div className="mt-6">
        <CodeViewer
          code={problem.code}
          title={problem.fileName}
          activeLine={frame?.line}
          defaultExpanded
        />
      </div>

      {/* About operation explanation card */}
      <div className="mt-6 card-surface p-4">
        <div className="mb-2 text-sm font-semibold">About this operation</div>
        <p className="text-sm text-muted-foreground leading-relaxed">{problem.description}</p>
      </div>

      {/* Advanced operators coming soon */}
      <div className="mt-6 card-surface p-4">
        <div className="mb-3 text-sm font-semibold">Advanced Bit Manipulation — coming soon</div>
        <div className="flex flex-wrap gap-2">
          {COMING_SOON.map((label) => (
            <span
              key={label}
              className="rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-xs text-amber-500 font-medium"
            >
              {label}
            </span>
          ))}
        </div>
      </div>

      <PlaygroundFooterNav playground="bit-manipulation" />
    </PageShell>
  );
}
