import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { createScene } from './src/scene.js';
import { createCamera } from './src/camera.js';
import { createTerrain } from './src/terrain.js';
import { loadModel } from './src/modelLoader.js';
import {addMouseEventListener, checkCameraCollision} from "./src/raycasting";

// Create scene, camera, and renderer
const scene = createScene();
const camera = createCamera();

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add terrain
createTerrain(scene);

// Add OrbitControls for navigation
const controls = new OrbitControls(camera, renderer.domElement);

// Menu actions
const modelSelect = document.getElementById('modelSelect');
const placeModelBtn = document.getElementById('placeModelButton');

addMouseEventListener(scene, camera, modelSelect);

// Render loop
function animate() {
    requestAnimationFrame(animate);
    checkCameraCollision(scene, camera);
    controls.update();
    renderer.render(scene, camera);
}

animate();
