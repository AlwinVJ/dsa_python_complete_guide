import { Play, Pause, RotateCcw, StepForward, StepBack, Sparkles } from "lucide-react";
import { AlgoKey } from "./algorithms";

interface BitControlsProps {
  algo: AlgoKey;
  step: number;
  totalSteps: number;
  running: boolean;
  speed: number;
  valA: number;
  valB: number;
  opType: string;
  onStepChange: (step: number) => void;
  onRunningToggle: () => void;
  onSpeedChange: (speed: number) => void;
  onValAChange: (val: number) => void;
  onValBChange: (val: number) => void;
  onOpTypeChange: (op: string) => void;
  onReset: () => void;
}

const PRESET_VALUES: Record<AlgoKey, { valA: number; valB: number; opType: string }[]> = {
  converter: [
    { valA: 13, valB: 0, opType: "" },
    { valA: 45, valB: 0, opType: "" },
    { valA: 128, valB: 0, opType: "" },
  ],
  bitwise: [
    { valA: 5, valB: 3, opType: "AND" },
    { valA: 12, valB: 10, opType: "XOR" },
    { valA: 60, valB: 13, opType: "OR" },
    { valA: 85, valB: 0, opType: "NOT" },
  ],
  shift: [
    { valA: 6, valB: 2, opType: "LEFT" },
    { valA: 48, valB: 3, opType: "RIGHT" },
    { valA: 1, valB: 7, opType: "LEFT" },
  ],
  modify: [
    { valA: 13, valB: 1, opType: "GET" },
    { valA: 12, valB: 2, opType: "SET" },
    { valA: 15, valB: 3, opType: "CLEAR" },
    { valA: 8, valB: 3, opType: "TOGGLE" },
  ],
  popcount: [
    { valA: 13, valB: 0, opType: "" },
    { valA: 127, valB: 0, opType: "" },
    { valA: 255, valB: 0, opType: "" },
  ],
  power2: [
    { valA: 8, valB: 0, opType: "" },
    { valA: 13, valB: 0, opType: "" },
    { valA: 1, valB: 0, opType: "" },
    { valA: 0, valB: 0, opType: "" },
  ],
  mask: [
    { valA: 13, valB: 6, opType: "UNION" },
    { valA: 15, valB: 10, opType: "INTERSECT" },
    { valA: 28, valB: 12, opType: "DIFFERENCE" },
  ],
  subsets: [{ valA: 3, valB: 8, opType: "" }],
};

export function BitControls({
  algo,
  step,
  totalSteps,
  running,
  speed,
  valA,
  valB,
  opType,
  onStepChange,
  onRunningToggle,
  onSpeedChange,
  onValAChange,
  onValBChange,
  onOpTypeChange,
  onReset,
}: BitControlsProps) {
  const done = step >= totalSteps - 1;

  const handleRandomExample = () => {
    const list = PRESET_VALUES[algo];
    const randomPreset = list[Math.floor(Math.random() * list.length)];
    onValAChange(randomPreset.valA);
    onValBChange(randomPreset.valB);
    onOpTypeChange(randomPreset.opType);
  };

  const isSubsets = algo === "subsets";
  const isConverter = algo === "converter";
  const isPopcount = algo === "popcount";
  const isPower2 = algo === "power2";

  return (
    <div className="card-surface p-4 flex flex-col gap-4">
      {/* 1. Custom Inputs based on Selected Algorithm */}
      {!isSubsets && (
        <div className="grid grid-cols-3 gap-3">
          {/* Input A */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold text-muted-foreground uppercase">
              {algo === "mask" ? "Set Mask A" : "Value n / A"}
            </label>
            <input
              type="number"
              value={valA}
              onChange={(e) => {
                const limit = isPower2 ? 255 : 255;
                const minVal = isPower2 ? -128 : 0;
                let parsed = parseInt(e.target.value, 10);
                if (isNaN(parsed)) parsed = 0;
                onValAChange(Math.max(minVal, Math.min(limit, parsed)));
              }}
              className="rounded border border-border bg-background px-2.5 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-mono"
              placeholder="Value..."
            />
          </div>

          {/* Secondary inputs / Shifts / Indices */}
          {!isConverter && !isPopcount && !isPower2 && (
            <>
              {/* Input B / Shift count / index */}
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold text-muted-foreground uppercase">
                  {algo === "shift" ? "Shift Count" : algo === "modify" ? "Bit index i" : "Mask B"}
                </label>
                <input
                  type="number"
                  value={valB}
                  onChange={(e) => {
                    let parsed = parseInt(e.target.value, 10);
                    if (isNaN(parsed)) parsed = 0;
                    const limit = algo === "shift" || algo === "modify" ? 7 : 255;
                    onValBChange(Math.max(0, Math.min(limit, parsed)));
                  }}
                  className="rounded border border-border bg-background px-2.5 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-mono"
                  placeholder="Value..."
                />
              </div>

              {/* Operator type selection */}
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold text-muted-foreground uppercase">
                  Operator
                </label>
                <select
                  value={opType}
                  onChange={(e) => onOpTypeChange(e.target.value)}
                  className="rounded border border-border bg-background px-2 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-sans"
                >
                  {algo === "bitwise" && (
                    <>
                      <option value="AND">AND (&)</option>
                      <option value="OR">OR (|)</option>
                      <option value="XOR">(^)</option>
                      <option value="NOT">NOT (~)</option>
                    </>
                  )}
                  {algo === "shift" && (
                    <>
                      <option value="LEFT">LEFT (&lt;&lt;)</option>
                      <option value="RIGHT">RIGHT (&gt;&gt;)</option>
                    </>
                  )}
                  {algo === "modify" && (
                    <>
                      <option value="GET">GET bit</option>
                      <option value="SET">SET bit</option>
                      <option value="CLEAR">CLEAR bit</option>
                      <option value="TOGGLE">TOGGLE bit</option>
                    </>
                  )}
                  {algo === "mask" && (
                    <>
                      <option value="UNION">UNION (|)</option>
                      <option value="INTERSECT">INTERSECT (&amp;)</option>
                      <option value="DIFFERENCE">DIFFERENCE (&amp; ~)</option>
                    </>
                  )}
                </select>
              </div>
            </>
          )}
        </div>
      )}

      {isSubsets && (
        <div className="text-xs text-muted-foreground bg-muted/30 border border-border/40 rounded p-2.5 leading-relaxed">
          Subset Generation works on set elements <span className="font-semibold text-foreground">A, B, and C</span>. It counts binary masks from <span className="font-mono text-foreground font-semibold">0 to 7</span>.
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/40 pt-3">
        {/* Preset selections */}
        {!isSubsets && (
          <button
            onClick={handleRandomExample}
            className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-2.5 py-1 text-xs text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          >
            <Sparkles className="h-3.5 w-3.5 text-[color:var(--brand)]" /> Load Preset
          </button>
        )}
        {isSubsets && <div />}

        {/* Speed adjustment */}
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

      {/* 2. Playback action buttons */}
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

      {/* 3. Timeline scrubber */}
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
