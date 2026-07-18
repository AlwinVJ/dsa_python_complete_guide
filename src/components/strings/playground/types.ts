export interface StringFrame {
  line: number;           // Line to highlight in CodeViewer
  note: string;           // Brief summary of step
  explanation: string;    // Rich detailed explanation of WHY this step is taken
  currentGoal: string;    // Active objective (e.g. "Match characters", "Compute rolling hash")
  currentFocus: string;   // Character alignment or index
  done?: boolean;         // Complete indicator
  kind: string;           // "naive" | "kmp" | "rabin-karp" | "z-algo"
  
  // Text and Pattern indices
  textIdx: number;        // Current alignment offset 'i' or matching text position
  patIdx: number;         // Current comparison index in pattern 'j'
  
  // Highlight states for characters
  matchState: "match" | "mismatch" | "comparing" | "idle";
  activeTextIndices: number[]; // Character indices in Text to highlight
  activePatIndices: number[];  // Character indices in Pattern to highlight
  matchedIndices: number[];    // Confirmed matching indices in Text
  mismatchedIndices: number[];  // Confirmed mismatching indices in Text

  // Algorithm specific arrays / states
  occurrences: number[];       // Matching start offsets found
  lps?: number[];              // KMP LPS array
  z?: number[];                // Z-algorithm Z-array
  zBox?: { l: number; r: number } | null; // Z-algorithm boundary [L, R]
  pHash?: number;              // Pattern hash value (Rabin-Karp)
  tHash?: number;              // Current window text hash (Rabin-Karp)
  isCollision?: boolean;       // Rabin-Karp hash collision flag
  
  // Metric counts
  comparisons: number;
  shifts: number;
  hashComputations: number;
}
