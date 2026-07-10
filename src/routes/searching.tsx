import { createFileRoute } from "@tanstack/react-router";
import { CourseOverviewPage } from "@/components/course/CourseOverviewPage";

export const Route = createFileRoute("/searching")({
  head: () => ({
    meta: [
      { title: "Searching Algorithms — DSA with Python" },
      {
        name: "description",
        content:
          "Reference guide to 6 classic searching algorithms with Python implementations and complexity analysis.",
      },
    ],
  }),
  component: Page,
});

function Page() {
  return <CourseOverviewPage slug="searching" />;
}
