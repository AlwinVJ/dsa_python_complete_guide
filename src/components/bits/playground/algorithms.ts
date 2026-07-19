import { BitFrame } from "./types";

/* ---------- Python Code Snippets ---------- */

export const CONVERTER_CODE = `def decimal_to_binary(n):
    if n == 0: return "0"
    binary = []
    while n > 0:
        remainder = n % 2
        binary.append(str(remainder))
        n = n // 2
    return "".join(reversed(binary))`;

export const BITWISE_CODE = `def bitwise_op(a, b, op):
    if op == "AND":
        return a & b
    elif op == "OR":
        return a | b
    elif op == "XOR":
        return a ^ b
    elif op == "NOT":
        return ~a`;

export const SHIFT_CODE = `def shift_op(val, shift, dir):
    if dir == "LEFT":
        return val << shift
    else:
        return val >> shift`;

export const MODIFY_CODE = `def modify_bit(val, i, op):
    if op == "GET":
        return (val >> i) & 1
    elif op == "SET":
        return val | (1 << i)
    elif op == "CLEAR":
        return val & ~(1 << i)
    elif op == "TOGGLE":
        return val ^ (1 << i)`;

export const POPCOUNT_CODE = `def brian_kernighan(n):
    count = 0
    while n > 0:
        n = n & (n - 1)
        count += 1
    return count`;

export const POWER2_CODE = `def is_power_of_two(n):
    if n <= 0:
        return False
    return (n & (n - 1)) == 0`;

export const MASK_CODE = `def set_mask_op(mask_a, mask_b, op):
    if op == "UNION":
        return mask_a | mask_b
    elif op == "INTERSECT":
        return mask_a & mask_b
    elif op == "DIFFERENCE":
        return mask_a & ~mask_b`;

export const SUBSETS_CODE = `def generate_subsets(elements):
    n = len(elements)
    subsets = []
    for mask in range(1 << n):
        subset = []
        for i in range(n):
            if (mask & (1 << i)) != 0:
                subset.append(elements[i])
        subsets.append(subset)
    return subsets`;

/* ---------- Helper Functions ---------- */

export function toBitArray(n: number, size = 8): number[] {
  const arr = Array(size).fill(0);
  let val = Math.floor(n);
  if (val < 0) {
    val = (1 << size) + val; // Two's Complement mapping
  }
  for (let i = 0; i < size; i++) {
    arr[size - 1 - i] = (val >> i) & 1;
  }
  return arr;
}

/* ---------- Tracers ---------- */

// 1. BINARY CONVERTER
export function traceConverter(n: number): BitFrame[] {
  const frames: BitFrame[] = [];
  let currentVal = n;
  let operations = 0;
  let stepCount = 0;
  const binaryList: number[] = [];

  const snap = (line: number, note: string, explanation: string, currentGoal: string, focus: string, extras: Partial<BitFrame> = {}) => {
    // result bits represent the reverse collected binary list so far
    const resBits = Array(8).fill(0);
    for (let i = 0; i < binaryList.length; i++) {
      resBits[7 - i] = binaryList[i];
    }
    frames.push({
      kind: "converter",
      line,
      note,
      explanation,
      currentGoal,
      currentFocus: focus,
      valA: currentVal,
      resultVal: currentVal,
      bitsA: toBitArray(currentVal),
      bitsResult: resBits,
      activeBitIdx: binaryList.length,
      highlightIndices: [],
      stepCount: stepCount++,
      operationsPerformed: operations,
      ...extras,
    });
  };

  snap(1, "Start Decimal to Binary conversion.", `Given decimal value ${n}. We will divide it by 2 repeatedly, gathering the remainders from right to left (LSB to MSB).`, "Initialize number", `n = ${n}`);

  if (n === 0) {
    binaryList.push(0);
    snap(2, "Value is 0.", "The input is already 0, so the binary representation is immediately '0'.", "Zero case", "n = 0", { done: true });
    return frames;
  }

  while (currentVal > 0) {
    operations++;
    const remainder = currentVal % 2;
    snap(4, `Compute remainder: ${currentVal} % 2 = ${remainder}.`, `Evaluating the lowest bit position: the remainder of division by 2 is ${remainder}. This becomes the next bit in our output (added at position ${binaryList.length}).`, "Compute LSB remainder", `Remainder: ${remainder}`);

    binaryList.push(remainder);
    snap(5, `Append bit ${remainder} to result.`, `We record the remainder '${remainder}' in our binary accumulator.`, "Record Bit", `Binary bit: ${remainder}`);

    const oldVal = currentVal;
    currentVal = Math.floor(currentVal / 2);
    snap(6, `Divide n: ${oldVal} // 2 = ${currentVal}.`, `Shifting the decimal value right by dividing it by 2 (dropping the bit we just processed). The new value of n is ${currentVal}.`, "Shift right (divide)", `n = ${currentVal}`);
  }

  snap(7, `Conversion complete: binary string is '${[...binaryList].reverse().join("")}'.`, `All bits extracted. The accumulated binary remainder array from last to first gives the final base-2 representation.`, "Finished", "Result", { done: true });
  return frames;
}

