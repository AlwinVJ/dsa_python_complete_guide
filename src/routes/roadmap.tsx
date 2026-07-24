import { createFileRoute, Link } from "@tanstack/react-router";
import { BackButton } from "@/components/BackButton";
import { ArrowRight, BookOpen, Clock, Layers } from "lucide-react";
import { motion } from "framer-motion";
import { getModuleRoute } from "@/lib/curriculum";

export const Route = createFileRoute("/roadmap")({
  head: () => ({
    meta: [
      { title: "DSA Roadmap — DSA with Python" },
      {
        name: "description",
        content:
          "The complete visual Data Structures & Algorithms learning roadmap in Python, with recommended order and realistic estimated timelines.",
      },
      { property: "og:title", content: "DSA Roadmap — DSA with Python" },
      {
        property: "og:description",
        content: "Estimated study timeline and path for mastering DSA with Python.",
      },
      { property: "og:url", content: "/roadmap" },
    ],
    links: [{ rel: "canonical", href: "/roadmap" }],
  }),
  component: RoadmapPage,
});

const ROADMAP_STAGES = [
  {
    name: "Prerequisites",
    duration: "2–3 Days",
    description:
      "Variables, control loops, functions, basic collections (lists/dicts), and basic recursive patterns.",
    link: "/modules/python-basics",
  },
  {
    name: "Introduction to DSA",
    duration: "30–60 Minutes",
    description:
      "Gateway landing guide explaining what structures and algorithms are and how to study them.",
    link: "/learn/introduction-to-dsa",
  },
  {
    name: "Complexity Analysis",
    duration: "2–4 Hours",
    description:
      "Asymptotic notations (Big-O, Omega, Theta), time vs space tradeoffs, and simple loop estimations.",
    link: "/complexity",
  },
  {
    name: "Linear Data Structures",
    duration: "1–2 Weeks",
    description: "Arrays/Lists (2 Days), Linked Lists (2 Days), Stacks, Queues, Hash Tables.",
    link: "/introduction",
  },
  {
    name: "Non-Linear Data Structures",
    duration: "1 Week",
    description: "Hierarchical networks: Trees (3 Days) and Graphs (3–4 Days).",
    link: "/learn/trees",
  },
  {
    name: "Specialized Data Structures",
    duration: "2–3 Days",
    description: "Advanced structures: Binary Heaps / Priority Queues and Tries.",
    link: "/learn/heaps",
  },
  {
    name: "Algorithms",
    duration: "2–3 Weeks",
    description:
      "Sorting algorithms (Heap, Merge, Quick), searching patterns (Binary, Jump, Interpolation), Greedy, and Dynamic Programming.",
    link: "/sorting",
  },
  {
    name: "Interview Preparation",
    duration: "1–2 Weeks",
    description: "Problem grids, competitive programming patterns, and mock interviews.",
    link: "/modules/interview",
  },
];

function RoadmapPage() {
  const arraysRoute = getModuleRoute({ slug: "arrays", route: "/introduction" });

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="mb-6"><BackButton /></div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">DSA Roadmap</h1>
        <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
          A step-by-step learning progression from basic prerequisites to interview-ready software
          engineering.
        </p>
      </div>

      <div className="relative">
        <div className="absolute left-5 top-0 bottom-0 w-px bg-border" aria-hidden />
        <ol className="space-y-4">
          {ROADMAP_STAGES.map((item, i) => {
            const isArrays = item.name === "Linear Data Structures";
            const targetLink = isArrays ? arraysRoute : item.link;

            return (
              <motion.li
                key={item.name}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className="relative pl-14"
              >
                {/* Node badge counter */}
                <div className="absolute left-0 top-3 grid h-10 w-10 place-items-center rounded-full border-2 border-[color:var(--brand)] bg-background text-[color:var(--brand)] font-bold text-sm">
                  {i + 1}
                </div>

                <div className="card-surface p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-lg text-foreground">{item.name}</span>
                        <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground font-medium">
                          <Clock className="h-3.5 w-3.5 text-[color:var(--brand)]" />{" "}
                          {item.duration}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground max-w-2xl">{item.description}</p>
                    </div>

                    <Link
                      to={targetLink}
                      className="inline-flex items-center gap-1 rounded-md gradient-brand px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow hover:opacity-95 transition shrink-0 mt-1"
                    >
                      Explore Stage <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </motion.li>
            );
          })}
        </ol>
      </div>

      {/* CTA at the bottom */}
      <div className="mt-10 flex flex-col items-center border-t border-border pt-8 text-center">
        <h3 className="font-bold text-xl mb-2">Ready to take the first step?</h3>
        <p className="text-sm text-muted-foreground max-w-md mb-4">
          Prepare your foundation by going through the Prerequisites, or start reading the index
          list operations.
        </p>
        <Link
          to="/learn/introduction-to-dsa"
          className="inline-flex items-center gap-1.5 rounded-md gradient-brand px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-md hover:opacity-90 transition"
        >
          Begin Your DSA Journey →
        </Link>
      </div>
    </div>
  );
}
