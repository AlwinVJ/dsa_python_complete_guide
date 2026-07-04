import type { GLesson, GraphSpec } from "./types";

const DEMO: GraphSpec = {
  nodes: [{ id: "A" }, { id: "B" }, { id: "C" }, { id: "D" }, { id: "E" }, { id: "F" }],
  edges: [
    { from: "A", to: "B" },
    { from: "A", to: "C" },
    { from: "B", to: "D" },
    { from: "C", to: "D" },
    { from: "D", to: "E" },
    { from: "E", to: "F" },
  ],
};

const DISCONNECTED: GraphSpec = {
  nodes: [{ id: "A" }, { id: "B" }, { id: "C" }, { id: "D" }, { id: "E" }, { id: "F" }],
  edges: [
    { from: "A", to: "B" },
    { from: "B", to: "C" },
    { from: "D", to: "E" },
  ],
};

export const G_TRAVERSALS: GLesson[] = [
  {
    slug: "overview",
    title: "Traversal Overview",
    eyebrow: "Traversals · 1",
    description: "Two ways to visit every reachable vertex — and why almost every graph algorithm is one of them in disguise.",
    difficulty: "Beginner",
    readMinutes: 3,
    sections: [
      { type: "theory", text: "Traversal means visiting every vertex reachable from a starting point exactly once. There are exactly two orders that matter: breadth-first (spread outward level by level, using a queue) and depth-first (commit to one path as far as possible, using a stack or recursion). Every algorithm later in this course — shortest paths, MST, topological sort, cycle detection — is a decorated BFS or DFS." },
      { type: "graphViz", spec: DEMO, caption: "We'll traverse this graph starting from A in every lesson below." },
      { type: "table", headers: ["", "BFS", "DFS"], rows: [
        ["Data structure", "Queue (FIFO)", "Stack (LIFO) or recursion"],
        ["Explores", "Level by level (nearest first)", "One branch fully before backtracking"],
        ["Typical use", "Shortest path (unweighted), level order", "Cycle detection, topological sort, components"],
        ["Space (worst case)", "O(V) — widest level", "O(V) — deepest path / recursion stack"],
      ]},
    ],
  },

  {
    slug: "bfs",
    title: "Breadth-First Search (BFS)",
    eyebrow: "Traversals · 2",
    description: "Explore level by level with a queue — the shortest-path algorithm for unweighted graphs.",
    difficulty: "Beginner",
    readMinutes: 7,
    sections: [
      { type: "theory", text: "BFS starts at a source vertex, visits all of its direct neighbours, then all of their unvisited neighbours, and so on — expanding outward one full 'ring' at a time. Because it explores in order of distance, the first time BFS reaches a vertex is guaranteed to be via a shortest path (in terms of edge count) from the source." },
      { type: "bfsPlayer", spec: DEMO, start: "A", caption: "Watch the queue grow and drain — each dequeue is a visit." },
      { type: "code", title: "python — full implementation", code:
`from collections import deque

def bfs(graph, start):
    visited = {start}
    order = []
    queue = deque([start])
    while queue:
        u = queue.popleft()
        order.append(u)
        for v in graph[u]:
            if v not in visited:
                visited.add(v)          # mark on enqueue, not on dequeue
                queue.append(v)
    return order

graph = {"A": ["B", "C"], "B": ["A", "D"], "C": ["A", "D"],
         "D": ["B", "C", "E"], "E": ["D", "F"], "F": ["E"]}
print(bfs(graph, "A"))   # ['A', 'B', 'C', 'D', 'E', 'F']` },
      { type: "code", title: "python — shortest path + distances", code:
`def bfs_distances(graph, start):
    dist = {start: 0}
    queue = deque([start])
    while queue:
        u = queue.popleft()
        for v in graph[u]:
            if v not in dist:
                dist[v] = dist[u] + 1
                queue.append(v)
    return dist   # edge-count distance from start to every reachable vertex` },
      { type: "dryRun", headers: ["Step", "Dequeue", "Queue after", "Visited"], rows: [
        ["1", "—", "[A]", "{A}"],
        ["2", "A", "[B, C]", "{A, B, C}"],
        ["3", "B", "[C, D]", "{A, B, C, D}"],
        ["4", "C", "[D]", "{A, B, C, D}"],
        ["5", "D", "[E]", "{A, B, C, D, E}"],
        ["6", "E", "[F]", "{A, B, C, D, E, F}"],
        ["7", "F", "[]", "{A, B, C, D, E, F}"],
      ], caption: "D is enqueued twice as a candidate (from B and from C) but only visited once — the `visited` check on enqueue prevents duplicates." },
      { type: "complexity", rows: [
        { op: "Time", time: "O(V + E)" },
        { op: "Space", time: "O(V)", note: "queue + visited set, worst case the widest level" },
      ]},
      { type: "mistakes", items: [
        "Marking a vertex visited on dequeue instead of on enqueue — lets the same vertex enter the queue multiple times and wastes work (or breaks shortest-distance correctness).",
        "Forgetting the visited set entirely on a cyclic graph — infinite loop.",
        "Using BFS for shortest path on a weighted graph — BFS only guarantees shortest path by edge count, not by weight. Use Dijkstra for that.",
      ]},
      { type: "callout", kind: "interview", title: "Interview signal", text: "'Shortest path' + 'unweighted' + 'grid or graph' is the classic BFS tell. If you see weights, that's your cue to reach for Dijkstra instead." },
      { type: "practice", groups: [
        { level: "Beginner", items: [
          { title: "Number of Islands", url: "https://leetcode.com/problems/number-of-islands/", difficulty: "Medium", pattern: "BFS/DFS on grid" },
        ] },
        { level: "Intermediate", items: [
          { title: "Rotting Oranges", url: "https://leetcode.com/problems/rotting-oranges/", difficulty: "Medium", pattern: "Multi-source BFS" },
          { title: "Word Ladder", url: "https://leetcode.com/problems/word-ladder/", difficulty: "Hard", pattern: "BFS shortest path" },
        ] },
      ] },
    ],
  },

  {
    slug: "dfs-recursive",
    title: "Depth-First Search — Recursive",
    eyebrow: "Traversals · 3",
    description: "Commit to a path, backtrack when stuck — the natural recursive formulation.",
    difficulty: "Beginner",
    readMinutes: 6,
    sections: [
      { type: "theory", text: "DFS dives as deep as possible along one branch before backtracking. The recursive version mirrors the call stack directly onto the graph's structure — each recursive call is a 'push', and returning from it is a 'pop'. It's the shortest way to write DFS, but it's bounded by Python's recursion limit on very deep graphs." },
      { type: "dfsPlayer", spec: DEMO, start: "A", caption: "Same graph as BFS — notice how far DFS commits before ever backtracking." },
      { type: "code", title: "python — full implementation", code:
`def dfs_recursive(graph, start, visited=None, order=None):
    if visited is None:
        visited, order = set(), []
    visited.add(start)
    order.append(start)
    for neighbour in graph[start]:
        if neighbour not in visited:
            dfs_recursive(graph, neighbour, visited, order)
    return order

graph = {"A": ["B", "C"], "B": ["A", "D"], "C": ["A", "D"],
         "D": ["B", "C", "E"], "E": ["D", "F"], "F": ["E"]}
print(dfs_recursive(graph, "A"))   # ['A', 'B', 'D', 'C', 'E', 'F']` },
      { type: "complexity", rows: [
        { op: "Time", time: "O(V + E)" },
        { op: "Space", time: "O(V)", note: "recursion stack, worst case a single long path" },
      ]},
      { type: "mistakes", items: [
        "Forgetting the mutable-default-argument trap — `visited=None` then creating a fresh set inside the call, not `visited={}` in the signature.",
        "Deep graphs (e.g. a long chain of 10,000+ vertices) can hit Python's default recursion limit (~1000) — switch to the iterative version for large inputs.",
      ]},
      { type: "callout", kind: "tip", text: "sys.setrecursionlimit() is a band-aid, not a fix — for graphs where depth isn't bounded, prefer the iterative DFS in the next lesson." },
    ],
  },

  {
    slug: "dfs-iterative",
    title: "Depth-First Search — Iterative",
    eyebrow: "Traversals · 4",
    description: "The same traversal order, with an explicit stack instead of the call stack.",
    difficulty: "Intermediate",
    readMinutes: 5,
    sections: [
      { type: "theory", text: "The iterative version replaces Python's call stack with an explicit list used as a stack. It avoids recursion-limit issues entirely and makes the 'push / pop' mechanics of DFS visible instead of implicit — which is also why interviewers sometimes specifically ask for it." },
      { type: "code", title: "python — full implementation", code:
`def dfs_iterative(graph, start):
    visited = set()
    order = []
    stack = [start]
    while stack:
        u = stack.pop()
        if u in visited:
            continue
        visited.add(u)
        order.append(u)
        # Reverse so we still explore neighbours in the same left-to-right
        # order the recursive version would.
        for v in reversed(graph[u]):
            if v not in visited:
                stack.append(v)
    return order

graph = {"A": ["B", "C"], "B": ["A", "D"], "C": ["A", "D"],
         "D": ["B", "C", "E"], "E": ["D", "F"], "F": ["E"]}
print(dfs_iterative(graph, "A"))   # ['A', 'B', 'D', 'C', 'E', 'F']` },
      { type: "complexity", rows: [
        { op: "Time", time: "O(V + E)" },
        { op: "Space", time: "O(V)", note: "explicit stack instead of the call stack" },
      ]},
      { type: "mistakes", items: [
        "Marking visited on push instead of on pop — a vertex can be pushed multiple times before it's ever processed, so checking on pop (with a `continue` guard) is the safe pattern shown above.",
        "Not reversing the neighbour list — you'll still get a valid DFS, just in a different (mirrored) order than the recursive version, which can confuse dry-run comparisons.",
      ]},
      { type: "quiz", items: [
        { q: "Why does the iterative DFS check `if u in visited: continue` after popping, rather than only checking before pushing?", choices: ["It doesn't matter, it's just a style choice", "A vertex can be pushed onto the stack multiple times before it's first processed", "It makes the algorithm faster", "It's required to avoid a syntax error"], answer: 1, explain: "Two different neighbours can both push the same unvisited vertex before either is popped, so the stack can contain duplicates — the post-pop check discards the stale ones." },
      ]},
    ],
  },

  {
    slug: "connected-components",
    title: "Connected Components",
    eyebrow: "Traversals · 5",
    description: "Run BFS or DFS from every unvisited vertex to partition a graph into its pieces.",
    difficulty: "Intermediate",
    readMinutes: 5,
    sections: [
      { type: "theory", text: "A connected component is a maximal set of vertices where every pair is joined by some path. Finding all components is a direct application of traversal: run BFS or DFS from any unvisited vertex, mark everything it reaches as one component, then repeat from the next unvisited vertex." },
      { type: "graphViz", spec: DISCONNECTED, caption: "Three components: {A, B, C}, {D, E}, and the isolated vertex F." },
      { type: "code", title: "python", code:
`def connected_components(graph, vertices):
    visited = set()
    components = []
    for start in vertices:
        if start in visited:
            continue
        # BFS from this unvisited vertex collects one whole component.
        component = []
        stack = [start]
        while stack:
            u = stack.pop()
            if u in visited:
                continue
            visited.add(u)
            component.append(u)
            stack.extend(graph.get(u, []))
        components.append(component)
    return components

graph = {"A": ["B"], "B": ["A", "C"], "C": ["B"], "D": ["E"], "E": ["D"], "F": []}
print(connected_components(graph, ["A", "B", "C", "D", "E", "F"]))
# [['A', 'B', 'C'], ['D', 'E'], ['F']]` },
      { type: "complexity", rows: [
        { op: "Time", time: "O(V + E)", note: "every vertex and edge is visited exactly once overall" },
        { op: "Space", time: "O(V)" },
      ]},
      { type: "callout", kind: "did", text: "For directed graphs, this same idea generalizes into strongly connected components — but a directed edge only lets you traverse one way, so it needs a smarter algorithm (Kosaraju's or Tarjan's), covered later in Algorithms." },
      { type: "references", items: [
        { label: "Visualgo — Connected Components", url: "https://visualgo.net/en/dfsbfs" },
      ] },
    ],
  },
];
