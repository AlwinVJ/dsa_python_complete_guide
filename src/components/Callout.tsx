import type { ReactNode } from "react";
import { Info, Lightbulb, AlertTriangle, Zap, BookOpen } from "lucide-react";

const styles = {
  info: { color: "var(--brand)", Icon: Info, label: "Note" },
  tip: { color: "var(--good)", Icon: Lightbulb, label: "Tip" },
  warn: { color: "var(--warn)", Icon: AlertTriangle, label: "Common mistake" },
  perf: { color: "var(--brand-2)", Icon: Zap, label: "Performance" },
  did: { color: "var(--brand)", Icon: BookOpen, label: "Did you know?" },
  interview: { color: "var(--warn)", Icon: BookOpen, label: "Interview question" },
} as const;

export function Callout({
  kind = "info",
  title,
  children,
}: {
  kind?: keyof typeof styles;
  title?: string;
  children: ReactNode;
}) {
  const s = styles[kind];
  return (
    <div
      className="my-4 rounded-lg border p-4"
      style={{
        borderColor: `color-mix(in oklab, ${s.color} 40%, var(--border))`,
        background: `color-mix(in oklab, ${s.color} 8%, var(--card))`,
      }}
    >
      <div className="flex items-start gap-3">
        <s.Icon className="mt-0.5 h-4 w-4 shrink-0" style={{ color: s.color }} />
        <div className="min-w-0 flex-1">
          <div className="mb-1 text-sm font-semibold" style={{ color: s.color }}>
            {title ?? s.label}
          </div>
          <div className="text-sm text-foreground/90 [&>p]:mb-1 last:[&>p]:mb-0">{children}</div>
        </div>
      </div>
    </div>
  );
}

export function ComplexityBadge({ value }: { value: string }) {
  const color =
    value === "O(1)"
      ? "var(--good)"
      : value === "O(log n)"
        ? "var(--good)"
        : value === "O(n)"
          ? "var(--warn)"
          : value === "O(n log n)"
            ? "var(--warn)"
            : "var(--bad)";
  return (
    <span
      className="inline-flex items-center rounded-md border px-2 py-0.5 font-mono text-xs font-medium"
      style={{
        borderColor: color,
        color,
        background: `color-mix(in oklab, ${color} 12%, transparent)`,
      }}
    >
      {value}
    </span>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <header className="mb-8 border-b border-border pb-6">
      {eyebrow && (
        <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-[color:var(--brand)]">
          {eyebrow}
        </div>
      )}
      <h1 className="text-3xl font-bold sm:text-4xl">{title}</h1>
      {description && <p className="mt-3 max-w-2xl text-muted-foreground">{description}</p>}
    </header>
  );
}

export function PageShell({ children }: { children: ReactNode }) {
  return <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-10">{children}</div>;
}
