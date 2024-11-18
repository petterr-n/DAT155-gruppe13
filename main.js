import * as THREE from 'three';
import { createScene } from './src/scene.js';
import { createCamera, initKeyControls, updateCamera } from './src/camera.js';
import { createTerrain } from './src/terrain.js';
import { addMouseEventListener, checkCameraCollision } from "./src/raycasting";
import { addBackgroundSound } from "./src/sound";
import { VRButton } from "./src/VRButton";
import { Vector3 } from "three";

// Create scene, camera, and renderer
const scene = createScene();
const camera = createCamera();

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
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
    user.position.set(200, 10, 250); // Set user group to start position for VR mode
});

// Menu actions
const modelSelect = document.getElementById('modelSelect');

// Add terrain
createTerrain(scene);

// Add background sound
addBackgroundSound(camera);

// Initialize keypresses to control the camera
initKeyControls();

// on-click event listener
addMouseEventListener(scene, camera, modelSelect);

// Function to handle VR movement
function VRMovement() {
    const session = renderer.xr.getSession();
    const speed = 0.2;
    if (session && session.inputSources[0]) {
        const gamepad = session.inputSources[0].gamepad;
        if (gamepad) {
            const x = gamepad.axes[2];
            const y = gamepad.axes[3];
            //*speed so that the position depends on player speed
            var movement = new Vector3(x * speed, 0, y * speed); // Positive z for forward movement

            // Apply camera's rotation to the movement vector to make it relative to the current orientation
            movement.applyQuaternion(camera.quaternion);

            // Same idea with speed here
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

// Render loop
function animate() {
    renderer.setAnimationLoop(() => {
        checkCameraCollision(scene, camera);

        // Get VR movement and apply it to the user group
        const movement = VRMovement();
        user.position.add(movement);

        updateCamera(camera);
        renderer.render(scene, camera);
    });
}

animate();
