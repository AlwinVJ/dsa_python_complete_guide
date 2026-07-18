import { useState, useEffect } from "react";
import { PRESETS } from "./presets";
import { Node, Edge } from "./types";
import { validateAndParseGraph, GraphValidator } from "./GraphValidator";
import { RefreshCcw, Save, Trash2 } from "lucide-react";

interface PresetLoaderProps {
  algoKey: string;
  directed: boolean;
  weighted: boolean;
  onGraphLoad: (nodes: Node[], edges: Edge[], directed: boolean, weighted: boolean, isPreset: boolean) => void;
}

interface SavedGraph {
  name: string;
  nodes: Node[];
  edges: Edge[];
  directed: boolean;
  weighted: boolean;
}

const STORAGE_KEY = "dsa_playground_custom_graphs";

export function PresetLoader({
  algoKey,
  directed,
  weighted,
  onGraphLoad,
}: PresetLoaderProps) {
  // Custom text input state
  const [customInput, setCustomInput] = useState("A-B:4, A-D:2, B-C:3");
  const [errors, setErrors] = useState<string[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);

  // Saved graphs states
  const [savedGraphs, setSavedGraphs] = useState<SavedGraph[]>([]);
  const [newGraphName, setNewGraphName] = useState("");

  // Load saved graphs on mount
  useEffect(() => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        setSavedGraphs(JSON.parse(data));
      }
    } catch (e) {
      console.error("Failed to load saved graphs", e);
    }
  }, []);

  // Filter presets compatible with current algorithm
  const compatiblePresets = PRESETS.filter((p) => p.compatibleAlgos.includes(algoKey));

  // Run validation on custom graph string
  const handleValidateAndLoad = () => {
    const res = validateAndParseGraph(customInput, directed, weighted, algoKey);
    setErrors(res.errors);
    setWarnings(res.warnings);

    if (res.valid && res.parsed) {
      onGraphLoad(res.parsed.nodes, res.parsed.edges, directed, weighted, false);
    }
  };

  // Generate a random graph matching current settings
  const handleRandomGen = () => {
    const numNodes = 5 + Math.floor(Math.random() * 4); // 5 to 8 nodes
    const nodes: Node[] = [];
    for (let i = 0; i < numNodes; i++) {
      nodes.push({
        id: i,
        label: String.fromCharCode(65 + i),
      });
    }

    const edges: Edge[] = [];
    const density = 0.45;

    for (let i = 0; i < numNodes; i++) {
      for (let j = i + 1; j < numNodes; j++) {
        if (Math.random() < density) {
          let w = 1;
          if (weighted) {
            w = 1 + Math.floor(Math.random() * 8); // 1-8
            if ((algoKey === "bellman-ford" || algoKey === "floyd-warshall") && Math.random() < 0.25) {
              w = -2; // occasionally negative weights
            }
          }

          if (directed) {
            if (Math.random() < 0.5) {
              edges.push({ u: i, v: j, w });
            } else {
              edges.push({ u: j, v: i, w });
            }
          } else {
            edges.push({ u: i, v: j, w });
          }
        }
      }
    }

    // Force DAG for Topological Sort
    if (algoKey === "topo-sort") {
      const dagEdges = edges.map((e) => (e.u > e.v ? { u: e.v, v: e.u, w: e.w } : e));
      const seen = new Set<string>();
      const uniqueEdges: Edge[] = [];
      dagEdges.forEach((e) => {
        const k = `${e.u}->${e.v}`;
        if (!seen.has(k)) {
          seen.add(k);
          uniqueEdges.push(e);
        }
      });
      onGraphLoad(nodes, uniqueEdges, directed, weighted, false);
      
      // Update text input to reflect random graph
      const customStr = uniqueEdges.map((e) => `${nodes[e.u].label}-${nodes[e.v].label}${weighted ? `:${e.w}` : ""}`).join(", ");
      setCustomInput(customStr || "A-B");
      setErrors([]);
      setWarnings([]);
      return;
    }

    // Ensure connectivity for undirected graphs
    if (!directed) {
      const parent = Array.from({ length: numNodes }, (_, idx) => idx);
      const find = (x: number): number => {
        let curr = x;
        while (parent[curr] !== curr) curr = parent[curr];
        return curr;
      };
      const union = (x: number, y: number) => {
        const rx = find(x);
        const ry = find(y);
        if (rx !== ry) parent[rx] = ry;
      };

      edges.forEach((e) => union(e.u, e.v));

      const root0 = find(0);
      for (let i = 1; i < numNodes; i++) {
        if (find(i) !== root0) {
          const w = weighted ? 1 + Math.floor(Math.random() * 8) : 1;
          edges.push({ u: 0, v: i, w });
          union(0, i);
        }
      }
    }

    onGraphLoad(nodes, edges, directed, weighted, false);

    // Update text input to reflect random graph
    const customStr = edges.map((e) => `${nodes[e.u].label}-${nodes[e.v].label}${weighted ? `:${e.w}` : ""}`).join(", ");
    setCustomInput(customStr || "A-B");
    setErrors([]);
    setWarnings([]);
  };

  // Save current custom graph to browser storage
  const handleSaveGraph = () => {
    if (!newGraphName.trim()) return;
    
    // Parse current input to get nodes and edges
    const res = validateAndParseGraph(customInput, directed, weighted, algoKey);
    if (!res.valid || !res.parsed) {
      alert("Cannot save graph: Current input is invalid. Please fix validation errors first.");
      return;
    }

    const newGraph: SavedGraph = {
      name: newGraphName.trim(),
      nodes: res.parsed.nodes,
      edges: res.parsed.edges,
      directed,
      weighted,
    };

    const updated = [...savedGraphs, newGraph];
    setSavedGraphs(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setNewGraphName("");
  };

  // Delete saved graph from local storage
  const handleDeleteGraph = (idx: number) => {
    const updated = savedGraphs.filter((_, i) => i !== idx);
    setSavedGraphs(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  // Load a saved graph
  const handleLoadSavedGraph = (g: SavedGraph) => {
    onGraphLoad(g.nodes, g.edges, g.directed, g.weighted, false);
    const customStr = g.edges.map((e) => `${g.nodes[e.u].label}-${g.nodes[e.v].label}${g.weighted ? `:${e.w}` : ""}`).join(", ");
    setCustomInput(customStr || "A-B");
    setErrors([]);
    setWarnings([]);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* 1. Presets Selector */}
      <div className="card-surface p-4">
        <h3 className="text-sm font-semibold mb-2">Algorithm Presets</h3>
        <p className="text-xs text-muted-foreground mb-3">
          Select an educational preset graph tailored for this algorithm.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {compatiblePresets.map((p) => (
            <button
              key={p.id}
              onClick={() => onGraphLoad(p.nodes, p.edges, p.directed, p.weighted, true)}
              className="flex flex-col text-left rounded-md border border-border p-2.5 hover:bg-accent transition"
            >
              <span className="text-xs font-semibold text-foreground">{p.name}</span>
              <span className="text-[10px] text-muted-foreground leading-normal mt-0.5">
                {p.description}
              </span>
            </button>
          ))}
          {compatiblePresets.length === 0 && (
            <span className="text-xs text-muted-foreground italic">No presets available</span>
          )}
        </div>
      </div>

      {/* 2. Custom Graph Input & Validation */}
      <div className="card-surface p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Custom Graph Input</h3>
          <button
            onClick={handleRandomGen}
            className="inline-flex items-center gap-1 rounded border border-border bg-card px-2 py-1 text-xs hover:bg-accent"
          >
            <RefreshCcw className="h-3 w-3" /> Random Graph
          </button>
        </div>
        <p className="text-xs text-muted-foreground leading-normal">
          Enter a list of edges, comma or newline separated. Syntax:{" "}
          <code className="font-mono text-[10px] bg-muted px-1 py-0.5 rounded">A-B:4</code> or{" "}
          <code className="font-mono text-[10px] bg-muted px-1 py-0.5 rounded">A B 4</code>.
        </p>

        <textarea
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          className="h-20 w-full rounded border border-border bg-background p-2 font-mono text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          placeholder="e.g. A-B:4, B-C:3"
        />

        <div className="flex items-center gap-2">
          <button
            onClick={handleValidateAndLoad}
            className="rounded gradient-brand px-3 py-1.5 text-xs font-medium text-primary-foreground"
          >
            Validate & Load Graph
          </button>
        </div>

        <GraphValidator errors={errors} warnings={warnings} />
      </div>

      {/* 3. Browser Local Storage Save/Load */}
      <div className="card-surface p-4 flex flex-col gap-3">
        <h3 className="text-sm font-semibold">Saved Graphs</h3>
        <p className="text-xs text-muted-foreground">
          Store your custom graphs in browser local storage for future runs.
        </p>

        {/* Save Current */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Graph name..."
            value={newGraphName}
            onChange={(e) => setNewGraphName(e.target.value)}
            className="flex-1 rounded border border-border bg-background px-2.5 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <button
            onClick={handleSaveGraph}
            disabled={!newGraphName.trim()}
            className="inline-flex items-center gap-1 rounded border border-border bg-card px-3 py-1 text-xs hover:bg-accent disabled:opacity-50"
          >
            <Save className="h-3.5 w-3.5" /> Save
          </button>
        </div>

        {/* Saved List */}
        <div className="flex flex-col gap-1.5 max-h-40 overflow-y-auto pt-1">
          {savedGraphs.length === 0 ? (
            <span className="text-xs text-muted-foreground italic">No saved graphs</span>
          ) : (
            savedGraphs.map((g, idx) => (
              <div
                key={`saved-${idx}`}
                className="flex items-center justify-between rounded border border-border/60 bg-muted/20 p-2 text-xs"
              >
                <div className="flex flex-col text-left">
                  <span className="font-semibold text-foreground">{g.name}</span>
                  <span className="text-[9px] text-muted-foreground">
                    {g.nodes.length} V, {g.edges.length} E • {g.directed ? "Directed" : "Undirected"}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleLoadSavedGraph(g)}
                    className="rounded border border-border bg-card px-2 py-0.5 text-[10px] font-medium hover:bg-accent"
                  >
                    Load
                  </button>
                  <button
                    onClick={() => handleDeleteGraph(idx)}
                    className="text-red-500 hover:text-red-600 p-1"
                    title="Delete saved graph"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
