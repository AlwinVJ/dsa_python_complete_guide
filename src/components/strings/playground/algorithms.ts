import { StringFrame } from "./types";

/* ---------- Python Code Snippets ---------- */

export const NAIVE_CODE = `def naive_search(text, pattern):
    n, m = len(text), len(pattern)
    occurrences = []
    for i in range(n - m + 1):
        j = 0
        while j < m and text[i + j] == pattern[j]:
            j += 1
        if j == m:
            occurrences.append(i)
    return occurrences`;

export const KMP_CODE = `def kmp_search(text, pattern):
    n, m = len(text), len(pattern)
    lps = compute_lps(pattern)
    occurrences = []
    i = j = 0
    while i < n:
        if text[i] == pattern[j]:
            i += 1
            j += 1
            if j == m:
                occurrences.append(i - j)
                j = lps[j - 1]
        else:
            if j != 0:
                j = lps[j - 1]
            else:
                i += 1
    return occurrences`;

export const RABIN_KARP_CODE = `def rabin_karp(text, pattern):
    n, m = len(text), len(pattern)
    d, q = 256, 101
    h = pow(d, m - 1, q)
    p_hash = t_hash = 0
    occurrences = []
    
    for i in range(m):
        p_hash = (d * p_hash + ord(pattern[i])) % q
        t_hash = (d * t_hash + ord(text[i])) % q
        
    for i in range(n - m + 1):
        if p_hash == t_hash:
            if text[i:i+m] == pattern:
                occurrences.append(i)
        if i < n - m:
            t_hash = (d * (t_hash - ord(text[i]) * h) + ord(text[i+m])) % q
    return occurrences`;

export const Z_ALGO_CODE = `def z_search(text, pattern):
    concat = pattern + "$" + text
    n = len(concat)
    z = [0] * n
    l = r = 0
    occurrences = []
    m = len(pattern)
    
    for i in range(1, n):
        if i <= r:
            z[i] = min(r - i + 1, z[i - l])
        while i + z[i] < n and concat[z[i]] == concat[i + z[i]]:
            z[i] += 1
        if i + z[i] - 1 > r:
            l = i
            r = i + z[i] - 1
            
    for i in range(n):
        if z[i] == m:
            occurrences.append(i - m - 1)
    return occurrences`;

/* ---------- LPS Generator ---------- */

export function computeLPS(pattern: string): number[] {
  const M = pattern.length;
  const lps = Array(M).fill(0);
  let len = 0;
  let i = 1;
  while (i < M) {
    if (pattern[i] === pattern[len]) {
      len++;
      lps[i] = len;
      i++;
    } else {
      if (len !== 0) {
        len = lps[len - 1];
      } else {
        lps[i] = 0;
        i++;
      }
    }
  }
  return lps;
}

/* ---------- Tracers ---------- */

