import { createFileRoute } from "@tanstack/react-router";
import { ModuleQAPage } from "@/components/qa/ModuleQAPage";
import { linkedListsQA } from "@/lib/qa/linked-lists";

export const Route = createFileRoute("/linked-lists/faq")({
  head: () => ({
    meta: [
      { title: "Linked Lists — FAQ · DSA with Python" },
      {
        name: "description",
        content:
          "Comprehensive, categorized FAQ for linked lists in Python — concepts, memory, operations, design, and practical usage with code, complexity, and lesson cross-links.",
      },
      { property: "og:title", content: "Linked Lists — FAQ · DSA with Python" },
      {
        property: "og:description",
        content: "Detailed answers to the most common questions about linked lists in Python.",
      },
    ],
  }),
  component: () => <ModuleQAPage qa={linkedListsQA} mode="faq" />,
});
