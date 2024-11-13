import { loadModel } from './modelLoader.js'; // Import model loader
import * as THREE from 'three';

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const downDirection = new THREE.Vector3(0, -1, 0); // Direction for downward raycasting

// Minimum height above terrain for the camera
const cameraMinHeightAboveTerrain = 2;

// Function to handle model placement on mouse click
export function onMouseClick(event, scene, camera, modelSelect) {
    // Normalize mouse position (-1 to 1)
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(scene.getObjectByName('terrain'));

    if (intersects.length > 0) {
        const intersection = intersects[0];
        const point = intersection.point;

        const x = point.x;
        const z = point.z;
        const selectedModel = modelSelect.value;

        loadModel(selectedModel, scene, x, z);
    }
}

// Function to add mouse click event listener
export function addMouseEventListener(scene, camera, modelSelect) {
    window.addEventListener('click', (event) => onMouseClick(event, scene, camera, modelSelect));
}

export function checkCameraCollision(scene, camera) {
    const terrain = scene.getObjectByName('terrain'); // Get the terrain object by name

    // Check if the terrain exists before proceeding
    if (!terrain) {
        console.warn("Terrain not found in the scene for camera collision detection.");
        return;
    }

    raycaster.set(camera.position, downDirection);
    const intersects = raycaster.intersectObject(terrain);

    if (intersects.length > 0) {
        const terrainHeight = intersects[0].point.y;

        camera.position.y = terrainHeight + cameraMinHeightAboveTerrain;
    }
}

