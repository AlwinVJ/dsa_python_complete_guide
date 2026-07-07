import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  CheckCircle2,
  ChevronDown,
  Circle,
  Clock,
  ExternalLink,
  Filter,
  Search,
  Sparkles,
  Bookmark,
  BookmarkCheck,
  StickyNote,
  Trophy,
} from "lucide-react";
import type {
  Question,
  ModuleBank,
  Difficulty,
  QuestionCategory,
  Approach,
} from "@/lib/question-bank/types";
import { CATEGORY_LABELS } from "@/lib/question-bank";
import { CodeBlock } from "@/components/CodeBlock";
import { useLocalSet } from "@/lib/useLocalSet";

const DIFF_COLOR: Record<Difficulty, string> = {
  Beginner: "var(--good)",
  Intermediate: "var(--warn)",
  Advanced: "var(--bad)",
  Interview: "var(--brand)",
  Competitive: "#a855f7",
};

const CATEGORIES: QuestionCategory[] = [
  "theory",
  "implementation",
  "intermediate",
  "advanced",
  "edge-case",
  "optimization",
  "interview",
];

function Pill({
  children,
  color = "hsl(var(--muted-foreground))",
}: {
  children: React.ReactNode;
  color?: string;
}) {
  return (
    <span
      className="inline-flex items-center rounded border px-1.5 py-0.5 text-[10px] font-medium"
      style={{
        borderColor: color,
        color,
        background: `color-mix(in oklab, ${color} 12%, transparent)`,
      }}
    >
      {children}
    </span>
  );
}

function ApproachTabs({ approaches }: { approaches: Approach[] }) {
  const [i, setI] = useState(0);
  const a = approaches[i];
  return (
    <div>
      <div className="mb-2 flex gap-1">
        {approaches.map((ap, idx) => (
          <button
            key={ap.name}
            onClick={() => setI(idx)}
            className={`rounded px-2.5 py-1 text-xs font-medium transition ${
              i === idx
                ? "bg-[color:var(--brand)] text-primary-foreground"
                : "border border-border bg-card text-muted-foreground hover:text-foreground"
            }`}
          >
            {ap.name}
          </button>
        ))}
      </div>
      <div className="mb-2 flex flex-wrap gap-2 text-xs">
        <Pill color={DIFF_COLOR.Interview}>Time {a.time}</Pill>
        <Pill>Space {a.space}</Pill>
        {a.note && <span className="text-muted-foreground">{a.note}</span>}
      </div>
      <CodeBlock code={a.code} title={`${a.name.toLowerCase()}.py`} />
    </div>
  );
}

function useNotes(qid: string) {
  const key = `dsa-qb-notes:${qid}`;
  const [val, setVal] = useState("");
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      setVal(localStorage.getItem(key) ?? "");
    } catch {
      /* noop */
    }
  }, [key]);
  const save = (v: string) => {
    setVal(v);
    try {
      localStorage.setItem(key, v);
    } catch {
      /* noop */
    }
  };
  return [val, save] as const;
}

const FLOW = ["Theory", "Visualize", "Python", "Complexity", "Related", "Notes"] as const;
type FlowStep = (typeof FLOW)[number];

