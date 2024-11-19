import * as THREE from 'three';
import { createScene } from './src/scene.js';
import { createCamera, initKeyControls, updateCamera } from './src/camera.js';
import { createTerrain } from './src/terrain.js';
import { loadModel, loadStartingAssets, updateAnimations } from './src/modelLoader.js';
import { createGrassField, updateGrassVisibility } from "./src/renderingModels";
import { addMouseEventListener, checkCameraCollision } from "./src/raycasting";
import MouseLookController from "./src/MouseLookController";
import { addBackgroundSound } from "./src/sound";
import { createWater } from "./src/environment/water";
import { createRain } from "./src/environment/rain";
import { createClouds } from "./src/environment/cloud";
import { enableVR, VRMovement, updateUserHeightAboveTerrain } from './src/VR/vrHandler.js';

// Create scene, camera, and renderer
const scene = createScene();
const camera = createCamera();
const clock = new THREE.Clock();
const mouseLook = new MouseLookController(camera);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// Create a user group to manage camera movement (camera rigging)
const user = new THREE.Group();
user.add(camera);
scene.add(user);

// Enable VR
enableVR(renderer, user, camera);

// Menu actions
const modelSelect = document.getElementById('modelSelect');

// Add terrain
const terrain = await createTerrain(scene);
console.log(terrain);
const water = await createWater(scene, terrain);
const updateRain = createRain(scene, terrain);
createClouds(scene, terrain);
loadStartingAssets(scene);

// Optional: Set the renderer's clear color to black as well
renderer.setClearColor(0x000000, 1);

// Add background sound
addBackgroundSound(camera);

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
    renderer.setAnimationLoop(() => {
        let delta = clock.getDelta();
        updateAnimations(delta);
        checkCameraCollision(scene, camera);

        // Handle VR movement
        const movement = VRMovement(renderer, camera);
        user.position.add(movement);

        // Update user height to stay above terrain
        updateUserHeightAboveTerrain(scene, user);
        // updateGrassVisibility(camera, scene);

        // Water physics
        if (water.material.uniforms.time) {
            water.material.uniforms.time.value += 0.001; // Adjust speed of the water movement
        }
        updateRain();

        // Update camera
        updateCamera(camera);
        renderer.render(scene, camera);
    });
}

animate();
