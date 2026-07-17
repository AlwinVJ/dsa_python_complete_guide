import type { Course } from "./types";

export const graphAlgorithmsCourse: Course = {
  slug: "graph-algorithms",
  title: "Graph Algorithms",
  tagline: "Traversals, shortest paths, spanning trees, and connectivity.",
  category: "algorithm",
  order: 7,
  icon: "Waypoints",
  courseLayout: "overview",
  comingSoon: false,
  overview: {
    introduction:
      "Graph algorithms model the world as vertices connected by edges — road maps, social networks, dependency graphs, computer networks, and game boards all reduce to graphs. This module covers the essentials: traversals (BFS, DFS), shortest paths (Dijkstra, Bellman-Ford, Floyd-Warshall), minimum spanning trees (Prim, Kruskal), topological ordering on DAGs, connectivity, and cycle detection.",
    whyLearn:
      "Almost every non-trivial system problem eventually turns into a graph problem — routing, scheduling, dependency resolution, compilers, GPS, package managers, matchmaking, and recommendation systems all rely on the algorithms in this module. Graph questions are also the single most common family in senior coding interviews.",
    learningObjectives: [
      "Represent graphs with adjacency lists, matrices, and edge lists — and pick the right one.",
      "Traverse graphs with BFS and DFS and know when each is the correct tool.",
      "Solve shortest-path problems with Dijkstra, Bellman-Ford, and Floyd-Warshall.",
      "Build minimum spanning trees with Prim's and Kruskal's algorithms.",
      "Detect cycles, find connected and strongly connected components, and topologically sort a DAG.",
      "Analyse graph-algorithm complexity in terms of V (vertices) and E (edges).",
    ],
    realWorldApplications: [
      "Navigation & maps — Dijkstra / A* power Google Maps, Uber, Waze.",
      "Networking — routing protocols (OSPF, RIP) use shortest-path algorithms.",
      "Dependency resolution — package managers (npm, pip) topologically sort dependencies.",
      "Social networks — BFS finds degrees of separation and friend suggestions.",
      "Compilers — build systems topo-sort tasks; SSA form relies on dominator graphs.",
      "Infrastructure — MST algorithms design telecom, electrical, and pipeline networks.",
    ],
    advantages: [
      "Small vocabulary of algorithms unlocks a huge class of real problems.",
      "Most core algorithms run in O(V + E) or O((V + E) log V) — very fast in practice.",
      "Reusable building blocks: BFS/DFS, priority queues, union-find compose into bigger solutions.",
    ],
    limitations: [
      "Wrong representation (matrix vs list) can blow up memory or slow traversals.",
      "Dijkstra breaks on negative edges — must switch to Bellman-Ford.",
      "Dense graphs blur the O(V + E) advantage; some algorithms become O(V²).",
      "Recursive DFS can blow the stack on 10⁵-vertex graphs — prefer iterative DFS.",
    ],
    prerequisites: [
      "Comfort with arrays, hash maps, queues, stacks, and heaps.",
      "Basic recursion and iterative traversal.",
      "Big-O analysis — you'll be comparing O(V + E), O(V·E), and O((V+E) log V) constantly.",
    ],
    estimatedTime: "8–10 Hours",
    difficulty: 4,
  },
  infoCard: {
    estimatedTime: "8–10 Hours",
    difficulty: 4,
    practiceRequired: true,
    language: "Python",
  },
  whoIsThisFor: [
    "Learners who finished the Graphs data-structure module and want to apply the classic algorithms.",
    "Interview candidates targeting FAANG / senior roles — graphs dominate the hard question pool.",
    "Engineers building routing, scheduling, dependency, or network systems.",
  ],
  ctaText: "Open Graph Algorithms Playground →",
  ctaRoute: "/playgrounds/graph-algorithms",
  lessons: [
    {
      slug: "introduction",
      title: "Introduction to Graph Algorithms",
      tagline: "The universal language of vertices and edges.",
      theory:
        "A graph is a set of vertices (V) connected by edges (E). Almost every non-trivial algorithmic problem — routing, scheduling, dependency resolution, matchmaking, compilers — is a graph problem in disguise. Graphs can be directed or undirected, weighted or unweighted, cyclic or acyclic (DAGs), dense or sparse. Choosing the right algorithm always starts with recognising which of these your problem has.\n\nMost core graph algorithms run in O(V + E) or O((V + E) log V) — memorise those two shapes.",
      bullets: [
        "Vertices (nodes) + edges (connections) = a graph.",
        "Directed vs undirected, weighted vs unweighted, cyclic vs acyclic — every problem lands on one axis of each.",
        "Sparse graph → adjacency list. Dense graph → adjacency matrix.",
        "Traversal (BFS/DFS) is the foundation; everything else builds on it.",
      ],
      tip: "Before writing code, answer three questions: Is the graph directed? Are edges weighted? Do I need one source or all pairs? Those three answers pick the algorithm.",
    },
    {
      slug: "graph-traversal-overview",
      title: "Graph Traversal Overview",
      tagline: "Two traversal orders that power every other algorithm.",
      theory:
        "Graph traversal means visiting every reachable vertex from a source, exactly once. BFS explores in layers (a queue); DFS dives as deep as possible before backtracking (a stack or recursion). Both run in O(V + E) on an adjacency list.\n\nA visited set is mandatory — without it, cycles cause infinite loops.",
      bullets: [
        "BFS uses a FIFO queue and yields shortest paths in *unweighted* graphs.",
        "DFS uses a stack (or recursion) and powers cycle detection, topo sort, SCC, and articulation points.",
        "Mark a vertex visited *when you enqueue/push it*, not when you pop — otherwise duplicates flood the queue.",
        "Disconnected graphs need an outer loop over all vertices to visit every component.",
      ],
      code: `# Adjacency list representation
from collections import defaultdict
G = defaultdict(list)
edges = [(1,2), (1,3), (2,4), (3,4)]
for u, v in edges:
    G[u].append(v)
    G[v].append(u)   # omit for directed graphs`,
      complexity: [
        { op: "BFS / DFS (adjacency list)", time: "O(V + E)", space: "O(V)" },
        { op: "BFS / DFS (adjacency matrix)", time: "O(V²)", space: "O(V)" },
      ],
    },
    {
      slug: "bfs",
      title: "Breadth-First Search (BFS)",
      tagline: "Layer by layer — the shortest-path traversal in unweighted graphs.",
      theory:
        "BFS starts from a source vertex and explores every vertex at distance 1, then distance 2, and so on. Because it fans out uniformly, it gives the shortest path (in number of edges) from the source to every other vertex in an unweighted graph. Implementation: a FIFO queue plus a visited set; enqueue neighbours only if they haven't been seen.\n\nBFS is the right traversal whenever the problem mentions 'shortest', 'level', or 'minimum steps' on an unweighted graph or grid.",
      code: `from collections import deque

def bfs(G, src):
    seen = {src}
    q = deque([src])
    order = []
    while q:
        u = q.popleft()
        order.append(u)
        for v in G[u]:
            if v not in seen:
                seen.add(v)
                q.append(v)
    return order

def bfs_shortest(G, src, dst):
    if src == dst: return 0
    dist = {src: 0}
    q = deque([src])
    while q:
        u = q.popleft()
        for v in G[u]:
            if v not in dist:
                dist[v] = dist[u] + 1
                if v == dst: return dist[v]
                q.append(v)
    return -1`,
      complexity: [
        { op: "BFS traversal", time: "O(V + E)", space: "O(V)" },
        { op: "Shortest path (unweighted)", time: "O(V + E)", space: "O(V)" },
      ],
      mistakes: [
        "Marking a vertex visited on pop instead of on enqueue → duplicates in the queue.",
        "Using BFS on a *weighted* graph and expecting shortest-weight paths — it only gives fewest edges.",
        "Forgetting to loop over all vertices when the graph is disconnected.",
      ],
      tip: "BFS on a grid is the same code — treat each cell as a vertex and generate neighbours with the 4-direction (or 8-direction) delta list.",
      quiz: {
        q: "What does BFS return in an unweighted graph?",
        choices: [
          "The shortest path by total edge weight.",
          "The shortest path by number of edges.",
          "A topological ordering.",
          "The minimum spanning tree.",
        ],
        answer: 1,
        explain:
          "BFS visits by layers, so it finds the path with the fewest edges — the shortest path only when all edges are unweighted.",
      },
    },
    {
      slug: "dfs",
      title: "Depth-First Search (DFS)",
      tagline: "Dive deep, backtrack, repeat.",
      theory:
        "DFS explores as far as possible along each branch before backtracking. Implement it recursively or with an explicit stack. DFS is the workhorse under cycle detection, topological sorting, connected/strongly-connected components, bridges and articulation points, and many DP-on-graph patterns.\n\nOn graphs with 10⁵+ vertices, prefer the iterative version — Python's recursion limit is only 1000 by default.",
      code: `def dfs(G, src):
    seen = set()
    order = []
    def go(u):
        seen.add(u)
        order.append(u)
        for v in G[u]:
            if v not in seen:
                go(v)
    go(src)
    return order

def dfs_iter(G, src):
    seen, order = {src}, []
    stack = [src]
    while stack:
        u = stack.pop()
        order.append(u)
        for v in G[u]:
            if v not in seen:
                seen.add(v)
                stack.append(v)
    return order`,
      complexity: [
        { op: "DFS traversal", time: "O(V + E)", space: "O(V)" },
      ],
      mistakes: [
        "Recursive DFS on 10⁵-vertex graphs → RecursionError. Switch to iterative or `sys.setrecursionlimit`.",
        "Confusing 'visited' (finished processing) with 'in current DFS path' — cycle detection in directed graphs needs both.",
      ],
    },
    {
      slug: "bfs-vs-dfs",
      title: "BFS vs DFS",
      tagline: "Two traversals — completely different jobs.",
      theory:
        "BFS and DFS both visit every reachable vertex in O(V + E), but they answer different questions. BFS is the go-to for shortest-path-in-edges, level ordering, and 'minimum steps to X' problems. DFS is the go-to for structural questions — cycle detection, topo sort, component labelling, bridges, articulation points, and path enumeration.",
      complexity: [
        { op: "BFS (queue-based, iterative)", time: "O(V + E)", space: "O(V)" },
        { op: "DFS (stack / recursion)", time: "O(V + E)", space: "O(V)" },
      ],
      bullets: [
        "Shortest path in unweighted graph or grid → BFS.",
        "Cycle detection, topological sort, SCC, bridges → DFS.",
        "Level-by-level processing (word ladder, tree levels) → BFS.",
        "All paths / all combinations → DFS + backtracking.",
      ],
      quiz: {
        q: "You need to find the minimum number of moves for a knight to reach a target square. Which traversal fits best?",
        choices: ["DFS", "BFS", "Dijkstra", "Floyd-Warshall"],
        answer: 1,
        explain:
          "Each move has equal 'cost' (one step), so BFS gives the minimum number of moves in O(V + E).",
      },
    },
    {
      slug: "topological-sort",
      title: "Topological Sort",
      tagline: "Order a DAG so every edge points forward.",
      theory:
        "A topological sort of a Directed Acyclic Graph (DAG) is a linear ordering of vertices such that for every directed edge u → v, u comes before v. It's the algorithm behind course prerequisites, build systems (make, bazel), task schedulers, and dependency resolvers.\n\nTwo canonical algorithms — Kahn's BFS-based approach on in-degrees, and DFS post-order. Both run in O(V + E). If the graph has a cycle, no topological order exists.",
      code: `# Kahn's algorithm — BFS on in-degrees
from collections import defaultdict, deque

def topo_sort(V, edges):
    G = defaultdict(list)
    indeg = [0] * V
    for u, v in edges:
        G[u].append(v)
        indeg[v] += 1
    q = deque([i for i in range(V) if indeg[i] == 0])
    order = []
    while q:
        u = q.popleft()
        order.append(u)
        for v in G[u]:
            indeg[v] -= 1
            if indeg[v] == 0:
                q.append(v)
    return order if len(order) == V else []   # [] → cycle`,
      complexity: [{ op: "Kahn / DFS topo sort", time: "O(V + E)", space: "O(V + E)" }],
      tip: "Whenever a problem says 'given prerequisites' or 'must be done before', reach for topological sort.",
    },
    {
      slug: "cycle-detection",
      title: "Cycle Detection",
      tagline: "Different graphs, different techniques.",
      theory:
        "Cycle detection technique depends on the graph type:\n\n• Undirected graph: DFS with parent tracking — if you visit a neighbour that isn't your parent and is already visited, you've found a cycle. Union-Find also works: any edge whose endpoints are already in the same set closes a cycle.\n\n• Directed graph: DFS with three colors — WHITE (unvisited), GRAY (in current path), BLACK (done). Seeing a GRAY neighbour means a back-edge, i.e. a cycle. A simple visited set is *not* enough.\n\nBoth run in O(V + E).",
      code: `# Directed graph — DFS with colors
WHITE, GRAY, BLACK = 0, 1, 2

def has_cycle(V, G):
    color = [WHITE] * V
    def dfs(u):
        color[u] = GRAY
        for v in G[u]:
            if color[v] == GRAY: return True
            if color[v] == WHITE and dfs(v): return True
        color[u] = BLACK
        return False
    return any(color[u] == WHITE and dfs(u) for u in range(V))`,
      complexity: [{ op: "Cycle detection", time: "O(V + E)", space: "O(V)" }],
      mistakes: [
        "Using a single `visited` set on a directed graph — misses cycles that reach a black vertex from a new path.",
        "Forgetting the parent check in undirected DFS → every edge looks like a cycle.",
      ],
    },
    {
      slug: "connected-components",
      title: "Connected Components",
      tagline: "Group every vertex with its reachable neighbours.",
      theory:
        "In an undirected graph, a connected component is a maximal set of vertices where every pair is reachable. Find components with a simple outer loop + BFS/DFS: for each unvisited vertex, traverse everything reachable and label them with the component id.\n\nUnion-Find offers an incremental alternative — useful when edges arrive one at a time (dynamic connectivity).",
      code: `def components(V, G):
    seen = [False] * V
    comps = []
    for s in range(V):
        if seen[s]: continue
        comp, stack = [], [s]
        seen[s] = True
        while stack:
            u = stack.pop()
            comp.append(u)
            for v in G[u]:
                if not seen[v]:
                    seen[v] = True
                    stack.append(v)
        comps.append(comp)
    return comps`,
      complexity: [{ op: "Component labelling", time: "O(V + E)", space: "O(V)" }],
      practice: [
        {
          title: "LC 200 · Number of Islands",
          url: "https://leetcode.com/problems/number-of-islands/",
          difficulty: "Medium",
        },
        {
          title: "LC 547 · Number of Provinces",
          url: "https://leetcode.com/problems/number-of-provinces/",
          difficulty: "Medium",
        },
      ],
    },
    {
      slug: "strongly-connected-components",
      title: "Strongly Connected Components",
      tagline: "Directed graphs need a stronger definition of 'connected'.",
      theory:
        "In a directed graph, a strongly connected component (SCC) is a maximal set of vertices where every pair is mutually reachable. Two classic algorithms:\n\n• Kosaraju — run DFS to record finish order, transpose the graph, then DFS in reverse finish order. Each DFS tree in the second pass is one SCC.\n\n• Tarjan — one DFS pass using discovery times and low-link numbers plus an explicit stack. Faster in practice; slightly trickier to write.\n\nBoth run in O(V + E). SCCs are the building block of 2-SAT, condensation graphs, and many compiler analyses.",
      code: `# Kosaraju's algorithm
def kosaraju(V, G):
    order, seen = [], [False]*V
    def dfs1(u):
        seen[u] = True
        for v in G[u]:
            if not seen[v]: dfs1(v)
        order.append(u)
    for u in range(V):
        if not seen[u]: dfs1(u)

    GT = [[] for _ in range(V)]
    for u in range(V):
        for v in G[u]: GT[v].append(u)

    comp = [-1] * V
    def dfs2(u, c):
        comp[u] = c
        for v in GT[u]:
            if comp[v] == -1: dfs2(v, c)
    c = 0
    for u in reversed(order):
        if comp[u] == -1:
            dfs2(u, c); c += 1
    return comp`,
      complexity: [{ op: "Kosaraju / Tarjan", time: "O(V + E)", space: "O(V + E)" }],
    },
    {
      slug: "dijkstra",
      title: "Dijkstra's Algorithm",
      tagline: "Shortest paths in weighted graphs with non-negative edges.",
      theory:
        "Dijkstra finds the shortest path from a single source to every other vertex in a graph with *non-negative* edge weights. Maintain a distance table (∞ initially, 0 for the source) and a min-heap of (distance, vertex). Repeatedly pop the closest unfinalised vertex and relax its outgoing edges.\n\nWith a binary heap the runtime is O((V + E) log V). Dijkstra fails on negative edges — use Bellman-Ford instead.",
      code: `import heapq

def dijkstra(V, G, src):
    # G[u] = list of (v, w)
    dist = [float('inf')] * V
    dist[src] = 0
    pq = [(0, src)]
    while pq:
        d, u = heapq.heappop(pq)
        if d > dist[u]: continue          # stale entry
        for v, w in G[u]:
            nd = d + w
            if nd < dist[v]:
                dist[v] = nd
                heapq.heappush(pq, (nd, v))
    return dist`,
      complexity: [
        { op: "Dijkstra (binary heap)", time: "O((V + E) log V)", space: "O(V)" },
        { op: "Dijkstra (Fibonacci heap)", time: "O(E + V log V)", space: "O(V)" },
      ],
      mistakes: [
        "Running Dijkstra on a graph with negative weights → silently wrong answers.",
        "Not skipping stale heap entries — the algorithm still works, but runs slower than expected.",
      ],
      tip: "In Python, `heapq` is a min-heap of tuples. To pop by distance, always push `(distance, vertex)` in that order.",
    },
    {
      slug: "bellman-ford",
      title: "Bellman-Ford Algorithm",
      tagline: "Shortest paths that survive negative edges.",
      theory:
        "Bellman-Ford relaxes every edge V−1 times. After the (V−1)th round, all shortest paths are correct — because any simple path has at most V−1 edges. A Vth round that still improves a distance proves the graph contains a negative-weight cycle.\n\nSlower than Dijkstra (O(V·E)) but handles negative weights and detects negative cycles.",
      code: `def bellman_ford(V, edges, src):
    dist = [float('inf')] * V
    dist[src] = 0
    for _ in range(V - 1):
        updated = False
        for u, v, w in edges:
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                updated = True
        if not updated: break
    for u, v, w in edges:
        if dist[u] + w < dist[v]:
            return None      # negative cycle
    return dist`,
      complexity: [{ op: "Bellman-Ford", time: "O(V·E)", space: "O(V)" }],
    },
    {
      slug: "floyd-warshall",
      title: "Floyd-Warshall Algorithm",
      tagline: "All-pairs shortest paths in three nested loops.",
      theory:
        "Floyd-Warshall computes shortest paths between every pair of vertices in a single O(V³) triple loop. The invariant: after the kth iteration, dist[i][j] is the shortest path using only vertices {0, …, k} as intermediates. Handles negative edges (no negative cycles).\n\nUse it when V is small (≤ 400 or so) and you need distances between many pairs.",
      code: `def floyd_warshall(dist):
    V = len(dist)
    for k in range(V):
        for i in range(V):
            for j in range(V):
                if dist[i][k] + dist[k][j] < dist[i][j]:
                    dist[i][j] = dist[i][k] + dist[k][j]
    return dist`,
      complexity: [{ op: "Floyd-Warshall", time: "O(V³)", space: "O(V²)" }],
      tip: "The k-loop must be the outermost loop. Swap it inward and the algorithm silently returns wrong answers.",
    },
    {
      slug: "prim",
      title: "Prim's Algorithm",
      tagline: "Grow a Minimum Spanning Tree from a single vertex.",
      theory:
        "A minimum spanning tree (MST) of an undirected weighted graph is a subset of edges that connects all vertices with the minimum total weight and no cycles. Prim starts from any vertex, keeps a min-heap of edges crossing the current tree, and repeatedly adds the lightest edge whose other endpoint is not yet in the tree.\n\nWith a binary heap: O((V + E) log V).",
      code: `import heapq

def prim(V, G):
    in_tree = [False] * V
    pq = [(0, 0)]      # (weight, vertex)
    total, taken = 0, 0
    while pq and taken < V:
        w, u = heapq.heappop(pq)
        if in_tree[u]: continue
        in_tree[u] = True
        total += w
        taken += 1
        for v, wt in G[u]:
            if not in_tree[v]:
                heapq.heappush(pq, (wt, v))
    return total if taken == V else -1`,
      complexity: [{ op: "Prim (binary heap)", time: "O((V + E) log V)", space: "O(V)" }],
    },
    {
      slug: "kruskal",
      title: "Kruskal's Algorithm",
      tagline: "Sort every edge, then union-find your way to an MST.",
      theory:
        "Kruskal sorts all edges by weight ascending, then walks through them; each edge is added to the MST unless it would form a cycle. Cycle detection is O(α(V)) per edge with Union-Find (disjoint set with path compression + union by rank).\n\nOverall: O(E log E), which for connected graphs is O(E log V).",
      code: `def kruskal(V, edges):
    edges.sort(key=lambda e: e[2])
    parent = list(range(V))
    rank = [0] * V
    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x
    def union(a, b):
        ra, rb = find(a), find(b)
        if ra == rb: return False
        if rank[ra] < rank[rb]: ra, rb = rb, ra
        parent[rb] = ra
        if rank[ra] == rank[rb]: rank[ra] += 1
        return True

    total, taken = 0, 0
    for u, v, w in edges:
        if union(u, v):
            total += w; taken += 1
            if taken == V - 1: break
    return total if taken == V - 1 else -1`,
      complexity: [{ op: "Kruskal", time: "O(E log E)", space: "O(V)" }],
      tip: "Prim is faster on dense graphs (many edges). Kruskal shines on sparse graphs and when edges are already sorted or streaming in.",
    },
    {
      slug: "union-find",
      title: "Union-Find (Disjoint Set Union)",
      tagline: "The tiny data structure behind Kruskal and dynamic connectivity.",
      theory:
        "Union-Find keeps a collection of disjoint sets under two operations: find(x) returns the representative of x's set, and union(a, b) merges two sets. With **path compression** on find and **union by rank/size**, the amortised cost per operation is O(α(n)) — effectively constant.\n\nUnion-Find powers Kruskal's MST, cycle detection in undirected graphs, dynamic connectivity, and many 'group these together' patterns.",
      code: `class DSU:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n

    def find(self, x):
        while self.parent[x] != x:
            self.parent[x] = self.parent[self.parent[x]]  # path compression
            x = self.parent[x]
        return x

    def union(self, a, b):
        ra, rb = self.find(a), self.find(b)
        if ra == rb: return False
        if self.rank[ra] < self.rank[rb]: ra, rb = rb, ra
        self.parent[rb] = ra
        if self.rank[ra] == self.rank[rb]: self.rank[ra] += 1
        return True`,
      complexity: [
        { op: "find / union (amortised)", time: "O(α(n)) ≈ O(1)", space: "O(n)" },
      ],
      practice: [
        {
          title: "LC 684 · Redundant Connection",
          url: "https://leetcode.com/problems/redundant-connection/",
          difficulty: "Medium",
        },
        {
          title: "LC 1319 · Number of Operations to Make Network Connected",
          url: "https://leetcode.com/problems/number-of-operations-to-make-network-connected/",
          difficulty: "Medium",
        },
      ],
    },
    {
      slug: "interview-prep",
      title: "Interview Questions & Common Mistakes",
      tagline: "The patterns interviewers ask over and over.",
      bullets: [
        "State whether the graph is directed / weighted / dense — it drives the algorithm choice.",
        "'Shortest path, all edges equal' → BFS. Weighted, non-negative → Dijkstra. Negative edges → Bellman-Ford. All pairs, small V → Floyd-Warshall.",
        "'Prerequisites / build order / task ordering' → topological sort on a DAG.",
        "'Detect a cycle' → DFS with 3 colors for directed graphs; DFS with parent (or Union-Find) for undirected.",
        "'Connect all cities with minimum cost' → Minimum Spanning Tree (Prim or Kruskal).",
        "'Count / label groups' → BFS/DFS component labelling, or Union-Find for dynamic edges.",
        "State complexity in V and E — never just n.",
      ],
      mistakes: [
        "Using DFS recursion on a 10⁵-vertex graph → RecursionError.",
        "Applying Dijkstra to a graph with negative edges.",
        "Marking BFS visited on pop instead of on enqueue — floods the queue with duplicates.",
        "Simple `visited` set on a directed graph for cycle detection — misses back edges to finished vertices.",
        "Forgetting to loop over every vertex on a disconnected graph.",
        "Confusing MST algorithms (undirected) with shortest paths (single source or all pairs).",
      ],
      tip: "The classic interview mnemonic: **BFS = shortest, DFS = structural, Dijkstra = weighted shortest, Union-Find = groups, Topo = order, MST = connect cheaply.**",
      practice: [
        {
          title: "LC 200 · Number of Islands",
          url: "https://leetcode.com/problems/number-of-islands/",
          difficulty: "Medium",
        },
        {
          title: "LC 733 · Flood Fill",
          url: "https://leetcode.com/problems/flood-fill/",
          difficulty: "Easy",
        },
        {
          title: "LC 133 · Clone Graph",
          url: "https://leetcode.com/problems/clone-graph/",
          difficulty: "Medium",
        },
        {
          title: "LC 207 · Course Schedule",
          url: "https://leetcode.com/problems/course-schedule/",
          difficulty: "Medium",
        },
        {
          title: "LC 210 · Course Schedule II",
          url: "https://leetcode.com/problems/course-schedule-ii/",
          difficulty: "Medium",
        },
        {
          title: "LC 743 · Network Delay Time",
          url: "https://leetcode.com/problems/network-delay-time/",
          difficulty: "Medium",
        },
        {
          title: "LC 787 · Cheapest Flights Within K Stops",
          url: "https://leetcode.com/problems/cheapest-flights-within-k-stops/",
          difficulty: "Medium",
        },
        {
          title: "LC 127 · Word Ladder",
          url: "https://leetcode.com/problems/word-ladder/",
          difficulty: "Hard",
        },
        {
          title: "LC 417 · Pacific Atlantic Water Flow",
          url: "https://leetcode.com/problems/pacific-atlantic-water-flow/",
          difficulty: "Medium",
        },
        {
          title: "LC 1584 · Min Cost to Connect All Points",
          url: "https://leetcode.com/problems/min-cost-to-connect-all-points/",
          difficulty: "Medium",
        },
        {
          title: "LC 684 · Redundant Connection",
          url: "https://leetcode.com/problems/redundant-connection/",
          difficulty: "Medium",
        },
        {
          title: "LC 1971 · Find if Path Exists",
          url: "https://leetcode.com/problems/find-if-path-exists-in-graph/",
          difficulty: "Easy",
        },
      ],
      quiz: {
        q: "Given a directed graph with some negative edge weights (but no negative cycles), which algorithm should you use for single-source shortest paths?",
        choices: ["BFS", "Dijkstra", "Bellman-Ford", "Prim"],
        answer: 2,
        explain:
          "Dijkstra silently breaks on negative edges. Bellman-Ford handles them in O(V·E) and detects negative cycles.",
      },
      references: [
        {
          label: "CLRS — Introduction to Algorithms (Part VI)",
          url: "https://mitpress.mit.edu/9780262046305/",
        },
        {
          label: "Sedgewick & Wayne — Algorithms, 4th ed.",
          url: "https://algs4.cs.princeton.edu/home/",
        },
        {
          label: "LeetCode Graph Tag",
          url: "https://leetcode.com/tag/graph/",
        },
      ],
    },
    {
      slug: "summary-revision",
      title: "Summary & Revision",
      tagline: "Every graph algorithm on one page.",
      bullets: [
        "BFS — layer-by-layer, shortest path (unweighted). O(V + E).",
        "DFS — recursive/iterative, backbone of topo sort / SCC / cycle detection. O(V + E).",
        "Topological sort — Kahn or DFS post-order on a DAG. O(V + E).",
        "Cycle detection — directed: 3-color DFS. Undirected: DFS+parent or Union-Find.",
        "Connected components — outer loop + BFS/DFS.",
        "Strongly connected components — Kosaraju (2×DFS) or Tarjan (1×DFS). O(V + E).",
        "Dijkstra — min-heap, non-negative weights. O((V + E) log V).",
        "Bellman-Ford — V−1 relaxations, handles negative edges, detects negative cycles. O(V·E).",
        "Floyd-Warshall — all-pairs, triple loop with k outermost. O(V³).",
        "Prim — MST from a min-heap. O((V + E) log V).",
        "Kruskal — sorted edges + Union-Find. O(E log E).",
        "Union-Find — near-constant find/union with path compression + rank.",
      ],
      complexity: [
        { op: "BFS / DFS", time: "O(V + E)", space: "O(V)" },
        { op: "Topological sort", time: "O(V + E)", space: "O(V + E)" },
        { op: "Dijkstra", time: "O((V + E) log V)", space: "O(V)" },
        { op: "Bellman-Ford", time: "O(V · E)", space: "O(V)" },
        { op: "Floyd-Warshall", time: "O(V³)", space: "O(V²)" },
        { op: "Prim / Kruskal (MST)", time: "O(E log V)", space: "O(V)" },
        { op: "Union-Find", time: "O(α(n))", space: "O(n)" },
      ],
      references: [
        {
          label: "CLRS Part VI — Graph Algorithms",
          url: "https://mitpress.mit.edu/9780262046305/",
        },
        {
          label: "cp-algorithms.com — Graph section",
          url: "https://cp-algorithms.com/graph/breadth-first-search.html",
        },
      ],
    },
  ],
};
