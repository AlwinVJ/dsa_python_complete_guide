import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageShell, PageHeader, Callout } from "@/components/Callout";
import { CodeViewer } from "@/components/CodeViewer";
import {
  PlaygroundFooterNav,
} from "@/components/PlaygroundNav";
import { Play, Pause, RotateCcw, StepForward, StepBack } from "lucide-react";

export const Route = createFileRoute("/playgrounds/backtracking")({
  head: () => ({
    meta: [
      { title: "Backtracking Playground — DSA with Python" },
      {
        name: "description",
        content:
          "Step through N-Queens, Rat in a Maze, Permutations, Sudoku, Combination Sum, and Word Search — watch choose, explore, and undo come alive.",
      },
      { property: "og:title", content: "Backtracking Playground — DSA with Python" },
      {
        property: "og:description",
        content:
          "Interactive backtracking visualizer — six classic problems, step by step.",
      },
    ],
  }),
  component: Page,
});

/* ---------- Shared frame model ---------- */
type Frame = {
  line: number;
  note: string;
  solution?: boolean;
  backtrack?: boolean;
  depth: number;
};

type NQueensFrame = Frame & {
  kind: "nqueens";
  board: number[];
  row: number;
  trying?: { row: number; col: number };
  n: number;
  solutions: number;
  calls: number;
};

type MazeFrame = Frame & {
  kind: "maze";
  grid: number[][];
  cur: [number, number];
  path: [number, number][];
  found: boolean;
  calls: number;
};

type PermFrame = Frame & {
  kind: "perm";
  nums: number[];
  used: boolean[];
  path: number[];
  results: number[][];
  calls: number;
};

type SudokuFrame = Frame & {
  kind: "sudoku";
  grid: number[][]; // 0 = empty
  fixed: boolean[][]; // pre-filled givens
  cur?: [number, number];
  tryingVal?: number;
  invalid?: boolean;
  solved: boolean;
  size: number; // 4 for 4x4, 9 for 9x9
  block: number; // sqrt(size)
  calls: number;
};

type CombSumFrame = Frame & {
  kind: "combsum";
  candidates: number[];
  target: number;
  index: number;
  path: number[];
  sum: number;
  results: number[][];
  calls: number;
};

type WordSearchFrame = Frame & {
  kind: "wordsearch";
  grid: string[][];
  word: string;
  cur?: [number, number];
  path: [number, number][];
  matchedIndex: number;
  visited: boolean[][];
  found: boolean;
  calls: number;
};

type AnyFrame =
  | NQueensFrame
  | MazeFrame
  | PermFrame
  | SudokuFrame
  | CombSumFrame
  | WordSearchFrame;

/* ---------- N-Queens tracer ---------- */
const NQUEENS_CODE = `def solve_n_queens(n):
    result, board = [], [-1] * n
    cols, d1, d2 = set(), set(), set()

    def backtrack(row):
        if row == n:
            result.append(board[:])
            return
        for col in range(n):
            if col in cols or (row - col) in d1 or (row + col) in d2:
                continue
            board[row] = col
            cols.add(col); d1.add(row - col); d2.add(row + col)
            backtrack(row + 1)
            board[row] = -1
            cols.remove(col); d1.remove(row - col); d2.remove(row + col)

    backtrack(0)
    return result`;

function traceNQueens(n: number): NQueensFrame[] {
  const frames: NQueensFrame[] = [];
  const board = new Array(n).fill(-1);
  const cols = new Set<number>();
  const d1 = new Set<number>();
  const d2 = new Set<number>();
  let solutions = 0;
  let calls = 0;
  const snap = (
    line: number,
    note: string,
    row: number,
    depth: number,
    extras: Partial<NQueensFrame> = {},
  ) => {
    frames.push({
      kind: "nqueens",
      line,
      note,
      depth,
      board: [...board],
      row,
      n,
      solutions,
      calls,
      ...extras,
    });
  };
  function backtrack(row: number, depth: number) {
    calls++;
    snap(5, `backtrack(row=${row}) — entered`, row, depth);
    if (row === n) {
      solutions++;
      snap(7, `Row ${row} == n → solution #${solutions} recorded`, row, depth, {
        solution: true,
      });
      return;
    }
    for (let col = 0; col < n; col++) {
      snap(9, `Try (row=${row}, col=${col})`, row, depth, { trying: { row, col } });
      if (cols.has(col) || d1.has(row - col) || d2.has(row + col)) {
        snap(10, `col=${col} attacked — prune`, row, depth, { trying: { row, col } });
        continue;
      }
      board[row] = col;
      cols.add(col);
      d1.add(row - col);
      d2.add(row + col);
      snap(12, `Place queen at (${row}, ${col}) — choose`, row, depth, {
        trying: { row, col },
      });
      backtrack(row + 1, depth + 1);
      board[row] = -1;
      cols.delete(col);
      d1.delete(row - col);
      d2.delete(row + col);
      snap(15, `Undo queen at (${row}, ${col}) — backtrack`, row, depth, {
        backtrack: true,
        trying: { row, col },
      });
    }
    snap(18, `backtrack(row=${row}) — return`, row, depth);
  }
  backtrack(0, 0);
  return frames;
}

