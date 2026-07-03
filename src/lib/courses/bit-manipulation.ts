import type { Course } from "./types";

export const bitManipulationCourse: Course = {
  slug: "bit-manipulation",
  title: "Bit Manipulation",
  tagline: "Tricks with AND, OR, XOR, and shifts.",
  category: "algorithm",
  order: 20,
  icon: "Binary",
  lessons: [
    {
      slug: "introduction",
      title: "Introduction",
      theory: "Bitwise operations act on the binary representation of integers. They're fast, memory-efficient, and unlock elegant solutions to many interview problems.",
    },
    {
      slug: "operators",
      title: "Operators",
      code: `a & b       # AND\na | b       # OR\na ^ b       # XOR\n~a          # NOT\na << 1      # left shift  (×2)\na >> 1      # right shift (÷2)`,
    },
    {
      slug: "common-tricks",
      title: "Common Tricks",
      bullets: [
        "Check bit i: `n & (1 << i)`.",
        "Set bit i:  `n | (1 << i)`.",
        "Clear bit i: `n & ~(1 << i)`.",
        "Toggle bit i: `n ^ (1 << i)`.",
        "Lowest set bit: `n & -n`.",
        "Turn off lowest set bit: `n & (n - 1)`.",
        "Test power of two: `n > 0 and n & (n - 1) == 0`.",
      ],
    },
    {
      slug: "xor-patterns",
      title: "XOR Patterns",
      theory: "XOR is its own inverse: a ^ a = 0 and a ^ 0 = a. Powers 'find the unique element' and 'swap without temp'.",
      code: `def single_number(nums):\n    x = 0\n    for n in nums: x ^= n\n    return x`,
    },
    {
      slug: "count-bits",
      title: "Counting Set Bits",
      code: `def popcount(n):\n    c = 0\n    while n:\n        n &= n - 1; c += 1\n    return c\n# or: bin(n).count('1'), or n.bit_count() in Python 3.10+`,
    },
    {
      slug: "bitmask-dp",
      title: "Bitmask DP",
      theory: "Encode subsets as integers to represent state compactly — enables O(2ⁿ · n) DPs for TSP, assignment, and set cover.",
    },
    {
      slug: "applications",
      title: "Applications",
      bullets: [
        "Bloom filters and probabilistic sets.",
        "Compact permissions and feature flags.",
        "Hash function mixing.",
        "Fast enumeration of subsets.",
        "Cryptography primitives.",
      ],
    },
    {
      slug: "practice",
      title: "Practice",
      practice: [
        { title: "LC 136 · Single Number", url: "https://leetcode.com/problems/single-number/", difficulty: "Easy" },
        { title: "LC 191 · Number of 1 Bits", url: "https://leetcode.com/problems/number-of-1-bits/", difficulty: "Easy" },
        { title: "LC 78 · Subsets (bitmask)", url: "https://leetcode.com/problems/subsets/", difficulty: "Medium" },
        { title: "LC 268 · Missing Number", url: "https://leetcode.com/problems/missing-number/", difficulty: "Easy" },
      ],
    },
    {
      slug: "quiz",
      title: "Quiz",
      quiz: {
        q: "What does `n & (n - 1)` do?",
        choices: ["Sets the lowest bit", "Turns off the lowest set bit", "Reverses bits", "Doubles n"],
        answer: 1,
        explain: "Great for popcount and testing powers of two.",
      },
    },
    { slug: "references", title: "References", references: [{ label: "Bit Twiddling Hacks", url: "https://graphics.stanford.edu/~seander/bithacks.html" }] },
  ],
};
