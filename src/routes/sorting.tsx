import { createFileRoute } from "@tanstack/react-router";
import { CourseOverviewPage } from "@/components/course/CourseOverviewPage";

export const Route = createFileRoute("/sorting")({
  head: () => ({
    meta: [
      { title: "Sorting Algorithms — DSA with Python" },
      {
        name: "description",
        content:
          "Reference guide to 11 classic sorting algorithms with Python implementations and complexity analysis.",
      },
    ],
  }),
  component: Page,
});

function Page() {
  return <CourseOverviewPage slug="sorting-algorithms" />;
}
