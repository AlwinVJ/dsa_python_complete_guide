import { createFileRoute } from "@tanstack/react-router";
import { ModuleQAPage } from "@/components/qa/ModuleQAPage";
import { queuesQA } from "@/lib/qa/queues";

export const Route = createFileRoute("/queues/faq")({
  head: () => ({
    meta: [
      { title: "Queues — FAQ · DSA with Python" },
      {
        name: "description",
        content:
          "Detailed FAQ for queues in Python — FIFO, deque, circular queues, priority queues, and BFS with code, complexity, and lesson cross-links.",
      },
      { property: "og:title", content: "Queues — FAQ · DSA with Python" },
      {
        property: "og:description",
        content: "Comprehensive answers to the most common questions about queues in Python.",
      },
    ],
  }),
  component: () => <ModuleQAPage qa={queuesQA} mode="faq" />,
});
