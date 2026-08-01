# 🧊 3D Rubik's Cube Solver & Dynamic Rerouting Engine

> **CSE Undergraduate Major Project**  
> Developed by **[Aadi](https://github.com/aadiur)**  
> An interactive WebGL 3D Rubik's Cube solver powered by Graph Theory, Iterative Deepening A* (IDA*) Search, Layer-by-Layer state heuristics, and continuous "Google Maps style" live route recalculation.

---

## 🌟 Key Project Highlights

- **Interactive 3D WebGL Cube (`Three.js`)**: 27 individually rendered rounded sub-cubes with realistic materials, smooth animated slice rotations, OrbitControls, direct mouse/touch drag controls, and glowing 3D hint arrows.
- **Dynamic "Google Maps Style" Rerouting Engine**: Continuous state tracking. If the user makes an unexpected or non-optimal move during guidance, the engine instantly recalculates the shortest path from the new state graph node and updates the turn-by-turn route.
- **Graph Search & DSA Engine**: Multi-algorithm solver utilizing **IDA* (Iterative Deepening A*)** and **Layer-by-Layer (LBL)** search heuristics with search tree telemetry (nodes expanded, depth $g(n)$, heuristic progress $h(n)$, execution time).
- **Academic Presentation / Defense Modal**: Integrated CSE Viva guide covering State Space Graph topology ($4.33 \times 10^{19}$ nodes), Branching Factor ($b=18$), God's Number ($20$), and Heuristic Admissibility.
- **WCA Scrambler & Custom State Editor**: Random WCA scramble generator and 2D unfolded net color-picker for real physical cube solving.

---

## 🧠 Graph Theory & DSA Fundamentals

```
State Space Graph Topology: G = (V, E)
│
├── Nodes (V)  : ~4.33 × 10¹⁹ valid permutations
├── Edges (E)  : 18 branching moves per node (U, D, L, R, F, B ±', 2)
└── Heuristic  : f(n) = g(n) + h(n)  [IDA* Search]
```

---

## 🛠️ Tech Stack & Dependencies

- **Core**: HTML5, JavaScript (ES6+ Modules), Three.js
- **Styling**: Vanilla CSS, Tailwind CSS (Glassmorphism design system)
- **Bundler & Tooling**: Vite
- **Effects & Icons**: Canvas-Confetti, Lucide Icons

---

## 🚀 Quick Start Guide

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (v16+ recommended).

### Installation & Local Run

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/rubiks-cube-solver.git
   cd rubiks-cube-solver
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

4. **Build Production Bundle**:
   ```bash
   npm run build
   ```

---

## 💻 Project Structure

```
rubiks-cube-solver/
├── index.html                  # Main WebGL Application Interface
├── package.json                # Dependencies & build scripts
├── vite.config.js              # Vite configuration
├── README.md                   # Project documentation
├── src/
│   ├── main.js                 # Application Orchestrator
│   ├── css/
│   │   └── style.css           # Glassmorphism cyber-dark design system
│   ├── cube/
│   │   ├── CubeState.js        # Permutation math & state representation
│   │   ├── CubeRenderer3D.js   # Three.js 3D WebGL renderer & slice animations
│   │   └── Scramble.js         # WCA standard move scramble generator
│   ├── solver/
│   │   ├── GraphSolver.js      # Core IDA* & multi-algorithm graph solver
│   │   ├── LayerByLayer.js     # Deterministic 7-step LBL solver engine
│   │   ├── Heuristics.js       # Pattern database & h(n) estimation functions
│   │   └── DynamicRerouter.js  # Live state path calculator ("Google Maps rerouting")
│   └── components/
│       ├── Dashboard.js        # Move history & control panel UI
│       ├── GraphVisualizer.js  # Real-time search tree telemetry panel
│       ├── HintOverlay.js      # Turn navigation & reroute toast banner
│       ├── StateEditor.js      # 2D unfolded net state color picker
│       └── DSAExplainModal.js  # CSE major project academic defense guide
```

---

## 👤 Author & Maintainer

**Aadi**
- Computer Science & Engineering Undergraduate
- GitHub: [@aadiur](https://github.com/aadiur)
- Project Repository: [https://github.com/aadiur/Rubiks-cube-solver](https://github.com/aadiur/Rubiks-cube-solver)

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more details.
