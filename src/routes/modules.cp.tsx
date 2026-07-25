import { createFileRoute } from "@tanstack/react-router";
import { InterviewPrepComingSoon } from "@/components/InterviewPrepComingSoon";

export const Route = createFileRoute("/modules/cp")({
  head: () => ({
    meta: [
      { title: "Competitive Programming — Coming Soon · DSA with Python" },
      {
        name: "description",
        content:
          "Competitive Programming is under active development. Planned content includes contest prep, problem-solving strategies, CP templates, math for CP, advanced algorithms, and a contest practice roadmap.",
      },
      { property: "og:title", content: "Competitive Programming — Coming Soon" },
      {
        property: "og:description",
        content:
          "A dedicated Competitive Programming track is on the way — contest prep, templates, math, and advanced algorithms.",
      },
    ],
  }),
  component: CPPage,
});

function CPPage() {
  return (
    <InterviewPrepComingSoon
      title="Competitive Programming"
      description="A dedicated Competitive Programming track is on the way — designed to sharpen speed, accuracy, and depth for contests."
      planned={[
        "Contest preparation",
        "Problem-solving strategies",
        "CP templates",
        "Mathematics for CP",
        "Advanced algorithms",
        "Contest practice roadmap",
      ]}
    />
  );
}
