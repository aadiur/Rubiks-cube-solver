<div align="center">

# 🧩 Rubik's Cube Solver

### A sleek, interactive Rubik's Cube solver built with HTML, CSS, and JavaScript

<p>
Solve, shuffle, and explore cube rotations with an elegant web-based cube simulator powered by layered solving logic and a two-phase algorithm.
</p>

<p>
  <a href="https://aadiur.github.io/rubiks-cube-solver/">
    <img src="https://img.shields.io/badge/Live%20Demo-Visit%20Project-blue?style=for-the-badge&logo=github" alt="Live Demo">
  </a>
  <img src="https://img.shields.io/badge/HTML-CSS-JavaScript-orange?style=for-the-badge" alt="Tech Stack">
  <img src="https://img.shields.io/badge/Status-Completed-success?style=for-the-badge" alt="Status">
</p>

<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Rubik%27s_cube.svg/512px-Rubik%27s_cube.svg.png" alt="Rubik's Cube" width="240" />

</div>

---

## ✨ Overview

**Rubik's Cube Solver** is an interactive browser-based project that simulates a Rubik’s Cube and solves it using algorithmic logic implemented in JavaScript. The project combines a clean UI with cube state manipulation, rotations, and solving strategies inspired by standard Rubik’s Cube methods.

It includes support for:

* cube simulation
* face, slice, and whole-cube rotations
* shuffle and reset actions
* layer-by-layer solving logic
* two-phase solving logic using the cube.js implementation referenced in the project

---

## 🚀 Features

* Interactive Rubik’s Cube visualization
* Shuffle and reset controls
* Face rotations with standard cube notation
* Slice and whole-cube rotations
* Layer-by-layer solving approach
* Two-phase solving approach
* Modular JavaScript structure
* Smooth browser-based experience

---

## 🧠 How It Works

The project organizes cube logic into separate JavaScript files, including:

* `lbl.js` for the layer-by-layer algorithm
* `two-phase.js` for the two-phase algorithm
* `util.js` for helper functions like shuffle and reset
* `initial.js` for initializing the cube state

The repository also uses a cube simulator from **Cuber** and references **cube.js** for Herbert Kociemba’s two-phase algorithm.

---

## 🧱 Project Structure

```bash
├── cube
│   └── js
│       ├── lbl.js          # Layer by layer algorithm
│       ├── two-phase.js    # Two-phase algorithm
│       ├── util.js         # Type, shuffle, and reset helpers
│       └── initial.js      # Initial cube setup
└── lib
    ├── cubejs              # Two-phase algorithm reference
    └── cuber               # Rubik's cube simulator
```

---

## 🛠️ Tech Stack

| Technology | Use                           |
| ---------- | ----------------------------- |
| HTML       | Page structure                |
| CSS        | Styling and layout            |
| JavaScript | Core logic                    |
| cube.js    | Two-phase algorithm reference |
| Cuber      | Cube simulation engine        |

---

## 🎮 Cube Notation

### Face Rotations

* `U` → clockwise Up face rotation
* `u` → counterclockwise Up face rotation

### Slice Rotations

* `S / s` → Standing slice
* `M / m` → Middle slice
* `E / e` → Equator slice

### Whole Cube Rotations

* `X / x` → rotate the cube like `R / r`
* `Y / y` → rotate the cube like `U / u`
* `Z / z` → rotate the cube like `F / f`

---

## 📸 Preview

> Add your own screenshot here for the strongest README:

```md
<img src="./assets/demo.png" alt="Project Screenshot" />
```

You can also add a GIF like this:

```md
<img src="./assets/demo.gif" alt="Rubik's Cube Solver Demo" />
```

---

## ▶️ Run Locally

```bash
git clone https://github.com/aadiur/Rubiks-cube-solver.git
cd Rubiks-cube-solver
```

Then open `index.html` in your browser, or run it through your preferred local server.

---

## 🔮 Future Improvements

* 3D cube animation
* Move-by-move solution playback
* Better mobile UI
* Performance analysis for solving steps
* Difficulty modes
* Step visualizer for solving logic

---

## 💡 What I Learned

* State-based UI design
* Algorithmic problem solving
* Cube rotation logic
* Modular JavaScript architecture
* Browser-based interactivity
* Solving strategy implementation

---

## 🤝 Contributing

Contributions are welcome.

If you want to improve the UI, add animations, optimize the solving logic, or make the cube more interactive, feel free to fork the repository and submit a pull request.

---

## ⭐ Support

If you found this project useful, consider starring the repository. It helps the project grow and makes the work more visible.

---

<div align="center">

### Built with curiosity, logic, and a love for puzzles.

**Aadi U R**

[GitHub](https://github.com/aadiur)

</div>
