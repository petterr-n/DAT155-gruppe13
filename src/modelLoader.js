import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
//import { getHeightAt } from './terrain.js';
import { assets } from './assets.js';

const loader = new GLTFLoader();

export function loadModel(modelName, scene, x, z) {
    const asset = assets[modelName];
    if (!asset) {
        console.error(`Model ${modelName} not found in assets.`);
        return;
    }

    loader.load(asset.path, (gltf) => {
        const model = gltf.scene;

        // Get the height at the specified x, z position on the terrain
        const y = getHeightAt(x, z, scene);
        model.position.set(x, y, z);

        // Set model scale
        const scale = asset.scale;
        model.scale.set(scale, scale, scale);

        console.log(`Placed model: ${modelName}, with scale: ${scale}`);
        scene.add(model);
    });
}

// Get the height at a specific position on the terrain
function getHeightAt(x, z, scene) {
    const terrain = scene.getObjectByName('terrain'); // Get terrain object by name

    if (!terrain) {
        console.error("Terrain not found in the scene!");
        return 0; // Return default height if terrain is missing
    }

    const position = terrain.geometry.attributes.position;
    const size = Math.sqrt(position.count); // Assuming square terrain geometry

    // Terrain scaling
    const terrainWidth = terrain.geometry.parameters.width; // Actual width of the terrain
    const terrainHeight = terrain.geometry.parameters.height; // Actual height of the terrain

    // Convert world (x, z) coordinates to grid (gridX, gridZ) coordinates
    const gridX = Math.floor((x + terrainWidth / 2) / terrainWidth * (size - 1));
    const gridZ = Math.floor((z + terrainHeight / 2) / terrainHeight * (size - 1));

    // Ensure the indices are within bounds
    const clampedGridX = Math.max(0, Math.min(size - 1, gridX));
    const clampedGridZ = Math.max(0, Math.min(size - 1, gridZ));

    // Compute index in the position attribute array
    const index = clampedGridZ * size + clampedGridX;
    return position.getY(index); // Get the height at this grid position
}
