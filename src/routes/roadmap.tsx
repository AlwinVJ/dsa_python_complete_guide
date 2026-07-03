import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Circle, Lock, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { ROADMAP } from "@/lib/curriculum";
import { useProgress } from "@/lib/progress";

export const Route = createFileRoute("/roadmap")({
  head: () => ({
    meta: [
      { title: "DSA Roadmap — DSA with Python" },
      { name: "description", content: "The complete Data Structures & Algorithms learning roadmap in Python, from Python basics to competitive programming." },
      { property: "og:title", content: "DSA Roadmap — DSA with Python" },
      { property: "og:description", content: "Beginner → advanced DSA path in Python with progress tracking." },
      { property: "og:url", content: "/roadmap" },
    ],
    links: [{ rel: "canonical", href: "/roadmap" }],
  }),
  component: RoadmapPage,
});

function RoadmapPage() {
  const { has, toggle, size, total, pct, ready } = useProgress();
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">DSA Roadmap</h1>
        <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
          A step-by-step path from Python basics to advanced algorithms. Complete a topic to unlock the next.
        </p>
        {ready && (
          <div className="mt-5 card-surface p-4">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-medium">{size} / {total} completed</span>
              <span className="text-muted-foreground">{pct}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div className="h-full gradient-brand transition-all" style={{ width: `${pct}%` }} />
            </div>
          </div>
        )}
      </div>

      <div className="relative">
        <div className="absolute left-5 top-0 bottom-0 w-px bg-border" aria-hidden />
        <ol className="space-y-3">
          {ROADMAP.map((item, i) => {
            const prevDone = i === 0 || has(ROADMAP[i - 1].slug);
            const done = has(item.slug);
            const locked = !prevDone && !done;
            return (
              <motion.li
                key={item.slug}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.02 }}
                className="relative pl-14"
              >
                <div className={`absolute left-0 top-3 grid h-10 w-10 place-items-center rounded-full border-2 ${
                  done ? "border-emerald-500 bg-emerald-500/10 text-emerald-500" :
                  locked ? "border-border bg-muted text-muted-foreground" :
                  "border-[color:var(--brand)] bg-background text-[color:var(--brand)]"
                }`}>
                  {done ? <CheckCircle2 className="h-5 w-5" /> :
                   locked ? <Lock className="h-4 w-4" /> :
                   <Circle className="h-5 w-5" />}
                </div>
                <div className={`card-surface p-4 ${locked ? "opacity-60" : ""}`}>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="text-xs uppercase tracking-wider text-muted-foreground">{item.group} · Step {i + 1}</div>
                      <div className="mt-0.5 font-semibold">{item.title}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggle(item.slug)}
                        className={`rounded-md px-3 py-1.5 text-xs font-medium border transition ${
                          done ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" :
                          "border-border bg-background hover:bg-accent"
                        }`}
                      >
                        {done ? "Undo" : "Mark done"}
                      </button>
                      <Link
                        to={item.route}
                        className="inline-flex items-center gap-1 rounded-md gradient-brand px-3 py-1.5 text-xs font-medium text-primary-foreground"
                      >
                        Open <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
