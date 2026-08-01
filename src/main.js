/**
 * main.js - Application Orchestrator & Controller
 * Integrates 3D WebGL Three.js Renderer, Dynamic Rerouter, State Algebra,
 * Graph Telemetry Visualizer, and Event Handlers.
 */

import confetti from 'canvas-confetti';
import { CubeState } from './cube/CubeState.js';
import { CubeRenderer3D } from './cube/CubeRenderer3D.js';
import { generateScramble } from './cube/Scramble.js';
import { DynamicRerouter } from './solver/DynamicRerouter.js';
import { GraphVisualizer } from './components/GraphVisualizer.js';
import { HintOverlay } from './components/HintOverlay.js';
import { StateEditor } from './components/StateEditor.js';
import { DSAExplainModal } from './components/DSAExplainModal.js';
import { getPhaseProgress } from './solver/Heuristics.js';

class AppController {
  constructor() {
    this.cubeState = new CubeState();
    this.renderer = null;
    this.rerouter = new DynamicRerouter();

    // Components
    this.telemetry = null;
    this.hintOverlay = null;
    this.stateEditor = null;
    this.dsaModal = null;

    this.isPlaying = false;
    this.autoPlayTimer = null;
    this.show3DArrow = true;

    this.init();
  }

  init() {
    // Render Components Into Placeholders
    this.hintOverlay = new HintOverlay(document.getElementById('hint-overlay-container'));
    this.telemetry = new GraphVisualizer(document.getElementById('telemetry-panel-container'));
    this.stateEditor = new StateEditor(document.getElementById('editor-modal-container'), (newStateStr) => this.handleCustomState(newStateStr));
    this.dsaModal = new DSAExplainModal(document.getElementById('dsa-modal-container'));

    // Initialize 3D Three.js Renderer
    const canvasContainer = document.getElementById('canvas-container');
    this.renderer = new CubeRenderer3D(canvasContainer, (move) => this.executeMove(move, true));

    // Update 3D Cube Colors from Initial Solved State
    this.renderer.updateFromState(this.cubeState);

    // Setup Rerouting Engine Listener
    this.rerouter.onUpdate((data) => this.handleRerouteUpdate(data));

    // Attach Event Handlers
    this.setupEvents();

    // Set initial telemetry metrics
    this.updateCubeStatus('Solved', 'emerald');
    this.telemetry.updateMetrics({
      algorithm: 'Ready',
      executionTimeMs: 0,
      nodesExpanded: 0,
      totalMoves: 0,
      progressPercent: 100
    });
  }

  setupEvents() {
    // Top Bar Actions
    document.getElementById('btn-scramble').onclick = () => this.handleScramble();
    document.getElementById('btn-solve').onclick = () => this.handleSolve();
    document.getElementById('btn-open-editor').onclick = () => this.stateEditor.show(this.cubeState);
    document.getElementById('btn-open-dsa-modal').onclick = () => this.dsaModal.show();

    // Timeline Controls
    document.getElementById('btn-step-next').onclick = () => this.executeNextSolutionStep();
    document.getElementById('btn-step-prev').onclick = () => this.stepPrev();
    document.getElementById('btn-play-pause').onclick = () => this.toggleAutoPlay();
    document.getElementById('btn-reset-cube').onclick = () => this.resetCube();

    // 3D Arrow Toggle
    document.getElementById('btn-3d-hint-toggle').onclick = () => {
      this.show3DArrow = !this.show3DArrow;
      const btn = document.getElementById('btn-3d-hint-toggle');
      btn.classList.toggle('bg-cyan-950/80', this.show3DArrow);
      btn.classList.toggle('bg-slate-800', !this.show3DArrow);

      if (!this.show3DArrow) this.renderer.clear3DHint();
      else this.update3DHintArrow();
    };

    // Manual Turn Keypad Buttons
    document.querySelectorAll('.manual-move-btn').forEach(btn => {
      btn.onclick = () => {
        const move = btn.dataset.move;
        if (move) this.executeMove(move, true);
      };
    });
  }

  async executeMove(moveStr, trackReroute = true) {
    if (this.renderer.isAnimating) return;

    // Apply move to state
    this.cubeState.applyMove(moveStr);
    await this.renderer.animateMove(moveStr);
    this.renderer.updateFromState(this.cubeState);

    const isSolved = this.cubeState.isSolved();

    if (isSolved) {
      this.handleSolveCompleted();
      return;
    }

    if (trackReroute) {
      this.rerouter.processUserMove(moveStr, this.cubeState);
    }

    this.update3DHintArrow();
    this.updateProgressTelemetry();
  }

  handleScramble() {
    this.stopAutoPlay();
    const scrambleStr = generateScramble(20);
    this.cubeState.applySequence(scrambleStr);
    this.renderer.updateFromState(this.cubeState);

    this.updateCubeStatus('Scrambled', 'amber');
    this.renderer.clear3DHint();

    // Reset Route
    this.rerouter.reset();
    this.renderMoveList([]);
    this.hintOverlay.updateNextMove(null, 0, 'Cube scrambled! Click Solve & Assist');

    this.updateProgressTelemetry();
  }

  handleSolve() {
    this.stopAutoPlay();
    if (this.cubeState.isSolved()) {
      alert('Cube is already solved!');
      return;
    }

    this.updateCubeStatus('Solving...', 'cyan');

    // Run Dynamic Rerouting Engine solver initialization
    const result = this.rerouter.setRoute(this.cubeState);
    this.renderMoveList(result.moves);

    this.telemetry.updateMetrics({
      algorithm: result.algorithm,
      executionTimeMs: result.executionTimeMs,
      nodesExpanded: result.nodesExpanded,
      totalMoves: result.moves.length,
      progressPercent: getPhaseProgress(this.cubeState)
    });

    this.update3DHintArrow();
  }

