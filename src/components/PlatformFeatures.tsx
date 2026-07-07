import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  BookOpen,
  PlayCircle,
  Code2,
  FileCode2,
  Sparkles,
  MemoryStick,
  LineChart,
  Globe,
  HelpCircle,
  GraduationCap,
  Target,
  Map,
  Route as RouteIcon,
  Award,
  Lightbulb,
  Trophy,
  Check,
  X,
  ChevronRight,
  Rocket,
  Boxes,
  LayoutDashboard,
} from "lucide-react";

const fade = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.5 },
};

/* 1. Statistics Component */
export function PlatformStatistics() {
  const stats = [
    { value: "12+", label: "Learning Modules", hint: "From Arrays to Dynamic Programming" },
    {
      value: "100+",
      label: "Interactive Visualizations",
      hint: "Step-by-step memory and execution visualizers",
    },
    {
      value: "50+",
      label: "Interview Coding Problems",
      hint: "Curated with LeetCode links & approaches",
    },
    { value: "100%", label: "Python-First", hint: "Clean implementations and OOP structures" },
  ];

  return (
    <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            {...fade}
            transition={{ delay: i * 0.05 }}
            className="card-surface p-5 text-center hover:border-[color:var(--brand)]/40 transition-colors"
          >
            <div className="text-3xl font-bold text-[color:var(--brand)]">{s.value}</div>
            <div className="text-sm font-semibold mt-1 text-foreground">{s.label}</div>
            <div className="text-xs text-muted-foreground mt-1.5">{s.hint}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* 2. Platform Features Grid */
const FEATURES = [
  { icon: BookOpen, t: "Theory & Explanations" },
  { icon: PlayCircle, t: "Interactive Visualizations" },
  { icon: Code2, t: "Python Implementations" },
  { icon: FileCode2, t: "Dry Runs & Walkthroughs" },
  { icon: Sparkles, t: "Animations & Transitions" },
  { icon: MemoryStick, t: "Memory Diagrams" },
  { icon: LineChart, t: "Time & Space Complexity" },
  { icon: Globe, t: "Real-world Applications" },
  { icon: HelpCircle, t: "Frequently Asked Questions" },
  { icon: GraduationCap, t: "Interview Classic Questions" },
  { icon: Target, t: "Practice Challenges" },
  { icon: Map, t: "LeetCode Study Paths" },
  { icon: RouteIcon, t: "HackerRank Practice Paths" },
  { icon: Award, t: "Concept Check Quizzes" },
  { icon: Lightbulb, t: "Quick Revision Sheets" },
  { icon: BookOpen, t: "References & Extra Reading" },
];

export function PlatformFeatures() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="mb-8 text-center md:text-left">
        <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-[color:var(--brand)]">
          Everything Included
        </div>
        <h2 className="text-2xl font-semibold sm:text-3xl">Meet Your Learning Companion</h2>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground sm:text-base">
          This platform is a comprehensive learning ecosystem designed to help you build solid
          intuitive models for how code runs.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {FEATURES.map((f, i) => (
          <motion.div
            key={f.t}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: (i % 8) * 0.03 }}
            whileHover={{ y: -2 }}
            className="card-surface flex items-center gap-2.5 p-3 hover:border-[color:var(--brand)]/40 transition"
          >
            <f.icon className="h-4.5 w-4.5 shrink-0 text-[color:var(--brand)]" />
            <span className="text-xs font-medium text-foreground">{f.t}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* 3. Comparison Table */
const COMPARE_FEATURES = [
  "Interactive Visualizations",
  "Step-by-step Animations",
  "Python-first Explanations",
  "Memory Visualizations",
  "Built-in Practice Roadmaps",
  "Interview Preparation",
  "Comprehensive Cheat Sheets",
  "Real-world Applications",
  "Beginner to Advanced Roadmap",
];

export function PlatformComparison() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="mb-8 text-center md:text-left">
        <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-[color:var(--brand)]">
          Why Us
        </div>
        <h2 className="text-2xl font-semibold sm:text-3xl">Why This Platform is Different</h2>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground sm:text-base">
          Traditional tutorials rely on static text and screenshots. We believe complex algorithms
          are best learned through direct interaction and visual feedback.
        </p>
      </div>

      <motion.div {...fade} className="card-surface overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-left">Feature</th>
              <th className="px-4 py-3 text-center text-[color:var(--brand)] font-semibold">
                DSA with Python
              </th>
              <th className="px-4 py-3 text-center">Traditional Tutorials</th>
            </tr>
          </thead>
          <tbody>
            {COMPARE_FEATURES.map((f) => (
              <tr key={f} className="border-t border-border">
                <td className="px-4 py-3 font-medium text-foreground">{f}</td>
                <td className="px-4 py-3 text-center">
                  <Check className="mx-auto h-4 w-4 text-[color:var(--brand)] font-bold" />
                </td>
                <td className="px-4 py-3 text-center">
                  <X className="mx-auto h-4 w-4 text-muted-foreground" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </section>
  );
}

/* 4. Final CTA Card */
export function PlatformCta() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 animate-fade-in">
      <motion.div
        {...fade}
        className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-[color:var(--brand)]/10 via-background to-background p-8 text-center sm:p-12"
      >
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="relative">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
            <Rocket className="h-3.5 w-3.5 text-[color:var(--brand)]" /> Ready when you are
          </div>
          <h2 className="text-3xl font-bold sm:text-4xl">
            <span className="text-gradient">Start Your DSA Journey Today</span>
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            From foundations to interview-ready. Gain a visual understanding of memory, complexity,
            and coding logic from day one.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/roadmap"
              className="inline-flex items-center gap-2 rounded-md gradient-brand px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-lg shadow-[color:var(--brand)]/25"
            >
              <Map className="h-4 w-4" /> Explore the Roadmap
            </Link>
            <Link
              to="/learn/introduction-to-dsa"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-5 py-2.5 text-sm font-medium hover:bg-accent transition"
            >
              <BookOpen className="h-4 w-4" /> Introduction to DSA
            </Link>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-5 py-2.5 text-sm font-medium hover:bg-accent transition"
            >
              <LayoutDashboard className="h-4 w-4" /> View Dashboard
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
