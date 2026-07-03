export type QuestionCategory =
  | "theory"
  | "implementation"
  | "intermediate"
  | "advanced"
  | "edge-case"
  | "optimization"
  | "interview";

export type Difficulty = "Beginner" | "Intermediate" | "Advanced" | "Interview" | "Competitive";

export type Approach = {
  name: "Brute" | "Better" | "Optimal";
  code: string;
  time: string;
  space: string;
  note?: string;
};

export type LinkRef = { title: string; url: string; difficulty?: "Easy" | "Medium" | "Hard" };

export type Question = {
  id: string;
  moduleSlug: string;
  title: string;
  category: QuestionCategory;
  difficulty: Difficulty;
  topic: string;
  subtopic?: string;
  description: string;
  hints?: string[];
  pythonSolution?: string;
  approaches?: Approach[];
  dryRun?: string;
  visualizationType?: "array" | "linked-list" | "stack" | "queue" | "tree" | "graph" | "hash" | "none";
  timeComplexity?: string;
  spaceComplexity?: string;
  estimatedMinutes?: number;
  pattern?: string;
  relatedDataStructure?: string;
  relatedAlgorithm?: string;
  prerequisites?: string[];
  relatedQuestions?: string[];
  companies?: string[];
  interviewFrequency?: "Low" | "Medium" | "High" | "Very High";
  leetcodeLinks?: LinkRef[];
  hackerRankLinks?: LinkRef[];
  tags?: string[];
};

export type EdgeCase = { case: string; why: string; example?: string };

export type RevisionSheet = {
  formulas?: string[];
  timeComplexity: { op: string; time: string }[];
  spaceComplexity?: { op: string; space: string }[];
  commonMistakes: string[];
  memoryTricks: string[];
  mustSolve: string[];
};

export type ModuleBank = {
  moduleSlug: string;
  moduleTitle: string;
  edgeCases: EdgeCase[];
  revisionSheet: RevisionSheet;
  questions: Question[];
};
