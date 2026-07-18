import { useMemo, useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Node, Edge, BaseFrame } from "./types";
import { computeNodePositions, LayoutType } from "./layouts";
import { edgeKey } from "./algorithms";
import { ZoomIn, ZoomOut, Maximize, RotateCcw } from "lucide-react";

interface GraphRendererProps {
  nodes: Node[];
  edges: Edge[];
  directed: boolean;
  weighted: boolean;
  layoutType: LayoutType;
  frame: BaseFrame | undefined;
}

const NODE_R = 22; // Slightly larger nodes for improved readability

const COMPONENT_COLORS = [
  "rgb(59 130 246)",   // blue
  "rgb(16 185 129)",   // emerald
  "rgb(245 158 11)",   // amber
  "rgb(139 92 246)",   // violet
  "rgb(236 72 153)",   // pink
  "rgb(20 184 166)",   // teal
  "rgb(239 68 68)",    // red
  "rgb(100 116 139)",  // slate
];

export function GraphRenderer({
  nodes,
  edges,
  directed,
  weighted,
  layoutType,
  frame,
}: GraphRendererProps) {
  const width = 520;
  const height = 360;

  // Base positions computed from layout strategy
  const defaultPositions = useMemo(() => {
    return computeNodePositions(nodes, edges, layoutType, width, height);
  }, [nodes, edges, layoutType]);

  // Interactive node positions, pan, and zoom states
  const [nodePositions, setNodePositions] = useState<Record<number, { x: number; y: number }>>({});
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  // Drag and pan tracking state refs/variables
  const [draggingNodeId, setDraggingNodeId] = useState<number | null>(null);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const nodeDragBaseRef = useRef({ x: 0, y: 0 });

  const [isPanning, setIsPanning] = useState(false);
  const panStartRef = useRef({ x: 0, y: 0 });
  const mouseStartRef = useRef({ x: 0, y: 0 });

  // Update/reset custom positions only when layout properties or nodes actually change
  const layoutStateKey = `${layoutType}-${nodes.map((n) => n.id).join(",")}`;
  useEffect(() => {
    setNodePositions(defaultPositions);
    setPan({ x: 0, y: 0 });
    setZoom(1);
  }, [layoutStateKey, defaultPositions]);

  const treeEdges = useMemo(() => new Set(frame?.treeEdges ?? []), [frame]);
  const activeEdges = useMemo(() => new Set(frame?.activeEdges ?? []), [frame]);
  const visited = useMemo(() => new Set(frame?.visited ?? []), [frame]);
  const activeNodes = useMemo(() => new Set(frame?.activeNodes ?? []), [frame]);
  const current = frame?.current ?? null;

  // SCC coloring
  const nodeSccMap = useMemo(() => {
    const map = new Map<number, number>();
    if (frame?.sccs) {
      frame.sccs.forEach((comp, idx) => {
        comp.forEach((nodeId) => {
          map.set(nodeId, idx);
        });
      });
    }
    return map;
  }, [frame?.sccs]);

  // DSU coloring
  const nodeDsuRootMap = useMemo(() => {
    const map = new Map<number, number>();
    if (frame?.parent) {
      const getRoot = (x: number): number => {
        let curr = x;
        while (frame.parent![curr] !== curr) {
          curr = frame.parent![curr];
        }
        return curr;
      };

      const roots = new Set<number>();
      nodes.forEach((n) => {
        roots.add(getRoot(n.id));
      });
      const rootsArray = Array.from(roots);

      nodes.forEach((n) => {
        const root = getRoot(n.id);
        map.set(n.id, rootsArray.indexOf(root));
      });
    }
    return map;
  }, [frame?.parent, nodes]);

  // DSU arrows
  const dsuParentEdges = useMemo(() => {
    const list: { from: number; to: number }[] = [];
    if (frame?.kind === "union-find" && frame.parent) {
      frame.parent.forEach((p, u) => {
        if (p !== u && nodePositions[u] && nodePositions[p]) {
          list.push({ from: u, to: p });
        }
      });
    }
    return list;
  }, [frame?.kind, frame?.parent, nodePositions]);

  const isTransposed = !!frame?.transposed;

  // ---------- Mouse Interaction Handlers ----------

  const handleNodeMouseDown = (e: React.MouseEvent, nodeId: number) => {
    e.stopPropagation();
    e.preventDefault();
    const pos = nodePositions[nodeId];
    if (!pos) return;
    setDraggingNodeId(nodeId);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    nodeDragBaseRef.current = { x: pos.x, y: pos.y };
  };

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsPanning(true);
    panStartRef.current = { x: pan.x, y: pan.y };
    mouseStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggingNodeId !== null) {
      const dx = (e.clientX - dragStartRef.current.x) / zoom;
      const dy = (e.clientY - dragStartRef.current.y) / zoom;
      setNodePositions((prev) => ({
        ...prev,
        [draggingNodeId]: {
          x: nodeDragBaseRef.current.x + dx,
          y: nodeDragBaseRef.current.y + dy,
        },
      }));
    } else if (isPanning) {
      const dx = e.clientX - mouseStartRef.current.x;
      const dy = e.clientY - mouseStartRef.current.y;
      setPan({
        x: panStartRef.current.x + dx,
        y: panStartRef.current.y + dy,
      });
    }
  };

  const handleMouseUp = () => {
    setDraggingNodeId(null);
    setIsPanning(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = 1.08;
    if (e.deltaY < 0) {
      setZoom((z) => Math.min(3.0, z * zoomFactor));
    } else {
      setZoom((z) => Math.max(0.4, z / zoomFactor));
    }
  };

  const handleFitGraph = () => {
    setPan({ x: 0, y: 0 });
    setZoom(1);
  };

  const handleResetPositions = () => {
    setNodePositions(defaultPositions);
    setPan({ x: 0, y: 0 });
    setZoom(1);
  };

  return (
    <div className="relative overflow-hidden rounded-md border border-border bg-background touch-none">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-[360px] cursor-grab active:cursor-grabbing select-none"
        onMouseDown={handleCanvasMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        onDoubleClick={handleFitGraph}
      >
        <defs>
          {/* Shadow Filter */}
          <filter id="node-shadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.12" floodColor="#000" />
          </filter>

          {/* Edge Marker Definitions */}
          <marker
            id="arrow-default"
            viewBox="0 0 10 10"
            refX="17"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M0,0 L10,5 L0,10 z" fill="currentColor" className="text-muted-foreground/60" />
          </marker>
          <marker
            id="arrow-active"
            viewBox="0 0 10 10"
            refX="17"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M0,0 L10,5 L0,10 z" fill="rgb(245 158 11)" />
          </marker>
          <marker
            id="arrow-tree"
            viewBox="0 0 10 10"
            refX="17"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M0,0 L10,5 L0,10 z" fill="rgb(16 185 129)" />
          </marker>
        </defs>

        <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
          {/* 1. DSU Union Parent Links */}
          {frame?.kind === "union-find" &&
            dsuParentEdges.map(({ from, to }, idx) => {
              const a = nodePositions[from];
              const b = nodePositions[to];
              if (!a || !b) return null;
              const dx = b.x - a.x;
              const dy = b.y - a.y;
              const len = Math.hypot(dx, dy) || 1;
              const nx = dx / len;
              const ny = dy / len;
              const sx = a.x + nx * (NODE_R + 1);
              const sy = a.y + ny * (NODE_R + 1);
              const tx = b.x - nx * (NODE_R + 4);
              const ty = b.y - ny * (NODE_R + 4);

              return (
                <line
                  key={`dsu-${idx}`}
                  x1={sx}
                  y1={sy}
                  x2={tx}
                  y2={ty}
                  stroke="rgb(139 92 246)"
                  strokeWidth={2.5}
                  markerEnd="url(#arrow-active)"
                  className="opacity-80"
                />
              );
            })}

          {/* 2. Standard Graph Edges */}
          {frame?.kind !== "union-find" &&
            edges.map(({ u, v, w }, idx) => {
              const a = nodePositions[u];
              const b = nodePositions[v];
              if (!a || !b) return null;

              // Reverse display coordinates for transposed directed traversal
              const fromPos = isTransposed ? b : a;
              const toPos = isTransposed ? a : b;

              const key = edgeKey(u, v);
              const isTree = treeEdges.has(key);
              const isActive = activeEdges.has(key);

              let stroke = "currentColor";
              let strokeOpacity = 0.28;
              let strokeWidth = 2.0; // Thicker default edge
              let markerEnd = directed ? "url(#arrow-default)" : undefined;

              if (isTree) {
                stroke = "rgb(16 185 129)"; // Traversal tree / MST / Shortest path
                strokeOpacity = 1.0;
                strokeWidth = 3.5;
                markerEnd = directed ? "url(#arrow-tree)" : undefined;
              } else if (isActive) {
                stroke = "rgb(245 158 11)"; // Active inspection
                strokeOpacity = 1.0;
                strokeWidth = 3.5;
                markerEnd = directed ? "url(#arrow-active)" : undefined;
              }

              const dx = toPos.x - fromPos.x;
              const dy = toPos.y - fromPos.y;
              const len = Math.hypot(dx, dy) || 1;
              const nx = dx / len;
              const ny = dy / len;
              const sx = fromPos.x + nx * (NODE_R + 1);
              const sy = fromPos.y + ny * (NODE_R + 1);
              const tx = toPos.x - nx * (NODE_R + 4);
              const ty = toPos.y - ny * (NODE_R + 4);

              // Perpendicular offset for weighted labels to avoid line overlaps
              const perpX = -ny * 12;
              const perpY = nx * 12;
              const mx = (sx + tx) / 2 + (directed ? perpX : 0);
              const my = (sy + ty) / 2 + (directed ? perpY : 0);

              return (
                <g key={`edge-${idx}`} className="text-muted-foreground/40">
                  <line
                    x1={sx}
                    y1={sy}
                    x2={tx}
                    y2={ty}
                    stroke={stroke}
                    strokeOpacity={strokeOpacity}
                    strokeWidth={strokeWidth}
                    markerEnd={markerEnd}
                  />
                  {weighted && (
                    <g transform={`translate(${mx}, ${my})`}>
                      <rect
                        x={-11}
                        y={-8}
                        width={22}
                        height={15}
                        rx={3}
                        fill="var(--background)"
                        className="stroke-border/40"
                        strokeWidth={1}
                      />
                      <text
                        x={0}
                        y={3}
                        textAnchor="middle"
                        fontSize={9}
                        fontWeight={700}
                        className="fill-muted-foreground font-mono"
                      >
                        {w}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}

          {/* 3. Graph Vertices */}
          {nodes.map((n) => {
            const pos = nodePositions[n.id];
            if (!pos) return null;

            const isCurrent = current === n.id;
            const isVisited = visited.has(n.id);
            const isActiveNode = activeNodes.has(n.id);

            let fill = "hsl(var(--card))";
            let stroke = "hsl(var(--border))";
            let textColor = "hsl(var(--foreground))";
            let strokeWidth = 2;

            if (isCurrent) {
              fill = "var(--brand)";
              stroke = "var(--brand)";
              textColor = "white";
              strokeWidth = 3;
            } else if (frame?.parent && nodeDsuRootMap.has(n.id)) {
              const compIdx = nodeDsuRootMap.get(n.id) ?? 0;
              fill = COMPONENT_COLORS[compIdx % COMPONENT_COLORS.length];
              stroke = fill;
              textColor = "white";
            } else if (frame?.sccs && nodeSccMap.has(n.id)) {
              const compIdx = nodeSccMap.get(n.id) ?? 0;
              fill = COMPONENT_COLORS[compIdx % COMPONENT_COLORS.length];
              stroke = fill;
              textColor = "white";
            } else if (isVisited) {
              fill = "rgb(16 185 129)"; // Finalized green
              stroke = "rgb(16 185 129)";
              textColor = "white";
            } else if (isActiveNode) {
              fill = "color-mix(in oklab, rgb(245 158 11) 25%, var(--card))";
              stroke = "rgb(245 158 11)";
              textColor = "hsl(var(--foreground))";
              strokeWidth = 2.5;
            }

            const hasInDegree = frame?.inDegree !== undefined && frame.inDegree[n.id] !== undefined;

            return (
              <g
                key={`node-${n.id}`}
                onMouseDown={(e) => handleNodeMouseDown(e, n.id)}
                className="cursor-grab active:cursor-grabbing"
              >
                {/* Ping Halo pulse for current vertex */}
                {isCurrent && (
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={NODE_R + 5}
                    fill="none"
                    stroke="var(--brand)"
                    strokeWidth={2}
                    className="animate-ping opacity-35"
                    style={{ transformOrigin: `${pos.x}px ${pos.y}px` }}
                  />
                )}

                {/* Node Circle */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={NODE_R}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={strokeWidth}
                  filter="url(#node-shadow)"
                  className="transition-colors duration-200"
                />

                {/* Node Text label */}
                <text
                  x={pos.x}
                  y={pos.y + 4.5}
                  textAnchor="middle"
                  fontSize={13}
                  fontWeight={700}
                  fill={textColor}
                  className="pointer-events-none"
                >
                  {n.label}
                </text>

                {/* In-degree Badges */}
                {hasInDegree && (
                  <g transform={`translate(${pos.x + 13}, ${pos.y - 13})`} className="pointer-events-none">
                    <circle r={7.5} fill="rgb(239 68 68)" />
                    <text
                      textAnchor="middle"
                      y={3}
                      fontSize={8.5}
                      fontWeight={800}
                      fill="white"
                    >
                      {frame.inDegree![n.id]}
                    </text>
                  </g>
                )}

                {/* Distance values beneath the nodes */}
                {frame?.dist && frame.dist[n.id] !== undefined && (
                  <text
                    x={pos.x}
                    y={pos.y + 35}
                    textAnchor="middle"
                    fontSize={9.5}
                    fontWeight={700}
                    className="fill-muted-foreground font-mono pointer-events-none"
                  >
                    {frame.dist[n.id] === Infinity ? "∞" : frame.dist[n.id]}
                  </text>
                )}
              </g>
            );
          })}
        </g>
      </svg>

      {/* SVG Control Overlay Panel */}
      <div className="absolute bottom-3 right-3 flex flex-row items-center gap-1 z-10 bg-card/85 dark:bg-card/70 backdrop-blur-sm p-1 rounded-md border border-border shadow-sm">
        <button
          onClick={() => setZoom((z) => Math.min(3, z * 1.1))}
          className="p-1 rounded text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          title="Zoom In (+)"
        >
          <ZoomIn className="h-4 w-4" />
        </button>
        <button
          onClick={() => setZoom((z) => Math.max(0.4, z / 1.1))}
          className="p-1 rounded text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          title="Zoom Out (-)"
        >
          <ZoomOut className="h-4 w-4" />
        </button>
        <button
          onClick={handleFitGraph}
          className="p-1 rounded text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          title="Fit / Center Graph"
        >
          <Maximize className="h-4 w-4" />
        </button>
        <button
          onClick={handleResetPositions}
          className="p-1 rounded text-muted-foreground hover:bg-accent hover:text-foreground transition-colors border-l border-border/40 pl-1.5 ml-0.5"
          title="Reset Layout / Dragged Node Positions"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
