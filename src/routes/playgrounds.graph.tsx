import { PlaygroundFooterNav } from "@/components/PlaygroundNav";
import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHeader } from "@/components/Callout";
import { GraphPlayground } from "@/components/graphs/GraphPlayground";

export const Route = createFileRoute("/playgrounds/graph")({
  head: () => ({
    meta: [
      { title: "Graph Playground — DSA with Python" },
      {
        name: "description",
        content:
          "Build any graph interactively — add vertices, connect edges, toggle direction and weights, and watch live graph statistics update.",
      },
      { property: "og:title", content: "Graph Playground — DSA with Python" },
      {
        property: "og:description",
        content: "An interactive canvas for constructing and exploring graphs.",
      },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Playground"
        title="Graph Playground"
        description="Add vertices with the ‘Add vertex’ tool, connect them with ‘Add edge’, drag them around in ‘Select’ mode, and toggle directed / weighted mode to change graph semantics. Live stats update automatically."
      />
      <GraphPlayground />
      <PlaygroundFooterNav playground="graph" />
    </PageShell>
  );
}
