import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import {assets, startingAssets} from '../Assets.js';

const loader = new GLTFLoader();

let mixers = [];

export function loadModel(modelName, scene, x, z) {
    const asset = assets[modelName];
    if (!asset) return;

    loader.load(asset.path, (gltf) => {
        const model = gltf.scene;

        if (asset.type === 'animated' && gltf.animations && gltf.animations.length > 0) {
            const mixer = new THREE.AnimationMixer(model);
            gltf.animations.forEach((clip) => {
                mixer.clipAction(clip).play();
            });

            mixers.push(mixer);
        }

        model.traverse((child) => {
            if (child.isMesh) {
                child.geometry.center();
            }
        });

        const y = getHeightAt(x, z, scene);
        const box = new THREE.Box3().setFromObject(model);
        const heightOffset = box.min.y;
        const scale = asset.scale;
        const scaledHeightOffset = heightOffset * scale;

        // Debugging
        console.log(`Model: ${modelName}`);
        console.log(`Scale: ${scale}`);
        console.log(`Height Offset (scaled): ${scaledHeightOffset}`);
        console.log(`Original height offset: ${heightOffset}`);

        model.position.set(x, y - scaledHeightOffset, z);
        model.scale.set(scale, scale, scale);

        // Log the final model position for debugging
        console.log(`Position (adjusted): x = ${x}, y = ${y - scaledHeightOffset}, z = ${z}`);

        scene.add(model);
    });
}

// Update animations in the render loop
export function updateAnimations(delta) {
    mixers.forEach((mixer) => {
        mixer.update(delta);
    });
}

export function getHeightAt(x, z, scene) {
    const terrain = scene.getObjectByName('terrain');

    if (!terrain) {
        console.error("Terrain not found in the scene!");
        return 0;
    }

    const position = terrain.geometry.attributes.position;
    const size = Math.sqrt(position.count);

    const terrainWidth = terrain.geometry.parameters.width;
    const terrainHeight = terrain.geometry.parameters.height;

    const gridX = Math.floor((x + terrainWidth / 2) / terrainWidth * (size - 1));
    const gridZ = Math.floor((z + terrainHeight / 2) / terrainHeight * (size - 1));

    const clampedGridX = Math.max(0, Math.min(size - 1, gridX));
    const clampedGridZ = Math.max(0, Math.min(size - 1, gridZ));

    const index = clampedGridZ * size + clampedGridX;
    return position.getY(index);
}


export async function loadStartingAssets(scene) {
    const promises = Object.keys(startingAssets).map(key => {
        const asset = startingAssets[key];

        return new Promise((resolve, reject) => {
            loader.load(asset.path, (gltf) => {
                let object;

                if (asset.positions && asset.positions.length > 0) {
                    asset.positions.forEach(pos => {
                        object = gltf.scene.clone();
                        object.scale.set(asset.scale, asset.scale, asset.scale);
                        object.position.set(pos.x, pos.y, pos.z);

                        if (gltf.animations && gltf.animations.length > 0) {
                            const mixer = new THREE.AnimationMixer(object);
                            gltf.animations.forEach((clip) => {
                                mixer.clipAction(clip).play();
                            });
                            object.userData.mixer = mixer;
                            mixers.push(mixer);
                        }

                        if (asset.target) {
                            object.lookAt(asset.target);
                        }

                        scene.add(object);
                        console.log(`${key} loaded at position`, pos);
                    });
                } else {
                    object = gltf.scene;
                    object.scale.set(asset.scale, asset.scale, asset.scale);
                    object.position.set(asset.position.x, asset.position.y, asset.position.z);

                    if (gltf.animations && gltf.animations.length > 0) {
                        const mixer = new THREE.AnimationMixer(object);
                        gltf.animations.forEach((clip) => {
                            mixer.clipAction(clip).play();
                        });
                        object.userData.mixer = mixer;
                        mixers.push(mixer);
                    }

                    if (asset.target) {
                        object.lookAt(asset.target);
                    }

                    scene.add(object);
                    console.log(`${key} loaded at position`, asset.position);
                }

                resolve(object);
            }, undefined, (error) => {
                console.error('Error loading asset', key, error);
                reject(error);
            });
        });
    });

    return Promise.all(promises);
}