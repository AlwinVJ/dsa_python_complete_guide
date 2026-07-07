// Section-based content model for the Trees course — mirrors the Hash Tables
// architecture. Lessons render through a splat route at /trees/<tier>/<slug>.

export type TreeNodeViz = {
  id: string | number;
  label: string | number;
  color?: "default" | "red" | "black" | "highlight" | "visited" | "muted" | "brand";
  /** Optional per-node badge shown to the right of the label (e.g. balance factor, height). */
  badge?: string;
  children?: TreeNodeViz[];
};

/** Static tree visualization — used for illustrations, dry-runs, and diagrams. */
export type TreeViz = {
  type: "tree";
  root: TreeNodeViz | null;
  caption?: string;
  path?: (string | number)[];
  minHeight?: number;
  memory?: boolean;
};

export type TreePlaygroundSec = { type: "playground"; kind?: "bst" | "generic" };

// ---------- Specialized interactive sections ----------
export type BinaryPlaygroundSec = { type: "binaryPlayground"; caption?: string };
export type CompleteVizSec = { type: "completeViz"; count?: number; caption?: string };
export type PerfectVizSec = { type: "perfectViz"; levels?: number; caption?: string };
export type FullVizSec = { type: "fullViz"; caption?: string };
export type BalancedVizSec = { type: "balancedViz"; caption?: string };
export type DegenerateVizSec = { type: "degenerateViz"; caption?: string };
export type AVLPlaygroundSec = { type: "avlPlayground"; caption?: string };
export type RBPlaygroundSec = { type: "rbPlayground"; caption?: string };
export type TriePlaygroundSec = { type: "triePlayground"; seed?: string[]; caption?: string };
export type SegTreeSec = { type: "segTree"; data?: number[]; caption?: string };
export type FenwickSec = { type: "fenwick"; data?: number[]; caption?: string };
export type TraversalPlayerSec = {
  type: "traversalPlayer";
  root: TreeNodeViz;
  mode?: "pre" | "in" | "post" | "level" | "morris";
  caption?: string;
};
export type MemoryDiagramSec = {
  type: "memoryDiagram";
  nodes: { id: string; value: string | number; left?: string | null; right?: string | null }[];
  caption?: string;
};

// Reused primitives
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

export type TSection =
  | TreeViz
  | TreePlaygroundSec
  | BinaryPlaygroundSec
  | CompleteVizSec
  | PerfectVizSec
  | FullVizSec
  | BalancedVizSec
  | DegenerateVizSec
  | AVLPlaygroundSec
  | RBPlaygroundSec
  | TriePlaygroundSec
  | SegTreeSec
  | FenwickSec
  | TraversalPlayerSec
  | MemoryDiagramSec
  | TTheory
  | TCode
  | TDryRun
  | TComplexity
  | TMistakes
  | TTip
  | TCallout
  | TQuiz
  | TPractice
  | TRefs
  | TInterview
  | THeading
  | TTable;

export type TLesson = {
  slug: string;
  title: string;
  eyebrow?: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  readMinutes: number;
  sections: TSection[];
};

export type TreeVariantMeta = {
  slug: string;
  title: string;
  tagline: string;
  lessons: TLesson[];
};