// 2. BITWISE OPERATIONS
export function traceBitwise(a: number, b: number, op: "AND" | "OR" | "XOR" | "NOT"): BitFrame[] {
  const frames: BitFrame[] = [];
  let resultVal = 0;
  let operations = 0;
  let stepCount = 0;

  const bitsA = toBitArray(a);
  const bitsB = toBitArray(b);
  const bitsResult = Array(8).fill(0);
  const highlight: number[] = [];

  const snap = (line: number, note: string, explanation: string, currentGoal: string, focus: string, activeIdx: number, extras: Partial<BitFrame> = {}) => {
    frames.push({
      kind: "bitwise",
      line,
      note,
      explanation,
      currentGoal,
      currentFocus: focus,
      valA: a,
      valB: b,
      resultVal,
      bitsA,
      bitsB,
      bitsResult: [...bitsResult],
      activeBitIdx: activeIdx,
      highlightIndices: [...highlight],
      operationName: op,
      stepCount: stepCount++,
      operationsPerformed: operations,
      ...extras,
    });
  };

  snap(1, `Start bitwise ${op} operation on a = ${a}, b = ${b}.`, `We will align the 8-bit binary representations and evaluate the logic bit-by-bit from LSB (index 0) to MSB (index 7).`, "Initialize inputs", `a = ${a}, b = ${b}`, -1);

  // Compute final result
  let finalVal = 0;
  if (op === "AND") finalVal = a & b;
  else if (op === "OR") finalVal = a | b;
  else if (op === "XOR") finalVal = a ^ b;
  else if (op === "NOT") finalVal = ~a & 255; // 8-bit limit mask

  for (let i = 0; i < 8; i++) {
    operations++;
    const bitA = bitsA[7 - i];
    const bitB = bitsB[7 - i];
    let resBit = 0;

    let explanation = "";
    let note = "";

    if (op === "AND") {
      resBit = bitA & bitB;
      explanation = `Evaluating bit position ${i}: ${bitA} AND ${bitB} = ${resBit}. A bitwise AND outputs 1 only if BOTH input bits are 1.`;
      note = `Compare bits at index ${i}: ${bitA} & ${bitB} = ${resBit}`;
    } else if (op === "OR") {
      resBit = bitA | bitB;
      explanation = `Evaluating bit position ${i}: ${bitA} OR ${bitB} = ${resBit}. A bitwise OR outputs 1 if EITHER input bit is 1.`;
      note = `Compare bits at index ${i}: ${bitA} | ${bitB} = ${resBit}`;
    } else if (op === "XOR") {
      resBit = bitA ^ bitB;
      explanation = `Evaluating bit position ${i}: ${bitA} XOR ${bitB} = ${resBit}. A bitwise XOR outputs 1 if input bits differ.`;
      note = `Compare bits at index ${i}: ${bitA} ^ ${bitB} = ${resBit}`;
    } else if (op === "NOT") {
      resBit = bitA === 1 ? 0 : 1;
      explanation = `Evaluating bit position ${i}: NOT ${bitA} = ${resBit}. A bitwise NOT flips 1 to 0 and 0 to 1.`;
      note = `Invert bit at index ${i}: ~${bitA} = ${resBit}`;
    }

    snap(2, note, explanation, "Evaluate bit pair", `Index ${i}`, i);

    bitsResult[7 - i] = resBit;
    resultVal += resBit * (1 << i);
    highlight.push(7 - i);

    snap(3, `Record bit ${resBit} in result.`, `Updating output register bit ${i} to ${resBit}. Current decimal result so far is ${resultVal}.`, "Accumulate bit", `Result: ${resultVal}`, i);
  }

  // Handle NOT sign correctly in output string
  const trueResultVal = op === "NOT" ? ~a : finalVal;
  snap(4, `Bitwise ${op} complete. Result = ${trueResultVal}.`, `Completed evaluation of all 8 bit positions. Binary output represents decimal value ${trueResultVal}.`, "Finished", `Done`, -1, { resultVal: trueResultVal, done: true });
  return frames;
}

// 3. LEFT SHIFT & RIGHT SHIFT
export function traceShift(val: number, shift: number, dir: "LEFT" | "RIGHT"): BitFrame[] {
  const frames: BitFrame[] = [];
  let currentVal = val;
  let operations = 0;
  let stepCount = 0;

  const snap = (line: number, note: string, explanation: string, currentGoal: string, focus: string, extras: Partial<BitFrame> = {}) => {
    frames.push({
      kind: "shift",
      line,
      note,
      explanation,
      currentGoal,
      currentFocus: focus,
      valA: val,
      valB: shift,
      resultVal: currentVal,
      bitsA: toBitArray(val),
      bitsResult: toBitArray(currentVal),
      activeBitIdx: -1,
      highlightIndices: [],
      operationName: dir === "LEFT" ? "LSHIFT" : "RSHIFT",
      stepCount: stepCount++,
      operationsPerformed: operations,
      ...extras,
    });
  };

  snap(1, `Start ${dir} shift: ${val} shift by ${shift}.`, `We will slide all bits in the 8-bit binary representation of ${val} to the ${dir.toLowerCase()} by ${shift} position(s).`, "Initialize shift", `shift = ${shift}`);

  for (let s = 1; s <= shift; s++) {
    operations++;
    const prevVal = currentVal;
    if (dir === "LEFT") {
      currentVal = (currentVal << 1) & 255; // 8-bit limit mask
      snap(2, `Shift left by ${s}: ${prevVal} << 1 = ${currentVal}.`, `All bits shifted left 1 position. The leftmost bit falls off, and a 0 is inserted at the LSB position. This multiplies the value by 2.`, "Shift bit list", `Step ${s}`, { valA: prevVal });
    } else {
      currentVal = currentVal >> 1;
      snap(2, `Shift right by ${s}: ${prevVal} >> 1 = ${currentVal}.`, `All bits shifted right 1 position. The rightmost LSB falls off, and a 0 (or sign bit) is inserted at MSB. This divides the value by 2 (integer division).`, "Shift bit list", `Step ${s}`, { valA: prevVal });
    }
  }

  const finalVal = dir === "LEFT" ? (val << shift) : (val >> shift);
  snap(3, `Shift complete. Result value is ${finalVal}.`, `Completed shifts. Shifting by ${shift} is equivalent to ${dir === "LEFT" ? "multiplying" : "integer dividing"} by 2^${shift} = ${1 << shift}.`, "Finished", `Done`, { resultVal: finalVal, done: true });
  return frames;
}

