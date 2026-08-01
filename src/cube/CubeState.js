/**
 * CubeState.js - Exact 3x3 Rubik's Cube State Representation & Permutations
 * Handles facelets, move algebra (U, D, L, R, F, B and modifiers ', 2),
 * validation, state serialization, and move inverses.
 */

export const FACE_COLORS = {
  U: '#FFFFFF', // White
  D: '#FFD700', // Yellow
  L: '#FF6B00', // Orange
  R: '#DC2626', // Red
  F: '#10B981', // Green
  B: '#2563EB'  // Blue
};

export const FACE_NAMES = {
  U: 'Up',
  D: 'Down',
  L: 'Left',
  R: 'Right',
  F: 'Front',
  B: 'Back'
};

export const MOVES = ['U', "U'", 'U2', 'D', "D'", 'D2', 'L', "L'", 'L2', 'R', "R'", 'R2', 'F', "F'", 'F2', 'B', "B'", 'B2'];

export const INVERSE_MOVES = {
  'U': "U'", "U'": 'U', 'U2': 'U2',
  'D': "D'", "D'": 'D', 'D2': 'D2',
  'L': "L'", "L'": 'L', 'L2': 'L2',
  'R': "R'", "R'": 'R', 'R2': 'R2',
  'F': "F'", "F'": 'F', 'F2': 'F2',
  'B': "B'", "B'": 'B', 'B2': 'B2'
};

export class CubeState {
  constructor(stateStr = null) {
    if (stateStr) {
      this.state = this.parseStateStr(stateStr);
    } else {
      this.resetToSolved();
    }
  }

  resetToSolved() {
    // 6 faces x 9 facelets each
    this.state = {
      U: Array(9).fill('U'),
      D: Array(9).fill('D'),
      L: Array(9).fill('L'),
      R: Array(9).fill('R'),
      F: Array(9).fill('F'),
      B: Array(9).fill('B')
    };
  }

  clone() {
    const newCube = new CubeState();
    newCube.state = {
      U: [...this.state.U],
      D: [...this.state.D],
      L: [...this.state.L],
      R: [...this.state.R],
      F: [...this.state.F],
      B: [...this.state.B]
    };
    return newCube;
  }

  isSolved() {
    for (const face of ['U', 'D', 'L', 'R', 'F', 'B']) {
      const color = this.state[face][0];
      if (!this.state[face].every(val => val === color)) {
        return false;
      }
    }
    return true;
  }

  getHash() {
    return ['U', 'D', 'L', 'R', 'F', 'B'].map(f => this.state[f].join('')).join('');
  }

  parseStateStr(str) {
    if (str.length !== 54) throw new Error('State string must be 54 characters');
    return {
      U: str.slice(0, 9).split(''),
      D: str.slice(9, 18).split(''),
      L: str.slice(18, 27).split(''),
      R: str.slice(27, 36).split(''),
      F: str.slice(36, 45).split(''),
      B: str.slice(45, 54).split('')
    };
  }

  // Rotate a 3x3 face matrix clockwise
  static rotateFaceCW(faceArray) {
    const f = faceArray;
    return [
      f[6], f[3], f[0],
      f[7], f[4], f[1],
      f[8], f[5], f[2]
    ];
  }

  // Rotate a 3x3 face matrix counter-clockwise
  static rotateFaceCCW(faceArray) {
    const f = faceArray;
    return [
      f[2], f[5], f[8],
      f[1], f[4], f[7],
      f[0], f[3], f[6]
    ];
  }

  applyMove(move) {
    const baseMove = move[0];
    const modifier = move.slice(1);

    let times = 1;
    if (modifier === "'") times = 3; // 3 CW = 1 CCW
    else if (modifier === '2') times = 2;

    for (let t = 0; t < times; t++) {
      this.applySingleCWMove(baseMove);
    }
    return this;
  }

  applySequence(moveStr) {
    if (!moveStr) return this;
    const moveArray = Array.isArray(moveStr) ? moveStr : moveStr.trim().split(/\s+/);
    for (const m of moveArray) {
      if (m) this.applyMove(m);
    }
    return this;
  }

