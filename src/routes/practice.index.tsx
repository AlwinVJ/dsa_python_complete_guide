import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search as SearchIcon, Filter, Layers, Bookmark, CheckCircle2 } from "lucide-react";
import { BANKS, allQuestions, CATEGORY_LABELS } from "@/lib/question-bank";
import type { Difficulty, QuestionCategory } from "@/lib/question-bank/types";
import { useLocalSet } from "@/lib/useLocalSet";

export const Route = createFileRoute("/practice/")({
  head: () => ({
    meta: [
      { title: "Practice & Interview Question Bank — DSA with Python" },
      { name: "description", content: "Search hundreds of curated DSA questions across every module — filter by pattern, difficulty, module, and interview frequency." },
      { property: "og:title", content: "Practice & Interview Question Bank — DSA with Python" },
      { property: "og:description", content: "Curated DSA questions with hints, approaches, complexity, and LeetCode links." },
      { property: "og:url", content: "/practice" },
    ],
    links: [{ rel: "canonical", href: "/practice" }],
  }),
  component: PracticePage,
});

const DIFFS: Difficulty[] = ["Beginner", "Intermediate", "Advanced", "Interview", "Competitive"];
const CATS: QuestionCategory[] = ["theory", "implementation", "intermediate", "advanced", "edge-case", "optimization", "interview"];

function PracticePage() {
  const questions = useMemo(() => allQuestions(), []);
  const [q, setQ] = useState("");
  const [module, setModule] = useState<string>("all");
  const [diff, setDiff] = useState<Difficulty | "all">("all");
  const [cat, setCat] = useState<QuestionCategory | "all">("all");
  const [showBookmarked, setShowBookmarked] = useState(false);
  const bookmarks = useLocalSet("dsa-qb-bookmarks");

  // Aggregate solved from per-module storage
  const solvedIds = useMemo(() => {
    if (typeof window === "undefined") return new Set<string>();
    const ids = new Set<string>();
    for (const slug of Object.keys(BANKS)) {
      try {
        const raw = localStorage.getItem(`dsa-qb-solved:${slug}`);
        if (raw) (JSON.parse(raw) as string[]).forEach((id) => ids.add(id));
      } catch { /* noop */ }
    }
    return ids;
  }, []);

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    return questions.filter((x) => {
      if (module !== "all" && x.moduleSlug !== module) return false;
      if (diff !== "all" && x.difficulty !== diff) return false;
      if (cat !== "all" && x.category !== cat) return false;
      if (showBookmarked && !bookmarks.has(x.id)) return false;
      if (t && !`${x.title} ${x.description} ${x.pattern ?? ""} ${x.tags?.join(" ") ?? ""} ${x.moduleSlug}`.toLowerCase().includes(t)) return false;
      return true;
    });
  }, [questions, q, module, diff, cat, showBookmarked, bookmarks]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="mb-6">
        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
          <Layers className="h-3.5 w-3.5 text-[color:var(--brand)]" />
          Curated Question Bank
        </div>
        <h1 className="text-4xl font-bold tracking-tight">Practice &amp; Interview Question Bank</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          {questions.length} curated questions across {Object.keys(BANKS).length} modules — theory, implementation, edge cases, and interview classics.
        </p>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-2 rounded-lg border border-border bg-card p-3">
        <div className="relative min-w-[200px] flex-1">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Try 'sliding window', 'LRU', 'topological'…"
            className="w-full rounded-md border border-input bg-background py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-[color:var(--brand)]"
          />
        </div>
        <select value={module} onChange={(e) => setModule(e.target.value)} className="rounded border border-input bg-background px-2 py-2 text-xs">
          <option value="all">All modules</option>
          {Object.values(BANKS).map((b) => (
            <option key={b.moduleSlug} value={b.moduleSlug}>{b.moduleTitle}</option>
          ))}
        </select>
        <select value={diff} onChange={(e) => setDiff(e.target.value as Difficulty | "all")} className="rounded border border-input bg-background px-2 py-2 text-xs">
          <option value="all">All difficulty</option>
          {DIFFS.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
        <select value={cat} onChange={(e) => setCat(e.target.value as QuestionCategory | "all")} className="rounded border border-input bg-background px-2 py-2 text-xs">
          <option value="all">All categories</option>
          {CATS.map((c) => <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>)}
        </select>
        <button
          onClick={() => setShowBookmarked((v) => !v)}
          className={`inline-flex items-center gap-1 rounded border px-2 py-1.5 text-xs ${
            showBookmarked ? "border-[color:var(--brand)] bg-[color:var(--brand)]/10 text-[color:var(--brand)]" : "border-border bg-background text-muted-foreground"
          }`}
        >
          <Bookmark className="h-3 w-3" /> Bookmarked
        </button>
        <Filter className="h-4 w-4 text-muted-foreground" />
      </div>

      <div className="mb-3 text-xs text-muted-foreground">
        {filtered.length} result{filtered.length === 1 ? "" : "s"}
      </div>

      <ul className="space-y-2">
        {filtered.map((x) => {
          const solved = solvedIds.has(x.id);
          return (
            <li key={x.id}>
              <Link
                to="/modules/$slug"
                params={{ slug: x.moduleSlug }}
                className="flex flex-wrap items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm hover:border-[color:var(--brand)]/60 transition"
              >
                {solved && <CheckCircle2 className="h-4 w-4 text-[color:var(--good)]" />}
                <span className={`font-medium ${solved ? "line-through opacity-70" : ""}`}>{x.title}</span>
                <span className="text-[10px] rounded border border-border px-1.5 py-0.5 text-muted-foreground">{BANKS[x.moduleSlug]?.moduleTitle ?? x.moduleSlug}</span>
                <span className="text-[10px] rounded border border-border px-1.5 py-0.5 text-muted-foreground">{CATEGORY_LABELS[x.category]}</span>
                <span className="text-[10px] rounded border border-border px-1.5 py-0.5 text-muted-foreground">{x.difficulty}</span>
                {x.pattern && <span className="text-[10px] rounded border border-border px-1.5 py-0.5 text-muted-foreground">{x.pattern}</span>}
                {x.interviewFrequency && <span className="ml-auto text-[10px] text-muted-foreground">🔥 {x.interviewFrequency}</span>}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
