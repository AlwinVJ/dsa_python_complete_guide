import { motion } from "framer-motion";
import { ArrowRight, Hash } from "lucide-react";
import type { HTBucketEntry } from "@/lib/hash-tables/types";

/**
 * Bucket-table visualization. Renders `capacity` numbered buckets as a
 * responsive grid. Each bucket displays its chain (for separate chaining) or
 * its single occupant (for open addressing). Optional `probeIndices` draws
 * a highlighted probe path; `collisionIndex` flashes a slot red.
 */
export function HashTableVisualizer({
  buckets,
  capacity,
  caption,
  probeIndices,
  collisionIndex,
  labels,
  showLoadFactor = false,
}: {
  buckets: (HTBucketEntry[] | null)[];
  capacity?: number;
  caption?: string;
  probeIndices?: number[];
  collisionIndex?: number;
  labels?: (string | undefined)[];
  showLoadFactor?: boolean;
}) {
  const cap = capacity ?? buckets.length;
  const cells = Array.from({ length: cap }, (_, i) => buckets[i] ?? null);
  const totalEntries = cells.reduce((s, c) => s + (c?.length ?? 0), 0);
  const loadFactor = cap > 0 ? (totalEntries / cap).toFixed(2) : "0.00";
  const probeSet = new Set(probeIndices ?? []);

  return (
    <div className="card-surface p-4 sm:p-5">
      {showLoadFactor && (
        <div className="mb-3 flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded-md border border-border bg-muted/40 px-2 py-0.5">
            capacity <span className="font-mono">{cap}</span>
          </span>
          <span className="rounded-md border border-border bg-muted/40 px-2 py-0.5">
            entries <span className="font-mono">{totalEntries}</span>
          </span>
          <span className="rounded-md border border-[color:var(--brand)]/40 bg-[color:var(--brand)]/10 px-2 py-0.5 text-[color:var(--brand)]">
            load factor <span className="font-mono">{loadFactor}</span>
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {cells.map((chain, i) => {
          const isProbe = probeSet.has(i);
          const isCollision = collisionIndex === i;
          const filled = chain && chain.length > 0;
          return (
            <motion.div
              key={i}
              layout
              className={[
                "flex items-stretch overflow-hidden rounded-lg border",
                isCollision
                  ? "border-rose-500/60 bg-rose-500/10"
                  : isProbe
                    ? "border-amber-500/60 bg-amber-500/10"
                    : filled
                      ? "border-[color:var(--brand)]/40 bg-[color:var(--brand)]/5"
                      : "border-border bg-muted/30",
              ].join(" ")}
            >
              <div className="flex w-16 shrink-0 flex-col items-center justify-center border-r border-border bg-background/40 px-2 py-2 text-center">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  bucket
                </div>
                <div className="font-mono text-sm font-semibold">{i}</div>
                {labels?.[i] && (
                  <div className="mt-0.5 font-mono text-[9px] text-muted-foreground">
                    {labels[i]}
                  </div>
                )}
              </div>
              <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5 p-2">
                {filled ? (
                  chain!.map((e, j) => (
                    <div key={j} className="flex items-center gap-1">
                      <motion.span
                        layout
                        className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-2 py-1 font-mono text-xs"
                      >
                        <span className="font-semibold">{e.key}</span>
                        {e.value !== undefined && (
                          <>
                            <span className="text-muted-foreground">→</span>
                            <span className="text-muted-foreground">{String(e.value)}</span>
                          </>
                        )}
                      </motion.span>
                      {j < chain!.length - 1 && (
                        <ArrowRight className="h-3 w-3 text-muted-foreground" />
                      )}
                    </div>
                  ))
                ) : (
                  <span className="font-mono text-xs italic text-muted-foreground">— empty —</span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {caption && <p className="mt-3 text-xs italic text-muted-foreground">{caption}</p>}
    </div>
  );
}

/** Compact key → hash → bucket flow diagram used in "how hashing works" lessons. */
export function HashFlowDiagram({
  keyText,
  hashValue,
  bucket,
  capacity,
  method,
  caption,
}: {
  keyText: string;
  hashValue: number | string;
  bucket: number;
  capacity: number;
  method?: string;
  caption?: string;
}) {
  const steps = [
    { label: "Key", value: `"${keyText}"` },
    { label: method ? `Hash · ${method}` : "Hash Function", value: String(hashValue), icon: true },
    { label: `Bucket = h mod ${capacity}`, value: `#${bucket}`, brand: true },
  ];
  return (
    <div className="card-surface p-4">
      <div className="grid gap-2 sm:grid-cols-3 sm:items-stretch sm:gap-3">
        {steps.map((s, i) => (
          <div
            key={i}
            className={`flex flex-col items-center justify-center rounded-lg border p-3 text-center ${
              s.brand
                ? "border-[color:var(--brand)]/50 bg-[color:var(--brand)]/10"
                : "border-border bg-muted/30"
            }`}
          >
            <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground">
              {s.icon && <Hash className="h-3 w-3" />} {s.label}
            </div>
            <div className="mt-1 font-mono text-sm font-semibold">{s.value}</div>
          </div>
        ))}
      </div>
      {caption && <p className="mt-3 text-xs italic text-muted-foreground">{caption}</p>}
    </div>
  );
}
