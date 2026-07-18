import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { PageShell, PageHeader, Callout } from "@/components/Callout";
import { CodeViewer } from "@/components/CodeViewer";
import {
  PlaygroundBackButton,
  PlaygroundFooterNav,
} from "@/components/PlaygroundNav";

import { StringFrame } from "@/components/strings/playground/types";
import {
  ALGOS,
  AlgoKey,
  traceNaive,
  traceKMP,
  traceRabinKarp,
  traceZAlgo,
} from "@/components/strings/playground/algorithms";
import { StringRenderer } from "@/components/strings/playground/StringRenderer";
import { StringControls } from "@/components/strings/playground/StringControls";
import { GoalExplanationPanel } from "@/components/strings/playground/GoalExplanationPanel";
import { StatisticsPanel } from "@/components/strings/playground/StatisticsPanel";

export const Route = createFileRoute("/playgrounds/string-algorithms")({
  head: () => ({
    meta: [
      { title: "String Algorithms Playground — DSA with Python" },
      {
        name: "description",
        content:
          "Step through Naive Search, KMP, Rabin-Karp, and Z-Algorithm frame by frame — watch characters compare, hashes roll, and search arrays compute live.",
      },
      { property: "og:title", content: "String Algorithms Playground — DSA with Python" },
      {
        property: "og:description",
        content:
          "Interactive string algorithms visualizer showing prefix matches, Z-values, and rolling hash sliding windows.",
      },
    ],
  }),
  component: Page,
});

const COMING_SOON = [
  "Boyer-Moore",
  "Aho-Corasick",
  "Suffix Array",
  "Suffix Tree",
  "Rolling Hash Visualizer",
];

function Page() {
  const [algo, setAlgo] = useState<AlgoKey>("naive");
  const [text, setText] = useState("AABAACAADAABAAABDF");
  const [pattern, setPattern] = useState("AABA");

  // Playback state variables
  const [step, setStep] = useState(0);
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(700);

  const problem = useMemo(() => ALGOS.find((p) => p.id === algo)!, [algo]);

  // Compute search frames
  const frames = useMemo<StringFrame[]>(() => {
    if (!text || !pattern) return [];
    switch (algo) {
      case "naive":
        return traceNaive(text, pattern);
      case "kmp":
        return traceKMP(text, pattern);
      case "rabin-karp":
        return traceRabinKarp(text, pattern);
      case "z-algo":
        return traceZAlgo(text, pattern);
      default:
        return [];
    }
  }, [algo, text, pattern]);

  // Animation playback loop
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

  // Reset steps on settings changes
  useEffect(() => {
    setStep(0);
    setRunning(false);
  }, [algo, text, pattern]);

  const frame = frames[Math.min(step, frames.length - 1)];

  return (
    <PageShell>
      <PlaygroundBackButton playground="string-algorithms" />
      <PageHeader
        eyebrow="String Algorithms Playground"
        title="Slide, hash, match — live"
        description="Pick Naive, KMP, Rabin-Karp, or Z-Algorithm, adjust the text or pattern inputs, and step through character checks, sliding overlays, prefix failures, and rolling hash values."
      />

      <Callout kind="tip" title="Reading the visualization">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            The character cells under active check are highlighted in <span className="font-semibold text-amber-500">amber</span>.
          </li>
          <li>
            Confirmed matching indices turn <span className="font-semibold text-emerald-500">green</span>, while mismatching ones turn <span className="font-semibold text-red-500">red</span>.
          </li>
          <li>
            The <span className="font-semibold text-foreground">Timeline Scrubber</span> allows you to jump directly to shifts, hashes, or matches.
          </li>
        </ul>
      </Callout>

      {/* Configuration Toolbar */}
      <div className="card-surface mt-6 p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[240px]">
            <div className="mb-2 text-xs font-semibold text-muted-foreground uppercase">Algorithm</div>
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

      {/* Main visual arena */}
      <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* Left Side: String view and step summary */}
        <div className="card-surface p-4 flex flex-col justify-between">
          <div>
            <div className="mb-3 text-sm font-semibold flex items-center justify-between">
              <span>Matching Arena</span>
              <span className="text-xs text-muted-foreground font-mono">
                Text length: {text.length}, Pattern length: {pattern.length}
              </span>
            </div>
            <StringRenderer text={text} pattern={pattern} frame={frame} />
          </div>

          <div
            className={`mt-4 rounded-md border px-3 py-2.5 text-sm ${
              frame?.done
                ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold"
                : "border-border bg-muted/40 text-muted-foreground"
            }`}
          >
            {frame?.note ?? "Press Play/Next to begin."}
          </div>
        </div>

        {/* Right Side: Step Controls, Analysis & Live Metrics */}
        <div className="flex flex-col gap-4">
          <StringControls
            step={step}
            totalSteps={frames.length}
            running={running}
            speed={speed}
            text={text}
            pattern={pattern}
            onStepChange={setStep}
            onRunningToggle={() => setRunning(!running)}
            onSpeedChange={setSpeed}
            onTextChange={setText}
            onPatternChange={setPattern}
            onReset={() => {
              setStep(0);
              setRunning(false);
            }}
          />

          <GoalExplanationPanel frame={frame} />

          <div className="card-surface p-4">
            <StatisticsPanel frame={frame} textLength={text.length} patternLength={pattern.length} />
          </div>
        </div>
      </div>

      {/* Live Python Code Syncing */}
      <div className="mt-6">
        <CodeViewer
          code={problem.code}
          title={problem.fileName}
          activeLine={frame?.line}
          defaultExpanded
        />
      </div>

      {/* Educational info card */}
      <div className="mt-6 card-surface p-4">
        <div className="mb-2 text-sm font-semibold">About this algorithm</div>
        <p className="text-sm text-muted-foreground leading-relaxed">{problem.description}</p>
      </div>

      {/* More algorithms coming soon */}
      <div className="mt-6 card-surface p-4">
        <div className="mb-3 text-sm font-semibold">More String algorithms — coming soon</div>
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

      <PlaygroundFooterNav playground="string-algorithms" />
    </PageShell>
  );
}
