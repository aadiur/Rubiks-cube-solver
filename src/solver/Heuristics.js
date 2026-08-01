/**
 * Heuristics.js - Graph Search Distance Estimators h(n)
 * Provides admissible distance metrics for IDA* / A* search tree pruning.
 */

// Heuristic calculation: Sum of misplaced facelets scaled by 1/8 (since each move can place at most 8 facelets)
export function getHeuristicScore(cube) {
  let misplaced = 0;
  const state = cube.state;

  for (const face of ['U', 'D', 'L', 'R', 'F', 'B']) {
    const centerColor = state[face][4]; // Center tile defines face identity
    for (let i = 0; i < 9; i++) {
      if (state[face][i] !== centerColor) {
        misplaced++;
      }
    }
  }

  // Admissible heuristic: divide by max facelets changed per face turn (8)
  return Math.ceil(misplaced / 8);
}

// Detailed phase heuristic for Layer-by-Layer progress
export function getPhaseProgress(cube) {
  const state = cube.state;
  let progress = 0;

  // Phase 1: White Cross (D face center = Yellow or White, let's assume D face solved)
  const dCenter = state.D[4];
  const dEdges = [1, 3, 5, 7];
  let dCrossSolved = dEdges.every(i => state.D[i] === dCenter);
  if (dCrossSolved) progress += 20;

  // Phase 2: D Corners (First layer)
  const dCorners = [0, 2, 6, 8];
  let dCornersSolved = dCorners.every(i => state.D[i] === dCenter);
  if (dCrossSolved && dCornersSolved) progress += 25;

  // Phase 3: Middle Layer
  let midSolved = (state.F[3] === state.F[4] && state.F[5] === state.F[4] &&
                   state.B[3] === state.B[4] && state.B[5] === state.B[4] &&
                   state.L[3] === state.L[4] && state.L[5] === state.L[4] &&
                   state.R[3] === state.R[4] && state.R[5] === state.R[4]);
  if (dCornersSolved && midSolved) progress += 25;

  // Phase 4: Upper Layer Cross & Corners
  const uCenter = state.U[4];
  let uSolved = state.U.every(c => c === uCenter);
  if (midSolved && uSolved) progress += 30;

  return progress;
}
