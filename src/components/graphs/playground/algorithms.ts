import { Node, Edge, BaseFrame } from "./types";

export const edgeKey = (u: number, v: number) => (u < v ? `${u}-${v}` : `${v}-${u}`);

/* ---------- Codes for Python Viewer ---------- */

export const BFS_CODE = `from collections import deque

def bfs(G, src):
    seen = {src}
    dist = {src: 0}
    q = deque([src])
    while q:
        u = q.popleft()
        for v in G[u]:
            if v not in seen:
                seen.add(v)
                dist[v] = dist[u] + 1
                q.append(v)
    return dist`;

export const DFS_CODE = `def dfs(G, src):
    seen = set()
    stack = [src]
    while stack:
        u = stack.pop()
        if u in seen: continue
        seen.add(u)
        for v in G[u]:
            if v not in seen:
                stack.append(v)`;

export const DIJK_CODE = `import heapq

def dijkstra(G, src):
    dist = {u: float('inf') for u in G}
    dist[src] = 0
    pq = [(0, src)]
    while pq:
        d, u = heapq.heappop(pq)
        if d > dist[u]: continue
        for v, w in G[u]:
            nd = d + w
            if nd < dist[v]:
                dist[v] = nd
                heapq.heappush(pq, (nd, v))
    return dist`;

export const BELLMAN_FORD_CODE = `def bellman_ford(V, edges, src):
    dist = [float('inf')] * V
    dist[src] = 0
    
    # Relax all edges V - 1 times
    for i in range(V - 1):
        for u, v, w in edges:
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                
    # Check for negative-weight cycles
    for u, v, w in edges:
        if dist[u] + w < dist[v]:
            raise ValueError("Graph contains negative cycle")
            
    return dist`;

export const FLOYD_WARSHALL_CODE = `def floyd_warshall(V, edges):
    dist = [[float('inf')] * V for _ in range(V)]
    for i in range(V):
        dist[i][i] = 0
    for u, v, w in edges:
        dist[u][v] = w
        
    for k in range(V):
        for i in range(V):
            for j in range(V):
                if dist[i][k] + dist[k][j] < dist[i][j]:
                    dist[i][j] = dist[i][k] + dist[k][j]
    return dist`;

export const PRIM_CODE = `import heapq

def prim(V, adj):
    mst_weight = 0
    visited = [False] * V
    pq = [(0, 0, -1)] # (weight, u, parent)
    mst_edges = []
    
    while pq:
        w, u, p = heapq.heappop(pq)
        if visited[u]: continue
        visited[u] = True
        mst_weight += w
        if p != -1:
            mst_edges.append((p, u))
            
        for v, weight in adj[u]:
            if not visited[v]:
                heapq.heappush(pq, (weight, v, u))
    return mst_edges, mst_weight`;

export const KRUSKAL_CODE = `class DSU:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n
    def find(self, i):
        if self.parent[i] == i: return i
        self.parent[i] = self.find(self.parent[i])
        return self.parent[i]
    def union(self, i, j):
        root_i = self.find(i)
        root_j = self.find(j)
        if root_i != root_j:
            if self.rank[root_i] < self.rank[root_j]:
                self.parent[root_i] = root_j
            elif self.rank[root_i] > self.rank[root_j]:
                self.parent[root_j] = root_i
            else:
                self.parent[root_j] = root_i
                self.rank[root_i] += 1
            return True
        return False

def kruskal(V, edges):
    edges = sorted(edges, key=lambda x: x[2])
    dsu = DSU(V)
    mst = []
    mst_weight = 0
    for u, v, w in edges:
        if dsu.union(u, v):
            mst.append((u, v))
            mst_weight += w
    return mst, mst_weight`;

export const TOPO_CODE = `from collections import deque

def topological_sort(V, adj):
    in_degree = [0] * V
    for u in range(V):
        for v, _ in adj[u]:
            in_degree[v] += 1
            
    q = deque([u for u in range(V) if in_degree[u] == 0])
    order = []
    while q:
        u = q.popleft()
        order.append(u)
        for v, _ in adj[u]:
            in_degree[v] -= 1
            if in_degree[v] == 0:
                q.append(v)
    return order`;

export const UF_CODE = `class DSU:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n

    def find(self, i):
        # Path compression
        if self.parent[i] == i:
            return i
        self.parent[i] = self.find(self.parent[i])
        return self.parent[i]

    def union(self, i, j):
        # Union by rank
        root_i = self.find(i)
        root_j = self.find(j)
        if root_i != root_j:
            if self.rank[root_i] < self.rank[root_j]:
                self.parent[root_i] = root_j
            elif self.rank[root_i] > self.rank[root_j]:
                self.parent[root_j] = root_i
            else:
                self.parent[root_j] = root_i
                self.rank[root_i] += 1`;

export const SCC_CODE = `def kosaraju(V, adj):
    visited = [False] * V
    stack = []
    
    # 1. Fill finishing times stack
    def dfs1(u):
        visited[u] = True
        for v, _ in adj[u]:
            if not visited[v]: dfs1(v)
        stack.append(u)
        
    for i in range(V):
        if not visited[i]: dfs1(i)
        
    # 2. Transpose graph
    transpose = [[] for _ in range(V)]
    for u in range(V):
        for v, _ in adj[u]:
            transpose[v].append(u)
            
    # 3. DFS in stack order to find SCCs
    visited = [False] * V
    sccs = []
    def dfs2(u, component):
        visited[u] = True
        component.append(u)
        for v in transpose[u]:
            if not visited[v]: dfs2(v, component)
            
    while stack:
        u = stack.pop()
        if not visited[u]:
            comp = []
            dfs2(u, comp)
            sccs.append(comp)
    return sccs`;

/* ---------- Adjacency Builder ---------- */

function buildAdjacency(nodes: Node[], edges: Edge[], directed: boolean) {
  const adj: { v: number; w: number }[][] = nodes.map(() => []);
  edges.forEach(({ u, v, w }) => {
    if (u < nodes.length && v < nodes.length) {
      adj[u].push({ v, w });
      if (!directed) {
        adj[v].push({ v: u, w });
      }
    }
  });
  return adj;
}

/* ---------- Tracers ---------- */

