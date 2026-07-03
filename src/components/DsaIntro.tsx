import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowRight, ArrowDown, Brain, Zap, Sparkles, Trophy, Cpu, Code2,
  Gamepad2, Globe, Bot, Layers, Boxes, Network, ListTree, GitBranch,
  Hash, TreePine, Route as RouteIcon, Timer, Search, Image as ImageIcon,
  Database, History, Undo2, Printer, MapPin, Users, Lightbulb, Rocket,
  BookOpen, PlayCircle, LineChart, FileCode2, GraduationCap, Check, X,
  Map, Puzzle, Target, HelpCircle, Award, Wrench, MemoryStick,
} from "lucide-react";
import { useState } from "react";

const fade = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.5 },
};

/* 1. Intro */
function Intro() {
  const steps = [
    { label: "Problem", icon: HelpCircle, hint: "Something to solve" },
    { label: "Data Structure", icon: Boxes, hint: "Organize the data" },
    { label: "Algorithm", icon: Cpu, hint: "Step-by-step logic" },
    { label: "Efficient Solution", icon: Trophy, hint: "Fast & clean" },
  ];
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <motion.div {...fade} className="card-surface p-6">
        <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-md gradient-brand text-primary-foreground">
          <Boxes className="h-5 w-5" />
        </div>
        <h3 className="text-xl font-semibold">Data Structures</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Different ways of <b className="text-foreground">organizing and storing data</b> so it can be
          accessed and modified efficiently — like arrays, lists, trees, and graphs.
        </p>
      </motion.div>
      <motion.div {...fade} transition={{ delay: 0.1 }} className="card-surface p-6">
        <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-md gradient-brand text-primary-foreground">
          <Cpu className="h-5 w-5" />
        </div>
        <h3 className="text-xl font-semibold">Algorithms</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          <b className="text-foreground">Step-by-step procedures</b> for solving a problem — searching,
          sorting, traversing, and transforming data.
        </p>
      </motion.div>

      <motion.div {...fade} transition={{ delay: 0.15 }} className="lg:col-span-2 card-surface p-6">
        <div className="mb-4 flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-[color:var(--brand)]" /> How they work together
        </div>
        <div className="flex flex-col items-stretch gap-3 md:flex-row md:items-center">
          {steps.map((s, i) => (
            <div key={s.label} className="flex flex-1 items-center gap-3 md:flex-col md:text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex-1 rounded-lg border border-border bg-background/60 p-4"
              >
                <s.icon className="mx-auto mb-2 h-5 w-5 text-[color:var(--brand)]" />
                <div className="font-medium">{s.label}</div>
                <div className="text-xs text-muted-foreground">{s.hint}</div>
              </motion.div>
              {i < steps.length - 1 && (
                <>
                  <ArrowRight className="hidden h-5 w-5 shrink-0 text-muted-foreground md:block" />
                  <ArrowDown className="h-5 w-5 shrink-0 text-muted-foreground md:hidden" />
                </>
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

/* 2. Why learn DSA */
const WHY = [
  { icon: Brain, title: "Better Problem Solving", desc: "Think in patterns, not code." },
  { icon: Zap, title: "Faster Programs", desc: "Right structure = 100× speedup." },
  { icon: FileCode2, title: "Cleaner Code", desc: "Less spaghetti, more clarity." },
  { icon: GraduationCap, title: "Tech Interviews", desc: "The universal filter at every top company." },
  { icon: Trophy, title: "Competitive Programming", desc: "Solve olympiad-style problems." },
  { icon: Wrench, title: "Software Engineering", desc: "Design robust real-world systems." },
  { icon: Bot, title: "AI & Machine Learning", desc: "Trees, graphs, matrices, heaps." },
  { icon: Gamepad2, title: "Game Development", desc: "Pathfinding, physics, state." },
  { icon: Globe, title: "Web Development", desc: "Caching, routing, state management." },
  { icon: Network, title: "System Design", desc: "Scale from 10 users to 10 million." },
];
function WhyLearn() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      {WHY.map((w, i) => (
        <motion.div
          key={w.title}
          {...fade}
          transition={{ delay: (i % 5) * 0.05 }}
          whileHover={{ y: -4 }}
          className="card-surface group p-4 transition hover:border-[color:var(--brand)]/60 hover:shadow-lg"
        >
          <div className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-md bg-[color:var(--brand)]/10 text-[color:var(--brand)] transition group-hover:gradient-brand group-hover:text-primary-foreground">
            <w.icon className="h-4 w-4" />
          </div>
          <div className="text-sm font-semibold">{w.title}</div>
          <div className="mt-1 text-xs text-muted-foreground">{w.desc}</div>
        </motion.div>
      ))}
    </div>
  );
}

/* 3. Where DSA is used */
const USES = [
  { icon: ListTree, name: "Arrays", uses: ["Image processing", "Game dev", "Data storage", "Math computation"] },
  { icon: Layers, name: "Linked Lists", uses: ["Browser history", "Music playlists", "Undo / redo"] },
  { icon: Undo2, name: "Stacks", uses: ["Function calls", "Undo ops", "Expression eval", "Browser back"] },
  { icon: Printer, name: "Queues", uses: ["Printer queue", "CPU scheduling", "Task queues", "BFS traversal"] },
  { icon: Hash, name: "Hash Tables", uses: ["Dictionaries", "DB indexing", "Caching", "Auth", "Search engines"] },
  { icon: TreePine, name: "Trees", uses: ["File systems", "HTML DOM", "Databases", "AI decision trees"] },
  { icon: RouteIcon, name: "Graphs", uses: ["Google Maps", "GPS", "Social networks", "Recommendations", "Flight routes"] },
  { icon: Timer, name: "Heaps", uses: ["Priority scheduling", "Event simulation", "Job scheduling"] },
  { icon: Search, name: "Tries", uses: ["Autocomplete", "Spell check", "Search suggestions"] },
];
function WhereUsed() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {USES.map((u, i) => (
        <motion.div key={u.name} {...fade} transition={{ delay: (i % 3) * 0.06 }} className="card-surface p-5">
          <div className="mb-3 flex items-center gap-3">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-md gradient-brand text-primary-foreground">
              <u.icon className="h-5 w-5" />
            </div>
            <div className="font-semibold">{u.name}</div>
          </div>
          <ul className="space-y-1.5">
            {u.uses.map((x) => (
              <li key={x} className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--brand)]" /> {x}
              </li>
            ))}
          </ul>
        </motion.div>
      ))}
    </div>
  );
}

