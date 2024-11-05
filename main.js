import * as THREE from 'three';
import { createTerrain } from './src/Terrain.js';

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x5a5a5a, 0.003);

const terrain = createTerrain();
scene.add(terrain);

// Kamera-oppsett
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 5000);
camera.position.set(0, 100, 200);

// Lys
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(50, 100, 50).normalize();
scene.add(ambientLight, directionalLight);

// Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Variabler for kamerabevegelse og rotasjon
const keys = {};
let rotationX = 0; // Roter rundt Y-aksen (horisontalt)
let rotationY = 0; // Roter rundt X-aksen (vertikalt)
let isMouseDown = false;

window.addEventListener('keydown', (event) => { keys[event.key] = true; });
window.addEventListener('keyup', (event) => { keys[event.key] = false; });

// Lytt etter musebevegelse for rotasjon
window.addEventListener('mousedown', () => { isMouseDown = true; });
window.addEventListener('mouseup', () => { isMouseDown = false; });
window.addEventListener('mousemove', (event) => {
    if (isMouseDown) {
        rotationX -= event.movementX * 0.002; // Juster rotasjonshastigheten
        rotationY -= event.movementY * 0.002;
        rotationY = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, rotationY)); // Begrens vertikal rotasjon
    }
});

function updateCameraPosition() {
    const speed = 2;
    if (keys['s']) {
        camera.position.x -= Math.sin(rotationX) * speed;
        camera.position.z -= Math.cos(rotationX) * speed;
    }
    if (keys['w']) {
        camera.position.x += Math.sin(rotationX) * speed;
        camera.position.z += Math.cos(rotationX) * speed;
    }
    if (keys['d']) {
        camera.position.x -= Math.cos(rotationX) * speed;
        camera.position.z += Math.sin(rotationX) * speed;
    }
    if (keys['a']) {
        camera.position.x += Math.cos(rotationX) * speed;
        camera.position.z -= Math.sin(rotationX) * speed;
    }
}

// Oppdater kameraretning basert på rotasjonen
function updateCameraRotation() {
    const targetX = camera.position.x + Math.sin(rotationX);
    const targetY = camera.position.y + Math.sin(rotationY);
    const targetZ = camera.position.z + Math.cos(rotationX);
    camera.lookAt(targetX, targetY, targetZ);
}

// Animasjonsloop
function animate() {
    requestAnimationFrame(animate);
    updateCameraPosition();
    updateCameraRotation();
    renderer.render(scene, camera);
}
animate();
