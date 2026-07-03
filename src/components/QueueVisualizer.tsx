import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";

/**
 * Static queue visualization — responsive, wrapping cells with FRONT and REAR
 * pointers plus simulated addresses. No horizontal scroll: cells flow onto
 * multiple rows when the viewport is narrow, preserving queue order via a
 * small arrow between consecutive cells.
 */
export function QueueVisualizer({
  items,
  showAddresses = true,
  base = 0x2000,
  stride = 0x20,
  frontLabel = "FRONT",
  rearLabel = "REAR",
  caption,
  variant = "linear",
  capacity,
  headIndex = 0,
}: {
  items: Array<string | number>;
  showAddresses?: boolean;
  base?: number;
  stride?: number;
  frontLabel?: string;
  rearLabel?: string;
  caption?: string;
  variant?: "linear" | "circular";
  capacity?: number;
  headIndex?: number;
}) {
  const cap = capacity ?? items.length;
  const cells = variant === "circular"
    ? Array.from({ length: Math.max(cap, items.length) }, (_, slot) => {
        const occupiedIndex = (slot - headIndex + cap) % cap;
        const filled = occupiedIndex < items.length;
        return { slot, value: filled ? items[occupiedIndex] : null, filled };
      })
    : items.map((v, i) => ({ slot: i, value: v, filled: true }));

  const frontIdx = variant === "circular" ? headIndex : 0;
  const rearIdx = variant === "circular"
    ? (headIndex + items.length - 1 + cap) % cap
    : items.length - 1;

  return (
    <div className="my-4">
      {/* Header labels for the linear variant — the circular variant flags the
          pointers on the cell itself, so we omit the top bar there. */}
      {variant === "linear" && cells.length > 0 && (
        <div className="mb-2 flex items-center justify-between text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          <span>← {frontLabel} (dequeue)</span>
          <span>{rearLabel} (enqueue) →</span>
        </div>
      )}

      <div className="flex flex-wrap gap-x-1 gap-y-6 pt-4">
        <AnimatePresence initial={false}>
          {cells.map((c, idx) => {
            const isFront = c.filled && idx === frontIdx;
            const isRear = c.filled && idx === rearIdx;
            const highlight = isFront || isRear;
            const isLast = idx === cells.length - 1;
            return (
              <div key={`${c.slot}-${String(c.value)}`} className="flex items-stretch">
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 340, damping: 28 }}
                  className={`relative flex w-[64px] flex-col items-center gap-0.5 rounded-md border px-2 py-2 text-sm font-mono transition sm:w-[76px] ${
                    !c.filled
                      ? "border-dashed border-border bg-muted/30 text-muted-foreground"
                      : highlight
                        ? "border-[color:var(--brand)] bg-[color:var(--brand)]/10 text-foreground shadow-sm"
                        : "border-border bg-card text-foreground"
                  }`}
                >
                  <span className="text-[10px] text-muted-foreground">[{c.slot}]</span>
                  <span className="font-semibold">{c.filled ? String(c.value) : "·"}</span>
                  {showAddresses && (
                    <span className="text-[9px] text-muted-foreground">
                      0x{(base + c.slot * stride).toString(16).toUpperCase()}
                    </span>
                  )}
                  {isFront && (
                    <span className="absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-semibold text-[color:var(--brand)]">
                      ↓ {frontLabel}
                    </span>
                  )}
                  {isRear && !isFront && (
                    <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-semibold text-[color:var(--brand)]">
                      ↑ {rearLabel}
                    </span>
                  )}
                </motion.div>
                {!isLast && (
                  <div className="flex items-center px-0.5 text-muted-foreground/60">
                    <ArrowRight className="h-3 w-3" />
                  </div>
                )}
              </div>
            );
          })}
        </AnimatePresence>
        {cells.length === 0 && (
          <div className="w-full rounded-md border border-dashed border-border p-6 text-center text-xs text-muted-foreground">
            empty queue — FRONT = REAR = null
          </div>
        )}
      </div>
      {caption && <p className="mt-6 text-center text-xs italic text-muted-foreground">{caption}</p>}
    </div>
  );
}