// 4. GET / SET / CLEAR / TOGGLE
export function traceModify(val: number, bitIdx: number, op: "GET" | "SET" | "CLEAR" | "TOGGLE"): BitFrame[] {
  const frames: BitFrame[] = [];
  let resultVal = val;
  let operations = 0;
  let stepCount = 0;

  const maskVal = 1 << bitIdx;
  const bitsA = toBitArray(val);
  const bitsMask = toBitArray(maskVal);

  const snap = (line: number, note: string, explanation: string, currentGoal: string, focus: string, extras: Partial<BitFrame> = {}) => {
    frames.push({
      kind: "modify",
      line,
      note,
      explanation,
      currentGoal,
      currentFocus: focus,
      valA: val,
      valB: bitIdx,
      resultVal,
      bitsA,
      bitsMask,
      bitsResult: toBitArray(resultVal),
      activeBitIdx: bitIdx,
      highlightIndices: [7 - bitIdx],
      operationName: op,
      stepCount: stepCount++,
      operationsPerformed: operations,
      ...extras,
    });
  };

  snap(1, `Start modify bit index ${bitIdx} on value ${val}.`, `Goal: Perform a ${op} bitwise command at index ${bitIdx} (0-indexed from right).`, "Initialize mask", `val = ${val}, i = ${bitIdx}`);

  snap(2, `Generate mask: 1 << ${bitIdx} = ${maskVal}.`, `Create a mask containing a 1-bit only at position ${bitIdx} by shifting 1 left by ${bitIdx} places. Mask value is ${maskVal} (binary: ${bitsMask.join("")}).`, "Shift mask bit", `mask = ${maskVal}`);

  operations++;
  if (op === "GET") {
    resultVal = (val >> bitIdx) & 1;
    snap(3, `Retrieve bit: (val >> ${bitIdx}) & 1 = ${resultVal}.`, `Right shift the target bit to the LSB position, then AND with 1. The bit value at index ${bitIdx} is ${resultVal}.`, "Perform logic", `Bit is ${resultVal}`, { done: true });
  } else if (op === "SET") {
    resultVal = val | maskVal;
    snap(3, `Force set: val | mask = ${resultVal}.`, `Perform a bitwise OR. Since the mask is 1 at index ${bitIdx}, ORing forces the output bit to 1 regardless of its initial state. Output is ${resultVal}.`, "Perform OR mask", `Result = ${resultVal}`, { done: true });
  } else if (op === "CLEAR") {
    const invMask = ~maskVal & 255;
    resultVal = val & ~(maskVal);
    snap(3, `Force clear: val & ~mask = ${resultVal}.`, `Invert mask to ~mask (${invMask}), which has a 0 only at index ${bitIdx}. Performing bitwise AND forces the output bit at index ${bitIdx} to 0. Output is ${resultVal}.`, "Perform AND ~mask", `Result = ${resultVal}`, { bitsMask: toBitArray(invMask), done: true });
  } else if (op === "TOGGLE") {
    resultVal = val ^ maskVal;
    snap(3, `Toggle bit: val ^ mask = ${resultVal}.`, `Perform a bitwise XOR. Since the mask is 1 at index ${bitIdx}, XORing flips the bit: if it was 0 it becomes 1, if it was 1 it becomes 0. Output is ${resultVal}.`, "Perform XOR mask", `Result = ${resultVal}`, { done: true });
  }

  return frames;
}

// 5. POPCOUNT (BRIAN KERNIGHAN)
export function tracePopcount(n: number): BitFrame[] {
  const frames: BitFrame[] = [];
  let currentVal = n;
  let count = 0;
  let operations = 0;
  let stepCount = 0;

  const snap = (line: number, note: string, explanation: string, currentGoal: string, focus: string, extras: Partial<BitFrame> = {}) => {
    frames.push({
      kind: "popcount",
      line,
      note,
      explanation,
      currentGoal,
      currentFocus: focus,
      valA: n,
      resultVal: currentVal,
      bitsA: toBitArray(n),
      bitsResult: toBitArray(currentVal),
      activeBitIdx: -1,
      highlightIndices: [],
      setBitsCount: count,
      stepCount: stepCount++,
      operationsPerformed: operations,
      ...extras,
    });
  };

  snap(1, `Start Brian Kernighan bit count on n = ${n}.`, `Initialize set bits counter to 0. We will repeatedly turn off the lowest set bit using n & (n - 1) until n becomes 0.`, "Initialize counter", `count = 0`);

  while (currentVal > 0) {
    operations++;
    const prevVal = currentVal;
    const subVal = currentVal - 1;
    snap(3, `Evaluate terms: n = ${prevVal}, n - 1 = ${subVal}.`, `Preparing to clear the lowest set bit. Notice how subtracting 1 flips all bits from the rightmost 1-bit to the LSB.`, "Inspect transition", `n = ${prevVal}`);

    currentVal = prevVal & subVal;
    count++;
    snap(3, `Apply: n = n & (n - 1) -> ${currentVal}. Count is ${count}.`, `Bitwise AND of ${prevVal} and ${subVal} results in ${currentVal}, turning off the lowest set bit. Incrementing counter to ${count}.`, "Clear lowest bit", `count = ${count}`, { bitsMask: toBitArray(subVal) });
  }

  snap(5, `Kernighan popcount complete. Total set bits: ${count}.`, `The value of n reached 0. The total number of set bits (popcount) is ${count}.`, "Finished", `Done`, { done: true });
  return frames;
}