/* ---------- Rat in a Maze tracer ---------- */
const MAZE_CODE = `def rat_in_maze(grid):
    n, m = len(grid), len(grid[0])
    path = []

    def backtrack(r, c):
        if r < 0 or c < 0 or r >= n or c >= m: return False
        if grid[r][c] != 1: return False
        path.append((r, c))
        if (r, c) == (n - 1, m - 1): return True
        grid[r][c] = 2                          # mark visited
        for dr, dc in [(1, 0), (0, 1), (-1, 0), (0, -1)]:
            if backtrack(r + dr, c + dc): return True
        grid[r][c] = 1                          # undo
        path.pop()
        return False

    return path if backtrack(0, 0) else []`;

const DEFAULT_MAZE: number[][] = [
  [1, 0, 1, 1, 1],
  [1, 1, 1, 0, 1],
  [0, 1, 0, 1, 1],
  [1, 1, 1, 1, 0],
  [1, 0, 1, 1, 1],
];

function traceMaze(initial: number[][]): MazeFrame[] {
  const frames: MazeFrame[] = [];
  const grid = initial.map((r) => [...r]);
  const n = grid.length;
  const m = grid[0].length;
  const path: [number, number][] = [];
  let calls = 0;
  let found = false;
  const snap = (
    line: number,
    note: string,
    cur: [number, number],
    depth: number,
    extras: Partial<MazeFrame> = {},
  ) => {
    frames.push({
      kind: "maze",
      line,
      note,
      depth,
      grid: grid.map((r) => [...r]),
      cur,
      path: path.map((p) => [...p] as [number, number]),
      found,
      calls,
      ...extras,
    });
  };
  function bt(r: number, c: number, depth: number): boolean {
    calls++;
    snap(5, `backtrack(${r}, ${c}) — entered`, [r, c], depth);
    if (r < 0 || c < 0 || r >= n || c >= m) {
      snap(6, `Out of bounds — return False`, [r, c], depth);
      return false;
    }
    if (grid[r][c] !== 1) {
      snap(7, `Cell blocked / visited — return False`, [r, c], depth);
      return false;
    }
    path.push([r, c]);
    snap(8, `Push (${r}, ${c}) onto path`, [r, c], depth);
    if (r === n - 1 && c === m - 1) {
      found = true;
      snap(9, `Reached goal — return True`, [r, c], depth, { solution: true });
      return true;
    }
    grid[r][c] = 2;
    snap(10, `Mark (${r}, ${c}) visited`, [r, c], depth);
    const dirs: [number, number][] = [
      [1, 0],
      [0, 1],
      [-1, 0],
      [0, -1],
    ];
    for (const [dr, dc] of dirs) {
      snap(11, `Try direction (Δr=${dr}, Δc=${dc}) → (${r + dr}, ${c + dc})`, [r, c], depth);
      if (bt(r + dr, c + dc, depth + 1)) return true;
    }
    grid[r][c] = 3;
    snap(13, `Undo mark at (${r}, ${c}) — backtrack`, [r, c], depth, { backtrack: true });
    path.pop();
    snap(14, `Pop (${r}, ${c}) from path`, [r, c], depth, { backtrack: true });
    return false;
  }
  bt(0, 0, 0);
  return frames;
}

/* ---------- Permutations tracer ---------- */
const PERM_CODE = `def permute(nums):
    result, path = [], []
    used = [False] * len(nums)

    def backtrack():
        if len(path) == len(nums):
            result.append(path[:])
            return
        for i, n in enumerate(nums):
            if used[i]:
                continue
            used[i] = True
            path.append(n)
            backtrack()
            used[i] = False
            path.pop()

    backtrack()
    return result`;

function tracePerm(nums: number[]): PermFrame[] {
  const frames: PermFrame[] = [];
  const path: number[] = [];
  const used = new Array(nums.length).fill(false);
  const results: number[][] = [];
  let calls = 0;
  const snap = (
    line: number,
    note: string,
    depth: number,
    extras: Partial<PermFrame> = {},
  ) => {
    frames.push({
      kind: "perm",
      line,
      note,
      depth,
      nums: [...nums],
      used: [...used],
      path: [...path],
      results: results.map((r) => [...r]),
      calls,
      ...extras,
    });
  };
  function bt(depth: number) {
    calls++;
    snap(5, `backtrack() — entered, path=[${path.join(", ")}]`, depth);
    if (path.length === nums.length) {
      results.push([...path]);
      snap(7, `Complete permutation → record`, depth, { solution: true });
      return;
    }
    for (let i = 0; i < nums.length; i++) {
      snap(9, `Consider index ${i} (value ${nums[i]})`, depth);
      if (used[i]) {
        snap(10, `Skip: ${nums[i]} already used`, depth);
        continue;
      }
      used[i] = true;
      path.push(nums[i]);
      snap(12, `Choose ${nums[i]} — path=[${path.join(", ")}]`, depth);
      bt(depth + 1);
      used[i] = false;
      path.pop();
      snap(15, `Undo ${nums[i]} — backtrack`, depth, { backtrack: true });
    }
  }
  bt(0);
  return frames;
}

