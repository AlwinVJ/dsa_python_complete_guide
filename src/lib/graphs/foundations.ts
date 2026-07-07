import type { GLesson, GraphSpec } from "./types";

/* Sample graphs reused across lessons ----------------------------------- */

const SIMPLE: GraphSpec = {
  nodes: [{ id: "A" }, { id: "B" }, { id: "C" }, { id: "D" }, { id: "E" }],
  edges: [
    { from: "A", to: "B" },
    { from: "A", to: "C" },
    { from: "B", to: "D" },
    { from: "C", to: "D" },
    { from: "D", to: "E" },
  ],
};

const DIRECTED: GraphSpec = {
  nodes: [{ id: "1" }, { id: "2" }, { id: "3" }, { id: "4" }],
  edges: [
    { from: "1", to: "2" },
    { from: "2", to: "3" },
    { from: "3", to: "4" },
    { from: "4", to: "2" },
  ],
  directed: true,
};

const WEIGHTED: GraphSpec = {
  nodes: [{ id: "S" }, { id: "A" }, { id: "B" }, { id: "T" }],
  edges: [
    { from: "S", to: "A", weight: 2 },
    { from: "S", to: "B", weight: 5 },
    { from: "A", to: "B", weight: 1 },
    { from: "A", to: "T", weight: 7 },
    { from: "B", to: "T", weight: 3 },
  ],
  weighted: true,
};

const DISCONNECTED: GraphSpec = {
  nodes: [{ id: "A" }, { id: "B" }, { id: "C" }, { id: "D" }, { id: "E" }, { id: "F" }],
  edges: [
    { from: "A", to: "B" },
    { from: "B", to: "C" },
    { from: "D", to: "E" },
  ],
};

const CYCLE: GraphSpec = {
  nodes: [{ id: "A" }, { id: "B" }, { id: "C" }, { id: "D" }],
  edges: [
    { from: "A", to: "B" },
    { from: "B", to: "C" },
    { from: "C", to: "D" },
    { from: "D", to: "A" },
  ],
};

/* Lessons ---------------------------------------------------------------- */

