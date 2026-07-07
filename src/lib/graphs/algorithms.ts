import type { GLesson, GraphSpec } from "./types";

const WEIGHTED: GraphSpec = {
  nodes: [{ id: "S" }, { id: "A" }, { id: "B" }, { id: "C" }, { id: "T" }],
  edges: [
    { from: "S", to: "A", weight: 2 },
    { from: "S", to: "B", weight: 5 },
    { from: "A", to: "B", weight: 1 },
    { from: "A", to: "C", weight: 4 },
    { from: "B", to: "T", weight: 3 },
    { from: "C", to: "T", weight: 1 },
  ],
  weighted: true,
};

const WEIGHTED_WITH_NEGATIVE: GraphSpec = {
  nodes: [{ id: "S" }, { id: "A" }, { id: "B" }, { id: "T" }],
  edges: [
    { from: "S", to: "A", weight: 4 },
    { from: "S", to: "B", weight: 5 },
    { from: "A", to: "B", weight: -3 },
    { from: "A", to: "T", weight: 6 },
    { from: "B", to: "T", weight: 2 },
  ],
  directed: true,
  weighted: true,
};

const MST_DEMO: GraphSpec = {
  nodes: [{ id: "A" }, { id: "B" }, { id: "C" }, { id: "D" }, { id: "E" }],
  edges: [
    { from: "A", to: "B", weight: 2 },
    { from: "A", to: "C", weight: 3 },
    { from: "B", to: "C", weight: 1 },
    { from: "B", to: "D", weight: 4 },
    { from: "C", to: "D", weight: 5 },
    { from: "D", to: "E", weight: 2 },
  ],
  weighted: true,
};

const DAG: GraphSpec = {
  nodes: [{ id: "shirt" }, { id: "jacket" }, { id: "pants" }, { id: "shoes" }, { id: "belt" }],
  edges: [
    { from: "shirt", to: "jacket" },
    { from: "pants", to: "shoes" },
    { from: "pants", to: "belt" },
  ],
  directed: true,
};

