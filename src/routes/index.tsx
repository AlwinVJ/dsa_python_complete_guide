import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  Search as SearchIcon,
  Map,
  LayoutDashboard,
  Trophy,
  Boxes,
  GitBranch,
  ListTree,
  Network,
  Layers,
  Cpu,
  Code2,
  Brain,
  Rocket,
  BookOpen,
  Target,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";

import { Footer } from "@/components/Footer";
import {
  PlatformStatistics,
  PlatformFeatures,
  PlatformComparison,
  PlatformCta,
} from "@/components/PlatformFeatures";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DSA with Python — Interactive Data Structures & Algorithms" },
      {
        name: "description",
        content:
          "Master Data Structures & Algorithms in Python through interactive visualizations, animations, coding practice, and real-world applications.",
      },
      {
        property: "og:title",
        content: "DSA with Python — Interactive Data Structures & Algorithms",
      },
      {
        property: "og:description",
        content:
          "The complete interactive DSA course in Python: arrays, linked lists, trees, graphs, DP, sorting, and more.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Landing,
});

const FEATURED = [
  {
    icon: ListTree,
    title: "Arrays & Python Lists",
    desc: "The benchmark module — animated ops, complexity, comprehensions.",
    to: "/introduction",
  },
  {
    icon: GitBranch,
    title: "Sorting Algorithms",
    desc: "11 algorithms compared with live step-by-step animation.",
    to: "/sorting",
  },
  {
    icon: Layers,
    title: "Linked Lists",
    desc: "Nodes, pointers, cycles — singly, doubly, circular.",
    to: "/modules/linked-lists",
  },
  {
    icon: Boxes,
    title: "Trees",
    desc: "Binary, BST, AVL, tries — traversals and rotations.",
    to: "/modules/trees",
  },
  {
    icon: Network,
    title: "Graphs",
    desc: "BFS, DFS, Dijkstra, MSTs, topo sort.",
    to: "/modules/graphs",
  },
  {
    icon: Brain,
    title: "Dynamic Programming",
    desc: "Memoization, tabulation, and classic DP problems.",
    to: "/modules/dp",
  },
];

const RECENT = [
  { title: "Sliding Window", to: "/algorithms/sliding-window" },
  { title: "Kadane's Algorithm", to: "/algorithms/kadane" },
  { title: "Monotonic Stack", to: "/algorithms/monotonic-stack" },
  { title: "Backtracking", to: "/algorithms/backtracking" },
];

