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

export type AlgoKey = "converter" | "bitwise" | "shift" | "modify" | "popcount" | "power2" | "mask" | "subsets";

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
];
