import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, Construction } from "lucide-react";
import type { ReactNode } from "react";

export type ComingSoonProps = {
  title?: string;
  description?: string;
  icon?: ReactNode;
  /** Previous link href (e.g., prior lesson). If omitted, button is hidden. */
  backHref?: string;
  backLabel?: string;
  /** Course overview href. If omitted, button is hidden. */
  overviewHref?: string;
  overviewLabel?: string;
};

export function ComingSoon({
  title = "Coming Soon",
  description = "This lesson is currently under development and will be added in a future update.",
  icon,
  backHref,
  backLabel = "Return to Previous Lesson",
  overviewHref,
  overviewLabel = "Go to Course Overview",
}: ComingSoonProps) {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-16 text-center sm:px-6 sm:py-24">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex flex-col items-center"
      >
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-border bg-card shadow-sm">
          {icon ?? <Construction className="h-9 w-9 text-[color:var(--brand)]" />}
        </div>
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs uppercase tracking-wider text-muted-foreground">
          In progress
        </div>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{title}</h1>
        <p className="mt-4 max-w-lg text-base text-muted-foreground sm:text-lg">{description}</p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {backHref && (
            <Link
              to={backHref}
              className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-sm font-medium transition hover:bg-accent"
            >
              <ArrowLeft className="h-4 w-4" />
              {backLabel}
            </Link>
          )}
          {overviewHref && (
            <Link
              to={overviewHref}
              className="inline-flex items-center gap-2 rounded-md gradient-brand px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
            >
              <BookOpen className="h-4 w-4" />
              {overviewLabel}
            </Link>
          )}
        </div>
      </motion.div>
    </div>
  );
}
