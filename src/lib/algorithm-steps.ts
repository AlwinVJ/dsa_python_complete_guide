// Step generators for the interactive algorithm playgrounds.
// Each generator returns an ordered list of frames that the playground
// renders with the ListVisualizer / BarVisualizer + a description panel.

export type Frame = {
  array: number[];
  highlight?: number[]; // brand highlight
  compare?: number[]; // warn highlight
  sorted?: number[]; // success highlight (locked / done)
  note: string;
  vars?: Record<string, string | number>;
};

export type Generator = (input: number[], param?: number) => Frame[];

const cloneArr = (a: number[]) => a.slice();

// ---------------- Linear traversal ----------------
export const linearTraversal: Generator = (input) => {
  const frames: Frame[] = [];
  let s = 0;
  frames.push({ array: cloneArr(input), note: "Start scan. running sum = 0", vars: { sum: 0 } });
  for (let i = 0; i < input.length; i++) {
    s += input[i];
    frames.push({
      array: cloneArr(input),
      highlight: [i],
      sorted: Array.from({ length: i }, (_, k) => k),
      note: `Visit index ${i} — add ${input[i]} to sum`,
      vars: { i, current: input[i], sum: s },
    });
  }
  frames.push({
    array: cloneArr(input),
    sorted: input.map((_, k) => k),
    note: `Done. Total = ${s}`,
    vars: { sum: s },
  });
  return frames;
};

// ---------------- Two pointers (opposite ends, two sum sorted) ----------------
export const twoPointers: Generator = (input, target = 0) => {
  const nums = cloneArr(input).sort((a, b) => a - b);
  const frames: Frame[] = [];
  let l = 0,
    r = nums.length - 1;
  frames.push({ array: nums, note: `Sorted input. Target = ${target}`, vars: { target } });
  while (l < r) {
    const s = nums[l] + nums[r];
    frames.push({
      array: nums,
      highlight: [l, r],
      note: `sum = nums[${l}] + nums[${r}] = ${nums[l]} + ${nums[r]} = ${s}`,
      vars: { l, r, sum: s, target },
    });
    if (s === target) {
      frames.push({
        array: nums,
        sorted: [l, r],
        note: `Found pair at indices [${l}, ${r}]`,
        vars: { l, r, sum: s },
      });
      return frames;
    }
    if (s < target) {
      frames.push({
        array: nums,
        highlight: [l],
        compare: [r],
        note: `sum < target → move l → ${l + 1}`,
        vars: { l, r },
      });
      l++;
    } else {
      frames.push({
        array: nums,
        highlight: [r],
        compare: [l],
        note: `sum > target → move r → ${r - 1}`,
        vars: { l, r },
      });
      r--;
    }
  }
  frames.push({ array: nums, note: "No pair found", vars: { l, r } });
  return frames;
};

// ---------------- Sliding window (max sum of size k) ----------------
export const slidingWindow: Generator = (input, k = 3) => {
  const kk = Math.max(1, Math.min(k, input.length));
  const frames: Frame[] = [];
  let window = 0;
  for (let i = 0; i < kk; i++) window += input[i];
  let best = window,
    bestL = 0;
  frames.push({
    array: cloneArr(input),
    highlight: Array.from({ length: kk }, (_, i) => i),
    note: `Initial window [0..${kk - 1}] sum = ${window}`,
    vars: { k: kk, window, best },
  });
  for (let i = kk; i < input.length; i++) {
    window += input[i] - input[i - kk];
    if (window > best) {
      best = window;
      bestL = i - kk + 1;
    }
    frames.push({
      array: cloneArr(input),
      highlight: Array.from({ length: kk }, (_, j) => i - kk + 1 + j),
      note: `Slide → window [${i - kk + 1}..${i}] sum = ${window}${window === best ? "  (new best)" : ""}`,
      vars: { window, best, bestStart: bestL },
    });
  }
  frames.push({
    array: cloneArr(input),
    sorted: Array.from({ length: kk }, (_, j) => bestL + j),
    note: `Best window starts at index ${bestL} with sum ${best}`,
    vars: { best, bestStart: bestL },
  });
  return frames;
};

// ---------------- Prefix sum build ----------------
export const prefixSum: Generator = (input) => {
  const frames: Frame[] = [];
  const p: number[] = [0];
  frames.push({ array: [0], note: "prefix = [0] (sentinel)", vars: { i: -1 } });
  for (let i = 0; i < input.length; i++) {
    p.push(p[p.length - 1] + input[i]);
    frames.push({
      array: p.slice(),
      highlight: [p.length - 1],
      note: `prefix[${p.length - 1}] = prefix[${p.length - 2}] + nums[${i}] = ${p[p.length - 2]} + ${input[i]} = ${p[p.length - 1]}`,
      vars: { i, added: input[i], last: p[p.length - 1] },
    });
  }
  frames.push({
    array: p.slice(),
    sorted: p.map((_, k) => k),
    note: "Prefix array built — every range sum is now O(1)",
  });
  return frames;
};