// 1. BFS
export function traceBFS(nodes: Node[], edges: Edge[], src: number, directed: boolean): BaseFrame[] {
  const adj = buildAdjacency(nodes, edges, directed);
  const frames: BaseFrame[] = [];
  const visited: number[] = [];
  const dist = nodes.map(() => Infinity);
  const treeEdges: string[] = [];
  let queue: number[] = [];

  const snap = (line: number, note: string, explanation: string, currentGoal: string, currentFocus: string, current: number | null, extras: Partial<BaseFrame> = {}) => {
    frames.push({
      kind: "bfs",
      line,
      note,
      explanation,
      currentGoal,
      currentFocus,
      current,
      activeNodes: current !== null ? [current] : [],
      activeEdges: [],
      treeEdges: [...treeEdges],
      visited: [...visited],
      stats: {
        "Visited Nodes": `${visited.length} / ${nodes.length}`,
        "Queue Size": queue.length,
        "Tree Edges": treeEdges.length,
        "Complexity": "O(V + E)",
      },
      dist: [...dist],
      queue: [...queue],
      ...extras,
    });
  };

  visited.push(src);
  dist[src] = 0;
  queue.push(src);
  snap(6, `Start BFS at ${nodes[src].label}.`, `We initialize the search by visiting the source vertex ${nodes[src].label}, setting its distance to 0, and pushing it onto the FIFO queue.`, "Initialize search", nodes[src].label, src);

  while (queue.length) {
    const u = queue.shift()!;
    snap(7, `Dequeue ${nodes[u].label}.`, `We pop ${nodes[u].label} from the front of the queue to check its outgoing edges and explore its unvisited neighbors.`, "Explore vertex", nodes[u].label, u);

    for (const { v } of adj[u]) {
      const edge = edgeKey(u, v);
      if (!visited.includes(v)) {
        visited.push(v);
        dist[v] = dist[u] + 1;
        treeEdges.push(edge);
        queue.push(v);
        snap(11, `Visit neighbor ${nodes[v].label}.`, `Neighbor ${nodes[v].label} is unvisited. We mark it visited, update its distance to dist[${nodes[u].label}] + 1 = ${dist[v]}, append the edge to the tree, and queue it.`, "Visit neighbors", nodes[v].label, u, {
          activeNodes: [u, v],
          activeEdges: [edge],
        });
      } else {
        snap(9, `Skip neighbor ${nodes[v].label}.`, `Neighbor ${nodes[v].label} has already been visited, so we bypass it to avoid cycles or redundant processing.`, "Skip visited neighbor", nodes[v].label, u, {
          activeNodes: [u, v],
        });
      }
    }
  }
  snap(12, "BFS complete.", "The queue is empty, meaning all reachable nodes have been traversed. The shortest path lengths (in edge count) are finalized.", "Traversal completed", "None", null, { done: true });
  return frames;
}

// 2. DFS
export function traceDFS(nodes: Node[], edges: Edge[], src: number, directed: boolean): BaseFrame[] {
  const adj = buildAdjacency(nodes, edges, directed);
  const frames: BaseFrame[] = [];
  const visited: number[] = [];
  const treeEdges: string[] = [];
  let stack: number[] = [src];
  const parent = new Map<number, number>();

  const snap = (line: number, note: string, explanation: string, currentGoal: string, currentFocus: string, current: number | null, extras: Partial<BaseFrame> = {}) => {
    frames.push({
      kind: "dfs",
      line,
      note,
      explanation,
      currentGoal,
      currentFocus,
      current,
      activeNodes: current !== null ? [current] : [],
      activeEdges: [],
      treeEdges: [...treeEdges],
      visited: [...visited],
      stats: {
        "Visited Nodes": `${visited.length} / ${nodes.length}`,
        "Stack Size": stack.length,
        "Tree Edges": treeEdges.length,
        "Complexity": "O(V + E)",
      },
      stack: [...stack],
      ...extras,
    });
  };

  snap(3, `Start DFS at ${nodes[src].label}.`, `We initialize the depth-first search by pushing the source node ${nodes[src].label} onto the LIFO stack.`, "Initialize stack", nodes[src].label, src);

  while (stack.length) {
    const u = stack.pop()!;
    if (visited.includes(u)) {
      snap(6, `Pop ${nodes[u].label} (already visited).`, `Node ${nodes[u].label} has already been visited since it was pushed onto the stack. We pop and skip it to prevent loops.`, "Pop stack", nodes[u].label, u);
      continue;
    }
    visited.push(u);
    const p = parent.get(u);
    if (p !== undefined) {
      treeEdges.push(edgeKey(p, u));
    }
    snap(7, `Visit ${nodes[u].label}.`, `We pop ${nodes[u].label} from the stack and mark it as visited, drawing a tree edge from parent if applicable.`, "Explore vertex", nodes[u].label, u);

    // Push neighbors in reverse order to explore smaller IDs first (matching original trace)
    const neighbors = [...adj[u]].sort((a, b) => b.v - a.v);
    for (const { v } of neighbors) {
      if (!visited.includes(v)) {
        stack.push(v);
        parent.set(v, u);
        snap(9, `Push neighbor ${nodes[v].label}.`, `Neighbor ${nodes[v].label} is unvisited. We push it onto the stack and set its parent to ${nodes[u].label}.`, "Push neighbors", nodes[v].label, u, {
          activeNodes: [u, v],
        });
      }
    }
  }
  snap(10, "DFS complete.", "The stack is empty, meaning we have fully explored the deepest paths of the graph and backtracked completely.", "Traversal completed", "None", null, { done: true });
  return frames;
}

