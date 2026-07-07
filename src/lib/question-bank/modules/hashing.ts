import type { ModuleBank } from "../types";

export const hashingBank: ModuleBank = {
  moduleSlug: "hashing",
  moduleTitle: "Hash Tables & Hashing",
  edgeCases: [
    { case: "Multiple collisions", why: "All keys hash to the same bucket — worst case O(n)." },
    { case: "Load factor exceeded", why: "Triggers rehashing — resize + re-insert all keys." },
    {
      case: "Duplicate keys",
      why: "Overwrites the value — check with `key in d` first if you want to detect.",
    },
    { case: "Unhashable key (list)", why: "TypeError — convert to tuple." },
  ],
  revisionSheet: {
    formulas: ["load factor = n / capacity", "typical resize threshold: 0.66"],
    timeComplexity: [
      { op: "insert / get / delete", time: "O(1) avg, O(n) worst" },
      { op: "iteration", time: "O(n)" },
    ],
    commonMistakes: [
      "Using a mutable default (list/dict) as a dict value shared across keys",
      "Relying on dict order in Python < 3.7 (now guaranteed insertion-order)",
      "Hashing floats — NaN != NaN edge case",
    ],
    memoryTricks: [
      "'Find pair with sum k' → hash the complement",
      "'Anagrams / grouping' → hash the sorted key or char-count tuple",
      "'Subarray sum equals k' → prefix sum + hash",
    ],
    mustSolve: ["q-hash-two-sum", "q-hash-group-anagrams", "q-hash-lru"],
  },
  questions: [
    {
      id: "q-hash-collisions",
      moduleSlug: "hashing",
      title: "Chaining vs open addressing",
      category: "theory",
      difficulty: "Intermediate",
      topic: "Collisions",
      description: "Explain both collision resolution strategies and their trade-offs.",
      hints: ["Chaining: bucket → linked list. Open addressing: probe next slot."],
      estimatedMinutes: 10,
      tags: ["theory"],
      interviewFrequency: "High",
    },
    {
      id: "q-hash-two-sum",
      moduleSlug: "hashing",
      title: "Two Sum (hash-map version)",
      category: "intermediate",
      difficulty: "Interview",
      topic: "Complement",
      description: "Return indices of two numbers summing to target using a hash map.",
      approaches: [
        {
          name: "Optimal",
          code: "seen = {}\nfor i, x in enumerate(nums):\n    if target - x in seen: return [seen[target - x], i]\n    seen[x] = i",
          time: "O(n)",
          space: "O(n)",
        },
      ],
      pattern: "Hash Map",
      relatedAlgorithm: "hash-map",
      interviewFrequency: "Very High",
      leetcodeLinks: [
        { title: "1. Two Sum", url: "https://leetcode.com/problems/two-sum/", difficulty: "Easy" },
      ],
      estimatedMinutes: 10,
      tags: ["must-do"],
    },
    {
      id: "q-hash-group-anagrams",
      moduleSlug: "hashing",
      title: "Group Anagrams",
      category: "intermediate",
      difficulty: "Interview",
      topic: "Grouping",
      description: "Group strings that are anagrams of each other.",
      approaches: [
        {
          name: "Optimal",
          code: "from collections import defaultdict\ng = defaultdict(list)\nfor s in strs:\n    key = tuple(sorted(s))\n    g[key].append(s)\nreturn list(g.values())",
          time: "O(n·k log k)",
          space: "O(n·k)",
        },
      ],
      leetcodeLinks: [
        {
          title: "49. Group Anagrams",
          url: "https://leetcode.com/problems/group-anagrams/",
          difficulty: "Medium",
        },
      ],
      interviewFrequency: "Very High",
      estimatedMinutes: 15,
      pattern: "Hash Map",
      tags: ["must-do"],
    },
    {
      id: "q-hash-lru",
      moduleSlug: "hashing",
      title: "LRU Cache",
      category: "advanced",
      difficulty: "Interview",
      topic: "Design",
      description: "Design an LRU cache with O(1) get and put.",
      hints: ["OrderedDict, or hash-map + doubly linked list."],
      pythonSolution:
        "from collections import OrderedDict\nclass LRUCache:\n    def __init__(self, cap):\n        self.d = OrderedDict(); self.cap = cap\n    def get(self, k):\n        if k not in self.d: return -1\n        self.d.move_to_end(k); return self.d[k]\n    def put(self, k, v):\n        if k in self.d: self.d.move_to_end(k)\n        self.d[k] = v\n        if len(self.d) > self.cap: self.d.popitem(last=False)",
      leetcodeLinks: [
        {
          title: "146. LRU Cache",
          url: "https://leetcode.com/problems/lru-cache/",
          difficulty: "Medium",
        },
      ],
      interviewFrequency: "Very High",
      companies: ["Amazon", "Google", "Bloomberg"],
      estimatedMinutes: 30,
      tags: ["design", "must-do"],
    },
    {
      id: "q-hash-subarray-sum-k",
      moduleSlug: "hashing",
      title: "Subarray Sum Equals K",
      category: "advanced",
      difficulty: "Interview",
      topic: "Prefix Sum",
      description: "Count contiguous subarrays whose sum equals k.",
      approaches: [
        {
          name: "Optimal",
          code: "from collections import defaultdict\ncnt = defaultdict(int); cnt[0] = 1\ns = res = 0\nfor x in nums:\n    s += x\n    res += cnt[s - k]\n    cnt[s] += 1\nreturn res",
          time: "O(n)",
          space: "O(n)",
        },
      ],
      leetcodeLinks: [
        {
          title: "560. Subarray Sum Equals K",
          url: "https://leetcode.com/problems/subarray-sum-equals-k/",
          difficulty: "Medium",
        },
      ],
      pattern: "Prefix Sum + Hash",
      interviewFrequency: "Very High",
      estimatedMinutes: 25,
      tags: ["prefix-sum", "must-do"],
    },
  ],
};
