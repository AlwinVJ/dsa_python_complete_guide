import { useMemo, useState } from "react";
import { Plus, Search, Trash2, RefreshCw } from "lucide-react";
import { HashTableVisualizer } from "./HashTableVisualizer";
import type { HTBucketEntry } from "@/lib/hash-tables/types";

/**
 * Interactive separate-chaining hash table. Users insert key/value pairs and
 * watch the bucket index update live, plus load-factor tracking.
 */
export function HashTablePlayground({ capacity: initialCap = 8 }: { capacity?: number }) {
  const [cap, setCap] = useState(initialCap);
  const [entries, setEntries] = useState<HTBucketEntry[]>([
    { key: "apple", value: 1 },
    { key: "banana", value: 2 },
    { key: "cherry", value: 3 },
  ]);
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");
  const [msg, setMsg] = useState<{ text: string; kind: "ok" | "warn" | "err" } | null>(null);
  const [highlight, setHighlight] = useState<number | null>(null);

  function hash(k: string) {
    // Simple stable string hash (djb2-lite) so results are reproducible.
    let h = 5381;
    for (let i = 0; i < k.length; i++) h = ((h << 5) + h + k.charCodeAt(i)) | 0;
    return Math.abs(h);
  }

  const buckets = useMemo(() => {
    const bs: HTBucketEntry[][] = Array.from({ length: cap }, () => []);
    for (const e of entries) bs[hash(e.key) % cap].push(e);
    return bs;
  }, [entries, cap]);

  const labels = useMemo(
    () => Array.from({ length: cap }, (_, i) => (buckets[i].length > 1 ? "collision" : undefined)),
    [buckets, cap],
  );

  function onInsert() {
    if (!key.trim()) return setMsg({ text: "Key is required.", kind: "warn" });
    const b = hash(key) % cap;
    setHighlight(b);
    setEntries((xs) => {
      const without = xs.filter((e) => e.key !== key);
      return [...without, { key, value: value || 1 }];
    });
    setMsg({ text: `Inserted "${key}" → bucket ${b}`, kind: "ok" });
    setKey(""); setValue("");
  }

  function onSearch() {
    if (!key.trim()) return;
    const b = hash(key) % cap;
    const found = buckets[b].find((e) => e.key === key);
    setHighlight(b);
    setMsg({
      text: found ? `Found "${key}" in bucket ${b}` : `"${key}" not present (bucket ${b} checked)`,
      kind: found ? "ok" : "warn",
    });
  }

  function onDelete() {
    if (!key.trim()) return;
    const b = hash(key) % cap;
    setHighlight(b);
    setEntries((xs) => xs.filter((e) => e.key !== key));
    setMsg({ text: `Deleted "${key}" from bucket ${b}`, kind: "ok" });
    setKey("");
  }

  function onResize(next: number) {
    setCap(next);
    setMsg({ text: `Rehashed into ${next} buckets`, kind: "ok" });
    setHighlight(null);
  }

  function reset() {
    setEntries([]); setKey(""); setValue(""); setMsg(null); setHighlight(null);
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]">
        <input
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="key"
          className="rounded-md border border-border bg-background px-3 py-2 font-mono text-sm outline-none focus:border-[color:var(--brand)]/60"
        />
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="value (optional)"
          className="rounded-md border border-border bg-background px-3 py-2 font-mono text-sm outline-none focus:border-[color:var(--brand)]/60"
        />
        <div className="flex flex-wrap gap-2">
          <button
            onClick={onInsert}
            className="inline-flex items-center gap-1 rounded-md gradient-brand px-3 py-2 text-xs font-medium text-primary-foreground"
          >
            <Plus className="h-3.5 w-3.5" /> Insert
          </button>
          <button
            onClick={onSearch}
            className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-3 py-2 text-xs font-medium hover:border-[color:var(--brand)]/60"
          >
            <Search className="h-3.5 w-3.5" /> Search
          </button>
          <button
            onClick={onDelete}
            className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-3 py-2 text-xs font-medium hover:border-rose-500/60"
          >
            <Trash2 className="h-3.5 w-3.5" /> Delete
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-muted-foreground">Capacity:</span>
        {[4, 8, 16].map((n) => (
          <button
            key={n}
            onClick={() => onResize(n)}
            className={`rounded-md border px-2 py-1 font-mono ${
              n === cap ? "border-[color:var(--brand)] bg-[color:var(--brand)]/10 text-[color:var(--brand)]" : "border-border hover:border-[color:var(--brand)]/40"
            }`}
          >
            {n}
          </button>
        ))}
        <button
          onClick={reset}
          className="ml-auto inline-flex items-center gap-1 rounded-md border border-border bg-card px-2 py-1 text-xs hover:border-rose-500/40"
        >
          <RefreshCw className="h-3 w-3" /> Reset
        </button>
      </div>

      {msg && (
        <div
          className={`rounded-md border px-3 py-2 text-xs ${
            msg.kind === "ok"
              ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
              : msg.kind === "warn"
                ? "border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                : "border-rose-500/40 bg-rose-500/10 text-rose-500"
          }`}
        >
          {msg.text}
        </div>
      )}

      <HashTableVisualizer
        buckets={buckets}
        capacity={cap}
        labels={labels}
        probeIndices={highlight !== null ? [highlight] : []}
        showLoadFactor
        caption="Insert keys and watch the bucket index update. Chains form when two keys hash to the same bucket."
      />
    </div>
  );
}
