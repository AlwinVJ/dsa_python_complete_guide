import type { QueueLesson } from "./types";

/** Foundations tier — the vocabulary and primitives every queue learner needs. */
export const QUEUE_FOUNDATIONS: QueueLesson[] = [
  {
    slug: "introduction",
    title: "Introduction to Queues",
    eyebrow: "Foundations · 1",
    description: "A queue is a FIFO container — the first item enqueued is the first one dequeued. Build the mental model before touching code.",
    difficulty: "Beginner",
    readMinutes: 5,
    sections: [
      { type: "theory", text: "A queue is a linear data structure where insertions happen at one end (the rear) and removals at the other (the front). That single rule — FIFO — is what makes queues perfect for fairness-based scheduling." },
      { type: "viz", items: [10, 20, 30, 40], caption: "A 4-element queue. 10 is at FRONT, 40 is at REAR." },
      { type: "theory", bullets: [
        "Insertions go to the rear (enqueue).",
        "Removals come from the front (dequeue).",
        "Every core operation is O(1) when implemented properly.",
        "The abstraction underlies BFS, print queues, and CPU scheduling.",
      ]},
      { type: "callout", kind: "did", title: "Where you already use one",
        text: "The line at a coffee shop, the print queue on your laptop, and messages waiting in a Kafka topic are all real-world FIFO queues." },
    ],
  },
  {
    slug: "what-is-a-queue",
    title: "What is a Queue?",
    eyebrow: "Foundations · 2",
    description: "The precise definition and the vocabulary every problem statement will use.",
    difficulty: "Beginner",
    readMinutes: 4,
    sections: [
      { type: "theory", text: "Formally, a queue is an Abstract Data Type (ADT) that supports enqueue(x) at the rear and dequeue() at the front, plus a read-only peek()/front(). The order of removal exactly matches the order of insertion." },
      { type: "code", title: "the ADT contract", code:
`enqueue(x) -> None    # add x at the rear
dequeue()  -> x       # remove & return front
peek()     -> x       # look at front, don't remove
is_empty() -> bool
size()     -> int` },
      { type: "callout", kind: "info", title: "ADT vs implementation",
        text: "The ADT says what a queue does; a deque, a linked list, a circular buffer, or two stacks can all fulfil that contract." },
    ],
  },
  {
    slug: "fifo-principle",
    title: "The FIFO Principle",
    eyebrow: "Foundations · 3",
    description: "First-In-First-Out — the ordering rule that defines every queue.",
    difficulty: "Beginner",
    readMinutes: 4,
    sections: [
      { type: "theory", text: "FIFO means the first item enqueued is the next one dequeued. Picture a ticket line — the person who arrived first gets served first." },
      { type: "viz", items: ["A"], caption: "enqueue('A')" },
      { type: "viz", items: ["A", "B"], caption: "enqueue('B')" },
      { type: "viz", items: ["A", "B", "C"], caption: "enqueue('C')" },
      { type: "viz", items: ["B", "C"], caption: "dequeue() → 'A' — the first one in is the first one out." },
      { type: "callout", kind: "did", title: "Contrast with LIFO",
        text: "Stacks are LIFO. Same building blocks, opposite discipline — that single flip changes everything an algorithm can do." },
    ],
  },
  {
    slug: "memory-representation",
    title: "Memory Representation",
    eyebrow: "Foundations · 4",
    description: "How a queue lives in memory — contiguous slots, circular buffers, or scattered nodes.",
    difficulty: "Beginner",
    readMinutes: 5,
    sections: [
      { type: "theory", text: "An array-backed linear queue occupies one contiguous block but wastes slots as the front advances. A circular buffer reclaims those slots. A linked-list queue scatters nodes across the heap with head/tail pointers." },
      { type: "viz", items: [10, 20, 30], showAddresses: true, base: 0x2000, stride: 0x20,
        caption: "Array-backed: each slot is base + index × stride." },
      { type: "callout", kind: "perf", title: "Cache impact",
        text: "Contiguous storage is cache-friendly but wastes memory once dequeue moves the front. The circular buffer variant is the usual fix." },
    ],
  },
  {
    slug: "queue-pointer",
    title: "The Queue Pointer",
    eyebrow: "Foundations · 5",
    description: "Every queue is really 'a buffer plus two integers' — front and rear.",
    difficulty: "Beginner",
    readMinutes: 4,
    sections: [
      { type: "theory", text: "The front pointer says 'the next item to dequeue lives here'. The rear pointer says 'the next enqueue goes here'. Together they carve out the live window inside the buffer." },
      { type: "code", title: "two-pointer push/pop", code:
`buf   = [None] * 8
front = 0
rear  = 0

def enqueue(x):
    global rear
    buf[rear] = x
    rear += 1

def dequeue():
    global front
    x = buf[front]
    front += 1
    return x` },
      { type: "callout", kind: "warn", title: "Wasted space",
        text: "As front advances, the slots behind it are dead weight. That's exactly why circular queues exist." },
    ],
  },
  {
    slug: "front-and-rear",
    title: "Front & Rear",
    eyebrow: "Foundations · 6",
    description: "The only two positions you're ever allowed to touch — and how they move.",
    difficulty: "Beginner",
    readMinutes: 3,
    sections: [
      { type: "theory", bullets: [
        "Front — the oldest live element; the next one dequeue will return.",
        "Rear — the newest element; the last one enqueued.",
        "size = rear − front (in the simple linear model).",
        "front == rear ⇒ the queue is empty.",
      ]},
      { type: "viz", items: [10, 20, 30, 40], caption: "front points to 10, rear points to 40." },
    ],
  },
  {
    slug: "enqueue",
    title: "Enqueue",
    eyebrow: "Foundations · 7",
    description: "Step through an enqueue, watch REAR move, and understand why it's O(1).",
    difficulty: "Beginner",
    readMinutes: 4,
    sections: [
      { type: "viz", items: [10, 20], caption: "before enqueue(30)" },
      { type: "viz", items: [10, 20, 30], caption: "after enqueue(30) — REAR moved right one slot" },
      { type: "code", title: "python — deque backed", code: `from collections import deque\nq = deque([10, 20])\nq.append(30)   # enqueue — O(1)` },
      { type: "dryRun", headers: ["step", "action", "front", "rear"], rows: [
        ["1", "read incoming value 30", "0", "2"],
        ["2", "buf[rear] = 30", "0", "2"],
        ["3", "rear += 1", "0", "3"],
      ]},
      { type: "complexity", rows: [{ op: "enqueue", time: "O(1)", space: "O(1)" }] },
    ],
  },
  {
    slug: "dequeue",
    title: "Dequeue",
    eyebrow: "Foundations · 8",
    description: "Dequeue reverses the enqueue — read from front, then advance the front pointer.",
    difficulty: "Beginner",
    readMinutes: 4,
    sections: [
      { type: "viz", items: [10, 20, 30], caption: "before dequeue()" },
      { type: "viz", items: [20, 30], caption: "after dequeue() — 10 removed, FRONT advanced" },
      { type: "code", code: `from collections import deque\nq = deque([10, 20, 30])\nx = q.popleft()   # O(1); raises IndexError if empty` },
      { type: "mistakes", items: [
        "Never use `list.pop(0)` — it's O(n) because every remaining element shifts.",
        "Always guard against empty dequeue — Python raises `IndexError`.",
      ]},
      { type: "complexity", rows: [{ op: "dequeue", time: "O(1)", space: "O(1)" }] },
    ],
  },
  {
    slug: "peek",
    title: "Peek",
    eyebrow: "Foundations · 9",
    description: "Peek reads the front without removing it — one array access, no side effects.",
    difficulty: "Beginner",
    readMinutes: 3,
    sections: [
      { type: "code", code:
`def peek(q):
    if not q:
        return None
    return q[0]   # O(1)` },
      { type: "callout", kind: "tip", title: "Design choice",
        text: "Some libraries raise on empty peek; others return None. Pick one and document it." },
      { type: "complexity", rows: [{ op: "peek", time: "O(1)", space: "O(1)" }] },
    ],
  },
  {
    slug: "overflow-underflow",
    title: "Overflow & Underflow",
    eyebrow: "Foundations · 10",
    description: "Two error conditions every queue implementation must handle.",
    difficulty: "Beginner",
    readMinutes: 4,
    sections: [
      { type: "theory", bullets: [
        "Overflow — enqueueing onto a full bounded queue. Only matters for fixed-capacity buffers.",
        "Underflow — dequeueing (or peeking) an empty queue. Always the caller's responsibility to check.",
      ]},
      { type: "code", title: "defensive dequeue", code:
`def safe_dequeue(q):
    if not q:
        raise IndexError("dequeue from empty queue")
    return q.popleft()` },
      { type: "callout", kind: "warn", title: "Silent bugs",
        text: "Returning None on underflow instead of raising is a common source of hard-to-find bugs — the caller keeps working with garbage." },
    ],
  },
  {
    slug: "playground",
    title: "Interactive Queue Playground",
    eyebrow: "Foundations · 11",
    description: "Enqueue, dequeue, and peek in real time. Watch FRONT and REAR move.",
    difficulty: "Beginner",
    readMinutes: 6,
    sections: [
      { type: "playground", initial: [10, 20, 30] },
      { type: "callout", kind: "tip", title: "Suggested experiments",
        text: "Dequeue an empty queue (underflow). Enqueue until you hit the max size (overflow). Peek repeatedly to confirm it doesn't mutate the queue." },
    ],
  },
  {
    slug: "advantages",
    title: "Advantages",
    eyebrow: "Foundations · 12",
    description: "Why FIFO is one of the most-used disciplines in computing.",
    difficulty: "Beginner",
    readMinutes: 3,
    sections: [
      { type: "theory", bullets: [
        "✅ All core operations run in O(1) with the right backing store.",
        "✅ Preserves arrival order — the model of fairness.",
        "✅ Natural fit for BFS, buffering, scheduling, and streaming.",
        "✅ Enables producer-consumer decoupling across threads or services.",
      ]},
    ],
  },
  {
    slug: "disadvantages",
    title: "Disadvantages",
    eyebrow: "Foundations · 13",
    description: "The tradeoffs that come with FIFO ordering.",
    difficulty: "Beginner",
    readMinutes: 3,
    sections: [
      { type: "theory", bullets: [
        "❌ No random access — you can't jump to the middle.",
        "❌ Searching is O(n).",
        "❌ Naive array queues waste memory as the front advances.",
        "❌ `list.pop(0)` is O(n) — the wrong tool trips beginners constantly.",
      ]},
    ],
  },
  {
    slug: "queue-vs-stack",
    title: "Queue vs Stack",
    eyebrow: "Foundations · 14",
    description: "Same shape — opposite ordering. The comparison every interviewer asks about.",
    difficulty: "Beginner",
    readMinutes: 3,
    sections: [
      { type: "complexity", rows: [
        { op: "Ordering",       time: "FIFO · LIFO" },
        { op: "Add",            time: "enqueue (rear) · push (top)" },
        { op: "Remove",         time: "dequeue (front) · pop (top)" },
        { op: "Typical uses",   time: "BFS, scheduling · DFS, undo, parsing" },
      ]},
      { type: "callout", kind: "did", title: "Two stacks = a queue",
        text: "You can build a queue with amortised O(1) dequeue using two stacks. We build it in the Variants tier." },
    ],
  },
  {
    slug: "time-complexity",
    title: "Time Complexity",
    eyebrow: "Foundations · 15",
    description: "Every core operation, in one table.",
    difficulty: "Beginner",
    readMinutes: 2,
    sections: [
      { type: "complexity", rows: [
        { op: "enqueue (deque)",  time: "O(1)" },
        { op: "dequeue (deque)",  time: "O(1)" },
        { op: "peek / front",     time: "O(1)" },
        { op: "is_empty / size",  time: "O(1)" },
        { op: "search",           time: "O(n)" },
        { op: "list.pop(0)",      time: "O(n)", note: "the wrong tool — do not use" },
      ]},
    ],
  },
  {
    slug: "space-complexity",
    title: "Space Complexity",
    eyebrow: "Foundations · 16",
    description: "How much memory a queue actually costs.",
    difficulty: "Beginner",
    readMinutes: 2,
    sections: [
      { type: "complexity", rows: [
        { op: "n-element deque",         time: "O(n)", space: "linked blocks of 64" },
        { op: "n-element linked queue",  time: "O(n)", space: "1 slot + 1 pointer per item" },
        { op: "circular buffer (cap k)", time: "O(k)", space: "fixed regardless of enqueue count" },
        { op: "BFS traversal",           time: "O(V+E)", space: "O(V) queue + O(V) visited" },
      ]},
    ],
  },
  {
    slug: "applications",
    title: "Real-world Applications",
    eyebrow: "Foundations · 17",
    description: "Where you already interact with queues every single day.",
    difficulty: "Beginner",
    readMinutes: 4,
    sections: [
      { type: "theory", bullets: [
        "Breadth-first search on graphs and trees.",
        "CPU / task schedulers (round-robin, ready queues).",
        "Print queues on a shared printer.",
        "Message brokers — Kafka, RabbitMQ, SQS.",
        "Network packet buffers and request queues on web servers.",
        "Producer-consumer pipelines across threads.",
        "Sliding-window maximum via a monotonic deque.",
      ]},
      { type: "callout", kind: "interview", title: "Interview angle",
        text: "'Give me three real-world uses of a queue' is a warm-up. Answer with BFS, scheduling, and message brokers — then offer to code any of them." },
    ],
  },
  {
    slug: "summary",
    title: "Foundations Summary",
    eyebrow: "Foundations · 18",
    description: "Everything you need to remember before diving into variants.",
    difficulty: "Beginner",
    readMinutes: 3,
    sections: [
      { type: "theory", bullets: [
        "A queue is a FIFO container: enqueue at rear, dequeue from front.",
        "Every core operation is O(1) with `collections.deque`; `list.pop(0)` is O(n).",
        "A queue is 'a buffer + front + rear pointers'.",
        "Overflow (bounded enqueue) and underflow (empty dequeue) are the two error modes.",
        "Prefer `collections.deque`; reach for a circular buffer, linked list, or heap only when the problem demands it.",
      ]},
      { type: "callout", kind: "did", title: "Ready for the next tier",
        text: "You now know what a queue is. Next tier — Variants — shows six different ways to build one." },
    ],
  },
];
