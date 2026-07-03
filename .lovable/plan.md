# Graphs → Flagship Interactive Course

Rebuild the Graphs module to match Trees (architecture) and Arrays (educational depth). The existing `src/lib/courses/graph-algorithms.ts` mini-course is superseded by this new module.

## Architecture (mirrors Trees)

```text
Graphs
├─ Overview            (single intro page — no duplicated lessons)
├─ Foundations         (expanded by default)
├─ Graph Types         (15 mini-courses)
├─ Representations     (5 mini-courses)
├─ Traversals          (BFS, DFS variants, components)
├─ Algorithms          (shortest path, MST, SCC, flow, coloring, tours…)
└─ Review & Practice   (expanded by default — cheatsheet, FAQ, interview, LC roadmap, quiz)
```

Every section collapsible in the sidebar. Foundations + Review expanded on load. Prev/Next chain across the whole course, no progress bar (matches Arrays).

## Content model

Reuse the Trees `TSection` schema — add graph-specific section variants in a new `src/lib/graphs/types.ts` so nothing bleeds into Trees:

- `graphViz` — static graph illustration (SVG, directed/undirected/weighted).
- `graphPlayground` — full editor: add/remove vertex + edge, drag, weights, directions, live stats (V, E, components, density, type).
- `bfsPlayer`, `dfsPlayer` — step players with queue/stack visualization.
- `dijkstraPlayer`, `bellmanFordPlayer`, `primPlayer`, `kruskalPlayer`, `topoSortPlayer`, `unionFindPlayground`.
- `adjMatrixViz`, `adjListViz`, `edgeListViz`, `incidenceMatrixViz`, `csrViz`.
- Reused primitives: `theory`, `code`, `dryRun`, `complexity`, `mistakes`, `callout`, `memoryDiagram`, `quiz`, `practice`, `references`, `interview`, `heading`, `table`.

Every lesson: intro → interactive viz → Python (fully commented) → memory diagram → dry run → complexity → mistakes → interview insight → references. No stubs.

## Files

- `src/lib/graphs/types.ts` — schema.
- `src/lib/graphs/foundations.ts` — 22 lessons (terminology, properties, density, memory, apps, complexity, summary).
- `src/lib/graphs/types-catalog.ts` — 15 type mini-courses (undirected, directed, weighted, unweighted, cyclic, acyclic, DAG, complete, sparse, dense, bipartite, complete bipartite, multigraph, pseudograph, tree-as-graph).
- `src/lib/graphs/representations.ts` — 5 mini-courses (matrix, list, edge list, incidence, CSR).
- `src/lib/graphs/traversals.ts` — BFS, DFS (recursive + iterative), BFS vs DFS, traversal order, connected components, complexity.
- `src/lib/graphs/algorithms.ts` — 22 algorithms grouped: shortest path (Dijkstra, Bellman-Ford, Floyd-Warshall, A*), MST (Prim, Kruskal, Union-Find), cycle detection, topo sort, SCC (Kosaraju, Tarjan), articulation/bridges, coloring, flow (Ford-Fulkerson, Edmonds-Karp), Hamiltonian, Euler path/circuit, TSP.
- `src/lib/graphs/revision.ts` — cheatsheet, FAQ, interview bank, LC roadmap, final quiz.
- `src/lib/graphs/index.ts` + section catalog wiring.
- `src/lib/courses/graphs.ts` — rewrite to register the new grouped structure (replaces the tiny stub currently in `src/lib/courses/graphs.ts`; `graph-algorithms.ts` course is deprecated and removed from nav).
- `src/lib/nav.ts` — group Graphs children under the six tiers.
- `src/components/graphs/Visualizers.tsx` — all visualizers listed above (SVG + framer-motion, responsive, no horizontal scroll).
- `src/components/graphs/GraphPlayground.tsx` — full-editor playground (also embeddable in `/playgrounds/graph`).
- `src/routes/graphs.$.tsx` — splat route rendering `<tier>/<slug>` (mirrors `trees.$.tsx`), with `CoursePrevNext`.
- `src/routes/graphs.index.tsx` — Overview page (objectives, roadmap, ETA, quick nav).
- `src/routes/graphs.faq.tsx` + `src/routes/graphs.interview.tsx` — data-driven Q&A pages (`src/lib/qa/graphs.ts`).
- `src/lib/question-bank/modules/graphs.ts` — expand existing bank with beginner / intermediate / advanced tiers per topic.
- `src/routes/playgrounds.graph.tsx` + `src/routes/playgrounds.union-find.tsx` — standalone playground routes; add to `playgrounds.index.tsx`.

## Delivery cadence (4 turns)

Each turn ends with `bunx tsgo --noEmit` + curl smoke tests on new lesson URLs. No stubs shipped mid-turn.

- **Turn 1 — Skeleton + Foundations + Overview + Playground.** New schema, `graphs.$.tsx` splat, section renderer, `GraphPlayground`, `graphViz`, `bfsPlayer`, `dfsPlayer` visualizers. Foundations (22 lessons) and Overview populated end-to-end. Course + nav wired.
- **Turn 2 — Graph Types + Representations.** 15 type mini-courses + 5 representation mini-courses. Ships `adjMatrixViz`, `adjListViz`, `edgeListViz`, `incidenceMatrixViz`, `csrViz`.
- **Turn 3 — Traversals + first half of Algorithms.** BFS/DFS players wired into traversal lessons. Shortest path (Dijkstra, Bellman-Ford, Floyd-Warshall, A*) + MST (Prim, Kruskal, Union-Find) + cycle detection + topo sort with dedicated visualizers.
- **Turn 4 — Remaining Algorithms + Review & Practice + polish.** SCC, articulation/bridges, coloring, flow, Hamiltonian/Euler/TSP. Cheatsheet, FAQ, interview bank, LC roadmap, final quiz. Retire `/algorithms/graph-algorithms` link, add cross-links from Trees revision. Final typecheck + smoke tests.

Approve and I'll ship Turn 1.
