import { Play, Pause, RotateCcw, StepForward, StepBack } from "lucide-react";
import { LayoutType } from "./layouts";

interface GraphControlsProps {
  step: number;
  totalSteps: number;
  running: boolean;
  speed: number;
  layoutType: LayoutType;
  hasPreset: boolean;
  onStepChange: (step: number) => void;
  onRunningToggle: () => void;
  onSpeedChange: (speed: number) => void;
  onLayoutTypeChange: (layout: LayoutType) => void;
  onReset: () => void;
}

export function GraphControls({
  step,
  totalSteps,
  running,
  speed,
  layoutType,
  hasPreset,
  onStepChange,
  onRunningToggle,
  onSpeedChange,
  onLayoutTypeChange,
  onReset,
}: GraphControlsProps) {
  const done = step >= totalSteps - 1;

  const layouts: { id: LayoutType; label: string }[] = [
    ...(hasPreset ? [{ id: "preset" as LayoutType, label: "Preset" }] : []),
    { id: "circular", label: "Circular" },
    { id: "grid", label: "Grid" },
    { id: "tree", label: "Tree" },
  ];

  return (
    <div className="card-surface p-4 flex flex-col gap-4">
      {/* Playback Controls & Speed */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Playback Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onStepChange(Math.max(0, step - 1))}
            disabled={running || step === 0}
            className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-3 py-1.5 text-xs hover:bg-accent disabled:opacity-50"
            title="Step Back"
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
            title="Step Forward"
          >
            <StepForward className="h-3.5 w-3.5" /> Next
          </button>
          <button
            onClick={onReset}
            className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-3 py-1.5 text-xs hover:bg-accent"
            title="Reset"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reset
          </button>
        </div>

        {/* Speed slider */}
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
            className="w-32 accent-[color:var(--brand)]"
          />
        </div>
      </div>

      {/* Timeline Scrubber */}
      {totalSteps > 1 && (
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <span>Progress Timeline</span>
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

      {/* Layout Selector */}
      <div className="flex flex-col gap-1.5 border-t border-border/40 pt-3">
        <span className="text-xs text-muted-foreground">Layout Strategy</span>
        <div className="flex flex-wrap gap-1.5">
          {layouts.map((l) => (
            <button
              key={l.id}
              onClick={() => onLayoutTypeChange(l.id)}
              className={`rounded px-2.5 py-1 text-xs font-medium transition ${
                layoutType === l.id
                  ? "bg-[color:var(--brand)]/15 text-[color:var(--brand)] border border-[color:var(--brand)]/30"
                  : "border border-border hover:bg-accent text-muted-foreground"
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
