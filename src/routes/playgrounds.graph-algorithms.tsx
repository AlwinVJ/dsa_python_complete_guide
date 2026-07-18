import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { PageShell, PageHeader, Callout } from "@/components/Callout";
import { CodeViewer } from "@/components/CodeViewer";
import {
  PlaygroundBackButton,
  PlaygroundFooterNav,
} from "@/components/PlaygroundNav";

import { Node, Edge, BaseFrame } from "@/components/graphs/playground/types";
import { LayoutType } from "@/components/graphs/playground/layouts";
import {
  ALGOS,
  AlgoKey,
  traceBFS,
  traceDFS,
  traceDijkstra,
  traceBellmanFord,
  traceFloydWarshall,
  tracePrim,
  traceKruskal,
  traceTopoSort,
  traceUnionFind,
  traceSCC,
} from "@/components/graphs/playground/algorithms";
import { GraphRenderer } from "@/components/graphs/playground/GraphRenderer";
import { GraphControls } from "@/components/graphs/playground/GraphControls";
import { GoalExplanationPanel } from "@/components/graphs/playground/GoalExplanationPanel";
import { StatisticsPanel } from "@/components/graphs/playground/StatisticsPanel";
import { PresetLoader } from "@/components/graphs/playground/PresetLoader";

export const Route = createFileRoute("/playgrounds/graph-algorithms")({
  head: () => ({
    meta: [
      { title: "Graph Algorithms Playground — DSA with Python" },
      {
        name: "description",
        content:
          "Step through BFS, DFS, Dijkstra, Bellman-Ford, Floyd-Warshall, Prim, Kruskal, Topological Sort, Union-Find, and SCC frame by frame on an interactive graph.",
      },
      { property: "og:title", content: "Graph Algorithms Playground — DSA with Python" },
      {
        property: "og:description",
        content:
          "Interactive graph algorithms visualizer with dynamic layouts, live educational explanations, custom validation, and timeline scrubbing.",
      },
    ],
  }),
  component: Page,
});

// Nice default graph starting state
const DEFAULT_NODES: Node[] = [
  { id: 0, label: "A", x: 90, y: 80 },
  { id: 1, label: "B", x: 260, y: 60 },
  { id: 2, label: "C", x: 430, y: 100 },
  { id: 3, label: "D", x: 160, y: 220 },
  { id: 4, label: "E", x: 340, y: 220 },
  { id: 5, label: "F", x: 90, y: 360 },
  { id: 6, label: "G", x: 260, y: 380 },
  { id: 7, label: "H", x: 430, y: 340 },
];