/* ---------- Sudoku tracer ---------- */
const SUDOKU_CODE = `def solve_sudoku(grid, n=4):
    block = int(n ** 0.5)

    def is_valid(r, c, v):
        for i in range(n):
            if grid[r][i] == v or grid[i][c] == v:
                return False
        br, bc = (r // block) * block, (c // block) * block
        for i in range(block):
            for j in range(block):
                if grid[br + i][bc + j] == v:
                    return False
        return True

    def backtrack():
        for r in range(n):
            for c in range(n):
                if grid[r][c] == 0:
                    for v in range(1, n + 1):
                        if is_valid(r, c, v):
                            grid[r][c] = v
                            if backtrack(): return True
                            grid[r][c] = 0
                    return False
        return True

    return backtrack()`;

// A 4x4 sudoku puzzle. 0 = empty. Solution is unique.
const DEFAULT_SUDOKU: number[][] = [
  [1, 0, 0, 4],
  [0, 0, 2, 0],
  [0, 3, 0, 0],
  [4, 0, 0, 2],
];

function traceSudoku(initial: number[][]): SudokuFrame[] {
  const frames: SudokuFrame[] = [];
  const n = initial.length;
  const block = Math.round(Math.sqrt(n));
  const grid = initial.map((r) => [...r]);
  const fixed = initial.map((r) => r.map((v) => v !== 0));
  let calls = 0;
  let solved = false;

  const snap = (
    line: number,
    note: string,
    depth: number,
    extras: Partial<SudokuFrame> = {},
  ) => {
    frames.push({
      kind: "sudoku",
      line,
      note,
      depth,
      grid: grid.map((r) => [...r]),
      fixed,
      size: n,
      block,
      solved,
      calls,
      ...extras,
    });
  };

  function isValid(r: number, c: number, v: number): boolean {
    for (let i = 0; i < n; i++) {
      if (grid[r][i] === v || grid[i][c] === v) return false;
    }
    const br = Math.floor(r / block) * block;
    const bc = Math.floor(c / block) * block;
    for (let i = 0; i < block; i++)
      for (let j = 0; j < block; j++)
        if (grid[br + i][bc + j] === v) return false;
    return true;
  }

  function bt(depth: number): boolean {
    calls++;
    snap(15, `backtrack() — scanning for empty cell`, depth);
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        if (grid[r][c] === 0) {
          for (let v = 1; v <= n; v++) {
            snap(19, `Try value ${v} at (${r}, ${c})`, depth, {
              cur: [r, c],
              tryingVal: v,
            });
            if (isValid(r, c, v)) {
              grid[r][c] = v;
              snap(21, `Place ${v} at (${r}, ${c})`, depth, {
                cur: [r, c],
                tryingVal: v,
              });
              if (bt(depth + 1)) return true;
              grid[r][c] = 0;
              snap(23, `Undo ${v} at (${r}, ${c}) — backtrack`, depth, {
                cur: [r, c],
                tryingVal: v,
                backtrack: true,
              });
            } else {
              snap(20, `Value ${v} invalid at (${r}, ${c}) — prune`, depth, {
                cur: [r, c],
                tryingVal: v,
                invalid: true,
              });
            }
          }
          snap(24, `No value fits at (${r}, ${c}) — return False`, depth, {
            cur: [r, c],
            backtrack: true,
          });
          return false;
        }
      }
    }
    solved = true;
    snap(25, `Grid complete — puzzle solved`, depth, { solution: true });
    return true;
  }

  bt(0);
  return frames;
}

/* ---------- Combination Sum tracer ---------- */
const COMBSUM_CODE = `def combination_sum(candidates, target):
    candidates.sort()
    result, path = [], []

    def backtrack(start, remaining):
        if remaining == 0:
            result.append(path[:])
            return
        for i in range(start, len(candidates)):
            c = candidates[i]
            if c > remaining:          # sorted → prune
                break
            path.append(c)
            backtrack(i, remaining - c)  # reuse allowed → i, not i+1
            path.pop()

    backtrack(0, target)
    return result`;

function traceCombSum(candidatesIn: number[], target: number): CombSumFrame[] {
  const frames: CombSumFrame[] = [];
  const candidates = [...candidatesIn].sort((a, b) => a - b);
  const path: number[] = [];
  const results: number[][] = [];
  let calls = 0;

  const snap = (
    line: number,
    note: string,
    depth: number,
    index: number,
    sum: number,
    extras: Partial<CombSumFrame> = {},
  ) => {
    frames.push({
      kind: "combsum",
      line,
      note,
      depth,
      candidates: [...candidates],
      target,
      index,
      sum,
      path: [...path],
      results: results.map((r) => [...r]),
      calls,
      ...extras,
    });
  };

  function bt(start: number, remaining: number, depth: number) {
    calls++;
    const sum = target - remaining;
    snap(5, `backtrack(start=${start}, remaining=${remaining})`, depth, start, sum);
    if (remaining === 0) {
      results.push([...path]);
      snap(7, `remaining == 0 → record [${path.join(", ")}]`, depth, start, sum, {
        solution: true,
      });
      return;
    }
    for (let i = start; i < candidates.length; i++) {
      const c = candidates[i];
      snap(10, `Consider index ${i} (candidate ${c})`, depth, i, sum);
      if (c > remaining) {
        snap(12, `${c} > ${remaining} — prune remaining candidates`, depth, i, sum, {
          backtrack: true,
        });
        break;
      }
      path.push(c);
      snap(13, `Push ${c} — path=[${path.join(", ")}], sum=${sum + c}`, depth, i, sum + c);
      bt(i, remaining - c, depth + 1);
      path.pop();
      snap(15, `Pop ${c} — backtrack`, depth, i, sum, { backtrack: true });
    }
  }

  bt(0, target, 0);
  return frames;
}