// 6. POWER OF TWO CHECKER
export function tracePower2(n: number): BitFrame[] {
  const frames: BitFrame[] = [];
  let operations = 0;
  let stepCount = 0;

  const snap = (line: number, note: string, explanation: string, currentGoal: string, focus: string, extras: Partial<BitFrame> = {}) => {
    frames.push({
      kind: "power2",
      line,
      note,
      explanation,
      currentGoal,
      currentFocus: focus,
      valA: n,
      resultVal: n,
      bitsA: toBitArray(n),
      bitsResult: toBitArray(n),
      activeBitIdx: -1,
      highlightIndices: [],
      stepCount: stepCount++,
      operationsPerformed: operations,
      ...extras,
    });
  };

  snap(1, `Verify power of two for n = ${n}.`, `A positive number is a power of 2 if and only if it contains exactly one set bit in binary. We will test if n > 0 and n & (n - 1) == 0.`, "Start check", `n = ${n}`);

  if (n <= 0) {
    snap(2, `Failed: n <= 0. Not a power of two.`, `Negative integers and zero cannot be powers of 2.`, "Check positivity", "Invalid", { isPower2: false, done: true });
    return frames;
  }

  operations++;
  const subVal = n - 1;
  snap(3, `Inspect: n = ${n}, n - 1 = ${subVal}.`, `Preparing to clear the lowest set bit: performing bitwise AND of ${n} and ${subVal}.`, "Perform AND comparison", `n - 1 = ${subVal}`);

  const check = n & subVal;
  const isPower = check === 0;

  if (isPower) {
    snap(3, `Success: ${n} & ${subVal} == 0. It is a power of two!`, `ANDing n and n-1 cleared the only set bit, leaving 0. This proves the number contains exactly one set bit and is a power of two.`, "Logic Check", "Is Power of 2!", { isPower2: true, bitsMask: toBitArray(subVal), done: true });
  } else {
    snap(3, `Failed: ${n} & ${subVal} = ${check} (non-zero). Not a power of two.`, `ANDing n and n-1 left a non-zero value (${check}). This proves the number contains multiple set bits and is NOT a power of two.`, "Logic Check", "Not Power of 2", { isPower2: false, bitsMask: toBitArray(subVal), done: true });
  }

  return frames;
}

// 7. BIT MASK OPERATIONS
export function traceMask(maskA: number, maskB: number, op: "UNION" | "INTERSECT" | "DIFFERENCE"): BitFrame[] {
  const frames: BitFrame[] = [];
  let resultVal = 0;
  let operations = 0;
  let stepCount = 0;

  const bitsA = toBitArray(maskA);
  const bitsB = toBitArray(maskB);
  const bitsResult = Array(8).fill(0);
  const highlight: number[] = [];

  const snap = (line: number, note: string, explanation: string, currentGoal: string, focus: string, activeIdx: number, extras: Partial<BitFrame> = {}) => {
    frames.push({
      kind: "mask",
      line,
      note,
      explanation,
      currentGoal,
      currentFocus: focus,
      valA: maskA,
      valB: maskB,
      resultVal,
      bitsA,
      bitsB,
      bitsResult: [...bitsResult],
      activeBitIdx: activeIdx,
      highlightIndices: [...highlight],
      operationName: op,
      stepCount: stepCount++,
      operationsPerformed: operations,
      ...extras,
    });
  };

  snap(1, `Start bitmask set operation ${op}.`, `Set A maps to mask ${maskA} (binary: ${bitsA.join("")}). Set B maps to mask ${maskB} (binary: ${bitsB.join("")}). We will process element positions 0 to 7.`, "Initialize sets", `A = ${maskA}, B = ${maskB}`, -1);

  for (let i = 0; i < 8; i++) {
    operations++;
    const hasA = bitsA[7 - i];
    const hasB = bitsB[7 - i];
    let include = 0;
    let desc = "";

    if (op === "UNION") {
      include = hasA | hasB;
      desc = `Union (OR): Element ${i} is included because it is in Set A (${hasA}) OR Set B (${hasB}). Result: ${include}.`;
    } else if (op === "INTERSECT") {
      include = hasA & hasB;
      desc = `Intersection (AND): Element ${i} is included because it is in Set A (${hasA}) AND Set B (${hasB}). Result: ${include}.`;
    } else if (op === "DIFFERENCE") {
      include = hasA & (hasB === 1 ? 0 : 1);
      desc = `Difference (AND NOT): Element ${i} is included because it is in Set A (${hasA}) AND NOT in Set B (${hasB}). Result: ${include}.`;
    }

    snap(2, `Evaluate element ${i} membership.`, desc, "Evaluate element", `Index ${i}`, i);

    bitsResult[7 - i] = include;
    resultVal += include * (1 << i);
    highlight.push(7 - i);

    snap(3, `Accumulate element ${i} state.`, `Adding membership result to final set mask value. Current result mask is ${resultVal}.`, "Accumulate result", `Result = ${resultVal}`, i);
  }

  const finalVal = op === "UNION" ? (maskA | maskB) : op === "INTERSECT" ? (maskA & maskB) : (maskA & ~maskB);
  snap(4, `Set mask operation complete. Result mask value is ${finalVal}.`, `Completed evaluation of all elements. The final output mask is ${finalVal} representing the resulting set.`, "Finished", "Done", -1, { resultVal: finalVal, done: true });
  return frames;
}

