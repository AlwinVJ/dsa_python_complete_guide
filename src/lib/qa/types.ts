// Shared types for module-level FAQ and Interview Question banks.
// Both are consumed by data-driven pages (e.g. /linked-lists/faq).

export type FaqCategory = "Concepts" | "Operations" | "Memory" | "Design" | "Practical";

export type FaqRelated = { label: string; to: string };

export type FaqItem = {
  q: string;
  category: FaqCategory;
  /** Multi-paragraph rich answer. Rendered as separate <p> nodes. */
  answer: string[];
  code?: string;
  time?: string;
  space?: string;
  didYouKnow?: string;
  mistake?: string;
  /** Cross-links to lessons or related interview questions on this site. */
  related?: FaqRelated[];
};

export type InterviewCategory =
  "Theory" | "Conceptual" | "Coding" | "Optimization" | "Edge Case" | "Company" | "Follow-up";

export type InterviewDifficulty = "Beginner" | "Intermediate" | "Advanced" | "FAANG";

export type InterviewQuestion = {
  id: string;
  title: string;
  category: InterviewCategory;
  difficulty: InterviewDifficulty;
  /** Estimated solving minutes. */
  estMin?: number;
  tags?: string[];
  /** Detailed multi-paragraph explanation of the problem + approach. */
  explanation: string[];
  code?: string;
  time?: string;
  space?: string;
  followUp?: string;
  relatedLessons?: FaqRelated[];
  relatedAlgorithm?: string;
  leetcode?: { title: string; url: string; difficulty: "Easy" | "Medium" | "Hard" };
};

export type ModuleQA = {
  moduleSlug: string;
  moduleTitle: string;
  faqPath: string; // e.g. "/linked-lists/faq"
  interviewPath: string; // e.g. "/linked-lists/interview"
  faqs: FaqItem[];
  interview: InterviewQuestion[];
};
