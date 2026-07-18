import { Node, Edge } from "./types";

export type LayoutType = "preset" | "circular" | "grid" | "tree";

export function computeNodePositions(
  nodes: Node[],
  edges: Edge[],
  layoutType: LayoutType,
  width = 520,
  height = 360
): Record<number, { x: number; y: number }> {
  const cx = width / 2;
  const cy = height / 2;
  const positions: Record<number, { x: number; y: number }> = {};

  if (layoutType === "preset") {
    let hasAllCoords = true;
    nodes.forEach((n) => {
      if (typeof n.x !== "number" || typeof n.y !== "number") {
        hasAllCoords = false;
      }
    });

    if (hasAllCoords) {
      nodes.forEach((n) => {
        positions[n.id] = { x: n.x!, y: n.y! };
      });
      return positions;
    }
    // Otherwise fallback to circular
  }

  if (layoutType === "circular" || layoutType === "preset") {
    const rx = Math.min(width, height) / 2 - 40;
    const ry = rx;
    nodes.forEach((n, idx) => {
      const theta = (idx / nodes.length) * Math.PI * 2 - Math.PI / 2;
      positions[n.id] = {
        x: Math.round(cx + rx * Math.cos(theta)),
        y: Math.round(cy + ry * Math.sin(theta)),
      };
    });
    return positions;
  }

  if (layoutType === "grid") {
    const count = nodes.length;
    if (count === 0) return positions;
    const cols = Math.ceil(Math.sqrt(count));
    const rows = Math.ceil(count / cols);
    const cellW = (width - 100) / Math.max(1, cols - 1);
    const cellH = (height - 100) / Math.max(1, rows - 1);

    nodes.forEach((n, idx) => {
      const r = Math.floor(idx / cols);
      const c = idx % cols;
      positions[n.id] = {
        x: Math.round(50 + c * (cols === 1 ? 0 : cellW) + (cols === 1 ? cx - 50 : 0)),
        y: Math.round(50 + r * (rows === 1 ? 0 : cellH) + (rows === 1 ? cy - 50 : 0)),
      };
    });
    return positions;
  }

  if (layoutType === "tree") {
    // Determine tree levels using BFS starting from root (index 0)
    const adj: Record<number, number[]> = {};
    nodes.forEach((n) => {
      adj[n.id] = [];
    });
    edges.forEach((e) => {
      adj[e.u]?.push(e.v);
      adj[e.v]?.push(e.u);
    });

    const visited = new Set<number>();
    const levels: number[][] = [];
    const queue: { id: number; level: number }[] = [];

    if (nodes.length > 0) {
      const root = nodes[0].id;
      queue.push({ id: root, level: 0 });
      visited.add(root);
    }

    while (queue.length > 0) {
      const { id, level } = queue.shift()!;
      if (!levels[level]) {
        levels[level] = [];
      }
      levels[level].push(id);

      for (const neighbor of adj[id] || []) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push({ id: neighbor, level: level + 1 });
        }
      }
    }

    // Capture any disconnected components at the end
    nodes.forEach((n) => {
      if (!visited.has(n.id)) {
        let lastLevel = levels.length;
        if (lastLevel === 0) {
          levels.push([n.id]);
        } else {
          levels[lastLevel - 1].push(n.id);
        }
        visited.add(n.id);
      }
    });

    const totalLevels = levels.length;
    const levelH = (height - 100) / Math.max(1, totalLevels - 1);

    levels.forEach((levelNodes, lvlIdx) => {
      const count = levelNodes.length;
      // Space nodes by 70px, but scale down if they exceed the width
      const spacing = Math.min(80, (width - 80) / Math.max(1, count));
      const totalW = (count - 1) * spacing;
      const startX = cx - totalW / 2;

      levelNodes.forEach((nodeId, nodeIdx) => {
        positions[nodeId] = {
          x: Math.round(startX + nodeIdx * spacing),
          y: Math.round(50 + lvlIdx * (totalLevels === 1 ? 0 : levelH)),
        };
      });
    });
    return positions;
  }

  return positions;
}