// 8. SUBSET GENERATION
export function traceSubsets(elements: string[]): BitFrame[] {
  const frames: BitFrame[] = [];
  const N = elements.length;
  const totalSubsets = 1 << N;
  let operations = 0;
  let stepCount = 0;
  const subsetsFound: string[] = [];

  const snap = (line: number, note: string, explanation: string, currentGoal: string, focus: string, mask: number, extras: Partial<BitFrame> = {}) => {
    frames.push({
      kind: "subsets",
      line,
      note,
      explanation,
      currentGoal,
      currentFocus: focus,
      valA: N,
      valB: totalSubsets,
      resultVal: mask,
      bitsA: toBitArray(N),
      bitsResult: toBitArray(mask, 4), // render in 4 bits for clarity
      activeBitIdx: -1,
      highlightIndices: [],
      subsetMask: mask,
      subsetsFound: [...subsetsFound],
      stepCount: stepCount++,
      operationsPerformed: operations,
      ...extras,
    });
  };

  snap(1, `Start subset generation for elements [${elements.join(", ")}].`, `A set of size ${N} has 2^${N} = ${totalSubsets} subsets. We will count binary mask values from 0 to ${totalSubsets - 1}.`, "Initialize masks", `0 to ${totalSubsets - 1}`, 0);

  for (let mask = 0; mask < totalSubsets; mask++) {
    snap(3, `Evaluate subset mask ${mask} (binary: ${toBitArray(mask, N).join("")}).`, `Testing mask value ${mask}. Each set bit at index 'i' indicates we include elements[i] in the subset.`, "Inspect mask bits", `mask = ${mask}`, mask);

    const currentSubset: string[] = [];
    for (let i = 0; i < N; i++) {
      operations++;
      const isIncluded = (mask & (1 << i)) !== 0;
      const term = elements[i];

      if (isIncluded) {
        currentSubset.push(term);
        snap(6, `Bit ${i} is 1: Include element '${term}'.`, `Evaluating element index ${i}. The bit in mask is set (1), so we add '${term}' to the current subset.`, "Match bit - Add", `element '${term}'`, mask);
      } else {
        snap(5, `Bit ${i} is 0: Skip element '${term}'.`, `Evaluating element index ${i}. The bit in mask is cleared (0), so we bypass '${term}'.`, "Bypass bit", `element '${term}'`, mask);
      }
    }

    const subsetStr = `{${currentSubset.join(", ")}}`;
    subsetsFound.push(subsetStr);
    snap(7, `Record subset: ${subsetStr}.`, `Constructed subset ${subsetStr} for mask ${mask} and added it to output registry.`, "Record Subset", `Subset: ${subsetStr}`, mask);
  }

  snap(8, `Subset generation complete. Found ${subsetsFound.length} subsets.`, `Successfully evaluated all ${totalSubsets} binary masks. Generated all possible combinations.`, "Finished", "Done", totalSubsets - 1, { done: true });
  return frames;
}

/* ---------- Gray Code ---------- */

export const GRAYCODE_CODE = `def gray_code(n):
    codes = []
    for i in range(1 << n):
        g = i ^ (i >> 1)
        codes.append(g)
    return codes`;

export function traceGrayCode(nBits: number): BitFrame[] {
  const frames: BitFrame[] = [];
  const bits = Math.max(1, Math.min(6, nBits));
  const total = 1 << bits;
  let operations = 0;
  let stepCount = 0;
  const sequence: { i: number; gray: number; bits: number[] }[] = [];
  let prevGrayBits: number[] = Array(8).fill(0);

  const snap = (line: number, note: string, explanation: string, goal: string, focus: string, extras: Partial<BitFrame> = {}) => {
    frames.push({
      kind: "graycode",
      line,
      note,
      explanation,
      currentGoal: goal,
      currentFocus: focus,
      valA: bits,
      valB: total,
      resultVal: sequence.length > 0 ? sequence[sequence.length - 1].gray : 0,
      bitsA: toBitArray(bits),
      bitsResult: sequence.length > 0 ? sequence[sequence.length - 1].bits : Array(8).fill(0),
      activeBitIdx: -1,
      highlightIndices: [],
      grayPrev: [...prevGrayBits],
      grayIndex: sequence.length,
      grayTotal: total,
      graySequence: [...sequence],
      stepCount: stepCount++,
      operationsPerformed: operations,
      ...extras,
    });
  };

  snap(1, `Generate Gray Code for n = ${bits} bits.`, `A Gray code sequence enumerates 2^${bits} = ${total} values so that consecutive codes differ by exactly one bit. Formula: g = i ^ (i >> 1).`, "Initialize", `n = ${bits}`);

  for (let i = 0; i < total; i++) {
    operations++;
    const gray = i ^ (i >> 1);
    const gBits = toBitArray(gray);

    let changed = -1;
    if (i > 0) {
      for (let k = 0; k < 8; k++) {
        if (gBits[k] !== prevGrayBits[k]) { changed = k; break; }
      }
    }
    const changedBitPos = changed >= 0 ? 7 - changed : -1;
    const highlight = changed >= 0 ? [changed] : [];

    snap(
      3,
      `i = ${i}, g = i ^ (i >> 1) = ${gray}.`,
      `Compute Gray code for i = ${i}: ${i} XOR ${i >> 1} = ${gray} (binary ${gBits.slice(8 - bits).join("")}).${changedBitPos >= 0 ? ` This differs from the previous code by exactly one bit at position ${changedBitPos}.` : " This is the first code (base value)."}`,
      "Compute gray code",
      `i = ${i}, g = ${gray}`,
      {
        resultVal: gray,
        bitsResult: gBits,
        highlightIndices: highlight,
        changedBit: changedBitPos,
        activeBitIdx: changedBitPos,
      }
    );

    sequence.push({ i, gray, bits: gBits });
    prevGrayBits = gBits;

    snap(
      4,
      `Append ${gray} to code list.`,
      `Recorded gray code ${gray} at position ${i}. Sequence length is now ${sequence.length}.`,
      "Record code",
      `codes[${i}] = ${gray}`,
      {
        resultVal: gray,
        bitsResult: gBits,
        highlightIndices: highlight,
        changedBit: changedBitPos,
      }
    );
  }

  snap(5, `Gray code sequence complete (${total} codes).`, `Generated all ${total} Gray codes. Each consecutive pair differs by exactly one bit — a defining property useful for rotary encoders and Karnaugh maps.`, "Finished", "Done", { done: true });
  return frames;
}

