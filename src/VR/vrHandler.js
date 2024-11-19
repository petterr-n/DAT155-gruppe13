// File: vrHandler.js
import * as THREE from 'three';
import { Vector3 } from 'three';
import { VRButton } from "./VRButton";

export function enableVR(renderer, user, camera) {
    // Enable VR support
    renderer.xr.enabled = true;
    document.body.appendChild(VRButton.createButton(renderer));

    // Add event listener for VR session start to set the initial camera position
    renderer.xr.addEventListener('sessionstart', () => {
        user.position.set(-24, 5, -42); // Set user group to start position for VR mode
    });
}

export function VRMovement(renderer, camera) {
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

export function updateUserHeightAboveTerrain(scene, user) {
    const raycaster = new THREE.Raycaster();
    const downDirection = new THREE.Vector3(0, -1, 0);
    const cameraMinHeightAboveTerrain = 2;

    const terrain = scene.getObjectByName('terrain');
    if (!terrain) {
        console.warn("Terrain not found in the scene for camera collision detection.");
        return;
    }

    raycaster.set(user.position, downDirection);
    const intersects = raycaster.intersectObject(terrain);

    if (intersects.length > 0) {
        const terrainHeight = intersects[0].point.y;
        user.position.y = terrainHeight + cameraMinHeightAboveTerrain;
    }
}
