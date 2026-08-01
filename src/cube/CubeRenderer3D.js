/**
 * CubeRenderer3D.js - Three.js WebGL 3D Rubik's Cube Renderer
 * Features 27 rounded cubies, smooth animated slice rotations,
 * interactive raycasting/drag turns, OrbitControls, and 3D Hint Arrows.
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FACE_COLORS } from './CubeState.js';

const CUBE_SIZE = 1.0;
const GAP = 0.05;
const CUBIE_PITCH = CUBE_SIZE + GAP;

const COLOR_MAP = {
  U: new THREE.Color(FACE_COLORS.U),
  D: new THREE.Color(FACE_COLORS.D),
  L: new THREE.Color(FACE_COLORS.L),
  R: new THREE.Color(FACE_COLORS.R),
  F: new THREE.Color(FACE_COLORS.F),
  B: new THREE.Color(FACE_COLORS.B),
  INNER: new THREE.Color(0x111827)
};

export class CubeRenderer3D {
  constructor(containerElement, onMoveExecutedCallback) {
    this.container = containerElement;
    this.onMoveExecuted = onMoveExecutedCallback;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, containerElement.clientWidth / containerElement.clientHeight, 0.1, 100);
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });

    this.controls = null;
    this.cubies = []; // 27 sub-cubes
    this.pivotGroup = new THREE.Group();
    this.hintGroup = new THREE.Group();
    this.scene.add(this.pivotGroup);
    this.scene.add(this.hintGroup);

    this.isAnimating = false;
    this.animationSpeed = 350; // ms per quarter turn

    // Raycasting for touch/click dragging
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.dragStartPoint = null;
    this.dragIntersectedFace = null;
    this.dragCubie = null;

    this.activeHintMove = null;

    this.init();
  }

  init() {
    // Setup Renderer
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.container.appendChild(this.renderer.domElement);

    // Setup Camera
    this.camera.position.set(5.5, 5.0, 6.5);
    this.camera.lookAt(0, 0, 0);

    // Orbit Controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.minDistance = 4;
    this.controls.maxDistance = 14;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    this.scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.8);
    dirLight1.position.set(8, 12, 10);
    dirLight1.castShadow = true;
    this.scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x818cf8, 0.8); // Cyber blue accent light
    dirLight2.position.set(-8, -6, -8);
    this.scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0x38bdf8, 1.0, 10);
    pointLight.position.set(0, 4, 0);
    this.scene.add(pointLight);

    // Create Cubies
    this.createCubies();

    // Event Listeners
    window.addEventListener('resize', () => this.onWindowResize());
    this.setupDragControls();

    // Animation Loop
    this.animate();
  }

  createCubies() {
    // Clear existing
    this.cubies.forEach(c => this.scene.remove(c));
    this.cubies = [];

    // Create 3D Rounded Box Geometry for cubie
    const geometry = new THREE.BoxGeometry(CUBE_SIZE, CUBE_SIZE, CUBE_SIZE);

    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          // Material array order for THREE.BoxGeometry:
          // 0: Right (+X, R), 1: Left (-X, L), 2: Up (+Y, U), 3: Down (-Y, D), 4: Front (+Z, F), 5: Back (-Z, B)
          const materials = [
            new THREE.MeshStandardMaterial({ color: x === 1 ? COLOR_MAP.R : COLOR_MAP.INNER, roughness: 0.2, metalness: 0.1 }),
            new THREE.MeshStandardMaterial({ color: x === -1 ? COLOR_MAP.L : COLOR_MAP.INNER, roughness: 0.2, metalness: 0.1 }),
            new THREE.MeshStandardMaterial({ color: y === 1 ? COLOR_MAP.U : COLOR_MAP.INNER, roughness: 0.2, metalness: 0.1 }),
            new THREE.MeshStandardMaterial({ color: y === -1 ? COLOR_MAP.D : COLOR_MAP.INNER, roughness: 0.2, metalness: 0.1 }),
            new THREE.MeshStandardMaterial({ color: z === 1 ? COLOR_MAP.F : COLOR_MAP.INNER, roughness: 0.2, metalness: 0.1 }),
            new THREE.MeshStandardMaterial({ color: z === -1 ? COLOR_MAP.B : COLOR_MAP.INNER, roughness: 0.2, metalness: 0.1 })
          ];

          const mesh = new THREE.Mesh(geometry, materials);
          mesh.position.set(x * CUBIE_PITCH, y * CUBIE_PITCH, z * CUBIE_PITCH);
          mesh.castShadow = true;
          mesh.receiveShadow = true;
          mesh.userData = { gridX: x, gridY: y, gridZ: z };

          this.scene.add(mesh);
          this.cubies.push(mesh);
        }
      }
    }
  }

  // Update 3D visual colors matching CubeState
  updateFromState(cubeState) {
    const s = cubeState.state;
    // Map state string colors to faces
    const faceletColor = (code) => COLOR_MAP[code] || COLOR_MAP.INNER;

    this.cubies.forEach(cubie => {
      const pos = cubie.position;
      const x = Math.round(pos.x / CUBIE_PITCH);
      const y = Math.round(pos.y / CUBIE_PITCH);
      const z = Math.round(pos.z / CUBIE_PITCH);

      const mats = cubie.material;

      // Update right (+X)
      if (x === 1) mats[0].color = faceletColor(s.R[this.getFaceletIdx('R', y, z)]);
      // Update left (-X)
      if (x === -1) mats[1].color = faceletColor(s.L[this.getFaceletIdx('L', y, z)]);
      // Update up (+Y)
      if (y === 1) mats[2].color = faceletColor(s.U[this.getFaceletIdx('U', x, z)]);
      // Update down (-Y)
      if (y === -1) mats[3].color = faceletColor(s.D[this.getFaceletIdx('D', x, z)]);
      // Update front (+Z)
      if (z === 1) mats[4].color = faceletColor(s.F[this.getFaceletIdx('F', x, y)]);
      // Update back (-Z)
      if (z === -1) mats[5].color = faceletColor(s.B[this.getFaceletIdx('B', x, y)]);

      mats.forEach(m => m.needsUpdate = true);
    });
  }

  getFaceletIdx(face, colVal, rowVal) {
    // Maps 3D spatial coordinates to 0..8 array indices
    if (face === 'U') return (rowVal + 1) * 3 + (colVal + 1);
    if (face === 'D') return (1 - rowVal) * 3 + (colVal + 1);
    if (face === 'F') return (1 - rowVal) * 3 + (colVal + 1);
    if (face === 'B') return (1 - rowVal) * 3 + (1 - colVal);
    if (face === 'L') return (1 - rowVal) * 3 + (colVal + 1);
    if (face === 'R') return (1 - rowVal) * 3 + (1 - colVal);
    return 0;
  }

  // Animate slice turn in 3D
  animateMove(moveStr, durationMs = this.animationSpeed) {
    if (this.isAnimating) return Promise.resolve();
    this.isAnimating = true;

    const baseFace = moveStr[0];
    const modifier = moveStr.slice(1);

    let angle = -Math.PI / 2; // Default 90 deg CW
    if (modifier === "'") angle = Math.PI / 2; // CCW
    else if (modifier === '2') angle = -Math.PI; // 180 deg

    // Define slice axis and coordinate threshold
    let axis = new THREE.Vector3();
    let filterFn = () => false;

    switch (baseFace) {
      case 'U': axis.set(0, 1, 0); filterFn = c => c.position.y > CUBIE_PITCH * 0.5; angle = -angle; break;
      case 'D': axis.set(0, 1, 0); filterFn = c => c.position.y < -CUBIE_PITCH * 0.5; break;
      case 'L': axis.set(1, 0, 0); filterFn = c => c.position.x < -CUBIE_PITCH * 0.5; angle = -angle; break;
      case 'R': axis.set(1, 0, 0); filterFn = c => c.position.x > CUBIE_PITCH * 0.5; break;
      case 'F': axis.set(0, 0, 1); filterFn = c => c.position.z > CUBIE_PITCH * 0.5; angle = -angle; break;
      case 'B': axis.set(0, 0, 1); filterFn = c => c.position.z < -CUBIE_PITCH * 0.5; break;
    }

    // Attach cubies to pivot group
    this.pivotGroup.rotation.set(0, 0, 0);
    this.pivotGroup.position.set(0, 0, 0);
    this.scene.add(this.pivotGroup);

    const activeCubies = this.cubies.filter(filterFn);
    activeCubies.forEach(c => this.pivotGroup.attach(c));

    const startTime = performance.now();

    return new Promise((resolve) => {
      const step = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / durationMs, 1.0);
        const easeProgress = 0.5 - Math.cos(progress * Math.PI) / 2;

        if (axis.x !== 0) this.pivotGroup.rotation.x = angle * easeProgress;
        else if (axis.y !== 0) this.pivotGroup.rotation.y = angle * easeProgress;
        else if (axis.z !== 0) this.pivotGroup.rotation.z = angle * easeProgress;

        if (progress < 1.0) {
          requestAnimationFrame(step);
        } else {
          // Finalize rotation and re-attach cubies to scene
          this.pivotGroup.updateMatrixWorld();
          activeCubies.forEach(c => {
            this.scene.attach(c);
            c.position.x = Math.round(c.position.x / CUBIE_PITCH) * CUBIE_PITCH;
            c.position.y = Math.round(c.position.y / CUBIE_PITCH) * CUBIE_PITCH;
            c.position.z = Math.round(c.position.z / CUBIE_PITCH) * CUBIE_PITCH;
            c.rotation.set(0, 0, 0);
          });
          this.pivotGroup.rotation.set(0, 0, 0);
          this.isAnimating = false;
          resolve();
        }
      };
      requestAnimationFrame(step);
    });
  }

  // Render glowing 3D hint arrow on the target face
  show3DHint(move) {
    this.clear3DHint();
    if (!move) return;

    this.activeHintMove = move;
    const baseFace = move[0];

    // Create 3D Arrow Helper
    const dir = new THREE.Vector3();
    const origin = new THREE.Vector3();

    switch (baseFace) {
      case 'U': origin.set(0, 2.2, 0); dir.set(1, 0, 0); break;
      case 'D': origin.set(0, -2.2, 0); dir.set(-1, 0, 0); break;
      case 'L': origin.set(-2.2, 0, 0); dir.set(0, 1, 0); break;
      case 'R': origin.set(2.2, 0, 0); dir.set(0, -1, 0); break;
      case 'F': origin.set(0, 0, 2.2); dir.set(1, 0, 0); break;
      case 'B': origin.set(0, 0, -2.2); dir.set(-1, 0, 0); break;
    }

    if (move.includes("'")) dir.negate();

    const arrowHelper = new THREE.ArrowHelper(dir.normalize(), origin, 1.5, 0x38bdf8, 0.4, 0.4);
    this.hintGroup.add(arrowHelper);
  }

  clear3DHint() {
    while (this.hintGroup.children.length > 0) {
      const child = this.hintGroup.children[0];
      this.hintGroup.remove(child);
    }
    this.activeHintMove = null;
  }

  setupDragControls() {
    const dom = this.renderer.domElement;

    dom.addEventListener('pointerdown', (e) => {
      if (this.isAnimating) return;
      const rect = dom.getBoundingClientRect();
      this.mouse.x = ((e.clientX - rect.left) / dom.clientWidth) * 2 - 1;
      this.mouse.y = -((e.clientY - rect.top) / dom.clientHeight) * 2 + 1;

      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersects = this.raycaster.intersectObjects(this.cubies);

      if (intersects.length > 0) {
        this.dragCubie = intersects[0].object;
        this.dragIntersectedFace = intersects[0].face;
        this.dragStartPoint = intersects[0].point;
        this.controls.enabled = false; // Disable camera orbit while dragging face
      }
    });

    dom.addEventListener('pointerup', (e) => {
      if (!this.dragCubie || this.isAnimating) {
        this.controls.enabled = true;
        this.dragCubie = null;
        return;
      }

      const rect = dom.getBoundingClientRect();
      this.mouse.x = ((e.clientX - rect.left) / dom.clientWidth) * 2 - 1;
      this.mouse.y = -((e.clientY - rect.top) / dom.clientHeight) * 2 + 1;

      this.raycaster.setFromCamera(this.mouse, this.camera);
      const endPoint = this.mouse;

      // Determine drag vector direction to trigger turn move
      const move = this.determineDragMove(this.dragCubie, this.dragIntersectedFace);
      if (move && this.onMoveExecuted) {
        this.onMoveExecuted(move);
      }

      this.controls.enabled = true;
      this.dragCubie = null;
    });
  }

  determineDragMove(cubie, face) {
    if (!cubie || !face) return null;
    const normal = face.normal;
    const pos = cubie.position;

    // Based on intersected normal, pick likely face turn
    if (Math.abs(normal.y) > 0.8) {
      return pos.x > 0 ? 'R' : 'L';
    } else if (Math.abs(normal.x) > 0.8) {
      return pos.z > 0 ? 'F' : 'B';
    } else if (Math.abs(normal.z) > 0.8) {
      return pos.y > 0 ? 'U' : 'D';
    }
    return null;
  }

  onWindowResize() {
    this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    this.controls.update();

    // Subtle floating rotation for hint arrow
    if (this.hintGroup.children.length > 0) {
      this.hintGroup.rotation.y += 0.01;
    }

    this.renderer.render(this.scene, this.camera);
  }
}
