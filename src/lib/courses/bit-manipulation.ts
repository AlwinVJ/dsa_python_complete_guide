import type { Course } from "./types";

export const bitManipulationCourse: Course = {
  slug: "bit-manipulation",
  title: "Bit Manipulation",
  tagline: "Unleash high-performance programming using low-level bitwise operations.",
  category: "algorithm",
  order: 10,
  icon: "Binary",
  comingSoon: false,
  courseLayout: "overview",
  ctaText: "Open Bit Playground →",
  ctaRoute: "/playgrounds/bit-manipulation",
  overview: {
    introduction:
      "Bit manipulation is the act of algorithmically manipulating bits (0s and 1s) inside a computer's memory. Instead of using high-level math operations (like multiplication, division, or modulo) or storing boolean states in separate bytes, bitwise operations interact directly with the binary representations of data. This allows for near-instant execution speed and minimal memory consumption.",
    whyLearn:
      "Every integer, character, and address in memory is stored in binary. Bitwise operations are executed directly by the CPU in a single clock cycle, making them significantly faster than arithmetic operations. In coding interviews, systems programming, and competitive programming, bitwise operations are crucial for optimizing memory (using bit masks), tracking states compactly (using bitsets), and solving problems that seem to require hash sets in O(1) space.",
    learningObjectives: [
      "Understand standard binary number representation, signed magnitude, and Two's Complement.",
      "Master core operators: AND (&), OR (|), XOR (^), NOT (~), Left Shift (<<), and Right Shift (>>).",
      "Learn standard tricks: setting, clearing, toggling, and checking specific bits.",
      "Master Brian Kernighan's Algorithm to count set bits in O(set_bits) time.",
      "Learn subset generation using binary integers as bitmasks.",
      "Solve classic XOR-related puzzles like finding unique or missing numbers.",
      "Avoid common bitwise operator precedence and integer overflow traps.",
    ],
    realWorldApplications: [
      "Systems Programming — accessing device registers, control ports, and network headers.",
      "Cryptography — hash functions (SHA-256) and block ciphers relying heavily on bitwise XOR and rotations.",
      "Graphics & Gaming — packing color values (RGBA) into single 32-bit integers.",
      "Databases & Search — Bloom filters using bit vectors to track set membership with minimal space.",
    ],
    advantages: [
      "Incredible Speed — bitwise operations execute in a single CPU cycle.",
      "Ultra-compact Storage — pack 32 distinct boolean states into a single integer.",
      "No Extra Space — solve set-like membership queries without allocating heap memory.",
    ],
    limitations: [
      "Readability — code can become cryptic and hard to debug for team members.",
      "Operator Precedence — bitwise operators have lower priority than comparison operators in most languages.",
      "Signed Integers — right shift handles sign bits differently depending on language and sign bit propagation.",
    ],
    prerequisites: [
      "Basic understanding of variables, types, and base-10 integers.",
      "Familiarity with arithmetic loops and condition checks in Python.",
    ],
    estimatedTime: "3–5 Hours",
    difficulty: 3,
  },
  infoCard: {
    estimatedTime: "3–5 Hours",
    difficulty: 3,
    practiceRequired: true,
    language: "Python",
  },
  whoIsThisFor: [
    "Learners looking to build a strong foundation in binary logic and low-level arithmetic.",
    "Interview prep candidates preparing for bitwise, XOR, and subset questions.",
    "Systems engineers optimization enthusiasts looking for performance speedups.",
  ],
  lessons: [
    {
      slug: "introduction",
      title: "1. Introduction to Bit Manipulation",
      tagline: "Interacting directly with memory representation at the CPU level.",
      theory:
        "Bit manipulation operates directly on the binary representation of integers. In high-level languages, we work with decimal numbers (base-10), but computer hardware stores everything in base-2 (bits containing 0 or 1). \n\nBitwise operations represent the lowest-level computations possible. By bypassing mathematical abstractions, we communicate directly with the CPU's Arithmetic Logic Unit (ALU), turning multi-step arithmetic operations into single CPU clock instructions.",
      bullets: [
        "A bit (binary digit) is the basic unit of information (0 or 1).",
        "Bit manipulation applies logical operations directly to these bits.",
        "Crucial for performance optimizations, state compression, and embedded programming.",
      ],
      quiz: {
        q: "Why are bitwise operations extremely fast compared to division or modulo?",
        choices: [
          "They are run in parallel.",
          "They bypass translation to binary and execute directly on the hardware in a single cycle.",
          "They do not use variables.",
          "They are done in memory caches.",
        ],
        answer: 1,
        explain: "Since computer hardware natively stores data in binary, bitwise operations do not require complex arithmetic division logic and run directly in a single CPU clock cycle.",
      },
    },
    {
      slug: "binary-number-system",
      title: "2. Binary Number System",
      tagline: "Understanding positional base-2 and Two's Complement representations.",
      theory:
        "In base-2, each digit's position represents a power of 2, starting from 2^0 on the right. For example, 13 in decimal is represented in binary as 1101 (8 + 4 + 0 + 1). \n\nTo represent negative integers, modern computers use **Two's Complement**. To negate a number, invert all bits (1 -> 0, 0 -> 1) and add 1. This representation is elegant because it allows the same adder circuit to handle both addition and subtraction, and prevents having dual representations of zero (+0 and -0).",
      bullets: [
        "Base-2 positional notation: digits denote powers of 2.",
        "Most Significant Bit (MSB) is the leftmost bit; Least Significant Bit (LSB) is the rightmost.",
        "Two's Complement: negative N is computed as (~N + 1).",
      ],
      code: `# Example: Convert decimal to a binary string representation
def dec_to_bin(n):
    if n == 0:
        return "0"
    bits = []
    # Loop to extract bits from LSB to MSB
    while n > 0:
        bits.append(str(n % 2))
        n //= 2
    return "".join(reversed(bits))`,
      quiz: {
        q: "What is the binary representation of the decimal number 10?",
        choices: ["1010", "1100", "1001", "1110"],
        answer: 0,
        explain: "10 in decimal is 8 + 2, which corresponds to 2^3 (8) and 2^1 (2). In 4-bit binary, this is 1010.",
      },
    },
    {
      slug: "bitwise-and-or-xor-not",
      title: "3. Bitwise AND, OR, XOR, NOT",
      tagline: "The four fundamental logical bitwise operators.",
      theory:
        "The core logical bitwise operations evaluate bit pairs at each position:\n\n1. **AND (`&`)**: Output is 1 only if *both* input bits are 1. Good for clearing/masking bits.\n2. **OR (`|`)**: Output is 1 if *either* input bit is 1. Good for setting bits.\n3. **XOR (`^`)**: Output is 1 if inputs are *different*. Self-inverse (A^A = 0).\n4. **NOT (`~`)**: Inverts all bits. Note that in signed integers, ~x equals -(x + 1) due to Two's Complement.",
      bullets: [
        "AND (&): 1 & 1 = 1; else 0.",
        "OR (|): 0 | 0 = 0; else 1.",
        "XOR (^): 1 ^ 0 = 1; 1 ^ 1 = 0; 0 ^ 0 = 0.",
        "NOT (~): ~x = -(x + 1).",
      ],
      code: `# Demonstration of fundamental operators
def demonstrate_logical_operators(a, b):
    print(f"AND: {a} & {b} = {a & b}")
    print(f"OR:  {a} | {b} = {a | b}")
    print(f"XOR: {a} ^ {b} = {a ^ b}")
    print(f"NOT: ~{a} = {~a}")`,
      quiz: {
        q: "What is the result of 5 ^ 5 in bitwise operations?",
        choices: ["10", "5", "0", "1"],
        answer: 2,
        explain: "Any number XORed with itself is 0, since all matching bits are equal and thus evaluate to 0.",
      },
    },
    {
      slug: "left-shift-and-right-shift",
      title: "4. Left Shift and Right Shift",
      tagline: "Multiplying and dividing by powers of two in a single cycle.",
      theory:
        "Shifting slides all bits in a binary number left or right by a specified number of positions.\n\n1. **Left Shift (`<<`)**: Moves bits to the left, filling empty right spaces with 0. Shifting left by `k` is equivalent to multiplying by `2^k`.\n2. **Right Shift (`>>`)**: Moves bits to the right. For unsigned numbers, shifts in 0 on the left. For signed numbers, it performs an arithmetic shift (shifts in the sign bit to preserve positivity/negativity). Shifting right by `k` is equivalent to integer division by `2^k`.",
      bullets: [
        "x << k: shifts bits left, equivalent to x * (2^k).",
        "x >> k: shifts bits right, equivalent to x // (2^k).",
        "Extremely fast replacement for multiplication and division.",
      ],
      code: `# Fast multiplication and division by powers of 2
def scale_by_power_of_two(num, power, scale_up=True):
    if scale_up:
        return num << power  # num * (2^power)
    else:
        return num >> power  # num // (2^power)`,
      quiz: {
        q: "What is the decimal result of the operation 6 >> 1?",
        choices: ["12", "3", "2", "0"],
        answer: 1,
        explain: "Shifting 6 (binary 110) right by 1 position drops the LSB, resulting in binary 11, which is 3 (equivalent to 6 // 2).",
      },
    },
    {
      slug: "get-set-clear-toggle-bits",
      title: "5. Setting, Clearing, Toggling & Checking Bits",
      tagline: "Essential bit manipulation primitives using bit masks.",
      theory:
        "To modify a specific bit index `i` (0-indexed from right), we create a bit mask: `(1 << i)`. This creates a binary number with a single 1 at index `i` and 0s elsewhere. We then apply logical operators:\n\n- **Check Bit**: `(n & (1 << i)) != 0`. Evaluates if bit is 1.\n- **Set Bit**: `n | (1 << i)`. Forces bit `i` to become 1.\n- **Clear Bit**: `n & ~(1 << i)`. Forces bit `i` to become 0 by ANDing with a mask containing a 0 only at index `i`.\n- **Toggle Bit**: `n ^ (1 << i)`. Flips bit `i` (0 -> 1, 1 -> 0).",
      bullets: [
        "Check: `n & (1 << i)`.",
        "Set:   `n | (1 << i)`.",
        "Clear: `n & ~(1 << i)`.",
        "Toggle: `n ^ (1 << i)`.",
      ],
      code: `class BitManipulator:
    @staticmethod
    def check_bit(n, i):
        return (n & (1 << i)) != 0
        
    @staticmethod
    def set_bit(n, i):
        return n | (1 << i)
        
    @staticmethod
    def clear_bit(n, i):
        return n & ~(1 << i)
        
    @staticmethod
    def toggle_bit(n, i):
        return n ^ (1 << i)`,
      quiz: {
        q: "Which operation will turn off (set to 0) the bit at index i in number n?",
        choices: [
          "`n | (1 << i)`",
          "`n & ~(1 << i)`",
          "`n ^ (1 << i)`",
          "`n & (1 << i)`",
        ],
        answer: 1,
        explain: "`~(1 << i)` creates a mask of all 1s except a 0 at index `i`. ANDing `n` with this mask clears bit `i` to 0.",
      },
    },
    {
      slug: "popcount-brian-kernighan",
      title: "6. Counting Set Bits (Brian Kernighan Algorithm)",
      tagline: "Optimizing bit counting to run in O(set_bits) time.",
      theory:
        "Counting set bits (often called Hamming weight or popcount) is a common operation. The naive approach checks all 32 bits, running in O(32) constant time.\n\n**Brian Kernighan's Algorithm** is an optimization. The key observation is that `n & (n - 1)` clears the lowest set bit in `n`. By looping and repeatedly performing `n = n & (n - 1)`, we clear one set bit per iteration. The loop runs exactly as many times as there are set bits, achieving O(K) complexity where K is the number of 1-bits.",
      bullets: [
        "x & (x - 1) turns off the lowest set bit of x.",
        "Brian Kernighan's algorithm runs in O(set_bits) iterations.",
        "Highly efficient for sparse bit arrays.",
      ],
      code: `def count_set_bits(n):
    count = 0
    while n > 0:
        n = n & (n - 1)  # Clear the lowest set bit
        count += 1
    return count`,
      quiz: {
        q: "If a number has binary representation 10001000, how many iterations will Brian Kernighan's algorithm take?",
        choices: ["8", "4", "2", "32"],
        answer: 2,
        explain: "The algorithm runs once for each set bit (1). Since there are 2 set bits, it takes exactly 2 iterations.",
      },
    },
    {
      slug: "power-of-two-and-four",
      title: "7. Power of Two & Power of Four",
      tagline: "Checking exponents of 2 and 4 in O(1) time without loops.",
      theory:
        "Bitwise operations allow check conditions on powers of 2 and 4 in O(1) time:\n\n1. **Power of Two**: A positive number is a power of 2 if it contains exactly *one* set bit. Since `n & (n - 1)` clears the lowest set bit, if `n > 0` and `n & (n - 1) == 0`, then `n` has exactly one set bit and is a power of two.\n2. **Power of Four**: A number is a power of 4 if it is a power of two and its single set bit resides at an *even* index (0, 2, 4, etc.). We verify this by checking that no set bits exist in odd positions using the hex mask `0x55555555` (binary `01010101...`).",
      bullets: [
        "Power of 2 check: `n > 0 and (n & (n - 1)) == 0`.",
        "Power of 4 check: Power of 2 check and `(n & 0x55555555) != 0`.",
        "Eliminates loops or logarithmic library calls.",
      ],
      code: `def is_power_of_two(n):
    return n > 0 and (n & (n - 1)) == 0

def is_power_of_four(n):
    # 0x55555555 is a mask with 1s at all even bit positions (0, 2, 4...)
    return is_power_of_two(n) and (n & 0x55555555) != 0`,
      quiz: {
        q: "What does the mask 0x55555555 check in power of four verification?",
        choices: [
          "Whether the number is prime.",
          "Whether the single set bit is at an even position.",
          "Whether the number is negative.",
          "Whether the number is odd.",
        ],
        answer: 1,
        explain: "0x55555555 in binary has 1s at positions 0, 2, 4, 6... (even indices). ANDing with it ensures the single set bit is at one of these positions.",
      },
    },
    {
      slug: "bit-masks",
      title: "8. Bit Masks",
      tagline: "Representing states and configurations inside single integers.",
      theory:
        "A **Bitmask** is a sequence of bits used to track a configuration state. For example, in a game with 8 items, we can represent an inventory using a single 8-bit integer (each bit index is a boolean indicating if we own the item).\n\nBitmasks allow performing set-like union, intersection, and difference operations using simple logical bitwise functions, saving massive memory and speeding up execution.",
      bullets: [
        "Represent boolean configurations or sets of size N as integers in range [0, 2^N - 1].",
        "Set Union: `mask_A | mask_B`.",
        "Set Intersection: `mask_A & mask_B`.",
        "Set Difference: `mask_A & ~mask_B`.",
      ],
      code: `# Bitmask set representation
def add_to_set(mask, element_id):
    return mask | (1 << element_id)

def remove_from_set(mask, element_id):
    return mask & ~(1 << element_id)

def in_set(mask, element_id):
    return (mask & (1 << element_id)) != 0`,
      quiz: {
        q: "What bitwise operator represents the intersection of two sets (masks)?",
        choices: ["OR (|)", "XOR (^)", "AND (&)", "NOT (~)"],
        answer: 2,
        explain: "AND (&) returns 1 only where both masks have a 1, matching the definition of set intersection.",
      },
    },
    {
      slug: "bit-manipulation-tricks",
      title: "9. Bit Manipulation Tricks",
      tagline: "Clever math hacks and bit-twiddling shortcuts.",
      theory:
        "Over decades, programmers compiled 'bit hacks' to speed up simple operations:\n\n- **Check odd/even**: `n & 1`. Returns 1 if odd, 0 if even.\n- **Lowest set bit**: `n & -n`. Isolates the lowest set bit (e.g. 12 (1100) -> 4 (0100)).\n- **Swap numbers**: `a ^= b; b ^= a; a ^= b;` swaps variables `a` and `b` without a temp variable.\n- **Clear trailing 1s**: `n & (n + 1)` clears trailing 1s (e.g. 7 (0111) -> 8 (1000) wait, no: 7 & 8 = 0. It clears trailing 1s from right to left).",
      bullets: [
        "Odd/Even check: `n & 1`.",
        "Isolate rightmost set bit: `n & -n`.",
        "Inplace swap: `a ^= b; b ^= a; a ^= b`.",
      ],
      code: `# Swap two variables without temporary storage
def swap_in_place(a, b):
    a = a ^ b
    b = a ^ b  # b is now original a
    a = a ^ b  # a is now original b
    return a, b`,
      quiz: {
        q: "What is the result of 'n & 1' for any even integer n?",
        choices: ["1", "0", "-1", "n"],
        answer: 1,
        explain: "Even numbers in binary always have an LSB of 0. ANDing an even number with 1 (which has only the LSB set to 1) results in 0.",
      },
    },
    {
      slug: "subset-generation-bitmasks",
      title: "10. Subset Generation Using Bit Masks",
      tagline: "Generating all 2^N subsets of a set using integers.",
      theory:
        "A set of size N has `2^N` subsets. We can map these subsets to integers from `0` to `2^N - 1`.\n\nFor a set `[A, B, C]`, we count from 0 to 7. The binary representation of each number tells us which elements to include. For example, 5 in binary is `101`, which maps to the subset `[A, C]` (including elements at indices 0 and 2). This allows us to generate all subsets using a simple loop rather than complex backtracking recursion.",
      bullets: [
        "Total subsets of size N is 2^N (range 0 to (1 << N) - 1).",
        "Bit index `i` of mask determines if element `i` is included.",
        "Runs in O(N * 2^N) time.",
      ],
      code: `def generate_subsets(elements):
    N = len(elements)
    subsets = []
    # Loop from 0 to 2^N - 1
    for mask in range(1 << N):
        current_subset = []
        for i in range(N):
            if (mask & (1 << i)) != 0:
                current_subset.append(elements[i])
        subsets.append(current_subset)
    return subsets`,
      quiz: {
        q: "How many subsets will be generated for a set of size 4?",
        choices: ["8", "16", "32", "4"],
        answer: 1,
        explain: "A set of size N has 2^N subsets. For N=4, 2^4 = 16 subsets.",
      },
    },
    {
      slug: "xor-applications",
      title: "11. XOR Applications",
      tagline: "Mastering XOR's unique properties to solve puzzles.",
      theory:
        "Bitwise XOR (`^`) is a powerful operation with key properties:\n1. **Identity**: `A ^ 0 = A`\n2. **Self-inverse**: `A ^ A = 0`\n3. **Commutativity/Associativity**: Order of XOR does not matter.\n\nThese properties enable solving complex puzzles. For example, in an array where every element appears twice except one, XORing all elements together cancels out the duplicates (`X ^ X = 0`), leaving the single unique number in O(N) time and O(1) space.",
      bullets: [
        "Duplicates cancel out under XOR: `X ^ X = 0`.",
        "XOR is associative: order of inputs doesn't change result.",
        "Solves Single Number and Missing Number puzzles optimally.",
      ],
      code: `def find_single_number(nums):
    unique = 0
    for num in nums:
        unique ^= num  # Duplicates cancel, unique remains
    return unique`,
      quiz: {
        q: "What is the value of 3 ^ 7 ^ 3?",
        choices: ["3", "7", "0", "13"],
        answer: 1,
        explain: "By commutativity, 3 ^ 7 ^ 3 is equivalent to 3 ^ 3 ^ 7. Since 3 ^ 3 = 0, the expression simplifies to 0 ^ 7 = 7.",
      },
    },
    {
      slug: "competitive-programming",
      title: "12. Bit Manipulation in Competitive Programming",
      tagline: "Speeding up states and DP transitions.",
      theory:
        "In competitive programming, bitwise operations are used for speed optimizations and state compaction. \n\nInstead of representing states (like visited nodes in TSP) as arrays or tuples, we encode them as integers (bitmasks). This allows for O(1) state transitions and fits states directly in memory lookup arrays. For example, in Traveling Salesperson Problem, `dp[mask][u]` stores the shortest path visiting subset of nodes `mask` ending at node `u`.",
      bullets: [
        "Encode visit lists or sets as integers to use as array keys.",
        "Speeds up transitions: checking states is a simple bitwise instruction.",
        "Crucial for Bitmask DP and state compression.",
      ],
      quiz: {
        q: "What is a main benefit of Bitmask DP in competitive programming?",
        choices: [
          "It eliminates the need for recursion.",
          "It allows representing subset states as array indices for fast O(1) lookups.",
          "It works for huge datasets (N > 100).",
          "It automatically prints the answer.",
        ],
        answer: 1,
        explain: "Bitmask DP maps subsets to integer array indices, allowing fast state checks and transitions during dynamic programming runs.",
      },
    },
    {
      slug: "common-mistakes",
      title: "13. Common Mistakes",
      tagline: "Precedence bugs, signed overflows, and logic traps.",
      theory:
        "Bitwise operations are prone to specific bugs:\n\n1. **Operator Precedence**: Bitwise operators (`&`, `|`, `^`) have a lower precedence than comparison operators (`==`, `!=`). Therefore, `if (n & 1 == 0)` is evaluated as `if (n & (1 == 0))`! Always use parentheses: `if (n & 1) == 0`.\n2. **Integer Overflow**: Shifting `1 << 35` in 32-bit integer limits will cause overflow or undefined behavior. In languages like C/C++, use `1LL << 35`.\n3. **Negative Right Shifts**: Right shifting negative integers behaves differently depending on signed sign extension. In Python, `>>` is arithmetic (retains sign).",
      bullets: [
        "Always use parentheses around bitwise operations: `(a & b) == c`.",
        "Watch for 32-bit overflows on large shifts.",
        "Understand your language's treatment of signed arithmetic shifts.",
      ],
      quiz: {
        q: "How does the compiler evaluate the expression: n & 1 == 0?",
        choices: [
          "Checks if n is even.",
          "Evaluates (1 == 0) first, then ANDs with n.",
          "Evaluates (n & 1) first, then compares with 0.",
          "It results in a compiler syntax error.",
        ],
        answer: 1,
        explain: "Because comparison `==` has higher precedence than bitwise AND `&`, the compiler evaluates `1 == 0` (False/0) first, yielding `n & 0` instead of checking if `n` is even.",
      },
    },
    {
      slug: "interview-questions",
      title: "14. Interview Questions",
      tagline: "Solving high-frequency bitwise interview problems.",
      theory:
        "Bit manipulation is a popular coding interview category because it tests low-level knowledge. Key questions include:\n- **Number of 1 Bits (LC 191)**: Solved with Brian Kernighan popcount.\n- **Single Number (LC 136)**: Solved using XOR accumulator.\n- **Reverse Bits (LC 190)**: Reversing a 32-bit unsigned integer using masks and shifts.\n- **Counting Bits (LC 338)**: Generating set bits count for all numbers from 0 to N using DP: `dp[i] = dp[i >> 1] + (i & 1)`.",
      bullets: [
        "Single Number: accumulate XOR across array.",
        "Counting Bits DP relation: `count[i] = count[i >> 1] + (i & 1)`.",
        "Reverse bits by sliding and ORing bits.",
      ],
      practice: [
        {
          title: "Number of 1 Bits (LC 191)",
          url: "https://leetcode.com/problems/number-of-1-bits/",
          difficulty: "Easy",
        },
        {
          title: "Single Number (LC 136)",
          url: "https://leetcode.com/problems/single-number/",
          difficulty: "Easy",
        },
        {
          title: "Counting Bits (LC 338)",
          url: "https://leetcode.com/problems/counting-bits/",
          difficulty: "Easy",
        },
      ],
      quiz: {
        q: "What is the optimal recurrence relation to count set bits for numbers 0 to N using DP?",
        choices: [
          "`dp[i] = dp[i - 1] + 1`",
          "`dp[i] = dp[i // 2] + (i % 2)`",
          "`dp[i] = dp[i - 2] + 2`",
          "`dp[i] = dp[i >> 1] + (i & 1)`",
        ],
        answer: 3,
        explain: "`i >> 1` removes the LSB (already computed in DP), and `i & 1` gets the LSB. Adding them gives the total bits for `i` in O(1) time.",
      },
    },
    {
      slug: "advanced-bit-tricks",
      title: "15. Advanced Bit Tricks",
      tagline: "Gray Code, bit swaps, and parallel computations.",
      theory:
        "Advanced bitwise algorithms solve complex operations without loops:\n\n- **Gray Code**: A binary numeral system where two successive values differ in only one bit. Formula: `G(n) = n ^ (n >> 1)`.\n- **Swap Odd and Even Bits**: Given an integer x, swap its odd bits with its even bits. We can isolate even bits using mask `0xAAAAAAAA` and shift right, isolate odd bits using mask `0x55555555` and shift left, and OR them: `((x & 0xAAAAAAAA) >> 1) | ((x & 0x55555555) << 1)`.",
      bullets: [
        "Gray Code formula: `n ^ (n >> 1)`.",
        "Swap odd/even bits using alternating hexadecimal masks.",
        "Parallel prefix sums using shifts to reverse bit arrays.",
      ],
      code: `# Swap odd and even bits of a 32-bit integer
def swap_odd_even_bits(x):
    # 0xAAAAAAAA isolates even bits (101010...)
    # 0x55555555 isolates odd bits (010101...)
    even_bits = x & 0xAAAAAAAA
    odd_bits = x & 0x55555555
    return (even_bits >> 1) | (odd_bits << 1)`,
      quiz: {
        q: "What is successive difference in Gray Code values?",
        choices: [
          "They differ by exactly 2 bits.",
          "They differ by exactly 1 bit position.",
          "They have different signs.",
          "They are odd numbers.",
        ],
        answer: 1,
        explain: "Gray Code is defined as a sequence of numbers where adjacent entries differ in only a single bit position, preventing multi-bit transitions in electronics.",
      },
    },
    {
      slug: "summary-revision",
      title: "16. Summary & Revision",
      tagline: "Operator truth tables and basic tricks cheat sheet.",
      theory:
        "Let's review the fundamental bitwise operators and truth tables:\n\n| A | B | A & B (AND) | A \\| B (OR) | A ^ B (XOR) |\n|---|---|---|---|---|\n| 0 | 0 | 0 | 0 | 0 |\n| 0 | 1 | 0 | 1 | 1 |\n| 1 | 0 | 0 | 1 | 1 |\n| 1 | 1 | 1 | 1 | 0 |\n\n### Essential Bit Tricks Cheat Sheet:\n* **Get bit `i`**: `(n >> i) & 1`\n* **Set bit `i`**: `n | (1 << i)`\n* **Clear bit `i`**: `n & ~(1 << i)`\n* **Toggle bit `i`**: `n ^ (1 << i)`\n* **Clear rightmost set bit**: `n & (n - 1)`\n* **Isolate rightmost set bit**: `n & -n`\n* **Check if even**: `(n & 1) == 0`\n* **Check if power of 2**: `n > 0 and (n & (n - 1)) == 0`\n\nIn the next module, we review Bit Manipulation practice problems and cheatsheets.",
      bullets: [
        "AND (&) clears bits; OR (|) sets bits; XOR (^) toggles bits.",
        "Negatives are stored in Two's Complement (~x + 1).",
        "Parentheses are mandatory due to low operator precedence.",
      ],
      quiz: {
        q: "Which expression isolates the lowest set bit in an integer n?",
        choices: ["`n & (n - 1)`", "`n & -n`", "`n | -n`", "`~n`"],
        answer: 1,
        explain: "`n & -n` isolates the rightmost set bit (leaves it as 1 and clears all other bits to 0) due to how Two's Complement negative representation aligns bits.",
      },
    },
    {
      slug: "practice-cheatsheet",
      title: "17. Practice & Cheat Sheet",
      tagline: "Curated practice problem links and revision hacks.",
      theory:
        "Here is a revision list of high-value LeetCode practice problems to test your bitwise manipulation skills:\n\n### Curated Practice Problems:\n1. **Single Number (LC 136)** — accumulate XOR values.\n2. **Missing Number (LC 268)** — XOR indices and values.\n3. **Counting Bits (LC 338)** — linear DP logic.\n4. **Number of 1 Bits (LC 191)** — Kernighan popcount.\n5. **Reverse Bits (LC 190)** — loop shifts.\n6. **Power of Two (LC 231)** — `n & (n - 1) == 0` check.\n7. **Power of Four (LC 342)** — even parity mask check.\n8. **Subsets (LC 78)** — mask counting subset generator.\n\nKeep this cheat sheet handy for technical interviews. Congratulations on completing the Bit Manipulation curriculum!",
      bullets: [
        "Practice is essential to recognize XOR cancelation patterns.",
        "XOR properties (self-inverse, commutativity) appear frequently in search optimization questions.",
      ],
      practice: [
        {
          title: "Power of Two (LC 231)",
          url: "https://leetcode.com/problems/power-of-two/",
          difficulty: "Easy",
        },
        {
          title: "Subsets (LC 78)",
          url: "https://leetcode.com/problems/subsets/",
          difficulty: "Medium",
        },
        {
          title: "Reverse Bits (LC 190)",
          url: "https://leetcode.com/problems/reverse-bits/",
          difficulty: "Easy",
        },
      ],
      references: [
        {
          label: "Stanford Bit Twiddling Hacks",
          url: "https://graphics.stanford.edu/~seander/bithacks.html",
        },
      ],
    },
  ],
};
