import { useMemo, useState } from "react";
import { Search, Copy, Check, Printer } from "lucide-react";

export type ComplexityRow = {
  name: string;
  category: string;
  best?: string;
  average?: string;
  worst?: string;
  aux?: string;
  stable?: boolean;
  inPlace?: boolean;
  adaptive?: boolean;
  note?: string;
};

const ORDER = [
  "O(1)",
  "O(log n)",
  "O(n)",
  "O(n log n)",
  "O(n + k)",
  "O(k)",
  "O(n²)",
  "O(n^2)",
  "O(nk)",
  "O(2^n)",
  "O(n!)",
] as const;

export function complexityColor(v?: string): string {
  if (!v) return "var(--muted-foreground)";
  const s = v.replace(/\s/g, "");
  if (s === "O(1)") return "var(--good)";
  if (s === "O(logn)") return "color-mix(in oklab, var(--good) 70%, var(--brand))";
  if (s === "O(n)" || s === "O(k)" || s === "O(n+k)") return "var(--brand)";
  if (s === "O(nlogn)") return "var(--warn)";
  if (s === "O(n²)" || s === "O(n^2)" || s === "O(nk)") return "#ef4444";
  if (s.startsWith("O(2^") || s.includes("!")) return "#991b1b";
  return "var(--muted-foreground)";
}

export function ComplexityBadgeCell({ value, tip }: { value?: string; tip?: string }) {
  if (!value) return <span className="text-muted-foreground">—</span>;
  const color = complexityColor(value);
  return (
    <span
      title={tip}
      className="inline-flex items-center rounded-md border px-2 py-0.5 font-mono text-xs font-medium whitespace-nowrap"
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

function complexityRank(v?: string) {
  if (!v) return 999;
  const idx = ORDER.indexOf(v.replace(/\s/g, "").replace("n²", "n^2") as (typeof ORDER)[number]);
  return idx === -1 ? 500 : idx;
}

type Mode = "time" | "space";

export function ComplexityTable({
  rows,
  mode,
  categories,
}: {
  rows: ComplexityRow[];
  mode: Mode;
  categories: string[];
}) {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<string>("All");
  const [sortKey, setSortKey] = useState<"name" | "worst" | "aux">("name");
  const [asc, setAsc] = useState(true);
  const [copied, setCopied] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = rows.filter(
      (r) =>
        (cat === "All" || r.category === cat) &&
        (!q || r.name.toLowerCase().includes(q) || r.note?.toLowerCase().includes(q)),
    );
    list = [...list].sort((a, b) => {
      let d = 0;
      if (sortKey === "name") d = a.name.localeCompare(b.name);
      else if (sortKey === "worst") d = complexityRank(a.worst) - complexityRank(b.worst);
      else d = complexityRank(a.aux) - complexityRank(b.aux);
      return asc ? d : -d;
    });
    return list;
  }, [rows, query, cat, sortKey, asc]);

  const copy = async () => {
    const header =
      mode === "time"
        ? ["Operation", "Best", "Average", "Worst", "Notes"]
        : ["Operation", "Aux Space", "Notes"];
    const lines = [header.join("\t")];
    for (const r of filtered) {
      lines.push(
        mode === "time"
          ? [r.name, r.best ?? "", r.average ?? "", r.worst ?? "", r.note ?? ""].join("\t")
          : [r.name, r.aux ?? "", r.note ?? ""].join("\t"),
      );
    }
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  const toggleSort = (k: typeof sortKey) => {
    if (sortKey === k) setAsc(!asc);
    else {
      setSortKey(k);
      setAsc(true);
    }
  };

  return (
    <div className="print:!block">
      <div className="mb-4 flex flex-wrap items-center gap-2 print:hidden">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search operations…"
            className="h-9 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm"
          />
        </div>
        <select
          value={cat}
          onChange={(e) => setCat(e.target.value)}
          className="h-9 rounded-md border border-input bg-background px-2 text-sm"
        >
          <option>All</option>
          {categories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <button
          onClick={copy}
          className="inline-flex h-9 items-center gap-1 rounded-md border border-input bg-background px-3 text-xs hover:bg-accent"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copied" : "Copy table"}
        </button>
        <button
          onClick={() => window.print()}
          className="inline-flex h-9 items-center gap-1 rounded-md border border-input bg-background px-3 text-xs hover:bg-accent"
        >
          <Printer className="h-3.5 w-3.5" /> Print / PDF
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="min-w-full text-sm">
          <thead className="sticky top-0 z-10 bg-muted/80 text-left text-xs uppercase tracking-wider text-muted-foreground backdrop-blur">
            <tr>
              <th className="p-3 cursor-pointer" onClick={() => toggleSort("name")}>
                Operation {sortKey === "name" ? (asc ? "↑" : "↓") : ""}
              </th>
              {mode === "time" ? (
                <>
                  <th className="p-3">Best</th>
                  <th className="p-3">Average</th>
                  <th className="p-3 cursor-pointer" onClick={() => toggleSort("worst")}>
                    Worst {sortKey === "worst" ? (asc ? "↑" : "↓") : ""}
                  </th>
                  <th className="p-3">Stable</th>
                  <th className="p-3">In-place</th>
                  <th className="p-3">Adaptive</th>
                </>
              ) : (
                <>
                  <th className="p-3 cursor-pointer" onClick={() => toggleSort("aux")}>
                    Aux space {sortKey === "aux" ? (asc ? "↑" : "↓") : ""}
                  </th>
                </>
              )}
              <th className="p-3">Notes</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.name} className="border-t border-border align-top">
                <td className="p-3 font-mono">
                  {r.name}
                  <div className="text-[11px] font-sans text-muted-foreground">{r.category}</div>
                </td>
                {mode === "time" ? (
                  <>
                    <td className="p-3">
                      <ComplexityBadgeCell value={r.best} />
                    </td>
                    <td className="p-3">
                      <ComplexityBadgeCell value={r.average} />
                    </td>
                    <td className="p-3">
                      <ComplexityBadgeCell value={r.worst} />
                    </td>
                    <td className="p-3">{r.stable === undefined ? "—" : r.stable ? "✓" : "✗"}</td>
                    <td className="p-3">{r.inPlace === undefined ? "—" : r.inPlace ? "✓" : "✗"}</td>
                    <td className="p-3">
                      {r.adaptive === undefined ? "—" : r.adaptive ? "✓" : "✗"}
                    </td>
                  </>
                ) : (
                  <td className="p-3">
                    <ComplexityBadgeCell value={r.aux} />
                  </td>
                )}
                <td className="p-3 text-xs text-muted-foreground max-w-xs">{r.note}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={mode === "time" ? 8 : 3}
                  className="p-6 text-center text-sm text-muted-foreground"
                >
                  No results.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground print:hidden">
        <ComplexityBadgeCell value="O(1)" /> constant
        <ComplexityBadgeCell value="O(log n)" /> logarithmic
        <ComplexityBadgeCell value="O(n)" /> linear
        <ComplexityBadgeCell value="O(n log n)" /> linearithmic
        <ComplexityBadgeCell value="O(n²)" /> quadratic
        <ComplexityBadgeCell value="O(2^n)" /> exponential
      </div>
    </div>
  );
}
