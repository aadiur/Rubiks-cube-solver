/**
 * DSAExplainModal.js - CSE Major Project Academic Defense Modal
 * Provides interactive documentation on Graph Theory, State Space Graphs,
 * IDA* search, Heuristics, and Dynamic Rerouting logic.
 */

export class DSAExplainModal {
  constructor(containerElement) {
    this.container = containerElement;
    this.init();
  }

  init() {
    this.container.innerHTML = `
      <div id="dsa-modal" class="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 hidden transition-all duration-300 opacity-0">
        <div class="glass-panel bg-slate-900/90 border border-cyan-500/40 rounded-2xl max-w-3xl w-full max-h-[85vh] overflow-hidden flex flex-col shadow-2xl">
          <!-- Modal Header -->
          <div class="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900/80">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-bold text-xl">
                🧠
              </div>
              <div>
                <h2 class="text-lg font-bold text-white tracking-wide">Computer Science & Graph Theory Defense</h2>
                <p class="text-xs text-cyan-400 font-mono">Rubik's Cube State Space Graph Analysis</p>
              </div>
            </div>
            <button id="close-dsa-modal" class="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-all text-xl font-bold">
              ✕
            </button>
          </div>

          <!-- Modal Body (Scrollable) -->
          <div class="p-6 overflow-y-auto space-y-6 text-sm text-slate-300 font-sans">
            <!-- Section 1 -->
            <div class="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2">
              <h3 class="text-cyan-300 font-bold text-base flex items-center gap-2">
                <span>1. State Space Graph Topology</span>
              </h3>
              <p class="text-slate-300 leading-relaxed text-xs">
                A Rubik's Cube is modeled mathematically as an undirected graph <span class="font-mono text-cyan-400">G = (V, E)</span> where:
              </p>
              <ul class="list-disc list-inside text-xs space-y-1 text-slate-400 pl-2">
                <li><strong class="text-slate-200">Vertices (V):</strong> <span class="font-mono text-cyan-300">|V| ≈ 4.33 × 10¹⁹</span> valid permutations. Each node represents a unique cube configuration.</li>
                <li><strong class="text-slate-200">Edges (E):</strong> 18 outward edges per node corresponding to the 18 standard move operations ($U, U', U2, D, D', D2, L, L', L2, R, R', R2, F, F', F2, B, B', B2$).</li>
                <li><strong class="text-slate-200">Graph Diameter (God's Number):</strong> Max distance between any node and the solved node is exactly <span class="font-mono text-emerald-400">20 moves</span> (in half-turn metric).</li>
              </ul>
            </div>

            <!-- Section 2 -->
            <div class="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2">
              <h3 class="text-emerald-300 font-bold text-base flex items-center gap-2">
                <span>2. IDA* (Iterative Deepening A*) Search</span>
              </h3>
              <p class="text-slate-300 leading-relaxed text-xs">
                To solve the graph efficiently without exhausting system memory, we utilize <strong class="text-emerald-400">IDA* Search</strong> which combines Depth-First Search memory efficiency ($O(d)$ space) with A* optimal pathfinding:
              </p>
              <div class="bg-slate-900 p-3 rounded border border-slate-800 font-mono text-xs text-emerald-300">
                f(n) = g(n) + h(n)<br>
                where:<br>
                g(n) = path cost from root node to current node n<br>
                h(n) = admissible heuristic estimate from node n to solved state
              </div>
            </div>

            <!-- Section 3 -->
            <div class="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2">
              <h3 class="text-amber-300 font-bold text-base flex items-center gap-2">
                <span>3. Dynamic "Google Maps" Rerouting System</span>
              </h3>
              <p class="text-slate-300 leading-relaxed text-xs">
                Just as modern GPS navigation recalculates routes when a driver misses a turn, our engine performs <strong class="text-amber-400">Real-Time Graph State Recalculation</strong>:
              </p>
              <ol class="list-decimal list-inside text-xs space-y-1 text-slate-400 pl-2">
                <li>Every user turn on the 3D cube computes state transition <span class="font-mono text-amber-300">s' = δ(s, move)</span>.</li>
                <li>If <span class="font-mono text-slate-200">s'</span> diverges from recommended path node <span class="font-mono text-slate-200">s_expected</span>, state rerouting triggers.</li>
                <li>The engine runs instant graph search starting from node <span class="font-mono text-amber-300">s'</span> to locate the new shortest path.</li>
              </ol>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="p-4 border-t border-slate-800 bg-slate-900/80 flex justify-between items-center">
            <span class="text-xs text-slate-400 font-mono">CSE Undergraduate Major Project</span>
            <button id="btn-close-dsa-modal-bottom" class="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-lg transition-all shadow-lg shadow-cyan-600/30">
              Close Defense Guide
            </button>
          </div>
        </div>
      </div>
    `;

    // Event handlers
    const modal = document.getElementById('dsa-modal');
    const closeBtn1 = document.getElementById('close-dsa-modal');
    const closeBtn2 = document.getElementById('btn-close-dsa-modal-bottom');

    const closeModal = () => {
      modal.classList.add('opacity-0');
      setTimeout(() => modal.classList.add('hidden'), 300);
    };

    if (closeBtn1) closeBtn1.onclick = closeModal;
    if (closeBtn2) closeBtn2.onclick = closeModal;
  }

  show() {
    const modal = document.getElementById('dsa-modal');
    if (!modal) return;
    modal.classList.remove('hidden');
    setTimeout(() => modal.classList.remove('opacity-0'), 10);
  }
}
