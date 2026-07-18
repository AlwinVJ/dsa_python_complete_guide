import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { PageShell, PageHeader, Callout } from "@/components/Callout";
import { CodeViewer } from "@/components/CodeViewer";
import { PlaygroundBackButton, PlaygroundFooterNav } from "@/components/PlaygroundNav";
import {
  Play,
  Pause,
  RotateCcw,
  StepForward,
  StepBack,
  Shuffle,
} from "lucide-react";

export const Route = createFileRoute("/playgrounds/dp")({
  head: () => ({
    meta: [
      { title: "Dynamic Programming Playground — DSA with Python" },
      {
        name: "description",
        content:
          "Step through Fibonacci, Climbing Stairs, Coin Change, 0/1 Knapsack, LCS, LIS, Edit Distance, and Matrix Chain Multiplication — watch DP tables fill and caches populate.",
      },
      { property: "og:title", content: "Dynamic Programming Playground — DSA with Python" },
      {
        property: "og:description",
        content:
          "Interactive DP visualizer — see recursion trees, caches, and DP tables construct in real time.",
      },
    ],
  }),
  component: Page,
});

/* ---------- Frame model ---------- */
type BaseFrame = {
  line: number;
  note: string;
  depth: number;
  solution?: boolean;
  cacheHit?: boolean;
  write?: boolean;
};

type FibMemoFrame = BaseFrame & {
  kind: "fib-memo";
  n: number;
  arg: number;
  cache: Record<number, number>;
  stack: number[];
  calls: number;
  hits: number;
  result?: number;
};

type FibTabFrame = BaseFrame & {
  kind: "fib-tab";
  n: number;
  dp: number[];
  i: number;
};

type StairsFrame = BaseFrame & {
  kind: "stairs";
  n: number;
  dp: number[];
  i: number;
};

type CoinFrame = BaseFrame & {
  kind: "coin";
  coins: number[];
  amount: number;
  dp: number[];
  a: number;
  c?: number;
};

type KnapsackFrame = BaseFrame & {
  kind: "knapsack";
  weights: number[];
  values: number[];
  capacity: number;
  dp: number[][];
  i: number;
  w: number;
  decision?: "take" | "skip" | "init";
  selected?: number[];
};

type LcsFrame = BaseFrame & {
  kind: "lcs";
  s1: string;
  s2: string;
  dp: number[][];
  i: number;
  j: number;
  match?: boolean;
  path?: [number, number][];
  result?: string;
};

type LisFrame = BaseFrame & {
  kind: "lis";
  arr: number[];
  dp: number[];
  tails: number[];
  i: number;
  j?: number;
  best?: number;
};

type EditFrame = BaseFrame & {
  kind: "edit";
  s1: string;
  s2: string;
  dp: number[][];
  i: number;
  j: number;
  op?: "match" | "insert" | "delete" | "replace" | "init";
  path?: [number, number][];
};

type McmFrame = BaseFrame & {
  kind: "mcm";
  dims: number[];
  dp: number[][];
  split: number[][];
  L?: number;
  i: number;
  j: number;
  k?: number;
  paren?: string;
};

type AnyFrame =
  | FibMemoFrame
  | FibTabFrame
  | StairsFrame
  | CoinFrame
  | KnapsackFrame
  | LcsFrame
  | LisFrame
  | EditFrame
  | McmFrame;

/* ---------- Fibonacci Memoization tracer ---------- */
const FIB_MEMO_CODE = `from functools import lru_cache

@lru_cache(maxsize=None)
def fib(n):
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)`;

function traceFibMemo(n: number): FibMemoFrame[] {
  const frames: FibMemoFrame[] = [];
  const cache: Record<number, number> = {};
  const stack: number[] = [];
  let calls = 0;
  let hits = 0;

  const snap = (
    line: number,
    note: string,
    arg: number,
    depth: number,
    extras: Partial<FibMemoFrame> = {},
  ) => {
    frames.push({
      kind: "fib-memo",
      line,
      note,
      depth,
      n,
      arg,
      cache: { ...cache },
      stack: [...stack],
      calls,
      hits,
      ...extras,
    });
  };

  function fib(x: number, depth: number): number {
    calls++;
    stack.push(x);
    snap(4, `fib(${x}) — call`, x, depth);
    if (x in cache) {
      hits++;
      const v = cache[x];
      snap(4, `fib(${x}) cache HIT → ${v}`, x, depth, {
        cacheHit: true,
        result: v,
      });
      stack.pop();
      return v;
    }
    if (x < 2) {
      cache[x] = x;
      snap(5, `Base case fib(${x}) = ${x}`, x, depth, {
        solution: true,
        write: true,
        result: x,
      });
      stack.pop();
      return x;
    }
    snap(7, `Recurse: fib(${x - 1}) + fib(${x - 2})`, x, depth);
    const a = fib(x - 1, depth + 1);
    const b = fib(x - 2, depth + 1);
    const v = a + b;
    cache[x] = v;
    snap(7, `Store fib(${x}) = ${v}`, x, depth, {
      write: true,
      result: v,
    });
    stack.pop();
    return v;
  }

  fib(n, 0);
  return frames;
}

/* ---------- Fibonacci Tabulation tracer ---------- */
const FIB_TAB_CODE = `def fib(n):
    if n < 2:
        return n
    dp = [0] * (n + 1)
    dp[1] = 1
    for i in range(2, n + 1):
        dp[i] = dp[i - 1] + dp[i - 2]
    return dp[n]`;

function traceFibTab(n: number): FibTabFrame[] {
  const frames: FibTabFrame[] = [];
  const dp = new Array(Math.max(n + 1, 2)).fill(0);
  const snap = (line: number, note: string, i: number, extras: Partial<FibTabFrame> = {}) => {
    frames.push({
      kind: "fib-tab",
      line,
      note,
      depth: 0,
      n,
      dp: [...dp],
      i,
      ...extras,
    });
  };

  if (n < 2) {
    snap(2, `n < 2 → return ${n}`, 0, { solution: true });
    return frames;
  }
  snap(4, `Initialize dp = [0] * ${n + 1}`, 0);
  dp[1] = 1;
  snap(5, `dp[1] = 1 (base case)`, 1, { write: true });
  for (let i = 2; i <= n; i++) {
    snap(6, `i = ${i} — reading dp[${i - 1}] + dp[${i - 2}]`, i);
    dp[i] = dp[i - 1] + dp[i - 2];
    snap(7, `dp[${i}] = dp[${i - 1}] + dp[${i - 2}] = ${dp[i]}`, i, { write: true });
  }
  snap(8, `Return dp[${n}] = ${dp[n]}`, n, { solution: true });
  return frames;
}

/* ---------- Climbing Stairs tracer ---------- */
const STAIRS_CODE = `def climb_stairs(n):
    if n <= 2:
        return n
    dp = [0] * (n + 1)
    dp[1], dp[2] = 1, 2
    for i in range(3, n + 1):
        dp[i] = dp[i - 1] + dp[i - 2]
    return dp[n]`;

function traceStairs(n: number): StairsFrame[] {
  const frames: StairsFrame[] = [];
  const dp = new Array(Math.max(n + 1, 3)).fill(0);
  const snap = (line: number, note: string, i: number, extras: Partial<StairsFrame> = {}) => {
    frames.push({
      kind: "stairs",
      line,
      note,
      depth: 0,
      n,
      dp: [...dp],
      i,
      ...extras,
    });
  };

  if (n <= 2) {
    snap(2, `n ≤ 2 → return ${n}`, 0, { solution: true });
    return frames;
  }
  snap(4, `Initialize dp = [0] * ${n + 1}`, 0);
  dp[1] = 1;
  dp[2] = 2;
  snap(5, `Base cases: dp[1] = 1, dp[2] = 2`, 2, { write: true });
  for (let i = 3; i <= n; i++) {
    snap(6, `i = ${i}`, i);
    dp[i] = dp[i - 1] + dp[i - 2];
    snap(7, `dp[${i}] = dp[${i - 1}] + dp[${i - 2}] = ${dp[i]}`, i, { write: true });
  }
  snap(8, `Return dp[${n}] = ${dp[n]} distinct ways`, n, { solution: true });
  return frames;
}

