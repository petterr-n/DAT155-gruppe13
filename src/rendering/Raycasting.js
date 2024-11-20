import { loadModel } from './ModelLoader';
import * as THREE from 'three';

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const downDirection = new THREE.Vector3(0, -1, 0);

const cameraMinHeightAboveTerrain = 2;

export function onMouseClick(event, scene, camera, modelSelect) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const terrain = scene.getObjectByName('terrain');
    if (!terrain) {
        console.error("Terrain not found in the scene!");
        return;
    }

    const intersects = raycaster.intersectObject(terrain);

    if (intersects.length > 0) {
        const intersection = intersects[0];
        const point = intersection.point;

        const selectedModel = modelSelect.value;
        if (selectedModel && selectedModel !== 'none') {
            loadModel(selectedModel, scene, point.x, point.z);
        }
    }
}

// Function to add mouse click event listener
export function addMouseEventListener(scene, camera, modelSelect) {
    window.addEventListener('click', (event) => onMouseClick(event, scene, camera, modelSelect));
}

export function checkCameraCollision(scene, camera) {
    const terrain = scene.getObjectByName('terrain');

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

