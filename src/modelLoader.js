import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
//import { getHeightAt } from './terrain.js';
import { assets } from './assets.js';

const loader = new GLTFLoader();

let mixers = [];

export function loadModel(modelName, scene, x, z) {
    const asset = assets[modelName];
    if (!asset) return;

    loader.load(asset.path, (gltf) => {
        const model = gltf.scene;

        // Check if the model is animated and set up the animation mixer if it is
        if (asset.type === 'animated' && gltf.animations && gltf.animations.length > 0) {
            const mixer = new THREE.AnimationMixer(model);
            gltf.animations.forEach((clip) => {
                mixer.clipAction(clip).play(); // Play all animations
            });

            // Store the mixer for updating during animation
            mixers.push(mixer);
        }

        // Ensure the model is centered (if necessary)
        model.traverse((child) => {
            if (child.isMesh) {
                child.geometry.center(); // Optional: Only if the model isn't centered
            }
        });

        // Get the height at the specific x, z coordinates on the terrain
        const y = getHeightAt(x, z, scene);

        // Compute the model's bounding box to get the distance from the center to the bottom
        const box = new THREE.Box3().setFromObject(model);
        const heightOffset = box.min.y; // The distance from the center to the bottom

        // Adjust for scaling: The bounding box is scaled, so we apply the scale to the offset
        const scale = asset.scale;
        const scaledHeightOffset = heightOffset * scale;

        // Debugging: Log information to check the results
        console.log(`Model: ${modelName}`);
        console.log(`Scale: ${scale}`);
        console.log(`Height Offset (scaled): ${scaledHeightOffset}`);
        console.log(`Original height offset: ${heightOffset}`);

        // Adjust the model's position so its bottom is at terrain height
        model.position.set(x, y - scaledHeightOffset, z); // Subtract the scaled offset to align bottom with terrain

        // Apply scale to the model
        model.scale.set(scale, scale, scale);

        // Log the final model position for debugging
        console.log(`Position (adjusted): x = ${x}, y = ${y - scaledHeightOffset}, z = ${z}`);

        // Add the model to the scene
        scene.add(model);
    });
}

// Update animations in the render loop
export function updateAnimations(delta) {
    mixers.forEach((mixer) => {
        mixer.update(delta); // Update each mixer with the delta time
    });
}


// Get the height at a specific position on the terrain
export function getHeightAt(x, z, scene) {
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