function Landing() {
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:py-24 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground"
          >
            <Sparkles className="h-3.5 w-3.5 text-[color:var(--brand)]" />
            Interactive · Beginner to Advanced · Python
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-4xl font-bold leading-tight sm:text-6xl"
          >
            <span className="text-gradient">DSA with Python</span>
            <br /> the visual, interactive way.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-5 max-w-2xl text-lg text-muted-foreground"
          >
            Master Data Structures & Algorithms in Python through interactive visualizations,
            animations, coding practice, and real-world applications.
          </motion.p>

          {/* Search */}
          <motion.form
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            onSubmit={(e: React.FormEvent) => {
              e.preventDefault();
              navigate({ to: "/search", search: {} as never });
            }}
            className="mt-8 max-w-xl"
          >
            <div className="relative">
              <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onFocus={() => navigate({ to: "/search" })}
                placeholder="Search topics, algorithms, patterns…"
                className="w-full rounded-md border border-input bg-background/80 py-3 pl-10 pr-3 text-sm shadow-sm outline-none focus:ring-2 focus:ring-[color:var(--brand)]"
              />
            </div>
          </motion.form>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 flex flex-wrap gap-3"
          >
            <Link
              to="/roadmap"
              className="inline-flex items-center gap-2 rounded-md gradient-brand px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-lg shadow-[color:var(--brand)]/25"
            >
              <Map className="h-4 w-4" /> View Roadmap
            </Link>
            <Link
              to="/introduction"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-5 py-2.5 text-sm font-medium hover:bg-accent"
            >
              Start Learning <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-5 py-2.5 text-sm font-medium hover:bg-accent"
            >
              <LayoutDashboard className="h-4 w-4" /> Dashboard
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Statistics */}
      <PlatformStatistics />

      {/* Course Overview */}
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-6">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-[color:var(--brand)]">
            Course Overview
          </div>
          <h2 className="text-3xl font-semibold text-foreground">
            Master DSA the visual, Python-first way.
          </h2>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground sm:text-base">
            A complete Data Structures & Algorithms curriculum designed for self-learners, students,
            and engineers preparing for interviews. Every module blends short theory, clean Python
            implementations, animated visualizations, complexity analysis, and hand-picked practice
            problems — from arrays all the way through advanced dynamic programming.
          </p>
        </div>
      </section>

      {/* Who is this Course For? */}
      <section className="mx-auto max-w-6xl px-4 pb-8 sm:px-6">
        <div className="card-surface p-6">
          <div className="mb-4 flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
            <Target className="h-3.5 w-3.5 text-[color:var(--brand)]" /> Who is this Course For?
          </div>
          <ul className="grid gap-2.5 sm:grid-cols-2 text-sm">
            {[
              "College Students seeking a strong CS foundation",
              "Software Engineers preparing for technical interviews",
              "AI / ML Engineers wanting to write optimized code",
              "Competitive Programmers starting their journey",
              "Self Learners mastering programming fundamentals",
              "Career Switchers building interview-ready DSA skills",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2 text-foreground">
                <span className="text-emerald-500 font-bold">✓</span> {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Course Information */}
      <section className="mx-auto max-w-6xl px-4 pb-8 sm:px-6">
        <div className="mb-4">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-[color:var(--brand)]">
            Course Information
          </div>
          <h2 className="text-2xl font-semibold text-foreground">At a glance</h2>
        </div>
        <div className="card-surface p-5 grid gap-4 sm:grid-cols-4">
          <div>
            <div className="text-xs text-muted-foreground">Estimated Completion Time</div>
            <div className="text-base font-semibold mt-0.5">≈ 6–10 Weeks</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Difficulty</div>
            <div className="text-base font-semibold mt-0.5 text-amber-500">★★★☆☆</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Coding Practice Required</div>
            <div className="text-base font-semibold mt-0.5">Yes</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Programming Language</div>
            <div className="text-base font-semibold mt-0.5">Python</div>
          </div>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="card-surface p-4">
            <div className="text-xs text-muted-foreground">Sections</div>
            <div className="text-2xl font-bold text-[color:var(--brand)]">20+</div>
          </div>
          <div className="card-surface p-4">
            <div className="text-xs text-muted-foreground">Lessons</div>
            <div className="text-2xl font-bold text-[color:var(--brand)]">200+</div>
          </div>
          <div className="card-surface p-4">
            <div className="text-xs text-muted-foreground">Estimated Time</div>
            <div className="text-2xl font-bold text-[color:var(--brand)]">40+ hrs</div>
          </div>
        </div>
      </section>

      {/* Learning Roadmap */}
      <section className="mx-auto max-w-6xl px-4 pb-8 sm:px-6">
        <div className="card-surface p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
            <span className="inline-flex items-center gap-2">
              <Map className="h-3.5 w-3.5 text-[color:var(--brand)]" /> Learning Roadmap
            </span>
          </h3>
          <div className="relative border-l border-border pl-6 ml-3 space-y-4">
            {[
              { name: "Prerequisites", duration: "2–3 Days" },
              { name: "Introduction to DSA", duration: "30–60 Minutes" },
              { name: "Complexity Analysis", duration: "2–4 Hours" },
              {
                name: "Linear Data Structures",
                duration: "Arrays (2 Days), Linked Lists (2 Days), Stacks, Queues, Hash Tables",
              },
              { name: "Non-Linear Data Structures", duration: "Trees (3 Days), Graphs (3–4 Days)" },
              { name: "Specialized Data Structures", duration: "Heaps, Tries" },
              {
                name: "Algorithms",
                duration: "2–3 Weeks (Sorting, Searching, and other algorithms)",
              },
              { name: "Interview Preparation", duration: "1–2 Weeks (mock interviews, practice)" },
            ].map((stage, idx) => (
              <div key={stage.name} className="relative">
                <span className="absolute -left-9 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-muted border border-border text-[10px] font-bold">
                  {idx + 1}
                </span>
                <div className="text-sm font-semibold">{stage.name}</div>
                <div className="text-xs text-muted-foreground">{stage.duration}</div>
              </div>
            ))}
          </div>
          <div className="mt-5 flex justify-end">
            <Link
              to="/roadmap"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[color:var(--brand)] hover:underline"
            >
              See full learning roadmap <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Modules */}
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-6">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-[color:var(--brand)]">
            Featured Learning Modules
          </div>
          <h2 className="text-3xl font-semibold text-foreground">Start where it clicks.</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Select any of our flagship interactive modules below to begin exploring step-by-step.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURED.map((r, i) => (
            <motion.div
              key={r.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
            >
              <Link
                to={r.to}
                className="card-surface group block h-full p-5 transition hover:border-[color:var(--brand)]/60 hover:shadow-lg"
              >
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-md gradient-brand text-primary-foreground">
                  <r.icon className="h-5 w-5" />
                </div>
                <div className="mb-1 flex items-center gap-1 font-semibold text-foreground">
                  {r.title}
                  <ArrowRight className="h-4 w-4 opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100" />
                </div>
                <div className="text-sm text-muted-foreground">{r.desc}</div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Platform Features companion */}
      <PlatformFeatures />

      {/* Interactive Visualizations Showcase Comparison */}
      <PlatformComparison />

      {/* Interactive Playgrounds */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="mb-6">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-[color:var(--brand)]">
            Interactive Playgrounds
          </div>
          <h2 className="text-3xl font-semibold text-foreground">Learn by watching it move.</h2>
          <p className="mt-1 text-sm text-muted-foreground max-w-2xl">
            Every core data structure and algorithm comes with a live playground — step through
            inserts, swaps, and pointer moves at your own pace.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { title: "Arrays", to: "/introduction" },
            { title: "Linked Lists", to: "/modules/linked-lists" },
            { title: "Stacks", to: "/modules/stacks" },
            { title: "Queues", to: "/modules/queues" },
            { title: "Hash Tables", to: "/modules/hashing" },
            { title: "Trees", to: "/modules/trees" },
            { title: "Sorting", to: "/sorting" },
            { title: "Searching", to: "/searching" },
          ].map((p) => (
            <Link
              key={p.title}
              to={p.to}
              className="card-surface p-4 hover:border-[color:var(--brand)]/60 transition text-foreground"
            >
              <div className="text-sm font-semibold">{p.title}</div>
              <div className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground">
                Open playground <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-5 flex justify-end">
          <Link
            to="/playgrounds"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[color:var(--brand)] hover:underline"
          >
            See all playgrounds <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Recently added + Interview */}
      <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6">
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="card-surface p-6">
            <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-[color:var(--brand)]" /> Recently Added
            </div>
            <ul className="space-y-2">
              {RECENT.map((r) => (
                <li key={r.to}>
                  <Link
                    to={r.to}
                    className="flex items-center justify-between rounded-md border border-border bg-background/40 px-3 py-2 text-sm hover:border-[color:var(--brand)]/60 text-foreground"
                  >
                    <span>{r.title}</span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="card-surface p-6">
            <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
              <Target className="h-3.5 w-3.5 text-[color:var(--brand)]" /> Interview Preparation
            </div>
            <p className="text-sm text-muted-foreground">
              Focused study plan, patterns, and 55+ curated interview questions to prep for
              FAANG-style rounds.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                to="/modules/interview"
                className="inline-flex items-center gap-1 rounded-md gradient-brand px-3 py-1.5 text-xs font-medium text-primary-foreground"
              >
                <Rocket className="h-3.5 w-3.5" /> Start prep
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Practice + References */}
      <section className="mx-auto max-w-6xl px-4 pb-8 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: Code2,
              title: "Coding Practice",
              desc: "LeetCode & HackerRank roadmaps.",
              to: "/resources",
            },
            {
              icon: BookOpen,
              title: "References",
              desc: "Docs, blogs, courses — curated.",
              to: "/resources",
            },
            {
              icon: Cpu,
              title: "Complexity",
              desc: "Time & space cheat sheets.",
              to: "/complexity",
            },
            {
              icon: Trophy,
              title: "Popular Patterns",
              desc: "20 algorithm techniques.",
              to: "/algorithms",
            },
          ].map((c) => (
            <Link
              key={c.title}
              to={c.to}
              className="card-surface p-5 hover:border-[color:var(--brand)]/60 transition text-foreground"
            >
              <c.icon className="mb-3 h-5 w-5 text-[color:var(--brand)]" />
              <div className="font-semibold">{c.title}</div>
              <div className="mt-1 text-sm text-muted-foreground">{c.desc}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Final CTA Card */}
      <PlatformCta />

      <Footer />
    </div>
  );
}
