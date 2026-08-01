/**
 * StateEditor.js - Manual Cube Facelet Color Picker Modal
 * Allows users to manually configure facelet colors for real physical cube solving.
 */

import { FACE_COLORS } from '../cube/CubeState.js';

export class StateEditor {
  constructor(containerElement, onSaveStateCallback) {
    this.container = containerElement;
    this.onSaveState = onSaveStateCallback;
    this.selectedColor = 'U'; // Default white
    this.init();
  }

  init() {
    this.container.innerHTML = `
      <div id="state-editor-modal" class="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 hidden transition-all duration-300 opacity-0">
        <div class="glass-panel bg-slate-900/90 border border-slate-700/60 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5">
          <div class="flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 class="text-base font-bold text-white tracking-wide">Manual Cube State Customizer</h3>
            <button id="close-editor-modal" class="text-slate-400 hover:text-white font-bold text-lg">✕</button>
          </div>

          <!-- Color Palette Picker -->
          <div class="flex items-center justify-center gap-3 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <span class="text-xs text-slate-400 font-semibold mr-2">Palette:</span>
            ${['U', 'D', 'L', 'R', 'F', 'B'].map(code => `
              <button data-color="${code}" class="color-palette-btn w-8 h-8 rounded-lg border-2 border-slate-700 transition-all hover:scale-110 flex items-center justify-center font-mono font-bold text-xs shadow-md" style="background-color: ${FACE_COLORS[code]}; color: ${code === 'U' || code === 'D' ? '#000' : '#fff'};">
                ${code}
              </button>
            `).join('')}
          </div>

          <!-- 2D Unfolded Net View (U, L, F, R, B, D) -->
          <div class="text-center text-xs text-slate-400">Click any facelet tile to apply selected color</div>
          
          <div class="flex flex-col items-center gap-2 py-2">
            <!-- Up Face -->
            <div id="net-face-U" class="grid grid-cols-3 gap-1 bg-slate-950 p-1.5 rounded-lg border border-slate-800 w-28 h-28"></div>

            <!-- Middle Row: L, F, R, B -->
            <div class="flex gap-2">
              <div id="net-face-L" class="grid grid-cols-3 gap-1 bg-slate-950 p-1.5 rounded-lg border border-slate-800 w-28 h-28"></div>
              <div id="net-face-F" class="grid grid-cols-3 gap-1 bg-slate-950 p-1.5 rounded-lg border border-slate-800 w-28 h-28"></div>
              <div id="net-face-R" class="grid grid-cols-3 gap-1 bg-slate-950 p-1.5 rounded-lg border border-slate-800 w-28 h-28"></div>
              <div id="net-face-B" class="grid grid-cols-3 gap-1 bg-slate-950 p-1.5 rounded-lg border border-slate-800 w-28 h-28"></div>
            </div>

            <!-- Down Face -->
            <div id="net-face-D" class="grid grid-cols-3 gap-1 bg-slate-950 p-1.5 rounded-lg border border-slate-800 w-28 h-28"></div>
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-between items-center border-t border-slate-800 pt-4">
            <button id="btn-reset-editor" class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg">
              Reset Solved Net
            </button>
            <button id="btn-apply-custom-state" class="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-lg shadow-emerald-600/30">
              Apply to 3D Cube & Solve
            </button>
          </div>
        </div>
      </div>
    `;

    this.setupEvents();
  }

  setupEvents() {
    const modal = document.getElementById('state-editor-modal');
    const closeBtn = document.getElementById('close-editor-modal');
    const resetBtn = document.getElementById('btn-reset-editor');
    const applyBtn = document.getElementById('btn-apply-custom-state');

    closeBtn.onclick = () => this.hide();
    resetBtn.onclick = () => this.renderNet();

    document.querySelectorAll('.color-palette-btn').forEach(btn => {
      btn.onclick = () => {
        document.querySelectorAll('.color-palette-btn').forEach(b => b.classList.remove('ring-2', 'ring-cyan-400', 'scale-110'));
        btn.classList.add('ring-2', 'ring-cyan-400', 'scale-110');
        this.selectedColor = btn.dataset.color;
      };
    });

    applyBtn.onclick = () => {
      // Gather colors from net tiles
      const stateStr = ['U', 'D', 'L', 'R', 'F', 'B'].map(face => {
        const tiles = document.querySelectorAll(`#net-face-${face} .net-tile`);
        return Array.from(tiles).map(t => t.dataset.faceletColor).join('');
      }).join('');

      if (this.onSaveState) this.onSaveState(stateStr);
      this.hide();
    };
  }

  show(currentCubeState) {
    this.renderNet(currentCubeState);
    const modal = document.getElementById('state-editor-modal');
    modal.classList.remove('hidden');
    setTimeout(() => modal.classList.remove('opacity-0'), 10);
  }

  hide() {
    const modal = document.getElementById('state-editor-modal');
    modal.classList.add('opacity-0');
    setTimeout(() => modal.classList.add('hidden'), 300);
  }

  renderNet(cubeState) {
    const faces = ['U', 'D', 'L', 'R', 'F', 'B'];
    faces.forEach(face => {
      const container = document.getElementById(`net-face-${face}`);
      if (!container) return;
      container.innerHTML = '';

      for (let i = 0; i < 9; i++) {
        const colorCode = cubeState ? cubeState.state[face][i] : face;
        const tile = document.createElement('button');
        tile.className = 'net-tile rounded border border-slate-700/80 transition-all hover:opacity-80';
        tile.style.backgroundColor = FACE_COLORS[colorCode];
        tile.dataset.faceletColor = colorCode;

        tile.onclick = () => {
          tile.style.backgroundColor = FACE_COLORS[this.selectedColor];
          tile.dataset.faceletColor = this.selectedColor;
        };

        container.appendChild(tile);
      }
    });
  }
}