export const G_ALGORITHMS: GLesson[] = [
  {
    slug: "overview",
    title: "Algorithms Overview",
    eyebrow: "Algorithms · 1",
    description: "The core algorithm families built on top of BFS and DFS.",
    difficulty: "Beginner",
    readMinutes: 3,
    sections: [
      {
        type: "theory",
        bullets: [
          "Shortest path (single-source): Dijkstra (non-negative weights), Bellman-Ford (handles negative weights, detects negative cycles).",
          "Minimum spanning tree: Prim (grows one tree), Kruskal (sorts all edges globally).",
          "Ordering: Topological sort — a valid processing order for a DAG.",
          "Connectivity: Union-Find — near-O(1) union/find, the engine behind Kruskal and cycle detection.",
        ],
      },
      {
        type: "callout",
        kind: "info",
        text: "Every algorithm below is BFS or DFS with one extra piece of bookkeeping — a distance table, a priority choice, or a disjoint-set structure.",
      },
    ],
  },

  {
    slug: "dijkstra",
    title: "Dijkstra's Algorithm",
    eyebrow: "Algorithms · 2",
    description: "Single-source shortest paths on graphs with non-negative weights.",
    difficulty: "Intermediate",
    readMinutes: 8,
    sections: [
      {
        type: "theory",
        text: "Dijkstra's algorithm finds the shortest distance from a source to every other vertex. It repeatedly picks the unvisited vertex with the smallest known distance, 'locks it in' as final, and relaxes (tries to shorten) the distance to each of its neighbours. Because it always expands the closest frontier vertex first, it never needs to revisit a locked-in vertex — which is exactly why it breaks on negative weights.",
      },
      {
        type: "dijkstraPlayer",
        spec: WEIGHTED,
        start: "S",
        caption: "Watch distances update as each cheapest unvisited vertex is locked in.",
      },
      {
        type: "code",
        title: "python — full implementation (binary heap)",
        code: `import heapq

def dijkstra(graph, start):
    """graph: {u: [(v, weight), ...]}. Returns shortest distance from start to every vertex."""
    dist = {start: 0}
    pq = [(0, start)]          # (distance, vertex)
    visited = set()
    while pq:
        d, u = heapq.heappop(pq)
        if u in visited:
            continue
        visited.add(u)
        for v, w in graph.get(u, []):
            nd = d + w
            if v not in dist or nd < dist[v]:
                dist[v] = nd
                heapq.heappush(pq, (nd, v))
    return dist

graph = {"S": [("A", 2), ("B", 5)], "A": [("B", 1), ("C", 4)],
         "B": [("T", 3)], "C": [("T", 1)], "T": []}
print(dijkstra(graph, "S"))   # {'S': 0, 'A': 2, 'B': 3, 'C': 6, 'T': 6}`,
      },
      {
        type: "dryRun",
        headers: ["Locked in", "dist[S]", "dist[A]", "dist[B]", "dist[C]", "dist[T]"],
        rows: [
          ["S", "0", "∞", "∞", "∞", "∞"],
          ["A (2)", "0", "2", "5", "6", "∞"],
          ["B (3)", "0", "2", "3", "6", "6"],
          ["C (6)", "0", "2", "3", "6", "6"],
          ["T (6)", "0", "2", "3", "6", "6"],
        ],
        caption: "B's distance improves from 5 to 3 once A is locked in (2 + 1 via A→B).",
      },
      {
        type: "complexity",
        rows: [
          { op: "Binary heap", time: "O((V + E) log V)", space: "O(V)" },
          {
            op: "Array (no heap)",
            time: "O(V²)",
            space: "O(V)",
            note: "simpler, fine for dense/small graphs",
          },
        ],
      },
      {
        type: "mistakes",
        items: [
          "Running Dijkstra on a graph with negative edge weights — it will silently produce wrong answers instead of erroring. Use Bellman-Ford instead.",
          "Not skipping stale heap entries (`if u in visited: continue`) — Python's heapq has no decrease-key, so stale, larger-distance copies of a vertex can linger in the heap.",
          "Forgetting that Dijkstra gives shortest distance to *every* vertex, not just the target — if you only need one destination you can stop early once it's popped, but the full run is often just as fast.",
        ],
      },
      {
        type: "callout",
        kind: "interview",
        title: "Interview signal",
        text: "'Cheapest flight route', 'minimum cost path', 'network delay time' with non-negative weights — that's Dijkstra.",
      },
      {
        type: "practice",
        groups: [
          {
            level: "Intermediate",
            items: [
              {
                title: "Network Delay Time",
                url: "https://leetcode.com/problems/network-delay-time/",
                difficulty: "Medium",
                pattern: "Dijkstra",
              },
            ],
          },
          {
            level: "Advanced",
            items: [
              {
                title: "Path with Maximum Probability",
                url: "https://leetcode.com/problems/path-with-maximum-probability/",
                difficulty: "Medium",
                pattern: "Dijkstra variant (max product)",
              },
              {
                title: "Cheapest Flights Within K Stops",
                url: "https://leetcode.com/problems/cheapest-flights-within-k-stops/",
                difficulty: "Medium",
                pattern: "Bellman-Ford / constrained Dijkstra",
              },
            ],
          },
        ],
      },
      {
        type: "references",
        items: [
          {
            label: "CLRS §24.3 — Dijkstra's algorithm",
            url: "https://mitpress.mit.edu/9780262046305/",
          },
        ],
      },
    ],
  },

  {
    slug: "bellman-ford",
    title: "Bellman-Ford Algorithm",
    eyebrow: "Algorithms · 3",
    description:
      "Single-source shortest paths that also handles negative weights — and detects negative cycles.",
    difficulty: "Intermediate",
    readMinutes: 7,
    sections: [
      {
        type: "theory",
        text: "Bellman-Ford relaxes every edge in the graph, V−1 times. That's it. Where Dijkstra commits greedily to the closest vertex, Bellman-Ford is deliberately brute-force — by trying every edge repeatedly, it correctly propagates negative weights, and a final V-th pass that still finds an improvement proves a negative cycle exists.",
      },
      {
        type: "bellmanFordPlayer",
        spec: WEIGHTED_WITH_NEGATIVE,
        start: "S",
        caption: "Note the negative A→B edge — Dijkstra would get this wrong.",
      },
      {
        type: "code",
        title: "python — full implementation",
        code: `def bellman_ford(vertices, edges, start):
    """edges: [(u, v, weight), ...]. Returns (dist, has_negative_cycle)."""
    dist = {v: float("inf") for v in vertices}
    dist[start] = 0
    for _ in range(len(vertices) - 1):
        changed = False
        for u, v, w in edges:
            if dist[u] != float("inf") and dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                changed = True
        if not changed:
            break   # converged early — no need to run all V-1 passes
    # One more pass: if anything still improves, there's a negative cycle.
    has_negative_cycle = any(
        dist[u] != float("inf") and dist[u] + w < dist[v]
        for u, v, w in edges
    )
    return dist, has_negative_cycle

vertices = ["S", "A", "B", "T"]
edges = [("S", "A", 4), ("S", "B", 5), ("A", "B", -3), ("A", "T", 6), ("B", "T", 2)]
print(bellman_ford(vertices, edges, "S"))
# ({'S': 0, 'A': 4, 'B': 1, 'T': 3}, False)`,
      },
      {
        type: "complexity",
        rows: [
          { op: "Time", time: "O(V · E)" },
          { op: "Space", time: "O(V)" },
        ],
      },
      {
        type: "mistakes",
        items: [
          "Stopping after V-1 passes without the extra verification pass — you'll miss negative cycles entirely.",
          "Forgetting `dist[u] != inf` before adding a weight — inf + (negative number) can produce nonsense instead of staying inf.",
          "Using Bellman-Ford when Dijkstra would do — it's correct on non-negative graphs too, but O(V·E) is much slower than O((V+E) log V).",
        ],
      },
      {
        type: "callout",
        kind: "interview",
        title: "Interview signal",
        text: "Any 'shortest path' problem that explicitly mentions negative weights, or asks you to detect an arbitrage/negative cycle, wants Bellman-Ford.",
      },
      {
        type: "references",
        items: [
          {
            label: "CLRS §24.1 — The Bellman-Ford algorithm",
            url: "https://mitpress.mit.edu/9780262046305/",
          },
        ],
      },
    ],
  },

  {
    slug: "prim",
    title: "Prim's Algorithm (MST)",
    eyebrow: "Algorithms · 4",
    description:
      "Grow a minimum spanning tree one cheapest edge at a time, from a single starting vertex.",
    difficulty: "Intermediate",
    readMinutes: 6,
    sections: [
      {
        type: "theory",
        text: "A minimum spanning tree (MST) connects all vertices with the minimum total edge weight, using exactly V−1 edges and no cycles. Prim's algorithm builds it greedily: start from any vertex, and repeatedly add the cheapest edge that connects a vertex already in the tree to one that isn't.",
      },
      {
        type: "primPlayer",
        spec: MST_DEMO,
        start: "A",
        caption: "Each step adds the cheapest edge crossing the tree's current boundary.",
      },
      {
        type: "code",
        title: "python — full implementation (binary heap)",
        code: `import heapq

def prim(graph, start):
    """graph: {u: [(v, weight), ...]}. Returns list of MST edges and total cost."""
    visited = {start}
    edges = [(w, start, v) for v, w in graph[start]]
    heapq.heapify(edges)
    mst, cost = [], 0
    while edges and len(visited) < len(graph):
        w, u, v = heapq.heappop(edges)
        if v in visited:
            continue
        visited.add(v)
        mst.append((u, v, w))
        cost += w
        for nxt, nw in graph[v]:
            if nxt not in visited:
                heapq.heappush(edges, (nw, v, nxt))
    return mst, cost`,
      },
      { type: "complexity", rows: [{ op: "Binary heap", time: "O(E log V)", space: "O(V + E)" }] },
      {
        type: "mistakes",
        items: [
          "Forgetting to skip an edge whose far endpoint is already in the tree — without the `if v in visited: continue` check, the heap can re-add stale, already-connected edges.",
          "Assuming the MST is unique — if multiple edges tie on weight, there can be more than one valid MST, all with the same total cost.",
        ],
      },
      {
        type: "callout",
        kind: "tip",
        text: "Prim is usually faster when the graph is dense (many edges relative to vertices); Kruskal tends to win on sparse graphs since it doesn't need per-vertex adjacency exploration.",
      },
    ],
  },

  {
    slug: "kruskal",
    title: "Kruskal's Algorithm (MST)",
    eyebrow: "Algorithms · 5",
    description:
      "Sort every edge by weight, then greedily add any edge that doesn't create a cycle.",
    difficulty: "Intermediate",
    readMinutes: 6,
    sections: [
      {
        type: "theory",
        text: "Kruskal's algorithm takes a completely different angle on the same problem: sort every edge in the graph by weight, then walk the sorted list adding an edge whenever its two endpoints aren't already connected. Union-Find is what makes 'already connected?' an almost-O(1) question instead of a full traversal.",
      },
      {
        type: "kruskalPlayer",
        spec: MST_DEMO,
        caption: "Edges are considered cheapest-first; a red 'skip' means it would form a cycle.",
      },
      {
        type: "code",
        title: "python — full implementation",
        code: `class DSU:
    def __init__(self, vertices):
        self.parent = {v: v for v in vertices}
        self.rank = {v: 0 for v in vertices}

    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])   # path compression
        return self.parent[x]

    def union(self, a, b):
        ra, rb = self.find(a), self.find(b)
        if ra == rb:
            return False               # already connected — would form a cycle
        if self.rank[ra] < self.rank[rb]:
            ra, rb = rb, ra
        self.parent[rb] = ra
        if self.rank[ra] == self.rank[rb]:
            self.rank[ra] += 1
        return True

def kruskal(vertices, edges):
    """edges: [(u, v, weight), ...]. Returns list of MST edges and total cost."""
    dsu = DSU(vertices)
    mst, cost = [], 0
    for u, v, w in sorted(edges, key=lambda e: e[2]):
        if dsu.union(u, v):
            mst.append((u, v, w))
            cost += w
    return mst, cost`,
      },
      {
        type: "complexity",
        rows: [
          { op: "Sort edges", time: "O(E log E)" },
          {
            op: "Union-Find operations",
            time: "O(E · α(V))",
            note: "α is the inverse Ackermann function — effectively constant",
          },
          { op: "Overall", time: "O(E log E)" },
        ],
      },
      {
        type: "mistakes",
        items: [
          "Implementing Union-Find without path compression or union by rank — correctness is unaffected but you lose the near-constant-time guarantee.",
          "Comparing vertex identity instead of calling find() to compare set roots when checking for a cycle.",
        ],
      },
      {
        type: "callout",
        kind: "interview",
        title: "Interview signal",
        text: "'Connect all cities with minimum cable cost' or 'minimum cost to connect all points' — both are MST problems; Kruskal is usually the faster one to code correctly under time pressure.",
      },
      {
        type: "practice",
        groups: [
          {
            level: "Intermediate",
            items: [
              {
                title: "Min Cost to Connect All Points",
                url: "https://leetcode.com/problems/min-cost-to-connect-all-points/",
                difficulty: "Medium",
                pattern: "MST (Prim or Kruskal)",
              },
            ],
          },
        ],
      },
    ],
  },

  {
    slug: "topological-sort",
    title: "Topological Sort",
    eyebrow: "Algorithms · 6",
    description:
      "A valid processing order for a DAG — every dependency comes before what depends on it.",
    difficulty: "Intermediate",
    readMinutes: 6,
    sections: [
      {
        type: "theory",
        text: "A topological sort orders the vertices of a directed acyclic graph (DAG) so that every edge u→v places u before v. It only exists for DAGs — a cycle makes it impossible to satisfy every ordering constraint at once. Kahn's algorithm builds the order using in-degrees: repeatedly remove any vertex with in-degree 0 (nothing left depends on going through it first).",
      },
      {
        type: "topoSortPlayer",
        spec: DAG,
        caption:
          "'shirt' before 'jacket'; 'pants' before both 'shoes' and 'belt' — a getting-dressed dependency graph.",
      },
      {
        type: "code",
        title: "python — Kahn's algorithm (BFS-based)",
        code: `from collections import deque

def topological_sort(graph, vertices):
    indegree = {v: 0 for v in vertices}
    for u in graph:
        for v in graph[u]:
            indegree[v] += 1

    queue = deque(v for v in vertices if indegree[v] == 0)
    order = []
    while queue:
        u = queue.popleft()
        order.append(u)
        for v in graph.get(u, []):
            indegree[v] -= 1
            if indegree[v] == 0:
                queue.append(v)

    if len(order) != len(vertices):
        raise ValueError("graph has a cycle — no valid topological order")
    return order

graph = {"shirt": ["jacket"], "pants": ["shoes", "belt"]}
vertices = ["shirt", "jacket", "pants", "shoes", "belt"]
print(topological_sort(graph, vertices))
# ['shirt', 'pants', 'jacket', 'shoes', 'belt']  (one of several valid orders)`,
      },
      {
        type: "code",
        title: "python — DFS-based alternative",
        code: `def topological_sort_dfs(graph, vertices):
    visited, order = set(), []
    def dfs(u):
        visited.add(u)
        for v in graph.get(u, []):
            if v not in visited:
                dfs(v)
        order.append(u)          # post-order: append after all descendants
    for v in vertices:
        if v not in visited:
            dfs(v)
    return order[::-1]           # reverse post-order = topological order`,
      },
      {
        type: "complexity",
        rows: [
          { op: "Time (either version)", time: "O(V + E)" },
          { op: "Space", time: "O(V)" },
        ],
      },
      {
        type: "mistakes",
        items: [
          "Not checking `len(order) != len(vertices)` at the end — silently returning a partial, invalid order when the graph actually has a cycle.",
          "Forgetting to reverse the result in the DFS-based version — the raw post-order is the *reverse* topological order.",
        ],
      },
      {
        type: "callout",
        kind: "interview",
        title: "Interview signal",
        text: "'Course schedule', 'build order', 'task dependencies' — any 'X must happen before Y' phrasing is a topological sort problem.",
      },
      {
        type: "practice",
        groups: [
          {
            level: "Intermediate",
            items: [
              {
                title: "Course Schedule",
                url: "https://leetcode.com/problems/course-schedule/",
                difficulty: "Medium",
                pattern: "Cycle detection + topo sort",
              },
              {
                title: "Course Schedule II",
                url: "https://leetcode.com/problems/course-schedule-ii/",
                difficulty: "Medium",
                pattern: "Topological sort",
              },
            ],
          },
        ],
      },
    ],
  },

  {
    slug: "union-find",
    title: "Union-Find (Disjoint Set Union)",
    eyebrow: "Algorithms · 7",
    description:
      "Near-constant-time union and find operations — the engine behind Kruskal and cycle detection.",
    difficulty: "Intermediate",
    readMinutes: 6,
    sections: [
      {
        type: "theory",
        text: "Union-Find (a.k.a. Disjoint Set Union) maintains a partition of elements into disjoint sets, supporting two operations: find(x) — which set is x in? — and union(x, y) — merge x and y's sets. With two optimizations, path compression and union by rank, both operations run in amortized O(α(V)) time, where α is the inverse Ackermann function — effectively constant for any input size you'll ever see.",
      },
      {
        type: "unionFindPlayground",
        n: 8,
        caption:
          "Try union(a, b) a few times, then find(a) — notice path compression flattening the tree.",
      },
      {
        type: "code",
        title: "python — full implementation",
        code: `class DSU:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n

    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])   # path compression
        return self.parent[x]

    def union(self, x, y):
        rx, ry = self.find(x), self.find(y)
        if rx == ry:
            return False
        if self.rank[rx] < self.rank[ry]:
            rx, ry = ry, rx
        self.parent[ry] = rx
        if self.rank[rx] == self.rank[ry]:
            self.rank[rx] += 1
        return True

dsu = DSU(6)
dsu.union(0, 1)
dsu.union(1, 2)
print(dsu.find(0) == dsu.find(2))   # True — 0, 1, 2 are in the same set
print(dsu.find(0) == dsu.find(3))   # False`,
      },
      {
        type: "complexity",
        rows: [
          {
            op: "find / union (with both optimizations)",
            time: "O(α(V))",
            note: "amortized, effectively O(1)",
          },
          {
            op: "find / union (no optimizations)",
            time: "O(V)",
            note: "worst case — a degenerate chain",
          },
        ],
      },
      {
        type: "mistakes",
        items: [
          "Implementing only one of path compression / union by rank and expecting the same guarantee — either alone gives O(log V), you need both for the near-constant bound.",
          "Comparing `x == y` instead of `find(x) == find(y)` to check if two elements are already connected.",
        ],
      },
      {
        type: "callout",
        kind: "interview",
        title: "Interview signal",
        text: "'Number of connected components', 'redundant connection', 'accounts merge' — any problem about grouping/merging things over a stream of pair-relations wants Union-Find.",
      },
      {
        type: "practice",
        groups: [
          {
            level: "Intermediate",
            items: [
              {
                title: "Number of Provinces",
                url: "https://leetcode.com/problems/number-of-provinces/",
                difficulty: "Medium",
                pattern: "Union-Find",
              },
              {
                title: "Redundant Connection",
                url: "https://leetcode.com/problems/redundant-connection/",
                difficulty: "Medium",
                pattern: "Union-Find cycle detection",
              },
            ],
          },
          {
            level: "Advanced",
            items: [
              {
                title: "Accounts Merge",
                url: "https://leetcode.com/problems/accounts-merge/",
                difficulty: "Medium",
                pattern: "Union-Find over strings",
              },
            ],
          },
        ],
      },
    ],
  },

  {
    slug: "review",
    title: "Algorithms — Review",
    eyebrow: "Algorithms · 8",
    description: "Which algorithm for which problem — a decision cheat sheet.",
    difficulty: "Beginner",
    readMinutes: 4,
    sections: [
      {
        type: "table",
        headers: ["If you need…", "Reach for"],
        rows: [
          ["Shortest path, non-negative weights", "Dijkstra"],
          ["Shortest path, negative weights allowed", "Bellman-Ford"],
          ["Minimum spanning tree, dense graph", "Prim"],
          ["Minimum spanning tree, sparse graph / edge list given", "Kruskal"],
          ["Valid ordering of dependencies", "Topological sort (Kahn's)"],
          ["Fast 'are these connected?' over many merges", "Union-Find"],
        ],
      },
      {
        type: "quiz",
        items: [
          {
            q: "A graph has a negative-weight edge. Which shortest-path algorithm is safe to use?",
            choices: [
              "Dijkstra",
              "Bellman-Ford",
              "Either — they always agree",
              "Neither works with negative weights",
            ],
            answer: 1,
            explain:
              "Dijkstra's greedy 'lock in the closest vertex' step assumes distances only ever increase — a later negative edge can violate that after the fact.",
          },
          {
            q: "Which data structure makes Kruskal's cycle check fast?",
            choices: [
              "A priority queue",
              "A hash set of visited vertices",
              "Union-Find",
              "An adjacency matrix",
            ],
            answer: 2,
            explain:
              "Union-Find answers 'are u and v already connected?' in near-constant time as edges are added.",
          },
        ],
      },
      {
        type: "callout",
        kind: "info",
        title: "What's next",
        text: "This covers the core algorithm set requested for this pass. Floyd-Warshall, A*, strongly connected components (Kosaraju/Tarjan), and network-flow algorithms (Ford-Fulkerson, Edmonds-Karp) are natural next additions to this tier.",
      },
    ],
  },
];