/* ---------- Word Search tracer ---------- */
const WORDSEARCH_CODE = `def exist(board, word):
    n, m = len(board), len(board[0])
    visited = [[False] * m for _ in range(n)]

    def dfs(r, c, i):
        if i == len(word):
            return True
        if r < 0 or c < 0 or r >= n or c >= m:
            return False
        if visited[r][c] or board[r][c] != word[i]:
            return False
        visited[r][c] = True
        for dr, dc in [(1, 0), (-1, 0), (0, 1), (0, -1)]:
            if dfs(r + dr, c + dc, i + 1): return True
        visited[r][c] = False   # backtrack
        return False

    for r in range(n):
        for c in range(m):
            if dfs(r, c, 0): return True
    return False`;

const DEFAULT_WORDGRID: string[][] = [
  ["A", "B", "C", "E"],
  ["S", "F", "C", "S"],
  ["A", "D", "E", "E"],
];

function traceWordSearch(board: string[][], word: string): WordSearchFrame[] {
  const frames: WordSearchFrame[] = [];
  const n = board.length;
  const m = board[0].length;
  const visited = Array.from({ length: n }, () => new Array(m).fill(false)) as boolean[][];
  const path: [number, number][] = [];
  let calls = 0;
  let found = false;

  const snap = (
    line: number,
    note: string,
    depth: number,
    matchedIndex: number,
    extras: Partial<WordSearchFrame> = {},
  ) => {
    frames.push({
      kind: "wordsearch",
      line,
      note,
      depth,
      grid: board.map((r) => [...r]),
      word,
      matchedIndex,
      visited: visited.map((r) => [...r]),
      path: path.map((p) => [...p] as [number, number]),
      found,
      calls,
      ...extras,
    });
  };

  function dfs(r: number, c: number, i: number, depth: number): boolean {
    calls++;
    snap(5, `dfs(${r}, ${c}, i=${i}) — target '${word[i] ?? "$"}'`, depth, i, {
      cur: [r, c],
    });
    if (i === word.length) {
      found = true;
      snap(6, `Matched entire word — return True`, depth, i, {
        cur: [r, c],
        solution: true,
      });
      return true;
    }
    if (r < 0 || c < 0 || r >= n || c >= m) {
      snap(8, `Out of bounds — return False`, depth, i, { cur: [r, c] });
      return false;
    }
    if (visited[r][c] || board[r][c] !== word[i]) {
      snap(10, `Visited or mismatch (${board[r][c]} vs ${word[i]}) — prune`, depth, i, {
        cur: [r, c],
      });
      return false;
    }
    visited[r][c] = true;
    path.push([r, c]);
    snap(11, `Mark (${r}, ${c}) visited — matched ${word.slice(0, i + 1)}`, depth, i + 1, {
      cur: [r, c],
    });
    const dirs: [number, number][] = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ];
    for (const [dr, dc] of dirs) {
      if (dfs(r + dr, c + dc, i + 1, depth + 1)) return true;
    }
    visited[r][c] = false;
    path.pop();
    snap(15, `Unmark (${r}, ${c}) — backtrack`, depth, i, {
      cur: [r, c],
      backtrack: true,
    });
    return false;
  }

  outer: for (let r = 0; r < n; r++) {
    for (let c = 0; c < m; c++) {
      if (dfs(r, c, 0, 0)) break outer;
    }
  }
  if (!frames.length) snap(0, "No starting cell found", 0, 0);
  return frames;
}

/* ---------- Problem registry ---------- */
type ProblemKey =
  | "nqueens"
  | "maze"
  | "perm"
  | "sudoku"
  | "combsum"
  | "wordsearch";

type ProblemDef = {
  id: ProblemKey;
  name: string;
  description: string;
  code: string;
  fileName: string;
};

