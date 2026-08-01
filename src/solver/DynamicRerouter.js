/**
 * DynamicRerouter.js - "Google Maps for Rubik's Cube" Rerouting Engine
 * Continuously monitors user moves on the 3D cube.
 * If user makes a wrong turn or deviates from the recommended hint path,
 * dynamically recalculates the shortest graph path from the new state.
 */

import { GraphSolver } from './GraphSolver.js';

export class DynamicRerouter {
  constructor() {
    this.solver = new GraphSolver();
    this.currentPath = [];
    this.stepIndex = 0;
    this.activeCubeState = null;
    this.listeners = [];
    this.history = [];
  }

  // Initialize route for a given scrambled cube state
  setRoute(cubeState) {
    this.activeCubeState = cubeState.clone();
    const result = this.solver.solve(this.activeCubeState);
    this.currentPath = result.moves;
    this.stepIndex = 0;
    this.history = [];

    this.notifyListeners({
      type: 'ROUTE_SET',
      path: this.currentPath,
      stepIndex: 0,
      totalMoves: this.currentPath.length,
      algorithm: result.algorithm,
      executionTimeMs: result.executionTimeMs,
      nodesExpanded: result.nodesExpanded
    });

    return result;
  }

  // Register listener for reroute events and UI updates
  onUpdate(callback) {
    this.listeners.push(callback);
  }

  notifyListeners(data) {
    for (const listener of this.listeners) {
      listener(data);
    }
  }

  getNextMoveHint() {
    if (this.stepIndex < this.currentPath.length) {
      return this.currentPath[this.stepIndex];
    }
    return null;
  }

  // Process user move on the 3D cube
  processUserMove(moveExecuted, currentCubeState) {
    this.activeCubeState = currentCubeState.clone();
    this.history.push(moveExecuted);

    const expectedMove = this.getNextMoveHint();

    if (expectedMove && moveExecuted === expectedMove) {
      // User followed recommended route!
      this.stepIndex++;

      const isSolved = this.activeCubeState.isSolved();

      this.notifyListeners({
        type: 'ROUTE_ON_TRACK',
        moveExecuted,
        stepIndex: this.stepIndex,
        remainingMoves: this.currentPath.length - this.stepIndex,
        nextMove: this.getNextMoveHint(),
        isSolved
      });

      return {
        rerouted: false,
        onTrack: true,
        remainingMoves: this.currentPath.length - this.stepIndex
      };
    }

    // User made a wrong turn or deviated from hint path!
    // Trigger "Google Maps" Dynamic Reroute!
    const remainingBefore = this.currentPath.length - this.stepIndex;

    const newSolveResult = this.solver.solve(this.activeCubeState);
    const newPath = newSolveResult.moves;
    this.currentPath = newPath;
    this.stepIndex = 0;

    const movesDelta = newPath.length - remainingBefore;

    this.notifyListeners({
      type: 'ROUTE_RECALCULATED',
      wrongMove: moveExecuted,
      expectedMove: expectedMove,
      previousRemaining: remainingBefore,
      newRemaining: newPath.length,
      costDelta: movesDelta,
      newPath: newPath,
      nextMove: this.getNextMoveHint(),
      algorithm: newSolveResult.algorithm,
      executionTimeMs: newSolveResult.executionTimeMs,
      nodesExpanded: newSolveResult.nodesExpanded,
      isSolved: this.activeCubeState.isSolved()
    });

    return {
      rerouted: true,
      onTrack: false,
      costDelta: movesDelta,
      newRemaining: newPath.length,
      nextMove: this.getNextMoveHint()
    };
  }

  reset() {
    this.currentPath = [];
    this.stepIndex = 0;
    this.history = [];
  }
}