/* ---------- Coin Change tracer ---------- */
const COIN_CODE = `def coin_change(coins, amount):
    INF = amount + 1
    dp = [INF] * (amount + 1)
    dp[0] = 0
    for a in range(1, amount + 1):
        for c in coins:
            if c <= a:
                dp[a] = min(dp[a], dp[a - c] + 1)
    return dp[amount] if dp[amount] != INF else -1`;

function traceCoin(coins: number[], amount: number): CoinFrame[] {
  const frames: CoinFrame[] = [];
  const INF = amount + 1;
  const dp = new Array(amount + 1).fill(INF);
  const snap = (line: number, note: string, a: number, extras: Partial<CoinFrame> = {}) => {
    frames.push({
      kind: "coin",
      line,
      note,
      depth: 0,
      coins: [...coins],
      amount,
      dp: [...dp],
      a,
      ...extras,
    });
  };

  snap(3, `Initialize dp = [INF] * ${amount + 1}`, 0);
  dp[0] = 0;
  snap(4, `dp[0] = 0 (base case)`, 0, { write: true });
  for (let a = 1; a <= amount; a++) {
    snap(5, `Compute dp[${a}]`, a);
    for (const c of coins) {
      snap(6, `Try coin ${c}`, a, { c });
      if (c <= a) {
        const cand = dp[a - c] + 1;
        if (cand < dp[a]) {
          dp[a] = cand;
          snap(8, `dp[${a}] = dp[${a - c}] + 1 = ${cand} (new best)`, a, {
            c,
            write: true,
          });
        } else {
          snap(8, `dp[${a}] stays ${dp[a] === INF ? "INF" : dp[a]} (${cand} not better)`, a, {
            c,
          });
        }
      } else {
        snap(7, `Coin ${c} > amount ${a} — skip`, a, { c });
      }
    }
  }
  const finalNote =
    dp[amount] === INF
      ? `Amount ${amount} unreachable → return -1`
      : `Return dp[${amount}] = ${dp[amount]} coins`;
  snap(9, finalNote, amount, { solution: true });
  return frames;
}

/* ---------- 0/1 Knapsack tracer ---------- */
const KNAPSACK_CODE = `def knapsack(weights, values, capacity):
    n = len(weights)
    dp = [[0] * (capacity + 1) for _ in range(n + 1)]
    for i in range(1, n + 1):
        for w in range(capacity + 1):
            if weights[i - 1] <= w:
                dp[i][w] = max(
                    dp[i - 1][w],
                    dp[i - 1][w - weights[i - 1]] + values[i - 1],
                )
            else:
                dp[i][w] = dp[i - 1][w]
    return dp[n][capacity]`;

function traceKnapsack(weights: number[], values: number[], capacity: number): KnapsackFrame[] {
  const frames: KnapsackFrame[] = [];
  const n = weights.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(capacity + 1).fill(0));
  const snap = (
    line: number,
    note: string,
    i: number,
    w: number,
    extras: Partial<KnapsackFrame> = {},
  ) => {
    frames.push({
      kind: "knapsack",
      line,
      note,
      depth: 0,
      weights: [...weights],
      values: [...values],
      capacity,
      dp: dp.map((r) => [...r]),
      i,
      w,
      ...extras,
    });
  };
  snap(3, `Initialize dp[${n + 1}][${capacity + 1}] = 0`, 0, 0, { decision: "init" });
  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= capacity; w++) {
      const wi = weights[i - 1];
      const vi = values[i - 1];
      if (wi <= w) {
        const skip = dp[i - 1][w];
        const take = dp[i - 1][w - wi] + vi;
        if (take > skip) {
          dp[i][w] = take;
          snap(
            7,
            `Item ${i} (w=${wi}, v=${vi}) TAKE → dp[${i}][${w}] = ${take}`,
            i,
            w,
            { decision: "take", write: true },
          );
        } else {
          dp[i][w] = skip;
          snap(
            7,
            `Item ${i} (w=${wi}, v=${vi}) SKIP → dp[${i}][${w}] = ${skip}`,
            i,
            w,
            { decision: "skip", write: true },
          );
        }
      } else {
        dp[i][w] = dp[i - 1][w];
        snap(
          12,
          `Item ${i} too heavy (w=${wi} > ${w}) → dp[${i}][${w}] = ${dp[i][w]}`,
          i,
          w,
          { decision: "skip", write: true },
        );
      }
    }
  }
  // traceback for selected
  const selected: number[] = [];
  let w = capacity;
  for (let i = n; i > 0; i--) {
    if (dp[i][w] !== dp[i - 1][w]) {
      selected.push(i);
      w -= weights[i - 1];
    }
  }
  selected.reverse();
  snap(
    13,
    `Optimal value = ${dp[n][capacity]} using items ${selected.length ? selected.join(", ") : "(none)"}`,
    n,
    capacity,
    { solution: true, selected },
  );
  return frames;
}

/* ---------- LCS tracer ---------- */
const LCS_CODE = `def lcs(s1, s2):
    m, n = len(s1), len(s2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if s1[i - 1] == s2[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + 1
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
    return dp[m][n]`;

function traceLcs(s1: string, s2: string): LcsFrame[] {
  const frames: LcsFrame[] = [];
  const m = s1.length;
  const n = s2.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  const snap = (
    line: number,
    note: string,
    i: number,
    j: number,
    extras: Partial<LcsFrame> = {},
  ) => {
    frames.push({
      kind: "lcs",
      line,
      note,
      depth: 0,
      s1,
      s2,
      dp: dp.map((r) => [...r]),
      i,
      j,
      ...extras,
    });
  };
  snap(3, `Initialize dp[${m + 1}][${n + 1}] = 0`, 0, 0);
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
        snap(
          7,
          `Match '${s1[i - 1]}' → dp[${i}][${j}] = dp[${i - 1}][${j - 1}] + 1 = ${dp[i][j]}`,
          i,
          j,
          { match: true, write: true },
        );
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        snap(
          9,
          `'${s1[i - 1]}' ≠ '${s2[j - 1]}' → dp[${i}][${j}] = max(${dp[i - 1][j]}, ${dp[i][j - 1]}) = ${dp[i][j]}`,
          i,
          j,
          { match: false, write: true },
        );
      }
    }
  }
  // traceback
  const path: [number, number][] = [];
  const chars: string[] = [];
  let i = m;
  let j = n;
  while (i > 0 && j > 0) {
    path.push([i, j]);
    if (s1[i - 1] === s2[j - 1]) {
      chars.push(s1[i - 1]);
      i--;
      j--;
    } else if (dp[i - 1][j] >= dp[i][j - 1]) {
      i--;
    } else {
      j--;
    }
  }
  chars.reverse();
  snap(10, `LCS length = ${dp[m][n]}, sequence = "${chars.join("")}"`, m, n, {
    solution: true,
    path,
    result: chars.join(""),
  });
  return frames;
}