const PROBLEMS: ProblemDef[] = [
  {
    id: "nqueens",
    name: "N-Queens",
    description:
      "Place N queens on an N × N board so that no two attack each other. Watch the row-by-row placement, pruning by column and diagonal, and the undo that lets sibling branches try clean.",
    code: NQUEENS_CODE,
    fileName: "n_queens.py",
  },
  {
    id: "maze",
    name: "Rat in a Maze",
    description:
      "Find a path from the top-left to the bottom-right of a grid of open (1) and blocked (0) cells. The rat marks each cell it visits, tries four directions in order, and unmarks on the way out.",
    code: MAZE_CODE,
    fileName: "rat_in_maze.py",
  },
  {
    id: "perm",
    name: "Generate Permutations",
    description:
      "Build every arrangement of the input list by choosing an unused element at each step and undoing the choice before trying the next.",
    code: PERM_CODE,
    fileName: "permutations.py",
  },
  {
    id: "sudoku",
    name: "Sudoku Solver",
    description:
      "Cell-by-cell backtracking on a 4 × 4 Sudoku grid. For each empty cell, every value 1–4 is tried, validated against row/column/block constraints, and undone if the recursive call cannot complete the board.",
    code: SUDOKU_CODE,
    fileName: "sudoku.py",
  },
  {
    id: "combsum",
    name: "Combination Sum",
    description:
      "Given sorted candidates and a target, build every multiset summing to the target. Each recursive call carries a running sum; the sorted order lets us prune the entire tail as soon as a candidate exceeds the remaining target.",
    code: COMBSUM_CODE,
    fileName: "combination_sum.py",
  },
  {
    id: "wordsearch",
    name: "Word Search",
    description:
      "DFS on a grid with a visited set. Start from every cell, walk the four neighbours if the next letter matches, and unmark the cell before returning so parallel branches can reuse it.",
    code: WORDSEARCH_CODE,
    fileName: "word_search.py",
  },
];

