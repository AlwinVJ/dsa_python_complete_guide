// Section-based content model for the Queues course — mirrors the Stack
// architecture so lessons render with the same visual language via a splat
// route at /queues/<tier>/<slug>.

export type QueueViz = {
  type: "viz";
  items: Array<string | number>;
  variant?: "linear" | "circular";
  capacity?: number;
  headIndex?: number;
  frontLabel?: string;
  rearLabel?: string;
  caption?: string;
  base?: number;
  stride?: number;
  showAddresses?: boolean;
};

export type QueueTheory = { type: "theory"; text?: string; bullets?: string[] };
export type QueueCode = { type: "code"; code: string; title?: string; explanation?: string };
export type QueueDryRun = { type: "dryRun"; headers: string[]; rows: string[][]; caption?: string };
export type QueueComplexity = {
  type: "complexity";
  rows: { op: string; time: string; space?: string; note?: string }[];
};
export type QueueMistakes = { type: "mistakes"; items: string[] };
export type QueueTip = { type: "tip"; text: string; title?: string };
export type QueueCallout = {
  type: "callout";
  kind: "info" | "warn" | "perf" | "did" | "tip" | "interview";
  title?: string;
  text: string;
};
export type QueueQuizItem = { q: string; choices: string[]; answer: number; explain?: string };
export type QueueQuiz = { type: "quiz"; items: QueueQuizItem[] };
export type QueuePracticeItem = {
  title: string;
  url: string;
  difficulty: "Easy" | "Medium" | "Hard";
  pattern?: string;
  time?: string;
};
export type QueuePractice = {
  type: "practice";
  groups: { level: "Beginner" | "Intermediate" | "Advanced"; items: QueuePracticeItem[] }[];
};
export type QueueRefs = { type: "references"; items: { label: string; url: string }[] };
export type QueueInterview = { type: "interview"; items: string[] };
export type QueueHeading = { type: "heading"; text: string };
export type QueuePlaygroundSec = { type: "playground"; initial?: Array<string | number> };

export type QueueSection =
  | QueueViz | QueueTheory | QueueCode | QueueDryRun | QueueComplexity
  | QueueMistakes | QueueTip | QueueCallout | QueueQuiz | QueuePractice
  | QueueRefs | QueueInterview | QueueHeading | QueuePlaygroundSec;

export type QueueLesson = {
  slug: string;
  title: string;
  eyebrow?: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  readMinutes: number;
  sections: QueueSection[];
};