const DEFAULT_EDGES: Edge[] = [
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

function Page() {
  const [algo, setAlgo] = useState<AlgoKey>("bfs");
  const [src, setSrc] = useState(0);

  // Graph state variables
  const [nodes, setNodes] = useState<Node[]>(DEFAULT_NODES);
  const [edges, setEdges] = useState<Edge[]>(DEFAULT_EDGES);
  const [directed, setDirected] = useState(false);
  const [weighted, setWeighted] = useState(false);

  // Layout and presets state
  const [layoutType, setLayoutType] = useState<LayoutType>("preset");
  const [isPreset, setIsPreset] = useState(true);

  // Playback state variables
  const [step, setStep] = useState(0);
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(700);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const problem = useMemo(() => ALGOS.find((p) => p.id === algo)!, [algo]);

  // Adjust directed/weighted flags based on active algorithm characteristics
  useEffect(() => {
    let newDirected = directed;
    let newWeighted = weighted;

    if (algo === "topo-sort" || algo === "scc") {
      newDirected = true;
    } else if (algo === "prim" || algo === "kruskal" || algo === "union-find") {
      newDirected = false;
    }

    if (
      algo === "dijkstra" ||
      algo === "bellman-ford" ||
      algo === "floyd-warshall" ||
      algo === "prim" ||
      algo === "kruskal"
    ) {
      newWeighted = true;
    } else {
      newWeighted = false;
    }

    setDirected(newDirected);
    setWeighted(newWeighted);
    setStep(0);
    setRunning(false);
  }, [algo]);

  // Trace the execution frames dynamically based on the current graph and settings
  const frames = useMemo<BaseFrame[]>(() => {
    if (nodes.length === 0) return [];
    
    // Ensure source vertex index is safe
    const activeSrc = src < nodes.length ? src : 0;

    switch (algo) {
      case "bfs":
        return traceBFS(nodes, edges, activeSrc, directed);
      case "dfs":
        return traceDFS(nodes, edges, activeSrc, directed);
      case "dijkstra":
        return traceDijkstra(nodes, edges, activeSrc, directed);
      case "bellman-ford":
        return traceBellmanFord(nodes, edges, activeSrc, directed);
      case "floyd-warshall":
        return traceFloydWarshall(nodes, edges, directed);
      case "prim":
        return tracePrim(nodes, edges, activeSrc, directed);
      case "kruskal":
        return traceKruskal(nodes, edges);
      case "topo-sort":
        return traceTopoSort(nodes, edges);
      case "union-find":
        return traceUnionFind(nodes, edges);
      case "scc":
        return traceSCC(nodes, edges);
      default:
        return [];
    }
  }, [algo, nodes, edges, src, directed, weighted]);

  // Handle animation timer loop
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

  // Reset step whenever algorithm or graph configuration updates
  useEffect(() => {
    setStep(0);
    setRunning(false);
  }, [algo, nodes, edges, src]);

  const frame = frames[Math.min(step, frames.length - 1)];
  const done = step >= frames.length - 1;
  const usesSource = ["bfs", "dfs", "dijkstra", "bellman-ford", "prim"].includes(algo);

  // Callback to load presets or custom input results
  const handleGraphLoad = (
    newNodes: Node[],
    newEdges: Edge[],
    newDirected: boolean,
    newWeighted: boolean,
    fromPreset: boolean
  ) => {
    setNodes(newNodes);
    setEdges(newEdges);
    setDirected(newDirected);
    setWeighted(newWeighted);
    setIsPreset(fromPreset);
    setLayoutType(fromPreset ? "preset" : "circular");
    setStep(0);
    setRunning(false);
    if (newNodes.length > 0) {
      setSrc(0);
    }
  };

  return (
    <PageShell>
      <PlaygroundBackButton playground="graph-algorithms" />
      <PageHeader
        eyebrow="Graph Algorithms Playground"
        title="Traverse, relax, converge — live"
        description="Pick any of the 10 core graph algorithms, explore presets, customize edges, and step through the execution with visual component maps, python trace syncing, and live educational annotations."
      />

      <Callout kind="tip" title="Interactive Tracing Features">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            The <span className="font-semibold text-foreground">current vertex</span> pulses in
            brand blue; <span className="font-semibold text-emerald-500">visited / finalized</span> items turn green.
          </li>
          <li>
            Use the <span className="font-semibold text-foreground">Timeline Scrubber</span> to drag, scrub, and replay specific steps instantly.
          </li>
          <li>
            Change <span className="font-semibold text-foreground">Layout Strategy</span> dynamically to view nodes in Circular, Grid, or Level-Tree formations.
          </li>
        </ul>
      </Callout>

      {/* Primary Configuration Toolbar */}
      <div className="card-surface mt-6 p-4">
        <div className="flex flex-wrap items-start gap-4">
          {/* Algorithm selector */}
          <div className="flex-1 min-w-[280px]">
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

          {/* Source vertex selector */}
          {usesSource && (
            <div className="min-w-[120px]">
              <div className="mb-2 text-xs font-semibold text-muted-foreground uppercase">Source vertex</div>
              <div className="flex flex-wrap gap-1">
                {nodes.map((n) => (
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
                {nodes.length === 0 && (
                  <span className="text-xs text-muted-foreground italic">No nodes</span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Execution Arena */}
      <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* Left Side: Graph SVG Renderer & Notes */}
        <div className="card-surface p-4 flex flex-col justify-between">
          <div>
            <div className="mb-3 text-sm font-semibold flex items-center justify-between">
              <span>Graph View ({layoutType.toUpperCase()})</span>
              <span className="text-xs text-muted-foreground font-mono">
                {nodes.length} nodes, {edges.length} edges
              </span>
            </div>
            <GraphRenderer
              nodes={nodes}
              edges={edges}
              directed={directed}
              weighted={weighted}
              layoutType={layoutType}
              frame={frame}
            />
          </div>

          <div
            className={`mt-4 rounded-md border px-3 py-2.5 text-sm ${
              frame?.done
                ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold"
                : "border-border bg-muted/40 text-muted-foreground"
            }`}
          >
            {frame?.note ?? "Select a source node and press Play/Next to begin."}
          </div>
        </div>

        {/* Right Side: Step Controls, Analysis & Live Metrics */}
        <div className="flex flex-col gap-4">
          <GraphControls
            step={step}
            totalSteps={frames.length}
            running={running}
            speed={speed}
            layoutType={layoutType}
            hasPreset={isPreset}
            onStepChange={setStep}
            onRunningToggle={() => setRunning(!running)}
            onSpeedChange={setSpeed}
            onLayoutTypeChange={setLayoutType}
            onReset={() => {
              setStep(0);
              setRunning(false);
            }}
          />

          <GoalExplanationPanel frame={frame} />
          
          <div className="card-surface p-4">
            <StatisticsPanel frame={frame} nodes={nodes} />
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

      {/* Preset Loading & Custom Graph Creator */}
      <div className="mt-6">
        <PresetLoader
          algoKey={algo}
          directed={directed}
          weighted={weighted}
          onGraphLoad={handleGraphLoad}
        />
      </div>

      <PlaygroundFooterNav playground="graph-algorithms" />
    </PageShell>
  );
}