/* ---------- Hamming Distance ---------- */

export const HAMMING_CODE = `def hamming_distance(a, b):
    x = a ^ b
    count = 0
    while x > 0:
        count += x & 1
        x >>= 1
    return count`;

export function traceHamming(a: number, b: number): BitFrame[] {
  const frames: BitFrame[] = [];
  const bitsA = toBitArray(a);
  const bitsB = toBitArray(b);
  const xorVal = (a ^ b) & 255;
  const bitsXor = toBitArray(xorVal);
  const bitsResult = Array(8).fill(0);
  let count = 0;
  let operations = 0;
  let stepCount = 0;
  const highlight: number[] = [];

  const snap = (line: number, note: string, explanation: string, goal: string, focus: string, activeIdx: number, extras: Partial<BitFrame> = {}) => {
    frames.push({
      kind: "hamming",
      line,
      note,
      explanation,
      currentGoal: goal,
      currentFocus: focus,
      valA: a,
      valB: b,
      resultVal: count,
      bitsA,
      bitsB,
      bitsResult: [...bitsResult],
      bitsMask: bitsXor,
      activeBitIdx: activeIdx,
      highlightIndices: [...highlight],
      hammingCount: count,
      stepCount: stepCount++,
      operationsPerformed: operations,
      ...extras,
    });
  };

  snap(1, `Compute Hamming distance between ${a} and ${b}.`, `Hamming distance counts bit positions where two integers differ. We first compute a XOR b so that differing bits become 1s.`, "Initialize", `a = ${a}, b = ${b}`, -1);

  snap(2, `Compute XOR: ${a} ^ ${b} = ${xorVal}.`, `The XOR produces a 1 exactly at bit positions where a and b disagree. Result: ${xorVal} (binary ${bitsXor.join("")}). We now count its set bits.`, "XOR values", `x = ${xorVal}`, -1);

  for (let i = 0; i < 8; i++) {
    operations++;
    const bit = bitsXor[7 - i];
    snap(4, `Inspect bit position ${i}: value ${bit}.`, `Testing whether position ${i} of the XOR result is set. bit = ${bit}. If it is 1 (positions differed), we increment the distance count.`, "Inspect bit", `bit ${i} = ${bit}`, i);

    if (bit === 1) {
      count++;
      bitsResult[7 - i] = 1;
      highlight.push(7 - i);
      snap(4, `Bit ${i} differs — count = ${count}.`, `Position ${i}: a and b differ (a bit ${bitsA[7 - i]}, b bit ${bitsB[7 - i]}). Increment Hamming count to ${count}.`, "Increment count", `count = ${count}`, i, { hammingCount: count, resultVal: count });
    }
  }

  snap(5, `Hamming distance = ${count}.`, `All 8 bit positions inspected. Total differing bits: ${count}. That is the Hamming distance between ${a} and ${b}.`, "Finished", `d = ${count}`, -1, { done: true, hammingCount: count, resultVal: count });
  return frames;
}

/* ---------- Bloom Filter ---------- */

export const BLOOM_CODE = `class BloomFilter:
    def __init__(self, m, k):
        self.m = m
        self.bits = [0] * m
        self.hashes = [self._make(i) for i in range(k)]

    def insert(self, item):
        for h in self.hashes:
            self.bits[h(item) % self.m] = 1

    def contains(self, item):
        return all(self.bits[h(item) % self.m] == 1
                   for h in self.hashes)`;

// Simple deterministic hash for visualization
function bloomHashes(item: string, m: number): { name: string; value: number; index: number }[] {
  // 3 hash functions, deterministic small integers
  let h1 = 0, h2 = 0, h3 = 0;
  for (let i = 0; i < item.length; i++) {
    const c = item.charCodeAt(i);
    h1 = (h1 * 31 + c) >>> 0;
    h2 = (h2 * 131 + c * 7) >>> 0;
    h3 = (h3 * 17 + c * 13 + 3) >>> 0;
  }
  return [
    { name: "h1", value: h1, index: h1 % m },
    { name: "h2", value: h2, index: h2 % m },
    { name: "h3", value: h3, index: h3 % m },
  ];
}

