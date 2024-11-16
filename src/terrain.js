import * as THREE from 'three';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import {getHeightAt} from "./modelLoader";

async function loadShader(url) {
    const response = await fetch(url);
    return await response.text();
}

async function loadGrassModel() {
    const loader = new GLTFLoader();
    return new Promise((resolve, reject) => {
        loader.load('models/grass.glb', (gltf) => {
            resolve(gltf.scene);
        }, undefined, reject);
    });
}

export async function createTerrain(scene) {
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

    const heightmap = loader.load('images/heightmap.png', async (texture) => {
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

        // Generate grass after the terrain is loaded
        await addGrassFields(scene, width, height, heights);
    });
}
async function addGrassFields(scene, width, height) {
    const grassModel = await loadGrassModel(); // Load your 3D grass model

    // Create a BoxGeometry (or replace with actual grass model) for the grass
    const grassGeometry = new THREE.BoxGeometry(1, 1, 1);  // Example box geometry for grass
    const grassMaterial = new THREE.MeshBasicMaterial({ color: 0x00FF00, side: THREE.DoubleSide });

    // Create an InstancedMesh to hold all the grass instances
    const numInstances = Math.floor((width * height) / 100); // Adjust the number of instances based on density
    const instancedGrass = new THREE.InstancedMesh(grassGeometry, grassMaterial, numInstances);

    const gridSpacing = 10;  // The distance between each grass instance, adjust for density
    const maxHeight = 2;

    let instanceCount = 0;

    // Create a grid to place grass
    for (let x = -width / 2; x < width / 2; x += gridSpacing) {
        for (let z = -height / 2; z < height / 2; z += gridSpacing) {
            // Use getHeightAt to sample the height at (x, z) on the terrain
            let y = getHeightAt(x, z, scene);

            // Ensure that the grass is placed below the height limit (maxHeight)
            if (y > maxHeight) {
                y = maxHeight;  // Clamp the height to maxHeight
            }

            // Create a transformation matrix for each grass instance
            const matrix = new THREE.Matrix4();
            matrix.makeTranslation(x, y, z); // Position the grass at the correct (x, y, z)

            // Set the matrix for the current instance
            instancedGrass.setMatrixAt(instanceCount, matrix);
            instanceCount++; // Increment instance count for the next grass piece
        }
    }

    scene.add(instancedGrass); // Add the instanced grass mesh to the scene
}

