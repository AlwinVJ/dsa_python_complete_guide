import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  BookOpen,
  Code2,
  Cpu,
  ListChecks,
  Sparkles,
  Lightbulb,
  Wrench,
  Rocket,
  CheckCircle2,
  Circle,
  AlertTriangle,
  ClipboardList,
  Layers,
  Boxes,
  MemoryStick,
  Globe,
  HelpCircle,
  Trophy,
  Puzzle,
  Link2,
  GraduationCap,
} from "lucide-react";
import { MODULES, getModuleRoute } from "@/lib/curriculum";
import { getRichModule } from "@/lib/modules";
import { CodeBlock } from "@/components/CodeBlock";
import { getBank } from "@/lib/question-bank";
import { QuestionBank, EdgeCaseGrid, RevisionSheet } from "@/components/qbank/QuestionBank";
import {
  IntroductionSection,
  InternalsSection,
  VariantsSection,
  OperationsSection,
  AlgorithmsSection,
  ComplexitySection,
  ApplicationsSection,
  InterviewSection,
  FAQSection,
  MistakesSection,
  QuizSection,
  PracticeSection,
  ReferencesSection,
  RevisionSection,
} from "@/components/module/RichSections";

export const Route = createFileRoute("/modules/$slug")({
  beforeLoad: ({ params }) => {
    if (!MODULES[params.slug] && !getRichModule(params.slug)) throw notFound();
  },
  loader: ({ params }) => ({ slug: params.slug }),
  head: ({ params }) => {
    const rich = getRichModule(params.slug);
    const m = MODULES[params.slug];
    const title =
      rich?.title || m?.title
        ? `${rich?.title || m?.title} — DSA with Python`
        : "Module — DSA with Python";
    const desc = rich?.tagline || m?.tagline || "Learn data structures and algorithms in Python.";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:url", content: `/modules/${params.slug}` },
      ],
      links: [{ rel: "canonical", href: `/modules/${params.slug}` }],
    };
  },
  component: ModulePage,
});

const RICH_TABS = [
  { id: "intro", label: "Introduction", icon: BookOpen },
  { id: "internals", label: "Internals", icon: MemoryStick },
  { id: "variants", label: "Variants", icon: Layers },
  { id: "operations", label: "Operations", icon: Wrench },
  { id: "algorithms", label: "Algorithms", icon: Cpu },
  { id: "complexity", label: "Complexity", icon: Boxes },
  { id: "applications", label: "Applications", icon: Globe },
  { id: "interview", label: "Interview", icon: GraduationCap },
  { id: "faq", label: "FAQ", icon: HelpCircle },
  { id: "mistakes", label: "Mistakes", icon: AlertTriangle },
  { id: "quiz", label: "Quiz", icon: Trophy },
  { id: "practice", label: "Practice", icon: ListChecks },
  { id: "qbank", label: "Question Bank", icon: Puzzle },
  { id: "references", label: "References", icon: Link2 },
  { id: "revision", label: "Revision", icon: ClipboardList },
] as const;

const BASIC_TABS = [
  { id: "theory", label: "Theory", icon: BookOpen },
  { id: "operations", label: "Operations", icon: Wrench },
  { id: "code", label: "Python Code", icon: Code2 },
  { id: "complexity", label: "Complexity", icon: Cpu },
  { id: "interview", label: "Interview Qs", icon: Lightbulb },
  { id: "practice", label: "Practice", icon: ListChecks },
  { id: "qbank", label: "Question Bank", icon: Layers },
  { id: "edge", label: "Edge Cases", icon: AlertTriangle },
  { id: "revision", label: "Revision", icon: ClipboardList },
] as const;

