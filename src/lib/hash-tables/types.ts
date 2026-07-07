// Section-based content model for the Hash Tables course — mirrors the Queue
// and Stack architecture. Lessons render through a splat route at
// /hash-tables/<tier>/<slug>.

export type HTBucketEntry = { key: string; value?: string | number };

/**
 * Bucket table visualization. Each bucket may hold zero or more entries
 * (separate chaining). For open-addressing demos, pass single-entry buckets
 * plus optional `probeIndices` to highlight the probe path, and a
 * `collisionIndex` to flash the target slot in red.
 */
export type HTBucketsViz = {
  type: "buckets";
  buckets: (HTBucketEntry[] | null)[];
  capacity?: number;
  caption?: string;
  /** Bucket indices to highlight (e.g. probe sequence). */
  probeIndices?: number[];
  /** Bucket index that hosted a collision — flashed red. */
  collisionIndex?: number;
  /** Optional per-bucket labels like "3 % 8 = 3". */
  labels?: (string | undefined)[];
  /** Show computed load factor pill. */
  showLoadFactor?: boolean;
};

/** Key → hash → bucket flow diagram. */
export type HTHashFlow = {
  type: "hashFlow";
  key: string;
  hashValue: number | string;
  bucket: number;
  capacity: number;
  method?: string; // e.g. "division", "multiplication"
  caption?: string;
};

export type HTTheory = { type: "theory"; text?: string; bullets?: string[] };
export type HTCode = { type: "code"; code: string; title?: string; explanation?: string };
export type HTDryRun = { type: "dryRun"; headers: string[]; rows: string[][]; caption?: string };
export type HTComplexity = {
  type: "complexity";
  rows: { op: string; time: string; space?: string; note?: string }[];
};
export type HTMistakes = { type: "mistakes"; items: string[] };
export type HTTip = { type: "tip"; text: string; title?: string };
export type HTCallout = {
  type: "callout";
  kind: "info" | "warn" | "perf" | "did" | "tip" | "interview";
  title?: string;
  text: string;
};
export type HTQuizItem = { q: string; choices: string[]; answer: number; explain?: string };
export type HTQuiz = { type: "quiz"; items: HTQuizItem[] };
export type HTPracticeItem = {
  title: string;
  url: string;
  difficulty: "Easy" | "Medium" | "Hard";
  pattern?: string;
  time?: string;
};
export type HTPractice = {
  type: "practice";
  groups: { level: "Beginner" | "Intermediate" | "Advanced"; items: HTPracticeItem[] }[];
};
export type HTRefs = { type: "references"; items: { label: string; url: string }[] };
export type HTInterview = { type: "interview"; items: string[] };
export type HTHeading = { type: "heading"; text: string };
export type HTPlaygroundSec = { type: "playground"; capacity?: number };

export type HTSection =
  | HTBucketsViz
  | HTHashFlow
  | HTTheory
  | HTCode
  | HTDryRun
  | HTComplexity
  | HTMistakes
  | HTTip
  | HTCallout
  | HTQuiz
  | HTPractice
  | HTRefs
  | HTInterview
  | HTHeading
  | HTPlaygroundSec;

export type HTLesson = {
  slug: string;
  title: string;
  eyebrow?: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  readMinutes: number;
  sections: HTSection[];
};
