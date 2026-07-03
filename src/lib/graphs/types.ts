// Section-based content model for the Graphs course — mirrors the Trees
// architecture. Lessons render through a splat route at /graphs/<tier>/<slug>.

// ---------- Graph primitives shared by visualizers ----------
export type GNode = { id: string; label?: string; x?: number; y?: number };
export type GEdge = { from: string; to: string; weight?: number; label?: string };

export type GraphMode = "undirected" | "directed";

export type GraphSpec = {
  nodes: GNode[];
  edges: GEdge[];
  directed?: boolean;
  weighted?: boolean;
  /** Optional per-node color for illustrations. */
  colors?: Record<string, "default" | "brand" | "highlight" | "visited" | "muted" | "warn" | "good">;
  /** Highlight edges (e.g. tree edges after DFS). */
  highlightEdges?: string[]; // "u-v"
};

// ---------- Section variants ----------
export type GraphVizSec = { type: "graphViz"; spec: GraphSpec; caption?: string; minHeight?: number };
export type GraphPlaygroundSec = { type: "graphPlayground"; caption?: string; seed?: GraphSpec };
export type BFSPlayerSec = { type: "bfsPlayer"; spec: GraphSpec; start: string; caption?: string };
export type DFSPlayerSec = { type: "dfsPlayer"; spec: GraphSpec; start: string; caption?: string };

export type AdjMatrixVizSec = { type: "adjMatrixViz"; spec: GraphSpec; caption?: string };
export type AdjListVizSec = { type: "adjListViz"; spec: GraphSpec; caption?: string };
export type EdgeListVizSec = { type: "edgeListViz"; spec: GraphSpec; caption?: string };
export type IncidenceMatrixVizSec = { type: "incidenceMatrixViz"; spec: GraphSpec; caption?: string };
export type CsrVizSec = { type: "csrViz"; spec: GraphSpec; caption?: string };

export type DijkstraPlayerSec = { type: "dijkstraPlayer"; spec: GraphSpec; start: string; caption?: string };
export type BellmanFordPlayerSec = { type: "bellmanFordPlayer"; spec: GraphSpec; start: string; caption?: string };
export type PrimPlayerSec = { type: "primPlayer"; spec: GraphSpec; start: string; caption?: string };
export type KruskalPlayerSec = { type: "kruskalPlayer"; spec: GraphSpec; caption?: string };
export type TopoSortPlayerSec = { type: "topoSortPlayer"; spec: GraphSpec; caption?: string };
export type UnionFindPlaygroundSec = { type: "unionFindPlayground"; n?: number; caption?: string };

export type MemoryDiagramSec = {
  type: "memoryDiagram";
  rows: { label: string; value: string; note?: string }[];
  caption?: string;
};

// ---------- Reused primitives ----------
export type TTheory = { type: "theory"; text?: string; bullets?: string[] };
export type TCode = { type: "code"; code: string; title?: string; explanation?: string };
export type TDryRun = { type: "dryRun"; headers: string[]; rows: string[][]; caption?: string };
export type TComplexity = {
  type: "complexity";
  rows: { op: string; time: string; space?: string; note?: string }[];
};
export type TMistakes = { type: "mistakes"; items: string[] };
export type TTip = { type: "tip"; text: string; title?: string };
export type TCallout = {
  type: "callout";
  kind: "info" | "warn" | "perf" | "did" | "tip" | "interview";
  title?: string;
  text: string;
};
export type TQuizItem = { q: string; choices: string[]; answer: number; explain?: string };
export type TQuiz = { type: "quiz"; items: TQuizItem[] };
export type TPracticeItem = {
  title: string;
  url: string;
  difficulty: "Easy" | "Medium" | "Hard";
  pattern?: string;
  time?: string;
};
export type TPractice = {
  type: "practice";
  groups: { level: "Beginner" | "Intermediate" | "Advanced"; items: TPracticeItem[] }[];
};
export type TRefs = { type: "references"; items: { label: string; url: string }[] };
export type TInterview = { type: "interview"; items: string[] };
export type THeading = { type: "heading"; text: string };
export type TTable = { type: "table"; headers: string[]; rows: string[][]; caption?: string };

export type GSection =
  | GraphVizSec | GraphPlaygroundSec | BFSPlayerSec | DFSPlayerSec
  | AdjMatrixVizSec | AdjListVizSec | EdgeListVizSec | IncidenceMatrixVizSec | CsrVizSec
  | DijkstraPlayerSec | BellmanFordPlayerSec | PrimPlayerSec | KruskalPlayerSec
  | TopoSortPlayerSec | UnionFindPlaygroundSec | MemoryDiagramSec
  | TTheory | TCode | TDryRun | TComplexity | TMistakes | TTip | TCallout
  | TQuiz | TPractice | TRefs | TInterview | THeading | TTable;

export type GLesson = {
  slug: string;
  title: string;
  eyebrow?: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  readMinutes: number;
  sections: GSection[];
};

export type GraphTierMeta = {
  slug: string;
  title: string;
  tagline: string;
  lessons: GLesson[];
};