export function traceBloom(size: number, ops: { kind: "insert" | "lookup"; item: string }[]): BitFrame[] {
  const frames: BitFrame[] = [];
  const m = Math.max(4, Math.min(32, size));
  const bloomBits: number[] = Array(m).fill(0);
  const stored: string[] = [];
  let operations = 0;
  let stepCount = 0;

  const snap = (line: number, note: string, explanation: string, goal: string, focus: string, extras: Partial<BitFrame> = {}) => {
    frames.push({
      kind: "bloom",
      line,
      note,
      explanation,
      currentGoal: goal,
      currentFocus: focus,
      valA: m,
      valB: 3,
      resultVal: bloomBits.reduce((a, x) => a + x, 0),
      bitsA: toBitArray(m),
      bitsResult: bloomBits.slice(0, 8),
      activeBitIdx: -1,
      highlightIndices: [],
      bloomBits: [...bloomBits],
      bloomStored: [...stored],
      stepCount: stepCount++,
      operationsPerformed: operations,
      ...extras,
    });
  };

  snap(1, `Initialize Bloom filter (m = ${m}, k = 3).`, `Create a bit array of size ${m}, all zeros, together with 3 hash functions. Bloom filters answer set membership with probabilistic guarantees: no false negatives, possible false positives.`, "Initialize filter", `m = ${m}, k = 3`);

  for (const op of ops) {
    operations++;
    const hashes = bloomHashes(op.item, m);

    if (op.kind === "insert") {
      snap(7, `Insert "${op.item}".`, `Hash "${op.item}" with all 3 hash functions and set the corresponding bits to 1.`, "Insert item", `item = "${op.item}"`, { bloomMode: "insert", bloomHashes: hashes });

      for (const h of hashes) {
        bloomBits[h.index] = 1;
        snap(8, `Set bit ${h.index} (${h.name}).`, `${h.name}("${op.item}") mod ${m} = ${h.index}. Setting bloomBits[${h.index}] = 1.`, "Set bit", `${h.name} → ${h.index}`, {
          bloomMode: "insert",
          bloomHashes: hashes,
          bloomTouched: [h.index],
          bloomBits: [...bloomBits],
        });
      }
      stored.push(op.item);
      snap(8, `"${op.item}" inserted.`, `All 3 bit positions for "${op.item}" are now set. Filter tracks ${stored.length} inserted item(s).`, "Done insert", `stored: ${stored.length}`, { bloomMode: "insert", bloomHashes: hashes, bloomStored: [...stored] });
    } else {
      snap(10, `Lookup "${op.item}".`, `Hash "${op.item}" with all 3 hash functions and check whether every corresponding bit is 1.`, "Lookup item", `item = "${op.item}"`, { bloomMode: "lookup", bloomHashes: hashes, bloomQueryItem: op.item });

      let allSet = true;
      for (const h of hashes) {
        const val = bloomBits[h.index];
        if (val === 0) allSet = false;
        snap(11, `Check bit ${h.index} (${h.name}) = ${val}.`, `${h.name}("${op.item}") mod ${m} = ${h.index}. bloomBits[${h.index}] = ${val}. ${val === 0 ? "A zero means the item is definitely NOT in the set — return false immediately in a real implementation." : "Bit is set — continue checking."}`, "Check bit", `${h.name} → ${h.index} = ${val}`, {
          bloomMode: "lookup",
          bloomHashes: hashes,
          bloomTouched: [h.index],
          bloomQueryItem: op.item,
        });
      }

      const isStored = stored.includes(op.item);
      const result: "positive" | "negative" | "false-positive" = !allSet
        ? "negative"
        : isStored
          ? "positive"
          : "false-positive";
      const resultText =
        result === "positive"
          ? `TRUE POSITIVE — "${op.item}" is present and all bits matched.`
          : result === "negative"
            ? `DEFINITELY NOT — at least one bit was zero, so "${op.item}" was never inserted.`
            : `FALSE POSITIVE — all bits happened to be set by other items, but "${op.item}" was never inserted. This is the Bloom filter's fundamental tradeoff.`;
      snap(11, resultText, resultText, "Membership result", result.toUpperCase(), {
        bloomMode: "lookup",
        bloomHashes: hashes,
        bloomQueryItem: op.item,
        bloomResult: result,
      });
    }
  }

  snap(12, "Bloom filter operations complete.", `Filter now stores ${stored.length} item(s) across ${m} bits. Occupancy: ${bloomBits.reduce((a, x) => a + x, 0)} / ${m} bits set.`, "Finished", "Done", { done: true });
  return frames;
}

/* ---------- Fast Exponentiation ---------- */

export const FASTEXP_CODE = `def fast_pow(base, exp):
    result = 1
    while exp > 0:
        if exp & 1:
            result = result * base
        base = base * base
        exp >>= 1
    return result`;

