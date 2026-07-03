import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Play, Pause, SkipBack, SkipForward, RotateCcw, Shuffle } from "lucide-react";
import { ListVisualizer, makeItems } from "@/components/ListVisualizer";
import { getGenerator, type Frame } from "@/lib/algorithm-steps";

function parseArray(text: string): number[] {
  return text
    .replace(/[\[\]]/g, "")
    .split(/[,\s]+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => Number(s))
    .filter((n) => Number.isFinite(n));
}

function randomArray(size: number, min = -9, max = 20): number[] {
  return Array.from({ length: size }, () => Math.floor(Math.random() * (max - min + 1)) + min);
}

export function AlgorithmPlayground({
  playgroundKey,
  defaultInput = "3, 1, 4, 1, 5, 9, 2, 6",
  useParam = false,
  paramLabel = "Target",
  defaultParam = 7,
}: {
  playgroundKey: string;
  defaultInput?: string;
  useParam?: boolean;
  paramLabel?: string;
  defaultParam?: number;
}) {
  const [input, setInput] = useState(defaultInput);
  const [param, setParam] = useState(defaultParam);
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(700);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const gen = getGenerator(playgroundKey);
  const nums = useMemo(() => parseArray(input), [input]);
  const frames: Frame[] = useMemo(() => {
    if (!gen) return [];
    try {
      return gen(nums, param);
    } catch {
      return [];
    }
  }, [gen, nums, param]);

  useEffect(() => setStep(0), [input, param, playgroundKey]);

  useEffect(() => {
    if (!playing) return;
    if (step >= frames.length - 1) { setPlaying(false); return; }
    timer.current = setTimeout(() => setStep((s) => Math.min(s + 1, frames.length - 1)), speed);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [playing, step, frames.length, speed]);

  if (!gen) {
    return (
      <div className="card-surface p-6 text-sm text-muted-foreground">
        Interactive visualization coming soon for this algorithm — study the code and dry run
        below in the meantime.
      </div>
    );
  }

  const frame = frames[step] ?? frames[0];
  const items = frame ? makeItems(frame.array) : [];

  return (
    <div className="card-surface p-4 sm:p-5">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <label className="text-xs font-medium text-muted-foreground">Input array</label>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="min-w-[240px] flex-1 rounded-md border border-input bg-background px-3 py-1.5 font-mono text-sm"
        />
        <button
          onClick={() => setInput(randomArray(Math.max(6, Math.min(14, nums.length || 8))).join(", "))}
          className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-2 py-1.5 text-xs hover:bg-accent"
          title="Random array"
        >
          <Shuffle className="h-3.5 w-3.5" /> Random
        </button>
        {useParam && (
          <>
            <label className="ml-2 text-xs font-medium text-muted-foreground">{paramLabel}</label>
            <input
              type="number"
              value={param}
              onChange={(e) => setParam(Number(e.target.value))}
              className="w-20 rounded-md border border-input bg-background px-2 py-1.5 font-mono text-sm"
            />
          </>
        )}
      </div>

      <div className="mb-4 min-h-[110px] rounded-md border border-border bg-background/40 p-3">
        {frame ? (
          <ListVisualizer
            items={items}
            highlight={frame.highlight}
            compare={frame.compare}
            sorted={frame.sorted}
          />
        ) : (
          <div className="text-sm text-muted-foreground">Enter a valid array to begin.</div>
        )}
      </div>

      <motion.div
        key={step}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-3 rounded-md border border-border bg-card p-3 text-sm"
      >
        <div className="font-mono">{frame?.note ?? ""}</div>
        {frame?.vars && Object.keys(frame.vars).length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {Object.entries(frame.vars).map(([k, v]) => (
              <span key={k} className="rounded border border-border bg-background px-2 py-0.5 font-mono text-xs">
                <span className="text-muted-foreground">{k}=</span>
                <span>{String(v)}</span>
              </span>
            ))}
          </div>
        )}
      </motion.div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setStep(0)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border hover:bg-accent"
          title="Reset"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
        <button
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border hover:bg-accent"
          title="Step back"
        >
          <SkipBack className="h-4 w-4" />
        </button>
        <button
          onClick={() => setPlaying((p) => !p)}
          className="inline-flex h-9 items-center gap-1 rounded-md gradient-brand px-4 text-sm font-medium text-primary-foreground"
        >
          {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {playing ? "Pause" : "Play"}
        </button>
        <button
          onClick={() => setStep((s) => Math.min(frames.length - 1, s + 1))}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border hover:bg-accent"
          title="Step forward"
        >
          <SkipForward className="h-4 w-4" />
        </button>
        <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
          <span>Speed</span>
          <input
            type="range"
            min={120}
            max={1500}
            step={40}
            value={1620 - speed}
            onChange={(e) => setSpeed(1620 - Number(e.target.value))}
            className="w-32"
          />
          <span className="font-mono">
            {step + 1} / {frames.length}
          </span>
        </div>
      </div>
    </div>
  );
}
