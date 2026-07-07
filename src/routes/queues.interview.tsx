import { createFileRoute } from "@tanstack/react-router";
import { ModuleQAPage } from "@/components/qa/ModuleQAPage";
import { queuesQA } from "@/lib/qa/queues";

export const Route = createFileRoute("/queues/interview")({
  head: () => ({
    meta: [
      { title: "Queues — Interview Questions · DSA with Python" },
      {
        name: "description",
        content:
          "Curated queue interview questions from theory to sliding-window and FAANG-style design — with Python solutions, complexity, and related lessons.",
      },
      { property: "og:title", content: "Queues — Interview Questions · DSA with Python" },
      {
        property: "og:description",
        content: "Queue interview questions organised by difficulty with Python solutions.",
      },
    ],
  }),
  component: () => <ModuleQAPage qa={queuesQA} mode="interview" />,
});
