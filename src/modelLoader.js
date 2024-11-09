// modelLoader.js
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { getHeightAt } from './terrain.js';  // Importing getHeightAt from terrain.js (if it's in another file)

const loader = new GLTFLoader();
const models = {
    model1: 'models/tree.glb',
    model2: 'path/to/model2.glb',
    model3: 'path/to/model3.glb',
};

// Function to load and place the selected model on the terrain
export function loadModel(modelName, scene, x, z, scale = 0.02) {
    if (!models[modelName]) return; // Check if model exists

    loader.load(models[modelName], (gltf) => {
        const model = gltf.scene;

        // Get the height at this x, z position on the terrain
        const y = getHeightAt(x, z, scene);

        // Set model's position to the intersection point's coordinates
        model.position.set(x, y, z);

        model.scale.set(scale, scale, scale);

        scene.add(model); // Add model to the scene
    });
}
