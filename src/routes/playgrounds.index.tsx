import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, PageHeader } from "@/components/Callout";
import {
  ArrowUpDown,
  ArrowRight,
  Network,
  Search,
  ListTree,
  Link2,
  Layers,
  ListOrdered,
  Hash,
  GitBranch,
  Mountain,
  Type,
  Grid3x3,
  Coins,
  Undo2,
  Route as RouteIcon,
  Text,
  Sparkles,
  RotateCcw,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const Route = createFileRoute("/playgrounds/")({
  head: () => ({
    meta: [
      { title: "Playgrounds — DSA with Python" },
      {
        name: "description",
        content:
          "Interactive DSA playgrounds — experiment with arrays, linked lists, stacks, queues, hash tables, trees, graphs, sorting, and searching visually.",
      },
      { property: "og:title", content: "Interactive DSA Playgrounds" },
      {
        property: "og:description",
        content: "One hub for every hands-on DSA visualizer on the platform.",
      },
    ],
  }),
  component: Page,
});

type Playground = {
  title: string;
  href: string;
  icon: LucideIcon;
  meta: string;
  description: string;
};

type ComingSoon = {
  title: string;
  icon: LucideIcon;
  description: string;
};

const AVAILABLE: Playground[] = [
  {
    title: "Arrays Playground",
    href: "/slicing",
    icon: ListTree,
    meta: "Slicing · Insertion · Deletion",
    description:
      "Visualize slice ranges, positive/negative indexing, insertions, and deletions on a live Python list.",
  },
  {
    title: "Linked List Playground",
    href: "/linked-lists/foundations/node-playground",
    icon: Link2,
    meta: "Nodes · Pointers · HEAD chip",
    description:
      "Build nodes, wire up next pointers, drag the HEAD, and watch simulated memory addresses stay stable.",
  },
  {
    title: "Stack Playground",
    href: "/stacks/foundations/playground",
    icon: Layers,
    meta: "Push · Pop · Peek",
    description:
      "Push and pop values on a LIFO stack — see top/size update live and trace the classic call-stack pattern.",
  },
  {
    title: "Queue Playground",
    href: "/queues/foundations/playground",
    icon: ListOrdered,
    meta: "Enqueue · Dequeue · FIFO",
    description:
      "Enqueue and dequeue values, watch the front/rear pointers move, and understand FIFO ordering visually.",
  },
  {
    title: "Hash Table Playground",
    href: "/hash-tables/tables/introduction",
    icon: Hash,
    meta: "Buckets · Hash function · Collisions",
    description:
      "Insert keys, watch the hash function pick a bucket, and see collisions resolved with chaining.",
  },
  {
    title: "Tree Playground",
    href: "/trees/foundations/playground",
    icon: GitBranch,
    meta: "BST · Traversals · Metrics",
    description:
      "Insert values into a Binary Search Tree, run the four traversal orders, and track height, leaves, and levels.",
  },
  {
    title: "Graph Playground",
    href: "/playgrounds/graph",
    icon: Network,
    meta: "Build · drag · connect",
    description:
      "Create vertices and edges on a canvas, toggle directed/weighted mode, and inspect V, E, components, and cycles.",
  },
  {
    title: "Sorting Playground",
    href: "/playgrounds/sorting",
    icon: ArrowUpDown,
    meta: "11 algorithms · animations",
    description:
      "Bubble, Selection, Insertion, Merge, Quick, Heap, Counting, Radix, Bucket, Shell, and TimSort — step by step.",
  },
  {
    title: "Searching Playground",
    href: "/playgrounds/searching",
    icon: Search,
    meta: "6 algorithms · animations",
    description:
      "Linear, Binary, Jump, Interpolation, Exponential, and Ternary Search — visualize intervals and comparisons.",
  },
  {
    title: "Recursion Playground",
    href: "/playgrounds/recursion",
    icon: RotateCcw,
    meta: "Call stack · step-through",
    description:
      "Step through factorial, Fibonacci, sum, power, and GCD — watch stack frames push and pop live.",
  },
];

const COMING_SOON: ComingSoon[] = [
  {
    title: "Heap Playground",
    icon: Mountain,
    description: "Insert / extract on a min-heap with sift-up and sift-down animations.",
  },
  {
    title: "Trie Playground",
    icon: Type,
    description: "Insert words, autocomplete prefixes, and inspect shared branches.",
  },
  {
    title: "Dynamic Programming Playground",
    icon: Grid3x3,
    description: "Fill DP tables step by step and trace the optimal substructure.",
  },
  {
    title: "Greedy Algorithms Playground",
    icon: Coins,
    description: "Coin change, interval scheduling, and activity selection walkthroughs.",
  },
  {
    title: "Backtracking Playground",
    icon: Undo2,
    description: "N-Queens and Sudoku solver with recursive branch visualization.",
  },
  {
    title: "Graph Algorithms Playground",
    icon: RouteIcon,
    description: "BFS, DFS, Dijkstra, and A* animated over your custom graph.",
  },
  {
    title: "String Algorithms Playground",
    icon: Text,
    description: "KMP, Rabin-Karp, and Z-algorithm pattern matching visualized.",
  },
];

function Page() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Playgrounds"
        title="Interactive Playgrounds"
        description="The central hub for hands-on DSA experimentation. Pick a playground, tweak inputs, and watch algorithms run step by step."
      />

      <section>
        <h2 className="mb-4 text-lg font-semibold">Available now</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {AVAILABLE.map((p) => {
            const Icon = p.icon;
            return (
              <Link
                key={p.href}
                to={p.href}
                className="card-surface group flex flex-col gap-3 p-5 transition hover:border-[color:var(--brand)]/60"
              >
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-md gradient-brand text-primary-foreground">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <div className="text-base font-semibold">{p.title}</div>
                    <div className="text-xs text-muted-foreground">{p.meta}</div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{p.description}</p>
                <span className="mt-auto inline-flex items-center gap-1 text-sm font-medium text-[color:var(--brand)]">
                  Launch playground{" "}
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="mb-4 inline-flex items-center gap-2 text-lg font-semibold">
          <Sparkles className="h-4 w-4 text-[color:var(--brand)]" />
          Coming soon
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {COMING_SOON.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.title}
                aria-disabled="true"
                className="card-surface pointer-events-none flex cursor-not-allowed flex-col gap-3 p-5 opacity-70"
              >
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-md border border-border bg-muted text-muted-foreground">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-base font-semibold">{p.title}</div>
                      <span className="rounded-full border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-amber-500">
                        Coming Soon
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{p.description}</p>
              </div>
            );
          })}
        </div>
      </section>
    </PageShell>
  );
}
