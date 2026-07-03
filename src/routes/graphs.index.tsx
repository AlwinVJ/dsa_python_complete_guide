import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Sparkles, Network, Layers, Route as RouteIcon, Compass, Zap,
  BookOpen, Play, ChevronRight, Clock,
} from "lucide-react";
import { PageShell, PageHeader } from "@/components/Callout";
import { GraphPlayground } from "@/components/graphs/GraphPlayground";
import { G_FOUNDATIONS } from "@/lib/graphs/foundations";

export const Route = createFileRoute("/graphs/")({
  head: () => ({
    meta: [
      { title: "Graphs — Interactive Course — DSA with Python" },
      { name: "description", content: "Master graphs end-to-end: foundations, types, representations, traversals, and every core algorithm — with interactive visualizers and complete Python implementations." },
      { property: "og:title", content: "Graphs — Interactive Course — DSA with Python" },
      { property: "og:description", content: "The flagship graphs course: foundations → types → representations → traversals → algorithms → review." },
    ],
  }),
  component: GraphsOverview,
});

const tiers = [
  { title: "Foundations", tagline: "Vocabulary, memory layout, and the graph mental model.", icon: BookOpen, to: "/graphs/foundations/introduction" as const, count: G_FOUNDATIONS.length, ready: true },
  { title: "Graph Types", tagline: "15 mini-courses — directed, weighted, bipartite, DAG, and more.", icon: Layers, ready: false },
  { title: "Representations", tagline: "Adjacency list vs matrix vs edge list vs CSR.", icon: Network, ready: false },
  { title: "Traversals", tagline: "BFS, DFS, iterative vs recursive, components.", icon: Compass, ready: false },
  { title: "Algorithms", tagline: "Shortest path, MST, SCC, flow, coloring, tours.", icon: Zap, ready: false },
  { title: "Review & Practice", tagline: "Cheatsheet, FAQ, interview bank, LC roadmap, quiz.", icon: RouteIcon, ready: false },
];

function GraphsOverview() {
  return (
    <PageShell>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-[color:var(--brand)]" /> Graphs · Overview
        </div>
        <PageHeader
          eyebrow="Flagship Course"
          title="Graphs — the most general data structure"
          description="Trees, lists, and grids are all just graphs in disguise. This course takes you from vocabulary to shortest paths, MSTs, and network flow — with interactive visualizers and complete Python implementations at every step."
        />
      </motion.div>

      <section className="mb-8 grid gap-3 sm:grid-cols-3">
        <Stat label="Total lessons" value={`${G_FOUNDATIONS.length}+`} />
        <Stat label="Estimated time" value="~14 hours" />
        <Stat label="Interactive playgrounds" value="10+" />
      </section>

      <section className="mb-10">
        <h2 className="mb-3 text-xl font-semibold">Learning objectives</h2>
        <ul className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
          {[
            "Speak the vocabulary fluently — vertex, edge, degree, cycle, component.",
            "Choose the right graph representation for any problem.",
            "Implement BFS and DFS from scratch and adapt them to any traversal problem.",
            "Derive shortest-path, MST, and topological-sort algorithms — not memorise them.",
            "Recognise which algorithm to reach for in an interview within 30 seconds.",
            "Write clean, idiomatic Python for every core graph algorithm.",
          ].map((s, i) => (
            <li key={i} className="card-surface p-3">{s}</li>
          ))}
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="mb-3 text-xl font-semibold">Why Graphs matter</h2>
        <p className="text-sm text-muted-foreground">
          Every major software system leans on graphs — routing (Google Maps), recommendations (Instagram, TikTok),
          dependency resolution (npm, pip), scheduling (build systems), and search (Google's link graph). Learn graphs
          once and you have the mental model for almost every non-trivial systems problem.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold">Learning roadmap</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {tiers.map((t) => (
            <div key={t.title} className="card-surface flex items-start gap-3 p-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[color:var(--brand)]/15 text-[color:var(--brand)]">
                <t.icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <div className="font-semibold">{t.title}</div>
                  {t.ready ? (
                    <span className="rounded-md bg-emerald-500/15 px-1.5 py-0.5 text-[10px] font-medium text-emerald-500">Ready</span>
                  ) : (
                    <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">Coming soon</span>
                  )}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{t.tagline}</p>
                {t.ready && t.to && (
                  <Link to={t.to} className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-[color:var(--brand)]">
                    Start section <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="mb-2 text-xl font-semibold">Foundations — lesson roadmap</h2>
        <p className="mb-4 text-sm text-muted-foreground">The 22 Foundations lessons, in order. Complete them before moving to Types.</p>
        <ol className="grid gap-2 sm:grid-cols-2">
          {G_FOUNDATIONS.map((l, i) => (
            <li key={l.slug}>
              <Link
                to="/graphs/$"
                params={{ _splat: `foundations/${l.slug}` }}
                className="card-surface flex items-start gap-3 p-3 transition hover:border-[color:var(--brand)]/60"
              >
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[color:var(--brand)]/15 text-[10px] font-semibold text-[color:var(--brand)]">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium">{l.title}</div>
                  <div className="mt-0.5 flex items-center gap-3 text-[11px] text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {l.readMinutes} min</span>
                    <span>{l.difficulty}</span>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section className="mb-10">
        <h2 className="mb-2 flex items-center gap-2 text-xl font-semibold">
          <Play className="h-5 w-5 text-[color:var(--brand)]" /> Interactive Graph Playground
        </h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Build any graph you like — add vertices, connect them, drag nodes, toggle directions and weights.
          Live stats update every step.
        </p>
        <GraphPlayground />
      </section>

      <section className="mb-10">
        <h2 className="mb-3 text-xl font-semibold">Quick navigation</h2>
        <div className="grid gap-2 sm:grid-cols-2">
          <Link to="/graphs/$" params={{ _splat: "foundations/introduction" }} className="card-surface p-3 hover:border-[color:var(--brand)]/60">
            <div className="text-sm font-medium">Start with Foundations</div>
            <div className="text-xs text-muted-foreground">Introduction to Graphs</div>
          </Link>
          <Link to="/practice" className="card-surface p-3 hover:border-[color:var(--brand)]/60">
            <div className="text-sm font-medium">Practice Problems</div>
            <div className="text-xs text-muted-foreground">Global question bank</div>
          </Link>
        </div>
      </section>
    </PageShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="card-surface p-4 text-center">
      <div className="text-2xl font-bold text-[color:var(--brand)]">{value}</div>
      <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
    </div>
  );
}
