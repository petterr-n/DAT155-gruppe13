import { loadModel } from './modelLoader.js'; // Import model loader
import * as THREE from 'three';

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

export function onMouseClick(event, scene, camera, modelSelect) {
    // Normalize mouse position (-1 to 1)
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObject(scene.getObjectByName('terrain'));

    if (intersects.length > 0) {
        // Get the intersection point where the ray hits the terrain
        const intersection = intersects[0];
        const point = intersection.point;

        const x = point.x;
        const z = point.z;
        const selectedModel = modelSelect.value;

        loadModel(selectedModel, scene, x, z);
    }
}

export function addMouseEventListener(scene, camera, modelSelect) {
    window.addEventListener('click', (event) => onMouseClick(event, scene, camera, modelSelect));
}
