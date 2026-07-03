import { useMemo } from "react";
import { motion } from "framer-motion";
import type { TreeNodeViz } from "@/lib/trees/types";

// ---------- layout ----------
type Positioned = { node: TreeNodeViz; x: number; y: number; depth: number };

function layout(root: TreeNodeViz | null, gapX = 56, gapY = 68) {
  if (!root) return { nodes: [] as Positioned[], edges: [] as [Positioned, Positioned][], width: 0, height: 0 };
  const nodes: Positioned[] = [];
  const edges: [Positioned, Positioned][] = [];
  let x = 0;

  function walk(n: TreeNodeViz, depth: number): Positioned {
    const children = n.children ?? [];
    if (children.length === 0) {
      const p: Positioned = { node: n, x: x++ * gapX, y: depth * gapY, depth };
      nodes.push(p);
      return p;
    }
    const childPos = children.map((c) => walk(c, depth + 1));
    const mid = (childPos[0].x + childPos[childPos.length - 1].x) / 2;
    const p: Positioned = { node: n, x: mid, y: depth * gapY, depth };
    nodes.push(p);
    for (const c of childPos) edges.push([p, c]);
    return p;
  }

  walk(root, 0);
  const maxX = Math.max(...nodes.map((n) => n.x));
  const maxY = Math.max(...nodes.map((n) => n.y));
  return { nodes, edges, width: maxX + gapX, height: maxY + gapY };
}

const COLOR_MAP: Record<string, string> = {
  default: "fill-card stroke-border",
  brand: "fill-[color:var(--brand)]/15 stroke-[color:var(--brand)]",
  highlight: "fill-amber-500/15 stroke-amber-500",
  visited: "fill-emerald-500/15 stroke-emerald-500",
  muted: "fill-muted stroke-border",
  red: "fill-rose-500/25 stroke-rose-500",
  black: "fill-zinc-800 stroke-zinc-950",
};

const TEXT_COLOR: Record<string, string> = {
  default: "fill-foreground",
  brand: "fill-[color:var(--brand)]",
  highlight: "fill-amber-600 dark:fill-amber-400",
  visited: "fill-emerald-600 dark:fill-emerald-400",
  muted: "fill-muted-foreground",
  red: "fill-rose-600 dark:fill-rose-300",
  black: "fill-zinc-100",
};

export function TreeVisualizer({
  root,
  caption,
  path,
  minHeight,
}: {
  root: TreeNodeViz | null;
  caption?: string;
  path?: (string | number)[];
  minHeight?: number;
}) {
  const { nodes, edges, width, height } = useMemo(() => layout(root), [root]);
  const pad = 40;
  const r = 22;

  if (!root) {
    return (
      <div className="card-surface flex flex-col items-center justify-center p-8 text-sm text-muted-foreground" style={{ minHeight: 160 }}>
        Empty tree
      </div>
    );
  }

  const w = Math.max(width + pad * 2, 240);
  const h = Math.max(height + pad, minHeight ?? 200);
  const pathSet = new Set((path ?? []).map(String));

  return (
    <div className="card-surface overflow-x-auto p-4">
      <svg viewBox={`0 0 ${w} ${h}`} className="mx-auto block w-full" style={{ maxWidth: w }}>
        {/* edges */}
        {edges.map(([p, c], i) => (
          <motion.line
            key={i}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: i * 0.03 }}
            x1={p.x + pad}
            y1={p.y + pad}
            x2={c.x + pad}
            y2={c.y + pad}
            className="stroke-border"
            strokeWidth={1.5}
          />
        ))}
        {/* nodes */}
        {nodes.map((n, i) => {
          const color = n.node.color ?? "default";
          const onPath = pathSet.has(String(n.node.id));
          return (
            <motion.g
              key={n.node.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
            >
              {onPath && (
                <circle
                  cx={n.x + pad}
                  cy={n.y + pad}
                  r={r + 5}
                  className="fill-none stroke-[color:var(--brand)]"
                  strokeWidth={1.5}
                  strokeDasharray="3 3"
                />
              )}
              <circle
                cx={n.x + pad}
                cy={n.y + pad}
                r={r}
                className={COLOR_MAP[color] ?? COLOR_MAP.default}
                strokeWidth={1.5}
              />
              <text
                x={n.x + pad}
                y={n.y + pad + 4}
                textAnchor="middle"
                className={`text-[13px] font-semibold ${TEXT_COLOR[color] ?? TEXT_COLOR.default}`}
              >
                {n.node.label}
              </text>
              {n.node.badge && (
                <text
                  x={n.x + pad + r + 4}
                  y={n.y + pad - r + 4}
                  textAnchor="start"
                  className="fill-muted-foreground text-[10px] font-mono"
                >
                  {n.node.badge}
                </text>
              )}
            </motion.g>
          );
        })}
      </svg>
      {caption && <p className="mt-2 text-center text-xs italic text-muted-foreground">{caption}</p>}
    </div>
  );
}
