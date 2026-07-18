export interface BitFrame {
  line: number;           // Line to highlight in CodeViewer
  note: string;           // Brief step summary
  explanation: string;    // Rich detailed explanation of this step
  currentGoal: string;    // Active goal (e.g. "Create bitmask", "Turn off lowest bit")
  currentFocus: string;   // Focused bit index, values, or indices
  done?: boolean;         // Execution finished flag
  kind: string;           // "converter" | "bitwise" | "shift" | "modify" | "popcount" | "power2" | "mask" | "subsets"

  // Primary integer states
  valA: number;           // Primary value A (input or intermediate state)
  valB?: number;          // Secondary value B (for binary operations / shift counts)
  resultVal: number;      // Current resulting value

  // Bit representation arrays (length 8 or 16 for clean rendering)
  bitsA: number[];        // Binary array of A
  bitsB?: number[];       // Binary array of B
  bitsResult: number[];   // Binary array of output result
  bitsMask?: number[];    // Binary array of bit mask

  // Visual highlights
  activeBitIdx: number;   // Index of the bit currently being evaluated (0-indexed from right)
  highlightIndices: number[]; // Indices to highlight (e.g. in result or mask)

  // Algorithm specific counters/states
  setBitsCount?: number;  // For Brian Kernighan popcount
  subsetMask?: number;    // For subset generation mask loop
  subsetsFound?: string[]; // Accumulated subset string list
  isPower2?: boolean;     // Power of two check result
  operationName?: string;  // "AND" | "OR" | "XOR" | "NOT" | "LSHIFT" | "RSHIFT" etc.

  // Metrics
  stepCount: number;
  operationsPerformed: number;
}
