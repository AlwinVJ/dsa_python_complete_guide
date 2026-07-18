export interface Node {
  id: number;
  label: string;
  x?: number;
  y?: number;
}

export interface Edge {
  u: number; // Source node ID (index)
  v: number; // Target node ID (index)
  w: number; // Edge weight
}

export interface BaseFrame {
  line: number;           // Active line in code viewer
  note: string;           // Step brief summary
  explanation: string;    // Rich detailed educational explanation of why this step is taken
  currentGoal: string;    // Active high-level objective
  currentFocus: string;   // Active node/edge under focus
  done?: boolean;         // Execution complete
  kind: string;           // Algo identifier
  current: number | null; // Primary active node ID
  activeNodes: number[];  // Highlighted secondary nodes
  activeEdges: string[];  // Highlighted edges (edgeKey: "u-v")
  treeEdges: string[];    // Traversal tree/MST/Shortest Path edges
  visited: number[];      // Visited node IDs
  stats: Record<string, string | number>; // Metric key-value pairs

  // Optional algorithm-specific state payloads
  dist?: number[];
  distMatrix?: number[][];
  pq?: { d: number; v: number; p?: number }[]; // Priority queue items (dist, node, parent)
  queue?: number[];
  stack?: number[];
  parent?: number[];
  rank?: number[];
  inDegree?: Record<number, number>;
  order?: number[];
  sccs?: number[][];
  phase?: string;
  transposed?: boolean;
}

export interface GraphPreset {
  id: string;
  name: string;
  description: string;
  nodes: Node[];
  edges: Edge[];
  directed: boolean;
  weighted: boolean;
  compatibleAlgos: string[]; // e.g. ["bfs", "dfs", "dijkstra"]
}
