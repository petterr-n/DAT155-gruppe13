import * as THREE from 'three';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Frustum, Matrix4, Vector3 } from 'three';
import {getHeightAt} from "./modelLoader";

let grassObjects = []; // Stores the grass objects (billboards and 3D models)
let grassModel = null; // Cached 3D grass model

// Load the GLB model of the grass (3D model)
async function loadGrassModel() {
    const loader = new GLTFLoader();
    return new Promise((resolve, reject) => {
        loader.load('assets/models/grass_patches.glb', (gltf) => {
            const model = gltf.scene;
            model.scale.set(2, 1, 2); // Adjust scale of the 3D model
            resolve(model); // Assuming the model's scene is what you need
        }, undefined, reject);
    });
}

// Global billboard setup (geometry and material)
const billboardGeometry = new THREE.PlaneGeometry(2, 2); // Adjust dimensions
const grassTexture = new THREE.TextureLoader().load('assets/images/grass.png');
grassTexture.wrapS = THREE.RepeatWrapping; // Enable horizontal tiling
grassTexture.wrapT = THREE.RepeatWrapping; // Enable vertical tiling
grassTexture.repeat.set(2, 2);  // Use grass.png
const billboardMaterial = new THREE.MeshBasicMaterial({
    map: grassTexture,
    transparent: true,
    side: THREE.DoubleSide, // Visible from both sides
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

    // Calculate camera frustum
    const frustum = new Frustum();
    const matrix = new Matrix4().multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
    frustum.setFromProjectionMatrix(matrix);

    // Loop through potential grass positions
    for (let x = -terrainGeometry.parameters.width / 2; x < terrainGeometry.parameters.width / 2; x += gridSpacing) {
        for (let z = -terrainGeometry.parameters.height / 2; z < terrainGeometry.parameters.height / 2; z += gridSpacing) {

            const offsetX = (Math.random() - 0.5) * randomRange;
            const offsetZ = (Math.random() - 0.5) * randomRange;
            const posX = x + offsetX;
            const posZ = z + offsetZ;

            const y = getHeightAt(posX, posZ, terrain); // Terrain height
            if (y > 1) { // Avoid placing grass below or above certain height
                continue;
            }

            const position = new Vector3(posX, y, posZ);

            // Check if position is in the camera's frustum
            if (frustum.containsPoint(position)) {
                // Add a billboard initially
                const billboard = new THREE.Mesh(billboardGeometry, billboardMaterial);
                billboard.position.set(posX, y, posZ);
                billboard.lookAt(camera.position); // Always face the camera
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
            if (grassObject.type !== '3d' && grassModel) { // If not already 3D
                const highQualityGrass = grassModel.clone();
                highQualityGrass.position.copy(grassObject.object.position); // Maintain position
                scene.add(highQualityGrass);
                scene.remove(grassObject.object); // Remove billboard
                grassObjects[i] = { type: '3d', object: highQualityGrass }; // Update to 3D
            }
        } else {
            // If far, switch back to billboard
            if (grassObject.type === '3d') {
                const billboard = new THREE.Mesh(billboardGeometry, billboardMaterial);
                billboard.position.copy(grassObject.object.position); // Maintain position
                scene.add(billboard);
                scene.remove(grassObject.object); // Remove 3D model
                grassObjects[i] = { type: 'billboard', object: billboard }; // Update to billboard
            }
        }
    }
}
