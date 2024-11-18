import * as THREE from 'three';
import { createScene } from './src/scene.js';
import { createCamera, initKeyControls, updateCamera } from './src/camera.js';
import { createTerrain } from './src/terrain.js';
import {loadModel, updateAnimations} from './src/modelLoader.js';
import {createGrassField, updateGrassVisibility} from "./src/renderingModels";
import { addMouseEventListener, checkCameraCollision } from "./src/raycasting";
import MouseLookController from "./src/MouseLookController";
import { addBackgroundSound } from "./src/sound";
import { VRButton } from "./src/VRButton";
import { Vector3 } from "three";


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

// Enable VR support
renderer.xr.enabled = true;

document.body.appendChild(VRButton.createButton(renderer));

// Create a user group to manage camera movement (camera rigging)
const user = new THREE.Group();
user.add(camera);
scene.add(user);

// Add event listener for VR session start to set the initial camera position
renderer.xr.addEventListener('sessionstart', () => {
    user.position.set(100, 10, 115); // Set user group to start position for VR mode
});

// Menu actions
const modelSelect = document.getElementById('modelSelect');

// Add terrain
const terrain = await createTerrain(scene);
console.log(terrain);

//await createGrassField(scene, camera, terrain);

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

// Raycaster for checking terrain height
const raycaster = new THREE.Raycaster();
const downDirection = new THREE.Vector3(0, -1, 0);
const cameraMinHeightAboveTerrain = 2;

// Function to handle VR movement
function VRMovement() {
    const session = renderer.xr.getSession();
    const speed = 0.5;
    if (session && session.inputSources[0]) {
        const gamepad = session.inputSources[0].gamepad;
        if (gamepad) {
            const x = gamepad.axes[2];
            const y = gamepad.axes[3];
            const movement = new Vector3(x * speed, 0, y * speed); // Positive z for forward movement

            // Apply camera's rotation to the movement vector to make it relative to the current orientation
            movement.applyQuaternion(camera.quaternion);

            // Handle vertical movement
            if (gamepad.buttons[4].pressed) {
                movement.y += 1 * speed;
            } else if (gamepad.buttons[5].pressed) {
                movement.y -= 1 * speed;
            }
            return movement;
        }
    }
    return new Vector3();
}

// Function to keep user above the terrain
// function updateUserHeightAboveTerrain() {
//     const terrain = scene.getObjectByName('terrain');
//     if (!terrain) {
//         console.warn("Terrain not found in the scene for camera collision detection.");
//         return;
//     }
//
//     raycaster.set(user.position, downDirection);
//     const intersects = raycaster.intersectObject(terrain);
//
//     if (intersects.length > 0) {
//         const terrainHeight = intersects[0].point.y;
//         user.position.y = terrainHeight + cameraMinHeightAboveTerrain;
//     }
// }

// Render loop
function animate() {
    renderer.setAnimationLoop(() => {
        let delta = clock.getDelta();
        updateAnimations(delta);
        checkCameraCollision(scene, camera);

        // Handle VR movement
        const movement = VRMovement();
        user.position.add(movement);

        // Update user height to stay above terrain
        //updateUserHeightAboveTerrain();
       // updateGrassVisibility(camera, scene);

        // Update camera
        updateCamera(camera);
        renderer.render(scene, camera);
    });
}

animate();
