import * as THREE from 'three';

const raycaster = new THREE.Raycaster();
const downDirection = new THREE.Vector3(0, -1, 0);

const cameraMinHeightAboveTerrain = 2;

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

