/**
 * GraphVisualizer.js - DSA Telemetry & Graph Search Metrics Panel
 * Renders graph search tree depth, nodes expanded, execution time,
 * heuristic score h(n), path cost g(n), and branching factor.
 */

export class GraphVisualizer {
  constructor(containerElement) {
    this.container = containerElement;
    this.init();
  }

  init() {
    this.container.innerHTML = `
      <div class="glass-panel dsa-card p-4 rounded-xl shadow-2xl border border-cyan-500/30 backdrop-blur-md">
        <div class="flex items-center justify-between border-b border-cyan-500/20 pb-3 mb-3">
          <div class="flex items-center gap-2">
            <span class="pulse-dot bg-cyan-400"></span>
            <h3 class="font-bold text-cyan-300 tracking-wider text-sm uppercase">DSA Graph Search Telemetry</h3>
          </div>
          <span class="text-xs bg-cyan-950/60 text-cyan-400 px-2 py-1 rounded border border-cyan-500/30 font-mono">Graph Engine</span>
        </div>

        <div class="grid grid-cols-2 gap-3 text-xs">
          <div class="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
            <span class="text-slate-400 block mb-1">Search Algorithm</span>
            <span id="telemetry-algo" class="font-semibold text-emerald-400 font-mono">IDA* / LBL Graph</span>
          </div>
          <div class="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
            <span class="text-slate-400 block mb-1">Execution Time</span>
            <span id="telemetry-time" class="font-semibold text-cyan-300 font-mono">0.00 ms</span>
          </div>
          <div class="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
            <span class="text-slate-400 block mb-1">Nodes Expanded</span>
            <span id="telemetry-nodes" class="font-semibold text-amber-300 font-mono">0</span>
          </div>
          <div class="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
            <span class="text-slate-400 block mb-1">Search Depth g(n)</span>
            <span id="telemetry-depth" class="font-semibold text-purple-300 font-mono">0 moves</span>
          </div>
        </div>

        <div class="mt-3 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
          <div class="flex justify-between items-center text-xs mb-1">
            <span class="text-slate-400">Heuristic Progress h(n)</span>
            <span id="telemetry-h-score" class="text-cyan-400 font-mono">0% Solved</span>
          </div>
          <div class="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700">
            <div id="telemetry-progress-bar" class="bg-gradient-to-r from-cyan-500 to-emerald-400 h-2 rounded-full transition-all duration-300" style="width: 0%"></div>
          </div>
        </div>
      </div>
    `;
  }

  updateMetrics(data) {
    const algoEl = document.getElementById('telemetry-algo');
    const timeEl = document.getElementById('telemetry-time');
    const nodesEl = document.getElementById('telemetry-nodes');
    const depthEl = document.getElementById('telemetry-depth');
    const hScoreEl = document.getElementById('telemetry-h-score');
    const progressBarEl = document.getElementById('telemetry-progress-bar');

    if (algoEl && data.algorithm) algoEl.textContent = data.algorithm;
    if (timeEl && data.executionTimeMs !== undefined) timeEl.textContent = `${data.executionTimeMs} ms`;
    if (nodesEl && data.nodesExpanded !== undefined) nodesEl.textContent = data.nodesExpanded.toLocaleString();
    if (depthEl && data.totalMoves !== undefined) depthEl.textContent = `${data.totalMoves} moves`;

    if (data.progressPercent !== undefined) {
      if (hScoreEl) hScoreEl.textContent = `${data.progressPercent}% Solved`;
      if (progressBarEl) progressBarEl.style.width = `${data.progressPercent}%`;
    }
  }
}
