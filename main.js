import * as THREE from 'three';
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

// Variabler for kameraets bevegelse
const movementSpeed = 0.5;
const rotationSpeed = 0.05;
const keys = {};

// Legg til event listeners for piltaster
window.addEventListener('keydown', (event) => {
    keys[event.key] = true;
});

window.addEventListener('keyup', (event) => {
    keys[event.key] = false;
});

// Funksjon for å oppdatere kameraets posisjon basert på tastetrykk
function updateCamera() {
    const direction = new THREE.Vector3();
    camera.getWorldDirection(direction);

    if (keys['ArrowUp'] || keys['w']) {
        camera.position.add(direction.clone().multiplyScalar(movementSpeed));
    }
    if(keys['ArrowDown'] || keys['s']) {
        camera.position.add(direction.clone().multiplyScalar(-movementSpeed));
    }
    if (keys['ArrowLeft'] || keys['a']) {
        camera.rotation.y -= rotationSpeed;
    }
    if (keys['ArrowRight'] || keys['d']) {
        camera.rotation.y += rotationSpeed;
    }
}

// Menu actions
const modelSelect = document.getElementById('modelSelect');
const placeModelBtn = document.getElementById('placeModelButton');

addMouseEventListener(scene, camera, modelSelect);

// Render loop
function animate() {
    requestAnimationFrame(animate);
    checkCameraCollision(scene, camera);
    updateCamera();
    renderer.render(scene, camera);
}

animate();
