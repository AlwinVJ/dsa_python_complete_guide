import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Home, Map, Sparkles } from "lucide-react";
import { PageShell } from "@/components/Callout";
import { Badge } from "@/components/ui/badge";

export type InterviewPrepComingSoonProps = {
  title: string;
  description: string;
  planned: string[];
};

export function InterviewPrepComingSoon({
  title,
  description,
  planned,
}: InterviewPrepComingSoonProps) {
  return (
    <PageShell>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex flex-col items-center text-center"
      >
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-border bg-card shadow-sm">
          <Sparkles className="h-9 w-9 text-[color:var(--brand)]" />
        </div>
        <Badge variant="secondary" className="mb-4">
          Coming Soon
        </Badge>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{title}</h1>
        <p className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
          {description}
        </p>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          This section is under active development and will include comprehensive learning
          material in future updates.
        </p>
      </motion.div>

      <div className="mx-auto mt-10 max-w-2xl rounded-xl border border-border bg-card p-6 shadow-sm">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Planned content
        </h2>
        <ul className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
          {planned.map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--brand)]" />
              <span className="text-foreground/90">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-sm font-medium transition hover:bg-accent"
        >
          <Home className="h-4 w-4" />
          Return to Home
        </Link>
        <Link
          to="/roadmap"
          className="inline-flex items-center gap-2 rounded-md gradient-brand px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
        >
          <Map className="h-4 w-4" />
          Return to Learning Roadmap
        </Link>
      </div>
    </PageShell>
  );
}
