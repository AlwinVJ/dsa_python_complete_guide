import type { StackLesson } from "./types";

/** Algorithms & Applications tier — problems solved using stacks. */
export const STACK_APPLICATIONS: StackLesson[] = [
  // ---------------- Applications ----------------
  {
    slug: "undo-redo",
    title: "Application · Undo / Redo",
    eyebrow: "Applications · 1",
    description:
      "Two stacks — one for actions, one for undone actions — power every editor's undo history.",
    difficulty: "Beginner",
    readMinutes: 5,
    sections: [
      {
        type: "theory",
        text: "Every action the user takes is pushed onto an `undo` stack. Ctrl+Z pops from undo and pushes onto `redo`. Ctrl+Y does the reverse. A new action clears the redo stack — you can't 'redo' after diverging.",
      },
      {
        type: "code",
        code: `class History:
    def __init__(self):
        self.undo, self.redo = [], []
    def do(self, action):
        self.undo.append(action)
        self.redo.clear()
    def undo_last(self):
        if not self.undo: return None
        a = self.undo.pop(); self.redo.append(a); return a
    def redo_last(self):
        if not self.redo: return None
        a = self.redo.pop(); self.undo.append(a); return a`,
      },
      { type: "playground", initial: ["type A", "type B", "type C"] },
    ],
  },
  {
    slug: "browser-history",
    title: "Application · Browser History",
    eyebrow: "Applications · 2",
    description: "Same pattern — two stacks driving Back and Forward buttons.",
    difficulty: "Beginner",
    readMinutes: 3,
    sections: [
      {
        type: "theory",
        text: "Navigating to a new URL pushes onto the `back` stack and clears `forward`. Back pops from `back` and pushes onto `forward`. Forward does the mirror.",
      },
    ],
  },
  {
    slug: "function-call-stack",
    title: "Application · The Function Call Stack",
    eyebrow: "Applications · 3",
    description: "Every function call in every language pushes a frame; every return pops one.",
    difficulty: "Beginner",
    readMinutes: 4,
    sections: [
      {
        type: "theory",
        text: "A stack frame holds the function's local variables and the return address. When main() calls foo(), the CPU pushes foo's frame. When foo returns, the frame is popped and execution jumps to the return address.",
      },
      {
        type: "callout",
        kind: "warn",
        title: "RecursionError",
        text: "Python caps the call stack at 1000 frames by default. Deep recursion (e.g. huge DFS) exceeds this — rewrite iteratively with an explicit stack.",
      },
    ],
  },
  {
    slug: "expression-evaluation",
    title: "Application · Expression Evaluation",
    eyebrow: "Applications · 4",
    description:
      "Convert infix to postfix (Shunting-yard) and evaluate postfix — both are stack-driven.",
    difficulty: "Intermediate",
    readMinutes: 6,
    sections: [
      {
        type: "code",
        title: "evaluate postfix (RPN)",
        code: `def eval_postfix(tokens):
    st = []
    for t in tokens:
        if t in "+-*/":
            b, a = st.pop(), st.pop()
            st.append(int(eval(f"{a}{t}{b}")))
        else:
            st.append(int(t))
    return st[0]

eval_postfix("2 3 + 4 *".split())   # (2+3)*4 = 20`,
      },
      { type: "complexity", rows: [{ op: "eval_postfix", time: "O(n)", space: "O(n)" }] },
    ],
  },
  {
    slug: "parentheses-matching",
    title: "Application · Parentheses Matching",
    eyebrow: "Applications · 5",
    description: "The canonical stack problem — decide if a bracket string is balanced.",
    difficulty: "Beginner",
    readMinutes: 4,
    sections: [
      {
        type: "code",
        code: `def valid(s):
    pairs = {')':'(', ']':'[', '}':'{'}
    st = []
    for c in s:
        if c in "([{":
            st.append(c)
        elif not st or st.pop() != pairs[c]:
            return False
    return not st`,
      },
      {
        type: "dryRun",
        headers: ["char", "stack", "action"],
        rows: [
          ["(", "[(]", "push"],
          ["[", "[(, []", "push"],
          ["]", "[(]", "pop matches"],
          [")", "[]", "pop matches"],
          ["end", "[]", "empty → valid"],
        ],
      },
    ],
  },
  {
    slug: "backtracking",
    title: "Application · Backtracking",
    eyebrow: "Applications · 6",
    description:
      "Sudoku, N-queens, maze solvers — every backtracking algorithm is a stack of choices.",
    difficulty: "Intermediate",
    readMinutes: 4,
    sections: [
      {
        type: "theory",
        text: "Each recursive call pushes a partial choice onto the call stack; when it dead-ends, we return (pop) and try the next option. An explicit stack turns this into an iterative loop that never blows the recursion limit.",
      },
    ],
  },
  {
    slug: "dfs",
    title: "Application · Depth-First Search",
    eyebrow: "Applications · 7",
    description:
      "DFS explores as deep as possible before backtracking — a stack encodes exactly that discipline.",
    difficulty: "Intermediate",
    readMinutes: 5,
    sections: [
      {
        type: "code",
        title: "iterative DFS",
        code: `def dfs(graph, start):
    visited, stack = set(), [start]
    while stack:
        v = stack.pop()
        if v in visited: continue
        visited.add(v)
        for nxt in reversed(graph[v]):
            if nxt not in visited:
                stack.append(nxt)
    return visited`,
      },
      {
        type: "callout",
        kind: "did",
        title: "BFS vs DFS in code",
        text: "The only difference between iterative BFS and DFS is stack vs queue. Swap the container and the traversal changes discipline.",
      },
    ],
  },

  // ---------------- Algorithms ----------------
  {
    slug: "reverse-string",
    title: "Algorithm · Reverse a String",
    eyebrow: "Algorithms · 1",
    description: "The simplest possible use of a stack — push every character, then pop.",
    difficulty: "Beginner",
    readMinutes: 3,
    sections: [
      {
        type: "code",
        code: `def reverse(s):
    st = list(s)
    out = []
    while st:
        out.append(st.pop())
    return "".join(out)

reverse("stack")   # 'kcats'`,
      },
      { type: "complexity", rows: [{ op: "reverse", time: "O(n)", space: "O(n)" }] },
    ],
  },
  {
    slug: "reverse-stack",
    title: "Algorithm · Reverse a Stack using Recursion",
    eyebrow: "Algorithms · 2",
    description:
      "Reverse a stack in place using only recursion and push/pop — no auxiliary container.",
    difficulty: "Intermediate",
    readMinutes: 5,
    sections: [
      {
        type: "code",
        code: `def insert_bottom(st, x):
    if not st:
        st.append(x); return
    top = st.pop()
    insert_bottom(st, x)
    st.append(top)

def reverse_stack(st):
    if not st: return
    top = st.pop()
    reverse_stack(st)
    insert_bottom(st, top)`,
      },
      {
        type: "complexity",
        rows: [{ op: "reverse_stack", time: "O(n²)", space: "O(n) recursion" }],
      },
      {
        type: "callout",
        kind: "interview",
        title: "Classic follow-up",
        text: "'Sort a stack using only recursion' — same shape, replace insert_bottom with insert_sorted.",
      },
    ],
  },
  {
    slug: "sort-stack",
    title: "Algorithm · Sort a Stack",
    eyebrow: "Algorithms · 3",
    description: "Sort a stack using only one auxiliary stack — no arrays, no lists.",
    difficulty: "Intermediate",
    readMinutes: 5,
    sections: [
      {
        type: "code",
        code: `def sort_stack(st):
    aux = []
    while st:
        x = st.pop()
        while aux and aux[-1] > x:
            st.append(aux.pop())
        aux.append(x)
    while aux:
        st.append(aux.pop())`,
      },
      { type: "complexity", rows: [{ op: "sort_stack", time: "O(n²)", space: "O(n)" }] },
    ],
  },
  {
    slug: "palindrome",
    title: "Algorithm · Palindrome check using a Stack",
    eyebrow: "Algorithms · 4",
    description:
      "Push the first half, then compare with the second half — a linear-time palindrome test.",
    difficulty: "Beginner",
    readMinutes: 4,
    sections: [
      {
        type: "code",
        code: `def is_palindrome(s):
    st, n = [], len(s)
    for i in range(n // 2):
        st.append(s[i])
    for i in range((n + 1) // 2, n):
        if st.pop() != s[i]:
            return False
    return True`,
      },
      { type: "complexity", rows: [{ op: "is_palindrome", time: "O(n)", space: "O(n)" }] },
    ],
  },
  {
    slug: "valid-parentheses",
    title: "Algorithm · Valid Parentheses (LC #20)",
    eyebrow: "Algorithms · 5",
    description: "The definitive stack interview question — every FAANG asks it in some form.",
    difficulty: "Beginner",
    readMinutes: 4,
    sections: [
      {
        type: "code",
        code: `def is_valid(s):
    pairs = {')':'(', ']':'[', '}':'{'}
    st = []
    for c in s:
        if c in "([{":
            st.append(c)
        elif not st or st.pop() != pairs[c]:
            return False
    return not st`,
      },
      {
        type: "practice",
        groups: [
          {
            level: "Beginner",
            items: [
              {
                title: "LC 20 · Valid Parentheses",
                url: "https://leetcode.com/problems/valid-parentheses/",
                difficulty: "Easy",
                pattern: "Matching",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "min-stack",
    title: "Algorithm · Min Stack (O(1) getMin)",
    eyebrow: "Algorithms · 6",
    description: "Design a stack that supports push, pop, top, and retrieve the minimum in O(1).",
    difficulty: "Intermediate",
    readMinutes: 6,
    sections: [
      {
        type: "theory",
        text: "Store pairs (value, current_min) at each level, or use two parallel stacks: one for values and one for the running minimum.",
      },
      {
        type: "code",
        code: `class MinStack:
    def __init__(self): self.s = []
    def push(self, x):
        m = x if not self.s else min(x, self.s[-1][1])
        self.s.append((x, m))
    def pop(self):     self.s.pop()
    def top(self):     return self.s[-1][0]
    def getMin(self):  return self.s[-1][1]`,
      },
      {
        type: "callout",
        kind: "interview",
        title: "Also works for getMax",
        text: "Same trick — store (value, running_max). The pattern is called 'auxiliary stack'.",
      },
      {
        type: "practice",
        groups: [
          {
            level: "Intermediate",
            items: [
              {
                title: "LC 155 · Min Stack",
                url: "https://leetcode.com/problems/min-stack/",
                difficulty: "Medium",
                pattern: "Auxiliary Stack",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "delete-middle",
    title: "Algorithm · Delete Middle Element",
    eyebrow: "Algorithms · 7",
    description: "Remove the middle element using only recursion and push/pop.",
    difficulty: "Intermediate",
    readMinutes: 4,
    sections: [
      {
        type: "code",
        code: `def delete_middle(st, mid=None):
    if mid is None:
        mid = len(st) // 2
    def helper(k):
        if k == 0:
            st.pop(); return
        x = st.pop()
        helper(k - 1)
        st.append(x)
    helper(len(st) - 1 - mid)`,
      },
    ],
  },
  {
    slug: "stack-to-queue",
    title: "Algorithm · Implement a Queue using Stacks",
    eyebrow: "Algorithms · 8",
    description: "The mirror of implementations/queue — build a FIFO out of two LIFOs.",
    difficulty: "Intermediate",
    readMinutes: 5,
    sections: [
      {
        type: "code",
        code: `class Queue:
    def __init__(self):
        self.inb, self.outb = [], []
    def enqueue(self, x):
        self.inb.append(x)
    def dequeue(self):
        if not self.outb:
            while self.inb:
                self.outb.append(self.inb.pop())
        if not self.outb:
            raise IndexError("dequeue from empty")
        return self.outb.pop()`,
      },
      {
        type: "complexity",
        rows: [
          { op: "enqueue", time: "O(1)" },
          { op: "dequeue", time: "O(1) amortised" },
        ],
      },
      {
        type: "practice",
        groups: [
          {
            level: "Beginner",
            items: [
              {
                title: "LC 232 · Implement Queue using Stacks",
                url: "https://leetcode.com/problems/implement-queue-using-stacks/",
                difficulty: "Easy",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "reject-duplicates",
    title: "Algorithm · Reject Adjacent Duplicates",
    eyebrow: "Algorithms · 9",
    description:
      "Remove pairs of adjacent duplicate characters — a stack collapses them naturally.",
    difficulty: "Beginner",
    readMinutes: 4,
    sections: [
      {
        type: "code",
        code: `def remove_dupes(s):
    st = []
    for c in s:
        if st and st[-1] == c:
            st.pop()
        else:
            st.append(c)
    return "".join(st)

remove_dupes("abbaca")   # 'ca'`,
      },
      {
        type: "practice",
        groups: [
          {
            level: "Beginner",
            items: [
              {
                title: "LC 1047 · Remove All Adjacent Duplicates",
                url: "https://leetcode.com/problems/remove-all-adjacent-duplicates-in-string/",
                difficulty: "Easy",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "next-greater-element",
    title: "Algorithm · Next Greater Element",
    eyebrow: "Algorithms · 10",
    description:
      "For each item, find the first larger item on its right — the monotonic-stack pattern in its purest form.",
    difficulty: "Intermediate",
    readMinutes: 6,
    sections: [
      {
        type: "code",
        code: `def next_greater(a):
    res = [-1] * len(a)
    st = []                # stack of indices, values decreasing
    for i, x in enumerate(a):
        while st and a[st[-1]] < x:
            res[st.pop()] = x
        st.append(i)
    return res

next_greater([2, 1, 3, 4])   # [3, 3, 4, -1]`,
      },
      { type: "complexity", rows: [{ op: "next_greater", time: "O(n)", space: "O(n)" }] },
      {
        type: "practice",
        groups: [
          {
            level: "Intermediate",
            items: [
              {
                title: "LC 496 · Next Greater Element I",
                url: "https://leetcode.com/problems/next-greater-element-i/",
                difficulty: "Easy",
              },
              {
                title: "LC 739 · Daily Temperatures",
                url: "https://leetcode.com/problems/daily-temperatures/",
                difficulty: "Medium",
                pattern: "Monotonic Stack",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "monotonic-stack",
    title: "Algorithm · Monotonic Stack Pattern",
    eyebrow: "Algorithms · 11",
    description:
      "Keep the stack sorted as you scan. Answers 'next greater / smaller' problems in linear time.",
    difficulty: "Advanced",
    readMinutes: 6,
    sections: [
      {
        type: "theory",
        text: "A monotonic stack maintains its contents in strictly increasing or decreasing order. When a new element violates the order, pop until it fits. Each element is pushed and popped at most once — O(n) total.",
      },
      {
        type: "callout",
        kind: "interview",
        title: "Signature interview signal",
        text: "Recognising a monotonic-stack problem instantly (largest rectangle in histogram, trapping rain water, remove-k-digits) marks you as a 'senior' candidate.",
      },
      {
        type: "practice",
        groups: [
          {
            level: "Advanced",
            items: [
              {
                title: "LC 84 · Largest Rectangle in Histogram",
                url: "https://leetcode.com/problems/largest-rectangle-in-histogram/",
                difficulty: "Hard",
                pattern: "Monotonic Stack",
              },
              {
                title: "LC 42 · Trapping Rain Water",
                url: "https://leetcode.com/problems/trapping-rain-water/",
                difficulty: "Hard",
              },
              {
                title: "LC 402 · Remove K Digits",
                url: "https://leetcode.com/problems/remove-k-digits/",
                difficulty: "Medium",
              },
            ],
          },
        ],
      },
    ],
  },
];
