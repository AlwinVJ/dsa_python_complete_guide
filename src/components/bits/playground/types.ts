export interface BitFrame {
  line: number;
  note: string;
  explanation: string;
  currentGoal: string;
  currentFocus: string;
  done?: boolean;
  kind: string;

  // Primary integer states
  valA: number;
  valB?: number;
  resultVal: number;

  // Bit representation arrays
  bitsA: number[];
  bitsB?: number[];
  bitsResult: number[];
  bitsMask?: number[];

  // Visual highlights
  activeBitIdx: number;
  highlightIndices: number[];

  // Algorithm specific
  setBitsCount?: number;
  subsetMask?: number;
  subsetsFound?: string[];
  isPower2?: boolean;
  operationName?: string;

  // Gray code
  grayPrev?: number[];
  grayIndex?: number;
  grayTotal?: number;
  changedBit?: number;
  graySequence?: { i: number; gray: number; bits: number[] }[];

  // Hamming
  hammingCount?: number;

  // Bloom filter
  bloomBits?: number[]; // e.g. length 16
  bloomTouched?: number[]; // positions being written/checked
  bloomHashes?: { name: string; value: number; index: number }[];
  bloomMode?: "insert" | "lookup";
  bloomStored?: string[];
  bloomQueryItem?: string;
  bloomResult?: "positive" | "negative" | "false-positive" | null;

  // Fast exponentiation
  fexpBase?: number;
  fexpExp?: number;
  fexpResult?: number;
  fexpBitPos?: number;
  fexpExpBits?: number[];
  fexpAction?: "multiply" | "square" | "skip" | "init" | "done";

  // Metrics
  stepCount: number;
  operationsPerformed: number;
}
