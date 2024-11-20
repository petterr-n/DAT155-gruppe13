import * as THREE from 'three';
import { createScene } from './src/rendering/Scene.js';
import { createCamera, initKeyControls, updateCamera } from './src/utils/camera.js';
import { createTerrain } from './src/rendering/Terrain.js';
import { loadStartingAssets, updateAnimations } from './src/rendering/ModelLoader.js';
import { addMouseEventListener, checkCameraCollision } from "./src/rendering/Raycasting";
import MouseLookController from "./src/utils/MouseLookController";
import { addBackgroundSound } from "./src/sound";
import { createWater } from "./src/environment/water";
import { createRain } from "./src/environment/rain";
import { createClouds } from "./src/environment/cloud";
import { enableVR, VRMovement, updateUserHeightAboveTerrain } from './src/VR/vrHandler.js';

const scene = createScene();
const camera = createCamera();
const clock = new THREE.Clock();
const mouseLook = new MouseLookController(camera);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// Create a user group to manage vr
const user = new THREE.Group();
user.add(camera);
scene.add(user);

enableVR(renderer, user, camera);

const modelSelect = document.getElementById('modelSelect');

// Add terrain
const terrain = await createTerrain(scene);
console.log(terrain);
const water = await createWater(scene, terrain);
const updateRain = createRain(scene, terrain);
createClouds(scene, terrain);
loadStartingAssets(scene);

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
        const sensitivity = 0.002;
        const pitchDelta = -event.movementY * sensitivity;
        const yawDelta = -event.movementX * sensitivity;
        mouseLook.update(pitchDelta, yawDelta);
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

        // Water physics
        if (water.material.uniforms.time) {
            water.material.uniforms.time.value += 0.0005;
        }
        updateRain();

        // Update camera
        updateCamera(camera);
        renderer.render(scene, camera);
    });
}

animate();