function PrerequisitesPage() {
  const [checklist, setChecklist] = useState({
    variables: false,
    loops: false,
    functions: false,
    lists: false,
    dicts: false,
    recursion: false,
  });

  const allChecked = Object.values(checklist).every(Boolean);
  const arraysRoute = getModuleRoute({ slug: "arrays", route: "/introduction" });

  const topics = [
    {
      name: "Variables",
      desc: "How references point to values/objects in memory.",
      why: "Essential to understand parameter passing, aliasing, and mutable modifications of structures.",
      where: "Python Tutorial: Informal Introduction.",
    },
    {
      name: "Data Types",
      desc: "Integers, floats, strings, booleans.",
      why: "DSA algorithms rely on arithmetic operations, string manipulations, and conditional checks.",
      where: "Python Docs: Built-in Types.",
    },
    {
      name: "Loops",
      desc: "For and While loops, loop control (break, continue).",
      why: "Used in almost every single algorithm (iterating arrays, traversing linked lists, BFS/DFS).",
      where: "Python Tutorial: More Control Flow Tools.",
    },
    {
      name: "Functions",
      desc: "Declaring def, args, kwargs, return values.",
      why: "Algorithms are packaged in functions. Clean scope and parameter isolation is critical.",
      where: "Python Docs: Defining Functions.",
    },
    {
      name: "Classes",
      desc: "Object-oriented programming (OOP) basics in Python.",
      why: "Node structures in Linked Lists, Trees, and Graphs are modeled as Python custom classes.",
      where: "Python Tutorial: Classes.",
    },
    {
      name: "Lists",
      desc: "Python's dynamic array implementation.",
      why: "The baseline sequence structure for arrays, stacks, queues, and heaps.",
      where: "Python Docs: Data Structures.",
    },
    {
      name: "Dictionaries",
      desc: "Key-value mapping backed by a hash table.",
      why: "The baseline lookup table; gives O(1) average lookup times. Used in hashing and memoization.",
      where: "Python Docs: Dictionaries.",
    },
    {
      name: "Sets",
      desc: "Unordered collections of unique items.",
      why: "Used to keep track of visited nodes in graph traversal (BFS/DFS) in O(1) time.",
      where: "Python Docs: Sets.",
    },
    {
      name: "Recursion Basics",
      desc: "A function calling itself with a smaller input.",
      why: "The core engine of trees, graphs, divide & conquer, and backtracking algorithms.",
      where: "Algorithms curriculum: Recursion module.",
    },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-[color:var(--brand)]" />
          Getting Started
        </div>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Prerequisites</h1>
        <p className="mt-3 max-w-3xl text-lg text-muted-foreground">
          Before diving into Data Structures & Algorithms, make sure you are comfortable with these
          core Python programming concepts. We focus on how they apply to DSA.
        </p>
      </motion.div>

      <div className="mt-8 space-y-6">
        {/* Core Topics Checklist */}
        <section className="card-surface p-5">
          <h2 className="text-lg font-semibold mb-3">Topic Guidance & Why It Matters</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {topics.map((t) => (
              <div key={t.name} className="border border-border rounded-lg p-4 bg-background/50">
                <div className="font-semibold text-foreground">{t.name}</div>
                <div className="text-xs text-muted-foreground mt-1">{t.desc}</div>
                <div className="text-xs text-[color:var(--brand)] mt-2 font-medium">
                  Why it matters: <span className="text-muted-foreground">{t.why}</span>
                </div>
                <div className="text-xs text-muted-foreground mt-1 italic">
                  Study resource: {t.where}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recommended resources */}
        <section className="card-surface p-5 space-y-4">
          <h2 className="text-lg font-semibold">Recommended Learning Resources</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <div className="font-semibold text-xs uppercase tracking-wider text-muted-foreground mb-1.5">
                Official Documentation
              </div>
              <ul className="space-y-1 text-sm text-[color:var(--brand)]">
                <li>
                  <a
                    href="https://docs.python.org/3/tutorial/index.html"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline"
                  >
                    Python Official Tutorial
                  </a>
                </li>
                <li>
                  <a
                    href="https://docs.python.org/3/library/stdtypes.html"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline"
                  >
                    Standard Types Reference
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <div className="font-semibold text-xs uppercase tracking-wider text-muted-foreground mb-1.5">
                Beginner Tutorials
              </div>
              <ul className="space-y-1 text-sm text-[color:var(--brand)]">
                <li>
                  <a
                    href="https://www.w3schools.com/python/"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline"
                  >
                    W3Schools Python Tutorial
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.programiz.com/python-programming"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline"
                  >
                    Programiz Beginner Guide
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.geeksforgeeks.org/python-programming-language/"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline"
                  >
                    GeeksforGeeks Python Portal
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.freecodecamp.org/"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline"
                  >
                    freeCodeCamp Core Programming
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <div className="font-semibold text-xs uppercase tracking-wider text-muted-foreground mb-1.5">
                Interactive Practice
              </div>
              <ul className="space-y-1 text-sm text-[color:var(--brand)]">
                <li>
                  <a
                    href="https://www.hackerrank.com/domains/python"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline"
                  >
                    HackerRank Python Domain
                  </a>
                </li>
                <li>
                  <a
                    href="https://exercism.org/tracks/python"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline"
                  >
                    Exercism Python Track
                  </a>
                </li>
                <li>
                  <a
                    href="https://codingbat.com/python"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline"
                  >
                    CodingBat Logic Practice
                  </a>
                </li>
                <li>
                  <a
                    href="https://leetcode.com/problemset/all/?difficulty=EASY&languageTags=python"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline"
                  >
                    LeetCode Easy Python Problems
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <div className="font-semibold text-xs uppercase tracking-wider text-muted-foreground mb-1.5">
                Video Courses & Books
              </div>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>
                  <span className="text-[color:var(--brand)]">Corey Schafer's Python Series</span>{" "}
                  (YouTube)
                </li>
                <li>
                  <span className="text-[color:var(--brand)]">
                    freeCodeCamp Python for Beginners
                  </span>{" "}
                  (YouTube)
                </li>
                <li>
                  <span className="text-[color:var(--brand)]">"Python Crash Course"</span> by Eric
                  Matthes (Book)
                </li>
                <li>
                  <span className="text-[color:var(--brand)]">"Automate the Boring Stuff"</span> by
                  Al Sweigart (Book)
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Readiness Checklist */}
        <section className="card-surface p-5">
          <h2 className="text-lg font-semibold mb-1">Self-Assessment Readiness Checklist</h2>
          <p className="text-xs text-muted-foreground mb-3">
            Check off the boxes once you feel comfortable with each topic.
          </p>
          <div className="space-y-2">
            {[
              { id: "variables", label: "Variables & Reference Aliasing" },
              { id: "loops", label: "Loops (For/While iteration)" },
              { id: "functions", label: "Functions (Scope and parameters)" },
              { id: "lists", label: "Lists (Dynamic arrays, indexing, appending)" },
              { id: "dicts", label: "Dictionaries (Hash table key-value lookups)" },
              { id: "recursion", label: "Recursion Basics (Base case, stack frames)" },
            ].map((item) => {
              const k = item.id as keyof typeof checklist;
              return (
                <label
                  key={item.id}
                  className="flex items-center gap-3 p-2.5 rounded-md border border-border bg-background/30 hover:bg-accent/40 cursor-pointer select-none"
                >
                  <input
                    type="checkbox"
                    checked={checklist[k]}
                    onChange={(e) => setChecklist((prev) => ({ ...prev, [k]: e.target.checked }))}
                    className="h-4.5 w-4.5 rounded border-gray-300 text-[color:var(--brand)] focus:ring-[color:var(--brand)]"
                  />
                  <span className="text-sm font-medium">{item.label}</span>
                </label>
              );
            })}
          </div>

          {allChecked && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card-surface p-5 border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mt-6 text-center"
            >
              <div className="font-semibold text-base">
                🎉 You're ready to begin learning Data Structures & Algorithms!
              </div>
              <Link
                to={arraysRoute}
                className="inline-flex items-center gap-1.5 rounded-md gradient-brand px-5 py-2 text-sm font-semibold text-primary-foreground shadow-md hover:opacity-90 transition mt-4"
              >
                Start Learning Arrays →
              </Link>
            </motion.div>
          )}
        </section>
      </div>
    </div>
  );
}

