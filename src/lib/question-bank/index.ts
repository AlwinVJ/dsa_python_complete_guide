import type { ModuleBank, Question } from "./types";
import { arraysBank } from "./modules/arrays";
import { linkedListsBank } from "./modules/linked-lists";
import { stacksBank } from "./modules/stacks";
import { queuesBank } from "./modules/queues";
import { hashingBank } from "./modules/hashing";
import { treesBank } from "./modules/trees";
import { graphsBank } from "./modules/graphs";
import { genericBanks } from "./modules/generic";

export const BANKS: Record<string, ModuleBank> = {
  arrays: arraysBank,
  "linked-lists": linkedListsBank,
  stacks: stacksBank,
  queues: queuesBank,
  hashing: hashingBank,
  trees: treesBank,
  graphs: graphsBank,
  ...genericBanks,
};

export function getBank(slug: string): ModuleBank | undefined {
  return BANKS[slug];
}

export function allQuestions(): Question[] {
  return Object.values(BANKS).flatMap((b) => b.questions);
}

export function searchQuestions(term: string): Question[] {
  const t = term.trim().toLowerCase();
  if (!t) return [];
  return allQuestions().filter((q) =>
    [q.title, q.description, q.topic, q.pattern ?? "", (q.tags ?? []).join(" "), q.moduleSlug]
      .join(" ")
      .toLowerCase()
      .includes(t),
  );
}

export const CATEGORY_LABELS: Record<string, string> = {
  theory: "Theory",
  implementation: "Implementation",
  intermediate: "Intermediate",
  advanced: "Advanced",
  "edge-case": "Edge Cases",
  optimization: "Optimization",
  interview: "Interview",
};

export type { ModuleBank, Question } from "./types";
