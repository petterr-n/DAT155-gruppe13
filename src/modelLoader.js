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
export function loadModel(modelName, scene) {
    if (!models[modelName]) return;

    loader.load(models[modelName], (gltf) => {
        const model = gltf.scene;

        // Set the position of the model on the terrain (example coordinates)
        const x = 10; // Modify the x, z coordinates as needed
        const z = 10;
        const y = getHeightAt(x, z, scene); // Get the height at this x, z position on the terrain

        model.position.set(x, y, z);
        scene.add(model);
    });
}
