import type { ModuleBank } from "../types";

export const graphsBank: ModuleBank = {
  moduleSlug: "graphs",
  moduleTitle: "Graphs",
  edgeCases: [
    { case: "Cyclic graph", why: "DFS/BFS need a visited set to terminate." },
    {
      case: "Disconnected graph",
      why: "Loop the outer nodes — one traversal only visits one component.",
    },
    {
      case: "Self-loop",
      why: "Node points to itself — visited set handles it, but count edges carefully.",
    },
    {
      case: "Weighted graph",
      why: "BFS gives shortest # edges, not shortest weight — use Dijkstra.",
    },
    {
      case: "Directed graph",
      why: "Cycle detection needs DFS color (white/gray/black), not just visited.",
    },
  ],
  revisionSheet: {
    timeComplexity: [
      { op: "BFS / DFS (adjacency list)", time: "O(V + E)" },
      { op: "Dijkstra (min-heap)", time: "O((V + E) log V)" },
      { op: "Union-Find (path compression)", time: "≈ O(α(n))" },
      { op: "Topological sort", time: "O(V + E)" },
    ],
    commonMistakes: [
      "Not marking a node visited before enqueuing → duplicates",
      "Using DFS on a graph with 10^5 nodes → recursion limit",
      "Confusing tree edges with cross edges in DFS",
    ],
    memoryTricks: [
      "Adjacency list = defaultdict(list)",
      "BFS = deque, DFS = stack or recursion",
      "'Shortest path' unweighted → BFS; weighted → Dijkstra; negative → Bellman-Ford",
    ],
    mustSolve: ["q-g-num-islands", "q-g-clone", "q-g-course-schedule"],
  },
  questions: [
    {
      id: "q-g-repr",
      moduleSlug: "graphs",
      title: "Adjacency list vs adjacency matrix",
      category: "theory",
      difficulty: "Beginner",
      topic: "Representation",
      description: "Compare memory and traversal cost of both representations.",
      hints: ["Matrix: O(V²) space, O(1) edge lookup. List: O(V + E) space, O(deg) edge lookup."],
      estimatedMinutes: 10,
      tags: ["theory"],
      interviewFrequency: "High",
    },
    {
      id: "q-g-bfs",
      moduleSlug: "graphs",
      title: "BFS traversal",
      category: "implementation",
      difficulty: "Beginner",
      topic: "BFS",
      description: "Implement BFS from a source node on an adjacency list.",
      pythonSolution:
        "from collections import deque\ndef bfs(g, src):\n    seen = {src}; q = deque([src]); order = []\n    while q:\n        u = q.popleft(); order.append(u)\n        for v in g[u]:\n            if v not in seen:\n                seen.add(v); q.append(v)\n    return order",
      timeComplexity: "O(V + E)",
      spaceComplexity: "O(V)",
      estimatedMinutes: 10,
      pattern: "BFS",
      tags: ["implementation"],
    },
    {
      id: "q-g-num-islands",
      moduleSlug: "graphs",
      title: "Number of Islands",
      category: "intermediate",
      difficulty: "Interview",
      topic: "Grid DFS",
      description: "Count connected components of '1's in a grid.",
      approaches: [
        {
          name: "Optimal",
          code: "def numIslands(g):\n    if not g: return 0\n    rows, cols, count = len(g), len(g[0]), 0\n    def dfs(r, c):\n        if r<0 or c<0 or r>=rows or c>=cols or g[r][c]!='1': return\n        g[r][c] = '0'\n        for dr, dc in ((1,0),(-1,0),(0,1),(0,-1)): dfs(r+dr, c+dc)\n    for r in range(rows):\n        for c in range(cols):\n            if g[r][c]=='1': count += 1; dfs(r, c)\n    return count",
          time: "O(R·C)",
          space: "O(R·C)",
        },
      ],
      leetcodeLinks: [
        {
          title: "200. Number of Islands",
          url: "https://leetcode.com/problems/number-of-islands/",
          difficulty: "Medium",
        },
      ],
      interviewFrequency: "Very High",
      companies: ["Amazon", "Meta", "Google"],
      estimatedMinutes: 20,
      pattern: "DFS / Grid",
      tags: ["must-do", "grid"],
    },
    {
      id: "q-g-clone",
      moduleSlug: "graphs",
      title: "Clone Graph",
      category: "advanced",
      difficulty: "Interview",
      topic: "DFS + Map",
      description: "Deep copy a connected undirected graph.",
      approaches: [
        {
          name: "Optimal",
          code: "def clone(node):\n    if not node: return None\n    seen = {}\n    def dfs(u):\n        if u in seen: return seen[u]\n        copy = Node(u.val)\n        seen[u] = copy\n        for v in u.neighbors: copy.neighbors.append(dfs(v))\n        return copy\n    return dfs(node)",
          time: "O(V + E)",
          space: "O(V)",
        },
      ],
      leetcodeLinks: [
        {
          title: "133. Clone Graph",
          url: "https://leetcode.com/problems/clone-graph/",
          difficulty: "Medium",
        },
      ],
      interviewFrequency: "High",
      estimatedMinutes: 25,
      tags: ["must-do"],
    },
    {
      id: "q-g-course-schedule",
      moduleSlug: "graphs",
      title: "Course Schedule (cycle detection / topo sort)",
      category: "advanced",
      difficulty: "Interview",
      topic: "Topological Sort",
      description:
        "Given prerequisites, can you finish all courses? (detect a cycle in a directed graph)",
      approaches: [
        {
          name: "Optimal",
          code: "from collections import defaultdict, deque\ng = defaultdict(list); indeg = [0]*n\nfor a, b in prereqs: g[b].append(a); indeg[a] += 1\nq = deque([i for i in range(n) if indeg[i] == 0])\ntaken = 0\nwhile q:\n    u = q.popleft(); taken += 1\n    for v in g[u]:\n        indeg[v] -= 1\n        if indeg[v] == 0: q.append(v)\nreturn taken == n",
          time: "O(V + E)",
          space: "O(V + E)",
        },
      ],
      leetcodeLinks: [
        {
          title: "207. Course Schedule",
          url: "https://leetcode.com/problems/course-schedule/",
          difficulty: "Medium",
        },
      ],
      interviewFrequency: "Very High",
      companies: ["Amazon", "Google", "Uber"],
      estimatedMinutes: 30,
      pattern: "Topological Sort",
      tags: ["must-do", "topo-sort"],
    },
  ],
};
