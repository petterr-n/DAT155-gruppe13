import * as THREE from 'three';
import { createScene } from './src/scene.js';
import {createCamera, initKeyControls, updateCamera} from './src/camera.js';
import { createTerrain } from './src/terrain.js';
import { loadModel } from './src/modelLoader.js';
import {addMouseEventListener, checkCameraCollision} from "./src/raycasting";
import MouseLookController from "./src/MouseLookController";


// Create scene, camera, and renderer
const scene = createScene();
const camera = createCamera();
const mouseLook = new MouseLookController(camera);

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


// Pointer Lock setup
document.body.addEventListener('click', () => {
    renderer.domElement.requestPointerLock();
});

// Handle pointer lock state change
document.addEventListener('pointerlockchange', () => {
    if (document.pointerLockElement === renderer.domElement) {
        console.log("Pointer locked!");
    } else {
        console.log("Pointer unlocked!");
    }
});

// Mouse movement listener
document.addEventListener('mousemove', (event) => {
    if (document.pointerLockElement === renderer.domElement) {
        const sensitivity = 0.002; // Adjust sensitivity as needed
        const pitchDelta = -event.movementY * sensitivity; // Up/down
        const yawDelta = -event.movementX * sensitivity;   // Left/right
        mouseLook.update(pitchDelta, yawDelta);            // Update camera
    }
});

// Render loop
function animate() {
    requestAnimationFrame(animate);
    checkCameraCollision(scene, camera);
    updateCamera(camera);
    renderer.render(scene, camera);
}

animate();