// 3. DIJKSTRA
export function traceDijkstra(nodes: Node[], edges: Edge[], src: number, directed: boolean): BaseFrame[] {
  const adj = buildAdjacency(nodes, edges, directed);
  const frames: BaseFrame[] = [];
  const dist = nodes.map(() => Infinity);
  const visited: number[] = [];
  const treeEdges: string[] = [];
  const parent = new Map<number, number>();
  let pq: { d: number; v: number; p?: number }[] = [];

  const sortPQ = () => {
    pq = [...pq].sort((a, b) => a.d - b.d);
  };

  const snap = (line: number, note: string, explanation: string, currentGoal: string, currentFocus: string, current: number | null, extras: Partial<BaseFrame> = {}) => {
    frames.push({
      kind: "dijkstra",
      line,
      note,
      explanation,
      currentGoal,
      currentFocus,
      current,
      activeNodes: current !== null ? [current] : [],
      activeEdges: [],
      treeEdges: [...treeEdges],
      visited: [...visited],
      stats: {
        "Visited Nodes": `${visited.length} / ${nodes.length}`,
        "PQ Size": pq.length,
        "Tree Edges": treeEdges.length,
        "Complexity": "O((V + E) log V)",
      },
      dist: [...dist],
      pq: pq.map((item) => ({ ...item })),
      ...extras,
    });
  };

  dist[src] = 0;
  pq.push({ d: 0, v: src, p: -1 });
  sortPQ();
  snap(6, `Initialise: dist[${nodes[src].label}] = 0.`, `We set the source node distance to 0, all other nodes to infinity, and push the source onto the priority queue.`, "Initialize distances", nodes[src].label, src);

  while (pq.length) {
    sortPQ();
    const { d, v: u, p } = pq.shift()!;
    if (d > dist[u]) {
      snap(8, `Pop stale entry for ${nodes[u].label} (d=${d} > dist=${dist[u]}).`, `This priority queue entry has a distance of ${d}, which is greater than the current shortest distance of ${dist[u]}. We ignore this outdated path.`, "Pop priority queue", nodes[u].label, u);
      continue;
    }
    visited.push(u);
    if (p !== undefined && p !== -1) {
      treeEdges.push(edgeKey(p, u));
    }
    snap(7, `Finalise ${nodes[u].label} at distance ${d}.`, `We pop ${nodes[u].label} with the minimum tentative distance (${d}) and mark it as finalised. Its shortest path is now known.`, "Finalise node distance", nodes[u].label, u);

    for (const { v, w } of adj[u]) {
      const nd = d + w;
      const edge = edgeKey(u, v);
      if (nd < dist[v]) {
        dist[v] = nd;
        parent.set(v, u);
        pq.push({ d: nd, v, p: u });
        sortPQ();
        snap(11, `Relax edge ${nodes[u].label}→${nodes[v].label} (new dist: ${nd}).`, `We can reach ${nodes[v].label} via ${nodes[u].label} in distance ${d} + ${w} = ${nd}, which is shorter than its current distance of ${dist[v] === Infinity ? "∞" : dist[v]}. We update it.`, "Relax edge", nodes[v].label, u, {
          activeNodes: [u, v],
          activeEdges: [edge],
        });
      } else {
        snap(10, `Edge ${nodes[u].label}→${nodes[v].label} (no improvement).`, `Path to ${nodes[v].label} via ${nodes[u].label} has length ${d} + ${w} = ${nd}, which is not shorter than the current distance of ${dist[v]}. We skip it.`, "Evaluate edge", nodes[v].label, u, {
          activeNodes: [u, v],
        });
      }
    }
  }
  snap(12, "Dijkstra complete.", "The priority queue is empty. Shortest paths from the source node to all reachable nodes have been successfully calculated.", "Dijkstra completed", "None", null, { done: true });
  return frames;
}

// 4. BELLMAN-FORD
export function traceBellmanFord(nodes: Node[], edges: Edge[], src: number, directed: boolean): BaseFrame[] {
  const frames: BaseFrame[] = [];
  const dist = nodes.map(() => Infinity);
  const parent = new Map<number, number>();
  const treeEdges: string[] = [];
  let relaxations = 0;

  const snap = (line: number, note: string, explanation: string, currentGoal: string, currentFocus: string, current: number | null, extras: Partial<BaseFrame> = {}) => {
    // Reconstruct tree edges from parents
    const activeTree: string[] = [];
    parent.forEach((p, v) => {
      activeTree.push(edgeKey(p, v));
    });

    frames.push({
      kind: "bellman-ford",
      line,
      note,
      explanation,
      currentGoal,
      currentFocus,
      current,
      activeNodes: current !== null ? [current] : [],
      activeEdges: [],
      treeEdges: activeTree,
      visited: nodes.map(n => n.id).filter(id => dist[id] !== Infinity),
      stats: {
        "Relaxations": relaxations,
        "Nodes Relaxed": parent.size,
        "Complexity": "O(V * E)",
      },
      dist: [...dist],
      ...extras,
    });
  };

  dist[src] = 0;
  snap(3, `Start Bellman-Ford at ${nodes[src].label}.`, `We initialize by setting dist[${nodes[src].label}] = 0 and all other tentative distances to infinity.`, "Initialize distances", nodes[src].label, src);

  const V = nodes.length;
  let changed = false;

  // Relax edges V - 1 times
  for (let i = 0; i < V - 1; i++) {
    changed = false;
    snap(5, `Start Pass ${i + 1} of ${V - 1}.`, `In pass ${i + 1}, we iterate through all edges to relax distances. In the worst case, a shortest path can have V - 1 edges, requiring V - 1 passes to propagate information.`, `Pass ${i + 1}`, `Pass ${i + 1}`, null);
    
    for (const { u, v, w } of edges) {
      const edge = edgeKey(u, v);
      if (dist[u] === Infinity) {
        snap(6, `Skip edge ${nodes[u].label}→${nodes[v].label}.`, `Source vertex ${nodes[u].label} is unreachable (distance is ∞). We cannot relax this edge.`, "Evaluate edge", `${nodes[u].label}→${nodes[v].label}`, u, {
          activeNodes: [u, v],
          activeEdges: [edge],
        });
        continue;
      }
      
      const nd = dist[u] + w;
      if (nd < dist[v]) {
        dist[v] = nd;
        parent.set(v, u);
        relaxations++;
        changed = true;
        snap(7, `Relax edge ${nodes[u].label}→${nodes[v].label} (new dist: ${nd}).`, `A shorter path to ${nodes[v].label} of length ${dist[u]} + ${w} = ${nd} is found through ${nodes[u].label} (previous: ${dist[v] === Infinity ? "∞" : dist[v]}).`, "Relax edge", `${nodes[u].label}→${nodes[v].label}`, u, {
          activeNodes: [u, v],
          activeEdges: [edge],
        });
      } else {
        snap(6, `Edge ${nodes[u].label}→${nodes[v].label} (no improvement).`, `Path to ${nodes[v].label} via ${nodes[u].label} has length ${dist[u]} + ${w} = ${nd}, which is not shorter than the current distance of ${dist[v]}.`, "Evaluate edge", `${nodes[u].label}→${nodes[v].label}`, u, {
          activeNodes: [u, v],
          activeEdges: [edge],
        });
      }

      // If undirected, check reverse edge too
      if (!directed) {
        const nd2 = dist[v] + w;
        if (dist[v] !== Infinity && nd2 < dist[u]) {
          dist[u] = nd2;
          parent.set(u, v);
          relaxations++;
          changed = true;
          snap(7, `Relax edge ${nodes[v].label}→${nodes[u].label} (new dist: ${nd2}).`, `Shorted path to ${nodes[u].label} found via undirected path from ${nodes[v].label}. New distance is ${nd2}.`, "Relax edge", `${nodes[v].label}→${nodes[u].label}`, v, {
            activeNodes: [u, v],
            activeEdges: [edge],
          });
        }
      }
    }

    if (!changed) {
      snap(5, `Early termination: no changes in Pass ${i + 1}.`, `Since no distances were relaxed in this pass, the shortest paths have converged early. We can stop.`, "Check convergence", "None", null);
      break;
    }
  }

  // 2nd Phase: Check for negative-weight cycles
  snap(10, "Check for negative cycles.", "We perform one final pass over all edges. If a distance can still be relaxed, it indicates a negative-weight cycle that allows infinitely small paths.", "Verify negative cycles", "All edges", null);
  
  let hasNegativeCycle = false;
  for (const { u, v, w } of edges) {
    if (dist[u] !== Infinity && dist[u] + w < dist[v]) {
      hasNegativeCycle = true;
      snap(12, `Negative cycle detected at edge ${nodes[u].label}→${nodes[v].label}!`, `Path to ${nodes[v].label} can still be shortened to ${dist[u] + w} (current: ${dist[v]}). This means a negative-weight cycle is reachable!`, "Error state", `${nodes[u].label}→${nodes[v].label}`, u, {
        activeNodes: [u, v],
        activeEdges: [edgeKey(u, v)],
      });
      break;
    }
  }

  if (!hasNegativeCycle) {
    snap(14, "Bellman-Ford complete (No negative cycles).", "The algorithm successfully computed shortest paths from the source node without encountering negative cycles.", "Bellman-Ford completed", "None", null, { done: true });
  } else {
    snap(14, "Bellman-Ford complete (Negative cycle found).", "Shortest paths are invalid due to a reachable negative cycle.", "Bellman-Ford completed", "Negative Cycle", null, { done: true });
  }

  return frames;
}

