import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  BookOpen, Code2, Cpu, ListChecks, Sparkles, Lightbulb, Wrench, Rocket,
  CheckCircle2, Circle, AlertTriangle, ClipboardList, Layers, Boxes,
  MemoryStick, Globe, HelpCircle, Trophy, Puzzle, Link2, GraduationCap,
} from "lucide-react";
import { MODULES } from "@/lib/curriculum";
import { getRichModule } from "@/lib/modules";
import { CodeBlock } from "@/components/CodeBlock";
import { useProgress } from "@/lib/progress";
import { getBank } from "@/lib/question-bank";
import { QuestionBank, EdgeCaseGrid, RevisionSheet } from "@/components/qbank/QuestionBank";
import {
  IntroductionSection, InternalsSection, VariantsSection, OperationsSection,
  AlgorithmsSection, ComplexitySection, ApplicationsSection, InterviewSection,
  FAQSection, MistakesSection, QuizSection, PracticeSection, ReferencesSection,
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
    const title = rich?.title || m?.title
      ? `${(rich?.title || m?.title)} — DSA with Python`
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
  { id: "intro",       label: "Introduction",  icon: BookOpen },
  { id: "internals",   label: "Internals",     icon: MemoryStick },
  { id: "variants",    label: "Variants",      icon: Layers },
  { id: "operations",  label: "Operations",    icon: Wrench },
  { id: "algorithms",  label: "Algorithms",    icon: Cpu },
  { id: "complexity",  label: "Complexity",    icon: Boxes },
  { id: "applications",label: "Applications",  icon: Globe },
  { id: "interview",   label: "Interview",     icon: GraduationCap },
  { id: "faq",         label: "FAQ",           icon: HelpCircle },
  { id: "mistakes",    label: "Mistakes",      icon: AlertTriangle },
  { id: "quiz",        label: "Quiz",          icon: Trophy },
  { id: "practice",    label: "Practice",      icon: ListChecks },
  { id: "qbank",       label: "Question Bank", icon: Puzzle },
  { id: "references",  label: "References",    icon: Link2 },
  { id: "revision",    label: "Revision",      icon: ClipboardList },
] as const;

const BASIC_TABS = [
  { id: "theory",     label: "Theory",        icon: BookOpen },
  { id: "operations", label: "Operations",    icon: Wrench },
  { id: "code",       label: "Python Code",   icon: Code2 },
  { id: "complexity", label: "Complexity",    icon: Cpu },
  { id: "interview",  label: "Interview Qs",  icon: Lightbulb },
  { id: "practice",   label: "Practice",      icon: ListChecks },
  { id: "qbank",      label: "Question Bank", icon: Layers },
  { id: "edge",       label: "Edge Cases",    icon: AlertTriangle },
  { id: "revision",   label: "Revision",      icon: ClipboardList },
] as const;

