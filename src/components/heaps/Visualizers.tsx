import { useMemo, useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, RefreshCcw, Shuffle, Eye, Layers, ArrowUp, ArrowDown } from "lucide-react";
import { TreeVisualizer } from "@/components/TreeVisualizer";
import type { TreeNodeViz } from "@/lib/trees/types";
import type { HeapKind } from "@/lib/heaps/types";

/* =========================================================
 * Shared: array ↔ tree conversion
 * ========================================================= */
function arrayToTree(
  a: number[],
  opts: { hi?: Set<number>; path?: Set<number> } = {},
  i = 0,
): TreeNodeViz | null {
  if (i >= a.length) return null;
  const kids = [arrayToTree(a, opts, 2 * i + 1), arrayToTree(a, opts, 2 * i + 2)].filter(
    (c): c is TreeNodeViz => c !== null,
  );
  return {
    id: `${i}:${a[i]}`,
    label: a[i],
    color: opts.hi?.has(i)
      ? "highlight"
      : opts.path?.has(i)
        ? "visited"
        : i === 0
          ? "brand"
          : "default",
    badge: `i=${i}`,
    children: kids.length ? kids : undefined,
  };
}

/* =========================================================
 * ArrayStrip — the "underlying array" view
 * ========================================================= */
function ArrayStrip({
  data,
  highlight,
  path,
  focus,
}: {
  data: number[];
  highlight?: Set<number>;
  path?: Set<number>;
  focus?: number;
}) {
  return (
    <div className="card-surface p-3">
      <div className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">
        Underlying array
      </div>
      <div className="flex flex-wrap gap-1.5">
        {data.map((v, i) => {
          const isHi = highlight?.has(i);
          const isPath = path?.has(i);
          const isFocus = focus === i;
          const cls = isHi
            ? "border-amber-500 bg-amber-500/15 text-amber-700 dark:text-amber-300"
            : isFocus
              ? "border-[color:var(--brand)] bg-[color:var(--brand)]/15 text-[color:var(--brand)]"
              : isPath
                ? "border-emerald-500 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                : "border-border bg-card text-foreground";
          return (
            <motion.div
              key={i}
              layout
              className={`flex flex-col items-center rounded-md border px-2 py-1 text-xs font-mono ${cls}`}
            >
              <span className="text-[10px] text-muted-foreground">{i}</span>
              <span className="text-sm font-semibold">{v}</span>
            </motion.div>
          );
        })}
        {data.length === 0 && <span className="text-xs text-muted-foreground">empty</span>}
      </div>
    </div>
  );
}

/* =========================================================
 * Static HeapVisualizer — used for heapViz sections
 * ========================================================= */
export function HeapVisualizer({
  data,
  kind = "min",
  highlight,
  path,
  caption,
  showArray = true,
}: {
  data: number[];
  kind?: HeapKind;
  highlight?: number[];
  path?: number[];
  caption?: string;
  showArray?: boolean;
  showIndices?: boolean;
}) {
  const hi = useMemo(() => new Set(highlight ?? []), [highlight]);
  const p = useMemo(() => new Set(path ?? []), [path]);
  const root = useMemo(() => arrayToTree(data, { hi, path: p }), [data, hi, p]);

  return (
    <div className="space-y-3">
      <div className="card-surface p-3">
        <div className="mb-1 flex items-center justify-between text-xs uppercase tracking-wider text-muted-foreground">
          <span>{kind === "min" ? "Min-heap tree" : "Max-heap tree"}</span>
          <span className="font-mono">size = {data.length}</span>
        </div>
        <TreeVisualizer root={root} minHeight={180} />
      </div>
      {showArray && <ArrayStrip data={data} highlight={hi} path={p} />}
      {caption && <p className="text-xs italic text-muted-foreground">{caption}</p>}
    </div>
  );
}

/* =========================================================
 * IndexDiagram — highlight parent/left/right for one index
 * ========================================================= */
