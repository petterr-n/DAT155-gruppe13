import * as THREE from 'three';
import {getHeightAt} from "./ModelLoader";

let grassObjects = [];
let grassModel = null;

// Global billboard setup (geometry and material)
const billboardGeometry = new THREE.PlaneGeometry(2, 2);
const grassTexture = new THREE.TextureLoader().load('assets/images/grass.png');
grassTexture.wrapS = THREE.RepeatWrapping;
grassTexture.wrapT = THREE.RepeatWrapping;
grassTexture.repeat.set(2, 2);
const billboardMaterial = new THREE.MeshBasicMaterial({
    map: grassTexture,
    transparent: true,
    side: THREE.DoubleSide,
});

// Function to generate grass field
export async function createGrassField(scene, camera, terrain) {
    if (!grassModel) {
        grassModel = await loadGrassModel(); // Load 3D grass model
    }

    if (!terrain) {
        console.error("Terrain not found.");
        return;
    }

    console.log("Creating grass field...");

    const terrainGeometry = terrain.geometry;
    const gridSpacing = 15;
    const randomRange = gridSpacing * 0.9;

    const frustum = new THREE.Frustum();
    const matrix = new THREE.Matrix4().multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
    frustum.setFromProjectionMatrix(matrix);

    // Loop through potential grass positions
    for (let x = -terrainGeometry.parameters.width / 2; x < terrainGeometry.parameters.width / 2; x += gridSpacing) {
        for (let z = -terrainGeometry.parameters.height / 2; z < terrainGeometry.parameters.height / 2; z += gridSpacing) {

            const offsetX = (Math.random() - 0.5) * randomRange;
            const offsetZ = (Math.random() - 0.5) * randomRange;
            const posX = x + offsetX;
            const posZ = z + offsetZ;

            const y = getHeightAt(posX, posZ, terrain);
            if (y > 1) {
                continue;
            }

            const position = new THREE.Vector3(posX, y, posZ);

            // Check if position is in the camera's frustum
            if (frustum.containsPoint(position)) {
                const billboard = new THREE.Mesh(billboardGeometry, billboardMaterial);
                billboard.position.set(posX, y, posZ);
                billboard.lookAt(camera.position);
                scene.add(billboard);

                grassObjects.push({
                    type: 'billboard',
                    object: billboard,
                });
            }
        }
    }
}

// Function to update grass visibility dynamically
export function updateGrassVisibility(camera, scene) {
    for (let i = 0; i < grassObjects.length; i++) {
        const grassObject = grassObjects[i];
        const distanceToCamera = camera.position.distanceTo(grassObject.object.position);

        // If close, switch to 3D grass
        if (distanceToCamera < 120) {
            if (grassObject.type !== '3d' && grassModel) {
                const highQualityGrass = grassModel.clone();
                highQualityGrass.position.copy(grassObject.object.position);
                scene.add(highQualityGrass);
                scene.remove(grassObject.object);
                grassObjects[i] = { type: '3d', object: highQualityGrass };
            }
        } else {
            if (grassObject.type === '3d') {
                const billboard = new THREE.Mesh(billboardGeometry, billboardMaterial);
                billboard.position.copy(grassObject.object.position);
                scene.add(billboard);
                scene.remove(grassObject.object);
                grassObjects[i] = { type: 'billboard', object: billboard };
            }
        }
    }
}
