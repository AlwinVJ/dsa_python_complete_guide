import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  Circle,
  ExternalLink,
  Search,
  Sparkles,
  ArrowRight,
  BadgeCheck,
  Filter,
} from "lucide-react";
import { PageHeader, PageShell } from "@/components/Callout";
import {
  ALL_RESOURCES,
  ARTICLES,
  BEGINNER_RESOURCES,
  HACKERRANK_ROADMAP,
  LEARNING_ORDER,
  LEETCODE_ROADMAP,
  OFFICIAL_DOCS,
  PRACTICE_ADVANCED,
  PRACTICE_BEGINNER,
  PRACTICE_INTERMEDIATE,
  VISUALIZATIONS,
  type Difficulty,
  type Problem,
  type Resource,
} from "@/lib/resources";
import { useLocalSet } from "@/lib/useLocalSet";

export const Route = createFileRoute("/resources")({
  head: () => ({
    meta: [
      { title: "References & Practice Resources — DSA with Python" },
      {
        name: "description",
        content:
          "Curated docs, tutorials, articles, visualizations and coding practice roadmaps (LeetCode + HackerRank) for mastering Python lists and arrays.",
      },
      { property: "og:title", content: "References & Practice Resources" },
      {
        property: "og:description",
        content:
          "One-stop hub of high-quality external resources for learning Python lists, from beginner to interview-ready.",
      },
    ],
  }),
  component: ResourcesPage,
});

const DIFF_COLOR: Record<Difficulty, string> = {
  Beginner: "var(--good)",
  Intermediate: "var(--warn)",
  Advanced: "var(--bad)",
};

function DifficultyBadge({ value }: { value: Difficulty }) {
  const color = DIFF_COLOR[value];
  return (
    <span
      className="inline-flex items-center rounded-md border px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider"
      style={{
        borderColor: color,
        color,
        background: `color-mix(in oklab, ${color} 12%, transparent)`,
      }}
    >
      {value}
    </span>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active?: boolean;
  onClick?: () => void;
  children: ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-3 py-1 text-xs transition ${
        active
          ? "border-[color:var(--brand)] bg-[color:var(--brand)]/10 text-foreground"
          : "border-border bg-card text-muted-foreground hover:text-foreground hover:border-[color:var(--brand)]/40"
      }`}
    >
      {children}
    </button>
  );
}

function Favicon({ url }: { url: string }) {
  let host = "";
  try {
    host = new URL(url).hostname;
  } catch {
    return null;
  }
  return (
    <img
      src={`https://www.google.com/s2/favicons?domain=${host}&sz=64`}
      alt=""
      className="h-5 w-5 rounded-sm"
      loading="lazy"
    />
  );
}

