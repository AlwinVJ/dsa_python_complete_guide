import type { ModuleBank } from "../types";

export const queuesBank: ModuleBank = {
  moduleSlug: "queues",
  moduleTitle: "Queues",
  edgeCases: [
    { case: "Empty queue dequeue", why: "Return None or raise; document choice." },
    { case: "Full circular queue", why: "front and rear collide — track size separately." },
    { case: "Wraparound in circular buffer", why: "Use modulo indexing: (i + 1) % capacity." },
  ],
  revisionSheet: {
    timeComplexity: [
      { op: "enqueue / dequeue (deque)", time: "O(1)" },
      { op: "front / rear", time: "O(1)" },
      { op: "priority push / pop", time: "O(log n)" },
    ],
    commonMistakes: [
      "Using list.pop(0) as a queue — O(n) per op",
      "Forgetting to shift front in a circular queue",
    ],
    memoryTricks: [
      "Use collections.deque for a real O(1) queue",
      "Use heapq for a priority queue",
      "Use two stacks for a queue in an interview constraint",
    ],
    mustSolve: ["q-q-sliding-window-max", "q-q-circular-queue"],
  },
  questions: [
    {
      id: "q-q-fifo",
      moduleSlug: "queues",
      title: "Why deque instead of list for queues?",
      category: "theory",
      difficulty: "Beginner",
      topic: "Fundamentals",
      description: "Explain why `list.pop(0)` is O(n) and how `collections.deque` fixes it.",
      hints: ["deque is a doubly linked list of fixed-size blocks — O(1) both ends."],
      pythonSolution:
        "from collections import deque\nq = deque()\nq.append(1); q.append(2); q.popleft()  # O(1)",
      estimatedMinutes: 5,
      tags: ["theory", "python-internals"],
    },
    {
      id: "q-q-circular-queue",
      moduleSlug: "queues",
      title: "Design Circular Queue",
      category: "advanced",
      difficulty: "Interview",
      topic: "Design",
      description:
        "Implement a fixed-capacity circular queue with enqueue, dequeue, front, rear, isFull, isEmpty.",
      hints: ["Track (front, size); rear = (front + size - 1) % capacity."],
      leetcodeLinks: [
        {
          title: "622. Design Circular Queue",
          url: "https://leetcode.com/problems/design-circular-queue/",
          difficulty: "Medium",
        },
      ],
      pythonSolution:
        "class MyCircularQueue:\n    def __init__(self, k):\n        self.buf = [0]*k; self.cap = k; self.front = 0; self.size = 0\n    def enQueue(self, x):\n        if self.size == self.cap: return False\n        self.buf[(self.front + self.size) % self.cap] = x; self.size += 1; return True\n    def deQueue(self):\n        if self.size == 0: return False\n        self.front = (self.front + 1) % self.cap; self.size -= 1; return True",
      estimatedMinutes: 25,
      pattern: "Circular Buffer",
      interviewFrequency: "High",
      tags: ["design", "must-do"],
    },
    {
      id: "q-q-sliding-window-max",
      moduleSlug: "queues",
      title: "Sliding Window Maximum",
      category: "advanced",
      difficulty: "Interview",
      topic: "Monotonic Deque",
      description: "Return the max in every window of size k as it slides.",
      approaches: [
        {
          name: "Optimal",
          code: "from collections import deque\nout, dq = [], deque()\nfor i, x in enumerate(nums):\n    while dq and nums[dq[-1]] < x: dq.pop()\n    dq.append(i)\n    if dq[0] <= i - k: dq.popleft()\n    if i >= k - 1: out.append(nums[dq[0]])\nreturn out",
          time: "O(n)",
          space: "O(k)",
        },
      ],
      pattern: "Monotonic Queue",
      relatedAlgorithm: "monotonic-queue",
      interviewFrequency: "Very High",
      leetcodeLinks: [
        {
          title: "239. Sliding Window Maximum",
          url: "https://leetcode.com/problems/sliding-window-maximum/",
          difficulty: "Hard",
        },
      ],
      estimatedMinutes: 30,
      tags: ["monotonic-queue", "must-do"],
    },
  ],
};