// 1. NAIVE
export function traceNaive(text: string, pattern: string): StringFrame[] {
  const frames: StringFrame[] = [];
  const N = text.length;
  const M = pattern.length;
  const occurrences: number[] = [];
  const mismatched: number[] = [];

  let comparisons = 0;
  let shifts = 0;

  const snap = (
    line: number,
    note: string,
    explanation: string,
    currentGoal: string,
    currentFocus: string,
    textIdx: number,
    patIdx: number,
    matchState: "match" | "mismatch" | "comparing" | "idle",
    activeText: number[],
    activePat: number[],
    matched: number[],
    mismatched: number[],
    extras: Partial<StringFrame> = {}
  ) => {
    frames.push({
      kind: "naive",
      line,
      note,
      explanation,
      currentGoal,
      currentFocus,
      textIdx,
      patIdx,
      matchState,
      activeTextIndices: activeText,
      activePatIndices: activePat,
      matchedIndices: matched,
      mismatchedIndices: mismatched,
      occurrences: [...occurrences],
      comparisons,
      shifts,
      hashComputations: 0,
      ...extras,
    });
  };

  snap(4, "Start Naive Search.", `Initialize naive matching. We will slide the pattern along the text from left to right, testing alignment offsets from 0 to ${N - M}.`, "Slide Pattern", "Offset 0", 0, 0, "idle", [], [], [], []);

  for (let i = 0; i <= N - M; i++) {
    let j = 0;
    snap(5, `Slide pattern to offset ${i}.`, `Starting character comparisons at text alignment index ${i}.`, "Align Pattern", `i = ${i}`, i, 0, "idle", [], [], [], []);

    let matchedAccum: number[] = [];

    while (j < M) {
      comparisons++;
      const textCharIdx = i + j;
      const tChar = text[textCharIdx];
      const pChar = pattern[j];

      snap(6, `Compare text '${tChar}' with pattern '${pChar}'.`, `Comparing character at text index ${textCharIdx} with pattern index ${j}.`, "Compare characters", `Text[${textCharIdx}] vs Pat[${j}]`, i, j, "comparing", [textCharIdx], [j], [...matchedAccum], []);

      if (tChar === pChar) {
        matchedAccum.push(textCharIdx);
        j++;
        snap(6, `Match found: '${tChar}' == '${pChar}'.`, `Characters match. Incrementing pattern pointer to check next characters in the alignment.`, "Advance pattern index", `Match!`, i, j, "match", [textCharIdx], [j - 1], [...matchedAccum], []);
      } else {
        mismatched.push(textCharIdx);
        snap(6, `Mismatch: '${tChar}' != '${pChar}'.`, `Characters differ. The current alignment at offset ${i} is invalid. Sliding pattern window to next position.`, "Trigger shift", `Mismatch!`, i, j, "mismatch", [textCharIdx], [j], [...matchedAccum], [textCharIdx]);
        break;
      }
    }

    if (j === M) {
      occurrences.push(i);
      snap(8, `Pattern matched completely at offset ${i}!`, `All ${M} characters match. We record starting alignment ${i} in our output list.`, "Record Match", `Matched offset ${i}`, i, j - 1, "match", [], [], [...matchedAccum], []);
    }

    shifts++;
  }

  snap(9, "Naive search complete.", `Scanned all alignments from 0 to ${N - M}. Found occurrences starting at offsets: [${occurrences.join(", ")}].`, "Search finished", "None", N - M, 0, "idle", [], [], [], [], { done: true });
  return frames;
}

// 2. KMP
export function traceKMP(text: string, pattern: string): StringFrame[] {
  const frames: StringFrame[] = [];
  const N = text.length;
  const M = pattern.length;
  const lps = computeLPS(pattern);
  const occurrences: number[] = [];

  let comparisons = 0;
  let shifts = 0;

  const snap = (
    line: number,
    note: string,
    explanation: string,
    currentGoal: string,
    currentFocus: string,
    textIdx: number,
    patIdx: number,
    matchState: "match" | "mismatch" | "comparing" | "idle",
    activeText: number[],
    activePat: number[],
    matched: number[],
    mismatched: number[],
    extras: Partial<StringFrame> = {}
  ) => {
    frames.push({
      kind: "kmp",
      line,
      note,
      explanation,
      currentGoal,
      currentFocus,
      textIdx,
      patIdx,
      matchState,
      activeTextIndices: activeText,
      activePatIndices: activePat,
      matchedIndices: matched,
      mismatchedIndices: mismatched,
      occurrences: [...occurrences],
      lps,
      comparisons,
      shifts,
      hashComputations: 0,
      ...extras,
    });
  };

  snap(4, "Pre-process pattern to calculate LPS table.", `KMP first computes the failure function (LPS array) of the pattern. The LPS array for '${pattern}' is [${lps.join(", ")}].`, "Analyze Pattern Symmetries", "LPS Table", 0, 0, "idle", [], [], [], []);

  let i = 0;
  let j = 0;
  let matchedAccum: number[] = [];

  while (i < N) {
    comparisons++;
    const tChar = text[i];
    const pChar = pattern[j];

    snap(7, `Compare text[${i}] ('${tChar}') with pattern[${j}] ('${pChar}').`, `Testing alignment. Comparing character at text index ${i} with pattern index ${j}.`, "Compare characters", `T[${i}] vs P[${j}]`, i - j, j, "comparing", [i], [j], [...matchedAccum], []);

    if (tChar === pChar) {
      matchedAccum.push(i);
      i++;
      j++;
      snap(8, `Characters match: '${tChar}' == '${pChar}'.`, `Incrementing both pointers. i moves to ${i}, j moves to ${j}.`, "Match - Advance pointers", "Match", i - j, j, "match", [i - 1], [j - 1], [...matchedAccum], []);

      if (j === M) {
        const matchStart = i - j;
        occurrences.push(matchStart);
        snap(11, `Occurrence found at index ${matchStart}!`, `The pattern matches completely. Looking up next state in LPS table: LPS[${j - 1}] = ${lps[j - 1]}.`, "Record Match", `Matched offset ${matchStart}`, matchStart, j - 1, "match", [], [], [...matchedAccum], []);
        j = lps[j - 1];
        // filter matches keeping only characters within the shifted pattern overlap
        matchedAccum = matchedAccum.slice(M - j);
        shifts++;
      }
    } else {
      snap(12, `Mismatch: text[${i}] ('${tChar}') != pattern[${j}] ('${pChar}').`, `A mismatch has occurred. We will consult the LPS table to determine the new pattern pointer state.`, "Mismatch", "Mismatch", i - j, j, "mismatch", [i], [j], [...matchedAccum], [i]);

      if (j !== 0) {
        const oldJ = j;
        j = lps[j - 1];
        matchedAccum = matchedAccum.slice(oldJ - j);
        shifts++;
        snap(14, `Lookup LPS[${oldJ - 1}] = ${j}. Shift pattern right.`, `Since j was at ${oldJ}, KMP shifts the pattern so that index ${j} aligns with text[${i}]. We do not backtrack the text pointer i (${i}).`, "Shift Pattern (LPS Skip)", `Shift to j = ${j}`, i - j, j, "idle", [], [], [...matchedAccum], []);
      } else {
        i++;
        shifts++;
        matchedAccum = [];
        snap(16, `j is at 0. Increment text pointer i to ${i}.`, `Since the first character of the pattern mismatched, we simply slide alignment by incrementing the text pointer i to ${i}.`, "Advance alignment", `Shift to i = ${i}`, i, 0, "idle", [], [], [], []);
      }
    }
  }

  snap(17, "KMP search complete.", `Scanned text linearly to index ${N}. Found pattern occurrences at offsets: [${occurrences.join(", ")}].`, "KMP completed", "None", N - M, 0, "idle", [], [], [], [], { done: true });
  return frames;
}

