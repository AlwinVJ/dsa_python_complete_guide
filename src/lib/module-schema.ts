// Rich content schema for a full DSA module. Any module that has a matching
// entry in RICH_MODULES gets the full course experience in modules.$slug.tsx.

export type CodeSample = {
  title: string;
  language?: "python" | "text";
  code: string;
  explanation?: string;
};

export type VariantSpec = {
  slug: string;
  name: string;
  description: string;
  useCases: string[];
  pros?: string[];
  cons?: string[];
  complexity?: { op: string; time: string; space?: string }[];
  python?: CodeSample;
};

export type OperationSpec = {
  name: string;
  summary: string;
  steps: string[]; // step-by-step walkthrough
  python: CodeSample;
  time: string;
  space: string;
  edgeCases?: string[];
};

export type AlgorithmSpec = {
  slug: string;
  title: string;
  problem: string;
  approach: string;
  python: CodeSample;
  time: string;
  space: string;
  pattern?: string;
};

export type QuizItem = {
  q: string;
  choices: string[];
  answer: number; // index into choices
  explain: string;
};

export type PracticeItem = {
  title: string;
  url: string;
  difficulty: "Easy" | "Medium" | "Hard";
  pattern?: string;
  estMin?: number;
};

export type FAQItem = {
  q: string;
  a: string;
  code?: string;
  related?: string;
};

export type ReferenceLink = {
  label: string;
  url: string;
  kind: "docs" | "article" | "video" | "practice" | "visualization" | "book";
};

export type MemoryModel = {
  kind: "contiguous" | "linked" | "stack-frames" | "front-rear" | "buckets" | "tree" | "adjacency";
  caption: string;
  notes: string[];
};

export type RichModule = {
  slug: string;
  title: string;
  tagline: string;
  group: string;
  // 1. Introduction
  introduction: {
    definition: string;
    whyExists: string;
    history?: string;
    advantages: string[];
    disadvantages: string[];
    whenToUse: string[];
    whenNotToUse: string[];
    comparedWith?: { name: string; note: string }[];
  };
  // 2. Internal working
  internals: {
    summary: string;
    bullets: string[];
    memory: MemoryModel;
  };
  // 3. Classification / variants
  variants?: VariantSpec[];
  // 4. Operations
  operations: OperationSpec[];
  // 5. Algorithms
  algorithms: AlgorithmSpec[];
  // 6. Complexity summary (in addition to per-op complexity)
  complexity: {
    operations: { op: string; best: string; avg: string; worst: string; space?: string }[];
    notes?: string[];
  };
  // 7. Real-world applications
  applications: { area: string; example: string }[];
  // 8. Interview questions
  interview: {
    theory: string[];
    coding: string[];
    optimization: string[];
    edgeCase: string[];
    company: string[];
  };
  // 9. FAQs
  faqs: FAQItem[];
  // 10. Practice problems
  practice: {
    beginner: PracticeItem[];
    intermediate: PracticeItem[];
    advanced: PracticeItem[];
    interview: PracticeItem[];
    competitive?: PracticeItem[];
  };
  // 11. Common mistakes
  mistakes: { mistake: string; fix: string }[];
  // 12. Quiz
  quiz: QuizItem[];
  // 13. References
  references: ReferenceLink[];
  // 14. Revision
  revision: {
    quickNotes: string[];
    cheatSheet: { label: string; value: string }[];
    interviewTips: string[];
    memoryTricks: string[];
  };
};
