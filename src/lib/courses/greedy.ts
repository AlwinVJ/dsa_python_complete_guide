import type { Course } from "./types";

export const greedyCourse: Course = {
  slug: "greedy",
  title: "Greedy Algorithms",
  tagline: "Make the locally optimal choice and hope it stays optimal globally.",
  category: "algorithm",
  order: 15,
  icon: "Zap",
  // Lesson content below is complete, but the platform is intentionally
  // presenting this module as under development for now (per current
  // product decision). Flip this to false — or delete the line — to
  // automatically restore the expandable lesson tree; no sidebar changes
  // are needed.
  comingSoon: true,
  lessons: [
    {
      slug: "introduction",
      title: "Introduction",
      theory:
        "A greedy algorithm builds up a solution one piece at a time, always taking the locally best option. Simpler and faster than DP — when it works. Proving correctness requires either an exchange argument or a matroid structure.",
    },
    {
      slug: "when-it-works",
      title: "When Greedy Works",
      bullets: [
        "Greedy-choice property — a global optimum can be reached by making a locally optimal choice.",
        "Optimal substructure — the remaining subproblem is of the same form.",
        "Counter-examples matter: coin change with {1,3,4} and target 6 defeats the standard greedy.",
      ],
    },
    {
      slug: "activity-selection",
      title: "Activity Selection",
      theory:
        "Given intervals, pick the maximum number that don't overlap. Sort by end time, greedily pick the next non-conflicting interval.",
      code: `def activity(intervals):\n    intervals.sort(key=lambda x: x[1])\n    end, count = -float('inf'), 0\n    for s, e in intervals:\n        if s >= end:\n            end = e; count += 1\n    return count`,
    },
    {
      slug: "huffman-coding",
      title: "Huffman Coding",
      theory:
        "Build an optimal prefix code by repeatedly merging the two lowest-frequency nodes using a min-heap.",
    },
    {
      slug: "coin-change",
      title: "Coin Change (Canonical Systems)",
      theory:
        "For canonical coin systems (like {1,5,10,25}) greedy always wins; for arbitrary systems switch to DP.",
    },
    {
      slug: "jump-game",
      title: "Jump Game",
      theory: "Track the farthest index reachable. If ever `i > reach`, return False. O(n).",
      code: `def canJump(a):\n    reach = 0\n    for i, x in enumerate(a):\n        if i > reach: return False\n        reach = max(reach, i + x)\n    return True`,
    },
    {
      slug: "interval-scheduling",
      title: "Interval Scheduling",
      theory:
        "Classic greedy on end-time. Extensions: weighted intervals (needs DP), minimum meeting rooms (heap of end times).",
    },
    {
      slug: "fractional-knapsack",
      title: "Fractional Knapsack",
      theory:
        "Sort items by value/weight ratio and take as much as fits — greedy is optimal because we can take fractions.",
    },
    {
      slug: "applications",
      title: "Applications",
      bullets: [
        "Scheduling and event planning.",
        "Data compression (Huffman).",
        "Graph algorithms (Kruskal, Prim, Dijkstra).",
        "Network protocols and load balancing.",
      ],
    },
    {
      slug: "practice",
      title: "Practice",
      practice: [
        {
          title: "LC 55 · Jump Game",
          url: "https://leetcode.com/problems/jump-game/",
          difficulty: "Medium",
        },
        {
          title: "LC 435 · Non-overlapping Intervals",
          url: "https://leetcode.com/problems/non-overlapping-intervals/",
          difficulty: "Medium",
        },
        {
          title: "LC 253 · Meeting Rooms II",
          url: "https://leetcode.com/problems/meeting-rooms-ii/",
          difficulty: "Medium",
        },
      ],
    },
    {
      slug: "quiz",
      title: "Quiz",
      quiz: {
        q: "Which strategy proves a greedy algorithm optimal?",
        choices: [
          "Backtracking",
          "Exchange argument or matroid structure",
          "Memoization",
          "Amortised analysis",
        ],
        answer: 1,
      },
    },
    {
      slug: "references",
      title: "References",
      references: [
        {
          label: "CLRS Chapter 16 — Greedy Algorithms",
          url: "https://mitpress.mit.edu/9780262046305/",
        },
      ],
    },
  ],
};