// 3. RABIN-KARP
export function traceRabinKarp(text: string, pattern: string): StringFrame[] {
  const frames: StringFrame[] = [];
  const N = text.length;
  const M = pattern.length;
  const occurrences: number[] = [];

  const d = 256; // base size
  const q = 101; // modulo prime

  let pHash = 0;
  let tHash = 0;
  let h = 1;

  let comparisons = 0;
  let shifts = 0;
  let hashComputations = 0;

  // Precompute h = pow(d, M - 1, q)
  for (let i = 0; i < M - 1; i++) {
    h = (h * d) % q;
  }

  const snap = (
    line: number,
    note: string,
    explanation: string,
    currentGoal: string,
    currentFocus: string,
    textIdx: number,
    patIdx: number,
    matchState: "match" | "mismatch" | "comparing" | "idle",
    activeText: number[],
    activePat: number[],
    matched: number[],
    mismatched: number[],
    extras: Partial<StringFrame> = {}
  ) => {
    frames.push({
      kind: "rabin-karp",
      line,
      note,
      explanation,
      currentGoal,
      currentFocus,
      textIdx,
      patIdx,
      matchState,
      activeTextIndices: activeText,
      activePatIndices: activePat,
      matchedIndices: matched,
      mismatchedIndices: mismatched,
      occurrences: [...occurrences],
      pHash,
      tHash,
      comparisons,
      shifts,
      hashComputations,
      ...extras,
    });
  };

  // Compute initial hash of pattern and first window of text
  for (let i = 0; i < M; i++) {
    pHash = (d * pHash + pattern.charCodeAt(i)) % q;
    tHash = (d * tHash + text.charCodeAt(i)) % q;
  }
  hashComputations += 2;

  snap(7, `Initialize hashes. Pattern hash = ${pHash}, Text window hash = ${tHash}.`, `We compute the polynomial rolling hash values for the pattern ('${pattern}') and the first text window S[0..${M - 1}] ('${text.substring(0, M)}'). Base = 256, Mod = 101.`, "Compute initial hashes", "Hash init", 0, 0, "idle", [], [], [], []);

  for (let i = 0; i <= N - M; i++) {
    const textWindowStr = text.substring(i, i + M);
    snap(10, `Evaluate hashes at alignment ${i}.`, `Comparing pattern hash (${pHash}) with current text window hash (${tHash}) for window '${textWindowStr}'.`, "Compare hashes", `H_p = ${pHash} vs H_t = ${tHash}`, i, 0, "idle", [], [], [], []);

    if (pHash === tHash) {
      // Hash match -> perform character validation
      let matchedAccum: number[] = [];
      let charMatch = true;

      snap(11, "Hash values match! Verify character by character.", "Hashes are equal. We must perform explicit character checks to verify the match and avoid false positives due to hash collisions.", "Verify characters", "Hash Match!", i, 0, "comparing", [], [], [], []);

      for (let j = 0; j < M; j++) {
        comparisons++;
        const textCharIdx = i + j;
        const tChar = text[textCharIdx];
        const pChar = pattern[j];

        snap(11, `Verify: text[${textCharIdx}] ('${tChar}') vs pattern[${j}] ('${pChar}').`, `Validating character equivalence at index position ${j} within the match window.`, "Verify characters", `T[${textCharIdx}] vs P[${j}]`, i, j, "comparing", [textCharIdx], [j], [...matchedAccum], []);

        if (tChar === pChar) {
          matchedAccum.push(textCharIdx);
        } else {
          charMatch = false;
          snap(11, `Collision detected! text[${textCharIdx}] ('${tChar}') != pattern[${j}] ('${pChar}').`, `Hash collision occurred! The hash values are identical (${pHash}), but the actual string contents differ.`, "Hash Collision", "Collision", i, j, "mismatch", [textCharIdx], [j], [...matchedAccum], [textCharIdx], { isCollision: true });
          break;
        }
      }

      if (charMatch) {
        occurrences.push(i);
        snap(12, `Success! Pattern matches at starting offset ${i}.`, `All characters match, confirming the hash match was correct. Recording offset index ${i}.`, "Record Match", "Match Found", i, M - 1, "match", [], [], [...matchedAccum], []);
      }
    } else {
      snap(10, "Hashes do not match. Skip character checks.", "Hashes are different, so the strings cannot be equal. We skip character checks entirely.", "Skip window", "No Hash Match", i, 0, "idle", [], [], [], []);
    }

    // Roll hash for next window
    if (i < N - M) {
      const charOut = text.charCodeAt(i);
      const charIn = text.charCodeAt(i + M);
      
      // tHash = (d * (tHash - charOut * h) + charIn) % q
      tHash = (d * (tHash - charOut * h) + charIn) % q;
      if (tHash < 0) {
        tHash = tHash + q;
      }
      hashComputations++;
      shifts++;

      const nextWindowStr = text.substring(i + 1, i + 1 + M);
      snap(14, `Roll hash to next window '${nextWindowStr}' -> ${tHash}.`, `Applying rolling hash formula in O(1): subtract outgoing character '${text[i]}', shift, and add incoming character '${text[i + M]}'.`, "Roll Polynomial Hash", `i = ${i + 1}`, i + 1, 0, "idle", [], [], [], []);
    }
  }

  snap(14, "Rabin-Karp complete.", `Finished sliding window scan. Occurrences found: [${occurrences.join(", ")}].`, "Rabin-Karp finished", "None", N - M, 0, "idle", [], [], [], [], { done: true });
  return frames;
}