// 5. FLOYD-WARSHALL
export function traceFloydWarshall(nodes: Node[], edges: Edge[], directed: boolean): BaseFrame[] {
  const frames: BaseFrame[] = [];
  const V = nodes.length;

  // Initialize distance matrix
  const distMatrix = Array.from({ length: V }, () => Array(V).fill(Infinity));
  for (let i = 0; i < V; i++) {
    distMatrix[i][i] = 0;
  }
  for (const { u, v, w } of edges) {
    if (u < V && v < V) {
      distMatrix[u][v] = Math.min(distMatrix[u][v], w);
      if (!directed) {
        distMatrix[v][u] = Math.min(distMatrix[v][u], w);
      }
    }
  }

  let cellUpdates = 0;
  const snap = (line: number, note: string, explanation: string, currentGoal: string, currentFocus: string, k: number, i: number, j: number, extras: Partial<BaseFrame> = {}) => {
    frames.push({
      kind: "floyd-warshall",
      line,
      note,
      explanation,
      currentGoal,
      currentFocus,
      current: k,
      activeNodes: [k, i, j],
      activeEdges: [edgeKey(i, k), edgeKey(k, j)],
      treeEdges: [],
      visited: [],
      stats: {
        "Inter. Vertex k": nodes[k]?.label ?? k,
        "Row i": nodes[i]?.label ?? i,
        "Col j": nodes[j]?.label ?? j,
        "Cell Updates": cellUpdates,
        "Complexity": "O(V^3)",
      },
      distMatrix: distMatrix.map(row => [...row]),
      ...extras,
    });
  };

  // We snap at initialization
  frames.push({
    kind: "floyd-warshall",
    line: 2,
    note: "Initialize distance matrix.",
    explanation: "We set direct edge weights in the V x V distance matrix, set diagonal entries to 0, and all other cells to infinity.",
    currentGoal: "Initialize Matrix",
    currentFocus: "Matrix",
    current: null,
    activeNodes: [],
    activeEdges: [],
    treeEdges: [],
    visited: [],
    stats: { "Cell Updates": 0, "Complexity": "O(V^3)" },
    distMatrix: distMatrix.map(row => [...row]),
  });

  // Floyd-Warshall DP triples
  for (let k = 0; k < V; k++) {
    // Snap when changing intermediate node
    frames.push({
      kind: "floyd-warshall",
      line: 8,
      note: `Set intermediate node k = ${nodes[k].label}.`,
      explanation: `We will now check if any path between node i and node j can be shortened by detouring through node ${nodes[k].label}.`,
      currentGoal: `Detour via k = ${nodes[k].label}`,
      currentFocus: nodes[k].label,
      current: k,
      activeNodes: [k],
      activeEdges: [],
      treeEdges: [],
      visited: [],
      stats: {
        "Inter. Vertex k": nodes[k].label,
        "Cell Updates": cellUpdates,
        "Complexity": "O(V^3)",
      },
      distMatrix: distMatrix.map(row => [...row]),
    });

    for (let i = 0; i < V; i++) {
      for (let j = 0; j < V; j++) {
        if (i === j || i === k || j === k) continue;
        
        const pathThroughK = distMatrix[i][k] + distMatrix[k][j];
        const currentPath = distMatrix[i][j];

        if (distMatrix[i][k] !== Infinity && distMatrix[k][j] !== Infinity && pathThroughK < currentPath) {
          distMatrix[i][j] = pathThroughK;
          cellUpdates++;
          snap(12, `Shorten path ${nodes[i].label}→${nodes[j].label} via ${nodes[k].label}.`, 
            `Path ${nodes[i].label}→${nodes[j].label} (current: ${currentPath === Infinity ? "∞" : currentPath}) is shortened to ${pathThroughK} by detouring through ${nodes[k].label} (path: ${nodes[i].label}→${nodes[k].label}→${nodes[j].label} = ${distMatrix[i][k]} + ${distMatrix[k][j]}).`, 
            `Relax cell dist[${nodes[i].label}][${nodes[j].label}]`,
            `${nodes[i].label}→${nodes[k].label}→${nodes[j].label}`,
            k, i, j
          );
        }
      }
    }
  }

  // Done
  frames.push({
    kind: "floyd-warshall",
    line: 13,
    note: "Floyd-Warshall complete.",
    explanation: "The V x V distance matrix contains the shortest path distances between every pair of vertices in the graph.",
    currentGoal: "All-pairs shortest paths computed",
    currentFocus: "None",
    current: null,
    activeNodes: [],
    activeEdges: [],
    treeEdges: [],
    visited: [],
    stats: {
      "Cell Updates": cellUpdates,
      "Complexity": "O(V^3)",
    },
    distMatrix: distMatrix.map(row => [...row]),
    done: true,
  });

  return frames;
}

