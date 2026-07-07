import type { ModuleBank } from "../types";

export const stacksBank: ModuleBank = {
  moduleSlug: "stacks",
  moduleTitle: "Stacks",
  edgeCases: [
    { case: "Underflow (pop from empty)", why: "Always check `if stack:` before popping." },
    { case: "Overflow (bounded stack)", why: "Only relevant for fixed-size implementations." },
    { case: "Peek when empty", why: "Return None or raise; document the choice." },
    { case: "Single element", why: "Min-stack must still return that element as min." },
  ],
  revisionSheet: {
    timeComplexity: [
      { op: "push / pop / peek", time: "O(1)" },
      { op: "search", time: "O(n)" },
    ],
    commonMistakes: [
      "Using list.pop(0) — that's O(n). Use pop() (top).",
      "Forgetting to reverse the stack when returning results in order",
    ],
    memoryTricks: [
      "Monotonic stack for 'next greater / smaller' problems",
      "Two stacks — one for values, one for auxiliary state (min-stack)",
    ],
    mustSolve: ["q-stk-valid-paren", "q-stk-min-stack", "q-stk-daily-temp"],
  },
  questions: [
    {
      id: "q-stk-theory",
      moduleSlug: "stacks",
      title: "Explain LIFO and give three real-world examples",
      category: "theory",
      difficulty: "Beginner",
      topic: "Fundamentals",
      description: "Describe Last-In-First-Out ordering and where the OS or a browser uses it.",
      hints: ["Function call stack, undo history, browser back button."],
      estimatedMinutes: 5,
      tags: ["theory"],
    },
    {
      id: "q-stk-impl",
      moduleSlug: "stacks",
      title: "Implement a stack from scratch",
      category: "implementation",
      difficulty: "Beginner",
      topic: "Implementation",
      description: "Build a Stack class with push, pop, peek, isEmpty, size — all O(1).",
      pythonSolution:
        "class Stack:\n    def __init__(self): self._data = []\n    def push(self, x): self._data.append(x)\n    def pop(self):\n        if not self._data: raise IndexError('pop from empty stack')\n        return self._data.pop()\n    def peek(self): return self._data[-1] if self._data else None\n    def is_empty(self): return not self._data\n    def __len__(self): return len(self._data)",
      estimatedMinutes: 10,
      tags: ["implementation"],
    },
    {
      id: "q-stk-valid-paren",
      moduleSlug: "stacks",
      title: "Valid Parentheses",
      category: "intermediate",
      difficulty: "Interview",
      topic: "Matching",
      description: "Given a string of '()[]{}', decide whether it's balanced.",
      hints: ["Push opens, pop and compare on closes."],
      approaches: [
        {
          name: "Optimal",
          code: "pairs = {')':'(', ']':'[', '}':'{'}\nstack = []\nfor c in s:\n    if c in '([{': stack.append(c)\n    elif not stack or stack.pop() != pairs[c]: return False\nreturn not stack",
          time: "O(n)",
          space: "O(n)",
        },
      ],
      estimatedMinutes: 10,
      pattern: "Stack Matching",
      interviewFrequency: "Very High",
      companies: ["Amazon", "Google", "Meta"],
      leetcodeLinks: [
        {
          title: "20. Valid Parentheses",
          url: "https://leetcode.com/problems/valid-parentheses/",
          difficulty: "Easy",
        },
      ],
      tags: ["must-do"],
    },
    {
      id: "q-stk-min-stack",
      moduleSlug: "stacks",
      title: "Min Stack (O(1) getMin)",
      category: "advanced",
      difficulty: "Interview",
      topic: "Design",
      description: "Design a stack that supports push, pop, top, and retrieve the minimum in O(1).",
      hints: ["Store (value, current_min) pairs, or use a second stack of running minimums."],
      approaches: [
        {
          name: "Optimal",
          code: "class MinStack:\n    def __init__(self): self.s = []\n    def push(self, x):\n        m = x if not self.s else min(x, self.s[-1][1])\n        self.s.append((x, m))\n    def pop(self): self.s.pop()\n    def top(self): return self.s[-1][0]\n    def getMin(self): return self.s[-1][1]",
          time: "O(1) per op",
          space: "O(n)",
        },
      ],
      estimatedMinutes: 20,
      pattern: "Auxiliary Stack",
      interviewFrequency: "Very High",
      leetcodeLinks: [
        {
          title: "155. Min Stack",
          url: "https://leetcode.com/problems/min-stack/",
          difficulty: "Medium",
        },
      ],
      tags: ["design", "must-do"],
    },
    {
      id: "q-stk-daily-temp",
      moduleSlug: "stacks",
      title: "Daily Temperatures (Monotonic Stack)",
      category: "advanced",
      difficulty: "Interview",
      topic: "Monotonic Stack",
      description: "For each day, how many days until a warmer temperature?",
      approaches: [
        {
          name: "Optimal",
          code: "res = [0]*len(t); st = []\nfor i, x in enumerate(t):\n    while st and t[st[-1]] < x:\n        j = st.pop(); res[j] = i - j\n    st.append(i)\nreturn res",
          time: "O(n)",
          space: "O(n)",
        },
      ],
      estimatedMinutes: 20,
      pattern: "Monotonic Stack",
      relatedAlgorithm: "monotonic-stack",
      interviewFrequency: "Very High",
      leetcodeLinks: [
        {
          title: "739. Daily Temperatures",
          url: "https://leetcode.com/problems/daily-temperatures/",
          difficulty: "Medium",
        },
      ],
      tags: ["monotonic-stack", "must-do"],
    },
    {
      id: "q-stk-queue-from-stack",
      moduleSlug: "stacks",
      title: "Implement Queue using two Stacks",
      category: "intermediate",
      difficulty: "Interview",
      topic: "Design",
      description: "Support enqueue/dequeue in amortized O(1) using only stacks.",
      pythonSolution:
        "class Queue:\n    def __init__(self): self.inb, self.outb = [], []\n    def enqueue(self, x): self.inb.append(x)\n    def dequeue(self):\n        if not self.outb:\n            while self.inb: self.outb.append(self.inb.pop())\n        return self.outb.pop()",
      estimatedMinutes: 15,
      pattern: "Two Stacks",
      leetcodeLinks: [
        {
          title: "232. Implement Queue using Stacks",
          url: "https://leetcode.com/problems/implement-queue-using-stacks/",
          difficulty: "Easy",
        },
      ],
      tags: ["design"],
    },
  ],
};