function ResourceCard({
  r,
  bookmarked,
  visited,
  onToggleBookmark,
  onVisit,
}: {
  r: Resource;
  bookmarked: boolean;
  visited: boolean;
  onToggleBookmark: () => void;
  onVisit: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-surface group flex flex-col gap-3 p-4 transition hover:border-[color:var(--brand)]/50 hover:shadow-lg"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <Favicon url={r.url} />
          <span className="text-xs text-muted-foreground">{r.site ?? new URL(r.url).hostname}</span>
        </div>
        <div className="flex items-center gap-1">
          {r.official && (
            <span
              className="inline-flex items-center gap-1 rounded-md border border-[color:var(--brand)]/40 bg-[color:var(--brand)]/10 px-1.5 py-0.5 text-[10px] font-medium text-[color:var(--brand)]"
              title="Official documentation"
            >
              <BadgeCheck className="h-3 w-3" /> Official
            </span>
          )}
          {visited && (
            <span
              className="inline-flex items-center rounded-md border border-[color:var(--good)]/40 bg-[color:var(--good)]/10 px-1.5 py-0.5 text-[10px] font-medium text-[color:var(--good)]"
              title="You visited this"
            >
              Visited
            </span>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-base font-semibold leading-tight">{r.title}</h3>
        {r.author && <div className="mt-0.5 text-xs text-muted-foreground">by {r.author}</div>}
        <p className="mt-1.5 text-sm text-muted-foreground">{r.description}</p>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        <DifficultyBadge value={r.difficulty} />
        <span className="rounded-md border border-border bg-muted/50 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
          {r.type}
        </span>
        {r.readingTime && (
          <span className="text-[10px] text-muted-foreground">· {r.readingTime}</span>
        )}
        {r.tags.slice(0, 3).map((t) => (
          <span key={t} className="text-[10px] text-muted-foreground/80">
            #{t}
          </span>
        ))}
      </div>

      <div className="mt-auto flex items-center gap-2 pt-1">
        <a
          href={r.url}
          target="_blank"
          rel="noreferrer"
          onClick={onVisit}
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md gradient-brand px-3 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-95"
        >
          Open <ExternalLink className="h-3 w-3" />
        </a>
        <button
          onClick={onToggleBookmark}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border hover:bg-accent"
          aria-label={bookmarked ? "Remove bookmark" : "Bookmark"}
          title={bookmarked ? "Remove bookmark" : "Bookmark"}
        >
          {bookmarked ? (
            <BookmarkCheck className="h-4 w-4 text-[color:var(--brand)]" />
          ) : (
            <Bookmark className="h-4 w-4" />
          )}
        </button>
      </div>
    </motion.div>
  );
}

function ProblemRow({
  p,
  done,
  onToggle,
  onVisit,
}: {
  p: Problem;
  done: boolean;
  onToggle: () => void;
  onVisit: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-md border border-border bg-card p-3 transition hover:border-[color:var(--brand)]/40">
      <button
        onClick={onToggle}
        className="shrink-0"
        aria-label={done ? "Mark as not done" : "Mark as done"}
      >
        {done ? (
          <CheckCircle2 className="h-5 w-5 text-[color:var(--good)]" />
        ) : (
          <Circle className="h-5 w-5 text-muted-foreground" />
        )}
      </button>
      <div className="min-w-0 flex-1">
        <div
          className={`truncate text-sm font-medium ${done ? "line-through text-muted-foreground" : ""}`}
        >
          {p.title}
        </div>
        <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-[11px] text-muted-foreground">
          <span>{p.platform}</span>
          {p.time && <span>· {p.time}</span>}
          {p.acceptance && <span>· acc {p.acceptance}</span>}
          {p.tags.slice(0, 2).map((t) => (
            <span key={t}>#{t}</span>
          ))}
        </div>
      </div>
      <DifficultyBadge value={p.difficulty} />
      <a
        href={p.url}
        target="_blank"
        rel="noreferrer"
        onClick={onVisit}
        className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-2 py-1 text-xs hover:bg-accent"
      >
        Solve <ExternalLink className="h-3 w-3" />
      </a>
    </div>
  );
}

function SectionHeader({
  id,
  eyebrow,
  title,
  description,
}: {
  id: string;
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div id={id} className="mb-5 scroll-mt-20">
      <div className="text-xs font-semibold uppercase tracking-wider text-[color:var(--brand)]">
        {eyebrow}
      </div>
      <h2 className="mt-1 text-2xl font-semibold">{title}</h2>
      {description && <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>}
    </div>
  );
}

const FILTERS = [
  "Beginner",
  "Intermediate",
  "Advanced",
  "Documentation",
  "Tutorial",
  "Blog",
  "Practice",
  "Visualization",
  "Official",
  "Free",
] as const;

function ResourceGrid({
  items,
  bookmarks,
  visited,
}: {
  items: Resource[];
  bookmarks: ReturnType<typeof useLocalSet>;
  visited: ReturnType<typeof useLocalSet>;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((r) => (
        <ResourceCard
          key={r.id}
          r={r}
          bookmarked={bookmarks.has(r.id)}
          visited={visited.has(r.id)}
          onToggleBookmark={() => bookmarks.toggle(r.id)}
          onVisit={() => {
            if (!visited.has(r.id)) visited.toggle(r.id);
          }}
        />
      ))}
      {items.length === 0 && (
        <div className="col-span-full rounded-md border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          No resources match your filters.
        </div>
      )}
    </div>
  );
}

function ResourcesPage() {
  const bookmarks = useLocalSet("pylist:bookmarks");
  const visited = useLocalSet("pylist:visited");
  const problemsDone = useLocalSet("pylist:problems-done");

  const [q, setQ] = useState("");
  const [active, setActive] = useState<Set<string>>(new Set());

  const toggleFilter = (f: string) =>
    setActive((prev) => {
      const next = new Set(prev);
      if (next.has(f)) next.delete(f);
      else next.add(f);
      return next;
    });

  const matchesFilters = (r: Resource) => {
    if (q) {
      const hay = `${r.title} ${r.description} ${r.tags.join(" ")} ${r.site ?? ""}`.toLowerCase();
      if (!hay.includes(q.toLowerCase())) return false;
    }
    if (active.size === 0) return true;
    for (const f of active) {
      if (["Beginner", "Intermediate", "Advanced"].includes(f)) {
        if (r.difficulty !== f) return false;
      } else if (["Documentation", "Tutorial", "Blog", "Practice", "Visualization"].includes(f)) {
        if (r.type !== f) return false;
      } else if (f === "Official" && !r.official) {
        return false;
      } else if (f === "Free" && !r.free) {
        return false;
      }
    }
    return true;
  };

  const filteredOfficial = useMemo(() => OFFICIAL_DOCS.filter(matchesFilters), [q, active]);
  const filteredBeginner = useMemo(() => BEGINNER_RESOURCES.filter(matchesFilters), [q, active]);
  const filteredArticles = useMemo(() => ARTICLES.filter(matchesFilters), [q, active]);
  const filteredViz = useMemo(() => VISUALIZATIONS.filter(matchesFilters), [q, active]);

  const totalProblems =
    PRACTICE_BEGINNER.length +
    PRACTICE_INTERMEDIATE.length +
    PRACTICE_ADVANCED.length +
    LEETCODE_ROADMAP.reduce((a, l) => a + l.problems.length, 0) +
    HACKERRANK_ROADMAP.reduce((a, l) => a + l.problems.length, 0);

  const progressPct = totalProblems ? Math.round((problemsDone.size / totalProblems) * 100) : 0;

  const toc = [
    { id: "official", label: "Official Docs" },
    { id: "beginner", label: "Beginner" },
    { id: "articles", label: "Articles" },
    { id: "viz", label: "Visualizations" },
    { id: "practice", label: "Practice Roadmap" },
    { id: "leetcode", label: "LeetCode Roadmap" },
    { id: "hackerrank", label: "HackerRank Roadmap" },
    { id: "order", label: "Learning Order" },
    { id: "bookmarks", label: "My Bookmarks" },
  ];

  const bookmarkedResources = ALL_RESOURCES.filter((r) => bookmarks.has(r.id));

  return (
    <PageShell>
      <PageHeader
        eyebrow="External Resources"
        title="References & Practice Resources"
        description="A curated hub of the best docs, articles, visualizers and coding practice — organized by topic and difficulty so you can go from beginner to interview-ready without hunting for links."
      />

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-4 text-xs text-muted-foreground">
        <Link to="/" className="hover:text-foreground">
          Home
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-foreground">Resources</span>
      </nav>

      {/* Progress card */}
      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <div className="card-surface p-4">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Bookmarks</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-semibold">{bookmarks.size}</span>
            <span className="text-xs text-muted-foreground">
              / {ALL_RESOURCES.length} resources
            </span>
          </div>
        </div>
        <div className="card-surface p-4">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Visited</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-semibold">{visited.size}</span>
            <span className="text-xs text-muted-foreground">resources</span>
          </div>
        </div>
        <div className="card-surface p-4">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">
            Problems solved
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-semibold">{problemsDone.size}</span>
            <span className="text-xs text-muted-foreground">/ {totalProblems}</span>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full gradient-brand transition-all"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* TOC */}
      <div className="mb-6 flex flex-wrap gap-1.5">
        {toc.map((t) => (
          <a
            key={t.id}
            href={`#${t.id}`}
            className="rounded-md border border-border bg-card px-2.5 py-1 text-xs text-muted-foreground hover:text-foreground hover:border-[color:var(--brand)]/40"
          >
            {t.label}
          </a>
        ))}
      </div>

      {/* Search + filters */}
      <div className="mb-8 rounded-lg border border-border bg-card p-3">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search all resources…"
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <span className="mr-1 inline-flex items-center gap-1 text-[11px] uppercase tracking-wider text-muted-foreground">
            <Filter className="h-3 w-3" /> Filter
          </span>
          {FILTERS.map((f) => (
            <Chip key={f} active={active.has(f)} onClick={() => toggleFilter(f)}>
              {f}
            </Chip>
          ))}
          {(active.size > 0 || q) && (
            <button
              onClick={() => {
                setActive(new Set());
                setQ("");
              }}
              className="ml-2 text-xs text-[color:var(--brand)] hover:underline"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Section 1: Official Docs */}
      <section className="mb-12">
        <SectionHeader
          id="official"
          eyebrow="Section 1"
          title="Official Documentation"
          description="The source of truth — always start here."
        />
        <ResourceGrid items={filteredOfficial} bookmarks={bookmarks} visited={visited} />
      </section>

      {/* Section 2: Beginner */}
      <section className="mb-12">
        <SectionHeader
          id="beginner"
          eyebrow="Section 2"
          title="Beginner Learning Resources"
          description="Tutorial sites with runnable examples, ordered from most beginner-friendly."
        />
        <ResourceGrid items={filteredBeginner} bookmarks={bookmarks} visited={visited} />
      </section>

      {/* Section 3: Articles */}
      <section className="mb-12">
        <SectionHeader
          id="articles"
          eyebrow="Section 3"
          title="Free Articles & Deep Dives"
          description="Long-form pieces covering internals, memory, complexity, and interview prep."
        />
        <ResourceGrid items={filteredArticles} bookmarks={bookmarks} visited={visited} />
      </section>

      {/* Section 4: Visualizations */}
      <section className="mb-12">
        <SectionHeader
          id="viz"
          eyebrow="Section 4"
          title="Interactive Visualization Tools"
          description="Complementary visualizers to see algorithms and Python memory step by step."
        />
        <ResourceGrid items={filteredViz} bookmarks={bookmarks} visited={visited} />
      </section>

      {/* Section 5: Practice roadmap */}
      <section className="mb-12">
        <SectionHeader
          id="practice"
          eyebrow="Section 5"
          title="Coding Practice Roadmap"
          description="Progress from basic list manipulation to interview-level problems. Check them off as you go."
        />

        <div className="space-y-8">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <DifficultyBadge value="Beginner" />
              <h3 className="text-lg font-semibold">Beginner — Fundamentals</h3>
            </div>
            <div className="grid gap-2">
              {PRACTICE_BEGINNER.map((p) => (
                <ProblemRow
                  key={p.id}
                  p={p}
                  done={problemsDone.has(p.id)}
                  onToggle={() => problemsDone.toggle(p.id)}
                  onVisit={() => {
                    if (!visited.has(p.id)) visited.toggle(p.id);
                  }}
                />
              ))}
            </div>
          </div>

          <div>
            <div className="mb-3 flex items-center gap-2">
              <DifficultyBadge value="Intermediate" />
              <h3 className="text-lg font-semibold">Intermediate — Classic Patterns</h3>
            </div>
            <div className="grid gap-2">
              {PRACTICE_INTERMEDIATE.map((p) => (
                <ProblemRow
                  key={p.id}
                  p={p}
                  done={problemsDone.has(p.id)}
                  onToggle={() => problemsDone.toggle(p.id)}
                  onVisit={() => {
                    if (!visited.has(p.id)) visited.toggle(p.id);
                  }}
                />
              ))}
            </div>
          </div>

          <div>
            <div className="mb-3 flex items-center gap-2">
              <DifficultyBadge value="Advanced" />
              <h3 className="text-lg font-semibold">Advanced — Interview Ready</h3>
            </div>
            <div className="grid gap-2">
              {PRACTICE_ADVANCED.map((p) => (
                <ProblemRow
                  key={p.id}
                  p={p}
                  done={problemsDone.has(p.id)}
                  onToggle={() => problemsDone.toggle(p.id)}
                  onVisit={() => {
                    if (!visited.has(p.id)) visited.toggle(p.id);
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 6: LeetCode */}
      <section className="mb-12">
        <SectionHeader
          id="leetcode"
          eyebrow="Section 6"
          title="LeetCode Array Roadmap"
          description="Structured by learning stage — master each level before moving on."
        />
        <div className="space-y-6">
          {LEETCODE_ROADMAP.map((lvl) => (
            <div key={lvl.level} className="card-surface p-4">
              <div className="mb-2 flex items-baseline justify-between gap-3">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-[color:var(--brand)]">
                    {lvl.level}
                  </div>
                  <h3 className="text-lg font-semibold">{lvl.title}</h3>
                  <p className="text-xs text-muted-foreground">{lvl.description}</p>
                </div>
                <div className="text-xs text-muted-foreground">
                  {lvl.problems.filter((p) => problemsDone.has(p.id)).length} /{" "}
                  {lvl.problems.length}
                </div>
              </div>
              <div className="grid gap-2">
                {lvl.problems.map((p) => (
                  <ProblemRow
                    key={p.id}
                    p={p}
                    done={problemsDone.has(p.id)}
                    onToggle={() => problemsDone.toggle(p.id)}
                    onVisit={() => {
                      if (!visited.has(p.id)) visited.toggle(p.id);
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 7: HackerRank */}
      <section className="mb-12">
        <SectionHeader
          id="hackerrank"
          eyebrow="Section 7"
          title="HackerRank Roadmap"
          description="Grouped by track — warm-up through interview prep kit."
        />
        <div className="space-y-6">
          {HACKERRANK_ROADMAP.map((lvl) => (
            <div key={lvl.level} className="card-surface p-4">
              <div className="mb-2 flex items-baseline justify-between gap-3">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-[color:var(--brand)]">
                    {lvl.level}
                  </div>
                  <h3 className="text-lg font-semibold">{lvl.title}</h3>
                  <p className="text-xs text-muted-foreground">{lvl.description}</p>
                </div>
                <div className="text-xs text-muted-foreground">
                  {lvl.problems.filter((p) => problemsDone.has(p.id)).length} /{" "}
                  {lvl.problems.length}
                </div>
              </div>
              <div className="grid gap-2">
                {lvl.problems.map((p) => (
                  <ProblemRow
                    key={p.id}
                    p={p}
                    done={problemsDone.has(p.id)}
                    onToggle={() => problemsDone.toggle(p.id)}
                    onVisit={() => {
                      if (!visited.has(p.id)) visited.toggle(p.id);
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 8: Learning Order */}
      <section className="mb-12">
        <SectionHeader
          id="order"
          eyebrow="Section 8"
          title="Recommended Learning Order"
          description="Follow the path top-to-bottom for a smooth on-ramp from beginner to competitive programmer."
        />
        <ol className="relative space-y-3 border-l-2 border-border pl-6">
          {LEARNING_ORDER.map((s, i) => (
            <motion.li
              key={s.title}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.03 }}
              className="relative"
            >
              <span className="absolute -left-[33px] top-1 grid h-6 w-6 place-items-center rounded-full gradient-brand text-[10px] font-semibold text-primary-foreground">
                {i + 1}
              </span>
              <div className="card-surface flex items-center justify-between gap-3 p-3">
                <div>
                  <div className="text-sm font-semibold">{s.title}</div>
                  <div className="text-xs text-muted-foreground">{s.note}</div>
                </div>
                {s.to ? (
                  <Link
                    to={s.to}
                    className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-2 py-1 text-xs hover:bg-accent"
                  >
                    Open <ArrowRight className="h-3 w-3" />
                  </Link>
                ) : (
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    External
                  </span>
                )}
              </div>
            </motion.li>
          ))}
        </ol>
      </section>

      {/* Bookmarks */}
      <section className="mb-16">
        <SectionHeader
          id="bookmarks"
          eyebrow="Personal"
          title="My Bookmarks"
          description="Resources you saved for later. Stored locally in your browser."
        />
        {bookmarkedResources.length === 0 ? (
          <div className="rounded-md border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            <Sparkles className="mx-auto mb-2 h-5 w-5 text-[color:var(--brand)]" />
            No bookmarks yet — click the <BookOpen className="inline h-3 w-3" /> icon on any
            resource to save it.
          </div>
        ) : (
          <ResourceGrid items={bookmarkedResources} bookmarks={bookmarks} visited={visited} />
        )}
      </section>
    </PageShell>
  );
}