  handleRerouteUpdate(data) {
    if (data.type === 'ROUTE_SET') {
      this.hintOverlay.updateNextMove(data.path[0], data.totalMoves);
      this.renderMoveList(data.path, 0);
    } else if (data.type === 'ROUTE_ON_TRACK') {
      this.hintOverlay.updateNextMove(data.nextMove, data.remainingMoves);
      this.renderMoveList(this.rerouter.currentPath, this.rerouter.stepIndex);
    } else if (data.type === 'ROUTE_RECALCULATED') {
      // Dynamic Google Maps Reroute Notification!
      this.hintOverlay.showRerouteToast(data.wrongMove, data.expectedMove, data.costDelta, data.newRemaining);
      this.hintOverlay.updateNextMove(data.nextMove, data.newRemaining);
      this.renderMoveList(data.newPath, 0);

      this.telemetry.updateMetrics({
        algorithm: data.algorithm,
        executionTimeMs: data.executionTimeMs,
        nodesExpanded: data.nodesExpanded,
        totalMoves: data.newRemaining,
        progressPercent: getPhaseProgress(this.cubeState)
      });
    }

    this.update3DHintArrow();
  }

  async executeNextSolutionStep() {
    const nextMove = this.rerouter.getNextMoveHint();
    if (nextMove) {
      await this.executeMove(nextMove, true);
    }
  }

  toggleAutoPlay() {
    const btn = document.getElementById('btn-play-pause');
    if (this.isPlaying) {
      this.stopAutoPlay();
      btn.textContent = '▶ Auto-Play';
      btn.classList.replace('bg-amber-600', 'bg-cyan-600');
    } else {
      this.isPlaying = true;
      btn.textContent = '⏸ Pause';
      btn.classList.replace('bg-cyan-600', 'bg-amber-600');

      this.autoPlayTimer = setInterval(async () => {
        const nextMove = this.rerouter.getNextMoveHint();
        if (nextMove && !this.cubeState.isSolved()) {
          await this.executeNextSolutionStep();
        } else {
          this.stopAutoPlay();
        }
      }, 700);
    }
  }

  stopAutoPlay() {
    this.isPlaying = false;
    if (this.autoPlayTimer) clearInterval(this.autoPlayTimer);
    const btn = document.getElementById('btn-play-pause');
    if (btn) {
      btn.textContent = '▶ Auto-Play';
      btn.classList.replace('bg-amber-600', 'bg-cyan-600');
    }
  }

  resetCube() {
    this.stopAutoPlay();
    this.cubeState.resetToSolved();
    this.renderer.updateFromState(this.cubeState);
    this.renderer.clear3DHint();
    this.rerouter.reset();
    this.renderMoveList([]);
    this.hintOverlay.updateNextMove(null, 0, 'Cube reset to solved state');
    this.updateCubeStatus('Solved', 'emerald');
    this.updateProgressTelemetry();
  }

  handleCustomState(stateStr) {
    try {
      this.cubeState = new CubeState(stateStr);
      this.renderer.updateFromState(this.cubeState);
      this.handleSolve();
    } catch (e) {
      alert('Invalid cube state configuration!');
    }
  }

  update3DHintArrow() {
    if (!this.show3DArrow) return;
    const nextMove = this.rerouter.getNextMoveHint();
    if (nextMove && !this.cubeState.isSolved()) {
      this.renderer.show3DHint(nextMove);
    } else {
      this.renderer.clear3DHint();
    }
  }

  updateProgressTelemetry() {
    const progress = getPhaseProgress(this.cubeState);
    this.telemetry.updateMetrics({
      progressPercent: progress
    });
  }

  renderMoveList(moves, activeIndex = 0) {
    const container = document.getElementById('solution-moves-container');
    const countLabel = document.getElementById('move-progress-count');

    if (!container) return;
    container.innerHTML = '';

    if (countLabel) {
      countLabel.textContent = `${activeIndex} / ${moves.length}`;
    }

    if (moves.length === 0) {
      container.innerHTML = `<div class="text-xs text-slate-500 text-center w-full py-6 italic">No active solution route</div>`;
      return;
    }

    moves.forEach((m, idx) => {
      const card = document.createElement('div');
      const isActive = idx === activeIndex;
      const isPast = idx < activeIndex;

      card.className = `px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all border ${
        isActive
          ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-cyan-400 shadow-md shadow-cyan-500/40 scale-105'
          : isPast
          ? 'bg-slate-900 text-slate-500 border-slate-800 line-through opacity-60'
          : 'bg-slate-800/80 text-slate-300 border-slate-700/60 hover:bg-slate-700'
      }`;
      card.textContent = `${idx + 1}. ${m}`;

      card.onclick = async () => {
        if (idx === activeIndex) {
          await this.executeMove(m, true);
        }
      };

      container.appendChild(card);
    });
  }

  handleSolveCompleted() {
    this.stopAutoPlay();
    this.renderer.clear3DHint();
    this.updateCubeStatus('Solved! 🎉', 'emerald');
    this.hintOverlay.updateNextMove(null, 0, 'Congratulations! Rubik\'s Cube Solved!');
    this.telemetry.updateMetrics({ progressPercent: 100 });

    // Celebratory Confetti
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 }
    });
  }

  updateCubeStatus(statusText, color = 'emerald') {
    const label = document.getElementById('cube-status-label');
    if (!label) return;
    label.textContent = statusText;
    label.className = `text-xs font-mono font-semibold text-${color}-300`;
  }
}

// Instantiate App
window.addEventListener('DOMContentLoaded', () => {
  window.app = new AppController();
});
