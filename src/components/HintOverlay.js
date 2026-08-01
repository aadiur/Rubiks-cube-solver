/**
 * HintOverlay.js - Next Move Assist & Dynamic Reroute Alert Banner
 * Displays "Google Maps style Rerouting" notifications when user diverges.
 */

export class HintOverlay {
  constructor(containerElement) {
    this.container = containerElement;
    this.init();
  }

  init() {
    this.container.innerHTML = `
      <div id="reroute-toast" class="hidden transform transition-all duration-300 opacity-0 -translate-y-4 mb-4">
        <div class="bg-amber-500/10 border-2 border-amber-500/80 rounded-xl p-3.5 backdrop-blur-md flex items-center justify-between shadow-lg shadow-amber-500/10">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold text-lg animate-pulse">
              🔄
            </div>
            <div>
              <div class="flex items-center gap-2">
                <span class="font-bold text-amber-300 text-sm tracking-wide">ROUTE RECALCULATED</span>
                <span id="reroute-delta" class="text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-mono font-bold">+2 moves</span>
              </div>
              <p id="reroute-msg" class="text-xs text-amber-200/80 mt-0.5">Wrong move detected. Rerouting shortest graph path...</p>
            </div>
          </div>
          <span class="text-xs font-mono text-amber-400 bg-amber-950/60 border border-amber-500/30 px-2 py-1 rounded">Live Reroute</span>
        </div>
      </div>

      <div class="glass-panel p-4 rounded-xl shadow-xl border border-slate-700/60 backdrop-blur-md">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
            <h4 class="text-xs font-bold text-slate-300 uppercase tracking-wider">Turn-By-Turn Navigation</h4>
          </div>
          <span id="remaining-count-badge" class="text-xs font-mono text-cyan-400 bg-cyan-950/80 px-2.5 py-1 rounded-full border border-cyan-500/30">
            0 moves remaining
          </span>
        </div>

        <div class="flex items-center justify-between bg-slate-900/80 p-3 rounded-lg border border-slate-800">
          <div class="flex items-center gap-3">
            <div id="next-move-badge" class="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-extrabold text-2xl shadow-lg shadow-cyan-500/30 font-mono">
              -
            </div>
            <div>
              <span class="text-xs text-slate-400 block">Recommended Action</span>
              <span id="next-move-desc" class="text-sm font-semibold text-slate-200">Scramble cube or click Solve</span>
            </div>
          </div>

          <div class="flex items-center gap-1.5">
            <button id="btn-3d-hint-toggle" class="px-3 py-1.5 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 text-xs rounded-lg transition-all flex items-center gap-1">
              <span>3D Arrow</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  showRerouteToast(wrongMove, expectedMove, costDelta, newTotal) {
    const toast = document.getElementById('reroute-toast');
    const deltaEl = document.getElementById('reroute-delta');
    const msgEl = document.getElementById('reroute-msg');

    if (!toast) return;

    deltaEl.textContent = costDelta >= 0 ? `+${costDelta} moves` : `${costDelta} moves`;
    msgEl.textContent = `Executed move (${wrongMove}) instead of (${expectedMove || 'target'}). Rerouted to new optimal path (${newTotal} moves remaining).`;

    toast.classList.remove('hidden');
    setTimeout(() => {
      toast.classList.remove('opacity-0', '-translate-y-4');
    }, 10);

    setTimeout(() => {
      toast.classList.add('opacity-0', '-translate-y-4');
      setTimeout(() => toast.classList.add('hidden'), 300);
    }, 4500);
  }

  updateNextMove(move, remainingCount, descStr = '') {
    const badge = document.getElementById('next-move-badge');
    const desc = document.getElementById('next-move-desc');
    const countBadge = document.getElementById('remaining-count-badge');

    if (badge) badge.textContent = move || '✓';
    if (countBadge) countBadge.textContent = `${remainingCount} moves remaining`;

    if (desc) {
      if (move) {
        desc.textContent = descStr || `Rotate ${this.getMoveDescription(move)}`;
      } else {
        desc.textContent = 'Cube is in solved state!';
      }
    }
  }

  getMoveDescription(m) {
    const faceNames = { U: 'Up (Top)', D: 'Down (Bottom)', L: 'Left', R: 'Right', F: 'Front', B: 'Back' };
    const face = faceNames[m[0]] || m[0];
    if (m.includes("'")) return `${face} face 90° Counter-Clockwise`;
    if (m.includes('2')) return `${face} face 180° Half-Turn`;
    return `${face} face 90° Clockwise`;
  }
}