// ---------------- Hash map (two sum) ----------------
export const hashMap: Generator = (input, target = 0) => {
  const frames: Frame[] = [];
  const seen = new Map<number, number>();
  frames.push({
    array: cloneArr(input),
    note: `Scan once, remembering values in a hash map. Target = ${target}`,
    vars: { target, mapSize: 0 },
  });
  for (let i = 0; i < input.length; i++) {
    const need = target - input[i];
    const mapStr =
      Array.from(seen.entries())
        .map(([k, v]) => `${k}→${v}`)
        .join(", ") || "∅";
    if (seen.has(need)) {
      const j = seen.get(need)!;
      frames.push({
        array: cloneArr(input),
        sorted: [j, i],
        note: `Found ${need} in map at index ${j}. Pair = [${j}, ${i}]`,
        vars: { i, current: input[i], need, map: mapStr },
      });
      return frames;
    }
    frames.push({
      array: cloneArr(input),
      highlight: [i],
      note: `Check for ${need} in map (contents: ${mapStr}) — not found → store ${input[i]}→${i}`,
      vars: { i, current: input[i], need, map: mapStr },
    });
    seen.set(input[i], i);
  }
  frames.push({ array: cloneArr(input), note: "No pair found", vars: { target } });
  return frames;
};

// ---------------- Binary search ----------------
export const binarySearch: Generator = (input, target = 0) => {
  const nums = cloneArr(input).sort((a, b) => a - b);
  const frames: Frame[] = [
    { array: nums, note: `Sorted input. Searching for ${target}`, vars: { target } },
  ];
  let lo = 0,
    hi = nums.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    const range: number[] = [];
    for (let i = lo; i <= hi; i++) range.push(i);
    frames.push({
      array: nums,
      compare: range,
      highlight: [mid],
      note: `lo=${lo}, hi=${hi}, mid=${mid} → nums[mid]=${nums[mid]}`,
      vars: { lo, hi, mid, midVal: nums[mid], target },
    });
    if (nums[mid] === target) {
      frames.push({
        array: nums,
        sorted: [mid],
        note: `Found at index ${mid}`,
        vars: { result: mid },
      });
      return frames;
    }
    if (nums[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  frames.push({ array: nums, note: `Target ${target} not found`, vars: { lo, hi } });
  return frames;
};

// ---------------- Kadane ----------------
export const kadane: Generator = (input) => {
  const frames: Frame[] = [];
  if (input.length === 0) return [{ array: [], note: "empty" }];
  let current = input[0],
    best = input[0];
  let s = 0,
    e = 0,
    ts = 0;
  frames.push({
    array: cloneArr(input),
    highlight: [0],
    note: `Start: current = best = ${input[0]}`,
    vars: { current, best },
  });
  for (let i = 1; i < input.length; i++) {
    if (input[i] > current + input[i]) {
      current = input[i];
      ts = i;
    } else current = current + input[i];
    let reset = false;
    if (current > best) {
      best = current;
      s = ts;
      e = i;
      reset = false;
    }
    frames.push({
      array: cloneArr(input),
      highlight: [i],
      sorted: Array.from({ length: e - s + 1 }, (_, k) => s + k),
      note: `i=${i}: current = max(${input[i]}, prev+${input[i]}) = ${current}, best = ${best}${reset ? "" : ""}`,
      vars: { i, current, best, bestRange: `[${s}..${e}]` },
    });
  }
  frames.push({
    array: cloneArr(input),
    sorted: Array.from({ length: e - s + 1 }, (_, k) => s + k),
    note: `Answer: best subarray sum = ${best}, indices [${s}..${e}]`,
    vars: { best, bestRange: `[${s}..${e}]` },
  });
  return frames;
};

// ---------------- Monotonic stack (next greater) ----------------
export const monotonicStack: Generator = (input) => {
  const frames: Frame[] = [];
  const stack: number[] = [];
  const res = new Array(input.length).fill(-1);
  frames.push({
    array: cloneArr(input),
    note: "Init decreasing stack. -1 means no greater element yet.",
    vars: { stack: "[]", result: res.join(",") },
  });
  for (let i = 0; i < input.length; i++) {
    while (stack.length && input[stack[stack.length - 1]] < input[i]) {
      const top = stack.pop()!;
      res[top] = input[i];
      frames.push({
        array: cloneArr(input),
        highlight: [i],
        sorted: [top],
        note: `nums[${i}]=${input[i]} > nums[${top}]=${input[top]} → set result[${top}] = ${input[i]}, pop`,
        vars: { i, stack: `[${stack.join(",")}]`, result: res.join(",") },
      });
    }
    stack.push(i);
    frames.push({
      array: cloneArr(input),
      highlight: [i],
      compare: stack.slice(),
      note: `Push index ${i} onto stack`,
      vars: { i, stack: `[${stack.join(",")}]`, result: res.join(",") },
    });
  }
  frames.push({
    array: cloneArr(input),
    sorted: input.map((_, k) => k),
    note: `Done. next-greater = [${res.join(", ")}]`,
    vars: { result: res.join(",") },
  });
  return frames;
};

export const GENERATORS: Record<string, Generator> = {
  "linear-traversal": linearTraversal,
  "two-pointers": twoPointers,
  "sliding-window": slidingWindow,
  "prefix-sum": prefixSum,
  "hash-map": hashMap,
  "binary-search": binarySearch,
  kadane: kadane,
  "monotonic-stack": monotonicStack,
};

export function getGenerator(key?: string): Generator | null {
  if (!key) return null;
  return GENERATORS[key] ?? null;
}
