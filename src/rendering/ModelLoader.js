import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import {startingAssets} from '../Assets.js';

const loader = new GLTFLoader();

let mixers = [];


// Update animations in the render loop
export function updateAnimations(delta) {
    mixers.forEach((mixer) => {
        mixer.update(delta);
    });
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