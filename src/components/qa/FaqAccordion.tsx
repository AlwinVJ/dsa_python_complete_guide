import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronDown, Search, Sparkles, Lightbulb, AlertTriangle } from "lucide-react";
import { CodeBlock } from "@/components/CodeBlock";
import { ComplexityBadge } from "@/components/Callout";
import type { FaqCategory, FaqItem } from "@/lib/qa/types";
import { parseInlineMarkdown } from "@/components/course/LessonView";

const CATEGORIES: (FaqCategory | "All")[] = [
  "All",
  "Concepts",
  "Operations",
  "Memory",
  "Design",
  "Practical",
];

export function FaqAccordion({ faqs }: { faqs: FaqItem[] }) {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]>("All");
  const [open, setOpen] = useState<number | null>(0);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return faqs.filter((f) => {
      if (cat !== "All" && f.category !== cat) return false;
      if (!q) return true;
      const hay = (f.q + " " + f.answer.join(" ") + " " + (f.code ?? "")).toLowerCase();
      return hay.includes(q);
    });
  }, [faqs, query, cat]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search questions, code, keywords…"
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
      </div>

      <div className="text-xs text-muted-foreground">
        {filtered.length} of {faqs.length} question{faqs.length === 1 ? "" : "s"}
      </div>

      <ul className="space-y-2">
        {filtered.map((f, i) => {
          const isOpen = open === i;
          return (
            <li key={i} className="card-surface overflow-hidden">
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-start justify-between gap-3 px-4 py-3 text-left"
              >
                <div className="flex-1">
                  <div className="mb-1 inline-flex items-center gap-2 rounded-md border border-border bg-background px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                    {f.category}
                  </div>
                  <div className="text-sm font-semibold">{f.q}</div>
                </div>
                <ChevronDown
                  className={`mt-1 h-4 w-4 shrink-0 text-muted-foreground transition ${isOpen ? "rotate-180" : ""}`}
                />
              </button>
              {isOpen && (
                <div className="border-t border-border bg-background/40 px-4 py-4">
                  <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
                    {f.answer.map((p, k) => (
                      <p key={k}>{parseInlineMarkdown(p)}</p>
                    ))}
                  </div>

                  {f.code && (
                    <div className="mt-4">
                      <CodeBlock code={f.code} title="python" />
                    </div>
                  )}

                  {(f.time || f.space) && (
                    <div className="mt-3 flex flex-wrap gap-2 text-xs">
                      {f.time && (
                        <span className="inline-flex items-center gap-1">
                          <span className="text-muted-foreground">Time</span>
                          <ComplexityBadge value={f.time} />
                        </span>
                      )}
                      {f.space && (
                        <span className="inline-flex items-center gap-1">
                          <span className="text-muted-foreground">Space</span>
                          <ComplexityBadge value={f.space} />
                        </span>
                      )}
                    </div>
                  )}

                  {f.didYouKnow && (
                    <div className="mt-4 flex gap-3 rounded-md border border-[color:var(--brand)]/30 bg-[color:var(--brand)]/5 p-3 text-sm">
                      <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--brand)]" />
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-wider text-[color:var(--brand)]">
                          Did you know?
                        </div>
                        <div className="mt-1 text-muted-foreground">{parseInlineMarkdown(f.didYouKnow)}</div>
                      </div>
                    </div>
                  )}

                  {f.mistake && (
                    <div className="mt-3 flex gap-3 rounded-md border border-amber-500/30 bg-amber-500/5 p-3 text-sm">
                      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-wider text-amber-500">
                          Common mistake
                        </div>
                        <div className="mt-1 text-muted-foreground">{parseInlineMarkdown(f.mistake)}</div>
                      </div>
                    </div>
                  )}

                  {f.related && f.related.length > 0 && (
                    <div className="mt-4">
                      <div className="mb-2 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        <Lightbulb className="h-3.5 w-3.5" /> Learn more
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {f.related.map((r) => (
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
        {filtered.length === 0 && (
          <li className="card-surface p-6 text-center text-sm text-muted-foreground">
            No questions match your search. Try a different keyword or category.
          </li>
        )}
      </ul>
    </div>
  );
}