// 6. PRIM'S ALGORITHM
export function tracePrim(nodes: Node[], edges: Edge[], src: number, directed: boolean): BaseFrame[] {
  const adj = buildAdjacency(nodes, edges, directed);
  const frames: BaseFrame[] = [];
  const visited: number[] = [];
  const treeEdges: string[] = [];
  let mstWeight = 0;
  
  // PQ holds entries of (weight, node, parent)
  let pq: { d: number; v: number; p: number }[] = [];

  const sortPQ = () => {
    pq = [...pq].sort((a, b) => a.d - b.d);
  };

  const snap = (line: number, note: string, explanation: string, currentGoal: string, currentFocus: string, current: number | null, extras: Partial<BaseFrame> = {}) => {
    frames.push({
      kind: "prim",
      line,
      note,
      explanation,
      currentGoal,
      currentFocus,
      current,
      activeNodes: current !== null ? [current] : [],
      activeEdges: [],
      treeEdges: [...treeEdges],
      visited: [...visited],
      stats: {
        "MST Weight": mstWeight,
        "Visited Nodes": `${visited.length} / ${nodes.length}`,
        "PQ Size": pq.length,
        "Complexity": "O(E log V)",
      },
      pq: pq.map((item) => ({ d: item.d, v: item.v, p: item.p })),
      ...extras,
    });
  };

  pq.push({ d: 0, v: src, p: -1 });
  sortPQ();
  snap(6, `Start Prim's Algorithm at ${nodes[src].label}.`, `We initialize the Minimum Spanning Tree from the root vertex ${nodes[src].label} with cost 0.`, "Initialize PQ", nodes[src].label, src);

  while (pq.length) {
    sortPQ();
    const { d, v: u, p } = pq.shift()!;
    
    if (visited.includes(u)) {
      snap(10, `Skip ${nodes[u].label} (already in MST).`, `${nodes[u].label} is already part of the Minimum Spanning Tree. We discard this edge to prevent cycle formation.`, "Evaluate PQ node", nodes[u].label, u);
      continue;
    }
    
    visited.push(u);
    mstWeight += d;
    if (p !== -1) {
      treeEdges.push(edgeKey(p, u));
    }
    snap(11, `Add ${nodes[u].label} to MST (weight +${d}).`, `We select the minimum-weight edge connecting our MST to node ${nodes[u].label} (weight ${d}). Node ${nodes[u].label} is now added to the MST.`, "Extend MST", nodes[u].label, u, {
      activeEdges: p !== -1 ? [edgeKey(p, u)] : [],
    });

    for (const { v, w } of adj[u]) {
      if (!visited.includes(v)) {
        pq.push({ d: w, v, p: u });
        sortPQ();
        snap(17, `Add edge ${nodes[u].label}→${nodes[v].label} (weight ${w}) to PQ.`, `Neighbor ${nodes[v].label} is not in the MST. We push edge ${nodes[u].label}→${nodes[v].label} onto the PQ for potential selection.`, "Explore neighbors", nodes[v].label, u, {
          activeNodes: [u, v],
          activeEdges: [edgeKey(u, v)],
        });
      }
    }
  }

  snap(18, `Prim complete. MST Weight = ${mstWeight}.`, `All reachable nodes are connected. The Minimum Spanning Tree is finalized with total cost ${mstWeight}.`, "MST Completed", "None", null, { done: true });
  return frames;
}

// 7. KRUSKAL'S ALGORITHM
export function traceKruskal(nodes: Node[], edges: Edge[]): BaseFrame[] {
  const frames: BaseFrame[] = [];
  const V = nodes.length;

  // DSU Implementation for tracing
  const parent = Array.from({ length: V }, (_, i) => i);
  const rank = Array(V).fill(0);

  const find = (i: number): number => {
    let curr = i;
    while (parent[curr] !== curr) {
      curr = parent[curr];
    }
    // Path compression in tracing
    let temp = i;
    while (parent[temp] !== temp) {
      let next = parent[temp];
      parent[temp] = curr;
      temp = next;
    }
    return curr;
  };

  const union = (i: number, j: number): boolean => {
    const rootI = find(i);
    const rootJ = find(j);
    if (rootI !== rootJ) {
      if (rank[rootI] < rank[rootJ]) {
        parent[rootI] = rootJ;
      } else if (rank[rootI] > rank[rootJ]) {
        parent[rootJ] = rootI;
      } else {
        parent[rootJ] = rootI;
        rank[rootI]++;
      }
      return true;
    }
    return false;
  };

  // Sort edges by weight
  const sortedEdges = [...edges].sort((a, b) => a.w - b.w);
  const treeEdges: string[] = [];
  let mstWeight = 0;
  let edgesCheckedCount = 0;

  const snap = (line: number, note: string, explanation: string, currentGoal: string, currentFocus: string, u: number, v: number, extras: Partial<BaseFrame> = {}) => {
    frames.push({
      kind: "kruskal",
      line,
      note,
      explanation,
      currentGoal,
      currentFocus,
      current: null,
      activeNodes: [u, v],
      activeEdges: [edgeKey(u, v)],
      treeEdges: [...treeEdges],
      visited: [], // populated differently or unused
      stats: {
        "MST Weight": mstWeight,
        "Checked Edges": `${edgesCheckedCount} / ${edges.length}`,
        "Tree Edges": treeEdges.length,
        "Complexity": "O(E log E)",
      },
      parent: [...parent],
      rank: [...rank],
      ...extras,
    });
  };

  // Initial step
  frames.push({
    kind: "kruskal",
    line: 23,
    note: "Sort edges by weight and initialize DSU.",
    explanation: "We sort all edges of the graph in non-decreasing order of weight and create a Disjoint Set Union (DSU) structure where every node is its own parent.",
    currentGoal: "Sort Edges",
    currentFocus: "None",
    current: null,
    activeNodes: [],
    activeEdges: [],
    treeEdges: [],
    visited: [],
    stats: {
      "MST Weight": 0,
      "Checked Edges": "0 / " + edges.length,
      "Tree Edges": 0,
      "Complexity": "O(E log E)",
    },
    parent: [...parent],
    rank: [...rank],
  });

  for (const { u, v, w } of sortedEdges) {
    edgesCheckedCount++;
    const edge = edgeKey(u, v);
    const rootU = find(u);
    const rootV = find(v);

    if (rootU !== rootV) {
      union(u, v);
      treeEdges.push(edge);
      mstWeight += w;
      snap(27, `Select edge ${nodes[u].label}–${nodes[v].label} (weight ${w}).`, 
        `Since ${nodes[u].label} and ${nodes[v].label} belong to different DSU sets (roots: ${nodes[rootU].label} vs ${nodes[rootV].label}), adding this edge will not form a cycle. We union their sets and add the edge to the MST.`, 
        "Union components",
        `${nodes[u].label}–${nodes[v].label}`,
        u, v
      );
    } else {
      snap(26, `Skip edge ${nodes[u].label}–${nodes[v].label} (would create cycle).`, 
        `Since ${nodes[u].label} and ${nodes[v].label} already share the same DSU root (${nodes[rootU].label}), they are already connected. Adding this edge would form a cycle, so we skip it.`, 
        "Skip cyclic edge",
        `${nodes[u].label}–${nodes[v].label}`,
        u, v
      );
    }

    if (treeEdges.length === V - 1) {
      // Early stop when we have V-1 edges
      frames.push({
        kind: "kruskal",
        line: 28,
        note: `Early complete. MST Weight = ${mstWeight}.`,
        explanation: `We have selected V-1 = ${V - 1} edges. The spanning tree is fully connected. We stop processing remaining edges.`,
        currentGoal: "MST Found",
        currentFocus: "None",
        current: null,
        activeNodes: [],
        activeEdges: [],
        treeEdges: [...treeEdges],
        visited: [],
        stats: {
          "MST Weight": mstWeight,
          "Checked Edges": `${edgesCheckedCount} / ${edges.length}`,
          "Tree Edges": treeEdges.length,
          "Complexity": "O(E log E)",
        },
        parent: [...parent],
        rank: [...rank],
        done: true,
      });
      return frames;
    }
  }

  frames.push({
    kind: "kruskal",
    line: 28,
    note: `Kruskal complete. MST Weight = ${mstWeight}.`,
    explanation: `All edges have been processed. The Minimum Spanning Tree is finalized with total cost ${mstWeight}.`,
    currentGoal: "MST Completed",
    currentFocus: "None",
    current: null,
    activeNodes: [],
    activeEdges: [],
    treeEdges: [...treeEdges],
    visited: [],
    stats: {
      "MST Weight": mstWeight,
      "Checked Edges": `${edgesCheckedCount} / ${edges.length}`,
      "Tree Edges": treeEdges.length,
      "Complexity": "O(E log E)",
    },
    parent: [...parent],
    rank: [...rank],
    done: true,
  });

  return frames;
}

