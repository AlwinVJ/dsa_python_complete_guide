import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft } from "lucide-react";

export type LLNode = { id: string; value: string | number };

export function makeNodes(values: Array<string | number>): LLNode[] {
  return values.map((v, i) => ({
    id: `n-${i}-${String(v)}-${Math.random().toString(36).slice(2, 6)}`,
    value: v,
  }));
}

/**
 * Generic linked-list style visualizer.
 * - `nodes`: ordered nodes to render
 * - `highlight`: indices to emphasize
 * - `compare`: indices to mark as "under comparison"
 * - `slowIdx` / `fastIdx`: labelled pointer overlays (used for Floyd's, middle)
 * - `headLabel` / `tailLabel`: shown above the first / last nodes
 * - `variant`: "singly" (→), "doubly" (↔), "circular" (adds cycle-back arrow)
 * - `cycleTo`: index the tail links back to (for cycle demos); requires variant="singly"
 * - `nullTerminator`: show a trailing NULL slot (default true unless circular / cycleTo set)
 */
export function LinkedListVisualizer({
  nodes,
  highlight = [],
  compare = [],
  slowIdx,
  fastIdx,
  headLabel = "HEAD",
  tailLabel,
  variant = "singly",
  cycleTo,
  nullTerminator,
  size = "md",
}: {
  nodes: LLNode[];
  highlight?: number[];
  compare?: number[];
  slowIdx?: number;
  fastIdx?: number;
  headLabel?: string | null;
  tailLabel?: string | null;
  variant?: "singly" | "doubly" | "circular" | "circular-doubly";
  cycleTo?: number;
  nullTerminator?: boolean;
  size?: "sm" | "md";
}) {
  const isCircular = variant === "circular" || variant === "circular-doubly";
  const isDoubly = variant === "doubly" || variant === "circular-doubly";
  const showNull = nullTerminator ?? (!isCircular && cycleTo === undefined);
  const showCycleBack = isCircular || cycleTo !== undefined;

  const box = size === "sm" ? "h-12 min-w-[70px] text-sm" : "h-14 min-w-[84px] text-base";

  return (
    <div className="w-full overflow-x-auto py-4">
      <div className="relative inline-flex min-w-full items-center gap-1.5 px-2">
        {nodes.map((n, i) => {
          const isHi = highlight.includes(i);
          const isCmp = compare.includes(i);
          const isSlow = slowIdx === i;
          const isFast = fastIdx === i;
          return (
            <div key={n.id} className="relative flex items-center">
              {i === 0 && headLabel && (
                <div className="absolute -top-6 left-0 text-[10px] font-semibold uppercase tracking-wider text-[color:var(--brand)]">
                  ↓ {headLabel}
                </div>
              )}
              {i === nodes.length - 1 && tailLabel && (
                <div className="absolute -top-6 right-0 text-[10px] font-semibold uppercase tracking-wider text-[color:var(--brand-2)]">
                  {tailLabel} ↓
                </div>
              )}
              {(isSlow || isFast) && (
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-semibold">
                  {isSlow && (
                    <span className="mr-1 rounded bg-emerald-500/20 px-1 text-emerald-500">
                      slow
                    </span>
                  )}
                  {isFast && (
                    <span className="rounded bg-amber-500/20 px-1 text-amber-500">fast</span>
                  )}
                </div>
              )}
              <AnimatePresence initial={false}>
                <motion.div
                  layout
                  initial={{ opacity: 0, y: -10, scale: 0.85 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  transition={{ type: "spring", stiffness: 320, damping: 26 }}
                  className={`inline-flex overflow-hidden rounded-md border font-mono transition-colors ${box} ${
                    isHi
                      ? "border-[color:var(--brand)] bg-[color:var(--brand)]/15 shadow-[0_0_0_3px_color-mix(in_oklab,var(--brand)_25%,transparent)]"
                      : isCmp
                        ? "border-[color:var(--warn)] bg-[color:var(--warn)]/15"
                        : "border-border bg-card"
                  }`}
                >
                  <div className="flex flex-1 items-center justify-center px-2">{n.value}</div>
                  <div className="flex w-8 items-center justify-center border-l border-border/70 bg-muted/40 text-[10px] text-muted-foreground">
                    {i === nodes.length - 1 && !showCycleBack && !showNull ? "∅" : "•"}
                  </div>
                </motion.div>
              </AnimatePresence>
              {i < nodes.length - 1 && (
                <div className="mx-0.5 flex flex-col items-center text-muted-foreground">
                  <ArrowRight className="h-4 w-4" />
                  {isDoubly && <ArrowLeft className="-mt-1 h-4 w-4" />}
                </div>
              )}
            </div>
          );
        })}

        {showNull && nodes.length > 0 && (
          <>
            <ArrowRight className="mx-0.5 h-4 w-4 text-muted-foreground" />
            <div className="rounded-md border border-dashed border-border bg-muted/30 px-3 py-2 font-mono text-xs text-muted-foreground">
              NULL
            </div>
          </>
        )}

        {showCycleBack && nodes.length > 1 && (
          <div className="ml-2 flex items-center gap-1 rounded-md border border-dashed border-[color:var(--warn)]/50 bg-[color:var(--warn)]/10 px-2 py-1 text-[10px] text-[color:var(--warn)]">
            ↩ back to node {cycleTo ?? 0}
          </div>
        )}
      </div>
    </div>
  );
}

/** Compact static memory diagram — value slot + pointer slot per node. */
export function LinkedListMemory({ nodes }: { nodes: LLNode[] }) {
  return (
    <div className="my-2 flex flex-wrap items-center gap-2 rounded-lg border border-border bg-muted/30 p-4 font-mono text-xs">
      <span className="text-[color:var(--brand)]">HEAD →</span>
      {nodes.map((n, i) => (
        <span key={n.id} className="inline-flex items-center gap-1">
          <span className="inline-flex overflow-hidden rounded border border-border bg-card">
            <span className="border-r border-border px-2 py-1">{n.value}</span>
            <span className="bg-muted/50 px-2 py-1 text-muted-foreground">
              {i === nodes.length - 1 ? "∅" : "•"}
            </span>
          </span>
          {i < nodes.length - 1 && <span className="text-muted-foreground">→</span>}
        </span>
      ))}
      {nodes.length === 0 && <span className="text-muted-foreground">(empty)</span>}
    </div>
  );
}
