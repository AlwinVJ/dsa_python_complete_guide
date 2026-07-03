import { createFileRoute } from "@tanstack/react-router";
import { ModuleQAPage } from "@/components/qa/ModuleQAPage";
import { linkedListsQA } from "@/lib/qa/linked-lists";

export const Route = createFileRoute("/linked-lists/interview")({
  head: () => ({
    meta: [
      { title: "Linked Lists — Interview Questions · DSA with Python" },
      { name: "description", content: "Curated linked-list interview questions across theory, coding, optimization, edge cases, and FAANG-style problems — each with Python solution, complexity, and related lessons." },
      { property: "og:title", content: "Linked Lists — Interview Questions · DSA with Python" },
      { property: "og:description", content: "Interview-ready linked-list questions with detailed solutions and complexity analysis." },
    ],
  }),
  component: () => <ModuleQAPage qa={linkedListsQA} mode="interview" />,
});
