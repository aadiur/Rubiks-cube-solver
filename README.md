[Uploading README (16).md…]()

<p align="center">
  <img src="assets/banner.svg" alt="Rubik's Cube Solver banner" width="100%"/>
</p>

<p align="center">
  <img alt="html" src="https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white">
  <img alt="css" src="https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white">
  <img alt="js" src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black">
  <img alt="status" src="https://img.shields.io/badge/status-completed-4c9a2a?style=flat-square">
  <img alt="license" src="https://img.shields.io/badge/license-MIT-blue?style=flat-square">
</p>

<h1 align="center">Rubik's Cube Solver</h1>
<p align="center"><i>An interactive, browser-based Rubik's Cube simulator and solver —<br/>
scramble, rotate, and solve using layer-by-layer or two-phase solving logic.</i></p>

<p align="center">
  <a href="https://aadiur.github.io/rubiks-cube-solver/"><b>Live Demo</b></a>
</p>

---

## Overview

This project simulates a Rubik's Cube in the browser and solves it using
algorithmic logic implemented in JavaScript. It pairs a clean, interactive UI
with real cube-state manipulation — face, slice, and whole-cube rotations —
and two different solving strategies: an intuitive **layer-by-layer** method
and a more advanced **two-phase** algorithm based on Herbert Kociemba's
approach.

## Features

- Interactive Rubik's Cube visualization in the browser
- Shuffle and reset controls
- Face rotations using standard cube notation
- Slice rotations (middle-layer turns) and whole-cube rotations
- **Layer-by-layer** solving — the classic, beginner-friendly method
- **Two-phase** solving — Kociemba-style, for faster/shorter solutions
- Modular JavaScript architecture, split cleanly by responsibility

## How it works

Cube logic is organized into focused modules rather than one large script:

| File | Responsibility |
|---|---|
| `cube/js/initial.js` | Initializes the cube's starting state |
| `cube/js/util.js` | Shared helpers — shuffle, reset, type utilities |
| `cube/js/lbl.js` | Layer-by-layer solving algorithm |
| `cube/js/two-phase.js` | Two-phase solving algorithm |

The project builds on two external references for cube simulation and
solving:
- **Cuber** — the underlying cube rendering/simulation engine
- **cube.js** — reference implementation of Herbert Kociemba's two-phase algorithm

## Project structure

```
├── cube
│   └── js
│       ├── lbl.js          # Layer-by-layer algorithm
│       ├── two-phase.js    # Two-phase algorithm
│       ├── util.js         # Shuffle, reset, and type helpers
│       └── initial.js      # Initial cube state setup
└── lib
    ├── cubejs              # Two-phase algorithm reference implementation
    └── cuber                # Rubik's Cube simulation/rendering engine
```

## Cube notation

**Face rotations**
| Notation | Meaning |
|---|---|
| `U` | Clockwise turn of the Up face |
| `u` | Counter-clockwise turn of the Up face |

*(the same capital/lowercase pattern applies to all six faces: `U D L R F B`)*

**Slice rotations**
| Notation | Meaning |
|---|---|
| `S` / `s` | Standing slice, clockwise / counter-clockwise |
| `M` / `m` | Middle slice, clockwise / counter-clockwise |
| `E` / `e` | Equator slice, clockwise / counter-clockwise |

**Whole-cube rotations**
| Notation | Meaning |
|---|---|
| `X` / `x` | Rotate the whole cube like an `R` / `r` turn |
| `Y` / `y` | Rotate the whole cube like a `U` / `u` turn |
| `Z` / `z` | Rotate the whole cube like an `F` / `f` turn |

## Getting started

```bash
git clone https://github.com/aadiur/Rubiks-cube-solver.git
cd Rubiks-cube-solver
```

Then either:
- Open `index.html` directly in your browser, **or**
- Serve it through a local server (recommended, avoids any browser file-access restrictions):
  ```bash
  npx serve .
  # or
  python3 -m http.server
  ```

## Roadmap

- [ ] 3D cube animation
- [ ] Move-by-move solution playback
- [ ] Better mobile UI
- [ ] Performance analysis / timing for each solving step
- [ ] Difficulty modes
- [ ] Step-by-step visualizer for the solving logic

## What this project demonstrates

| Concept | Where |
|---|---|
| State-based UI design | Cube rendering + rotation handling |
| Cube rotation logic (face, slice, whole-cube) | `cube/js/util.js` and related modules |
| Layer-by-layer algorithmic solving | `cube/js/lbl.js` |
| Two-phase algorithmic solving | `cube/js/two-phase.js` |
| Modular JavaScript architecture | Overall `cube/js/` structure |
| Browser-based interactivity | End-to-end UI |

## Contributing

Contributions are welcome — whether that's UI polish, animations, solving-logic
optimizations, or making the cube more interactive. Fork the repo and open a
pull request.

## Support

If this project was useful to you, consider starring the repository — it
helps visibility and keeps the project growing.

## License

MIT — see [LICENSE](LICENSE).

---

<p align="center"><sub>Built with curiosity, logic, and a love for puzzles &middot; by <a href="https://github.com/aadiur">Aadi U R</a></sub></p>