export const G_FOUNDATIONS: GLesson[] = [
  {
    slug: "introduction",
    title: "Introduction",
    eyebrow: "Foundations · 1",
    description:
      "A graph is a set of vertices connected by edges — the most general data structure in computer science.",
    difficulty: "Beginner",
    readMinutes: 5,
    sections: [
      {
        type: "theory",
        text: "A graph G = (V, E) is a pair of a set of vertices V and a set of edges E, where each edge connects two vertices. Unlike trees, graphs allow cycles, multiple connected components, and edges in any direction. Almost every relationship you can imagine — friendships, roads, dependencies, molecules — is naturally a graph.",
      },
      {
        type: "graphViz",
        spec: SIMPLE,
        caption: "A tiny undirected graph with 5 vertices and 5 edges.",
      },
      {
        type: "callout",
        kind: "info",
        title: "Where we're headed",
        text: "Foundations → Graph Types → Representations → Traversals → Algorithms → Review. Master each tier in order.",
      },
      {
        type: "code",
        title: "python",
        code: `# The most common Python representation: adjacency list.\nG = {\n    "A": ["B", "C"],\n    "B": ["A", "D"],\n    "C": ["A", "D"],\n    "D": ["B", "C", "E"],\n    "E": ["D"],\n}`,
      },
      {
        type: "references",
        items: [
          { label: "CLRS · Graphs (Ch. 22)", url: "https://mitpress.mit.edu/9780262046305/" },
          { label: "Visualgo — Graph algorithms", url: "https://visualgo.net/en/graphds" },
        ],
      },
    ],
  },

  {
    slug: "why-graphs",
    title: "Why Graphs?",
    eyebrow: "Foundations · 2",
    description:
      "Where trees and lists fall short, and how a graph shape solves the general problem.",
    difficulty: "Beginner",
    readMinutes: 4,
    sections: [
      {
        type: "theory",
        bullets: [
          "Arrays and lists model sequences; trees model hierarchy.",
          "Graphs model arbitrary relationships — anything with 'X is related to Y'.",
          "A tree is a special graph (connected + acyclic + rooted).",
          "A linked list is a special graph (a chain of degree-2 vertices).",
        ],
      },
      {
        type: "callout",
        kind: "did",
        title: "One structure to rule them all",
        text: "Every data structure you've studied so far — arrays, lists, trees, tries — is a special case of a graph. Master graphs and you have a mental model for the rest.",
      },
    ],
  },

  {
    slug: "problems-solved",
    title: "Problems solved by Graphs",
    eyebrow: "Foundations · 3",
    description: "The problem families that only graphs can solve well.",
    difficulty: "Beginner",
    readMinutes: 4,
    sections: [
      {
        type: "table",
        headers: ["Problem", "Graph flavour", "Algorithm"],
        rows: [
          ["Shortest driving route", "Weighted directed graph", "Dijkstra"],
          ["Course prerequisites", "Directed acyclic graph", "Topological sort"],
          ["Social recommendations", "Undirected graph", "BFS, community detection"],
          ["Cheapest network wiring", "Weighted undirected graph", "MST (Kruskal / Prim)"],
          ["Deadlock detection", "Directed graph", "Cycle detection"],
          ["Map colouring", "Undirected graph", "Greedy colouring"],
        ],
      },
    ],
  },

  {
    slug: "real-world",
    title: "Real-world Examples",
    eyebrow: "Foundations · 4",
    description: "Graphs live everywhere — here are the biggest.",
    difficulty: "Beginner",
    readMinutes: 3,
    sections: [
      {
        type: "theory",
        bullets: [
          "Google Maps — road segments = edges, intersections = vertices.",
          "Facebook / Instagram — friendship graph.",
          "The web — hyperlinks form a directed graph (basis of PageRank).",
          "Airline routes — cities and flights, weighted by cost or time.",
          "Package managers — dependency DAG resolved by topological sort.",
          "Compilers — control-flow graphs, call graphs, data-flow graphs.",
          "Molecules — atoms as vertices, bonds as edges.",
        ],
      },
    ],
  },

  {
    slug: "terminology",
    title: "Terminology",
    eyebrow: "Foundations · 5",
    description: "The full vocabulary you need before any algorithm — each term with a visual.",
    difficulty: "Beginner",
    readMinutes: 6,
    sections: [
      {
        type: "theory",
        text: "Graph algorithms lean heavily on precise vocabulary. Skim this once, then refer back as you learn new algorithms.",
      },
      {
        type: "table",
        headers: ["Term", "Meaning"],
        rows: [
          ["Vertex / Node", "An entity in the graph (V)."],
          ["Edge", "A connection between two vertices (E)."],
          ["Adjacent", "Two vertices are adjacent if an edge connects them."],
          ["Incident", "An edge is incident on its two endpoints."],
          ["Neighbour", "Any vertex adjacent to u is a neighbour of u."],
          ["Degree", "Number of edges incident on a vertex."],
          ["In-degree / Out-degree", "For directed graphs — edges coming in / going out."],
          ["Path", "Sequence of vertices v₀…vₖ where each consecutive pair is adjacent."],
          ["Simple path", "A path with no repeated vertices."],
          ["Walk", "Same as a path but repetitions allowed."],
          ["Cycle", "A path that starts and ends at the same vertex."],
          ["Simple cycle", "A cycle with no repeated internal vertices."],
          ["Loop / Self-loop", "An edge from a vertex to itself."],
          ["Parallel edges", "Two edges with the same endpoints (multigraph)."],
          ["Connected graph", "Every pair of vertices is joined by some path."],
          ["Strongly connected", "In a digraph, every pair is mutually reachable."],
          ["Component", "A maximal connected subgraph."],
          ["Weight", "A numeric label on an edge (cost, distance, capacity)."],
          ["Order / Size", "|V| is the order; |E| is the size."],
        ],
      },
      {
        type: "graphViz",
        spec: DISCONNECTED,
        caption: "Two connected components: {A,B,C} and {D,E} — plus isolated vertex F.",
      },
    ],
  },

  {
    slug: "vertex",
    title: "Vertex",
    eyebrow: "Foundations · 6",
    description: "The atomic unit of a graph.",
    difficulty: "Beginner",
    readMinutes: 3,
    sections: [
      {
        type: "theory",
        text: "A vertex represents an entity — a city, a user, a task, a state. Vertices carry an identity and may carry arbitrary attributes (colour, label, coordinates, cost).",
      },
      {
        type: "code",
        title: "python",
        code: `# Vertices as any hashable key: strings, ints, tuples.\nV = {"A", "B", "C"}                # a set of vertex IDs\ncoords = {"A": (0, 0), "B": (2, 3)} # per-vertex attributes`,
      },
      {
        type: "callout",
        kind: "tip",
        text: "Pick a stable vertex ID type early — mixing strings and ints in one graph is a common bug.",
      },
    ],
  },

  {
    slug: "edge",
    title: "Edge",
    eyebrow: "Foundations · 7",
    description: "The relationship between two vertices.",
    difficulty: "Beginner",
    readMinutes: 3,
    sections: [
      {
        type: "theory",
        text: "An edge (u, v) says 'u is related to v'. Edges can carry weights, capacities, timestamps, or types. In an undirected graph (u, v) and (v, u) mean the same thing; in a directed graph they differ.",
      },
      {
        type: "graphViz",
        spec: DIRECTED,
        caption: "A directed graph — the arrow shows edge orientation.",
      },
      {
        type: "code",
        title: "python",
        code: `# An edge is typically a tuple (or a dict for richer data).\nedges = [\n    ("A", "B", 3),   # weighted\n    ("B", "C", 1),\n    ("C", "A", 2),\n]`,
      },
    ],
  },

  {
    slug: "adjacent-vertex",
    title: "Adjacent Vertex",
    eyebrow: "Foundations · 8",
    description: "The neighbour relation — the primitive every traversal builds on.",
    difficulty: "Beginner",
    readMinutes: 3,
    sections: [
      {
        type: "theory",
        text: "Vertex v is adjacent to u if the edge (u, v) exists. The neighbourhood N(u) is the set of all such v. Every traversal boils down to 'from the current vertex, iterate its neighbours'.",
      },
      {
        type: "code",
        title: "python",
        code: `def neighbours(G, u):\n    """Return N(u) for an adjacency-list graph."""\n    return G.get(u, [])`,
      },
    ],
  },

  {
    slug: "path",
    title: "Path",
    eyebrow: "Foundations · 9",
    description: "How you get from one vertex to another.",
    difficulty: "Beginner",
    readMinutes: 3,
    sections: [
      {
        type: "theory",
        text: "A path is a sequence v₀ → v₁ → … → vₖ where each consecutive pair is an edge. Path length = number of edges (or the sum of weights in a weighted graph).",
      },
      {
        type: "graphViz",
        spec: { ...SIMPLE, colors: { A: "brand", B: "visited", D: "visited", E: "brand" } },
        caption: "Path A → B → D → E (length 3).",
      },
    ],
  },

  {
    slug: "simple-path",
    title: "Simple Path",
    eyebrow: "Foundations · 10",
    description: "A path with no repeated vertex — what every shortest-path algorithm returns.",
    difficulty: "Beginner",
    readMinutes: 2,
    sections: [
      {
        type: "theory",
        text: "A simple path repeats no vertex. Dijkstra, BFS, and Bellman-Ford all return simple paths — a shortest path is never worse for being simple.",
      },
      {
        type: "callout",
        kind: "info",
        title: "Why the distinction matters",
        text: "'Number of walks of length k' has closed-form answers (matrix powers); 'number of simple paths' is NP-hard in the general case.",
      },
    ],
  },

  {
    slug: "cycle",
    title: "Cycle",
    eyebrow: "Foundations · 11",
    description: "A path that comes back to its start — either bug or feature.",
    difficulty: "Beginner",
    readMinutes: 3,
    sections: [
      {
        type: "theory",
        text: "A cycle is a path that ends where it started. In a DAG (directed acyclic graph) cycles are forbidden. In dependency systems, cycles mean 'circular dependency' — always a bug.",
      },
      { type: "graphViz", spec: CYCLE, caption: "A 4-cycle: A→B→C→D→A." },
    ],
  },

  {
    slug: "connected-graph",
    title: "Connected Graph",
    eyebrow: "Foundations · 12",
    description: "Every vertex reachable from every other vertex.",
    difficulty: "Beginner",
    readMinutes: 3,
    sections: [
      {
        type: "theory",
        text: "An undirected graph is connected if a path exists between every pair of vertices. If not, it splits into components. A directed graph is strongly connected if every pair is mutually reachable; weakly connected if that holds after ignoring edge directions.",
      },
      {
        type: "graphViz",
        spec: SIMPLE,
        caption: "One connected component covering all 5 vertices.",
      },
    ],
  },

  {
    slug: "disconnected-graph",
    title: "Disconnected Graph",
    eyebrow: "Foundations · 13",
    description: "When traversal from one node misses part of the graph.",
    difficulty: "Beginner",
    readMinutes: 3,
    sections: [
      {
        type: "theory",
        text: "A disconnected graph has multiple components. BFS or DFS from a single source visits only its component — to visit every vertex you must loop across all vertices and restart traversal on any unvisited one.",
      },
      { type: "graphViz", spec: DISCONNECTED, caption: "Three components: {A,B,C}, {D,E}, {F}." },
      {
        type: "code",
        title: "python",
        code: `def visit_all(G):\n    seen = set()\n    for u in G:\n        if u not in seen:\n            dfs(u, G, seen)   # start a fresh traversal per component`,
      },
    ],
  },

  {
    slug: "degree",
    title: "Degree",
    eyebrow: "Foundations · 14",
    description: "How many neighbours a vertex has.",
    difficulty: "Beginner",
    readMinutes: 3,
    sections: [
      {
        type: "theory",
        text: "Degree(u) counts edges incident on u. The handshake lemma says Σ deg(u) = 2|E| in an undirected graph — every edge contributes to two vertices.",
      },
      { type: "code", title: "python", code: `deg = {u: len(G[u]) for u in G}` },
      {
        type: "table",
        headers: ["Vertex", "Neighbours", "Degree"],
        rows: [
          ["A", "B, C", "2"],
          ["B", "A, D", "2"],
          ["C", "A, D", "2"],
          ["D", "B, C, E", "3"],
          ["E", "D", "1"],
        ],
      },
    ],
  },

  {
    slug: "in-degree",
    title: "In-degree",
    eyebrow: "Foundations · 15",
    description: "Edges pointing INTO a vertex — the key to topological sort.",
    difficulty: "Beginner",
    readMinutes: 3,
    sections: [
      {
        type: "theory",
        text: "In a directed graph, in-degree(u) counts edges (·, u). Vertices with in-degree 0 are 'sources' — safe to schedule first. Kahn's topological sort starts from every zero-in-degree vertex.",
      },
      {
        type: "code",
        title: "python",
        code: `from collections import defaultdict\nindeg = defaultdict(int)\nfor u in G:\n    for v in G[u]:\n        indeg[v] += 1`,
      },
    ],
  },

  {
    slug: "out-degree",
    title: "Out-degree",
    eyebrow: "Foundations · 16",
    description: "Edges leaving a vertex.",
    difficulty: "Beginner",
    readMinutes: 2,
    sections: [
      {
        type: "theory",
        text: "Out-degree(u) counts edges (u, ·). In a random-walk model, out-degree determines transition options.",
      },
      { type: "code", title: "python", code: `outdeg = {u: len(G[u]) for u in G}` },
    ],
  },

  {
    slug: "weighted-vs-unweighted",
    title: "Weighted vs Unweighted Edges",
    eyebrow: "Foundations · 17",
    description: "Choose your algorithm based on whether edges have weights.",
    difficulty: "Beginner",
    readMinutes: 4,
    sections: [
      {
        type: "theory",
        text: "An unweighted edge is a plain connection — its 'cost' is 1. A weighted edge carries a numeric label — distance, latency, capacity, price. The algorithms you pick depend on this distinction.",
      },
      {
        type: "graphViz",
        spec: WEIGHTED,
        caption: "Weighted directed graph — labels are edge costs.",
      },
      {
        type: "table",
        headers: ["Shortest path in…", "Algorithm"],
        rows: [
          ["Unweighted graph", "BFS"],
          ["Non-negative weights", "Dijkstra"],
          ["Any weights (no negative cycle)", "Bellman-Ford"],
          ["All-pairs", "Floyd-Warshall"],
        ],
      },
    ],
  },

  {
    slug: "density",
    title: "Graph Density",
    eyebrow: "Foundations · 18",
    description: "Sparse vs dense — the choice that drives your representation.",
    difficulty: "Beginner",
    readMinutes: 4,
    sections: [
      {
        type: "theory",
        text: "Density = |E| / max|E|. In a sparse graph E ≈ V; in a dense graph E ≈ V². Sparse graphs prefer adjacency lists (O(V+E) space); dense graphs prefer adjacency matrices (O(V²) space, O(1) edge lookup).",
      },
      {
        type: "table",
        headers: ["Density", "|E| range", "Best representation"],
        rows: [
          ["Sparse", "O(V)", "Adjacency list"],
          ["Moderate", "O(V log V)", "Adjacency list"],
          ["Dense", "Θ(V²)", "Adjacency matrix"],
          ["Complete", "V(V−1)/2", "Adjacency matrix"],
        ],
      },
    ],
  },

  {
    slug: "properties",
    title: "Graph Properties",
    eyebrow: "Foundations · 19",
    description: "Properties an algorithm can rely on — and the ones it must handle.",
    difficulty: "Intermediate",
    readMinutes: 5,
    sections: [
      {
        type: "theory",
        bullets: [
          "Simple: no self-loops, no parallel edges.",
          "Multigraph: parallel edges allowed.",
          "Pseudograph: self-loops allowed.",
          "Regular: every vertex has the same degree.",
          "Bipartite: vertices split into two sets, edges only across.",
          "Planar: can be drawn without crossings.",
          "Complete: every possible edge exists.",
        ],
      },
      {
        type: "callout",
        kind: "interview",
        text: "Interviewers love asking 'is this graph bipartite?' — 2-colour with BFS/DFS in O(V + E).",
      },
    ],
  },

  {
    slug: "memory",
    title: "Memory Representation",
    eyebrow: "Foundations · 20",
    description: "How the CPU actually sees your graph.",
    difficulty: "Intermediate",
    readMinutes: 5,
    sections: [
      {
        type: "theory",
        text: "Understanding the memory shape of a graph explains why Dijkstra runs faster on adjacency lists and why edge-list traversals are cache-friendly for Bellman-Ford.",
      },
      {
        type: "memoryDiagram",
        rows: [
          {
            label: "Adj list",
            value: "{A: [B, C], B: [A, D], C: [A, D], D: [B, C, E], E: [D]}",
            note: "O(V + E) space",
          },
          { label: "Adj matrix", value: "5×5 array of 0/1", note: "O(V²) space" },
          { label: "Edge list", value: "[(A,B), (A,C), (B,D), (C,D), (D,E)]", note: "O(E) space" },
        ],
      },
      {
        type: "callout",
        kind: "perf",
        text: "CPUs love contiguous arrays. Adjacency-list neighbourhoods in Python are already Python lists (contiguous pointers) — good enough for most interview problems.",
      },
    ],
  },

  {
    slug: "advantages-disadvantages",
    title: "Advantages & Disadvantages",
    eyebrow: "Foundations · 21",
    description: "Trade-offs to know before reaching for a graph.",
    difficulty: "Beginner",
    readMinutes: 3,
    sections: [
      {
        type: "table",
        headers: ["Advantages", "Disadvantages"],
        rows: [
          ["Models any pairwise relationship", "Higher memory overhead than arrays"],
          [
            "Enables shortest paths, flows, MSTs",
            "Traversal is O(V + E) — expensive on huge graphs",
          ],
          ["Handles multiple components", "Correct representation matters for performance"],
          [
            "Directly supports weights and directions",
            "Cycles complicate recursion (recursion limits)",
          ],
        ],
      },
    ],
  },

  {
    slug: "applications-complexity-summary",
    title: "Applications, Complexity & Summary",
    eyebrow: "Foundations · 22",
    description: "Where graphs live in production, complexity cheat sheet, and what's next.",
    difficulty: "Beginner",
    readMinutes: 5,
    sections: [
      { type: "heading", text: "Applications" },
      {
        type: "theory",
        bullets: [
          "GPS routing, ride-share matching, delivery planning.",
          "Social networks — friend suggestions, communities.",
          "Web crawlers, PageRank, semantic search.",
          "Compilers — SSA, control flow, register allocation.",
          "Circuit design, VLSI routing, network flow.",
          "Blockchain — transaction / dependency DAGs.",
        ],
      },
      { type: "heading", text: "Complexity overview" },
      {
        type: "complexity",
        rows: [
          { op: "Space — adjacency list", time: "O(V + E)" },
          { op: "Space — adjacency matrix", time: "O(V²)" },
          { op: "BFS / DFS", time: "O(V + E)", space: "O(V)" },
          { op: "Dijkstra (binary heap)", time: "O((V + E) log V)", space: "O(V)" },
          { op: "Bellman-Ford", time: "O(V · E)", space: "O(V)" },
          { op: "Floyd-Warshall", time: "O(V³)", space: "O(V²)" },
          { op: "Kruskal / Prim", time: "O(E log V)", space: "O(V + E)" },
          { op: "Union-Find op", time: "≈ O(α(V))", space: "O(V)", note: "with path compression" },
        ],
      },
      { type: "heading", text: "Summary" },
      {
        type: "theory",
        bullets: [
          "Graphs generalise every data structure — trees, lists, tries.",
          "Vocabulary matters: vertex, edge, degree, cycle, component.",
          "Sparse ⇒ adjacency list; dense ⇒ adjacency matrix.",
          "Every graph algorithm you'll learn is a decorated BFS or DFS.",
        ],
      },
      {
        type: "callout",
        kind: "info",
        title: "Next up",
        text: "Explore Graph Types to see how each variant restricts or extends this base model, then Representations to lock in how the data lives in memory.",
      },
    ],
  },
];