export function IndexDiagram({
  data,
  focus,
  caption,
}: {
  data: number[];
  focus: number;
  caption?: string;
}) {
  const parent = focus > 0 ? Math.floor((focus - 1) / 2) : -1;
  const left = 2 * focus + 1;
  const right = 2 * focus + 2;
  const hi = new Set<number>([focus]);
  const path = new Set<number>();
  if (parent >= 0) path.add(parent);
  if (left < data.length) path.add(left);
  if (right < data.length) path.add(right);
  const root = arrayToTree(data, { hi, path });

  return (
    <div className="space-y-3">
      <div className="card-surface p-3">
        <TreeVisualizer root={root} minHeight={180} />
      </div>
      <ArrayStrip data={data} highlight={hi} path={path} focus={focus} />
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="card-surface p-2">
          <div className="text-muted-foreground">parent</div>
          <div className="font-mono">
            {parent >= 0 ? `[${parent}] = ${data[parent]}` : "— (root)"}
          </div>
        </div>
        <div className="card-surface p-2">
          <div className="text-muted-foreground">left = 2i + 1</div>
          <div className="font-mono">
            {left < data.length ? `[${left}] = ${data[left]}` : "— (no child)"}
          </div>
        </div>
        <div className="card-surface p-2">
          <div className="text-muted-foreground">right = 2i + 2</div>
          <div className="font-mono">
            {right < data.length ? `[${right}] = ${data[right]}` : "— (no child)"}
          </div>
        </div>
      </div>
      {caption && <p className="text-xs italic text-muted-foreground">{caption}</p>}
    </div>
  );
}

/* =========================================================
 * HeapPlayground — the flagship interactive component
 * ========================================================= */
type Frame = {
  arr: number[];
  hi?: number[];
  path?: number[];
  op: string;
};

function heapifyUpFrames(
  a: number[],
  start: number,
  cmp: (x: number, y: number) => boolean,
  base: Frame[],
) {
  const arr = a.slice();
  let i = start;
  base.push({ arr: arr.slice(), hi: [i], op: `sift-up · start at i=${i}` });
  while (i > 0) {
    const p = Math.floor((i - 1) / 2);
    if (cmp(arr[i], arr[p])) {
      base.push({ arr: arr.slice(), hi: [i, p], op: `swap ${arr[i]} ⇄ ${arr[p]}` });
      [arr[i], arr[p]] = [arr[p], arr[i]];
      i = p;
      base.push({ arr: arr.slice(), hi: [i], op: `now at i=${i}` });
    } else {
      base.push({ arr: arr.slice(), hi: [i], op: `heap property holds at i=${i}` });
      break;
    }
  }
  return arr;
}

function heapifyDownFrames(
  a: number[],
  start: number,
  n: number,
  cmp: (x: number, y: number) => boolean,
  base: Frame[],
) {
  const arr = a.slice();
  let i = start;
  base.push({ arr: arr.slice(), hi: [i], op: `sift-down · start at i=${i}` });
  while (true) {
    const l = 2 * i + 1,
      r = 2 * i + 2;
    let best = i;
    if (l < n && cmp(arr[l], arr[best])) best = l;
    if (r < n && cmp(arr[r], arr[best])) best = r;
    if (best === i) {
      base.push({ arr: arr.slice(), hi: [i], op: `heap property holds at i=${i}` });
      break;
    }
    base.push({ arr: arr.slice(), hi: [i, best], op: `swap ${arr[i]} ⇄ ${arr[best]}` });
    [arr[i], arr[best]] = [arr[best], arr[i]];
    i = best;
  }
  return arr;
}

