import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, GitBranch, Sparkles } from "lucide-react";

const APPLICATIONS = [
  "Autocomplete",
  "Spell Checker",
  "Prefix Search",
  "Dictionary Lookup",
  "Search Suggestions",
  "IP Routing",
];

const CANONICAL_TRIE_HREF: string = "/trees/trie/introduction";

/**
 * The Tries course's lesson slugs still resolve (old bookmarks and deep
 * links keep working), but we intentionally don't duplicate Trie theory,
 * visualizers, or Python implementations here. The canonical, complete
 * implementation lives under Trees → Variants → Trie (/trees/trie/*),
 * with its own interactive visualizer. This page just explains why and
 * sends visitors there.
 */
export function TrieRedirect() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-16 text-center sm:px-6 sm:py-24">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex flex-col items-center"
      >
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-border bg-card shadow-sm">
          <GitBranch className="h-9 w-9 text-[color:var(--brand)]" />
        </div>
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs uppercase tracking-wider text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-[color:var(--brand)]" />
          Lives under Trees
        </div>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Trie</h1>
        <p className="mt-4 max-w-lg text-base text-muted-foreground sm:text-lg">
          A trie is fundamentally a tree data structure — each edge is a character, and each
          root-to-node path spells a stored prefix. It's commonly discussed alongside string
          algorithms because of what it's used for, but structurally it belongs with the rest of the
          tree family.
        </p>
        <p className="mt-3 max-w-lg text-sm text-muted-foreground">
          To keep a single source of truth, the platform maintains one complete Trie course — with
          theory, the interactive visualizer, and Python implementations — under Trees.
        </p>

        <div className="mt-8">
          <Link
            to={CANONICAL_TRIE_HREF}
            className="inline-flex items-center gap-2 rounded-md gradient-brand px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
          >
            Open Complete Trie Course
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 w-full text-left">
          <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Common applications
          </div>
          <div className="flex flex-wrap gap-2">
            {APPLICATIONS.map((a) => (
              <span
                key={a}
                className="rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground"
              >
                {a}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
