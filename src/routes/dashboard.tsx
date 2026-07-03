import { createFileRoute, Link } from "@tanstack/react-router";
import { Trophy, Flame, Bookmark, CheckCircle2, TrendingUp, ArrowRight } from "lucide-react";
import { ROADMAP } from "@/lib/curriculum";
import { useProgress, useStreak, nextUnlocked } from "@/lib/progress";
import { useLocalSet } from "@/lib/useLocalSet";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Learning Dashboard — DSA with Python" },
      { name: "description", content: "Track your progress, streak, bookmarks and solved problems across all DSA modules." },
      { property: "og:title", content: "Learning Dashboard — DSA with Python" },
      { property: "og:url", content: "/dashboard" },
    ],
    links: [{ rel: "canonical", href: "/dashboard" }],
  }),
  component: DashboardPage,
});

function StatCard({ icon: Icon, label, value, hint }: { icon: typeof Trophy; label: string; value: string | number; hint?: string }) {
  return (
    <div className="card-surface p-5">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
        <Icon className="h-3.5 w-3.5 text-[color:var(--brand)]" /> {label}
      </div>
      <div className="mt-2 text-3xl font-bold">{value}</div>
      {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
    </div>
  );
}

function DashboardPage() {
  const { completed, size, total, pct } = useProgress();
  const streak = useStreak();
  const bookmarks = useLocalSet("resources-bookmarked");
  const solved = useLocalSet("resources-completed");
  const next = nextUnlocked(completed);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="text-4xl font-bold tracking-tight">Your Dashboard</h1>
      <p className="mt-2 text-muted-foreground">A snapshot of your DSA journey.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={TrendingUp} label="Overall Progress" value={`${pct}%`} hint={`${size} of ${total} modules`} />
        <StatCard icon={Flame} label="Current Streak" value={streak} hint={streak === 1 ? "day" : "days"} />
        <StatCard icon={Bookmark} label="Bookmarks" value={bookmarks.size} hint="saved resources" />
        <StatCard icon={CheckCircle2} label="Solved" value={solved.size} hint="practice problems" />
      </div>

      <div className="mt-6 card-surface p-6">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Recommended next</div>
            <div className="mt-1 text-lg font-semibold">{next ? next.title : "🎉 You've completed the roadmap!"}</div>
          </div>
          {next && (
            <Link to={next.route} className="inline-flex items-center gap-1.5 rounded-md gradient-brand px-4 py-2 text-sm font-medium text-primary-foreground">
              Continue <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div className="h-full gradient-brand transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className="mt-8">
        <h2 className="mb-3 text-xl font-semibold">Modules</h2>
        <div className="grid gap-2 sm:grid-cols-2">
          {ROADMAP.map((item) => {
            const done = completed.has(item.slug);
            return (
              <Link
                key={item.slug}
                to={item.route}
                className="card-surface flex items-center justify-between p-3 hover:border-[color:var(--brand)]/50 transition"
              >
                <span className="flex items-center gap-2 text-sm">
                  {done ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <Trophy className="h-4 w-4 text-muted-foreground" />}
                  {item.title}
                </span>
                <span className="text-xs text-muted-foreground">{item.group}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
