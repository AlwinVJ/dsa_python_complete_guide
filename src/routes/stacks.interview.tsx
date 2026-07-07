import { createFileRoute } from "@tanstack/react-router";
import { ModuleQAPage } from "@/components/qa/ModuleQAPage";
import { stacksQA } from "@/lib/qa/stacks";

export const Route = createFileRoute("/stacks/interview")({
  head: () => ({
    meta: [
      { title: "Stacks — Interview Questions · DSA with Python" },
      {
        name: "description",
        content:
          "Curated stack interview questions from theory to FAANG-style monotonic-stack problems — with Python solutions, complexity, and related lessons.",
      },
      { property: "og:title", content: "Stacks — Interview Questions · DSA with Python" },
      {
        property: "og:description",
        content: "Stack interview questions organised by difficulty with Python solutions.",
      },
    ],
  }),
  component: () => <ModuleQAPage qa={stacksQA} mode="interview" />,
});
