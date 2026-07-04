import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpDown, PlayCircle } from "lucide-react";

/**
 * The Sorting course's lesson slugs still resolve (so old bookmarks and
 * deep links keep working — see routing notes in the platform report), but
 * we intentionally don't duplicate sorting theory here. The canonical,
 * interactive Sorting content lives at /sorting (reference + algorithm
 * picker) and /playgrounds/sorting (step-by-step visualizer). This page
 * just points visitors there instead of showing a second copy.
 */
export function SortingRedirect() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-16 text-center sm:px-6 sm:py-24">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex flex-col items-center"
      >
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-border bg-card shadow-sm">
          <ArrowUpDown className="h-9 w-9 text-[color:var(--brand)]" />
        </div>
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs uppercase tracking-wider text-muted-foreground">
          Moved
        </div>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Sorting Algorithms</h1>
        <p className="mt-4 max-w-lg text-base text-muted-foreground sm:text-lg">
          Sorting now lives in one place: a single reference covering all 11 algorithms, plus an
          interactive step-by-step visualizer.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/sorting"
            className="inline-flex items-center gap-2 rounded-md gradient-brand px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
          >
            <ArrowLeft className="h-4 w-4" />
            Go to Sorting Reference
          </Link>
          <Link
            to="/playgrounds/sorting"
            className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-sm font-medium transition hover:bg-accent"
          >
            <PlayCircle className="h-4 w-4" />
            Open Sorting Playground
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
