import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { PageHeader, PageShell } from "@/components/Callout";
import { DecisionTree } from "@/components/DecisionTree";
import { ALGORITHMS } from "@/lib/algorithms";

export const Route = createFileRoute("/algorithms/")({
  head: () => ({
    meta: [
      { title: "Popular Algorithms — DSA with Python" },
      {
        name: "description",
        content:
          "Interactive learning hub for the 20 most common array & Python list algorithms — two pointers, sliding window, prefix sum, Kadane, binary search, DP and more, each with animations, code, and LeetCode roadmaps.",
      },
      { property: "og:title", content: "Popular Algorithms — DSA with Python" },
      {
        property: "og:description",
        content:
          "Learn every array pattern used in coding interviews — animated visualizations, dry runs, Python code, and curated LeetCode paths.",
      },
    ],
  }),
  component: AlgorithmsIndex,
});

function AlgorithmsIndex() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Popular Algorithms"
        title="Master every array & list pattern"
        description="One interactive page per algorithm — intuition, animated dry run, editable playground, brute vs optimal Python code, complexity, and a curated LeetCode roadmap."
      />

      <div className="mb-10 grid gap-6 lg:grid-cols-[1fr_minmax(0,360px)]">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[color:var(--brand)]" />
            <h2 className="text-lg font-semibold">Learning roadmap</h2>
          </div>
          <p className="mb-4 text-sm text-muted-foreground">
            Twenty algorithms grouped from foundational scans to advanced patterns.
            Follow the order below or jump to any card.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {ALGORITHMS.map((a, i) => (
              <motion.div
                key={a.slug}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.02 }}
              >
                <Link
                  to="/algorithms/$slug"
                  params={{ slug: a.slug }}
                  className="group card-surface flex h-full flex-col p-4 hover:border-[color:var(--brand)] transition"
                >
                  <div className="mb-1 flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="rounded bg-accent px-1.5 py-0.5 font-mono">{a.number.toString().padStart(2, "0")}</span>
                    <span>{a.category}</span>
                  </div>
                  <div className="font-semibold">{a.title}</div>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{a.tagline}</p>
                  <div className="mt-3 inline-flex items-center gap-1 text-xs text-[color:var(--brand)] opacity-0 transition group-hover:opacity-100">
                    Open <ArrowRight className="h-3 w-3" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        <aside className="space-y-4">
          <DecisionTree />
          <div className="card-surface p-4 text-sm">
            <div className="mb-2 font-semibold">How each page is structured</div>
            <ul className="space-y-1 text-xs text-muted-foreground">
              <li>• Recognition checklist</li>
              <li>• Intuition + animation</li>
              <li>• Interactive playground</li>
              <li>• Brute → optimal Python code</li>
              <li>• Dry run table</li>
              <li>• Complexity, mistakes, edge cases</li>
              <li>• Interview tips + real-world uses</li>
              <li>• Related algorithms</li>
              <li>• LeetCode roadmap w/ progress</li>
            </ul>
          </div>
        </aside>
      </div>
    </PageShell>
  );
}