export function HeapPlayground({
  seed = [],
  kind: kindProp = "min",
  caption,
}: {
  seed?: number[];
  kind?: HeapKind;
  caption?: string;
}) {
  const [kind, setKind] = useState<HeapKind>(kindProp);
  const [arr, setArr] = useState<number[]>(seed);
  const [input, setInput] = useState("");
  const [buildInput, setBuildInput] = useState(seed.join(", "));
  const [frames, setFrames] = useState<Frame[]>([]);
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [lastOp, setLastOp] = useState<string>("");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cmp = kind === "min" ? (x: number, y: number) => x < y : (x: number, y: number) => x > y;

  // Auto-play frames at ~700ms/step
  useEffect(() => {
    if (!playing || step >= frames.length - 1) {
      if (playing && step >= frames.length - 1) setPlaying(false);
      return;
    }
    timerRef.current = setTimeout(() => setStep((s) => s + 1), 700);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [playing, step, frames.length]);

  // When user toggles heap kind on an existing heap, rebuild for correctness.
  useEffect(() => {
    if (arr.length > 1) {
      const rebuilt = arr.slice();
      const n = rebuilt.length;
      for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        heapifyDownFrames(rebuilt, i, n, cmp, []);
        // apply in place using a helper mirror of the frames logic
        let k = i;
        while (true) {
          const l = 2 * k + 1,
            r = 2 * k + 2;
          let best = k;
          if (l < n && cmp(rebuilt[l], rebuilt[best])) best = l;
          if (r < n && cmp(rebuilt[r], rebuilt[best])) best = r;
          if (best === k) break;
          [rebuilt[k], rebuilt[best]] = [rebuilt[best], rebuilt[k]];
          k = best;
        }
      }
      setArr(rebuilt);
      setFrames([]);
      setStep(0);
      setLastOp(`toggled to ${kind}-heap · rebuilt in O(n)`);
    }
  }, [kind]);

  function runFrames(fs: Frame[], finalArr: number[], op: string) {
    setFrames(fs);
    setStep(0);
    setPlaying(true);
    setLastOp(op);
    // Commit the final array now; the visual highlights animate through frames.
    setArr(finalArr);
  }

  function doInsert() {
    const v = Number(input);
    if (!Number.isFinite(v)) return;
    setInput("");
    const next = arr.slice();
    next.push(v);
    const fs: Frame[] = [
      { arr: next.slice(), hi: [next.length - 1], op: `append ${v} at index ${next.length - 1}` },
    ];
    const finalArr = heapifyUpFrames(next, next.length - 1, cmp, fs);
    runFrames(fs, finalArr, `insert(${v})`);
  }

  function doPop() {
    if (arr.length === 0) return;
    if (arr.length === 1) {
      setArr([]);
      setFrames([]);
      setStep(0);
      setLastOp(`pop root (${arr[0]}) · heap now empty`);
      return;
    }
    const next = arr.slice();
    const top = next[0];
    const last = next.pop()!;
    const fs: Frame[] = [
      {
        arr: arr.slice(),
        hi: [0, arr.length - 1],
        op: `pop root (${top}) · swap with last (${last})`,
      },
      {
        arr: [last, ...next.slice(1)],
        hi: [0],
        op: `promoted ${last} to root · shrink to size ${next.length}`,
      },
    ];
    next[0] = last;
    const finalArr = heapifyDownFrames(next, 0, next.length, cmp, fs);
    runFrames(fs, finalArr, `pop() → ${top}`);
  }

  function doBuild() {
    const parts = buildInput
      .split(/[,\s]+/)
      .map((s) => Number(s.trim()))
      .filter((n) => Number.isFinite(n));
    if (parts.length === 0) return;
    const next = parts.slice();
    const n = next.length;
    const fs: Frame[] = [
      { arr: next.slice(), op: `start · bottom-up heapify from i = ${Math.floor(n / 2) - 1}` },
    ];
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      heapifyDownFrames(next, i, n, cmp, fs);
      // Apply in place to keep frames consistent with the running array.
      let k = i;
      while (true) {
        const l = 2 * k + 1,
          r = 2 * k + 2;
        let best = k;
        if (l < n && cmp(next[l], next[best])) best = l;
        if (r < n && cmp(next[r], next[best])) best = r;
        if (best === k) break;
        [next[k], next[best]] = [next[best], next[k]];
        k = best;
      }
    }
    fs.push({ arr: next.slice(), op: `done · valid ${kind}-heap of size ${n}` });
    runFrames(fs, next, `build_heap(${parts.length} elems) · O(n)`);
  }

  function doPeek() {
    if (arr.length === 0) {
      setLastOp("peek · heap is empty");
      return;
    }
    setFrames([{ arr: arr.slice(), hi: [0], op: `peek → ${arr[0]}` }]);
    setStep(0);
    setPlaying(false);
    setLastOp(`peek() → ${arr[0]}`);
  }

  function doShuffle() {
    const n = 6 + Math.floor(Math.random() * 5);
    const nums: number[] = [];
    for (let i = 0; i < n; i++) nums.push(1 + Math.floor(Math.random() * 99));
    setBuildInput(nums.join(", "));
    setArr(nums);
    setFrames([]);
    setStep(0);
    setLastOp(`shuffled · ${n} random values loaded — hit Build`);
  }

  function doReset() {
    setArr([]);
    setFrames([]);
    setStep(0);
    setBuildInput("");
    setInput("");
    setLastOp("reset");
  }

  const frame = frames[step];
  const displayArr = frame?.arr ?? arr;
  const hi = frame?.hi;
  const path = frame?.path;
  const height = displayArr.length ? Math.floor(Math.log2(displayArr.length)) : 0;

  const btn =
    "inline-flex items-center gap-1 rounded-md border border-border bg-background px-2.5 py-1 text-xs hover:bg-accent transition";
  const btnPrimary =
    "inline-flex items-center gap-1 rounded-md bg-[color:var(--brand)] px-2.5 py-1 text-xs font-medium text-primary-foreground hover:opacity-90 transition";

  return (
    <div className="space-y-3">
      <div className="card-surface p-3 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-md border border-border p-0.5 text-xs">
            <button
              className={`px-2 py-1 rounded-sm ${kind === "min" ? "bg-[color:var(--brand)] text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
              onClick={() => setKind("min")}
            >
              Min-heap
            </button>
            <button
              className={`px-2 py-1 rounded-sm ${kind === "max" ? "bg-[color:var(--brand)] text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
              onClick={() => setKind("max")}
            >
              Max-heap
            </button>
          </div>
          <div className="ml-auto flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span>
              size <span className="font-mono text-foreground">{arr.length}</span>
            </span>
            <span>
              height <span className="font-mono text-foreground">{height}</span>
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") doInsert();
            }}
            placeholder="value"
            className="w-20 rounded-md border border-border bg-background px-2 py-1 text-xs"
          />
          <button className={btnPrimary} onClick={doInsert}>
            <Plus className="h-3.5 w-3.5" /> Insert
          </button>
          <button className={btn} onClick={doPop}>
            <Trash2 className="h-3.5 w-3.5" /> Pop root
          </button>
          <button className={btn} onClick={doPeek}>
            <Eye className="h-3.5 w-3.5" /> Peek
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          <input
            value={buildInput}
            onChange={(e) => setBuildInput(e.target.value)}
            placeholder="e.g. 9, 4, 7, 1, 3"
            className="min-w-[10rem] flex-1 rounded-md border border-border bg-background px-2 py-1 text-xs font-mono"
          />
          <button className={btn} onClick={doBuild}>
            <Layers className="h-3.5 w-3.5" /> Build heap
          </button>
          <button className={btn} onClick={doShuffle}>
            <Shuffle className="h-3.5 w-3.5" /> Shuffle
          </button>
          <button className={btn} onClick={doReset}>
            <RefreshCcw className="h-3.5 w-3.5" /> Reset
          </button>
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <div className="card-surface p-3">
          <div className="mb-1 flex items-center justify-between text-xs uppercase tracking-wider text-muted-foreground">
            <span>{kind === "min" ? "Min-heap tree" : "Max-heap tree"}</span>
            <span className="font-mono">O({arr.length ? "log n" : "1"})</span>
          </div>
          <TreeVisualizer
            root={arrayToTree(displayArr, { hi: new Set(hi ?? []), path: new Set(path ?? []) })}
            minHeight={200}
          />
        </div>
        <ArrayStrip data={displayArr} highlight={new Set(hi ?? [])} path={new Set(path ?? [])} />
      </div>

      <div className="card-surface p-2 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-muted-foreground">Current op:</span>
          <span className="font-mono text-foreground">{frame?.op ?? lastOp ?? "—"}</span>
          {frames.length > 0 && (
            <>
              <span className="ml-auto text-muted-foreground">
                step {step + 1} / {frames.length}
              </span>
              <button
                className={btn}
                onClick={() => {
                  setStep((s) => Math.max(0, s - 1));
                  setPlaying(false);
                }}
              >
                <ArrowUp className="h-3.5 w-3.5 rotate-[-90deg]" /> Prev
              </button>
              <button
                className={btn}
                onClick={() => {
                  setStep((s) => Math.min(frames.length - 1, s + 1));
                  setPlaying(false);
                }}
              >
                <ArrowDown className="h-3.5 w-3.5 rotate-[-90deg]" /> Next
              </button>
              <button className={btnPrimary} onClick={() => setPlaying((p) => !p)}>
                {playing ? "Pause" : "Play"}
              </button>
            </>
          )}
        </div>
        <AnimatePresence initial={false}>
          {frames
            .slice(0, step + 1)
            .slice(-3)
            .map((f, i) => (
              <motion.div
                key={`${step}-${i}`}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-1 text-muted-foreground"
              >
                › {f.op}
              </motion.div>
            ))}
        </AnimatePresence>
      </div>

      {caption && <p className="text-xs italic text-muted-foreground">{caption}</p>}
    </div>
  );
}
