import { Play, Pause, RotateCcw, StepForward, StepBack, Sparkles } from "lucide-react";

interface StringControlsProps {
  step: number;
  totalSteps: number;
  running: boolean;
  speed: number;
  text: string;
  pattern: string;
  onStepChange: (step: number) => void;
  onRunningToggle: () => void;
  onSpeedChange: (speed: number) => void;
  onTextChange: (text: string) => void;
  onPatternChange: (pattern: string) => void;
  onReset: () => void;
}

const PRESET_EXAMPLES = [
  { text: "AABAACAADAABAAABDF", pattern: "AABA" },
  { text: "ABABDABACDABABC", pattern: "ABABC" },
  { text: "ABABABACABA", pattern: "ABACABA" },
  { text: "COCOA_AND_COCONUTS", pattern: "COCONUT" },
  { text: "GCATCGCAAGCTCGCA", pattern: "GCA" },
];

export function StringControls({
  step,
  totalSteps,
  running,
  speed,
  text,
  pattern,
  onStepChange,
  onRunningToggle,
  onSpeedChange,
  onTextChange,
  onPatternChange,
  onReset,
}: StringControlsProps) {
  const done = step >= totalSteps - 1;

  const handleRandomExample = () => {
    const randomPreset = PRESET_EXAMPLES[Math.floor(Math.random() * PRESET_EXAMPLES.length)];
    onTextChange(randomPreset.text);
    onPatternChange(randomPreset.pattern);
  };

  return (
    <div className="card-surface p-4 flex flex-col gap-4">
      {/* 1. Custom Text & Pattern Input Fields */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-semibold text-muted-foreground uppercase">
            Text (T)
          </label>
          <input
            type="text"
            value={text}
            onChange={(e) => onTextChange(e.target.value.toUpperCase().replace(/[^A-Z_]/g, "").slice(0, 20))}
            className="rounded border border-border bg-background px-2.5 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-mono uppercase"
            placeholder="Text string..."
            maxLength={20}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-semibold text-muted-foreground uppercase">
            Pattern (P)
          </label>
          <input
            type="text"
            value={pattern}
            onChange={(e) => onPatternChange(e.target.value.toUpperCase().replace(/[^A-Z_]/g, "").slice(0, 10))}
            className="rounded border border-border bg-background px-2.5 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-mono uppercase"
            placeholder="Pattern..."
            maxLength={10}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/40 pt-3">
        {/* Helper options */}
        <button
          onClick={handleRandomExample}
          className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-2.5 py-1 text-xs text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
        >
          <Sparkles className="h-3.5 w-3.5 text-[color:var(--brand)]" /> Preset Example
        </button>

        {/* Speed selection */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            Speed ({(1000 / speed).toFixed(1)} steps/s)
          </span>
          <input
            type="range"
            min={100}
            max={1200}
            value={1300 - speed}
            onChange={(e) => onSpeedChange(1300 - parseInt(e.target.value, 10))}
            className="w-24 accent-[color:var(--brand)]"
          />
        </div>
      </div>

      {/* 2. Playback buttons */}
      <div className="flex flex-wrap items-center gap-2 border-t border-border/40 pt-3">
        <button
          onClick={() => onStepChange(Math.max(0, step - 1))}
          disabled={running || step === 0}
          className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-3 py-1.5 text-xs hover:bg-accent disabled:opacity-50"
        >
          <StepBack className="h-3.5 w-3.5" /> Prev
        </button>
        <button
          onClick={onRunningToggle}
          disabled={done && !running}
          className="inline-flex items-center gap-1 rounded-md gradient-brand px-3 py-1.5 text-xs font-medium text-primary-foreground disabled:opacity-60"
        >
          {running ? (
            <>
              <Pause className="h-3.5 w-3.5" /> Pause
            </>
          ) : (
            <>
              <Play className="h-3.5 w-3.5" /> {done ? "Done" : "Play"}
            </>
          )}
        </button>
        <button
          onClick={() => onStepChange(Math.min(totalSteps - 1, step + 1))}
          disabled={running || done}
          className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-3 py-1.5 text-xs hover:bg-accent disabled:opacity-50"
        >
          <StepForward className="h-3.5 w-3.5" /> Next
        </button>
        <button
          onClick={onReset}
          className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-3 py-1.5 text-xs hover:bg-accent"
        >
          <RotateCcw className="h-3.5 w-3.5" /> Reset
        </button>
      </div>

      {/* 3. Timeline Slider Scrubber */}
      {totalSteps > 1 && (
        <div className="flex flex-col gap-1 border-t border-border/40 pt-3">
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <span>Execution Timeline</span>
            <span className="font-mono text-foreground font-semibold">
              Step {Math.min(step + 1, totalSteps)} / {totalSteps}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={totalSteps - 1}
            value={step}
            onChange={(e) => onStepChange(parseInt(e.target.value, 10))}
            className="w-full h-1.5 rounded-lg bg-border accent-[color:var(--brand)] cursor-pointer"
          />
        </div>
      )}
    </div>
  );
}
