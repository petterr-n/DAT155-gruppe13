import { loadModel } from './modelLoader.js'; // Import model loader
import * as THREE from 'three';

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

export function onMouseClick(event, scene, camera, modelSelect) {
    // Normalize mouse position (-1 to 1)
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Update raycaster with mouse coordinates and camera
    raycaster.setFromCamera(mouse, camera);

    // Check for intersections with the terrain
    const intersects = raycaster.intersectObject(scene.getObjectByName('terrain'));

    if (intersects.length > 0) {
        // Get the intersection point where the ray hits the terrain
        const intersection = intersects[0];
        const point = intersection.point;

        const x = point.x;
        const z = point.z;
        const selectedModel = modelSelect.value;

        // Load and place the model based on the intersection coordinates
        loadModel(selectedModel, scene, x, z);
    }
}

// Add event listener for mouse clicks
export function addMouseEventListener(scene, camera, modelSelect) {
    window.addEventListener('click', (event) => onMouseClick(event, scene, camera, modelSelect));
}
