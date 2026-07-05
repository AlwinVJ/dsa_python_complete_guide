import { createFileRoute, Link } from "@tanstack/react-router";
import { Bookmark, CheckCircle2, Trophy, ArrowRight } from "lucide-react";
import { ROADMAP, getModuleRoute } from "@/lib/curriculum";
import { useLocalSet } from "@/lib/useLocalSet";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Study Hub — DSA with Python" },
      { name: "description", content: "Review your bookmarks, solve practice problems, and explore topics across the curriculum." },
    ],
  }),
  component: DashboardPage,
});

function StatCard({ icon: Icon, label, value, hint }: { icon: typeof Bookmark; label: string; value: string | number; hint?: string }) {
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
  const bookmarks = useLocalSet("resources-bookmarked");
  const solved = useLocalSet("resources-completed");
  const arraysRoute = getModuleRoute({ slug: "arrays", route: "/introduction" });

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="text-4xl font-bold tracking-tight">Study Hub</h1>
      <p className="mt-2 text-muted-foreground">Review your bookmarks and practice logs across the curriculum.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <StatCard icon={Bookmark} label="Bookmarks" value={bookmarks.size} hint="saved reference links" />
        <StatCard icon={CheckCircle2} label="Practice Problems Solved" value={solved.size} hint="completed practice challenges" />
      </div>

      <div className="mt-8">
        <h2 className="mb-3 text-xl font-semibold">DSA Modules</h2>
        <div className="grid gap-2 sm:grid-cols-2">
          {ROADMAP.map((item) => {
            return (
              <Link
                key={item.slug}
                to={getModuleRoute(item)}
                className="card-surface flex items-center justify-between p-3 hover:border-[color:var(--brand)]/50 transition"
              >
                <span className="flex items-center gap-2 text-sm font-medium">
                  <Trophy className="h-4 w-4 text-muted-foreground" />
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