/* ---------- LIS tracer (patience sorting) ---------- */
const LIS_CODE = `from bisect import bisect_left

def lis(arr):
    tails = []
    dp = [1] * len(arr)
    for i, x in enumerate(arr):
        pos = bisect_left(tails, x)
        if pos == len(tails):
            tails.append(x)
        else:
            tails[pos] = x
        dp[i] = pos + 1
    return len(tails)`;

function traceLis(arr: number[]): LisFrame[] {
  const frames: LisFrame[] = [];
  const tails: number[] = [];
  const dp: number[] = new Array(arr.length).fill(1);
  const snap = (line: number, note: string, i: number, extras: Partial<LisFrame> = {}) => {
    frames.push({
      kind: "lis",
      line,
      note,
      depth: 0,
      arr: [...arr],
      dp: [...dp],
      tails: [...tails],
      i,
      best: tails.length,
      ...extras,
    });
  };
  snap(4, `Initialize tails=[], dp=[1]*${arr.length}`, 0);
  for (let i = 0; i < arr.length; i++) {
    const x = arr[i];
    snap(6, `Consider arr[${i}] = ${x}`, i);
    // bisect_left
    let lo = 0;
    let hi = tails.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (tails[mid] < x) lo = mid + 1;
      else hi = mid;
    }
    const pos = lo;
    if (pos === tails.length) {
      tails.push(x);
      snap(9, `${x} extends tails → tails length ${tails.length}`, i, {
        j: pos,
        write: true,
      });
    } else {
      const old = tails[pos];
      tails[pos] = x;
      snap(11, `${x} replaces tails[${pos}] (${old} → ${x})`, i, {
        j: pos,
        write: true,
      });
    }
    dp[i] = pos + 1;
    snap(12, `dp[${i}] = ${dp[i]}`, i, { j: pos });
  }
  snap(13, `LIS length = ${tails.length}`, arr.length - 1, { solution: true });
  return frames;
}

/* ---------- Edit Distance tracer ---------- */
const EDIT_CODE = `def edit_distance(s1, s2):
    m, n = len(s1), len(s2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(m + 1): dp[i][0] = i
    for j in range(n + 1): dp[0][j] = j
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if s1[i - 1] == s2[j - 1]:
                dp[i][j] = dp[i - 1][j - 1]
            else:
                dp[i][j] = 1 + min(
                    dp[i - 1][j],      # delete
                    dp[i][j - 1],      # insert
                    dp[i - 1][j - 1],  # replace
                )
    return dp[m][n]`;

function traceEdit(s1: string, s2: string): EditFrame[] {
  const frames: EditFrame[] = [];
  const m = s1.length;
  const n = s2.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  const snap = (
    line: number,
    note: string,
    i: number,
    j: number,
    extras: Partial<EditFrame> = {},
  ) => {
    frames.push({
      kind: "edit",
      line,
      note,
      depth: 0,
      s1,
      s2,
      dp: dp.map((r) => [...r]),
      i,
      j,
      ...extras,
    });
  };
  snap(3, `Initialize dp[${m + 1}][${n + 1}]`, 0, 0, { op: "init" });
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  snap(5, `Base row/column set: dp[i][0]=i, dp[0][j]=j`, 0, 0, { op: "init", write: true });
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
        snap(
          8,
          `Match '${s1[i - 1]}' → dp[${i}][${j}] = dp[${i - 1}][${j - 1}] = ${dp[i][j]}`,
          i,
          j,
          { op: "match", write: true },
        );
      } else {
        const del = dp[i - 1][j];
        const ins = dp[i][j - 1];
        const rep = dp[i - 1][j - 1];
        const best = Math.min(del, ins, rep);
        dp[i][j] = 1 + best;
        const op: EditFrame["op"] =
          best === rep ? "replace" : best === del ? "delete" : "insert";
        snap(
          10,
          `'${s1[i - 1]}' ≠ '${s2[j - 1]}' → ${op} → dp[${i}][${j}] = 1 + ${best} = ${dp[i][j]}`,
          i,
          j,
          { op, write: true },
        );
      }
    }
  }
  // traceback
  const path: [number, number][] = [];
  let i = m;
  let j = n;
  while (i > 0 || j > 0) {
    path.push([i, j]);
    if (i > 0 && j > 0 && s1[i - 1] === s2[j - 1]) {
      i--;
      j--;
    } else {
      const del = i > 0 ? dp[i - 1][j] : Infinity;
      const ins = j > 0 ? dp[i][j - 1] : Infinity;
      const rep = i > 0 && j > 0 ? dp[i - 1][j - 1] : Infinity;
      const best = Math.min(del, ins, rep);
      if (best === rep) {
        i--;
        j--;
      } else if (best === del) {
        i--;
      } else {
        j--;
      }
    }
  }
  snap(15, `Edit distance = ${dp[m][n]}`, m, n, { solution: true, path });
  return frames;
}

/* ---------- Matrix Chain Multiplication tracer ---------- */
const MCM_CODE = `def matrix_chain(dims):
    n = len(dims) - 1
    dp = [[0] * n for _ in range(n)]
    split = [[0] * n for _ in range(n)]
    for L in range(2, n + 1):
        for i in range(n - L + 1):
            j = i + L - 1
            dp[i][j] = float("inf")
            for k in range(i, j):
                cost = dp[i][k] + dp[k + 1][j] + dims[i] * dims[k + 1] * dims[j + 1]
                if cost < dp[i][j]:
                    dp[i][j] = cost
                    split[i][j] = k
    return dp[0][n - 1]`;

function traceMcm(dims: number[]): McmFrame[] {
  const frames: McmFrame[] = [];
  const n = dims.length - 1;
  const dp: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));
  const split: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));
  const INF = Number.POSITIVE_INFINITY;
  const snap = (
    line: number,
    note: string,
    i: number,
    j: number,
    extras: Partial<McmFrame> = {},
  ) => {
    frames.push({
      kind: "mcm",
      line,
      note,
      depth: 0,
      dims: [...dims],
      dp: dp.map((r) => [...r]),
      split: split.map((r) => [...r]),
      i,
      j,
      ...extras,
    });
  };
  snap(3, `Initialize dp[${n}][${n}] = 0 (${n} matrices)`, 0, 0);
  for (let L = 2; L <= n; L++) {
    snap(5, `Chain length L = ${L}`, 0, L - 1, { L });
    for (let i = 0; i + L - 1 < n; i++) {
      const j = i + L - 1;
      dp[i][j] = INF;
      snap(8, `Interval [${i}..${j}] — try each split`, i, j, { L });
      for (let k = i; k < j; k++) {
        const cost =
          dp[i][k] + dp[k + 1][j] + dims[i] * dims[k + 1] * dims[j + 1];
        if (cost < dp[i][j]) {
          dp[i][j] = cost;
          split[i][j] = k;
          snap(
            11,
            `k=${k} cost=${cost} — new best for dp[${i}][${j}]`,
            i,
            j,
            { L, k, write: true },
          );
        } else {
          snap(11, `k=${k} cost=${cost} — keep dp[${i}][${j}] = ${dp[i][j]}`, i, j, {
            L,
            k,
          });
        }
      }
    }
  }
  // Build parenthesization
  function build(i: number, j: number): string {
    if (i === j) return `M${i + 1}`;
    const k = split[i][j];
    return `(${build(i, k)} × ${build(k + 1, j)})`;
  }
  const paren = n > 0 ? build(0, n - 1) : "";
  snap(
    13,
    `Minimum cost = ${dp[0][n - 1]} — optimal parens ${paren}`,
    0,
    n - 1,
    { solution: true, paren },
  );
  return frames;
}

/* ---------- Problems registry ---------- */
type ProblemKey =
  | "fib-memo"
  | "fib-tab"
  | "stairs"
  | "coin"
  | "knapsack"
  | "lcs"
  | "lis"
  | "edit"
  | "mcm";

