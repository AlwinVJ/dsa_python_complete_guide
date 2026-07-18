import { Node, Edge } from "./types";

interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  parsed?: { nodes: Node[]; edges: Edge[] };
}

export function validateAndParseGraph(
  input: string,
  directed: boolean,
  weighted: boolean,
  algoKey: string
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!input.trim()) {
    return { valid: false, errors: ["Input is empty. Provide edges in format 'A-B:4' or 'A B 4'."], warnings };
  }

  const edgeTokens = input
    .split(/[\n,]+/)
    .map((t) => t.trim())
    .filter(Boolean);

  const parsedEdges: { uLabel: string; vLabel: string; weight: number }[] = [];
  const nodeLabels = new Set<string>();

  for (const token of edgeTokens) {
    let uLabel = "";
    let vLabel = "";
    let weight = 1;

    if (token.includes("-")) {
      const parts = token.split(":");
      const edgePart = parts[0].trim();
      const weightPart = parts[1]?.trim();

      const endpoints = edgePart.split("-");
      if (endpoints.length !== 2) {
        errors.push(`Invalid edge format: "${token}". Use "A-B" or "A-B:5".`);
        continue;
      }
      uLabel = endpoints[0].trim();
      vLabel = endpoints[1].trim();

      if (weightPart !== undefined) {
        weight = Number(weightPart);
        if (isNaN(weight)) {
          errors.push(`Invalid weight in "${token}". Weight must be numeric.`);
          continue;
        }
      } else if (weighted) {
        warnings.push(`Edge "${edgePart}" has no weight. Defaulting to 1.`);
      }
    } else {
      const parts = token.split(/\s+/);
      if (parts.length < 2 || parts.length > 3) {
        errors.push(`Invalid token: "${token}". Use dashes (e.g. A-B:4) or spaces (e.g. A B 4).`);
        continue;
      }
      uLabel = parts[0].trim();
      vLabel = parts[1].trim();
      if (parts.length === 3) {
        weight = Number(parts[2]);
        if (isNaN(weight)) {
          errors.push(`Invalid weight in "${token}". Weight must be numeric.`);
          continue;
        }
      } else if (weighted) {
        warnings.push(`Edge "${uLabel}–${vLabel}" has no weight. Defaulting to 1.`);
      }
    }

    if (!uLabel || !vLabel) {
      errors.push(`Edge endpoints cannot be empty in "${token}".`);
      continue;
    }

    if (uLabel === vLabel) {
      errors.push(`Self-loops are not allowed: "${uLabel}–${vLabel}".`);
      continue;
    }

    parsedEdges.push({ uLabel, vLabel, weight });
    nodeLabels.add(uLabel);
    nodeLabels.add(vLabel);
  }

  if (errors.length > 0) {
    return { valid: false, errors, warnings };
  }

  // Alphabetically sort unique nodes and map to numeric IDs
  const sortedLabels = Array.from(nodeLabels).sort();
  if (sortedLabels.length > 10) {
    errors.push("Graph exceeds maximum limit of 10 vertices for readability.");
    return { valid: false, errors, warnings };
  }

  const labelToId = new Map<string, number>();
  const nodes: Node[] = sortedLabels.map((lbl, idx) => {
    labelToId.set(lbl, idx);
    return { id: idx, label: lbl };
  });

  const edges: Edge[] = [];
  const edgeKeysSeen = new Set<string>();

  for (const { uLabel, vLabel, weight } of parsedEdges) {
    const u = labelToId.get(uLabel)!;
    const v = labelToId.get(vLabel)!;

    const keyUndirected = u < v ? `${u}-${v}` : `${v}-${u}`;
    const keyDirected = `${u}->${v}`;
    const checkKey = directed ? keyDirected : keyUndirected;

    if (edgeKeysSeen.has(checkKey)) {
      errors.push(`Duplicate edge detected: "${uLabel}–${vLabel}".`);
      continue;
    }
    edgeKeysSeen.add(checkKey);

    // Negative weights check (only Bellman-Ford and Floyd-Warshall allow negative edges)
    if (weight < 0 && algoKey !== "bellman-ford" && algoKey !== "floyd-warshall") {
      errors.push(`Negative edge weight (${weight}) is only supported in Bellman-Ford and Floyd-Warshall.`);
      continue;
    }

    edges.push({ u, v, w: weight });
  }

  if (errors.length > 0) {
    return { valid: false, errors, warnings };
  }

  // Connectivity warnings for undirected graphs
  if (!directed && nodes.length > 0) {
    const adj: Record<number, number[]> = {};
    nodes.forEach((n) => (adj[n.id] = []));
    edges.forEach((e) => {
      adj[e.u]?.push(e.v);
      adj[e.v]?.push(e.u);
    });

    const visitedNodes = new Set<number>();
    const q = [nodes[0].id];
    visitedNodes.add(nodes[0].id);

    while (q.length > 0) {
      const curr = q.shift()!;
      for (const neighbor of adj[curr] || []) {
        if (!visitedNodes.has(neighbor)) {
          visitedNodes.add(neighbor);
          q.push(neighbor);
        }
      }
    }

    if (visitedNodes.size !== nodes.length) {
      warnings.push("The graph is disconnected (contains unreachable vertices).");
    }
  }

  // Cycle check for Topological Sort
  if (algoKey === "topo-sort") {
    const inDegree: Record<number, number> = {};
    nodes.forEach((n) => (inDegree[n.id] = 0));
    edges.forEach((e) => {
      inDegree[e.v] = (inDegree[e.v] || 0) + 1;
    });

    const queue = nodes.map((n) => n.id).filter((id) => inDegree[id] === 0);
    let count = 0;

    while (queue.length > 0) {
      const u = queue.shift()!;
      count++;
      edges
        .filter((e) => e.u === u)
        .forEach((e) => {
          inDegree[e.v]--;
          if (inDegree[e.v] === 0) {
            queue.push(e.v);
          }
        });
    }

    if (count !== nodes.length) {
      errors.push("Topological Sort requires a Directed Acyclic Graph (DAG). Cycle detected!");
    }
  }

  return {
    valid: true,
    errors,
    warnings,
    parsed: { nodes, edges },
  };
}

interface GraphValidatorProps {
  errors: string[];
  warnings: string[];
}

export function GraphValidator({ errors, warnings }: GraphValidatorProps) {
  if (errors.length === 0 && warnings.length === 0) return null;

  return (
    <div className="flex flex-col gap-2 rounded-md border p-3 text-xs">
      {errors.length > 0 && (
        <div className="flex flex-col gap-1 text-red-500">
          <div className="font-bold">Errors:</div>
          <ul className="list-disc pl-4 space-y-0.5">
            {errors.map((err, i) => (
              <li key={`err-${i}`}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {warnings.length > 0 && (
        <div className="flex flex-col gap-1 text-amber-500">
          <div className="font-bold">Warnings:</div>
          <ul className="list-disc pl-4 space-y-0.5">
            {warnings.map((warn, i) => (
              <li key={`warn-${i}`}>{warn}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
