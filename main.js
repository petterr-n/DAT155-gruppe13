import * as THREE from 'three';
import { createScene } from './src/scene.js';
import {createCamera, initKeyControls, updateCamera} from './src/camera.js';
import { createTerrain } from './src/terrain.js';
import { loadModel } from './src/modelLoader.js';
import {addMouseEventListener, checkCameraCollision} from "./src/raycasting";

// Create scene, camera, and renderer
const scene = createScene();
const camera = createCamera();

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Menu actions
const modelSelect = document.getElementById('modelSelect');

// Add terrain
createTerrain(scene);

// Initialize keypresses to control the camera
initKeyControls();

// on-click event listener
addMouseEventListener(scene, camera, modelSelect);

// Render loop
function animate() {
    requestAnimationFrame(animate);
    checkCameraCollision(scene, camera);
    updateCamera(camera);
    renderer.render(scene, camera);
}

animate();
