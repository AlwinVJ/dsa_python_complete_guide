// Section-based content model for the Heap course — mirrors the Trees
// architecture. Lessons render through a splat route at /heaps/<tier>/<slug>.

import type { TreeNodeViz } from "@/lib/trees/types";

export type HeapKind = "min" | "max";

/** Static heap visualization built from an array. Renders a binary tree + array
 * strip with optional highlighted indices for dry-runs. */
export type HeapVizSec = {
  type: "heapViz";
  data: number[];
  kind?: HeapKind;
  highlight?: number[]; // indices highlighted (e.g. swap targets)
  path?: number[]; // indices along sift path
  caption?: string;
  showArray?: boolean; // default true
  showIndices?: boolean; // default true
};

/** Interactive playground — insert/delete/peek/build/heapify with animation. */
export type HeapPlaygroundSec = {
  type: "heapPlayground";
  kind?: HeapKind;
  seed?: number[];
  caption?: string;
};

/** Index-arithmetic diagram: highlights parent / left / right relationships. */
export type IndexDiagramSec = {
  type: "indexDiagram";
  data: number[];
  focus: number; // index to explain
  caption?: string;
};

/** Static tree passthrough for illustrations. */
export type TreeVizSec = {
  type: "tree";
  root: TreeNodeViz | null;
  caption?: string;
  minHeight?: number;
};

// Reused primitives — parallel structure to trees/types.ts.
export type HTheory = { type: "theory"; text?: string; bullets?: string[] };
export type HCode = { type: "code"; code: string; title?: string; explanation?: string };
export type HDryRun = { type: "dryRun"; headers: string[]; rows: string[][]; caption?: string };
export type HComplex = {
  type: "complexity";
  rows: { op: string; time: string; space?: string; note?: string }[];
};
export type HMistakes = { type: "mistakes"; items: string[] };
export type HTip = { type: "tip"; text: string; title?: string };
export type HCallout = {
  type: "callout";
  kind: "info" | "warn" | "perf" | "did" | "tip" | "interview";
  title?: string;
  text: string;
};
export type HQuizItem = { q: string; choices: string[]; answer: number; explain?: string };
export type HQuiz = { type: "quiz"; items: HQuizItem[] };
export type HPractice = {
  type: "practice";
  groups: {
    level: "Beginner" | "Intermediate" | "Advanced";
    items: {
      title: string;
      url: string;
      difficulty: "Easy" | "Medium" | "Hard";
      pattern?: string;
      time?: string;
    }[];
  }[];
};
export type HRefs = { type: "references"; items: { label: string; url: string }[] };
export type HInterview = { type: "interview"; items: string[] };
export type HHeading = { type: "heading"; text: string };
export type HTable = { type: "table"; headers: string[]; rows: string[][]; caption?: string };
export type HFAQ = { type: "faq"; items: { q: string; a: string }[] };

export type HSection =
  | HeapVizSec
  | HeapPlaygroundSec
  | IndexDiagramSec
  | TreeVizSec
  | HTheory
  | HCode
  | HDryRun
  | HComplex
  | HMistakes
  | HTip
  | HCallout
  | HQuiz
  | HPractice
  | HRefs
  | HInterview
  | HHeading
  | HTable
  | HFAQ;

export type HLesson = {
  slug: string;
  title: string;
  eyebrow?: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  readMinutes: number;
  sections: HSection[];
};
