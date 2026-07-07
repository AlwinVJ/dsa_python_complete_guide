// Section-based content model for the Stacks course.
// Deliberately mirrors the LLSection pipeline used by Linked Lists so lessons
// render with the same visual language, but keeps stack-specific viz and
// playground section types.

export type StackViz = {
  type: "viz";
  items: Array<string | number>;
  label?: string;
  caption?: string;
  base?: number;
  stride?: number;
  showAddresses?: boolean;
};

export type StackTheory = { type: "theory"; text?: string; bullets?: string[] };
export type StackCode = { type: "code"; code: string; title?: string; explanation?: string };
export type StackDryRun = { type: "dryRun"; headers: string[]; rows: string[][]; caption?: string };
export type StackComplexity = {
  type: "complexity";
  rows: { op: string; time: string; space?: string; note?: string }[];
};
export type StackMistakes = { type: "mistakes"; items: string[] };
export type StackTip = { type: "tip"; text: string; title?: string };
export type StackCallout = {
  type: "callout";
  kind: "info" | "warn" | "perf" | "did" | "tip" | "interview";
  title?: string;
  text: string;
};
export type StackQuizItem = { q: string; choices: string[]; answer: number; explain?: string };
export type StackQuiz = { type: "quiz"; items: StackQuizItem[] };
export type StackPracticeItem = {
  title: string;
  url: string;
  difficulty: "Easy" | "Medium" | "Hard";
  pattern?: string;
  time?: string;
};
export type StackPractice = {
  type: "practice";
  groups: { level: "Beginner" | "Intermediate" | "Advanced"; items: StackPracticeItem[] }[];
};
export type StackRefs = { type: "references"; items: { label: string; url: string }[] };
export type StackInterview = { type: "interview"; items: string[] };
export type StackHeading = { type: "heading"; text: string };
export type StackPlaygroundSec = { type: "playground"; initial?: Array<string | number> };

export type StackSection =
  | StackViz
  | StackTheory
  | StackCode
  | StackDryRun
  | StackComplexity
  | StackMistakes
  | StackTip
  | StackCallout
  | StackQuiz
  | StackPractice
  | StackRefs
  | StackInterview
  | StackHeading
  | StackPlaygroundSec;

export type StackLesson = {
  slug: string;
  title: string;
  eyebrow?: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  readMinutes: number;
  sections: StackSection[];
};
