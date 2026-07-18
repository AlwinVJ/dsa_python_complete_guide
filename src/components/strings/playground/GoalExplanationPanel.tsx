import { StringFrame } from "./types";

interface GoalExplanationPanelProps {
  frame: StringFrame | undefined;
}

export function GoalExplanationPanel({ frame }: GoalExplanationPanelProps) {
  if (!frame) {
    return (
      <div className="card-surface p-4 flex items-center justify-center min-h-[120px] text-muted-foreground text-sm">
        Provide text and pattern, then press Play to begin search.
      </div>
    );
  }

  return (
    <div className="card-surface p-4 flex flex-col gap-3">
      {/* Title Header */}
      <div className="border-b border-border/40 pb-2 flex items-center justify-between">
        <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Step Analysis
        </h4>
        <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground uppercase">
          {frame.kind}
        </span>
      </div>

      {/* Current Objective */}
      <div>
        <div className="text-[11px] font-semibold text-muted-foreground uppercase">Current Goal</div>
        <div className="text-sm font-semibold text-foreground">
          {frame.currentGoal || "Searching pattern"}
        </div>
      </div>

      {/* Focus */}
      {frame.currentFocus && (
        <div>
          <div className="text-[11px] font-semibold text-muted-foreground uppercase">Current Focus</div>
          <div className="inline-flex items-center rounded bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 text-xs text-amber-600 dark:text-amber-500 font-mono font-bold">
            {frame.currentFocus}
          </div>
        </div>
      )}

      {/* Detailed educational explanation */}
      <div className="rounded-md bg-muted/40 border border-border/50 p-2.5">
        <div className="text-[11px] font-bold text-muted-foreground mb-1 uppercase">Reason</div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {frame.explanation || frame.note}
        </p>
      </div>
    </div>
  );
}
