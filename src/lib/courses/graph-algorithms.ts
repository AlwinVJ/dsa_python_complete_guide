import type { Course } from "./types";

export const graphAlgorithmsCourse: Course = {
  slug: "graph-algorithms",
  title: "Graph Algorithms",
  tagline: "Traversals, shortest paths, spanning trees, and connectivity.",
  category: "algorithm",
  order: 17,
  icon: "Waypoints",
  lessons: [
    {
      slug: "introduction",
      title: "Introduction",
      theory: "Graph algorithms operate on vertices and edges. Most run in O(V + E) or O(E log V) — memorise those two shapes.",
    },
    {
      slug: "bfs",
      title: "BFS Deep Dive",
      theory: "Explore layer by layer. Yields shortest paths in unweighted graphs and level orderings in trees.",
      code: `from collections import deque\ndef bfs_shortest(src, dst, G):\n    q, dist = deque([src]), {src: 0}\n    while q:\n        u = q.popleft()\n        if u == dst: return dist[u]\n        for v in G[u]:\n            if v not in dist:\n                dist[v] = dist[u] + 1; q.append(v)\n    return -1`,
    },
    {
      slug: "dfs",
      title: "DFS Deep Dive",
      theory: "Recurse or use an explicit stack. Powers cycle detection, topological sort, SCC (Tarjan/Kosaraju), and articulation points.",
    },
    {
      slug: "dijkstra",
      title: "Dijkstra",
      theory: "Shortest paths in a weighted graph with non-negative edges. Priority queue + relaxation.",
      complexity: [{ op: "with heap", time: "O((V+E) log V)" }],
    },
    {
      slug: "bellman-ford",
      title: "Bellman-Ford",
      theory: "Relax every edge V−1 times. Handles negative weights and detects negative cycles.",
      complexity: [{ op: "time", time: "O(V·E)" }],
    },
    {
      slug: "floyd-warshall",
      title: "Floyd-Warshall",
      theory: "All-pairs shortest paths via triple-nested loop with an intermediate vertex k.",
      code: `def fw(dist):\n    V = len(dist)\n    for k in range(V):\n        for i in range(V):\n            for j in range(V):\n                if dist[i][k] + dist[k][j] < dist[i][j]:\n                    dist[i][j] = dist[i][k] + dist[k][j]`,
      complexity: [{ op: "time", time: "O(V³)" }],
    },
    {
      slug: "mst",
      title: "Minimum Spanning Tree",
      theory: "Kruskal — sort edges, union-find. Prim — grow tree with a min-heap. Both O(E log V).",
    },
    {
      slug: "topological-sort",
      title: "Topological Sort",
      theory: "Order a DAG so every edge goes forward. Kahn (BFS on in-degrees) or DFS-based post-order.",
    },
    {
      slug: "scc",
      title: "Strongly Connected Components",
      theory: "Tarjan's algorithm finds SCCs in a single DFS using low-link numbers. Kosaraju does two DFS passes on G and its transpose. Both O(V + E).",
    },
    {
      slug: "articulation-points",
      title: "Articulation Points & Bridges",
      theory: "Vertices/edges whose removal disconnects a component. Found with a DFS discovery/low array in O(V + E).",
    },
    {
      slug: "network-flow",
      title: "Network Flow",
      theory: "Max flow between source and sink. Edmonds-Karp = BFS-based Ford-Fulkerson in O(V·E²).",
    },
    {
      slug: "practice",
      title: "Practice",
      practice: [
        { title: "LC 743 · Network Delay Time", url: "https://leetcode.com/problems/network-delay-time/", difficulty: "Medium" },
        { title: "LC 787 · Cheapest Flights Within K Stops", url: "https://leetcode.com/problems/cheapest-flights-within-k-stops/", difficulty: "Medium" },
        { title: "LC 1584 · Min Cost to Connect All Points", url: "https://leetcode.com/problems/min-cost-to-connect-all-points/", difficulty: "Medium" },
      ],
    },
    {
      slug: "quiz",
      title: "Quiz",
      quiz: {
        q: "Which algorithm handles negative edge weights (without negative cycles)?",
        choices: ["Dijkstra", "BFS", "Bellman-Ford", "Prim"],
        answer: 2,
      },
    },
    { slug: "references", title: "References", references: [{ label: "CLRS Part VI — Graph Algorithms", url: "https://mitpress.mit.edu/9780262046305/" }] },
  ],
};
