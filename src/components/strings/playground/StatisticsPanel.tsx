import { StringFrame } from "./types";

interface StatisticsPanelProps {
  frame: StringFrame | undefined;
  textLength: number;
  patternLength: number;
}

export function StatisticsPanel({
  frame,
  textLength,
  patternLength,
}: StatisticsPanelProps) {
  if (!frame) return null;

  const done = !!frame.done;

  // Render complexity info and description based on algorithm type
  let timeC = "O(N * M)";
  let spaceC = "O(1)";
  let finalSummary = "";

  switch (frame.kind) {
    case "naive":
      timeC = "O(N * M)";
      spaceC = "O(1)";
      finalSummary = "Naive search completed. Evaluated all pattern alignments sequentially.";
      break;
    case "kmp":
      timeC = "O(N + M)";
      spaceC = "O(M)";
      finalSummary = "KMP search completed. Preprocessed pattern into an LPS table to skip redundant character re-checks.";
      break;
    case "rabin-karp":
      timeC = "O(N + M) average, O(N * M) worst";
      spaceC = "O(1)";
      finalSummary = "Rabin-Karp search completed. Computed rolling hashes to perform quick O(1) checks, verifying letters only on hash matches.";
      break;
    case "z-algo":
      timeC = "O(N + M)";
      spaceC = "O(N + M)";
      finalSummary = "Z-algorithm completed. Built the Z-array on the combined string (P + '$' + T) to match prefixes in linear time.";
      break;
  }

  return (
    <div className="flex flex-col gap-3.5">
      {/* Occurrences Matches Found */}
      <div className="flex flex-col gap-1">
        <div className="text-[11px] font-semibold text-muted-foreground uppercase">
          Matches Found ({frame.occurrences.length})
        </div>
        <div className="flex min-h-[36px] flex-wrap gap-1 rounded-md border border-border bg-background p-2 font-mono text-xs">
          {frame.occurrences.length === 0 ? (
            <span className="text-muted-foreground italic">none yet</span>
          ) : (
            frame.occurrences.map((offset) => (
              <span
                key={offset}
                className="rounded border border-emerald-500/20 bg-emerald-500/5 px-2 py-0.5 text-emerald-600 dark:text-emerald-500 text-[10px] font-bold"
              >
                Index {offset}
              </span>
            ))
          )}
        </div>
      </div>

      {/* Live Metrics Grid */}
      <div className="flex flex-col gap-1 border-t border-border/40 pt-3">
        <div className="text-[11px] font-semibold text-muted-foreground uppercase">Live Metrics</div>
        <dl className="grid grid-cols-2 gap-y-1 text-xs">
          <div className="contents">
            <dt className="text-muted-foreground">Comparisons</dt>
            <dd className="text-right font-mono text-foreground font-bold">{frame.comparisons}</dd>
          </div>
          <div className="contents">
            <dt className="text-muted-foreground">Pattern Shifts</dt>
            <dd className="text-right font-mono text-foreground font-bold">{frame.shifts}</dd>
          </div>
          {frame.kind === "rabin-karp" && (
            <div className="contents">
              <dt className="text-muted-foreground">Hash Computations</dt>
              <dd className="text-right font-mono text-foreground font-bold">
                {frame.hashComputations}
              </dd>
            </div>
          )}
        </dl>
      </div>

      {/* Final Execution Summary */}
      {done && (
        <div className="mt-2 rounded-lg border border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-500/10 p-3">
          <h5 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-1 flex items-center gap-1">
            ✓ Search Completed
          </h5>
          <p className="text-[11px] text-muted-foreground leading-relaxed mb-2">
            {finalSummary} Occurrences found: {frame.occurrences.length} match(es).
          </p>
          <div className="flex flex-col gap-1 border-t border-emerald-500/15 pt-2 text-[10px] text-muted-foreground font-mono">
            <div>
              Time Complexity: <span className="font-bold text-foreground">{timeC}</span>
            </div>
            <div>
              Space Complexity: <span className="font-bold text-foreground">{spaceC}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
