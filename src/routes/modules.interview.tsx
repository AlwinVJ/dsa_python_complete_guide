import { createFileRoute } from "@tanstack/react-router";
import { InterviewPrepComingSoon } from "@/components/InterviewPrepComingSoon";

export const Route = createFileRoute("/modules/interview")({
  head: () => ({
    meta: [
      { title: "Interview Preparation — Coming Soon · DSA with Python" },
      {
        name: "description",
        content:
          "Interview Preparation is under active development. Planned content includes a DSA interview roadmap, mock interviews, behavioral prep, revision guides, company-wise prep, and common patterns.",
      },
      { property: "og:title", content: "Interview Preparation — Coming Soon" },
      {
        property: "og:description",
        content:
          "A dedicated Interview Preparation hub is on the way — roadmap, mock interviews, behavioral prep, and more.",
      },
    ],
  }),
  component: InterviewPage,
});

function InterviewPage() {
  return (
    <InterviewPrepComingSoon
      title="Interview Preparation"
      description="A complete Interview Preparation hub is on the way — built to take you from fundamentals to offer with a clear plan."
      planned={[
        "DSA interview roadmap",
        "Mock interviews",
        "Behavioral interview preparation",
        "Systematic revision guides",
        "Company-wise preparation",
        "Common interview patterns",
      ]}
    />
  );
}
