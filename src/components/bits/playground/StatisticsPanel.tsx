import { BitFrame } from "./types";

interface StatisticsPanelProps {
  frame: BitFrame | undefined;
}

export function StatisticsPanel({ frame }: StatisticsPanelProps) {
  if (!frame) return null;

  const done = !!frame.done;

  // Render complexities and final summary based on algorithm type
  let timeC = "O(1)";
  let spaceC = "O(1)";
  let finalSummary = "";

  switch (frame.kind) {
    case "converter":
      timeC = "O(log N)";
      spaceC = "O(log N)";
      finalSummary = "Decimal to binary conversion completed. Extracted bits by repeated division.";
      break;
    case "bitwise":
      timeC = "O(1)"; // on 8/32/64 bit integers
      spaceC = "O(1)";
      finalSummary = `Bitwise ${frame.operationName} completed. Evaluated all bit indices.`;
      break;
    case "shift":
      timeC = "O(1)";
      spaceC = "O(1)";
      finalSummary = "Shift operation completed, shifting all bit registers.";
      break;
    case "modify":
      timeC = "O(1)";
      spaceC = "O(1)";
      finalSummary = `Completed ${frame.operationName} bit mask operation.`;
      break;
    case "popcount":
      timeC = "O(set_bits)";
      spaceC = "O(1)";
      finalSummary = `Brian Kernighan popcount complete. Found ${frame.setBitsCount} set bits in ${frame.operationsPerformed} steps.`;
      break;
    case "power2":
      timeC = "O(1)";
      spaceC = "O(1)";
      finalSummary = frame.isPower2
        ? "Power of two verification complete. Number is an exponent of 2."
        : "Power of two verification complete. Number is not an exponent of 2.";
      break;
    case "mask":
      timeC = "O(1)";
      spaceC = "O(1)";
      finalSummary = `Bitmask Set ${frame.operationName} completed. Union/Intersect/Difference evaluated.`;
      break;
    case "subsets":
      timeC = "O(N * 2^N)";
      spaceC = "O(N * 2^N)";
      finalSummary = `Generated all subsets. Evaluated 2^${frame.valA} = ${frame.valB} masks.`;
      break;
  }

  // Count set/cleared bits in resultVal
  const setBits = frame.bitsResult.filter(b => b === 1).length;
  const clearedBits = frame.bitsResult.filter(b => b === 0).length;

  return (
    <div className="flex flex-col gap-3.5">
      {/* Live metrics list */}
      <div className="flex flex-col gap-1">
        <div className="text-[11px] font-semibold text-muted-foreground uppercase">Live Metrics</div>
        <dl className="grid grid-cols-2 gap-y-1.5 text-xs">
          <div className="contents">
            <dt className="text-muted-foreground">Decimal Result</dt>
            <dd className="text-right font-mono text-foreground font-bold">{frame.resultVal}</dd>
          </div>
          <div className="contents">
            <dt className="text-muted-foreground">Binary Result</dt>
            <dd className="text-right font-mono text-foreground font-bold">{frame.bitsResult.join("")}</dd>
          </div>
          {frame.activeBitIdx >= 0 && (
            <div className="contents">
              <dt className="text-muted-foreground">Active Bit Index</dt>
              <dd className="text-right font-mono text-foreground font-bold">{frame.activeBitIdx}</dd>
            </div>
          )}
          <div className="contents">
            <dt className="text-muted-foreground">Set Bits (1s)</dt>
            <dd className="text-right font-mono text-foreground font-bold">{setBits}</dd>
          </div>
          <div className="contents">
            <dt className="text-muted-foreground">Cleared Bits (0s)</dt>
            <dd className="text-right font-mono text-foreground font-bold">{clearedBits}</dd>
          </div>
          {frame.setBitsCount !== undefined && (
            <div className="contents">
              <dt className="text-muted-foreground">Popcount Count</dt>
              <dd className="text-right font-mono text-foreground font-bold">{frame.setBitsCount}</dd>
            </div>
          )}
        </dl>
      </div>

      {/* Complexities and operation name */}
      <div className="flex flex-col gap-1 border-t border-border/40 pt-3 text-[11px] text-muted-foreground font-mono">
        <div>
          Time Complexity: <span className="font-bold text-foreground">{timeC}</span>
        </div>
        <div>
          Space Complexity: <span className="font-bold text-foreground">{spaceC}</span>
        </div>
      </div>

      {/* Final completed box */}
      {done && (
        <div className="mt-2 rounded-lg border border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-500/10 p-3">
          <h5 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-1 flex items-center gap-1">
            ✓ Complete
          </h5>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            {finalSummary} Total step iterations: {frame.stepCount + 1}.
          </p>
        </div>
      )}
    </div>
  );
}
