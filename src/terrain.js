import * as THREE from 'three';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { getHeightAt } from "./modelLoader";

async function loadShader(url) {
    const response = await fetch(url);
    return await response.text();
}

export async function createTerrain(scene) {
    return new Promise((resolve, reject) => {
        const loader = new THREE.TextureLoader();

        // Load dirt and mountain textures
        const grassTexture = loader.load('images/dirt2.png');
        grassTexture.wrapS = THREE.RepeatWrapping;
        grassTexture.wrapT = THREE.RepeatWrapping;
        grassTexture.repeat.set(30, 30);

        const rockTexture = loader.load('images/mountian.png');
        rockTexture.wrapS = THREE.RepeatWrapping;
        rockTexture.wrapT = THREE.RepeatWrapping;
        rockTexture.repeat.set(100, 100);

        loader.load('images/heightmap.png', async (texture) => {
            try {
                const width = 500;
                const height = 500;
                const peak = 150;

                const geometry = new THREE.PlaneGeometry(width, height, width - 1, height - 1);
                geometry.rotateX(-Math.PI / 2);

                // Adjust heights based on heightmap
                const data = texture.image;
                texture.minFilter = THREE.LinearFilter;
                const ctx = document.createElement('canvas').getContext('2d');
                ctx.canvas.width = width;
                ctx.canvas.height = height;
                ctx.drawImage(data, 0, 0, width, height);
                const pixels = ctx.getImageData(0, 0, width, height).data;

                const heights = [];

                for (let i = 0; i < geometry.attributes.position.count; i++) {
                    const grayValue = pixels[i * 4] / 255;
                    const heightValue = grayValue * peak;
                    geometry.attributes.position.setY(i, heightValue);
                    heights.push(heightValue);
                }

                geometry.computeVertexNormals();

                // Load shaders
                const vertexShader = await loadShader('shaders/vertexShader.glsl');
                const fragmentShader = await loadShader('shaders/fragmentShader.glsl');

                const material = new THREE.ShaderMaterial({
                    uniforms: {
                        grassTexture: { type: 't', value: grassTexture },
                        rockTexture: { type: 't', value: rockTexture },
                        transitionHeight: { value: 2.0 }
                    },
                    vertexShader,
                    fragmentShader
                });

                const terrain = new THREE.Mesh(geometry, material);
                terrain.name = 'terrain';
                scene.add(terrain);

                // Resolve the promise with the terrain object
                resolve(terrain);
            } catch (error) {
                reject(error); // Reject if there is any error in loading or processing
            }
        }, undefined, (error) => {
            reject(error); // Reject if there's an error loading the heightmap texture
        });
    });
}