function ModulePage() {
  const { slug } = Route.useLoaderData();
  const rich = getRichModule(slug);
  const m = MODULES[slug];
  const bank = getBank(slug);
  const { has, toggle } = useProgress();
  const done = has(slug);

  const title = rich?.title || m?.title || slug;
  const tagline = rich?.tagline || m?.tagline || "";
  const group = rich?.group || m?.group || "";

  const TABS = rich ? RICH_TABS : BASIC_TABS;
  const [tab, setTab] = useState<string>(TABS[0].id);

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
          <button
            onClick={() => toggle(slug)}
            className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition ${
              done
                ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                : "gradient-brand text-primary-foreground"
            }`}
          >
            {done ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
            {done ? "Completed" : "Mark as complete"}
          </button>
          <Link to="/roadmap" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
            <Rocket className="h-4 w-4" /> View roadmap
          </Link>
          {rich && (
            <>
              <span className="text-xs text-muted-foreground">
                {rich.operations.length} operations · {rich.algorithms.length} algorithms · {rich.faqs.length} FAQs · {rich.quiz.length} quiz
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
            {tab === "intro"        && <IntroductionSection m={rich} />}
            {tab === "internals"    && <InternalsSection m={rich} />}
            {tab === "variants"     && rich.variants && <VariantsSection variants={rich.variants} />}
            {tab === "operations"   && <OperationsSection ops={rich.operations} />}
            {tab === "algorithms"   && <AlgorithmsSection algos={rich.algorithms} />}
            {tab === "complexity"   && <ComplexitySection m={rich} />}
            {tab === "applications" && <ApplicationsSection m={rich} />}
            {tab === "interview"    && <InterviewSection m={rich} />}
            {tab === "faq"          && <FAQSection m={rich} />}
            {tab === "mistakes"     && <MistakesSection m={rich} />}
            {tab === "quiz"         && <QuizSection m={rich} />}
            {tab === "practice"     && <PracticeSection m={rich} />}
            {tab === "qbank"        && bank && <QuestionBank bank={bank} />}
            {tab === "references"   && <ReferencesSection m={rich} />}
            {tab === "revision"     && <RevisionSection m={rich} />}
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
              {m.theory.map((t: string, i: number) => <li key={i}>{t}</li>)}
            </ul>
          ) : (
            <p className="text-muted-foreground">Deep-dive theory coming soon for this module.</p>
          )}
          {m.applications?.length ? (
            <div className="card-surface p-5">
              <div className="mb-2 text-sm font-semibold">Real-world applications</div>
              <div className="flex flex-wrap gap-2">
                {m.applications.map((a: string) => (
                  <span key={a} className="rounded-md border border-border bg-background px-2 py-1 text-xs">{a}</span>
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
          ) : <p className="mt-3 text-muted-foreground">Operations list coming soon.</p>}
        </div>
      )}
      {tab === "code" && (
        <div>
          <h2 className="text-xl font-semibold">Python Implementation</h2>
          {m.pythonSnippet ? <div className="mt-4"><CodeBlock code={m.pythonSnippet} /></div> : <p className="mt-3 text-muted-foreground">Reference implementation coming soon.</p>}
        </div>
      )}
      {tab === "complexity" && (
        <div>
          <h2 className="text-xl font-semibold">Time & Space Complexity</h2>
          {m.complexity?.length ? (
            <div className="mt-4 overflow-hidden rounded-lg border border-border">
              <table className="w-full text-sm">
                <thead className="bg-muted/50"><tr><th className="px-4 py-2 text-left">Operation</th><th className="px-4 py-2 text-left">Time</th><th className="px-4 py-2 text-left">Space</th></tr></thead>
                <tbody>
                  {m.complexity.map((r: { op: string; time: string; space?: string }) => (
                    <tr key={r.op} className="border-t border-border">
                      <td className="px-4 py-2">{r.op}</td>
                      <td className="px-4 py-2 font-mono text-[color:var(--brand)]">{r.time}</td>
                      <td className="px-4 py-2 font-mono text-muted-foreground">{r.space ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : <p className="mt-3 text-muted-foreground">See the <Link to="/complexity" className="underline">complexity cheat sheet</Link>.</p>}
        </div>
      )}
      {tab === "interview" && (
        <div>
          <h2 className="text-xl font-semibold">Common Interview Questions</h2>
          {m.interviewQs?.length ? <ol className="mt-4 list-decimal space-y-2 pl-6 text-muted-foreground">{m.interviewQs.map((q: string, i: number) => <li key={i}>{q}</li>)}</ol> : <p className="mt-3 text-muted-foreground">Curated interview questions coming soon.</p>}
        </div>
      )}
      {tab === "practice" && (
        <div>
          <h2 className="text-xl font-semibold">Practice Problems</h2>
          {m.practice?.length ? (
            <ul className="mt-4 space-y-2">
              {m.practice.map((p: { url: string; title: string; difficulty: string }) => (
                <li key={p.url}>
                  <a href={p.url} target="_blank" rel="noreferrer" className="card-surface flex items-center justify-between p-3 hover:border-[color:var(--brand)]/60 transition">
                    <span className="text-sm font-medium">{p.title}</span>
                    <span className={`rounded-md px-2 py-0.5 text-xs ${
                      p.difficulty === "Easy" ? "bg-emerald-500/15 text-emerald-500" :
                      p.difficulty === "Medium" ? "bg-amber-500/15 text-amber-500" :
                      "bg-rose-500/15 text-rose-500"
                    }`}>{p.difficulty}</span>
                  </a>
                </li>
              ))}
            </ul>
          ) : <Link to="/resources" className="mt-3 inline-flex items-center gap-1 text-sm text-[color:var(--brand)]">Browse all practice resources</Link>}
        </div>
      )}
      {tab === "qbank" && bank && <QuestionBank bank={bank} />}
      {tab === "edge" && bank && <div><h2 className="mb-4 text-xl font-semibold">Edge Cases to Remember</h2><EdgeCaseGrid bank={bank} /></div>}
      {tab === "revision" && bank && <div><h2 className="mb-4 text-xl font-semibold">Quick Revision Sheet</h2><RevisionSheet bank={bank} /></div>}
    </>
  );
}