export function traceFastExp(baseIn: number, expIn: number): BitFrame[] {
  const frames: BitFrame[] = [];
  let base = baseIn;
  let exp = Math.max(0, Math.min(15, expIn));
  let result = 1;
  let operations = 0;
  let stepCount = 0;
  let bitPos = 0;
  const originalExp = exp;
  const expBits = toBitArray(exp);

  const snap = (line: number, note: string, explanation: string, goal: string, focus: string, action: "multiply" | "square" | "skip" | "init" | "done", extras: Partial<BitFrame> = {}) => {
    frames.push({
      kind: "fastexp",
      line,
      note,
      explanation,
      currentGoal: goal,
      currentFocus: focus,
      valA: baseIn,
      valB: originalExp,
      resultVal: result,
      bitsA: toBitArray(base & 255),
      bitsResult: toBitArray(result & 255),
      bitsMask: expBits,
      activeBitIdx: 7 - bitPos,
      highlightIndices: [7 - bitPos],
      fexpBase: base,
      fexpExp: exp,
      fexpResult: result,
      fexpBitPos: bitPos,
      fexpExpBits: [...expBits],
      fexpAction: action,
      stepCount: stepCount++,
      operationsPerformed: operations,
      ...extras,
    });
  };

  snap(1, `Compute ${baseIn}^${originalExp} using bit exponentiation.`, `Exponentiation by squaring processes the exponent's binary digits from LSB to MSB. For each bit: if it is 1, multiply the running result by the current base; then square the base and shift the exponent right.`, "Initialize", `base = ${baseIn}, exp = ${originalExp}`, "init");

  while (exp > 0) {
    operations++;
    const bit = exp & 1;

    if (bit === 1) {
      const prevResult = result;
      result = result * base;
      snap(4, `Bit ${bitPos} is 1 → multiply: ${prevResult} × ${base} = ${result}.`, `The current bit of the exponent is 1, so we fold the current base (${base}) into our running product. Result: ${prevResult} × ${base} = ${result}.`, "Multiply into result", `result = ${result}`, "multiply");
    } else {
      snap(4, `Bit ${bitPos} is 0 → skip multiplication.`, `The current bit of the exponent is 0, so the base is not folded into the result at this step.`, "Skip bit", `bit ${bitPos} = 0`, "skip");
    }

    const prevBase = base;
    base = base * base;
    exp = exp >> 1;
    bitPos++;
    if (exp > 0) {
      snap(5, `Square base: ${prevBase}² = ${base}; exp >>= 1 → ${exp}.`, `Square the base so it represents 2^${bitPos} copies of the original base. Right-shift the exponent to inspect the next bit.`, "Square base, shift exp", `base = ${base}, exp = ${exp}`, "square");
    }
  }

  snap(7, `${baseIn}^${originalExp} = ${result}.`, `Loop finished when exponent became 0. Final result: ${result}. Total multiplications performed: O(log ${originalExp}).`, "Finished", `result = ${result}`, "done", { done: true });
  return frames;
}

export type AlgoKey = "converter" | "bitwise" | "shift" | "modify" | "popcount" | "power2" | "mask" | "subsets" | "graycode" | "hamming" | "bloom" | "fastexp";

export interface AlgoDef {
  id: AlgoKey;
  name: string;
  description: string;
  code: string;
  fileName: string;
}

export const ALGOS: AlgoDef[] = [
  {
    id: "converter",
    name: "Binary Converter",
    description: "Convert a decimal integer to a binary string representation using repeated division by 2.",
    code: CONVERTER_CODE,
    fileName: "decimal_to_binary.py",
  },
  {
    id: "bitwise",
    name: "Bitwise Operators",
    description: "Visualize logical AND (&), OR (|), XOR (^), and NOT (~) bit-by-bit combinations.",
    code: BITWISE_CODE,
    fileName: "bitwise_op.py",
  },
  {
    id: "shift",
    name: "Shift Operations",
    description: "Slide bits left (<<) or right (>>) by offset counts to multiply or divide by powers of two.",
    code: SHIFT_CODE,
    fileName: "shift_op.py",
  },
  {
    id: "modify",
    name: "Modify Bit",
    description: "Get, set, clear, or toggle specific bits at 0-indexed offset positions using bitwise masks.",
    code: MODIFY_CODE,
    fileName: "modify_bit.py",
  },
  {
    id: "popcount",
    name: "Count Set Bits",
    description: "Brian Kernighan's popcount algorithm clearing the lowest set bit in O(set_bits) iterations.",
    code: POPCOUNT_CODE,
    fileName: "brian_kernighan.py",
  },
  {
    id: "power2",
    name: "Power of Two",
    description: "Check if a positive number is an exponent of 2 in O(1) time: n > 0 and (n & (n - 1)) == 0.",
    code: POWER2_CODE,
    fileName: "is_power_of_two.py",
  },
  {
    id: "mask",
    name: "Bit Mask Operations",
    description: "Represent sets as binary numbers and perform union (|), intersection (&), and difference (& ~).",
    code: MASK_CODE,
    fileName: "set_mask_op.py",
  },
  {
    id: "subsets",
    name: "Subset Generation",
    description: "Enumerate all 2^N subsets of a set by mapping each elements combination to bit mask indexes.",
    code: SUBSETS_CODE,
    fileName: "generate_subsets.py",
  },
  {
    id: "graycode",
    name: "Gray Code Generator",
    description: "Generate reflected Gray codes where consecutive values differ by exactly one bit. Uses the identity g = i ^ (i >> 1).",
    code: GRAYCODE_CODE,
    fileName: "gray_code.py",
  },
  {
    id: "hamming",
    name: "Hamming Distance",
    description: "Count the number of differing bit positions between two integers by XOR-ing them and counting set bits.",
    code: HAMMING_CODE,
    fileName: "hamming_distance.py",
  },
  {
    id: "bloom",
    name: "Bloom Filter",
    description: "Space-efficient probabilistic set membership. Insert sets k hashed bit positions; lookup returns 'possibly' or 'definitely not'.",
    code: BLOOM_CODE,
    fileName: "bloom_filter.py",
  },
  {
    id: "fastexp",
    name: "Fast Exponentiation",
    description: "Compute base^exp in O(log exp) by walking the binary digits of the exponent, multiplying when the bit is 1 and squaring the base each step.",
    code: FASTEXP_CODE,
    fileName: "fast_pow.py",
  },
];

