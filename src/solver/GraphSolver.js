/**
 * GraphSolver.js - Core IDA* Graph Search & Multi-Algorithm Solver Engine
 * Provides graph search tree exploration, heuristic evaluation (f = g + h),
 * nodes expanded telemetry, and solution route generation.
 */

import { CubeState, MOVES, INVERSE_MOVES } from '../cube/CubeState.js';
import { getHeuristicScore } from './Heuristics.js';
import { LayerByLayerSolver } from './LayerByLayer.js';

export class GraphSolver {
  constructor() {
    this.nodesExpanded = 0;
    this.maxDepthReached = 0;
    this.startTime = 0;
  }

  solve(cubeState, algorithm = 'auto', maxIdaDepth = 8) {
    const startTime = performance.now();
    this.nodesExpanded = 0;
    this.maxDepthReached = 0;

    if (cubeState.isSolved()) {
      return {
        algorithm: 'None (Solved)',
        moves: [],
        totalMoves: 0,
        nodesExpanded: 1,
        executionTimeMs: 0,
        solved: true
      };
    }

    // Try IDA* Search for short/optimal solution path first
    if (algorithm === 'ida' || algorithm === 'auto') {
      const idaResult = this.solveIDA(cubeState, maxIdaDepth);
      if (idaResult.found) {
        const executionTimeMs = (performance.now() - startTime).toFixed(2);
        return {
          algorithm: 'IDA* Search (Optimal Path)',
          moves: idaResult.path,
          totalMoves: idaResult.path.length,
          nodesExpanded: this.nodesExpanded,
          executionTimeMs: parseFloat(executionTimeMs),
          solved: true
        };
      }
    }

    // Fallback or explicit request for Layer-By-Layer Solver
    const lblSolver = new LayerByLayerSolver(cubeState);
    const lblResult = lblSolver.solve();
    const executionTimeMs = (performance.now() - startTime).toFixed(2);

    return {
      algorithm: 'Layer-By-Layer (Graph Heuristic)',
      moves: lblResult.moves,
      totalMoves: lblResult.moves.length,
      nodesExpanded: this.nodesExpanded + lblResult.nodesExpanded,
      executionTimeMs: parseFloat(executionTimeMs),
      solved: true
    };
  }

  // Iterative Deepening A* Search Engine
  solveIDA(initialCube, maxDepth = 8) {
    const rootState = initialCube.clone();
    let threshold = getHeuristicScore(rootState);

    for (let depth = threshold; depth <= maxDepth; depth++) {
      const path = [];
      const visitedHashes = new Set();
      visitedHashes.add(rootState.getHash());

      const res = this.searchIDA(rootState, 0, depth, path, visitedHashes);
      if (res.found) {
        return { found: true, path: res.path };
      }
    }

    return { found: false, path: [] };
  }

  searchIDA(currentCube, g, bound, path, visitedHashes) {
    this.nodesExpanded++;
    const h = getHeuristicScore(currentCube);
    const f = g + h;

    if (f > bound) return { found: false, minBound: f };
    if (currentCube.isSolved()) return { found: true, path: [...path] };

    if (g > this.maxDepthReached) this.maxDepthReached = g;

    let minNextBound = Infinity;

    for (const move of MOVES) {
      // Prune immediate inverse move (e.g., U followed by U')
      if (path.length > 0) {
        const lastMove = path[path.length - 1];
        if (INVERSE_MOVES[lastMove] === move) continue;
        if (lastMove[0] === move[0] && lastMove === move) continue; // avoid U U U
      }

      const nextCube = currentCube.clone();
      nextCube.applyMove(move);
      const hash = nextCube.getHash();

      if (visitedHashes.has(hash)) continue;

      visitedHashes.add(hash);
      path.push(move);

      const res = this.searchIDA(nextCube, g + 1, bound, path, visitedHashes);
      if (res.found) return res;

      if (res.minBound < minNextBound) minNextBound = res.minBound;

      path.pop();
      visitedHashes.delete(hash);
    }

    return { found: false, minBound: minNextBound };
  }
}