  applySingleCWMove(face) {
    const s = this.state;
    s[face] = CubeState.rotateFaceCW(s[face]);

    let tmp;
    switch (face) {
      case 'U':
        // U turn affects top row of F, L, B, R
        tmp = [s.F[0], s.F[1], s.F[2]];
        s.F[0] = s.R[0]; s.F[1] = s.R[1]; s.F[2] = s.R[2];
        s.R[0] = s.B[0]; s.R[1] = s.B[1]; s.R[2] = s.B[2];
        s.B[0] = s.L[0]; s.B[1] = s.L[1]; s.B[2] = s.L[2];
        s.L[0] = tmp[0]; s.L[1] = tmp[1]; s.L[2] = tmp[2];
        break;

      case 'D':
        // D turn affects bottom row of F, R, B, L
        tmp = [s.F[6], s.F[7], s.F[8]];
        s.F[6] = s.L[6]; s.F[7] = s.L[7]; s.F[8] = s.L[8];
        s.L[6] = s.B[6]; s.L[7] = s.B[7]; s.L[8] = s.B[8];
        s.B[6] = s.R[6]; s.B[7] = s.R[7]; s.B[8] = s.R[8];
        s.R[6] = tmp[0]; s.R[7] = tmp[1]; s.R[8] = tmp[2];
        break;

      case 'L':
        // L turn affects left column of U, F, D, B (B inverted)
        tmp = [s.U[0], s.U[3], s.U[6]];
        s.U[0] = s.B[8]; s.U[3] = s.B[5]; s.U[6] = s.B[2];
        s.B[8] = s.D[0]; s.B[5] = s.D[3]; s.B[2] = s.D[6];
        s.D[0] = s.F[0]; s.D[3] = s.F[3]; s.D[6] = s.F[6];
        s.F[0] = tmp[0]; s.F[3] = tmp[1]; s.F[6] = tmp[2];
        break;

      case 'R':
        // R turn affects right column of U, B (inverted), D, F
        tmp = [s.U[2], s.U[5], s.U[8]];
        s.U[2] = s.F[2]; s.U[5] = s.F[5]; s.U[8] = s.F[8];
        s.F[2] = s.D[2]; s.F[5] = s.D[5]; s.F[8] = s.D[8];
        s.D[2] = s.B[6]; s.D[5] = s.B[3]; s.D[8] = s.B[0];
        s.B[6] = tmp[0]; s.B[3] = tmp[1]; s.B[0] = tmp[2];
        break;

      case 'F':
        // F turn affects bottom row U, left col R, top row D (rev), right col L (rev)
        tmp = [s.U[6], s.U[7], s.U[8]];
        s.U[6] = s.L[8]; s.U[7] = s.L[5]; s.U[8] = s.L[2];
        s.L[2] = s.D[0]; s.L[5] = s.D[1]; s.L[8] = s.D[2];
        s.D[0] = s.R[6]; s.D[1] = s.R[3]; s.D[2] = s.R[0];
        s.R[0] = tmp[0]; s.R[3] = tmp[1]; s.R[6] = tmp[2];
        break;

      case 'B':
        // B turn affects top row U, right col R, bottom row D (rev), left col L (rev)
        tmp = [s.U[0], s.U[1], s.U[2]];
        s.U[0] = s.R[2]; s.U[1] = s.R[5]; s.U[2] = s.R[8];
        s.R[2] = s.D[8]; s.R[5] = s.D[7]; s.R[8] = s.D[6];
        s.D[8] = s.L[6]; s.D[7] = s.L[3]; s.D[6] = s.L[0];
        s.L[0] = tmp[2]; s.L[3] = tmp[1]; s.L[6] = tmp[0];
        break;
    }
  }

  // Count correctly positioned facelets
  getCorrectCount() {
    let count = 0;
    for (const face of ['U', 'D', 'L', 'R', 'F', 'B']) {
      for (let i = 0; i < 9; i++) {
        if (this.state[face][i] === face) count++;
      }
    }
    return count;
  }
}