/* ---------- Page ---------- */
function Page() {
  const [problemId, setProblemId] = useState<ProblemKey>("nqueens");
  const problem = PROBLEMS.find((p) => p.id === problemId)!;

  const [nQueensN, setNQueensN] = useState(4);
  const [permInput, setPermInput] = useState("1,2,3");
  const [combInput, setCombInput] = useState("2,3,6,7");
  const [combTarget, setCombTarget] = useState(7);
  const [wordInput, setWordInput] = useState("ABCCED");

  const frames: AnyFrame[] = useMemo(() => {
    if (problem.id === "nqueens") return traceNQueens(nQueensN);
    if (problem.id === "maze") return traceMaze(DEFAULT_MAZE);
    if (problem.id === "sudoku") return traceSudoku(DEFAULT_SUDOKU);
    if (problem.id === "combsum") {
      const cands = combInput
        .split(/[,\s]+/)
        .map((s) => Number(s.trim()))
        .filter((n) => Number.isFinite(n) && n > 0)
        .slice(0, 6);
      const t = Math.max(1, Math.min(15, combTarget || 7));
      return traceCombSum(cands.length ? cands : [2, 3, 6, 7], t);
    }
    if (problem.id === "wordsearch") {
      const w = (wordInput || "ABCCED").toUpperCase().slice(0, 8);
      return traceWordSearch(DEFAULT_WORDGRID, w);
    }
    const parsed = permInput
      .split(/[,\s]+/)
      .map((s) => Number(s.trim()))
      .filter((n) => Number.isFinite(n))
      .slice(0, 4);
    return tracePerm(parsed.length ? parsed : [1, 2, 3]);
  }, [problem.id, nQueensN, permInput, combInput, combTarget, wordInput]);

  const [step, setStep] = useState(0);
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(500);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setStep(0);
    setRunning(false);
  }, [problem.id, nQueensN, permInput, combInput, combTarget, wordInput]);

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

  return (
    <PageShell>
      <PageHeader
        eyebrow="Backtracking Playground"
        title="Choose, explore, undo — live"
        description="Pick a classic backtracking problem, step through every decision, and watch the algorithm prune branches and back out of dead ends in real time."
      />

      <Callout kind="tip" title="Reading the visualization">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            The <span className="font-semibold text-foreground">code panel</span> highlights
            the line the algorithm is currently executing.
          </li>
          <li>
            The <span className="font-semibold text-foreground">state panel</span> shows the
            board / grid / path being built.
          </li>
          <li>
            Amber steps mean an <span className="font-semibold">undo / backtrack</span>;
            green steps are a <span className="font-semibold">solution recorded</span>.
          </li>
        </ul>
      </Callout>

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

          {problem.id === "nqueens" && (
            <div>
              <div className="mb-1 text-xs text-muted-foreground">
                Board size N = {nQueensN}
              </div>
              <input
                type="range"
                min={4}
                max={6}
                value={nQueensN}
                onChange={(e) => setNQueensN(parseInt(e.target.value, 10))}
                className="w-40 accent-[color:var(--brand)]"
              />
            </div>
          )}

          {problem.id === "perm" && (
            <div>
              <div className="mb-1 text-xs text-muted-foreground">Input (≤ 4 numbers)</div>
              <input
                type="text"
                value={permInput}
                onChange={(e) => setPermInput(e.target.value)}
                className="w-40 rounded-md border border-input bg-background px-2 py-1 font-mono text-xs"
              />
            </div>
          )}

          {problem.id === "combsum" && (
            <>
              <div>
                <div className="mb-1 text-xs text-muted-foreground">Candidates (≤ 6)</div>
                <input
                  type="text"
                  value={combInput}
                  onChange={(e) => setCombInput(e.target.value)}
                  className="w-40 rounded-md border border-input bg-background px-2 py-1 font-mono text-xs"
                />
              </div>
              <div>
                <div className="mb-1 text-xs text-muted-foreground">Target</div>
                <input
                  type="number"
                  value={combTarget}
                  min={1}
                  max={15}
                  onChange={(e) => setCombTarget(parseInt(e.target.value || "0", 10))}
                  className="w-20 rounded-md border border-input bg-background px-2 py-1 font-mono text-xs"
                />
              </div>
            </>
          )}

          {problem.id === "wordsearch" && (
            <div>
              <div className="mb-1 text-xs text-muted-foreground">Word</div>
              <input
                type="text"
                value={wordInput}
                onChange={(e) => setWordInput(e.target.value.toUpperCase())}
                className="w-40 rounded-md border border-input bg-background px-2 py-1 font-mono text-xs uppercase"
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
          <div className="ml-auto text-xs text-muted-foreground">
            Step {Math.min(step + 1, frames.length)} / {frames.length}
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,320px)]">
        <div className="card-surface p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-sm font-semibold">Visualization</div>
            <div className="text-xs text-muted-foreground">
              depth {frame?.depth ?? 0} · calls{" "}
              {"calls" in (frame ?? {}) ? (frame as { calls: number }).calls : 0}
            </div>
          </div>
          <FrameVisualizer frame={frame} />
          <div
            className={`mt-3 rounded-md border px-3 py-2 text-sm ${
              frame?.solution
                ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-600"
                : frame?.backtrack
                  ? "border-amber-500/50 bg-amber-500/10 text-amber-600"
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

      <div className="mt-6">
        <CodeViewer
          code={problem.code}
          title={problem.fileName}
          activeLine={frame?.line}
          defaultExpanded
        />
      </div>

      <div className="mt-6 card-surface p-4">
        <div className="mb-2 text-sm font-semibold">About this problem</div>
        <p className="text-sm text-muted-foreground">{problem.description}</p>
      </div>

      <PlaygroundFooterNav playground="backtracking" />
    </PageShell>
  );
}

/* ---------- Sub-renderers ---------- */

function FrameVisualizer({ frame }: { frame: AnyFrame | undefined }) {
  if (!frame) return <div className="h-40" />;
  if (frame.kind === "nqueens") return <NQueensViz f={frame} />;
  if (frame.kind === "maze") return <MazeViz f={frame} />;
  if (frame.kind === "perm") return <PermViz f={frame} />;
  if (frame.kind === "sudoku") return <SudokuViz f={frame} />;
  if (frame.kind === "combsum") return <CombSumViz f={frame} />;
  return <WordSearchViz f={frame} />;
}

function NQueensViz({ f }: { f: NQueensFrame }) {
  const size = f.n;
  const cellPx = 42;
  return (
    <div className="flex justify-center overflow-auto">
      <div
        className="grid rounded-md border border-border"
        style={{
          gridTemplateColumns: `repeat(${size}, ${cellPx}px)`,
          gridTemplateRows: `repeat(${size}, ${cellPx}px)`,
        }}
      >
        {Array.from({ length: size * size }).map((_, i) => {
          const r = Math.floor(i / size);
          const c = i % size;
          const hasQueen = f.board[r] === c;
          const trying = f.trying && f.trying.row === r && f.trying.col === c;
          const isDark = (r + c) % 2 === 1;
          return (
            <div
              key={i}
              className={`flex items-center justify-center text-lg transition ${
                isDark ? "bg-muted/60" : "bg-background"
              } ${trying ? "ring-2 ring-amber-400 ring-inset" : ""}`}
              style={{ width: cellPx, height: cellPx }}
            >
              {hasQueen ? (
                <span
                  className={`font-bold ${
                    f.solution ? "text-emerald-500" : "text-[color:var(--brand)]"
                  }`}
                >
                  ♛
                </span>
              ) : trying ? (
                <span className="text-xs text-amber-500">?</span>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MazeViz({ f }: { f: MazeFrame }) {
  const rows = f.grid.length;
  const cols = f.grid[0].length;
  const cellPx = 42;
  return (
    <div className="flex justify-center overflow-auto">
      <div
        className="grid rounded-md border border-border"
        style={{
          gridTemplateColumns: `repeat(${cols}, ${cellPx}px)`,
          gridTemplateRows: `repeat(${rows}, ${cellPx}px)`,
        }}
      >
        {f.grid.flatMap((row, r) =>
          row.map((v, c) => {
            const isCur = f.cur[0] === r && f.cur[1] === c;
            const isGoal = r === rows - 1 && c === cols - 1;
            const isStart = r === 0 && c === 0;
            const bg =
              v === 0
                ? "bg-neutral-800"
                : v === 2
                  ? "bg-[color:var(--brand)]/25"
                  : v === 3
                    ? "bg-rose-500/15"
                    : "bg-background";
            return (
              <div
                key={`${r}-${c}`}
                className={`flex items-center justify-center border border-border/40 text-[10px] ${bg} ${
                  isCur ? "ring-2 ring-amber-400 ring-inset" : ""
                }`}
                style={{ width: cellPx, height: cellPx }}
              >
                {isStart ? "S" : isGoal ? "G" : v === 2 ? "•" : ""}
              </div>
            );
          }),
        )}
      </div>
    </div>
  );
}

function PermViz({ f }: { f: PermFrame }) {
  return (
    <div className="space-y-4">
      <div>
        <div className="mb-1 text-xs text-muted-foreground">Input pool ({f.nums.length})</div>
        <div className="flex flex-wrap gap-2">
          {f.nums.map((n, i) => (
            <span
              key={i}
              className={`rounded-md border px-3 py-1.5 font-mono text-sm transition ${
                f.used[i]
                  ? "border-[color:var(--brand)] bg-[color:var(--brand)]/10 text-[color:var(--brand)]"
                  : "border-border bg-background text-muted-foreground"
              }`}
            >
              {n}
            </span>
          ))}
        </div>
      </div>
      <div>
        <div className="mb-1 text-xs text-muted-foreground">
          Current path ({f.path.length}/{f.nums.length})
        </div>
        <div className="flex min-h-[38px] flex-wrap items-center gap-2 rounded-md border border-border bg-background p-2">
          <AnimatePresence initial={false}>
            {f.path.map((v, i) => (
              <motion.span
                key={`${i}-${v}`}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                className="rounded-md bg-[color:var(--brand)]/15 px-2.5 py-1 font-mono text-sm text-[color:var(--brand)]"
              >
                {v}
              </motion.span>
            ))}
          </AnimatePresence>
          {f.path.length === 0 && <span className="text-xs text-muted-foreground">empty</span>}
        </div>
      </div>
      <div>
        <div className="mb-1 text-xs text-muted-foreground">
          Solutions collected ({f.results.length})
        </div>
        <div className="max-h-32 space-y-1 overflow-y-auto rounded-md border border-border bg-background p-2 font-mono text-xs">
          {f.results.length === 0 && <div className="text-muted-foreground">none yet</div>}
          {f.results.map((r, i) => (
            <div key={i} className="text-[color:var(--brand)]">
              [{r.join(", ")}]
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SudokuViz({ f }: { f: SudokuFrame }) {
  const cellPx = 44;
  return (
    <div className="flex justify-center overflow-auto">
      <div
        className="grid rounded-md border-2 border-border"
        style={{
          gridTemplateColumns: `repeat(${f.size}, ${cellPx}px)`,
          gridTemplateRows: `repeat(${f.size}, ${cellPx}px)`,
        }}
      >
        {f.grid.flatMap((row, r) =>
          row.map((v, c) => {
            const isCur = f.cur && f.cur[0] === r && f.cur[1] === c;
            const givenCell = f.fixed[r][c];
            const rightBorder = (c + 1) % f.block === 0 && c !== f.size - 1;
            const bottomBorder = (r + 1) % f.block === 0 && r !== f.size - 1;
            const bg = givenCell
              ? "bg-muted/50"
              : v !== 0
                ? "bg-[color:var(--brand)]/10"
                : "bg-background";
            return (
              <div
                key={`${r}-${c}`}
                className={`flex items-center justify-center border border-border/40 font-mono text-lg font-semibold ${bg} ${
                  isCur
                    ? f.invalid
                      ? "ring-2 ring-rose-500 ring-inset"
                      : "ring-2 ring-amber-400 ring-inset"
                    : ""
                } ${rightBorder ? "border-r-2 border-r-foreground/50" : ""} ${
                  bottomBorder ? "border-b-2 border-b-foreground/50" : ""
                }`}
                style={{ width: cellPx, height: cellPx }}
              >
                {v !== 0 ? (
                  <span
                    className={
                      givenCell
                        ? "text-foreground"
                        : f.solved
                          ? "text-emerald-500"
                          : "text-[color:var(--brand)]"
                    }
                  >
                    {v}
                  </span>
                ) : isCur && f.tryingVal ? (
                  <span className="text-xs text-amber-500">?{f.tryingVal}</span>
                ) : (
                  <span className="text-muted-foreground/30">·</span>
                )}
              </div>
            );
          }),
        )}
      </div>
    </div>
  );
}

function CombSumViz({ f }: { f: CombSumFrame }) {
  return (
    <div className="space-y-4">
      <div>
        <div className="mb-1 text-xs text-muted-foreground">
          Candidates (sorted) — target {f.target}, current sum {f.sum}
        </div>
        <div className="flex flex-wrap gap-2">
          {f.candidates.map((c, i) => (
            <span
              key={i}
              className={`rounded-md border px-3 py-1.5 font-mono text-sm transition ${
                i === f.index
                  ? "border-amber-400 bg-amber-400/10 text-amber-600"
                  : i < f.index
                    ? "border-border bg-muted/30 text-muted-foreground"
                    : "border-border bg-background text-foreground"
              }`}
            >
              {c}
            </span>
          ))}
        </div>
      </div>
      <div>
        <div className="mb-1 text-xs text-muted-foreground">
          Current path ({f.path.length}) — sum {f.sum} / {f.target}
        </div>
        <div className="flex min-h-[38px] flex-wrap items-center gap-2 rounded-md border border-border bg-background p-2">
          <AnimatePresence initial={false}>
            {f.path.map((v, i) => (
              <motion.span
                key={`${i}-${v}`}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                className="rounded-md bg-[color:var(--brand)]/15 px-2.5 py-1 font-mono text-sm text-[color:var(--brand)]"
              >
                {v}
              </motion.span>
            ))}
          </AnimatePresence>
          {f.path.length === 0 && <span className="text-xs text-muted-foreground">empty</span>}
        </div>
      </div>
      <div>
        <div className="mb-1 text-xs text-muted-foreground">
          Solutions collected ({f.results.length})
        </div>
        <div className="max-h-32 space-y-1 overflow-y-auto rounded-md border border-border bg-background p-2 font-mono text-xs">
          {f.results.length === 0 && <div className="text-muted-foreground">none yet</div>}
          {f.results.map((r, i) => (
            <div key={i} className="text-[color:var(--brand)]">
              [{r.join(", ")}]
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function WordSearchViz({ f }: { f: WordSearchFrame }) {
  const rows = f.grid.length;
  const cols = f.grid[0].length;
  const cellPx = 44;
  return (
    <div className="space-y-3">
      <div>
        <div className="mb-1 text-xs text-muted-foreground">
          Word: <span className="font-mono">{f.word}</span> — matched{" "}
          <span className="font-mono text-[color:var(--brand)]">
            {f.word.slice(0, f.matchedIndex)}
          </span>
          <span className="font-mono text-muted-foreground">
            {f.word.slice(f.matchedIndex)}
          </span>
        </div>
      </div>
      <div className="flex justify-center overflow-auto">
        <div
          className="grid rounded-md border border-border"
          style={{
            gridTemplateColumns: `repeat(${cols}, ${cellPx}px)`,
            gridTemplateRows: `repeat(${rows}, ${cellPx}px)`,
          }}
        >
          {f.grid.flatMap((row, r) =>
            row.map((ch, c) => {
              const isCur = f.cur && f.cur[0] === r && f.cur[1] === c;
              const isVisited = f.visited[r][c];
              const bg = isVisited
                ? f.found
                  ? "bg-emerald-500/20"
                  : "bg-[color:var(--brand)]/20"
                : "bg-background";
              return (
                <div
                  key={`${r}-${c}`}
                  className={`flex items-center justify-center border border-border/40 font-mono text-sm font-semibold ${bg} ${
                    isCur ? "ring-2 ring-amber-400 ring-inset" : ""
                  }`}
                  style={{ width: cellPx, height: cellPx }}
                >
                  {ch}
                </div>
              );
            }),
          )}
        </div>
      </div>
    </div>
  );
}

function FrameStats({ frame }: { frame: AnyFrame | undefined }) {
  if (!frame) {
    return <div className="text-xs text-muted-foreground">Press Play to begin.</div>;
  }
  const rows: { label: string; value: string | number }[] = [
    { label: "Depth", value: frame.depth },
    { label: "Calls", value: frame.calls },
  ];
  if (frame.kind === "nqueens") {
    rows.push({ label: "N", value: frame.n });
    rows.push({ label: "Row", value: frame.row });
    rows.push({ label: "Solutions", value: frame.solutions });
  } else if (frame.kind === "maze") {
    rows.push({ label: "Cursor", value: `(${frame.cur[0]}, ${frame.cur[1]})` });
    rows.push({ label: "Path length", value: frame.path.length });
    rows.push({ label: "Found", value: frame.found ? "yes" : "no" });
  } else if (frame.kind === "perm") {
    rows.push({ label: "Path length", value: frame.path.length });
    rows.push({ label: "Results", value: frame.results.length });
  } else if (frame.kind === "sudoku") {
    if (frame.cur) rows.push({ label: "Cursor", value: `(${frame.cur[0]}, ${frame.cur[1]})` });
    if (frame.tryingVal !== undefined) rows.push({ label: "Trying", value: frame.tryingVal });
    rows.push({ label: "Solved", value: frame.solved ? "yes" : "no" });
  } else if (frame.kind === "combsum") {
    rows.push({ label: "Target", value: frame.target });
    rows.push({ label: "Current sum", value: frame.sum });
    rows.push({ label: "Path length", value: frame.path.length });
    rows.push({ label: "Results", value: frame.results.length });
  } else {
    rows.push({ label: "Word", value: frame.word });
    rows.push({ label: "Matched", value: `${frame.matchedIndex}/${frame.word.length}` });
    rows.push({ label: "Found", value: frame.found ? "yes" : "no" });
  }
  return (
    <dl className="grid grid-cols-2 gap-y-2 text-xs">
      {rows.map((r) => (
        <div key={r.label} className="contents">
          <dt className="text-muted-foreground">{r.label}</dt>
          <dd className="text-right font-mono text-foreground">{r.value}</dd>
        </div>
      ))}
    </dl>
  );
}
