import type { StackLesson } from "./types";

/** Foundations tier — concepts every learner must know before implementing a stack. */
export const STACK_FOUNDATIONS: StackLesson[] = [
  {
    slug: "introduction",
    title: "Introduction to Stacks",
    eyebrow: "Foundations · 1",
    description: "A stack is a LIFO container — the last item you push is the first one you pop. Build the mental model before touching code.",
    difficulty: "Beginner",
    readMinutes: 5,
    sections: [
      { type: "theory", text:
        "A stack is a linear data structure where every insertion and removal happens at one end — the top. That single-end restriction is what makes the API tiny and impossible to misuse." },
      { type: "viz", items: [10, 20, 30, 40], caption: "A 4-element stack. 40 is on top." },
      { type: "theory", bullets: [
        "Only the top is accessible — no random indexing.",
        "Every operation (push, pop, peek) is O(1).",
        "The abstraction underlies function calls, undo history, and every recursive algorithm.",
      ]},
      { type: "callout", kind: "did", title: "Where you already use one",
        text: "The CPU's call stack, your browser's back button, and Ctrl+Z in your editor are all real-world LIFO stacks." },
    ],
  },
  {
    slug: "what-is-a-stack",
    title: "What is a Stack?",
    eyebrow: "Foundations · 2",
    description: "The precise definition and the vocabulary every problem statement will use.",
    difficulty: "Beginner",
    readMinutes: 4,
    sections: [
      { type: "theory", text:
        "Formally, a stack is an Abstract Data Type (ADT) that supports two mutating operations — push(x) and pop() — plus a read-only peek()/top(). The order of removal is exactly the reverse of the order of insertion." },
      { type: "code", title: "the ADT contract", code:
`push(x)   -> None      # add x on top
pop()     -> x         # remove & return top
peek()    -> x         # look at top, don't remove
is_empty() -> bool
size()    -> int` },
      { type: "callout", kind: "info", title: "ADT vs implementation",
        text: "The ADT says what a stack does; a Python list, a linked list, or a fixed array can all fulfil that contract." },
    ],
  },
  {
    slug: "lifo-principle",
    title: "The LIFO Principle",
    eyebrow: "Foundations · 3",
    description: "Last-In-First-Out — the ordering rule that defines every stack.",
    difficulty: "Beginner",
    readMinutes: 4,
    sections: [
      { type: "theory", text:
        "LIFO means the most recently pushed item is the next one popped. Picture a stack of plates: you can only add to or take from the top." },
      { type: "viz", items: ["A"], caption: "push('A')" },
      { type: "viz", items: ["A", "B"], caption: "push('B')" },
      { type: "viz", items: ["A", "B", "C"], caption: "push('C')" },
      { type: "viz", items: ["A", "B"], caption: "pop() → 'C' — the last one in is the first one out." },
      { type: "callout", kind: "did", title: "Contrast with FIFO",
        text: "Queues are FIFO (first-in-first-out). Same building blocks, opposite ordering discipline." },
    ],
  },
  {
    slug: "terminology",
    title: "Stack Terminology",
    eyebrow: "Foundations · 4",
    description: "Top, base, capacity, stack pointer — the vocabulary every stack problem uses.",
    difficulty: "Beginner",
    readMinutes: 3,
    sections: [
      { type: "theory", bullets: [
        "Top — the most recently pushed element; the only one you can directly touch.",
        "Base / bottom — the first element ever pushed; the anchor of the stack.",
        "Stack pointer (SP) — an integer index that always points 'just above' the top slot.",
        "Capacity — for bounded implementations, the maximum number of items.",
        "Underflow — popping when empty; Overflow — pushing when full.",
      ]},
    ],
  },
  {
    slug: "memory-representation",
    title: "Memory Representation",
    eyebrow: "Foundations · 5",
    description: "How a stack lives in memory — contiguous slots or scattered nodes.",
    difficulty: "Beginner",
    readMinutes: 5,
    sections: [
      { type: "theory", text:
        "An array-backed stack occupies one contiguous memory block; the CPU cache loves it. A linked-list-backed stack scatters nodes across the heap and follows one pointer per pop." },
      { type: "viz", items: [10, 20, 30], showAddresses: true, base: 0x1000, stride: 0x20,
        caption: "Array-backed: each slot is base + index × stride." },
      { type: "callout", kind: "perf", title: "Cache impact",
        text: "Even though both implementations are O(1), the contiguous version usually wins in the real world because it avoids pointer chasing." },
    ],
  },
  {
    slug: "stack-pointer",
    title: "The Stack Pointer",
    eyebrow: "Foundations · 6",
    description: "Every stack — hardware or software — is really 'a chunk of memory plus one integer'.",
    difficulty: "Beginner",
    readMinutes: 4,
    sections: [
      { type: "theory", text:
        "The stack pointer (SP) is an index or address that says 'the next free slot is here'. Push writes then increments SP; pop decrements SP then reads. That's the whole trick." },
      { type: "code", title: "SP-based push/pop", code:
`# SP always points to the next free slot
buf = [None] * 8
sp = 0

def push(x):
    global sp
    buf[sp] = x
    sp += 1

def pop():
    global sp
    sp -= 1
    return buf[sp]` },
      { type: "callout", kind: "did", title: "Real CPUs work like this",
        text: "The x86 RSP register is a real stack pointer — CALL/RET manipulate it exactly the same way." },
    ],
  },
  {
    slug: "how-push-works",
    title: "How Push Works",
    eyebrow: "Foundations · 7",
    description: "Step through a push, watch SP move, and understand why it's O(1) amortised.",
    difficulty: "Beginner",
    readMinutes: 4,
    sections: [
      { type: "viz", items: [10, 20], caption: "before push(30)" },
      { type: "viz", items: [10, 20, 30], caption: "after push(30) — SP moved up one slot" },
      { type: "code", title: "python — list-backed", code: `stack.append(30)   # O(1) amortised` },
      { type: "dryRun", headers: ["step", "action", "SP", "top"], rows: [
        ["1", "read incoming value 30", "2", "20"],
        ["2", "buf[2] = 30", "2", "20"],
        ["3", "SP += 1", "3", "30"],
      ]},
      { type: "complexity", rows: [{ op: "push", time: "O(1) amortised", space: "O(1)" }] },
    ],
  },
  {
    slug: "how-pop-works",
    title: "How Pop Works",
    eyebrow: "Foundations · 8",
    description: "Pop reverses the push — decrement SP, then read.",
    difficulty: "Beginner",
    readMinutes: 4,
    sections: [
      { type: "viz", items: [10, 20, 30], caption: "before pop()" },
      { type: "viz", items: [10, 20], caption: "after pop() — 30 removed, SP decremented" },
      { type: "code", code: `x = stack.pop()   # O(1); raises IndexError if empty` },
      { type: "mistakes", items: [
        "Calling pop() on an empty list raises IndexError — check `if stack:` first.",
        "Never use `list.pop(0)` on a stack — that's O(n) and defeats the point.",
      ]},
      { type: "complexity", rows: [{ op: "pop", time: "O(1)", space: "O(1)" }] },
    ],
  },
  {
    slug: "how-peek-works",
    title: "How Peek Works",
    eyebrow: "Foundations · 9",
    description: "Peek reads the top without removing it — one array access, no side effects.",
    difficulty: "Beginner",
    readMinutes: 3,
    sections: [
      { type: "code", code:
`def peek(stack):
    if not stack:
        return None
    return stack[-1]   # O(1)` },
      { type: "callout", kind: "tip", title: "Design choice",
        text: "Some libraries raise on empty peek; others return None. Pick one and document it." },
      { type: "complexity", rows: [{ op: "peek", time: "O(1)", space: "O(1)" }] },
    ],
  },
  {
    slug: "overflow-underflow",
    title: "Overflow vs Underflow",
    eyebrow: "Foundations · 10",
    description: "Two error conditions every stack implementation must handle.",
    difficulty: "Beginner",
    readMinutes: 4,
    sections: [
      { type: "theory", bullets: [
        "Overflow — pushing onto a full (bounded) stack. Python lists grow dynamically, so this only matters for fixed-size implementations.",
        "Underflow — popping (or peeking) an empty stack. Always the caller's responsibility to check.",
      ]},
      { type: "code", title: "defensive pop", code:
`def safe_pop(stack):
    if not stack:
        raise IndexError("pop from empty stack")
    return stack.pop()` },
      { type: "callout", kind: "warn", title: "Silent bugs",
        text: "Returning None on underflow instead of raising is a common source of hard-to-find bugs — the caller keeps working with garbage." },
    ],
  },
  {
    slug: "playground",
    title: "Interactive Stack Playground",
    eyebrow: "Foundations · 11",
    description: "Push, pop, and peek in real time. Watch the top pointer move and simulated addresses update.",
    difficulty: "Beginner",
    readMinutes: 6,
    sections: [
      { type: "playground", initial: [10, 20, 30] },
      { type: "callout", kind: "tip", title: "Suggested experiments",
        text: "Try popping an empty stack (underflow). Push until you hit the max size (overflow). Peek repeatedly to confirm it doesn't mutate the stack." },
    ],
  },
  {
    slug: "advantages",
    title: "Advantages",
    eyebrow: "Foundations · 12",
    description: "Why the stack is one of the most-used data structures on Earth.",
    difficulty: "Beginner",
    readMinutes: 3,
    sections: [
      { type: "theory", bullets: [
        "✅ All core operations run in O(1).",
        "✅ Tiny API — hard to misuse.",
        "✅ Natural fit for recursion, parsing, and backtracking.",
        "✅ Memory-efficient — no per-element overhead beyond a pointer/index.",
      ]},
    ],
  },
  {
    slug: "disadvantages",
    title: "Disadvantages",
    eyebrow: "Foundations · 13",
    description: "The tradeoffs that come with LIFO ordering.",
    difficulty: "Beginner",
    readMinutes: 3,
    sections: [
      { type: "theory", bullets: [
        "❌ No random access — you can't jump to the middle.",
        "❌ Searching is O(n) — you must pop your way through.",
        "❌ Bounded implementations can overflow.",
        "❌ Deep recursion can blow the call stack (Python's default limit is 1000).",
      ]},
    ],
  },
  {
    slug: "stack-vs-array",
    title: "Stack vs Array",
    eyebrow: "Foundations · 14",
    description: "Same underlying storage, very different access disciplines.",
    difficulty: "Beginner",
    readMinutes: 4,
    sections: [
      { type: "complexity", rows: [
        { op: "Access at index k",     time: "Array O(1) · Stack O(k)", note: "Stack must pop to reach k." },
        { op: "Insert at end",         time: "Array O(1)* · Stack O(1)" },
        { op: "Insert anywhere else",  time: "Array O(n) · Stack N/A", note: "Stack has no 'middle'." },
        { op: "Delete at end",         time: "Array O(1) · Stack O(1)" },
        { op: "Search value",          time: "Array O(n) · Stack O(n)" },
        { op: "API surface",           time: "wide · minimal", note: "Stack's small API is the feature." },
      ]},
      { type: "callout", kind: "info", title: "When to prefer a stack",
        text: "Use a stack when your algorithm only ever touches the most-recent item — parsing, DFS, undo. Use an array when you need random access." },
    ],
  },
  {
    slug: "stack-vs-queue",
    title: "Stack vs Queue",
    eyebrow: "Foundations · 15",
    description: "Same shape — opposite ordering. One trivia bit that trips up interviewees.",
    difficulty: "Beginner",
    readMinutes: 3,
    sections: [
      { type: "complexity", rows: [
        { op: "Ordering",       time: "LIFO · FIFO" },
        { op: "Add",            time: "push (top) · enqueue (rear)" },
        { op: "Remove",         time: "pop (top) · dequeue (front)" },
        { op: "Typical uses",   time: "recursion, DFS, undo · scheduling, BFS, buffering" },
      ]},
      { type: "callout", kind: "did", title: "Two stacks = a queue",
        text: "You can implement a queue using two stacks (amortised O(1) dequeue). We build it in the Implementations tier." },
    ],
  },
  {
    slug: "time-complexity-overview",
    title: "Time Complexity Overview",
    eyebrow: "Foundations · 16",
    description: "Every core operation, in one table.",
    difficulty: "Beginner",
    readMinutes: 2,
    sections: [
      { type: "complexity", rows: [
        { op: "push",      time: "O(1) amortised" },
        { op: "pop",       time: "O(1)" },
        { op: "peek / top",time: "O(1)" },
        { op: "is_empty",  time: "O(1)" },
        { op: "size",      time: "O(1)" },
        { op: "search",    time: "O(n)", note: "must pop through" },
      ]},
    ],
  },
  {
    slug: "space-complexity-overview",
    title: "Space Complexity Overview",
    eyebrow: "Foundations · 17",
    description: "How much memory a stack actually costs.",
    difficulty: "Beginner",
    readMinutes: 2,
    sections: [
      { type: "complexity", rows: [
        { op: "n-element array-backed stack",  time: "O(n)", space: "1 slot per item" },
        { op: "n-element linked-list stack",   time: "O(n)", space: "1 slot + 1 pointer per item" },
        { op: "iterative traversal",           time: "O(n)", space: "O(1) aux" },
        { op: "recursive traversal",           time: "O(n)", space: "O(n) call stack" },
      ]},
    ],
  },
  {
    slug: "applications",
    title: "Real-world Applications",
    eyebrow: "Foundations · 18",
    description: "Where you already interact with stacks every single day.",
    difficulty: "Beginner",
    readMinutes: 4,
    sections: [
      { type: "theory", bullets: [
        "Function calls — every language runtime uses a call stack.",
        "Undo/redo history in editors, IDEs, and design tools.",
        "Browser back-button history.",
        "Expression evaluation (infix → postfix, evaluating postfix).",
        "Syntax parsing — matching brackets, quotes, HTML/XML tags.",
        "Depth-first search on graphs and trees.",
        "Backtracking algorithms (sudoku, N-queens, maze solving).",
      ]},
      { type: "callout", kind: "interview", title: "Interview angle",
        text: "'Give me three real-world uses of a stack' is a warm-up. Answer with call stack, undo, and expression parsing — then offer to code any of them." },
    ],
  },
  {
    slug: "choosing-a-stack",
    title: "Choosing a Stack",
    eyebrow: "Foundations · 19",
    description: "A decision guide for picking the right stack implementation.",
    difficulty: "Beginner",
    readMinutes: 4,
    sections: [
      { type: "theory", bullets: [
        "Python list — the default. Amortised O(1), cache-friendly, no dependencies.",
        "collections.deque — thread-safe(-ish) and slightly faster for pure LIFO on very large data.",
        "Custom linked-list stack — needed when you must guarantee true O(1) push (no amortised resizing).",
        "Fixed-size array stack — embedded / competitive-programming contexts where allocation is forbidden.",
        "Two-stack queue — a stack trick to build a queue with only push/pop primitives.",
      ]},
    ],
  },
  {
    slug: "summary",
    title: "Foundations Summary",
    eyebrow: "Foundations · 20",
    description: "Everything you need to remember before diving into implementations.",
    difficulty: "Beginner",
    readMinutes: 3,
    sections: [
      { type: "theory", bullets: [
        "A stack is a LIFO container: push and pop happen at the top.",
        "Every core operation is O(1); search is O(n).",
        "A stack is 'memory + one pointer' — the SP indexes the next free slot.",
        "Overflow (bounded push) and underflow (empty pop) are the two error modes.",
        "Prefer a Python list; reach for a linked list only when you need guaranteed O(1) push.",
      ]},
      { type: "callout", kind: "did", title: "Ready for the next tier",
        text: "You now know what a stack is. Next tier — Implementations — shows four different ways to build one." },
    ],
  },
];
