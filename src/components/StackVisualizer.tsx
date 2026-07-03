import { motion, AnimatePresence } from "framer-motion";

/**
 * Static stack visualization — bottom → top box tower with a "TOP" pointer
 * and simulated heap addresses. Reused by lesson pages and the playground.
 */
export function StackVisualizer({
  items,
  highlightTop = true,
  showAddresses = true,
  base = 0x1000,
  stride = 0x20,
  label = "TOP",
  caption,
}: {
  items: Array<string | number>;
  highlightTop?: boolean;
  showAddresses?: boolean;
  base?: number;
  stride?: number;
  label?: string;
  caption?: string;
}) {
  // Top of the stack renders first (visually stacked upward).
  const reversed = [...items].map((v, i) => ({ v, i })).reverse();
  const topIdx = items.length - 1;

  return (
    <div className="my-4">
      <div className="mx-auto flex w-full max-w-md flex-col items-stretch gap-1.5">
        <div className="mb-1 text-center text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          stack grows upward ↑
        </div>
        <AnimatePresence initial={false}>
          {reversed.map(({ v, i }) => {
            const isTop = i === topIdx;
            return (
              <motion.div
                key={`${i}-${v}`}
                layout
                initial={{ opacity: 0, y: -12, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 340, damping: 28 }}
                className={`relative flex items-center justify-between rounded-md border px-3 py-2 text-sm font-mono transition ${
                  isTop && highlightTop
                    ? "border-[color:var(--brand)] bg-[color:var(--brand)]/10 shadow-sm"
                    : "border-border bg-card"
                }`}
              >
                <span className="text-xs text-muted-foreground">[{i}]</span>
                <span className="flex-1 text-center font-semibold text-foreground">{String(v)}</span>
                <span className="w-20 text-right text-[10px] text-muted-foreground">
                  {showAddresses ? `0x${(base + i * stride).toString(16).toUpperCase()}` : ""}
                </span>
                {isTop && highlightTop && (
                  <span className="absolute -right-14 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-[color:var(--brand)]">
                    ← {label}
                  </span>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
        {items.length === 0 && (
          <div className="rounded-md border border-dashed border-border p-6 text-center text-xs text-muted-foreground">
            empty stack — TOP = null
          </div>
        )}
        <div className="mt-1 flex items-center justify-center gap-1 text-[10px] uppercase tracking-widest text-muted-foreground">
          <span className="h-px w-8 bg-border" />
          base
          <span className="h-px w-8 bg-border" />
        </div>
      </div>
      {caption && <p className="mt-2 text-center text-xs italic text-muted-foreground">{caption}</p>}
    </div>
  );
}