function QuestionCard({
  q,
  allQs,
  solvedKey,
  bookmarkKey,
}: {
  q: Question;
  allQs: Question[];
  solvedKey: string;
  bookmarkKey: string;
}) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<FlowStep>("Theory");
  const [revealed, setRevealed] = useState(false);
  const solved = useLocalSet(solvedKey);
  const bookmarks = useLocalSet(bookmarkKey);
  const [notes, setNotes] = useNotes(q.id);
  const isDone = solved.has(q.id);
  const isSaved = bookmarks.has(q.id);
  const diffColor = DIFF_COLOR[q.difficulty];

  const related = (q.relatedQuestions ?? [])
    .map((id) => allQs.find((x) => x.id === id))
    .filter(Boolean) as Question[];

  return (
    <div
      className={`rounded-lg border border-border bg-card transition ${isDone ? "opacity-80" : ""}`}
    >
      <div className="flex items-start gap-3 p-3">
        <button
          onClick={() => solved.toggle(q.id)}
          className="mt-0.5 shrink-0 text-muted-foreground hover:text-[color:var(--good)]"
          aria-label={isDone ? "Mark not solved" : "Mark solved"}
        >
          {isDone ? (
            <CheckCircle2 className="h-5 w-5 text-[color:var(--good)]" />
          ) : (
            <Circle className="h-5 w-5" />
          )}
        </button>
        <button onClick={() => setOpen((o) => !o)} className="min-w-0 flex-1 text-left">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`text-sm font-semibold ${isDone ? "line-through" : ""}`}>
              {q.title}
            </span>
            <Pill color={diffColor}>{q.difficulty}</Pill>
            <Pill>{CATEGORY_LABELS[q.category]}</Pill>
            {q.pattern && <Pill>{q.pattern}</Pill>}
            {q.estimatedMinutes && (
              <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
                <Clock className="h-3 w-3" />~{q.estimatedMinutes}m
              </span>
            )}
            {q.interviewFrequency && (
              <span className="text-[10px] text-muted-foreground">🔥 {q.interviewFrequency}</span>
            )}
          </div>
          <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">{q.description}</p>
        </button>
        <button
          onClick={() => bookmarks.toggle(q.id)}
          className="shrink-0 text-muted-foreground hover:text-[color:var(--brand)]"
          aria-label={isSaved ? "Remove bookmark" : "Bookmark"}
        >
          {isSaved ? (
            <BookmarkCheck className="h-4 w-4 text-[color:var(--brand)]" />
          ) : (
            <Bookmark className="h-4 w-4" />
          )}
        </button>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-muted-foreground transition ${open ? "rotate-180" : ""}`}
        />
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-border"
          >
            <div className="p-4">
              {/* metadata strip */}
              <div className="mb-3 flex flex-wrap gap-2 text-[11px] text-muted-foreground">
                {q.topic && (
                  <span>
                    Topic: <span className="text-foreground">{q.topic}</span>
                  </span>
                )}
                {q.relatedDataStructure && <span>· DS: {q.relatedDataStructure}</span>}
                {q.relatedAlgorithm && <span>· Pattern: {q.relatedAlgorithm}</span>}
                {q.companies && q.companies.length > 0 && (
                  <span>· Companies: {q.companies.join(", ")}</span>
                )}
              </div>

              {/* Flow tabs */}
              <div className="mb-3 flex flex-wrap gap-1 border-b border-border">
                {FLOW.map((s) => (
                  <button
                    key={s}
                    onClick={() => setStep(s)}
                    className={`border-b-2 px-2.5 py-1.5 text-xs transition ${
                      step === s
                        ? "border-[color:var(--brand)] text-foreground"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>

              {step === "Theory" && (
                <div className="space-y-3 text-sm">
                  <p>{q.description}</p>
                  {q.hints && q.hints.length > 0 && (
                    <details className="rounded border border-border bg-background p-2 text-xs">
                      <summary className="cursor-pointer font-medium">
                        Hints ({q.hints.length})
                      </summary>
                      <ol className="mt-2 list-decimal space-y-1 pl-5 text-muted-foreground">
                        {q.hints.map((h, i) => (
                          <li key={i}>{h}</li>
                        ))}
                      </ol>
                    </details>
                  )}
                </div>
              )}

              {step === "Visualize" && (
                <div className="rounded border border-dashed border-border p-4 text-xs text-muted-foreground">
                  {q.visualizationType && q.visualizationType !== "none"
                    ? `Interactive ${q.visualizationType} visualization available on the module page's Visualization tab.`
                    : "No dedicated visualization for this question. Trace it on paper with a small example."}
                  {q.dryRun && (
                    <pre className="mt-3 whitespace-pre-wrap rounded bg-background p-3 font-mono text-[11px] text-foreground">
                      {q.dryRun}
                    </pre>
                  )}
                </div>
              )}

              {step === "Python" && (
                <div>
                  {!revealed && (
                    <button
                      onClick={() => setRevealed(true)}
                      className="mb-3 inline-flex items-center gap-2 rounded-md gradient-brand px-3 py-1.5 text-xs font-medium text-primary-foreground"
                    >
                      <Sparkles className="h-3 w-3" /> Try it yourself first — reveal solution
                    </button>
                  )}
                  {revealed && (
                    <>
                      {q.approaches && q.approaches.length > 0 ? (
                        <ApproachTabs approaches={q.approaches} />
                      ) : q.pythonSolution ? (
                        <CodeBlock code={q.pythonSolution} title={`${q.id}.py`} />
                      ) : (
                        <p className="text-xs text-muted-foreground">
                          Solution walkthrough coming soon.
                        </p>
                      )}
                    </>
                  )}
                </div>
              )}

              {step === "Complexity" && (
                <div className="grid gap-3 sm:grid-cols-2">
                  {q.approaches && q.approaches.length > 0 ? (
                    q.approaches.map((a) => (
                      <div
                        key={a.name}
                        className="rounded border border-border bg-background p-3 text-xs"
                      >
                        <div className="mb-1 font-semibold">{a.name}</div>
                        <div>
                          Time:{" "}
                          <span className="font-mono text-[color:var(--brand)]">{a.time}</span>
                        </div>
                        <div>
                          Space: <span className="font-mono">{a.space}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded border border-border bg-background p-3 text-xs">
                      <div>
                        Time:{" "}
                        <span className="font-mono text-[color:var(--brand)]">
                          {q.timeComplexity ?? "—"}
                        </span>
                      </div>
                      <div>
                        Space: <span className="font-mono">{q.spaceComplexity ?? "—"}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {step === "Related" && (
                <div className="space-y-3 text-xs">
                  {q.leetcodeLinks && q.leetcodeLinks.length > 0 && (
                    <div>
                      <div className="mb-1 font-semibold">LeetCode</div>
                      <ul className="space-y-1">
                        {q.leetcodeLinks.map((l) => (
                          <li key={l.url}>
                            <a
                              href={l.url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-[color:var(--brand)] hover:underline"
                            >
                              {l.title} <ExternalLink className="h-3 w-3" />
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {q.hackerRankLinks && q.hackerRankLinks.length > 0 && (
                    <div>
                      <div className="mb-1 font-semibold">HackerRank</div>
                      <ul className="space-y-1">
                        {q.hackerRankLinks.map((l) => (
                          <li key={l.url}>
                            <a
                              href={l.url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-[color:var(--brand)] hover:underline"
                            >
                              {l.title} <ExternalLink className="h-3 w-3" />
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {related.length > 0 && (
                    <div>
                      <div className="mb-1 font-semibold">You should solve these next</div>
                      <ul className="space-y-1">
                        {related.map((r) => (
                          <li key={r.id} className="text-muted-foreground">
                            ↳ {r.title}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {step === "Notes" && (
                <div>
                  <label className="mb-1 flex items-center gap-1 text-xs text-muted-foreground">
                    <StickyNote className="h-3 w-3" /> Your notes (saved locally)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={5}
                    placeholder="Trace your thought process, gotchas, mnemonic…"
                    className="w-full rounded border border-input bg-background p-2 text-xs outline-none focus:ring-2 focus:ring-[color:var(--brand)]"
                  />
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function QuestionBank({ bank, filterTopic }: { bank: ModuleBank; filterTopic?: string }) {
  const [category, setCategory] = useState<QuestionCategory | "all">("all");
  const [diff, setDiff] = useState<Difficulty | "all">("all");
  const [onlyOpen, setOnlyOpen] = useState<"all" | "unsolved" | "solved" | "bookmarked">("all");
  const [search, setSearch] = useState("");
  const solvedKey = `dsa-qb-solved:${bank.moduleSlug}`;
  const bookmarkKey = "dsa-qb-bookmarks";
  const solved = useLocalSet(solvedKey);
  const bookmarks = useLocalSet(bookmarkKey);

  const filtered = useMemo(() => {
    const t = search.trim().toLowerCase();
    return bank.questions.filter((q) => {
      if (filterTopic && q.topic !== filterTopic) return false;
      if (category !== "all" && q.category !== category) return false;
      if (diff !== "all" && q.difficulty !== diff) return false;
      if (onlyOpen === "unsolved" && solved.has(q.id)) return false;
      if (onlyOpen === "solved" && !solved.has(q.id)) return false;
      if (onlyOpen === "bookmarked" && !bookmarks.has(q.id)) return false;
      if (
        t &&
        !`${q.title} ${q.description} ${q.tags?.join(" ") ?? ""} ${q.pattern ?? ""}`
          .toLowerCase()
          .includes(t)
      )
        return false;
      return true;
    });
  }, [bank.questions, category, diff, onlyOpen, search, solved, bookmarks, filterTopic]);

  const pct = bank.questions.length ? Math.round((solved.size / bank.questions.length) * 100) : 0;
  const complete = solved.size === bank.questions.length && bank.questions.length > 0;
  const countBy = (c: QuestionCategory) => bank.questions.filter((q) => q.category === c).length;

  return (
    <div>
      {/* Header + progress */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            <BookOpen className="h-5 w-5 text-[color:var(--brand)]" />
            Practice &amp; Interview Question Bank
          </h2>
          <p className="text-xs text-muted-foreground">
            {bank.questions.length} curated questions · {solved.size} solved · {pct}% complete
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-2 w-40 overflow-hidden rounded-full bg-accent">
            <motion.div
              className="h-full gradient-brand"
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
            />
          </div>
          {complete && (
            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/15 px-2 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <Trophy className="h-3 w-3" /> Module Completed
            </span>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap items-center gap-2 rounded-lg border border-border bg-card p-3">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search this bank…"
            className="w-full rounded border border-input bg-background py-1.5 pl-7 pr-2 text-xs outline-none focus:ring-2 focus:ring-[color:var(--brand)]"
          />
        </div>
        <select
          value={diff}
          onChange={(e) => setDiff(e.target.value as Difficulty | "all")}
          className="rounded border border-input bg-background px-2 py-1.5 text-xs"
        >
          <option value="all">All difficulty</option>
          {(
            ["Beginner", "Intermediate", "Advanced", "Interview", "Competitive"] as Difficulty[]
          ).map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
        <select
          value={onlyOpen}
          onChange={(e) => setOnlyOpen(e.target.value as typeof onlyOpen)}
          className="rounded border border-input bg-background px-2 py-1.5 text-xs"
        >
          <option value="all">All</option>
          <option value="unsolved">Unsolved</option>
          <option value="solved">Solved</option>
          <option value="bookmarked">Bookmarked</option>
        </select>
        <Filter className="h-3.5 w-3.5 text-muted-foreground" />
      </div>

      {/* Category chips */}
      <div className="mb-4 flex flex-wrap gap-1.5">
        <button
          onClick={() => setCategory("all")}
          className={`rounded-full px-3 py-1 text-xs font-medium transition ${
            category === "all"
              ? "bg-[color:var(--brand)] text-primary-foreground"
              : "border border-border bg-card text-muted-foreground hover:text-foreground"
          }`}
        >
          All ({bank.questions.length})
        </button>
        {CATEGORIES.map((c) => {
          const n = countBy(c);
          if (n === 0) return null;
          return (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                category === c
                  ? "bg-[color:var(--brand)] text-primary-foreground"
                  : "border border-border bg-card text-muted-foreground hover:text-foreground"
              }`}
            >
              {CATEGORY_LABELS[c]} ({n})
            </button>
          );
        })}
      </div>

      {/* Questions */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            No questions match these filters.
          </div>
        ) : (
          filtered.map((q) => (
            <QuestionCard
              key={q.id}
              q={q}
              allQs={bank.questions}
              solvedKey={solvedKey}
              bookmarkKey={bookmarkKey}
            />
          ))
        )}
      </div>
    </div>
  );
}

export function EdgeCaseGrid({ bank }: { bank: ModuleBank }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {bank.edgeCases.map((e, i) => (
        <div key={i} className="rounded-lg border border-border bg-card p-4">
          <div className="mb-1 text-sm font-semibold">{e.case}</div>
          <p className="text-xs text-muted-foreground">{e.why}</p>
          {e.example && (
            <pre className="mt-2 rounded bg-background p-2 font-mono text-[11px]">{e.example}</pre>
          )}
        </div>
      ))}
    </div>
  );
}

export function RevisionSheet({ bank }: { bank: ModuleBank }) {
  const r = bank.revisionSheet;
  return (
    <div className="space-y-6">
      {r.formulas && r.formulas.length > 0 && (
        <div>
          <div className="mb-2 text-sm font-semibold">Key formulas & patterns</div>
          <ul className="space-y-1">
            {r.formulas.map((f, i) => (
              <li key={i} className="rounded border border-border bg-card p-2 font-mono text-xs">
                {f}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <div className="mb-2 text-sm font-semibold">Time complexity</div>
        <div className="overflow-hidden rounded-lg border border-border">
          <table className="w-full text-xs">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-3 py-2 text-left">Operation</th>
                <th className="px-3 py-2 text-left">Time</th>
              </tr>
            </thead>
            <tbody>
              {r.timeComplexity.map((row) => (
                <tr key={row.op} className="border-t border-border">
                  <td className="px-3 py-2">{row.op}</td>
                  <td className="px-3 py-2 font-mono text-[color:var(--brand)]">{row.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {r.spaceComplexity && r.spaceComplexity.length > 0 && (
        <div>
          <div className="mb-2 text-sm font-semibold">Space complexity</div>
          <div className="overflow-hidden rounded-lg border border-border">
            <table className="w-full text-xs">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-3 py-2 text-left">Situation</th>
                  <th className="px-3 py-2 text-left">Space</th>
                </tr>
              </thead>
              <tbody>
                {r.spaceComplexity.map((row) => (
                  <tr key={row.op} className="border-t border-border">
                    <td className="px-3 py-2">{row.op}</td>
                    <td className="px-3 py-2 font-mono">{row.space}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="mb-2 text-sm font-semibold">Common mistakes</div>
          <ul className="list-disc space-y-1 pl-5 text-xs text-muted-foreground">
            {r.commonMistakes.map((m, i) => (
              <li key={i}>{m}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="mb-2 text-sm font-semibold">Memory tricks</div>
          <ul className="list-disc space-y-1 pl-5 text-xs text-muted-foreground">
            {r.memoryTricks.map((m, i) => (
              <li key={i}>{m}</li>
            ))}
          </ul>
        </div>
      </div>

      {r.mustSolve.length > 0 && (
        <div>
          <div className="mb-2 text-sm font-semibold">Must-solve for this module</div>
          <ul className="space-y-1 text-xs">
            {r.mustSolve.map((id) => {
              const q = bank.questions.find((x) => x.id === id);
              return q ? (
                <li key={id} className="rounded border border-border bg-card px-3 py-2">
                  <span className="font-medium">{q.title}</span>
                  <span className="ml-2 text-muted-foreground">— {q.pattern ?? q.topic}</span>
                </li>
              ) : null;
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