// 8. TOPOLOGICAL SORT (KAHN'S ALGORITHM)
export function traceTopoSort(nodes: Node[], edges: Edge[]): BaseFrame[] {
  const V = nodes.length;
  const adj = buildAdjacency(nodes, edges, true); // Kahn's only runs on directed graphs!
  
  const inDegree: Record<number, number> = {};
  nodes.forEach(n => { inDegree[n.id] = 0; });
  
  edges.forEach(({ u, v }) => {
    if (u < V && v < V) {
      inDegree[v] = (inDegree[v] || 0) + 1;
    }
  });

  const frames: BaseFrame[] = [];
  const queue: number[] = [];
  const order: number[] = [];

  const snap = (line: number, note: string, explanation: string, currentGoal: string, currentFocus: string, current: number | null, extras: Partial<BaseFrame> = {}) => {
    frames.push({
      kind: "topo-sort",
      line,
      note,
      explanation,
      currentGoal,
      currentFocus,
      current,
      activeNodes: current !== null ? [current] : [],
      activeEdges: [],
      treeEdges: [],
      visited: [...order],
      stats: {
        "Queue Size": queue.length,
        "Sorted Nodes": `${order.length} / ${V}`,
        "Complexity": "O(V + E)",
      },
      inDegree: { ...inDegree },
      queue: [...queue],
      order: [...order],
      ...extras,
    });
  };

  // Step 1: Initialize in-degrees
  nodes.forEach(n => {
    if ((inDegree[n.id] || 0) === 0) {
      queue.push(n.id);
    }
  });

  frames.push({
    kind: "topo-sort",
    line: 7,
    note: "Calculate initial in-degrees and queue sources.",
    explanation: "We count the number of incoming edges for each node (in-degrees) and add all source nodes (in-degree = 0) to our queue.",
    currentGoal: "Compute In-Degrees",
    currentFocus: "None",
    current: null,
    activeNodes: [],
    activeEdges: [],
    treeEdges: [],
    visited: [],
    stats: {
      "Queue Size": queue.length,
      "Sorted Nodes": "0 / " + V,
      "Complexity": "O(V + E)",
    },
    inDegree: { ...inDegree },
    queue: [...queue],
    order: [],
  });

  while (queue.length) {
    const u = queue.shift()!;
    order.push(u);
    snap(9, `Dequeue source vertex ${nodes[u].label} and add to order.`, 
      `We dequeue node ${nodes[u].label} as it has no dependencies (in-degree is 0), and place it in the topological output list.`, 
      "Output source vertex",
      nodes[u].label,
      u
    );

    for (const { v } of adj[u]) {
      const edge = edgeKey(u, v);
      inDegree[v] = Math.max(0, inDegree[v] - 1);
      
      if (inDegree[v] === 0) {
        queue.push(v);
        snap(13, `Decrement in-degree of ${nodes[v].label} to 0; queue it.`, 
          `Removing edge ${nodes[u].label}→${nodes[v].label} drops the in-degree of ${nodes[v].label} to 0. It now has no unmet dependencies and is queued.`, 
          "Queue new source",
          nodes[v].label,
          u,
          { activeNodes: [u, v], activeEdges: [edge] }
        );
      } else {
        snap(11, `Decrement in-degree of ${nodes[v].label} (now ${inDegree[v]}).`, 
          `We decrement the in-degree of node ${nodes[v].label} by 1 because we processed its dependency ${nodes[u].label}. It still has ${inDegree[v]} dependencies left.`, 
          "Decrement in-degrees",
          nodes[v].label,
          u,
          { activeNodes: [u, v], activeEdges: [edge] }
        );
      }
    }
  }

  const isCyclic = order.length !== V;
  if (isCyclic) {
    snap(14, "Topological Sort failed (Cycle detected!).", "The queue is empty but we haven't sorted all vertices. The remaining nodes form a cycle, making a valid topological sort impossible.", "Cycle detected", "None", null, { done: true });
  } else {
    snap(14, "Topological Sort complete.", "The queue is empty. We have successfully produced a valid topological ordering of the DAG.", "Ordering complete", "None", null, { done: true });
  }

  return frames;
}

