import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronDown, Search, Clock, Tag, ExternalLink, BookOpen } from "lucide-react";
import { CodeBlock } from "@/components/CodeBlock";
import { ComplexityBadge } from "@/components/Callout";
import type { InterviewCategory, InterviewDifficulty, InterviewQuestion } from "@/lib/qa/types";

const DIFF_ORDER: InterviewDifficulty[] = ["Beginner", "Intermediate", "Advanced", "FAANG"];
const CATEGORIES: (InterviewCategory | "All")[] = [
  "All",
  "Theory",
  "Conceptual",
  "Coding",
  "Optimization",
  "Edge Case",
  "Company",
  "Follow-up",
];

const diffColor: Record<InterviewDifficulty, string> = {
  Beginner: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
  Intermediate: "bg-amber-500/15 text-amber-500 border-amber-500/30",
  Advanced: "bg-rose-500/15 text-rose-500 border-rose-500/30",
  FAANG: "bg-fuchsia-500/15 text-fuchsia-500 border-fuchsia-500/30",
};

export function InterviewQuestions({ questions }: { questions: InterviewQuestion[] }) {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]>("All");
  const [diff, setDiff] = useState<InterviewDifficulty | "All">("All");
  const [openId, setOpenId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return questions.filter((it) => {
      if (cat !== "All" && it.category !== cat) return false;
      if (diff !== "All" && it.difficulty !== diff) return false;
      if (!q) return true;
      const hay = (
        it.title +
        " " +
        it.explanation.join(" ") +
        " " +
        (it.tags?.join(" ") ?? "")
      ).toLowerCase();
      return hay.includes(q);
    });
  }, [questions, query, cat, diff]);

  const grouped = useMemo(() => {
    const g: Record<InterviewDifficulty, InterviewQuestion[]> = {
      Beginner: [],
      Intermediate: [],
      Advanced: [],
      FAANG: [],
    };
    filtered.forEach((q) => g[q.difficulty].push(q));
    return g;
  }, [filtered]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search interview questions…"
            className="w-full rounded-md border border-border bg-background py-2 pl-9 pr-3 text-sm outline-none focus:border-[color:var(--brand)]"
          />
        </div>
        <div className="flex flex-wrap gap-1">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`rounded-md border px-3 py-1 text-xs transition ${
                cat === c
                  ? "border-[color:var(--brand)] bg-[color:var(--brand)]/10 text-[color:var(--brand)]"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-1">
          {(["All", ...DIFF_ORDER] as const).map((d) => (
            <button
              key={d}
              onClick={() => setDiff(d)}
              className={`rounded-md border px-3 py-1 text-xs transition ${
                diff === d
                  ? "border-foreground text-foreground"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <div className="text-xs text-muted-foreground">
        {filtered.length} of {questions.length} question{questions.length === 1 ? "" : "s"}
      </div>

      {DIFF_ORDER.map((d) => {
        const items = grouped[d];
        if (items.length === 0) return null;
        return (
          <section key={d}>
            <div className="mb-3 flex items-center gap-2">
              <span
                className={`rounded-md border px-2 py-0.5 text-xs font-semibold ${diffColor[d]}`}
              >
                {d}
              </span>
              <span className="text-xs text-muted-foreground">
                {items.length} question{items.length === 1 ? "" : "s"}
              </span>
            </div>
            <ul className="space-y-2">
              {items.map((q) => {
                const isOpen = openId === q.id;
                return (
                  <li key={q.id} className="card-surface overflow-hidden">
                    <button
                      onClick={() => setOpenId(isOpen ? null : q.id)}
                      className="flex w-full items-start justify-between gap-3 px-4 py-3 text-left"
                    >
                      <div className="flex-1">
                        <div className="mb-1 flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-wider text-muted-foreground">
                          <span className="rounded-md border border-border bg-background px-2 py-0.5">
                            {q.category}
                          </span>
                          {q.estMin && (
                            <span className="inline-flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {q.estMin}m
                            </span>
                          )}
                          {q.tags?.slice(0, 3).map((t) => (
                            <span key={t} className="inline-flex items-center gap-1">
                              <Tag className="h-3 w-3" />
                              {t}
                            </span>
                          ))}
                        </div>
                        <div className="text-sm font-semibold">{q.title}</div>
                      </div>
                      <ChevronDown
                        className={`mt-1 h-4 w-4 shrink-0 text-muted-foreground transition ${isOpen ? "rotate-180" : ""}`}
                      />
                    </button>

                    {isOpen && (
                      <div className="border-t border-border bg-background/40 px-4 py-4">
                        <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
                          {q.explanation.map((p, k) => (
                            <p key={k}>{p}</p>
                          ))}
                        </div>

                        {q.code && (
                          <div className="mt-4">
                            <CodeBlock code={q.code} title="python" />
                          </div>
                        )}

                        {(q.time || q.space) && (
                          <div className="mt-3 flex flex-wrap gap-2 text-xs">
                            {q.time && (
                              <span className="inline-flex items-center gap-1">
                                <span className="text-muted-foreground">Time</span>
                                <ComplexityBadge value={q.time} />
                              </span>
                            )}
                            {q.space && (
                              <span className="inline-flex items-center gap-1">
                                <span className="text-muted-foreground">Space</span>
                                <ComplexityBadge value={q.space} />
                              </span>
                            )}
                          </div>
                        )}

                        {q.followUp && (
                          <div className="mt-4 rounded-md border border-border bg-background p-3 text-sm">
                            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                              Follow-up
                            </div>
                            <div className="mt-1">{q.followUp}</div>
                          </div>
                        )}

                        {q.relatedAlgorithm && (
                          <div className="mt-3 text-xs">
                            <span className="text-muted-foreground">Related pattern: </span>
                            <Link
                              to="/algorithms/$slug"
                              params={{ slug: q.relatedAlgorithm }}
                              className="text-[color:var(--brand)] hover:underline"
                            >
                              {q.relatedAlgorithm}
                            </Link>
                          </div>
                        )}

                        {q.leetcode && (
                          <div className="mt-3">
                            <a
                              href={q.leetcode.url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-3 py-1.5 text-xs hover:border-[color:var(--brand)]/60"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                              LeetCode · {q.leetcode.title}
                              <span
                                className={`rounded px-1.5 py-0.5 text-[10px] ${
                                  q.leetcode.difficulty === "Easy"
                                    ? "bg-emerald-500/15 text-emerald-500"
                                    : q.leetcode.difficulty === "Medium"
                                      ? "bg-amber-500/15 text-amber-500"
                                      : "bg-rose-500/15 text-rose-500"
                                }`}
                              >
                                {q.leetcode.difficulty}
                              </span>
                            </a>
                          </div>
                        )}

                        {q.relatedLessons && q.relatedLessons.length > 0 && (
                          <div className="mt-4">
                            <div className="mb-2 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                              <BookOpen className="h-3.5 w-3.5" /> Related lessons
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {q.relatedLessons.map((r) => (
                                <Link
                                  key={r.to}
                                  to={r.to as any}
                                  className="rounded-md border border-border bg-background px-2 py-1 text-xs hover:border-[color:var(--brand)]/60 hover:text-[color:var(--brand)]"
                                >
                                  {r.label} →
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}

      {filtered.length === 0 && (
        <div className="card-surface p-6 text-center text-sm text-muted-foreground">
          No interview questions match your filters.
        </div>
      )}
    </div>
  );
}