/* 4. Why Python */
const PY_REASONS = [
  { icon: Code2, title: "Easy Syntax", desc: "Reads like English — focus on ideas." },
  { icon: Zap, title: "Fast Prototyping", desc: "Test algorithms in minutes." },
  { icon: BookOpen, title: "Rich Standard Library", desc: "heapq, collections, bisect, itertools." },
  { icon: Users, title: "Huge Community", desc: "Tutorials, libraries, help everywhere." },
  { icon: GraduationCap, title: "Interview Friendly", desc: "Accepted at every top company." },
  { icon: Bot, title: "AI & Data Science", desc: "The industry standard language." },
];
const COMPARE = [
  { feat: "Beginner friendly", py: "Excellent", cpp: "Hard", java: "Medium", js: "Good" },
  { feat: "Code length", py: "Short", cpp: "Long", java: "Long", js: "Medium" },
  { feat: "Interview acceptance", py: "Universal", cpp: "Universal", java: "Universal", js: "Common" },
  { feat: "Built-in DS", py: "Rich", cpp: "STL", java: "Rich", js: "Basic" },
  { feat: "Runtime speed", py: "Slower", cpp: "Fastest", java: "Fast", js: "Fast" },
];
function WhyPython() {
  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {PY_REASONS.map((r, i) => (
          <motion.div key={r.title} {...fade} transition={{ delay: (i % 3) * 0.05 }} className="card-surface p-4">
            <r.icon className="mb-2 h-5 w-5 text-[color:var(--brand)]" />
            <div className="font-semibold">{r.title}</div>
            <div className="mt-1 text-sm text-muted-foreground">{r.desc}</div>
          </motion.div>
        ))}
      </div>
      <motion.div {...fade} className="card-surface overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-left">Feature</th>
              <th className="px-4 py-3 text-left text-[color:var(--brand)]">Python</th>
              <th className="px-4 py-3 text-left">C++</th>
              <th className="px-4 py-3 text-left">Java</th>
              <th className="px-4 py-3 text-left">JavaScript</th>
            </tr>
          </thead>
          <tbody>
            {COMPARE.map((row) => (
              <tr key={row.feat} className="border-t border-border">
                <td className="px-4 py-3 font-medium">{row.feat}</td>
                <td className="px-4 py-3 text-[color:var(--brand)]">{row.py}</td>
                <td className="px-4 py-3 text-muted-foreground">{row.cpp}</td>
                <td className="px-4 py-3 text-muted-foreground">{row.java}</td>
                <td className="px-4 py-3 text-muted-foreground">{row.js}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}

/* 5. Learning roadmap */
const LEARN_STEPS = [
  "Python Basics", "Time Complexity", "Data Structures", "Master Algorithms",
  "Practice Problems", "Optimize Solutions", "Mock Interviews", "Real Projects", "Job Ready",
];
function HowToLearn() {
  return (
    <div className="card-surface p-6">
      <div className="grid gap-2 md:grid-cols-3 lg:grid-cols-9">
        {LEARN_STEPS.map((s, i) => (
          <motion.div
            key={s}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
            className="relative rounded-md border border-border bg-background/40 p-3 text-center"
          >
            <div className="mx-auto mb-1 grid h-6 w-6 place-items-center rounded-full gradient-brand text-[10px] font-bold text-primary-foreground">
              {i + 1}
            </div>
            <div className="text-xs font-medium">{s}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* 6. What you'll learn */
const CURRICULUM = {
  "Data Structures": [
    { name: "Arrays", to: "/introduction" },
    { name: "Strings", to: "/modules/strings" },
    { name: "Linked Lists", to: "/modules/linked-lists" },
    { name: "Stacks", to: "/modules/stacks" },
    { name: "Queues", to: "/modules/queues" },
    { name: "Hash Tables", to: "/modules/hashing" },
    { name: "Heaps", to: "/modules/heaps" },
    { name: "Trees", to: "/modules/trees" },
    { name: "Tries", to: "/modules/tries" },
    { name: "Graphs", to: "/modules/graphs" },
  ],
  Algorithms: [
    { name: "Searching", to: "/algorithms/binary-search" },
    { name: "Sorting", to: "/sorting" },
    { name: "Recursion", to: "/modules/recursion" },
    { name: "Divide & Conquer", to: "/algorithms" },
    { name: "Greedy", to: "/modules/greedy" },
    { name: "Backtracking", to: "/algorithms/backtracking" },
    { name: "Dynamic Programming", to: "/modules/dp" },
    { name: "Graph Algorithms", to: "/modules/graphs" },
    { name: "String Algorithms", to: "/modules/strings" },
    { name: "Bit Manipulation", to: "/modules/bit-manipulation" },
  ],
} as const;
function WhatYouLearn() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {Object.entries(CURRICULUM).map(([cat, items]) => (
        <motion.div key={cat} {...fade} className="card-surface p-6">
          <div className="mb-4 flex items-center gap-2">
            <Puzzle className="h-5 w-5 text-[color:var(--brand)]" />
            <h3 className="text-lg font-semibold">{cat}</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {items.map((t) => (
              <Link
                key={t.name}
                to={t.to}
                className="rounded-full border border-border bg-background/60 px-3 py-1.5 text-xs font-medium transition hover:border-[color:var(--brand)]/60 hover:text-[color:var(--brand)]"
              >
                {t.name}
              </Link>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* 7. Timeline */
const TIMELINE = [
  { w: "Week 1", t: "Python Basics", to: "/introduction" },
  { w: "Week 2", t: "Arrays", to: "/introduction" },
  { w: "Week 3", t: "Strings", to: "/modules/strings" },
  { w: "Week 4", t: "Linked Lists", to: "/modules/linked-lists" },
  { w: "Week 5", t: "Stacks & Queues", to: "/modules/stacks" },
  { w: "Week 6", t: "Hash Tables", to: "/modules/hashing" },
  { w: "Week 7", t: "Trees", to: "/modules/trees" },
  { w: "Week 8", t: "Graphs", to: "/modules/graphs" },
  { w: "Week 9", t: "Algorithms", to: "/algorithms" },
  { w: "Week 10+", t: "Interview Prep", to: "/modules/interview" },
];
function Timeline() {
  return (
    <div className="card-surface p-6">
      <div className="flex gap-3 overflow-x-auto pb-2">
        {TIMELINE.map((s, i) => (
          <motion.div
            key={s.w}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="min-w-[160px] flex-1"
          >
            <Link
              to={s.to}
              className="block h-full rounded-lg border border-border bg-background/60 p-4 transition hover:border-[color:var(--brand)]/60 hover:shadow-lg"
            >
              <div className="text-[10px] font-bold uppercase tracking-wider text-[color:var(--brand)]">{s.w}</div>
              <div className="mt-1 text-sm font-semibold">{s.t}</div>
              <ArrowRight className="mt-3 h-4 w-4 text-muted-foreground" />
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* 8. Learning companion */
const FEATURES = [
  { icon: BookOpen, t: "Theory" },
  { icon: PlayCircle, t: "Interactive Visualizations" },
  { icon: Code2, t: "Python Implementations" },
  { icon: FileCode2, t: "Dry Runs" },
  { icon: Sparkles, t: "Animations" },
  { icon: MemoryStick, t: "Memory Diagrams" },
  { icon: LineChart, t: "Time & Space Complexity" },
  { icon: Globe, t: "Real-world Applications" },
  { icon: HelpCircle, t: "FAQs" },
  { icon: GraduationCap, t: "Interview Questions" },
  { icon: Target, t: "Practice Problems" },
  { icon: Map, t: "LeetCode Roadmaps" },
  { icon: RouteIcon, t: "HackerRank Roadmaps" },
  { icon: Award, t: "Quizzes" },
  { icon: Lightbulb, t: "Cheat Sheets" },
  { icon: BookOpen, t: "References" },
  { icon: Trophy, t: "Progress Tracking" },
];
function Companion() {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
      {FEATURES.map((f, i) => (
        <motion.div
          key={f.t}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: (i % 8) * 0.03 }}
          whileHover={{ y: -2 }}
          className="card-surface flex items-center gap-2 p-3"
        >
          <f.icon className="h-4 w-4 shrink-0 text-[color:var(--brand)]" />
          <span className="text-xs font-medium">{f.t}</span>
        </motion.div>
      ))}
    </div>
  );
}

/* 9. Comparison */
const COMPARE_FEATURES = [
  "Interactive Visualizations",
  "Step-by-step Animations",
  "Python-first Explanations",
  "Memory Visualizations",
  "Built-in Practice Roadmaps",
  "Interview Preparation",
  "Progress Tracking",
  "Comprehensive Cheat Sheets",
  "Real-world Applications",
  "Beginner to Advanced Roadmap",
];
function Comparison() {
  return (
    <motion.div {...fade} className="card-surface overflow-x-auto p-0">
      <table className="w-full text-sm">
        <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
          <tr>
            <th className="px-4 py-3 text-left">Feature</th>
            <th className="px-4 py-3 text-center text-[color:var(--brand)]">DSA with Python</th>
            <th className="px-4 py-3 text-center">Traditional Tutorials</th>
          </tr>
        </thead>
        <tbody>
          {COMPARE_FEATURES.map((f) => (
            <tr key={f} className="border-t border-border">
              <td className="px-4 py-3 font-medium">{f}</td>
              <td className="px-4 py-3 text-center">
                <Check className="mx-auto h-4 w-4 text-[color:var(--brand)]" />
              </td>
              <td className="px-4 py-3 text-center">
                <X className="mx-auto h-4 w-4 text-muted-foreground" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
}

/* Section wrapper */
function Section({
  eyebrow, title, subtitle, children,
}: { eyebrow: string; title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <motion.section {...fade} className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="mb-6">
        <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-[color:var(--brand)]">{eyebrow}</div>
        <h2 className="text-2xl font-semibold sm:text-3xl">{title}</h2>
        {subtitle && <p className="mt-2 max-w-3xl text-sm text-muted-foreground sm:text-base">{subtitle}</p>}
      </div>
      {children}
    </motion.section>
  );
}

export function DsaIntro() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const FAQ = [
    { q: "Why do companies ask DSA in interviews?", a: "DSA reveals how you think, break down problems, weigh trade-offs, and communicate — skills that matter for every engineering role, no matter the stack." },
    { q: "Do I need to be good at math?", a: "No. Basic arithmetic and logical thinking are enough. Complexity analysis uses simple exponents and logs — we explain them intuitively." },
    { q: "How long does it take to become interview-ready?", a: "With focused daily practice, most learners reach interview readiness in 8–12 weeks using this roadmap." },
  ];

  return (
    <div className="border-t border-border bg-gradient-to-b from-background via-background to-muted/10">
      <Section
        eyebrow="Start Here"
        title="What are Data Structures and Algorithms?"
        subtitle="Brand new to DSA? Start with the fundamentals. We'll show you what DSA is, why it matters, and how to learn it — visually and without jargon."
      >
        <Intro />
      </Section>

      <Section eyebrow="Why It Matters" title="Why Learn DSA?" subtitle="DSA powers everything from search engines to games. Here's what you unlock.">
        <WhyLearn />
      </Section>

      <Section eyebrow="Real World" title="Where is DSA Used?" subtitle="Every data structure has real applications. Here are the ones you'll actually see in the wild.">
        <WhereUsed />
      </Section>

      <Section eyebrow="Language of Choice" title="Why Python for DSA?" subtitle="Python's clean syntax lets you focus on ideas, not semicolons. Compare it to the alternatives.">
        <WhyPython />
      </Section>

      <Section eyebrow="Roadmap" title="How to Learn DSA Effectively" subtitle="Follow this proven sequence — each step builds on the previous one.">
        <HowToLearn />
      </Section>

      <Section eyebrow="Curriculum" title="What You Will Learn" subtitle="Every topic is a dedicated interactive module. Click any topic to jump in.">
        <WhatYouLearn />
      </Section>

      <Section eyebrow="Timeline" title="Your 10-Week Learning Journey" subtitle="Click any week to explore the syllabus.">
        <Timeline />
      </Section>

      <Section eyebrow="Everything Included" title="Meet Your Learning Companion" subtitle="Every topic ships with all of this — end to end.">
        <Companion />
      </Section>

      <Section eyebrow="Why Us" title="Why This Platform is Different" subtitle="A complete learning ecosystem — not just another docs site.">
        <Comparison />
      </Section>

      {/* FAQ */}
      <Section eyebrow="FAQ" title="Common Beginner Questions">
        <div className="space-y-3">
          {FAQ.map((f, i) => (
            <div key={i} className="card-surface overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="flex w-full items-center justify-between p-4 text-left"
              >
                <span className="font-medium">{f.q}</span>
                <ArrowDown
                  className={`h-4 w-4 shrink-0 transition ${openFaq === i ? "rotate-180" : ""}`}
                />
              </button>
              {openFaq === i && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="border-t border-border px-4 py-3 text-sm text-muted-foreground"
                >
                  {f.a}
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
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
              Beginner to interview-ready. Interactive from day one.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link to="/roadmap" className="inline-flex items-center gap-2 rounded-md gradient-brand px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-lg shadow-[color:var(--brand)]/25">
                <Map className="h-4 w-4" /> Explore the Roadmap
              </Link>
              <Link to="/introduction" className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-5 py-2.5 text-sm font-medium hover:bg-accent">
                <PlayCircle className="h-4 w-4" /> Start Learning Arrays
              </Link>
              <Link to="/modules/trees" className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-5 py-2.5 text-sm font-medium hover:bg-accent">
                <Boxes className="h-4 w-4" /> Browse All Data Structures
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
