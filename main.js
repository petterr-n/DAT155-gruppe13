import * as THREE from 'three';
import { createScene } from './src/scene.js';
import { createCamera } from './src/camera.js';
import { createTerrain } from './src/terrain.js';

// Opprett scene, kamera og renderer
const scene = createScene();
const camera = createCamera();

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Legg til terreng
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

// Animasjonsløkke
function animate() {
    requestAnimationFrame(animate);
    updateCamera();  // Oppdater kameraet
    renderer.render(scene, camera);
}

animate();