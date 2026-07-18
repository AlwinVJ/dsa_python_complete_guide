import { Node, BaseFrame } from "./types";

interface StatisticsPanelProps {
  frame: BaseFrame | undefined;
  nodes: Node[];
}

export function StatisticsPanel({ frame, nodes }: StatisticsPanelProps) {
  if (!frame) return null;

  const done = !!frame.done;

  // 1. Helper to render queue, stack or priority queue contents
  const renderFrontier = () => {
    let title = "";
    let items: string[] = [];

    if (frame.queue) {
      title = `Queue (FIFO) - Size: ${frame.queue.length}`;
      items = frame.queue.map((id) => nodes[id]?.label || String(id));
    } else if (frame.stack) {
      title = frame.kind === "scc" && frame.phase === "dfs1"
        ? `Finishing Stack (LIFO) - Size: ${frame.stack.length}`
        : `Stack (LIFO) - Size: ${frame.stack.length}`;
      // Display LIFO items with top first
      items = [...frame.stack].reverse().map((id) => nodes[id]?.label || String(id));
    } else if (frame.pq) {
      title = `Priority Queue (Min-Heap) - Size: ${frame.pq.length}`;
      items = frame.pq.map((e) => {
        const lbl = nodes[e.v]?.label || String(e.v);
        const pLbl = e.p !== undefined && e.p !== -1 ? ` via ${nodes[e.p]?.label}` : "";
        return `${lbl}:${e.d}${pLbl}`;
      });
    } else {
      return null;
    }

    return (
      <div className="flex flex-col gap-1">
        <div className="text-[11px] font-semibold text-muted-foreground uppercase">{title}</div>
        <div className="flex min-h-[36px] flex-wrap gap-1 rounded-md border border-border bg-background p-2 font-mono text-xs">
          {items.length === 0 ? (
            <span className="text-muted-foreground italic">empty</span>
          ) : (
            items.map((label, i) => (
              <span
                key={`${label}-${i}`}
                className="rounded border border-primary/20 bg-primary/5 px-2 py-0.5 text-primary text-[10px] font-bold"
              >
                {label}
              </span>
            ))
          )}
        </div>
      </div>
    );
  };

  // 2. Render Floyd-Warshall 2D Distance Matrix
  const render2DMatrix = () => {
    if (!frame.distMatrix) return null;
    const matrix = frame.distMatrix;
    return (
      <div className="flex flex-col gap-1">
        <div className="text-[11px] font-semibold text-muted-foreground uppercase">
          Distance Matrix (FW)
        </div>
        <div className="overflow-x-auto rounded-md border border-border bg-background p-2">
          <table className="min-w-full font-mono text-[10px] text-center border-collapse">
            <thead>
              <tr className="border-b border-border/40">
                <th className="px-1.5 py-1 text-muted-foreground">/</th>
                {nodes.map((n) => (
                  <th key={`h-${n.id}`} className="px-1.5 py-1 font-bold text-foreground">
                    {n.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {nodes.map((rowNode, rIdx) => (
                <tr key={`r-${rowNode.id}`} className="border-b border-border/20 last:border-0">
                  <td className="px-1.5 py-1 font-bold text-foreground border-r border-border/20">
                    {rowNode.label}
                  </td>
                  {nodes.map((colNode, cIdx) => {
                    const val = matrix[rIdx]?.[cIdx];
                    const isInfinity = val === Infinity || val === undefined;
                    const isActive =
                      (frame.activeNodes.includes(rIdx) && frame.current === cIdx) ||
                      (rIdx === frame.activeNodes[1] && cIdx === frame.activeNodes[2]); // detour path check highlight

                    return (
                      <td
                        key={`c-${colNode.id}`}
                        className={`px-1.5 py-1 transition ${
                          isActive
                            ? "bg-amber-500/20 font-bold text-amber-600 dark:text-amber-400"
                            : "text-muted-foreground"
                        }`}
                      >
                        {isInfinity ? "∞" : val}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // 3. Render 1D Distance Table
  const render1DDistTable = () => {
    if (!frame.dist || frame.distMatrix) return null;
    return (
      <div className="flex flex-col gap-1">
        <div className="text-[11px] font-semibold text-muted-foreground uppercase">Distance Table</div>
        <div className="grid grid-cols-4 gap-1 rounded-md border border-border bg-background p-2 font-mono text-[10px]">
          {nodes.map((n) => {
            const val = frame.dist![n.id];
            const isCurrentFocus = frame.current === n.id || frame.activeNodes.includes(n.id);
            return (
              <div
                key={`dist-${n.id}`}
                className={`flex items-center justify-between rounded px-1.5 py-0.5 border transition ${
                  isCurrentFocus
                    ? "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold"
                    : "border-transparent bg-muted/40 text-muted-foreground"
                }`}
              >
                <span>{n.label}</span>
                <span>{val === Infinity || val === undefined ? "∞" : val}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // 4. Render DSU Parent and Rank arrays
  const renderDSUDetails = () => {
    if (!frame.parent) return null;
    return (
      <div className="flex flex-col gap-2">
        {/* Parent table */}
        <div>
          <div className="text-[11px] font-semibold text-muted-foreground uppercase">DSU Parents</div>
          <div className="grid grid-cols-4 gap-1 rounded-md border border-border bg-background p-2 font-mono text-[10px]">
            {nodes.map((n) => {
              const pId = frame.parent![n.id];
              const pLabel = nodes[pId]?.label || String(pId);
              const isActive = frame.activeNodes.includes(n.id);
              return (
                <div
                  key={`parent-${n.id}`}
                  className={`flex items-center justify-between rounded px-1.5 py-0.5 border ${
                    isActive
                      ? "border-primary/40 bg-primary/10 text-primary font-bold"
                      : "border-transparent bg-muted/40 text-muted-foreground"
                  }`}
                >
                  <span>{n.label}</span>
                  <span>parent: {pLabel}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Rank table */}
        {frame.rank && (
          <div>
            <div className="text-[11px] font-semibold text-muted-foreground uppercase">DSU Ranks</div>
            <div className="grid grid-cols-4 gap-1 rounded-md border border-border bg-background p-2 font-mono text-[10px]">
              {nodes.map((n) => {
                const rVal = frame.rank![n.id] ?? 0;
                return (
                  <div
                    key={`rank-${n.id}`}
                    className="flex items-center justify-between rounded border border-transparent bg-muted/40 px-1.5 py-0.5 text-muted-foreground"
                  >
                    <span>{n.label}</span>
                    <span>rank: {rVal}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  // 5. Render SCC extracted lists
  const renderSCCList = () => {
    if (!frame.sccs) return null;
    return (
      <div className="flex flex-col gap-1">
        <div className="text-[11px] font-semibold text-muted-foreground uppercase">
          Extracted SCC Components ({frame.sccs.length})
        </div>
        <div className="flex flex-col gap-1.5 rounded-md border border-border bg-background p-2 font-mono text-[10px]">
          {frame.sccs.length === 0 ? (
            <span className="text-muted-foreground italic">none extracted yet</span>
          ) : (
            frame.sccs.map((comp, idx) => (
              <div key={`scc-${idx}`} className="flex items-center gap-1.5 border-b border-border/20 last:border-0 pb-1 last:pb-0">
                <span className="font-bold text-foreground">SCC #{idx + 1}:</span>
                <div className="flex gap-1 flex-wrap">
                  {comp.map((nodeId) => (
                    <span
                      key={nodeId}
                      className="rounded bg-muted px-1.5 py-0.5 font-bold text-muted-foreground"
                    >
                      {nodes[nodeId]?.label || nodeId}
                    </span>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  // 6. Render Topological Sort Order list
  const renderTopoOrder = () => {
    if (!frame.order) return null;
    return (
      <div className="flex flex-col gap-1">
        <div className="text-[11px] font-semibold text-muted-foreground uppercase">Topological Order</div>
        <div className="rounded-md border border-border bg-background p-2 font-mono text-xs text-foreground font-semibold">
          {frame.order.length === 0 ? (
            <span className="text-muted-foreground italic">empty output</span>
          ) : (
            frame.order.map((id) => nodes[id]?.label || String(id)).join(" → ")
          )}
        </div>
      </div>
    );
  };

  // 7. Live Statistics Key-Value display
  const renderLiveStats = () => {
    const rows = Object.entries(frame.stats || {});
    if (rows.length === 0) return null;

    return (
      <div className="flex flex-col gap-1 border-t border-border/40 pt-3">
        <div className="text-[11px] font-semibold text-muted-foreground uppercase">Live Metrics</div>
        <dl className="grid grid-cols-2 gap-y-1 text-xs">
          {rows.map(([label, val]) => (
            <div key={label} className="contents">
              <dt className="text-muted-foreground">{label}</dt>
              <dd className="text-right font-mono text-foreground font-bold">{val}</dd>
            </div>
          ))}
        </dl>
      </div>
    );
  };

  // 8. Final Execution Summary card
  const renderExecutionSummary = () => {
    if (!done) return null;

    // Determine final summary description and complexity depending on the algorithm
    let finalDesc = "Execution completed successfully.";
    let timeC = "O(V + E)";
    let spaceC = "O(V)";

    switch (frame.kind) {
      case "bfs":
        finalDesc = "BFS complete. Reached all connected nodes and found shortest path distances (in edge steps).";
        timeC = "O(V + E)";
        spaceC = "O(V)";
        break;
      case "dfs":
        finalDesc = "DFS complete. Traversed the graph completely by backtracking along branch limits.";
        timeC = "O(V + E)";
        spaceC = "O(V)";
        break;
      case "dijkstra":
        finalDesc = "Dijkstra's shortest paths computed from the source node to all reachable nodes.";
        timeC = "O((V + E) log V)";
        spaceC = "O(V)";
        break;
      case "bellman-ford":
        const hasCycle = frame.stats["Negative Cycle"] === "Yes" || frame.note.toLowerCase().includes("negative cycle");
        finalDesc = hasCycle
          ? "Execution failed: Reached a negative-weight cycle. Infinite path reductions occur, making standard shortest paths invalid."
          : "Bellman-Ford single-source shortest paths successfully computed. Correctly handled potential negative edge weights.";
        timeC = "O(V * E)";
        spaceC = "O(V)";
        break;
      case "floyd-warshall":
        finalDesc = "Floyd-Warshall all-pairs shortest paths computed successfully. Every pair distance is fully relaxation-evaluated.";
        timeC = "O(V^3)";
        spaceC = "O(V^2)";
        break;
      case "prim":
        finalDesc = `Prim's Minimum Spanning Tree successfully formed. Connected all reachable nodes in a single tree with minimal total edge cost. Final MST Weight: ${frame.stats["MST Weight"] || 0}.`;
        timeC = "O(E log V)";
        spaceC = "O(V)";
        break;
      case "kruskal":
        finalDesc = `Kruskal's Minimum Spanning Tree successfully formed. Sorted all edges and merged sets using DSU avoiding cycles. Final MST Weight: ${frame.stats["MST Weight"] || 0}.`;
        timeC = "O(E log E)";
        spaceC = "O(V)";
        break;
      case "topo-sort":
        const topoCycle = (frame.order?.length ?? 0) !== nodes.length;
        finalDesc = topoCycle
          ? "Topological sorting failed. Graph contains a cycle (directed cycle backreferences). A DAG is required."
          : "Topological ordering successfully generated. Ordered vertices linearly respecting dependency constraints.";
        timeC = "O(V + E)";
        spaceC = "O(V)";
        break;
      case "union-find":
        finalDesc = "Union-Find queries complete. Path compression flattened component trees to optimize future access times.";
        timeC = "O(alpha(V)) amortised";
        spaceC = "O(V)";
        break;
      case "scc":
        finalDesc = `Kosaraju's Strongly Connected Components successfully identified. Isolated ${frame.stats["Components"] || 0} mutually reachable vertex components.`;
        timeC = "O(V + E)";
        spaceC = "O(V)";
        break;
    }

    return (
      <div className="mt-2 rounded-lg border border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-500/10 p-3">
        <h5 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-1 flex items-center gap-1">
          ✓ Execution Complete
        </h5>
        <p className="text-[11px] text-muted-foreground leading-relaxed mb-2">
          {finalDesc}
        </p>
        <div className="flex gap-4 border-t border-emerald-500/15 pt-2 text-[10px] text-muted-foreground font-mono">
          <div>
            Time Complexity: <span className="font-bold text-foreground">{timeC}</span>
          </div>
          <div>
            Space Complexity: <span className="font-bold text-foreground">{spaceC}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-3.5">
      {/* Dynamic Queue/Stack/PQ visuals */}
      {renderFrontier()}

      {/* Dynamic Data Panel (1D distances, 2D Matrix, DSU arrays, SCC component lists, Topo order) */}
      {render2DMatrix()}
      {render1DDistTable()}
      {renderDSUDetails()}
      {renderSCCList()}
      {renderTopoOrder()}

      {/* Key-Value Live Stats */}
      {renderLiveStats()}

      {/* Finished Summary overlay */}
      {renderExecutionSummary()}
    </div>
  );
}
