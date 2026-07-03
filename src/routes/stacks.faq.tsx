import { createFileRoute } from "@tanstack/react-router";
import { ModuleQAPage } from "@/components/qa/ModuleQAPage";
import { stacksQA } from "@/lib/qa/stacks";

export const Route = createFileRoute("/stacks/faq")({
  head: () => ({
    meta: [
      { title: "Stacks — FAQ · DSA with Python" },
      { name: "description", content: "Detailed FAQ for stacks in Python — LIFO principle, implementations, call stack, and design patterns with code, complexity, and lesson cross-links." },
      { property: "og:title", content: "Stacks — FAQ · DSA with Python" },
      { property: "og:description", content: "Comprehensive answers to the most common questions about stacks in Python." },
    ],
  }),
  component: () => <ModuleQAPage qa={stacksQA} mode="faq" />,
});
