import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { getHeightAt } from './terrain.js';
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