type ProblemDef = {
  id: ProblemKey;
  name: string;
  description: string;
  code: string;
  fileName: string;
};

const PROBLEMS: ProblemDef[] = [
  {
    id: "fib-memo",
    name: "Fibonacci — Memoization",
    description:
      "Recursive Fibonacci with a cache. Watch the call stack unwind, see the cache populate, and count how many times a cache HIT saves an entire subtree of work.",
    code: FIB_MEMO_CODE,
    fileName: "fib_memo.py",
  },
  {
    id: "fib-tab",
    name: "Fibonacci — Tabulation",
    description:
      "Iterative bottom-up Fibonacci. The dp table fills left to right; each cell is computed from the two on its left.",
    code: FIB_TAB_CODE,
    fileName: "fib_tab.py",
  },
  {
    id: "stairs",
    name: "Climbing Stairs",
    description:
      "Count distinct ways to climb n stairs taking 1 or 2 steps at a time. Same recurrence as Fibonacci, different base cases.",
    code: STAIRS_CODE,
    fileName: "climb_stairs.py",
  },
  {
    id: "coin",
    name: "Coin Change",
    description:
      "Minimum coins to make a target amount. Each amount tries every coin denomination and adopts the best subresult.",
    code: COIN_CODE,
    fileName: "coin_change.py",
  },
  {
    id: "knapsack",
    name: "0/1 Knapsack",
    description:
      "Given items with weights and values, maximise value under a capacity limit. The 2-D table records the best value for each (item-count, capacity) state; each cell records a take-or-skip decision.",
    code: KNAPSACK_CODE,
    fileName: "knapsack.py",
  },
  {
    id: "lcs",
    name: "Longest Common Subsequence",
    description:
      "Fill an (m+1) × (n+1) grid — match a character or take the best of the two neighbours. Traceback reconstructs the actual subsequence.",
    code: LCS_CODE,
    fileName: "lcs.py",
  },
  {
    id: "lis",
    name: "Longest Increasing Subsequence",
    description:
      "Patience-sort variant using bisect. The tails array keeps the smallest possible tail for every LIS length — its final length is the LIS length.",
    code: LIS_CODE,
    fileName: "lis.py",
  },
  {
    id: "edit",
    name: "Edit Distance",
    description:
      "Minimum insert / delete / replace operations to transform s1 into s2. Each cell picks the cheapest of the three neighbours (plus 1) when characters differ.",
    code: EDIT_CODE,
    fileName: "edit_distance.py",
  },
  {
    id: "mcm",
    name: "Matrix Chain Multiplication",
    description:
      "Interval DP over matrix chains. Fill the upper triangle by chain length; each interval tries every split point k and keeps the cheapest.",
    code: MCM_CODE,
    fileName: "matrix_chain.py",
  },
];

