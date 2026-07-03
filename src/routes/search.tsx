import { createFileRoute, Link } from "@tanstack/react-router";
import { Search as SearchIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { NAV_SECTIONS } from "@/lib/nav";
import { allQuestions, BANKS } from "@/lib/question-bank";

export const Route = createFileRoute("/search")({
  head: () => ({
    meta: [
      { title: "Search — DSA with Python" },
      { name: "description", content: "Search across all data structures, algorithms, patterns, questions, and references." },
      { property: "og:title", content: "Search — DSA with Python" },
      { property: "og:url", content: "/search" },
    ],
    links: [{ rel: "canonical", href: "/search" }],
  }),
  component: SearchPage,
});

type Entry = { label: string; to: string; group: string; params?: Record<string, string> };

function SearchPage() {
  const [q, setQ] = useState("");

  const navIndex: Entry[] = useMemo(
    () => NAV_SECTIONS.flatMap((s) => s.items.map((i) => ({ label: i.label, to: i.to, group: s.title }))),
    [],
  );

  const questionIndex: Entry[] = useMemo(
    () =>
      allQuestions().map((x) => ({
        label: x.title,
        to: `/modules/${x.moduleSlug}`,
        group: `Question · ${BANKS[x.moduleSlug]?.moduleTitle ?? x.moduleSlug}`,
      })),
    [],
  );

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    const all = [...navIndex, ...questionIndex];
    if (!term) return navIndex;
    return all.filter((e) => e.label.toLowerCase().includes(term) || e.group.toLowerCase().includes(term)).slice(0, 200);
  }, [q, navIndex, questionIndex]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">Search</h1>
      <p className="mt-2 text-muted-foreground">Find any data structure, algorithm, pattern, question, or reference.</p>
      <div className="relative mt-6">
        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Try 'sliding window', 'LRU', 'reverse linked list'…"
          className="w-full rounded-md border border-input bg-background py-3 pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-[color:var(--brand)]"
        />
      </div>

      <div className="mt-6 text-xs text-muted-foreground">{results.length} result{results.length === 1 ? "" : "s"}</div>
      <ul className="mt-2 space-y-1">
        {results.map((r, i) => (
          <li key={`${r.to}-${i}`}>
            <Link to={r.to} className="flex items-center justify-between rounded-md border border-border bg-card px-3 py-2 text-sm hover:border-[color:var(--brand)]/60 transition">
              <span className="truncate pr-2">{r.label}</span>
              <span className="text-xs text-muted-foreground shrink-0">{r.group}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