// 9. UNION-FIND (DISJOINT SET UNION)
export function traceUnionFind(nodes: Node[], edges: Edge[]): BaseFrame[] {
  const frames: BaseFrame[] = [];
  const V = nodes.length;

  const parent = Array.from({ length: V }, (_, i) => i);
  const rank = Array(V).fill(0);
  let cellUpdates = 0;

  const snap = (line: number, note: string, explanation: string, currentGoal: string, currentFocus: string, activeNodes: number[], extras: Partial<BaseFrame> = {}) => {
    // Generate parent edges for rendering
    const parentEdges: string[] = [];
    parent.forEach((p, u) => {
      if (p !== u) {
        parentEdges.push(edgeKey(u, p)); // Draw parent links as highlight tree edges
      }
    });

    frames.push({
      kind: "union-find",
      line,
      note,
      explanation,
      currentGoal,
      currentFocus,
      current: null,
      activeNodes,
      activeEdges: [],
      treeEdges: parentEdges,
      visited: [],
      stats: {
        "Unions Done": cellUpdates,
        "Total Nodes": V,
        "Complexity": "O(log V) amortised",
      },
      parent: [...parent],
      rank: [...rank],
      ...extras,
    });
  };

  // Initial step
  snap(3, "Initialize DSU sets.", "Every element starts in its own singleton subset with parent[i] = i and rank = 0.", "Initialize Sets", "All elements", []);

  // Run a series of predefined union/find operations
  // We union adjacent nodes or run custom steps.
  // Let's perform Union(0, 1), Union(2, 3), Union(4, 5), Union(1, 3), Find(0), Union(3, 5)
  // Let's adapt this based on actual node count V.
  const ops: { type: "union" | "find"; u: number; v?: number }[] = [];
  if (edges.length > 0) {
    edges.forEach(e => {
      ops.push({ type: "union", u: e.u, v: e.v });
    });
    // Add some random finds at the end
    if (V > 0) ops.push({ type: "find", u: 0 });
    if (V > 1) ops.push({ type: "find", u: V - 1 });
  } else {
    // Default demo operations
    if (V >= 2) ops.push({ type: "union", u: 0, v: 1 });
    if (V >= 4) ops.push({ type: "union", u: 2, v: 3 });
    if (V >= 6) ops.push({ type: "union", u: 4, v: 5 });
    if (V >= 4) ops.push({ type: "union", u: 1, v: 3 });
    if (V >= 1) ops.push({ type: "find", u: 0 });
    if (V >= 6) ops.push({ type: "union", u: 3, v: 5 });
  }

  const findTraced = (i: number, lineFind: number): number => {
    let curr = i;
    const path: number[] = [curr];
    snap(lineFind, `Find root of ${nodes[i].label}.`, `We crawl parents starting at ${nodes[i].label} to find the root of its set.`, "Find Operation", nodes[i].label, [i]);
    
    while (parent[curr] !== curr) {
      curr = parent[curr];
      path.push(curr);
      snap(lineFind, `Crawl parent chain: node ${nodes[path[path.length - 2]].label} -> parent ${nodes[curr].label}.`, `Traversing up the tree parent pointer.`, "Find Operation", nodes[curr].label, [i, curr]);
    }

    // Path compression
    for (const node of path) {
      if (node !== curr && parent[node] !== curr) {
        parent[node] = curr;
        snap(11, `Path compression: set parent[${nodes[node].label}] = ${nodes[curr].label}.`, `Flatting the DSU tree: pointing ${nodes[node].label} directly to root ${nodes[curr].label} to speed up future queries.`, "Path Compression", nodes[node].label, [node, curr]);
      }
    }

    return curr;
  };

  ops.forEach((op) => {
    if (op.type === "union" && op.v !== undefined) {
      const u = op.u;
      const v = op.v;
      snap(13, `Trigger Union(${nodes[u].label}, ${nodes[v].label}).`, `We want to merge the sets containing ${nodes[u].label} and ${nodes[v].label}.`, "Union sets", `${nodes[u].label} & ${nodes[v].label}`, [u, v]);

      const rootU = findTraced(u, 9);
      const rootV = findTraced(v, 9);

      if (rootU !== rootV) {
        if (rank[rootU] < rank[rootV]) {
          parent[rootU] = rootV;
          snap(17, `Set parent[${nodes[rootU].label}] = ${nodes[rootV].label} (Rank optimization).`, `Since set ${nodes[rootV].label} has higher rank, we attach set ${nodes[rootU].label} as its child.`, "Link Roots", nodes[rootV].label, [rootU, rootV]);
        } else if (rank[rootU] > rank[rootV]) {
          parent[rootV] = rootU;
          snap(17, `Set parent[${nodes[rootV].label}] = ${nodes[rootU].label} (Rank optimization).`, `Since set ${nodes[rootU].label} has higher rank, we attach set ${nodes[rootV].label} as its child.`, "Link Roots", nodes[rootU].label, [rootU, rootV]);
        } else {
          parent[rootV] = rootU;
          rank[rootU]++;
          snap(20, `Link root ${nodes[rootV].label} to ${nodes[rootU].label} and increment rank[${nodes[rootU].label}].`, `Ranks are equal. We make ${nodes[rootU].label} the parent of ${nodes[rootV].label} and increment rank[${nodes[rootU].label}] to ${rank[rootU]}.`, "Link equal ranks", nodes[rootU].label, [rootU, rootV]);
        }
        cellUpdates++;
      } else {
        snap(13, `Nodes ${nodes[u].label} and ${nodes[v].label} already in the same component.`, `Both roots are ${nodes[rootU].label}. No action required.`, "Link elements", "No change", [u, v]);
      }
    } else if (op.type === "find") {
      findTraced(op.u, 9);
    }
  });

  // Complete
  frames.push({
    kind: "union-find",
    line: 20,
    note: "DSU operations completed.",
    explanation: "Disjoint Set Union operations are complete. Look at the parent references to see the final set components.",
    currentGoal: "DSU sequence finished",
    currentFocus: "None",
    current: null,
    activeNodes: [],
    activeEdges: [],
    treeEdges: parent.map((p, u) => p !== u ? edgeKey(u, p) : "").filter(Boolean),
    visited: [],
    stats: {
      "Unions Done": cellUpdates,
      "Total Nodes": V,
      "Complexity": "O(log V) amortised",
    },
    parent: [...parent],
    rank: [...rank],
    done: true,
  });

  return frames;
}