// 4. Z ALGORITHM
export function traceZAlgo(text: string, pattern: string): StringFrame[] {
  const frames: StringFrame[] = [];
  const concat = pattern + "$" + text;
  const L = concat.length;
  const z = Array(L).fill(0);
  const occurrences: number[] = [];

  let comparisons = 0;
  let shifts = 0;

  const snap = (
    line: number,
    note: string,
    explanation: string,
    currentGoal: string,
    currentFocus: string,
    textIdx: number,
    patIdx: number,
    matchState: "match" | "mismatch" | "comparing" | "idle",
    activeIndices: number[],
    matched: number[],
    zBox: { l: number; r: number } | null,
    extras: Partial<StringFrame> = {}
  ) => {
    // Map concat string indices back to Text/Pattern alignments for rendering consistency
    frames.push({
      kind: "z-algo",
      line,
      note,
      explanation,
      currentGoal,
      currentFocus,
      textIdx,
      patIdx,
      matchState,
      activeTextIndices: activeIndices,
      activePatIndices: [],
      matchedIndices: matched,
      mismatchedIndices: [],
      occurrences: [...occurrences],
      z: [...z],
      zBox,
      comparisons,
      shifts,
      hashComputations: 0,
      ...extras,
    });
  };

  snap(7, `Concatenate string S = P + '$' + T -> '${concat}'.`, `We prepare the combined search string: Pattern ('${pattern}') + separator '$' + Text ('${text}'). We will build a Z-array of size ${L}.`, "Concatenate string", "Concat", 0, 0, "idle", [], [], null);

  let l = 0;
  let r = 0;

  for (let i = 1; i < L; i++) {
    snap(9, `Process Z[${i}] (character '${concat[i]}').`, `Calculating the Z-value at index position ${i}.`, "Evaluate index", `i = ${i}`, i, 0, "idle", [i], [], l > 0 ? { l, r } : null);

    if (i <= r) {
      z[i] = Math.min(r - i + 1, z[i - l]);
      snap(10, `Reuse computations: Z[${i}] initialized to ${z[i]} (inside Z-box [${l}, ${r}]).`, `Since index ${i} is inside the active Z-box [${l}, ${r}], we copy matching prefix values: Z[i] = min(R - i + 1, Z[i - L]) = ${z[i]}.`, "Reuse Z-box data", `Reuse values`, i, z[i], "idle", [i, i - l], [], { l, r });
    }

    let initialZ = z[i];
    let matchedAccum: number[] = [];
    for (let k = 0; k < initialZ; k++) {
      matchedAccum.push(i + k);
    }

    let hitMismatch = false;
    while (i + z[i] < L && concat[z[i]] === concat[i + z[i]]) {
      comparisons++;
      matchedAccum.push(i + z[i]);
      z[i]++;
      snap(12, `Prefix match: S[${z[i] - 1}] ('${concat[z[i] - 1]}') == S[${i + z[i] - 1}] ('${concat[i + z[i] - 1]}').`, `Characters are equal. Incrementing prefix length counter Z[${i}] to ${z[i]}.`, "Trivial character matching", `Z[${i}] = ${z[i]}`, i, z[i], "match", [z[i] - 1, i + z[i] - 1], [...matchedAccum], l > 0 ? { l, r } : null);
    }

    if (i + z[i] < L) {
      comparisons++;
      snap(12, `Mismatch: S[${z[i]}] ('${concat[z[i]]}') != S[${i + z[i]}] ('${concat[i + z[i]]}').`, `Characters differ. Trivial matching loop terminates. Z[${i}] is finalized at value ${z[i]}.`, "Finalize Z-value", `Mismatch`, i, z[i], "mismatch", [z[i], i + z[i]], [...matchedAccum], l > 0 ? { l, r } : null);
      hitMismatch = true;
    }

    if (i + z[i] - 1 > r) {
      l = i;
      r = i + z[i] - 1;
      shifts++;
      snap(15, `Update Z-box boundaries to [${l}, ${r}].`, `Since this index matched beyond the previous boundary, we update our active Z-box region to [L=${l}, R=${r}].`, "Shift Z-box", `New Z-box`, i, z[i], "idle", [], [], { l, r });
    }

    // If matches equal pattern length, an occurrence is found
    if (z[i] === pattern.length) {
      const matchIdx = i - pattern.length - 1;
      occurrences.push(matchIdx);
      snap(15, `Found match at text index ${matchIdx}!`, `Z[${i}] is equal to the pattern length (${pattern.length}). This indicates a complete occurrence of the pattern in T starting at text index ${matchIdx}.`, "Record Match", `Matched text index ${matchIdx}`, i, z[i], "match", [], [], l > 0 ? { l, r } : null);
    }
  }

  snap(17, "Z-algorithm search complete.", `Built Z-array of size ${L}. Matches found in text starting at indices: [${occurrences.join(", ")}].`, "Z-algorithm completed", "None", L - 1, 0, "idle", [], [], null, { done: true });
  return frames;
}

export type AlgoKey = "naive" | "kmp" | "rabin-karp" | "z-algo";

export interface AlgoDef {
  id: AlgoKey;
  name: string;
  description: string;
  code: string;
  fileName: string;
}

export const ALGOS: AlgoDef[] = [
  {
    id: "naive",
    name: "Naive Search",
    description: "Slide pattern character-by-character over the text. O(N * M) worst-case time.",
    code: NAIVE_CODE,
    fileName: "naive_search.py",
  },
  {
    id: "kmp",
    name: "Knuth-Morris-Pratt (KMP)",
    description: "Linear-time search using LPS table to bypass redundant comparisons. O(N + M) time.",
    code: KMP_CODE,
    fileName: "kmp_search.py",
  },
  {
    id: "rabin-karp",
    name: "Rabin-Karp",
    description: "Polynomial rolling hash matches followed by validation checks. Average O(N + M) time.",
    code: RABIN_KARP_CODE,
    fileName: "rabin_karp.py",
  },
  {
    id: "z-algo",
    name: "Z Algorithm",
    description: "Linear search matching prefix values of concatenated string S = P + '$' + T. O(N + M) time.",
    code: Z_ALGO_CODE,
    fileName: "z_search.py",
  },
];
