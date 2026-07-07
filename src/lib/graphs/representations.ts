import type { GLesson, GraphSpec } from "./types";

const DEMO: GraphSpec = {
  nodes: [{ id: "A" }, { id: "B" }, { id: "C" }, { id: "D" }, { id: "E" }],
  edges: [
    { from: "A", to: "B" },
    { from: "A", to: "C" },
    { from: "B", to: "D" },
    { from: "C", to: "D" },
    { from: "D", to: "E" },
  ],
};

const DEMO_WEIGHTED: GraphSpec = {
  nodes: [{ id: "A" }, { id: "B" }, { id: "C" }, { id: "D" }],
  edges: [
    { from: "A", to: "B", weight: 4 },
    { from: "A", to: "C", weight: 1 },
    { from: "B", to: "D", weight: 2 },
    { from: "C", to: "D", weight: 6 },
  ],
  weighted: true,
};

const DEMO_DIRECTED: GraphSpec = {
  nodes: [{ id: "A" }, { id: "B" }, { id: "C" }],
  edges: [
    { from: "A", to: "B" },
    { from: "B", to: "C" },
    { from: "C", to: "A" },
  ],
  directed: true,
};

export const G_REPRESENTATIONS: GLesson[] = [
  {
    slug: "overview",
    title: "Choosing a Representation",
    eyebrow: "Representations · 1",
    description: "Four ways to store the same graph — and how to pick the right one.",
    difficulty: "Beginner",
    readMinutes: 4,
    sections: [
      {
        type: "theory",
        text: "A graph's mathematical definition (V, E) doesn't say how to store it. The representation you choose changes the time complexity of every operation you'll run — sometimes by orders of magnitude — without changing the algorithm's logic at all.",
      },
      { type: "graphViz", spec: DEMO, caption: "One graph, four representations coming up." },
      {
        type: "table",
        headers: [
          "Representation",
          "Space",
          "Check edge (u,v)",
          "List neighbours of u",
          "Best for",
        ],
        rows: [
          [
            "Adjacency list",
            "O(V + E)",
            "O(deg(u))",
            "O(deg(u))",
            "Sparse graphs, most interview problems",
          ],
          ["Adjacency matrix", "O(V²)", "O(1)", "O(V)", "Dense graphs, frequent edge lookups"],
          ["Edge list", "O(E)", "O(E)", "O(E)", "Kruskal's algorithm, simple storage"],
          [
            "Incidence matrix",
            "O(V · E)",
            "O(E)",
            "O(E)",
            "Rarely used directly; theory & flow proofs",
          ],
        ],
      },
      {
        type: "callout",
        kind: "tip",
        title: "Rule of thumb",
        text: "If E is close to V² the graph is dense → matrix. If E is closer to V, it's sparse → adjacency list. Most real-world and interview graphs are sparse.",
      },
    ],
  },

  {
    slug: "adjacency-list",
    title: "Adjacency List",
    eyebrow: "Representations · 2",
    description: "A dict of lists — the default choice for almost every graph problem.",
    difficulty: "Beginner",
    readMinutes: 6,
    sections: [
      {
        type: "theory",
        text: "An adjacency list stores, for each vertex, the list of its neighbours. In Python this is naturally a dict mapping vertex → list (or set) of neighbours. It uses only as much space as the graph actually has edges — O(V + E) — which is why it's the default for sparse graphs.",
      },
      { type: "adjListViz", spec: DEMO, caption: "Each vertex points at its own neighbour list." },
      {
        type: "code",
        title: "python — build & use",
        code: `from collections import defaultdict

def build_adjacency_list(edges, directed=False):
    graph = defaultdict(list)
    for u, v in edges:
        graph[u].append(v)
        if not directed:
            graph[v].append(u)
    return graph

edges = [("A", "B"), ("A", "C"), ("B", "D"), ("C", "D"), ("D", "E")]
graph = build_adjacency_list(edges)
print(graph["A"])   # ['B', 'C']
print(graph["D"])   # ['B', 'C', 'E']`,
      },
      {
        type: "code",
        title: "python — weighted variant",
        code: `# Store (neighbour, weight) pairs when edges carry a cost.
weighted_graph = defaultdict(list)
for u, v, w in [("A", "B", 4), ("A", "C", 1)]:
    weighted_graph[u].append((v, w))
    weighted_graph[v].append((u, w))`,
      },
      {
        type: "complexity",
        rows: [
          { op: "Space", time: "O(V + E)" },
          { op: "Add edge", time: "O(1)" },
          {
            op: "Check edge (u, v)",
            time: "O(deg(u))",
            note: "O(1) if you use a set of neighbours instead of a list",
          },
          { op: "List all neighbours of u", time: "O(deg(u))" },
          { op: "Iterate all edges", time: "O(V + E)" },
        ],
      },
      {
        type: "mistakes",
        items: [
          "Forgetting to add both directions for an undirected graph.",
          "Using a list when you need frequent 'is (u,v) an edge?' checks — use a set for O(1) lookup instead.",
          "Not initializing isolated vertices (a vertex with no edges won't appear unless you seed it, e.g. via defaultdict or an explicit vertex list).",
        ],
      },
      {
        type: "callout",
        kind: "interview",
        title: "Interview default",
        text: "Unless a problem specifically calls for a matrix (small V, dense edges, frequent edge queries), reach for an adjacency list — it's what almost every LeetCode graph solution uses.",
      },
      {
        type: "practice",
        groups: [
          {
            level: "Beginner",
            items: [
              {
                title: "Find the Town Judge",
                url: "https://leetcode.com/problems/find-the-town-judge/",
                difficulty: "Easy",
                pattern: "In/out-degree",
              },
            ],
          },
          {
            level: "Intermediate",
            items: [
              {
                title: "Clone Graph",
                url: "https://leetcode.com/problems/clone-graph/",
                difficulty: "Medium",
                pattern: "Adjacency list + BFS/DFS",
              },
            ],
          },
        ],
      },
      {
        type: "references",
        items: [
          {
            label: "Python collections.defaultdict docs",
            url: "https://docs.python.org/3/library/collections.html#collections.defaultdict",
          },
        ],
      },
    ],
  },

  {
    slug: "adjacency-matrix",
    title: "Adjacency Matrix",
    eyebrow: "Representations · 3",
    description: "A V×V grid of 0s and 1s (or weights) — O(1) edge lookups at the cost of space.",
    difficulty: "Beginner",
    readMinutes: 5,
    sections: [
      {
        type: "theory",
        text: "An adjacency matrix is a V×V 2D array where cell [i][j] holds 1 (or the weight) if an edge runs from vertex i to vertex j, and 0 otherwise. Undirected graphs produce a symmetric matrix. It trades O(V²) space for O(1) edge lookups.",
      },
      {
        type: "adjMatrixViz",
        spec: DEMO_WEIGHTED,
        caption: "Weighted, undirected — note the matrix is symmetric.",
      },
      {
        type: "code",
        title: "python",
        code: `def build_adjacency_matrix(n, edges, directed=False):
    matrix = [[0] * n for _ in range(n)]
    for u, v, w in edges:
        matrix[u][v] = w
        if not directed:
            matrix[v][u] = w
    return matrix

edges = [(0, 1, 4), (0, 2, 1), (1, 3, 2), (2, 3, 6)]
matrix = build_adjacency_matrix(4, edges)
for row in matrix:
    print(row)
# [0, 4, 1, 0]
# [4, 0, 0, 2]
# [1, 0, 0, 6]
# [0, 2, 6, 0]`,
      },
      {
        type: "memoryDiagram",
        rows: [
          {
            label: "4 vertices",
            value: "4 × 4 = 16 cells",
            note: "O(V²) regardless of edge count",
          },
          {
            label: "20 vertices",
            value: "400 cells",
            note: "grows quadratically — expensive for sparse graphs",
          },
        ],
      },
      {
        type: "complexity",
        rows: [
          { op: "Space", time: "O(V²)" },
          { op: "Check edge (u, v)", time: "O(1)" },
          { op: "List neighbours of u", time: "O(V)", note: "must scan the whole row" },
          { op: "Add/remove edge", time: "O(1)" },
        ],
      },
      {
        type: "mistakes",
        items: [
          "Using a matrix for a sparse graph with millions of vertices — memory blows up long before the algorithm does.",
          "Forgetting the matrix must be symmetric for undirected graphs (a common source of subtle bugs).",
        ],
      },
      {
        type: "callout",
        kind: "perf",
        text: "Floyd-Warshall is the classic matrix-native algorithm — it's O(V³) either way, so the O(V²) matrix cost is 'free' by comparison.",
      },
      {
        type: "references",
        items: [
          {
            label: "CLRS §22.1 — Representations of graphs",
            url: "https://mitpress.mit.edu/9780262046305/",
          },
        ],
      },
    ],
  },

  {
    slug: "edge-list",
    title: "Edge List",
    eyebrow: "Representations · 4",
    description: "The simplest representation — just a flat list of (u, v[, w]) tuples.",
    difficulty: "Beginner",
    readMinutes: 4,
    sections: [
      {
        type: "theory",
        text: "An edge list is exactly what it sounds like: a flat list of every edge. It's the most compact representation and the natural input format for algorithms that process edges directly rather than exploring neighbourhoods — most notably Kruskal's MST algorithm, which sorts the edge list by weight.",
      },
      { type: "edgeListViz", spec: DEMO, caption: "Every edge, once each." },
      {
        type: "code",
        title: "python",
        code: `edges = [
    ("A", "B"),
    ("A", "C"),
    ("B", "D"),
    ("C", "D"),
    ("D", "E"),
]

# Weighted, sorted by weight — exactly what Kruskal's needs.
weighted_edges = [("A", "B", 4), ("A", "C", 1), ("B", "D", 2), ("C", "D", 6)]
weighted_edges.sort(key=lambda e: e[2])`,
      },
      {
        type: "complexity",
        rows: [
          { op: "Space", time: "O(E)" },
          {
            op: "Check edge (u, v)",
            time: "O(E)",
            note: "must scan every edge — its main weakness",
          },
          { op: "List neighbours of u", time: "O(E)" },
          { op: "Sort by weight", time: "O(E log E)" },
        ],
      },
      {
        type: "mistakes",
        items: [
          "Using an edge list when you need repeated neighbour lookups — convert to an adjacency list first, or you'll re-scan O(E) every time.",
        ],
      },
      {
        type: "callout",
        kind: "tip",
        text: "Edge lists and adjacency lists aren't mutually exclusive — build the edge list first (easy to read from input), then derive an adjacency list from it if your algorithm needs neighbour queries.",
      },
    ],
  },

  {
    slug: "incidence-matrix",
    title: "Incidence Matrix",
    eyebrow: "Representations · 5",
    description: "A V×E matrix connecting vertices to the edges they touch — mostly a theory tool.",
    difficulty: "Intermediate",
    readMinutes: 4,
    sections: [
      {
        type: "theory",
        text: "An incidence matrix has one row per vertex and one column per edge. Cell [v][e] is 1 if vertex v is an endpoint of edge e (0 otherwise). For directed graphs it's common to use -1 for the tail and +1 for the head, which is exactly the structure that shows up in network-flow LP formulations.",
      },
      {
        type: "incidenceMatrixViz",
        spec: DEMO_DIRECTED,
        caption: "Directed 3-cycle: -1 marks where an edge leaves a vertex, +1 where it arrives.",
      },
      {
        type: "code",
        title: "python",
        code: `def build_incidence_matrix(vertices, edges, directed=False):
    idx = {v: i for i, v in enumerate(vertices)}
    m = [[0] * len(edges) for _ in vertices]
    for j, (u, v) in enumerate(edges):
        if directed:
            m[idx[u]][j] = -1
            m[idx[v]][j] = 1
        else:
            m[idx[u]][j] = 1
            m[idx[v]][j] = 1
    return m`,
      },
      {
        type: "complexity",
        rows: [
          { op: "Space", time: "O(V · E)" },
          { op: "Check edge incidence", time: "O(1)" },
        ],
      },
      {
        type: "callout",
        kind: "info",
        text: "You'll rarely reach for this in interview code — it shows up mostly in graph theory proofs, circuit analysis, and linear-programming formulations of max-flow.",
      },
    ],
  },

  {
    slug: "csr",
    title: "Compressed Sparse Row (CSR)",
    eyebrow: "Representations · 6",
    description: "The production representation — how graph libraries store billions of edges.",
    difficulty: "Advanced",
    readMinutes: 5,
    sections: [
      {
        type: "theory",
        text: "CSR packs an adjacency list into two flat arrays: col_idx (all neighbours, concatenated vertex by vertex) and row_ptr (an index into col_idx marking where each vertex's neighbour block starts). It has the same O(V + E) space as an adjacency list but stores it in two contiguous arrays instead of V separate Python list objects — dramatically better cache behaviour, which is why NetworkX, igraph, and GPU graph libraries use it internally.",
      },
      {
        type: "csrViz",
        spec: DEMO,
        caption:
          "Two flat arrays encode the same neighbour lists you saw in the adjacency-list lesson.",
      },
      {
        type: "code",
        title: "python — build CSR",
        code: `def build_csr(n, edges, directed=False):
    adj = [[] for _ in range(n)]
    for u, v in edges:
        adj[u].append(v)
        if not directed:
            adj[v].append(u)
    row_ptr = [0]
    col_idx = []
    for neighbours in adj:
        col_idx.extend(neighbours)
        row_ptr.append(len(col_idx))
    return row_ptr, col_idx

def neighbours_of(v, row_ptr, col_idx):
    return col_idx[row_ptr[v]:row_ptr[v + 1]]`,
      },
      {
        type: "complexity",
        rows: [
          {
            op: "Space",
            time: "O(V + E)",
            note: "same as adjacency list, but two contiguous arrays",
          },
          { op: "List neighbours of u", time: "O(deg(u))" },
          { op: "Build from edge list", time: "O(V + E)" },
        ],
      },
      {
        type: "callout",
        kind: "perf",
        text: "CSR is immutable by design (adding an edge means rebuilding the arrays) — that's the trade-off for its speed. It's the right choice once a graph is built and only queried, not mutated.",
      },
      {
        type: "references",
        items: [
          {
            label: "SciPy sparse CSR matrix docs",
            url: "https://docs.scipy.org/doc/scipy/reference/generated/scipy.sparse.csr_matrix.html",
          },
        ],
      },
    ],
  },

  {
    slug: "review",
    title: "Representations — Review",
    eyebrow: "Representations · 7",
    description: "Side-by-side recap before moving on to traversals.",
    difficulty: "Beginner",
    readMinutes: 3,
    sections: [
      {
        type: "quiz",
        items: [
          {
            q: "Which representation gives O(1) edge-existence checks?",
            choices: ["Adjacency list", "Adjacency matrix", "Edge list", "Incidence matrix"],
            answer: 1,
            explain: "A matrix cell lookup is O(1); the others require scanning a list.",
          },
          {
            q: "Which representation does Kruskal's algorithm want as input?",
            choices: ["Adjacency matrix", "Incidence matrix", "Edge list sorted by weight", "CSR"],
            answer: 2,
            explain:
              "Kruskal processes edges globally by weight, so a flat sorted edge list is the natural fit.",
          },
          {
            q: "For a sparse graph with 1,000,000 vertices and 3,000,000 edges, which representation is impractical?",
            choices: ["Adjacency list", "CSR", "Adjacency matrix", "Edge list"],
            answer: 2,
            explain:
              "A matrix would need 10¹² cells — adjacency list / CSR / edge list all stay near O(V + E).",
          },
        ],
      },
      {
        type: "callout",
        kind: "info",
        title: "Next up",
        text: "With storage settled, Traversals covers how to actually walk the graph — BFS and DFS, iterative and recursive.",
      },
    ],
  },
];
