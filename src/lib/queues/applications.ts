import type { QueueLesson } from "./types";

/** Algorithms & Applications tier — real-world uses and classic queue-driven algorithms. */
export const QUEUE_APPLICATIONS: QueueLesson[] = [
  {
    slug: "reverse-queue",
    title: "Reverse a Queue",
    eyebrow: "Applications · 1",
    description: "Reverse the order of elements — a great warm-up that reveals the queue/stack relationship.",
    difficulty: "Beginner",
    readMinutes: 5,
    sections: [
      { type: "theory", text: "A queue only lets you touch front and rear, so you can't reverse in place. The trick: dequeue everything into a stack, then re-enqueue by popping the stack. Two data structures, one linear pass." },
      { type: "code", code:
`from collections import deque

def reverse(q: deque) -> deque:
    stack = []
    while q:
        stack.append(q.popleft())
    while stack:
        q.append(stack.pop())
    return q` },
      { type: "complexity", rows: [
        { op: "reverse", time: "O(n)", space: "O(n)" },
      ]},
      { type: "callout", kind: "did", title: "Recursive variant",
        text: "The recursion-based reverse uses the implicit call stack instead of an explicit one — same idea, hidden storage." },
    ],
  },
  {
    slug: "monotonic-queue",
    title: "Monotonic Queue",
    eyebrow: "Applications · 2",
    description: "A deque that keeps its contents sorted — the engine behind sliding-window maximum in O(n).",
    difficulty: "Advanced",
    readMinutes: 8,
    sections: [
      { type: "theory", text: "Maintain a deque of indices whose values are strictly decreasing (for max) or increasing (for min). Every element enters and leaves the deque exactly once, giving amortised O(n) for the whole scan — a huge win over the O(n·k) brute force." },
      { type: "code", title: "sliding window maximum", code:
`from collections import deque

def max_sliding_window(nums, k):
    dq  = deque()   # indices
    out = []
    for i, x in enumerate(nums):
        while dq and nums[dq[-1]] < x:
            dq.pop()
        dq.append(i)
        if dq[0] <= i - k:
            dq.popleft()
        if i >= k - 1:
            out.append(nums[dq[0]])
    return out` },
      { type: "dryRun", headers: ["i", "x", "dq (indices)", "window max"], rows: [
        ["0", "1", "[0]",     "—"],
        ["1", "3", "[1]",     "—"],
        ["2", "-1","[1, 2]",  "3"],
        ["3", "-3","[1, 2, 3]","3"],
        ["4", "5", "[4]",     "5"],
        ["5", "3", "[4, 5]",  "5"],
      ], caption: "nums = [1, 3, -1, -3, 5, 3], k = 3" },
      { type: "complexity", rows: [
        { op: "sliding max", time: "O(n)", space: "O(k)" },
      ]},
      { type: "callout", kind: "interview", title: "LeetCode 239",
        text: "Sliding Window Maximum. Ranked Hard, but with a monotonic deque it's one clean loop." },
    ],
  },
  {
    slug: "bfs",
    title: "Breadth-First Search",
    eyebrow: "Applications · 3",
    description: "BFS explores a graph level by level using a queue — the shortest-path algorithm for unweighted graphs.",
    difficulty: "Intermediate",
    readMinutes: 7,
    sections: [
      { type: "theory", text: "Push the start node into a queue. Repeatedly dequeue the next node, mark it visited, and enqueue its unseen neighbours. Because the queue preserves arrival order, every node comes out in order of distance from the source." },
      { type: "code", code:
`from collections import deque

def bfs(start, graph):
    seen  = {start}
    order = []
    q = deque([start])
    while q:
        node = q.popleft()
        order.append(node)
        for nb in graph[node]:
            if nb not in seen:
                seen.add(nb)
                q.append(nb)
    return order` },
      { type: "complexity", rows: [
        { op: "bfs", time: "O(V + E)", space: "O(V)", note: "visited set + queue" },
      ]},
      { type: "callout", kind: "interview", title: "Where BFS wins",
        text: "Shortest path in an unweighted graph, level-order tree traversal, minimum edits (word ladder), flood fill on grids — always reach for a queue." },
    ],
  },
  {
    slug: "task-scheduling",
    title: "Task Scheduling",
    eyebrow: "Applications · 4",
    description: "Round-robin scheduling — each task gets a time slice, then goes back to the rear.",
    difficulty: "Intermediate",
    readMinutes: 5,
    sections: [
      { type: "theory", text: "A ready queue holds runnable tasks. The scheduler dequeues the head, runs it for one quantum, and if it hasn't finished re-enqueues it at the rear. Fairness falls out of FIFO for free." },
      { type: "code", code:
`from collections import deque

def round_robin(tasks, quantum):
    q = deque(tasks)          # each task = [name, remaining_ms]
    trace = []
    while q:
        name, rem = q.popleft()
        run = min(rem, quantum)
        trace.append((name, run))
        rem -= run
        if rem > 0:
            q.append([name, rem])
    return trace` },
      { type: "callout", kind: "did", title: "Real systems",
        text: "The Linux CFS and Windows scheduler are more elaborate, but the concept — a queue of runnable tasks — is exactly this." },
    ],
  },
  {
    slug: "printer-queue",
    title: "Printer Queue",
    eyebrow: "Applications · 5",
    description: "The canonical shared-resource queue — first submitted, first printed.",
    difficulty: "Beginner",
    readMinutes: 4,
    sections: [
      { type: "theory", text: "Jobs submitted to a printer land in a FIFO queue. The printer takes the head, prints it, and dequeues. Priority-print (rush jobs) upgrades this to a priority queue." },
      { type: "code", code:
`from collections import deque

class Printer:
    def __init__(self):
        self.jobs = deque()

    def submit(self, job):
        self.jobs.append(job)

    def tick(self):
        if self.jobs:
            job = self.jobs.popleft()
            print(f"printing: {job}")` },
      { type: "callout", kind: "info", title: "Priority upgrade",
        text: "Swap the deque for a `heapq` keyed on priority to let managers jump the line — see the Priority Queue variant." },
    ],
  },
  {
    slug: "cpu-scheduling",
    title: "CPU Scheduling",
    eyebrow: "Applications · 6",
    description: "Ready queues, waiting queues, and multi-level feedback queues drive every operating system.",
    difficulty: "Advanced",
    readMinutes: 6,
    sections: [
      { type: "theory", bullets: [
        "Ready queue — processes waiting for CPU time.",
        "Waiting queue — processes blocked on I/O.",
        "Multi-level feedback queues — a stack of ready queues at different priorities; long-running tasks get demoted.",
        "Every scheduler is 'pick the next process out of a queue' plus a policy for choosing which queue.",
      ]},
      { type: "code", title: "toy MLFQ", code:
`from collections import deque

class MLFQ:
    def __init__(self, levels=3):
        self.qs = [deque() for _ in range(levels)]

    def submit(self, proc, level=0):
        self.qs[level].append(proc)

    def next(self):
        for i, q in enumerate(self.qs):
            if q:
                proc = q.popleft()
                # demote if it used its full quantum
                if proc.used_full_quantum and i < len(self.qs) - 1:
                    self.qs[i + 1].append(proc)
                return proc
        return None` },
    ],
  },
  {
    slug: "producer-consumer",
    title: "Producer-Consumer",
    eyebrow: "Applications · 7",
    description: "A thread-safe queue decouples producers from consumers — the backbone of message-driven systems.",
    difficulty: "Advanced",
    readMinutes: 7,
    sections: [
      { type: "theory", text: "Producers append work items to a bounded queue; consumers dequeue and process them. The queue's capacity provides backpressure — producers block when the queue is full, consumers block when it's empty." },
      { type: "code", title: "queue.Queue is thread-safe", code:
`import threading, queue, time

q = queue.Queue(maxsize=8)

def producer():
    for i in range(100):
        q.put(i)          # blocks when full
        time.sleep(0.01)

def consumer():
    while True:
        item = q.get()    # blocks when empty
        process(item)
        q.task_done()

threading.Thread(target=producer, daemon=True).start()
for _ in range(4):
    threading.Thread(target=consumer, daemon=True).start()` },
      { type: "callout", kind: "did", title: "Beyond one process",
        text: "Kafka, RabbitMQ, Redis Streams, and AWS SQS are the same pattern across the network." },
    ],
  },
];
