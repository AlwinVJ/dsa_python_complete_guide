import { motion, AnimatePresence } from "framer-motion";
import type { ReactNode } from "react";

export type ListItem = { id: string; value: string | number | boolean | null };

export function makeItems(values: Array<string | number | boolean | null>): ListItem[] {
  return values.map((v, i) => ({
    id: `${i}-${String(v)}-${Math.random().toString(36).slice(2, 7)}`,
    value: v,
  }));
}

function displayValue(v: ListItem["value"]) {
  if (v === null) return "None";
  if (typeof v === "boolean") return v ? "True" : "False";
  if (typeof v === "string") return `"${v}"`;
  return String(v);
}

export function ListVisualizer({
  items,
  highlight,
  compare,
  sorted,
  showIndices = true,
  showNegative = false,
  size = "md",
}: {
  items: ListItem[];
  highlight?: number[];
  compare?: number[];
  sorted?: number[];
  showIndices?: boolean;
  showNegative?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const sizeMap = {
    sm: "h-10 min-w-10 text-sm px-2",
    md: "h-14 min-w-14 text-base px-3",
    lg: "h-16 min-w-16 text-lg px-4",
  }[size];

  return (
    <div className="w-full overflow-x-auto py-2">
      <div className="inline-flex flex-col gap-1 min-w-full">
        {showIndices && (
          <div className="flex gap-2">
            {items.map((_, i) => (
              <div
                key={i}
                className={`${sizeMap} flex items-center justify-center text-xs text-muted-foreground`}
              >
                {i}
              </div>
            ))}
          </div>
        )}
        <div className="flex gap-2">
          <AnimatePresence initial={false}>
            {items.map((item, i) => {
              const isHi = highlight?.includes(i);
              const isCmp = compare?.includes(i);
              const isSorted = sorted?.includes(i);
              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: -12, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8, y: 12 }}
                  transition={{ type: "spring", stiffness: 320, damping: 26 }}
                  className={`${sizeMap} inline-flex items-center justify-center rounded-md border font-mono transition-colors
                    ${isHi ? "border-[color:var(--brand)] bg-[color:var(--brand)]/15 text-foreground shadow-[0_0_0_3px_color-mix(in_oklab,var(--brand)_25%,transparent)]" : ""}
                    ${isCmp && !isHi ? "border-[color:var(--warn)] bg-[color:var(--warn)]/15" : ""}
                    ${isSorted && !isHi && !isCmp ? "border-[color:var(--good)] bg-[color:var(--good)]/15" : ""}
                    ${!isHi && !isCmp && !isSorted ? "border-border bg-card" : ""}
                  `}
                >
                  {displayValue(item.value)}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
        {showNegative && (
          <div className="flex gap-2">
            {items.map((_, i) => (
              <div
                key={i}
                className={`${sizeMap} flex items-center justify-center text-xs text-muted-foreground`}
              >
                -{items.length - i}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function BarVisualizer({
  values,
  highlight = [],
  compare = [],
  sorted = [],
  max,
}: {
  values: number[];
  highlight?: number[];
  compare?: number[];
  sorted?: number[];
  max?: number;
}) {
  const m = max ?? Math.max(1, ...values);
  return (
    <div className="flex h-64 items-end gap-1 rounded-md border border-border bg-card p-3">
      {values.map((v, i) => {
        const isHi = highlight.includes(i);
        const isCmp = compare.includes(i);
        const isSorted = sorted.includes(i);
        const color = isHi
          ? "var(--brand)"
          : isCmp
            ? "var(--warn)"
            : isSorted
              ? "var(--good)"
              : "color-mix(in oklab, var(--foreground) 25%, transparent)";
        return (
          <motion.div
            key={i}
            layout
            className="flex-1 rounded-t"
            style={{ height: `${(v / m) * 100}%`, backgroundColor: color, minWidth: 4 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
          />
        );
      })}
    </div>
  );
}

export function Legend({ items }: { items: { color: string; label: string }[] }) {
  return (
    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
      {items.map((it) => (
        <div key={it.label} className="inline-flex items-center gap-1.5">
          <span className="h-3 w-3 rounded" style={{ background: it.color }} />
          {it.label}
        </div>
      ))}
    </div>
  );
}

export function Section({
  title,
  children,
  eyebrow,
}: {
  title: string;
  children: ReactNode;
  eyebrow?: string;
}) {
  return (
    <section className="mb-12">
      {eyebrow && (
        <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-[color:var(--brand)]">
          {eyebrow}
        </div>
      )}
      <h2 className="mb-4 text-2xl font-semibold">{title}</h2>
      <div className="space-y-4 text-[15px] leading-relaxed text-muted-foreground">{children}</div>
    </section>
  );
}
