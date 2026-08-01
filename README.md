[README(2).md](https://github.com/user-attachments/files/30617952/README.2.md)

# Rubik's Cube Solver

<p align="center">
  <img src="https://upload.wikimedia.org/wikipedia/commons/7/7a/Rubik_cube.png" alt="Rubik's Cube" width="260" />
</p>

<p align="center">
  <b>An interactive 3D Rubik's Cube solver powered by Graph Theory, IDA* search, and live route recalculation.</b>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#how-it-works">How It Works</a> •
  <a href="#getting-started">Getting Started</a>
</p>

---

## Overview

Rubik's Cube Solver is a CSE major project that combines **3D WebGL visualization** with **algorithmic solving techniques**. It is designed to help users not only solve a cube, but also understand the process behind the solution through a clean, interactive interface.

The project models the cube as a **state-space graph** and uses informed search to compute an efficient path from the current scrambled state to the solved state. It also supports live rerouting when the cube state changes unexpectedly during the solving flow.

## Features

- **Interactive 3D cube rendering** using WebGL and Three.js
- **Smooth slice rotations** and realistic cube movement
- **Mouse/touch drag controls** with OrbitControls support
- **IDA* search-based solver** for state exploration
- **Layer-by-Layer solving strategy** for guided stepwise solving
- **Dynamic rerouting** when the cube state changes mid-solve
- **Search telemetry panel** for nodes expanded, depth, heuristic progress, and runtime
- **WCA scramble generator** for randomized cube states
- **Custom state editor** for manually setting cube colors
- **Academic defense / viva support** with graph-theory and DSA explanations

## Tech Stack

- **Frontend:** HTML5, JavaScript (ES6 modules)
- **3D Rendering:** Three.js
- **Styling:** Vanilla CSS, Tailwind CSS
- **Build Tool:** Vite
- **UI Extras:** Lucide Icons, Canvas Confetti
- **Algorithms:** Graph search, heuristics, IDA*, Layer-by-Layer logic

## How It Works

The cube is treated as a graph problem:

- **Vertices (V):** valid cube states
- **Edges (E):** legal moves between states
- **Goal:** find the shortest or near-optimal sequence of moves from scramble to solution

The solver combines heuristics with search to evaluate promising paths efficiently. Instead of simply giving the final answer, the interface also shows the reasoning process, making it useful for both demonstration and learning.

## Project Structure

```text
rubiks-cube-solver/
├── index.html
├── package.json
├── vite.config.js
├── README.md
├── src/
│   ├── main.js
│   ├── css/
│   │   └── style.css
│   ├── cube/
│   │   ├── CubeState.js
│   │   ├── CubeRenderer3D.js
│   │   └── Scramble.js
│   ├── solver/
│   │   ├── GraphSolver.js
│   │   ├── LayerByLayer.js
│   │   ├── Heuristics.js
│   │   └── DynamicRerouter.js
│   └── components/
│       ├── Dashboard.js
│       ├── GraphVisualizer.js
│       ├── HintOverlay.js
│       ├── StateEditor.js
│       └── DSAExplainModal.js
```

## Getting Started

### Prerequisites

Make sure you have:

- **Node.js 16+**
- **npm**

### Installation

```bash
git clone https://github.com/aadiur/Rubiks-cube-solver.git
cd Rubiks-cube-solver
npm install
npm run dev
```

Then open the local development URL shown in the terminal.

### Production Build

```bash
npm run build
```

## Screenshots / Demo

You can place your project screenshots here later, for example:

- solved cube view
- scramble view
- search telemetry panel
- custom state editor

## Why This Project Stands Out

This project is not just a cube solver. It is a combination of:

- **3D UI engineering**
- **graph-search algorithms**
- **heuristic optimization**
- **state-space reasoning**
- **interactive visualization**

That makes it a strong portfolio project for DSA, algorithms, and frontend engineering.

## Author

**Aadi**  
Computer Science & Engineering Undergraduate

## License

Distributed under the MIT License.
