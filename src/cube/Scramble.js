/**
 * Scramble.js - WCA Standard Rubik's Cube Scramble Generator
 * Generates random 20-25 move scrambles avoiding redundant moves on the same axis.
 */

import { CubeState } from './CubeState.js';

const FACES = ['U', 'D', 'L', 'R', 'F', 'B'];
const MODIFIERS = ['', "'", '2'];

// Opposite faces that share the same rotational axis
const OPPOSITES = {
  'U': 'D', 'D': 'U',
  'L': 'R', 'R': 'L',
  'F': 'B', 'B': 'F'
};

export function generateScramble(length = 22) {
  const scramble = [];
  let lastFace = '';
  let secondLastFace = '';

  for (let i = 0; i < length; i++) {
    let face = '';
    while (true) {
      face = FACES[Math.floor(Math.random() * FACES.length)];

      // Don't repeat same face (e.g. U U)
      if (face === lastFace) continue;

      // Don't do redundant sandwich moves (e.g. U D U)
      if (face === secondLastFace && OPPOSITES[face] === lastFace) continue;

      break;
    }

    const modifier = MODIFIERS[Math.floor(Math.random() * MODIFIERS.length)];
    scramble.push(face + modifier);

    secondLastFace = lastFace;
    lastFace = face;
  }

  return scramble.join(' ');
}

export function scrambleCube(cubeState, moveCount = 20) {
  const scrambleStr = generateScramble(moveCount);
  cubeState.applySequence(scrambleStr);
  return scrambleStr;
}