/* ---------- Page ---------- */
function Page() {
  const [problemId, setProblemId] = useState<ProblemKey>("fib-memo");
  const problem = PROBLEMS.find((p) => p.id === problemId)!;

  const [fibN, setFibN] = useState(6);
  const [stairsN, setStairsN] = useState(6);
  const [coinInput, setCoinInput] = useState("1,2,5");
  const [coinAmount, setCoinAmount] = useState(11);

  // Knapsack
  const [knapWeights, setKnapWeights] = useState("2,3,4,5");
  const [knapValues, setKnapValues] = useState("3,4,5,6");
  const [knapCap, setKnapCap] = useState(8);

  // LCS
  const [lcsS1, setLcsS1] = useState("AGCAT");
  const [lcsS2, setLcsS2] = useState("GAC");

  // LIS
  const [lisInput, setLisInput] = useState("10,9,2,5,3,7,101,18");

  // Edit distance
  const [editS1, setEditS1] = useState("kitten");
  const [editS2, setEditS2] = useState("sitting");

  // MCM
  const [mcmDims, setMcmDims] = useState("30,35,15,5,10,20");

  const frames: AnyFrame[] = useMemo(() => {
    if (problem.id === "fib-memo") return traceFibMemo(fibN);
    if (problem.id === "fib-tab") return traceFibTab(fibN);
    if (problem.id === "stairs") return traceStairs(stairsN);
    if (problem.id === "coin") {
      const coins = coinInput
        .split(/[,\s]+/)
        .map((s) => parseInt(s.trim(), 10))
        .filter((n) => Number.isFinite(n) && n > 0)
        .slice(0, 5);
      return traceCoin(coins.length ? coins : [1, 2, 5], Math.max(1, Math.min(coinAmount, 20)));
    }
    if (problem.id === "knapsack") {
      const parse = (s: string) =>
        s
          .split(/[,\s]+/)
          .map((v) => parseInt(v.trim(), 10))
          .filter((v) => Number.isFinite(v) && v > 0)
          .slice(0, 6);
      const ws = parse(knapWeights);
      const vs = parse(knapValues);
      const n = Math.min(ws.length, vs.length) || 1;
      return traceKnapsack(
        ws.slice(0, n).length ? ws.slice(0, n) : [2],
        vs.slice(0, n).length ? vs.slice(0, n) : [3],
        Math.max(1, Math.min(knapCap, 15)),
      );
    }
    if (problem.id === "lcs") {
      return traceLcs(
        (lcsS1 || "A").slice(0, 8).toUpperCase(),
        (lcsS2 || "A").slice(0, 8).toUpperCase(),
      );
    }
    if (problem.id === "lis") {
      const arr = lisInput
        .split(/[,\s]+/)
        .map((s) => parseInt(s.trim(), 10))
        .filter((n) => Number.isFinite(n))
        .slice(0, 10);
      return traceLis(arr.length ? arr : [1, 2, 3]);
    }
    if (problem.id === "edit") {
      return traceEdit((editS1 || "a").slice(0, 8), (editS2 || "a").slice(0, 8));
    }
    // mcm
    const dims = mcmDims
      .split(/[,\s]+/)
      .map((s) => parseInt(s.trim(), 10))
      .filter((v) => Number.isFinite(v) && v > 0)
      .slice(0, 7);
    return traceMcm(dims.length >= 2 ? dims : [10, 20, 30]);
  }, [
    problem.id,
    fibN,
    stairsN,
    coinInput,
    coinAmount,
    knapWeights,
    knapValues,
    knapCap,
    lcsS1,
    lcsS2,
    lisInput,
    editS1,
    editS2,
    mcmDims,
  ]);

  const [step, setStep] = useState(0);
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(500);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setStep(0);
    setRunning(false);
  }, [
    problem.id,
    fibN,
    stairsN,
    coinInput,
    coinAmount,
    knapWeights,
    knapValues,
    knapCap,
    lcsS1,
    lcsS2,
    lisInput,
    editS1,
    editS2,
    mcmDims,
  ]);

  useEffect(() => {
    if (!running) return;
    timerRef.current = setInterval(() => {
      setStep((s) => {
        if (s >= frames.length - 1) {
          setRunning(false);
          return s;
        }
        return s + 1;
      });
    }, speed);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [running, speed, frames.length]);

  const frame = frames[Math.min(step, frames.length - 1)];
  const done = step >= frames.length - 1;

  const randomize = () => {
    if (problem.id === "fib-memo" || problem.id === "fib-tab") {
      setFibN(2 + Math.floor(Math.random() * 9));
    } else if (problem.id === "stairs") {
      setStairsN(1 + Math.floor(Math.random() * 12));
    } else if (problem.id === "coin") {
      const options = ["1,2,5", "1,3,4", "2,5,10", "1,5,7"];
      setCoinInput(options[Math.floor(Math.random() * options.length)]);
      setCoinAmount(3 + Math.floor(Math.random() * 15));
    } else if (problem.id === "knapsack") {
      const n = 3 + Math.floor(Math.random() * 3);
      const ws = Array.from({ length: n }, () => 1 + Math.floor(Math.random() * 5));
      const vs = Array.from({ length: n }, () => 1 + Math.floor(Math.random() * 8));
      setKnapWeights(ws.join(","));
      setKnapValues(vs.join(","));
      setKnapCap(5 + Math.floor(Math.random() * 8));
    } else if (problem.id === "lcs") {
      const pool = "ABCDG";
      const rnd = (len: number) =>
        Array.from({ length: len }, () => pool[Math.floor(Math.random() * pool.length)]).join("");
      setLcsS1(rnd(4 + Math.floor(Math.random() * 3)));
      setLcsS2(rnd(4 + Math.floor(Math.random() * 3)));
    } else if (problem.id === "lis") {
      const n = 6 + Math.floor(Math.random() * 4);
      const arr = Array.from({ length: n }, () => 1 + Math.floor(Math.random() * 30));
      setLisInput(arr.join(","));
    } else if (problem.id === "edit") {
      const samples: [string, string][] = [
        ["kitten", "sitting"],
        ["horse", "ros"],
        ["intention", "execution"],
        ["abc", "yabd"],
      ];
      const [a, b] = samples[Math.floor(Math.random() * samples.length)];
      setEditS1(a);
      setEditS2(b);
    } else {
      const n = 4 + Math.floor(Math.random() * 3);
      const dims = Array.from({ length: n + 1 }, () => 5 + Math.floor(Math.random() * 30));
      setMcmDims(dims.join(","));
    }
  };

  return (
    <PageShell>
      <PlaygroundBackButton playground="dp" />
      <PageHeader
        eyebrow="Dynamic Programming Playground"
        title="Watch DP tables and caches fill — live"
        description="Pick a classic DP problem, step through every transition, and see how each subproblem's answer flows into the next."
      />

      <Callout kind="tip" title="Reading the visualization">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            The <span className="font-semibold text-foreground">code panel</span> highlights the
            line the algorithm is currently executing.
          </li>
          <li>
            The <span className="font-semibold text-foreground">state panel</span> shows the DP
            table, cache, or auxiliary array being built.
          </li>
          <li>
            Amber cells mean a <span className="font-semibold">lookup / compare</span>; blue cells
            mean a <span className="font-semibold">write</span>; green marks the{" "}
            <span className="font-semibold">final answer</span> or optimal traceback.
          </li>
        </ul>
      </Callout>

      {/* Controls */}
      <div className="card-surface mt-6 p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[240px]">
            <div className="mb-1 text-xs text-muted-foreground">Problem</div>
            <div className="flex flex-wrap gap-2">
              {PROBLEMS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setProblemId(p.id)}
                  className={`rounded-full border px-3 py-1 text-xs transition ${
                    p.id === problemId
                      ? "border-[color:var(--brand)] bg-[color:var(--brand)]/15 text-foreground"
                      : "border-border bg-card text-muted-foreground hover:bg-accent"
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {(problem.id === "fib-memo" || problem.id === "fib-tab") && (
            <div>
              <div className="mb-1 text-xs text-muted-foreground">n = {fibN}</div>
              <input
                type="range"
                min={2}
                max={10}
                value={fibN}
                onChange={(e) => setFibN(parseInt(e.target.value, 10))}
                className="w-40 accent-[color:var(--brand)]"
              />
            </div>
          )}

          {problem.id === "stairs" && (
            <div>
              <div className="mb-1 text-xs text-muted-foreground">n = {stairsN}</div>
              <input
                type="range"
                min={1}
                max={12}
                value={stairsN}
                onChange={(e) => setStairsN(parseInt(e.target.value, 10))}
                className="w-40 accent-[color:var(--brand)]"
              />
            </div>
          )}

          {problem.id === "coin" && (
            <>
              <div>
                <div className="mb-1 text-xs text-muted-foreground">Coins (≤ 5)</div>
                <input
                  type="text"
                  value={coinInput}
                  onChange={(e) => setCoinInput(e.target.value)}
                  className="w-32 rounded-md border border-input bg-background px-2 py-1 font-mono text-xs"
                />
              </div>
              <div>
                <div className="mb-1 text-xs text-muted-foreground">Amount = {coinAmount}</div>
                <input
                  type="range"
                  min={1}
                  max={20}
                  value={coinAmount}
                  onChange={(e) => setCoinAmount(parseInt(e.target.value, 10))}
                  className="w-40 accent-[color:var(--brand)]"
                />
              </div>
            </>
          )}

          {problem.id === "knapsack" && (
            <>
              <div>
                <div className="mb-1 text-xs text-muted-foreground">Weights</div>
                <input
                  type="text"
                  value={knapWeights}
                  onChange={(e) => setKnapWeights(e.target.value)}
                  className="w-32 rounded-md border border-input bg-background px-2 py-1 font-mono text-xs"
                />
              </div>
              <div>
                <div className="mb-1 text-xs text-muted-foreground">Values</div>
                <input
                  type="text"
                  value={knapValues}
                  onChange={(e) => setKnapValues(e.target.value)}
                  className="w-32 rounded-md border border-input bg-background px-2 py-1 font-mono text-xs"
                />
              </div>
              <div>
                <div className="mb-1 text-xs text-muted-foreground">Capacity = {knapCap}</div>
                <input
                  type="range"
                  min={1}
                  max={15}
                  value={knapCap}
                  onChange={(e) => setKnapCap(parseInt(e.target.value, 10))}
                  className="w-40 accent-[color:var(--brand)]"
                />
              </div>
            </>
          )}

          {problem.id === "lcs" && (
            <>
              <div>
                <div className="mb-1 text-xs text-muted-foreground">s1 (≤ 8)</div>
                <input
                  type="text"
                  value={lcsS1}
                  onChange={(e) => setLcsS1(e.target.value.slice(0, 8))}
                  className="w-28 rounded-md border border-input bg-background px-2 py-1 font-mono text-xs uppercase"
                />
              </div>
              <div>
                <div className="mb-1 text-xs text-muted-foreground">s2 (≤ 8)</div>
                <input
                  type="text"
                  value={lcsS2}
                  onChange={(e) => setLcsS2(e.target.value.slice(0, 8))}
                  className="w-28 rounded-md border border-input bg-background px-2 py-1 font-mono text-xs uppercase"
                />
              </div>
            </>
          )}

          {problem.id === "lis" && (
            <div>
              <div className="mb-1 text-xs text-muted-foreground">Sequence (≤ 10)</div>
              <input
                type="text"
                value={lisInput}
                onChange={(e) => setLisInput(e.target.value)}
                className="w-64 rounded-md border border-input bg-background px-2 py-1 font-mono text-xs"
              />
            </div>
          )}

          {problem.id === "edit" && (
            <>
              <div>
                <div className="mb-1 text-xs text-muted-foreground">source (≤ 8)</div>
                <input
                  type="text"
                  value={editS1}
                  onChange={(e) => setEditS1(e.target.value.slice(0, 8))}
                  className="w-28 rounded-md border border-input bg-background px-2 py-1 font-mono text-xs"
                />
              </div>
              <div>
                <div className="mb-1 text-xs text-muted-foreground">target (≤ 8)</div>
                <input
                  type="text"
                  value={editS2}
                  onChange={(e) => setEditS2(e.target.value.slice(0, 8))}
                  className="w-28 rounded-md border border-input bg-background px-2 py-1 font-mono text-xs"
                />
              </div>
            </>
          )}

          {problem.id === "mcm" && (
            <div>
              <div className="mb-1 text-xs text-muted-foreground">Dims (≤ 7)</div>
              <input
                type="text"
                value={mcmDims}
                onChange={(e) => setMcmDims(e.target.value)}
                className="w-64 rounded-md border border-input bg-background px-2 py-1 font-mono text-xs"
              />
            </div>
          )}

          <div>
            <div className="mb-1 text-xs text-muted-foreground">
              Speed ({(1000 / speed).toFixed(1)} steps/s)
            </div>
            <input
              type="range"
              min={100}
              max={1200}
              value={1300 - speed}
              onChange={(e) => setSpeed(1300 - parseInt(e.target.value, 10))}
              className="w-40 accent-[color:var(--brand)]"
            />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-3 py-1.5 text-xs hover:bg-accent"
          >
            <StepBack className="h-3.5 w-3.5" /> Prev
          </button>
          <button
            onClick={() => setRunning((r) => !r)}
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
            onClick={() => setStep((s) => Math.min(frames.length - 1, s + 1))}
            className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-3 py-1.5 text-xs hover:bg-accent"
          >
            <StepForward className="h-3.5 w-3.5" /> Next
          </button>
          <button
            onClick={() => {
              setStep(0);
              setRunning(false);
            }}
            className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-3 py-1.5 text-xs hover:bg-accent"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reset
          </button>
          <button
            onClick={randomize}
            className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-3 py-1.5 text-xs hover:bg-accent"
          >
            <Shuffle className="h-3.5 w-3.5" /> Random
          </button>
          <div className="ml-auto text-xs text-muted-foreground">
            Step {Math.min(step + 1, frames.length)} / {frames.length}
          </div>
        </div>
      </div>

      {/* Visualization */}
      <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,320px)]">
        <div className="card-surface p-4 overflow-x-auto">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-sm font-semibold">Visualization</div>
            <div className="text-xs text-muted-foreground">depth {frame?.depth ?? 0}</div>
          </div>
          <FrameVisualizer frame={frame} />
          <div
            className={`mt-3 rounded-md border px-3 py-2 text-sm ${
              frame?.solution
                ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-600"
                : frame?.cacheHit
                  ? "border-amber-500/50 bg-amber-500/10 text-amber-600"
                  : frame?.write
                    ? "border-sky-500/50 bg-sky-500/10 text-sky-600"
                    : "border-border bg-muted/40 text-muted-foreground"
            }`}
          >
            {frame?.note ?? "Press Play to start."}
          </div>
        </div>

        <div className="card-surface p-4">
          <div className="mb-2 text-sm font-semibold">Live statistics</div>
          <FrameStats frame={frame} />
        </div>
      </div>

      {/* Code viewer */}
      <div className="mt-6">
        <CodeViewer
          code={problem.code}
          title={problem.fileName}
          activeLine={frame?.line}
          defaultExpanded
        />
      </div>

      {/* About */}
      <div className="mt-6 card-surface p-4">
        <div className="mb-2 text-sm font-semibold">About this problem</div>
        <p className="text-sm text-muted-foreground">{problem.description}</p>
      </div>

      <PlaygroundFooterNav playground="dp" />
    </PageShell>
  );
}

/* ---------- Sub-renderers ---------- */

function FrameVisualizer({ frame }: { frame: AnyFrame | undefined }) {
  if (!frame) return <div className="h-40" />;
  if (frame.kind === "fib-memo") return <FibMemoViz f={frame} />;
  if (frame.kind === "fib-tab") return <ArrayDpViz dp={frame.dp} highlight={frame.i} label="dp" />;
  if (frame.kind === "stairs")
    return <ArrayDpViz dp={frame.dp} highlight={frame.i} label="dp" />;
  if (frame.kind === "coin") return <CoinViz f={frame} />;
  if (frame.kind === "knapsack") return <KnapsackViz f={frame} />;
  if (frame.kind === "lcs") return <LcsViz f={frame} />;
  if (frame.kind === "lis") return <LisViz f={frame} />;
  if (frame.kind === "edit") return <EditViz f={frame} />;
  return <McmViz f={frame} />;
}

function FibMemoViz({ f }: { f: FibMemoFrame }) {
  const keys = Object.keys(f.cache)
    .map((k) => parseInt(k, 10))
    .sort((a, b) => a - b);
  return (
    <div className="space-y-4">
      <div>
        <div className="mb-1 text-xs text-muted-foreground">Call stack (top = current)</div>
        <div className="flex min-h-[38px] flex-wrap items-center gap-2 rounded-md border border-border bg-background p-2">
          {f.stack.length === 0 ? (
            <span className="text-xs text-muted-foreground">empty</span>
          ) : (
            f.stack.map((v, i) => (
              <span
                key={i}
                className={`rounded-md px-2.5 py-1 font-mono text-sm ${
                  i === f.stack.length - 1
                    ? "bg-[color:var(--brand)]/20 text-[color:var(--brand)]"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                fib({v})
              </span>
            ))
          )}
        </div>
      </div>
      <div>
        <div className="mb-1 text-xs text-muted-foreground">
          Memo cache ({keys.length} entries)
        </div>
        <div className="grid gap-2 sm:grid-cols-4 md:grid-cols-6">
          {keys.length === 0 && (
            <div className="col-span-full text-xs text-muted-foreground">empty</div>
          )}
          {keys.map((k) => {
            const isHit = f.cacheHit && f.arg === k;
            const isWrite = f.write && f.arg === k;
            return (
              <div
                key={k}
                className={`rounded-md border px-2 py-1.5 font-mono text-xs transition ${
                  isHit
                    ? "border-amber-500/60 bg-amber-500/10 text-amber-600"
                    : isWrite
                      ? "border-sky-500/60 bg-sky-500/10 text-sky-600"
                      : "border-border bg-background"
                }`}
              >
                fib({k}) = {f.cache[k]}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ArrayDpViz({
  dp,
  highlight,
  label,
}: {
  dp: number[];
  highlight: number;
  label: string;
}) {
  return (
    <div>
      <div className="mb-1 text-xs text-muted-foreground">
        {label} table ({dp.length} cells)
      </div>
      <div className="flex flex-wrap gap-1.5">
        {dp.map((v, i) => (
          <div key={i} className="flex flex-col items-center gap-0.5">
            <div className="text-[10px] text-muted-foreground">{i}</div>
            <div
              className={`grid h-10 min-w-[42px] place-items-center rounded-md border font-mono text-sm transition ${
                i === highlight
                  ? "border-[color:var(--brand)] bg-[color:var(--brand)]/15 text-[color:var(--brand)]"
                  : "border-border bg-background text-foreground"
              }`}
            >
              {v}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CoinViz({ f }: { f: CoinFrame }) {
  const INF = f.amount + 1;
  return (
    <div className="space-y-4">
      <div>
        <div className="mb-1 text-xs text-muted-foreground">
          Coins {f.c !== undefined && <span className="text-[color:var(--brand)]">(trying {f.c})</span>}
        </div>
        <div className="flex flex-wrap gap-2">
          {f.coins.map((c, i) => (
            <span
              key={i}
              className={`rounded-md border px-3 py-1 font-mono text-sm ${
                c === f.c
                  ? "border-amber-500 bg-amber-500/10 text-amber-600"
                  : "border-border bg-background text-muted-foreground"
              }`}
            >
              {c}
            </span>
          ))}
        </div>
      </div>
      <div>
        <div className="mb-1 text-xs text-muted-foreground">
          dp table (target amount = {f.amount})
        </div>
        <div className="flex flex-wrap gap-1.5">
          {f.dp.map((v, i) => (
            <div key={i} className="flex flex-col items-center gap-0.5">
              <div className="text-[10px] text-muted-foreground">{i}</div>
              <div
                className={`grid h-10 min-w-[42px] place-items-center rounded-md border font-mono text-xs transition ${
                  i === f.a
                    ? "border-[color:var(--brand)] bg-[color:var(--brand)]/15 text-[color:var(--brand)]"
                    : "border-border bg-background text-foreground"
                }`}
              >
                {v >= INF ? "∞" : v}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- 2-D table helper ---------- */
function Grid2D({
  dp,
  rows,
  cols,
  active,
  highlightSet,
  cellClass,
  renderCell,
}: {
  dp: number[][];
  rows: string[];
  cols: string[];
  active?: [number, number];
  highlightSet?: Set<string>;
  cellClass?: (i: number, j: number) => string;
  renderCell?: (v: number, i: number, j: number) => React.ReactNode;
}) {
  return (
    <div className="inline-block overflow-x-auto">
      <table className="border-separate border-spacing-1 font-mono text-xs">
        <thead>
          <tr>
            <th></th>
            {cols.map((c, j) => (
              <th key={j} className="w-9 text-center text-[10px] text-muted-foreground">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dp.map((row, i) => (
            <tr key={i}>
              <th className="pr-1 text-right text-[10px] text-muted-foreground">
                {rows[i] ?? ""}
              </th>
              {row.map((v, j) => {
                const isActive = active && active[0] === i && active[1] === j;
                const inPath = highlightSet?.has(`${i},${j}`);
                const extra = cellClass?.(i, j) ?? "";
                return (
                  <td key={j}>
                    <div
                      className={`grid h-9 w-9 place-items-center rounded border transition ${
                        isActive
                          ? "border-[color:var(--brand)] bg-[color:var(--brand)]/20 text-[color:var(--brand)]"
                          : inPath
                            ? "border-emerald-500/60 bg-emerald-500/10 text-emerald-600"
                            : "border-border bg-background text-foreground"
                      } ${extra}`}
                    >
                      {renderCell ? renderCell(v, i, j) : v}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function KnapsackViz({ f }: { f: KnapsackFrame }) {
  const rows = ["·", ...f.weights.map((_, i) => `i${i + 1}`)];
  const cols = Array.from({ length: f.capacity + 1 }, (_, j) => String(j));
  const selectedSet = new Set(f.selected ?? []);
  return (
    <div className="space-y-4">
      <div>
        <div className="mb-1 text-xs text-muted-foreground">Items (weight / value)</div>
        <div className="flex flex-wrap gap-2">
          {f.weights.map((w, i) => {
            const isCur = f.i === i + 1;
            const isSel = selectedSet.has(i + 1);
            return (
              <div
                key={i}
                className={`rounded-md border px-3 py-1 font-mono text-xs ${
                  isSel
                    ? "border-emerald-500/60 bg-emerald-500/10 text-emerald-600"
                    : isCur
                      ? "border-[color:var(--brand)] bg-[color:var(--brand)]/10 text-[color:var(--brand)]"
                      : "border-border bg-background text-muted-foreground"
                }`}
              >
                #{i + 1} · w{w}/v{f.values[i]}
              </div>
            );
          })}
        </div>
      </div>
      <div>
        <div className="mb-1 text-xs text-muted-foreground">
          dp[i][w] — capacity across, items down
        </div>
        <Grid2D dp={f.dp} rows={rows} cols={cols} active={[f.i, f.w]} />
      </div>
    </div>
  );
}

function LcsViz({ f }: { f: LcsFrame }) {
  const rows = ["·", ...f.s1.split("")];
  const cols = ["·", ...f.s2.split("")];
  const pathSet = new Set((f.path ?? []).map(([i, j]) => `${i},${j}`));
  return (
    <div className="space-y-3">
      <div className="flex gap-4 text-xs">
        <div>
          <span className="text-muted-foreground">s1:</span>{" "}
          <span className="font-mono">
            {f.s1.split("").map((ch, k) => (
              <span
                key={k}
                className={
                  k === f.i - 1
                    ? "rounded bg-[color:var(--brand)]/20 px-1 text-[color:var(--brand)]"
                    : ""
                }
              >
                {ch}
              </span>
            ))}
          </span>
        </div>
        <div>
          <span className="text-muted-foreground">s2:</span>{" "}
          <span className="font-mono">
            {f.s2.split("").map((ch, k) => (
              <span
                key={k}
                className={
                  k === f.j - 1
                    ? "rounded bg-[color:var(--brand)]/20 px-1 text-[color:var(--brand)]"
                    : ""
                }
              >
                {ch}
              </span>
            ))}
          </span>
        </div>
      </div>
      <Grid2D dp={f.dp} rows={rows} cols={cols} active={[f.i, f.j]} highlightSet={pathSet} />
      {f.result !== undefined && (
        <div className="text-xs">
          <span className="text-muted-foreground">LCS:</span>{" "}
          <span className="font-mono text-emerald-600">{f.result || "(empty)"}</span>
        </div>
      )}
    </div>
  );
}

function LisViz({ f }: { f: LisFrame }) {
  return (
    <div className="space-y-4">
      <div>
        <div className="mb-1 text-xs text-muted-foreground">Input array</div>
        <div className="flex flex-wrap gap-1.5">
          {f.arr.map((v, i) => (
            <div key={i} className="flex flex-col items-center gap-0.5">
              <div className="text-[10px] text-muted-foreground">{i}</div>
              <div
                className={`grid h-10 min-w-[42px] place-items-center rounded-md border font-mono text-sm transition ${
                  i === f.i
                    ? "border-[color:var(--brand)] bg-[color:var(--brand)]/15 text-[color:var(--brand)]"
                    : "border-border bg-background"
                }`}
              >
                {v}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <div className="mb-1 text-xs text-muted-foreground">tails array (length = LIS so far)</div>
        <div className="flex flex-wrap gap-1.5">
          {f.tails.length === 0 && <span className="text-xs text-muted-foreground">empty</span>}
          {f.tails.map((v, i) => (
            <div
              key={i}
              className={`grid h-10 min-w-[42px] place-items-center rounded-md border font-mono text-sm ${
                i === f.j
                  ? "border-sky-500/60 bg-sky-500/10 text-sky-600"
                  : "border-border bg-background"
              }`}
            >
              {v}
            </div>
          ))}
        </div>
      </div>
      <div>
        <div className="mb-1 text-xs text-muted-foreground">dp[i] — LIS length ending at i</div>
        <div className="flex flex-wrap gap-1.5">
          {f.dp.map((v, i) => (
            <div
              key={i}
              className={`grid h-8 min-w-[32px] place-items-center rounded-md border font-mono text-xs ${
                i === f.i
                  ? "border-[color:var(--brand)] bg-[color:var(--brand)]/15 text-[color:var(--brand)]"
                  : "border-border bg-background text-muted-foreground"
              }`}
            >
              {v}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function EditViz({ f }: { f: EditFrame }) {
  const rows = ["·", ...f.s1.split("")];
  const cols = ["·", ...f.s2.split("")];
  const pathSet = new Set((f.path ?? []).map(([i, j]) => `${i},${j}`));
  const opColor: Record<NonNullable<EditFrame["op"]>, string> = {
    match: "text-emerald-600",
    insert: "text-sky-600",
    delete: "text-rose-600",
    replace: "text-amber-600",
    init: "text-muted-foreground",
  };
  return (
    <div className="space-y-3">
      <div className="flex gap-4 text-xs">
        <div>
          <span className="text-muted-foreground">source:</span>{" "}
          <span className="font-mono">{f.s1}</span>
        </div>
        <div>
          <span className="text-muted-foreground">target:</span>{" "}
          <span className="font-mono">{f.s2}</span>
        </div>
        {f.op && (
          <div className={`font-mono ${opColor[f.op]}`}>op: {f.op}</div>
        )}
      </div>
      <Grid2D dp={f.dp} rows={rows} cols={cols} active={[f.i, f.j]} highlightSet={pathSet} />
    </div>
  );
}

function McmViz({ f }: { f: McmFrame }) {
  const n = f.dims.length - 1;
  const rows = Array.from({ length: n }, (_, i) => `M${i + 1}`);
  const cols = Array.from({ length: n }, (_, j) => `M${j + 1}`);
  return (
    <div className="space-y-4">
      <div>
        <div className="mb-1 text-xs text-muted-foreground">
          Matrix chain (dims): {f.dims.join(" × ")}
        </div>
        <div className="flex flex-wrap gap-2">
          {rows.map((r, i) => (
            <span
              key={i}
              className="rounded-md border border-border bg-background px-2 py-1 font-mono text-xs"
            >
              {r} [{f.dims[i]}×{f.dims[i + 1]}]
            </span>
          ))}
        </div>
      </div>
      <div>
        <div className="mb-1 text-xs text-muted-foreground">
          dp[i][j] — minimum cost for interval [i..j]
        </div>
        <Grid2D
          dp={f.dp}
          rows={rows}
          cols={cols}
          active={[f.i, f.j]}
          cellClass={(i, j) => (i > j ? "opacity-30" : "")}
          renderCell={(v, i, j) => (i > j ? "·" : v)}
        />
      </div>
      {f.paren && (
        <div className="text-xs">
          <span className="text-muted-foreground">Optimal parens:</span>{" "}
          <span className="font-mono text-emerald-600">{f.paren}</span>
        </div>
      )}
    </div>
  );
}

function FrameStats({ frame }: { frame: AnyFrame | undefined }) {
  if (!frame) {
    return <div className="text-xs text-muted-foreground">Press Play to begin.</div>;
  }
  const rows: { label: string; value: string | number }[] = [];
  if (frame.kind === "fib-memo") {
    rows.push({ label: "n", value: frame.n });
    rows.push({ label: "Calls", value: frame.calls });
    rows.push({ label: "Cache hits", value: frame.hits });
    rows.push({ label: "Cache size", value: Object.keys(frame.cache).length });
    rows.push({ label: "Stack depth", value: frame.stack.length });
    rows.push({ label: "Time", value: "O(n)" });
    rows.push({ label: "Space", value: "O(n)" });
  } else if (frame.kind === "fib-tab") {
    rows.push({ label: "n", value: frame.n });
    rows.push({ label: "i", value: frame.i });
    rows.push({ label: "dp[i]", value: frame.dp[frame.i] ?? "—" });
    rows.push({ label: "Time", value: "O(n)" });
    rows.push({ label: "Space", value: "O(n)" });
  } else if (frame.kind === "stairs") {
    rows.push({ label: "n", value: frame.n });
    rows.push({ label: "i", value: frame.i });
    rows.push({ label: "Ways so far", value: frame.dp[frame.i] ?? "—" });
    rows.push({ label: "Time", value: "O(n)" });
    rows.push({ label: "Space", value: "O(n)" });
  } else if (frame.kind === "coin") {
    const INF = frame.amount + 1;
    rows.push({ label: "Amount", value: frame.amount });
    rows.push({ label: "Sub-amount a", value: frame.a });
    rows.push({
      label: `dp[${frame.a}]`,
      value: frame.dp[frame.a] >= INF ? "∞" : frame.dp[frame.a],
    });
    rows.push({
      label: `dp[${frame.amount}]`,
      value: frame.dp[frame.amount] >= INF ? "∞" : frame.dp[frame.amount],
    });
    rows.push({ label: "Time", value: "O(n·A)" });
    rows.push({ label: "Space", value: "O(A)" });
  } else if (frame.kind === "knapsack") {
    rows.push({ label: "Items", value: frame.weights.length });
    rows.push({ label: "Capacity", value: frame.capacity });
    rows.push({ label: "i", value: frame.i });
    rows.push({ label: "w", value: frame.w });
    rows.push({ label: `dp[${frame.i}][${frame.w}]`, value: frame.dp[frame.i]?.[frame.w] ?? "—" });
    if (frame.decision) rows.push({ label: "Decision", value: frame.decision });
    if (frame.selected)
      rows.push({ label: "Selected", value: frame.selected.join(", ") || "(none)" });
    rows.push({ label: "Time", value: "O(n·W)" });
    rows.push({ label: "Space", value: "O(n·W)" });
  } else if (frame.kind === "lcs") {
    rows.push({ label: "|s1|", value: frame.s1.length });
    rows.push({ label: "|s2|", value: frame.s2.length });
    rows.push({ label: "i", value: frame.i });
    rows.push({ label: "j", value: frame.j });
    rows.push({ label: `dp[${frame.i}][${frame.j}]`, value: frame.dp[frame.i]?.[frame.j] ?? 0 });
    if (frame.match !== undefined) rows.push({ label: "Match?", value: frame.match ? "yes" : "no" });
    if (frame.result !== undefined) rows.push({ label: "LCS", value: frame.result || "(empty)" });
    rows.push({ label: "Time", value: "O(m·n)" });
    rows.push({ label: "Space", value: "O(m·n)" });
  } else if (frame.kind === "lis") {
    rows.push({ label: "n", value: frame.arr.length });
    rows.push({ label: "i", value: frame.i });
    rows.push({ label: "x", value: frame.arr[frame.i] ?? "—" });
    rows.push({ label: "LIS so far", value: frame.tails.length });
    rows.push({ label: "tails", value: `[${frame.tails.join(", ")}]` });
    rows.push({ label: "Time", value: "O(n log n)" });
    rows.push({ label: "Space", value: "O(n)" });
  } else if (frame.kind === "edit") {
    rows.push({ label: "|s1|", value: frame.s1.length });
    rows.push({ label: "|s2|", value: frame.s2.length });
    rows.push({ label: "i", value: frame.i });
    rows.push({ label: "j", value: frame.j });
    rows.push({ label: `dp[${frame.i}][${frame.j}]`, value: frame.dp[frame.i]?.[frame.j] ?? 0 });
    if (frame.op) rows.push({ label: "Operation", value: frame.op });
    rows.push({ label: "Time", value: "O(m·n)" });
    rows.push({ label: "Space", value: "O(m·n)" });
  } else {
    const n = frame.dims.length - 1;
    rows.push({ label: "Matrices", value: n });
    if (frame.L !== undefined) rows.push({ label: "Chain length L", value: frame.L });
    rows.push({ label: "i", value: frame.i });
    rows.push({ label: "j", value: frame.j });
    if (frame.k !== undefined) rows.push({ label: "split k", value: frame.k });
    const v = frame.dp[frame.i]?.[frame.j];
    rows.push({
      label: `dp[${frame.i}][${frame.j}]`,
      value: v === undefined || !Number.isFinite(v) ? "∞" : v,
    });
    if (frame.paren) rows.push({ label: "Parens", value: frame.paren });
    rows.push({ label: "Time", value: "O(n³)" });
    rows.push({ label: "Space", value: "O(n²)" });
  }
  return (
    <dl className="grid grid-cols-2 gap-y-2 text-xs">
      {rows.map((r) => (
        <div key={r.label} className="contents">
          <dt className="text-muted-foreground">{r.label}</dt>
          <dd className="text-right font-mono text-foreground break-all">{r.value}</dd>
        </div>
      ))}
    </dl>
  );
}