function ModulePage() {
  const { slug } = Route.useLoaderData();
  const rich = getRichModule(slug);
  const m = MODULES[slug];
  const bank = getBank(slug);

  const title = rich?.title || m?.title || slug;
  const tagline = rich?.tagline || m?.tagline || "";
  const group = rich?.group || m?.group || "";

  const TABS = rich ? RICH_TABS : BASIC_TABS;
  const [tab, setTab] = useState<string>(TABS[0].id);

  if (slug === "python-basics") {
    return <PrerequisitesPage />;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-[color:var(--brand)]" />
          {group}
        </div>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{title}</h1>
        <p className="mt-3 max-w-3xl text-lg text-muted-foreground">{tagline}</p>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Link
            to="/roadmap"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <Rocket className="h-4 w-4" /> View roadmap
          </Link>
          {rich && (
            <>
              <span className="text-xs text-muted-foreground">
                {rich.operations.length} operations · {rich.algorithms.length} algorithms ·{" "}
                {rich.faqs.length} FAQs · {rich.quiz.length} quiz
              </span>
            </>
          )}
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="mt-8 flex flex-wrap gap-1 border-b border-border">
        {TABS.map((t) => {
          if (rich) {
            if (t.id === "variants" && (!rich.variants || rich.variants.length === 0)) return null;
            if (t.id === "qbank" && !bank) return null;
          } else {
            if ((t.id === "qbank" || t.id === "edge" || t.id === "revision") && !bank) return null;
          }
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`inline-flex items-center gap-1.5 border-b-2 px-3 py-2 text-sm transition ${
                tab === t.id
                  ? "border-[color:var(--brand)] text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <t.icon className="h-3.5 w-3.5" />
              {t.label}
            </button>
          );
        })}
      </div>

      <div className="mt-6">
        {rich ? (
          <>
            {tab === "intro" && <IntroductionSection m={rich} />}
            {tab === "internals" && <InternalsSection m={rich} />}
            {tab === "variants" && rich.variants && <VariantsSection variants={rich.variants} />}
            {tab === "operations" && <OperationsSection ops={rich.operations} />}
            {tab === "algorithms" && <AlgorithmsSection algos={rich.algorithms} />}
            {tab === "complexity" && <ComplexitySection m={rich} />}
            {tab === "applications" && <ApplicationsSection m={rich} />}
            {tab === "interview" && <InterviewSection m={rich} />}
            {tab === "faq" && <FAQSection m={rich} />}
            {tab === "mistakes" && <MistakesSection m={rich} />}
            {tab === "quiz" && <QuizSection m={rich} />}
            {tab === "practice" && <PracticeSection m={rich} />}
            {tab === "qbank" && bank && <QuestionBank bank={bank} />}
            {tab === "references" && <ReferencesSection m={rich} />}
            {tab === "revision" && <RevisionSection m={rich} />}
          </>
        ) : (
          <BasicContent tab={tab} m={m!} bank={bank} />
        )}
      </div>
    </div>
  );
}

function BasicContent({ tab, m, bank }: { tab: string; m: any; bank: ReturnType<typeof getBank> }) {
  return (
    <>
      {tab === "theory" && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Theory & Concepts</h2>
          {m.theory?.length ? (
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              {m.theory.map((t: string, i: number) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">Deep-dive theory coming soon for this module.</p>
          )}
          {m.applications?.length ? (
            <div className="card-surface p-5">
              <div className="mb-2 text-sm font-semibold">Real-world applications</div>
              <div className="flex flex-wrap gap-2">
                {m.applications.map((a: string) => (
                  <span
                    key={a}
                    className="rounded-md border border-border bg-background px-2 py-1 text-xs"
                  >
                    {a}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      )}
      {tab === "operations" && (
        <div>
          <h2 className="text-xl font-semibold">Core Operations</h2>
          {m.operations?.length ? (
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {m.operations.map((op: string) => (
                <div key={op} className="card-surface p-3 text-sm">
                  <code className="text-[color:var(--brand)]">{op}</code>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-muted-foreground">Operations list coming soon.</p>
          )}
        </div>
      )}
      {tab === "code" && (
        <div>
          <h2 className="text-xl font-semibold">Python Implementation</h2>
          {m.pythonSnippet ? (
            <div className="mt-4">
              <CodeBlock code={m.pythonSnippet} />
            </div>
          ) : (
            <p className="mt-3 text-muted-foreground">Reference implementation coming soon.</p>
          )}
        </div>
      )}
      {tab === "complexity" && (
        <div>
          <h2 className="text-xl font-semibold">Time & Space Complexity</h2>
          {m.complexity?.length ? (
            <div className="mt-4 overflow-hidden rounded-lg border border-border">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-2 text-left">Operation</th>
                    <th className="px-4 py-2 text-left">Time</th>
                    <th className="px-4 py-2 text-left">Space</th>
                  </tr>
                </thead>
                <tbody>
                  {m.complexity.map((r: { op: string; time: string; space?: string }) => (
                    <tr key={r.op} className="border-t border-border">
                      <td className="px-4 py-2">{r.op}</td>
                      <td className="px-4 py-2 font-mono text-[color:var(--brand)]">{r.time}</td>
                      <td className="px-4 py-2 font-mono text-muted-foreground">
                        {r.space ?? "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="mt-3 text-muted-foreground">
              See the{" "}
              <Link to="/complexity" className="underline">
                complexity cheat sheet
              </Link>
              .
            </p>
          )}
        </div>
      )}
      {tab === "interview" && (
        <div>
          <h2 className="text-xl font-semibold">Common Interview Questions</h2>
          {m.interviewQs?.length ? (
            <ol className="mt-4 list-decimal space-y-2 pl-6 text-muted-foreground">
              {m.interviewQs.map((q: string, i: number) => (
                <li key={i}>{q}</li>
              ))}
            </ol>
          ) : (
            <p className="mt-3 text-muted-foreground">Curated interview questions coming soon.</p>
          )}
        </div>
      )}
      {tab === "practice" && (
        <div>
          <h2 className="text-xl font-semibold">Practice Problems</h2>
          {m.practice?.length ? (
            <ul className="mt-4 space-y-2">
              {m.practice.map((p: { url: string; title: string; difficulty: string }) => (
                <li key={p.url}>
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noreferrer"
                    className="card-surface flex items-center justify-between p-3 hover:border-[color:var(--brand)]/60 transition"
                  >
                    <span className="text-sm font-medium">{p.title}</span>
                    <span
                      className={`rounded-md px-2 py-0.5 text-xs ${
                        p.difficulty === "Easy"
                          ? "bg-emerald-500/15 text-emerald-500"
                          : p.difficulty === "Medium"
                            ? "bg-amber-500/15 text-amber-500"
                            : "bg-rose-500/15 text-rose-500"
                      }`}
                    >
                      {p.difficulty}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <Link
              to="/resources"
              className="mt-3 inline-flex items-center gap-1 text-sm text-[color:var(--brand)]"
            >
              Browse all practice resources
            </Link>
          )}
        </div>
      )}
      {tab === "qbank" && bank && <QuestionBank bank={bank} />}
      {tab === "edge" && bank && (
        <div>
          <h2 className="mb-4 text-xl font-semibold">Edge Cases to Remember</h2>
          <EdgeCaseGrid bank={bank} />
        </div>
      )}
      {tab === "revision" && bank && (
        <div>
          <h2 className="mb-4 text-xl font-semibold">Quick Revision Sheet</h2>
          <RevisionSheet bank={bank} />
        </div>
      )}
    </>
  );
}