// 10. KOSARAJU SCC ALGORITHM
export function traceSCC(nodes: Node[], edges: Edge[]): BaseFrame[] {
  const V = nodes.length;
  const adj = buildAdjacency(nodes, edges, true); // SCC runs on directed graphs!
  
  // Transpose graph adjacency
  const radj: number[][] = nodes.map(() => []);
  edges.forEach(({ u, v }) => {
    if (u < V && v < V) {
      radj[v].push(u);
    }
  });

  const frames: BaseFrame[] = [];
  const visited = new Set<number>();
  const stack: number[] = [];
  const sccs: number[][] = [];
  const activeTree: string[] = [];

  const snap = (line: number, phase: "dfs1" | "transpose" | "dfs2", note: string, explanation: string, currentGoal: string, currentFocus: string, current: number | null, activeNodes: number[], extras: Partial<BaseFrame> = {}) => {
    frames.push({
      kind: "scc",
      line,
      note,
      explanation,
      currentGoal,
      currentFocus,
      current,
      activeNodes,
      activeEdges: [],
      treeEdges: [...activeTree],
      visited: Array.from(visited),
      stats: {
        "Phase": phase === "dfs1" ? "Phase 1: Finishing stack" : phase === "transpose" ? "Phase 2: Graph Transpose" : "Phase 3: Extract SCCs",
        "Stack Size": stack.length,
        "Components": sccs.length,
        "Complexity": "O(V + E)",
      },
      stack: [...stack],
      sccs: sccs.map(comp => [...comp]),
      phase,
      transposed: phase !== "dfs1",
      ...extras,
    });
  };

  // Phase 1: DFS to get finishing stack
  const dfs1 = (u: number, p: number | null) => {
    visited.add(u);
    if (p !== null) activeTree.push(edgeKey(p, u));
    snap(8, "dfs1", `DFS1: Enter vertex ${nodes[u].label}.`, `We recursively visit vertex ${nodes[u].label} and push it onto the finishing stack only after fully exploring all its reachable paths.`, "Fill stack finishing times", nodes[u].label, u, [u]);

    for (const { v } of adj[u]) {
      if (!visited.has(v)) {
        dfs1(v, u);
      }
    }

    stack.push(u);
    snap(10, "dfs1", `DFS1: Finished ${nodes[u].label}; push to stack.`, `All reachable paths from ${nodes[u].label} are visited. We push ${nodes[u].label} onto the stack. Top elements finished last.`, "Fill stack finishing times", nodes[u].label, u, [u]);
  };

  snap(5, "dfs1", "Begin Phase 1 DFS.", "We run DFS to fill the stack. The node that finishes last will be at the top of the stack.", "DFS 1 traversal", "None", null, []);

  for (let i = 0; i < V; i++) {
    if (!visited.has(i)) {
      dfs1(i, null);
    }
  }

  // Phase 2: Transposition
  activeTree.length = 0; // Clear highlights
  snap(13, "transpose", "Begin Phase 2: Transpose graph.", "We reverse the direction of every edge in the graph. This keeps strongly connected components together but prevents path propagation between separate components.", "Transpose Graph", "All Edges", null, []);

  // Phase 3: DFS on transposed graph in stack order
  visited.clear();
  snap(22, "dfs2", "Begin Phase 3: Process stack.", "We pop nodes from the stack one by one. If unvisited, we start a new DFS on the transposed graph to extract its component.", "DFS 2 on Transpose", "Stack top", null, []);

  const dfs2 = (u: number, comp: number[], p: number | null) => {
    visited.add(u);
    comp.push(u);
    if (p !== null) activeTree.push(edgeKey(u, p)); // directed reversed link highlights
    snap(24, "dfs2", `DFS2: Extract ${nodes[u].label} in current component.`, `DFS on transposed graph reaches ${nodes[u].label}. It is added to the active SCC.`, "SCC extraction DFS", nodes[u].label, u, [u]);

    for (const v of radj[u]) {
      if (!visited.has(v)) {
        dfs2(v, comp, u);
      }
    }
  };

  while (stack.length) {
    const u = stack.pop()!;
    if (!visited.has(u)) {
      const comp: number[] = [];
      snap(23, "dfs2", `Pop ${nodes[u].label} from stack and start new component DFS.`, `Node ${nodes[u].label} is unvisited. It is the root of a new Strongly Connected Component.`, "SCC DFS Root", nodes[u].label, u, [u]);
      dfs2(u, comp, null);
      sccs.push(comp);
      snap(25, "dfs2", `SCC Component extracted: [${comp.map(x => nodes[x].label).join(", ")}].`, `Finished DFS from ${nodes[u].label}. Component is fully identified and isolated.`, "SCC Identified", nodes[u].label, u, [u]);
    } else {
      snap(22, "dfs2", `Pop ${nodes[u].label} (already grouped in SCC).`, `Node ${nodes[u].label} is already assigned to a strongly connected component. Skipping.`, "Process stack", nodes[u].label, u, [u]);
    }
  }

  // Final Complete
  frames.push({
    kind: "scc",
    line: 25,
    note: "Kosaraju complete.",
    explanation: `Kosaraju's algorithm successfully extracted all Strongly Connected Components. Total Components found: ${sccs.length}.`,
    currentGoal: "SCC identification complete",
    currentFocus: "None",
    current: null,
    activeNodes: [],
    activeEdges: [],
    treeEdges: [],
    visited: Array.from(visited),
    stats: {
      "Phase": "Finished",
      "Components": sccs.length,
      "Complexity": "O(V + E)",
    },
    stack: [],
    sccs: sccs.map(comp => [...comp]),
    phase: "dfs2",
    done: true,
  });

  return frames;
}

export type AlgoKey = 
  | "bfs" 
  | "dfs" 
  | "dijkstra" 
  | "bellman-ford" 
  | "floyd-warshall" 
  | "prim" 
  | "kruskal" 
  | "topo-sort" 
  | "union-find" 
  | "scc";

export interface AlgoDef {
  id: AlgoKey;
  name: string;
  description: string;
  code: string;
  fileName: string;
}

export const ALGOS: AlgoDef[] = [
  {
    id: "bfs",
    name: "Breadth-First Search",
    description: "Layer-by-layer traversal using a FIFO queue. Yields the shortest path in edges from the source in an unweighted graph. O(V + E).",
    code: BFS_CODE,
    fileName: "bfs.py",
  },
  {
    id: "dfs",
    name: "Depth-First Search",
    description: "Dive as deep as possible before backtracking, using an explicit stack. Backbone of topo sort, cycle detection, and SCC. O(V + E).",
    code: DFS_CODE,
    fileName: "dfs.py",
  },
  {
    id: "dijkstra",
    name: "Dijkstra's Algorithm",
    description: "Shortest paths from a single source in a weighted graph with non-negative edges. Uses a min-heap. O((V + E) log V).",
    code: DIJK_CODE,
    fileName: "dijkstra.py",
  },
  {
    id: "bellman-ford",
    name: "Bellman-Ford Algorithm",
    description: "Single-source shortest path that permits negative edge weights and identifies negative weight cycles. O(V * E).",
    code: BELLMAN_FORD_CODE,
    fileName: "bellman_ford.py",
  },
  {
    id: "floyd-warshall",
    name: "Floyd-Warshall",
    description: "Dynamic programming approach for computing shortest paths between all pairs of vertices. O(V^3).",
    code: FLOYD_WARSHALL_CODE,
    fileName: "floyd_warshall.py",
  },
  {
    id: "prim",
    name: "Prim's Algorithm",
    description: "Greedy MST algorithm that builds the spanning tree from a single starting vertex, adding the cheapest outer edge. O(E log V).",
    code: PRIM_CODE,
    fileName: "prim.py",
  },
  {
    id: "kruskal",
    name: "Kruskal's Algorithm",
    description: "Greedy MST algorithm that sorts all edges and merges vertex sets using Union-Find, discarding cycle-inducing edges. O(E log E).",
    code: KRUSKAL_CODE,
    fileName: "kruskal.py",
  },
  {
    id: "topo-sort",
    name: "Topological Sort",
    description: "Linear ordering of vertices in a Directed Acyclic Graph (DAG) such that for every directed edge u -> v, u comes before v. O(V + E).",
    code: TOPO_CODE,
    fileName: "topological_sort.py",
  },
  {
    id: "union-find",
    name: "Union-Find (DSU)",
    description: "Data structure storing non-overlapping subsets. Supports union and compressed find queries efficiently. Amortised O(alpha(V)).",
    code: UF_CODE,
    fileName: "union_find.py",
  },
  {
    id: "scc",
    name: "Strongly Connected Components",
    description: "Kosaraju's two-pass DFS algorithm that groups vertices of a directed graph into subsets that are mutually reachable. O(V + E).",
    code: SCC_CODE,
    fileName: "kosaraju_scc.py",
  },
];
